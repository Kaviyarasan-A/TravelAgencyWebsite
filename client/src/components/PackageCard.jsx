import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiClock, FiHeart, FiArrowRight } from 'react-icons/fi';

function inr(n) { return '₹' + (Number(n) || 0).toLocaleString('en-IN'); }

export default function PackageCard({ pkg, onBook, index = 0 }) {
    const [wish, setWish] = useState(false);
    const price = pkg.basePrice;

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
            className="group card overflow-hidden hover:shadow-card hover:-translate-y-2 transition-all duration-300 flex flex-col hover-glow"
        >
            <div className="relative h-56 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${pkg.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                <button
                    onClick={(e) => { e.preventDefault(); setWish(!wish); }}
                    aria-label="Save"
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center
                                transition-all duration-300 hover:scale-125 active:scale-95
                                ${wish ? 'text-brand-500 animate-bounce-slow' : 'text-ink-muted'}`}
                >
                    <FiHeart className={`transition-transform duration-300 ${wish ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                </button>

                {pkg.category && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/90 text-ink">
                        {pkg.category}
                    </span>
                )}

                <span className="absolute bottom-3 left-3 text-white text-xs font-medium px-3 py-1.5 rounded-full bg-black/55 backdrop-blur">
                    <FiClock className="inline mr-1" /> {pkg.days}D / {pkg.nights}N
                </span>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-ink-muted flex items-center gap-1.5 mb-1">
                    <FiMapPin className="text-brand-500" /> {pkg.city}, {pkg.country}
                </p>
                <h3 className="text-lg font-bold font-display text-ink leading-snug mb-2 group-hover:text-brand-500 transition-colors duration-300">{pkg.title}</h3>

                <div className="flex items-center gap-3 text-xs text-ink-muted mb-4">
                    <span className="inline-flex items-center gap-1"><FiStar className="text-accent fill-current" /> {pkg.rating} ({pkg.reviews})</span>
                    <span className="flex gap-1 flex-wrap">
                        {(pkg.tags || []).slice(0, 2).map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 text-[11px] font-medium">{t}</span>
                        ))}
                    </span>
                </div>

                <div className="mt-auto pt-4 border-t border-dashed border-ink-line flex items-end justify-between gap-3">
                    {price ? (
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Starts from</div>
                            <div className="font-display text-xl font-extrabold text-ink">{inr(price)}<span className="text-xs font-medium text-ink-muted ml-1">/ person</span></div>
                        </div>
                    ) : <span />}
                    <div className="flex gap-2 shrink-0">
                        <Link to={`/packages/${pkg.slug}`} className="btn-outline btn-sm">Details</Link>
                        <button onClick={() => onBook?.(pkg)} className="btn-primary btn-sm">
                            Book <FiArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
