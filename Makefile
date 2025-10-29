PYTHON=python3
PIP=$(PYTHON) -m pip
VENV?=.venv
ACTIVATE=. $(VENV)/bin/activate

.PHONY: venv install run-api run-web dev fmt lint type test db-init db-reset docker-up docker-down docker-build clean

venv:
$(PYTHON) -m venv $(VENV)

install: venv
$(ACTIVATE) && $(PIP) install -r requirements.txt

run-api:
$(ACTIVATE) && FLASK_APP=wsgi.py FLASK_ENV=development flask run --host=0.0.0.0 --port=8101

run-web:
cd frontend && npm install && npm run dev -- --port 3101

dev:
$(ACTIVATE) && FLASK_APP=wsgi.py flask run --host=0.0.0.0 --port=8101 & \
cd frontend && npm install && npm run dev -- --port 3101

fmt:
$(ACTIVATE) && black app scripts tests

lint:
$(ACTIVATE) && ruff check app scripts tests

type:
$(ACTIVATE) && mypy app scripts

test:
$(ACTIVATE) && pytest -q

db-init:
$(ACTIVATE) && flask db init && flask db migrate -m "initial" && flask db upgrade

db-reset:
rm -f data/lifeform.db
$(MAKE) db-init

docker-up:
docker compose up --build

docker-down:
docker compose down

docker-build:
docker compose build

clean:
rm -rf $(VENV) .pytest_cache .mypy_cache ruff_cache
