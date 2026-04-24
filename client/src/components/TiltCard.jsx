import { useRef } from 'react';

/**
 * Simple CSS-based mouse-tilt wrapper. On pointermove inside the element,
 * we apply a small `rotate3d()` based on cursor position. No external libs.
 *
 * Use it as the outermost element of a card:
 *   <TiltCard className="rounded-2xl overflow-hidden">
 *       ...your content...
 *   </TiltCard>
 */
export default function TiltCard({ children, className = '', max = 8, scale = 1.02 }) {
    const ref = useRef(null);

    const onMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) - 0.5;   // -0.5 .. 0.5
        const y = ((e.clientY - rect.top)  / rect.height) - 0.5;
        const rx = (-y * max).toFixed(2);  // rotate X (vertical mouse axis)
        const ry = ( x * max).toFixed(2);  // rotate Y (horizontal mouse axis)
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
    };

    const onLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
    };

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className={`transition-transform duration-200 will-change-transform ${className}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    );
}
