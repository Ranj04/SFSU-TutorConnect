# How to Update Subjects on Production Database

This guide explains how to add all SFSU subjects to the production AWS database.

## Option 1: Run Script Manually via SSH (Recommended)

### Step 1: SSH into your AWS server
```bash
ssh -i credentials/csc648-team02-key.pem ubuntu@3.132.193.62
```

### Step 2: Navigate to the project directory
```bash
cd /home/ubuntu/csc648-fa25-03-team02/application/backend
```

### Step 3: Activate virtual environment
```bash
source venv/bin/activate
```

### Step 4: Run the update script
```bash
python scripts/update_subjects.py
```

The script will:
- Connect to the production database (using `.env` file)
- Add all new subjects
- Skip subjects that already exist
- Show a summary of what was added/updated

### Step 5: Verify it worked
```bash
# Option A: Check via MySQL
mysql -u app_user -p csc648_tutoring_platform
# Then run:
SELECT COUNT(*) FROM subjects;
# Should show 80+ subjects

# Option B: Check via API
curl https://sfsututor.site/api/categories | jq '.count'
```

---

## Option 2: Add to Deployment Workflow (Automatic)

If you want subjects to update automatically on each deployment, you can add this step to `.github/workflows/production-deploy.yml`:

Add this step **after** the backend configuration step (around line 147):

```yaml
# Update subjects in database
echo "========================================"
echo "[2.5/6] Updating subjects in database..."
echo "========================================"
source venv/bin/activate
python scripts/update_subjects.py || echo "WARNING: Subject update failed, continuing..."
```

**Note:** This is optional - you may prefer to run it manually to have more control.

---

## Option 3: Run SQL Directly (Alternative)

If you prefer to run SQL directly:

### Step 1: SSH into server
```bash
ssh -i credentials/csc648-team02-key.pem ubuntu@3.132.193.62
```

### Step 2: Connect to MySQL
```bash
mysql -u app_user -p csc648_tutoring_platform
# Enter password: team02db
```

### Step 3: Run the seed file
```sql
source /home/ubuntu/csc648-fa25-03-team02/application/backend/db/seed/001_seed_subjects.sql;
```

Or manually copy/paste the SQL from `application/backend/db/seed/001_seed_subjects.sql`

---

## Troubleshooting

**Issue: "DATABASE_URL environment variable not set"**
- Make sure you're in the `application/backend` directory
- Check that `.env` file exists: `cat .env`
- The `.env` file is created automatically during deployment

**Issue: "Access denied" when connecting to database**
- Verify database credentials in `.env` file
- Check that `app_user` has permissions: `SHOW GRANTS FOR 'app_user'@'localhost';`

**Issue: Script runs but subjects don't appear**
- Check if subjects table exists: `SELECT * FROM subjects LIMIT 10;`
- Verify the script output shows "Added: X subjects"
- Clear any API cache if you're using caching

---

## Verify Subjects Are Live

After updating, check:

1. **API endpoint:**
   ```bash
   curl https://sfsututor.site/api/categories
   ```
   Should return all subjects.

2. **Frontend:**
   - Visit https://sfsututor.site
   - Click on the "Subjects" dropdown in search bar
   - Should see all SFSU subjects listed

---

**Note:** The script uses `ON DUPLICATE KEY UPDATE` in SQL, so it's safe to run multiple times without creating duplicates.

