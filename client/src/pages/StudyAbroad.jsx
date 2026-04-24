import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSend, FiCheck, FiAward, FiGlobe, FiUsers, FiBookOpen } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import AuroraBackground from '../components/AuroraBackground.jsx';
import { STUDY_COUNTRIES, STUDY_STEPS } from '../data.js';
import { api, openWhatsApp } from '../api.js';

const blank = { name:'', email:'', phone:'', country:'', level:'Masters (PG)', intake:'Fall 2026', budget:'', notes:'', website:'' };

export default function StudyAbroad() {
    const [form, setForm] = useState(blank);
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        const p = api.study(form);
        await toast.promise(p, {
            loading: 'Sending your enquiry…',
            success: "Thanks! A study counsellor will contact you within 24 hours.",
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
                <title>Study Abroad | Trip with uz</title>
                <meta name="description" content="Study abroad counselling — 1000+ partner universities in UK, USA, Canada, Australia, Germany and more. Free profile evaluation, scholarship guidance, visa support." />
            </Helmet>

            {/* Hero */}
            <section className="relative bg-ink text-white pt-28 pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
                <AuroraBackground variant="forest" intensity={0.7} />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/45 to-ink/95" />
                <div className="container-x relative grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-5">
                            <span className="w-8 h-px bg-brand-500" />
                            <span className="text-brand-500 text-[10px] font-bold uppercase tracking-[3px]">Overseas Education</span>
                        </div>
                        <h1 className="font-display font-bold text-white leading-[0.95]"
                            style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
                            Your university.<br />
                            Your <span className="text-brand-500">dream country.</span>
                        </h1>
                        <p className="mt-5 text-white/70 max-w-xl text-[15px] leading-relaxed">
                            1000+ partner universities in 10 countries. Free profile evaluation, scholarship guidance,
                            SOP + LOR support, visa prep and pre-departure — all in one place.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-5 text-[13px] text-white/75">
                            <span className="inline-flex items-center gap-1.5"><FiCheck className="text-brand-400" /> Free first counselling</span>
                            <span className="inline-flex items-center gap-1.5"><FiCheck className="text-brand-400" /> Scholarship up to 100%</span>
                            <span className="inline-flex items-center gap-1.5"><FiCheck className="text-brand-400" /> 95% visa success rate</span>
                        </div>
                    </div>

                    {/* Enquiry form */}
                    <form onSubmit={submit} className="bg-white text-ink rounded-3xl p-6 shadow-float">
                        <h3 className="font-display text-xl font-bold">Get free counselling</h3>
                        <p className="text-xs text-ink-muted mb-4">We'll call you within 24 hours.</p>
                        <input type="text" className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} tabIndex={-1} autoComplete="off" />
                        <div className="space-y-3">
                            <input required placeholder="Full name *"      className="input" value={form.name}    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <input required type="email" placeholder="Email *" className="input" value={form.email}   onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <input required type="tel" placeholder="Phone *"    className="input" value={form.phone}   onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            <select className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                                <option value="">Preferred country</option>
                                {STUDY_COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-3">
                                <select className="input" value={form.level}  onChange={(e) => setForm({ ...form, level: e.target.value })}>
                                    <option>UG (Bachelor)</option><option>Masters (PG)</option><option>PhD</option><option>Diploma</option>
                                </select>
                                <select className="input" value={form.intake} onChange={(e) => setForm({ ...form, intake: e.target.value })}>
                                    <option>Fall 2026</option><option>Spring 2027</option><option>Fall 2027</option><option>Flexible</option>
                                </select>
                            </div>
                            <button disabled={busy} className="btn-primary w-full disabled:opacity-70"><FiSend /> {busy ? 'Sending…' : 'Request Callback'}</button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Countries */}
            <section className="py-20">
                <div className="container-x">
                    <SectionHeading
                        eyebrow="Where We Place Students"
                        title="Study in the world's"
                        script="top destinations"
                        subtitle="From Ivy League to continental powerhouses — we cover every major English and EU study pathway."
                    />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {STUDY_COUNTRIES.map((c, i) => (
                            <motion.div
                                key={c.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
                                className="card p-5 hover:shadow-card hover:-translate-y-1 transition"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">{c.flag}</span>
                                    <div>
                                        <div className="font-display font-bold text-ink">{c.name}</div>
                                        <div className="text-xs text-ink-muted">{c.universities}+ partner universities</div>
                                    </div>
                                </div>
                                <p className="text-sm text-ink-muted leading-relaxed">{c.pitch}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-20 bg-ink-line/30">
                <div className="container-x">
                    <SectionHeading
                        eyebrow="How We Work"
                        title="A 6-step roadmap from"
                        script="profile to plane."
                        subtitle="We pick up at your profile and walk with you all the way to orientation week."
                    />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {STUDY_STEPS.map((s, i) => (
                            <motion.div
                                key={s.n}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                                className="card p-6 hover:shadow-card hover:-translate-y-1 transition relative"
                            >
                                <span className="absolute -top-4 -left-2 font-display text-6xl font-extrabold text-brand-100 select-none">{s.n}</span>
                                <div className="relative">
                                    <h3 className="font-display text-lg font-bold mb-2">{s.t}</h3>
                                    <p className="text-sm text-ink-muted leading-relaxed">{s.d}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why us */}
            <section className="py-20">
                <div className="container-x">
                    <SectionHeading
                        eyebrow="Why Students Choose Us"
                        title="More than an agent —"
                        script="a mentor."
                    />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { i: <FiAward />,   t: '1000+ Partner Universities', d: 'Direct MoUs with public + private universities globally.' },
                            { i: <FiUsers />,   t: 'IELTS / TOEFL Prep',          d: 'On-site coaching + mock interviews with visa officers.' },
                            { i: <FiBookOpen/>, t: 'Expert SOP & LOR team',        d: 'Writers who have placed students in Harvard, Oxford, INSEAD.' },
                            { i: <FiGlobe />,   t: '95% Visa Success Rate',        d: 'Meticulous documentation, no templates, honest counselling.' },
                        ].map((x) => (
                            <div key={x.t} className="card p-6 text-center hover:-translate-y-1 hover:shadow-card transition">
                                <div className="w-14 h-14 rounded-xl bg-brand-grad text-white flex items-center justify-center text-2xl mx-auto mb-4 shadow-brand">{x.i}</div>
                                <h3 className="font-display text-lg font-bold mb-1.5">{x.t}</h3>
                                <p className="text-sm text-ink-muted">{x.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
