#!/bin/bash
# Unified Deployment Script
# Usage: ./deploy.sh [production|staging]
# Description: Deploys to either production or staging environment using centralized configuration

set -e  # Exit on any error

# Get script directory and repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/deploy-config.env"
DB_PASSWORD_FILE="$SCRIPT_DIR/db_password.txt"

# Validate environment parameter
ENV="${1:-}"
if [ -z "$ENV" ]; then
    echo "ERROR: Environment not specified"
    echo "Usage: $0 [production|staging]"
    exit 1
fi

if [ "$ENV" != "production" ] && [ "$ENV" != "staging" ]; then
    echo "ERROR: Invalid environment '$ENV'"
    echo "Usage: $0 [production|staging]"
    exit 1
fi

# Load configuration
if [ ! -f "$CONFIG_FILE" ]; then
    echo "ERROR: Configuration file not found: $CONFIG_FILE"
    exit 1
fi

source "$CONFIG_FILE"

# Set environment-specific variables
if [ "$ENV" = "production" ]; then
    REPO_DIR="$PROD_REPO_DIR"
    BRANCH="$PROD_BRANCH"
    DATABASE_NAME="$PROD_DATABASE_NAME"
    API_PORT="$PROD_API_PORT"
    SERVICE_NAME="$PROD_SERVICE_NAME"
    DOMAIN="$PROD_DOMAIN"
    API_BASE_URL="$PROD_API_BASE_URL"
    ENVIRONMENT="$PROD_ENVIRONMENT"
else
    REPO_DIR="$STAGING_REPO_DIR"
    BRANCH="$STAGING_BRANCH"
    DATABASE_NAME="$STAGING_DATABASE_NAME"
    API_PORT="$STAGING_API_PORT"
    SERVICE_NAME="$STAGING_SERVICE_NAME"
    DOMAIN="$STAGING_DOMAIN"
    API_BASE_URL="$STAGING_API_BASE_URL"
    ENVIRONMENT="$STAGING_ENVIRONMENT"
fi

# Read database password
if [ -f "$DB_PASSWORD_FILE" ]; then
    DB_PASSWORD=$(grep -v '^#' "$DB_PASSWORD_FILE" | grep -v '^$' | head -1 | tr -d '[:space:]')
    # If password file has placeholder, use default from README
    if [[ "$DB_PASSWORD" == *"PASTE"* ]] || [ -z "$DB_PASSWORD" ]; then
        DB_PASSWORD="team02db"
    fi
else
    # Fallback to default from README
    DB_PASSWORD="team02db"
fi

echo "Deploying $ENV to https://$DOMAIN"

# Check if repo directory exists
if [ ! -d "$REPO_DIR" ]; then
    echo "ERROR: Repository directory not found: $REPO_DIR"
    exit 1
fi

cd "$REPO_DIR" || { echo "ERROR: Cannot access $REPO_DIR"; exit 1; }

# Pull latest code
echo "[1/6] Pulling latest code from $BRANCH..."
if [ "$ENV" = "staging" ]; then
    git reset --hard HEAD
    git clean -fd
fi
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git pull origin "$BRANCH"
LATEST_COMMIT=$(git log --oneline -1)

# Update backend dependencies
echo "[2/6] Updating backend dependencies..."
cd "$REPO_DIR/application/backend"
if [ -d "venv" ]; then
    VENV_PYTHON_VERSION=$(cat venv/pyvenv.cfg 2>/dev/null | grep "version = " | cut -d' ' -f3 || echo "unknown")
    if [[ ! "$VENV_PYTHON_VERSION" =~ ^${PYTHON_VERSION} ]]; then
        echo "Removing old venv (Python $VENV_PYTHON_VERSION)"
        rm -rf venv
    fi
fi
if [ ! -d "venv" ]; then
    python${PYTHON_VERSION} -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

# Configure backend
echo "[3/6] Configuring backend..."
cat > .env << EOF
DATABASE_URL=mysql+pymysql://${DATABASE_USER}:${DB_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}
ENVIRONMENT=${ENVIRONMENT}
EOF

# Run database migrations
echo "[3.5/6] Running database migrations..."
if [ -f "run_migrations.py" ]; then
  echo "INFO: Running database migrations..."
  python run_migrations.py || {
    echo "ERROR: Migration script failed"
    echo "ERROR: Deployment stopped - please fix migrations before deploying"
    exit 1
  }
  echo "INFO: Database migrations completed"
else
  echo "WARNING: run_migrations.py not found, skipping migrations"
  echo "WARNING: You may need to run migrations manually"
fi

# Restart backend service
echo "[4/6] Restarting backend service..."
if sudo lsof -ti:$API_PORT >/dev/null 2>&1; then
    echo "Killing existing processes on port $API_PORT"
    sudo lsof -ti:$API_PORT | xargs sudo kill -9 2>/dev/null || true
    sleep 2
