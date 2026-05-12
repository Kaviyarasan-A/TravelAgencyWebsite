import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiExternalLink } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import SectionHeading from './SectionHeading.jsx';
import { TESTIMONIALS, BRAND } from '../data.js';
import { api } from '../api.js';

function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <FiStar
                    key={n}
                    size={14}
                    className={n <= rating ? 'text-accent fill-current' : 'text-ink-line'}
                />
            ))}
        </div>
    );
}

function ReviewCard({ review, index, isGoogle }) {
    return (
        <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
            className="card p-6 relative hover:-translate-y-1 hover:shadow-card transition-all duration-300 hover-glow"
        >
            <span className="absolute top-4 right-5 text-[80px] leading-none text-brand-100 select-none font-serif">&ldquo;</span>

            {/* Google badge */}
            {isGoogle && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] text-ink-muted bg-ink-line/40 px-2 py-1 rounded-full">
                    <FaGoogle className="text-[#4285F4]" />
                    Google Review
                </div>
            )}

            <StarRating rating={review.rating || review.stars} />

            <blockquote className="text-[15px] italic text-ink leading-relaxed mt-3 mb-5 line-clamp-4">
                &ldquo;{review.text || review.body}&rdquo;
            </blockquote>

            <figcaption className="flex items-center gap-3 border-t border-ink-line pt-4">
                <img
                    src={review.avatar || review.img}
                    alt={review.author || review.name}
                    className="w-11 h-11 rounded-full object-cover bg-ink-line"
                    loading="lazy"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author || review.name)}&background=ff7a00&color=fff&size=44`; }}
                />
                <div>
                    <div className="font-semibold text-ink">{review.author || review.name}</div>
                    <div className="text-xs text-ink-muted">
                        {isGoogle ? review.time : `${review.city} · ${review.trip}`}
                    </div>
                </div>
            </figcaption>
        </motion.figure>
    );
}

export default function GoogleReviews() {
    const [googleData, setGoogleData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        api.googleReviews().then((res) => {
            if (cancelled) return;
            if (res.ok && res.data?.reviews?.length > 0) {
                setGoogleData(res.data);
            }
            setLoading(false);
        });
        return () => { cancelled = true; };
    }, []);

    const hasGoogle = googleData && googleData.reviews?.length > 0;

    return (
        <section className="py-20">
            <div className="container-x">
                <SectionHeading
                    eyebrow={hasGoogle ? 'Google Reviews' : 'Stories from Clients'}
                    title="Happy"
                    script="Voices"
                    subtitle={hasGoogle
                        ? `Rated ${googleData.rating}/5 from ${googleData.totalReviews?.toLocaleString()} reviews on Google.`
                        : "From Kerala backwaters to Dubai company setups — here's what our customers say."
                    }
                />

                {/* Google overall rating badge */}
                {hasGoogle && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-6 mb-10"
                    >
                        <div className="flex items-center gap-4 bg-white rounded-2xl border border-ink-line shadow-soft px-6 py-4">
                            <FaGoogle className="text-3xl text-[#4285F4]" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-display text-3xl font-extrabold text-ink">{googleData.rating}</span>
                                    <StarRating rating={Math.round(googleData.rating)} />
                                </div>
                                <div className="text-xs text-ink-muted">{googleData.totalReviews?.toLocaleString()} Google reviews</div>
                            </div>
                            {googleData.googleUrl && (
                                <a
                                    href={googleData.googleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 btn-outline btn-sm text-xs"
                                >
                                    <FiExternalLink /> View All
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Reviews grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hasGoogle
                        ? googleData.reviews.slice(0, 6).map((r, i) => (
                            <ReviewCard key={r.timestamp || i} review={r} index={i} isGoogle />
                        ))
                        : TESTIMONIALS.map((t, i) => (
                            <ReviewCard key={t.name + i} review={t} index={i} isGoogle={false} />
                        ))
                    }
                </div>

                {/* Write a review CTA — always shown using the GBP review link from BRAND */}
                <div className="text-center mt-10 flex flex-wrap justify-center gap-3">
                    <a
                        href={BRAND.gbp.reviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                    >
                        <FaGoogle /> Write a Review on Google
                    </a>
                    <a
                        href={(hasGoogle && googleData.googleUrl) || BRAND.gbp.shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                    >
                        <FiExternalLink /> View us on Google
                    </a>
                </div>
            </div>
        </section>
    );
}
