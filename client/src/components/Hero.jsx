import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiArrowRight, FiStar, FiChevronLeft, FiChevronRight,
    FiSearch, FiCalendar, FiUsers,
} from 'react-icons/fi';
import { usePackages } from '../hooks/usePackages.js';
import TourPreviewPopup from './TourPreviewPopup.jsx';

const HERO_SLIDES = [
    {
        location: 'Kerala · India',
        label: 'Backwaters',
        title: 'Handcrafted',
        accent: 'journeys.',
        subtitle: 'Trips planned by people who actually travel.',
        video: 'https://videos.pexels.com/video-files/1851190/1851190-hd_1280_720_25fps.mp4',
        fallbackImg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=2400&q=80',
        sidePic1: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&q=80',
        sidePic2: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&q=80',
        priceFrom: 34500,
        preferSlug: 'kerala-gods-own-country',
    },
    {
        location: 'Dubai · UAE',
        label: 'Luxury',
        title: 'Bold',
        accent: 'skylines.',
        subtitle: 'Deserts, yachts and Burj Khalifa at golden hour.',
        video: 'https://videos.pexels.com/video-files/1526909/1526909-hd_1280_720_24fps.mp4',
        fallbackImg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2400&q=80',
        sidePic1: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&q=80',
        sidePic2: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&q=80',
        priceFrom: 78900,
        preferSlug: 'dubai-desert-luxury',
    },
    {
        location: 'Bali · Indonesia',
        label: 'Honeymoon',
        title: 'Slow,',
        accent: 'deliberate.',
        subtitle: 'Jungle villas, floating breakfasts, private beach dinners.',
        video: 'https://videos.pexels.com/video-files/1851190/1851190-hd_1280_720_25fps.mp4',
        fallbackImg: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=2400&q=80',
        sidePic1: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=80',
        sidePic2: 'https://images.unsplash.com/photo-1554290712-e640351074bd?w=1000&q=80',
        priceFrom: 64500,
        preferSlug: 'bali-honeymoon-escape',
    },
];

const SEARCH_TABS = [
    { key: 'packages',  label: 'Holidays' },
    { key: 'honeymoon', label: 'Honeymoon' },
    { key: 'family',    label: 'Family' },
    { key: 'luxury',    label: 'Luxury' },
];

