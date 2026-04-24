/**
 * AuroraBackground — pure-CSS animated conic-gradient blobs that drift
 * around the section slowly. No videos, no external CDN deps, no images.
 * Runs on the GPU (transform + filter), ~60fps.
 *
 * Four variants:
 *   sunset  — warm orange + pink + gold (default; matches brand)
 *   ocean   — cyan + blue + teal
 *   forest  — green + lime + emerald
 *   midnight — deep blues + violet (for dark sections)
 *
 * Drop it inside any `relative` container (absolute-positioned,
 * pointer-events:none). Add `intensity` (0 to 1) to tune brightness.
 */
const PALETTES = {
    sunset: {
        a: 'rgba(255,122,0,0.55)',   // brand orange
        b: 'rgba(255,209,102,0.55)', // amber
        c: 'rgba(244,63,94,0.45)',   // rose
        d: 'rgba(251,146,60,0.5)',   // orange-400
    },
    ocean: {
        a: 'rgba(14,165,233,0.55)',  // sky
        b: 'rgba(6,182,212,0.5)',    // cyan
        c: 'rgba(20,184,166,0.5)',   // teal
        d: 'rgba(59,130,246,0.45)',  // blue
    },
    forest: {
        a: 'rgba(34,197,94,0.55)',   // emerald
        b: 'rgba(132,204,22,0.5)',   // lime
        c: 'rgba(16,185,129,0.5)',   // teal
        d: 'rgba(5,150,105,0.5)',    // green-600
    },
    midnight: {
        a: 'rgba(99,102,241,0.55)',  // indigo
        b: 'rgba(139,92,246,0.5)',   // violet
        c: 'rgba(59,130,246,0.45)',  // blue
        d: 'rgba(255,122,0,0.3)',    // brand accent
    },
};

export default function AuroraBackground({ variant = 'sunset', intensity = 1, className = '' }) {
    const c = PALETTES[variant] || PALETTES.sunset;

    return (
        <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Blob A — top left, drifts right */}
            <div
                className="absolute -top-32 -left-24 w-[42rem] h-[42rem] rounded-full blur-3xl"
                style={{
                    background: `radial-gradient(circle, ${c.a} 0%, transparent 60%)`,
                    opacity: intensity,
                    animation: 'aurora-drift-a 24s ease-in-out infinite alternate',
                }}
            />
            {/* Blob B — bottom right */}
            <div
                className="absolute -bottom-40 -right-20 w-[44rem] h-[44rem] rounded-full blur-3xl"
                style={{
                    background: `radial-gradient(circle, ${c.b} 0%, transparent 60%)`,
                    opacity: intensity * 0.9,
                    animation: 'aurora-drift-b 30s ease-in-out infinite alternate',
                }}
            />
            {/* Blob C — centre accent */}
            <div
                className="absolute top-1/2 left-1/2 w-[30rem] h-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                    background: `radial-gradient(circle, ${c.c} 0%, transparent 60%)`,
                    opacity: intensity * 0.6,
                    animation: 'aurora-drift-c 40s ease-in-out infinite',
                }}
            />
            {/* Blob D — small wandering highlight */}
            <div
                className="absolute top-1/4 right-1/3 w-[22rem] h-[22rem] rounded-full blur-2xl"
                style={{
                    background: `radial-gradient(circle, ${c.d} 0%, transparent 65%)`,
                    opacity: intensity * 0.8,
                    animation: 'aurora-drift-d 20s ease-in-out infinite alternate',
                }}
            />

            <style>{`
                @keyframes aurora-drift-a {
                    0%   { transform: translate(0,0) scale(1); }
                    100% { transform: translate(120px, 80px) scale(1.1); }
                }
                @keyframes aurora-drift-b {
                    0%   { transform: translate(0,0) scale(1); }
                    100% { transform: translate(-80px, -60px) scale(1.15); }
                }
                @keyframes aurora-drift-c {
                    0%   { transform: translate(-50%,-50%) scale(1); }
                    50%  { transform: translate(calc(-50% + 60px), calc(-50% - 40px)) scale(1.2); }
                    100% { transform: translate(-50%,-50%) scale(1); }
                }
                @keyframes aurora-drift-d {
                    0%   { transform: translate(0,0) scale(1); }
                    100% { transform: translate(-90px, 60px) scale(0.95); }
                }
            `}</style>
        </div>
    );
}
