/**
 * AmbientBackdrop — drop inside any `relative` section to add soft animated
 * gradient blobs behind the content. Decorative only, pointer-events-none.
 *
 * Variants:
 *   warm  — orange + amber (default, on-brand)
 *   cool  — blue + teal    (section with calm tone)
 *   mixed — orange + blue  (hero / feature sections)
 *   dark  — subtle orange glow on dark sections
 */
export default function AmbientBackdrop({ variant = 'warm', className = '' }) {
    const palette = PALETTES[variant] || PALETTES.warm;
    return (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden -z-0 ${className}`}>
            <div
                className={`absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl animate-drift ${palette[0]}`}
                style={{ animationDuration: '18s' }}
            />
            <div
                className={`absolute -bottom-32 -right-24 w-[32rem] h-[32rem] rounded-full blur-3xl animate-drift ${palette[1]}`}
                style={{ animationDuration: '22s', animationDelay: '3s' }}
            />
            <div
                className={`absolute top-1/2 left-1/3 w-80 h-80 rounded-full blur-3xl animate-float-y-slow ${palette[2]}`}
                style={{ animationDelay: '1.5s' }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.4)_50%,transparent_51%),radial-gradient(1px_1px_at_80%_70%,rgba(255,255,255,0.35)_50%,transparent_51%),radial-gradient(1px_1px_at_40%_80%,rgba(255,255,255,0.3)_50%,transparent_51%)] opacity-0 dark:opacity-40" />
        </div>
    );
}

const PALETTES = {
    warm:  ['bg-brand-400/25',  'bg-amber-300/25',  'bg-orange-200/20'],
    cool:  ['bg-blue-400/25',   'bg-teal-300/25',   'bg-cyan-200/20'],
    mixed: ['bg-brand-500/25',  'bg-blue-500/20',   'bg-amber-300/20'],
    dark:  ['bg-brand-500/20',  'bg-indigo-500/15', 'bg-amber-400/10'],
};
