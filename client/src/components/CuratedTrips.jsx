import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiStar, FiClock } from 'react-icons/fi';
import { usePackages } from '../hooks/usePackages.js';
import SafeBgImage from './SafeBgImage.jsx';

/**
 * Horizontal, swipe-able trip carousel — PickYourTrail style.
 * Uses native scroll-snap for smooth touch/trackpad scrolling, plus
 * left/right buttons that scroll by one card width.
 */

export default function CuratedTrips({
    title = 'Curated journeys, ready to go',
    eyebrow = 'Trending Trips',
    filter = null, // optional: (pkg) => bool
}) {
    const PACKAGES = usePackages();
    const scrollRef = useRef(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(true);

    const items = (filter ? PACKAGES.filter(filter) : PACKAGES).slice(0, 12);

    const updateArrows = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 8);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };

    useEffect(() => {
        updateArrows();
        const el = scrollRef.current;
        if (!el) return;
        const onScroll = () => updateArrows();
        el.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [items.length]);

    const scrollBy = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = el.querySelector('[data-card]')?.offsetWidth || 320;
        el.scrollBy({ left: (cardWidth + 16) * dir, behavior: 'smooth' });
    };

    if (items.length === 0) return null;

    return (
        <section className="py-20 lg:py-28 bg-slate-50">
            <div className="container-x">
                <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
                    <div className="max-w-xl">
                        <span className="eyebrow">{eyebrow}</span>
                        <h2 className="section-title">{title}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scrollBy(-1)}
                            disabled={!canLeft}
                            aria-label="Scroll left"
                            className="w-11 h-11 rounded-full border border-ink-line bg-white hover:border-brand-500 hover:text-brand-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition">
                            <FiChevronLeft />
                        </button>
                        <button
                            onClick={() => scrollBy(1)}
                            disabled={!canRight}
                            aria-label="Scroll right"
                            className="w-11 h-11 rounded-full border border-ink-line bg-white hover:border-brand-500 hover:text-brand-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition">
                            <FiChevronRight />
                        </button>
                        <Link to="/packages" className="ml-2 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-500 transition">
                            See all <FiArrowRight />
                        </Link>
                    </div>
                </div>

                {/* Horizontal scroll rail */}
                <div className="relative -mx-5 lg:-mx-8">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-5 lg:px-8 pb-4"
                        style={{ scrollbarWidth: 'none' }}>
                        {items.map((p, i) => <TripCard key={p.slug} pkg={p} index={i} />)}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TripCard({ pkg, index }) {
    return (
        <motion.article
            data-card
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
            className="snap-start shrink-0 w-[290px] sm:w-[320px] bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-300">
            <Link to={`/packages/${pkg.slug}`} className="block group">
                <div className="relative h-[220px] overflow-hidden">
                    <SafeBgImage
                        src={pkg.image}
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                    {pkg.category && (
                        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-white/95 text-ink">
                            {pkg.category}
                        </span>
                    )}

                    <span className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1.5">
                        <FiClock size={11} /> {pkg.days}D · {pkg.nights}N
                    </span>
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-2 text-[11px] text-ink-muted mb-1">
                        <span>{pkg.city}, {pkg.country}</span>
                    </div>
                    <h3 className="font-display font-bold text-ink text-[17px] leading-tight line-clamp-2 group-hover:text-brand-500 transition"
                        style={{ letterSpacing: '-0.02em' }}>
                        {pkg.title}
                    </h3>

                    <div className="flex items-center gap-1 text-[11px] text-ink-muted mt-2">
                        <FiStar className="text-amber-500 fill-current" size={11} />
                        <b className="text-ink">{pkg.rating}</b> ({pkg.reviews})
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-500 group-hover:gap-2 transition-all">
                            View <FiArrowRight />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
