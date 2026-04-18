#!/bin/bash
# Cognera Web - One-time server setup
# Safe to re-run: all operations are idempotent and never delete user data.
# Run once before the first ./deploy/deploy.sh.
#
# Usage:
#   ./deploy/setup.sh                  # base setup (dir, user, .env stub, systemd, nginx HTTP)
#   ./deploy/setup.sh --ssl            # base setup + issue Let's Encrypt cert and enable HTTPS

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

REMOTE_HOST="root@46.224.104.44"
REMOTE_DIR="/var/www/cognera-web"
LOG_DIR="/var/log/cognera-web"
SERVICE_NAME="cognera-web"
DOMAIN="cognera.cz"
PORT=3003
SSH_CMD="ssh -o StrictHostKeyChecking=accept-new"
SCP_CMD="scp -o StrictHostKeyChecking=accept-new"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Cognera Web - Server setup${NC}"
echo -e "${YELLOW}Host: $REMOTE_HOST | Domain: $DOMAIN | Port: $PORT${NC}"
echo ""

# Upload unit file + nginx config
$SCP_CMD "$SCRIPT_DIR/cognera-web.service" "$REMOTE_HOST:/tmp/cognera-web.service"
$SCP_CMD "$SCRIPT_DIR/cognera-web.nginx"   "$REMOTE_HOST:/tmp/cognera-web.nginx"

$SSH_CMD "$REMOTE_HOST" bash <<'ENDSSH'
set -euo pipefail

REMOTE_DIR="/var/www/cognera-web"
LOG_DIR="/var/log/cognera-web"
SERVICE_NAME="cognera-web"
DOMAIN="cognera.cz"

mkdir -p "$REMOTE_DIR" "$LOG_DIR"

# Generate .env only if missing — do not overwrite
if [ ! -f "$REMOTE_DIR/.env" ]; then
    echo "Generating $REMOTE_DIR/.env (one-time)"
    ALTCHA_KEY=$(openssl rand -hex 32)
    CSRF_KEY=$(openssl rand -hex 32)
    JS_KEY=$(openssl rand -hex 32)
    cat > "$REMOTE_DIR/.env" <<EOF
NODE_ENV=production
PORT=3003
HOSTNAME=127.0.0.1

SMTP_HOST=smtp.cognera.cz
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@cognera.cz
SMTP_PASS=7chgcom
SMTP_FROM=info@cognera.cz
CONTACT_EMAIL=info@cognera.cz

ALTCHA_HMAC_KEY=$ALTCHA_KEY
CSRF_SECRET=$CSRF_KEY
JS_TOKEN_SECRET=$JS_KEY
EOF
    chmod 600 "$REMOTE_DIR/.env"
else
    echo "$REMOTE_DIR/.env already exists — leaving untouched"
fi

# Install systemd unit
install -m 0644 /tmp/cognera-web.service /etc/systemd/system/cognera-web.service
systemctl daemon-reload
systemctl enable cognera-web.service

# Install nginx site — HTTP-only variant during first setup so certbot can run
if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
    echo "No TLS cert yet — installing HTTP-only nginx stub for ACME challenge"
    cat > /etc/nginx/sites-available/cognera-web <<'NGINX'
server {
    listen 80;
    server_name cognera.cz www.cognera.cz;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX
else
    echo "TLS cert present — installing full HTTPS nginx config"
    install -m 0644 /tmp/cognera-web.nginx /etc/nginx/sites-available/cognera-web
fi

ln -sf /etc/nginx/sites-available/cognera-web /etc/nginx/sites-enabled/cognera-web
nginx -t
systemctl reload nginx

rm -f /tmp/cognera-web.service /tmp/cognera-web.nginx

echo "Setup OK"
ENDSSH

if [ "${1:-}" = "--ssl" ]; then
    echo -e "${YELLOW}Issuing Let's Encrypt cert and switching to HTTPS...${NC}"
    $SCP_CMD "$SCRIPT_DIR/cognera-web.nginx" "$REMOTE_HOST:/tmp/cognera-web.nginx"
    $SSH_CMD "$REMOTE_HOST" bash <<'ENDSSH'
set -euo pipefail
mkdir -p /var/www/html

if [ ! -f /etc/letsencrypt/live/cognera.cz/fullchain.pem ]; then
    certbot certonly --webroot -w /var/www/html \
        -d cognera.cz -d www.cognera.cz \
        --non-interactive --agree-tos --email info@cognera.cz
fi

install -m 0644 /tmp/cognera-web.nginx /etc/nginx/sites-available/cognera-web
ln -sf /etc/nginx/sites-available/cognera-web /etc/nginx/sites-enabled/cognera-web
nginx -t
systemctl reload nginx
rm -f /tmp/cognera-web.nginx

echo "HTTPS enabled"
ENDSSH
fi

echo ""
echo -e "${GREEN}Setup complete.${NC}"
echo -e "Next step: ${YELLOW}./deploy/deploy.sh${NC}"
