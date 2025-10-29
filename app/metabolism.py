#!/usr/bin/env python
from __future__ import annotations

import logging
from datetime import datetime

from sqlalchemy import select

from .ai import AIClient
from .db import db
from .models import LifeformState, Memory, Question, Reflection

MOODS = ["curious", "playful", "thoughtful", "grounded", "radiant"]


def get_latest_reflection() -> Reflection | None:
    stmt = select(Reflection).order_by(Reflection.created_at.desc())
    return db.session.execute(stmt).scalars().first()


def get_pending_question() -> Question | None:
    stmt = select(Question).where(Question.status == "pending").order_by(Question.created_at.asc())
    return db.session.execute(stmt).scalars().first()


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(value, maximum))


def generate_question(logger: logging.Logger, ai_client: AIClient) -> Question:
    state = LifeformState.ensure()
    existing = get_pending_question()
    if existing:
        return existing

    last_reflection = get_latest_reflection()
    text = ai_client.propose_question(state, last_reflection)
    question = Question(text=text, status="pending")
    db.session.add(question)
    db.session.commit()
    logger.info("question.generated", extra={"question_id": question.id, "text": question.text})
    return question


def _update_state_from_reply(state: LifeformState, memory: Memory) -> None:
    content = memory.user_reply.strip().lower()
    length = len(content)
    delta = clamp((length - 120) / 800.0, -0.08, 0.08)
    updated_curiosity = clamp(state.curiosity + delta, 0.0, 1.0)

    mood_index = int(updated_curiosity * 10) % len(MOODS)
    if any(word in content for word in ["calm", "ground", "rest"]):
        mood_index = 3
    elif any(word in content for word in ["excite", "joy", "spark"]):
        mood_index = 1
    elif any(word in content for word in ["reflect", "ponder", "learn"]):
        mood_index = 2

    state.curiosity = updated_curiosity
    state.mood = MOODS[mood_index]
    state.last_reflected_at = datetime.utcnow()


def reflect_on_memory(
    logger: logging.Logger,
    ai_client: AIClient,
    question: Question,
    memory: Memory,
    state: LifeformState,
) -> Reflection:
    reflection_text = ai_client.generate_reflection(question, memory, state)
    reflection = Reflection(question_id=question.id, text=reflection_text)
    db.session.add(reflection)
    _update_state_from_reply(state, memory)
    db.session.commit()
    logger.info(
        "reflection.created",
        extra={
            "question_id": question.id,
            "reflection_id": reflection.id,
            "state_mood": state.mood,
            "state_curiosity": state.curiosity,
        },
    )
    return reflection


def ingest_reply(logger: logging.Logger, ai_client: AIClient, question_id: int, text: str) -> dict[str, object]:
    question = db.session.get(Question, question_id)
    if question is None or question.status != "pending":
        raise ValueError("Question not found or already answered")

    state = LifeformState.ensure()

    memory = Memory(question_id=question.id, user_reply=text)
    db.session.add(memory)
    question.status = "answered"
    db.session.commit()

    logger.info(
        "reply.ingested",
        extra={"question_id": question.id, "memory_id": memory.id, "length": len(text)},
    )

    reflection = reflect_on_memory(logger, ai_client, question, memory, state)

    pending = get_pending_question()
    if pending is None:
        pending = generate_question(logger, ai_client)

    return build_state_payload(state, pending, reflection)


def build_state_payload(
    state: LifeformState,
    pending_question: Question | None,
    last_reflection: Reflection | None,
) -> dict[str, object]:
    memories_count = db.session.scalar(select(db.func.count(Memory.id))) or 0
    return {
        "pending_question":
            {
                "id": pending_question.id,
                "text": pending_question.text,
            }
            if pending_question
            else None,
        "last_reflection":
            {
                "id": last_reflection.id,
                "text": last_reflection.text,
            }
            if last_reflection
            else None,
        "memories_count": int(memories_count),
        "state": {
            "mood": state.mood,
            "curiosity": state.curiosity,
        },
    }
