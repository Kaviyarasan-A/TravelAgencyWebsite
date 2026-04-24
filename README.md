# Wanderlux Travel

Production-ready full-stack website for a modern travel agency offering:

1. **World Tours & Holiday Packages** — inspired by gtholidays.in
2. **Study Abroad** — overseas education counselling
3. **Business Setup Abroad** — company formation in UAE, Singapore, USA, UK & more

Built with **React (Vite) + Tailwind + Framer Motion** on the frontend and **Node.js + Express + Nodemailer** on the backend. All enquiry/booking forms are emailed straight to **kaviyarasanarchuamy@gmail.com**.

---

## 🗂️ Project structure

```
TravelAgencyWebsite/
├── client/                React + Vite + Tailwind SPA
│   ├── src/
│   │   ├── components/    Navbar, Footer, Hero, PackageCard, BookingModal, ContactForm, …
│   │   ├── pages/         Home, Packages, PackageDetail, StudyAbroad, BusinessSetup, About, Contact
│   │   ├── api.js         Tiny fetch wrapper
│   │   └── data.js        Packages, destinations, testimonials, blogs, study/business data
│   ├── index.html
│   └── package.json
├── server/                Express + Nodemailer API
│   ├── server.js          All routes: /api/contact, /api/booking, /api/study, /api/business, …
│   ├── .env.example       SMTP + recipient config
│   └── package.json
├── legacy-static/         Old pre-React static version (kept as a reference)
├── package.json           Monorepo orchestrator (concurrently)
└── README.md
```

---

## ⚡ Quick start

### 1. Install everything

```bash
# From the project root
npm install            # installs root (concurrently)
npm run install:all    # installs root + server + client in one go
```

(Or manually: `npm install && npm install --prefix server && npm install --prefix client`.)

### 2. Configure the server

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in the SMTP credentials. We recommend **Gmail + App Password**:

1. Sign into the Google account `kaviyarasanarchuamy@gmail.com`.
2. Turn on **2-Step Verification** → https://myaccount.google.com/security
3. Create an **App Password** → https://myaccount.google.com/apppasswords
   - Pick app name: `Wanderlux Server`
   - Copy the 16-character password
4. Paste it into `SMTP_PASS` (spaces are fine, we strip them).

Default `.env`:
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
TO_EMAIL=kaviyarasanarchuamy@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=kaviyarasanarchuamy@gmail.com
SMTP_PASS=xxxxxxxxxxxxxxxx   # ← 16-char Google App Password
FROM_NAME=Wanderlux Travel
FROM_EMAIL=kaviyarasanarchuamy@gmail.com
```

> **Alternatives:** Brevo, Resend, SendGrid, Mailgun, Zoho — any SMTP host works. Just update `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.

### 3. Run both apps in dev

```bash
npm run dev
```

This starts:
- **API server** → http://localhost:5000 (logs: `[server] Wanderlux API running …`)
- **Vite client** → http://localhost:5173 (auto-opens)

In dev the client proxies `/api/*` to the server — no CORS config needed.

### 4. Test the mailer

- Open http://localhost:5173
- Fill the contact form (or the hero search, booking modal, study/business forms, newsletter)
- You should receive a styled HTML email at `kaviyarasanarchuamy@gmail.com` within seconds.
- Check the API health endpoint directly: http://localhost:5000/api/health

---

## 🏗️ Production build

### Build the client

```bash
npm run build
```

This creates `client/dist/`. Deploy it to any static host (Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, Nginx). Set the environment variable **`VITE_API_URL`** to the URL of the deployed API, e.g.:

```env
VITE_API_URL=https://api.wanderlux-travel.com
```

### Run the server in production

```bash
# On your server / Render / Railway / Fly / VPS
cd server
npm install --omit=dev
NODE_ENV=production node server.js
```

Make sure `CORS_ORIGIN` includes the exact client URL (comma-separated for multiple):

```env
CORS_ORIGIN=https://wanderlux-travel.com,https://www.wanderlux-travel.com
```

### Recommended hosts

