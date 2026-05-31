# Deploying TutorConnect to Railway (Hobby plan)

This app deploys as **one Railway service** (FastAPI serves both the API and the
built React SPA from a single origin) plus a **MySQL** database. That's 2 billable
services, which fits the Hobby plan comfortably.

```
Railway project
├── MySQL            (Railway database plugin)
└── tutorconnect     (this repo, built from Dockerfile)
      ├─ builds application/client  ->  static SPA
      └─ uvicorn serves SPA at "/" and the API at "/api/*"
```

Because the frontend is served from the same origin as the API, **there is no
CORS to configure** and you only manage **one URL**.

---

## ⚠️ STEP 0 — Rotate exposed secrets first (do this before anything else)

The Git repo is **public** and `credentials/` (an EC2 SSH private key and the DB
password `team02db`) is committed. Anyone on the internet can read them right now.
The old AWS server is being replaced by Railway, so the clean fix is:

1. **In AWS:** delete/deactivate the exposed EC2 key pair and terminate the old
   instance if it's no longer used. Treat `team02db` as burned — never reuse it.
2. **Stop tracking the folder** so future commits don't re-expose anything:
   ```bash
   git rm -r --cached credentials
   echo "credentials/" >> .gitignore
   git commit -m "Stop tracking credentials/ (rotate exposed secrets)"
   ```
   > This removes them from *future* commits, but they remain in Git **history**.
   > To purge history too, use `git filter-repo` or GitHub's "Remove sensitive
   > data" guide — or simplest for a course project: make the repo **private**
   > (GitHub → Settings → Danger Zone → Change visibility).
3. If the course rubric requires graders to have `credentials/`, keep the repo
   **private** and share access with the graders rather than committing secrets
   to a public repo.

None of the Railway secrets below ever live in Git — they're set in the Railway
dashboard.

---

## STEP 1 — Create the project and the database

1. Go to <https://railway.app> → **New Project** → **Deploy from GitHub repo** →
   pick `Ranj04/SFSU-TutorConnect`. (Authorize Railway for the repo if prompted.)
2. Railway detects `Dockerfile` + `railway.json` at the repo root and starts
   building. It will fail health checks until the DB and env vars exist — that's
   expected; we fix it next.
3. In the same project: **New** → **Database** → **Add MySQL**.

## STEP 2 — Wire the database to the app

1. Open the **app service** → **Variables** tab.
2. Add `DATABASE_URL` referencing the MySQL service:
   ```
   DATABASE_URL = ${{ MySQL.MYSQL_URL }}
   ```
   Railway's URL looks like `mysql://root:pass@host:port/railway`. The app rewrites
   the `mysql://` scheme to `mysql+pymysql://` automatically (see
   `application/backend/app/config.py`), so it works as-is.

   > If `MYSQL_URL` isn't offered, build it from the parts:
   > `mysql://${{ MySQL.MYSQLUSER }}:${{ MySQL.MYSQLPASSWORD }}@${{ MySQL.MYSQLHOST }}:${{ MySQL.MYSQLPORT }}/${{ MySQL.MYSQLDATABASE }}`

## STEP 3 — Set the remaining app variables

On the **app service → Variables**, add:

| Variable      | Value                                             | Why |
|---------------|---------------------------------------------------|-----|
| `API_ENV`     | `production`                                       | Turns off debug, locks down CORS, requires SECRET_KEY |
| `SECRET_KEY`  | *(a 64-char hex string — generate it, see below)* | Signs auth tokens; app refuses to start in prod without it |
| `PROD_DOMAIN` | `sfsututor.site`                                  | Adds `https://sfsututor.site` to the CORS allowlist |

Set `PROD_DOMAIN=sfsututor.site` (your target custom domain). It only affects the
CORS allowlist; the combined deploy is same-origin, so this is belt-and-suspenders.

Generate the secret locally and paste the output as `SECRET_KEY`:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

You do **not** need `PORT` (Railway injects it; the Dockerfile honors `$PORT`) or
`VITE_API_BASE_URL` (the SPA uses relative `/api` URLs on the same origin).

