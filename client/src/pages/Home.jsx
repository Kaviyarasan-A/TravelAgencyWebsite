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
                <title>Trip with uz | Tours, Study Abroad & Business Setup</title>
                <meta name="description" content="Best travel agency in India for domestic & international tour packages, study abroad consulting and overseas business setup. 120+ destinations, 15+ years, 25,000+ happy travellers." />
                <meta name="keywords" content="travel agency Salem, tour packages India, study abroad consultants, dubai business setup, Kerala tour packages, Bali honeymoon, Europe tour, MS in USA, study in Canada" />
                <meta property="og:title" content="Trip with uz | Curated Tours, Study Abroad & Business Setup" />
                <meta property="og:description" content="India's trusted travel + overseas education + business setup partner. Instant quotation, UPI payments, 24/7 support." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={BRAND.logo} />
                <link rel="canonical" href="https://tripwithuz.com/" />
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'TravelAgency',
                    name: BRAND.name,
                    description: 'Curated holiday packages, overseas education consulting and international business setup services.',
                    url: 'https://tripwithuz.com',
                    logo: 'https://tripwithuz.com/logo.png',
                    telephone: BRAND.phone,
                    email: BRAND.email,
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: 'No. 2/113, Narasothipatti, Opposite Amman Bakery',
                        addressLocality: 'Salem',
                        addressRegion: 'Tamil Nadu',
                        postalCode: '636004',
                        addressCountry: 'IN',
                    },
                    openingHours: 'Mo-Sa 09:00-20:00',
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: '4.9',
                        reviewCount: '2510',
                    },
                    sameAs: [
                        BRAND.social.facebook,
                        BRAND.social.instagram,
                        BRAND.social.twitter,
                        BRAND.social.youtube,
                    ],
                })}</script>
            </Helmet>

            <Hero />

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
            <section className="py-20 relative bg-mesh-warm overflow-hidden">
                <AmbientBackdrop variant="warm" />
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

            {/* --- Top Destinations grid (PickYourTrail-style) --- */}
            <DestinationsGrid />

            {/* --- Curated trips horizontal carousel --- */}
            <CuratedTrips eyebrow="Trending Trips" title="Curated journeys, ready to go" />

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

            {/* --- Why Choose Us --- */}
            <section className="py-20 bg-ink text-white relative overflow-hidden">
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
            <section className="py-20 bg-ink-line/30 relative overflow-hidden">
                <AmbientBackdrop variant="cool" />
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
