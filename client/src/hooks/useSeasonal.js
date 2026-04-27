import { useEffect, useState } from 'react';
import { api } from '../api.js';

/**
 * useSeasonal — pulls the currently-active seasonal payload from the
 * server. Server picks the season (auto by month, or admin-overridden)
 * and returns:
 *   { active, detected, mode, label, tagline, heroImages[], featured[] }
 *
 * Cached at module scope so all consumers share one network request per
 * page load.
 */
let cache = null;
let inflight = null;
const listeners = new Set();
function notify() { for (const cb of listeners) cb(cache); }

async function ensureLoaded() {
    if (cache) return cache;
    if (inflight) return inflight;
    inflight = (async () => {
        try {
            const r = await api.seasonal();
            cache = r.ok ? r.data : null;
        } catch { cache = null; }
        notify();
        return cache;
    })();
    return inflight;
}

export function useSeasonal() {
    const [data, setData] = useState(cache);
    useEffect(() => {
        let active = true;
        const cb = (val) => { if (active) setData(val); };
        listeners.add(cb);
        ensureLoaded().then((val) => { if (active) setData(val); });
        return () => { active = false; listeners.delete(cb); };
    }, []);
    return data; // null until loaded
}

export function invalidateSeasonal() { cache = null; inflight = null; }
