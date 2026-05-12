import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiArrowRight, FiStar, FiChevronLeft, FiChevronRight,
    FiSearch, FiCalendar, FiUsers,
} from 'react-icons/fi';
import { useSeasonal } from '../hooks/useSeasonal.js';

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
    },
];

const SEARCH_TABS = [
    { key: 'packages',  label: 'Holidays' },
    { key: 'honeymoon', label: 'Honeymoon' },
    { key: 'family',    label: 'Family' },
    { key: 'luxury',    label: 'Luxury' },
];

// Curated headline pairs that rotate per slide based on the active season.
// Used as the editorial display text when admin uploads season hero images.
const SEASONAL_HEADLINES = {
    summer: [
        { title: 'Cool hill',     accent: 'escapes.',    sub: 'Pine air, valley views, slow afternoons.' },
        { title: 'Beachfront',    accent: 'mornings.',   sub: 'Sunrises over the sea, salt on your skin.' },
        { title: 'Sun-drenched',  accent: 'days.',       sub: 'Long, golden, unhurried.' },
        { title: 'Endless',       accent: 'horizons.',   sub: 'Open roads, wide skies, no agenda.' },
    ],
    monsoon: [
        { title: 'Lush green',    accent: 'valleys.',    sub: 'Backwaters, waterfalls, tea-fresh air.' },
        { title: 'Misty',         accent: 'mornings.',   sub: 'Soft rain on banana leaves, hot filter coffee.' },
        { title: 'Emerald',       accent: 'highlands.',  sub: 'Munnar, Wayanad, every shade of green.' },
        { title: 'Rain-washed',   accent: 'horizons.',   sub: 'The greenest India you will ever see.' },
    ],
    winter: [
        { title: 'Snow-dusted',   accent: 'horizons.',   sub: 'Manali, Gulmarg, Auli — fresh powder, warm cabins.' },
        { title: 'Festive',       accent: 'getaways.',   sub: 'Goa beaches, Rajasthan palaces, lit-up Ladakh.' },
        { title: 'Crisp',         accent: 'mornings.',   sub: 'Pashmina shawls, mountain sunrises, hot chai.' },
        { title: 'Mountain',      accent: 'silence.',    sub: 'Just snow, pine, and a trail to follow.' },
    ],
    spring: [
        { title: 'Blooming',      accent: 'trails.',     sub: 'Tulip valleys, cherry blossoms, soft sunshine.' },
        { title: 'Pastel',        accent: 'horizons.',   sub: 'A gentler kind of beautiful.' },
        { title: 'Festive',       accent: 'gardens.',    sub: 'Holi colours, fresh flowers, longer days.' },
        { title: 'Wildflower',    accent: 'meadows.',    sub: 'Valley of Flowers, Munnar slopes, Kashmir saffron.' },
    ],
};

