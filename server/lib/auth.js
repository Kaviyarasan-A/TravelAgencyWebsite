/**
 * Stateless admin session tokens, HMAC-signed so the server can verify
 * them without a session store. Token format: base64url(payload).signature
 *
 * Payload is JSON: { sub, iat, exp }. Secret comes from ADMIN_SECRET.
 */
import crypto from 'node:crypto';

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

export function issueToken(sub) {
    const now = Date.now();
    const payload = { sub, iat: now, exp: now + TTL_MS };
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

export function adminOnly(req, res, next) {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    const payload = verifyToken(token);
    if (!payload) {
        console.warn(`[auth] 401 on ${req.method} ${req.originalUrl} — ${token ? 'invalid/expired token' : 'missing Authorization header'}`);
        return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    req.admin = payload;
    next();
}

export function checkCredentials(user, pass) {
    const U = process.env.ADMIN_USER || 'admin';
    const P = process.env.ADMIN_PASS || '';
    if (!P) return false;
    const ua = Buffer.from(String(user || ''));
    const ub = Buffer.from(U);
    const pa = Buffer.from(String(pass || ''));
    const pb = Buffer.from(P);
    const sameLen = ua.length === ub.length && pa.length === pb.length;
    return sameLen && crypto.timingSafeEqual(ua, ub) && crypto.timingSafeEqual(pa, pb);
}
