# Local Database Setup for Testing

This guide shows you how to set up a local MySQL database so you can test creating accounts, search results, and other features without affecting the remote database.

## Option 1: Quick Setup - Use Local Database for Testing (Recommended)

### Step 1: Install MySQL (if not already installed)

**Windows:**
- Download MySQL Community Server: https://dev.mysql.com/downloads/mysql/
- Or use XAMPP: https://www.apachefriends.org/ (includes MySQL)
- Make sure MySQL service is running

**Check if MySQL is running:**
```powershell
# Windows - Check services
Get-Service | Where-Object {$_.Name -like "*mysql*"}
```

### Step 2: Create Local Database

1. **Open MySQL Workbench** (or command line)
2. **Connect to local MySQL** (usually `localhost` with root password)
3. **Create the database:**
   ```sql
   CREATE DATABASE csc648_tutoring_platform_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   ```

### Step 3: Set Up Local Database Tables and Data

1. **Navigate to backend directory:**
   ```powershell
   cd "C:\Users\ranji\CSC 648\csc648-fa25-03-team02\application\backend"
   ```

2. **Update .env file for local database:**
   Edit `application/backend/.env` and change it to:
   ```env
   # Local Database Configuration
   DATABASE_URL=mysql+pymysql://root:YOUR_LOCAL_PASSWORD@localhost:3306/csc648_tutoring_platform_dev
   
   API_ENV=development
   API_DEBUG=True
   ```
   Replace `YOUR_LOCAL_PASSWORD` with your local MySQL root password.

3. **Run the setup script to create tables and seed data:**
   ```powershell
   python setup_db.py
   ```
   This will:
   - Create all necessary tables
   - Add sample subjects and courses
   - Add demo data (tutors, users, etc.)

### Step 4: Test the Connection

```powershell
python test_db_connection.py
```

You should see:
- ✓ MySQL server is running
- ✓ Database exists
- ✓ Tables created
- ✓ Data seeded

### Step 5: Start Backend with Local Database

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Now you can:**
- Create accounts → they'll be saved to local database
- Search tutors → shows data from local database
- Make changes → only affects local database
- Test everything without touching remote database

## Option 2: Sync Local Changes to Remote Database

If you want your local changes to appear on the remote database, you have a few options:

### Option 2A: Connect Directly to Remote (No Local Database)

1. **Update .env to use remote database:**
   ```env
   DATABASE_URL=mysql+pymysql://app_user:team02db@127.0.0.1:3307/csc648_tutoring_platform
   ```

2. **Start SSH tunnel:**
   ```powershell
   ssh -i credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62
   ```

3. **Run backend** - changes go directly to remote database

### Option 2B: Export/Import Data (Manual Sync)

1. **Export from local database:**
   ```sql
   -- In MySQL Workbench, right-click database → Data Export
   -- Or use mysqldump command
   ```

2. **Import to remote database:**
   - Connect to remote in MySQL Workbench
   - Import the exported SQL file

### Option 2C: Use Migration Scripts

If you have specific data changes, create a SQL script and run it on both databases.

## Switching Between Local and Remote

You can easily switch by changing the `.env` file:

**For Local Testing:**
```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/csc648_tutoring_platform_dev
```

**For Remote (Production-like):**
```env
DATABASE_URL=mysql+pymysql://app_user:team02db@127.0.0.1:3307/csc648_tutoring_platform
```
(Don't forget to start SSH tunnel first)

## Recommended Workflow

**For Development/Testing:**
1. Use local database (Option 1)
2. Test everything locally
3. When ready, manually migrate important changes to remote

**For Production Testing:**
1. Use remote database (Option 2A)
2. Test with real data
3. Changes immediately visible to team

## Quick Commands Cheat Sheet

```powershell
# Switch to local database
# Edit .env file: DATABASE_URL=mysql+pymysql://root:PASSWORD@localhost:3306/csc648_tutoring_platform_dev

# Setup local database
python setup_db.py

# Test connection
python test_db_connection.py

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Switch to remote database
# Edit .env file: DATABASE_URL=mysql+pymysql://app_user:team02db@127.0.0.1:3307/csc648_tutoring_platform
# Start SSH tunnel first: ssh -i credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62
```

## Troubleshooting

### "Can't connect to MySQL server"
- Make sure MySQL service is running
- Check username/password in .env
- Verify database name is correct

### "Access denied"
- Double-check MySQL root password
- Try connecting with MySQL Workbench first to verify credentials

### "Database doesn't exist"
- Create it: `CREATE DATABASE csc648_tutoring_platform_dev;`
- Then run `python setup_db.py`

