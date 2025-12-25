# Virtual Environment Activation Helper
# This script automatically detects and activates the virtual environment

$venvPath = Join-Path $PSScriptRoot "venv"

if (Test-Path (Join-Path $venvPath "Scripts\Activate.ps1")) {
    & (Join-Path $venvPath "Scripts\Activate.ps1")
    Write-Host "Virtual environment activated (Scripts)" -ForegroundColor Green
}
elseif (Test-Path (Join-Path $venvPath "bin\Activate.ps1")) {
    & (Join-Path $venvPath "bin\Activate.ps1")
    Write-Host "Virtual environment activated (bin)" -ForegroundColor Green
}
else {
    Write-Host "Error: Virtual environment not found. Run 'python -m venv venv' first." -ForegroundColor Red
    exit 1
}



