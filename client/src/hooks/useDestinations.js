import { useEffect, useState } from 'react';
import { api } from '../api.js';

let cache = null;
let inflight = null;
const listeners = new Set();
function notify() { for (const cb of listeners) cb(cache); }

async function ensureLoaded() {
    if (cache) return cache;
    if (inflight) return inflight;
    inflight = (async () => {
        try {
            const r = await api.listDestinations();
            cache = r.ok && Array.isArray(r.data?.destinations) ? r.data.destinations : [];
        } catch { cache = []; }
        notify();
        return cache;
    })();
    return inflight;
}

/**
 * useDestinations(kind) — returns destinations of a given kind:
 *   'top'      → top international destinations (Dubai, Bali, Switzerland…)
 *   'popular'  → curated India-focused holiday packages
 *   undefined  → everything
 */
export function useDestinations(kind) {
    const [list, setList] = useState(cache || []);
    useEffect(() => {
        let active = true;
        const cb = (val) => { if (active) setList(val || []); };
        listeners.add(cb);
        ensureLoaded().then((val) => { if (active) setList(val); });
        return () => { active = false; listeners.delete(cb); };
    }, []);
    return kind ? list.filter((d) => d.kind === kind) : list;
}

export function invalidateDestinations() { cache = null; inflight = null; }
