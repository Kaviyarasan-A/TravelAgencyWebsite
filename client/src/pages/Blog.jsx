import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch, FiTag } from 'react-icons/fi';
import { useBlogs } from '../hooks/useBlogs.js';
import AuroraBackground from '../components/AuroraBackground.jsx';
import { BRAND } from '../data.js';

function formatDate(d) {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return d; }
}

export default function Blog() {
    const blogs = useBlogs();
    const [q, setQ] = useState('');
    const [tag, setTag] = useState('');

    const allTags = useMemo(() => {
        const s = new Set();
        blogs.forEach((b) => (b.tags || []).forEach((t) => s.add(t)));
        return ['All', ...Array.from(s)];
    }, [blogs]);

    const filtered = useMemo(() => blogs.filter((b) => {
        if (tag && tag !== 'All' && !(b.tags || []).includes(tag)) return false;
        if (q) {
            const hay = (b.title + ' ' + (b.excerpt || '') + ' ' + (b.tags || []).join(' ')).toLowerCase();
            if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
    }), [blogs, q, tag]);

    const featured = filtered[0];
    const rest = filtered.slice(1);

    return (
        <>
            <Helmet>
                <title>Travel Blog & Guides | {BRAND.name}</title>
                <meta name="description" content="Travel guides, itineraries and tips on India & international destinations, study abroad and overseas business setup from Trip with uz." />
            </Helmet>

            <section className="relative bg-ink text-white pt-28 pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
                <AuroraBackground variant="midnight" intensity={0.8} />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink/95" />

                <div className="container-x relative">
                    <div className="inline-flex items-center gap-3 mb-5">
                        <span className="w-8 h-px bg-brand-500" />
                        <span className="text-brand-500 text-[10px] font-bold uppercase tracking-[3px]">Field Notes</span>
                    </div>
                    <h1 className="font-display font-bold text-white leading-[0.95] max-w-3xl"
                        style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
                        Travel stories, guides &<br />
                        <span className="text-brand-500">honest tips.</span>
                    </h1>
                    <p className="mt-4 text-white/70 max-w-lg text-[15px] leading-relaxed">
                        Written by the same team that plans your trip. No sponsored fluff.
                    </p>
                </div>
            </section>

            <section className="sticky top-20 z-30 bg-white border-b border-ink-line py-5">
                <div className="container-x flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[220px] max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="input pl-11" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {allTags.slice(0, 8).map((t) => (
                            <button key={t} onClick={() => setTag(t === 'All' ? '' : t)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                                    ${(t === 'All' ? !tag : tag === t)
                                        ? 'bg-brand-500 text-white border-brand-500'
                                        : 'border-ink-line text-ink-muted hover:border-brand-500 hover:text-brand-500'}`}>
                                {t === 'All' ? t : <><FiTag className="inline mr-1" size={10} />{t}</>}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-14">
                <div className="container-x space-y-12">
                    {featured && (
                        <Link to={`/blog/${featured.slug}`}
                            className="group card overflow-hidden grid md:grid-cols-2 hover:shadow-card transition-all duration-300">
                            <div className="h-64 md:h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${featured.coverImage || featured.image})` }} />
                            <div className="p-8 flex flex-col justify-center">
                                <span className="eyebrow">Featured · {formatDate(featured.createdAt || featured.date)}</span>
                                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink leading-tight group-hover:text-brand-500 transition">
                                    {featured.title}
                                </h2>
                                <p className="text-ink-muted mt-3">{featured.excerpt}</p>
                                <span className="mt-5 text-brand-500 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Read the full article <FiArrowRight />
                                </span>
                                {featured.tags?.length > 0 && (
                                    <div className="mt-4 flex gap-1.5 flex-wrap">
                                        {featured.tags.slice(0, 3).map((t) => (
                                            <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-medium">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    )}

                    {rest.length > 0 && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rest.map((b, i) => (
                                <motion.article
                                    key={b.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                                    className="card overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all duration-300">
                                    <Link to={`/blog/${b.slug}`} className="block group">
                                        <div className="h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${b.coverImage || b.image})` }} />
                                        <div className="p-5">
                                            <div className="flex items-center gap-3 text-[11px] text-ink-muted">
                                                <span>{formatDate(b.createdAt || b.date)}</span>
                                                <span>·</span>
                                                <span>{b.author}</span>
                                            </div>
                                            <h3 className="font-display text-lg font-bold text-ink leading-snug mt-2 group-hover:text-brand-500 transition">{b.title}</h3>
                                            <p className="text-sm text-ink-muted mt-2 line-clamp-2">{b.excerpt}</p>
                                            {b.tags?.length > 0 && (
                                                <div className="mt-3 flex gap-1.5 flex-wrap">
                                                    {b.tags.slice(0, 2).map((t) => (
                                                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-medium">{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </div>
                    )}

                    {filtered.length === 0 && (
                        <div className="text-center py-20 text-ink-muted">
                            No articles match your filters.
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
