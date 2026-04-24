import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiArrowRight, FiStar, FiChevronLeft, FiChevronRight,
    FiSearch, FiCalendar, FiUsers,
} from 'react-icons/fi';

/**
 * Hero uses STILL IMAGES with a subtle Ken-Burns zoom — no videos.
 * Videos turned out to be unreliable (some third-party CDNs return
 * unexpected footage), so we avoid them here entirely.
 *
 * Every image URL below is a direct Pexels CDN URL that is verified
 * stable and actually shows what its label says.
 */
const HERO_SLIDES = [
    {
        location: 'Kerala · India',
        label: 'Backwaters',
        title: 'Handcrafted',
        accent: 'journeys.',
        subtitle: 'Trips planned by people who actually travel.',
        bg: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=2000',
        sidePic1: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=1000',
        sidePic2: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1000',
        priceFrom: 34500,
    },
    {
        location: 'Dubai · UAE',
        label: 'Luxury',
        title: 'Bold',
        accent: 'skylines.',
        subtitle: 'Deserts, yachts and Burj Khalifa at golden hour.',
        bg: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=2000',
        sidePic1: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=1000',
        sidePic2: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=1000',
        priceFrom: 78900,
    },
    {
        location: 'Bali · Indonesia',
        label: 'Honeymoon',
        title: 'Slow,',
        accent: 'deliberate.',
        subtitle: 'Jungle villas, floating breakfasts, private beach dinners.',
        bg: 'https://images.pexels.com/photos/2100941/pexels-photo-2100941.jpeg?auto=compress&cs=tinysrgb&w=2000',
        sidePic1: 'https://images.pexels.com/photos/2100941/pexels-photo-2100941.jpeg?auto=compress&cs=tinysrgb&w=1000',
        sidePic2: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1000',
        priceFrom: 64500,
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
    const nav = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const t = setInterval(() => {
            if (!hoverRef.current) setSlide((s) => (s + 1) % HERO_SLIDES.length);
        }, 8000);
        return () => clearInterval(t);
    }, []);

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
            <section
                className="relative min-h-[90vh] lg:min-h-screen bg-ink overflow-hidden"
                onMouseEnter={() => (hoverRef.current = true)}
                onMouseLeave={() => (hoverRef.current = false)}
            >
                {/* Slow Ken-Burns image background */}
                <AnimatePresence mode="sync">
                    <motion.div
                        key={current.bg}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.5, scale: 1.1 }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: { duration: 1.2 }, scale: { duration: 12, ease: 'linear' } }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${current.bg})` }}
                    />
                </AnimatePresence>

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/60 to-ink" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />

                {/* Subtle orange accent glow */}
                <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] rounded-full bg-brand-500/15 blur-3xl" />

                <div className="container-x relative z-10 pt-32 lg:pt-40 pb-24 grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center min-h-[85vh]">
                    {/* LEFT: editorial text */}
                    <div>
                        <motion.div
                            key={`loc-${slide}`}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-3 mb-6"
                        >
                            <span className="w-10 h-px bg-brand-500" />
                            <span className="text-brand-500 text-[10px] font-bold uppercase tracking-[3px]">
                                {current.label}
                            </span>
                            <span className="text-white/40 text-[11px]">// {current.location}</span>
                        </motion.div>

                        {/* Tighter, more professional headline size */}
                        <motion.h1
                            key={`title-${slide}`}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display font-bold text-white leading-[0.95]"
                            style={{
                                fontSize: 'clamp(36px, 6vw, 72px)',
                                letterSpacing: '-0.035em',
                            }}
                        >
                            <span className="block">{current.title}</span>
                            <span className="block text-brand-500">{current.accent}</span>
                        </motion.h1>

                        <motion.p
                            key={`sub-${slide}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="mt-6 text-white/75 text-base sm:text-[17px] max-w-md leading-relaxed"
                        >
                            {current.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-8 flex flex-wrap items-center gap-4"
                        >
                            <Link to="/packages" className="group inline-flex items-center gap-3 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3.5 rounded-full font-semibold text-sm transition shadow-brand">
                                Explore trips
                                <span className="w-6 h-6 rounded-full bg-white text-brand-500 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <FiArrowRight size={12} />
                                </span>
                            </Link>
                            <a href="#search-trips" className="inline-flex items-center gap-2 text-white/90 hover:text-brand-400 font-semibold text-sm transition underline-offset-4 hover:underline">
                                Plan your own
                            </a>
                        </motion.div>

                        {/* Slide progress bar */}
                        <div className="mt-14 flex items-center gap-3 max-w-xs">
                            <span className="text-white/40 text-[11px] font-mono w-6">{String(slide + 1).padStart(2, '0')}</span>
                            <div className="flex-1 h-px bg-white/15 relative overflow-hidden">
                                <motion.span
                                    key={slide}
                                    className="absolute left-0 top-0 h-full bg-brand-500"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 8, ease: 'linear' }}
                                />
                            </div>
                            <span className="text-white/40 text-[11px] font-mono">{String(HERO_SLIDES.length).padStart(2, '0')}</span>
                        </div>
                    </div>

                    {/* RIGHT: Photo stack */}
                    <motion.div
                        key={`side-${slide}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="hidden lg:block relative h-[480px]"
                    >
                        <div
                            className="absolute top-0 right-0 w-[68%] h-[340px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                            style={{ transform: 'rotate(3deg)' }}
                        >
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${current.sidePic1})` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>

                        <div
                            className="absolute bottom-0 left-0 w-[52%] h-[220px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                            style={{ transform: 'rotate(-4deg)' }}
                        >
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${current.sidePic2})` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="absolute bottom-6 right-6 bg-white rounded-xl shadow-2xl p-3 pr-4 flex items-center gap-3 ring-1 ring-black/5"
                        >
                            <div className="w-9 h-9 rounded-lg bg-brand-500 text-white flex items-center justify-center">
                                <FiMapPin size={14} />
                            </div>
                            <div>
                                <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Starting from</div>
                                <div className="font-display font-bold text-ink text-base leading-tight"
                                    style={{ letterSpacing: '-0.02em' }}>
                                    {inr(current.priceFrom)}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="absolute top-6 left-0 bg-ink/80 backdrop-blur-md border border-white/10 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-white"
                        >
                            <FiStar className="text-amber-400 fill-current" size={12} />
                            <span className="text-xs font-semibold">4.9</span>
                            <span className="text-[11px] text-white/60">· 2.5k reviews</span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom controls */}
                <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-between container-x pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <button
                            onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                            aria-label="Previous"
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur border border-white/15 flex items-center justify-center text-white transition">
                            <FiChevronLeft size={14} />
                        </button>
                        <button
                            onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
                            aria-label="Next"
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur border border-white/15 flex items-center justify-center text-white transition">
                            <FiChevronRight size={14} />
                        </button>
                    </div>
                    <div className="hidden md:flex items-center gap-5 text-[10px] uppercase tracking-[3px] text-white/50 pointer-events-auto">
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

            {/* Search card */}
            <section id="search-trips" className="bg-white relative">
                <div className="container-x py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.55 }}
                        className="relative -mt-24 z-20"
                    >
                        <div className="flex gap-1 mb-0">
                            {SEARCH_TABS.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`px-5 py-2.5 rounded-t-xl text-xs font-semibold uppercase tracking-wider transition ${
                                        tab === t.key
                                            ? 'bg-white text-ink'
                                            : 'bg-black/35 text-white hover:bg-black/55 backdrop-blur'
                                    }`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <form
                            onSubmit={submitSearch}
                            className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-2xl shadow-2xl ring-1 ring-black/5 p-2 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-1">
                            <SearchCell icon={<FiMapPin />} label="Where to">
                                <input
                                    value={dest}
                                    onChange={(e) => setDest(e.target.value)}
                                    placeholder="Kerala, Dubai, Bali…"
                                    className="w-full outline-none bg-transparent text-sm text-ink placeholder:text-ink-muted"
                                />
                            </SearchCell>
                            <SearchCell icon={<FiCalendar />} label="When">
                                <input
                                    type="date" min={today}
                                    value={when}
                                    onChange={(e) => setWhen(e.target.value)}
                                    className="w-full outline-none bg-transparent text-sm text-ink"
                                />
                            </SearchCell>
                            <SearchCell icon={<FiUsers />} label="Travellers">
                                <select
                                    value={pax}
                                    onChange={(e) => setPax(e.target.value)}
                                    className="w-full outline-none bg-transparent text-sm text-ink">
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
                                className="bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition text-white rounded-xl px-6 md:px-8 py-3 font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-brand">
                                <FiSearch /> <span className="hidden sm:inline">Search</span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

function SearchCell({ icon, label, children }) {
    return (
        <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-text">
            <span className="text-brand-500 shrink-0">{icon}</span>
            <span className="flex-1 min-w-0">
                <span className="block text-[9px] uppercase tracking-[2px] font-bold text-ink-muted mb-0.5">{label}</span>
                <span className="block">{children}</span>
            </span>
        </label>
    );
}
