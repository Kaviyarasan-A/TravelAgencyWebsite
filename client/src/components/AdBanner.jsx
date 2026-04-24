import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiX, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { useAds } from '../hooks/useAds.js';

const THEME = {
    brand:   { bg: 'from-brand-500 to-brand-700',    badge: 'bg-white/20 text-white' },
    blue:    { bg: 'from-blue-600 to-indigo-700',    badge: 'bg-white/20 text-white' },
    emerald: { bg: 'from-emerald-600 to-teal-700',   badge: 'bg-white/20 text-white' },
    dark:    { bg: 'from-slate-900 to-slate-700',    badge: 'bg-brand-500 text-white' },
};

function pickTheme(key) {
    return THEME[key] || THEME.brand;
}

/**
 * Renders the media background of an ad — a looping muted video if `video` is set,
 * otherwise the static image. Returns null if neither is provided.
 */
function MediaBg({ ad, className = '' }) {
    const ref = useRef(null);
    const [err, setErr] = useState(false);
    useEffect(() => {
        if (!ad.video || !ref.current) return;
        const v = ref.current;
        v.play?.().catch(() => {});
    }, [ad.video]);

    if (ad.video && !err) {
        return (
            <video
                ref={ref}
                src={ad.video}
                poster={ad.image || undefined}
                autoPlay muted loop playsInline preload="auto"
                onError={() => setErr(true)}
                className={`absolute inset-0 w-full h-full object-cover ${className}`}
            />
        );
    }
    if (ad.image) {
        return <div className={`absolute inset-0 bg-cover bg-center ${className}`} style={{ backgroundImage: `url(${ad.image})` }} />;
    }
    return null;
}

