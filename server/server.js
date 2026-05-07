/**
 * Trip with uz — Express API
 * -----------------------------------------------------------------
 * Public:    /api/contact /api/booking /api/study /api/business
 *            /api/search  /api/newsletter
 *            /api/packages     /api/packages/:slug
 *            /api/google-reviews   /api/health
 *
 * Admin (Bearer token required):
 *   POST   /api/admin/login
 *   GET    /api/admin/me
 *   POST   /api/admin/change-password
 *   GET    /api/admin/stats
 *   GET    /api/admin/activity
 *   GET    /api/admin/enquiries        [?q, ?status, ?type]
 *   GET    /api/admin/enquiries.csv    — CSV export
 *   PATCH  /api/admin/enquiries/:id
 *   DELETE /api/admin/enquiries/:id
 *   GET    /api/admin/packages
 *   POST   /api/admin/packages
 *   PATCH  /api/admin/packages/:id
 *   DELETE /api/admin/packages/:id
 *   GET    /api/admin/backup           — download full db as JSON
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';

import * as store from './lib/store.js';
import { issueToken, adminOnly } from './lib/auth.js';
import { verifyAdminCredentials, changeAdminPassword, getAdminCredentials } from './lib/adminStore.js';
import { buildMessage, waLink, sendViaCloudApi } from './lib/whatsapp.js';
import { SEED_PACKAGES } from './lib/seedPackages.js';
import { SEED_BLOGS } from './lib/seedBlogs.js';
import { SEED_ADS } from './lib/seedAds.js';
import { SEED_DESTINATIONS } from './lib/seedDestinations.js';
import { buildQuotation, describeOptions } from './lib/quotation.js';
import { buildUpiLink, upiConfig } from './lib/upi.js';

/* ---------------- Env validation ---------------- */
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';

function warnIf(cond, msg) { if (cond) console.warn(`[config] ${msg}`); }
function failIf(cond, msg) {
    if (cond) {
        console.error(`[config] FATAL: ${msg}`);
        if (IS_PROD) process.exit(1);
    }
}

failIf(!process.env.TO_EMAIL, 'TO_EMAIL missing in .env — enquiries cannot be delivered.');
failIf(!process.env.SMTP_USER || !process.env.SMTP_PASS, 'SMTP_USER / SMTP_PASS missing — email delivery will fail.');
warnIf(!process.env.ADMIN_SECRET || process.env.ADMIN_SECRET.length < 24,
    'ADMIN_SECRET is missing or too short — use a 32+ char random string in production.');
warnIf(IS_PROD && (process.env.ADMIN_PASS === 'ChangeMe@2026' || !process.env.ADMIN_PASS),
    'ADMIN_PASS is the default placeholder — change it before going live.');
warnIf(!process.env.WHATSAPP_API_TOKEN || !process.env.WHATSAPP_PHONE_ID,
    'WhatsApp Cloud API not configured — using wa.me click-to-chat fallback.');

/* ---------------- App bootstrap ---------------- */
const app = express();
app.disable('etag');
app.disable('x-powered-by');
const PORT = Number(process.env.PORT) || 5000;

app.use(helmet({ crossOriginResourcePolicy: false })); // allow API to be used from SPA origin
app.use(express.json({ limit: '256kb' }));

