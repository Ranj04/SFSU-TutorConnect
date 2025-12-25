# M3 Acceptance Checklist

## ✅ Backend API Requirements

- [x] **`/api/categories` returns categories from DB**
  - Endpoint exists at `/api/categories`
  - Returns `{count, categories}` with dynamic data from subjects table
  - Alias of `/api/subjects` with frontend-friendly naming

- [x] **`/api/search` validates inputs and paginates**
  - Accepts `page` (≥1), `limit` (1-50), `category`, `q` (≤200 chars)
  - Validates category exists in DB or is "All"
  - Validates query length (max 200 characters)
  - Returns `{count, total, page, limit, results}`
  - Returns 400 with helpful error for invalid inputs

## ✅ Frontend Requirements

- [x] **Home dropdown fetches categories from API**
  - No hardcoded `CATEGORIES` array
  - Calls `getCategories()` on mount
  - Shows loading state while fetching
  - Degrades gracefully on error
  - All categories rendered from API response

- [x] **Results page shows all states**
  - **Loading**: Spinner with "Searching for tutors..." message
  - **Empty**: Clean "No tutors found" alert when results = 0
  - **Error**: Helpful error message with troubleshooting steps
  - **Success**: Displays tutor cards with all data

- [x] **Pagination with URL sync**
  - URL reflects `?q=..&category=..&page=..&limit=..`
  - Page state updates when URL changes
  - Previous/Next buttons update URL
  - Category change resets to page 1
  - Shows "Showing X-Y of Z tutors"
  - Pagination controls only show when totalPages > 1

## ✅ Security & Secrets

- [x] **No secrets in code**
  - `config.py` requires `DATABASE_URL` from env
  - `setup_db.py` parses connection string from env
  - No hardcoded passwords in any `.py` or `.js` files

- [x] **`.env.example` exists**
  - `application/backend/.env.example` - DB, API config
  - `application/client/.env.example` - API base URL
  - Both have clear comments and placeholder values

- [x] **`.env` files gitignored**
  - `.env` in `.gitignore`
  - No `.env` files committed to repo

- [x] **Seed passwords hashed**
  - All users in `seed_demo.sql` have bcrypt hashes
  - No NULL or plaintext passwords
  - Hash format: `$2b$12$...` (bcrypt work factor 12)
  - Comment shows how to generate new hashes

## ✅ Logging & Error Handling

- [x] **Request logs show METHOD PATH – STATUS – DURATION**
  - Middleware logs every request
  - Format: `GET /api/search - 200 - 45ms`
  - Visible in terminal/console

- [x] **Global JSON error handlers**
  - RequestValidationError returns 400 with structured JSON
  - Generic Exception returns 500 with structured JSON
  - All errors have `{error, message, detail}` shape

## ✅ Documentation

- [x] **README has quick start**
  - Step-by-step setup instructions
  - Prerequisites clearly listed
  - Estimated time: ~15 minutes

- [x] **README has DB setup**
  - Database creation commands
  - Migration instructions
  - Seed data explanation
  - Verification queries

- [x] **README has env setup**
  - `.env.example` → `.env` copy instructions
  - Required variables explained
  - Production vs development guidance

- [x] **README has demo script**
  - 3-5 minute structured demo
  - Tests all features (categories, search, pagination, error handling)
  - Backend tour with Swagger UI
  - Code highlights (no secrets, hashed passwords, indexes)

## ✅ Optional Improvements (Completed)

- [x] **Performance indexes**
  - Migration `013_performance_indexes.sql` created
  - Indexes on: verification_status, messages inbox, subject/course lookups
  - Idempotent (uses `IF NOT EXISTS`)

- [x] **Bcrypt hash generator utility**
  - `generate_hash.py` script for creating new hashes
  - Easy for contributors to generate passwords

- [x] **Comprehensive API tests**
  - Test script with all acceptance criteria
  - Includes validation tests (invalid category, query too long, etc.)

## 🎯 Acceptance Rate: 100%

All required acceptance criteria have been implemented and tested.

---

## 📝 Testing Instructions

### Backend Tests (API)

```bash
# Make sure backend is running
cd application/backend
.\venv\Scripts\activate  # Windows
uvicorn app.main:app --reload --port 8000

# In another terminal, run tests
.\test_api.ps1
```

### Frontend Tests (UI)

```bash
# Make sure frontend is running
cd application/client
npm run dev

# Manual tests:
1. Visit http://localhost:5173
2. Click "Subjects" dropdown → Should load categories from API
3. Select category + enter query → Click Search
4. Verify pagination controls appear
5. Click Next/Previous → URL should update
6. Test error: Stop backend → Search again → Should show error
7. Test empty: Search for "zzzzz" → Should show "No tutors found"
```

### Integration Tests

```bash
# Both backend and frontend must be running
# Visit http://localhost:5173 and complete the M3 Demo Script in README
```

---

## 🚀 Production Ready

This implementation is production-ready with:
- ✅ Input validation
- ✅ Error handling
- ✅ Logging
- ✅ Security (hashed passwords, no secrets in code)
- ✅ Performance (indexes, pagination)
- ✅ Documentation (README, API docs)
- ✅ Developer experience (clear errors, .env.example)

**Ready for Milestone 3 submission! 🎉**

