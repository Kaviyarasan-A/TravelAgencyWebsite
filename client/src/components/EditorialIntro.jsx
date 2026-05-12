import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';

/**
 * Editorial premium-magazine intro — sits between TrustBar and the
 * scrolling destinations marquee. Wix-template style: oversized serif
 * headline + script accent on the left, asymmetric photo collage with
 * floating stat chip on the right.
 */
export default function EditorialIntro() {
    return (
        <section className="relative py-20 lg:py-28 overflow-hidden bg-white">
            {/* Decorative warm wash */}
            <div aria-hidden className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-brand-100/70 to-transparent blur-3xl" />
                <div className="absolute -bottom-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-amber-100/60 to-transparent blur-3xl" />
            </div>

            <div className="container-x relative grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
                {/* LEFT — Editorial copy */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="inline-flex items-center gap-3 mb-6">
                        <span className="w-10 h-px bg-brand-500" />
                        <span className="text-brand-500 text-[10px] font-bold uppercase tracking-[3.5px]">
                            Curated since 2010
                        </span>
                    </div>

                    <h2 className="font-display font-bold text-ink leading-[0.95]"
                        style={{ fontSize: 'clamp(34px, 5.5vw, 64px)', letterSpacing: '-0.035em' }}>
                        Travel,
                        <span className="block mt-1.5">
                            <span className="font-script text-brand-500 italic font-semibold" style={{ fontSize: '1.05em' }}>beautifully</span>{' '}
                            crafted.
                        </span>
                    </h2>

                    <p className="mt-7 text-ink-muted text-[16px] leading-[1.75] max-w-xl">
                        We don't sell holidays — we draft itineraries that read like stories.
                        Every stay vetted by a real human. Every transfer pre-arranged. Every sunset,
                        on-time. From Salem to the Swiss Alps, we plan the journey so you can simply{' '}
                        <span className="font-semibold text-ink">live it</span>.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <Link to="/about"
                            className="group inline-flex items-center gap-3 bg-ink hover:bg-ink-soft text-white px-6 py-3.5 rounded-full font-semibold text-sm transition shadow-card">
                            Our story
                            <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <FiArrowRight size={12} />
                            </span>
                        </Link>
                        <Link to="/packages"
                            className="inline-flex items-center gap-2 text-ink hover:text-brand-500 font-semibold text-sm underline-offset-4 hover:underline transition">
                            Browse trips →
                        </Link>
                    </div>

                    {/* Stat row — large, prominent, full-width */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-12 pt-8 border-t-2 border-ink-line/70 grid grid-cols-3 gap-6 sm:gap-8"
                    >
                        <div className="text-center sm:text-left">
                            <div className="font-display font-extrabold text-ink leading-none"
                                style={{ fontSize: 'clamp(36px, 5.5vw, 60px)', letterSpacing: '-0.035em' }}>
                                15<span className="text-brand-500">+</span>
                            </div>
                            <div className="text-[11px] sm:text-[12px] uppercase tracking-[2.5px] text-ink-muted mt-3 font-semibold">
                                Years crafting<br className="hidden sm:inline" /> trips
                            </div>
                        </div>
                        <div className="text-center sm:text-left border-x border-ink-line/60 px-4 sm:px-6">
                            <div className="font-display font-extrabold text-ink leading-none"
                                style={{ fontSize: 'clamp(36px, 5.5vw, 60px)', letterSpacing: '-0.035em' }}>
                                120<span className="text-brand-500">+</span>
                            </div>
                            <div className="text-[11px] sm:text-[12px] uppercase tracking-[2.5px] text-ink-muted mt-3 font-semibold">
                                Destinations
                            </div>
                        </div>
                        <div className="text-center sm:text-left">
                            <div className="font-display font-extrabold text-ink leading-none inline-flex items-baseline gap-1"
                                style={{ fontSize: 'clamp(36px, 5.5vw, 60px)', letterSpacing: '-0.035em' }}>
                                4.9<span className="text-brand-500 text-[0.7em]">★</span>
                            </div>
                            <div className="text-[11px] sm:text-[12px] uppercase tracking-[2.5px] text-ink-muted mt-3 font-semibold">
                                2,510 reviews
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* RIGHT — Photo collage */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="relative h-[460px] lg:h-[540px]"
                >
                    {/* Big photo */}
                    <div className="absolute top-0 right-0 w-[72%] h-[64%] rounded-3xl overflow-hidden shadow-float ring-1 ring-black/5">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] hover:scale-105"
                            style={{ backgroundImage: 'url(https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&cs=tinysrgb&w=1400)' }} />
                        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-semibold text-ink shadow">
                            <FiMapPin className="text-brand-500" size={11} /> Santorini, GR
                        </div>
                    </div>

                    {/* Smaller photo lower-left, overlapping */}
                    <div className="absolute bottom-0 left-0 w-[58%] h-[48%] rounded-3xl overflow-hidden shadow-float ring-1 ring-black/5">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] hover:scale-105"
                            style={{ backgroundImage: 'url(https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1200)' }} />
                        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-semibold text-ink shadow">
                            <FiMapPin className="text-brand-500" size={11} /> Munnar, IN
                        </div>
                    </div>

                    {/* Small accent square top-left */}
                    <div className="absolute top-[18%] -left-3 w-[26%] h-[28%] rounded-2xl overflow-hidden shadow-card ring-1 ring-black/5 hidden md:block">
                        <div className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: 'url(https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=600)' }} />
                    </div>

                    {/* Floating credential chip */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="absolute bottom-6 right-4 lg:right-8 bg-ink text-white rounded-2xl shadow-2xl p-4 pr-5 flex items-center gap-3 ring-1 ring-white/10"
                    >
                        <div className="w-11 h-11 rounded-xl bg-brand-grad flex items-center justify-center font-display font-extrabold text-base shadow-brand">
                            uz
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-[2px] text-white/60 font-bold">Your trip planner</div>
                            <div className="font-display text-[15px] font-bold leading-tight mt-0.5"
                                style={{ letterSpacing: '-0.02em' }}>
                                Hand-picked. Always.
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating script "since 2010" tag */}
                    <div className="absolute -top-2 right-[18%] hidden md:block bg-white rounded-full px-4 py-1.5 shadow-card ring-1 ring-black/5 rotate-[-6deg]">
                        <span className="font-script text-brand-500 text-[16px]">Since 2010</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
