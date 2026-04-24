# Deployment Guide — Trip with uz

Three paths, pick one. All assume the repo is pushed to GitHub.

| Path | Cost (starter) | Difficulty | Best for |
|---|---|---|---|
| **A. Vercel (client) + Render (server)** | Free tier works | Easy | Most people. Recommended. |
| **B. Railway (both)** | $5/mo credit free | Easy | All-in-one, fewer moving parts |
| **C. Self-hosted Docker** | Your VPS cost | Medium | Full control, custom domains |

---

## 🔐 Pre-flight — do these ONCE before deploying

### 1. Generate production secrets

```bash
# Strong admin password (copy output)
node -e "console.log(require('crypto').randomBytes(12).toString('base64'))"

# Strong admin session secret (copy output)
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 2. Decide your production domain
Examples below use `tripwithuz.com`. Replace with whatever you own (GoDaddy, Namecheap, Cloudflare Registrar).

### 3. Gmail App Password
If not already done: https://myaccount.google.com/apppasswords → create one for "Trip with uz Server" → copy the 16-char password.

### 4. Real UPI ID
Confirm the UPI VPA that receives booking payments (e.g., `tripwithuz@okicici`). Test once with a ₹1 transfer to make sure it works.

---

## Path A — Vercel + Render (recommended)

**Architecture:**
```
tripwithuz.com          → Vercel   (React client, global CDN)
api.tripwithuz.com      → Render   (Express API)
```

### Step 1: Deploy the backend on Render

1. Go to https://render.com → New → **Web Service** → connect GitHub → pick `TravelAgencyWebsite`.
2. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Region:** Singapore (closest to India)
   - **Plan:** Starter ($7/mo) — needed so the server doesn't sleep. Free tier works for testing.
3. Add **Environment Variables** (Settings → Environment):
   ```
   NODE_ENV=production
   PORT=5000
   SITE_URL=https://tripwithuz.com
   CORS_ORIGIN=https://tripwithuz.com,https://www.tripwithuz.com

   TO_EMAIL=kaviyarasanaruchamy@gmail.com,tripwithuzofficial@gmail.com
   WHATSAPP_NUMBER=919585680636

   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=kaviyarasanaruchamy@gmail.com
   SMTP_PASS=<16-char-gmail-app-password-no-spaces>
   FROM_NAME=Trip with uz
   FROM_EMAIL=tripwithuzofficial@gmail.com

   ADMIN_USER=admin
   ADMIN_PASS=<the-strong-password-you-generated>
   ADMIN_SECRET=<the-strong-secret-you-generated>

   UPI_ID=tripwithuz@okicici
   UPI_PAYEE_NAME=Trip with uz
   ```
4. **Disks** (critical — for DB persistence):
   - Settings → Disks → Add Disk
   - Name: `db`, Mount Path: `/opt/render/project/src/server/db`, Size: 1 GB
   - Without this, every deploy wipes your bookings and blogs.
5. Click **Create Web Service**. Wait 3–5 min. URL will be `https://your-app.onrender.com`.
6. **Custom domain:** Settings → Custom Domains → add `api.tripwithuz.com`. Follow the CNAME instructions on your DNS provider.

### Step 2: Deploy the client on Vercel

1. Go to https://vercel.com → New Project → import `TravelAgencyWebsite`.
2. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add **Environment Variable**:
   ```
   VITE_API_URL=https://api.tripwithuz.com
   ```
4. Click **Deploy**. Wait 1–2 min.
5. **Custom domain:** Settings → Domains → add `tripwithuz.com` + `www.tripwithuz.com`.
   Vercel shows the exact A/CNAME records to add at your DNS provider. Usually takes 5–30 min for DNS propagation.

### Step 3: Verify end-to-end

- Open `https://tripwithuz.com` — hero should load
- Open `https://tripwithuz.com/blog` — 21 blog posts visible
- Open `https://tripwithuz.com/admin` — log in with your production password
- Submit a test booking — check **both** Gmail inboxes
- Visit `https://api.tripwithuz.com/sitemap.xml` — XML with 40+ URLs

---

## Path B — Railway (both services, one dashboard)

