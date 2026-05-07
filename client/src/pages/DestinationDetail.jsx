import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    FiMapPin, FiClock, FiStar, FiCheck, FiArrowLeft, FiArrowRight, FiCalendar,
    FiUsers, FiSend, FiMessageCircle, FiPhone, FiMail,
} from 'react-icons/fi';
import { api, openWhatsApp } from '../api.js';
import { BRAND } from '../data.js';

const blank = { name: '', email: '', phone: '', travel_date: '', travelers: '2 Adults', message: '', website: '' };

export default function DestinationDetail() {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [form, setForm] = useState(blank);
    const [busy, setBusy] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const today = new Date().toISOString().split('T')[0];
    const formRef = useRef(null);

    // Used by per-place "Enquire" buttons — scrolls to the form and pre-fills
    // the message with which place the visitor is interested in.
    const focusEnquiry = (place) => {
        if (place?.name) {
            setForm((f) => ({
                ...f,
                message: f.message ? f.message : `I'm specifically interested in ${place.name}.`,
            }));
        }
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    useEffect(() => {
        let alive = true;
        setLoading(true);
        api.getDestination(slug).then((r) => {
            if (!alive) return;
            setLoading(false);
            if (r.ok) { setData(r.data); setActiveImage(0); }
            else setErr(r.error);
        });
        return () => { alive = false; };
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }
    if (err || !data?.destination) {
        return (
            <div className="container-x py-32 text-center">
                <h1 className="font-display text-3xl font-bold">Destination not found</h1>
                <Link to="/" className="btn-primary mt-6">Back to home</Link>
            </div>
        );
    }

    const d = data.destination;
    const related = data.related || [];
    const allImages = [d.image, ...(d.gallery || [])].filter(Boolean);
    const heroImg = allImages[activeImage] || d.image;

    const submit = async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        const p = api.destinationEnquire({ ...form, destinationSlug: d.slug });
        await toast.promise(p, {
            loading: 'Sending your enquiry…',
            success: 'Thanks! Our team will contact you within 24 hours.',
            error: 'Could not send. Please try again.',
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
                <title>{`${d.title} | ${BRAND.name}`}</title>
                <meta name="description" content={`${d.title} (${d.country}) — ${d.days}D/${d.nights}N. ${(d.highlights || []).slice(0, 2).join('. ')}`} />
                <meta property="og:title" content={`${d.title} — ${d.country}`} />
                <meta property="og:image" content={d.image} />
                <meta property="og:type" content="article" />
            </Helmet>

            {/* Hero */}
            <section className="relative h-[58vh] min-h-[420px] overflow-hidden bg-ink">
                <motion.div
                    key={heroImg}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1.08 }}
                    transition={{ opacity: { duration: 0.8 }, scale: { duration: 14, ease: 'linear' } }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

                <div className="container-x relative h-full flex flex-col justify-end pb-12 text-white">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white mb-5">
                        <FiArrowLeft /> Back to home
                    </Link>
                    <div className="inline-flex items-center gap-3 mb-3">
                        <span className="w-9 h-px bg-brand-500" />
                        <span className="text-brand-400 text-[10.5px] font-display font-bold uppercase tracking-[3px]">
                            {d.kind === 'top' ? 'Top Destination' : 'Popular Holiday'} · {d.country}
                        </span>
                    </div>
                    <h1 className="font-display font-extrabold text-balance leading-[0.95]"
                        style={{ fontSize: 'clamp(34px, 5.5vw, 64px)', letterSpacing: '-0.035em' }}>
                        {d.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-5 text-[13px] text-white/85">
                        <span className="inline-flex items-center gap-1.5"><FiMapPin className="text-brand-400" /> {d.location}</span>
                        <span className="inline-flex items-center gap-1.5"><FiClock className="text-brand-400" /> {d.days}D / {d.nights}N</span>
                        {d.rating && <span className="inline-flex items-center gap-1.5"><FiStar className="text-amber-400 fill-current" /> {d.rating} · {d.reviews || 0} reviews</span>}
                        {d.bestTime && <span className="inline-flex items-center gap-1.5"><FiCalendar className="text-brand-400" /> Best: {d.bestTime}</span>}
                    </div>
                </div>
            </section>

            {/* Tourist places — the headline section, full-width grid */}
            {Array.isArray(d.places) && d.places.length > 0 && (
                <section className="py-14 lg:py-16 bg-white">
                    <div className="container-x">
                        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
                            <div>
                                <div className="inline-flex items-center gap-3 mb-3">
                                    <span className="block w-9 h-[2px] bg-brand-500 rounded-full" />
                                    <span className="text-brand-500 text-[10.5px] font-display font-bold uppercase tracking-[3px]">Things to see &amp; do</span>
                                </div>
                                <h2 className="font-display font-bold text-ink"
                                    style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                                    Tourist places in <span className="text-brand-500">{d.title}</span>
                                </h2>
                                <p className="text-ink-muted text-[14.5px] mt-2 max-w-2xl">
                                    {d.places.length} hand-picked attractions our travellers love. Tap "Enquire" on any to ask about including it in your trip.
                                </p>
                            </div>
                            <button onClick={() => focusEnquiry()}
                                className="hidden md:inline-flex items-center gap-2 h-11 px-5 rounded-full bg-ink hover:bg-ink-soft text-white font-display font-semibold text-[13px] transition shrink-0">
                                Enquire about all <FiArrowRight size={14} />
                            </button>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                            {d.places.map((p) => (
                                <article key={p.slug || p.name}
                                    className="group flex flex-col rounded-2xl overflow-hidden border border-ink-line/70 bg-white shadow-soft hover:shadow-card hover:border-brand-300 hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative h-48 overflow-hidden bg-slate-200">
                                        {p.image
                                            ? <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${p.image})` }} />
                                            : <div className="absolute inset-0 flex items-center justify-center text-slate-400"><FiMapPin size={28} /></div>}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                                        {p.category && (
                                            <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-brand-600 text-[10px] font-display font-bold uppercase tracking-[1.5px] shadow ring-1 ring-black/5">
                                                {p.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-display font-bold text-ink text-[17px] leading-tight" style={{ letterSpacing: '-0.015em' }}>
                                            {p.name}
                                        </h3>
                                        {p.desc && <p className="text-[13px] text-ink-muted mt-2 leading-relaxed line-clamp-3 flex-1">{p.desc}</p>}
                                        <button onClick={() => focusEnquiry(p)}
                                            className="mt-4 inline-flex items-center justify-between gap-2 w-full px-4 h-10 rounded-full border border-ink-line/80 text-ink hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50/50 font-display font-semibold text-[12.5px] transition">
                                            Enquire about this place
                                            <FiArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Body — supporting sections (intro, highlights, gallery) + sidebar */}
            <section className="py-14 bg-slate-50/40">
                <div className="container-x grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
                    <div className="space-y-10">
                        {/* Intro */}
                        {d.intro && (
                            <div>
                                <h2 className="font-display text-2xl font-bold text-ink mb-3" style={{ letterSpacing: '-0.02em' }}>
                                    About {d.title}
                                </h2>
                                <p className="text-ink leading-[1.85] text-[16px]">{d.intro}</p>
                            </div>
                        )}

                        {/* Highlights */}
                        {d.highlights?.length > 0 && (
                            <div>
                                <h2 className="font-display text-2xl font-bold text-ink mb-4" style={{ letterSpacing: '-0.02em' }}>
                                    Trip highlights
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-2.5">
                                    {d.highlights.map((h) => (
                                        <div key={h} className="flex items-start gap-3 card p-4">
                                            <span className="w-7 h-7 rounded-full bg-brand-grad text-white flex items-center justify-center shrink-0 shadow-brand">
                                                <FiCheck size={14} />
                                            </span>
                                            <span className="text-[14px] leading-snug">{h}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery */}
                        {allImages.length > 1 && (
                            <div>
                                <h2 className="font-display text-2xl font-bold text-ink mb-4" style={{ letterSpacing: '-0.02em' }}>
                                    Gallery
                                </h2>
                                <div className="grid grid-cols-4 gap-2.5">
                                    {allImages.map((img, i) => (
                                        <button
                                            key={i} onClick={() => setActiveImage(i)}
                                            className={`relative aspect-[4/3] rounded-xl overflow-hidden ring-2 transition
                                                ${activeImage === i ? 'ring-brand-500 shadow-brand' : 'ring-transparent hover:ring-brand-300'}`}>
                                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {d.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {d.tags.map((t) => (
                                    <span key={t} className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[12px] font-display font-semibold">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Enquiry sidebar — no price displayed; just a clean enquiry form */}
                    <aside ref={formRef} className="lg:sticky lg:top-28 space-y-5 scroll-mt-24">
                        <div className="card p-6 lg:p-7 ring-1 ring-brand-200/60 shadow-card">
                            <div className="text-[10.5px] uppercase tracking-[2.5px] font-display font-bold text-brand-500">Tailor-made trip</div>
                            <h2 className="font-display text-2xl font-extrabold text-ink mt-1 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                                Plan your {d.title} trip
                            </h2>
                            <p className="text-[12.5px] text-ink-muted mt-1.5">Tell us your dates &amp; group size — we'll send a tailored plan with hotels, transfers and a final price.</p>
                            <div className="my-5 h-px bg-ink-line/70" />

                            <h3 className="font-display text-lg font-bold text-ink mb-1" style={{ letterSpacing: '-0.015em' }}>
                                Enquire about this trip
                            </h3>
                            <p className="text-[12.5px] text-ink-muted mb-4">A planner will reply with hotel options, day-wise itinerary &amp; final price within 24 hours.</p>

                            <form onSubmit={submit} className="space-y-2.5">
                                <input type="text" tabIndex={-1} autoComplete="off"
                                    value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                                    className="hidden" />
                                <input required placeholder="Full name *"
                                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="input text-sm" />
                                <input required type="email" placeholder="Email *"
                                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="input text-sm" />
                                <input required type="tel" placeholder="Phone *"
                                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="input text-sm" />
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" size={14} />
                                        <input type="date" min={today}
                                            value={form.travel_date} onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
                                            className="input text-sm pl-9" />
                                    </div>
                                    <div className="relative">
                                        <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" size={14} />
                                        <select value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                                            className="input text-sm pl-9">
                                            <option>1 Adult</option>
                                            <option>2 Adults</option>
                                            <option>2 Adults, 1 Child</option>
                                            <option>2 Adults, 2 Children</option>
                                            <option>Family 4+</option>
                                            <option>Group 6+</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea rows={3} placeholder="Anything specific? (preferences, hotel category, dates flexible…)"
                                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="input text-sm resize-none" />
                                <button disabled={busy} className="btn-primary w-full disabled:opacity-70">
                                    <FiSend /> {busy ? 'Sending…' : 'Send enquiry'}
                                </button>
                            </form>
                        </div>

                        {/* Quick contact */}
                        <div className="card p-5">
                            <h4 className="text-[11px] uppercase tracking-[2.5px] font-display font-bold text-ink-muted mb-3">Talk to a planner</h4>
                            <a href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                                className="flex items-center gap-3 py-2 hover:text-brand-500 text-[13.5px] transition">
                                <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center"><FiPhone size={14} /></span>
                                {BRAND.phone}
                            </a>
                            <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer"
                                className="flex items-center gap-3 py-2 hover:text-brand-500 text-[13.5px] transition">
                                <span className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><FiMessageCircle size={14} /></span>
                                Chat on WhatsApp
                            </a>
                            <a href={`mailto:${BRAND.email}`}
                                className="flex items-center gap-3 py-2 hover:text-brand-500 text-[13.5px] transition">
                                <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center"><FiMail size={14} /></span>
                                {BRAND.email}
                            </a>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Related */}
            {related.length > 0 && (
                <section className="py-14 bg-slate-50/60">
                    <div className="container-x">
                        <h2 className="font-display text-2xl font-bold text-ink mb-6" style={{ letterSpacing: '-0.02em' }}>
                            You might also like
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {related.map((r) => (
                                <Link key={r.slug} to={`/destinations/${r.slug}`}
                                    className="group card overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all">
                                    <div className="h-44 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${r.image})` }} />
                                    <div className="p-4">
                                        <div className="text-[10px] text-ink-muted uppercase tracking-wider font-bold">{r.country}</div>
                                        <h3 className="font-display font-bold text-ink text-[16px] leading-tight mt-1" style={{ letterSpacing: '-0.015em' }}>
                                            {r.title}
                                        </h3>
                                        <div className="text-brand-500 font-display font-semibold text-[12px] mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Explore <FiArrowRight size={11} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
