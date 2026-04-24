import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiHeart, FiSend } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import { BRAND } from '../data.js';

const OPENINGS = [
    { title: 'Travel Consultant', type: 'Full-time', location: 'Salem, TN', desc: 'Help clients plan dream holidays across India. Strong communication and destination knowledge required.' },
    { title: 'Study Abroad Counsellor', type: 'Full-time', location: 'Salem, TN', desc: 'Guide students through university selection, applications, visa and pre-departure. Education sector experience preferred.' },
    { title: 'Digital Marketing Executive', type: 'Full-time', location: 'Remote / Salem', desc: 'Run social media, Google Ads and content strategy to grow our online presence. 1+ year experience preferred.' },
    { title: 'Business Development Manager', type: 'Full-time', location: 'Salem, TN', desc: 'Build partnerships with hotels, transport and activity providers. Travel industry network is a plus.' },
];

const PERKS = [
    { icon: <FiMapPin />, t: 'Travel Perks', d: 'Discounted trips and FAM tours to explore destinations firsthand.' },
    { icon: <FiBriefcase />, t: 'Growth Path', d: 'Clear promotion ladder with skill-based progression, not just tenure.' },
    { icon: <FiHeart />, t: 'Work-Life Balance', d: 'Flexible hours, remote-friendly roles, and generous paid time off.' },
];

export default function Careers() {
    return (
        <>
            <Helmet>
                <title>Careers | Trip with uz</title>
                <meta name="description" content="Join the Trip with uz team. Explore open positions in travel consulting, study abroad counselling, marketing and more." />
            </Helmet>

            <section className="relative py-24 text-white overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg, rgba(11,15,26,0.72), rgba(11,15,26,0.9)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2000&q=80')" }} />
                <div className="container-x relative text-center max-w-3xl mx-auto">
                    <span className="eyebrow !text-brand-400">Join Our Team</span>
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                        Build careers that take people <span className="font-script text-accent">places.</span>
                    </h1>
                    <p className="mt-5 text-white/85 text-lg">
                        We're a passionate team in Salem helping thousands travel, study and set up businesses across the world. Come grow with us.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container-x">
                    <SectionHeading eyebrow="Why Work With Us" title="Perks of being" script="one of us" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {PERKS.map((p, i) => (
                            <motion.div
                                key={p.t}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="card p-8 hover-glow group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-brand-grad text-white flex items-center justify-center text-2xl shadow-brand mb-4 group-hover:scale-110 transition-transform duration-300">{p.icon}</div>
                                <h3 className="font-display text-xl font-bold mb-2">{p.t}</h3>
                                <p className="text-ink-muted leading-relaxed">{p.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-ink-line/30">
                <div className="container-x">
                    <SectionHeading eyebrow="Open Positions" title="Current" script="Openings" subtitle="Don't see a fit? Send us your resume anyway — we're always looking for great people." />
                    <div className="space-y-4">
                        {OPENINGS.map((job, i) => (
                            <motion.div
                                key={job.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="card p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover-glow"
                            >
                                <div className="flex-1">
                                    <h3 className="font-display text-lg font-bold text-ink">{job.title}</h3>
                                    <div className="flex gap-3 text-sm text-ink-muted mt-1">
                                        <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 text-xs font-medium">{job.type}</span>
                                        <span className="flex items-center gap-1"><FiMapPin className="text-brand-500" /> {job.location}</span>
                                    </div>
                                    <p className="text-sm text-ink-muted mt-2">{job.desc}</p>
                                </div>
                                <a href={`mailto:${BRAND.email}?subject=Application: ${job.title}`} className="btn-primary btn-sm shrink-0">
                                    <FiSend /> Apply Now
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-10 card p-8 text-center">
                        <h3 className="font-display text-xl font-bold text-ink mb-2">Don't see your role?</h3>
                        <p className="text-ink-muted mb-4">Send your resume to <a href={`mailto:${BRAND.email}`} className="text-brand-500 font-semibold">{BRAND.email}</a> and we'll keep you in mind.</p>
                        <Link to="/contact" className="btn-outline">Get in Touch</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