| Part | Free / cheap option |
|------|---------------------|
| Client (static) | Netlify, Vercel, Cloudflare Pages |
| Server (Node)   | Render (free web service), Railway, Fly.io, DigitalOcean App Platform |
| Emails          | Gmail App Password (free, 500/day) → Brevo/Resend (1k+/day) |

---

## 📨 Form endpoints (all email to `TO_EMAIL`)

| Route | Purpose | Required fields |
|-------|---------|-----------------|
| `POST /api/contact`    | General contact / enquiry          | `name, email, message` |
| `POST /api/booking`    | Package booking (from modal)       | `name, email, phone, travel_date` |
| `POST /api/study`      | Study abroad counselling           | `name, email, phone` |
| `POST /api/business`   | Business setup enquiry             | `name, email, phone` |
| `POST /api/search`     | Hero search (packages/flights/…)   | `destination` |
| `POST /api/newsletter` | Newsletter subscribe               | `email` |

All endpoints:
- Validate input + email format
- Trap bots via a hidden `website` honeypot field
- Are rate-limited (20 submissions / 10 min per IP)
- Send a nicely formatted HTML email to `TO_EMAIL`
- Set `Reply-To: <user email>` so you can reply directly

---

## 🔍 SEO essentials (already in place)

- Dynamic `<title>` + `<meta description>` per page via `react-helmet-async`
- Open Graph + Twitter card tags
- JSON-LD `TravelAgency` structured data
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`)
- Responsive, mobile-first, fast (Vite code-splitting, lazy-loaded images/pages)
- `prefers-reduced-motion` honored
- Accessibility: aria labels, focus-visible outlines, dialog semantics, keyboard close (Esc)

### Before you go live

- Replace placeholder images (Unsplash URLs in [client/src/data.js](client/src/data.js)) with your own licensed photos.
- Update `BRAND` in [client/src/data.js](client/src/data.js) — phone, WhatsApp number, address, social URLs.
- Update the canonical domain in [client/index.html](client/index.html) + `<meta>` tags.
- Add Google Search Console + submit your sitemap.
- (Optional) Add Google Analytics / Plausible to `client/index.html`.

---

## 🎨 Customization cheat-sheet

| What | Where |
|------|-------|
| Colors (orange primary) | [client/tailwind.config.js](client/tailwind.config.js) → `theme.extend.colors.brand` |
| Brand name / phone / email / social | [client/src/data.js](client/src/data.js) → `BRAND` |
| Packages (add/edit/remove) | [client/src/data.js](client/src/data.js) → `PACKAGES` |
| Destinations grid | [client/src/data.js](client/src/data.js) → `DESTINATIONS` |
| Study abroad countries | [client/src/data.js](client/src/data.js) → `STUDY_COUNTRIES` |
| Business setup countries | [client/src/data.js](client/src/data.js) → `BUSINESS_COUNTRIES` |
| Testimonials | [client/src/data.js](client/src/data.js) → `TESTIMONIALS` |
| Blog posts | [client/src/data.js](client/src/data.js) → `BLOGS` |
| Recipient email | [server/.env](server/.env) → `TO_EMAIL` |

---

## 🧪 Scripts reference

```bash
npm run dev          # Run client + server concurrently (development)
npm run dev:client   # Client only
npm run dev:server   # Server only
npm run build        # Build client → client/dist
npm run start        # Start server in production mode
npm run install:all  # Install all deps (root + client + server)
```

---

## 🔐 Notes & gotchas

- **Never commit `server/.env`** — it contains your SMTP password. The `.gitignore` already excludes it.
- Gmail App Password = 16 characters, no spaces required when saving (we strip spaces at runtime either way).
- The CORS allowlist is `CORS_ORIGIN` in `.env`. In dev it defaults to Vite's `http://localhost:5173`.
- Client-side routes (`/packages`, `/study-abroad`, etc.) require a **SPA fallback** on static hosts. Netlify/Vercel handle this automatically; on Nginx add `try_files $uri /index.html;`.

---

**Questions / issues?** Email `kaviyarasanarchuamy@gmail.com`.
