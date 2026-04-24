import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiMapPin } from 'react-icons/fi';
import { PACKAGES, BRAND } from '../data.js';

const BOT_NAME = 'TripBot';

const QUICK_REPLIES = [
    'Suggest a beach destination',
    'Best hill stations in India',
    'Plan a heritage tour',
    'Family trip suggestions',
    'Weekend getaway ideas',
];

function getBotReply(msg) {
    const lower = msg.toLowerCase();

    // Beach related
    if (lower.includes('beach') || lower.includes('goa') || lower.includes('sea') || lower.includes('ocean')) {
        const pkg = PACKAGES.find(p => p.slug === 'goa-beach-bliss');
        return {
            text: `For beaches, I'd highly recommend our **Goa Beach Bliss** package! ${pkg.days} days exploring North & South Goa — Baga Beach, Fort Aguada, Dudhsagar Waterfalls and more. Kerala also has beautiful beaches like Varkala and Kovalam.`,
            suggestion: pkg?.slug,
        };
    }

    // Hill station related
    if (lower.includes('hill') || lower.includes('mountain') || lower.includes('ooty') || lower.includes('kodaikanal') || lower.includes('munnar') || lower.includes('coorg') || lower.includes('cold') || lower.includes('cool')) {
        const pkg = PACKAGES.find(p => p.slug === 'tamil-nadu-temples-hills') || PACKAGES.find(p => p.slug === 'karnataka-adventure');
        return {
            text: `For hill stations, we have amazing options! **Tamil Nadu Temples & Hills** covers Ooty, Kodaikanal & Yercaud. Our **Karnataka** package includes Coorg & Chikmagalur with coffee plantations. And **Kerala** offers misty Munnar & Wayanad!`,
            suggestion: pkg?.slug,
        };
    }

    // Heritage / History
    if (lower.includes('heritage') || lower.includes('history') || lower.includes('temple') || lower.includes('fort') || lower.includes('monument') || lower.includes('taj') || lower.includes('delhi') || lower.includes('agra')) {
        const pkg = PACKAGES.find(p => p.slug === 'delhi-agra-heritage');
        return {
            text: `For heritage lovers, our **Delhi & Agra Heritage Trail** is a must — Taj Mahal, Red Fort, Qutub Minar! We also have **Maharashtra Explorer** (Gateway of India, Shaniwar Wada) and **Telangana Discovery** (Charminar, Golconda Fort).`,
            suggestion: pkg?.slug,
        };
    }

    // Kerala / Backwaters
    if (lower.includes('kerala') || lower.includes('backwater') || lower.includes('houseboat') || lower.includes('alleppey') || lower.includes('munnar')) {
        const pkg = PACKAGES.find(p => p.slug === 'kerala-gods-own-country');
        return {
            text: `Kerala is magical! Our **Kerala — God's Own Country** package is our highest-rated trip — 8 days covering Kochi, Munnar tea gardens, Alleppey houseboat cruise, Vagamon meadows & Wayanad wildlife. A perfect blend of nature & culture!`,
            suggestion: pkg?.slug,
        };
    }

    // Family
    if (lower.includes('family') || lower.includes('kids') || lower.includes('children')) {
        return {
            text: `For families, I recommend **Kerala** (houseboat + tea gardens — kids love it!), **Goa** (beaches + water sports), or **Karnataka** (Mysore Zoo, elephant camp, coffee plantations). All our packages are customizable for families!`,
            suggestion: 'kerala-gods-own-country',
        };
    }

    // Weekend / Short trip
    if (lower.includes('weekend') || lower.includes('short') || lower.includes('2 day') || lower.includes('3 day') || lower.includes('quick')) {
        return {
            text: `For a quick getaway, our **Telangana Discovery** (5 days) or **Delhi & Agra Heritage Trail** (5 days) are perfect! We can also customize any package to a shorter duration. Just tell us your dates and we'll plan it!`,
            suggestion: 'telangana-discovery',
        };
    }

    // Honeymoon / Romantic
    if (lower.includes('honeymoon') || lower.includes('romantic') || lower.includes('couple') || lower.includes('anniversary')) {
        return {
            text: `For a romantic getaway, **Kerala** is the top choice — private houseboats, misty Munnar, sunset at Varkala! **Goa** is perfect for beachside romance. **Coorg** in Karnataka is India's Scotland — incredibly romantic! Want me to suggest a specific package?`,
            suggestion: 'kerala-gods-own-country',
        };
    }

    // Karnataka
    if (lower.includes('karnataka') || lower.includes('bangalore') || lower.includes('mysore') || lower.includes('coorg') || lower.includes('chikmagalur')) {
        const pkg = PACKAGES.find(p => p.slug === 'karnataka-adventure');
        return {
            text: `Our **Karnataka Nature & Heritage** package is fantastic — 7 days covering Bangalore, Coorg (Abbey Falls, Raja's Seat), Chikmagalur (Mullayanagiri Peak), and Mysore Palace. It's a perfect mix of nature, adventure and heritage!`,
            suggestion: pkg?.slug,
        };
    }

    // Maharashtra
    if (lower.includes('maharashtra') || lower.includes('mumbai') || lower.includes('pune') || lower.includes('nashik')) {
        const pkg = PACKAGES.find(p => p.slug === 'maharashtra-explorer');
        return {
            text: `Our **Maharashtra Explorer** covers Mumbai (Gateway of India, Marine Drive), Pune (Shaniwar Wada, Aga Khan Palace) and Nashik (Trimbakeshwar, Sula Vineyards) — 7 amazing days of city vibes, history and wine country!`,
            suggestion: pkg?.slug,
        };
    }

    // Telangana / Hyderabad
    if (lower.includes('telangana') || lower.includes('hyderabad') || lower.includes('charminar') || lower.includes('biryani')) {
        const pkg = PACKAGES.find(p => p.slug === 'telangana-discovery');
        return {
            text: `Our **Telangana Cultural Discovery** is perfect — Charminar, Golconda Fort, the incredible Ramoji Film City, and a day trip to Warangal's ancient temples. 5 days of culture, history and amazing food!`,
            suggestion: pkg?.slug,
        };
    }

    // Tamil Nadu
    if (lower.includes('tamil') || lower.includes('pondicherry') || lower.includes('yercaud') || lower.includes('pollachi')) {
        const pkg = PACKAGES.find(p => p.slug === 'tamil-nadu-temples-hills');
        return {
            text: `Our **Tamil Nadu Temples & Hills** is an 8-day journey through Ooty, Kodaikanal, Pollachi, Pondicherry and Karaikudi — hill stations, French architecture, ancient temples and Chettinad heritage all in one trip!`,
            suggestion: pkg?.slug,
        };
    }

    // Greeting
    if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('start') || lower === 'help') {
        return {
            text: `Hello! I'm ${BOT_NAME}, your AI travel assistant at ${BRAND.name}. I can help you find the perfect trip across India! Try asking me about beaches, hill stations, heritage tours, honeymoon spots, or any specific destination. What kind of trip are you dreaming of?`,
        };
    }

    // Price / Cost
    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('budget') || lower.includes('rate') || lower.includes('charge')) {
        return {
            text: `We customize every trip to your needs, so pricing varies based on dates, group size and preferences. The best way to get a quote is to send us an enquiry — we'll get back with a detailed plan within 24 hours! You can also WhatsApp us directly for a quick response.`,
        };
    }

    // Contact
    if (lower.includes('contact') || lower.includes('call') || lower.includes('phone') || lower.includes('whatsapp') || lower.includes('email')) {
        return {
            text: `You can reach us at:\n**Phone:** ${BRAND.phone}\n**WhatsApp:** Click the green button at the bottom\n**Email:** ${BRAND.email}\n**Office:** ${BRAND.address}\n\nWe respond within 24 hours!`,
        };
    }

    // Thanks
    if (lower.includes('thank') || lower.includes('thanks') || lower.includes('great') || lower.includes('awesome') || lower.includes('perfect')) {
        return {
            text: `You're welcome! Happy to help. If you'd like to proceed with booking, just hit "Enquire Now" on any package or reach out to us directly. Have a wonderful trip planning experience!`,
        };
    }

    // Default
    return {
        text: `That's a great question! I can help you with:\n\n• **Beach** destinations (Goa, Kerala)\n• **Hill stations** (Ooty, Munnar, Coorg)\n• **Heritage** tours (Delhi, Hyderabad)\n• **Honeymoon** packages\n• **Family** trips\n\nOr ask about any specific state — Maharashtra, Karnataka, Tamil Nadu, Kerala, Telangana, Delhi & more!`,
    };
}

