# What To Do Based on Your Files

## Quick Answer

**Your database setup script (`setup_db.py`) expects the database to already exist.** It does NOT create the database itself - it only:
1. Connects to an existing database
2. Runs migration files to create tables
3. Seeds initial data

## What Your Files Tell Us

### 1. Database Configuration
- **File:** `app/config.py`
- **Default Database:** `csc648_tutoring_platform_dev`
- **Default User:** `root`
- **Default Password:** `03012003`
- **Host:** `localhost:3306`

### 2. Database Setup Script
- **File:** `setup_db.py`
- **What it does:**
  - Connects to MySQL
  - Runs 12 migration files (001-012)
  - Seeds 3 seed files (subjects, courses, demo data)
- **What it does NOT do:**
  - Create the database (you must do this manually)

### 3. Migration Files
- **Location:** `db/migrations/`
- **12 migration files** ready to create all tables
- Tables include: users, tutor_profiles, subjects, courses, reviews, etc.

### 4. Seed Files
- **Location:** `db/seed/`
- **3 seed files:** seed_subjects.sql, seed_courses.sql, seed_demo.sql

## What You Need To Do

### Step 1: Install MySQL (If Not Installed)

**Check if MySQL is installed:**
```powershell
Get-Service -Name "*mysql*"
```

**If MySQL is NOT installed:**
1. Download: https://dev.mysql.com/downloads/mysql/
2. Install MySQL 8.0+
3. During installation, set root password to: `03012003`
   - OR update `app/config.py` and `setup_db.py` with your password

### Step 2: Create the Database

**Option A: Using MySQL Command Line**
```bash
# Connect to MySQL
mysql -u root -p

# Enter password: 03012003

# Create database
CREATE DATABASE csc648_tutoring_platform_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

# Exit
EXIT;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to localhost
3. Create new schema: `csc648_tutoring_platform_dev`
4. Set charset: `utf8mb4`, collation: `utf8mb4_0900_ai_ci`

### Step 3: Install Python Dependencies

**Current Issue: Cryptography package needs to be installed**

```powershell
cd "C:\Users\ranji\CSC 648\csc648-fa25-03-team02\application\backend"

# Activate venv
.\venv\bin\Activate.ps1

# Try installing cryptography (may need Rust/Visual C++)
pip install cryptography

# If that fails, install other packages first
pip install fastapi uvicorn sqlalchemy pymysql python-dotenv
```

**If cryptography installation fails:**
- Option 1: Install Visual C++ Build Tools (for Windows)
- Option 2: Use mysql-connector-python instead of pymysql
- Option 3: Change MySQL auth method (see CHECK_SETUP.md)

### Step 4: Run Database Setup

**Once MySQL is running and database exists:**

```powershell
# Make sure you're in backend directory
cd "C:\Users\ranji\CSC 648\csc648-fa25-03-team02\application\backend"

# Activate venv
.\venv\bin\Activate.ps1

# Run setup script
python setup_db.py
```

This will:
- ✅ Connect to database
- ✅ Run all 12 migration files
- ✅ Create all tables
- ✅ Seed initial data
- ✅ Show summary of created data

### Step 5: Test the Backend

```powershell
# Start the server
uvicorn app.main:app --reload --port 8000
```

**Test endpoints:**
- http://localhost:8000/health
- http://localhost:8000/docs (API documentation)
- http://localhost:8000/api/search (Search tutors)
- http://localhost:8000/api/subjects (Get subjects)

## Most Common Scenarios

### Scenario 1: Database Exists on Remote Server Only
**If the database only exists on your AWS server:**
1. Create SSH tunnel (see credentials/README.md)
2. Create `.env` file with remote database URL
3. Update `DATABASE_URL` to use SSH tunnel port (3307)

### Scenario 2: Database Doesn't Exist Locally
**If you want to work locally:**
1. Install MySQL
2. Create database: `csc648_tutoring_platform_dev`
3. Run `setup_db.py`
4. Start developing!

### Scenario 3: Database Already Exists Locally
**If database and tables already exist:**
1. Just install Python dependencies
2. Test connection: `python test_db_connection.py`
3. Start backend: `uvicorn app.main:app --reload`

## Quick Checklist

- [ ] MySQL installed and running
- [ ] Database `csc648_tutoring_platform_dev` created
- [ ] Python dependencies installed (including cryptography)
- [ ] Virtual environment activated
- [ ] Database setup script run (`python setup_db.py`)
- [ ] Backend server starts successfully
- [ ] Can access http://localhost:8000/docs

## Next Steps

1. **Check if MySQL is installed** - Run the service check
2. **If not installed** - Install MySQL first
3. **Create database** - Use MySQL command line or Workbench
4. **Fix cryptography issue** - Install dependencies
5. **Run setup_db.py** - This creates all tables and seeds data
6. **Start backend** - Test the API

## Need Help?

- See `CHECK_SETUP.md` for detailed troubleshooting
- See `LOCAL_SETUP.md` for complete setup guide
- See `ACTIVATE_VENV.md` for virtual environment help



