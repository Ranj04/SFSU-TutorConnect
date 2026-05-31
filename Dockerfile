# syntax=docker/dockerfile:1
# =============================================================================
# Combined single-service image for Railway:
#   Stage 1 builds the Vite frontend, Stage 2 runs FastAPI which serves BOTH
#   the built SPA (at /) and the API (at /api/*) from one origin (no CORS).
# Build context is the repository root.
# =============================================================================

# ---------- Stage 1: build the Vite frontend ----------
FROM node:20-slim AS frontend
WORKDIR /web

# Install dependencies first for better layer caching.
COPY application/client/package.json application/client/package-lock.json ./
RUN npm ci

# Build the static bundle (-> /web/dist). VITE_API_BASE_URL is intentionally
# left empty so the SPA calls the API at the same origin via relative /api URLs.
COPY application/client/ ./
RUN npm run build

# ---------- Stage 2: Python backend runtime ----------
FROM python:3.12-slim AS runtime
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    API_ENV=production \
    PORT=8000
WORKDIR /app

# Backend dependencies (wheels only; no system build deps needed for this set).
COPY application/backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Backend source.
COPY application/backend/ ./

# Built frontend -> ./static (== /app/static), which app/main.py serves at "/".
COPY --from=frontend /web/dist ./static

EXPOSE 8000

# Apply DB migrations, then start the combined API + SPA server.
# Railway injects $PORT. If migrations fail (e.g. DB not ready yet on first
# boot), the container exits and Railway restarts it per the restart policy.
CMD ["sh", "-c", "python run_migrations.py && exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
