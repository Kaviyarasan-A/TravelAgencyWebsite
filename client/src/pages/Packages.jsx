import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiMapPin, FiGlobe } from 'react-icons/fi';
import PackageCard from '../components/PackageCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import { AdInline } from '../components/AdBanner.jsx';
import AmbientBackdrop from '../components/AmbientBackdrop.jsx';
import { usePackages } from '../hooks/usePackages.js';

const TAGS = ['All', 'Beach', 'Heritage', 'Hill Station', 'Nature', 'Culture', 'Adventure', 'Backwaters', 'Luxury', 'Honeymoon', 'Family'];
const CATEGORIES = [
    { key: '',              label: 'All',           icon: null },
    { key: 'Domestic',      label: 'Domestic',      icon: <FiMapPin /> },
    { key: 'International', label: 'International', icon: <FiGlobe /> },
];

export default function Packages() {
    const [params, setParams] = useSearchParams();
    const [tag, setTag] = useState(params.get('tag') || 'All');
    const [category, setCategory] = useState(params.get('category') || '');
    const [region, setRegion] = useState(params.get('region') || '');
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('popular');
    const [bookOpen, setBookOpen] = useState(false);
    const [bookPkg, setBookPkg] = useState(null);
    const PACKAGES = usePackages();

    useEffect(() => {
        // Keep URL in sync with category
        if (category) params.set('category', category); else params.delete('category');
        if (region)   params.set('region', region);     else params.delete('region');
        if (tag && tag !== 'All') params.set('tag', tag); else params.delete('tag');
        setParams(params, { replace: true });
        // eslint-disable-next-line
    }, [category, region, tag]);

    // Regions available within current category
    const regions = useMemo(() => {
        const pool = category ? PACKAGES.filter((p) => (p.category || 'Domestic') === category) : PACKAGES;
        return Array.from(new Set(pool.map((p) => p.region).filter(Boolean)));
    }, [PACKAGES, category]);

    const filtered = useMemo(() => {
        let list = PACKAGES.filter((p) => {
            if (category && (p.category || 'Domestic') !== category) return false;
            if (region && p.region !== region) return false;
            if (tag !== 'All' && !(p.tags || []).includes(tag)) return false;
            if (q) {
                const s = ((p.title || '') + ' ' + (p.country || '') + ' ' + (p.city || '') + ' ' + (p.tags || []).join(' ')).toLowerCase();
                if (!s.includes(q.toLowerCase())) return false;
            }
            return true;
        });
        if (sort === 'days-low')  list = [...list].sort((a, b) => a.days - b.days);
        if (sort === 'days-high') list = [...list].sort((a, b) => b.days - a.days);
        if (sort === 'rating')    list = [...list].sort((a, b) => b.rating - a.rating);
        if (sort === 'price-low')  list = [...list].sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        if (sort === 'price-high') list = [...list].sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
        return list;
    }, [tag, q, sort, category, region, PACKAGES]);

    return (
        <>
            <Helmet>
                <title>Holiday Packages | Trip with uz</title>
                <meta name="description" content="Browse curated domestic & international holiday packages — beaches, hill stations, heritage tours, Dubai, Bali, Europe and more. Customisable itineraries." />
            </Helmet>

            {/* Page hero */}
            <section className="relative bg-mesh-dark text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-25 animate-zoom-slow" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=2000&q=80')" }} />
                <AmbientBackdrop variant="dark" />
                <div className="container-x relative">
                    <span className="eyebrow !text-brand-400">Our Packages</span>
                    <h1 className="font-display text-4xl sm:text-5xl font-extrabold max-w-2xl">
                        Discover your next <span className="font-script text-accent">adventure</span>
                    </h1>
                    <p className="mt-3 opacity-90 max-w-xl">Domestic India escapes and international bucket-list journeys — stays + tours bundled, fully customizable, cancellation flexible.</p>
                </div>
            </section>

            {/* Promo banner */}
            <section className="pt-8">
                <div className="container-x">
                    <AdInline placement="packages_top" />
                </div>
            </section>

            {/* Category pills */}
            <section className="pt-8">
                <div className="container-x">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.key || 'all'}
                                onClick={() => { setCategory(c.key); setRegion(''); }}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition inline-flex items-center gap-2
                                    ${category === c.key ? 'bg-brand-500 text-white border-brand-500 shadow-brand' : 'bg-white text-ink border-ink-line hover:border-brand-500 hover:text-brand-500'}`}>
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

            {/* Filters */}
            <section className="py-8 bg-white sticky top-20 z-30 border-b border-ink-line">
                <div className="container-x flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <input
                                value={q} onChange={(e) => setQ(e.target.value)}
                                placeholder="Search destinations, cities, tags…"
                                className="input pl-11"
                            />
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-sm text-ink-muted"><FiFilter /> Sort:</div>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input max-w-[210px]">
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
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition
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
                    <div className="mb-6 text-ink-muted text-sm">{filtered.length} package{filtered.length !== 1 ? 's' : ''} found</div>
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
