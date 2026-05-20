/**
 * Multi-user admin store. Replaces the single-record admin store with a
 * proper users collection that supports per-module permissions.
 *
 * Permission model:
 *   - `isSuper`: super-admins bypass all checks and are the only ones who
 *     can create / edit / delete other users.
 *   - `permissions`: { [module]: 'none' | 'read' | 'write' }
 *     Modules: enquiries, packages, blogs, ads, bookings,
 *              destinations, seasons, users.
 *     'read'  → can call GET endpoints for that module
 *     'write' → can call GET + POST + PATCH + DELETE
 *
 * Bootstrap: on first ever boot, if the `users` collection is empty, we
 * insert a super-admin from ADMIN_USER / ADMIN_PASS env vars so the
 * existing login keeps working after the migration.
 */
import crypto from 'node:crypto';
import * as store from './store.js';

const KEY_LEN = 64;

export const MODULES = [
    'enquiries', 'packages', 'blogs', 'ads',
    'bookings', 'destinations', 'seasons', 'users',
];

export const LEVELS = ['none', 'read', 'write'];

export function emptyPermissions() {
    return MODULES.reduce((acc, m) => ({ ...acc, [m]: 'none' }), {});
}

export function fullPermissions() {
    return MODULES.reduce((acc, m) => ({ ...acc, [m]: 'write' }), {});
}

function sanitizePermissions(input) {
    const out = emptyPermissions();
    if (!input || typeof input !== 'object') return out;
    for (const m of MODULES) {
        const v = input[m];
        if (LEVELS.includes(v)) out[m] = v;
    }
    return out;
}

/* ---------------- password helpers (scrypt) ---------------- */

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

/* ---------------- user CRUD ---------------- */

function publicView(user) {
    if (!user) return null;
    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
}

export async function findByUsername(username) {
    if (!username) return null;
    const all = await store.list('users');
    // Case-insensitive match so users don't get locked out by capitalization.
    const u = String(username).toLowerCase();
    return all.find((x) => String(x.username || '').toLowerCase() === u) || null;
}

export async function listUsers() {
    const all = await store.list('users');
    return all.map(publicView);
}

export async function createUser({ username, password, isSuper = false, permissions, active = true, displayName = '' }) {
    if (!username || !String(username).trim()) return { ok: false, error: 'username_required' };
    if (!password || String(password).length < 8) return { ok: false, error: 'weak_password' };
    if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) return { ok: false, error: 'username_invalid_format' };

    const existing = await findByUsername(username);
    if (existing) return { ok: false, error: 'username_taken' };

    const row = await store.insert('users', {
        username: String(username).trim(),
        displayName: String(displayName || '').slice(0, 80),
        passwordHash: hashPassword(password),
        isSuper: !!isSuper,
        permissions: isSuper ? fullPermissions() : sanitizePermissions(permissions),
        active: !!active,
    });
    return { ok: true, user: publicView(row) };
}

export async function updateUser(id, patch) {
    const all = await store.list('users');
    const target = all.find((u) => u.id === id);
    if (!target) return { ok: false, error: 'not_found' };

    const fields = {};
    if (patch.displayName !== undefined) fields.displayName = String(patch.displayName || '').slice(0, 80);
    if (patch.active !== undefined) fields.active = !!patch.active;
    if (patch.isSuper !== undefined) {
        // Don't let the last super-admin be demoted, or we'd lock ourselves out
        // of user management permanently.
        if (!patch.isSuper && target.isSuper) {
            const others = all.filter((u) => u.id !== id && u.isSuper && u.active !== false);
            if (others.length === 0) return { ok: false, error: 'last_super_admin' };
        }
        fields.isSuper = !!patch.isSuper;
    }
    if (patch.permissions !== undefined) {
        // Super-admins always have full permissions; ignore the incoming patch
        // unless they're being demoted in this same request.
        const willBeSuper = fields.isSuper !== undefined ? fields.isSuper : target.isSuper;
        fields.permissions = willBeSuper ? fullPermissions() : sanitizePermissions(patch.permissions);
    } else if (fields.isSuper === true) {
        fields.permissions = fullPermissions();
    }
    if (patch.password) {
        if (String(patch.password).length < 8) return { ok: false, error: 'weak_password' };
        fields.passwordHash = hashPassword(patch.password);
    }

    const row = await store.update('users', id, fields);
    return { ok: true, user: publicView(row) };
}

export async function deleteUser(id) {
    const all = await store.list('users');
    const target = all.find((u) => u.id === id);
    if (!target) return { ok: false, error: 'not_found' };
    if (target.isSuper) {
        const others = all.filter((u) => u.id !== id && u.isSuper && u.active !== false);
        if (others.length === 0) return { ok: false, error: 'last_super_admin' };
    }
    const ok = await store.remove('users', id);
    return ok ? { ok: true } : { ok: false, error: 'not_found' };
}

/* ---------------- auth ---------------- */

export async function verifyCredentials(username, password) {
    const user = await findByUsername(username);
    if (!user || user.active === false) return null;
    if (!verifyPassword(password, user.passwordHash)) return null;
    return user;
}

export async function changePassword(userId, currentPassword, newPassword) {
    const all = await store.list('users');
    const user = all.find((u) => u.id === userId);
    if (!user) return { ok: false, error: 'not_found' };
    if (!verifyPassword(currentPassword, user.passwordHash)) {
        return { ok: false, error: 'invalid_current_password' };
    }
    if (!newPassword || String(newPassword).length < 8) {
        return { ok: false, error: 'weak_password' };
    }
    await store.update('users', user.id, { passwordHash: hashPassword(newPassword) });
    return { ok: true };
}

/* ---------------- bootstrap ----------------
 * Called once at server startup. If the users collection is empty, seed
 * a super-admin from ADMIN_USER / ADMIN_PASS so the existing login keeps
 * working seamlessly after this migration.
 * --------------------------------------------------- */
export async function bootstrapSuperAdmin() {
    const all = await store.list('users');
    if (all.length > 0) return { created: false, count: all.length };

    const username = process.env.ADMIN_USER || 'admin';
    const password = process.env.ADMIN_PASS;
    if (!password) {
        console.warn('[users] users collection empty AND ADMIN_PASS missing — no admin can log in. Set ADMIN_PASS in .env or insert a user manually.');
        return { created: false, count: 0 };
    }

    const result = await createUser({
        username,
        password,
        isSuper: true,
        displayName: 'Super Admin',
    });
    if (result.ok) {
        console.log(`[users] bootstrapped super-admin "${username}" from env`);
        return { created: true, username };
    }
    console.error('[users] bootstrap failed:', result.error);
    return { created: false, error: result.error };
}

/* ---------------- helpers used by middleware ---------------- */

/**
 * Resolve the level a user has for a given module. Super-admins always
 * have 'write'. Inactive users always have 'none'.
 */
export function permissionLevel(user, module) {
    if (!user || user.active === false) return 'none';
    if (user.isSuper) return 'write';
    return (user.permissions && user.permissions[module]) || 'none';
}

export function hasPermission(user, module, required) {
    const level = permissionLevel(user, module);
    if (required === 'read')  return level === 'read' || level === 'write';
    if (required === 'write') return level === 'write';
    return true; // 'none' — always allowed
}
