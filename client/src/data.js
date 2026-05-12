// ---------------------------------------------------------------
// Site content — packages, destinations, study data, business data.
// ---------------------------------------------------------------

export const BRAND = {
    name: 'Trip with uz',
    logo: '/logo.png',
    ogImage: '/logo.png', // TODO: replace with /og-image.jpg (1200x630) — see PUBLIC_FOLDER_TODO.md
    siteUrl: 'https://tripwithuz.com',
    tagline: 'Your Trips · Your Vibes',
    phone: '+91 90870 06777',
    phone2: '+91 98430 12831',
    whatsapp: '919585680636',
    email: 'tripwithuzofficial@gmail.com',
    address: 'No. 2/113, Narasothipatti, Opposite Amman Bakery, Salem – 636004, Tamil Nadu, India',
    hours: 'Mon–Sat · 9:00 AM – 8:00 PM IST',
    geo: { latitude: 11.683555, longitude: 78.135265 }, // actual GBP coordinates
    // Google Business Profile — share / review / direct Maps URLs
    gbp: {
        shareUrl:  'https://share.google/UfYZ9ExJmRx4r1Kk6',
        reviewUrl: 'https://g.page/r/Cf5lmIQe-KpfEBM/review',
        cid:       '6893957108253123070',
        cidUrl:    'https://maps.google.com/?cid=6893957108253123070',
        // CID-based embed works without an API key
        embedUrl:  'https://maps.google.com/maps?q=Trip+With+Uz+Salem+Narasothipatti&t=&z=16&ie=UTF8&iwloc=&output=embed',
        // Driving directions — Google Maps will pick the best route from user's location
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Trip+With+Uz+Salem&destination_place_id=ChIJMzC5w_DwuzsR_mWYhB74ql8',
    },
    // TODO: paste real handles from user; placeholders kept so links never 404 within the same domain
    social: {
        facebook:  'https://www.facebook.com/tripwithuz',   // TODO: confirm real handle
        instagram: 'https://www.instagram.com/trip_with_uz',
        youtube:   'https://www.youtube.com/@tripwithuz',   // TODO: confirm real handle
    },
    // Tracking + verification — paste real values when ready
    tracking: {
        ga4MeasurementId:    'G-XXXXXXXXXX',       // TODO: paste GA4 Measurement ID
        searchConsoleVerify: 'TODO_GSC_CONTENT',   // TODO: paste Search Console HTML-tag content
        bingVerify:          'TODO_BING_CONTENT',  // TODO: paste Bing Webmaster meta content
    },
};

export const STATS = [
    { label: 'Destinations',    value: 120,   suffix: '+' },
    { label: 'Happy Travelers', value: 25000, suffix: '+' },
    { label: 'Years of Trust',  value: 15,    suffix: '+' },
    { label: 'Satisfaction',    value: 98,    suffix: '%' },
];

export const SERVICES = [
    {
        slug: 'tours',
        title: 'India Tours & Holidays',
        icon: 'plane',
        desc: 'Handpicked holiday packages across India — from beaches to hill stations, temples to forts — curated by locals.',
        bullets: ['Hotels + transfers included', 'Private and group departures', 'Customizable itineraries'],
        cta: 'Explore Packages',
        href: '/packages',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
    },
    {
        slug: 'study',
        title: 'Study Abroad',
        icon: 'graduation',
        desc: 'End-to-end overseas education — university shortlisting, applications, scholarships, visa, pre-departure and beyond.',
        bullets: ['1000+ partner universities', 'Scholarship guidance', 'Free first counselling session'],
        cta: 'Explore Study Abroad',
        href: '/study-abroad',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
    },
    {
        slug: 'business',
        title: 'Business Setup Abroad',
        icon: 'briefcase',
        desc: 'Launch and scale your company overseas — company formation, licensing, banking, investor visas and tax structuring.',
        bullets: ['Dubai · Singapore · UK · USA · more', 'Compliance & licensing', 'Dedicated setup manager'],
        cta: 'Explore Business Setup',
        href: '/business-setup',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    },
];

