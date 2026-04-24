import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import BackToTop from './BackToTop.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';
import EnquiryPopup from './EnquiryPopup.jsx';
import AIChatbot from './AIChatbot.jsx';
import { SitewideStrip } from './AdBanner.jsx';
import CursorGlow from './CursorGlow.jsx';
import { BRAND } from '../data.js';

export default function Layout() {
    const { pathname } = useLocation();
    const [booting, setBooting] = useState(true);

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
    useEffect(() => {
        const t = setTimeout(() => setBooting(false), 500);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            {booting && (
                <div className="fixed inset-0 z-[9999] bg-ink text-white flex items-center justify-center animate-fade-in">
                    <div className="text-center">
                        <img src={BRAND.logo} alt={BRAND.name} className="h-24 w-auto mx-auto mb-4 animate-float-y" />
                        <p className="tracking-widest text-sm opacity-80">PREPARING YOUR JOURNEY…</p>
                    </div>
                </div>
            )}
            <CursorGlow />
            <SitewideStrip />
            <Navbar />
            {/* Navbar is now fixed (80px). On the home route, the hero absorbs that space.
                Every other route needs to push its content down below the fixed navbar. */}
            <main className={`min-h-screen ${pathname === '/' ? '' : 'pt-20'}`}>
                <Outlet />
            </main>
            <Footer />
            <BackToTop />
            <WhatsAppButton />
            <EnquiryPopup />
            <AIChatbot />
        </>
    );
}
