#!/usr/bin/env python
from __future__ import annotations

from flask import Flask
from flask_migrate import Migrate

from .ai import get_ai_client
from .db import db, init_db
from .logging import setup_logging
from .metabolism import generate_question, get_pending_question
from .models import LifeformState
from .routes import create_api_blueprint
from .scheduler import start_scheduler
from .settings import settings

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
