import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiX, FiSun, FiCloudRain, FiCloudSnow, FiCloud } from 'react-icons/fi';
import PackageCard from '../components/PackageCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import { AdInline } from '../components/AdBanner.jsx';
import CinematicBackground from '../components/CinematicBackground.jsx';
import { usePackages } from '../hooks/usePackages.js';
import { useSeasonal } from '../hooks/useSeasonal.js';

const SEASON_ICON = {
    summer:  <FiSun />,
    monsoon: <FiCloudRain />,
    winter:  <FiCloudSnow />,
    spring:  <FiCloud />,
};

// Premium picture thumbnails for filter pills — verified-stable Pexels CDN URLs
const px = (id, name, w = 200) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const TAGS = [
    { key: 'All',          emoji: '✨', img: px(1287460, 'wanderlust') },
    { key: 'Beach',        emoji: '🏖️', img: px(1032650, 'beach') },
    { key: 'Heritage',     emoji: '🏛️', img: px(2376404, 'heritage') },
    { key: 'Hill Station', emoji: '⛰️', img: px(1271619, 'mountains') },
    { key: 'Nature',       emoji: '🌿', img: px(414171, 'forest') },
    { key: 'Culture',      emoji: '🎭', img: px(2387873, 'culture') },
    { key: 'Adventure',    emoji: '🧗', img: px(1659437, 'adventure') },
    { key: 'Backwaters',   emoji: '🛶', img: px(3881104, 'backwaters') },
    { key: 'Luxury',       emoji: '💎', img: px(258154, 'luxury-resort') },
    { key: 'Honeymoon',    emoji: '💕', img: px(2166559, 'honeymoon') },
];

const CATEGORIES = [
    { key: '',              label: 'All',           emoji: '🌐', img: px(2422259, 'globe') },
    { key: 'Domestic',      label: 'Domestic',      emoji: '🇮🇳', img: px(1603650, 'taj-mahal') },
    { key: 'International', label: 'International', emoji: '✈️', img: px(723240,  'skyline') },
];

const REGION_EMOJI = {
    'Europe': '🏰',
    'South-East Asia': '🌴',
    'Middle East': '🕌',
    'East Asia': '⛩️',
    'Oceania': '🐨',
    'North America': '🗽',
    'South America': '🌋',
    'Africa': '🦁',
    'North India': '🛕',
    'South India': '🌊',
    'Himalayas': '🏔️',
    'Coastal': '🏝️',
    'Desert': '🐪',
};

const REGION_IMG = {
    'Europe': px(11538142, 'europe'),
    'South-East Asia': px(2166559, 'sea'),
    'Middle East': px(162031, 'middle-east'),
    'East Asia': px(2070033, 'east-asia'),
    'Oceania': px(995765, 'oceania'),
    'North America': px(2351649, 'na'),
    'South America': px(2389349, 'sa'),
    'Africa': px(259411, 'africa'),
    'North India': px(2403209, 'north-india'),
    'South India': px(3881104, 'south-india'),
    'Himalayas': px(1666021, 'himalayas'),
    'Coastal': px(1032650, 'coastal'),
    'Desert': px(2649348, 'desert'),
    'India': px(3581368, 'india'),
};

// PickYourTrail-style traveller type — filters packages by "who is travelling"
const TRIP_TYPES = [
    { key: '',        label: 'Anyone',  emoji: '🧳', img: px(1008155, 'travel-anyone') },
    { key: 'solo',    label: 'Solo',    emoji: '🚶', img: px(2422280, 'solo-traveller'),  match: (p) => (p.tags || []).some((t) => /solo|backpacker/i.test(t)) || p.days <= 5 },
    { key: 'couples', label: 'Couples', emoji: '💑', img: px(1024960, 'couple'),          match: (p) => /honeymoon|romantic/i.test(p.title) || (p.tags || []).some((t) => /honeymoon|romantic/i.test(t)) },
    { key: 'family',  label: 'Family',  emoji: '👨‍👩‍👧', img: px(1648387, 'family'),         match: (p) => (p.tags || []).some((t) => /family|kids/i.test(t)) || p.days >= 6 },
    { key: 'friends', label: 'Friends', emoji: '👯', img: px(1153369, 'friends'),         match: (p) => (p.tags || []).some((t) => /beach|adventure|nightlife|friends/i.test(t)) },
];