/* ---------------- Request ID + access log ---------------- */
app.use((req, res, next) => {
    req.id = crypto.randomBytes(6).toString('base64url');
    const start = Date.now();
    res.setHeader('X-Request-Id', req.id);
    res.setHeader('Connection', 'close');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.on('finish', () => {
        const ms = Date.now() - start;
        if (req.path.startsWith('/api')) {
            console.log(`[${req.id}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
        }
        // Nuclear close for Vite dev proxy stale-socket bug.
        try { req.socket?.destroy(); } catch {}
    });
    next();
});

/* ---------------- CORS ---------------- */
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173')
    .split(',').map((s) => s.trim()).filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    exposedHeaders: ['X-Request-Id', 'Content-Disposition'],
}));

/* ---------------- Rate limits ---------------- */
const formLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, max: 30,
    standardHeaders: true, legacyHeaders: false,
    message: { ok: false, error: 'Too many submissions. Please try again in a few minutes.' },
});
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 10,
    standardHeaders: true, legacyHeaders: false,
    message: { ok: false, error: 'Too many login attempts. Try again later.' },
});

/* ---------------- Nodemailer ---------------- */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    },
});
let smtpReady = false;
transporter.verify().then(
    () => { smtpReady = true; console.log('[mail] SMTP transporter ready'); },
    (err) => console.warn('[mail] SMTP verify failed — check SMTP_USER / SMTP_PASS app-password:', err.message),
);

// TO_EMAIL supports a comma-separated list — every recipient gets the enquiry.
const TO_EMAIL_LIST = (process.env.TO_EMAIL || 'tripwithuzofficial@gmail.com')
    .split(',').map((s) => s.trim()).filter(Boolean);
const TO_EMAIL = TO_EMAIL_LIST.join(', '); // Nodemailer accepts a comma-joined string
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '919585680636';
const FROM = `"${process.env.FROM_NAME || 'Trip with uz'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`;

/* ---------------- Helpers ---------------- */
const escapeHtml = (s = '') =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const isEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function buildEmail({ title, intro, fields }) {
    const rows = Object.entries(fields)
        .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
        .map(([k, v]) => `
            <tr>
                <td style="padding:10px 14px;border-bottom:1px solid #eee;font-weight:600;color:#0b0f1a;background:#f8f9fc;width:220px;">${escapeHtml(k)}</td>
                <td style="padding:10px 14px;border-bottom:1px solid #eee;color:#1a2236;">${escapeHtml(String(v))}</td>
            </tr>`).join('');
    return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f4f8;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#1a2236;">
  <div style="max-width:640px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 14px 40px rgba(10,15,40,0.10);">
    <div style="background:linear-gradient(135deg,#ff7a00,#e96b00);padding:28px 32px;color:#fff;">
      <div style="font-size:13px;opacity:.85;letter-spacing:2px;text-transform:uppercase;">Trip with uz</div>
      <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;">${escapeHtml(title)}</h1>
    </div>
    <div style="padding:26px 32px;">
      <p style="font-size:14.5px;line-height:1.7;color:#5b6478;margin:0 0 18px;">${escapeHtml(intro)}</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:10px;overflow:hidden;font-size:14px;">
        ${rows}
      </table>
      <p style="font-size:12.5px;color:#9099a8;margin-top:22px;">Submitted ${new Date().toLocaleString()} · Sent from Trip with uz website</p>
    </div>
  </div>
</body></html>`;
}

async function sendMail({ subject, title, intro, fields, replyTo }) {
    if (!smtpReady && !process.env.SMTP_PASS) throw new Error('SMTP not configured');
    const html = buildEmail({ title, intro, fields });
    const text = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n');
    return transporter.sendMail({ from: FROM, to: TO_EMAIL, replyTo: replyTo || undefined, subject, text, html });
}

async function processEnquiry({ type, subject, title, intro, fields, replyTo, source }) {
    const record = await store.insert('enquiries', {
        type, status: 'new', fields,
        source: source || fields.Source || null,
        replyTo: replyTo || null,
    });
    const waMessage = buildMessage(type, fields);
    const waUrl = waLink(WHATSAPP_NUMBER, waMessage);

    const [mailRes, waRes] = await Promise.all([
        sendMail({ subject, title, intro, fields, replyTo }).catch((e) => { console.error(`[${type}] mail failed:`, e.message); return null; }),
        sendViaCloudApi(WHATSAPP_NUMBER, waMessage).catch((e) => { console.warn(`[${type}] wa push failed:`, e.message); return { ok: false, error: e.message }; }),
    ]);
    return {
        id: record.id,
        emailSent: !!mailRes,
        whatsappSent: !!(waRes && waRes.ok),
        whatsappUrl: waUrl,
    };
}

function validate(body, required = []) {
    if (body.website) return 'spam';
    for (const f of required) if (!body[f] || !String(body[f]).trim()) return `Missing: ${f}`;
    if (body.email && !isEmail(body.email)) return 'Invalid email';
    return null;
}

/* ---------------- Health ---------------- */
const BUILD_MARK = 'v3-prod-ready';
let httpServer = null;
app.get('/api/health', (_req, res) => {
    res.json({
        ok: true,
        service: 'tripwithuz-api',
        build: BUILD_MARK,
        env: NODE_ENV,
        time: new Date().toISOString(),
        smtp: smtpReady,
        whatsappCloudApi: !!(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_ID),
        uptime: process.uptime(),
    });
});

/* ---------------- Public enquiry endpoints ---------------- */
app.post('/api/contact', formLimiter, async (req, res) => {
    const err = validate(req.body, ['name', 'email']);
    if (err) return res.status(400).json({ ok: false, error: err });
    const { name, email, phone, subject, destination, travel_date, message } = req.body;
    const fields = {
        Name: name, Email: email, Phone: phone, 'Request Type': subject,
        Destination: destination, 'Travel Date': travel_date, Message: message,
        Source: 'Website — Contact / Enquiry',
    };
    try {
        const out = await processEnquiry({
            type: 'Enquiry',
            subject: `New Enquiry — ${subject || 'Trip with uz'}`,
            title: 'New Enquiry Received',
            intro: `${name} has submitted a new enquiry. Reply directly to their email to respond.`,
            replyTo: email, fields,
        });
        res.json({ ok: true, ...out });
    } catch (e) { console.error('[contact]', e); res.status(500).json({ ok: false, error: 'server_error' }); }
});

app.post('/api/booking', formLimiter, async (req, res) => {
    const err = validate(req.body, ['name', 'email', 'phone', 'travel_date']);
    if (err) return res.status(400).json({ ok: false, error: err });
    const { name, email, phone, travelers, travel_date, package: pkg, notes } = req.body;
    const fields = {
        Package: pkg, Name: name, Email: email, Phone: phone,
        Travelers: travelers, 'Travel Date': travel_date, Notes: notes,
        Source: 'Website — Booking',
    };
    try {
        const out = await processEnquiry({
            type: 'Booking',
            subject: `New Booking Enquiry — ${pkg || 'Custom Trip'}`,
            title: 'New Booking Enquiry',
            intro: `${name} wants to book ${pkg || 'a custom trip'}. Follow up within 24 hours.`,
            replyTo: email, fields,
        });
        res.json({ ok: true, ...out });
    } catch (e) { console.error('[booking]', e); res.status(500).json({ ok: false, error: 'server_error' }); }
});

app.post('/api/study', formLimiter, async (req, res) => {
    const err = validate(req.body, ['name', 'email', 'phone']);
    if (err) return res.status(400).json({ ok: false, error: err });
    const { name, email, phone, country, level, intake, budget, notes } = req.body;
    const fields = {
        Name: name, Email: email, Phone: phone,
        'Preferred Country': country, 'Course Level': level, Intake: intake,
        Budget: budget, Notes: notes, Source: 'Website — Study Abroad',
    };
    try {
        const out = await processEnquiry({
            type: 'Study Abroad',
            subject: `New Study Abroad Enquiry — ${country || 'General'}`,
            title: 'New Study Abroad Enquiry',
            intro: `${name} is exploring overseas education options. Reach out with a personalised counselling slot.`,
            replyTo: email, fields,
        });
        res.json({ ok: true, ...out });
    } catch (e) { console.error('[study]', e); res.status(500).json({ ok: false, error: 'server_error' }); }
});

app.post('/api/business', formLimiter, async (req, res) => {
    const err = validate(req.body, ['name', 'email', 'phone']);
    if (err) return res.status(400).json({ ok: false, error: err });
    const { name, email, phone, country, business_type, stage, budget, notes } = req.body;
    const fields = {
        Name: name, Email: email, Phone: phone,
        'Target Country': country, 'Business Type': business_type, Stage: stage,
        Budget: budget, Notes: notes, Source: 'Website — Business Setup',
    };
    try {
        const out = await processEnquiry({
            type: 'Business Setup',
            subject: `New Business Setup Enquiry — ${country || 'General'}`,
            title: 'New Business Setup Enquiry',
            intro: `${name} is exploring setting up a business abroad. Schedule a discovery call.`,
            replyTo: email, fields,
        });
        res.json({ ok: true, ...out });
    } catch (e) { console.error('[business]', e); res.status(500).json({ ok: false, error: 'server_error' }); }
});

app.post('/api/search', formLimiter, async (req, res) => {
    const { category, destination, checkin, checkout, guests } = req.body;
    if (!destination) return res.status(400).json({ ok: false, error: 'Missing destination' });
    const fields = {
        Category: category, Destination: destination,
        'Check-in': checkin, 'Check-out': checkout, Guests: guests,
        Source: 'Website — Hero search',
    };
    try {
        const out = await processEnquiry({
            type: 'Search',
            subject: `New Search Request — ${category || 'packages'}`,
            title: 'New Search Request',
            intro: `A visitor searched for ${destination}. Send matching options.`,
            fields,
        });
        res.json({ ok: true, ...out });
    } catch (e) { console.error('[search]', e); res.status(500).json({ ok: false, error: 'server_error' }); }
});

app.post('/api/newsletter', formLimiter, async (req, res) => {
    const { email } = req.body;
    if (!isEmail(email)) return res.status(400).json({ ok: false, error: 'Invalid email' });
    try {
        const out = await processEnquiry({
            type: 'Newsletter',
            subject: 'New Newsletter Subscriber',
            title: 'New Newsletter Subscriber',
            intro: 'Someone joined your mailing list.',
            fields: { Email: email, Source: 'Website — Newsletter' },
        });
        res.json({ ok: true, ...out });
    } catch (e) { console.error('[newsletter]', e); res.status(500).json({ ok: false, error: 'server_error' }); }
});

/* ---------------- Public packages ---------------- */
app.get('/api/packages', async (_req, res) => {
    const all = await store.list('packages');
    res.json({ ok: true, packages: all.filter((p) => p.published !== false) });
});

app.get('/api/packages/:slug', async (req, res) => {
    const all = await store.list('packages');
    const pkg = all.find((p) => p.slug === req.params.slug && p.published !== false);
    if (!pkg) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true, package: pkg });
});

/* ---------------- Public ads ---------------- */
app.get('/api/ads', async (req, res) => {
    const all = await store.list('ads');
    const now = Date.now();
    const active = all.filter((a) => {
        if (a.active === false) return false;
        if (a.startDate && new Date(a.startDate).getTime() > now) return false;
        if (a.endDate   && new Date(a.endDate).getTime() < now) return false;
        if (req.query.placement && a.placement !== req.query.placement) return false;
        return true;
    }).sort((a, b) => (b.priority || 0) - (a.priority || 0));
    res.json({ ok: true, ads: active });
});

/* ---------------- Public blogs ---------------- */
app.get('/api/blogs', async (_req, res) => {
    const all = await store.list('blogs');
    const published = all
        .filter((b) => b.published !== false)
        .map(({ content, ...rest }) => rest); // strip heavy markdown from list
    res.json({ ok: true, blogs: published });
});

app.get('/api/blogs/:slug', async (req, res) => {
    const all = await store.list('blogs');
    const blog = all.find((b) => b.slug === req.params.slug && b.published !== false);
    if (!blog) return res.status(404).json({ ok: false, error: 'not_found' });
    const related = all
        .filter((b) => b.published !== false && b.slug !== blog.slug)
        .slice(0, 3)
        .map(({ content, ...rest }) => rest);
    res.json({ ok: true, blog, related });
});

/* ---------------- Seasonal content (public + admin) ---------------- */

// India-centric season auto-detection from current IST month.
// Spring is intentionally excluded from auto-detect; admin can override to it.
function detectSeason(now = new Date()) {
    // Convert to IST (UTC+5:30)
    const ist = new Date(now.getTime() + (5.5 * 60 - now.getTimezoneOffset()) * 60_000);
    const m = ist.getMonth() + 1; // 1-12
    if (m >= 3 && m <= 5)  return 'summer';
    if (m >= 6 && m <= 9)  return 'monsoon';
    return 'winter'; // Oct - Feb
}

const VALID_SEASONS = ['summer', 'monsoon', 'winter', 'spring'];

function defaultSeasonsConfig() {
    return {
        mode: 'auto',          // 'auto' | 'override'
        active: 'summer',      // used when mode === 'override'
        data: {
            summer:  { label: 'Summer Escapes',  tagline: 'Beat the heat — hill stations, beaches & adventure.', heroImages: [], featuredSlugs: [] },
            monsoon: { label: 'Monsoon Magic',   tagline: 'Lush green Kerala, cool getaways & rainy reads.',     heroImages: [], featuredSlugs: [] },
            winter:  { label: 'Winter Journeys', tagline: 'Goa, Rajasthan, snow & festive sparkle.',             heroImages: [], featuredSlugs: [] },
            spring:  { label: 'Spring Sojourns', tagline: 'Flowers, festivals & soft sunshine.',                 heroImages: [], featuredSlugs: [] },
        },
    };
}

async function readSeasonsConfig() {
    const stored = await store.getDoc('seasons', null);
    const fallback = defaultSeasonsConfig();
    if (!stored) return fallback;
    // Merge with defaults so newly-added season keys appear without admin re-saving
    const merged = {
        mode: stored.mode === 'override' ? 'override' : 'auto',
        active: VALID_SEASONS.includes(stored.active) ? stored.active : 'summer',
        data: { ...fallback.data, ...(stored.data || {}) },
    };
    return merged;
}

app.get('/api/seasonal', async (_req, res) => {
    try {
        const cfg = await readSeasonsConfig();
        const detected = detectSeason();
        const active = cfg.mode === 'override' ? cfg.active : detected;
        const season = cfg.data[active] || {};

        // Resolve featured packages by slug — only return published ones
        let featured = [];
        if (Array.isArray(season.featuredSlugs) && season.featuredSlugs.length) {
            const all = await store.list('packages');
            const bySlug = new Map(all.filter((p) => p.published !== false).map((p) => [p.slug, p]));
            featured = season.featuredSlugs.map((s) => bySlug.get(s)).filter(Boolean);
        }

        res.json({
            ok: true,
            active,
            detected,
            mode: cfg.mode,
            label: season.label || '',
            tagline: season.tagline || '',
            heroImages: Array.isArray(season.heroImages) ? season.heroImages.filter(Boolean) : [],
            featured,
        });
    } catch (e) {
        console.error('[seasonal]', e);
        res.status(500).json({ ok: false, error: 'server_error' });
    }
});

/* ---------------- Destinations (public, enquiry-only) ----------------
 * Standalone catalogue separate from `packages`. Browse + view detail +
 * submit a lightweight enquiry. No quotation engine, no UPI, no booking.
 * --------------------------------------------------------------------- */
app.get('/api/destinations', async (req, res) => {
    const all = await store.list('destinations');
    let list = all.filter((d) => d.published !== false);
    if (req.query.kind === 'top' || req.query.kind === 'popular') {
        list = list.filter((d) => d.kind === req.query.kind);
    }
    // Strip the heavy `gallery` + `intro` arrays from the list response
    res.json({ ok: true, destinations: list.map(({ gallery, intro, ...rest }) => rest) });
});

app.get('/api/destinations/:slug', async (req, res) => {
    const all = await store.list('destinations');
    const d = all.find((x) => x.slug === req.params.slug && x.published !== false);
    if (!d) return res.status(404).json({ ok: false, error: 'not_found' });
    const related = all
        .filter((x) => x.published !== false && x.slug !== d.slug && x.kind === d.kind)
        .slice(0, 3)
        .map(({ gallery, intro, ...rest }) => rest);
    res.json({ ok: true, destination: d, related });
});

app.post('/api/destinations/enquire', formLimiter, async (req, res) => {
    try {
        const { destinationSlug, name, email, phone, travel_date, travelers, message, website } = req.body || {};
        if (website) return res.json({ ok: true }); // honeypot
        if (!name || !email || !phone) {
            return res.status(400).json({ ok: false, error: 'Missing contact details' });
        }
        if (!isEmail(email)) return res.status(400).json({ ok: false, error: 'Invalid email' });

        const all = await store.list('destinations');
        const dest = all.find((d) => d.slug === destinationSlug);

        const fields = {
            'Destination': dest ? `${dest.title} (${dest.location || dest.country})` : (destinationSlug || '—'),
            'Name': name,
            'Email': email,
            'Phone': phone,
            'Travel date': travel_date || 'Not specified',
            'Travelers': travelers || 'Not specified',
            'Message': message || '—',
        };

        const record = await store.insert('enquiries', {
            type: 'Destination Enquiry',
            status: 'new',
            fields,
        });

        await sendMail({
            subject: `[Destination] ${dest ? dest.title : 'Enquiry'} — ${name}`,
            title: dest ? `Destination enquiry · ${dest.title}` : 'Destination enquiry',
            intro: `${name} (${phone}) wants more details on ${dest ? dest.title : 'a destination'}.`,
            fields,
            replyTo: email,
        }).catch((e) => console.error('[destinations/enquire] mail failed:', e.message));

        const wa = `https://wa.me/${(process.env.WHATSAPP_NUMBER || '919585680636').replace(/\D/g, '')}` +
            `?text=${encodeURIComponent(`Hi! I'm interested in ${dest ? dest.title : 'a destination'} for ${travelers || '2 adults'} around ${travel_date || 'soon'}. — ${name}`)}`;

        res.json({ ok: true, id: record.id, whatsappUrl: wa });
    } catch (e) {
        console.error('[destinations/enquire]', e);
        res.status(500).json({ ok: false, error: 'server_error' });
    }
});

/* ---------------- Quotation + Booking (public) ---------------- */
app.get('/api/quotation/options', (_req, res) => {
    res.json({ ok: true, options: describeOptions() });
});

app.post('/api/quotation', formLimiter, async (req, res) => {
    try {
        const { packageSlug, travelers, room, season, addons, name, email, phone, travel_date, notes } = req.body || {};
        if (!name || !email || !phone || !travel_date) {
            return res.status(400).json({ ok: false, error: 'Missing contact details' });
        }
        if (!isEmail(email)) return res.status(400).json({ ok: false, error: 'Invalid email' });
        const pkgs = await store.list('packages');
        const pkg = packageSlug ? pkgs.find((p) => p.slug === packageSlug) : null;
        const quote = buildQuotation(pkg || { title: 'Custom Trip', basePrice: 18000 }, {
            travelers, room, season, addons,
        });
        const booking = await store.insert('bookings', {
            status: 'pending_confirmation',
            customer: { name, email, phone },
            travel_date, notes: notes || '',
            packageSlug: pkg?.slug || null,
            packageTitle: quote.packageTitle,
            quotation: quote,
        });
        // Store an enquiry too so it shows in the enquiries inbox.
        await processEnquiry({
            type: 'Booking',
            subject: `New Booking Quotation — ${quote.packageTitle} (₹${quote.total.toLocaleString('en-IN')})`,
            title: 'New Booking Quotation Generated',
            intro: `${name} just generated a quotation of ₹${quote.total.toLocaleString('en-IN')} for ${quote.packageTitle}. Confirmation pending.`,
            fields: {
                Name: name, Email: email, Phone: phone,
                Package: quote.packageTitle,
                Travelers: quote.travelers,
                Room: quote.room, Season: quote.season,
                'Travel Date': travel_date,
                'Quotation Total': `₹${quote.total.toLocaleString('en-IN')}`,
                'Booking Ref': booking.id,
                Notes: notes,
                Source: 'Website — Book Trip (quotation)',
            },
            replyTo: email,
        });
        res.json({ ok: true, booking });
    } catch (e) {
        console.error('[quotation]', e);
        res.status(500).json({ ok: false, error: 'server_error' });
    }
});

app.get('/api/bookings/:id', async (req, res) => {
    const b = await store.get('bookings', req.params.id);
    if (!b) return res.status(404).json({ ok: false, error: 'not_found' });
    // Strip admin-only fields from public view
    res.json({ ok: true, booking: b, upi: upiConfig() });
});

app.post('/api/bookings/:id/confirm', formLimiter, async (req, res) => {
    const b = await store.get('bookings', req.params.id);
    if (!b) return res.status(404).json({ ok: false, error: 'not_found' });
    if (!['pending_confirmation', 'pending_payment'].includes(b.status)) {
        return res.status(400).json({ ok: false, error: 'already_processed' });
    }
    const upiLink = buildUpiLink({
        amount: b.quotation.total,
        note: `Trip with uz — ${b.packageTitle}`,
        refId: b.id,
    });
    const updated = await store.update('bookings', b.id, {
        status: 'pending_payment',
        upiLink,
        confirmedAt: new Date().toISOString(),
    });
    res.json({ ok: true, booking: updated, upi: upiConfig(), upiLink });
});

app.post('/api/bookings/:id/paid', formLimiter, async (req, res) => {
    const b = await store.get('bookings', req.params.id);
    if (!b) return res.status(404).json({ ok: false, error: 'not_found' });
    const { transactionRef } = req.body || {};
    const updated = await store.update('bookings', b.id, {
        status: 'paid_pending_verification',
        paymentRef: transactionRef || '',
        paidAt: new Date().toISOString(),
    });
    // Notify admin
    sendMail({
        subject: `Payment reported — ${b.packageTitle} (${b.id})`,
        title: 'Customer reported UPI payment',
        intro: `${b.customer.name} reports UPI payment of ₹${b.quotation.total.toLocaleString('en-IN')} for booking ${b.id}. Please verify and confirm the booking.`,
        fields: {
            'Booking Ref': b.id,
            'Customer': `${b.customer.name} <${b.customer.email}>`,
            'Phone': b.customer.phone,
            'Package': b.packageTitle,
            'Amount': `₹${b.quotation.total.toLocaleString('en-IN')}`,
            'UPI Transaction Ref': transactionRef || 'not provided',
            'Travel Date': b.travel_date,
        },
        replyTo: b.customer.email,
    }).catch((e) => console.warn('[payment mail]', e.message));
    res.json({ ok: true, booking: updated });
});

/* ---------------- Admin auth ---------------- */
app.post('/api/admin/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body || {};
    if (!(await verifyAdminCredentials(username, password))) {
        return res.status(401).json({ ok: false, error: 'invalid_credentials' });
    }
    const token = issueToken(username);
    res.json({ ok: true, token, user: { username }, expiresInMs: 12 * 60 * 60 * 1000 });
});

app.get('/api/admin/me', adminOnly, async (req, res) => {
    const creds = await getAdminCredentials();
    res.json({
        ok: true,
        user: { username: req.admin.sub, displayName: creds.username },
        issuedAt: req.admin.iat, expiresAt: req.admin.exp,
    });
});

app.post('/api/admin/change-password', adminOnly, async (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    const result = await changeAdminPassword(req.admin.sub, currentPassword, newPassword);
    if (!result.ok) return res.status(400).json(result);
    res.json(result);
});

/* ---------------- Admin enquiries ---------------- */
function filterEnquiries(all, { status, type, q }) {
    let out = all;
    if (status) out = out.filter((e) => e.status === status);
    if (type) out = out.filter((e) => e.type === type);
    if (q) {
        const needle = String(q).toLowerCase();
        out = out.filter((e) =>
            JSON.stringify(e.fields || {}).toLowerCase().includes(needle) ||
            (e.type || '').toLowerCase().includes(needle),
        );
    }
    return out;
}

app.get('/api/admin/enquiries', adminOnly, async (req, res) => {
    const all = await store.list('enquiries');
    res.json({ ok: true, enquiries: filterEnquiries(all, req.query) });
});

const CSV_COLS = ['id', 'createdAt', 'type', 'status', 'Name', 'Email', 'Phone', 'Destination', 'Travel Date', 'Message', 'notes'];
function csvEscape(v) {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

app.get('/api/admin/enquiries.csv', adminOnly, async (req, res) => {
    const all = await store.list('enquiries');
    const rows = filterEnquiries(all, req.query);
    const header = CSV_COLS.join(',');
    const lines = rows.map((r) => CSV_COLS.map((col) => {
        if (col === 'id' || col === 'createdAt' || col === 'type' || col === 'status' || col === 'notes') {
            return csvEscape(r[col]);
        }
        return csvEscape(r.fields?.[col]);
    }).join(','));
    const body = [header, ...lines].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="enquiries-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(body);
});

app.patch('/api/admin/enquiries/:id', adminOnly, async (req, res) => {
    const { status, notes } = req.body || {};
    const patch = {};
    if (status) patch.status = status;
    if (notes !== undefined) patch.notes = notes;
    const row = await store.update('enquiries', req.params.id, patch);
    if (!row) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true, enquiry: row });
});

app.delete('/api/admin/enquiries/:id', adminOnly, async (req, res) => {
    const ok = await store.remove('enquiries', req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true });
});

/* ---------------- Admin stats + activity ---------------- */
app.get('/api/admin/stats', adminOnly, async (_req, res) => {
    const enq = await store.list('enquiries');
    const pkgs = await store.list('packages');
    const bookings = await store.list('bookings');
    const blogs = await store.list('blogs');
    const ads = await store.list('ads');
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const byType = {};
    const byStatus = {};
    for (const e of enq) {
        byType[e.type] = (byType[e.type] || 0) + 1;
        byStatus[e.status || 'new'] = (byStatus[e.status || 'new'] || 0) + 1;
    }
    // Build a 14-day timeseries for the dashboard sparkline.
    const series = [];
    for (let i = 13; i >= 0; i--) {
        const start = new Date(now - (i + 1) * dayMs).setHours(0, 0, 0, 0);
        const end   = start + dayMs;
        const count = enq.filter((e) => {
            const t = new Date(e.createdAt).getTime();
            return t >= start && t < end;
        }).length;
        series.push({ date: new Date(start).toISOString().slice(0, 10), count });
    }
    res.json({
        ok: true,
        stats: {
            totalEnquiries: enq.length,
            newEnquiries: byStatus.new || 0,
            inProgress:   byStatus.in_progress || 0,
            done:         byStatus.done || 0,
            enquiriesLast24h: enq.filter((e) => now - new Date(e.createdAt).getTime() < dayMs).length,
            enquiriesLast7Days: enq.filter((e) => now - new Date(e.createdAt).getTime() < 7 * dayMs).length,
            byType, byStatus,
            totalPackages: pkgs.length,
            publishedPackages: pkgs.filter((p) => p.published !== false).length,
            totalBookings: bookings.length,
            paidBookings: bookings.filter((b) => b.status === 'paid' || b.status === 'paid_pending_verification').length,
            pendingBookings: bookings.filter((b) => b.status === 'pending_confirmation' || b.status === 'pending_payment').length,
            bookingRevenue: bookings
                .filter((b) => b.status === 'paid' || b.status === 'paid_pending_verification')
                .reduce((s, b) => s + (b.quotation?.total || 0), 0),
            totalBlogs: blogs.length,
            publishedBlogs: blogs.filter((b) => b.published !== false).length,
            totalAds: ads.length,
            activeAds: ads.filter((a) => a.active !== false).length,
            series,
        },
    });
});

app.get('/api/admin/activity', adminOnly, async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const all = await store.list('enquiries');
    // Already sorted newest-first by store.insert (unshift).
    res.json({ ok: true, activity: all.slice(0, limit) });
});

