import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlay, FiStar, FiX, FiVolume2, FiVolumeX } from 'react-icons/fi';

/**
 * Video testimonials — clicking play opens a modal that streams the
 * traveller's testimonial video. We use stable Pexels CDN clips as
 * placeholders so the play button always works; admin can swap in
 * real customer-shot videos by editing the REVIEWS list below.
 */
const REVIEWS = [
    {
        name: 'Ananya R.',
        trip: 'Kerala · 7 days · Oct 2025',
        rating: 5,
        quote: 'Every detail was anticipated — transfers, the houseboat, even the cake on our anniversary. Felt like the team was at each hotel waiting for us.',
        img: 'https://i.pravatar.cc/200?img=47',
        poster: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=1200',
        video: 'https://videos.pexels.com/video-files/1526909/1526909-hd_1280_720_24fps.mp4',
    },
    {
        name: 'Rohit & Nisha',
        trip: 'Bali Honeymoon · 6 days · Jan 2026',
        rating: 5,
        quote: "Booked in 3 days for a last-minute anniversary. They found us a pool villa in Ubud with a floating breakfast — it was out of a movie.",
        img: 'https://i.pravatar.cc/200?img=12',
        poster: 'https://images.pexels.com/photos/2100941/pexels-photo-2100941.jpeg?auto=compress&cs=tinysrgb&w=1200',
        video: 'https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4',
    },
    {
        name: 'Meera K.',
        trip: 'Dubai + Abu Dhabi · 5 days · Dec 2025',
        rating: 5,
        quote: "Desert safari, Burj Khalifa at sunset, and Abu Dhabi's Sheikh Zayed Mosque in one trip. Kids were entertained, grandparents were comfortable.",
        img: 'https://i.pravatar.cc/200?img=32',
        poster: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=1200',
        video: 'https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_25fps.mp4',
    },
    {
        name: 'Arjun Patel',
        trip: 'Study Abroad · UK · Jan 2026',
        rating: 5,
        quote: '60% scholarship at Manchester thanks to their SOP team. Visa cleared on first try. Zero stress from start to boarding.',
        img: 'https://i.pravatar.cc/200?img=18',
        poster: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1200',
        video: 'https://videos.pexels.com/video-files/3209663/3209663-hd_1920_1080_25fps.mp4',
    },
];

function VideoPlayerModal({ review, onClose }) {
    const videoRef = useRef(null);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        // Kick playback after the element mounts; browsers occasionally ignore autoPlay otherwise.
        const t = setTimeout(() => videoRef.current?.play?.().catch(() => {}), 100);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
            clearTimeout(t);
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4"
        >
            <div className="absolute inset-0 bg-ink/85 backdrop-blur-md" onClick={onClose} />
            <motion.div
                role="dialog" aria-modal="true"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="relative z-10 w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-float"
            >
                <button onClick={onClose} aria-label="Close"
                    className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur text-white flex items-center justify-center transition">
                    <FiX size={18} />
                </button>
                <div className="relative aspect-video bg-black">
                    <video
                        ref={videoRef}
                        src={review.video}
                        poster={review.poster}
                        controls
                        autoPlay
                        playsInline
                        muted={muted}
                        className="w-full h-full object-cover"
                    />
                    <button onClick={() => {
                        setMuted((m) => {
                            if (videoRef.current) videoRef.current.muted = !m;
                            return !m;
                        });
                    }}
                        className="absolute bottom-16 right-4 z-20 w-10 h-10 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center transition"
                        aria-label={muted ? 'Unmute' : 'Mute'}>
                        {muted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
                    </button>
                </div>
                <div className="px-5 py-4 flex items-center gap-3 bg-white">
                    <img src={review.img} alt={review.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-100" />
                    <div>
                        <div className="font-display font-bold text-ink text-sm">{review.name}</div>
                        <div className="text-[11px] text-ink-muted">{review.trip}</div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function VideoTestimonials() {
    const [active, setActive] = useState(null);

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
                            {/* Soft poster image peeking through on hover */}
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-15 transition duration-700"
                                style={{ backgroundImage: `url(${r.poster})` }}
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
                                    {r.video && (
                                        <button
                                            onClick={() => setActive(r)}
                                            className="ml-auto inline-flex items-center gap-2 px-4 h-10 rounded-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-display font-semibold uppercase tracking-[2px] transition shadow-brand"
                                            aria-label={`Play ${r.name}'s video review`}
                                        >
                                            <FiPlay size={12} /> Watch
                                        </button>
                                    )}
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

            <AnimatePresence>
                {active && <VideoPlayerModal review={active} onClose={() => setActive(null)} />}
            </AnimatePresence>
        </section>
    );
}
