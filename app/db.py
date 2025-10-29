#!/usr/bin/env python
from __future__ import annotations

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


def init_db(app) -> None:
    db.init_app(app)