fi
sudo systemctl restart "$SERVICE_NAME"
sleep 5
if ! sudo systemctl is-active --quiet "$SERVICE_NAME"; then
    echo "ERROR: Backend service failed to start"
    sudo systemctl status "$SERVICE_NAME" --no-pager | head -20
    exit 1
fi

# Build frontend
echo "[5/6] Building frontend..."
cd "$REPO_DIR/application/client"
rm -rf dist/
echo "VITE_API_BASE_URL=$API_BASE_URL" > .env
echo "VITE_ENV=$ENVIRONMENT" >> .env
npm ci --quiet
npm run build
if ! grep -o "const [a-zA-Z0-9]*=\"$API_BASE_URL\"" dist/assets/*.js >/dev/null 2>&1; then
    echo "ERROR: Build verification failed - $ENV URL not found in build"
    exit 1
fi
sudo chown -R ubuntu:ubuntu dist/
sudo chmod -R 755 dist/

# Update Nginx configuration for large file uploads
echo "[6/6] Updating Nginx configuration..."
# Try to find the Nginx config file
NGINX_CONFIG=""
POSSIBLE_CONFIGS=(
  "/etc/nginx/sites-available/sfsututor.site"
  "/etc/nginx/sites-available/default"
  "/etc/nginx/conf.d/sfsututor.site.conf"
  "/etc/nginx/nginx.conf"
)

for config in "${POSSIBLE_CONFIGS[@]}"; do
  if [ -f "$config" ] && grep -q "sfsututor.site\|server_name.*sfsututor" "$config" 2>/dev/null; then
    NGINX_CONFIG="$config"
    echo "INFO: Found Nginx config at $NGINX_CONFIG"
    break
  fi
done

# If still not found, try to find any config with the domain or API proxy
if [ -z "$NGINX_CONFIG" ]; then
  for config in "${POSSIBLE_CONFIGS[@]}"; do
    if [ -f "$config" ] && grep -q "proxy_pass.*127.0.0.1:8000\|location /api" "$config" 2>/dev/null; then
      NGINX_CONFIG="$config"
      echo "INFO: Found Nginx config with API proxy at $NGINX_CONFIG"
      break
    fi
  done
fi

if [ -n "$NGINX_CONFIG" ]; then
  # Check if client_max_body_size is already set in the server block
  if ! grep -A 20 "server {" "$NGINX_CONFIG" | grep -q "client_max_body_size"; then
    echo "INFO: Adding client_max_body_size to Nginx config..."
    # Add it in the server block (after server_name or after listen)
    if grep -q "server_name" "$NGINX_CONFIG"; then
      sudo sed -i '/server_name/a\    client_max_body_size 10M;' "$NGINX_CONFIG"
    elif grep -q "listen.*80" "$NGINX_CONFIG"; then
      sudo sed -i '/listen.*80/a\    client_max_body_size 10M;' "$NGINX_CONFIG"
    else
      # Add after first server { line
      sudo sed -i '/^[[:space:]]*server[[:space:]]*{/a\    client_max_body_size 10M;' "$NGINX_CONFIG"
    fi
    echo "INFO: Added client_max_body_size to server block"
  fi
  
  # Also add it in the /api location block if it exists
  if grep -q "location /api" "$NGINX_CONFIG"; then
    if ! grep -A 5 "location /api" "$NGINX_CONFIG" | grep -q "client_max_body_size"; then
      sudo sed -i '/location \/api {/a\        client_max_body_size 10M;' "$NGINX_CONFIG"
      echo "INFO: Added client_max_body_size to /api location block"
    fi
  fi
  
  echo "INFO: Nginx config updated with client_max_body_size 10M"
else
  echo "WARNING: Could not find Nginx config file"
  echo "WARNING: Please manually add 'client_max_body_size 10M;' to your Nginx server block"
  echo "WARNING: You can find your config with: sudo nginx -T | grep -A 5 'server {'"
fi

# Test and reload Nginx
echo "INFO: Testing Nginx configuration..."
sudo nginx -t
if [ $? -eq 0 ]; then
  echo "INFO: Nginx configuration test passed"
  sudo systemctl reload nginx
  echo "INFO: Nginx reloaded"
else
  echo "ERROR: Nginx configuration test failed"
  echo "ERROR: Nginx not reloaded - please fix configuration manually"
  exit 1
fi

# Health checks
echo "Running health checks..."
sleep 3
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL/api/v1/health" || echo "000")
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL/" || echo "000")
SEARCH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL/search" || echo "000")
TUTOR_COUNT=$(curl -s "$API_BASE_URL/api/search" | grep -o '"count":[0-9]*' | cut -d':' -f2 || echo "")

echo ""
echo "Deployment complete: https://$DOMAIN"
echo "Commit: $LATEST_COMMIT"
echo "Backend service: $(sudo systemctl is-active $SERVICE_NAME)"
echo "Backend health: $BACKEND_HEALTH"
echo "Frontend: $FRONTEND_STATUS"
echo "Search page: $SEARCH_STATUS"
[ ! -z "$TUTOR_COUNT" ] && echo "Database: OK ($TUTOR_COUNT tutors)"