export default function Hero() {
    const [slide, setSlide] = useState(0);
    const [tab, setTab] = useState('packages');
    const [dest, setDest] = useState('');
    const [when, setWhen] = useState('');
    const [pax, setPax] = useState('2 Adults');
    const hoverRef = useRef(false);
    const nav = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    const seasonal = useSeasonal();

    // If admin has uploaded hero images for the active season, use those.
    // Each image entry is `{ url, title, accent, subtitle }`. Each slide also
    // gets two clickable featured packages on the right photo stack.
    const slides = useMemo(() => {
        if (seasonal && Array.isArray(seasonal.heroImages) && seasonal.heroImages.length > 0) {
            const headlines = SEASONAL_HEADLINES[seasonal.active] || SEASONAL_HEADLINES.winter;
            const seasonName = seasonal.active ? seasonal.active[0].toUpperCase() + seasonal.active.slice(1) : 'Curated';
            const featured = Array.isArray(seasonal.featured) ? seasonal.featured : [];

            return seasonal.heroImages.map((entry, i) => {
                const fallback = HERO_SLIDES[i % HERO_SLIDES.length];
                const headline = headlines[i % headlines.length];
                const url = typeof entry === 'string' ? entry : entry.url;
                const customTitle = typeof entry === 'object' ? (entry.title || '').trim() : '';
                const customAccent = typeof entry === 'object' ? (entry.accent || '').trim() : '';
                const customSub   = typeof entry === 'object' ? (entry.subtitle || '').trim() : '';

                // Pick two featured packages for the right photo stack — cycle through them per slide
                const pkgA = featured.length ? featured[i % featured.length] : null;
                const pkgB = featured.length ? featured[(i + 1) % featured.length] : null;

                const otherUrl = (() => {
                    const other = seasonal.heroImages[(i + 1) % seasonal.heroImages.length];
                    return typeof other === 'string' ? other : (other?.url || fallback.sidePic2);
                })();

                return {
                    ...fallback,
                    bg: url,
                    sidePic1: pkgA?.image || url,
                    sidePic2: pkgB?.image || otherUrl,
                    sidePkg1: pkgA,
                    sidePkg2: pkgB,
                    label: seasonal.label || `${seasonName} Journeys`,
                    location: `${seasonName} · ${new Date().getFullYear()}`,
                    title:    customTitle  || headline.title,
                    accent:   customAccent || headline.accent,
                    subtitle: customSub    || seasonal.tagline || headline.sub,
                };
            });
        }
        return HERO_SLIDES;
    }, [seasonal]);

    // Where "Explore trips" should go — season-filtered if a season is live, else all packages
    const exploreHref = seasonal?.active && (seasonal?.featured?.length || seasonal?.heroImages?.length)
        ? `/packages?season=${seasonal.active}`
        : '/packages';

    useEffect(() => {
        const t = setInterval(() => {
            if (!hoverRef.current) setSlide((s) => (s + 1) % slides.length);
        }, 8000);
        return () => clearInterval(t);
    }, [slides.length]);

    // Reset slide index if the slide list shrinks (admin removed an image)
    useEffect(() => { if (slide >= slides.length) setSlide(0); }, [slides.length, slide]);

    const current = slides[slide] || slides[0];

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
                {/* Slow Ken-Burns image background — full opacity so the uploaded photo shines through */}
                <AnimatePresence mode="sync">
                    <motion.div
                        key={current.bg}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1.1 }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: { duration: 1.2 }, scale: { duration: 12, ease: 'linear' } }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${current.bg})` }}
                    />
                </AnimatePresence>

                {/* Light overlay — keeps text readable on the left, lets the photo breathe on the right */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/45" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/15 to-transparent" />
                {/* Soft text-area scrim only behind the headline */}
                <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-ink/40 to-transparent pointer-events-none" />

                {/* Subtle orange accent glow */}
                <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] rounded-full bg-brand-500/12 blur-3xl" />

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
                            <Link to={exploreHref} className="group inline-flex items-center gap-3 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3.5 rounded-full font-semibold text-sm transition shadow-brand">
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
                            <span className="text-white/40 text-[11px] font-mono">{String(slides.length).padStart(2, '0')}</span>
                        </div>
                    </div>

                    {/* RIGHT: Photo stack — featured packages of the active season, clickable */}
                    <motion.div
                        key={`side-${slide}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="hidden lg:block relative h-[480px]"
                    >
                        <SidePhoto
                            image={current.sidePic1}
                            pkg={current.sidePkg1}
                            className="absolute top-0 right-0 w-[68%] h-[340px]"
                            rotate={3}
                        />
                        <SidePhoto
                            image={current.sidePic2}
                            pkg={current.sidePkg2}
                            className="absolute bottom-0 left-0 w-[52%] h-[220px]"
                            rotate={-4}
                        />

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
                            onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
                            aria-label="Previous"
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur border border-white/15 flex items-center justify-center text-white transition">
                            <FiChevronLeft size={14} />
                        </button>
                        <button
                            onClick={() => setSlide((s) => (s + 1) % slides.length)}
                            aria-label="Next"
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur border border-white/15 flex items-center justify-center text-white transition">
                            <FiChevronRight size={14} />
                        </button>
                    </div>
                    <div className="hidden md:flex items-center gap-5 text-[10px] uppercase tracking-[3px] text-white/50 pointer-events-auto">
                        {slides.map((s, i) => (
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

/**
 * SidePhoto — one tile of the right-hand photo stack.
 * If a featured package is given, the whole tile becomes a Link to that
 * package detail page and shows a hover overlay with the package title +
 * a small `View →` chip. Otherwise renders as a static decoration.
 */
function SidePhoto({ image, pkg, className = '', rotate = 0 }) {
    const inner = (
        <>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {pkg && (
                <>
                    {/* Always-visible compact chip with package name */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-ink text-[10.5px] font-display font-semibold px-2.5 py-1 rounded-full shadow ring-1 ring-black/5 max-w-[80%] truncate">
                        <FiMapPin className="text-brand-500 shrink-0" size={10} />
                        <span className="truncate">{pkg.title}</span>
                    </div>
                    {/* Hover-revealed View chip */}
                    <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-brand-500 text-white text-[10.5px] font-display font-bold uppercase tracking-[2px] px-3 py-1.5 rounded-full shadow-brand opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                        View <FiArrowRight size={10} />
                    </div>
                </>
            )}
        </>
    );

    const baseCls = `group rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 ${pkg ? 'cursor-pointer hover:ring-brand-400/60 transition' : ''} ${className}`;
    const style = { transform: `rotate(${rotate}deg)` };

    return pkg
        ? <Link to={`/packages/${pkg.slug}`} className={baseCls} style={style} aria-label={pkg.title}>{inner}</Link>
        : <div className={baseCls} style={style}>{inner}</div>;
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
