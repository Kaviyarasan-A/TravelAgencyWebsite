import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { BRAND } from '../data.js';

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-[#070a12] text-white/75 pt-20">
            <div className="container-x grid md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr] gap-10 pb-12">
                <div>
                    <Link to="/" className="flex items-center gap-3 mb-4 text-white font-extrabold text-xl" aria-label={BRAND.name}>
                        <img src={BRAND.logo} alt={BRAND.name} className="h-14 w-auto object-contain bg-white/5 rounded-xl p-1.5" />
                        <span>{BRAND.name}</span>
                    </Link>
                    <p className="text-sm leading-7 max-w-sm">
                        Curated holiday packages, study-abroad counselling and business setup services —
                        trusted by 25,000+ travelers and founders since 2011.
                    </p>
                    <div className="flex gap-3 mt-5">
                        {[
                            { icon: <FaFacebookF />,  url: BRAND.social.facebook, label: 'Facebook' },
                            { icon: <FaInstagram />, url: BRAND.social.instagram, label: 'Instagram' },
                            { icon: <FaTwitter />,   url: BRAND.social.twitter,  label: 'Twitter' },
                            { icon: <FaYoutube />,   url: BRAND.social.youtube,  label: 'YouTube' },
                            { icon: <FaLinkedinIn />,url: BRAND.social.linkedin, label: 'LinkedIn' },
                        ].map((s) => (
                            <a key={s.label} href={s.url} aria-label={s.label}
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-500 hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300">
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4 text-base">Services</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/packages" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">Holiday Packages</Link></li>
                        <li><Link to="/study-abroad" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">Study Abroad</Link></li>
                        <li><Link to="/business-setup" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">Business Setup</Link></li>
                        <li><Link to="/packages?tag=Beach" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">Beach Tours</Link></li>
                        <li><Link to="/contact" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">Group Travel</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4 text-base">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/about" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">Contact</Link></li>
                        <li><Link to="/careers" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">Careers</Link></li>
                        <li><Link to="/terms" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">Terms of Service</Link></li>
                        <li><Link to="/privacy" className="hover:text-brand-500 hover:translate-x-1 inline-block transition-all duration-200">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4 text-base">Get in Touch</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex gap-3"><FiMapPin className="text-brand-500 mt-0.5 shrink-0" /> {BRAND.address}</li>
                        <li className="flex gap-3"><FiPhone  className="text-brand-500 mt-0.5 shrink-0" /><a href={`tel:${BRAND.phone.replace(/\s+/g,'')}`}>{BRAND.phone}</a></li>
                        {BRAND.phone2 && <li className="flex gap-3"><FiPhone  className="text-brand-500 mt-0.5 shrink-0" /><a href={`tel:${BRAND.phone2.replace(/\s+/g,'')}`}>{BRAND.phone2}</a></li>}
                        <li className="flex gap-3"><FiMail   className="text-brand-500 mt-0.5 shrink-0" /><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
                        <li className="flex gap-3"><FiClock  className="text-brand-500 mt-0.5 shrink-0" /> {BRAND.hours}</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 bg-[#050810]">
                <div className="container-x py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/55">
                    <p>&copy; {year} {BRAND.name}. All rights reserved.</p>
                    <p>Crafted with <span className="text-brand-500">♥</span> for modern travelers & founders.</p>
                </div>
            </div>
        </footer>
    );
}