export default function AIChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: `Hi! I'm ${BOT_NAME}, your AI travel assistant. Ask me anything about our India tour packages — I'll help you find the perfect trip!` },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    const send = (text) => {
        if (!text.trim()) return;
        const userMsg = text.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setTyping(true);

        // Simulate thinking delay
        setTimeout(() => {
            const reply = getBotReply(userMsg);
            setMessages(prev => [...prev, { role: 'bot', text: reply.text, suggestion: reply.suggestion }]);
            setTyping(false);
        }, 600 + Math.random() * 800);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        send(input);
    };

    return (
        <>
            {/* Floating trigger button */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => setOpen(true)}
                        className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-brand-grad text-white shadow-brand
                                   flex items-center justify-center hover:scale-110 transition-transform animate-glow"
                        aria-label="Open AI Travel Assistant"
                    >
                        <FiMessageCircle size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 w-[calc(100%-2rem)] sm:w-[380px] h-[520px]
                                   bg-white rounded-3xl shadow-float border border-ink-line flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-brand-grad px-5 py-4 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                    <FiMessageCircle size={18} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{BOT_NAME}</div>
                                    <div className="text-[11px] text-white/80 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                                        AI Travel Assistant
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition">
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                                        ${m.role === 'user'
                                            ? 'bg-brand-500 text-white rounded-br-md'
                                            : 'bg-ink-line/50 text-ink rounded-bl-md'
                                        }`}
                                    >
                                        <div className="whitespace-pre-line" dangerouslySetInnerHTML={{
                                            __html: m.text
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\n/g, '<br/>')
                                        }} />
                                        {m.suggestion && (
                                            <a
                                                href={`/packages/${m.suggestion}`}
                                                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
                                                           bg-white text-brand-500 border border-brand-200 hover:bg-brand-50 transition"
                                            >
                                                <FiMapPin size={12} /> View Package
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {typing && (
                                <div className="flex justify-start">
                                    <div className="bg-ink-line/50 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>

                        {/* Quick replies */}
                        {messages.length <= 2 && (
                            <div className="px-4 pb-2 flex gap-2 flex-wrap">
                                {QUICK_REPLIES.slice(0, 3).map((qr) => (
                                    <button
                                        key={qr}
                                        onClick={() => send(qr)}
                                        className="text-xs px-3 py-1.5 rounded-full border border-brand-200 text-brand-500 hover:bg-brand-50 transition"
                                    >
                                        {qr}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-ink-line flex gap-2 shrink-0">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about destinations, trips..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-ink-line/30 text-sm text-ink placeholder:text-ink-muted
                                           outline-none focus:bg-ink-line/50 transition"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="w-10 h-10 rounded-xl bg-brand-grad text-white flex items-center justify-center
                                           disabled:opacity-40 hover:shadow-brand transition-all hover:scale-105"
                            >
                                <FiSend size={16} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