/* Thin strip (sitewide) — sits under the nav. */
export function SitewideStrip() {
    const ads = useAds('sitewide_strip');
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;
    const ad = ads[0];
    if (!ad) return null;
    const theme = pickTheme(ad.theme);
    return (
        <div className={`relative bg-gradient-to-r ${theme.bg} text-white`}>
            <div className="container-x flex items-center justify-center gap-3 py-2 text-sm">
                {ad.badge && <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${theme.badge}`}>{ad.badge}</span>}
                <span className="font-semibold truncate">{ad.title}</span>
                {ad.subtitle && <span className="hidden md:inline opacity-90">— {ad.subtitle}</span>}
                {ad.ctaLink && (
                    <Link to={ad.ctaLink} className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-semibold">
                        {ad.ctaText || 'View'} <FiArrowRight />
                    </Link>
                )}
            </div>
            <button onClick={() => setDismissed(true)} aria-label="Dismiss"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center">
                <FiX size={14} />
            </button>
        </div>
    );
}

/* Big hero-style banner. Intended for 'home_hero' placement. */
export function AdHero({ placement = 'home_hero' }) {
    const ads = useAds(placement);
    if (!ads.length) return null;
    return (
        <div className="space-y-4">
            {ads.slice(0, 2).map((ad, i) => <AdHeroCard key={ad.id || i} ad={ad} />)}
        </div>
    );
}

function AdHeroCard({ ad }) {
    const theme = pickTheme(ad.theme);
    const videoRef = useRef(null);
    const [muted, setMuted] = useState(true);
    const [videoReady, setVideoReady] = useState(false);
    const [videoErr, setVideoErr] = useState(false);

    // Some browsers/extensions refuse autoplay unless play() is explicitly
    // called. Nudge it once the video element is mounted.
    useEffect(() => {
        if (!ad.video || !videoRef.current) return;
        const v = videoRef.current;
        const tryPlay = () => { v.play?.().catch(() => {}); };
        tryPlay();
        const t = setTimeout(tryPlay, 500);
        return () => clearTimeout(t);
    }, [ad.video]);

    const toggleMute = () => {
        setMuted((m) => {
            if (videoRef.current) videoRef.current.muted = !m;
            return !m;
        });
    };

    const hasVideo = !!ad.video && !videoErr;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.bg} shadow-card min-h-[260px]`}>
            {(ad.image || hasVideo) && (
                <>
                    {/* Poster always visible so it doesn't flash black before the video loads */}
                    {ad.image && (
                        <div className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
                            style={{ backgroundImage: `url(${ad.image})` }} />
                    )}
                    {hasVideo && (
                        <video
                            ref={videoRef}
                            src={ad.video}
                            poster={ad.image || undefined}
                            autoPlay muted={muted} loop playsInline
                            preload="auto"
                            onCanPlay={() => setVideoReady(true)}
                            onLoadedData={() => setVideoReady(true)}
                            onError={() => setVideoErr(true)}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                    {/* Lighter, directional overlay so the video/image is visible but text still readable */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${theme.bg} opacity-70 md:opacity-60`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                </>
            )}
            <div className="relative grid md:grid-cols-[1.4fr_1fr] items-center gap-6 p-8 md:p-10 text-white">
                <div>
                    {ad.badge && (
                        <span className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-3 ${theme.badge}`}>
                            {hasVideo && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                            {ad.badge}
                        </span>
                    )}
                    <h3 className="font-display text-2xl md:text-3xl font-extrabold leading-tight drop-shadow-md">{ad.title}</h3>
                    {ad.subtitle && <p className="text-white/95 mt-2 text-base md:text-lg drop-shadow">{ad.subtitle}</p>}
                    {ad.description && <p className="text-white/85 mt-3 text-sm max-w-xl">{ad.description}</p>}
                    {ad.ctaLink && (
                        <Link to={ad.ctaLink} className="btn-white mt-5 inline-flex">
                            {ad.ctaText || 'Explore'} <FiArrowRight />
                        </Link>
                    )}
                </div>
            </div>
            {hasVideo && (
                <button
                    onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur flex items-center justify-center text-white z-10 border border-white/30 transition">
                    {muted ? <FiVolumeX /> : <FiVolume2 />}
                </button>
            )}
        </motion.div>
    );
}

/* Inline banner for 'home_mid' or 'packages_top' — short horizontal promo. */
export function AdInline({ placement }) {
    const ads = useAds(placement);
    if (!ads.length) return null;
    const ad = ads[0];
    const theme = pickTheme(ad.theme);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.bg} text-white shadow-card`}>
            {(ad.image || ad.video) && (
                <>
                    <MediaBg ad={ad} className="opacity-80" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${theme.bg} opacity-55`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
                </>
            )}
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-7">
                <div>
                    {ad.badge && <span className={`inline-block text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full mb-2 ${theme.badge}`}>{ad.badge}</span>}
                    <h4 className="font-display text-xl md:text-2xl font-bold leading-tight">{ad.title}</h4>
                    {ad.subtitle && <p className="text-white/85 text-sm mt-1">{ad.subtitle}</p>}
                </div>
                {ad.ctaLink && (
                    <Link to={ad.ctaLink} className="btn-white shrink-0">
                        {ad.ctaText || 'Learn more'} <FiArrowRight />
                    </Link>
                )}
            </div>
        </motion.div>
    );
}

/* Auto-scrolling horizontal rail of ads — useful for a "deals carousel" style strip. */
export function AdCarousel({ placement = 'home_hero' }) {
    const ads = useAds(placement);
    if (ads.length < 2) return null;
    // Duplicate the list so the marquee loops seamlessly
    const rail = [...ads, ...ads];
    return (
        <div className="relative overflow-hidden rounded-3xl">
            <div className="flex gap-4 animate-marquee" style={{ width: 'max-content' }}>
                {rail.map((ad, i) => (
                    <div key={i} className="w-[320px] md:w-[420px] shrink-0">
                        <AdInline placement={placement} />
                    </div>
                ))}
            </div>
        </div>
    );
}
