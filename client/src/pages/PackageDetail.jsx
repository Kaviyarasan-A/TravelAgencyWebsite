import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiClock, FiCheck, FiX, FiArrowLeft, FiPlay } from 'react-icons/fi';
import BookingModal from '../components/BookingModal.jsx';
import { usePackages } from '../hooks/usePackages.js';

export default function PackageDetail() {
    const { slug } = useParams();
    const PACKAGES = usePackages();
    const pkg = PACKAGES.find((p) => p.slug === slug);
    const [bookOpen, setBookOpen] = useState(false);

    if (!pkg) {
        return (
            <div className="container-x py-32 text-center">
                <h1 className="font-display text-3xl font-bold">Package not found</h1>
                <p className="text-ink-muted mt-2">Let's get you back on track.</p>
                <Link to="/packages" className="btn-primary mt-6">See all packages</Link>
            </div>
        );
    }

    const related = PACKAGES.filter((p) => p.slug !== pkg.slug).slice(0, 3);

    return (
        <>
            <Helmet>
                <title>{`${pkg.title} | ${pkg.days}D/${pkg.nights}N ${pkg.country} Tour Package | Trip with uz`}</title>
                <meta name="description" content={`${pkg.title} — ${pkg.days}D/${pkg.nights}N ${pkg.country} tour package from ₹${(pkg.basePrice || 0).toLocaleString('en-IN')}. ${(pkg.highlights || []).slice(0, 2).join('. ')}. Book with instant quotation & UPI payments.`} />
                <meta name="keywords" content={`${pkg.title}, ${pkg.country} tour package, ${pkg.city} trip, ${(pkg.tags || []).join(', ')}, tour package India, ${pkg.days} day ${pkg.country}`} />
                <meta property="og:title" content={`${pkg.title} — ${pkg.days}D/${pkg.nights}N from ₹${(pkg.basePrice || 0).toLocaleString('en-IN')}`} />
                <meta property="og:description" content={`${pkg.days}D/${pkg.nights}N in ${pkg.city}, ${pkg.country}`} />
                <meta property="og:image" content={pkg.image} />
                <meta property="og:type" content="product" />
                <link rel="canonical" href={`https://tripwithuz.com/packages/${pkg.slug}`} />
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'TouristTrip',
                    name: pkg.title,
                    description: `${pkg.days}-day ${pkg.country} tour package covering ${pkg.city}. ${(pkg.highlights || []).slice(0, 3).join('. ')}`,
                    image: pkg.image,
                    touristType: pkg.tags || [],
                    itinerary: (pkg.itinerary || []).map((d) => ({
                        '@type': 'TouristAttraction',
                        name: d.t,
                        description: d.c,
                    })),
                    offers: pkg.basePrice ? {
                        '@type': 'Offer',
                        price: pkg.basePrice,
                        priceCurrency: 'INR',
                        availability: 'https://schema.org/InStock',
                        url: `https://tripwithuz.com/packages/${pkg.slug}`,
                    } : undefined,
                    aggregateRating: pkg.rating ? {
                        '@type': 'AggregateRating',
                        ratingValue: pkg.rating,
                        reviewCount: pkg.reviews || 10,
                    } : undefined,
                })}</script>
            </Helmet>

            {/* Hero with video-or-image background + Ken Burns zoom */}
            <section className="relative h-[62vh] min-h-[460px] overflow-hidden">
                {pkg.tourVideo ? (
                    <motion.video
                        initial={{ scale: 1.15, opacity: 0 }}
                        animate={{ scale: 1.0, opacity: 1 }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                        src={pkg.tourVideo}
                        poster={pkg.image}
                        autoPlay muted loop playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <motion.div
                        initial={{ scale: 1.12, opacity: 0 }}
                        animate={{ scale: 1.0, opacity: 1 }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                        className="absolute inset-0 bg-cover bg-center animate-zoom-slow"
                        style={{ backgroundImage: `url(${pkg.image})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

                <div className="container-x relative h-full flex items-end pb-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    >
                        <Link to="/packages" className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white mb-4">
                            <FiArrowLeft /> All Packages
                        </Link>
                        <div className="flex items-center gap-3 flex-wrap text-sm mb-3">
                            <span className="inline-flex items-center gap-1.5"><FiMapPin className="text-brand-400" /> {pkg.city}, {pkg.country}</span>
                            <span className="inline-flex items-center gap-1.5"><FiClock className="text-brand-400" /> {pkg.days}D / {pkg.nights}N</span>
                            <span className="inline-flex items-center gap-1.5"><FiStar className="text-accent fill-current" /> {pkg.rating} ({pkg.reviews} reviews)</span>
                            {pkg.tourVideo && (
                                <span className="inline-flex items-center gap-1.5 bg-brand-500/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">
                                    <FiPlay size={10} /> Virtual tour
                                </span>
                            )}
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.35 }}
                            className="font-display text-4xl sm:text-5xl font-extrabold max-w-3xl leading-tight"
                        >
                            {pkg.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-3 flex gap-2 flex-wrap"
                        >
                            {pkg.tags.map((t) => <span key={t} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium border border-white/10">{t}</span>)}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="py-14">
                <div className="container-x grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
                    <div className="space-y-10">
                        {/* Highlights */}
                        <div>
                            <h2 className="font-display text-2xl font-bold text-ink mb-4">Highlights</h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {pkg.highlights.map((h) => (
                                    <div key={h} className="flex items-start gap-2.5 card p-4">
                                        <FiCheck className="text-brand-500 mt-0.5 shrink-0" /><span className="text-sm">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div>
                            <h2 className="font-display text-2xl font-bold text-ink mb-4">Day-by-day itinerary</h2>
                            <ol className="relative border-l-2 border-ink-line ml-3 space-y-6">
                                {pkg.itinerary.map((it, i) => (
                                    <li key={i} className="ml-6">
                                        <span className="absolute -left-[13px] w-6 h-6 rounded-full bg-brand-grad text-white text-[11px] font-bold flex items-center justify-center shadow-brand">{i + 1}</span>
                                        <div className="text-xs text-brand-500 uppercase tracking-wider font-semibold">{it.d}</div>
                                        <h3 className="font-display text-lg font-bold text-ink">{it.t}</h3>
                                        <p className="text-sm text-ink-muted mt-1">{it.c}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Includes / Excludes */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="card p-6">
                                <h3 className="font-display text-lg font-bold text-ink mb-3">What's Included</h3>
                                <ul className="space-y-2">
                                    {pkg.includes.map((x) => <li key={x} className="flex gap-2 text-sm"><FiCheck className="text-green-600 mt-0.5" />{x}</li>)}
                                </ul>
                            </div>
                            <div className="card p-6">
                                <h3 className="font-display text-lg font-bold text-ink mb-3">Not Included</h3>
                                <ul className="space-y-2">
                                    {pkg.excludes.map((x) => <li key={x} className="flex gap-2 text-sm"><FiX className="text-red-500 mt-0.5" />{x}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Booking card */}
                    <aside className="card p-6 lg:sticky lg:top-24">
                        {pkg.basePrice ? (
                            <>
                                <div className="text-xs uppercase tracking-widest text-brand-500 font-semibold">Starts from</div>
                                <div className="font-display text-4xl font-extrabold text-ink mt-1">
                                    ₹{pkg.basePrice.toLocaleString('en-IN')}
                                    <span className="text-sm font-medium text-ink-muted ml-2">/ person</span>
                                </div>
                                <div className="text-xs text-ink-muted mt-1">incl. stays, transfers & sightseeing · taxes calculated at checkout</div>
                            </>
                        ) : (
                            <h3 className="font-display text-2xl font-bold text-ink mb-2">Interested in this trip?</h3>
                        )}
                        <button onClick={() => setBookOpen(true)} className="btn-primary w-full btn-lg mt-5">Book this trip</button>
                        <Link to="/contact" className="btn-outline w-full mt-3">Ask a question</Link>
                        <ul className="mt-5 space-y-2 text-xs text-ink-muted">
                            <li className="flex gap-2"><FiCheck className="text-brand-500" /> Instant quotation · no upfront payment</li>
                            <li className="flex gap-2"><FiCheck className="text-brand-500" /> UPI secure payment on confirmation</li>
                            <li className="flex gap-2"><FiCheck className="text-brand-500" /> Free cancellation up to 30 days prior</li>
                            <li className="flex gap-2"><FiCheck className="text-brand-500" /> Customizable itineraries</li>
                            <li className="flex gap-2"><FiCheck className="text-brand-500" /> 24/7 travel support</li>
                        </ul>
                    </aside>
                </div>
            </section>

            {/* Related */}
            <section className="py-14 bg-ink-line/30">
                <div className="container-x">
                    <h2 className="font-display text-2xl font-bold text-ink mb-6">You may also like</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {related.map((p) => (
                            <Link to={`/packages/${p.slug}`} key={p.slug} className="card overflow-hidden hover:shadow-card transition">
                                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                                <div className="p-4">
                                    <div className="text-xs text-ink-muted mb-1">{p.city}, {p.country}</div>
                                    <h3 className="font-display text-lg font-bold">{p.title}</h3>
                                    <div className="text-brand-500 font-semibold mt-1">{p.days}D / {p.nights}N</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <BookingModal open={bookOpen} onClose={() => setBookOpen(false)} pkg={pkg} />
        </>
    );
}
