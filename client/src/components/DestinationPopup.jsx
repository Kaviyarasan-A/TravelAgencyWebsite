import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiMapPin, FiClock, FiStar, FiSearch } from 'react-icons/fi';
import { usePackages } from '../hooks/usePackages.js';
import SafeBgImage from './SafeBgImage.jsx';

/**
 * Keyword index for matching a destination (state/city) to relevant packages.
 * Extend this map as new destinations are added.
 */
const KEYWORDS = {
    'Kerala':      ['kerala', 'munnar', 'alleppey', 'kochi', 'wayanad', 'vagamon', 'backwater'],
    'Goa':         ['goa'],
    'Karnataka':   ['karnataka', 'coorg', 'mysore', 'chikmagalur', 'bangalore', 'bengaluru', 'hampi'],
    'Tamil Nadu':  ['tamil', 'tamilnadu', 'ooty', 'kodaikanal', 'pondicherry', 'karaikudi', 'chettinad', 'pollachi'],
    'Maharashtra': ['maharashtra', 'mumbai', 'pune', 'nashik', 'shirdi', 'aurangabad'],
    'Delhi':       ['delhi', 'agra', 'taj mahal', 'noida'],
    'Telangana':   ['telangana', 'hyderabad', 'warangal'],
    'Rajasthan':   ['rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer'],
    'Kashmir':     ['kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'ladakh'],
    'Himachal':    ['himachal', 'manali', 'shimla', 'dharamshala', 'spiti', 'dalhousie'],
    'Uttarakhand': ['uttarakhand', 'nainital', 'mussoorie', 'rishikesh', 'dehradun'],
    'Andaman':     ['andaman', 'port blair', 'havelock', 'nicobar'],
};

function packageMatches(pkg, name) {
    const needles = KEYWORDS[name] || [name.toLowerCase()];
    const haystack = [
        pkg.title, pkg.country, pkg.city, pkg.slug, pkg.region,
        ...(pkg.tags || []),
    ].filter(Boolean).join(' ').toLowerCase();
    return needles.some((n) => haystack.includes(n));
}

/**
 * Slide-up popup listing packages matching the chosen destination.
 */
export default function DestinationPopup({ destination, open, onClose }) {
    const PACKAGES = usePackages();

    const matched = useMemo(() => {
        if (!destination) return [];
        return PACKAGES.filter((p) => packageMatches(p, destination.name));
    }, [PACKAGES, destination]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && destination && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-ink/70 backdrop-blur-md"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Slide-up card */}
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                        className="relative z-10 w-full sm:max-w-4xl bg-white sm:rounded-3xl rounded-t-3xl shadow-float flex flex-col max-h-[88vh] overflow-hidden"
                    >
                        {/* Drag handle (mobile) */}
                        <div className="sm:hidden pt-3 pb-1 flex justify-center">
                            <div className="w-10 h-1.5 rounded-full bg-ink-line" />
                        </div>

                        {/* Header banner */}
                        <div className="relative h-44 sm:h-52 overflow-hidden bg-slate-900 shrink-0">
                            <motion.div
                                initial={{ scale: 1.08 }} animate={{ scale: 1 }}
                                transition={{ duration: 1.1, ease: 'easeOut' }}
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${destination.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                            <button
                                onClick={onClose} aria-label="Close"
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur border border-white/20 flex items-center justify-center text-white transition">
                                <FiX size={18} />
                            </button>
                            <div className="absolute bottom-5 left-5 right-5 text-white">
                                <div className="text-[11px] uppercase tracking-widest opacity-90 inline-flex items-center gap-1.5">
                                    <FiMapPin /> Destination
                                </div>
                                <h3 className="font-display text-2xl sm:text-4xl font-extrabold mt-1 drop-shadow">
                                    {destination.name}
                                </h3>
                                <p className="text-sm text-white/85 mt-1">
                                    {matched.length} tour{matched.length !== 1 ? 's' : ''} available
                                </p>
                            </div>
                        </div>

                        {/* Body — scrolling grid of tours */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50">
                            {matched.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 text-ink-muted flex items-center justify-center mx-auto mb-4">
                                        <FiSearch size={24} />
                                    </div>
                                    <div className="font-display text-xl font-bold text-ink">No {destination.name} tours yet</div>
                                    <p className="text-sm text-ink-muted mt-2 max-w-md mx-auto">
                                        We're curating packages for this destination. In the meantime, tell us your dates and we'll build a custom trip.
                                    </p>
                                    <div className="flex justify-center gap-2 mt-5">
                                        <Link to="/contact" onClick={onClose} className="btn-primary">Request custom trip</Link>
                                        <Link to="/packages" onClick={onClose} className="btn-outline">Browse all</Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {matched.map((p, i) => (
                                            <motion.div
                                                key={p.slug}
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.06, duration: 0.4 }}
                                            >
                                                <Link
                                                    to={`/packages/${p.slug}`}
                                                    onClick={onClose}
                                                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 border border-ink-line"
                                                >
                                                    <div className="relative h-40 overflow-hidden">
                                                        <SafeBgImage src={p.image} className="absolute inset-0 bg-cover bg-center" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent transition-transform duration-700 group-hover:scale-110" />
                                                        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/90 text-ink">
                                                            {p.days}D / {p.nights}N
                                                        </span>
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="font-display font-bold text-ink leading-tight line-clamp-2 group-hover:text-brand-500 transition-colors">
                                                            {p.title}
                                                        </h4>
                                                        <p className="text-[11px] text-ink-muted mt-1 flex items-center gap-1">
                                                            <FiMapPin className="text-brand-500" /> {p.city}
                                                        </p>
                                                        <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
                                                            <span className="inline-flex items-center gap-1">
                                                                <FiStar className="text-accent fill-current" /> {p.rating} ({p.reviews})
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 text-brand-500 font-semibold group-hover:gap-2 transition-all">
                                                                View <FiArrowRight />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-ink-line bg-white flex items-center justify-between gap-3 shrink-0">
                            <p className="text-xs text-ink-muted hidden sm:block">
                                Need something custom? <Link to="/contact" onClick={onClose} className="text-brand-500 font-semibold hover:underline">Tell us your plan →</Link>
                            </p>
                            <Link
                                to={`/packages?q=${encodeURIComponent(destination.name)}`}
                                onClick={onClose}
                                className="btn-primary ml-auto"
                            >
                                View all {destination.name} tours <FiArrowRight />
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
