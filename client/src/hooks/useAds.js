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
            const r = await api.listAds();
            cache = r.ok && Array.isArray(r.data?.ads) ? r.data.ads : [];
        } catch { cache = []; }
        notify();
        return cache;
    })();
    return inflight;
}

export function useAds(placement) {
    const [ads, setAds] = useState(cache || []);
    useEffect(() => {
        let active = true;
        const cb = (val) => { if (active) setAds(val || []); };
        listeners.add(cb);
        ensureLoaded().then((val) => { if (active) setAds(val); });
        return () => { active = false; listeners.delete(cb); };
    }, []);
    return placement ? ads.filter((a) => a.placement === placement) : ads;
}

export function invalidateAds() { cache = null; inflight = null; }
