import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    FiCheck, FiDownload, FiArrowLeft, FiPhone, FiMessageCircle, FiClock, FiShield,
    FiSmartphone, FiCopy, FiAlertCircle, FiCheckCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '../api.js';
import { BRAND } from '../data.js';

const STATUS_META = {
    pending_confirmation:       { label: 'Quotation ready',             cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    pending_payment:            { label: 'Awaiting UPI payment',        cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    paid_pending_verification:  { label: 'Payment reported — verifying',cls: 'bg-violet-50 text-violet-700 border-violet-200' },
    paid:                       { label: 'Paid & confirmed',            cls: 'bg-green-50 text-green-700 border-green-200' },
    cancelled:                  { label: 'Cancelled',                   cls: 'bg-red-50 text-red-700 border-red-200' },
};

function inr(n) { return '₹' + (Number(n) || 0).toLocaleString('en-IN'); }

export default function Quotation() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [upi, setUpi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [upiLink, setUpiLink] = useState(null);
    const [txnRef, setTxnRef] = useState('');
    const [paying, setPaying] = useState(false);

    const load = async () => {
        setLoading(true);
        const r = await api.getBooking(id);
        setLoading(false);
        if (!r.ok) { setErr(r.error); return; }
        setBooking(r.data.booking);
        setUpi(r.data.upi);
        if (r.data.booking.upiLink) setUpiLink(r.data.booking.upiLink);
    };
    useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

    const confirmBooking = async () => {
        setConfirming(true);
        const r = await api.confirmBooking(id);
        setConfirming(false);
        if (!r.ok) return toast.error('Could not confirm booking. Please try again.');
        setBooking(r.data.booking);
        setUpi(r.data.upi);
        setUpiLink(r.data.upiLink);
        toast.success('Booking confirmed! Complete payment via UPI.');
    };

    const openUpiApp = () => {
        if (!upiLink) return;
        // On mobile this triggers the UPI intent; on desktop it prompts the user to scan the QR.
        window.location.href = upiLink;
    };

    const copyUpi = () => {
        if (!upi?.payeeVpa) return;
        navigator.clipboard?.writeText(upi.payeeVpa).then(() => toast.success('UPI ID copied!'));
    };

    const reportPayment = async () => {
        setPaying(true);
        const r = await api.markBookingPaid(id, txnRef);
        setPaying(false);
        if (!r.ok) return toast.error('Could not record payment. Please try again.');
        setBooking(r.data.booking);
        toast.success('Thanks! Our team will verify and confirm within 2 hours.');
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }
    if (err || !booking) {
        return (
            <div className="container-x py-20 text-center">
                <h1 className="font-display text-3xl font-bold">Quotation not found</h1>
                <p className="text-ink-muted mt-2">The link may be invalid or the booking may have been removed.</p>
                <Link to="/packages" className="btn-primary mt-6">Browse packages</Link>
            </div>
        );
    }

    const status = STATUS_META[booking.status] || STATUS_META.pending_confirmation;
    const q = booking.quotation || {};
    const isPaid = booking.status === 'paid' || booking.status === 'paid_pending_verification';
    const canConfirm = booking.status === 'pending_confirmation';
    const canPay = booking.status === 'pending_payment';
    const qrSrc = upiLink
        ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiLink)}`
        : null;

    return (
        <>
            <Helmet>
                <title>Booking Quotation · {q.packageTitle} | {BRAND.name}</title>
                <meta name="robots" content="noindex,nofollow" />
            </Helmet>

            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white py-14">
                <div className="container-x">
                    <Link to="/packages" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4">
                        <FiArrowLeft /> Back to packages
                    </Link>
                    <div className="flex items-center gap-3 text-xs mb-3">
                        <span className={`px-3 py-1 rounded-full border font-semibold ${status.cls}`}>{status.label}</span>
                        <span className="text-white/60 font-mono">Ref · {booking.id}</span>
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold">Your Trip Quotation</h1>
                    <p className="text-white/80 mt-1">{q.packageTitle} · {q.travelers} traveller{q.travelers > 1 ? 's' : ''} · {booking.travel_date}</p>
                </div>
            </section>

            <section className="py-12">
                <div className="container-x grid lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
                    {/* Quotation breakdown */}
                    <div className="space-y-6">
                        <div className="card p-6">
                            <h2 className="font-display text-xl font-bold text-ink mb-4">Trip details</h2>
                            <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                                <Kv k="Traveller" v={booking.customer.name} />
                                <Kv k="Email" v={booking.customer.email} />
                                <Kv k="Phone" v={booking.customer.phone} />
                                <Kv k="Travelers" v={q.travelers} />
                                <Kv k="Travel date" v={booking.travel_date} />
                                <Kv k="Room class" v={q.room} cap />
                                <Kv k="Season" v={q.season} cap />
                                <Kv k="Package" v={q.packageTitle} />
                            </dl>
                            {booking.notes && (
                                <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                                    <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Special requests</div>
                                    <div className="text-sm text-ink mt-0.5">{booking.notes}</div>
                                </div>
                            )}
                        </div>

                        <div className="card p-6">
                            <h2 className="font-display text-xl font-bold text-ink mb-4">Price breakdown</h2>
                            <div className="divide-y divide-ink-line/60">
                                {q.lineItems?.map((li, i) => (
                                    <div key={i} className="py-3 flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="font-medium text-ink text-sm">{li.label}</div>
                                            {li.qty > 1 && <div className="text-xs text-ink-muted">{li.qty} × {inr(li.unit)}</div>}
                                        </div>
                                        <div className="font-semibold text-ink tabular-nums">{inr(li.amount)}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-2 text-sm pt-4 border-t border-ink-line">
                                <Row k="Subtotal" v={inr(q.subtotal)} />
                                {q.groupDiscount > 0 && <Row k="Group discount (5%)" v={`− ${inr(q.groupDiscount)}`} positive />}
                                <Row k={`GST (${Math.round((q.gstRate || 0.05) * 100)}%)`} v={inr(q.gst)} />
                                <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-ink">
                                    <div className="font-display text-xl font-extrabold text-ink">Total</div>
                                    <div className="font-display text-2xl font-extrabold text-brand-500">{inr(q.total)}</div>
                                </div>
                                <div className="text-[11px] text-ink-muted text-right">
                                    {inr(q.perPerson)} per traveller · all taxes included
                                </div>
                            </div>
                        </div>

                        {/* Inclusions reminder */}
                        <div className="card p-6">
                            <h3 className="font-display text-lg font-bold text-ink mb-3">What's included</h3>
                            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                                <li className="flex gap-2"><FiCheck className="text-green-500 mt-0.5" /> Handpicked {q.room} accommodation</li>
                                <li className="flex gap-2"><FiCheck className="text-green-500 mt-0.5" /> Daily breakfast</li>
                                <li className="flex gap-2"><FiCheck className="text-green-500 mt-0.5" /> All transfers & sightseeing</li>
                                <li className="flex gap-2"><FiCheck className="text-green-500 mt-0.5" /> Local guide support</li>
                                <li className="flex gap-2"><FiCheck className="text-green-500 mt-0.5" /> 24/7 travel support</li>
                                <li className="flex gap-2"><FiCheck className="text-green-500 mt-0.5" /> All taxes & service fees</li>
                            </ul>
                        </div>
                    </div>

                    {/* Action / payment card */}
                    <aside className="lg:sticky lg:top-24 space-y-4">
                        {canConfirm && (
                            <div className="card p-6 border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white">
                                <div className="text-xs uppercase tracking-widest text-brand-600 font-semibold">Ready to lock it in?</div>
                                <div className="font-display text-2xl font-extrabold text-ink mt-1">{inr(q.total)}</div>
                                <p className="text-sm text-ink-muted mt-2">Click confirm to generate your UPI payment link. No money is charged yet.</p>
                                <button onClick={confirmBooking} disabled={confirming}
                                    className="btn-primary w-full btn-lg mt-4 disabled:opacity-60">
                                    <FiCheck /> {confirming ? 'Confirming…' : 'Confirm & Proceed to Pay'}
                                </button>
                                <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-3">
                                    <FiShield className="text-green-500" /> Free cancellation up to 30 days prior
                                </div>
                            </div>
                        )}

                        {canPay && upiLink && (
                            <div className="card p-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                                <div className="text-xs uppercase tracking-widest text-amber-700 font-semibold">Pay via UPI</div>
                                <div className="font-display text-3xl font-extrabold text-ink mt-1">{inr(q.total)}</div>

                                {qrSrc && (
                                    <div className="mt-4 bg-white p-3 rounded-2xl border border-ink-line flex justify-center">
                                        <img src={qrSrc} alt="UPI QR code" className="w-56 h-56" />
                                    </div>
                                )}

                                <div className="mt-4 space-y-3">
                                    <button onClick={openUpiApp} className="btn-primary w-full">
                                        <FiSmartphone /> Open UPI app
                                    </button>

                                    <div className="bg-white rounded-xl border border-ink-line p-3">
                                        <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Or pay to UPI ID</div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="font-mono text-sm text-ink">{upi?.payeeVpa}</span>
                                            <button onClick={copyUpi} className="text-brand-500 hover:text-brand-600 p-1" title="Copy">
                                                <FiCopy />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-xs text-ink-muted leading-relaxed bg-blue-50 border border-blue-100 p-3 rounded-xl">
                                        <div className="font-semibold text-blue-800 mb-1">How to pay</div>
                                        1. Open any UPI app (GPay / PhonePe / Paytm / BHIM)<br />
                                        2. Scan QR or pay to <span className="font-mono">{upi?.payeeVpa}</span><br />
                                        3. Enter amount <b>{inr(q.total)}</b> and add reference <b>{booking.id}</b><br />
                                        4. After payment, paste the UPI transaction ID below
                                    </div>

                                    <div>
                                        <label className="label">UPI Transaction Ref (optional)</label>
                                        <input className="input" placeholder="e.g. 412589632014" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} />
                                    </div>
                                    <button onClick={reportPayment} disabled={paying} className="btn-outline w-full disabled:opacity-60">
                                        <FiCheckCircle /> {paying ? 'Saving…' : "I've paid — notify the team"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {isPaid && (
                            <div className="card p-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white text-center">
                                <div className="w-14 h-14 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center text-2xl">
                                    <FiCheck />
                                </div>
                                <h3 className="font-display text-xl font-bold text-ink mt-3">
                                    {booking.status === 'paid' ? 'Payment confirmed!' : 'Payment reported'}
                                </h3>
                                <p className="text-sm text-ink-muted mt-2">
                                    {booking.status === 'paid'
                                        ? "Your booking is confirmed. We'll be in touch with itinerary details shortly."
                                        : "Thanks — we'll verify your UPI transaction and confirm your booking within 2 hours. You'll receive an email confirmation."}
                                </p>
                                <div className="mt-4 p-3 bg-white rounded-xl border border-green-200 text-xs text-left">
                                    <div className="flex justify-between"><span className="text-ink-muted">Amount</span><span className="font-semibold">{inr(q.total)}</span></div>
                                    <div className="flex justify-between mt-1"><span className="text-ink-muted">Ref</span><span className="font-mono">{booking.id}</span></div>
                                </div>
                            </div>
                        )}

                        <div className="card p-5">
                            <h3 className="font-semibold text-ink text-sm mb-3">Need help?</h3>
                            <a href={`tel:${BRAND.phone.replace(/\s+/g,'')}`} className="flex items-center gap-3 py-2 hover:text-brand-500 text-sm">
                                <FiPhone className="text-brand-500" /> {BRAND.phone}
                            </a>
                            <a href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hi, I need help with my booking ${booking.id}`)}`}
                               target="_blank" rel="noreferrer"
                               className="flex items-center gap-3 py-2 hover:text-brand-500 text-sm">
                                <FiMessageCircle className="text-green-500" /> Chat on WhatsApp
                            </a>
                            <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-3">
                                <FiClock /> Avg. verification time: 2 hours during working hours
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}

function Kv({ k, v, cap }) {
    return (
        <div>
            <dt className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">{k}</dt>
            <dd className={`text-sm text-ink mt-0.5 ${cap ? 'capitalize' : ''}`}>{v || '—'}</dd>
        </div>
    );
}

function Row({ k, v, positive }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-ink-muted">{k}</span>
            <span className={`font-semibold tabular-nums ${positive ? 'text-green-600' : 'text-ink'}`}>{v}</span>
        </div>
    );
}
