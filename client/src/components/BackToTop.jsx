import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export default function BackToTop() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const on = () => setShow(window.scrollY > 500);
        window.addEventListener('scroll', on, { passive: true });
        on();
        return () => window.removeEventListener('scroll', on);
    }, []);
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className={`fixed right-6 bottom-24 md:bottom-6 z-40 w-11 h-11 rounded-xl
                        bg-brand-grad text-white shadow-brand transition
                        hover:-translate-y-1
                        ${show ? 'opacity-100 visible' : 'opacity-0 invisible translate-y-2'}`}
        >
            <FiArrowUp className="mx-auto" />
        </button>
    );
}
