#!/bin/bash
# Quick script to add client_max_body_size to nginx config
# Run this on your server if the deployment script couldn't find your nginx config

echo "Finding nginx configuration file..."

# Try to find nginx config
NGINX_CONFIG=""
POSSIBLE_CONFIGS=(
  "/etc/nginx/sites-available/sfsututor.site"
  "/etc/nginx/sites-available/default"
  "/etc/nginx/conf.d/sfsututor.site.conf"
  "/etc/nginx/nginx.conf"
)

for config in "${POSSIBLE_CONFIGS[@]}"; do
  if [ -f "$config" ]; then
    if grep -q "sfsututor.site\|server_name.*sfsututor\|proxy_pass.*127.0.0.1:8000\|location /api" "$config" 2>/dev/null; then
      NGINX_CONFIG="$config"
      echo "Found config: $NGINX_CONFIG"
      break
    fi
  fi
done

if [ -z "$NGINX_CONFIG" ]; then
  echo "ERROR: Could not find nginx config file"
  echo ""
  echo "Please run this command to find your nginx config:"
  echo "  sudo nginx -T | grep -A 5 'server {'"
  echo ""
  echo "Then manually edit the file and add this line inside the 'server {' block:"
  echo "  client_max_body_size 10M;"
  echo ""
  echo "And also add it inside the 'location /api {' block if it exists:"
  echo "  client_max_body_size 10M;"
  echo ""
  echo "Then test and reload:"
  echo "  sudo nginx -t"
  echo "  sudo systemctl reload nginx"
  exit 1
fi

echo "Updating $NGINX_CONFIG..."

# Check if already configured
if grep -A 20 "server {" "$NGINX_CONFIG" | grep -q "client_max_body_size"; then
  echo "✓ client_max_body_size already configured in server block"
else
  echo "Adding client_max_body_size to server block..."
  if grep -q "server_name" "$NGINX_CONFIG"; then
    sudo sed -i '/server_name/a\    client_max_body_size 10M;' "$NGINX_CONFIG"
  elif grep -q "listen.*80" "$NGINX_CONFIG"; then
    sudo sed -i '/listen.*80/a\    client_max_body_size 10M;' "$NGINX_CONFIG"
  else
    sudo sed -i '/^[[:space:]]*server[[:space:]]*{/a\    client_max_body_size 10M;' "$NGINX_CONFIG"
  fi
  echo "✓ Added to server block"
fi

# Check /api location block
if grep -q "location /api" "$NGINX_CONFIG"; then
  if ! grep -A 5 "location /api" "$NGINX_CONFIG" | grep -q "client_max_body_size"; then
    echo "Adding client_max_body_size to /api location block..."
    sudo sed -i '/location \/api {/a\        client_max_body_size 10M;' "$NGINX_CONFIG"
    echo "✓ Added to /api location block"
  else
    echo "✓ client_max_body_size already configured in /api location block"
  fi
fi

# Test configuration
echo ""
echo "Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
  echo "✓ Configuration test passed"
  echo "Reloading nginx..."
  sudo systemctl reload nginx
  echo "✓ Nginx reloaded successfully"
  echo ""
  echo "Upload limit is now configured to 10MB"
else
  echo "✗ Configuration test failed"
  echo "Please check the nginx config manually"
  exit 1
fi

