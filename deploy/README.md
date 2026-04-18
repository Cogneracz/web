# Cognera Web — Deployment

Production server: `root@46.224.104.44`
Domain: `cognera.cz`
Port: `3003`
Service: `cognera-web`
Install path: `/var/www/cognera-web`

## Files

- `setup.sh` — one-time server setup (idempotent). Creates dir, `.env` stub (with random secrets + SMTP config), installs systemd unit and nginx site. `--ssl` also issues a Let's Encrypt cert and switches nginx to HTTPS.
- `deploy.sh` — build locally, upload, atomic swap, restart, verify. Preserves `.env`. Keeps the 3 most recent backups under `/var/www/cognera-web-backup-*`.
- `cognera-web.service` — systemd unit.
- `cognera-web.nginx` — HTTPS nginx config.

## First-time deploy

```bash
./deploy/setup.sh            # creates dir, .env with secrets, systemd unit, HTTP nginx
./deploy/deploy.sh           # builds, uploads, starts the service
./deploy/setup.sh --ssl      # issues TLS cert and switches nginx to HTTPS
```

## Subsequent deploys

```bash
./deploy/deploy.sh
```

## SMTP configuration

`setup.sh` writes `SMTP_HOST=smtp.cognera.cz`, user `info@cognera.cz`, port 587 (STARTTLS). Edit `/var/www/cognera-web/.env` on the server to change credentials. The deploy script preserves `.env` across releases.

## Rollback

```bash
ssh root@46.224.104.44
systemctl stop cognera-web
ls -1dt /var/www/cognera-web-backup-*   # pick newest good one
mv /var/www/cognera-web /var/www/cognera-web-broken-$(date -u +%Y%m%d-%H%M%S)
mv /var/www/cognera-web-backup-YYYYMMDD-HHMMSS /var/www/cognera-web
systemctl start cognera-web
```

## Useful commands

```bash
ssh root@46.224.104.44 'systemctl status cognera-web'
ssh root@46.224.104.44 'tail -f /var/log/cognera-web/error.log'
ssh root@46.224.104.44 'systemctl restart cognera-web'
```
