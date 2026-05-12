import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiMapPin, FiStar, FiClock, FiArrowRight, FiVolume2, FiVolumeX,
    FiPlay, FiCheck,
} from 'react-icons/fi';
import SafeBgImage from './SafeBgImage.jsx';

/**
 * Floating virtual-tour preview popup. Shows a centered mini-modal with
 * either an autoplaying tour video (if `pkg.tourVideo` is set) or an
 * animated Ken-Burns pan of the hero image.
 *
 * Anchored in a fixed overlay — so the parent doesn't need to manage
 * portals. Receives a stable `pkg` prop + `open` flag.
 */
export default function TourPreviewPopup({ pkg, open, onClose }) {
    const videoRef = useRef(null);
    const [muted, setMuted] = useState(true);
    const [videoReady, setVideoReady] = useState(false);
    const [videoErr, setVideoErr] = useState(false);

    useEffect(() => {
        setVideoReady(false);
        setVideoErr(false);
        setMuted(true);
    }, [pkg?.slug]);

    // Allow ESC to close + lock body scroll while open
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    // Try to kick off playback explicitly (some browsers ignore `autoPlay`
    // until the element is actually in the DOM and the user has interacted).
    useEffect(() => {
        if (!open) return;
        const v = videoRef.current;
        if (!v) return;
        const t = setTimeout(() => { v.play?.().catch(() => {}); }, 120);
        return () => clearTimeout(t);
    }, [open, pkg?.slug]);

    const toggleMute = () => {
        setMuted((m) => {
            if (videoRef.current) videoRef.current.muted = !m;
            return !m;
        });
    };

    return (
        <AnimatePresence>
            {open && pkg && (
                <motion.div
                    key="tour-popup"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[300] flex items-center justify-center p-4 pointer-events-auto"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-ink/75 backdrop-blur-md"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Popup card */}
                    <motion.div
                        role="dialog" aria-modal="true"
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                        className="relative z-10 w-full max-w-3xl bg-white rounded-[32px] overflow-hidden shadow-float"
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur hover:bg-black/60 text-white flex items-center justify-center transition"
                        >
                            <FiX size={18} />
                        </button>

                        {/* Video / Image hero */}
                        <div className="relative h-[320px] sm:h-[380px] overflow-hidden bg-slate-900">
                            {pkg.tourVideo && !videoErr ? (
                                <>
                                    {/* Poster image for instant feedback while video loads */}
                                    <motion.div
                                        initial={{ scale: 1.08 }} animate={{ scale: videoReady ? 1 : 1.08 }}
                                        transition={{ duration: 1.2 }}
                                        className="absolute inset-0"
                                    >
                                        <SafeBgImage src={pkg.image} className="absolute inset-0 bg-cover bg-center" />
                                    </motion.div>
                                    <video
                                        ref={videoRef}
                                        src={pkg.tourVideo}
                                        poster={pkg.image}
                                        autoPlay muted={muted} loop playsInline
                                        preload="auto"
                                        onCanPlay={() => setVideoReady(true)}
                                        onLoadedData={() => setVideoReady(true)}
                                        onError={() => setVideoErr(true)}
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    {/* Mute toggle */}
                                    <button
                                        onClick={toggleMute}
                                        className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur hover:bg-black/70 text-white flex items-center justify-center transition">
                                        {muted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
                                    </button>
                                    {/* "LIVE TOUR" pill */}
                                    <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white bg-brand-500 px-2.5 py-1 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        Virtual Tour
                                    </div>
                                </>
                            ) : (
                                // Fallback — animated Ken-Burns pan of the image
                                <>
                                    <motion.div
                                        key="fallback"
                                        initial={{ scale: 1.05, x: -20, y: -10 }}
                                        animate={{ scale: 1.15, x: 10, y: 5 }}
                                        transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
                                        className="absolute inset-0"
                                    >
                                        <SafeBgImage src={pkg.image} className="absolute inset-0 bg-cover bg-center" />
                                    </motion.div>
                                    <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white bg-black/55 px-2.5 py-1 rounded-full">
                                        <FiPlay size={10} /> Preview
                                    </div>
                                </>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                            {/* Title block */}
                            <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                                <div className="text-[11px] uppercase tracking-widest opacity-90 inline-flex items-center gap-1.5">
                                    <FiMapPin /> {pkg.city}, {pkg.country}
                                </div>
                                <h3 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight mt-1 line-clamp-2">
                                    {pkg.title}
                                </h3>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-5 sm:p-6">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted mb-4">
                                <span className="inline-flex items-center gap-1.5">
                                    <FiClock className="text-brand-500" /> {pkg.days}D / {pkg.nights}N
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <FiStar className="text-accent fill-current" /> {pkg.rating} ({pkg.reviews})
                                </span>
                                {pkg.tags?.slice(0, 3).map((t) => (
                                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-medium">{t}</span>
                                ))}
                            </div>

                            {pkg.highlights?.length > 0 && (
                                <ul className="grid sm:grid-cols-2 gap-2 mb-5">
                                    {pkg.highlights.slice(0, 4).map((h) => (
                                        <li key={h} className="flex items-start gap-2 text-sm text-ink">
                                            <FiCheck className="text-green-500 mt-0.5 shrink-0" /> {h}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-dashed border-ink-line">
                                <Link
                                    to={`/packages/${pkg.slug}`}
                                    className="btn-primary"
                                    onClick={onClose}
                                >
                                    View full trip <FiArrowRight />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
