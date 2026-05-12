import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    FiArrowRight, FiCheck, FiGlobe, FiTag, FiShield, FiHeart,
    FiStar, FiPhone, FiMail, FiSend,
} from 'react-icons/fi';
import { FaPlaneDeparture, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import Hero from '../components/Hero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import PackageCard from '../components/PackageCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import TripPlanner from '../components/TripPlanner.jsx';
import GoogleReviews from '../components/GoogleReviews.jsx';
import { AdHero, AdInline } from '../components/AdBanner.jsx';
import AmbientBackdrop from '../components/AmbientBackdrop.jsx';
import DestinationPopup from '../components/DestinationPopup.jsx';
import DestinationsGrid from '../components/DestinationsGrid.jsx';
import CuratedTrips from '../components/CuratedTrips.jsx';
import TrustBar from '../components/TrustBar.jsx';
import TripThemes from '../components/TripThemes.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import ExperienceCards from '../components/ExperienceCards.jsx';
import VideoTestimonials from '../components/VideoTestimonials.jsx';
import EditorialIntro from '../components/EditorialIntro.jsx';
import SeasonalSpotlight from '../components/SeasonalSpotlight.jsx';
import TopDestinations from '../components/TopDestinations.jsx';
import PopularHolidays from '../components/PopularHolidays.jsx';
import {
    DESTINATIONS, SERVICES, STATS, WHY_CHOOSE, BRAND,
} from '../data.js';
import { usePackages } from '../hooks/usePackages.js';
import { useBlogs } from '../hooks/useBlogs.js';
import { api } from '../api.js';

const whyIcon = { globe: <FiGlobe />, price: <FiTag />, badge: <FiShield />, heart: <FiHeart /> };
const svcIcon = {
    plane:      <FaPlaneDeparture />,
    graduation: <FaGraduationCap />,
    briefcase:  <FaBriefcase />,
};

function AnimatedStat({ value, suffix, label }) {
    const ref = useRef(null);
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!ref.current) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                const start = performance.now();
                const step = (now) => {
                    const p = Math.min((now - start) / 1600, 1);
                    setN(Math.floor(value * (1 - Math.pow(1 - p, 3))));
                    if (p < 1) requestAnimationFrame(step);
                    else setN(value);
                };
                requestAnimationFrame(step);
                io.disconnect();
            }
        }, { threshold: 0.4 });
        io.observe(ref.current);
        return () => io.disconnect();
    }, [value]);
    return (
        <div ref={ref} className="text-center">
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                {n.toLocaleString()}<span className="text-brand-500">{suffix}</span>
            </div>
            <div className="text-xs uppercase tracking-[2px] text-white/70 mt-2">{label}</div>
        </div>
    );
}

