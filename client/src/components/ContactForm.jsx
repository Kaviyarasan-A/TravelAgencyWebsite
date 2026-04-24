import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';
import { api, openWhatsApp } from '../api.js';

const blank = { name:'', email:'', phone:'', subject:'Holiday Package Enquiry', destination:'', travel_date:'', message:'', website:'' };

export default function ContactForm({ subjectOptions, defaultSubject }) {
    const options = subjectOptions || [
        'Holiday Package Enquiry', 'Custom Trip Planning', 'Flight / Hotel Booking',
        'Group / Corporate Travel', 'Study Abroad', 'Business Setup Abroad', 'Other',
    ];
    const [form, setForm] = useState({ ...blank, subject: defaultSubject || options[0] });
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        const p = api.contact(form);
        await toast.promise(p, {
            loading: 'Sending your enquiry…',
            success: 'Thanks! Your enquiry has been sent — we\'ll reply within 24 hours.',
            error:   'Could not send. Please try again or email us directly.',
        });
        const r = await p;
        setBusy(false);
        if (r.ok) {
            if (r.data?.whatsappUrl) openWhatsApp(r.data.whatsappUrl);
            setForm({ ...blank, subject: form.subject });
        }
    };

    return (
        <form onSubmit={submit} className="card p-6 sm:p-8 space-y-4">
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
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="label">Phone</label>
                    <input type="tel" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                    <label className="label">Request Type *</label>
                    <select className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                        {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="label">Destination / Country</label>
                    <input className="input" placeholder="e.g. Dubai, UK" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
                </div>
                <div>
                    <label className="label">Preferred Date</label>
                    <input type="date" className="input" value={form.travel_date} onChange={(e) => setForm({ ...form, travel_date: e.target.value })} />
                </div>
            </div>
            <div>
                <label className="label">Message *</label>
                <textarea required rows={4} className="input" placeholder="Tell us a bit about what you're after…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full btn-lg disabled:opacity-70">
                <FiSend /> {busy ? 'Sending…' : 'Send Enquiry'}
            </button>
            <p className="text-xs text-ink-muted text-center">By submitting, you agree to our team reaching out by email or phone.</p>
        </form>
    );
}
