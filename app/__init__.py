#!/usr/bin/env python
from __future__ import annotations

from pathlib import Path

from flask import Flask
from flask_migrate import Migrate
from sqlalchemy.engine import make_url

from .ai import get_ai_client
from .db import db, init_db
from .logging import setup_logging
from .metabolism import generate_question, get_pending_question
from .models import LifeformState
from .routes import create_api_blueprint
from .scheduler import start_scheduler
from .settings import settings


def _ensure_sqlite_directory(app: Flask, database_url: str) -> None:
    """Create the parent directory for a SQLite database file if needed."""

    try:
        url = make_url(database_url)
    except Exception:  # pragma: no cover - invalid URLs fall back to SQLAlchemy errors
        return

    if url.drivername != "sqlite":
        return

    database = url.database
    if not database or database == ":memory:":
        return

    db_path = Path(database)
    if not db_path.is_absolute():
        instance_path = Path(app.instance_path)
        instance_path.mkdir(parents=True, exist_ok=True)
        db_path = instance_path / db_path

    db_path.parent.mkdir(parents=True, exist_ok=True)


migrate = Migrate()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.update(
        SQLALCHEMY_DATABASE_URI=settings.database_url,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SECRET_KEY=settings.secret_key,
        PORT=settings.port,
    )

    if settings.environment.lower() == "testing":
        app.config["TESTING"] = True

    logger = setup_logging(settings)
    app.logger.handlers = logger.handlers
    app.logger.setLevel(logger.level)

    _ensure_sqlite_directory(app, settings.database_url)
    init_db(app)
    migrate.init_app(app, db)

    ai_client = get_ai_client(settings.openai_api_key)
    app.config["AI_CLIENT"] = ai_client
    api_bp = create_api_blueprint(logger, ai_client)
    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()
        LifeformState.ensure()
        if get_pending_question() is None:
            generate_question(logger, ai_client)

    if settings.environment.lower() != "testing":
        start_scheduler(app, logger, ai_client, settings.scheduler_interval_seconds)

    @app.route("/health")
    def healthcheck() -> tuple[str, int]:
        return ("ok", 200)

    return app