function inr(n) { return '₹' + (Number(n) || 0).toLocaleString('en-IN'); }

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

    useEffect(() => {
        const t = setInterval(() => {
            if (!hoverRef.current && !previewPkg) setSlide((s) => (s + 1) % HERO_SLIDES.length);
        }, 9000);
        return () => clearInterval(t);
    }, [previewPkg]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.play?.().catch(() => {});
    }, [slide]);

    const current = HERO_SLIDES[slide];

    const submitSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (dest) params.set('q', dest);
        if (tab && tab !== 'packages') params.set('tag', tab === 'honeymoon' ? 'Honeymoon' : tab === 'family' ? 'Family' : 'Luxury');
        nav(`/packages${params.toString() ? `?${params.toString()}` : ''}`);
    };

    return (
        <>
            {/* --- Dramatic magazine-style hero --- */}
            <section className="relative min-h-screen bg-ink overflow-hidden">
                {/* Background video (subdued) */}
                <AnimatePresence mode="sync">
                    <motion.div
                        key={current.video}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${current.fallbackImg})` }} />
                        <video
                            ref={videoRef}
                            src={current.video}
                            poster={current.fallbackImg}
                            autoPlay muted loop playsInline preload="auto"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Vertical overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-ink/40" />

                {/* Orange accent glow */}
                <div className="absolute top-1/4 -right-40 w-[32rem] h-[32rem] rounded-full bg-brand-500/20 blur-3xl" />

                {/* --- Content grid --- */}
                <div className="container-x relative z-10 pt-36 lg:pt-44 pb-24 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center min-h-screen">
                    {/* LEFT: Massive editorial headline */}
                    <div>
                        {/* Breadcrumb-style location label */}
                        <motion.div
                            key={`loc-${slide}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-3 mb-8"
                        >
                            <span className="w-12 h-px bg-brand-500" />
                            <span className="text-brand-500 text-[11px] font-bold uppercase tracking-[4px]">
                                {current.label}
                            </span>
                            <span className="text-white/40 text-xs">// {current.location}</span>
                        </motion.div>

                        {/* MASSIVE headline — the visible change */}
                        <motion.h1
                            key={`title-${slide}`}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display font-extrabold text-white leading-[0.9]"
                            style={{
                                fontSize: 'clamp(48px, 10vw, 132px)',
                                letterSpacing: '-0.05em',
                            }}
                        >
                            <span className="block">{current.title}</span>
                            <span className="block">
                                <span className="text-brand-500">{current.accent}</span>
                            </span>
                        </motion.h1>

                        <motion.p
                            key={`sub-${slide}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-8 text-white/75 text-lg sm:text-xl max-w-lg leading-snug"
                        >
                            {current.subtitle}
                        </motion.p>

                        {/* CTAs + inline trust */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-10 flex flex-wrap items-center gap-5"
                        >
                            <Link to="/packages" className="group inline-flex items-center gap-3 bg-brand-500 hover:bg-brand-600 text-white px-7 py-4 rounded-full font-semibold text-[15px] transition shadow-brand">
                                Explore trips
                                <span className="w-7 h-7 rounded-full bg-white text-brand-500 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <FiArrowRight size={14} />
                                </span>
                            </Link>
                            <a href="#search-trips" className="inline-flex items-center gap-2 text-white hover:text-brand-400 font-semibold text-[15px] transition underline-offset-4 hover:underline">
                                Plan your own
                            </a>
                        </motion.div>

                        {/* Slide indicator line */}
                        <div className="mt-16 flex items-center gap-3">
                            <span className="text-white/40 text-xs font-mono w-8">{String(slide + 1).padStart(2, '0')}</span>
                            <div className="flex-1 max-w-[200px] h-px bg-white/15 relative overflow-hidden">
                                <motion.span
                                    key={slide}
                                    className="absolute left-0 top-0 h-full bg-brand-500"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 9, ease: 'linear' }}
                                />
                            </div>
                            <span className="text-white/40 text-xs font-mono">{String(HERO_SLIDES.length).padStart(2, '0')}</span>
                        </div>
                    </div>

                    {/* RIGHT: Photo stack / floating price card */}
                    <motion.div
                        key={`side-${slide}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="hidden lg:block relative h-[520px]"
                        onMouseEnter={() => (hoverRef.current = true)}
                        onMouseLeave={() => (hoverRef.current = false)}
                    >
                        {/* Big card */}
                        <div
                            className="absolute top-0 right-0 w-[70%] h-[380px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                            style={{ transform: 'rotate(3deg)' }}
                        >
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${current.sidePic1})` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Small offset card */}
                        <div
                            className="absolute bottom-0 left-0 w-[55%] h-[240px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                            style={{ transform: 'rotate(-4deg)' }}
                        >
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${current.sidePic2})` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Floating price pill */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="absolute bottom-8 right-8 bg-white rounded-2xl shadow-2xl p-4 pr-6 flex items-center gap-3 ring-1 ring-black/5"
                        >
                            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center">
                                <FiMapPin size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-ink-muted font-bold">Starting from</div>
                                <div className="font-display font-extrabold text-ink text-xl leading-tight"
                                    style={{ letterSpacing: '-0.02em' }}>
                                    {inr(current.priceFrom)}
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating rating chip */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className="absolute top-8 left-0 bg-ink/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-white"
                        >
                            <FiStar className="text-amber-400 fill-current" size={13} />
                            <span className="text-sm font-semibold">4.9</span>
                            <span className="text-xs text-white/60">· 2.5k reviews</span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom: prev/next + slide dots */}
                <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-between container-x pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <button
                            onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                            aria-label="Previous"
                            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur border border-white/15 flex items-center justify-center text-white transition">
                            <FiChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
                            aria-label="Next"
                            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur border border-white/15 flex items-center justify-center text-white transition">
                            <FiChevronRight size={16} />
                        </button>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[3px] text-white/50 pointer-events-auto">
                        {HERO_SLIDES.map((s, i) => (
                            <button
                                key={i} onClick={() => setSlide(i)}
                                className={`transition ${i === slide ? 'text-brand-500 font-bold' : 'hover:text-white/80'}`}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Search section — tucked under hero --- */}
            <section id="search-trips" className="bg-white relative">
                <div className="container-x py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                        className="relative -mt-24 z-20"
                    >
                        {/* Tabs */}
                        <div className="flex gap-1 mb-0">
                            {SEARCH_TABS.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`px-5 py-3 rounded-t-2xl text-sm font-semibold transition ${
                                        tab === t.key
                                            ? 'bg-white text-ink'
                                            : 'bg-black/40 text-white hover:bg-black/60 backdrop-blur'
                                    }`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <form
                            onSubmit={submitSearch}
                            className="bg-white rounded-r-3xl rounded-b-3xl rounded-tl-3xl shadow-2xl ring-1 ring-black/5 p-2 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-1">
                            <SearchCell icon={<FiMapPin />} label="Where to">
                                <input
                                    value={dest}
                                    onChange={(e) => setDest(e.target.value)}
                                    placeholder="Kerala, Dubai, Bali…"
                                    className="w-full outline-none bg-transparent text-[15px] text-ink placeholder:text-ink-muted"
                                />
                            </SearchCell>
                            <SearchCell icon={<FiCalendar />} label="When">
                                <input
                                    type="date" min={today}
                                    value={when}
                                    onChange={(e) => setWhen(e.target.value)}
                                    className="w-full outline-none bg-transparent text-[15px] text-ink"
                                />
                            </SearchCell>
                            <SearchCell icon={<FiUsers />} label="Travellers">
                                <select
                                    value={pax}
                                    onChange={(e) => setPax(e.target.value)}
                                    className="w-full outline-none bg-transparent text-[15px] text-ink">
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
                                className="bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition text-white rounded-2xl px-6 md:px-10 py-4 font-semibold inline-flex items-center justify-center gap-2 shadow-brand">
                                <FiSearch /> <span className="hidden sm:inline">Search</span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

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
        <label className="flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-slate-50 transition cursor-text">
            <span className="text-brand-500 shrink-0">{icon}</span>
            <span className="flex-1 min-w-0">
                <span className="block text-[10px] uppercase tracking-[2px] font-bold text-ink-muted mb-1">{label}</span>
                <span className="block">{children}</span>
            </span>
        </label>
    );
}
