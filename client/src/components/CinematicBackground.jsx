import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Cinematic background — a "video-feeling" loop that ALWAYS renders something.
 *
 * Behaviour:
 *  1. Tries to play a real `<video>` from a CDN URL.
 *  2. If the video errors (CDN issue, codec, network, blocked), it transparently
 *     hides itself and the cross-fading Ken-Burns image slideshow underneath
 *     becomes the background — already running, no flash.
 *  3. A subtle floating-particles overlay is always on for that "alive" feel.
 *
 * This deliberately avoids any guesswork about whether a third-party video URL
 * will hold up — the slideshow is the source of truth, the video is a bonus.
 */
const DEFAULT_IMAGES = [
    // Verified-stable Pexels travel photos (already in use elsewhere in the app)
    'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=2000', // Kerala backwaters
    'https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&cs=tinysrgb&w=2000', // Santorini
    'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=2000', // Dubai
    'https://images.pexels.com/photos/2100941/pexels-photo-2100941.jpeg?auto=compress&cs=tinysrgb&w=2000', // Bali
];

export default function CinematicBackground({
    videoSrc,
    images = DEFAULT_IMAGES,
    interval = 6000,
    overlay = 'dark',   // 'dark' | 'warm' | 'none'
}) {
    const [idx, setIdx] = useState(0);
    const [videoOk, setVideoOk] = useState(!!videoSrc);
    const videoRef = useRef(null);

    useEffect(() => {
        const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
        return () => clearInterval(t);
    }, [images, interval]);

    // If the video element fires error, hide it permanently
    useEffect(() => {
        const v = videoRef.current;
        if (!v || !videoSrc) return;
        const onErr = () => setVideoOk(false);
        v.addEventListener('error', onErr);
        // Also detect stall: if no metadata after 4s, treat as failed.
        const stallTimer = setTimeout(() => {
            if (v.readyState < 1) setVideoOk(false);
        }, 4000);
        return () => {
            v.removeEventListener('error', onErr);
            clearTimeout(stallTimer);
        };
    }, [videoSrc]);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Layer 1 — Ken-Burns crossfading slideshow (always running) */}
            <AnimatePresence mode="sync">
                <motion.div
                    key={images[idx]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 1.4 }, scale: { duration: interval / 1000 + 2, ease: 'linear' } }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${images[idx]})` }}
                />
            </AnimatePresence>

            {/* Layer 2 — Optional video on top (graceful fallback to slideshow on error) */}
            {videoSrc && videoOk && (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    autoPlay muted loop playsInline preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => setVideoOk(false)}
                />
            )}

            {/* Layer 3 — Floating soft particles for "alive" feel */}
            <div aria-hidden className="absolute inset-0 pointer-events-none">
                {[...Array(14)].map((_, i) => (
                    <span
                        key={i}
                        className="absolute rounded-full bg-white/40 blur-[1px]"
                        style={{
                            width: `${4 + (i % 4) * 2}px`,
                            height: `${4 + (i % 4) * 2}px`,
                            left: `${(i * 13 + 7) % 100}%`,
                            top: `${(i * 17 + 5) % 100}%`,
                            animation: `floatY ${10 + (i % 5) * 2}s ease-in-out ${i * 0.4}s infinite`,
                            opacity: 0.35,
                        }}
                    />
                ))}
            </div>

            {/* Layer 4 — Cinematic dark/warm overlay for text contrast */}
            {overlay === 'dark' && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/55 to-ink/95" />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
                </>
            )}
            {overlay === 'warm' && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-900/55 via-ink/45 to-ink/90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-amber-500/15" />
                </>
            )}
        </div>
    );
}
