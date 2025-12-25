# How to Activate Virtual Environment

## For Your Setup (Windows PowerShell)

Since your venv has a `bin` directory instead of `Scripts`, use:

```powershell
.\venv\bin\Activate.ps1
```

## Alternative Methods

### Method 1: Direct Activation (Recommended)
```powershell
cd "C:\Users\ranji\CSC 648\csc648-fa25-03-team02\application\backend"
.\venv\bin\Activate.ps1
```

### Method 2: Use the Helper Script
```powershell
cd "C:\Users\ranji\CSC 648\csc648-fa25-03-team02\application\backend"
.\activate.ps1
```

### Method 3: Use Python Directly (No Activation Needed)
```powershell
# Install packages
.\venv\bin\python.exe -m pip install -r requirements.txt

# Run server
.\venv\bin\python.exe -m uvicorn app.main:app --reload
```

### Method 4: If Execution Policy Blocks Scripts
```powershell
# Change execution policy (one-time setup)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate normally
.\venv\bin\Activate.ps1
```

## Verify Activation

After activation, you should see `(venv)` at the beginning of your prompt:
```
(venv) PS C:\Users\ranji\CSC 648\csc648-fa25-03-team02\application\backend>
```

## Verify Python Path

Check that you're using the venv Python:
```powershell
python --version
where python
# Should point to: ...\application\backend\venv\bin\python.exe
```

## Quick Test

```powershell
# 1. Navigate to backend directory
cd "C:\Users\ranji\CSC 648\csc648-fa25-03-team02\application\backend"

# 2. Activate venv
.\venv\bin\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Verify installation
pip list
```

## Troubleshooting

### "Activate.ps1 cannot be loaded"
- **Solution:** Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Or use Method 3 (direct Python execution)

### "The term 'Activate.ps1' is not recognized"
- **Check path:** Make sure you're in the `application/backend` directory
- **Check venv exists:** `Test-Path venv\bin\Activate.ps1` should return `True`
- **Use full path:** `& ".\venv\bin\Activate.ps1"`

### "No module named 'fastapi'"
- Make sure venv is activated (see `(venv)` in prompt)
- Run `pip install -r requirements.txt` again