/* ---------------- Admin packages ---------------- */
function validatePackage(body) {
    if (!body || typeof body !== 'object') return 'invalid_body';
    if (!body.title || !String(body.title).trim()) return 'title_required';
    if (!body.slug || !String(body.slug).trim()) return 'slug_required';
    if (!/^[a-z0-9-]+$/.test(body.slug)) return 'slug_invalid_format';
    return null;
}

app.get('/api/admin/packages', adminOnly, async (_req, res) => {
    const all = await store.list('packages');
    res.json({ ok: true, packages: all });
});

app.post('/api/admin/packages', adminOnly, async (req, res) => {
    const err = validatePackage(req.body);
    if (err) return res.status(400).json({ ok: false, error: err });
    const existing = await store.list('packages');
    if (existing.some((p) => p.slug === req.body.slug)) {
        return res.status(409).json({ ok: false, error: 'slug_exists' });
    }
    const row = await store.insert('packages', {
        published: true,
        tags: [], highlights: [], itinerary: [], includes: [], excludes: [],
        ...req.body,
    });
    res.json({ ok: true, package: row });
});

app.patch('/api/admin/packages/:id', adminOnly, async (req, res) => {
    if (req.body.slug && !/^[a-z0-9-]+$/.test(req.body.slug)) {
        return res.status(400).json({ ok: false, error: 'slug_invalid_format' });
    }
    if (req.body.slug) {
        const existing = await store.list('packages');
        if (existing.some((p) => p.slug === req.body.slug && p.id !== req.params.id)) {
            return res.status(409).json({ ok: false, error: 'slug_exists' });
        }
    }
    const row = await store.update('packages', req.params.id, req.body);
    if (!row) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true, package: row });
});

