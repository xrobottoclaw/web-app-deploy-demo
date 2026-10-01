# syntax=docker/dockerfile:1
# ---------------------------------------------------------------------------
# Multi-stage build: "builder" compiles wheels, "runtime" ships only the
# pre-built wheels + app. Final image has no compilers and runs as non-root.
# ---------------------------------------------------------------------------

# ----------------------------- builder stage -------------------------------
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# Compilers needed only to build any source distributions into wheels.
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Build wheels for every runtime dependency (Gunicorn included).
RUN pip wheel --wheel-dir /wheels -r requirements.txt gunicorn

# ----------------------------- runtime stage -------------------------------
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    APP_ENV=production \
    PORT=5000

WORKDIR /app

# Install dependencies from the pre-built wheels only - no network, no compiler.
COPY --from=builder /wheels /wheels
COPY requirements.txt .
RUN pip install --no-index --find-links=/wheels -r requirements.txt gunicorn \
    && rm -rf /wheels

# Run as an unprivileged system user.
RUN groupadd --system app \
    && useradd --system --gid app --create-home --home-dir /home/app app \
    && chown -R app:app /app

# Application code (owned by app).
COPY --chown=app:app app.py ./
COPY --chown=app:app templates ./templates
COPY --chown=app:app static ./static

USER app

EXPOSE 5000

# Liveness probe against the landing page (no curl in slim, so use Python).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import sys,urllib.request; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:5000/', timeout=3).status == 200 else 1)"

# Production entrypoint: Gunicorn with 2 workers.
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "2", "--timeout", "60", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
