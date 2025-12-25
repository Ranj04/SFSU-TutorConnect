# Backend Local Setup Guide

This document outlines everything you need on your local PC to run the backend and connect to the database.

## Prerequisites

### 1. Python 3.8 or Higher
- **Required Version:** Python 3.8+
- **Check Installation:** `python --version` or `python3 --version`
- **Download:** [python.org](https://www.python.org/downloads/)
- **Note:** Make sure Python is added to your PATH

### 2. MySQL Database Server
- **Required Version:** MySQL 8.0 or higher
- **Options:**
  - **MySQL Community Server** (Recommended): [mysql.com/downloads](https://dev.mysql.com/downloads/mysql/)
  - **XAMPP** (Includes MySQL): [apachefriends.org](https://www.apachefriends.org/)
  - **WAMP** (Windows): [wamp-server.com](https://www.wamp-server.com/)
  - **MySQL via Docker:** `docker run --name mysql -e MYSQL_ROOT_PASSWORD=03012003 -p 3306:3306 -d mysql:8.0`
- **Important:** MySQL must be running as a service on your machine

### 3. MySQL Client (Optional but Recommended)
- **MySQL Workbench:** [mysql.com/products/workbench](https://dev.mysql.com/downloads/workbench/)
- **DBeaver:** [dbeaver.io](https://dbeaver.io/download/)
- **MySQL CLI:** Usually included with MySQL Server installation

## Installation Steps

### Step 1: Install Python Dependencies

1. **Navigate to the backend directory:**
   ```bash
   cd application/backend
   ```

2. **Create a virtual environment (Recommended):**
   ```bash
   python -m venv venv
   ```
   
   **Activate virtual environment:**
   - **Windows (PowerShell):** 
     - Try: `.\venv\Scripts\Activate.ps1` (if Scripts folder exists)
     - Or: `.\venv\bin\Activate.ps1` (if bin folder exists)
     - If blocked by execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
   - **Windows (CMD):** 
     - Try: `venv\Scripts\activate.bat` (if Scripts folder exists)
     - Or: `venv\bin\activate.bat` (if bin folder exists)
   - **macOS/Linux:** `source venv/bin/activate`
   - **Alternative (works on all platforms):** Use the Python directly: `venv\Scripts\python.exe` or `venv\bin\python`

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Step 2: Set Up MySQL Database

#### Option A: Local MySQL Database (Recommended for Development)

1. **Start MySQL Server:**
   - Make sure MySQL service is running on your machine
   - Default port: `3306`

2. **Create the database:**
   ```sql
   CREATE DATABASE csc648_tutoring_platform_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   ```

3. **Verify MySQL root user credentials:**
   - The default configuration uses:
     - **User:** `root`
     - **Password:** `03012003`
     - **Host:** `localhost`
     - **Port:** `3306`
     - **Database:** `csc648_tutoring_platform_dev`

4. **Update credentials if needed:**
   - If your MySQL root password is different, you need to either:
     - **Option 1:** Update `app/config.py` to match your credentials
     - **Option 2:** Create a `.env` file (see Step 3)

5. **Run database setup script:**
   ```bash
   python setup_db.py
   ```
   This will:
   - Run all migration files (001-012)
   - Seed initial data (subjects, courses, demo data)

#### Option B: Connect to Remote Database (Server)

If you want to connect to the remote database on the AWS server:

1. **Create SSH tunnel (in a separate terminal):**
   ```bash
   ssh -i credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62
   ```
   Keep this terminal open while working.

2. **Update database configuration:**
   - Create a `.env` file (see Step 3) with:
     ```
     DATABASE_URL=mysql+pymysql://app_user:team02db@127.0.0.1:3307/csc648_tutoring_platform
     ```

### Step 3: Environment Configuration (Optional but Recommended)

1. **Create a `.env` file in `application/backend/` directory:**
   ```env
   # Database Configuration
   DATABASE_URL=mysql+pymysql://root:03012003@localhost:3306/csc648_tutoring_platform_dev
   
   # API Configuration
   API_ENV=development
   API_DEBUG=True
   ```

2. **Update `.env` if using different credentials:**
   ```env
   DATABASE_URL=mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/csc648_tutoring_platform_dev
   ```

3. **Important:** Add `.env` to `.gitignore` to avoid committing credentials!

### Step 4: Verify Database Connection

1. **Test database connection:**
   ```bash
   python -c "from app.db.database import engine; engine.connect(); print('Database connection successful!')"
   ```

2. **Or test via MySQL client:**
   ```bash
   mysql -u root -p03012003 -h localhost -P 3306 csc648_tutoring_platform_dev
   ```

### Step 5: Run the Backend Server

1. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Verify server is running:**
   - Open browser: `http://localhost:8000`
   - Check health endpoint: `http://localhost:8000/health`
   - View API docs: `http://localhost:8000/docs`

## Required Python Packages

The following packages are installed via `requirements.txt`:

- **FastAPI** (0.104.1) - Web framework
- **Uvicorn** (0.24.0) - ASGI server
- **SQLAlchemy** (2.0.23) - ORM for database operations
- **Alembic** (1.13.3) - Database migration tool
- **mysql-connector-python** (8.4.0) - MySQL driver
- **pymysql** (1.1.0) - MySQL connector
- **cryptography** (≥41.0.0) - Required for MySQL 8.0 authentication
- **python-dotenv** (1.0.0) - Environment variable management

## Database Schema

The database includes the following main tables:
- `users` - User accounts
- `tutor_profiles` - Tutor profile information
- `subjects` - Subject categories
- `courses` - Course listings
- `tutor_subjects` - Tutor-subject associations
- `tutor_courses` - Tutor-course associations
- `reviews` - Tutor reviews
- Additional tables for availability, sessions, notifications, etc.

All tables are created via migration files in `db/migrations/`.

## Troubleshooting

### Issue: "Can't connect to MySQL server"
- **Solution:** Make sure MySQL service is running
- **Windows:** Check Services app, look for "MySQL80" or "MySQL"
- **Start MySQL:** `net start MySQL80` (Windows) or `sudo service mysql start` (Linux)

### Issue: "Access denied for user 'root'@'localhost'"
- **Solution:** Update password in `app/config.py` or `.env` file
- **Alternative:** Reset MySQL root password or create a new user with proper permissions

### Issue: "ModuleNotFoundError: No module named 'fastapi'"
- **Solution:** Make sure you've installed dependencies: `pip install -r requirements.txt`
- **Check:** Verify you're in the virtual environment if using one

### Issue: "Database 'csc648_tutoring_platform_dev' doesn't exist"
- **Solution:** Create the database manually or run `setup_db.py`
- **Create database:** `CREATE DATABASE csc648_tutoring_platform_dev;`

### Issue: "Error loading .env file"
- **Solution:** This is not critical - the app will use defaults from `config.py`
- **Optional:** Create `.env` file in `application/backend/` directory

### Issue: "cryptography" installation errors
- **Solution:** Install build tools:
  - **Windows:** Install Visual C++ Build Tools
  - **macOS:** `xcode-select --install`
  - **Linux:** `sudo apt-get install build-essential libssl-dev libffi-dev python3-dev`

## Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Database `csc648_tutoring_platform_dev` created
- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Database migrations run (`python setup_db.py`)
- [ ] Environment variables configured (optional, via `.env` file)
- [ ] Backend server starts successfully (`uvicorn app.main:app --reload`)

## Additional Notes

1. **Development vs Production:**
   - Local development uses: `csc648_tutoring_platform_dev`
   - Production server uses: `csc648_tutoring_platform`
   - Credentials are different for local vs remote

2. **Security:**
   - Never commit `.env` files or credentials to git
   - Use environment variables for sensitive data
   - Consider using different passwords for local development

3. **Database Updates:**
   - Migration files are in `db/migrations/`
   - Run migrations in order (001, 002, 003, etc.)
   - Seed data is in `db/seed/`

4. **API Endpoints:**
   - Health check: `GET /health`
   - API docs: `GET /docs` (Swagger UI)
   - Search tutors: `GET /api/search`
   - Get subjects: `GET /api/subjects`

## Support

If you encounter issues not covered here:
1. Check MySQL logs for database errors
2. Check FastAPI logs for application errors
3. Verify all prerequisites are installed
4. Ensure database credentials are correct
5. Verify database exists and migrations have run

