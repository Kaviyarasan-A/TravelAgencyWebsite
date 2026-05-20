/**
 * One-time migration: copy every server/db/*.json file into MongoDB.
 *
 * Usage:
 *   cd server
 *   node scripts/migrate-json-to-mongo.js          # safe run, won't overwrite
 *   node scripts/migrate-json-to-mongo.js --force  # wipes and re-imports
 *
 * Reads MONGODB_URI / MONGODB_DB from server/.env. Idempotent by default:
 * - Arrays of records: upserts by `id` so rerunning never duplicates.
 * - Single-doc files (seasons): upserts the one config document.
 *
 * Pass --force to drop each collection before importing — use when you want
 * the Mongo state to exactly match the JSON snapshot.
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '..', 'db');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;
const MONGODB_DB  = process.env.MONGODB_DB  || 'tripwithuz';

if (!MONGODB_URI) {
    console.error('FATAL: MONGODB_URI (or MONGO_URL) is not set in server/.env');
    process.exit(1);
}

const FORCE = process.argv.includes('--force');

// `seasons.json` holds a single object (not an array) — see store.getDoc/setDoc.
const SINGLE_DOC_COLLECTIONS = new Set(['seasons']);

async function loadJson(file) {
    try {
        const txt = await fs.readFile(file, 'utf8');
        return JSON.parse(txt);
    } catch (e) {
        if (e.code === 'ENOENT') return null;
        throw e;
    }
}

async function migrate() {
    console.log(`[migrate] connecting to ${MONGODB_DB} @ ${MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//$1:***@')}`);
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    const db = client.db(MONGODB_DB);

    const files = (await fs.readdir(DB_DIR)).filter((f) => f.endsWith('.json'));
    if (files.length === 0) {
        console.warn(`[migrate] no JSON files found in ${DB_DIR}`);
        await client.close();
        return;
    }

    let totalDocs = 0;
    for (const file of files) {
        const name = file.replace(/\.json$/, '');
        const data = await loadJson(path.join(DB_DIR, file));
        if (data === null) {
            console.log(`[migrate] ${name}: file missing — skipped`);
            continue;
        }

        const collection = db.collection(name);
        if (FORCE) {
            await collection.deleteMany({});
            console.log(`[migrate] ${name}: cleared (force)`);
        }

        if (SINGLE_DOC_COLLECTIONS.has(name)) {
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                await collection.updateOne(
                    { _id: 'config' },
                    { $set: data },
                    { upsert: true },
                );
                totalDocs += 1;
                console.log(`[migrate] ${name}: 1 config document upserted`);
            } else {
                console.log(`[migrate] ${name}: empty/invalid, skipped`);
            }
            continue;
        }

        if (!Array.isArray(data) || data.length === 0) {
            console.log(`[migrate] ${name}: empty array, skipped`);
            continue;
        }

        // Upsert each record by its `id` so reruns are idempotent.
        const ops = data.map((row) => ({
            updateOne: {
                filter: { id: row.id },
                update: { $set: row },
                upsert: true,
            },
        }));
        const res = await collection.bulkWrite(ops, { ordered: false });
        const inserted = res.upsertedCount || 0;
        const updated = res.modifiedCount || 0;
        totalDocs += data.length;
        console.log(`[migrate] ${name}: ${data.length} records (${inserted} new, ${updated} updated)`);
    }

    console.log(`[migrate] done — ${totalDocs} document(s) total`);
    await client.close();
}

migrate().catch((err) => {
    console.error('[migrate] FAILED:', err);
    process.exit(1);
});
