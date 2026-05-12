import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiStar, FiClock, FiHeart, FiUsers, FiCompass, FiSun } from 'react-icons/fi';
import { usePackages } from '../hooks/usePackages.js';
import SafeBgImage from './SafeBgImage.jsx';

const THEMES = [
    { key: 'all',       label: 'All',        icon: <FiCompass />,  match: () => true },
    { key: 'honeymoon', label: 'Honeymoon',  icon: <FiHeart />,    match: (p) => /honeymoon|bali|romantic/i.test(p.title) || (p.tags || []).some((t) => /honeymoon/i.test(t)) },
    { key: 'family',    label: 'Family',     icon: <FiUsers />,    match: (p) => (p.tags || []).some((t) => /family|kids/i.test(t)) || p.days >= 7 },
    { key: 'beach',     label: 'Beach',      icon: <FiSun />,      match: (p) => (p.tags || []).some((t) => /beach|backwaters|coast/i.test(t)) },
    { key: 'luxury',    label: 'Luxury',     icon: <FiStar />,     match: (p) => (p.tags || []).some((t) => /luxury/i.test(t)) || (p.basePrice || 0) >= 60000 },
    { key: 'adventure', label: 'Adventure',  icon: <FiCompass />,  match: (p) => (p.tags || []).some((t) => /adventure|nature|mountain|hill/i.test(t)) },
];

export default function TripThemes() {
    const [active, setActive] = useState('all');
    const PACKAGES = usePackages();

    const filtered = useMemo(() => {
        const theme = THEMES.find((t) => t.key === active) || THEMES[0];
        return PACKAGES.filter(theme.match).slice(0, 8);
    }, [PACKAGES, active]);

    return (
        <section className="py-20 lg:py-24 bg-white">
            <div className="container-x">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
                    <div className="max-w-xl">
                        <span className="eyebrow">Handcrafted by vibe</span>
                        <h2 className="section-title">Pick your trip, by how you want to feel</h2>
                    </div>
                </div>

                {/* Theme tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 -mx-5 px-5 lg:mx-0 lg:px-0">
                    {THEMES.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActive(t.key)}
                            className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition ${
                                active === t.key
                                    ? 'bg-ink text-white border-ink shadow-md'
                                    : 'bg-white text-ink border-ink-line hover:border-brand-500 hover:text-brand-500'
                            }`}>
                            <span className={active === t.key ? 'text-brand-400' : 'text-brand-500'}>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Grid with crossfade when theme changes */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {filtered.length === 0 ? (
                            <div className="col-span-full text-center py-14 text-ink-muted">
                                No {active} trips right now — try a different vibe.
                            </div>
                        ) : filtered.map((p, i) => (
                            <motion.div
                                key={p.slug}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (i % 4) * 0.05, duration: 0.35 }}
                            >
                                <Link
                                    to={`/packages/${p.slug}`}
                                    className="group block bg-white rounded-2xl overflow-hidden border border-ink-line/60 hover:border-transparent hover:shadow-card hover:-translate-y-1 transition duration-300"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <SafeBgImage
                                            src={p.image}
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                                        <span className="absolute top-2.5 left-2.5 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-white/95 text-ink">
                                            {p.category || 'India'}
                                        </span>
                                        <span className="absolute bottom-2.5 left-2.5 text-white text-[11px] font-semibold inline-flex items-center gap-1.5">
                                            <FiClock size={10} /> {p.days}D · {p.nights}N
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-display font-bold text-ink text-[15px] leading-snug line-clamp-2 group-hover:text-brand-500 transition"
                                            style={{ letterSpacing: '-0.02em' }}>
                                            {p.title}
                                        </h3>
                                        <p className="text-[11px] text-ink-muted mt-1 line-clamp-1">{p.city}, {p.country}</p>
                                        <div className="mt-3 flex items-center justify-end">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 group-hover:gap-2 transition-all">
                                                Details <FiArrowRight size={12} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
