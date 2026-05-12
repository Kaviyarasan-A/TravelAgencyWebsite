import { useEffect, useState } from 'react';

const FALLBACK = 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1200';

/**
 * Renders an absolutely-positioned background image with a graceful fallback.
 * If the provided `src` 404s or never loads, the component swaps in a stable
 * travel-themed Pexels image so the card never shows an empty grey box.
 */
export default function SafeBgImage({ src, fallback = FALLBACK, className = '', style = {} }) {
    const [ok, setOk] = useState(true);

    useEffect(() => { setOk(true); }, [src]);

    const url = ok && src ? src : fallback;
    return (
        <>
            <div
                className={className}
                style={{ ...style, backgroundImage: `url(${url})` }}
            />
            {src && ok && (
                <img src={src} alt="" aria-hidden className="hidden" onError={() => setOk(false)} />
            )}
        </>
    );
}
