#!/usr/bin/env python
from __future__ import annotations

import json
import logging
from logging import Logger
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Any

from rich.console import Console
from rich.logging import RichHandler

from .settings import Settings


class JSONLinesFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "time": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
        }
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        if record.__dict__:
            extras = {
                key: value
                for key, value in record.__dict__.items()
                if key not in logging.LogRecord.__dict__
            }
            if extras:
                payload.update(extras)
        return json.dumps(payload, default=str)


def setup_logging(settings: Settings) -> Logger:
    level = getattr(logging, settings.logging_level.upper(), logging.INFO)
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    root_logger.handlers.clear()

    if settings.logging_console_rich:
        console = Console()
        console_handler = RichHandler(console=console, rich_tracebacks=True, markup=True)
        console_handler.setLevel(level)
        root_logger.addHandler(console_handler)

    file_path = Path(settings.logging_file_path)
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_handler = RotatingFileHandler(file_path, maxBytes=1_000_000, backupCount=5)
    file_handler.setLevel(level)
    file_handler.setFormatter(JSONLinesFormatter())
    root_logger.addHandler(file_handler)

    return root_logger
