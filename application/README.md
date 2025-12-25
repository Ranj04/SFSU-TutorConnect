# TutorConnect - SFSU Tutoring Platform

**CSC 648 - Fall 2025 - Team 02 - Milestone 3**

A production-ready web application connecting SFSU students with qualified peer tutors. Features include dynamic search, category filtering, pagination, and a robust backend API with proper error handling and logging.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [API Testing](#api-testing)
- [M3 Demo Script](#m3-demo-script)
- [Production Checklist](#production-checklist)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

**Prerequisites:**
- Python 3.12+ (for backend)
- Node.js 18+ (for frontend)
- MySQL 8.0+ (for database)

**Total setup time: ~15 minutes**

### 1. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE csc648_tutoring_platform_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Configure environment
cd application/backend
cp .env.example .env
# Edit .env with your MySQL password

# Run migrations and seeds
python setup_db.py
```

### 2. Backend Setup

```bash
cd application/backend

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

### 3. Frontend Setup

```bash
cd application/client

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed (default: VITE_API_BASE_URL=/api)

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

---

## 📁 Project Structure

```
application/
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── main.py         # FastAPI app with error handlers & logging
│   │   ├── config.py       # Environment-based configuration
│   │   ├── routes/
│   │   │   └── search.py   # Search & categories endpoints
│   │   ├── services/
│   │   │   └── search.py   # Business logic with pagination
│   │   └── db/
│   │       ├── database.py # SQLAlchemy setup
│   │       └── models.py   # Database models
│   ├── db/
│   │   ├── migrations/     # SQL migrations (001-013)
│   │   └── seed/           # Demo data with bcrypt hashes
│   ├── requirements.txt    # Python dependencies
│   ├── setup_db.py         # Database setup script
│   ├── generate_hash.py    # Bcrypt hash generator
│   └── .env.example        # Environment template
│
└── client/                  # Vite + React frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx            # Landing with dynamic categories
    │   │   └── SearchResults.jsx   # Results with pagination
    │   ├── services/
    │   │   └── api.js      # API client with env-based URLs
    │   └── components/     # Reusable UI components
    ├── package.json        # Node dependencies
    └── .env.example        # Frontend environment template
```

---

## 🔧 Backend Setup

### Installation

```bash
cd application/backend

# Create virtual environment (if needed)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/csc648_tutoring_platform_dev
API_ENV=development
API_DEBUG=True
```

### Start Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🎨 Frontend Setup

### Installation

```bash
cd application/client

# Install dependencies
npm install
```

### Environment Configuration

```bash
cp .env.example .env
```

For development with separate backend server:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For production (with NGINX proxy):

```env
VITE_API_BASE_URL=/api
```

### Start Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

### Build for Production

```bash
npm run build
# Output: dist/ folder
```

---

## 🗄️ Database Setup

### Create Database

```sql
mysql -u root -p

CREATE DATABASE csc648_tutoring_platform_dev 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON csc648_tutoring_platform_dev.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Run Migrations

```bash
cd application/backend
python setup_db.py
```

This will:
1. Run all migrations (001-013)
2. Seed subjects and courses
3. Create demo users with bcrypt-hashed passwords
4. Create 8 tutor profiles
5. Add sample data (favorites, reviews, messages)

### Verify Setup

```sql
mysql -u root -p csc648_tutoring_platform_dev

SELECT COUNT(*) FROM users;            -- Should be 14 (1 admin + 8 tutors + 5 students)
SELECT COUNT(*) FROM tutor_profiles WHERE verification_status='approved';  -- Should be 8
SELECT COUNT(*) FROM subjects;         -- Should be 5+
SELECT COUNT(*) FROM courses;          -- Should be multiple
```

### Demo Credentials

All demo users have the password: **`password123`**

**Admin:**
- admin@sfsu.edu

**Tutors:**
- tutor1@sfsu.edu (Computer Science)
- tutor2@sfsu.edu (Mathematics)
- tutor3@sfsu.edu (Computer Science)
- tutor4@sfsu.edu (Physics)
- tutor5@sfsu.edu (Chemistry)
- tutor6@sfsu.edu (Biology)
- tutor7@sfsu.edu (Mathematics)
- tutor8@sfsu.edu (Physics)

**Students:**
- student1@sfsu.edu through student5@sfsu.edu

---

## ⚙️ Environment Configuration

### Backend (.env)

```env
# Database connection string
DATABASE_URL=mysql+pymysql://username:password@host:port/database

# API settings
API_ENV=development          # or 'production'
API_DEBUG=True               # False in production
```

### Frontend (.env)

```env
# API base URL (relative for production, absolute for local dev)
VITE_API_BASE_URL=/api
```

### Production Considerations

1. **Never commit `.env` files** (already in `.gitignore`)
2. **Use strong passwords** in production
3. **Set `API_DEBUG=False`** in production
4. **Configure CORS** appropriately in `app/config.py`
5. **Use HTTPS** in production (update `VITE_API_BASE_URL` accordingly)

---

## 🧪 API Testing

### Health Check

```bash
curl http://localhost:8000/health
```

Expected:
```json
{"status": "ok", "message": "TutorConnect API is running"}
```

### Get Categories

```bash
curl http://localhost:8000/api/categories | jq
```

Expected:
```json
{
  "count": 5,
  "categories": [
    {"name": "Biology", "slug": "biology"},
    {"name": "Chemistry", "slug": "chemistry"},
    {"name": "Computer Science", "slug": "computer-science"},
    {"name": "Mathematics", "slug": "mathematics"},
    {"name": "Physics", "slug": "physics"}
  ]
}
```

### Search All Tutors (Page 1, Limit 2)

```bash
curl "http://localhost:8000/api/search?page=1&limit=2" | jq
```

Expected:
```json
{
  "count": 2,
  "total": 8,
  "page": 1,
  "limit": 2,
  "results": [...]
}
```

### Search by Category

```bash
curl "http://localhost:8000/api/search?category=computer-science&page=1&limit=10" | jq
```

### Search with Text Query

```bash
curl "http://localhost:8000/api/search?q=recursion&page=1&limit=10" | jq
```

### Validation Tests

**Test 1: Invalid category**
```bash
curl "http://localhost:8000/api/search?category=invalid" | jq
```
Expected: 400 error with helpful message

**Test 2: Query too long**
```bash
curl "http://localhost:8000/api/search?q=$(python -c 'print(\"a\" * 201)')" | jq
```
Expected: 400 error about query length

**Test 3: Invalid page number**
```bash
curl "http://localhost:8000/api/search?page=0" | jq
```
Expected: 422 validation error

---

## 🎬 M3 Demo Script

**Duration: 3-5 minutes**

### Part 1: Home Page - Dynamic Categories (1 min)

1. Open http://localhost:5173
2. **Point out**: Hero search bar
3. Click "Subjects" dropdown
4. **Demonstrate**: Categories loaded from API (check Network tab)
5. Select "Computer Science"
6. Enter search term: "TA"
7. Click "Search"

### Part 2: Search Results - Pagination (2 min)

1. **Show**: Loading spinner appears
2. **Point out**: "Showing X-Y of Z tutors" with pagination info
3. **Show**: Results filtered by category and text query
4. Change limit to 2 per page (modify URL: `?...&limit=2`)
5. **Demonstrate**: Pagination controls appear
6. Click "Next" → URL updates → Page 2 loads
7. Click "Previous" → Back to Page 1
8. **Show**: URL reflects all params (q, category, page, limit)

### Part 3: Error Handling (1 min)

1. **Test empty results**: Search for "zzzzz" → Clean "No tutors found" message
2. **Test error state**: Stop backend (Ctrl+C) → Search again → Helpful error with troubleshooting steps
3. Restart backend

### Part 4: Backend Tour (1 min)

1. Show terminal with request logs: `GET /api/search - 200 - 45ms`
2. Open http://localhost:8000/docs (Swagger UI)
3. **Point out**:
   - `/api/categories` endpoint
   - `/api/search` with pagination params (page, limit)
   - Validation rules (limit 1-50, query max 200 chars)
4. Try test in Swagger UI → Show JSON response with pagination

### Part 5: Code Highlights (Optional, 30s)

**No secrets in code:**
```bash
# Show .env.example files
cat application/backend/.env.example
cat application/client/.env.example
```

**Bcrypt hashes in seeds:**
```bash
# Show seed file has hashes, not NULL
grep password_hash application/backend/db/seed/seed_demo.sql | head -n 3
```

**Database indexes:**
```bash
# Show optional performance migration
cat application/backend/db/migrations/013_performance_indexes.sql
```

---

## ✅ Production Checklist

### M3 Acceptance Criteria

- [x] `/api/categories` returns categories from DB
- [x] `/api/search` validates inputs (category, query length) and paginates
- [x] Home dropdown fetches categories from API (no hardcoded list)
- [x] Results page shows loading, empty, error states, and pagination
- [x] URL reflects page/limit and syncs with state
- [x] No secrets in code; `.env.example` exists for backend & client
- [x] `.env` files are gitignored
- [x] Seed users have bcrypt hashes (no NULL/plaintext passwords)
- [x] Request logs show `METHOD PATH – STATUS – DURATION`
- [x] README has quick start, DB setup, env setup, and demo steps

### Security

- [x] Passwords hashed with bcrypt (work factor 12)
- [x] Environment variables for secrets
- [x] Input validation on API endpoints
- [x] CORS configured for allowed origins
- [x] SQL injection prevention (SQLAlchemy ORM)

### Performance

- [x] Database indexes on common queries
- [x] Pagination to limit result size
- [x] Efficient SQL with `distinct()` to avoid duplicates

### Developer Experience

- [x] Clear error messages (JSON format)
- [x] API documentation (Swagger/ReDoc)
- [x] Comprehensive README
- [x] Quick setup (<15 minutes)

---

## 🛠️ Troubleshooting

### Backend Issues

**Issue**: `DATABASE_URL environment variable is required`
- **Fix**: Copy `.env.example` to `.env` and set your MySQL password

**Issue**: `Access denied for user`
- **Fix**: Check MySQL credentials in `.env`, ensure user has permissions

**Issue**: `Can't connect to MySQL server`
- **Fix**: Ensure MySQL is running: `mysql.server start` (macOS) or check Windows services

**Issue**: Import errors
- **Fix**: Activate venv: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (macOS/Linux)

### Frontend Issues

**Issue**: `Failed to fetch categories`
- **Fix**: Ensure backend is running at http://localhost:8000

**Issue**: CORS errors
- **Fix**: Check `CORS_ORIGINS` in `backend/app/config.py` includes your frontend URL

**Issue**: 404 on `/api/search`
- **Fix**: If using separate backend, set `VITE_API_BASE_URL=http://localhost:8000` in client `.env`

### Database Issues

**Issue**: Duplicate key errors when re-running seeds
- **Fix**: Drop and recreate database, or clear specific tables before re-seeding

**Issue**: Foreign key constraint fails
- **Fix**: Run migrations in order (001-013), ensure parent tables exist before children

---

## 📚 Post-M3 TODO

**Authentication & Authorization:**
- [ ] Session management (JWT tokens)
- [ ] Login/logout endpoints
- [ ] Password reset flow
- [ ] Protected routes (student vs tutor vs admin)

**Messaging:**
- [ ] Real-time messaging (WebSockets)
- [ ] Conversation threads
- [ ] Unread message counts
- [ ] Message notifications

**Booking & Sessions:**
- [ ] Tutor availability calendar
- [ ] Session booking workflow
- [ ] Session status management
- [ ] Confirmation emails

**Reviews & Ratings:**
- [ ] Submit review after session
- [ ] Rating aggregation
- [ ] Review moderation (admin)

**Admin Features:**
- [ ] Tutor verification workflow
- [ ] User management dashboard
- [ ] Content moderation
- [ ] Analytics & reporting

**Production Deployment:**
- [ ] NGINX reverse proxy configuration
- [ ] SSL/TLS certificates (Let's Encrypt)
- [ ] Environment-specific configs
- [ ] Database backups
- [ ] Monitoring & logging (e.g., Sentry)

---

## 👥 Team

**CSC 648 - Fall 2025 - Team 02**

| Name | Role | Email | GitHub |
|------|------|-------|--------|
| Ranjiv Jithendran | Backend Lead | rjithendran@sfsu.edu | Ranj04 |
| Adea Mulaku | Frontend Lead | amulaku@sfsu.edu | adeamulaku |
| Harry Wong | Full Stack | hwong18@sfsu.edu | harrywong623 |
| Bao Than | Database | bthan@sfsu.edu | BaoThan |
| Dhvanil Bhagat | Full Stack | dbhagat@sfsu.edu | Dhvanil3103 |

---

## 📄 License

This project is for educational purposes as part of CSC 648 at San Francisco State University.

---

## 🆘 Support

For issues or questions:
1. Check this README
2. Review API docs at http://localhost:8000/docs
3. Check application logs (backend terminal shows request logs)
4. Contact team members via email

**Happy coding! 🚀**