app.delete('/api/admin/packages/:id', adminOnly, async (req, res) => {
    const ok = await store.remove('packages', req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true });
});

/* ---------------- Admin ads ---------------- */
app.get('/api/admin/ads', adminOnly, async (_req, res) => {
    const all = await store.list('ads');
    res.json({ ok: true, ads: all });
});

app.post('/api/admin/ads', adminOnly, async (req, res) => {
    const { title, placement } = req.body || {};
    if (!title || !placement) return res.status(400).json({ ok: false, error: 'title_and_placement_required' });
    const row = await store.insert('ads', { active: true, priority: 5, ...req.body });
    res.json({ ok: true, ad: row });
});

app.patch('/api/admin/ads/:id', adminOnly, async (req, res) => {
    const row = await store.update('ads', req.params.id, req.body);
    if (!row) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true, ad: row });
});

app.delete('/api/admin/ads/:id', adminOnly, async (req, res) => {
    const ok = await store.remove('ads', req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true });
});

/* ---------------- Admin seasons ---------------- */
app.get('/api/admin/seasons', adminOnly, async (_req, res) => {
    const cfg = await readSeasonsConfig();
    res.json({ ok: true, config: { ...cfg, detected: detectSeason() } });
});

app.post('/api/admin/seasons', adminOnly, async (req, res) => {
    try {
        const incoming = req.body || {};
        const mode = incoming.mode === 'override' ? 'override' : 'auto';
        const active = VALID_SEASONS.includes(incoming.active) ? incoming.active : 'summer';

        // Sanitize each season block: only known keys, drop empty entries.
        // Hero images are stored as { url, title, accent, subtitle } objects; legacy
        // string entries are auto-upgraded so older saved configs keep working.
        const sanitizeImages = (raw) => {
            if (!Array.isArray(raw)) return [];
            const out = [];
            for (const entry of raw) {
                if (typeof entry === 'string') {
                    const url = entry.trim();
                    if (url) out.push({ url, title: '', accent: '', subtitle: '' });
                } else if (entry && typeof entry === 'object') {
                    const url = String(entry.url || '').trim();
                    if (!url) continue;
                    out.push({
                        url,
                        title: String(entry.title || '').slice(0, 80),
                        accent: String(entry.accent || '').slice(0, 80),
                        subtitle: String(entry.subtitle || '').slice(0, 200),
                    });
                }
                if (out.length >= 12) break;
            }
            return out;
        };

        const data = {};
        for (const key of VALID_SEASONS) {
            const src = (incoming.data && incoming.data[key]) || {};
            data[key] = {
                label: typeof src.label === 'string' ? src.label.slice(0, 80) : '',
                tagline: typeof src.tagline === 'string' ? src.tagline.slice(0, 200) : '',
                heroImages: sanitizeImages(src.heroImages),
                featuredSlugs: Array.isArray(src.featuredSlugs) ? src.featuredSlugs.filter((s) => typeof s === 'string').slice(0, 12) : [],
            };
        }

        const saved = await store.setDoc('seasons', { mode, active, data });
        res.json({ ok: true, config: { ...saved, detected: detectSeason() } });
    } catch (e) {
        console.error('[admin/seasons]', e);
        res.status(500).json({ ok: false, error: 'server_error' });
    }
});

