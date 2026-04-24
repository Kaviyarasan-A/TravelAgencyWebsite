import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiArrowRight, FiStar, FiChevronLeft, FiChevronRight,
    FiPlay, FiSearch, FiCalendar, FiUsers,
} from 'react-icons/fi';
import { usePackages } from '../hooks/usePackages.js';
import TourPreviewPopup from './TourPreviewPopup.jsx';

// Sample travel videos from Pexels (direct CDN, hotlink-friendly).
// These loop as the hero background, auto-rotating with the slide state.
const HERO_SLIDES = [
    {
        location: 'Kerala · Backwaters',
        title: 'Trips that feel',
        accent: 'handcrafted',
        subtitle: 'Houseboats, hill stations and hidden beaches — built by locals.',
        video: 'https://videos.pexels.com/video-files/1851190/1851190-hd_1280_720_25fps.mp4',
        fallbackImg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=2400&q=80',
        preferSlug: 'kerala-gods-own-country',
    },
    {
        location: 'Dubai · UAE',
        title: 'Skylines,',
        accent: 'on your schedule',
        subtitle: 'Luxury done right — deserts, yachts, Burj Khalifa at sunset.',
        video: 'https://videos.pexels.com/video-files/1526909/1526909-hd_1280_720_24fps.mp4',
        fallbackImg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2400&q=80',
        preferSlug: 'dubai-desert-luxury',
    },
    {
        location: 'Bali · Indonesia',
        title: 'Honeymoons',
        accent: 'to linger in',
        subtitle: 'Jungle villas, floating breakfasts and private beach dinners.',
        video: 'https://videos.pexels.com/video-files/1851190/1851190-hd_1280_720_25fps.mp4',
        fallbackImg: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=2400&q=80',
        preferSlug: 'bali-honeymoon-escape',
    },
];

const SEARCH_TABS = [
    { key: 'packages', label: 'Holiday' },
    { key: 'honeymoon', label: 'Honeymoon' },
    { key: 'family',    label: 'Family' },
    { key: 'luxury',    label: 'Luxury' },
];

