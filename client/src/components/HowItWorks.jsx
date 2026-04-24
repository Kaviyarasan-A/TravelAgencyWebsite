import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch, FiSliders, FiCreditCard, FiCheck } from 'react-icons/fi';

const STEPS = [
    {
        n: '01',
        title: 'Tell us your vibe',
        desc: 'Dates, destination, mood. Or pick a curated trip. 30 seconds.',
        icon: <FiSearch size={26} />,
        gradient: 'from-brand-500 to-amber-400',
    },
    {
        n: '02',
        title: 'We build it for you',
        desc: 'Hotels, transfers, activities — every detail tuned to what you want.',
        icon: <FiSliders size={26} />,
        gradient: 'from-blue-500 to-cyan-400',
    },
    {
        n: '03',
        title: 'Pay securely',
        desc: 'UPI, card, net-banking. Refundable deposit locks your dates.',
        icon: <FiCreditCard size={26} />,
        gradient: 'from-violet-500 to-fuchsia-400',
    },
    {
        n: '04',
        title: 'Just show up',
        desc: 'We handle logistics. You handle the memories. 24/7 support.',
        icon: <FiCheck size={26} />,
        gradient: 'from-emerald-500 to-teal-400',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
            {/* Big faded text behind content for editorial feel */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <span className="font-display text-[260px] font-extrabold text-ink leading-none"
                    style={{ letterSpacing: '-0.08em' }}>
                    PROCESS
                </span>
            </div>

            <div className="container-x relative">
                <div className="max-w-2xl mb-16">
                    <span className="eyebrow">How it works</span>
                    <h2 className="section-title">
                        From idea to boarding pass —
                        <br />
                        <span className="text-brand-500">in 4 clicks.</span>
                    </h2>
                    <p className="text-ink-muted mt-5 text-[15px] leading-relaxed">
                        No 14-email chains. No pushy sales calls. A real human plans your trip
                        and stays on WhatsApp through the journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.55, delay: i * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative bg-white rounded-3xl p-6 lg:p-7 border border-ink-line/60 hover:border-brand-500/40 hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                                {/* Icon with gradient blob that rotates on hover */}
                                <div className="relative mb-6 w-fit">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500`} />
                                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shadow-lg group-hover:rotate-[-6deg] group-hover:scale-110 transition-transform duration-300`}>
                                        {s.icon}
                                    </div>
                                </div>

                                {/* Step number */}
                                <div className="text-[11px] font-bold uppercase tracking-[3px] text-brand-500 mb-2">
                                    Step {s.n}
                                </div>

                                <h3 className="font-display font-extrabold text-ink text-xl leading-tight mb-2"
                                    style={{ letterSpacing: '-0.025em' }}>
                                    {s.title}
                                </h3>
                                <p className="text-[14px] text-ink-muted leading-relaxed">{s.desc}</p>

                                {/* Animated arrow that slides in on hover */}
                                <div className="mt-5 inline-flex items-center gap-1 text-brand-500 text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    Get started <FiArrowRight />
                                </div>
                            </div>

                            {/* Connector between cards (desktop only) */}
                            {i < STEPS.length - 1 && (
                                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-ink-line items-center justify-center text-ink-muted z-10">
                                    <FiArrowRight size={12} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <div className="mt-14 text-center">
                    <Link to="/packages" className="btn-primary btn-lg">
                        Start planning <FiArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}