export const PACKAGES = [
    {
        slug: 'maharashtra-explorer',
        title: 'Maharashtra Explorer',
        country: 'India',
        city: 'Mumbai · Pune · Nashik',
        days: 7, nights: 6,
        rating: 4.9, reviews: 310,
        tags: ['Heritage', 'Culture', 'City'],
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
        highlights: [
            'Gateway of India & Marine Drive in Mumbai',
            'Shaniwar Wada & Aga Khan Palace in Pune',
            'Trimbakeshwar Temple & Sula Vineyards in Nashik',
            'Elephanta Caves & Siddhivinayak Temple',
        ],
        itinerary: [
            { d: 'Day 1', t: 'Arrival · Mumbai',       c: 'Arrive in Mumbai, check-in, evening walk at Marine Drive & Juhu Beach.' },
            { d: 'Day 2', t: 'Mumbai Sightseeing',      c: 'Gateway of India, Elephanta Caves, Film City Mumbai, Haji Ali Dargah.' },
            { d: 'Day 3', t: 'Mumbai to Pune',          c: 'Siddhivinayak Temple, travel to Pune, evening at Shaniwar Wada.' },
            { d: 'Day 4', t: 'Pune Exploration',        c: 'Aga Khan Palace, Sinhagad Fort, Mulshi Lake, Pataleshwar Cave Temple.' },
            { d: 'Day 5', t: 'Pune to Nashik',          c: 'Rajiv Gandhi Zoological Park, Khadakwasla Dam, travel to Nashik.' },
            { d: 'Day 6', t: 'Nashik Heritage',         c: 'Trimbakeshwar Temple, Sula Vineyards, Pandavleni Caves, Godavari River.' },
            { d: 'Day 7', t: 'Departure',               c: 'Anjneri Hills morning visit, Someshwar Waterfalls, departure.' },
        ],
        includes: ['6 nights hotel accommodation', 'Daily breakfast', 'All transfers & sightseeing', 'English-speaking guide'],
        excludes: ['Flights', 'Lunch & dinner', 'Personal expenses', 'Travel insurance'],
    },
    {
        slug: 'delhi-agra-heritage',
        title: 'Delhi & Agra Heritage Trail',
        country: 'India',
        city: 'Delhi · Agra',
        days: 5, nights: 4,
        rating: 4.8, reviews: 420,
        tags: ['Heritage', 'History', 'UNESCO'],
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
        highlights: [
            'Taj Mahal — UNESCO World Heritage Site',
            'Red Fort & India Gate in Delhi',
            'Qutub Minar & Lotus Temple',
            'Fatehpur Sikri & Agra Fort',
        ],
        itinerary: [
            { d: 'Day 1', t: 'Arrival · Delhi',        c: 'Arrive in Delhi, check-in, evening visit to India Gate & Jama Masjid.' },
            { d: 'Day 2', t: 'Delhi City Tour',        c: 'Red Fort, Qutub Minar, Lotus Temple, Akshardham Temple.' },
            { d: 'Day 3', t: 'Delhi to Agra',          c: 'Humayun\'s Tomb, travel to Agra, sunset at Mehtab Bagh with Taj view.' },
            { d: 'Day 4', t: 'Agra Exploration',       c: 'Taj Mahal sunrise, Agra Fort, Itmad-ud-Daulah Tomb, Fatehpur Sikri.' },
            { d: 'Day 5', t: 'Departure',              c: 'Akbar\'s Tomb, Jama Masjid Agra, departure.' },
        ],
        includes: ['4 nights hotel accommodation', 'Daily breakfast', 'AC transfers', 'Monument entry tickets'],
        excludes: ['Flights', 'Lunch & dinner', 'Camera fees at monuments', 'Travel insurance'],
    },
    {
        slug: 'goa-beach-bliss',
        title: 'Goa Beach Bliss',
        country: 'India',
        city: 'North Goa · South Goa',
        days: 5, nights: 4,
        rating: 4.9, reviews: 530,
        tags: ['Beach', 'Nightlife', 'Adventure'],
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
        highlights: [
            'Baga, Calangute & Anjuna beaches in North Goa',
            'Fort Aguada & Chapora Fort exploration',
            'Colva & Palolem beaches in South Goa',
            'Dudhsagar Waterfalls day trip',
        ],
        itinerary: [
            { d: 'Day 1', t: 'Arrival · North Goa',    c: 'Arrive in Goa, check-in, evening at Baga Beach & Calangute Beach.' },
            { d: 'Day 2', t: 'North Goa Tour',         c: 'Anjuna Beach, Vagator Beach, Fort Aguada, Chapora Fort, Candolim Beach.' },
            { d: 'Day 3', t: 'South Goa',              c: 'Colva Beach, Benaulim Beach, Palolem Beach, Cabo de Rama Fort.' },
            { d: 'Day 4', t: 'Adventure Day',          c: 'Dudhsagar Waterfalls, Agonda Beach, Butterfly Beach exploration.' },
            { d: 'Day 5', t: 'Departure',              c: 'Morning at leisure, departure.' },
        ],
        includes: ['4 nights beach resort', 'Daily breakfast', 'All transfers & tours', 'Dudhsagar trip included'],
        excludes: ['Flights', 'Water sports', 'Lunch & dinner', 'Travel insurance'],
    },
    {
        slug: 'telangana-discovery',
        title: 'Telangana Cultural Discovery',
        country: 'India',
        city: 'Hyderabad · Warangal',
        days: 5, nights: 4,
        rating: 4.8, reviews: 245,
        tags: ['Heritage', 'Culture', 'History'],
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
        highlights: [
            'Charminar & Golconda Fort in Hyderabad',
            'Ramoji Film City — world\'s largest film city',
            'Warangal Fort & Thousand Pillar Temple',
            'Hussain Sagar Lake & Birla Mandir',
        ],
        itinerary: [
            { d: 'Day 1', t: 'Arrival · Hyderabad',    c: 'Arrive in Hyderabad, check-in, evening at Hussain Sagar Lake & Birla Mandir.' },
            { d: 'Day 2', t: 'Hyderabad Heritage',     c: 'Charminar, Golconda Fort, Salar Jung Museum, Chowmahalla Palace.' },
            { d: 'Day 3', t: 'Ramoji Film City',       c: 'Full day at Ramoji Film City — guided tour, shows & attractions.' },
            { d: 'Day 4', t: 'Warangal Day Trip',      c: 'Warangal Fort, Ramappa Temple, Thousand Pillar Temple, Bhadrakali Temple.' },
            { d: 'Day 5', t: 'Departure',              c: 'Pakhal Lake visit, departure from Hyderabad.' },
        ],
        includes: ['4 nights hotel accommodation', 'Daily breakfast', 'All transfers & sightseeing', 'Ramoji Film City tickets'],
        excludes: ['Flights', 'Lunch & dinner', 'Personal expenses', 'Travel insurance'],
    },
    {
        slug: 'karnataka-adventure',
        title: 'Karnataka Nature & Heritage',
        country: 'India',
        city: 'Coorg · Chikmagalur · Mysore',
        days: 7, nights: 6,
        rating: 4.9, reviews: 380,
        tags: ['Hill Station', 'Nature', 'Heritage'],
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80',
        highlights: [
            'Abbey Falls & Raja\'s Seat in Coorg',
            'Mullayanagiri Peak & Hebbe Falls in Chikmagalur',
            'Mysore Palace & Brindavan Gardens',
            'Jog Falls & Gokarna Beach',
        ],
        itinerary: [
            { d: 'Day 1', t: 'Arrival · Bangalore',     c: 'Arrive in Bangalore, Bangalore Palace, ISKCON Temple, Cubbon Park.' },
            { d: 'Day 2', t: 'Bangalore to Coorg',      c: 'Travel to Coorg, Abbey Falls, Raja\'s Seat sunset, Dubare Elephant Camp.' },
            { d: 'Day 3', t: 'Coorg Exploration',       c: 'Chickhole Dam, Nisargadhama, Golden Temple, Iruppu Falls.' },
            { d: 'Day 4', t: 'Coorg to Chikmagalur',   c: 'Travel to Chikmagalur, Mullayanagiri Peak trek, Z Point sunset.' },
            { d: 'Day 5', t: 'Chikmagalur',            c: 'Hebbe Falls, Kalhatti Falls, Coffee Museum, Bhadra Wildlife Sanctuary.' },
            { d: 'Day 6', t: 'Chikmagalur to Mysore',  c: 'Travel to Mysore, Mysore Palace, Chamundi Hills, Brindavan Gardens.' },
            { d: 'Day 7', t: 'Departure',              c: 'St. Philomena\'s Church, Mysore Zoo, departure from Mysore.' },
        ],
        includes: ['6 nights hotel/resort', 'Daily breakfast', 'All transfers & sightseeing', 'English-speaking guide'],
        excludes: ['Flights', 'Lunch & dinner', 'Activity charges', 'Travel insurance'],
    },
    {
        slug: 'tamil-nadu-temples-hills',
        title: 'Tamil Nadu Temples & Hills',
        country: 'India',
        city: 'Ooty · Kodaikanal · Pondicherry',
        days: 8, nights: 7,
        rating: 4.8, reviews: 350,
        tags: ['Hill Station', 'Temple', 'Beach'],
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80',
        highlights: [
            'Doddabetta Peak & Botanical Garden in Ooty',
            'Pillar Rocks & Kodaikanal Lake',
            'Rock Beach & Auroville in Pondicherry',
            'Chettinad Palace heritage in Karaikudi',
        ],
        itinerary: [
            { d: 'Day 1', t: 'Arrival · Ooty',          c: 'Arrive in Ooty, Botanical Garden, Ooty Lake boating.' },
            { d: 'Day 2', t: 'Ooty Sightseeing',        c: 'Doddabetta Peak, Pykara Lake, Tea Factory visit, Ooty Market.' },
            { d: 'Day 3', t: 'Ooty to Kodaikanal',      c: 'Travel to Kodaikanal, Pillar Rocks, Pine Forest walk.' },
            { d: 'Day 4', t: 'Kodaikanal',              c: 'Kodaikanal Lake, Guna Caves, Silver Cascade Falls, Coaker\'s Walk, Green Valley View.' },
            { d: 'Day 5', t: 'Kodaikanal to Pollachi',  c: 'Travel via Pollachi, Aliyar Dam, Topslip, Valparai, Monkey Falls.' },
            { d: 'Day 6', t: 'Pondicherry',             c: 'Travel to Pondicherry, Rock Beach, Auroville, White Town, Promenade Beach.' },
            { d: 'Day 7', t: 'Pondicherry & Karaikudi', c: 'French War Memorial, Chunnambar Boat House, travel to Karaikudi, Chettinad Palace.' },
            { d: 'Day 8', t: 'Departure',               c: 'Athangudi Palace, Athangudi Tiles Factory, departure.' },
        ],
        includes: ['7 nights hotel accommodation', 'Daily breakfast', 'All transfers & sightseeing', 'English-speaking guide'],
        excludes: ['Flights', 'Lunch & dinner', 'Boating charges', 'Travel insurance'],
    },
    {
        slug: 'kerala-gods-own-country',
        title: 'Kerala — God\'s Own Country',
        country: 'India',
        city: 'Munnar · Alleppey · Kochi · Wayanad',
        days: 8, nights: 7,
        rating: 5.0, reviews: 480,
        tags: ['Backwaters', 'Hill Station', 'Nature'],
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
        highlights: [
            'Houseboat cruise through Alleppey backwaters',
            'Munnar tea gardens & sunrise viewpoint',
            'Fort Kochi heritage walk & Chinese Fishing Nets',
            'Wayanad wildlife & Edakkal Caves',
        ],
        itinerary: [
            { d: 'Day 1', t: 'Arrival · Kochi',        c: 'Arrive in Kochi, Fort Kochi, Marine Drive, Chinese Fishing Nets, Jew Town.' },
            { d: 'Day 2', t: 'Kochi to Munnar',        c: 'Travel to Munnar, Cherai Beach enroute, evening at Rose Garden.' },
            { d: 'Day 3', t: 'Munnar Sightseeing',     c: 'Sunrise View Point, Mattupetty Dam, Echo Point, Tea Museum, Elephant Camp.' },
            { d: 'Day 4', t: 'Munnar to Vagamon',      c: 'Travel to Vagamon, Vagamon Meadows, Pine Forest, Vagamon Lake.' },
            { d: 'Day 5', t: 'Vagamon to Alleppey',    c: 'Paragliding Point, travel to Alleppey, Alleppey Beach, Vembanad Lake.' },
            { d: 'Day 6', t: 'Alleppey Houseboat',     c: 'Full-day houseboat cruise through Alleppey Backwaters, Marari Beach.' },
            { d: 'Day 7', t: 'Alleppey to Wayanad',    c: 'Travel to Wayanad, Banasura Sagar Dam, Edakkal Caves, Soochipara Waterfalls.' },
            { d: 'Day 8', t: 'Departure',              c: 'Meenmutty Waterfalls, Pookode Lake, Chembra Peak view, departure.' },
        ],
        includes: ['7 nights hotel/houseboat', 'Daily breakfast', 'Houseboat with meals', 'All transfers & sightseeing'],
        excludes: ['Flights', 'Lunch & dinner (except houseboat)', 'Activity charges', 'Travel insurance'],
    },
];

