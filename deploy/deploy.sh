#!/bin/bash
# Cognera Web (Next.js) - Production Deployment
# Server: 46.224.104.44
# Domain: cognera.cz
# Port:   3003
#
# Usage: ./deploy/deploy.sh
#
# Notes on safety:
#   - .env is preserved across deploys (backed up, restored).
#   - Old release is moved to a timestamped backup, NOT deleted.
#   - Nothing outside /var/www/cognera-web is touched.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

REMOTE_HOST="root@46.224.104.44"
REMOTE_DIR="/var/www/cognera-web"
DOMAIN="cognera.cz"
PORT=3003
SERVICE_NAME="cognera-web"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SSH_CMD="ssh -o StrictHostKeyChecking=accept-new"
SCP_CMD="scp -o StrictHostKeyChecking=accept-new"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Cognera Web - Production Deploy${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Server:  $REMOTE_HOST${NC}"
echo -e "${YELLOW}Domain:  $DOMAIN${NC}"
echo -e "${YELLOW}Port:    $PORT${NC}"
echo -e "${YELLOW}Service: $SERVICE_NAME${NC}"
echo ""

# Step 1: Build locally
echo -e "${YELLOW}Step 1: Building Next.js standalone...${NC}"
cd "$REPO_ROOT"
npm install --silent --no-audit --no-fund
npm run build

# Locate standalone server.js
STANDALONE_DIR=".next/standalone"
SERVER_JS=$(find "$STANDALONE_DIR" -name "server.js" -maxdepth 5 2>/dev/null | head -1)

if [ -z "$SERVER_JS" ]; then
    echo -e "${RED}Build failed - standalone output not found${NC}"
    exit 1
fi

APP_DIR=$(dirname "$SERVER_JS")

# Bring static + public into standalone dir
cp -r .next/static "$APP_DIR/.next/static"
cp -r public       "$APP_DIR/public"

echo -e "${GREEN}Build successful${NC}"

# Step 2: Package
echo -e "${YELLOW}Step 2: Packaging...${NC}"
cd "$APP_DIR"
# --no-xattrs: strip macOS extended attributes (com.apple.provenance etc.)
# so GNU tar on the Linux server doesn't warn per file during extraction.
COPYFILE_DISABLE=1 tar --no-xattrs -czf /tmp/cognera-web-deploy.tar.gz .
cd "$REPO_ROOT"
DEPLOY_SIZE=$(du -sh /tmp/cognera-web-deploy.tar.gz | cut -f1)
echo -e "${GREEN}Package ready: $DEPLOY_SIZE${NC}"

# Step 3: Upload
echo -e "${YELLOW}Step 3: Uploading to server...${NC}"
$SCP_CMD /tmp/cognera-web-deploy.tar.gz "$REMOTE_HOST:/tmp/cognera-web-deploy.tar.gz"
echo -e "${GREEN}Upload complete${NC}"

# Step 4: Deploy on server
echo -e "${YELLOW}Step 4: Deploying on server...${NC}"
$SSH_CMD "$REMOTE_HOST" bash <<'ENDSSH'
set -euo pipefail

REMOTE_DIR="/var/www/cognera-web"
SERVICE_NAME="cognera-web"
TS=$(date -u +%Y%m%d-%H%M%S)
STAGE="/var/www/cognera-web-stage-$TS"

if [ ! -d "$REMOTE_DIR" ]; then
    echo "ERROR: $REMOTE_DIR does not exist. Run ./deploy/setup.sh first." >&2
    exit 1
fi

if [ ! -f "$REMOTE_DIR/.env" ]; then
    echo "ERROR: $REMOTE_DIR/.env missing. Run ./deploy/setup.sh first." >&2
    exit 1
fi

# Extract new release into a staging dir (never touch live dir until ready)
mkdir -p "$STAGE"
tar xzf /tmp/cognera-web-deploy.tar.gz -C "$STAGE"

# Carry over the existing .env
cp -p "$REMOTE_DIR/.env" "$STAGE/.env"

# Stop service, swap directories, start service
systemctl stop "$SERVICE_NAME" 2>/dev/null || true

BACKUP="/var/www/cognera-web-backup-$TS"
mv "$REMOTE_DIR" "$BACKUP"
mv "$STAGE"      "$REMOTE_DIR"

systemctl start "$SERVICE_NAME"

# Prune to keep only the 3 newest backups (never touches anything outside pattern)
ls -1dt /var/www/cognera-web-backup-* 2>/dev/null | tail -n +4 | xargs -r rm -rf

echo "Deploy applied. Backup at: $BACKUP"
ENDSSH

# Step 5: Verify
echo -e "${YELLOW}Step 5: Verifying...${NC}"
sleep 3
$SSH_CMD "$REMOTE_HOST" bash <<ENDSSH
set -u
if systemctl is-active --quiet $SERVICE_NAME; then
    echo "Service: RUNNING"
else
    echo "Service: FAILED"
    journalctl -u $SERVICE_NAME --no-pager -n 30
    exit 1
fi

HTTP_CODE=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$PORT/)
echo "Local HTTP: \$HTTP_CODE"
if [ "\$HTTP_CODE" != "200" ]; then
    echo "WARNING: expected 200, got \$HTTP_CODE"
fi
ENDSSH

# Cleanup local tarball
rm -f /tmp/cognera-web-deploy.tar.gz

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Domain:  ${YELLOW}https://$DOMAIN${NC}"
echo -e "Port:    ${YELLOW}$PORT${NC}"
echo -e "Service: ${YELLOW}$SERVICE_NAME${NC}"
echo ""
echo -e "Useful commands:"
echo -e "  Status:  ${YELLOW}$SSH_CMD $REMOTE_HOST 'systemctl status $SERVICE_NAME'${NC}"
echo -e "  Logs:    ${YELLOW}$SSH_CMD $REMOTE_HOST 'tail -f /var/log/$SERVICE_NAME/error.log'${NC}"
echo -e "  Restart: ${YELLOW}$SSH_CMD $REMOTE_HOST 'systemctl restart $SERVICE_NAME'${NC}"
