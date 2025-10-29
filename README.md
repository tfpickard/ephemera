# AI Lifeform

A production-lean full-stack playground where a synthetic lifeform cycles through curiosity: it generates questions, stores your replies as memories, reflects, and continuously updates its emotional state.

## Features

- Flask 3 API with SQLite, SQLAlchemy, Flask-Migrate, Rich logging, and APScheduler.
- Deterministic `StubAIClient` metabolism loop with question generation, memory storage, and reflective state updates.
- Next.js 14 frontend styled with Tailwind and shadcn/ui components.
- Docker Compose orchestration with hot reload (`api` on port 8101, `web` on port 3101).
- Twilio webhook placeholders for SMS intake and delivery status logging.

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 20+
- (Optional) Docker + Docker Compose v2

### Local Development

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
FLASK_APP=wsgi.py flask run --host=0.0.0.0 --port=8101
```

In a separate terminal for the frontend:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev -- --port 3101
```

Visit `http://localhost:3101` to interact with the lifeform. The frontend calls the backend at `http://localhost:8101` by default.

### Docker Compose

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
docker compose up --build
```

- API available at `http://localhost:8101`
- Frontend available at `http://localhost:3101`

Stop containers with `docker compose down`.

## Makefile Targets

- `make venv` – create local virtual environment
- `make install` – install Python dependencies
- `make run-api` – start Flask dev server on 8101
- `make run-web` – start Next.js dev server on 3101
- `make dev` – run both API and frontend together
- `make fmt` / `make lint` / `make type` – formatting, linting, static typing
- `make test` – run pytest suite
- `make db-init` / `make db-reset` – initialize or reset SQLite database
- `make docker-up` / `make docker-down` / `make docker-build` – container orchestration helpers

## Environment Configuration

Copy `.env.example` to `.env` (backend) and `frontend/.env.example` to `frontend/.env.local`. Key variables:

- `DATABASE_URL` – defaults to `sqlite:///./data/lifeform.db`
- `PORT` – backend port (8101)
- `OPENAI_API_KEY` – optional future integration
- `TWILIO_*` – placeholders for webhook expansion
- `NEXT_PUBLIC_API_BASE_URL` – frontend API target (defaults to `http://localhost:8101`)

You can override configuration using environment variables or edit `config.toml`.

## API Endpoints

- `GET /api/state` – Fetch pending question, latest reflection, memory count, and current lifeform state.
- `POST /api/reply` – Submit `{ "question_id": number, "text": string }` to answer the pending question.
- `POST /api/admin/seed` – Ensure singleton state and seed an initial question.
- `POST /hooks/twilio/sms` – Log inbound Twilio SMS payloads (TODO: map to memories).
- `POST /hooks/twilio/status` – Log delivery callbacks (TODO).

## Metabolism Loop

1. Scheduler periodically runs `generate_question()` if no pending prompt exists.
2. Frontend displays the current pending question; user submissions become `Memory` records.
3. `ingest_reply()` marks the question answered, creates a `Reflection`, and adjusts `LifeformState` curiosity & mood.
4. A new question is generated immediately (or by scheduler) to continue the loop.
5. State updates propagate through `/api/state` to drive UI mood/curiosity visuals.

## Testing

Run backend smoke tests:

```bash
make test
```

The suite ensures the Flask app boots and `/api/state` responds with expected keys.

## Future Work

- Map Twilio SMS replies to pending questions and orchestrate outbound messaging.
- Replace `StubAIClient` with `OpenAIClient` once API access is configured.
- Add authentication, rate limiting, and CSRF/CORS hardening for production readiness.
- Persist scheduler jobs across restarts and expose admin dashboards.
