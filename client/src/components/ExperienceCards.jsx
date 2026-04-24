import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

/**
 * Large editorial-style lifestyle cards — a stylistic break from the
 * grid-of-packages pattern. Each card is a mood: "Honeymoons", "Mountains",
 * "Heritage", "Wildlife". Clicks deep-link to filtered /packages views.
 */
const EXPERIENCES = [
    {
        key: 'honeymoons',
        title: 'Honeymoons',
        tagline: 'Floating breakfasts & jungle villas',
        image: 'https://images.unsplash.com/photo-1544733422-251e7fbea7b8?w=1600&q=80',
        href: '/packages?q=honeymoon',
        accent: 'from-rose-500/40 via-rose-500/20',
    },
    {
        key: 'mountains',
        title: 'Mountains',
        tagline: 'Alps, Himalayas, Western Ghats',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
        href: '/packages?q=mountain',
        accent: 'from-blue-500/40 via-blue-500/20',
    },
    {
        key: 'beaches',
        title: 'Beaches',
        tagline: 'Turquoise waters, zero crowd',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
        href: '/packages?q=beach',
        accent: 'from-cyan-500/40 via-cyan-500/20',
    },
    {
        key: 'heritage',
        title: 'Heritage',
        tagline: 'Palaces, forts and ancient cities',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80',
        href: '/packages?q=heritage',
        accent: 'from-amber-500/40 via-amber-500/20',
    },
];

export default function ExperienceCards() {
    return (
        <section className="py-20 lg:py-24 bg-white">
            <div className="container-x">
                <div className="max-w-2xl mb-10">
                    <span className="eyebrow">Experiences</span>
                    <h2 className="section-title">Travel that matches your mood</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {EXPERIENCES.map((e, i) => (
                        <motion.div
                            key={e.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            <Link
                                to={e.href}
                                className="group relative block overflow-hidden rounded-3xl aspect-[3/4] bg-slate-900"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1300ms] group-hover:scale-110"
                                    style={{ backgroundImage: `url(${e.image})` }}
                                />
                                {/* Two-layer gradient: bottom fade + themed colour wash on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${e.accent} to-transparent opacity-0 group-hover:opacity-100 transition duration-500`} />

                                <div className="absolute bottom-5 left-5 right-5 text-white">
                                    <h3 className="font-display font-extrabold text-3xl md:text-[28px] lg:text-[30px] leading-none"
                                        style={{ letterSpacing: '-0.035em' }}>
                                        {e.title}
                                    </h3>
                                    <p className="text-white/80 text-sm mt-2 max-w-[90%]">{e.tagline}</p>
                                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-white group-hover:gap-3 transition-all">
                                        Explore trips <FiArrowRight />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
