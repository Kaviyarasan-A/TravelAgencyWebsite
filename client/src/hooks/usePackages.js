/**
 * Hook + cache for the live package catalog.
 *
 * On first call the browser fetches /api/packages once and memoizes the
 * result for the rest of the session. While the request is in flight,
 * components see the bundled PACKAGES from data.js so nothing is blank
 * during boot — once the live data arrives, components re-render with
 * whatever the admin has configured.
 */
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { PACKAGES as STATIC_PACKAGES } from '../data.js';

let cache = null;
let inflight = null;
const listeners = new Set();

function notify() {
    for (const cb of listeners) cb(cache);
}

async function ensureLoaded() {
    if (cache) return cache;
    if (inflight) return inflight;
    inflight = (async () => {
        try {
            const r = await api.listPackages();
            if (r.ok && Array.isArray(r.data?.packages) && r.data.packages.length > 0) {
                cache = r.data.packages;
            } else {
                cache = STATIC_PACKAGES;
            }
        } catch {
            cache = STATIC_PACKAGES;
        }
        notify();
        return cache;
    })();
    return inflight;
}

export function usePackages() {
    const [pkgs, setPkgs] = useState(cache || STATIC_PACKAGES);

    useEffect(() => {
        let active = true;
        const cb = (val) => { if (active) setPkgs(val || STATIC_PACKAGES); };
        listeners.add(cb);
        ensureLoaded().then((val) => { if (active) setPkgs(val); });
        return () => { active = false; listeners.delete(cb); };
    }, []);

    return pkgs;
}

export function usePackage(slug) {
    const list = usePackages();
    return list.find((p) => p.slug === slug) || null;
}

export function invalidatePackages() {
    cache = null;
    inflight = null;
}
