import { Helmet } from 'react-helmet-async';
import { BRAND } from '../data.js';

export default function Privacy() {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | Trip with uz</title>
                <meta name="description" content="Privacy policy for Trip with uz — how we collect, use and protect your personal data." />
            </Helmet>

            <section className="py-20 bg-ink text-white">
                <div className="container-x text-center">
                    <span className="eyebrow !text-brand-400">Legal</span>
                    <h1 className="font-display text-4xl sm:text-5xl font-extrabold">Privacy Policy</h1>
                    <p className="text-white/70 mt-3">Last updated: April 2026</p>
                </div>
            </section>

            <section className="py-16">
                <div className="container-x max-w-3xl mx-auto">
                    <div className="space-y-8">
                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">1. Information We Collect</h2>
                            <p className="text-ink-muted leading-relaxed mb-3">We collect information you voluntarily provide through our forms:</p>
                            <ul className="list-disc list-inside text-ink-muted space-y-1 text-sm">
                                <li>Name, email address, and phone number</li>
                                <li>Travel preferences and destination interests</li>
                                <li>Academic details (for study abroad enquiries)</li>
                                <li>Business information (for business setup enquiries)</li>
                            </ul>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">2. How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-ink-muted space-y-1 text-sm">
                                <li>To respond to your enquiries and provide requested services</li>
                                <li>To send booking confirmations and travel updates</li>
                                <li>To improve our website and services</li>
                                <li>To send newsletters (only if you've subscribed — you can unsubscribe anytime)</li>
                            </ul>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">3. Data Sharing</h2>
                            <p className="text-ink-muted leading-relaxed">We do not sell your personal data to third parties. Your information may be shared with service providers (hotels, transport, universities, etc.) only as necessary to fulfill your booking or enquiry.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">4. Data Security</h2>
                            <p className="text-ink-muted leading-relaxed">We implement industry-standard security measures to protect your personal information. All form submissions are transmitted over encrypted connections (HTTPS). However, no method of electronic transmission is 100% secure.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">5. Cookies</h2>
                            <p className="text-ink-muted leading-relaxed">Our website may use cookies to enhance your browsing experience. You can control cookies through your browser settings. Disabling cookies may affect some website functionality.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">6. Your Rights</h2>
                            <p className="text-ink-muted leading-relaxed">You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href={`mailto:${BRAND.email}`} className="text-brand-500 font-semibold">{BRAND.email}</a>.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">7. Changes to This Policy</h2>
                            <p className="text-ink-muted leading-relaxed">We may update this privacy policy periodically. Changes will be posted on this page with an updated revision date.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">8. Contact Us</h2>
                            <p className="text-ink-muted leading-relaxed">
                                For privacy-related queries, reach us at:<br />
                                Email: <a href={`mailto:${BRAND.email}`} className="text-brand-500 font-semibold">{BRAND.email}</a><br />
                                Phone: <a href={`tel:${BRAND.phone.replace(/\s+/g,'')}`} className="text-brand-500 font-semibold">{BRAND.phone}</a><br />
                                Address: {BRAND.address}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
