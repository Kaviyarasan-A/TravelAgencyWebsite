/**
 * Build a UPI deep-link (upi://pay) for a booking.
 * Works with PhonePe, GPay, Paytm, BHIM on Android; iOS uses the same scheme.
 */

function enc(s) { return encodeURIComponent(String(s)); }

export function buildUpiLink({ amount, note, refId }) {
    const pa = process.env.UPI_ID || 'tripwithuz@okicici';
    const pn = process.env.UPI_PAYEE_NAME || 'Trip with uz';
    const parts = [
        `pa=${enc(pa)}`,
        `pn=${enc(pn)}`,
        `am=${Number(amount || 0).toFixed(2)}`,
        `cu=INR`,
        `tn=${enc(note || 'Booking')}`,
    ];
    if (refId) parts.push(`tr=${enc(refId)}`);
    return `upi://pay?${parts.join('&')}`;
}

export function upiConfig() {
    return {
        payeeVpa: process.env.UPI_ID || 'tripwithuz@okicici',
        payeeName: process.env.UPI_PAYEE_NAME || 'Trip with uz',
    };
}
