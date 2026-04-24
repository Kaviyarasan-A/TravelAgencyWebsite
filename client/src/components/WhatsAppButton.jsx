import { FaWhatsapp } from 'react-icons/fa';
import { BRAND } from '../data.js';

export default function WhatsAppButton() {
    const msg = encodeURIComponent("Hi Trip with uz team! I'd like to know more about your services.");
    const href = `https://wa.me/${BRAND.whatsapp}?text=${msg}`;
    return (
        <div className="fixed right-6 bottom-24 z-40 group">
            <a
                href={href}
                target="_blank" rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="relative w-14 h-14 rounded-full bg-[#25D366] text-white
                           shadow-[0_14px_36px_rgba(37,211,102,0.5)]
                           hover:scale-110 hover:shadow-[0_18px_44px_rgba(37,211,102,0.7)]
                           transition-transform duration-200
                           flex items-center justify-center"
            >
                {/* Green pulse ring */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-70 animate-wa-ping pointer-events-none" />
                <FaWhatsapp className="relative" size={26} />
            </a>
            {/* Tooltip on hover */}
            <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-semibold
                             bg-ink text-white px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100
                             pointer-events-none transition-opacity duration-200
                             before:content-[''] before:absolute before:right-[-4px] before:top-1/2 before:-translate-y-1/2
                             before:w-2 before:h-2 before:bg-ink before:rotate-45">
                Chat on WhatsApp
            </span>
        </div>
    );
}