/* ---------------- Admin blogs ---------------- */
function slugify(s) {
    return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

app.get('/api/admin/blogs', adminOnly, async (_req, res) => {
    const all = await store.list('blogs');
    res.json({ ok: true, blogs: all });
});

app.post('/api/admin/blogs', adminOnly, async (req, res) => {
    const { title } = req.body || {};
    if (!title) return res.status(400).json({ ok: false, error: 'title_required' });
    const slug = req.body.slug ? slugify(req.body.slug) : slugify(title);
    const existing = await store.list('blogs');
    if (existing.some((b) => b.slug === slug)) return res.status(409).json({ ok: false, error: 'slug_exists' });
    const row = await store.insert('blogs', {
        published: true,
        tags: [],
        author: 'Trip with uz Editorial',
        ...req.body,
        slug,
    });
    res.json({ ok: true, blog: row });
});

app.patch('/api/admin/blogs/:id', adminOnly, async (req, res) => {
    const patch = { ...req.body };
    if (patch.slug) {
        patch.slug = slugify(patch.slug);
        const existing = await store.list('blogs');
        if (existing.some((b) => b.slug === patch.slug && b.id !== req.params.id)) {
            return res.status(409).json({ ok: false, error: 'slug_exists' });
        }
    }
    const row = await store.update('blogs', req.params.id, patch);
    if (!row) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true, blog: row });
});

