import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiArrowRight, FiStar, FiChevronLeft, FiChevronRight, FiPlay,
} from 'react-icons/fi';
import { usePackages } from '../hooks/usePackages.js';
import TourPreviewPopup from './TourPreviewPopup.jsx';

const HERO_SLIDES = [
    {
        location: 'Kerala, India',
        accent: 'differently',
        title: 'Discover the world',
        subtitle: 'Curated trips, honest prices, human support — from India to the world.',
        bg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=2400&q=80',
        preferSlug: 'kerala-gods-own-country',
    },
    {
        location: 'Dubai, UAE',
        accent: 'boldly',
        title: 'Chase horizons',
        subtitle: 'Skylines, deserts and yacht sunsets — planned the way locals would.',
        bg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2400&q=80',
        preferSlug: 'dubai-desert-luxury',
    },
    {
        location: 'Bali, Indonesia',
        accent: 'deeply',
        title: 'Travel slow,',
        subtitle: 'Jungle villas, rice-terrace sunrises and breakfasts that float.',
        bg: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=2400&q=80',
        preferSlug: 'bali-honeymoon-escape',
    },
];

export default function Hero() {
    const [slide, setSlide] = useState(0);
    const hoverRef = useRef(false);
    const PACKAGES = usePackages();
    const [previewPkg, setPreviewPkg] = useState(null);

    // Auto-advance the hero slide every ~9s unless user is hovering the gallery or the popup
    useEffect(() => {
        const t = setInterval(() => {
            if (!hoverRef.current && !previewPkg) setSlide((s) => (s + 1) % HERO_SLIDES.length);
        }, 9000);
        return () => clearInterval(t);
    }, [previewPkg]);

    const current = HERO_SLIDES[slide];

    // Reorder gallery so the "preferSlug" for the active slide is the featured card.
    const gallery = useMemo(() => {
        const withImages = PACKAGES.filter((p) => p.image);
        if (withImages.length < 4) return withImages;
        const prefer = current?.preferSlug
            ? withImages.findIndex((p) => p.slug === current.preferSlug)
            : -1;
        if (prefer > 0) {
            return [...withImages.slice(prefer), ...withImages.slice(0, prefer)];
        }
        return withImages;
    }, [PACKAGES, current]);

    return (
        <>
            <section className="relative min-h-screen flex items-stretch text-white overflow-hidden">
                {/* Background — animated slideshow */}
                <AnimatePresence mode="sync">
                    <motion.div
                        key={current.bg}
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1.0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${current.bg})` }}
                    />
                </AnimatePresence>

                {/* Multi-layer tint overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/60 to-brand-900/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50" />

                {/* Floating blurred orbs for motion / depth */}
                <div className="absolute -top-24 -left-32 w-96 h-96 rounded-full bg-brand-500/25 blur-3xl animate-float-y" />
                <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-blue-500/20 blur-3xl animate-float-y" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl animate-pulse-ring" />

                <div className="container-x relative z-10 pt-32 pb-20 lg:pt-40 lg:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center w-full">
                    {/* ------- Left: copy ------- */}
                    <motion.div
                        key={slide}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <div className="inline-flex items-center gap-2 text-[12px] text-white/85">
                            <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-white text-[10px]">
                                <FiMapPin />
                            </span>
                            <span className="uppercase tracking-widest">{current.location}</span>
                        </div>

                        <h1 className="mt-4 font-display font-extrabold leading-[1.05] text-white text-[40px] sm:text-[52px] lg:text-[64px]">
                            <span className="block">{current.title}</span>
                            <span className="relative inline-block">
                                <span className="italic">{current.accent}</span>
                                <span className="absolute left-0 right-0 -bottom-0.5 h-[5px] rounded bg-gradient-to-r from-brand-500 to-accent opacity-90" />
                            </span>
                        </h1>

                        <p className="mt-5 text-white/75 text-base sm:text-[17px] max-w-md leading-relaxed">
                            {current.subtitle}
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link to="/packages" className="btn-primary btn-lg">
                                Book Now <FiArrowRight />
                            </Link>
                            <Link to="/packages" className="btn-ghost btn-lg">
                                Discover
                            </Link>
                        </div>

                        {/* Slim trust row + slide dots, on one line */}
                        <div className="mt-8 flex items-center gap-6 text-[12px] text-white/70">
                            <span className="inline-flex items-center gap-1.5">
                                <FiStar className="text-accent fill-current" /> 4.9 · 25k+ travellers
                            </span>
                            <span className="h-4 w-px bg-white/20" />
                            <div className="flex items-center gap-1.5">
                                {HERO_SLIDES.map((_, i) => (
                                    <button
                                        key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                                        className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-6 bg-brand-500' : 'w-1.5 bg-white/30 hover:bg-white/60'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ------- Right: stacked image deck ------- */}
                    <div
                        className="relative hidden lg:block"
                        onMouseEnter={() => (hoverRef.current = true)}
                        onMouseLeave={() => (hoverRef.current = false)}
                    >
                        <HeroGallery
                            items={gallery}
                            slide={slide}
                            onPreview={(p) => setPreviewPkg(p)}
                        />
                    </div>
                </div>

                {/* Arrow nav */}
                <button
                    onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                    aria-label="Previous"
                    className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur hover:bg-white/25 text-white items-center justify-center z-20 border border-white/20 transition-all hover:scale-110">
                    <FiChevronLeft />
                </button>
                <button
                    onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
                    aria-label="Next"
                    className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur hover:bg-white/25 text-white items-center justify-center z-20 border border-white/20 transition-all hover:scale-110">
                    <FiChevronRight />
                </button>

                {/* Decorative scroll-indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs flex flex-col items-center gap-1 pointer-events-none">
                    <span className="uppercase tracking-widest">Scroll</span>
                    <span className="w-[2px] h-8 bg-gradient-to-b from-brand-500 to-transparent animate-pulse" />
                </div>
            </section>

            {/* Virtual tour popup — mounts above everything */}
            <TourPreviewPopup
                pkg={previewPkg}
                open={!!previewPkg}
                onClose={() => setPreviewPkg(null)}
            />
        </>
    );
}

/* Stacked gallery deck — syncs with hero `slide` and opens a virtual-tour
   popup after a hover-delay on any card. */
function HeroGallery({ items, slide, onPreview }) {
    const [active, setActive] = useState(0);
    const [hovered, setHovered] = useState(null);
    const hoverTimer = useRef(null);

    // When parent slide changes, reset the carousel to item 0 of the reordered list
    // (the package preferSlug is at index 0 there). This produces a fresh "deal"
    // of cards synchronized with the background change.
    const resetKey = useRef(0);
    useEffect(() => {
        setActive(0);
        resetKey.current += 1;
    }, [slide]);

    useEffect(() => {
        const t = setInterval(() => {
            if (hovered === null) setActive((a) => (a + 1) % items.length);
        }, 6500);
        return () => clearInterval(t);
    }, [items.length, hovered]);

    // Cleanup the hover delay timer on unmount
    useEffect(() => () => hoverTimer.current && clearTimeout(hoverTimer.current), []);

    const featured = hovered !== null ? hovered : active;
    const visible = 4;
    const arranged = Array.from({ length: visible }, (_, i) => {
        const idx = (featured + i) % items.length;
        return { ...items[idx], _idx: idx, _slot: i };
    });

    const heights = ['h-[400px]', 'h-[360px]', 'h-[320px]', 'h-[280px]'];
    const widths  = ['w-[58%]',   'w-[38%]',   'w-[28%]',   'w-[18%]'];
    const z       = [40, 30, 20, 10];

    const scheduleOpen = (pkg) => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        // Longer, deliberate hover delay — prevents the popup from flashing
        // when the mouse just sweeps across the deck.
        hoverTimer.current = setTimeout(() => onPreview?.(pkg), 1100);
    };
    const cancelOpen = () => {
        if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    };

    return (
        <motion.div
            key={`deck-${slide}`}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[540px]"
        >
            <div className="absolute inset-0 flex items-center justify-end gap-5">
                {arranged.map((p, i) => (
                    <motion.div
                        key={`${p?.slug || i}-${p._slot}-${slide}`}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 28, delay: i * 0.06 }}
                        onMouseEnter={() => { setHovered(p._idx); scheduleOpen(p); }}
                        onMouseLeave={() => { setHovered(null); cancelOpen(); }}
                        className={`relative ${heights[i]} ${widths[i]} rounded-3xl overflow-hidden shadow-float group cursor-pointer`}
                        style={{ zIndex: z[i] }}
                        whileHover={{ scale: 1.02, y: -6 }}
                    >
                        <Link to={p?.slug ? `/packages/${p.slug}` : '/packages'} className="block w-full h-full">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${p?.image})` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                            {/* Play-tour pulse on the featured card */}
                            {i === 0 && p?.tourVideo && (
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white bg-brand-500/90 backdrop-blur px-2.5 py-1 rounded-full shadow-brand">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        Virtual Tour
                                    </span>
                                </div>
                            )}

                            {/* Shine sweep on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'gradShift 1.8s ease-in-out infinite',
                                }} />

                            {/* Card detail — always on featured, fades in on others on hover */}
                            <div className={`absolute bottom-5 left-5 right-5 text-white transition-opacity duration-300 ${i === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <div className="text-[11px] uppercase tracking-widest opacity-85">{p?.country}</div>
                                <h3 className="font-display font-bold text-lg leading-tight mt-1 line-clamp-2">{p?.title}</h3>
                                <div className="mt-2 inline-flex items-center gap-2 text-xs">
                                    {p?.basePrice && (
                                        <span className="px-2 py-1 bg-brand-500 rounded-full font-semibold">
                                            From ₹{p.basePrice.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                    {p?.rating && (
                                        <span className="inline-flex items-center gap-1"><FiStar className="text-accent fill-current" /> {p.rating}</span>
                                    )}
                                </div>
                            </div>

                            {/* Play hint on thin peek cards */}
                            {i > 0 && (
                                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FiPlay size={14} />
                                </div>
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Pager */}
            <div className="absolute -bottom-2 right-0 flex gap-2">
                {items.slice(0, 6).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setActive(i); setHovered(null); }}
                        aria-label={`Go to package ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${i === featured ? 'w-6 bg-brand-500' : 'w-2 bg-white/30 hover:bg-white/60'}`}
                    />
                ))}
            </div>

            {/* Hover hint */}
            <div className="absolute -bottom-2 left-0 text-[11px] uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                <FiPlay size={10} className="text-brand-400" /> Hold to preview
            </div>
        </motion.div>
    );
}