export const DESTINATIONS = [
    { name: 'Kerala',       tours: 16, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80' },
    { name: 'Goa',          tours: 12, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80' },
    { name: 'Karnataka',    tours: 14, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80' },
    { name: 'Tamil Nadu',   tours: 18, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80' },
    { name: 'Maharashtra',  tours: 10, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80' },
    { name: 'Delhi',        tours: 11, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80' },
    { name: 'Telangana',    tours: 8,  image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80' },
    { name: 'Rajasthan',    tours: 15, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&q=80' },
    { name: 'Kashmir',      tours: 10, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=900&q=80' },
    { name: 'Himachal',     tours: 12, image: 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=900&q=80' },
    { name: 'Uttarakhand',  tours: 9,  image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=900&q=80' },
    { name: 'Andaman',      tours: 7,  image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80' },
];

export const STUDY_COUNTRIES = [
    { flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom', universities: 150, pitch: 'World-class research universities, 1\u20132 year Masters, post-study work visa.' },
    { flag: '\u{1F1FA}\u{1F1F8}', name: 'United States',  universities: 420, pitch: 'Ivy League + STEM OPT extensions, on-campus research, scholarships.' },
    { flag: '\u{1F1E8}\u{1F1E6}', name: 'Canada',         universities: 180, pitch: 'Affordable tuition, PGWP work permit & a clear PR pathway.' },
    { flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia',      universities: 130, pitch: 'Group of Eight universities, 2\u20134 yr post-study work stream.' },
    { flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany',         universities: 90,  pitch: 'Zero tuition at public universities, strong engineering schools.' },
    { flag: '\u{1F1EB}\u{1F1F7}', name: 'France',          universities: 60,  pitch: 'Grande \u00C9cole Masters, Bloc Schengen mobility, scholarships.' },
    { flag: '\u{1F1EE}\u{1F1EA}', name: 'Ireland',         universities: 40,  pitch: 'English-medium, 2-year post-study work, booming tech sector.' },
    { flag: '\u{1F1F3}\u{1F1FF}', name: 'New Zealand',     universities: 28,  pitch: 'Balanced lifestyle, PSW visa, strong pastoral care for students.' },
    { flag: '\u{1F1F8}\u{1F1EC}', name: 'Singapore',       universities: 20,  pitch: 'NUS/NTU ranked top-20 globally, gateway to SEA jobs.' },
    { flag: '\u{1F1E6}\u{1F1EA}', name: 'UAE / Dubai',     universities: 35,  pitch: 'Branch campuses (Heriot-Watt, NYU, Middlesex) + tax-free salaries.' },
];

export const STUDY_STEPS = [
    { n: '01', t: 'Free Profile Evaluation',   d: 'Share your academics + career goals. We give you a shortlist of universities that fit.' },
    { n: '02', t: 'University Shortlisting',    d: 'We pick 5\u20137 matches across ambitious, realistic and safe categories.' },
    { n: '03', t: 'SOP, Essays & Recommenders', d: 'Our writers help craft Statements of Purpose, LORs and essays that actually stand out.' },
    { n: '04', t: 'Applications & Scholarships', d: 'We apply, track deadlines and hunt scholarships \u2014 up to 50% tuition savings typical.' },
    { n: '05', t: 'Visa + Forex + Travel',       d: 'Student visa prep, mock interviews, forex, flights, SIM & pickup \u2014 one place.' },
    { n: '06', t: 'Pre-Departure & Beyond',      d: 'Orientation, accommodation, and in-country support after you land.' },
];

export const BUSINESS_COUNTRIES = [
    { flag: '\u{1F1E6}\u{1F1EA}', name: 'Dubai / UAE',   pitch: 'Mainland / free zone / offshore options. 0% personal income tax. 100% foreign ownership.' },
    { flag: '\u{1F1F8}\u{1F1EC}', name: 'Singapore',     pitch: 'World-class banking, strong IP law, 17% flat corporate tax, fast setup.' },
    { flag: '\u{1F1FA}\u{1F1F8}', name: 'USA (LLC / C-Corp)', pitch: 'Delaware / Wyoming LLCs, Stripe access, investor-friendly structure.' },
    { flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom', pitch: 'Ltd company setup in 48 hrs, full banking + VAT support.' },
    { flag: '\u{1F1E8}\u{1F1E6}', name: 'Canada',        pitch: 'BC / Ontario incorporation, start-up visa pathway available.' },
    { flag: '\u{1F1ED}\u{1F1F0}', name: 'Hong Kong',      pitch: 'Access to APAC, low 8.25% tax on first HKD 2M profits.' },
    { flag: '\u{1F1F2}\u{1F1FE}', name: 'Malaysia',       pitch: 'Labuan offshore / Sdn Bhd onshore, MSC status for tech firms.' },
    { flag: '\u{1F1EA}\u{1F1EA}', name: 'Estonia (e-Residency)', pitch: 'Fully remote EU company for digital founders, 0% tax on undistributed profits.' },
];

export const BUSINESS_SERVICES = [
    { icon: 'bldg',    t: 'Company Formation',   d: 'Name reservation, MoA/AoA, incorporation across 20+ jurisdictions.' },
    { icon: 'scale',   t: 'Licensing & Compliance', d: 'Trade license, sector permits, annual filings, VAT & tax registration.' },
    { icon: 'bank',    t: 'Corporate Banking',   d: 'Business bank accounts with HSBC, Emirates NBD, Mashreq, Wise, Revolut & more.' },
    { icon: 'visa',    t: 'Investor / Founder Visas', d: 'Golden Visa (UAE), E-2 (US), Start-up visa (CA/UK/AU), EP (Singapore).' },
    { icon: 'chart',   t: 'Tax Structuring',     d: 'Holding companies, transfer pricing, withholding tax optimisation.' },
    { icon: 'office',  t: 'Office + PRO',        d: 'Flexi desks, Ejari, PRO services, mail handling, resident director options.' },
];

export const WHY_CHOOSE = [
    { icon: 'globe',  t: '120+ Destinations',     d: 'A trusted local partner in every region \u2014 not a reseller of someone else\'s trip.' },
    { icon: 'price',  t: 'Best-Value Packages',    d: 'We negotiate directly with suppliers to bring you the best value for your trip.' },
    { icon: 'badge',  t: 'Certified & Licensed',   d: 'IATA, TAFI and ICEF certified. Your money and your itinerary are protected.' },
    { icon: 'heart',  t: '24/7 Support',           d: 'Real humans, on call, every time-zone \u2014 not a bot queue.' },
];

export const TESTIMONIALS = [
    { name: 'Ananya R.',       city: 'Chennai',  trip: 'Kerala Backwaters',       stars: 5, body: 'Flawless from transfer to houseboat. Every detail anticipated. Trip with uz just gets it.', img: 'https://i.pravatar.cc/80?img=47' },
    { name: 'Rohit & Nisha',   city: 'Bengaluru',trip: 'Coorg & Mysore',          stars: 5, body: 'Did Karnataka on our honeymoon \u2014 zero stress, insane views. Local guide in Coorg was a legend.', img: 'https://i.pravatar.cc/80?img=12' },
    { name: 'Meera K.',        city: 'Mumbai',   trip: 'Goa Family Trip',         stars: 5, body: 'Booked in 48 hours \u2014 pulled it off and upgraded our beach resort. Already planning Kerala.', img: 'https://i.pravatar.cc/80?img=32' },
    { name: 'Arjun Patel',     city: 'Ahmedabad',trip: 'Study Abroad \u2014 UK',  stars: 5, body: 'Got 60% scholarship at Manchester thanks to their SOP team. Visa cleared first time.', img: 'https://i.pravatar.cc/80?img=18' },
    { name: 'SparkAI Pvt Ltd', city: 'Coimbatore',trip: 'UAE Business Setup',     stars: 5, body: 'Dubai mainland company, bank account and Emirates ID \u2014 all done in 18 days. Highly professional.', img: 'https://i.pravatar.cc/80?img=7' },
    { name: 'Priya S.',        city: 'Kochi',    trip: 'Ooty & Kodaikanal',       stars: 5, body: 'Hill station trip was perfectly planned. Anniversary saved. Thank you team!', img: 'https://i.pravatar.cc/80?img=29' },
];

export const BLOGS = [
    { slug: 'kerala-hidden-gems',       date: 'Apr 02, 2026', author: 'Admin', title: '10 Kerala hideouts the guidebooks still don\'t know',           excerpt: 'We went looking for the Kerala beneath the backwaters. Here are ten corners worth the detour.', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80' },
    { slug: 'goa-monsoon-packing',      date: 'Mar 18, 2026', author: 'Admin', title: 'How to actually pack for Goa in monsoon season',                excerpt: 'Monsoon Goa is part adventure, part relaxation. A packing list that covers both.',   image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80' },
    { slug: 'south-india-foodie-route', date: 'Mar 02, 2026', author: 'Admin', title: 'A foodie\'s 7-day route through South India',                    excerpt: 'Skip the tourist traps. A slow-travel path built around one question: where do locals eat?',  image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80' },
    { slug: 'uk-study-timeline',        date: 'Feb 20, 2026', author: 'Admin', title: 'UK Sept 2026 intake \u2014 your month-by-month timeline',        excerpt: 'From UCAS to visa, here\'s when to do what if you\'re aiming for September 2026.',         image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=900&q=80' },
    { slug: 'dubai-vs-singapore-biz',   date: 'Feb 05, 2026', author: 'Admin', title: 'Dubai vs Singapore: which is better to set up in 2026?',        excerpt: 'Tax, speed, ecosystem, lifestyle \u2014 a practical comparison for Indian founders.',           image: 'https://images.unsplash.com/photo-1580418827493-3d30bf8a6ba7?w=900&q=80' },
];

export const FAQS_TRAVEL = [
    { q: 'Do you help with travel arrangements?',               a: 'Yes \u2014 we handle hotels, transfers, sightseeing and can also assist with flight bookings for all destinations.' },
    { q: 'Can I customize the itinerary?',                       a: 'Absolutely. 80% of our bookings are customized \u2014 tell us the vibe, dates and preferences and we\'ll build it.' },
    { q: 'What is your cancellation policy?',                    a: 'Varies per supplier. Most packages are free-cancel up to 30 days prior; some are fully refundable up to 7 days. We\'ll make it crystal clear before you confirm.' },
    { q: 'Do you offer group tours?',                            a: 'Yes \u2014 we offer both private and group departures. Group tours are a great way to travel with like-minded explorers.' },
    { q: 'How do I get a quote for my trip?',                    a: 'Simply fill in the enquiry form or WhatsApp us. We\'ll get back with a customized plan within 24 hours.' },
];
