import { Helmet } from 'react-helmet-async';
import { FiPhone, FiMail, FiMapPin, FiClock, FiNavigation, FiStar, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube, FaGoogle } from 'react-icons/fa';
import ContactForm from '../components/ContactForm.jsx';
import AuroraBackground from '../components/AuroraBackground.jsx';
import { BRAND } from '../data.js';

export default function Contact() {
    const waMsg = encodeURIComponent("Hi Trip with uz team! I'd like to know more about your services.");
    return (
        <>
            <Helmet>
                <title>Contact Trip with uz Salem — Travel Agency in Tamil Nadu | Call +91 90870 06777</title>
                <meta name="description" content="Reach Trip with uz at Narasothipatti, Salem, Tamil Nadu. Call +91 90870 06777 or WhatsApp us for tour packages in India, Tamil Nadu holidays, study abroad and business setup. Reply within 24 hours." />
                <meta name="keywords" content="contact travel agency Salem, Trip with uz contact number, Salem tours and travels phone, travel agency in Salem Narasothipatti, best travels Salem contact" />
                <meta name="geo.region" content="IN-TN" />
                <meta name="geo.placename" content="Salem, Tamil Nadu" />
                <meta name="geo.position" content={`${BRAND.geo.latitude};${BRAND.geo.longitude}`} />
                <meta name="ICBM" content={`${BRAND.geo.latitude}, ${BRAND.geo.longitude}`} />
                <link rel="canonical" href="https://tripwithuz.com/contact" />
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    name: 'Contact Trip with uz',
                    description: "Travel agency in Salem, Tamil Nadu. Reach us by phone, WhatsApp or visit our office.",
                    url: 'https://tripwithuz.com/contact',
                    mainEntity: { '@id': 'https://tripwithuz.com/#organization' },
                    breadcrumb: {
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://tripwithuz.com/' },
                            { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://tripwithuz.com/contact' },
                        ],
                    },
                })}</script>
            </Helmet>

            {/* Hero */}
            <section className="relative bg-ink text-white pt-28 pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
                <AuroraBackground variant="ocean" intensity={0.8} />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/45 to-ink/95" />
                <div className="container-x relative">
                    <div className="inline-flex items-center gap-3 mb-5">
                        <span className="w-8 h-px bg-brand-500" />
                        <span className="text-brand-500 text-[10px] font-bold uppercase tracking-[3px]">Let's Talk</span>
                    </div>
                    <h1 className="font-display font-bold text-white leading-[0.95] max-w-3xl"
                        style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
                        Plan with a <span className="text-brand-500">human.</span>
                    </h1>
                    <p className="mt-4 text-white/70 max-w-lg text-[15px] leading-relaxed">
                        Tell us a bit about what you're after — custom plan in 24 hours.
                    </p>
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
                            <a href={BRAND.social.facebook}  target="_blank" rel="noopener noreferrer" aria-label="Facebook"  className="w-11 h-11 rounded-xl bg-ink-line/60 flex items-center justify-center hover:bg-brand-500 hover:text-white transition"><FaFacebookF /></a>
                            <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-xl bg-ink-line/60 flex items-center justify-center hover:bg-brand-500 hover:text-white transition"><FaInstagram /></a>
                            <a href={BRAND.social.youtube}   target="_blank" rel="noopener noreferrer" aria-label="YouTube"   className="w-11 h-11 rounded-xl bg-ink-line/60 flex items-center justify-center hover:bg-brand-500 hover:text-white transition"><FaYoutube /></a>
                            <a href={BRAND.gbp.shareUrl}     target="_blank" rel="noopener noreferrer" aria-label="Google Business Profile" className="w-11 h-11 rounded-xl bg-ink-line/60 flex items-center justify-center hover:bg-brand-500 hover:text-white transition"><FaGoogle /></a>
                        </div>
                    </div>

                    <ContactForm />
                </div>
            </section>

            {/* Map + Google Business Profile CTAs */}
            <section className="pb-16">
                <div className="container-x">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-ink">Visit our Salem office</h2>
                            <p className="text-ink-muted text-sm mt-1">Free parking · 2 mins from Amman Bakery · open Mon–Sat 9 AM – 8 PM</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <a
                                href={BRAND.gbp.directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 transition"
                            >
                                <FiNavigation /> Get Directions
                            </a>
                            <a
                                href={BRAND.gbp.reviewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-ink-line text-ink font-semibold text-sm hover:border-brand-500 hover:text-brand-500 transition"
                            >
                                <FiStar className="text-yellow-500 fill-current" /> Leave a Google Review
                            </a>
                            <a
                                href={BRAND.gbp.shareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-ink-line text-ink font-semibold text-sm hover:border-brand-500 hover:text-brand-500 transition"
                            >
                                <FaGoogle className="text-[#4285F4]" /> View on Google <FiExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                    <div className="card overflow-hidden">
                        <iframe
                            title="Trip with uz — Salem, Tamil Nadu (Google Business Profile location)"
                            src={BRAND.gbp.embedUrl}
                            className="w-full h-[420px] border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
