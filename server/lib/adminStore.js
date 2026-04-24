/**
 * Admin credential store. The primary source of truth for the admin
 * username/password is the `.env` file (ADMIN_USER / ADMIN_PASS). But
 * once a password is changed from the admin UI we persist the new hashed
 * password into db/admin.json so it survives env reverts.
 *
 * Password hashing uses node:crypto scrypt — no native modules needed.
 */
import crypto from 'node:crypto';
import * as store from './store.js';

const KEY_LEN = 64;

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.scryptSync(String(password), salt, KEY_LEN).toString('hex');
    return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password, stored) {
    if (!stored || typeof stored !== 'string') return false;
    const [algo, salt, hash] = stored.split('$');
    if (algo !== 'scrypt' || !salt || !hash) return false;
    const got = crypto.scryptSync(String(password), salt, KEY_LEN).toString('hex');
    const a = Buffer.from(got, 'hex');
    const b = Buffer.from(hash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function getRecord() {
    const all = await store.list('admin');
    return all[0] || null;
}

/**
 * Resolve the effective admin credentials.
 * 1. If db/admin.json has a record, use it (password was changed via UI).
 * 2. Otherwise fall back to ADMIN_USER / ADMIN_PASS from env.
 */
export async function getAdminCredentials() {
    const rec = await getRecord();
    if (rec) return rec;
    const envUser = process.env.ADMIN_USER || 'admin';
    const envPass = process.env.ADMIN_PASS || '';
    return { username: envUser, passwordHash: envPass ? hashPassword(envPass) : null, fromEnv: true };
}

export async function verifyAdminCredentials(username, password) {
    const creds = await getAdminCredentials();
    if (!creds || !creds.passwordHash) return false;
    const u = Buffer.from(String(username || ''));
    const U = Buffer.from(creds.username);
    if (u.length !== U.length || !crypto.timingSafeEqual(u, U)) return false;
    return verifyPassword(password, creds.passwordHash);
}

/**
 * Change the admin password. Requires the current password to match.
 */
export async function changeAdminPassword(username, currentPassword, newPassword) {
    if (!(await verifyAdminCredentials(username, currentPassword))) {
        return { ok: false, error: 'invalid_current_password' };
    }
    if (!newPassword || String(newPassword).length < 8) {
        return { ok: false, error: 'weak_password' };
    }
    const rec = await getRecord();
    const hash = hashPassword(newPassword);
    if (rec) await store.update('admin', rec.id, { username, passwordHash: hash });
    else await store.insert('admin', { username, passwordHash: hash });
    return { ok: true };
}
