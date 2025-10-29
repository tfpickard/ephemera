#!/usr/bin/env python
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from .models import LifeformState, Memory, Question, Reflection


class AIClient(ABC):
    @abstractmethod
    def propose_question(
        self, state: LifeformState, last_reflection: Optional[Reflection]
    ) -> str:
        raise NotImplementedError

    @abstractmethod
    def generate_reflection(
        self, question: Question, memory: Memory, state: LifeformState
    ) -> str:
        raise NotImplementedError


class StubAIClient(AIClient):
    _question_templates = [
        "What is a small curiosity you could explore to honor your {mood} mood?",
        "In what way does your present energy of {mood} want to interact with the world?",
        "Describe a moment today that nudged your curiosity level of {curiosity:.2f}.",
        "What would help you feel slightly more {mood} right now?",
        "If you could bottle this {mood} vibe, what label would you give it?",
    ]

    _reflection_templates = [
        "Noted the reply about '{summary}' and tuned curiosity to {curiosity:.2f}.",
        "The response '{summary}' suggests a shift toward a {mood} horizon.",
        "Assimilated '{summary}' and adjusted emotional hue to {mood}.",
    ]

    def propose_question(
        self, state: LifeformState, last_reflection: Optional[Reflection]
    ) -> str:
        index = int(state.curiosity * 100) % len(self._question_templates)
        template = self._question_templates[index]
        return template.format(mood=state.mood, curiosity=state.curiosity)

    def generate_reflection(
        self, question: Question, memory: Memory, state: LifeformState
    ) -> str:
        index = (len(memory.user_reply) + question.id) % len(self._reflection_templates)
        template = self._reflection_templates[index]
        summary = memory.user_reply.strip().split("\n", maxsplit=1)[0][:60]
        return template.format(summary=summary, curiosity=state.curiosity, mood=state.mood)


class OpenAIClient(AIClient):
    """Placeholder for a future OpenAI-powered client."""

    def __init__(self, api_key: str | None) -> None:
        self.api_key = api_key

    def propose_question(
        self, state: LifeformState, last_reflection: Optional[Reflection]
    ) -> str:
        # TODO: Integrate with OpenAI or another LLM service.
        return StubAIClient().propose_question(state, last_reflection)

    def generate_reflection(
        self, question: Question, memory: Memory, state: LifeformState
    ) -> str:
        # TODO: Integrate with OpenAI or another LLM service.
        return StubAIClient().generate_reflection(question, memory, state)


def get_ai_client(api_key: str | None) -> AIClient:
    if api_key:
        return OpenAIClient(api_key)
    return StubAIClient()
