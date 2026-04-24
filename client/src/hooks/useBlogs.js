import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { BLOGS as STATIC_BLOGS } from '../data.js';

let cache = null;
let inflight = null;
const listeners = new Set();

function notify() { for (const cb of listeners) cb(cache); }

async function ensureLoaded() {
    if (cache) return cache;
    if (inflight) return inflight;
    inflight = (async () => {
        try {
            const r = await api.listBlogs();
            cache = r.ok && Array.isArray(r.data?.blogs) && r.data.blogs.length > 0
                ? r.data.blogs
                : STATIC_BLOGS;
        } catch { cache = STATIC_BLOGS; }
        notify();
        return cache;
    })();
    return inflight;
}

export function useBlogs() {
    const [blogs, setBlogs] = useState(cache || STATIC_BLOGS);
    useEffect(() => {
        let active = true;
        const cb = (val) => { if (active) setBlogs(val || STATIC_BLOGS); };
        listeners.add(cb);
        ensureLoaded().then((val) => { if (active) setBlogs(val); });
        return () => { active = false; listeners.delete(cb); };
    }, []);
    return blogs;
}

export function invalidateBlogs() { cache = null; inflight = null; }
