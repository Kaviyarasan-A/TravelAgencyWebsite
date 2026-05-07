import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiArrowRight, FiClock, FiStar } from 'react-icons/fi';
import { useDestinations } from '../hooks/useDestinations.js';

/**
 * Top Destinations — international bucket-list grid. Each tile links to
 * `/destinations/:slug` (enquiry-only detail page, NOT the booking flow).
 */
export default function TopDestinations() {
    const items = useDestinations('top');
    if (!items.length) return null;

    return (
        <section className="relative py-20 lg:py-24 overflow-hidden bg-white">
            <div aria-hidden className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -right-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-brand-100/60 to-transparent blur-3xl" />
            </div>

            <div className="container-x relative">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="block w-10 h-px bg-brand-500" />
                            <span className="text-brand-500 text-[10.5px] font-display font-bold uppercase tracking-[3.5px]">Top Destinations</span>
                        </div>
                        <h2 className="font-display font-bold text-ink leading-[0.98]"
                            style={{ fontSize: 'clamp(30px, 4.5vw, 54px)', letterSpacing: '-0.03em' }}>
                            The world, <span className="font-script italic text-brand-500 font-semibold">one stamp</span> at a time.
                        </h2>
                        <p className="mt-4 text-ink-muted text-[15px] leading-relaxed max-w-xl">
                            Bucket-list cities, beaches and islands our travellers love. Tap any tile for trip ideas, photos and the best time to go.
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                    {items.map((d, i) => (
                        <motion.div
                            key={d.slug}
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                        >
                            <Link to={`/destinations/${d.slug}`}
                                className="group relative block rounded-3xl overflow-hidden h-[340px] shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 ring-1 ring-black/5">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={d.image ? { backgroundImage: `url(${d.image})` } : undefined} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                                {d.rating && (
                                    <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-ink/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-[11px] font-semibold">
                                        <FiStar size={11} className="text-amber-400 fill-current" /> {d.rating}
                                    </div>
                                )}
                                {Array.isArray(d.places) && d.places.length > 0 && (
                                    <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-ink text-[11px] font-display font-bold shadow ring-1 ring-black/5">
                                        <FiMapPin size={11} className="text-brand-500" /> {d.places.length} places
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                    <div className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[2.5px] font-display font-bold text-brand-300 mb-1.5">
                                        <FiMapPin size={11} /> {d.country}
                                    </div>
                                    <h3 className="font-display font-extrabold text-[22px] leading-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
                                        {d.title}
                                    </h3>
                                    <p className="text-[12.5px] text-white/75 line-clamp-1 mb-3">{d.location}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 text-[11px] text-white/70 font-display font-semibold">
                                            <FiClock size={11} /> {d.days}D · {d.nights}N
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-display font-semibold text-brand-300 group-hover:text-white group-hover:gap-2 transition-all">
                                            Explore <FiArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
