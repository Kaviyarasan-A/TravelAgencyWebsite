import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

/**
 * Lightweight Lottie player that fetches the JSON from a URL (keeps bundle
 * tiny) and renders it once loaded. If the fetch fails, nothing is shown —
 * the parent should provide a sensible fallback via `fallback` prop.
 *
 * The `LOTTIES` constant below is a curated set of public-CDN JSONs from
 * LottieFiles we use throughout the site. You can add more by URL at any
 * time without touching this component.
 */

export const LOTTIES = {
    // Travel-themed
    airplane:   'https://lottie.host/ebe3ce5b-0c2b-4e06-a8c5-4f4dfd6dba47/WTrWddXZKC.json',
    earth:      'https://lottie.host/2fe6e5e0-6b4a-44d9-9e7f-8c6c3cf8fef9/ehT5jzM0WN.json',
    passport:   'https://lottie.host/f1f0e7fb-a15f-48d3-8a9d-36dfc0f8b6b3/7VN5sc0lzV.json',
    luggage:    'https://lottie.host/1fd5ecbd-6bd6-4f6a-9443-fcd40bf3ec6f/YFuQHcKSQY.json',
    // Process steps
    search:     'https://lottie.host/a05acf68-b7e6-4a9a-ba42-a90a09b15b12/jbp06ECu4T.json',
    customize:  'https://lottie.host/8fbdbe05-c9b5-4ed6-b93a-a8a0a92ce95d/FlWdqNncgG.json',
    payment:    'https://lottie.host/e65f5bd9-d7b1-4a6b-8d13-c3d3d2e6ff80/aMm2zkVcHa.json',
    checkmark:  'https://lottie.host/b9537cef-5822-4aef-ba5d-7e4c78a8a73f/WWGCepD0mg.json',
    // Feeling / trust
    star:       'https://lottie.host/c55e1f63-05c9-4c01-8f9e-93a8e0f2c57b/PoOZWzwpPz.json',
    shield:     'https://lottie.host/32ff5a7b-df88-407c-8e7f-f46e4b24fe99/yK6z0L6m1u.json',
    heart:      'https://lottie.host/9c63fbce-0afa-4be7-85fa-19b717c3b7d3/gQgkTnL1lo.json',
    chat:       'https://lottie.host/61f1a1b8-cf11-49a1-a9d1-f4f9c31afe0c/yPKz7QRNgg.json',
};

// Simple in-memory cache so the same Lottie JSON isn't re-fetched
const cache = new Map();

async function loadLottie(src) {
    if (cache.has(src)) return cache.get(src);
    const promise = fetch(src, { mode: 'cors' })
        .then((r) => r.ok ? r.json() : null)
        .catch(() => null);
    cache.set(src, promise);
    return promise;
}

export default function LottieIcon({
    src,
    name,         // OR pass a key from LOTTIES
    size = 56,
    loop = true,
    autoplay = true,
    className = '',
    fallback = null,
    style = {},
}) {
    const url = src || (name ? LOTTIES[name] : null);
    const [data, setData] = useState(null);
    const [err, setErr] = useState(false);

    useEffect(() => {
        let alive = true;
        if (!url) { setErr(true); return; }
        loadLottie(url).then((json) => {
            if (!alive) return;
            if (!json) setErr(true);
            else setData(json);
        });
        return () => { alive = false; };
    }, [url]);

    if (err || !url) return fallback;

    if (!data) {
        // Simple skeleton while JSON is fetching
        return (
            <div
                className={`inline-block rounded-xl bg-brand-50 animate-pulse ${className}`}
                style={{ width: size, height: size, ...style }}
            />
        );
    }

    return (
        <div className={`inline-block ${className}`} style={{ width: size, height: size, ...style }}>
            <Lottie
                animationData={data}
                loop={loop}
                autoplay={autoplay}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}