// Premium thumbnail used inside a pill. Two sizes (md = 36px, sm = 28px).
// Always renders something — falls back to gradient circle + emoji if the image errors.
function PillThumb({ src, emoji, active, size = 'md' }) {
    const [ok, setOk] = useState(true);
    const cls = size === 'sm' ? 'w-7 h-7 text-[13px]' : 'w-9 h-9 text-base';

    if (!src || !ok) {
        return (
            <span aria-hidden className={`${cls} inline-flex shrink-0 rounded-full items-center justify-center transition-all duration-300
                ${active
                    ? 'bg-gradient-to-br from-amber-300 to-brand-500 text-white shadow-[0_4px_12px_rgba(255,122,0,0.45)]'
                    : 'bg-gradient-to-br from-brand-50 to-amber-50 text-ink group-hover:scale-110'}`}>
                {emoji}
            </span>
        );
    }
    return (
        <span aria-hidden className={`${cls} relative inline-block shrink-0 rounded-full overflow-hidden transition-all duration-300
            ${active
                ? 'ring-[2.5px] ring-amber-300 shadow-[0_6px_18px_rgba(255,122,0,0.5)] scale-105'
                : 'ring-2 ring-ink-line group-hover:ring-brand-400 group-hover:shadow-[0_4px_14px_rgba(255,122,0,0.18)] group-hover:scale-105'}`}>
            <img
                src={src} alt="" onError={() => setOk(false)} loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-700 ${active ? '' : 'group-hover:scale-125'}`}
            />
            {/* Subtle inner gloss to make the photo feel premium, not flat */}
            <span className="absolute inset-0 rounded-full ring-1 ring-white/30 pointer-events-none" />
        </span>
    );
}

// Reusable premium section heading — a small accent line + uppercase eyebrow
function FilterEyebrow({ children, accent = 'brand' }) {
    const dot = accent === 'brand' ? 'from-brand-500 to-amber-400' : 'from-ink to-ink-soft';
    return (
        <div className="flex items-center gap-3 mb-4">
            <span className={`block w-7 h-[3px] rounded-full bg-gradient-to-r ${dot}`} />
            <span className="text-[10.5px] font-display font-bold uppercase tracking-[3.5px] text-ink-soft">
                {children}
            </span>
        </div>
    );
}

// Premium pill base — used by every filter button so heights and fonts stay consistent.
const pillBase =
    'group inline-flex items-center gap-3 pl-1 pr-5 h-12 rounded-full border font-display text-[14px] font-semibold leading-none transition-all duration-300 select-none';
const pillBaseSm =
    'group inline-flex items-center gap-2.5 pl-1 pr-4 h-10 rounded-full border font-display text-[13px] font-semibold leading-none transition-all duration-300 select-none';

export default function Packages() {
    const [params, setParams] = useSearchParams();
    const [tag, setTag] = useState(params.get('tag') || 'All');
    const [category, setCategory] = useState(params.get('category') || '');
    const [region, setRegion] = useState(params.get('region') || '');
    const [tripType, setTripType] = useState(params.get('type') || '');
    const [season, setSeason] = useState(params.get('season') || '');
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('popular');
    const [bookOpen, setBookOpen] = useState(false);
    const [bookPkg, setBookPkg] = useState(null);
    const PACKAGES = usePackages();
    const seasonal = useSeasonal();

    useEffect(() => {
        if (category) params.set('category', category); else params.delete('category');
        if (region)   params.set('region', region);     else params.delete('region');
        if (tag && tag !== 'All') params.set('tag', tag); else params.delete('tag');
        if (tripType) params.set('type', tripType); else params.delete('type');
        if (season)   params.set('season', season);     else params.delete('season');
        setParams(params, { replace: true });
        // eslint-disable-next-line
    }, [category, region, tag, tripType, season]);

    const regions = useMemo(() => {
        const pool = category ? PACKAGES.filter((p) => (p.category || 'Domestic') === category) : PACKAGES;
        return Array.from(new Set(pool.map((p) => p.region).filter(Boolean)));
    }, [PACKAGES, category]);

    // Set of slugs the active season featured — used as a hard filter when ?season= is set
    const seasonSlugs = useMemo(() => {
        if (!season || !seasonal) return null;
        if (seasonal.active !== season) return null; // user requested a season that isn't currently live
        const slugs = (seasonal.featured || []).map((p) => p.slug);
        return new Set(slugs);
    }, [season, seasonal]);

    const filtered = useMemo(() => {
        const typeDef = TRIP_TYPES.find((t) => t.key === tripType);
        let list = PACKAGES.filter((p) => {
            if (seasonSlugs && !seasonSlugs.has(p.slug)) return false;
            if (category && (p.category || 'Domestic') !== category) return false;
            if (region && p.region !== region) return false;
            if (tag !== 'All' && !(p.tags || []).includes(tag)) return false; // tag stored as label
            if (typeDef?.match && !typeDef.match(p)) return false;
            if (q) {
                const s = ((p.title || '') + ' ' + (p.country || '') + ' ' + (p.city || '') + ' ' + (p.tags || []).join(' ')).toLowerCase();
                if (!s.includes(q.toLowerCase())) return false;
            }
            return true;
        });
        if (sort === 'days-low')   list = [...list].sort((a, b) => a.days - b.days);
        if (sort === 'days-high')  list = [...list].sort((a, b) => b.days - a.days);
        if (sort === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating);
        return list;
    }, [tag, q, sort, category, region, tripType, PACKAGES, seasonSlugs]);

    return (
        <>
            <Helmet>
                <title>Tour Packages in India & Tamil Nadu | Holiday Packages | Trip with uz Salem</title>
                <meta name="description" content={`Browse ${PACKAGES.length}+ curated tour packages — Tamil Nadu holidays, India tour packages, Kerala, Ooty, Kodaikanal, Goa, Rajasthan, Dubai, Bali, Europe. Best travel agency in Salem with customisable itineraries and instant quotation.`} />
                <meta name="keywords" content="tour packages India, Tamil Nadu tour packages, holidays in Tamil Nadu, tours in Tamil Nadu, Salem tour packages, Kerala tour packages, Ooty tour packages, Kodaikanal tour packages, Goa tour packages, Rajasthan tour packages, Dubai tour packages, Bali tour packages, Europe tour packages, honeymoon packages, family tour packages, best tours India" />
                <meta property="og:title" content="Tour Packages in India & Tamil Nadu | Trip with uz Salem" />
                <meta property="og:description" content="Tamil Nadu holidays, India tours and international packages. Customisable itineraries and instant quotation from Salem's most trusted travel agency." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://tripwithuz.com/logo.png" />
                <meta property="og:url" content="https://tripwithuz.com/packages" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Tour Packages in India & Tamil Nadu | Trip with uz" />
                <meta name="twitter:description" content="Browse 50+ curated tour packages — Kerala, Ooty, Goa, Dubai, Bali, Europe." />
                <link rel="canonical" href="https://tripwithuz.com/packages" />
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tripwithuz.com/' },
                        { '@type': 'ListItem', position: 2, name: 'Tour Packages', item: 'https://tripwithuz.com/packages' },
                    ],
                })}</script>
            </Helmet>

            {/* Cinematic video-feel hero — Ken-Burns travel slideshow with floating particles */}
            <section className="relative bg-ink text-white pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
                <CinematicBackground overlay="dark" />

                <div className="container-x relative grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-5">
                            <span className="w-8 h-px bg-brand-500" />
                            <span className="text-brand-500 text-[10px] font-bold uppercase tracking-[3px]">Our packages</span>
                        </div>
                        <h1 className="font-display font-bold text-white leading-[0.95]"
                            style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
                            Tour packages in <span className="text-brand-500">India</span>,<br />
                            Tamil Nadu &amp; abroad.
                        </h1>
                        <p className="mt-4 text-white/70 max-w-lg text-[15px] leading-relaxed">
                            Browse handpicked holidays from Salem — Kerala backwaters, Ooty hill stations, Kodaikanal,
                            Goa beaches, Rajasthan heritage, Dubai, Bali and Europe. Stays + tours bundled,
                            fully customisable, cancellation flexible.
                        </p>
                    </div>
                    <div className="hidden lg:flex items-center gap-8 text-white/60 text-[12px] uppercase tracking-[2.5px]">
                        <div>
                            <div className="text-white font-display font-bold text-2xl" style={{ letterSpacing: '-0.02em' }}>{PACKAGES.length}+</div>
                            <div className="mt-1 text-[10px]">Packages</div>
                        </div>
                        <div>
                            <div className="text-white font-display font-bold text-2xl" style={{ letterSpacing: '-0.02em' }}>25k+</div>
                            <div className="mt-1 text-[10px]">Travellers</div>
                        </div>
                        <div>
                            <div className="text-white font-display font-bold text-2xl" style={{ letterSpacing: '-0.02em' }}>4.9</div>
                            <div className="mt-1 text-[10px]">Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Season-filter banner — only shows when arriving via "Explore trips" from a live season */}
            {season && seasonSlugs && (
                <section className="pt-8">
                    <div className="container-x">
                        <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 via-amber-50 to-white p-4 lg:p-5 flex flex-wrap items-center gap-4">
                            <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-amber-400 text-white text-lg shadow-[0_8px_18px_rgba(255,122,0,0.35)]">
                                {SEASON_ICON[season] || <FiSun />}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-[10.5px] font-display font-bold uppercase tracking-[2.5px] text-brand-600">
                                    {seasonal?.label || `${season[0].toUpperCase() + season.slice(1)} season`}
                                </div>
                                <div className="font-display font-bold text-ink text-[16px] truncate" style={{ letterSpacing: '-0.01em' }}>
                                    Showing {seasonSlugs.size} {season} pick{seasonSlugs.size === 1 ? '' : 's'}
                                    {seasonal?.tagline && <span className="text-ink-muted font-normal text-[13.5px] ml-2">— {seasonal.tagline}</span>}
                                </div>
                            </div>
                            <button onClick={() => setSeason('')}
                                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-brand-300 text-brand-700 hover:bg-brand-100 hover:border-brand-400 font-display font-semibold text-[12.5px] transition shrink-0">
                                <FiX size={14} /> Show all packages
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Promo banner */}
            <section className="pt-10">
                <div className="container-x">
                    <AdInline placement="packages_top" />
                </div>
            </section>

            {/* Premium filter wizard — soft warm wash backdrop, three editorial sections */}
            <section className="relative pt-12 pb-2 overflow-hidden">
                <div aria-hidden className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-brand-100/60 to-transparent blur-3xl" />
                    <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-amber-100/50 to-transparent blur-3xl" />
                </div>

                <div className="container-x relative space-y-9">
                    {/* Trip-type pills */}
                    <div>
                        <FilterEyebrow accent="ink">Who's travelling</FilterEyebrow>
                        <div className="flex flex-wrap gap-3">
                            {TRIP_TYPES.map((t) => {
                                const active = tripType === t.key;
                                return (
                                    <button
                                        key={t.key || 'any'}
                                        onClick={() => setTripType(t.key)}
                                        className={`${pillBase}
                                            ${active
                                                ? 'bg-gradient-to-r from-ink to-[#1c2438] text-white border-ink shadow-[0_10px_28px_rgba(11,15,26,0.35)] -translate-y-0.5'
                                                : 'bg-white text-ink border-ink-line/70 hover:border-brand-400/80 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(255,122,0,0.14)]'}`}>
                                        <PillThumb src={t.img} emoji={t.emoji} active={active} />
                                        <span className="tracking-[-0.01em]">{t.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category pills */}
                    <div>
                        <FilterEyebrow>Category</FilterEyebrow>
                        <div className="flex flex-wrap gap-3">
                            {CATEGORIES.map((c) => {
                                const active = category === c.key;
                                return (
                                    <button
                                        key={c.key || 'all'}
                                        onClick={() => { setCategory(c.key); setRegion(''); }}
                                        className={`${pillBase}
                                            ${active
                                                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white border-brand-500 shadow-[0_12px_28px_rgba(255,122,0,0.42)] -translate-y-0.5'
                                                : 'bg-white text-ink border-ink-line/70 hover:border-brand-400/80 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(255,122,0,0.14)]'}`}>
                                        <PillThumb src={c.img} emoji={c.emoji} active={active} />
                                        <span className="tracking-[-0.01em]">{c.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Region sub-pills (smaller) */}
                        {regions.length > 0 && category && (
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                <button onClick={() => setRegion('')}
                                    className={`${pillBaseSm}
                                        ${!region
                                            ? 'bg-gradient-to-r from-ink to-[#1c2438] text-white border-ink shadow-[0_8px_20px_rgba(11,15,26,0.3)]'
                                            : 'bg-white text-ink-muted border-ink-line/70 hover:text-ink hover:border-brand-400/80 hover:-translate-y-0.5'}`}>
                                    <PillThumb emoji="🗺️" active={!region} size="sm" />
                                    <span className="tracking-[-0.01em]">All regions</span>
                                </button>
                                {regions.map((r) => {
                                    const active = region === r;
                                    return (
                                        <button key={r} onClick={() => setRegion(r)}
                                            className={`${pillBaseSm}
                                                ${active
                                                    ? 'bg-gradient-to-r from-ink to-[#1c2438] text-white border-ink shadow-[0_8px_20px_rgba(11,15,26,0.3)]'
                                                    : 'bg-white text-ink-muted border-ink-line/70 hover:text-ink hover:border-brand-400/80 hover:-translate-y-0.5'}`}>
                                            <PillThumb src={REGION_IMG[r]} emoji={REGION_EMOJI[r] || '📍'} active={active} size="sm" />
                                            <span className="tracking-[-0.01em]">{r}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Theme tag pills */}
                    <div>
                        <FilterEyebrow>Theme</FilterEyebrow>
                        <div className="flex flex-wrap gap-2.5">
                            {TAGS.map((t) => {
                                const active = tag === t.key;
                                return (
                                    <button
                                        key={t.key}
                                        onClick={() => setTag(t.key)}
                                        className={`${pillBaseSm}
                                            ${active
                                                ? 'bg-gradient-to-r from-amber-400 via-brand-500 to-brand-600 text-white border-brand-500 shadow-[0_10px_24px_rgba(255,122,0,0.42)] -translate-y-0.5'
                                                : 'bg-white text-ink border-ink-line/70 hover:border-brand-400/80 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(255,122,0,0.12)]'}`}>
                                        <PillThumb src={t.img} emoji={t.emoji} active={active} size="sm" />
                                        <span className="tracking-[-0.01em]">{t.key}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky search + sort bar — premium glass card */}
            <section className="py-5 mt-8 bg-white/85 backdrop-blur-xl sticky top-20 z-30 border-y border-ink-line/70">
                <div className="container-x flex flex-col md:flex-row gap-3 md:items-center">
                    <div className="relative flex-1 min-w-0">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-500" size={16} />
                        <input
                            value={q} onChange={(e) => setQ(e.target.value)}
                            placeholder="Search destinations, cities, themes…"
                            className="w-full h-12 pl-12 pr-5 rounded-full border border-ink-line/70 bg-white text-[14px] font-display text-ink placeholder:text-ink-muted/80 transition-all duration-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 hover:border-brand-300 shadow-soft"
                        />
                    </div>
                    <div className="relative md:w-[220px] shrink-0">
                        <FiFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none" size={14} />
                        <select value={sort} onChange={(e) => setSort(e.target.value)}
                            className="w-full h-12 pl-11 pr-9 rounded-full border border-ink-line/70 bg-white text-[13.5px] font-display font-semibold text-ink appearance-none cursor-pointer transition-all duration-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 hover:border-brand-300 shadow-soft">
                            <option value="popular">Most popular</option>
                            <option value="days-low">Duration · Short to Long</option>
                            <option value="days-high">Duration · Long to Short</option>
                            <option value="rating">Top-rated</option>
                        </select>
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">▾</span>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-12">
                <div className="container-x">
                    <div className="mb-6 text-ink-muted text-sm">
                        <span className="font-bold text-ink">{filtered.length}</span> package{filtered.length !== 1 ? 's' : ''} match{filtered.length === 1 ? 'es' : ''} your filters
                    </div>
                    {filtered.length === 0 ? (
                        <div className="text-center py-20 text-ink-muted">
                            No matches. Try clearing filters or searching something else.
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((p, i) => (
                                <PackageCard key={p.slug} pkg={p} index={i} onBook={(pk) => { setBookPkg(pk); setBookOpen(true); }} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <BookingModal open={bookOpen} onClose={() => setBookOpen(false)} pkg={bookPkg} />
        </>
    );
}
