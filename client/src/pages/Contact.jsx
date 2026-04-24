import { Helmet } from 'react-helmet-async';
import { FiPhone, FiMail, FiMapPin, FiClock, FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import ContactForm from '../components/ContactForm.jsx';
import { BRAND } from '../data.js';

export default function Contact() {
    const waMsg = encodeURIComponent("Hi Trip with uz team! I'd like to know more about your services.");
    return (
        <>
            <Helmet>
                <title>Contact | Trip with uz</title>
                <meta name="description" content="Get in touch with Trip with uz for holiday packages, study abroad and business setup enquiries. We reply within 24 hours." />
            </Helmet>

            {/* Hero */}
            <section className="relative py-20 text-white overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg, rgba(11,15,26,0.7), rgba(11,15,26,0.92)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=2000&q=80')" }} />
                <div className="container-x relative text-center max-w-2xl mx-auto">
                    <span className="eyebrow !text-brand-400">Let's Talk</span>
                    <h1 className="font-display text-4xl sm:text-5xl font-extrabold">Plan with a <span className="font-script text-accent">human.</span></h1>
                    <p className="mt-4 text-white/80">Tell us a bit about what you're after and we'll send a custom plan within 24 hours.</p>
                </div>
            </section>

            {/* Contact grid */}
            <section className="py-16">
                <div className="container-x grid lg:grid-cols-[1fr_1.3fr] gap-10 items-start">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">We're here for you</h2>
                        <p className="text-ink-muted leading-relaxed mb-8">Pick whichever channel works for you — we answer every one within 24 hours on business days (often faster).</p>

                        <ul className="space-y-4">
                            <li className="flex gap-4 p-4 rounded-2xl hover:bg-ink-line/40 transition">
                                <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center text-xl shrink-0"><FiPhone /></span>
                                <div>
                                    <div className="font-semibold text-ink">Call</div>
                                    <a href={`tel:${BRAND.phone.replace(/\s+/g,'')}`} className="text-ink-muted hover:text-brand-500">{BRAND.phone}</a>
                                </div>
                            </li>
                            <li className="flex gap-4 p-4 rounded-2xl hover:bg-ink-line/40 transition">
                                <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center text-xl shrink-0"><FiMail /></span>
                                <div>
                                    <div className="font-semibold text-ink">Email</div>
                                    <a href={`mailto:${BRAND.email}`} className="text-ink-muted hover:text-brand-500">{BRAND.email}</a>
                                </div>
                            </li>
                            <li className="flex gap-4 p-4 rounded-2xl hover:bg-ink-line/40 transition">
                                <span className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-xl shrink-0"><FaWhatsapp /></span>
                                <div>
                                    <div className="font-semibold text-ink">WhatsApp</div>
                                    <a href={`https://wa.me/${BRAND.whatsapp}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-brand-500">Chat with us · replies in minutes</a>
                                </div>
                            </li>
                            <li className="flex gap-4 p-4 rounded-2xl hover:bg-ink-line/40 transition">
                                <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center text-xl shrink-0"><FiMapPin /></span>
                                <div>
                                    <div className="font-semibold text-ink">Office</div>
                                    <div className="text-ink-muted">{BRAND.address}</div>
                                </div>
                            </li>
                            <li className="flex gap-4 p-4 rounded-2xl hover:bg-ink-line/40 transition">
                                <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center text-xl shrink-0"><FiClock /></span>
                                <div>
                                    <div className="font-semibold text-ink">Hours</div>
                                    <div className="text-ink-muted">{BRAND.hours}</div>
                                </div>
                            </li>
                        </ul>

                        <div className="mt-8 flex gap-3">
                            <a href={BRAND.social.facebook}  aria-label="Facebook"  className="w-11 h-11 rounded-xl bg-ink-line/60 flex items-center justify-center hover:bg-brand-500 hover:text-white transition"><FaFacebookF /></a>
                            <a href={BRAND.social.instagram} aria-label="Instagram" className="w-11 h-11 rounded-xl bg-ink-line/60 flex items-center justify-center hover:bg-brand-500 hover:text-white transition"><FaInstagram /></a>
                            <a href={BRAND.social.linkedin}  aria-label="LinkedIn"  className="w-11 h-11 rounded-xl bg-ink-line/60 flex items-center justify-center hover:bg-brand-500 hover:text-white transition"><FaLinkedinIn /></a>
                        </div>
                    </div>

                    <ContactForm />
                </div>
            </section>

            {/* Map */}
            <section className="pb-16">
                <div className="container-x">
                    <div className="card overflow-hidden">
                        <iframe
                            title="Our location"
                            src="https://www.google.com/maps?q=Narasothipatti,%20Salem,%20Tamil%20Nadu,%20636004&output=embed"
                            className="w-full h-[380px] border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
