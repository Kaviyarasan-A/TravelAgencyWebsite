import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import {
    FiFilter, FiSearch, FiMapPin, FiGlobe, FiUser, FiHeart, FiUsers,
} from 'react-icons/fi';
import PackageCard from '../components/PackageCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import { AdInline } from '../components/AdBanner.jsx';
import AuroraBackground from '../components/AuroraBackground.jsx';
import { usePackages } from '../hooks/usePackages.js';

const TAGS = ['All', 'Beach', 'Heritage', 'Hill Station', 'Nature', 'Culture', 'Adventure', 'Backwaters', 'Luxury', 'Honeymoon'];

const CATEGORIES = [
    { key: '',              label: 'All',           icon: null },
    { key: 'Domestic',      label: 'Domestic',      icon: <FiMapPin /> },
    { key: 'International', label: 'International', icon: <FiGlobe /> },
];

// PickYourTrail-style traveller type — filters packages by "who is travelling"
const TRIP_TYPES = [
    { key: '',         label: 'Anyone' },
    { key: 'solo',     label: 'Solo',     icon: <FiUser />,    match: (p) => (p.tags || []).some((t) => /solo|backpacker/i.test(t)) || p.days <= 5 },
    { key: 'couples',  label: 'Couples',  icon: <FiHeart />,   match: (p) => /honeymoon|romantic/i.test(p.title) || (p.tags || []).some((t) => /honeymoon|romantic/i.test(t)) },
    { key: 'family',   label: 'Family',   icon: <FiUsers />,   match: (p) => (p.tags || []).some((t) => /family|kids/i.test(t)) || p.days >= 6 },
    { key: 'friends',  label: 'Friends',  icon: <FiUsers />,   match: (p) => (p.tags || []).some((t) => /beach|adventure|nightlife|friends/i.test(t)) },
];

export default function Packages() {
    const [params, setParams] = useSearchParams();
    const [tag, setTag] = useState(params.get('tag') || 'All');
    const [category, setCategory] = useState(params.get('category') || '');
    const [region, setRegion] = useState(params.get('region') || '');
    const [tripType, setTripType] = useState(params.get('type') || '');
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('popular');
    const [bookOpen, setBookOpen] = useState(false);
    const [bookPkg, setBookPkg] = useState(null);
    const PACKAGES = usePackages();

    useEffect(() => {
        if (category) params.set('category', category); else params.delete('category');
        if (region)   params.set('region', region);     else params.delete('region');
        if (tag && tag !== 'All') params.set('tag', tag); else params.delete('tag');
        if (tripType) params.set('type', tripType); else params.delete('type');
        setParams(params, { replace: true });
        // eslint-disable-next-line
    }, [category, region, tag, tripType]);

    const regions = useMemo(() => {
        const pool = category ? PACKAGES.filter((p) => (p.category || 'Domestic') === category) : PACKAGES;
        return Array.from(new Set(pool.map((p) => p.region).filter(Boolean)));
    }, [PACKAGES, category]);

    const filtered = useMemo(() => {
        const typeDef = TRIP_TYPES.find((t) => t.key === tripType);
        let list = PACKAGES.filter((p) => {
            if (category && (p.category || 'Domestic') !== category) return false;
            if (region && p.region !== region) return false;
            if (tag !== 'All' && !(p.tags || []).includes(tag)) return false;
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
        if (sort === 'price-low')  list = [...list].sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        if (sort === 'price-high') list = [...list].sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
        return list;
    }, [tag, q, sort, category, region, tripType, PACKAGES]);

    return (
        <>
            <Helmet>
                <title>Holiday Packages | Trip with uz</title>
                <meta name="description" content="Browse curated domestic & international holiday packages — beaches, hill stations, heritage tours, Dubai, Bali, Europe and more. Customisable itineraries." />
            </Helmet>

            {/* Clean page hero with Aurora animated gradient */}
            <section className="relative bg-ink text-white pt-28 pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
                <AuroraBackground variant="sunset" intensity={0.8} />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/40 to-ink/95" />

                <div className="container-x relative grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-5">
                            <span className="w-8 h-px bg-brand-500" />
                            <span className="text-brand-500 text-[10px] font-bold uppercase tracking-[3px]">Our packages</span>
                        </div>
                        <h1 className="font-display font-bold text-white leading-[0.95]"
                            style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
                            Find your <span className="text-brand-500">kind</span> of trip.
                        </h1>
                        <p className="mt-4 text-white/70 max-w-lg text-[15px] leading-relaxed">
                            Domestic escapes, international bucket-list journeys. Stays + tours bundled,
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

            {/* Promo banner */}
            <section className="pt-10">
                <div className="container-x">
                    <AdInline placement="packages_top" />
                </div>
            </section>

            {/* Trip-type pills (Solo / Couples / Family / Friends) */}
            <section className="pt-10">
                <div className="container-x">
                    <div className="text-[10px] uppercase tracking-[3px] text-ink-muted font-bold mb-3">Who's travelling?</div>
                    <div className="flex flex-wrap gap-2">
                        {TRIP_TYPES.map((t) => (
                            <button
                                key={t.key || 'any'}
                                onClick={() => setTripType(t.key)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition ${
                                    tripType === t.key
                                        ? 'bg-ink text-white border-ink'
                                        : 'bg-white text-ink border-ink-line hover:border-brand-500 hover:text-brand-500'
                                }`}>
                                {t.icon && <span className={tripType === t.key ? 'text-brand-400' : 'text-brand-500'}>{t.icon}</span>}
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Category pills */}
            <section className="pt-6">
                <div className="container-x">
                    <div className="text-[10px] uppercase tracking-[3px] text-ink-muted font-bold mb-3">Category</div>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.key || 'all'}
                                onClick={() => { setCategory(c.key); setRegion(''); }}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition
                                    ${category === c.key ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-ink border-ink-line hover:border-brand-500 hover:text-brand-500'}`}>
                                {c.icon} {c.label}
                            </button>
                        ))}
                    </div>
                    {regions.length > 0 && category && (
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <button onClick={() => setRegion('')}
                                className={`px-3 py-1 rounded-full border transition ${!region ? 'bg-ink text-white border-ink' : 'bg-white border-ink-line text-ink-muted hover:border-brand-500'}`}>
                                All regions
                            </button>
                            {regions.map((r) => (
                                <button key={r} onClick={() => setRegion(r)}
                                    className={`px-3 py-1 rounded-full border transition ${region === r ? 'bg-ink text-white border-ink' : 'bg-white border-ink-line text-ink-muted hover:border-brand-500'}`}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Filters bar — sticky under navbar */}
            <section className="py-6 mt-8 bg-white sticky top-20 z-30 border-y border-ink-line">
                <div className="container-x flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <input
                                value={q} onChange={(e) => setQ(e.target.value)}
                                placeholder="Search destinations, cities, tags…"
                                className="input pl-11 text-sm"
                            />
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs text-ink-muted font-semibold uppercase tracking-wider"><FiFilter /> Sort</div>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input max-w-[200px] text-sm">
                            <option value="popular">Most popular</option>
                            <option value="price-low">Price: Low → High</option>
                            <option value="price-high">Price: High → Low</option>
                            <option value="days-low">Duration: Short → Long</option>
                            <option value="days-high">Duration: Long → Short</option>
                            <option value="rating">Top-rated</option>
                        </select>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {TAGS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTag(t)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition
                                    ${tag === t
                                        ? 'bg-brand-500 text-white border-brand-500'
                                        : 'border-ink-line text-ink-muted hover:border-brand-500 hover:text-brand-500'}`}
                            >
                                {t}
                            </button>
                        ))}
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
