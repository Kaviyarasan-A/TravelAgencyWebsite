import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import { usePackages } from '../hooks/usePackages.js';
import DestinationPopup from './DestinationPopup.jsx';

/**
 * A featured set of 8 destinations — large tall cards, inspired by
 * PickYourTrail / Booking's "Top destinations" layout.
 *
 * Clicking a card opens the DestinationPopup slide-sheet with the
 * matching tour packages for that destination.
 */
const FEATURED = [
    { name: 'Kerala',      country: 'India',      tag: 'Backwaters',  image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80' },
    { name: 'Dubai',       country: 'UAE',        tag: 'Luxury city', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80' },
    { name: 'Bali',        country: 'Indonesia',  tag: 'Honeymoon',   image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80' },
    { name: 'Goa',         country: 'India',      tag: 'Beach',       image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80' },
    { name: 'Singapore',   country: 'Singapore',  tag: 'Family',      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80' },
    { name: 'Kashmir',     country: 'India',      tag: 'Mountains',   image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80' },
    { name: 'Europe',      country: '4 countries',tag: 'Grand tour',  image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80' },
    { name: 'Rajasthan',   country: 'India',      tag: 'Heritage',    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80' },
];

// Quick keyword → package match so we can show "X tours · from ₹Y"
const KEYWORDS = {
    Kerala:    ['kerala', 'munnar', 'alleppey', 'kochi', 'wayanad'],
    Dubai:     ['dubai', 'uae'],
    Bali:      ['bali', 'indonesia'],
    Goa:       ['goa'],
    Singapore: ['singapore', 'malaysia'],
    Kashmir:   ['kashmir', 'srinagar', 'gulmarg'],
    Europe:    ['europe', 'france', 'switzerland', 'italy', 'netherlands'],
    Rajasthan: ['rajasthan', 'jaipur', 'udaipur'],
    'Tamil Nadu': ['tamil', 'ooty', 'kodaikanal', 'pondicherry'],
    Karnataka: ['karnataka', 'coorg', 'mysore', 'chikmagalur'],
    Maharashtra: ['maharashtra', 'mumbai', 'pune'],
    Delhi:     ['delhi', 'agra'],
    Telangana: ['telangana', 'hyderabad'],
};

function matchesDestination(pkg, name) {
    const needles = KEYWORDS[name] || [name.toLowerCase()];
    const hay = [pkg.title, pkg.country, pkg.city, pkg.slug, pkg.region, ...(pkg.tags || [])]
        .filter(Boolean).join(' ').toLowerCase();
    return needles.some((n) => hay.includes(n));
}

function inr(n) { return '₹' + (Number(n) || 0).toLocaleString('en-IN'); }

export default function DestinationsGrid() {
    const PACKAGES = usePackages();
    const [open, setOpen] = useState(null);

    const cards = useMemo(() => FEATURED.map((d) => {
        const matches = PACKAGES.filter((p) => matchesDestination(p, d.name));
        const lowest = matches.reduce((m, p) => p.basePrice && (!m || p.basePrice < m) ? p.basePrice : m, null);
        return { ...d, count: matches.length, from: lowest };
    }), [PACKAGES]);

    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container-x">
                <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
                    <div className="max-w-xl">
                        <span className="eyebrow">Destinations</span>
                        <h2 className="section-title">Places our travellers can't stop talking about</h2>
                    </div>
                    <a href="/packages" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-500 transition group">
                        See all destinations
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </a>
                </div>

                {/* Grid — responsive; tall cards on md+, shorter on mobile */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {cards.map((d, i) => (
                        <motion.button
                            key={d.name}
                            onClick={() => setOpen(d)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                            whileHover={{ y: -4 }}
                            className="group relative overflow-hidden rounded-2xl md:rounded-3xl aspect-[3/4] text-left focus:outline-none focus:ring-4 focus:ring-brand-500/20 shadow-soft hover:shadow-card transition"
                        >
                            {/* Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] group-hover:scale-110"
                                style={{ backgroundImage: `url(${d.image})` }}
                            />
                            {/* Gradient scrim */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                            {/* Top tag */}
                            <span className="absolute top-3 left-3 md:top-4 md:left-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-white/90 text-ink backdrop-blur">
                                {d.tag}
                            </span>

                            {/* Content */}
                            <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4 text-white">
                                <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/80 mb-1">
                                    <FiMapPin size={10} /> {d.country}
                                </div>
                                <h3 className="font-display font-extrabold text-lg md:text-2xl leading-tight"
                                    style={{ letterSpacing: '-0.025em' }}>
                                    {d.name}
                                </h3>
                                <div className="flex items-baseline gap-2 mt-2 text-xs text-white/85">
                                    {d.count > 0 ? (
                                        <>
                                            <span className="font-semibold text-white">{d.count}</span>
                                            <span>tour{d.count > 1 ? 's' : ''}</span>
                                            {d.from && (
                                                <>
                                                    <span className="w-px h-3 bg-white/30" />
                                                    <span>from <b className="text-brand-400">{inr(d.from)}</b></span>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-white/70">Custom trips available</span>
                                    )}
                                </div>

                                {/* Hover arrow */}
                                <span className="absolute bottom-0 right-0 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center">
                                    <FiArrowRight size={16} />
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <DestinationPopup
                destination={open}
                open={!!open}
                onClose={() => setOpen(null)}
            />
        </section>
    );
}