app.delete('/api/admin/blogs/:id', adminOnly, async (req, res) => {
    const ok = await store.remove('blogs', req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true });
});

/* ---------------- Admin bookings ---------------- */
app.get('/api/admin/bookings', adminOnly, async (req, res) => {
    const all = await store.list('bookings');
    const { status } = req.query;
    const out = status ? all.filter((b) => b.status === status) : all;
    res.json({ ok: true, bookings: out });
});

app.patch('/api/admin/bookings/:id', adminOnly, async (req, res) => {
    const row = await store.update('bookings', req.params.id, req.body);
    if (!row) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true, booking: row });
});

app.delete('/api/admin/bookings/:id', adminOnly, async (req, res) => {
    const ok = await store.remove('bookings', req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true });
});

/* ---------------- Backup ---------------- */
app.get('/api/admin/backup', adminOnly, async (_req, res) => {
    const [enquiries, packages, bookings, blogs, ads] = await Promise.all([
        store.list('enquiries'),
        store.list('packages'),
        store.list('bookings'),
        store.list('blogs'),
        store.list('ads'),
    ]);
    const payload = {
        generatedAt: new Date().toISOString(),
        service: 'tripwithuz',
        version: BUILD_MARK,
        enquiries, packages, bookings, blogs, ads,
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="tripwithuz-backup-${new Date().toISOString().slice(0, 10)}.json"`);
    res.send(JSON.stringify(payload, null, 2));
});

/* ---------------- Google Reviews ---------------- */
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || '';
let reviewsCache = { data: null, ts: 0 };
const REVIEWS_TTL = 60 * 60 * 1000;

app.get('/api/google-reviews', async (_req, res) => {
    if (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID) {
        return res.status(503).json({ ok: false, error: 'Google Places API not configured' });
    }
    if (reviewsCache.data && Date.now() - reviewsCache.ts < REVIEWS_TTL) {
        return res.json({ ok: true, ...reviewsCache.data });
    }
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,user_ratings_total,reviews,url&key=${GOOGLE_API_KEY}&reviews_sort=newest`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.status !== 'OK') {
            console.error('[google-reviews] API error:', json.status, json.error_message);
            return res.status(502).json({ ok: false, error: json.status });
        }
        const r = json.result;
        const payload = {
            name: r.name, rating: r.rating, totalReviews: r.user_ratings_total, googleUrl: r.url,
            reviews: (r.reviews || []).map((x) => ({
                author: x.author_name, avatar: x.profile_photo_url,
                rating: x.rating, text: x.text,
                time: x.relative_time_description, timestamp: x.time,
            })),
        };
        reviewsCache = { data: payload, ts: Date.now() };
        res.json({ ok: true, ...payload });
    } catch (e) {
        console.error('[google-reviews] fetch failed:', e.message);
        res.status(500).json({ ok: false, error: 'fetch_failed' });
    }
});

