import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheck, FiTarget, FiAward, FiUsers } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import { STATS, TESTIMONIALS } from '../data.js';

export default function About() {
    return (
        <>
            <Helmet>
                <title>About Us | Trip with uz</title>
                <meta name="description" content="Trip with uz — helping 25,000+ people travel across India and abroad, study overseas and launch companies internationally." />
            </Helmet>

            {/* Hero */}
            <section className="relative py-24 text-white overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg, rgba(11,15,26,0.72), rgba(11,15,26,0.9)), url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=2000&q=80')" }} />
                <div className="container-x relative text-center max-w-3xl mx-auto">
                    <span className="eyebrow !text-brand-400">Our Story</span>
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                        15 years of helping people <span className="font-script text-accent">go further.</span>
                    </h1>
                    <p className="mt-5 text-white/85 text-lg">
                        What started as a small tour desk in Salem is now a dedicated team
                        that plans holidays across India, places students at global universities and helps founders
                        launch companies in 20+ jurisdictions.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-ink text-white">
                <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="font-display text-4xl font-extrabold">{s.value.toLocaleString()}<span className="text-brand-500">{s.suffix}</span></div>
                            <div className="text-xs uppercase tracking-[2px] text-white/70 mt-2">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission / Vision / Values */}
            <section className="py-20">
                <div className="container-x">
                    <SectionHeading
                        eyebrow="What drives us"
                        title="Small enough to care,"
                        script="big enough to deliver."
                    />
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { i: <FiTarget />, t: 'Our Mission', d: "Make 'going abroad' — whether to travel, study, or build — boringly predictable and genuinely delightful." },
                            { i: <FiAward />,  t: 'Our Promise', d: 'Real humans, real accountability. If something goes wrong on your trip, a person picks up the phone — no bots.' },
                            { i: <FiUsers />,  t: 'Our People',  d: '40+ counsellors, destination experts and legal specialists. Most have lived in the places they help you go.' },
                        ].map((x) => (
                            <motion.div
                                key={x.t}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5 }}
                                className="card p-8"
                            >
                                <div className="w-14 h-14 rounded-xl bg-brand-grad text-white flex items-center justify-center text-2xl shadow-brand mb-4">{x.i}</div>
                                <h3 className="font-display text-xl font-bold mb-2">{x.t}</h3>
                                <p className="text-ink-muted leading-relaxed">{x.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why us bullets */}
            <section className="py-20 bg-ink-line/30">
                <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" alt="Our team" className="rounded-3xl shadow-card" />
                    </div>
                    <div>
                        <span className="eyebrow">Why 25,000+ customers chose us</span>
                        <h2 className="section-title">A full-stack partner, not a <span className="script">middleman.</span></h2>
                        <ul className="mt-6 space-y-3">
                            {[
                                'IATA, TAFI and ICEF certified, fully insured.',
                                'Direct contracts with 500+ global suppliers — no markups.',
                                'Licensed counsellors for UK, US, CA, AU, DE and more.',
                                'In-house visa team for travel, study and investor routes.',
                                'Local partners in every country we send you to.',
                                '24/7 emergency support during your trip.',
                            ].map((p) => (
                                <li key={p} className="flex gap-3"><FiCheck className="text-brand-500 mt-1 shrink-0" /><span>{p}</span></li>
                            ))}
                        </ul>
                        <Link to="/contact" className="btn-primary mt-8">Talk to our team</Link>
                    </div>
                </div>
            </section>

            {/* Testimonials strip */}
            <section className="py-16">
                <div className="container-x">
                    <SectionHeading eyebrow="Client Voices" title="What our" script="customers say" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.slice(0, 3).map((t) => (
                            <figure key={t.name} className="card p-6">
                                <p className="italic text-ink leading-relaxed">&ldquo;{t.body}&rdquo;</p>
                                <figcaption className="mt-4 flex items-center gap-3 border-t border-ink-line pt-4">
                                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                                    <div>
                                        <div className="font-semibold">{t.name}</div>
                                        <div className="text-xs text-ink-muted">{t.trip}</div>
                                    </div>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
