# Deploying to a DigitalOcean droplet

Topology: one domain, Nginx reverse-proxies `/api` → NestJS (`:3000`) and `/` →
Angular SSR (`:4000`); PostgreSQL runs locally (loopback). Both Node apps run as
**systemd** services. **GitHub Actions** builds on push to `main` and ships
artifacts over SSH (`.github/workflows/deploy.yml`).

Why a single origin: the browser calls the API at a relative `/api` path and auth
is an httpOnly cookie (`sameSite=lax`, `secure` in prod) — so web + API must share
one HTTPS origin. HTTPS is **required** for login (the cookie is `Secure`).

---

## 1. One-time droplet provisioning

Assumes Ubuntu 22.04+, x64 (matches the GitHub x64 runner — see the arch note).

```bash
# --- as root ---
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs
apt install -y nginx postgresql rsync

# deploy user (owns the app dir, runs the services)
adduser --disabled-password --gecos "" deploy
mkdir -p /srv/portfolio && chown -R deploy:deploy /srv/portfolio

# --- Postgres: create db + user ---
sudo -u postgres psql <<'SQL'
CREATE USER portfolio WITH PASSWORD 'CHANGE_ME_STRONG';
CREATE DATABASE portfolio_blog OWNER portfolio;
SQL
```

### Swap (only if the droplet has < 2 GB RAM)
Not needed for the app at runtime, but harmless. The heavy Angular build runs in
CI, so a 1 GB droplet is fine to *run* both apps.

## 2. App env + secrets on the droplet

```bash
# as deploy
mkdir -p /srv/portfolio/apps/api
# copy the template and fill in real values (DATABASE_URL, JWT_SECRET, ADMIN_*)
scp apps/api/.env.production.example deploy@DROPLET:/srv/portfolio/apps/api/.env
# then edit /srv/portfolio/apps/api/.env on the droplet:
#   DATABASE_URL password must match the Postgres user above
#   JWT_SECRET: openssl rand -hex 48
#   WEB_ORIGIN + ADMIN_* set for your domain
```

## 3. systemd services

```bash
# as root — edit the two unit files first to set your domain in portfolio-web
cp deploy/systemd/portfolio-api.service /etc/systemd/system/
cp deploy/systemd/portfolio-web.service /etc/systemd/system/   # set NG_ALLOWED_HOSTS
systemctl daemon-reload
systemctl enable portfolio-api portfolio-web
# (they'll start once the first deploy has shipped dist/ + node_modules)
```

Let the `deploy` user restart the services without a password (used by CI):
```bash
# /etc/sudoers.d/portfolio  (visudo -f /etc/sudoers.d/portfolio; chmod 440)
# The deploy workflow restarts BOTH services in one invocation, so the combined
# form must be whitelisted too. Use the real binary path (/usr/bin/systemctl on
# Ubuntu 24.04 — /bin is merged into /usr/bin), or sudo prompts for a password.
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart portfolio-api portfolio-web, /usr/bin/systemctl restart portfolio-api, /usr/bin/systemctl restart portfolio-web
```

## 4. Nginx + HTTPS

```bash
cp deploy/nginx/portfolio.conf /etc/nginx/sites-available/portfolio   # set server_name
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# TLS (Let's Encrypt) — rewrites the config to add 443 + redirect
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Firewall: allow OpenSSH + Nginx Full only (`ufw allow OpenSSH; ufw allow 'Nginx Full'; ufw enable`).
Keep 3000/4000/5432 loopback-only (they already bind to 127.0.0.1 via config).

## 5. GitHub Actions secrets

Repo → Settings → Secrets and variables → Actions:

| Secret | Value |
| --- | --- |
| `DEPLOY_HOST` | droplet IP / hostname |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_SSH_KEY` | a private key whose public key is in `deploy`'s `~/.ssh/authorized_keys` |

## 6. First deploy + seed admin

Once 1–5 are done, push to `main` (or run the workflow manually). It builds,
rsyncs `dist/` + `node_modules`, runs `prisma migrate deploy`, and restarts both
services.

The migration runs automatically, but the **admin user is seeded once, manually**
(it's not in the deploy workflow, to avoid re-running on every deploy):

```bash
ssh deploy@DROPLET 'cd /srv/portfolio && \
  ./node_modules/.bin/dotenv -e apps/api/.env -- \
  ./node_modules/.bin/tsx apps/api/prisma/seed.ts'
```

Then log in at `https://yourdomain.com/admin/login` with `ADMIN_EMAIL` /
`ADMIN_PASSWORD` and publish posts (they seed as drafts).

---

## Notes & gotchas

- **Arch must match.** The workflow ships the Prisma client generated on the x64
  GitHub runner. DO standard droplets are x64 ✓. If yours is ARM (Ampere), either
  use an ARM runner or add a `prisma generate` step over SSH on the droplet.
- **`NG_ALLOWED_HOSTS`** in `portfolio-web.service` must list your exact domain(s),
  or Angular's SSR engine rejects the request and falls back to client rendering
  (loses SSR/SEO).
- **HTTPS before login works** — the auth cookie is `Secure` in production.
- **Backups** are yours to run (self-hosted Postgres): e.g. a nightly
  `pg_dump portfolio_blog` cron to off-box storage.
- **Leaner alternative** to shipping `node_modules`: rsync only `dist/` +
  `package*.json` + `apps/api/prisma`, and run `npm ci --omit=dev && npx prisma
  generate` on the droplet instead. Trades a per-deploy install for a smaller
  transfer and no arch coupling.
- **Zero-downtime** isn't configured (rsync `--delete` + restart = a ~1s blip).
  Fine for a personal site; use a release-dir + symlink swap if you need it.
