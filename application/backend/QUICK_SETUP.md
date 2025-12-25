# Quick Setup Checklist

## What You Need on Your Local PC

### 1. Required Software
- ✅ **Python 3.8+** - `python --version` to check
- ✅ **MySQL 8.0+** - Database server must be running
- ✅ **Git** - Already have it (you're using it)

### 2. Python Packages (Install via requirements.txt)
```bash
cd application/backend
pip install -r requirements.txt
```

### 3. Database Setup

#### For Local Development:
1. **MySQL must be running** (check Windows Services)
2. **Create database:**
   ```sql
   CREATE DATABASE csc648_tutoring_platform_dev;
   ```
3. **Default credentials in config.py:**
   - User: `root`
   - Password: `03012003`
   - Host: `localhost`
   - Port: `3306`
   - Database: `csc648_tutoring_platform_dev`

4. **Run setup script:**
   ```bash
   python setup_db.py
   ```

#### For Remote Database (Server):
1. **Create SSH tunnel:**
   ```bash
   ssh -i credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62
   ```
2. **Create `.env` file:**
   ```env
   DATABASE_URL=mysql+pymysql://app_user:team02db@127.0.0.1:3307/csc648_tutoring_platform
   ```

### 4. Run Backend
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Verify
- Open: `http://localhost:8000/docs`
- Check: `http://localhost:8000/health`

## Common Issues

| Issue | Solution |
|-------|----------|
| Can't connect to MySQL | Start MySQL service |
| Access denied | Update password in `config.py` or `.env` |
| Module not found | Run `pip install -r requirements.txt` |
| Database doesn't exist | Run `setup_db.py` or create manually |

## Full Details
See `LOCAL_SETUP.md` for complete documentation.



