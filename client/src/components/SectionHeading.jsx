import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, script, subtitle, center = true, className = '' }) {
    const base = center ? 'text-center mx-auto' : 'text-left';
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className={`${base} max-w-2xl mb-12 ${className}`}
        >
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className="section-title text-balance">
                {title} {script && <span className="script text-[1.15em]">{script}</span>}
            </h2>
            {subtitle && <p className="mt-4 text-ink-muted text-[15.5px] leading-relaxed">{subtitle}</p>}
        </motion.div>
    );
}
