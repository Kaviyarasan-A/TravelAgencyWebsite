/**
 * API client. In dev, requests go to `/api/*` and Vite's proxy forwards
 * them to the Express server. In production, set VITE_API_URL.
 *
 * Admin token is persisted in localStorage under `admin_token` and
 * attached to admin-scoped requests automatically.
 */
// In dev, go direct to the Express server and skip Vite's flaky proxy.
// In prod, relative `/api/*` paths work via whatever reverse proxy is in
// front (nginx, cloud run, etc). VITE_API_URL always wins if provided.
const BASE = import.meta.env.VITE_API_URL
    || (import.meta.env.DEV ? 'http://localhost:5000' : '');
const ADMIN_TOKEN_KEY = 'admin_token';

export function getAdminToken() {
    try { return localStorage.getItem(ADMIN_TOKEN_KEY) || ''; }
    catch { return ''; }
}
export function setAdminToken(token) {
    try {
        if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
        else localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch { /* ignore */ }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
        const t = getAdminToken();
        if (t) headers.Authorization = `Bearer ${t}`;
    }
    try {
        const res = await fetch(`${BASE}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            cache: 'no-store',
        });
        const data = await res.json().catch(() => ({}));
        if (res.status === 401 && auth) {
            console.warn(`[api] 401 unauthorized on ${method} ${path}`, data);
            setAdminToken('');
            return { ok: false, error: 'unauthorized', status: 401 };
        }
        if (!res.ok || data.ok === false) {
            console.warn(`[api] ${res.status} on ${method} ${path}`, data);
            return { ok: false, error: data.error || `http_${res.status}`, status: res.status };
        }
        return { ok: true, data };
    } catch (err) {
        console.error(`[api] network error on ${method} ${path}:`, err);
        return { ok: false, error: 'network' };
    }
}

const post = (p, b) => request(p, { method: 'POST', body: b });
const get  = (p)   => request(p);
const postAuth   = (p, b) => request(p, { method: 'POST',   body: b, auth: true });
const getAuth    = (p)    => request(p, { method: 'GET',    auth: true });
const patchAuth  = (p, b) => request(p, { method: 'PATCH',  body: b, auth: true });
const delAuth    = (p)    => request(p, { method: 'DELETE', auth: true });

/**
 * Open WhatsApp with a prefilled message in a new tab. The server returns
 * a whatsappUrl in its success response — if the browser blocks the
 * auto-open, the user just doesn't get redirected (email still sent).
 */
export function openWhatsApp(url) {
    if (!url || typeof url !== 'string') return false;
    try {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        return !!win;
    } catch {
        return false;
    }
}

export const api = {
    contact:       (payload) => post('/api/contact', payload),
    booking:       (payload) => post('/api/booking', payload),
    study:         (payload) => post('/api/study', payload),
    business:      (payload) => post('/api/business', payload),
    search:        (payload) => post('/api/search', payload),
    newsletter:    (payload) => post('/api/newsletter', payload),
    googleReviews: ()        => get('/api/google-reviews'),

    // public catalog
    listPackages:  ()        => get('/api/packages'),
    getPackage:    (slug)    => get(`/api/packages/${encodeURIComponent(slug)}`),
    listAds:       (placement = '') => get(`/api/ads${placement ? `?placement=${encodeURIComponent(placement)}` : ''}`),
    listBlogs:     ()        => get('/api/blogs'),
    getBlog:       (slug)    => get(`/api/blogs/${encodeURIComponent(slug)}`),

    // booking + quotation + UPI
    quotationOptions: ()     => get('/api/quotation/options'),
    createQuotation:  (payload) => post('/api/quotation', payload),
    getBooking:       (id)   => get(`/api/bookings/${encodeURIComponent(id)}`),
    confirmBooking:   (id)   => post(`/api/bookings/${encodeURIComponent(id)}/confirm`, {}),
    markBookingPaid:  (id, transactionRef) => post(`/api/bookings/${encodeURIComponent(id)}/paid`, { transactionRef }),

    // admin — auth
    adminLogin:    (u, p)    => post('/api/admin/login', { username: u, password: p }),
    adminMe:       ()        => getAuth('/api/admin/me'),
    adminChangePassword: (currentPassword, newPassword) =>
        postAuth('/api/admin/change-password', { currentPassword, newPassword }),

    // admin — dashboards + enquiries + packages
    adminStats:    ()        => getAuth('/api/admin/stats'),
    adminActivity: (limit = 10) => getAuth(`/api/admin/activity?limit=${limit}`),
    adminEnquiries: (query = '') => getAuth(`/api/admin/enquiries${query ? `?${query}` : ''}`),
    adminUpdateEnquiry: (id, patch) => patchAuth(`/api/admin/enquiries/${id}`, patch),
    adminDeleteEnquiry: (id) => delAuth(`/api/admin/enquiries/${id}`),
    adminPackages: ()        => getAuth('/api/admin/packages'),
    adminCreatePackage: (data) => postAuth('/api/admin/packages', data),
    adminUpdatePackage: (id, patch) => patchAuth(`/api/admin/packages/${id}`, patch),
    adminDeletePackage: (id) => delAuth(`/api/admin/packages/${id}`),

    // admin — ads
    adminAds:          ()        => getAuth('/api/admin/ads'),
    adminCreateAd:     (data)    => postAuth('/api/admin/ads', data),
    adminUpdateAd:     (id, p)   => patchAuth(`/api/admin/ads/${id}`, p),
    adminDeleteAd:     (id)      => delAuth(`/api/admin/ads/${id}`),

    // admin — blogs
    adminBlogs:        ()        => getAuth('/api/admin/blogs'),
    adminCreateBlog:   (data)    => postAuth('/api/admin/blogs', data),
    adminUpdateBlog:   (id, p)   => patchAuth(`/api/admin/blogs/${id}`, p),
    adminDeleteBlog:   (id)      => delAuth(`/api/admin/blogs/${id}`),

    // admin — bookings
    adminBookings:       (query = '') => getAuth(`/api/admin/bookings${query ? `?${query}` : ''}`),
    adminUpdateBooking:  (id, p)      => patchAuth(`/api/admin/bookings/${id}`, p),
    adminDeleteBooking:  (id)         => delAuth(`/api/admin/bookings/${id}`),

    // returns the full URL (with auth header) for the caller to trigger a browser download
    adminEnquiriesCsvUrl: () => `${BASE}/api/admin/enquiries.csv`,
    adminBackupUrl:       () => `${BASE}/api/admin/backup`,
};

/**
 * Trigger a file download from an authenticated admin endpoint. fetch →
 * blob → synthetic <a download>. Used for CSV export + JSON backup.
 */
export async function downloadWithAuth(url, filename) {
    const t = getAdminToken();
    const res = await fetch(url, { headers: t ? { Authorization: `Bearer ${t}` } : {} });
    if (!res.ok) throw new Error(`Download failed (${res.status})`);
    const blob = await res.blob();
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
}
