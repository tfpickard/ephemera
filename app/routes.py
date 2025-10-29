#!/usr/bin/env python
from __future__ import annotations

import logging
from typing import Any

from flask import Blueprint, jsonify, request

from .ai import AIClient
from .metabolism import (
    build_state_payload,
    generate_question,
    get_latest_reflection,
    get_pending_question,
    ingest_reply,
)
from .models import LifeformState


def create_api_blueprint(logger: logging.Logger, ai_client: AIClient) -> Blueprint:
    blueprint = Blueprint("api", __name__)

    @blueprint.get("/api/state")
    def read_state():
        state = LifeformState.ensure()
        pending = get_pending_question()
        if pending is None:
            pending = generate_question(logger, ai_client)
        payload = build_state_payload(state, pending, get_latest_reflection())
        return jsonify(payload)

    @blueprint.post("/api/reply")
    def post_reply():
        data: dict[str, Any] = request.get_json(force=True, silent=False) or {}
        question_id = data.get("question_id")
        text = (data.get("text") or "").strip()
        if not isinstance(question_id, int):
            return jsonify({"error": "question_id must be provided"}), 400
        if not text:
            return jsonify({"error": "text must be provided"}), 400
        try:
            payload = ingest_reply(logger, ai_client, question_id, text)
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400
        return jsonify(payload)

    @blueprint.post("/api/admin/seed")
    def seed_state():
        state = LifeformState.ensure()
        question = generate_question(logger, ai_client)
        payload = build_state_payload(state, question, get_latest_reflection())
        return jsonify(payload), 201

    @blueprint.post("/hooks/twilio/sms")
    def twilio_sms():
        payload = request.form.to_dict()
        logger.info("twilio.sms", extra={"payload": payload})
        # TODO: Map SMS replies into the lifeform memory loop.
        return ("", 204)

    @blueprint.post("/hooks/twilio/status")
    def twilio_status():
        payload = request.form.to_dict()
        logger.info("twilio.status", extra={"payload": payload})
        # TODO: Handle delivery events from Twilio.
        return ("", 204)

    return blueprint
