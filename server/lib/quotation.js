/**
 * Quotation engine — turns a package + travellers + options into a priced
 * breakdown. Keeps the maths in one place so client, admin and email templates
 * all see identical numbers.
 */

const ROOM_OPTIONS = {
    standard: { label: 'Standard Twin/Double',   multiplier: 1.00 },
    deluxe:   { label: 'Deluxe Room',            multiplier: 1.18 },
    suite:    { label: 'Suite / Pool Villa',     multiplier: 1.45 },
};

const SEASONS = {
    regular: { label: 'Regular',     multiplier: 1.00 },
    peak:    { label: 'Peak Season', multiplier: 1.20 },
    monsoon: { label: 'Off-season',  multiplier: 0.85 },
};

const ADDONS = {
    flights:    { label: 'Return flights (economy, ex-major metro)', price: 12500, per: 'person' },
    insurance:  { label: 'Travel insurance',                         price:   850, per: 'person' },
    photography:{ label: 'Dedicated trip photographer',              price:  9500, per: 'trip'   },
    guide:      { label: 'Private English-speaking guide upgrade',   price:  6000, per: 'trip'   },
    visa:       { label: 'Visa assistance',                          price:  3500, per: 'person' },
};

const GST_RATE = 0.05;
const DEFAULT_BASE = 18000;

export function describeOptions() {
    return { rooms: ROOM_OPTIONS, seasons: SEASONS, addons: ADDONS, gst: GST_RATE };
}

function round(n) { return Math.round(n); }

/**
 * @param pkg        the package record (needs basePrice, title)
 * @param input      { travelers, room, season, addons: string[] }
 * @returns          { lineItems, subtotal, discount, taxable, gst, total, perPerson, currency }
 */
export function buildQuotation(pkg, input = {}) {
    const travelers = Math.max(1, Number(input.travelers) || 1);
    const roomKey   = ROOM_OPTIONS[input.room] ? input.room : 'standard';
    const seasonKey = SEASONS[input.season]    ? input.season : 'regular';
    const room      = ROOM_OPTIONS[roomKey];
    const season    = SEASONS[seasonKey];
    const basePrice = Number(pkg?.basePrice) || DEFAULT_BASE;

    const lineItems = [];
    const perPerson = round(basePrice * room.multiplier * season.multiplier);
    const packageTotal = perPerson * travelers;

    lineItems.push({
        label: `${pkg?.title || 'Custom Trip'} — ${room.label} (${season.label})`,
        qty: travelers,
        unit: perPerson,
        amount: packageTotal,
    });

    const addonKeys = Array.isArray(input.addons) ? input.addons.filter((k) => ADDONS[k]) : [];
    for (const key of addonKeys) {
        const a = ADDONS[key];
        const qty = a.per === 'person' ? travelers : 1;
        const amount = round(a.price * qty);
        lineItems.push({ label: a.label, qty, unit: a.price, amount });
    }

    const subtotal = lineItems.reduce((s, li) => s + li.amount, 0);
    const groupDiscount = travelers >= 4 ? round(subtotal * 0.05) : 0;
    const taxable = subtotal - groupDiscount;
    const gst = round(taxable * GST_RATE);
    const total = taxable + gst;

    return {
        packageSlug: pkg?.slug || null,
        packageTitle: pkg?.title || 'Custom Trip',
        room: roomKey,
        season: seasonKey,
        travelers,
        addons: addonKeys,
        lineItems,
        subtotal,
        groupDiscount,
        gst,
        gstRate: GST_RATE,
        total,
        perPerson: round(total / travelers),
        currency: 'INR',
    };
}
