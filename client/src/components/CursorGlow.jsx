import { useEffect, useRef } from 'react';

/**
 * A soft, brand-colored glow that follows the cursor. Pure DOM,
 * no re-renders, no React state — the orb is moved via
 * CSS transforms from a pointermove listener on window.
 *
 * Disabled on touch devices automatically.
 */
export default function CursorGlow() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        // Skip on touch devices — no cursor to follow
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let raf;

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
        };
        const tick = () => {
            // ring lags the dot (easing) for a nice trailing effect
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
            raf = requestAnimationFrame(tick);
        };

        window.addEventListener('pointermove', onMove);
        raf = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('pointermove', onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <>
            {/* Soft glow orb (lags behind the dot) */}
            <div
                ref={ringRef}
                aria-hidden="true"
                className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] hidden md:block"
                style={{
                    background: 'radial-gradient(circle, rgba(255,122,0,0.35) 0%, rgba(255,122,0,0) 70%)',
                    filter: 'blur(8px)',
                    transition: 'width 0.2s, height 0.2s',
                    willChange: 'transform',
                }}
            />
            {/* Tight centre dot that snaps to cursor */}
            <div
                ref={dotRef}
                aria-hidden="true"
                className="fixed top-0 left-0 w-2 h-2 rounded-full bg-brand-500 pointer-events-none z-[10000] hidden md:block"
                style={{ mixBlendMode: 'difference', willChange: 'transform' }}
            />
        </>
    );
}
