#!/usr/bin/env python
from __future__ import annotations

import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from flask import Flask

from .ai import AIClient
from .metabolism import generate_question


def start_scheduler(app: Flask, logger: logging.Logger, ai_client: AIClient, interval_seconds: int) -> BackgroundScheduler:
    scheduler = BackgroundScheduler()

    def scheduled_job() -> None:
        with app.app_context():
            logger.info("scheduler.tick")
            generate_question(logger, ai_client)

    scheduler.add_job(
        scheduled_job,
        trigger=IntervalTrigger(seconds=interval_seconds),
        id="lifeform-metabolism",
        max_instances=1,
        replace_existing=True,
    )
    scheduler.start()

    @app.teardown_appcontext
    def shutdown_scheduler(_: object) -> None:
        if scheduler.running:
            scheduler.shutdown(wait=False)

    return scheduler
