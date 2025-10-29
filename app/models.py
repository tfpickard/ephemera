#!/usr/bin/env python
from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import CheckConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import db


class Question(db.Model):
    __tablename__ = "questions"
    __table_args__ = (
        Index("ix_questions_status", "status"),
        Index("ix_questions_created_at", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    text: Mapped[str] = mapped_column(db.Text, nullable=False)
    status: Mapped[str] = mapped_column(db.String(16), default="pending", nullable=False)
    created_at: Mapped[datetime] = mapped_column(db.DateTime, default=datetime.utcnow, nullable=False)

    memories: Mapped[list["Memory"]] = relationship("Memory", back_populates="question")
    reflection: Mapped[Optional["Reflection"]] = relationship(
        "Reflection", back_populates="question", uselist=False
    )


class Memory(db.Model):
    __tablename__ = "memories"
    __table_args__ = (
        Index("ix_memories_question_id", "question_id"),
        Index("ix_memories_created_at", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    question_id: Mapped[int] = mapped_column(db.ForeignKey("questions.id"), nullable=False)
    user_reply: Mapped[str] = mapped_column(db.Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(db.DateTime, default=datetime.utcnow, nullable=False)

    question: Mapped[Question] = relationship("Question", back_populates="memories")


class Reflection(db.Model):
    __tablename__ = "reflections"
    __table_args__ = (
        Index("ix_reflections_question_id", "question_id"),
        Index("ix_reflections_created_at", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    question_id: Mapped[int] = mapped_column(db.ForeignKey("questions.id"), nullable=False)
    text: Mapped[str] = mapped_column(db.Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(db.DateTime, default=datetime.utcnow, nullable=False)

    question: Mapped[Question] = relationship("Question", back_populates="reflection")


class LifeformState(db.Model):
    __tablename__ = "lifeform_state"
    __table_args__ = (
        CheckConstraint("curiosity >= 0.0 AND curiosity <= 1.0", name="ck_curiosity_range"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    mood: Mapped[str] = mapped_column(db.String(32), default="curious", nullable=False)
    curiosity: Mapped[float] = mapped_column(db.Float, default=0.5, nullable=False)
    last_reflected_at: Mapped[Optional[datetime]] = mapped_column(db.DateTime, nullable=True)

    @classmethod
    def get_singleton(cls) -> Optional["LifeformState"]:
        return db.session.get(cls, 1)

    @classmethod
    def ensure(cls) -> "LifeformState":
        instance = cls.get_singleton()
        if instance is None:
            instance = cls(id=1)
            db.session.add(instance)
            db.session.commit()
        return instance
