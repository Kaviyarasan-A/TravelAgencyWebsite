/**
 * WhatsApp notifier.
 *
 * Two mechanisms, tried in order:
 *   1. WhatsApp Cloud API (preferred) — if WHATSAPP_API_TOKEN +
 *      WHATSAPP_PHONE_ID are configured, the server POSTs a real
 *      text message to graph.facebook.com/v20.0/<phone_id>/messages.
 *   2. wa.me click-to-chat link — always produced; returned to the
 *      client so the browser can open it in a new tab automatically.
 */

export function buildMessage(type, fields) {
    const lines = [`*New ${type} — Trip with uz*`, ''];
    for (const [k, v] of Object.entries(fields)) {
        if (v === undefined || v === null) continue;
        const s = String(v).trim();
        if (!s) continue;
        lines.push(`*${k}:* ${s}`);
    }
    lines.push('', `Submitted ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
    return lines.join('\n');
}

export function waLink(number, message) {
    const n = String(number || '').replace(/[^\d]/g, '');
    return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export async function sendViaCloudApi(toNumber, message) {
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    if (!token || !phoneId) return { ok: false, skipped: true };

    const to = String(toNumber || '').replace(/[^\d]/g, '');
    const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to,
                type: 'text',
                text: { preview_url: false, body: message },
            }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            console.warn('[whatsapp] cloud api failed:', res.status, data.error?.message || data);
            return { ok: false, error: data.error?.message || `http_${res.status}` };
        }
        return { ok: true, id: data.messages?.[0]?.id };
    } catch (err) {
        console.warn('[whatsapp] cloud api threw:', err.message);
        return { ok: false, error: err.message };
    }
}
