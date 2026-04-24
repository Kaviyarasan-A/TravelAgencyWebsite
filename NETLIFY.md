# Deploying to Netlify — Step-by-Step (Beginner-Friendly)

> **TL;DR:** Netlify hosts the frontend (free). Render hosts the backend (free). You set both up once, takes ~20 min total.

---

## Why you need two services

Netlify is only for static sites and tiny serverless functions. Your app has an Express server with a JSON database — it must live on a real Node.js host. Render's free tier is perfect for it.

```
┌────────────────────────────────────────────────────────────────┐
│  User opens tripwithuz.com                                     │
│       │                                                        │
│       ▼                                                        │
│  ┌─────────────┐                                               │
│  │   NETLIFY   │  ← React frontend (HTML/CSS/JS)               │
│  │  (frontend) │                                               │
│  └──────┬──────┘                                               │
│         │ fetches /api/*                                       │
│         ▼                                                      │
│  ┌─────────────┐                                               │
│  │   RENDER    │  ← Express backend (DB, emails, UPI, admin)   │
│  │  (backend)  │                                               │
│  └─────────────┘                                               │
└────────────────────────────────────────────────────────────────┘
```

---

## Part 1 — Deploy the backend first (Render, ~10 min)

Why first? The frontend needs the backend's URL before it can be built.

### Step 1.1 — Create a Render account

1. Go to **https://render.com**
2. Click **"Get Started for Free"** → **Sign in with GitHub**
3. Authorize Render to access your GitHub repositories

### Step 1.2 — Create a new Web Service

1. On the Render dashboard, click **"+ New"** → **"Web Service"**
2. Click **"Connect a repository"** — pick **Kaviyarasan-A/TravelAgencyWebsite**
3. Click **"Connect"**

### Step 1.3 — Configure the service

Fill in:

| Field | Value |
|---|---|
| **Name** | `tripwithuz-api` |
| **Region** | **Singapore** (closest to India = faster) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | **Free** to start (can upgrade later) |

### Step 1.4 — Add environment variables

Scroll down to **"Environment Variables"** → **"Add Environment Variable"**. Add each one:

```
NODE_ENV=production
PORT=5000
SITE_URL=https://tripwithuz.com
CORS_ORIGIN=https://tripwithuz.com,https://www.tripwithuz.com,https://YOUR-NETLIFY-PREVIEW-URL.netlify.app

TO_EMAIL=kaviyarasanaruchamy@gmail.com,tripwithuzofficial@gmail.com
WHATSAPP_NUMBER=919585680636

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=kaviyarasanaruchamy@gmail.com
SMTP_PASS=baywfvorygjjtkjw
FROM_NAME=Trip with uz
FROM_EMAIL=tripwithuzofficial@gmail.com

ADMIN_USER=admin
ADMIN_PASS=<GENERATE A STRONG PASSWORD — see below>
ADMIN_SECRET=<GENERATE A LONG RANDOM STRING — see below>

UPI_ID=tripwithuz@okicici
UPI_PAYEE_NAME=Trip with uz
```

**Generate strong secrets locally first** (in your terminal):
```bash
# Strong admin password — save this in a password manager!
node -e "console.log(require('crypto').randomBytes(12).toString('base64'))"

# Admin session secret — copy this straight into Render
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### Step 1.5 — Add a persistent disk (CRITICAL)

Without this, every deploy wipes your bookings and blogs.

1. Scroll down to **"Disks"** → **"Add Disk"**
2. Fill in:
   - **Name:** `db`
   - **Mount Path:** `/opt/render/project/src/server/db`
   - **Size:** `1 GB`
3. Click **"Add"**

### Step 1.6 — Deploy

1. Click **"Create Web Service"** at the bottom
2. Wait 3–5 minutes. You'll see logs scroll by.
3. When the build finishes you'll see: `[server] Listening on ...`
4. Copy your backend URL at the top (looks like `https://tripwithuz-api.onrender.com`)

### Step 1.7 — Verify the backend works

Visit **https://tripwithuz-api.onrender.com/api/health** in your browser.

You should see:
```json
{"ok":true,"service":"tripwithuz-api","smtp":true,...}
```

If `smtp: false` — your Gmail App Password is wrong. Update `SMTP_PASS` in Render's env vars.

**Save this backend URL. You'll need it in Part 2.**

---

## Part 2 — Deploy the frontend (Netlify, ~10 min)

### Step 2.1 — Create a Netlify account

1. Go to **https://netlify.com**
2. Click **"Sign up"** → **Sign up with GitHub**
3. Authorize Netlify

### Step 2.2 — Import your repo

1. On the dashboard click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Find and click **TravelAgencyWebsite**

### Step 2.3 — Configure the build

Netlify will **auto-detect** most settings thanks to the `netlify.toml` file I committed. It should show:

| Setting | Auto-filled value |
|---|---|
| Base directory | `client` |
| Build command | `npm install && npm run build` |
| Publish directory | `client/dist` |

Leave these as-is.

### Step 2.4 — Add the environment variable

Scroll down to **"Add environment variables"** → click **"New variable"**:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://tripwithuz-api.onrender.com` (← your Render URL from Step 1.6) |

### Step 2.5 — Deploy

