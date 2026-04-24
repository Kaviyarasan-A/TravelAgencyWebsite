import { Helmet } from 'react-helmet-async';
import { BRAND } from '../data.js';

export default function Terms() {
    return (
        <>
            <Helmet>
                <title>Terms of Service | Trip with uz</title>
                <meta name="description" content="Terms and conditions for using Trip with uz services including holiday packages, study abroad and business setup." />
            </Helmet>

            <section className="py-20 bg-ink text-white">
                <div className="container-x text-center">
                    <span className="eyebrow !text-brand-400">Legal</span>
                    <h1 className="font-display text-4xl sm:text-5xl font-extrabold">Terms of Service</h1>
                    <p className="text-white/70 mt-3">Last updated: April 2026</p>
                </div>
            </section>

            <section className="py-16">
                <div className="container-x max-w-3xl mx-auto prose-custom">
                    <div className="space-y-8">
                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">1. Acceptance of Terms</h2>
                            <p className="text-ink-muted leading-relaxed">By accessing and using the {BRAND.name} website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">2. Services Offered</h2>
                            <p className="text-ink-muted leading-relaxed">{BRAND.name} provides travel booking assistance, study abroad counselling, and international business setup consultation. All services are subject to availability and confirmation.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">3. Booking & Payments</h2>
                            <p className="text-ink-muted leading-relaxed">All bookings are subject to availability. Prices quoted are indicative and may vary based on season, availability and specific requirements. Final pricing will be confirmed before payment. Payments must be made as per the agreed schedule.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">4. Cancellation & Refunds</h2>
                            <p className="text-ink-muted leading-relaxed">Cancellation policies vary by service and supplier. Most travel packages offer free cancellation up to 30 days before departure. Specific cancellation terms will be communicated at the time of booking. Refunds, where applicable, will be processed within 7-14 business days.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">5. User Responsibilities</h2>
                            <p className="text-ink-muted leading-relaxed">Users must provide accurate personal information. You are responsible for obtaining valid travel documents including passports, visas, and health certificates. {BRAND.name} assists with documentation but is not liable for visa rejections or document issues.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">6. Limitation of Liability</h2>
                            <p className="text-ink-muted leading-relaxed">{BRAND.name} acts as an intermediary between clients and service providers. We are not liable for service failures by third-party providers including hotels, airlines, and transport operators. We recommend travel insurance for all trips.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">7. Intellectual Property</h2>
                            <p className="text-ink-muted leading-relaxed">All content on this website including text, images, logos, and design is the property of {BRAND.name} and protected by copyright laws. Unauthorized use is prohibited.</p>
                        </div>

                        <div className="card p-6 hover-glow">
                            <h2 className="font-display text-xl font-bold text-ink mb-3">8. Contact</h2>
                            <p className="text-ink-muted leading-relaxed">For questions about these terms, contact us at <a href={`mailto:${BRAND.email}`} className="text-brand-500 font-semibold">{BRAND.email}</a> or call <a href={`tel:${BRAND.phone.replace(/\s+/g,'')}`} className="text-brand-500 font-semibold">{BRAND.phone}</a>.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
