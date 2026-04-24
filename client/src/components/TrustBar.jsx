import { FiAward, FiStar, FiUsers, FiGlobe, FiShield } from 'react-icons/fi';

/**
 * Trust bar — a compact band that sits under the hero with social-proof
 * chips (rating, travellers, certifications). Matches the "trust line"
 * PickYourTrail shows on home.
 */
export default function TrustBar() {
    const items = [
        { icon: <FiStar className="text-amber-500 fill-current" />, head: '4.9 / 5',      sub: 'Google-rated · 2,510 reviews' },
        { icon: <FiUsers className="text-brand-500" />,             head: '25,000+',     sub: 'travellers served since 2010' },
        { icon: <FiGlobe className="text-brand-500" />,             head: '120+',        sub: 'destinations worldwide' },
        { icon: <FiAward className="text-brand-500" />,             head: 'IATA · TAFI', sub: 'ICEF-certified partners' },
        { icon: <FiShield className="text-brand-500" />,            head: '24 / 7',      sub: 'on-trip human support' },
    ];

    return (
        <section className="relative -mt-6 sm:-mt-10 z-10">
            <div className="container-x">
                <div className="bg-white rounded-2xl shadow-card border border-ink-line/60 divide-y md:divide-y-0 md:divide-x divide-ink-line/60 grid grid-cols-1 md:grid-cols-5 overflow-hidden">
                    {items.map((it, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-4">
                            <span className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-lg">
                                {it.icon}
                            </span>
                            <div className="min-w-0">
                                <div className="font-display font-extrabold text-ink text-[15px] leading-tight"
                                    style={{ letterSpacing: '-0.02em' }}>
                                    {it.head}
                                </div>
                                <div className="text-[11px] text-ink-muted truncate">{it.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