1. https://railway.com → New Project → Deploy from GitHub → pick `TravelAgencyWebsite`.
2. Railway auto-detects both services. For each:
   - **server** service: Root directory `/server`, Start command `node server.js`, add all env vars from Path A step 1.3. Add a **persistent volume** mounted at `/app/db`.
   - **client** service: Root directory `/client`, Build command `npm run build`, set `VITE_API_URL` to the server service's public URL.
3. Add custom domains in each service's Settings → Domains. Railway generates free `*.up.railway.app` URLs too.

**Pros:** One dashboard, easier for beginners.
**Cons:** $5 free credit runs out; after that ~$5–15/mo per service.

---

## Path C — Self-hosted Docker (full control)

Files already in the repo:
- [server/Dockerfile](server/Dockerfile)
- [client/Dockerfile](client/Dockerfile) + [client/nginx.conf](client/nginx.conf)
- [docker-compose.yml](docker-compose.yml)

On any Linux VPS (DigitalOcean ₹400/mo droplet works):

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh

# 2. Clone repo
git clone https://github.com/Kaviyarasan-A/TravelAgencyWebsite.git
cd TravelAgencyWebsite

# 3. Create .env with production values (see Path A step 1.3)
nano server/.env

# 4. Build + run
docker compose up -d --build

# 5. Verify
curl http://localhost/api/health
```

Backend on `:5000`, client on `:80`. Put Caddy or nginx in front to add HTTPS with Let's Encrypt:

```bash
# Simplest HTTPS — one line with Caddy
docker run -d --name caddy --restart unless-stopped \
  -p 80:80 -p 443:443 \
  -v caddy_data:/data \
  -v $(pwd)/Caddyfile:/etc/caddy/Caddyfile \
  caddy
```

Minimal `Caddyfile`:
```
tripwithuz.com, www.tripwithuz.com {
    reverse_proxy localhost:80
}
api.tripwithuz.com {
    reverse_proxy localhost:5000
}
```

Caddy auto-issues + renews SSL certs from Let's Encrypt.

---

## 🌱 Post-deploy checklist

- [ ] Hit `https://tripwithuz.com` — loads
- [ ] Hit `https://api.tripwithuz.com/api/health` — `{ ok: true, smtp: true }`
- [ ] Submit a contact form — both Gmail addresses receive it
- [ ] Log into `/admin` with production password
- [ ] Create a test booking through the UI → verify UPI link generates correctly
- [ ] Upload the real UPI QR / test with ₹1 payment
- [ ] Submit sitemap to Google Search Console
- [ ] Create Google Business Profile (business.google.com) for Salem address
- [ ] Set up Google Analytics / Plausible (optional)
- [ ] Enable HTTPS redirect everywhere
- [ ] Schedule DB backups (Render: automatic; Docker: cron script that zips `server/db/` weekly)
- [ ] Update `BRAND.*` social URLs in `client/src/data.js` if social handles changed
- [ ] Rotate the Gmail App Password every 6 months

---

## 🚨 Common issues

### "CORS error" in browser console
Your `CORS_ORIGIN` env var doesn't include the domain the browser is connecting from. Add both `https://tripwithuz.com` AND `https://www.tripwithuz.com` if you have both.

### "Login failed" on /admin
- `ADMIN_SECRET` on server and client don't need to match — the secret is server-only
- Check that `VITE_API_URL` on the client points to the correct backend URL
- Check backend logs for `[auth] 401 on POST /api/admin/login`

### Emails not arriving
- `SMTP_PASS` is the 16-character Gmail App Password, NOT your regular Gmail password
- 2-Step Verification must be enabled on the Gmail account before you can generate App Passwords
- Check spam folder
- Check backend logs for `[mail] SMTP verify failed`

### DB wiped after deploy
You didn't mount a persistent volume. Bookings/blogs/ads live in `server/db/*.json`. This MUST be a mounted volume on Render/Railway/Docker.

### Videos not playing in ads
Pixabay URLs return 404 from some networks. Use Pexels direct URLs (already seeded). If a video still fails, the image fallback shows — users won't see broken players.

---

## 📞 Quick reference

- Repo: https://github.com/Kaviyarasan-A/TravelAgencyWebsite
- Admin panel: https://tripwithuz.com/admin
- API health: https://api.tripwithuz.com/api/health
- Sitemap: https://tripwithuz.com/sitemap.xml
