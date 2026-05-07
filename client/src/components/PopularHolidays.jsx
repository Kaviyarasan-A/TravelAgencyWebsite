import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiStar, FiMapPin } from 'react-icons/fi';
import { useDestinations } from '../hooks/useDestinations.js';

/**
 * Popular Holidays — themed India-focused holiday ideas, like Kerala
 * Honeymoon Special, Rajasthan Royals, etc. Tap a card to see details
 * and submit an enquiry. Separate from the bookable `packages` catalogue.
 */
export default function PopularHolidays() {
    const items = useDestinations('popular');
    if (!items.length) return null;

    return (
        <section className="relative py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-slate-50/40 via-white to-white">
            <div aria-hidden className="absolute inset-0 pointer-events-none">
                <div className="absolute -bottom-32 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-amber-100/50 to-transparent blur-3xl" />
            </div>

            <div className="container-x relative">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="block w-10 h-px bg-brand-500" />
                            <span className="text-brand-500 text-[10.5px] font-display font-bold uppercase tracking-[3.5px]">Popular Holidays</span>
                        </div>
                        <h2 className="font-display font-bold text-ink leading-[0.98]"
                            style={{ fontSize: 'clamp(30px, 4.5vw, 54px)', letterSpacing: '-0.03em' }}>
                            India, <span className="font-script italic text-brand-500 font-semibold">curated</span>.
                        </h2>
                        <p className="mt-4 text-ink-muted text-[15px] leading-relaxed max-w-xl">
                            Hand-picked themed escapes — backwaters in Kerala, royal palaces in Rajasthan, snow in Kashmir. Tap to see what's included.
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {items.map((d, i) => (
                        <motion.div
                            key={d.slug}
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
                        >
                            <Link to={`/destinations/${d.slug}`}
                                className="group block rounded-2xl overflow-hidden bg-white shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 ring-1 ring-ink-line/60">
                                <div className="relative h-44 overflow-hidden">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={d.image ? { backgroundImage: `url(${d.image})` } : undefined} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                                    {d.tags?.[0] && (
                                        <span className="absolute top-3 left-3 inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-display font-bold uppercase tracking-[1.5px] text-brand-600 shadow ring-1 ring-black/5">
                                            {d.tags[0]}
                                        </span>
                                    )}
                                    {d.rating && (
                                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-ink/80 backdrop-blur-sm rounded-full px-2 py-1 text-white text-[10.5px] font-semibold">
                                            <FiStar size={10} className="text-amber-400 fill-current" /> {d.rating}
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[2px] text-ink-muted font-display font-bold mb-1">
                                        <FiMapPin size={10} className="text-brand-500" /> {d.country}
                                    </div>
                                    <h3 className="font-display font-extrabold text-ink text-[16px] leading-tight mb-1.5"
                                        style={{ letterSpacing: '-0.015em' }}>
                                        {d.title}
                                    </h3>
                                    <p className="text-[12px] text-ink-muted line-clamp-2 mb-3 leading-relaxed">{d.location}</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-ink-line/60">
                                        <div className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted font-display font-semibold">
                                            <FiClock size={11} className="text-brand-500" /> {d.days}D · {d.nights}N
                                        </div>
                                        <div className="text-[11.5px] text-brand-500 font-display font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Enquire <FiArrowRight size={11} />
                                        </div>
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
