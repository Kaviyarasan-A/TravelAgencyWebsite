/**
 * Tiny atomic JSON file store — good enough for a single-process Node
 * server. Each collection is an array of records serialized to disk.
 *
 * Operations are serialized with an in-memory mutex so concurrent API
 * requests don't corrupt the file. Writes go to a .tmp file and are
 * renamed into place to avoid half-written JSON.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '..', 'db');

async function ensureDir() {
    await fs.mkdir(DB_DIR, { recursive: true });
}

function filePath(name) {
    return path.join(DB_DIR, `${name}.json`);
}

const locks = new Map();
function withLock(name, fn) {
    const prev = locks.get(name) || Promise.resolve();
    const next = prev.then(fn, fn);
    locks.set(
        name,
        next.catch(() => {}),
    );
    return next;
}

async function readRaw(name, fallback = []) {
    await ensureDir();
    try {
        const txt = await fs.readFile(filePath(name), 'utf8');
        return JSON.parse(txt);
    } catch (err) {
        if (err.code === 'ENOENT') return fallback;
        throw err;
    }
}

async function writeRaw(name, data) {
    await ensureDir();
    const target = filePath(name);
    const tmp = `${target}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tmp, target);
}

export function newId() {
    return crypto.randomBytes(9).toString('base64url');
}

export async function list(name) {
    return withLock(name, () => readRaw(name, []));
}

export async function get(name, id) {
    const all = await list(name);
    return all.find((r) => r.id === id) || null;
}

export async function insert(name, record) {
    return withLock(name, async () => {
        const all = await readRaw(name, []);
        const row = { id: record.id || newId(), createdAt: record.createdAt || new Date().toISOString(), ...record };
        all.unshift(row);
        await writeRaw(name, all);
        return row;
    });
}

export async function update(name, id, patch) {
    return withLock(name, async () => {
        const all = await readRaw(name, []);
        const i = all.findIndex((r) => r.id === id);
        if (i === -1) return null;
        all[i] = { ...all[i], ...patch, id: all[i].id, updatedAt: new Date().toISOString() };
        await writeRaw(name, all);
        return all[i];
    });
}

export async function remove(name, id) {
    return withLock(name, async () => {
        const all = await readRaw(name, []);
        const next = all.filter((r) => r.id !== id);
        if (next.length === all.length) return false;
        await writeRaw(name, next);
        return true;
    });
}

export async function seedIfEmpty(name, rows) {
    return withLock(name, async () => {
        const all = await readRaw(name, null);
        if (Array.isArray(all) && all.length > 0) return all;
        const seeded = rows.map((r) => ({
            id: r.id || newId(),
            createdAt: new Date().toISOString(),
            ...r,
        }));
        await writeRaw(name, seeded);
        return seeded;
    });
}

/* -----------------------------------------------------------------
 * Single-document helpers — same on-disk format as collections, but
 * the file holds one object instead of an array. Used for app-wide
 * config (seasonal content, feature flags, etc).
 * ----------------------------------------------------------------- */
export async function getDoc(name, fallback = {}) {
    return withLock(name, async () => {
        const data = await readRaw(name, null);
        if (data && !Array.isArray(data) && typeof data === 'object') return data;
        return fallback;
    });
}

export async function setDoc(name, data) {
    return withLock(name, async () => {
        const next = { ...data, updatedAt: new Date().toISOString() };
        await writeRaw(name, next);
        return next;
    });
}
