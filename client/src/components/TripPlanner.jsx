import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiArrowRight, FiCheck } from 'react-icons/fi';
import { usePackages } from '../hooks/usePackages.js';

const MOODS = [
    { key: 'beach', label: 'Beach & Chill', icon: '🏖️', tags: ['Beach'] },
    { key: 'nature', label: 'Nature & Hills', icon: '🏔️', tags: ['Hill Station', 'Nature'] },
    { key: 'heritage', label: 'Heritage & Culture', icon: '🏛️', tags: ['Heritage', 'History', 'Culture', 'UNESCO'] },
    { key: 'adventure', label: 'Adventure', icon: '🎒', tags: ['Adventure', 'Nature'] },
    { key: 'backwaters', label: 'Backwaters', icon: '🛶', tags: ['Backwaters'] },
    { key: 'spiritual', label: 'Temples & Spiritual', icon: '🛕', tags: ['Temple', 'Heritage'] },
];

export default function TripPlanner() {
    const [selected, setSelected] = useState(null);
    const PACKAGES = usePackages();

    const matchedPkgs = selected
        ? PACKAGES.filter(p => (p.tags || []).some(t => MOODS.find(m => m.key === selected)?.tags.includes(t)))
        : [];

    return (
        <section className="py-20 particles-bg bg-ink text-white relative overflow-hidden">
            <div className="container-x relative z-10">
                <div className="text-center mb-12">
                    <span className="eyebrow !text-brand-500">AI-Powered</span>
                    <h2 className="section-title !text-white">What's your travel <span className="script !text-accent">mood?</span></h2>
                    <p className="text-white/70 mt-3 max-w-lg mx-auto">Pick a vibe and we'll instantly match you with the perfect trip.</p>
                </div>

                {/* Mood selector */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {MOODS.map((mood) => (
                        <motion.button
                            key={mood.key}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelected(selected === mood.key ? null : mood.key)}
                            className={`px-5 py-3 rounded-2xl text-sm font-medium border transition-all duration-300 flex items-center gap-2
                                ${selected === mood.key
                                    ? 'bg-brand-500 border-brand-500 text-white shadow-brand scale-105'
                                    : 'border-white/20 text-white/80 hover:border-brand-400 hover:text-white glass'
                                }`}
                        >
                            <span className="text-lg">{mood.icon}</span>
                            {mood.label}
                            {selected === mood.key && <FiCheck className="text-white" />}
                        </motion.button>
                    ))}
                </div>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {selected && matchedPkgs.length > 0 && (
                        <motion.div
                            key={selected}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {matchedPkgs.map((pkg, i) => (
                                <motion.div
                                    key={pkg.slug}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                >
                                    <Link
                                        to={`/packages/${pkg.slug}`}
                                        className="group block rounded-2xl overflow-hidden glass hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="relative h-40 overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${pkg.image})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                                            <div className="absolute bottom-3 left-3 text-white">
                                                <div className="text-xs opacity-80 flex items-center gap-1"><FiMapPin size={10} /> {pkg.city}</div>
                                            </div>
                                            <span className="absolute top-3 right-3 text-white text-xs font-medium px-2.5 py-1 rounded-full bg-brand-500/90">
                                                {pkg.days}D/{pkg.nights}N
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-display font-bold text-white group-hover:text-brand-400 transition-colors">{pkg.title}</h3>
                                            <p className="text-white/60 text-xs mt-1 line-clamp-1">{pkg.highlights[0]}</p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex gap-1.5">
                                                    {pkg.tags.slice(0, 2).map(t => (
                                                        <span key={t} className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px]">{t}</span>
                                                    ))}
                                                </div>
                                                <span className="text-brand-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    View <FiArrowRight size={12} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {selected && matchedPkgs.length === 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-white/60"
                    >
                        No exact matches — but we can customize any trip for you! <Link to="/contact" className="text-brand-400 underline">Get in touch</Link>
                    </motion.p>
                )}

                {!selected && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-white/50 text-sm"
                    >
                        Select a mood above to discover matching packages instantly
                    </motion.p>
                )}
            </div>
        </section>
    );
}
