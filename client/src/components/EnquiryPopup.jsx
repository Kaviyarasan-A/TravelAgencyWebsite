import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api, openWhatsApp } from '../api.js';

const POPUP_DELAY = 10000; // 10 seconds
const STORAGE_KEY = 'enquiry_popup_dismissed';

const blank = { name: '', email: '', phone: '', destination: '', message: '', website: '' };

export default function EnquiryPopup() {
    const [show, setShow] = useState(false);
    const [form, setForm] = useState(blank);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        // Don't show if already dismissed in this session
        if (sessionStorage.getItem(STORAGE_KEY)) return;

        const timer = setTimeout(() => setShow(true), POPUP_DELAY);
        return () => clearTimeout(timer);
    }, []);

    const close = () => {
        setShow(false);
        sessionStorage.setItem(STORAGE_KEY, '1');
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        const payload = {
            ...form,
            subject: 'Quick Enquiry (Popup)',
        };
        const p = api.contact(payload);
        await toast.promise(p, {
            loading: 'Sending your enquiry…',
            success: 'Enquiry sent! We\'ll get back to you soon.',
            error: 'Could not send. Please try again.',
        });
        const r = await p;
        setBusy(false);
        if (r.ok) {
            if (r.data?.whatsappUrl) openWhatsApp(r.data.whatsappUrl);
            setForm(blank);
            close();
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[300] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm" onClick={close} />

                    <motion.div
                        role="dialog" aria-modal="true"
                        className="relative z-10 bg-white rounded-3xl w-full max-w-md shadow-float overflow-hidden"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="bg-brand-grad px-6 py-5 text-white relative">
                            <button
                                onClick={close}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                                aria-label="Close"
                            >
                                <FiX size={18} />
                            </button>
                            <h3 className="font-display text-xl font-bold">Planning a trip?</h3>
                            <p className="text-white/85 text-sm mt-1">Tell us where you'd like to go and we'll plan it for you!</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="p-6 space-y-3">
                            <input type="text" className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} tabIndex={-1} autoComplete="off" />

                            <input
                                required placeholder="Your name *" className="input"
                                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <input
                                required type="email" placeholder="Email *" className="input"
                                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            <input
                                required type="tel" placeholder="Phone *" className="input"
                                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                            <input
                                placeholder="Where do you want to go?" className="input"
                                value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
                            />
                            <textarea
                                rows={2} placeholder="Any special requests?" className="input"
                                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                            />
                            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-70">
                                <FiSend /> {busy ? 'Sending…' : 'Send Enquiry'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
