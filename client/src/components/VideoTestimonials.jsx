import { motion } from 'framer-motion';
import { FiPlay, FiStar } from 'react-icons/fi';

/**
 * Stylised testimonial strip — quote cards with portrait photos.
 * Replaces the older "GoogleReviews" static grid with something warmer
 * and more PickYourTrail-like.
 */
const REVIEWS = [
    {
        name: 'Ananya R.',
        trip: 'Kerala · 7 days · Oct 2025',
        rating: 5,
        quote: 'Every detail was anticipated — transfers, the houseboat, even the cake on our anniversary. Felt like the team was at each hotel waiting for us.',
        img: 'https://i.pravatar.cc/200?img=47',
        bgImg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
    },
    {
        name: 'Rohit & Nisha',
        trip: 'Bali Honeymoon · 6 days · Jan 2026',
        rating: 5,
        quote: "Booked in 3 days for a last-minute anniversary. They found us a pool villa in Ubud with a floating breakfast — it was out of a movie.",
        img: 'https://i.pravatar.cc/200?img=12',
        bgImg: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
    },
    {
        name: 'Meera K.',
        trip: 'Dubai + Abu Dhabi · 5 days · Dec 2025',
        rating: 5,
        quote: "Desert safari, Burj Khalifa at sunset, and Abu Dhabi's Sheikh Zayed Mosque in one trip. Kids were entertained, grandparents were comfortable.",
        img: 'https://i.pravatar.cc/200?img=32',
        bgImg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    },
    {
        name: 'Arjun Patel',
        trip: 'Study Abroad · UK · Jan 2026',
        rating: 5,
        quote: '60% scholarship at Manchester thanks to their SOP team. Visa cleared on first try. Zero stress from start to boarding.',
        img: 'https://i.pravatar.cc/200?img=18',
        bgImg: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
    },
];

export default function VideoTestimonials() {
    return (
        <section className="py-20 lg:py-28 bg-ink text-white relative overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-brand-500/15 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-blue-500/10 blur-3xl" />

            <div className="container-x relative">
                <div className="max-w-2xl mb-12">
                    <span className="eyebrow !text-brand-400">Real stories</span>
                    <h2 className="section-title !text-white">
                        Don't trust us.<br />Trust 25,000+ travellers.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                    {REVIEWS.map((r, i) => (
                        <motion.article
                            key={r.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.55, delay: (i % 2) * 0.12 }}
                            className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-6 lg:p-7 backdrop-blur-sm hover:bg-white/10 transition group"
                        >
                            {/* Soft background photo peeking through */}
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-15 transition duration-700"
                                style={{ backgroundImage: `url(${r.bgImg})` }}
                            />

                            <div className="relative">
                                {/* Stars */}
                                <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                                    {Array.from({ length: r.rating }).map((_, k) => (
                                        <FiStar key={k} className="fill-current" size={14} />
                                    ))}
                                </div>

                                <p className="text-white text-[16px] leading-relaxed font-medium">
                                    "{r.quote}"
                                </p>

                                <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-4">
                                    <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20" />
                                    <div>
                                        <div className="font-display font-bold text-white text-sm">{r.name}</div>
                                        <div className="text-[11px] text-white/60">{r.trip}</div>
                                    </div>
                                    {/* Play button for future video support */}
                                    <button className="ml-auto w-10 h-10 rounded-full bg-white/10 hover:bg-brand-500 flex items-center justify-center transition group/play" aria-label="Play video">
                                        <FiPlay className="group-hover/play:scale-110 transition" size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Trust stats */}
                <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10">
                    {[
                        { k: '25,000+', v: 'Happy travellers' },
                        { k: '120+',    v: 'Destinations' },
                        { k: '4.9/5',   v: 'Average rating' },
                        { k: '15 yrs',  v: 'Planning trips' },
                    ].map((s) => (
                        <div key={s.v} className="text-center">
                            <div className="font-display font-extrabold text-white text-3xl lg:text-4xl"
                                style={{ letterSpacing: '-0.035em' }}>
                                {s.k}
                            </div>
                            <div className="text-[11px] uppercase tracking-[2px] text-white/60 mt-2">{s.v}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
