/**
 * MongoDB-backed store. Replaces the previous JSON-file store with a real
 * database while keeping the exact same exported API so server.js does not
 * need to change.
 *
 * Collections used: admin, ads, blogs, bookings, destinations, enquiries,
 * packages, seasons, users.
 *
 * IDs are kept as short string IDs (base64url, 9 random bytes) rather than
 * Mongo ObjectIds so existing slugs/links and any frontend code that holds
 * onto an `id` field continue to work unchanged.
 *
 * Single-document collections (currently only `seasons`) live as a single
 * document with a fixed _id of "config".
 */
import crypto from 'node:crypto';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017';
const MONGODB_DB  = process.env.MONGODB_DB  || 'tripwithuz';

let client = null;
let db = null;
let connecting = null;

async function connect() {
    if (db) return db;
    if (connecting) return connecting;
    connecting = (async () => {
        client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 8000,
            maxPoolSize: 10,
        });
        await client.connect();
        db = client.db(MONGODB_DB);
        console.log(`[mongo] connected to ${MONGODB_DB}`);
        return db;
    })();
    return connecting;
}

/**
 * Eagerly establish the connection at boot. Called from server.js so a bad
 * connection string fails fast rather than on the first request.
 */
export async function init() {
    await connect();
    // Ensure helpful indexes. These are idempotent — Mongo skips ones that exist.
    const tasks = [
        db.collection('packages').createIndex({ slug: 1 }, { unique: false }),
        db.collection('blogs').createIndex({ slug: 1 }, { unique: false }),
        db.collection('destinations').createIndex({ slug: 1 }, { unique: false }),
        db.collection('enquiries').createIndex({ createdAt: -1 }),
        db.collection('bookings').createIndex({ createdAt: -1 }),
        db.collection('users').createIndex({ username: 1 }, { unique: true }),
    ];
    await Promise.allSettled(tasks);
}

export async function close() {
    if (client) await client.close();
    client = null; db = null; connecting = null;
}

function col(name) {
    if (!db) throw new Error('[mongo] store used before init() resolved');
    return db.collection(name);
}

export function newId() {
    return crypto.randomBytes(9).toString('base64url');
}

/** Drop Mongo's internal _id field from results so payloads stay clean. */
function strip(doc) {
    if (!doc || typeof doc !== 'object') return doc;
    // eslint-disable-next-line no-unused-vars
    const { _id, ...rest } = doc;
    return rest;
}

/* ---------------- Collection API (arrays of records) ---------------- */

export async function list(name) {
    // Newest-first matches the old in-memory `unshift` ordering so the
    // dashboard activity feed keeps showing the most recent entries.
    const rows = await col(name).find({}).sort({ createdAt: -1 }).toArray();
    return rows.map(strip);
}

export async function get(name, id) {
    const row = await col(name).findOne({ id });
    return row ? strip(row) : null;
}

export async function insert(name, record) {
    const row = {
        id: record.id || newId(),
        createdAt: record.createdAt || new Date().toISOString(),
        ...record,
    };
    // Make sure the caller-supplied id/createdAt always win over the defaults
    // when explicitly provided, which is the behaviour spread above already
    // gives — preserved here for clarity.
    await col(name).insertOne(row);
    return strip(row);
}

export async function update(name, id, patch) {
    const set = { ...patch, id, updatedAt: new Date().toISOString() };
    const res = await col(name).findOneAndUpdate(
        { id },
        { $set: set },
        { returnDocument: 'after' },
    );
    // Mongo driver v6 returns the document directly; older return shape is { value }.
    const doc = res && res.value !== undefined ? res.value : res;
    return doc ? strip(doc) : null;
}

export async function remove(name, id) {
    const res = await col(name).deleteOne({ id });
    return res.deletedCount > 0;
}

export async function seedIfEmpty(name, rows) {
    const count = await col(name).estimatedDocumentCount();
    if (count > 0) {
        return (await col(name).find({}).sort({ createdAt: -1 }).toArray()).map(strip);
    }
    if (!Array.isArray(rows) || rows.length === 0) return [];
    const seeded = rows.map((r) => ({
        id: r.id || newId(),
        createdAt: r.createdAt || new Date().toISOString(),
        ...r,
    }));
    await col(name).insertMany(seeded);
    return seeded.map(strip);
}

/* ---------------- Single-document helpers ----------------
 * Single-doc collections (currently `seasons`) keep one document with a
 * fixed _id of "config". Same external semantics as before.
 * --------------------------------------------------------- */
const SINGLE_DOC_ID = 'config';

export async function getDoc(name, fallback = {}) {
    const doc = await col(name).findOne({ _id: SINGLE_DOC_ID });
    if (!doc) return fallback;
    // eslint-disable-next-line no-unused-vars
    const { _id, ...rest } = doc;
    return rest;
}

export async function setDoc(name, data) {
    const next = { ...data, updatedAt: new Date().toISOString() };
    await col(name).updateOne(
        { _id: SINGLE_DOC_ID },
        { $set: next },
        { upsert: true },
    );
    return next;
}