## STEP 4 — Point sfsututor.site at Railway

Get a working Railway URL first, then attach your domain.

1. **Generate the Railway subdomain (to confirm the app works):**
   App service → **Settings** → **Networking** → **Generate Domain**
   (e.g. `tutorconnect-production.up.railway.app`). Verify the app loads there
   (STEP 5) before touching DNS.

2. **Add the custom domain in Railway:** same **Networking** panel →
   **Custom Domain** → enter `sfsututor.site` (and, recommended, also
   `www.sfsututor.site`). Railway shows the exact DNS target — copy it.

3. **Create the DNS record at your registrar** (wherever `sfsututor.site` is
   registered — Namecheap/GoDaddy/Cloudflare/etc.):
   - **`www` (simplest):** add a **CNAME** `www` → the Railway target.
   - **Apex/root `sfsututor.site`:** most registrars can't CNAME the apex. Either
     use a registrar with **ALIAS/ANAME/CNAME-flattening** (Cloudflare, Namecheap
     ALIAS) pointing the root at the Railway target, **or** CNAME `www` and add a
     registrar **redirect** from the apex to `https://www.sfsututor.site`.
   - Always use the exact target value Railway's Custom Domain panel displays.

4. **Wait for DNS + TLS** (minutes, up to a few hours). Railway auto-issues a
   Let's Encrypt cert once DNS resolves, so `https://sfsututor.site` works and
   `http://` auto-redirects to `https://`. Check:
   ```bash
   nslookup sfsututor.site
   curl -I https://sfsututor.site/health
   ```

> You asked for `http://sfsututor.site/`. It will load, but Railway redirects it
> to `https://` automatically — that's correct and needs no configuration.

## STEP 5 — Deploy & verify

On boot the container runs `python run_migrations.py` (creates all tables incl. the
new `is_admin`, `tutor_profiles`, and message-unique migrations), then starts
uvicorn serving the SPA + API.

```bash
curl https://<your-domain>/health         # {"status":"ok",...}
curl https://<your-domain>/api/v1/health   # {"status":"ok","api":"v1"}
```
Then open `https://<your-domain>/` — the React app should load and register/login
should work end-to-end.

## STEP 6 — Seed data (optional, one time)

Load SFSU subjects/courses against the Railway DB via the CLI:
```bash
npm i -g @railway/cli
railway login
railway link            # pick the project
railway run python application/backend/scripts/update_subjects.py
railway run python application/backend/scripts/update_courses.py
```
Create an admin (needed for posting moderation) from the MySQL service's query tab:
```sql
UPDATE users SET is_admin = 1 WHERE email = 'you@sfsu.edu';
```

---

## Files added for deploy

- **`Dockerfile`** (repo root) — multi-stage: Node builds `application/client` →
  `dist/`, then the Python image copies it to `application/backend/static/` and
  runs uvicorn. Migrations run on container start.
- **`railway.json`** — use the Dockerfile; health-check `/health`.
- **`.dockerignore`** — keeps `credentials/`, `.env*`, `node_modules`, caches out
  of the image.
- **`application/backend/app/main.py`** — serves the SPA from `./static` when
  present (combined deploy) and falls back to JSON when absent (API-only local
  dev). The SPA catch-all never shadows `/api/*`, `/health`, or `/docs`.
- **`application/backend/app/config.py`** — normalizes `mysql://` → `mysql+pymysql://`.

## Troubleshooting

- **App crash-loops on first deploy:** usually `DATABASE_URL` missing or MySQL not
  ready. Confirm STEP 2 and check the app **Deploy logs**. The start command fails
  fast if migrations can't connect; Railway retries per the restart policy.
- **`SECRET_KEY ... required in production`:** set `SECRET_KEY` (STEP 3).
- **Blank page / 404 on refresh:** the SPA build wasn't copied — check build logs
  show `npm run build` producing `dist/` (build context is the repo root).
- **Cost:** keep it to app + MySQL (2 services). The Hobby monthly usage credit
  covers a low-traffic app of this size.
