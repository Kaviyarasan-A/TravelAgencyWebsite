import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSend, FiCheck, FiBriefcase, FiCreditCard, FiShield, FiTrendingUp, FiHome, FiFileText } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import AuroraBackground from '../components/AuroraBackground.jsx';
import { BUSINESS_COUNTRIES, BUSINESS_SERVICES } from '../data.js';
import { api, openWhatsApp } from '../api.js';

const icons = { bldg: <FiHome />, scale: <FiFileText />, bank: <FiCreditCard />, visa: <FiShield />, chart: <FiTrendingUp />, office: <FiBriefcase /> };

const blank = { name:'', email:'', phone:'', country:'', business_type:'', stage:'Idea / pre-incorporation', budget:'', notes:'', website:'' };

export default function BusinessSetup() {
    const [form, setForm] = useState(blank);
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        const p = api.business(form);
        await toast.promise(p, {
            loading: 'Sending your enquiry…',
            success: "Thanks! A setup specialist will contact you within 24 hours.",
            error:   'Could not send. Please try again.',
        });
        const r = await p;
        setBusy(false);
        if (r.ok) {
            if (r.data?.whatsappUrl) openWhatsApp(r.data.whatsappUrl);
            setForm(blank);
        }
    };

    return (
        <>
            <Helmet>
                <title>Business Setup Abroad | Trip with uz</title>
                <meta name="description" content="Company formation, licensing, banking, investor visas and tax structuring in Dubai, Singapore, USA, UK, Canada and more." />
            </Helmet>

            {/* Hero */}
            <section className="relative bg-ink text-white pt-28 pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
                <AuroraBackground variant="sunset" intensity={0.7} />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/45 to-ink/95" />
                <div className="container-x relative grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-5">
                            <span className="w-8 h-px bg-brand-500" />
                            <span className="text-brand-500 text-[10px] font-bold uppercase tracking-[3px]">Company Formation · Visas · Banking</span>
                        </div>
                        <h1 className="font-display font-bold text-white leading-[0.95]"
                            style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
                            Launch your <span className="text-brand-500">business</span><br />
                            across borders.
                        </h1>
                        <p className="mt-5 text-white/70 max-w-xl text-[15px] leading-relaxed">
                            From Dubai mainland to a Delaware LLC — we handle company formation,
                            trade license, banking, investor visas and ongoing compliance.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-5 text-[13px] text-white/75">
                            <span className="inline-flex items-center gap-1.5"><FiCheck className="text-brand-400" /> 8+ jurisdictions</span>
                            <span className="inline-flex items-center gap-1.5"><FiCheck className="text-brand-400" /> 14-day setup</span>
                            <span className="inline-flex items-center gap-1.5"><FiCheck className="text-brand-400" /> Bank account included</span>
                        </div>
                    </div>

                    <form onSubmit={submit} className="bg-white text-ink rounded-3xl p-6 shadow-float">
                        <h3 className="font-display text-xl font-bold">Book a discovery call</h3>
                        <p className="text-xs text-ink-muted mb-4">30-minute free consult with a setup specialist.</p>
                        <input type="text" className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} tabIndex={-1} autoComplete="off" />
                        <div className="space-y-3">
                            <input required placeholder="Full name *"      className="input" value={form.name}  onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <input required type="email" placeholder="Email *" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <input required type="tel" placeholder="Phone *"    className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            <select className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                                <option value="">Target country</option>
                                {BUSINESS_COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}
                            </select>
                            <input placeholder="Business type (e.g. SaaS, trading, consulting)" className="input" value={form.business_type} onChange={(e) => setForm({ ...form, business_type: e.target.value })} />
                            <select className="input" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                                <option>Idea / pre-incorporation</option>
                                <option>Already operating in India, expanding</option>
                                <option>Already incorporated abroad, need compliance</option>
                            </select>
                            <button disabled={busy} className="btn-primary w-full disabled:opacity-70"><FiSend /> {busy ? 'Sending…' : 'Book Free Consult'}</button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Services */}
            <section className="py-20">
                <div className="container-x">
                    <SectionHeading
                        eyebrow="What We Do"
                        title="End-to-end"
                        script="setup services"
                        subtitle="Company formation is just the start. We cover everything you need to actually start billing."
                    />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BUSINESS_SERVICES.map((s, i) => (
                            <motion.div
                                key={s.t}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                                className="card p-6 hover:-translate-y-1 hover:shadow-card transition"
                            >
                                <div className="w-12 h-12 rounded-xl bg-brand-grad text-white flex items-center justify-center text-xl shadow-brand mb-4">
                                    {icons[s.icon]}
                                </div>
                                <h3 className="font-display text-lg font-bold mb-2">{s.t}</h3>
                                <p className="text-sm text-ink-muted leading-relaxed">{s.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Countries */}
            <section className="py-20 bg-ink-line/30">
                <div className="container-x">
                    <SectionHeading
                        eyebrow="Jurisdictions"
                        title="Where we can"
                        script="set you up"
                        subtitle="Each has different tax, banking and visa trade-offs. We'll help you pick the best fit for your model."
                    />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {BUSINESS_COUNTRIES.map((c, i) => (
                            <motion.div
                                key={c.name}
                                initial={{ opacity: 0, scale: 0.96 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                                className="card p-5 hover:shadow-card hover:-translate-y-1 transition"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{c.flag}</span>
                                    <div className="font-display font-bold text-ink">{c.name}</div>
                                </div>
                                <p className="text-sm text-ink-muted leading-relaxed">{c.pitch}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-brand-grad text-white">
                <div className="container-x flex flex-wrap gap-6 items-center justify-between">
                    <div>
                        <h2 className="font-display text-3xl font-bold leading-tight">
                            Not sure which country to pick? <span className="font-script text-accent">Let's chat.</span>
                        </h2>
                        <p className="opacity-90 mt-1">30-minute free consult. No sales pitch — just straight advice.</p>
                    </div>
                    <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn-white btn-lg">
                        <FiBriefcase /> Book Free Consult
                    </a>
                </div>
            </section>
        </>
    );
}