1. Click **"Deploy site"**
2. Wait 2–3 minutes for the first build
3. Netlify will give you a random URL like `https://cozy-lime-fractal-abc123.netlify.app`

### Step 2.6 — Update CORS on Render

Now the backend needs to know your Netlify URL is allowed.

1. Go back to **Render dashboard** → your `tripwithuz-api` service → **Environment** tab
2. Edit `CORS_ORIGIN` — add your Netlify URL at the end:
   ```
   CORS_ORIGIN=https://tripwithuz.com,https://www.tripwithuz.com,https://cozy-lime-fractal-abc123.netlify.app
   ```
3. Click **"Save changes"**. Render will automatically redeploy (~1 min).

### Step 2.7 — Test it end-to-end

1. Visit your Netlify URL — the homepage should load
2. Go to `/blog` — 21 blog posts should be there
3. Go to `/admin` → log in with your `ADMIN_PASS` from Step 1.4
4. Submit a contact form — **both Gmail inboxes should get an email within 30 sec**

If the blog or admin page says "Login failed" / "Could not load" → CORS issue. Double-check Step 2.6.

---

## Part 3 — Connect your custom domain

If you own `tripwithuz.com` (from GoDaddy, Namecheap, Cloudflare Registrar, etc.):

### On Netlify (frontend)
1. Netlify dashboard → your site → **Domain management** → **Add custom domain**
2. Enter `tripwithuz.com`
3. Netlify shows you the DNS records to add at your registrar. Add them.
4. Also add `www.tripwithuz.com` (same process)
5. SSL certificate is auto-issued in ~15 minutes

### On Render (backend)
1. Render dashboard → your service → **Settings** → **Custom Domains**
2. Add `api.tripwithuz.com`
3. Render shows you a CNAME record to add at your registrar
4. Wait 5–15 min for DNS, SSL auto-issues

### Update the URLs
1. **Netlify env var:** change `VITE_API_URL` to `https://api.tripwithuz.com` → click **Deploy → Redeploy site**
2. **Render env var:** update `CORS_ORIGIN` to just `https://tripwithuz.com,https://www.tripwithuz.com` → save

Done. You're now live on your real domain.

---

## Part 4 — Must-do after launch

- [ ] Submit sitemap to Google: https://search.google.com/search-console → add `tripwithuz.com` → Sitemaps → `sitemap.xml`
- [ ] Create Google Business Profile: https://business.google.com (critical for "travel agency Salem" ranking)
- [ ] Test a real booking: make a quotation → confirm → pay ₹1 via UPI → verify it reaches your account
- [ ] Rotate Gmail App Password after 6 months
- [ ] Make a backup of `server/db/` every 2 weeks (Render dashboard → Disks → Snapshots)

---

## Common issues + fixes

### ❌ "Failed to load resource" / "Network error" on the frontend
**Cause:** Frontend can't reach backend.
**Fix:** Check `VITE_API_URL` is set correctly in Netlify. **Must start with `https://`**, no trailing slash.

### ❌ "CORS blocked by policy" in browser console
**Cause:** Backend's `CORS_ORIGIN` doesn't include your frontend URL.
**Fix:** Add your Netlify URL (or custom domain) to `CORS_ORIGIN` in Render. Save, wait 1 min.

### ❌ Render backend is "spinning up" slowly (30+ seconds)
**Cause:** Free tier sleeps after 15 min idle. First request after sleep takes ~30 sec.
**Fix:** Upgrade to Starter plan ($7/mo) → always-on.

### ❌ Netlify build fails: "Cannot find module"
**Cause:** `client/package.json` might be missing a dependency.
**Fix:** Locally run `cd client && npm install && npm run build` — if that works, commit + push and redeploy.

### ❌ Database lost after Render deploy
**Cause:** You forgot Step 1.5 (persistent disk).
**Fix:** Go to Render → your service → **Disks** → add the disk NOW. Any data added before will still be lost, but future data persists.

### ❌ Admin login says "Wrong username or password"
- `ADMIN_USER` is `admin` by default
- `ADMIN_PASS` is whatever you set in Step 1.4 — not the default `ChangeMe@2026`
- Check Render Environment tab to confirm the exact value

### ❌ Emails aren't sending
- Gmail requires **2-Step Verification ON** + a real **App Password** (16 chars, no spaces)
- Generate new one at https://myaccount.google.com/apppasswords
- Paste into `SMTP_PASS` in Render, save, wait 1 min for redeploy

---

## Quick costs

| Setup | Monthly cost |
|---|---|
| Netlify free + Render free | **₹0** — fine for testing, backend sleeps after idle |
| Netlify free + Render Starter | **₹580** ($7) — always-on, recommended |
| Custom domain (GoDaddy/Namecheap) | **₹800–1200/year** (one-time for the domain) |
| Gmail | **Free** |

**So you can be live for ~₹600/month once you have a domain.** No surprises.

---

## Need help?

If any step fails:
1. Screenshot the error
2. Copy the URL you're trying
3. Check Render logs (Render dashboard → your service → **Logs**) for server errors
4. Check browser console (F12) for frontend errors

DM with the screenshot and I'll debug specific issues. 95% of problems are env var typos.
