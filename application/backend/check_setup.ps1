# Quick Setup Diagnostic Script
# Run this to see what you need to do

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Backend Setup Diagnostic" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Check 1: Python
Write-Host "`n[1] Checking Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Python installed: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Python not found in PATH" -ForegroundColor Red
}

# Check 2: Virtual Environment
Write-Host "`n[2] Checking Virtual Environment..." -ForegroundColor Yellow
if (Test-Path "venv\bin\python.exe" -or Test-Path "venv\Scripts\python.exe") {
    Write-Host "  ✓ Virtual environment exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ Virtual environment not found" -ForegroundColor Red
    Write-Host "    Run: python -m venv venv" -ForegroundColor Yellow
}

# Check 3: Python Packages
Write-Host "`n[3] Checking Python Packages..." -ForegroundColor Yellow
if (Test-Path "venv\bin\python.exe") {
    $pythonExe = "venv\bin\python.exe"
} elseif (Test-Path "venv\Scripts\python.exe") {
    $pythonExe = "venv\Scripts\python.exe"
} else {
    $pythonExe = "python"
}

$packages = & $pythonExe -m pip list 2>&1
$hasPymysql = $packages -match "pymysql"
$hasFastapi = $packages -match "fastapi"
$hasCryptography = $packages -match "cryptography"

if ($hasPymysql) {
    Write-Host "  ✓ pymysql installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ pymysql not installed" -ForegroundColor Red
}

if ($hasFastapi) {
    Write-Host "  ✓ fastapi installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ fastapi not installed" -ForegroundColor Red
}

if ($hasCryptography) {
    Write-Host "  ✓ cryptography installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ cryptography not installed (required for MySQL 8.0)" -ForegroundColor Red
    Write-Host "    This is the blocking issue - see CHECK_SETUP.md for solutions" -ForegroundColor Yellow
}

# Check 4: MySQL Service
Write-Host "`n[4] Checking MySQL Service..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "*mysql*" -ErrorAction SilentlyContinue
if ($mysqlService) {
    $status = $mysqlService.Status
    if ($status -eq "Running") {
        Write-Host "  ✓ MySQL service is running" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ MySQL service exists but is not running (Status: $status)" -ForegroundColor Yellow
        Write-Host "    Start it with: Start-Service MySQL*" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ MySQL service not found" -ForegroundColor Red
    Write-Host "    MySQL may not be installed" -ForegroundColor Yellow
    Write-Host "    Download from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
}

# Check 5: MySQL Command Line
Write-Host "`n[5] Checking MySQL Command Line..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version 2>&1
    if ($LASTEXITCODE -eq 0 -or $mysqlVersion -match "mysql") {
        Write-Host "  ✓ MySQL CLI available" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ MySQL command line not in PATH" -ForegroundColor Yellow
        Write-Host "    (This is OK if MySQL is installed but not in PATH)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ⚠ MySQL command line not in PATH" -ForegroundColor Yellow
    Write-Host "    (This is OK if MySQL is installed but not in PATH)" -ForegroundColor Gray
}

# Check 6: Database Files
Write-Host "`n[6] Checking Database Files..." -ForegroundColor Yellow
if (Test-Path "db\migrations") {
    $migrationCount = (Get-ChildItem "db\migrations\*.sql").Count
    Write-Host "  ✓ Found $migrationCount migration files" -ForegroundColor Green
} else {
    Write-Host "  ✗ Migration files not found" -ForegroundColor Red
}

if (Test-Path "db\seed") {
    $seedCount = (Get-ChildItem "db\seed\*.sql").Count
    Write-Host "  ✓ Found $seedCount seed files" -ForegroundColor Green
} else {
    Write-Host "  ✗ Seed files not found" -ForegroundColor Red
}

# Summary
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$issues = @()

if (-not $hasCryptography) {
    $issues += "Cryptography package not installed (blocks MySQL connection)"
}

if (-not $mysqlService -or $mysqlService.Status -ne "Running") {
    $issues += "MySQL service not running or not installed"
}

if (-not $hasPymysql -or -not $hasFastapi) {
    $issues += "Python packages not fully installed"
}

if ($issues.Count -eq 0) {
    Write-Host "`n✓ Everything looks good! You can:" -ForegroundColor Green
    Write-Host "  1. Test database connection: .\venv\bin\python.exe test_db_connection.py" -ForegroundColor Cyan
    Write-Host "  2. Run database setup: .\venv\bin\python.exe setup_db.py" -ForegroundColor Cyan
    Write-Host "  3. Start backend: uvicorn app.main:app --reload" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠ Issues found:" -ForegroundColor Yellow
    foreach ($issue in $issues) {
        Write-Host "  - $issue" -ForegroundColor Yellow
    }
    Write-Host "`nSee CHECK_SETUP.md for detailed solutions" -ForegroundColor Cyan
}

Write-Host "`n============================================================" -ForegroundColor Cyan