export default function Home() {
    const [bookOpen, setBookOpen] = useState(false);
    const [bookPkg,  setBookPkg]  = useState(null);
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const [destination, setDestination] = useState(null);
    const PACKAGES = usePackages();
    const BLOGS_LIVE = useBlogs();

    const openBooking = (pkg) => { setBookPkg(pkg); setBookOpen(true); };

    const subscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setBusy(true);
        const p = api.newsletter({ email });
        await toast.promise(p, { loading: 'Subscribing…', success: 'Welcome aboard!', error: 'Please try again.' });
        const r = await p;
        setBusy(false);
        if (r.ok) setEmail('');
    };

    return (
        <>
            <Helmet>
                <title>Trip with uz — Best Travel Agency in Salem, Tamil Nadu | Tours in India & Abroad</title>
                <meta name="description" content="Trip with uz is the best travel agency in Salem, Tamil Nadu — offering tour packages across India, Tamil Nadu holiday tours, international trips, study abroad and business setup. 15+ years, 25,000+ travellers, 4.9★ rated." />
                <meta name="keywords" content="Salem travels, travel agency in Salem, best travels in Salem, tours from Salem, travel agency Tamil Nadu, tourist agency in India, tours in Tamil Nadu, holidays in Tamil Nadu, Tamil Nadu tour packages, India tour packages, best tours India, Kerala tour packages from Salem, Ooty tour packages, Kodaikanal tour packages, Salem tours and travels, Trip with uz Salem, study abroad consultants Salem, Dubai business setup" />
                <meta name="geo.region" content="IN-TN" />
                <meta name="geo.placename" content="Salem, Tamil Nadu, India" />
                <meta name="geo.position" content={`${BRAND.geo.latitude};${BRAND.geo.longitude}`} />
                <meta name="ICBM" content={`${BRAND.geo.latitude}, ${BRAND.geo.longitude}`} />
                <meta property="og:title" content="Trip with uz — Best Travel Agency in Salem, Tamil Nadu" />
                <meta property="og:description" content="Salem's most trusted travel agency. Tour packages across India, Tamil Nadu holidays, international trips, study abroad & business setup. 4.9★ rated by 2,510 travellers." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={BRAND.logo} />
                <meta property="og:locale" content="en_IN" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Trip with uz — Best Travel Agency in Salem, Tamil Nadu" />
                <meta name="twitter:description" content="Tour packages in Tamil Nadu, India & abroad. Study abroad + business setup. 25,000+ happy travellers." />
                <link rel="canonical" href="https://tripwithuz.com/" />
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': ['TravelAgency', 'LocalBusiness'],
                    '@id': 'https://tripwithuz.com/#organization',
                    name: BRAND.name,
                    alternateName: ['Trip with uz Salem', 'Tripwithuz Travels'],
                    description: 'Best travel agency in Salem, Tamil Nadu offering curated tour packages across India and internationally, plus study abroad and business setup services.',
                    url: 'https://tripwithuz.com',
                    logo: 'https://tripwithuz.com/logo.png',
                    image: 'https://tripwithuz.com/logo.png',
                    telephone: [BRAND.phone, BRAND.phone2],
                    email: BRAND.email,
                    priceRange: '₹₹',
                    foundingDate: '2010',
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: 'No. 2/113, Narasothipatti, Opposite Amman Bakery',
                        addressLocality: 'Salem',
                        addressRegion: 'Tamil Nadu',
                        postalCode: '636004',
                        addressCountry: 'IN',
                    },
                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: BRAND.geo.latitude,
                        longitude: BRAND.geo.longitude,
                    },
                    hasMap: BRAND.gbp.cidUrl,
                    openingHoursSpecification: [{
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                        opens: '09:00',
                        closes: '20:00',
                    }],
                    areaServed: [
                        { '@type': 'City', name: 'Salem' },
                        { '@type': 'State', name: 'Tamil Nadu' },
                        { '@type': 'Country', name: 'India' },
                    ],
                    serviceType: [
                        'Tour packages',
                        'Tamil Nadu tours',
                        'India holiday packages',
                        'International tour packages',
                        'Honeymoon packages',
                        'Study abroad consulting',
                        'Business setup services',
                    ],
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: '4.9',
                        reviewCount: '2510',
                        bestRating: '5',
                        worstRating: '1',
                    },
                    sameAs: [
                        BRAND.gbp.shareUrl,
                        BRAND.social.facebook,
                        BRAND.social.instagram,
                        BRAND.social.youtube,
                    ],
                })}</script>
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    url: 'https://tripwithuz.com',
                    name: BRAND.name,
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: 'https://tripwithuz.com/packages?q={search_term_string}',
                        'query-input': 'required name=search_term_string',
                    },
                })}</script>
                {/* Service schema — one per vertical, helps Google understand all 3 offerings */}
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@graph': [
                        {
                            '@type': 'Service',
                            name: 'Tour Packages — India & International',
                            provider: { '@id': 'https://tripwithuz.com/#organization' },
                            areaServed: { '@type': 'Country', name: 'India' },
                            serviceType: 'Travel package booking',
                            url: 'https://tripwithuz.com/packages',
                            description: 'Customised domestic and international tour packages — Kerala, Ooty, Kodaikanal, Goa, Kashmir, Dubai, Bali, Singapore, Thailand, Europe and more.',
                        },
                        {
                            '@type': 'Service',
                            name: 'Study Abroad Counselling',
                            provider: { '@id': 'https://tripwithuz.com/#organization' },
                            areaServed: { '@type': 'Country', name: 'India' },
                            serviceType: 'Overseas education consulting',
                            url: 'https://tripwithuz.com/study-abroad',
                            description: 'University admissions, scholarships and visa support for UK, USA, Canada, Australia, Germany, Ireland and more.',
                        },
                        {
                            '@type': 'Service',
                            name: 'Business Setup Abroad',
                            provider: { '@id': 'https://tripwithuz.com/#organization' },
                            areaServed: { '@type': 'Country', name: 'India' },
                            serviceType: 'Company formation and licensing',
                            url: 'https://tripwithuz.com/business-setup',
                            description: 'Company registration, licensing, banking and tax structuring in Dubai, Singapore, USA, UK, Canada and more.',
                        },
                    ],
                })}</script>
                {/* FAQ schema — boosts SERP real estate; pulled from real customer questions */}
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: [
                        {
                            '@type': 'Question',
                            name: 'Which is the best travel agency in Salem, Tamil Nadu?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Trip with uz is one of the best-rated travel agencies in Salem, Tamil Nadu — 4.9★ from 2,500+ travellers. We offer customised tour packages across India and internationally, plus study abroad and business setup services. Visit our office at Narasothipatti, Salem or call +91 90870 06777.',
                            },
                        },
                        {
                            '@type': 'Question',
                            name: 'What tour packages do you offer from Salem?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'We offer domestic packages — Kerala, Ooty, Kodaikanal, Munnar, Goa, Kashmir, Andaman, Rajasthan — and international tours to Dubai, Bali, Singapore, Thailand, Maldives, Europe and more. Every package includes hotels, transport, sightseeing and 24/7 support.',
                            },
                        },
                        {
                            '@type': 'Question',
                            name: 'Do you arrange honeymoon packages?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Yes — we specialise in honeymoon packages for Indian couples to Bali, Maldives, Andaman, Kerala, Kashmir, Switzerland, Dubai and more. All packages include romantic hotel upgrades, candlelight dinners and private transfers.',
                            },
                        },
                        {
                            '@type': 'Question',
                            name: 'How do I book a tour with Trip with uz?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'You can call +91 90870 06777, WhatsApp us, fill our enquiry form, or visit our Salem office. We send a personalised quotation within 24 hours, and you can confirm with a small advance.',
                            },
                        },
                        {
                            '@type': 'Question',
                            name: 'Do you provide study abroad counselling?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Yes. We help students apply to 1000+ partner universities in the UK, USA, Canada, Australia, Germany, Ireland and Singapore — from shortlisting and SOPs to scholarships, visa, forex and pre-departure support. The first counselling session is free.',
                            },
                        },
                        {
                            '@type': 'Question',
                            name: 'Where is your office located?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Our office is at No. 2/113, Narasothipatti, Opposite Amman Bakery, Salem – 636004, Tamil Nadu, India. Open Monday to Saturday, 9 AM – 8 PM IST.',
                            },
                        },
                    ],
                })}</script>
            </Helmet>

            <Hero />

            {/* --- Social-proof trust bar (NEW, PickYourTrail-style) --- */}
            <TrustBar />

            {/* --- Premium editorial intro (Wix-template style) --- */}
            <EditorialIntro />

            {/* --- Seasonal Spotlight — admin-managed featured packages for the active season --- */}
            <SeasonalSpotlight onBook={openBooking} />

            {/* --- Scrolling destinations marquee --- */}
            <section className="relative bg-white border-b border-ink-line overflow-hidden">
                {/* subtle backdrop motion */}
                <div className="absolute inset-0 bg-mesh-warm opacity-40 pointer-events-none" />
                {/* edge fades */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="relative py-6 marquee-viewport">
                    <div className="marquee-track flex gap-6 items-center">
                        {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
                            <button
                                key={i}
                                onClick={() => setDestination(d)}
                                className="flex items-center gap-3 shrink-0 px-4 py-2 rounded-full border border-transparent hover:border-brand-200 hover:bg-brand-50 transition-all group/item"
                            >
                                <div className="relative">
                                    <div
                                        className="w-12 h-12 rounded-full bg-cover bg-center ring-2 ring-brand-100 group-hover/item:ring-brand-500 transition-all group-hover/item:scale-110"
                                        style={{ backgroundImage: `url(${d.image})` }}
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        →
                                    </span>
                                </div>
                                <div className="text-left">
                                    <div className="text-[14px] font-bold text-ink group-hover/item:text-brand-600 transition-colors flex items-center gap-1.5">
                                        {d.name}
                                    </div>
                                    <div className="text-[10px] text-ink-muted uppercase tracking-wider group-hover/item:text-brand-500 transition-colors">
                                        {d.tours} tours
                                    </div>
                                </div>
                                <span className="text-brand-300 text-xs select-none">•</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Destination slide-up popup */}
            <DestinationPopup
                destination={destination}
                open={!!destination}
                onClose={() => setDestination(null)}
            />

            {/* --- Live promo banner --- */}
            <section className="pt-10 pb-2">
                <div className="container-x">
                    <AdHero placement="home_hero" />
                </div>
            </section>

            {/* --- Services --- */}
            <section className="py-20 relative bg-white overflow-hidden">
                <div className="container-x relative">
                    <SectionHeading
                        eyebrow="What We Do"
                        title="Three ways we help you go"
                        script="global."
                        subtitle="One team, three complementary services — because travel, education and business rarely move alone."
                    />
                    <div className="grid md:grid-cols-3 gap-6">
                        {SERVICES.map((s, i) => (
                            <motion.div
                                key={s.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group card overflow-hidden hover:shadow-card hover:-translate-y-2 transition-all duration-300 hover-glow"
                            >
                                <div className="relative h-52 overflow-hidden">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${s.image})` }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                    <span className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-brand-grad text-white flex items-center justify-center shadow-brand text-lg">
                                        {svcIcon[s.icon]}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-display text-xl font-bold text-ink mb-2">{s.title}</h3>
                                    <p className="text-ink-muted text-sm leading-relaxed mb-4">{s.desc}</p>
                                    <ul className="space-y-1.5 mb-5">
                                        {s.bullets.map((b) => (
                                            <li key={b} className="flex items-start gap-2 text-sm">
                                                <FiCheck className="text-brand-500 mt-0.5 shrink-0" /><span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to={s.href} className="text-brand-500 font-semibold inline-flex items-center gap-1.5 group-hover:gap-3 transition-all">
                                        {s.cta} <FiArrowRight />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Top Destinations (legsgo-style enquiry-only catalogue) --- */}
            <TopDestinations />

            {/* --- Popular Holidays (curated India-focused, enquiry-only) --- */}
            <PopularHolidays />

            {/* --- Top Destinations grid (PickYourTrail-style) --- */}
            <DestinationsGrid />

            {/* --- Themed trip tabs (NEW) --- */}
            <TripThemes />

            {/* --- Curated trips horizontal carousel --- */}
            <CuratedTrips eyebrow="Trending Trips" title="Curated journeys, ready to go" />

            {/* --- How it works (NEW, with Lottie icons) --- */}
            <HowItWorks />

            {/* --- Experience cards (NEW) --- */}
            <ExperienceCards />

            {/* --- Video testimonials (NEW) --- */}
            <VideoTestimonials />

            {/* --- Hidden legacy packages grid (kept for SEO content) --- */}
            <section className="py-20 bg-ink-line/30 relative overflow-hidden hidden">
                <AmbientBackdrop variant="mixed" />
                <div className="container-x relative">
                    <SectionHeading
                        eyebrow="Our Trending Trips"
                        title="Popular"
                        script="Packages"
                        subtitle="Our most-loved journeys — built by locals, booked in minutes."
                    />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PACKAGES.slice(0, 6).map((p, i) => (
                            <PackageCard key={p.slug} pkg={p} index={i} onBook={openBooking} />
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/packages" className="btn-outline btn-lg">View all packages <FiArrowRight /></Link>
                    </div>
                </div>
            </section>

            {/* --- Mid banner ad --- */}
            <section className="py-6">
                <div className="container-x">
                    <AdInline placement="home_mid" />
                </div>
            </section>

            {/* --- Old top destinations (hidden — replaced by DestinationsGrid above) --- */}
            <section className="py-20 hidden">
                <div className="container-x">
                    <SectionHeading
                        eyebrow="Roam the Planet"
                        title="Top"
                        script="Destinations"
                        subtitle="Pick a corner of the world and we'll take you there."
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {DESTINATIONS.map((d, i) => (
                            <motion.a
                                key={d.name}
                                href="/packages"
                                initial={{ opacity: 0, scale: 0.96 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                                className={`group relative rounded-2xl overflow-hidden h-48 lg:h-52 ${i % 5 === 1 ? 'lg:row-span-2 lg:h-auto' : ''}`}
                            >
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                     style={{ backgroundImage: `url(${d.image})` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <div className="font-display text-xl font-bold">{d.name}</div>
                                    <div className="text-xs opacity-85">{d.tours} tours available</div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Why Choose Us (legacy, hidden — replaced by VideoTestimonials) --- */}
            <section className="py-20 bg-ink text-white relative overflow-hidden hidden">
                <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2000&q=80')" }} />
                <div className="container-x relative">
                    <div className="text-center mb-14">
                        <span className="eyebrow !text-brand-500">Why Choose Us</span>
                        <h2 className="section-title !text-white">Journeys built around <span className="script !text-accent">you.</span></h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {WHY_CHOOSE.map((w, i) => (
                            <motion.div
                                key={w.t}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 hover:border-brand-500/40 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-brand-grad text-white flex items-center justify-center text-xl shadow-brand mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    {whyIcon[w.icon]}
                                </div>
                                <h3 className="font-display text-lg font-bold mb-1.5">{w.t}</h3>
                                <p className="text-sm text-white/70">{w.d}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10">
                        {STATS.map((s) => <AnimatedStat key={s.label} {...s} />)}
                    </div>
                </div>
            </section>

            {/* --- Trip Planner --- */}
            <TripPlanner />

            {/* --- Google Reviews / Testimonials --- */}
            <GoogleReviews />

            {/* --- Blog --- */}
            <section className="py-20 bg-slate-50 relative overflow-hidden">
                <div className="container-x relative">
                    <SectionHeading
                        eyebrow="Travel Stories & Tips"
                        title="Our"
                        script="Blog"
                        subtitle="Field notes, packing lists and destination guides from our team."
                    />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BLOGS_LIVE.slice(0, 3).map((b, i) => (
                            <motion.article
                                key={b.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="card overflow-hidden hover:-translate-y-2 hover:shadow-card transition-all duration-300 hover-glow"
                            >
                                <Link to={`/blog/${b.slug}`} className="block group">
                                    <div className="h-52 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${b.coverImage || b.image})` }} />
                                    <div className="p-5">
                                        <div className="flex gap-4 text-xs text-ink-muted mb-2">
                                            <span>{b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : b.date}</span>
                                            <span>{b.author}</span>
                                        </div>
                                        <h3 className="font-display text-lg font-bold text-ink leading-snug mb-2 group-hover:text-brand-500 transition">{b.title}</h3>
                                        <p className="text-sm text-ink-muted mb-3 line-clamp-2">{b.excerpt}</p>
                                        <span className="text-brand-500 font-semibold text-sm inline-flex items-center gap-1.5 group-hover:gap-3 transition-all">
                                            Read Article <FiArrowRight />
                                        </span>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/blog" className="btn-outline">View all articles <FiArrowRight /></Link>
                    </div>
                </div>
            </section>

            {/* --- SEO content block — answers what people actually search for --- */}
            <section className="py-16 lg:py-20 bg-white border-t border-ink-line/60">
                <div className="container-x grid lg:grid-cols-2 gap-10 lg:gap-14">
                    <div>
                        <span className="eyebrow">Why travellers choose us</span>
                        <h2 className="section-title">The trusted travel agency in <span className="font-script italic text-brand-500">Salem, Tamil Nadu</span></h2>
                        <p className="text-ink-muted leading-relaxed mt-4">
                            <strong>Trip with uz</strong> is one of the <strong>best travel agencies in Salem</strong> — and a trusted name across Tamil Nadu and India. Since 2010 we've helped over 25,000 travellers plan unforgettable <strong>holidays in Tamil Nadu</strong>, <strong>tour packages in India</strong>, and bucket-list international trips. From short weekend escapes to multi-country journeys, our team handcrafts every itinerary, vets every stay, and stays available on WhatsApp 24/7.
                        </p>
                        <p className="text-ink-muted leading-relaxed mt-4">
                            Walk into our office at Narasothipatti, Salem or talk to us online — we'll plan everything from <strong>Salem tours</strong> to <strong>Kerala packages</strong>, <strong>Ooty &amp; Kodaikanal trips</strong>, North India heritage tours, Dubai, Bali, Singapore, Europe, and beyond.
                        </p>
                    </div>

                    <div>
                        <span className="eyebrow">Popular searches</span>
                        <h2 className="section-title">What we plan for travellers across India</h2>
                        <div className="mt-4 grid sm:grid-cols-2 gap-2.5">
                            {[
                                { label: 'Tours in Tamil Nadu',      to: '/packages?region=South%20India' },
                                { label: 'Holidays in Tamil Nadu',   to: '/packages?category=Domestic&region=South%20India' },
                                { label: 'Ooty tour packages',       to: '/packages?q=Ooty' },
                                { label: 'Kodaikanal tour packages', to: '/packages?q=Kodaikanal' },
                                { label: 'Kerala tour packages',     to: '/packages?q=Kerala' },
                                { label: 'Pondicherry tours',        to: '/packages?q=Pondicherry' },
                                { label: 'Goa tour packages',        to: '/packages?q=Goa' },
                                { label: 'Rajasthan tour packages',  to: '/packages?q=Rajasthan' },
                                { label: 'Kashmir tour packages',    to: '/packages?q=Kashmir' },
                                { label: 'Dubai tour packages',      to: '/packages?q=Dubai' },
                                { label: 'Bali honeymoon packages',  to: '/packages?q=Bali' },
                                { label: 'Singapore tour packages',  to: '/packages?q=Singapore' },
                                { label: 'Europe tour packages',     to: '/packages?q=Europe' },
                                { label: 'Honeymoon packages',       to: '/packages?tag=Honeymoon' },
                                { label: 'Family tour packages',     to: '/packages?type=family' },
                                { label: 'Group tours from Salem',   to: '/contact' },
                            ].map((t) => (
                                <Link key={t.label} to={t.to}
                                    className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-ink-line/70 bg-white hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 text-[13px] font-display font-semibold text-ink transition">
                                    <span>{t.label}</span>
                                    <FiArrowRight size={12} className="text-brand-500 shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA + newsletter --- */}
            <section className="py-16 bg-brand-grad text-white">
                <div className="container-x grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
                    <div>
                        <span className="eyebrow !text-white opacity-90">Stay in the loop</span>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
                            Get <span className="font-script text-accent">deals &amp; destination stories</span> in your inbox.
                        </h2>
                        <p className="opacity-90 mt-2">One thoughtful email a month. No spam — ever.</p>
                    </div>
                    <form onSubmit={subscribe} className="flex gap-2 bg-white/10 border border-white/20 rounded-full p-1.5 backdrop-blur">
                        <input
                            type="email" required placeholder="Your email address"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-5 py-3 bg-transparent outline-none text-white placeholder:text-white/60"
                        />
                        <button type="submit" disabled={busy} className="btn-white">
                            <FiSend /> {busy ? 'Wait…' : 'Subscribe'}
                        </button>
                    </form>
                </div>
            </section>

            {/* --- Quick contact strip --- */}
            <section className="py-12 border-t border-ink-line">
                <div className="container-x grid md:grid-cols-3 gap-6">
                    <a href={`tel:${BRAND.phone.replace(/\s+/g,'')}`} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-ink-line/40 transition">
                        <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center text-xl"><FiPhone /></span>
                        <div>
                            <div className="text-xs text-ink-muted uppercase tracking-wider">Call us</div>
                            <div className="font-semibold text-ink">{BRAND.phone}</div>
                        </div>
                    </a>
                    <a href={`mailto:${BRAND.email}`} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-ink-line/40 transition">
                        <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center text-xl"><FiMail /></span>
                        <div>
                            <div className="text-xs text-ink-muted uppercase tracking-wider">Email us</div>
                            <div className="font-semibold text-ink">{BRAND.email}</div>
                        </div>
                    </a>
                    <Link to="/contact" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-ink-line/40 transition">
                        <span className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center text-xl"><FiSend /></span>
                        <div>
                            <div className="text-xs text-ink-muted uppercase tracking-wider">Get a custom quote</div>
                            <div className="font-semibold text-ink">Start here →</div>
                        </div>
                    </Link>
                </div>
            </section>

            <BookingModal open={bookOpen} onClose={() => setBookOpen(false)} pkg={bookPkg} />
        </>
    );
}
