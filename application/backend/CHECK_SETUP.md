# What You Need To Do - Step by Step

Based on your backend files, here's what you need to check and do:

## Current Situation

Your backend is configured to connect to:
- **Database:** `csc648_tutoring_platform_dev`
- **User:** `root`
- **Password:** `03012003`
- **Host:** `localhost:3306`

## Step 1: Check if MySQL is Installed

### On Windows:
```powershell
# Check if MySQL service exists
Get-Service -Name "*mysql*"

# Or check if MySQL is in PATH
mysql --version
```

### If MySQL is NOT installed:
1. **Download MySQL:** https://dev.mysql.com/downloads/mysql/
2. **Install MySQL 8.0+**
3. **During installation, set root password to:** `03012003` (or update config.py)
4. **Make sure MySQL service starts automatically**

## Step 2: Check if Database Exists

### Option A: Using MySQL Command Line
```bash
# Connect to MySQL
mysql -u root -p03012003

# Check if database exists
SHOW DATABASES LIKE 'csc648_tutoring_platform_dev';

# If it doesn't exist, create it:
CREATE DATABASE csc648_tutoring_platform_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

### Option B: Using MySQL Workbench
1. Connect to localhost MySQL
2. Check if `csc648_tutoring_platform_dev` database exists
3. If not, create it

## Step 3: Install Python Dependencies

### Fix Cryptography Issue (Windows Python 3.12)

**Option 1: Install Pre-built Cryptography (Recommended)**
```powershell
# Try installing from wheel
pip install cryptography --only-binary :all:

# If that doesn't work, install Visual C++ Build Tools first:
# Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# Then install Rust: https://www.rust-lang.org/tools/install
# Then: pip install cryptography
```

**Option 2: Use mysql-connector-python (Alternative)**
```powershell
# mysql-connector-python might have better Windows support
pip install mysql-connector-python
```

Then update `app/db/database.py` to use:
```python
DATABASE_URL = "mysql+mysqlconnector://root:03012003@localhost:3306/csc648_tutoring_platform_dev"
```

**Option 3: Change MySQL Auth Method (Not Recommended for Production)**
```sql
-- Connect to MySQL as root
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '03012003';
FLUSH PRIVILEGES;
```

## Step 4: Run Database Setup

Once MySQL is running and database exists:

```powershell
cd "C:\Users\ranji\CSC 648\csc648-fa25-03-team02\application\backend"
.\venv\bin\python.exe setup_db.py
```

This will:
- Run all migration files (001-012)
- Seed initial data (subjects, courses, demo users)

## Step 5: Test Backend

```powershell
# Activate venv
.\venv\bin\Activate.ps1

# Start server
uvicorn app.main:app --reload --port 8000
```

Visit: http://localhost:8000/docs

## Quick Diagnosis

Run this to check your setup:

```powershell
# 1. Check MySQL service
Get-Service -Name "*mysql*"

# 2. Check if Python packages are installed
.\venv\bin\python.exe -m pip list | Select-String "pymysql|cryptography|fastapi"

# 3. Test database connection (after fixing cryptography)
.\venv\bin\python.exe test_db_connection.py
```

## What Your Files Tell Us

1. **setup_db.py** - Expects database to already exist, then creates tables
2. **config.py** - Default connection to local MySQL with root/03012003
3. **Migration files** - 12 migration files ready to run
4. **Seed files** - Initial data ready to load

## Most Likely Scenario

Based on your question "I think the db was already created correct?":

**If database exists on remote server:**
- You need to create SSH tunnel to connect
- Update DATABASE_URL in .env file
- Use credentials from credentials/README.md

**If database doesn't exist locally:**
- Install MySQL
- Create database: `csc648_tutoring_platform_dev`
- Run `setup_db.py`

## Next Steps

1. **Check if MySQL is installed** - Run the check commands above
2. **If MySQL not installed** - Install it first
3. **Fix cryptography issue** - Use one of the options above
4. **Create database if needed** - Use MySQL command line or Workbench
5. **Run setup_db.py** - This will create all tables and seed data
6. **Start backend** - Test the API

Let me know what you find when you check MySQL installation!



