# Setting Up .env File for Database Connection

## Quick Setup Guide

The backend needs a `.env` file in the `application/backend/` directory to connect to your database.

## Step 1: Check Your MySQL Workbench Connection Settings

Open MySQL Workbench and check your connection settings:
1. Right-click your connection → **Edit Connection**
2. Note down these values:
   - **Connection Method** (Standard TCP/IP or Standard TCP/IP over SSH)
   - **Hostname** (usually `127.0.0.1` if using SSH tunnel)
   - **Port** (usually `3307` for SSH tunnel, or `3306` for local)
   - **Username** (usually `app_user` for remote, or `root` for local)
   - **Password** (usually `team02db` for remote, or your local MySQL password)
   - **Default Schema** (database name)

## Step 2: Create .env File

1. Navigate to `application/backend/` directory
2. Create a new file named `.env` (exactly `.env` with the dot at the start)
3. Copy the appropriate connection string below based on your setup

## Option A: Remote Database via SSH Tunnel (Recommended if using AWS server)

**First, start the SSH tunnel** (keep this terminal open):
```powershell
cd "C:\Users\ranji\CSC 648\csc648-fa25-03-team02"
ssh -i credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62
```

**Then, in `application/backend/.env` file:**
```env
DATABASE_URL=mysql+pymysql://app_user:team02db@127.0.0.1:3307/csc648_tutoring_platform
API_ENV=development
API_DEBUG=True
```

## Option B: Local MySQL Database

If you have MySQL running locally on your machine:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/csc648_tutoring_platform_dev
API_ENV=development
API_DEBUG=True
```

Replace `YOUR_PASSWORD` with your local MySQL root password.

## Step 3: Test the Connection

1. Make sure your SSH tunnel is running (if using Option A)
2. Test the connection:
   ```powershell
   cd application/backend
   python test_db_connection.py
   ```

## Step 4: Run the Backend

```powershell
cd application/backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will now use the same database you see in MySQL Workbench!

## Connection String Format

The format is: `mysql+pymysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME`

- **USERNAME**: Database username
- **PASSWORD**: Database password  
- **HOST**: `127.0.0.1` for SSH tunnel, `localhost` for local MySQL
- **PORT**: `3307` for SSH tunnel, `3306` for local MySQL
- **DATABASE_NAME**: The database/schema name

## Troubleshooting

### "Can't connect to MySQL server"
- If using SSH tunnel: Make sure the tunnel is running in a separate terminal
- If using local MySQL: Make sure MySQL service is running

### "Access denied"
- Double-check username and password match what's in MySQL Workbench
- Try connecting with MySQL Workbench first to verify credentials

### "DATABASE_URL environment variable is required"
- Make sure `.env` file exists in `application/backend/` directory
- Make sure it's named exactly `.env` (with the dot)
- Restart the backend server after creating/editing `.env`

