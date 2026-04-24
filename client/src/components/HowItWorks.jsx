import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch, FiSliders, FiCreditCard, FiCompass } from 'react-icons/fi';
import LottieIcon from './LottieIcon.jsx';

const STEPS = [
    {
        n: '01',
        title: 'Pick a vibe',
        desc: 'Tell us your dates, destinations and mood — or browse our curated trips.',
        lottie: 'search',
        icon: <FiSearch />,
    },
    {
        n: '02',
        title: 'Customise',
        desc: "Swap hotels, add activities, upgrade rooms. Every detail's yours to tweak.",
        lottie: 'customize',
        icon: <FiSliders />,
    },
    {
        n: '03',
        title: 'Pay securely',
        desc: 'UPI · card · net-banking. 100% refundable deposit holds your dates.',
        lottie: 'payment',
        icon: <FiCreditCard />,
    },
    {
        n: '04',
        title: 'Travel happy',
        desc: 'We handle logistics, you handle memories. 24/7 support on the road.',
        lottie: 'checkmark',
        icon: <FiCompass />,
    },
];

export default function HowItWorks() {
    return (
        <section className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
            {/* Subtle decorative lines */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #0b0f1a 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }} />

            <div className="container-x relative">
                <div className="max-w-2xl mb-12 lg:mb-16">
                    <span className="eyebrow">How it works</span>
                    <h2 className="section-title">From idea to boarding pass — in 4 clicks</h2>
                    <p className="text-ink-muted mt-4 text-[15px] leading-relaxed">
                        No 14-email chains. No pushy sales calls. Real travellers, real prices,
                        and a human you can WhatsApp any time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.55, delay: i * 0.08 }}
                            className="relative bg-white rounded-3xl p-6 lg:p-7 border border-ink-line/60 hover:border-brand-500/40 hover:shadow-card transition duration-300 group"
                        >
                            {/* Big step number in background */}
                            <div className="absolute top-4 right-4 text-[42px] font-display font-extrabold text-ink-line/60 group-hover:text-brand-200 transition"
                                style={{ letterSpacing: '-0.04em' }}>
                                {s.n}
                            </div>

                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <LottieIcon
                                        name={s.lottie}
                                        size={56}
                                        fallback={<span className="text-brand-500 text-2xl">{s.icon}</span>}
                                    />
                                </div>
                                <h3 className="font-display font-extrabold text-ink text-lg leading-tight mb-2"
                                    style={{ letterSpacing: '-0.02em' }}>
                                    {s.title}
                                </h3>
                                <p className="text-[13.5px] text-ink-muted leading-relaxed">{s.desc}</p>

                                {/* Connector line (not on last card) */}
                                {i < STEPS.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 -right-[34px] w-[28px] h-[2px] bg-gradient-to-r from-brand-300 to-transparent" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link to="/packages" className="btn-primary btn-lg">
                        Start your trip <FiArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}
