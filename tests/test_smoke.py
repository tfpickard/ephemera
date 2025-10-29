#!/usr/bin/env python
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

os.environ.setdefault("FLASK_ENV", "testing")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import create_app  # noqa: E402


def test_state_endpoint() -> None:
    app = create_app()
    client = app.test_client()
    response = client.get("/api/state")
    assert response.status_code == 200
    data: dict[str, Any] = response.get_json()  # type: ignore[assignment]
    assert data is not None
    assert {"pending_question", "last_reflection", "memories_count", "state"}.issubset(data.keys())
    assert isinstance(data["state"], dict)
