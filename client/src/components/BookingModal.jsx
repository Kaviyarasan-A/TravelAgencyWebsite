import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiArrowRight, FiUsers, FiCalendar, FiHome, FiSun, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '../api.js';

const ROOM_OPTS = [
    { key: 'standard', label: 'Standard Twin/Double', sub: 'Comfortable base room', mult: 1.00 },
    { key: 'deluxe',   label: 'Deluxe Room',          sub: '+18% · more space, view',  mult: 1.18 },
    { key: 'suite',    label: 'Suite / Pool Villa',   sub: '+45% · luxury pick',       mult: 1.45 },
];
const SEASON_OPTS = [
    { key: 'regular', label: 'Regular',     sub: 'Base price',       mult: 1.00 },
    { key: 'peak',    label: 'Peak Season', sub: '+20% · Dec–Jan',   mult: 1.20 },
    { key: 'monsoon', label: 'Off-Season',  sub: '−15% · Jun–Aug',   mult: 0.85 },
];
const ADDON_OPTS = [
    { key: 'flights',     label: 'Return flights',               price: 12500, per: 'person' },
    { key: 'insurance',   label: 'Travel insurance',             price:   850, per: 'person' },
    { key: 'visa',        label: 'Visa assistance',              price:  3500, per: 'person' },
    { key: 'photography', label: 'Trip photographer',            price:  9500, per: 'trip'   },
    { key: 'guide',       label: 'Private English guide upgrade',price:  6000, per: 'trip'   },
];

const GST_RATE = 0.05;
const blank = {
    name: '', email: '', phone: '',
    travelers: 2,
    travel_date: '',
    room: 'standard',
    season: 'regular',
    addons: [],
    notes: '',
    website: '',
};

