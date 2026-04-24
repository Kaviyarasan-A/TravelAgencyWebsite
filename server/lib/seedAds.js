/**
 * Default promotional ads shown on the public site. After first boot the
 * admin panel is the source of truth (db/ads.json).
 *
 * Placements:
 *   - home_hero       → scrolling promo banner at top of home page
 *   - home_mid        → feature card between home sections
 *   - packages_top    → banner at top of /packages
 *   - sitewide_strip  → thin strip under top-bar nav (goes everywhere)
 */
export const SEED_ADS = [
    {
        title: 'Summer 2026 — Kerala Backwaters',
        subtitle: 'Flat 20% off on all 5N houseboat packages',
        description: 'Handpicked houseboats, private sundeck, all-meals included. Limited slots for Apr–Jun.',
        badge: 'Limited Time',
        ctaText: 'Grab the deal',
        ctaLink: '/packages?tag=Backwaters',
        image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1600',
        video: '',
        placement: 'home_hero',
        priority: 10,
        active: true,
        theme: 'brand',
    },
    {
        title: 'Free SOP review for UK applicants',
        subtitle: 'Book a 30-min counselling session — zero cost',
        description: 'Sept 2026 UK intake closing soon. Our counsellors have placed 400+ students this cycle.',
        badge: 'Study Abroad',
        ctaText: 'Book free session',
        ctaLink: '/study-abroad',
        image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1600',
        placement: 'home_mid',
        priority: 8,
        active: true,
        theme: 'blue',
    },
    {
        title: 'Dubai Business Setup — 7-day setup, 0% tax',
        subtitle: 'Free zone licence + banking + visa',
        description: 'Book a strategy call with a licensed UAE business advisor. No obligation.',
        badge: 'Business Setup',
        ctaText: 'Talk to advisor',
        ctaLink: '/business-setup',
        image: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=1600',
        video: '',
        placement: 'packages_top',
        priority: 5,
        active: true,
        theme: 'emerald',
    },
    {
        title: 'Monsoon Sale — Up to 35% off on Goa & Kerala',
        subtitle: 'Apr–Jun 2026 · Use code MONSOON35',
        ctaText: 'View packages',
        ctaLink: '/packages',
        placement: 'sitewide_strip',
        priority: 1,
        active: true,
        theme: 'brand',
    },
];