/* ---------------- SEO: dynamic sitemap + robots ---------------- */
const SITE_URL = (process.env.SITE_URL || 'https://tripwithuz.com').replace(/\/$/, '');

app.get('/sitemap.xml', async (_req, res) => {
    const [packages, blogs] = await Promise.all([
        store.list('packages'),
        store.list('blogs'),
    ]);
    const staticRoutes = [
        { loc: '/',               priority: '1.0', freq: 'weekly'  },
        { loc: '/packages',       priority: '0.9', freq: 'weekly'  },
        { loc: '/study-abroad',   priority: '0.9', freq: 'weekly'  },
        { loc: '/business-setup', priority: '0.9', freq: 'weekly'  },
        { loc: '/blog',           priority: '0.9', freq: 'weekly'  },
        { loc: '/about',          priority: '0.6', freq: 'monthly' },
        { loc: '/contact',        priority: '0.8', freq: 'monthly' },
        { loc: '/careers',        priority: '0.5', freq: 'monthly' },
        { loc: '/terms',          priority: '0.3', freq: 'yearly'  },
        { loc: '/privacy',        priority: '0.3', freq: 'yearly'  },
    ];
    const pkgUrls = packages
        .filter((p) => p.published !== false)
        .map((p) => ({ loc: `/packages/${p.slug}`, priority: '0.8', freq: 'monthly', lastmod: p.updatedAt || p.createdAt }));
    const blogUrls = blogs
        .filter((b) => b.published !== false)
        .map((b) => ({ loc: `/blog/${b.slug}`, priority: '0.8', freq: 'monthly', lastmod: b.updatedAt || b.createdAt }));
    const all = [...staticRoutes, ...pkgUrls, ...blogUrls];
    const urlTags = all.map((u) => {
        const lm = u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>` : '';
        return `  <url><loc>${SITE_URL}${u.loc}</loc>${lm}<changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`;
    }).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>\n`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(xml);
});

app.get('/robots.txt', (_req, res) => {
    const txt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/admin

Sitemap: ${SITE_URL}/sitemap.xml
`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(txt);
});

/* ---------------- 404 + error handler ---------------- */
app.use((req, res) => res.status(404).json({ ok: false, error: 'not_found', path: req.path }));
app.use((err, _req, res, _next) => {
    console.error('[error]', err);
    res.status(err.status || 500).json({ ok: false, error: err.message || 'server_error' });
});

/* ---------------- Start + graceful shutdown ---------------- */
(async () => {
    await store.seedIfEmpty('packages', SEED_PACKAGES);
    await store.seedIfEmpty('enquiries', []);
    await store.seedIfEmpty('admin', []);
    await store.seedIfEmpty('ads', SEED_ADS);
    await store.seedIfEmpty('blogs', SEED_BLOGS);
    await store.seedIfEmpty('bookings', []);
    await store.seedIfEmpty('destinations', SEED_DESTINATIONS);

    // Migration — backfill `places` array on existing destination rows from
    // the seed, so older saves get the new tourist-spots data without a wipe.
    // Doesn't touch any other field, so admin-edited values are preserved.
    try {
        const existingDest = await store.list('destinations');
        for (const d of existingDest) {
            const seedMatch = SEED_DESTINATIONS.find((s) => s.slug === d.slug);
            if (!seedMatch) continue;
            const patch = {};
            if (!Array.isArray(d.places) || d.places.length === 0) patch.places = seedMatch.places || [];
            if (Object.keys(patch).length > 0) await store.update('destinations', d.id, patch);
        }
    } catch (e) {
        console.warn('[migration] destinations places backfill failed:', e.message);
    }

    // Migration — backfill new fields on existing package rows and add any
    // international packages that didn't exist in the pre-v4 seed.
    try {
        const existing = await store.list('packages');
        const INTL_COUNTRIES = new Set(['UAE', 'Singapore & Malaysia', 'Indonesia', 'France · Switzerland · Italy · Netherlands']);
        for (const p of existing) {
            const patch = {};
            if (!p.category) patch.category = INTL_COUNTRIES.has(p.country) || p.country !== 'India' ? 'International' : 'Domestic';
            if (!p.region) {
                if (patch.category === 'International' || p.category === 'International') {
                    patch.region = 'Global';
                } else {
                    const north = /Delhi|Agra|Rajasthan|Kashmir|Himachal|Uttarakhand/.test(p.city || '');
                    const south = /Kerala|Tamil|Ooty|Pondicherry|Karnataka|Coorg|Mysore|Telangana|Hyderabad/.test(p.city || '');
                    const west = /Mumbai|Pune|Goa|Maharashtra|Nashik/.test(p.city || '');
                    patch.region = south ? 'South India' : north ? 'North India' : west ? 'West India' : 'India';
                }
            }
            if (p.basePrice === undefined || p.basePrice === null) {
                const match = SEED_PACKAGES.find((s) => s.slug === p.slug);
                patch.basePrice = match?.basePrice || 20000;
            }
            // Heal broken Pixabay URLs → replace with current seed URL for same slug.
            const hasBrokenVideo = p.tourVideo && /cdn\.pixabay\.com/.test(p.tourVideo);
            if (!p.tourVideo || hasBrokenVideo) {
                const match = SEED_PACKAGES.find((s) => s.slug === p.slug);
                if (match?.tourVideo) patch.tourVideo = match.tourVideo;
                else if (hasBrokenVideo) patch.tourVideo = '';
            }
            if (Object.keys(patch).length) await store.update('packages', p.id, patch);
        }
        // Add any seed packages (by slug) that are missing from the db.
        const haveSlugs = new Set(existing.map((p) => p.slug));
        for (const seed of SEED_PACKAGES) {
            if (!haveSlugs.has(seed.slug)) {
                await store.insert('packages', seed);
            }
        }
    } catch (e) {
        console.warn('[migration] package backfill skipped:', e.message);
    }

    // Migration — heal ads. Strip all video URLs (we're using static images now
    // because third-party video CDNs have been returning unexpected content),
    // and swap any Unsplash image URLs with stable Pexels equivalents pulled
    // from the current seed.
    try {
        const existingAds = await store.list('ads');
        for (const a of existingAds) {
            const patch = {};
            if (a.video) patch.video = ''; // nuke any stored video url
            if (a.image && /images\.unsplash\.com/.test(a.image)) {
                const match = SEED_ADS.find((s) => s.title === a.title);
                if (match?.image) patch.image = match.image;
            }
            if (Object.keys(patch).length) await store.update('ads', a.id, patch);
        }
    } catch (e) {
        console.warn('[migration] ad heal skipped:', e.message);
    }

    // Migration — insert any seed blogs (by slug) that aren't in the DB yet.
    // Lets us ship new SEO blog posts without wiping existing ones.
    try {
        const existingBlogs = await store.list('blogs');
        const haveSlugs = new Set(existingBlogs.map((b) => b.slug));
        let inserted = 0;
        for (const seed of SEED_BLOGS) {
            if (!haveSlugs.has(seed.slug)) {
                await store.insert('blogs', seed);
                inserted += 1;
            }
        }
        if (inserted) console.log(`[migration] inserted ${inserted} new seed blog post(s)`);
    } catch (e) {
        console.warn('[migration] blog insert skipped:', e.message);
    }

    httpServer = app.listen(PORT, () => {
        console.log(`[server] Trip with uz API v${BUILD_MARK}`);
        console.log(`[server] Listening on http://localhost:${PORT} (${NODE_ENV})`);
        console.log(`[server] Mails → ${TO_EMAIL_LIST.join(' + ')}`);
        console.log(`[server] WhatsApp → ${WHATSAPP_NUMBER} (cloud api: ${!!(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_ID)})`);
        console.log(`[server] Admin user: ${process.env.ADMIN_USER || 'admin'}`);
        console.log(`[server] CORS  → ${allowedOrigins.join(', ')}`);
    });
    httpServer.keepAliveTimeout = 75_000;
    httpServer.headersTimeout = 76_000;

    const shutdown = (signal) => () => {
        console.log(`\n[server] ${signal} received — shutting down gracefully.`);
        httpServer.close((err) => {
            if (err) { console.error('[server] close error:', err); process.exit(1); }
            console.log('[server] HTTP server closed.');
            process.exit(0);
        });
        // Force exit after 10s in case open connections hang.
        setTimeout(() => process.exit(1), 10_000).unref();
    };
    process.on('SIGTERM', shutdown('SIGTERM'));
    process.on('SIGINT',  shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => console.error('[unhandledRejection]', reason));
    process.on('uncaughtException',  (err)    => console.error('[uncaughtException]', err));
})();
