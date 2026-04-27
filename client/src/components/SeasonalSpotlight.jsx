import { motion } from 'framer-motion';
import { FiArrowRight, FiSun, FiCloudRain, FiCloudSnow, FiCloud } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PackageCard from './PackageCard.jsx';
import { useSeasonal } from '../hooks/useSeasonal.js';

const SEASON_META = {
    summer:  { icon: <FiSun />,       gradient: 'from-amber-400 via-orange-400 to-brand-500',     emoji: '☀️' },
    monsoon: { icon: <FiCloudRain />, gradient: 'from-emerald-400 via-teal-500 to-cyan-600',      emoji: '🌧️' },
    winter:  { icon: <FiCloudSnow />, gradient: 'from-sky-400 via-indigo-500 to-violet-600',      emoji: '❄️' },
    spring:  { icon: <FiCloud />,     gradient: 'from-pink-400 via-rose-400 to-fuchsia-500',      emoji: '🌸' },
};

/**
 * Surfaces whatever the admin marked as featured for the currently-active
 * season. Renders nothing if there are no featured packages — so the page
 * stays clean for fresh installs.
 */
export default function SeasonalSpotlight({ onBook }) {
    const seasonal = useSeasonal();
    if (!seasonal) return null;
    const { active, label, tagline, featured } = seasonal;
    if (!Array.isArray(featured) || featured.length === 0) return null;

    const meta = SEASON_META[active] || SEASON_META.summer;
    const seasonName = active ? active[0].toUpperCase() + active.slice(1) : 'Curated';

    return (
        <section className="relative py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white">
            <div aria-hidden className="absolute inset-0 pointer-events-none">
                <div className={`absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br ${meta.gradient} opacity-15 blur-3xl`} />
                <div className={`absolute -bottom-48 -left-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr ${meta.gradient} opacity-10 blur-3xl`} />
            </div>

            <div className="container-x relative">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55 }}
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
                >
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2.5 mb-4">
                            <span className={`inline-flex items-center gap-2 px-3.5 h-8 rounded-full bg-gradient-to-r ${meta.gradient} text-white text-[11px] font-display font-bold uppercase tracking-[2.5px] shadow-lg`}>
                                <span className="text-base leading-none">{meta.emoji}</span>
                                {seasonName} · Live now
                            </span>
                        </div>
                        <h2 className="font-display font-bold text-ink leading-[0.98]"
                            style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.025em' }}>
                            {label || `${seasonName} picks`}
                        </h2>
                        {tagline && (
                            <p className="mt-4 text-ink-muted text-[15.5px] leading-relaxed max-w-xl">
                                {tagline}
                            </p>
                        )}
                    </div>
                    <Link to="/packages"
                        className="group inline-flex items-center gap-2 self-start lg:self-end text-ink hover:text-brand-500 font-display font-semibold text-[14px] tracking-[-0.01em] transition shrink-0">
                        Browse all packages
                        <span className="w-7 h-7 rounded-full bg-ink text-white group-hover:bg-brand-500 flex items-center justify-center transition">
                            <FiArrowRight size={12} />
                        </span>
                    </Link>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.slice(0, 6).map((pkg, i) => (
                        <PackageCard key={pkg.slug} pkg={pkg} index={i} onBook={onBook} />
                    ))}
                </div>
            </div>
        </section>
    );
}
