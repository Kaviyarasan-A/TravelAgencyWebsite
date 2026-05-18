import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    FiPhone, FiMail, FiMenu, FiX, FiChevronRight, FiChevronDown,
    FiMapPin, FiGlobe, FiArrowRight,
} from 'react-icons/fi';
import { BRAND } from '../data.js';
import { usePackages } from '../hooks/usePackages.js';

const LINKS = [
    { to: '/',              label: 'Home' },
    { to: '/packages',      label: 'Packages', mega: true },
    { to: '/study-abroad',  label: 'Study Abroad' },
    { to: '/business-setup',label: 'Business Setup' },
    { to: '/blog',          label: 'Blog' },
    { to: '/about',         label: 'About' },
    { to: '/contact',       label: 'Contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);   // auto-hide when scrolling DOWN, show when UP
    const [menuOpen, setMenuOpen] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false);
    const [mobilePackagesOpen, setMobilePackagesOpen] = useState(false);
    const { pathname } = useLocation();
    const packages = usePackages();
    const closeTimer = useRef(null);
    const lastY = useRef(0);

    // On the home hero, the navbar overlays a dark image — use transparent/light text
    // until the user scrolls past the hero. On every other page, always use the solid light theme.
    const isHome = pathname === '/';
    const transparent = isHome && !scrolled && !megaOpen;

    const openMega = () => {
        if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
        setMegaOpen(true);
    };
    const scheduleClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setMegaOpen(false), 180);
    };

    useEffect(() => { setMenuOpen(false); setMegaOpen(false); }, [pathname]);
    useEffect(() => () => closeTimer.current && clearTimeout(closeTimer.current), []);
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 10);
            // Auto-hide: scrolling DOWN past the navbar hides it; scrolling UP shows it.
            // Always show near the top of the page or when the mega/mobile menu is open.
            if (menuOpen || megaOpen || y < 80) {
                setHidden(false);
            } else if (y > lastY.current + 4) {
                setHidden(true);
            } else if (y < lastY.current - 4) {
                setHidden(false);
            }
            lastY.current = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [menuOpen, megaOpen]);

    // Group packages by category → region for mega menu
    const grouped = useMemo(() => {
        const map = { Domestic: {}, International: {} };
        for (const p of packages) {
            const cat = p.category === 'International' ? 'International' : 'Domestic';
            const region = p.region || (cat === 'Domestic' ? 'India' : 'Global');
            if (!map[cat][region]) map[cat][region] = [];
            map[cat][region].push(p);
        }
        return map;
    }, [packages]);

    return (
        <>
            {/* Main nav — auto-hides on scroll-down, reveals on scroll-up */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
                ${hidden ? '-translate-y-full' : 'translate-y-0'}
                ${transparent
                    ? 'bg-transparent'
                    : 'bg-white/95 backdrop-blur-xl shadow-soft border-b border-ink-line/60'}`}>
                <nav className="container-x flex items-center justify-between h-[68px] lg:h-[84px]">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 sm:gap-3.5 group transition-all duration-300 ${
                            transparent
                                ? 'bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xl pl-1.5 pr-4 sm:pr-5 py-1 rounded-full shadow-xl shadow-black/20'
                                : ''
                        }`}
                        aria-label={BRAND.name}
                    >
                        {/* Compact glowing logo */}
                        <span className="relative shrink-0">
                            {transparent && (
                                <span aria-hidden className="absolute inset-0 rounded-full animate-pulse-ring" />
                            )}
                            <span className={`relative block rounded-full p-[2px] transition-all duration-500
                                ${transparent
                                    ? 'bg-gradient-to-tr from-brand-500 via-amber-300 to-brand-500 shadow-[0_0_20px_rgba(255,122,0,0.5)]'
                                    : 'bg-gradient-to-tr from-brand-500 via-amber-400 to-brand-500 group-hover:shadow-[0_6px_18px_rgba(255,122,0,0.3)]'}`}>
                                <span className={`block rounded-full p-[1.5px] ${transparent ? 'bg-ink/80' : 'bg-white'}`}>
                                    <img
                                        src={BRAND.logo}
                                        alt={BRAND.name}
                                        className="h-10 sm:h-11 lg:h-14 w-10 sm:w-11 lg:w-14 object-cover rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]"
                                    />
                                </span>
                            </span>
                        </span>

                        {/* Brand wordmark + tagline — Playfair italic, decorative + compact */}
                        <span className="hidden sm:flex flex-col leading-none">
                            <span className="relative">
                                <span className={`font-brand text-[24px] lg:text-[32px] tracking-normal transition-all duration-300 bg-clip-text text-transparent
                                    ${transparent
                                        ? 'bg-gradient-to-r from-white via-amber-100 to-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]'
                                        : 'bg-gradient-to-r from-brand-600 via-amber-500 to-brand-600 group-hover:from-brand-500 group-hover:via-amber-400 group-hover:to-brand-500'}`}
                                    style={{ letterSpacing: '0.005em', lineHeight: 1.05, paddingBottom: '0.08em' }}>
                                    {BRAND.name}
                                </span>
                                <span className={`absolute -right-2.5 top-0.5 w-1.5 h-1.5 rounded-full ${transparent ? 'bg-amber-300' : 'bg-brand-500'} animate-pulse`} />
                            </span>
                            <span className={`mt-1 flex items-center gap-1.5 font-script font-semibold text-[12px] lg:text-[14px] italic transition-all duration-300
                                ${transparent ? 'text-amber-200' : 'text-brand-500'}`}>
                                <span className={`block h-px w-3.5 ${transparent ? 'bg-amber-300/70' : 'bg-brand-400'} transition-all duration-500 group-hover:w-6`} />
                                {BRAND.tagline}
                            </span>
                        </span>
                    </Link>

                    <ul className="hidden lg:flex items-center gap-7">
                        {LINKS.map((l) =>
                            l.mega ? (
                                <li key={l.to}
                                    className="relative"
                                    onMouseEnter={openMega}
                                    onMouseLeave={scheduleClose}>
                                    <NavLink
                                        to={l.to}
                                        end={l.to === '/'}
                                        className={({ isActive }) =>
                                            `relative font-medium text-[15px] transition hover:text-brand-400 inline-flex items-center gap-1
                                             ${isActive || megaOpen ? 'text-brand-500' : transparent ? 'text-white/95' : 'text-ink'}
                                             after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:bg-brand-500
                                             after:transition-all ${isActive || megaOpen ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`
                                        }
                                    >
                                        {l.label} <FiChevronDown className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} size={14} />
                                    </NavLink>
                                </li>
                            ) : (
                                <li key={l.to}>
                                    <NavLink
                                        to={l.to}
                                        end={l.to === '/'}
                                        className={({ isActive }) =>
                                            `relative font-medium text-[15px] transition hover:text-brand-400
                                             ${isActive ? 'text-brand-500' : transparent ? 'text-white/95' : 'text-ink'}
                                             after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:bg-brand-500
                                             after:transition-all ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`
                                        }
                                    >
                                        {l.label}
                                    </NavLink>
                                </li>
                            ),
                        )}
                    </ul>

                    <div className="flex items-center gap-3">
                        <Link to="/contact" className="hidden md:inline-flex btn-primary">
                            Get a Quote <FiChevronRight />
                        </Link>
                        <button
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                            className="lg:hidden w-10 h-10 rounded-lg border border-ink-line flex items-center justify-center hover:bg-ink hover:text-white transition"
                        >
                            <FiMenu size={22} />
                        </button>
                    </div>
                </nav>

                {/* Mega panel — includes invisible hover bridge above it */}
                <div
                    onMouseEnter={openMega}
                    onMouseLeave={scheduleClose}
                    className={`hidden lg:block absolute left-0 right-0 top-full origin-top transition-all duration-200 ${
                        megaOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'
                    }`}>
                    {/* Invisible bridge — lets the mouse cross the gap without closing */}
                    <div className="h-3 -mt-3" aria-hidden="true" />
                    <div className="bg-white border-t border-ink-line shadow-float">
                        <div className="container-x py-8 grid md:grid-cols-[1fr_1fr_260px] gap-10 items-stretch">
                            <MegaColumn
                                title="Domestic Packages"
                                icon={<FiMapPin />}
                                regions={grouped.Domestic}
                                viewAllHref="/packages?category=Domestic"
                            />
                            <MegaColumn
                                title="International Packages"
                                icon={<FiGlobe />}
                                regions={grouped.International}
                                viewAllHref="/packages?category=International"
                            />
                            <MegaFeature />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            <div className={`lg:hidden fixed inset-0 z-[100] transition ${menuOpen ? '' : 'pointer-events-none'}`}>
                <div
                    onClick={() => setMenuOpen(false)}
                    className={`absolute inset-0 bg-black/50 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
                />
                <aside
                    className={`absolute top-0 right-0 h-full w-[86%] max-w-sm bg-white shadow-float
                                transition-transform duration-300 overflow-y-auto
                                ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-ink-line sticky top-0 bg-white">
                        <span className="font-extrabold text-lg">Menu</span>
                        <button
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close"
                            className="w-10 h-10 rounded-lg border border-ink-line flex items-center justify-center hover:bg-ink hover:text-white transition"
                        >
                            <FiX size={22} />
                        </button>
                    </div>
                    <ul className="p-3">
                        {LINKS.map((l) =>
                            l.mega ? (
                                <li key={l.to}>
                                    <button
                                        onClick={() => setMobilePackagesOpen((x) => !x)}
                                        className="w-full flex items-center justify-between px-4 py-4 rounded-xl font-medium text-[15px] text-ink hover:bg-ink/5">
                                        <span>{l.label}</span>
                                        <FiChevronDown className={`opacity-60 transition-transform ${mobilePackagesOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {mobilePackagesOpen && (
                                        <div className="pl-3 pb-2 space-y-3">
                                            {['Domestic', 'International'].map((cat) => (
                                                <div key={cat}>
                                                    <div className="text-[11px] uppercase tracking-wider text-brand-500 font-bold px-2 mt-2 mb-1">{cat}</div>
                                                    <Link to={`/packages?category=${cat}`}
                                                        className="block px-3 py-2 rounded-lg text-sm text-ink hover:bg-brand-50 hover:text-brand-600">
                                                        All {cat.toLowerCase()} packages →
                                                    </Link>
                                                    {Object.entries(grouped[cat]).slice(0, 4).map(([region, pkgs]) => (
                                                        <div key={region}>
                                                            <div className="px-3 pt-2 pb-1 text-xs font-semibold text-ink-muted">{region}</div>
                                                            {pkgs.slice(0, 3).map((p) => (
                                                                <Link key={p.slug} to={`/packages/${p.slug}`}
                                                                    className="block px-3 py-1.5 rounded-lg text-[13px] text-ink hover:bg-brand-50 hover:text-brand-600">
                                                                    {p.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ) : (
                                <li key={l.to}>
                                    <NavLink
                                        to={l.to}
                                        end={l.to === '/'}
                                        className={({ isActive }) =>
                                            `flex items-center justify-between px-4 py-4 rounded-xl font-medium text-[15px]
                                             ${isActive ? 'text-brand-500 bg-brand-50' : 'text-ink hover:bg-ink/5'}`
                                        }
                                    >
                                        {l.label} <FiChevronRight className="opacity-40" />
                                    </NavLink>
                                </li>
                            ),
                        )}
                        <li className="mt-3 px-4">
                            <Link to="/contact" className="btn-primary w-full">Get a Quote</Link>
                        </li>
                    </ul>
                    <div className="px-5 py-5 border-t border-ink-line text-sm text-ink-muted">
                        <a href={`tel:${BRAND.phone.replace(/\s+/g,'')}`} className="flex items-center gap-2"><FiPhone className="text-brand-500" /> {BRAND.phone}</a>
                        <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 mt-2"><FiMail className="text-brand-500" /> {BRAND.email}</a>
                    </div>
                </aside>
            </div>
        </>
    );
}

function MegaColumn({ title, icon, regions, viewAllHref }) {
    const entries = Object.entries(regions);
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-500 font-bold mb-4">
                <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center">{icon}</span>
                {title}
            </div>
            {entries.length === 0 ? (
                <div className="text-sm text-ink-muted">No packages yet.</div>
            ) : (
                // Masonry-style multi-column layout — each region flows naturally without forcing equal row heights.
                // `columns-2` with `break-inside-avoid` keeps each region intact while filling gaps.
                <div className="columns-2 gap-x-6 [column-fill:_balance]">
                    {entries.map(([region, pkgs]) => (
                        <div key={region} className="break-inside-avoid mb-4 pb-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-ink mb-2">{region}</div>
                            <ul className="space-y-1">
                                {pkgs.slice(0, 5).map((p) => (
                                    <li key={p.slug}>
                                        <Link to={`/packages/${p.slug}`}
                                            className="block truncate text-[13.5px] text-ink-muted hover:text-brand-500 hover:translate-x-0.5 transition-all"
                                            title={p.title}>
                                            {p.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
            <Link to={viewAllHref}
                className="mt-auto pt-3 inline-flex items-center gap-1.5 text-brand-500 font-semibold text-sm hover:gap-3 transition-all">
                View all <FiArrowRight />
            </Link>
        </div>
    );
}

function MegaFeature() {
    return (
        <div className="relative rounded-2xl overflow-hidden min-h-[240px] bg-cover bg-center text-white"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
            <div className="relative p-5 flex flex-col h-full">
                <span className="inline-block text-[10px] uppercase tracking-widest bg-brand-500 text-white px-2 py-0.5 rounded w-max">Featured</span>
                <h4 className="font-display text-lg font-bold mt-auto">Custom itinerary in 24 hours</h4>
                <p className="text-xs opacity-85 mt-1">Tell us your dates and vibe — we'll plan it all for you.</p>
                <Link to="/contact" className="mt-3 btn-white btn-sm w-max">Request a quote</Link>
            </div>
        </div>
    );
}
