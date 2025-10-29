#!/usr/bin/env python
from __future__ import annotations

from app import create_app
from app.metabolism import generate_question, get_pending_question
from app.models import LifeformState
from app.settings import settings


def main() -> None:
    app = create_app()
    with app.app_context():
        LifeformState.ensure()
        if get_pending_question() is None:
            logger = app.logger
            ai_client = app.config.get("AI_CLIENT")
            if ai_client is None:
                from app.ai import get_ai_client

                ai_client = get_ai_client(settings.openai_api_key)
            generate_question(logger, ai_client)
    print("Seed complete.")


if __name__ == "__main__":
    main()