export default function Hero() {
    const [slide, setSlide] = useState(0);
    const [tab, setTab] = useState('packages');
    const [dest, setDest] = useState('');
    const [when, setWhen] = useState('');
    const [pax, setPax] = useState('2 Adults');
    const hoverRef = useRef(false);
    const PACKAGES = usePackages();
    const [previewPkg, setPreviewPkg] = useState(null);
    const nav = useNavigate();
    const videoRef = useRef(null);
    const today = new Date().toISOString().split('T')[0];

    // Auto-advance slide every 10s
    useEffect(() => {
        const t = setInterval(() => {
            if (!hoverRef.current && !previewPkg) setSlide((s) => (s + 1) % HERO_SLIDES.length);
        }, 10000);
        return () => clearInterval(t);
    }, [previewPkg]);

    // Nudge video playback (browsers sometimes stall autoplay)
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.play?.().catch(() => {});
    }, [slide]);

    const current = HERO_SLIDES[slide];

    const gallery = useMemo(() => {
        const pool = PACKAGES.filter((p) => p.image);
        if (pool.length < 4) return pool;
        const prefer = current?.preferSlug
            ? pool.findIndex((p) => p.slug === current.preferSlug)
            : -1;
        return prefer > 0 ? [...pool.slice(prefer), ...pool.slice(0, prefer)] : pool;
    }, [PACKAGES, current]);

    const submitSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (dest) params.set('q', dest);
        if (tab && tab !== 'packages') params.set('tag', tab === 'honeymoon' ? 'Honeymoon' : tab === 'family' ? 'Family' : 'Luxury');
        nav(`/packages${params.toString() ? `?${params.toString()}` : ''}`);
    };

    return (
        <>
            <section className="relative min-h-screen flex flex-col text-white overflow-hidden">
                {/* --- Background video layer --- */}
                <AnimatePresence mode="sync">
                    <motion.div
                        key={current.video}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="absolute inset-0"
                    >
                        {/* Poster / fallback image stays behind the video so there's
                            no black flash while the video loads. */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${current.fallbackImg})` }}
                        />
                        <video
                            ref={videoRef}
                            key={current.video}
                            src={current.video}
                            poster={current.fallbackImg}
                            autoPlay muted loop playsInline preload="auto"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Layered gradient overlays (PickYourTrail-style) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/85" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

                {/* --- Copy block --- */}
                <div className="container-x relative z-10 pt-40 lg:pt-44 pb-10 flex-1 flex items-center">
                    <div className="w-full">
                        <motion.div
                            key={slide}
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-3xl"
                        >
                            <div className="inline-flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-white/85 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15">
                                <FiMapPin size={11} className="text-brand-400" />
                                {current.location}
                            </div>

                            <h1 className="mt-6 font-display font-extrabold text-white text-[44px] sm:text-[60px] lg:text-[80px] leading-[1.02]"
                                style={{ letterSpacing: '-0.04em' }}>
                                <span className="block">{current.title}</span>
                                <span className="block text-brand-400">{current.accent}</span>
                            </h1>

                            <p className="mt-5 text-white/85 text-base sm:text-[17px] max-w-xl leading-relaxed">
                                {current.subtitle}
                            </p>

                            <div className="mt-7 flex flex-wrap items-center gap-4 text-[13px] text-white/75">
                                <span className="inline-flex items-center gap-1.5">
                                    <FiStar className="text-amber-400 fill-current" />
                                    <b className="text-white">4.9</b> · 25,000+ travellers
                                </span>
                                <span className="w-px h-4 bg-white/20" />
                                <span>120+ destinations</span>
                                <span className="w-px h-4 bg-white/20" />
                                <span>24/7 support</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* --- Search bar — prominent, PickYourTrail style --- */}
                <div className="relative z-10 pb-10 lg:pb-14">
                    <div className="container-x">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                            className="max-w-5xl"
                        >
                            {/* Tabs */}
                            <div className="flex gap-1 mb-0">
                                {SEARCH_TABS.map((t) => (
                                    <button
                                        key={t.key}
                                        onClick={() => setTab(t.key)}
                                        className={`px-5 py-2.5 rounded-t-xl text-sm font-semibold transition ${
                                            tab === t.key
                                                ? 'bg-white text-ink'
                                                : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur'
                                        }`}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search row */}
                            <form onSubmit={submitSearch}
                                className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-2xl shadow-2xl p-2 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-2 items-stretch">
                                <SearchCell icon={<FiMapPin />} label="Where to">
                                    <input
                                        value={dest}
                                        onChange={(e) => setDest(e.target.value)}
                                        placeholder="Kerala, Dubai, Bali…"
                                        className="flex-1 outline-none bg-transparent text-[15px] text-ink placeholder:text-ink-muted min-w-0"
                                    />
                                </SearchCell>
                                <SearchCell icon={<FiCalendar />} label="When">
                                    <input
                                        type="date" min={today}
                                        value={when}
                                        onChange={(e) => setWhen(e.target.value)}
                                        className="flex-1 outline-none bg-transparent text-[15px] text-ink min-w-0"
                                    />
                                </SearchCell>
                                <SearchCell icon={<FiUsers />} label="Travellers">
                                    <select
                                        value={pax}
                                        onChange={(e) => setPax(e.target.value)}
                                        className="flex-1 outline-none bg-transparent text-[15px] text-ink min-w-0 appearance-none">
                                        <option>1 Adult</option>
                                        <option>2 Adults</option>
                                        <option>2 Adults, 1 Child</option>
                                        <option>2 Adults, 2 Children</option>
                                        <option>Family 4+</option>
                                        <option>Group 6+</option>
                                    </select>
                                </SearchCell>
                                <button
                                    type="submit"
                                    className="bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition text-white rounded-xl px-6 md:px-8 py-4 font-semibold inline-flex items-center justify-center gap-2 shadow-brand">
                                    <FiSearch /> <span className="hidden sm:inline">Search trips</span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>

                {/* --- Slide dots + arrows --- */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
                    <button
                        onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                        aria-label="Previous"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur border border-white/20 flex items-center justify-center text-white transition">
                        <FiChevronLeft size={14} />
                    </button>
                    <div className="flex items-center gap-1.5">
                        {HERO_SLIDES.map((_, i) => (
                            <button
                                key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-8 bg-brand-500' : 'w-1.5 bg-white/30 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
                        aria-label="Next"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur border border-white/20 flex items-center justify-center text-white transition">
                        <FiChevronRight size={14} />
                    </button>
                </div>
            </section>

            {/* Virtual tour popup */}
            <TourPreviewPopup
                pkg={previewPkg}
                open={!!previewPkg}
                onClose={() => setPreviewPkg(null)}
            />
        </>
    );
}

function SearchCell({ icon, label, children }) {
    return (
        <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-text border border-transparent hover:border-ink-line">
            <span className="text-brand-500 shrink-0">{icon}</span>
            <span className="flex-1 min-w-0">
                <span className="block text-[10px] uppercase tracking-widest font-bold text-ink-muted mb-0.5">{label}</span>
                <span className="block">{children}</span>
            </span>
        </label>
    );
}
