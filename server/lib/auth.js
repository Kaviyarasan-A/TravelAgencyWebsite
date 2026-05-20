/**
 * Stateless admin session tokens, HMAC-signed so the server can verify
 * them without a session store. Token format: base64url(payload).signature
 *
 * Payload is JSON: { sub, userId, isSuper, iat, exp }. Permissions are NOT
 * embedded in the token — they're re-read from the users store on every
 * request so a permission change takes effect immediately.
 *
 * Secret comes from ADMIN_SECRET.
 */
import crypto from 'node:crypto';
import * as users from './usersStore.js';

const SECRET = () => process.env.ADMIN_SECRET || 'dev-insecure-secret-change-me';
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function b64url(buf) {
    return Buffer.from(buf).toString('base64url');
}
function fromB64url(s) {
    return Buffer.from(s, 'base64url');
}

function sign(payloadB64) {
    return crypto.createHmac('sha256', SECRET()).update(payloadB64).digest('base64url');
}

export function issueToken(user) {
    const now = Date.now();
    const payload = {
        sub: user.username,
        userId: user.id,
        isSuper: !!user.isSuper,
        iat: now,
        exp: now + TTL_MS,
    };
    const body = b64url(JSON.stringify(payload));
    const sig = sign(body);
    return `${body}.${sig}`;
}

export function verifyToken(token) {
    if (!token || typeof token !== 'string') return null;
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;
    const expected = sign(body);
    const a = Buffer.from(sig, 'base64url');
    const b = Buffer.from(expected, 'base64url');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    try {
        const payload = JSON.parse(fromB64url(body).toString('utf8'));
        if (!payload.exp || payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

/**
 * Authentication middleware. Verifies the token AND re-fetches the user
 * from the store so deletions / deactivations / permission changes take
 * effect on the very next request (no stale token-embedded data).
 */
export async function adminOnly(req, res, next) {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    const payload = verifyToken(token);
    if (!payload) {
        console.warn(`[auth] 401 on ${req.method} ${req.originalUrl} — ${token ? 'invalid/expired token' : 'missing Authorization header'}`);
        return res.status(401).json({ ok: false, error: 'unauthorized' });
    }

    // Re-fetch the live user so deactivations / permission changes take
    // effect immediately rather than waiting for the token to expire.
    const fresh = await users.findByUsername(payload.sub);
    if (!fresh || fresh.active === false) {
        console.warn(`[auth] 401 on ${req.method} ${req.originalUrl} — user "${payload.sub}" not found or deactivated`);
        return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    req.admin = payload;
    req.user = fresh;
    next();
}

/**
 * Permission gate middleware factory. Use after adminOnly:
 *   app.get('/api/admin/packages', adminOnly, requirePerm('packages', 'read'), ...)
 *
 * Super-admins always pass. Anyone else needs the matching level on the
 * module, where 'write' implies 'read'.
 */
export function requirePerm(module, level = 'read') {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ ok: false, error: 'unauthorized' });
        if (users.hasPermission(req.user, module, level)) return next();
        console.warn(`[auth] 403 on ${req.method} ${req.originalUrl} — user "${req.user.username}" lacks ${level} on ${module}`);
        return res.status(403).json({ ok: false, error: 'forbidden', module, required: level });
    };
}

/**
 * Stricter gate — only super-admins. Used for /api/admin/users mutations.
 */
export function requireSuper(req, res, next) {
    if (!req.user) return res.status(401).json({ ok: false, error: 'unauthorized' });
    if (req.user.isSuper) return next();
    console.warn(`[auth] 403 on ${req.method} ${req.originalUrl} — user "${req.user.username}" is not super-admin`);
    return res.status(403).json({ ok: false, error: 'forbidden_super_admin_only' });
}