export default function BookingModal({ open, onClose, pkg }) {
    const [form, setForm] = useState(blank);
    const [step, setStep] = useState(1); // 1 = options, 2 = contact
    const [busy, setBusy] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const nav = useNavigate();

    useEffect(() => {
        if (open) { setForm(blank); setStep(1); }
    }, [open, pkg]);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        if (open) {
            document.addEventListener('keydown', onKey);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    const basePrice = Number(pkg?.basePrice) || 0;
    const hasPrice = basePrice > 0;
    const room = ROOM_OPTS.find((r) => r.key === form.room) || ROOM_OPTS[0];
    const season = SEASON_OPTS.find((s) => s.key === form.season) || SEASON_OPTS[0];

    const preview = useMemo(() => {
        if (!hasPrice) {
            return { perPerson: 0, packageLine: 0, addonLines: [], subtotal: 0, groupDiscount: 0, gst: 0, total: 0 };
        }
        const perPerson = Math.round(basePrice * room.mult * season.mult);
        const packageLine = perPerson * form.travelers;
        const addonLines = form.addons.map((k) => {
            const a = ADDON_OPTS.find((x) => x.key === k);
            const qty = a.per === 'person' ? form.travelers : 1;
            return { label: a.label, amount: a.price * qty };
        });
        const subtotal = packageLine + addonLines.reduce((s, l) => s + l.amount, 0);
        const groupDiscount = form.travelers >= 4 ? Math.round(subtotal * 0.05) : 0;
        const taxable = subtotal - groupDiscount;
        const gst = Math.round(taxable * GST_RATE);
        const total = taxable + gst;
        return { perPerson, packageLine, addonLines, subtotal, groupDiscount, gst, total };
    }, [hasPrice, basePrice, room.mult, season.mult, form.travelers, form.addons]);

    const toggleAddon = (key) => {
        setForm((f) => ({
            ...f,
            addons: f.addons.includes(key) ? f.addons.filter((x) => x !== key) : [...f.addons, key],
        }));
    };

    const goStep2 = () => {
        if (!form.travel_date) { toast.error('Pick a travel date to continue'); return; }
        setStep(2);
    };

    const submit = async (e) => {
        e.preventDefault();
        if (form.website) return; // honeypot
        setBusy(true);
        const r = await api.createQuotation({
            packageSlug: pkg?.slug,
            travelers: Number(form.travelers),
            room: form.room,
            season: form.season,
            addons: form.addons,
            name: form.name,
            email: form.email,
            phone: form.phone,
            travel_date: form.travel_date,
            notes: form.notes,
        });
        setBusy(false);
        if (!r.ok) {
            toast.error(r.error || 'Could not generate quotation');
            return;
        }
        toast.success('Quotation ready!');
        onClose?.();
        nav(`/quotation/${r.data.booking.id}`);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-start justify-center p-4 sm:p-6 overflow-y-auto"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />

                    <motion.div
                        role="dialog" aria-modal="true"
                        className="relative z-10 bg-white rounded-3xl w-full max-w-3xl my-6 shadow-float overflow-hidden"
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                    >
                        <button onClick={onClose} aria-label="Close"
                            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-ink-line z-10">
                            <FiX size={22} />
                        </button>

                        <div className="bg-brand-grad text-white px-6 sm:px-8 py-6">
                            <div className="text-xs uppercase tracking-widest opacity-80">{step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}</div>
                            <h3 className="text-2xl font-display font-bold mt-1">
                                {pkg ? `Book: ${pkg.title}` : 'Book Your Trip'}
                            </h3>
                            <p className="text-sm opacity-90 mt-0.5">
                                {step === 1 ? 'Tell us what you want — get an instant quotation' : 'Your details to generate the final quotation'}
                            </p>
                        </div>

                        <div className="p-6 sm:p-8">
                            {step === 1 ? (
                                <div className="space-y-6">
                                    {/* Travelers + date */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label"><FiUsers className="inline mr-1" /> Travelers</label>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => setForm({ ...form, travelers: Math.max(1, form.travelers - 1) })}
                                                    className="w-10 h-10 rounded-xl border border-ink-line hover:border-brand-500 hover:text-brand-500 font-bold">−</button>
                                                <input type="number" min="1" className="input text-center"
                                                    value={form.travelers} onChange={(e) => setForm({ ...form, travelers: Math.max(1, Number(e.target.value) || 1) })} />
                                                <button type="button" onClick={() => setForm({ ...form, travelers: form.travelers + 1 })}
                                                    className="w-10 h-10 rounded-xl border border-ink-line hover:border-brand-500 hover:text-brand-500 font-bold">+</button>
                                            </div>
                                            {form.travelers >= 4 && <p className="text-[11px] text-green-600 mt-1 font-medium">✓ 5% group discount applied</p>}
                                        </div>
                                        <div>
                                            <label className="label"><FiCalendar className="inline mr-1" /> Travel date *</label>
                                            <input required type="date" min={today} className="input"
                                                value={form.travel_date} onChange={(e) => setForm({ ...form, travel_date: e.target.value })} />
                                        </div>
                                    </div>

                                    {/* Room class */}
                                    <div>
                                        <label className="label"><FiHome className="inline mr-1" /> Room class</label>
                                        <div className="grid sm:grid-cols-3 gap-2">
                                            {ROOM_OPTS.map((r) => (
                                                <button type="button" key={r.key} onClick={() => setForm({ ...form, room: r.key })}
                                                    className={`text-left px-3 py-3 rounded-xl border-2 transition ${form.room === r.key ? 'border-brand-500 bg-brand-50' : 'border-ink-line hover:border-brand-300'}`}>
                                                    <div className="font-semibold text-sm text-ink">{r.label}</div>
                                                    <div className="text-[11px] text-ink-muted mt-0.5">{r.sub}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Season */}
                                    <div>
                                        <label className="label"><FiSun className="inline mr-1" /> Season</label>
                                        <div className="grid sm:grid-cols-3 gap-2">
                                            {SEASON_OPTS.map((s) => (
                                                <button type="button" key={s.key} onClick={() => setForm({ ...form, season: s.key })}
                                                    className={`text-left px-3 py-3 rounded-xl border-2 transition ${form.season === s.key ? 'border-brand-500 bg-brand-50' : 'border-ink-line hover:border-brand-300'}`}>
                                                    <div className="font-semibold text-sm text-ink">{s.label}</div>
                                                    <div className="text-[11px] text-ink-muted mt-0.5">{s.sub}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Add-ons */}
                                    <div>
                                        <label className="label"><FiPlus className="inline mr-1" /> Add-ons (optional)</label>
                                        <div className="grid sm:grid-cols-2 gap-2">
                                            {ADDON_OPTS.map((a) => {
                                                const checked = form.addons.includes(a.key);
                                                return (
                                                    <label key={a.key}
                                                        className={`flex items-start gap-3 px-3 py-3 rounded-xl border-2 cursor-pointer transition ${checked ? 'border-brand-500 bg-brand-50' : 'border-ink-line hover:border-brand-300'}`}>
                                                        <input type="checkbox" checked={checked} onChange={() => toggleAddon(a.key)} className="mt-1 accent-brand-500" />
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-sm text-ink">{a.label}</div>
                                                            <div className="text-[11px] text-ink-muted">₹{a.price.toLocaleString('en-IN')} {a.per === 'person' ? '× person' : 'per trip'}</div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Live preview */}
                                    <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-amber-50 p-5 border border-brand-200">
                                        <div className="flex items-end justify-between gap-4 flex-wrap">
                                            <div>
                                                <div className="text-xs uppercase tracking-widest text-brand-600 font-semibold">
                                                    {hasPrice ? 'Live estimate' : 'Custom quote'}
                                                </div>
                                                {hasPrice ? (
                                                    <>
                                                        <div className="font-display text-3xl font-extrabold text-ink mt-1">
                                                            ₹{preview.total.toLocaleString('en-IN')}
                                                        </div>
                                                        <div className="text-xs text-ink-muted">for {form.travelers} traveller{form.travelers > 1 ? 's' : ''} · incl. 5% GST</div>
                                                    </>
                                                ) : (
                                                    <div className="text-sm text-ink-muted mt-1 max-w-xs">
                                                        Continue to the next step — we'll prepare a tailored quotation based on your details.
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={goStep2} className="btn-primary">
                                                Generate quotation <FiArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-4">
                                    <input type="text" className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} tabIndex={-1} autoComplete="off" />

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Full Name *</label>
                                            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="label">Email *</label>
                                            <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label">Phone / WhatsApp *</label>
                                        <input required type="tel" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 …" />
                                    </div>
                                    <div>
                                        <label className="label">Any special requests?</label>
                                        <textarea rows={3} className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Dietary, accessibility, preferences…" />
                                    </div>

                                    <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
                                        <div>
                                            <div className="text-xs text-ink-muted uppercase tracking-wider">Your quotation</div>
                                            <div className="font-display text-2xl font-extrabold text-ink">
                                                {hasPrice ? `₹${preview.total.toLocaleString('en-IN')}` : 'On request'}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => setStep(1)} className="btn-outline btn-sm">Back</button>
                                            <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
                                                {busy ? 'Generating…' : 'Get quotation'} <FiArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-ink-muted">
                                        No payment yet — you'll see the full priced quotation next.
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
