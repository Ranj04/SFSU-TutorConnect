# SFSU TutorConnect

> CSC 648-848 (Fall 2025) — Team 02

TutorConnect is a full-stack web application that connects San Francisco State
University students with qualified peer tutors. Students can search tutors by
subject and course, browse postings and ratings, send one-round connection
requests, and leave reviews. Tutors can publish postings, manage a tutor
profile, and accept or decline incoming requests.

> ⚠️ **Keep this repository private but accessible to the instructor and TAs.**
> See [Secrets & credentials](#secrets--credentials) — the repo previously
> committed real credentials and those must be rotated.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Hosting: AWS → Railway](#hosting-aws--railway)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Usage examples](#usage-examples)
- [Deployment](#deployment)
- [Secrets & credentials](#secrets--credentials)
- [Testing & CI](#testing--ci)
- [Team](#team)

---

## Features

- **Search & discovery** — find tutors by subject/course with keyword search and
  pagination.
- **Authentication** — SFSU-email (`@sfsu.edu`) registration and login. Auth uses
  signed bearer tokens; the server derives the acting user from the token on
  every request (never from a client-supplied id).
- **Postings** — tutors create postings; an admin moderates (approve/reject).
- **Messaging / connection requests** — students send a one-round contact message
  per posting; tutors accept or decline, then connect off-platform.
- **Reviews & ratings** — students review postings they contacted; a posting's
  average rating is recalculated on each review.
- **Profiles** — editable user + tutor profiles with optional profile photo.

## Tech stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18 (Vite), React Router 6, Bootstrap 5 + bootstrap-icons, Framer Motion |
| Backend   | FastAPI, SQLAlchemy 2, Pydantic v1, Uvicorn/Gunicorn |
| Database  | MySQL 8 (PyMySQL driver) |
| Auth      | Stateless HMAC-SHA256 signed tokens (standard library), bcrypt password hashing |
| Hosting   | Railway (Docker, single combined service + managed MySQL) |
| CI        | GitHub Actions (flake8 + compile checks; ESLint; Vite build) |

## Hosting: AWS → Railway

This project **originally ran on AWS** — an EC2 (Ubuntu) instance behind an Nginx
reverse proxy, with a self-managed MySQL 8 server and deploys driven by SSH from
GitHub Actions. That setup required maintaining a server, an SSH key pair, and a
manually administered database.

It is **now hosted on [Railway](https://railway.app)** as a single combined
service (FastAPI serves both the API and the built React SPA from one origin)
plus Railway's managed MySQL plugin. Benefits of the move:

- No server or Nginx to maintain; Railway builds the included `Dockerfile` and
  manages TLS and the public domain.
- Managed MySQL with connection variables injected at runtime.
- Git-push-to-deploy; no SSH keys baked into CI.
- Same-origin frontend + API, so there is no CORS configuration in production.

The legacy AWS deploy scripts under `credentials/` (e.g. `deploy.sh`,
`deploy-config.env`) are retained for history only and are **no longer used**.
Step-by-step Railway instructions live in **[RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)**.

## Project structure

```
csc648-fa25-03-team02/
├── application/
│   ├── backend/                 # FastAPI backend
│   │   ├── app/
│   │   │   ├── main.py          # App entrypoint; serves API + (in prod) the SPA
│   │   │   ├── config.py        # Env-driven settings (DATABASE_URL, SECRET_KEY, …)
│   │   │   ├── dependencies.py  # get_current_user / get_current_admin
│   │   │   ├── routes/          # auth, search, postings, messaging, reviews, courses
│   │   │   ├── services/        # tokens, password hashing, search, rate limiting
│   │   │   └── db/              # SQLAlchemy models, engine/session
│   │   ├── db/migrations/       # Ordered SQL migrations (run by run_migrations.py)
│   │   ├── db/seed/             # Seed data (subjects, courses, demo)
│   │   ├── run_migrations.py    # Idempotent migration runner
│   │   └── requirements.txt
│   └── client/                  # React (Vite) frontend
│       ├── src/                 # pages/, components/, services/api.js, utils/auth.js
│       └── package.json
├── Dockerfile                   # Combined build (frontend → backend serves it)
├── railway.json                 # Railway build/health-check config
├── .dockerignore
├── RAILWAY_DEPLOY.md            # Deployment runbook
├── credentials/                 # LEGACY secrets — being untracked & rotated
├── Milestones/                  # Course documentation
└── README.md
```

## Local development

### Prerequisites

- Python **3.12+**
- Node.js **20+**
- MySQL **8** running locally (or a reachable instance)

### 1. Backend

```bash
cd application/backend
python -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env                # then edit .env (see Environment variables)
python run_migrations.py            # create tables
# optional: load SFSU subjects/courses
python scripts/update_subjects.py
python scripts/update_courses.py

uvicorn app.main:app --reload       # http://localhost:8000  (docs at /docs)
```

### 2. Frontend

```bash
cd application/client
npm install
npm run dev                         # http://localhost:5173
```

In local dev the frontend and backend run on separate ports. The Vite dev server
proxies `/api` to `http://localhost:8000` (see `vite.config.js`), so the default
`VITE_API_BASE_URL` works without changes.

## Environment variables

### Backend (`application/backend/.env`)

| Variable                     | Required        | Default       | Description |
|------------------------------|-----------------|---------------|-------------|
| `DATABASE_URL`               | **Yes**         | —             | SQLAlchemy MySQL URL, e.g. `mysql+pymysql://user:pass@host:3306/db`. A bare `mysql://…` (as Railway provides) is auto-rewritten to `mysql+pymysql://`. |
| `SECRET_KEY`                 | **Yes in prod** | dev: random   | Signs auth tokens. The app refuses to start when `API_ENV=production` and this is unset. Generate: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `API_ENV`                    | No              | `development` | `production` disables debug, locks down CORS, and requires `SECRET_KEY`. |
| `API_DEBUG`                  | No              | `False`       | Enables SQL echo and verbose error detail in dev. Force-disabled when `API_ENV=production`. |
| `PROD_DOMAIN`                | Prod only       | —             | Production hostname (no scheme). Adds `https://<domain>` to the CORS allowlist. |
| `ACCESS_TOKEN_EXPIRE_SECONDS`| No              | `604800` (7d) | Lifetime of an issued access token. |
| `PORT`                       | No              | `8000`        | Injected by Railway; the server binds to it automatically. |

### Frontend (`application/client/.env`)

| Variable                | Required | Default        | Description |
|-------------------------|----------|----------------|-------------|
| `VITE_API_BASE_URL`     | No       | `/api` (relative) | Base URL the SPA uses for API calls. Leave relative for the combined deploy (same origin). For a separate backend in dev, set `http://localhost:8000`. |
| `VITE_GA_MEASUREMENT_ID`| No       | — (analytics off) | Google Analytics 4 measurement ID. If unset, analytics is a no-op. |

> Secrets are **never** committed. Locally they live in `.env` (gitignored); in
> production they are set in the Railway dashboard.

## Usage examples

The API is served under `/api`. Interactive docs are available at `/docs`
(Swagger) and `/redoc` when the server is running.

**Register** (returns the user and a bearer token):

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"gator@sfsu.edu","password":"changeme123",
       "first_name":"Gail","last_name":"Gator","major":"Computer Science"}'
```

**Log in:**

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"gator@sfsu.edu","password":"changeme123"}'
# => { "user": {...}, "access_token": "<token>", "token_type": "bearer" }
```

**Call an authenticated endpoint** (identity comes from the token, not the URL):

```bash
TOKEN="<access_token from login>"
curl -X PATCH http://localhost:8000/api/auth/users/1/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"major":"Mathematics"}'
```

**Search tutors / health check:**

```bash
curl "http://localhost:8000/api/search?q=calculus&page=1&limit=10"
curl "http://localhost:8000/api/v1/health"     # {"status":"ok","api":"v1"}
```

In the browser, open the frontend (`/` in production, `http://localhost:5173` in
dev), register with an `@sfsu.edu` email, then search tutors, send a connection
request, and leave a review.

## Deployment

Deployment is on **Railway** using the repo-root `Dockerfile` (multi-stage: build
the Vite client, then have FastAPI serve it alongside the API) and `railway.json`.
Migrations run automatically on container start. The complete, click-by-click
runbook — creating the project, adding MySQL, wiring `DATABASE_URL`, setting
`SECRET_KEY`/`API_ENV`/`PROD_DOMAIN`, and generating the domain — is in
**[RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)**.

## Secrets & credentials

This repository previously **committed real secrets** under `credentials/`
(an EC2 SSH private key and a MySQL password). Those are being removed from
tracking and must be treated as compromised:

- **Rotate / revoke them** — the exposed AWS EC2 key pair must be deactivated and
  the old database password (`team02db`) must be considered burned and never
  reused. (These are actions in the AWS console / database, not in this repo.)
- `credentials/` is now gitignored and untracked. Note that files already in Git
  **history** remain recoverable from past commits; to fully purge them, rewrite
  history (`git filter-repo` / BFG) or keep the repository private.
- Going forward, all secrets live in `.env` (local, gitignored) or the Railway
  dashboard (production) — never in the repo.

## Testing & CI

GitHub Actions (`.github/workflows/ci.yml`) runs on pull requests and pushes:

- **Backend:** `flake8` (errors blocking) + `python -m compileall` over `app`.
- **Frontend:** `npm run lint` (ESLint) and `npm run build` (production Vite build).

Run the same checks locally:

```bash
# backend
cd application/backend && python -m compileall app && flake8 app
# frontend
cd application/client && npm run lint && npm run build
```

## Team

CSC 648-848 Fall 2025, Team 02. See **[Milestones/README.md](./Milestones/README.md)**
for team roster, roles, and project process documentation.
