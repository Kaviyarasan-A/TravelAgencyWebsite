/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        container: {
            center: true,
            padding: { DEFAULT: '1rem', lg: '2rem' },
            screens: { '2xl': '1280px' },
        },
        extend: {
            colors: {
                brand: {
                    50:  '#fff7ef',
                    100: '#ffe8d1',
                    200: '#ffcfa0',
                    300: '#ffae66',
                    400: '#ff8e33',
                    500: '#ff7a00',
                    600: '#e96b00',
                    700: '#c25900',
                    800: '#934400',
                    900: '#5c2b00',
                },
                ink: {
                    DEFAULT: '#0b0f1a',
                    soft: '#141a2a',
                    muted: '#5b6478',
                    line: '#e7eaf2',
                },
                accent: '#ffd166',
            },
            fontFamily: {
                sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                display: ['"Playfair Display"', 'Georgia', 'serif'],
                script: ['"Dancing Script"', 'cursive'],
            },
            boxShadow: {
                soft: '0 6px 16px rgba(10,15,40,0.06)',
                card: '0 20px 44px rgba(10,15,40,0.10)',
                float: '0 30px 80px rgba(10,15,40,0.18)',
                brand: '0 14px 40px rgba(255,122,0,0.35)',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            animation: {
                'fade-in': 'fadeIn .6s ease-out both',
                'slide-up': 'slideUp .8s ease-out both',
                'float-y': 'floatY 6s ease-in-out infinite',
                'float-y-slow': 'floatY 10s ease-in-out infinite',
                'pulse-ring': 'pulseRing 2s ease-out infinite',
                'zoom-slow': 'zoomSlow 18s ease-in-out infinite alternate',
                'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'marquee': 'marquee 40s linear infinite',
                'marquee-fast': 'marquee 22s linear infinite',
                'drift': 'drift 18s ease-in-out infinite alternate',
                'grad-shift': 'gradShift 16s ease infinite',
                'blob': 'blob 14s ease-in-out infinite',
                'spin-slow': 'spin 22s linear infinite',
                'tilt': 'tilt 10s ease-in-out infinite',
                'wa-ping': 'waPing 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
                slideUp: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'none' } },
                floatY: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
                pulseRing: {
                    '0%': { boxShadow: '0 0 0 0 rgba(255,122,0,0.55)' },
                    '70%': { boxShadow: '0 0 0 14px rgba(255,122,0,0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(255,122,0,0)' },
                },
                zoomSlow: { '0%': { transform: 'scale(1.04)' }, '100%': { transform: 'scale(1.12)' } },
                bounceSlow: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(255,122,0,0.3), 0 0 20px rgba(255,122,0,0.1)' },
                    '100%': { boxShadow: '0 0 20px rgba(255,122,0,0.5), 0 0 40px rgba(255,122,0,0.2)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                drift: {
                    '0%': { transform: 'translate(0,0) scale(1)' },
                    '50%': { transform: 'translate(40px,-30px) scale(1.05)' },
                    '100%': { transform: 'translate(-30px,40px) scale(0.95)' },
                },
                gradShift: {
                    '0%,100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                },
                blob: {
                    '0%,100%': { 'border-radius': '42% 58% 62% 38% / 48% 40% 60% 52%' },
                    '50%':     { 'border-radius': '58% 42% 38% 62% / 40% 56% 44% 60%' },
                },
                tilt: {
                    '0%,100%': { transform: 'rotate(-2deg)' },
                    '50%':     { transform: 'rotate(2deg)' },
                },
                waPing: {
                    '0%':   { transform: 'scale(1)',   opacity: 0.7 },
                    '70%':  { transform: 'scale(1.5)', opacity: 0 },
                    '100%': { transform: 'scale(1.5)', opacity: 0 },
                },
            },
            backgroundImage: {
                'hero-grad': 'linear-gradient(180deg, rgba(11,15,26,0.55) 0%, rgba(11,15,26,0.75) 60%, rgba(11,15,26,0.95) 100%)',
                'brand-grad': 'linear-gradient(135deg, #ff7a00 0%, #e96b00 100%)',
            },
        },
    },
    plugins: [],
};
