# Deploy This or That on AWS

App: **Next.js 16 + SQLite (`better-sqlite3`) + Auth.js**. Pick **one** path.

| Path | Best when | Notes |
|---|---|---|
| **A. Lightsail** | Fastest host, keep SQLite | Persistent disk on the instance |
| **B. App Runner** | Prefer containers | SQLite is **ephemeral** (resets on redeploy) |

**SQLite:** one instance only. Redeploy without persistent disk wipes votes.

---

## Env vars (all paths)

```text
AUTH_SECRET=<required — openssl rand -base64 32>
AUTH_URL=https://<YOUR_DOMAIN>
AUTH_GITHUB_ID=<optional>
AUTH_GITHUB_SECRET=<optional>
NODE_ENV=production
PORT=3000
```

GitHub OAuth callback: `https://<YOUR_DOMAIN>/api/auth/callback/github`

Local smoke before deploy:

```bash
cp .env.example .env.local
# set AUTH_SECRET and AUTH_URL
npm ci && npm run build && npm run start
```

---

## Path A — Amazon Lightsail (recommended first)

### 1. Create instance

1. Console → **Lightsail** → Create instance.
2. Platform: **Linux/Unix**; blueprint **Node.js** or **OS Only** (Ubuntu 22.04/24.04).
3. Size: ≥1 GB RAM (use swap if 512 MB).
4. Create → optional **static IP** + DNS A record.

Firewall: allow **80**, **443** (and SSH for you).

### 2. Install & build (SSH)

```bash
ssh -i <your-lightsail-key>.pem ubuntu@<STATIC_OR_PUBLIC_IP>

sudo apt update && sudo apt install -y git nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs   # Node 22+ required by better-sqlite3@13

git clone https://github.com/hastings2020/this-or-that.git
cd this-or-that
git checkout <branch-you-want>   # e.g. main after merge

npm ci
cat > .env.production.local <<'EOF'
AUTH_SECRET=paste-secret-here
AUTH_URL=https://your-domain.com
NODE_ENV=production
PORT=3000
EOF

npm run build
```

### 3. systemd

```bash
sudo tee /etc/systemd/system/this-or-that.service >/dev/null <<'EOF'
[Unit]
Description=This or That
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/this-or-that
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm run start
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now this-or-that
sudo systemctl status this-or-that
```

SQLite lives under `data/` on the instance disk. Use Lightsail **snapshots** for backups.

### 4. Nginx + HTTPS

```bash
sudo tee /etc/nginx/sites-available/this-or-that >/dev/null <<'EOF'
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
EOF

sudo ln -sf /etc/nginx/sites-available/this-or-that /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo systemctl restart this-or-that
```

### 5. Updates later

```bash
cd ~/this-or-that
git pull
npm ci
npm run build
sudo systemctl restart this-or-that
```

---

## Path B — AWS App Runner (container)

Repo includes a root `Dockerfile` (Node **22**, `npm ci` → `npm run build` → `npm run start`, port **3000**, build tools for `better-sqlite3`). Node 22 is required by `better-sqlite3@13`.

### 1. Build & push to ECR

```bash
aws ecr get-login-password --region <region> \
  | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com

docker build -t this-or-that .
docker tag this-or-that:latest <account>.dkr.ecr.<region>.amazonaws.com/this-or-that:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/this-or-that:latest
```

Create the ECR repo `this-or-that` in the console (or `aws ecr create-repository`) first if needed.

### 2. Create App Runner service

1. Console → **App Runner** → Create service → **Container registry** → Amazon ECR.
2. Port: **3000**.
3. Env: `AUTH_SECRET`, `AUTH_URL` (App Runner URL first, e.g. `https://xxxxx.awsapprunner.com`), optional GitHub OAuth.
4. CPU/memory: start at **1 vCPU / 2 GB**.
5. Optional: auto-deploy on new ECR push.

### 3. Custom domain (optional)

App Runner → Custom domains → ACM DNS validation → set `AUTH_URL` to that domain → new revision.

### 4. Data caveat

App Runner storage is **ephemeral**. Fine for demos; for durable votes use Path A, EFS+ECS, or migrate off SQLite.

Local image check:

```bash
docker build -t this-or-that .
docker run --rm -p 3000:3000 \
  -e AUTH_SECRET="$(openssl rand -base64 32)" \
  -e AUTH_URL=http://localhost:3000 \
  this-or-that
```

---

## Smoke test after deploy

- [ ] `/` loads
- [ ] Vote on a question (nickname or signed-in); counts update; no double-count
- [ ] Create question works
- [ ] `/register` + `/signin` if using auth
- [ ] Team pack → share link → results
- [ ] `AUTH_URL` matches browser origin (cookies break if wrong)
- [ ] HTTPS OK

---

## Minimal AWS resources

- **Path A:** Lightsail instance + static IP + (optional) DNS + snapshots  
- **Path B:** ECR + App Runner (+ optional custom domain)

No Redis, SQS, or S3 required for MVP.

For serverless (Amplify / OpenNext), migrate off local SQLite first — see project Context docs if available.
