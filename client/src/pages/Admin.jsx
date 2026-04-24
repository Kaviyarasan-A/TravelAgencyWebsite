import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiLogOut, FiMail, FiPhone, FiMessageCircle, FiTrash2, FiEdit2, FiPlus,
    FiSearch, FiRefreshCw, FiCheckCircle, FiClock, FiAlertCircle, FiArchive,
    FiInbox, FiPackage, FiBarChart2, FiX, FiSave, FiLock, FiDownload,
    FiSettings, FiMenu, FiTrendingUp, FiUsers, FiCalendar, FiExternalLink,
    FiCopy, FiEye, FiEyeOff, FiShield, FiDatabase, FiChevronRight,
    FiChevronUp, FiChevronDown, FiArrowUp, FiArrowDown, FiZap,
    FiImage, FiFileText, FiCreditCard, FiDollarSign, FiTag, FiSmartphone,
} from 'react-icons/fi';
import { api, setAdminToken, getAdminToken, downloadWithAuth } from '../api.js';
import { BRAND } from '../data.js';

const STATUS_META = {
    new:         { label: 'New',         dot: 'bg-blue-500',   cls: 'bg-blue-50 text-blue-700 border-blue-200',     icon: <FiAlertCircle /> },
    in_progress: { label: 'In progress', dot: 'bg-amber-500',  cls: 'bg-amber-50 text-amber-700 border-amber-200',  icon: <FiClock /> },
    done:        { label: 'Done',        dot: 'bg-green-500',  cls: 'bg-green-50 text-green-700 border-green-200',  icon: <FiCheckCircle /> },
    archived:    { label: 'Archived',    dot: 'bg-slate-400',  cls: 'bg-slate-100 text-slate-600 border-slate-200', icon: <FiArchive /> },
};

const TYPE_COLORS = {
    'Enquiry':        'bg-violet-50 text-violet-700',
    'Booking':        'bg-emerald-50 text-emerald-700',
    'Study Abroad':   'bg-sky-50 text-sky-700',
    'Business Setup': 'bg-amber-50 text-amber-700',
    'Search':         'bg-slate-50 text-slate-700',
    'Newsletter':     'bg-pink-50 text-pink-700',
};

/* =========================================================================
 * Root component — login wall + shell
 * ========================================================================= */

export default function Admin() {
    const [authed, setAuthed] = useState(!!getAdminToken());
    const [checking, setChecking] = useState(!!getAdminToken());
    const [me, setMe] = useState(null);

    useEffect(() => {
        if (!authed) { setChecking(false); setMe(null); return; }
        (async () => {
            const r = await api.adminMe();
            if (!r.ok) { setAdminToken(''); setAuthed(false); }
            else setMe(r.data.user);
            setChecking(false);
        })();
    }, [authed]);

    if (checking) return <FullScreenLoading />;

    return (
        <>
            <Helmet>
                <title>Admin · {BRAND.name}</title>
                <meta name="robots" content="noindex,nofollow" />
                <style>{`body{background:#f1f5f9}`}</style>
            </Helmet>
            {authed
                ? <AdminShell user={me} onLogout={() => { setAdminToken(''); setAuthed(false); }} />
                : <LoginForm onAuthed={() => setAuthed(true)} />}
        </>
    );
}

function FullScreenLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-14 h-14 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
        </div>
    );
}

/* =========================================================================
 * Login
 * ========================================================================= */

function LoginForm({ onAuthed }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        const r = await api.adminLogin(username, password);
        setBusy(false);
        if (!r.ok) {
            toast.error(r.error === 'invalid_credentials' ? 'Wrong username or password' : 'Login failed');
            return;
        }
        setAdminToken(r.data.token);
        toast.success('Welcome back');
        onAuthed();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,122,0,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(96,165,250,0.1),transparent_50%)]" />
            <motion.form
                onSubmit={submit}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-5"
            >
                <div className="text-center">
                    <img src={BRAND.logo} alt={BRAND.name} className="h-16 mx-auto mb-3" />
                    <h1 className="font-display text-2xl font-extrabold text-ink">Admin Sign-in</h1>
                    <p className="text-sm text-ink-muted mt-1">Manage enquiries, packages & settings</p>
                </div>
                <div>
                    <label className="label">Username</label>
                    <input autoFocus className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label className="label">Password</label>
                    <div className="relative">
                        <input type={showPw ? 'text' : 'password'} className="input pr-12" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="button" onClick={() => setShowPw((x) => !x)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-brand-500"
                            tabIndex={-1}>
                            {showPw ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>
                <button disabled={busy} className="btn-primary w-full btn-lg disabled:opacity-60">
                    <FiLock /> {busy ? 'Signing in…' : 'Sign in'}
                </button>
                <div className="flex items-center justify-between text-xs text-ink-muted pt-1">
                    <Link to="/" className="hover:text-brand-500 inline-flex items-center gap-1">← Back to site</Link>
                    <span className="inline-flex items-center gap-1.5">
                        <FiShield /> Secure session
                    </span>
                </div>
            </motion.form>
        </div>
    );
}

/* =========================================================================
 * Shell with sidebar
 * ========================================================================= */

const NAV = [
    { id: 'dashboard', label: 'Dashboard',  icon: <FiBarChart2 /> },
    { id: 'enquiries', label: 'Enquiries',  icon: <FiInbox /> },
    { id: 'bookings',  label: 'Bookings',   icon: <FiCreditCard /> },
    { id: 'packages',  label: 'Packages',   icon: <FiPackage /> },
    { id: 'ads',       label: 'Ads / Promo',icon: <FiImage /> },
    { id: 'blogs',     label: 'Blog Posts', icon: <FiFileText /> },
    { id: 'settings',  label: 'Settings',   icon: <FiSettings /> },
];

function AdminShell({ user, onLogout }) {
    const [tab, setTab] = useState('dashboard');
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => { setMobileOpen(false); }, [tab]);

    return (
        <div className="min-h-screen flex bg-slate-100">
            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200
                transform transition-transform duration-200
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200">
                    <img src={BRAND.logo} alt={BRAND.name} className="h-9 w-auto" />
                    <div className="leading-tight">
                        <div className="font-extrabold text-ink text-sm">{BRAND.name}</div>
                        <div className="text-[11px] uppercase tracking-widest text-brand-500 font-semibold">Admin</div>
                    </div>
                </div>

                <nav className="p-3 space-y-1">
                    {NAV.map((n) => (
                        <button
                            key={n.id} onClick={() => setTab(n.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                                tab === n.id
                                    ? 'bg-brand-grad text-white shadow-brand'
                                    : 'text-ink-muted hover:bg-slate-100 hover:text-ink'
                            }`}>
                            {n.icon}
                            <span>{n.label}</span>
                            {tab === n.id && <FiChevronRight className="ml-auto" />}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50">
                        <div className="w-9 h-9 rounded-full bg-brand-grad text-white font-bold flex items-center justify-center">
                            {(user?.username || 'A').slice(0, 1).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-ink truncate">{user?.username || 'admin'}</div>
                            <div className="text-[11px] text-ink-muted">Signed in</div>
                        </div>
                        <button onClick={onLogout} title="Sign out"
                            className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">
                            <FiLogOut />
                        </button>
                    </div>
                </div>
            </aside>

            {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-20">
                    <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100">
                        <FiMenu size={20} />
                    </button>
                    <h1 className="font-display text-lg sm:text-xl font-bold text-ink capitalize">
                        {NAV.find((n) => n.id === tab)?.label}
                    </h1>
                    <div className="ml-auto flex items-center gap-2">
                        <Link to="/" className="hidden sm:inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-500 px-3 py-2 rounded-lg hover:bg-slate-100">
                            <FiExternalLink /> View site
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {tab === 'dashboard' && <DashboardPanel onNav={setTab} />}
                            {tab === 'enquiries' && <EnquiriesPanel />}
                            {tab === 'bookings'  && <BookingsPanel />}
                            {tab === 'packages'  && <PackagesPanel />}
                            {tab === 'ads'       && <AdsPanel />}
                            {tab === 'blogs'     && <BlogsPanel />}
                            {tab === 'settings'  && <SettingsPanel user={user} />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

/* =========================================================================
 * Dashboard
 * ========================================================================= */

function DashboardPanel({ onNav }) {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const load = async () => {
        setLoading(true);
        const [s, a] = await Promise.all([api.adminStats(), api.adminActivity(8)]);
        setLoading(false);
        if (s.ok) { setStats(s.data.stats); setErr(null); } else setErr(s.error || 'unknown');
        if (a.ok) setActivity(a.data.activity);
    };
    useEffect(() => { load(); }, []);

    if (loading && !stats) return <Loading />;
    if (!stats) return <ErrorBlock msg={`Could not load stats (${err})`} onRetry={load} />;

    const cards = [
        { label: 'Total Enquiries',   value: stats.totalEnquiries,     icon: <FiInbox />, grad: 'from-brand-500 to-brand-700', sub: 'all time' },
        { label: 'New / Unread',      value: stats.newEnquiries || 0,  icon: <FiAlertCircle />, grad: 'from-blue-500 to-blue-700', sub: 'awaiting response' },
        { label: 'Pending Bookings',  value: stats.pendingBookings || 0, icon: <FiCreditCard />, grad: 'from-amber-500 to-orange-600', sub: `${stats.totalBookings || 0} total` },
        { label: 'Paid Bookings',     value: stats.paidBookings || 0,  icon: <FiDollarSign />, grad: 'from-emerald-500 to-emerald-700', sub: `₹${(stats.bookingRevenue || 0).toLocaleString('en-IN')} revenue` },
        { label: 'Last 24 Hours',     value: stats.enquiriesLast24h,   icon: <FiTrendingUp />, grad: 'from-sky-500 to-indigo-600', sub: 'fresh leads' },
        { label: 'Published Packages',value: stats.publishedPackages,  icon: <FiPackage />, grad: 'from-violet-500 to-violet-700', sub: `${stats.totalPackages} total` },
        { label: 'Active Ads',        value: stats.activeAds || 0,     icon: <FiImage />, grad: 'from-pink-500 to-rose-600', sub: `${stats.totalAds || 0} total` },
        { label: 'Blog Posts',        value: stats.publishedBlogs || 0,icon: <FiFileText />, grad: 'from-teal-500 to-cyan-600', sub: `${stats.totalBlogs || 0} total` },
    ];

    return (
        <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:grid-cols-4">
                {cards.map((c) => (
                    <motion.div
                        key={c.label}
                        whileHover={{ y: -3 }}
                        className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${c.grad} text-white shadow-lg`}>
                        <div className="absolute -right-4 -bottom-4 opacity-20 text-7xl">{c.icon}</div>
                        <div className="relative">
                            <div className="text-[11px] uppercase tracking-widest opacity-85 flex items-center gap-1.5">{c.icon} {c.label}</div>
                            <div className="font-display text-4xl font-extrabold mt-2 leading-none">{c.value}</div>
                            <div className="text-xs opacity-80 mt-1">{c.sub}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-ink">Enquiries — last 14 days</h3>
                        <button onClick={load} className="text-xs inline-flex items-center gap-1 text-ink-muted hover:text-brand-500">
                            <FiRefreshCw /> Refresh
                        </button>
                    </div>
                    <Sparkline data={stats.series} />
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="font-semibold text-ink mb-4">By status</h3>
                    <BreakdownList data={stats.byStatus} renderKey={(k) => STATUS_META[k]?.label || k} color={(k) => STATUS_META[k]?.dot || 'bg-slate-400'} />
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-ink">Recent activity</h3>
                        <button onClick={() => onNav('enquiries')} className="text-xs text-brand-500 hover:underline inline-flex items-center gap-1">
                            See all <FiChevronRight />
                        </button>
                    </div>
                    {activity.length === 0
                        ? <p className="text-sm text-ink-muted py-4 text-center">No enquiries yet. They'll appear here as visitors submit forms.</p>
                        : (
                        <ul className="divide-y divide-slate-100">
                            {activity.map((e) => (
                                <li key={e.id} className="py-2.5 flex items-center gap-3 first:pt-0 last:pb-0">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${TYPE_COLORS[e.type] || 'bg-slate-100 text-slate-600'}`}>
                                        {e.type}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-ink truncate">{e.fields?.Name || e.fields?.Email || 'Anonymous'}</div>
                                        <div className="text-xs text-ink-muted truncate">{summarize(e)}</div>
                                    </div>
                                    <time className="text-xs text-ink-muted whitespace-nowrap">{relativeTime(e.createdAt)}</time>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="font-semibold text-ink mb-4">By type</h3>
                    <BreakdownList data={stats.byType} color={(k) => (TYPE_COLORS[k]?.split(' ')[0].replace('bg-', 'bg-') || 'bg-slate-200').replace('-50', '-400')} />
                </div>
            </div>

            <div className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-brand">
                <div>
                    <h3 className="font-display text-lg font-bold">Quick actions</h3>
                    <p className="text-sm text-white/85">Common tasks one click away</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => onNav('enquiries')} className="px-4 py-2 rounded-xl bg-white text-brand-600 text-sm font-semibold hover:scale-105 transition">
                        <FiInbox className="inline mr-1.5" /> View enquiries
                    </button>
                    <button onClick={() => onNav('packages')} className="px-4 py-2 rounded-xl bg-white/15 border border-white/30 text-white text-sm font-semibold hover:bg-white/25 transition">
                        <FiPlus className="inline mr-1.5" /> New package
                    </button>
                </div>
            </div>
        </div>
    );
}

function Sparkline({ data }) {
    const max = Math.max(1, ...data.map((d) => d.count));
    return (
        <div className="flex items-end gap-1.5 h-40">
            {data.map((d, i) => (
                <div key={d.date} className="flex-1 group relative flex flex-col items-center justify-end">
                    <motion.div
                        initial={{ height: 0 }} animate={{ height: `${(d.count / max) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.03 }}
                        className={`w-full rounded-t-md ${d.count > 0 ? 'bg-gradient-to-t from-brand-500 to-brand-300' : 'bg-slate-100'}`}
                        style={{ minHeight: d.count > 0 ? 4 : 2 }}
                    />
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-ink text-white text-[11px] px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                        {d.count} on {d.date.slice(5)}
                    </div>
                </div>
            ))}
        </div>
    );
}

function BreakdownList({ data, renderKey = (k) => k, color = () => 'bg-brand-500' }) {
    const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((a, [, v]) => a + v, 0);
    if (entries.length === 0) return <p className="text-sm text-ink-muted py-2">No data yet.</p>;
    return (
        <ul className="space-y-3">
            {entries.map(([k, v]) => (
                <li key={k}>
                    <div className="flex items-center justify-between text-sm">
                        <span className="inline-flex items-center gap-2 text-ink">
                            <span className={`w-2 h-2 rounded-full ${color(k)}`} /> {renderKey(k)}
                        </span>
                        <span className="font-semibold tabular-nums">{v}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 mt-1.5 overflow-hidden">
                        <div className={`h-full ${color(k)}`} style={{ width: `${total ? (v / total) * 100 : 0}%` }} />
                    </div>
                </li>
            ))}
        </ul>
    );
}

/* =========================================================================
 * Enquiries
 * ========================================================================= */

function EnquiriesPanel() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortBy, setSortBy] = useState({ key: 'createdAt', dir: 'desc' });
    const [active, setActive] = useState(null);
    const [page, setPage] = useState(0);
    const pageSize = 15;

    const load = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (status) params.set('status', status);
        if (typeFilter) params.set('type', typeFilter);
        const r = await api.adminEnquiries(params.toString());
        setLoading(false);
        if (r.ok) setRows(r.data.enquiries);
        else toast.error(r.error === 'unauthorized' ? 'Session expired — please sign in again' : `Failed to load enquiries (${r.error || 'error'})`);
    };
    useEffect(() => { load(); /* eslint-disable-next-line */ }, [status, typeFilter]);
    useEffect(() => { setPage(0); }, [q, status, typeFilter]);

    const types = useMemo(() => Array.from(new Set(rows.map((r) => r.type))).sort(), [rows]);
    const sorted = useMemo(() => {
        const clone = [...rows];
        clone.sort((a, b) => {
            const dir = sortBy.dir === 'asc' ? 1 : -1;
            const av = sortBy.key === 'createdAt' ? new Date(a.createdAt).getTime() : (a[sortBy.key] || '');
            const bv = sortBy.key === 'createdAt' ? new Date(b.createdAt).getTime() : (b[sortBy.key] || '');
            return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
        });
        return clone;
    }, [rows, sortBy]);
    const pageRows = sorted.slice(page * pageSize, (page + 1) * pageSize);
    const pages = Math.max(1, Math.ceil(sorted.length / pageSize));

    const updateStatus = async (id, newStatus) => {
        const r = await api.adminUpdateEnquiry(id, { status: newStatus });
        if (r.ok) {
            setRows((prev) => prev.map((x) => (x.id === id ? r.data.enquiry : x)));
            if (active?.id === id) setActive(r.data.enquiry);
            toast.success('Status updated');
        } else toast.error('Update failed');
    };

    const saveNotes = async (id, notes) => {
        const r = await api.adminUpdateEnquiry(id, { notes });
        if (r.ok) {
            setRows((prev) => prev.map((x) => (x.id === id ? r.data.enquiry : x)));
            if (active?.id === id) setActive(r.data.enquiry);
            toast.success('Notes saved');
        } else toast.error('Save failed');
    };

    const del = async (id) => {
        if (!confirm('Delete this enquiry? This cannot be undone.')) return;
        const r = await api.adminDeleteEnquiry(id);
        if (r.ok) {
            setRows((prev) => prev.filter((x) => x.id !== id));
            if (active?.id === id) setActive(null);
            toast.success('Deleted');
        } else toast.error('Delete failed');
    };

    const exportCsv = async () => {
        try {
            await downloadWithAuth(api.adminEnquiriesCsvUrl(), `enquiries-${new Date().toISOString().slice(0, 10)}.csv`);
            toast.success('CSV downloaded');
        } catch (e) { toast.error(e.message || 'Export failed'); }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-ink-muted">
                    <span className="font-semibold text-ink">{sorted.length}</span> enquiries
                </div>
                <div className="ml-auto flex gap-2">
                    <button onClick={load} className="btn-sm rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-ink-muted">
                        <FiRefreshCw /> Refresh
                    </button>
                    <button onClick={exportCsv} className="btn-sm rounded-xl bg-ink text-white hover:bg-ink-soft">
                        <FiDownload /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
                <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex gap-2 flex-1 min-w-[240px]">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, message…" className="input pl-9" />
                    </div>
                    <button className="btn-sm rounded-xl bg-brand-500 text-white hover:bg-brand-600">Search</button>
                </form>
                <div className="flex gap-2 flex-wrap">
                    <FilterChip label="All statuses" value="" active={status} onClick={() => setStatus('')} />
                    {Object.entries(STATUS_META).map(([k, m]) => (
                        <FilterChip key={k} label={m.label} value={k} active={status} icon={m.icon} onClick={() => setStatus(k)} />
                    ))}
                </div>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input max-w-[180px]">
                    <option value="">All types</option>
                    {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {loading ? <Loading /> : sorted.length === 0 ? (
                <EmptyState icon={<FiInbox />} title="No enquiries match your filters"
                    hint={q || status || typeFilter ? 'Try clearing filters above.' : "Enquiries from the website will appear here in real time."} />
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-ink-muted">
                                <tr>
                                    <Th sortable sortKey="createdAt" sortBy={sortBy} setSortBy={setSortBy}>Received</Th>
                                    <Th sortable sortKey="type" sortBy={sortBy} setSortBy={setSortBy}>Type</Th>
                                    <Th>Contact</Th>
                                    <Th>Summary</Th>
                                    <Th sortable sortKey="status" sortBy={sortBy} setSortBy={setSortBy}>Status</Th>
                                    <Th className="text-right">Actions</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pageRows.map((e) => (
                                    <tr key={e.id} onClick={() => setActive(e)} className="hover:bg-slate-50 cursor-pointer">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-ink">{formatDate(e.createdAt, 'short')}</div>
                                            <div className="text-[11px] text-ink-muted">{relativeTime(e.createdAt)}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[11px] px-2 py-1 rounded-full font-semibold whitespace-nowrap ${TYPE_COLORS[e.type] || 'bg-slate-100 text-slate-600'}`}>
                                                {e.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-ink">{e.fields?.Name || '—'}</div>
                                            <div className="text-xs text-ink-muted">{e.fields?.Email || ''}</div>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs truncate text-ink-muted">{summarize(e)}</td>
                                        <td className="px-4 py-3"><StatusPill status={e.status} /></td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(ev) => ev.stopPropagation()}>
                                            <button onClick={() => setActive(e)} className="text-brand-500 hover:underline mr-3 text-sm font-medium">View</button>
                                            <button onClick={() => del(e.id)} className="text-red-500 hover:bg-red-50 rounded-lg w-8 h-8 inline-flex items-center justify-center" title="Delete">
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {pages > 1 && (
                        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm">
                            <span className="text-ink-muted">Page {page + 1} of {pages}</span>
                            <div className="flex gap-1">
                                <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">Prev</button>
                                <button disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {active && <EnquiryDrawer enquiry={active} onClose={() => setActive(null)}
                onStatusChange={(s) => updateStatus(active.id, s)}
                onSaveNotes={(n) => saveNotes(active.id, n)}
                onDelete={() => del(active.id)} />}
        </div>
    );
}

function Th({ children, sortable, sortKey, sortBy, setSortBy, className = '' }) {
    const active = sortable && sortBy?.key === sortKey;
    return (
        <th className={`px-4 py-3 ${className}`}>
            {sortable ? (
                <button
                    onClick={() => setSortBy({ key: sortKey, dir: active && sortBy.dir === 'desc' ? 'asc' : 'desc' })}
                    className="inline-flex items-center gap-1 hover:text-brand-500">
                    {children} {active && (sortBy.dir === 'desc' ? <FiArrowDown /> : <FiArrowUp />)}
                </button>
            ) : children}
        </th>
    );
}

function FilterChip({ label, value, active, onClick, icon }) {
    const selected = active === value;
    return (
        <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 transition ${
            selected ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-ink-muted border-slate-200 hover:border-brand-500 hover:text-brand-500'
        }`}>
            {icon} {label}
        </button>
    );
}

function StatusPill({ status }) {
    const meta = STATUS_META[status] || STATUS_META.new;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
        </span>
    );
}

function EnquiryDrawer({ enquiry, onClose, onStatusChange, onSaveNotes, onDelete }) {
    const [notes, setNotes] = useState(enquiry.notes || '');
    useEffect(() => { setNotes(enquiry.notes || ''); }, [enquiry]);

    const email = enquiry.fields?.Email;
    const phone = enquiry.fields?.Phone;
    const waNumber = phone ? String(phone).replace(/[^\d]/g, '') : null;

    const copyAll = () => {
        const text = Object.entries(enquiry.fields || {}).map(([k, v]) => `${k}: ${v}`).join('\n');
        navigator.clipboard?.writeText(text).then(() => toast.success('Copied to clipboard'));
    };

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                <motion.div
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="relative ml-auto w-full max-w-xl h-full bg-white shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between p-5 border-b border-slate-200">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${TYPE_COLORS[enquiry.type] || 'bg-slate-100 text-slate-600'}`}>{enquiry.type}</span>
                                <StatusPill status={enquiry.status} />
                            </div>
                            <h3 className="font-display text-xl font-bold mt-2 truncate">{enquiry.fields?.Name || 'Enquiry'}</h3>
                            <p className="text-xs text-ink-muted mt-0.5">{formatDate(enquiry.createdAt)} · ID {enquiry.id}</p>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center shrink-0"><FiX /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        <div>
                            <div className="label mb-2">Update status</div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(STATUS_META).map(([key, meta]) => (
                                    <button key={key} onClick={() => onStatusChange(key)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 transition ${
                                            enquiry.status === key ? meta.cls + ' ring-2 ring-offset-1 ring-brand-500/30' : 'bg-white text-ink-muted border-slate-200 hover:border-brand-500'}`}>
                                        {meta.icon} {meta.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="label mb-2">Quick reply</div>
                            <div className="flex flex-wrap gap-2">
                                {email && <a href={`mailto:${email}`} className="px-3 py-2 rounded-xl bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100 inline-flex items-center gap-1.5"><FiMail /> Email</a>}
                                {phone && <a href={`tel:${phone}`} className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 inline-flex items-center gap-1.5"><FiPhone /> Call</a>}
                                {waNumber && <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 inline-flex items-center gap-1.5"><FiMessageCircle /> WhatsApp</a>}
                                <button onClick={copyAll} className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 inline-flex items-center gap-1.5"><FiCopy /> Copy all</button>
                            </div>
                        </div>

                        <div>
                            <div className="label mb-2">Submitted data</div>
                            <div className="bg-slate-50 rounded-xl overflow-hidden">
                                <dl className="divide-y divide-slate-200 text-sm">
                                    {Object.entries(enquiry.fields || {}).map(([k, v]) => (
                                        <div key={k} className="grid grid-cols-[160px_1fr] px-4 py-2.5 gap-3">
                                            <dt className="text-ink-muted text-xs font-semibold uppercase tracking-wide flex items-center">{k}</dt>
                                            <dd className="text-ink break-words">{String(v || '—')}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>

                        <div>
                            <label className="label">Internal notes (admin only)</label>
                            <textarea rows={5} className="input" value={notes} onChange={(e) => setNotes(e.target.value)}
                                placeholder="Follow-up taken, quoted price, next step, special requests…" />
                            <button onClick={() => onSaveNotes(notes)} className="btn-sm mt-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600"><FiSave /> Save notes</button>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-200 flex justify-between">
                        <button onClick={onDelete} className="text-red-500 hover:bg-red-50 rounded-xl px-3 py-2 text-sm inline-flex items-center gap-1.5"><FiTrash2 /> Delete</button>
                        <button onClick={onClose} className="btn-sm rounded-xl bg-slate-100 text-ink hover:bg-slate-200">Close</button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* =========================================================================
 * Packages
 * ========================================================================= */

function PackagesPanel() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [q, setQ] = useState('');

    const load = async () => {
        setLoading(true);
        const r = await api.adminPackages();
        setLoading(false);
        if (r.ok) setRows(r.data.packages);
        else toast.error('Failed to load packages');
    };
    useEffect(() => { load(); }, []);

    const del = async (id, title) => {
        if (!confirm(`Delete "${title}"?`)) return;
        const r = await api.adminDeletePackage(id);
        if (r.ok) { setRows((p) => p.filter((x) => x.id !== id)); toast.success('Deleted'); }
        else toast.error('Delete failed');
    };

    const save = async (data) => {
        const isNew = !data.id;
        const r = isNew ? await api.adminCreatePackage(data) : await api.adminUpdatePackage(data.id, data);
        if (!r.ok) {
            const msg = r.error === 'slug_exists' ? 'A package with that slug already exists.'
                      : r.error === 'slug_invalid_format' ? 'Slug must be lowercase letters, numbers and dashes.'
                      : `Save failed (${r.error})`;
            toast.error(msg);
            return false;
        }
        setRows((prev) => isNew ? [r.data.package, ...prev] : prev.map((p) => p.id === r.data.package.id ? r.data.package : p));
        toast.success(isNew ? 'Package created' : 'Package saved');
        return true;
    };

    const togglePublish = async (pkg) => {
        const r = await api.adminUpdatePackage(pkg.id, { published: !(pkg.published !== false) });
        if (r.ok) { setRows((prev) => prev.map((p) => p.id === pkg.id ? r.data.package : p)); toast.success(r.data.package.published ? 'Published' : 'Unpublished'); }
        else toast.error('Update failed');
    };

    const filtered = useMemo(() => {
        if (!q) return rows;
        const n = q.toLowerCase();
        return rows.filter((p) => (p.title + ' ' + p.slug + ' ' + (p.city || '') + ' ' + (p.country || '') + ' ' + (p.tags || []).join(' ')).toLowerCase().includes(n));
    }, [rows, q]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-ink-muted">
                    <span className="font-semibold text-ink">{rows.length}</span> packages
                    <span className="mx-2 text-slate-300">·</span>
                    <span className="text-green-600">{rows.filter((p) => p.published !== false).length} published</span>
                </div>
                <div className="ml-auto flex gap-2">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search packages…" className="input pl-9 py-2" style={{ width: 240 }} />
                    </div>
                    <button onClick={load} className="btn-sm rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-ink-muted">
                        <FiRefreshCw /> Refresh
                    </button>
                    <button onClick={() => setEditing({})} className="btn-sm rounded-xl bg-brand-500 text-white hover:bg-brand-600">
                        <FiPlus /> New package
                    </button>
                </div>
            </div>

            {loading ? <Loading /> : filtered.length === 0 ? (
                <EmptyState icon={<FiPackage />}
                    title={q ? 'No packages match your search' : 'No packages yet'}
                    hint={q ? 'Try a different term' : 'Click "New package" to add the first one.'} />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {filtered.map((p) => (
                        <motion.div key={p.id} whileHover={{ y: -3 }} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                            <div className="relative h-44 bg-cover bg-center bg-slate-200" style={{ backgroundImage: p.image ? `url(${p.image})` : undefined }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <span className={`absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full font-semibold ${p.published !== false ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
                                    {p.published !== false ? 'Published' : 'Draft'}
                                </span>
                                {p.tags?.length > 0 && (
                                    <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap max-w-[85%]">
                                        {p.tags.slice(0, 2).map((t) => (
                                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/90 text-ink font-semibold">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${p.category === 'International' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {p.category || 'Domestic'}
                                    </span>
                                    {p.basePrice > 0 && <span className="text-xs font-semibold text-brand-600">₹{Number(p.basePrice).toLocaleString('en-IN')}/pp</span>}
                                </div>
                                <h3 className="font-bold text-ink leading-tight line-clamp-2">{p.title}</h3>
                                <p className="text-xs text-ink-muted mt-1">{p.city}, {p.country}</p>
                                <p className="text-xs text-ink-muted mt-1">{p.days}D / {p.nights}N · /{p.slug}</p>
                                <div className="mt-auto pt-3 flex gap-1.5">
                                    <button onClick={() => setEditing(p)} className="flex-1 btn-sm rounded-lg bg-slate-100 text-ink hover:bg-slate-200"><FiEdit2 /> Edit</button>
                                    <button onClick={() => togglePublish(p)} title={p.published !== false ? 'Unpublish' : 'Publish'}
                                        className={`btn-sm rounded-lg ${p.published !== false ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                        <FiZap />
                                    </button>
                                    <button onClick={() => del(p.id, p.title)} className="btn-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><FiTrash2 /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {editing && <PackageEditor initial={editing} onClose={() => setEditing(null)}
                onSave={async (data) => { const ok = await save(data); if (ok) setEditing(null); }} />}
        </div>
    );
}

function PackageEditor({ initial, onClose, onSave }) {
    const isNew = !initial?.id;
    const [form, setForm] = useState(() => ({
        id: initial.id,
        slug: initial.slug || '',
        title: initial.title || '',
        category: initial.category || 'Domestic',
        region: initial.region || '',
        country: initial.country || 'India',
        city: initial.city || '',
        days: initial.days ?? 5,
        nights: initial.nights ?? 4,
        basePrice: initial.basePrice ?? 18000,
        rating: initial.rating ?? 4.8,
        reviews: initial.reviews ?? 0,
        image: initial.image || '',
        tourVideo: initial.tourVideo || '',
        published: initial.published !== false,
        tags: (initial.tags || []).join(', '),
        highlights: (initial.highlights || []).join('\n'),
        includes: (initial.includes || []).join('\n'),
        excludes: (initial.excludes || []).join('\n'),
        itinerary: Array.isArray(initial.itinerary) && initial.itinerary.length
            ? initial.itinerary.map((it) => ({ d: it.d || '', t: it.t || '', c: it.c || '' }))
            : [{ d: 'Day 1', t: '', c: '' }],
    }));
    const [busy, setBusy] = useState(false);

    const up = (k) => (e) => setForm({ ...form, [k]: e.target?.value ?? e });

    const autoSlug = () => {
        if (!form.title) return;
        const s = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        setForm({ ...form, slug: s });
    };

    const addDay = () => setForm({ ...form, itinerary: [...form.itinerary, { d: `Day ${form.itinerary.length + 1}`, t: '', c: '' }] });
    const rmDay = (i) => setForm({ ...form, itinerary: form.itinerary.filter((_, idx) => idx !== i) });
    const upDay = (i, k, v) => setForm({ ...form, itinerary: form.itinerary.map((it, idx) => idx === i ? { ...it, [k]: v } : it) });
    const moveDay = (i, dir) => {
        const next = [...form.itinerary];
        const j = i + dir;
        if (j < 0 || j >= next.length) return;
        [next[i], next[j]] = [next[j], next[i]];
        setForm({ ...form, itinerary: next });
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title is required');
        if (!form.slug.trim()) return toast.error('Slug is required');
        const data = {
            id: form.id,
            slug: form.slug.trim().toLowerCase(),
            title: form.title.trim(),
            category: form.category,
            region: form.region.trim(),
            country: form.country.trim(),
            city: form.city.trim(),
            days: Number(form.days) || 0,
            nights: Number(form.nights) || 0,
            basePrice: Number(form.basePrice) || 0,
            rating: Number(form.rating) || 0,
            reviews: Number(form.reviews) || 0,
            image: form.image.trim(),
            tourVideo: (form.tourVideo || '').trim(),
            published: !!form.published,
            tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
            highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
            includes: form.includes.split('\n').map((s) => s.trim()).filter(Boolean),
            excludes: form.excludes.split('\n').map((s) => s.trim()).filter(Boolean),
            itinerary: form.itinerary.map((it) => ({ d: it.d.trim(), t: it.t.trim(), c: it.c.trim() })).filter((it) => it.d || it.t || it.c),
        };
        setBusy(true);
        await onSave(data);
        setBusy(false);
    };

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <motion.div
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="relative ml-auto w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between p-5 border-b border-slate-200">
                        <div>
                            <h3 className="font-display text-xl font-bold">{isNew ? 'New package' : 'Edit package'}</h3>
                            <p className="text-xs text-ink-muted mt-0.5">{isNew ? 'Fill the form to publish a new tour' : initial.title}</p>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><FiX /></button>
                    </div>

                    <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-5">
                        <section className="bg-slate-50 rounded-2xl p-4">
                            <h4 className="text-xs uppercase tracking-widest text-ink-muted font-bold mb-3">Basics</h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="label">Title *</label>
                                    <input required className="input" value={form.title} onChange={up('title')} onBlur={() => { if (!form.slug) autoSlug(); }} placeholder="e.g. Kerala Backwaters Escape" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="label flex items-center justify-between">
                                        <span>Slug * (URL identifier)</span>
                                        <button type="button" onClick={autoSlug} className="text-brand-500 text-xs normal-case">Generate from title</button>
                                    </label>
                                    <input required pattern="[a-z0-9-]+" className="input font-mono text-sm" value={form.slug} onChange={up('slug')} placeholder="kerala-backwaters" />
                                </div>
                                <div><label className="label">Category</label>
                                    <select className="input" value={form.category} onChange={up('category')}>
                                        <option>Domestic</option>
                                        <option>International</option>
                                    </select>
                                </div>
                                <div><label className="label">Region</label><input className="input" value={form.region} onChange={up('region')} placeholder="South India / Europe / Middle East" /></div>
                                <div><label className="label">Country</label><input className="input" value={form.country} onChange={up('country')} /></div>
                                <div><label className="label">City / Route</label><input className="input" value={form.city} onChange={up('city')} placeholder="Mumbai · Pune · Nashik" /></div>
                                <div><label className="label">Days</label><input type="number" min="1" className="input" value={form.days} onChange={up('days')} /></div>
                                <div><label className="label">Nights</label><input type="number" min="0" className="input" value={form.nights} onChange={up('nights')} /></div>
                                <div><label className="label">Base price (₹ per person)</label><input type="number" min="0" step="100" className="input" value={form.basePrice} onChange={up('basePrice')} /></div>
                                <div><label className="label">Rating</label><input type="number" min="0" max="5" step="0.1" className="input" value={form.rating} onChange={up('rating')} /></div>
                                <div><label className="label">Reviews count</label><input type="number" min="0" className="input" value={form.reviews} onChange={up('reviews')} /></div>
                            </div>
                        </section>

                        <section className="bg-slate-50 rounded-2xl p-4">
                            <h4 className="text-xs uppercase tracking-widest text-ink-muted font-bold mb-3">Hero image + virtual tour</h4>
                            <div className="grid sm:grid-cols-[1fr_200px] gap-4 items-start">
                                <div>
                                    <label className="label">Image URL</label>
                                    <input className="input" value={form.image} onChange={up('image')} placeholder="https://images.unsplash.com/..." />
                                    <p className="text-[11px] text-ink-muted mt-1.5">Use a direct image URL (Unsplash, your CDN, etc). Recommended 1200×700.</p>
                                </div>
                                <div className="w-full aspect-video rounded-xl bg-slate-200 bg-cover bg-center flex items-center justify-center text-ink-muted text-xs"
                                    style={{ backgroundImage: form.image ? `url(${form.image})` : undefined }}>
                                    {!form.image && 'Preview'}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="label flex items-center gap-2">🎥 Virtual tour video URL (optional)</label>
                                <input className="input" value={form.tourVideo} onChange={up('tourVideo')} placeholder="https://cdn.pixabay.com/video/.../sample.mp4" />
                                <p className="text-[11px] text-ink-muted mt-1.5">Direct MP4/WebM URL. Plays muted on hover as a ~10s virtual tour preview. Falls back to the image if empty.</p>
                                {form.tourVideo && (
                                    <video src={form.tourVideo} poster={form.image || undefined}
                                        autoPlay muted loop playsInline
                                        className="mt-2 rounded-xl max-h-48 w-full object-cover" />
                                )}
                            </div>
                        </section>

                        <section className="bg-slate-50 rounded-2xl p-4">
                            <h4 className="text-xs uppercase tracking-widest text-ink-muted font-bold mb-3">Content</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="label">Tags (comma separated)</label>
                                    <input className="input" value={form.tags} onChange={up('tags')} placeholder="Beach, Heritage, Hill Station" />
                                </div>
                                <div>
                                    <label className="label">Highlights — one per line</label>
                                    <textarea rows={4} className="input" value={form.highlights} onChange={up('highlights')} placeholder={"Taj Mahal — UNESCO World Heritage\nRed Fort & India Gate"} />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="label">Included</label>
                                        <textarea rows={4} className="input" value={form.includes} onChange={up('includes')} />
                                    </div>
                                    <div>
                                        <label className="label">Not included</label>
                                        <textarea rows={4} className="input" value={form.excludes} onChange={up('excludes')} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-slate-50 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs uppercase tracking-widest text-ink-muted font-bold">Day-by-day itinerary</h4>
                                <button type="button" onClick={addDay} className="btn-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600"><FiPlus /> Add day</button>
                            </div>
                            <div className="space-y-3">
                                {form.itinerary.map((it, i) => (
                                    <div key={i} className="bg-white rounded-xl p-3 border border-slate-200">
                                        <div className="flex items-start gap-3">
                                            <div className="flex flex-col gap-1">
                                                <button type="button" onClick={() => moveDay(i, -1)} disabled={i === 0} className="w-7 h-7 rounded-lg hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center"><FiChevronUp /></button>
                                                <button type="button" onClick={() => moveDay(i, +1)} disabled={i === form.itinerary.length - 1} className="w-7 h-7 rounded-lg hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center"><FiChevronDown /></button>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="grid sm:grid-cols-[110px_1fr] gap-2">
                                                    <input className="input py-2 text-sm" value={it.d} onChange={(e) => upDay(i, 'd', e.target.value)} placeholder="Day 1" />
                                                    <input className="input py-2 text-sm" value={it.t} onChange={(e) => upDay(i, 't', e.target.value)} placeholder="Day title — e.g. Arrival & check-in" />
                                                </div>
                                                <textarea rows={2} className="input text-sm" value={it.c} onChange={(e) => upDay(i, 'c', e.target.value)} placeholder="What's included on this day…" />
                                            </div>
                                            <button type="button" onClick={() => rmDay(i)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center shrink-0"><FiTrash2 /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <label className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 cursor-pointer">
                            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-brand-500" />
                            <div>
                                <div className="text-sm font-semibold text-ink">Publish this package</div>
                                <div className="text-xs text-ink-muted">When on, it appears on the public site under /packages.</div>
                            </div>
                        </label>
                    </form>

                    <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
                        <button onClick={onClose} className="btn-sm rounded-xl bg-slate-100 text-ink hover:bg-slate-200">Cancel</button>
                        <button onClick={submit} disabled={busy} className="btn-sm rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60">
                            <FiSave /> {busy ? 'Saving…' : (isNew ? 'Create package' : 'Save changes')}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* =========================================================================
 * Settings
 * ========================================================================= */

function SettingsPanel({ user }) {
    const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (pw.next.length < 8) return toast.error('New password must be at least 8 characters');
        if (pw.next !== pw.confirm) return toast.error('Passwords do not match');
        setBusy(true);
        const r = await api.adminChangePassword(pw.current, pw.next);
        setBusy(false);
        if (!r.ok) {
            toast.error(r.error === 'invalid_current_password' ? 'Current password is wrong' :
                        r.error === 'weak_password' ? 'New password is too weak' :
                        `Failed (${r.error})`);
            return;
        }
        setPw({ current: '', next: '', confirm: '' });
        toast.success('Password changed');
    };

    const downloadBackup = async () => {
        try {
            await downloadWithAuth(api.adminBackupUrl(), `tripwithuz-backup-${new Date().toISOString().slice(0, 10)}.json`);
            toast.success('Backup downloaded');
        } catch (e) { toast.error(e.message || 'Backup failed'); }
    };

    return (
        <div className="space-y-4 max-w-3xl">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center"><FiShield /></div>
                    <div>
                        <h3 className="font-semibold text-ink">Account</h3>
                        <p className="text-xs text-ink-muted">Signed in as <span className="font-mono">{user?.username}</span></p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid sm:grid-cols-3 gap-3 mt-4">
                    <div>
                        <label className="label">Current password</label>
                        <input type="password" className="input" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required />
                    </div>
                    <div>
                        <label className="label">New password</label>
                        <input type="password" className="input" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required minLength={8} />
                    </div>
                    <div>
                        <label className="label">Confirm new</label>
                        <input type="password" className="input" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required minLength={8} />
                    </div>
                    <div className="sm:col-span-3">
                        <button disabled={busy} className="btn-sm rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60">
                            <FiLock /> {busy ? 'Updating…' : 'Change password'}
                        </button>
                        <p className="text-[11px] text-ink-muted mt-2">Minimum 8 characters. New password is hashed with scrypt before storing.</p>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FiDatabase /></div>
                    <div>
                        <h3 className="font-semibold text-ink">Data backup</h3>
                        <p className="text-xs text-ink-muted">Download a JSON snapshot of all enquiries and packages.</p>
                    </div>
                </div>
                <button onClick={downloadBackup} className="btn-sm rounded-xl border border-slate-200 hover:bg-slate-50 text-ink">
                    <FiDownload /> Download backup (.json)
                </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><FiUsers /></div>
                    <div>
                        <h3 className="font-semibold text-ink">Contact where enquiries are delivered</h3>
                        <p className="text-xs text-ink-muted">Server-side addresses from .env — edit the file and restart the server to change.</p>
                    </div>
                </div>
                <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-50 rounded-xl p-3">
                        <dt className="text-[11px] uppercase text-ink-muted font-semibold">Recipient email</dt>
                        <dd className="font-mono text-ink mt-1 break-all">{BRAND.email}</dd>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                        <dt className="text-[11px] uppercase text-ink-muted font-semibold">WhatsApp number</dt>
                        <dd className="font-mono text-ink mt-1">{BRAND.whatsapp}</dd>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                        <dt className="text-[11px] uppercase text-ink-muted font-semibold">Phone</dt>
                        <dd className="font-mono text-ink mt-1">{BRAND.phone}</dd>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                        <dt className="text-[11px] uppercase text-ink-muted font-semibold">Public site</dt>
                        <dd className="mt-1"><Link to="/" className="text-brand-500 hover:underline inline-flex items-center gap-1">Open site <FiExternalLink /></Link></dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

/* =========================================================================
 * Bookings
 * ========================================================================= */

const BOOKING_STATUS = {
    pending_confirmation:      { label: 'Quotation',    cls: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-500' },
    pending_payment:           { label: 'Awaiting pay', cls: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-500' },
    paid_pending_verification: { label: 'Verify UPI',   cls: 'bg-violet-50 text-violet-700 border-violet-200',dot: 'bg-violet-500' },
    paid:                      { label: 'Paid',         cls: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500' },
    cancelled:                 { label: 'Cancelled',    cls: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-400' },
};

function BookingsPanel() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState('');

    const load = async () => {
        setLoading(true);
        const r = await api.adminBookings(filter ? `status=${filter}` : '');
        setLoading(false);
        if (r.ok) setRows(r.data.bookings);
        else toast.error('Failed to load bookings');
    };
    useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

    const setStatus = async (id, status) => {
        const r = await api.adminUpdateBooking(id, { status });
        if (r.ok) {
            setRows((prev) => prev.map((x) => x.id === id ? r.data.booking : x));
            if (active?.id === id) setActive(r.data.booking);
            toast.success('Status updated');
        } else toast.error('Update failed');
    };

    const del = async (id) => {
        if (!confirm('Delete this booking? This cannot be undone.')) return;
        const r = await api.adminDeleteBooking(id);
        if (r.ok) { setRows((p) => p.filter((b) => b.id !== id)); setActive(null); toast.success('Deleted'); }
        else toast.error('Delete failed');
    };

    const totalRevenue = rows
        .filter((b) => b.status === 'paid' || b.status === 'paid_pending_verification')
        .reduce((s, b) => s + (b.quotation?.total || 0), 0);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-ink-muted">
                    <span className="font-semibold text-ink">{rows.length}</span> bookings
                    {totalRevenue > 0 && <><span className="mx-2 text-slate-300">·</span>
                        <span className="text-green-600 font-semibold">₹{totalRevenue.toLocaleString('en-IN')} revenue</span></>}
                </div>
                <div className="ml-auto flex gap-2 flex-wrap">
                    <FilterChip label="All" value="" active={filter} onClick={() => setFilter('')} />
                    {Object.entries(BOOKING_STATUS).map(([k, m]) => (
                        <FilterChip key={k} label={m.label} value={k} active={filter} onClick={() => setFilter(k)} />
                    ))}
                    <button onClick={load} className="btn-sm rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-ink-muted"><FiRefreshCw /> Refresh</button>
                </div>
            </div>

            {loading ? <Loading /> : rows.length === 0 ? (
                <EmptyState icon={<FiCreditCard />} title="No bookings yet" hint="Once customers generate quotations from the website they'll appear here." />
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-ink-muted">
                                <tr>
                                    <Th>Ref / Date</Th>
                                    <Th>Customer</Th>
                                    <Th>Package</Th>
                                    <Th>Total</Th>
                                    <Th>Status</Th>
                                    <Th className="text-right">Actions</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.map((b) => {
                                    const meta = BOOKING_STATUS[b.status] || BOOKING_STATUS.pending_confirmation;
                                    return (
                                        <tr key={b.id} onClick={() => setActive(b)} className="hover:bg-slate-50 cursor-pointer">
                                            <td className="px-4 py-3">
                                                <div className="text-ink font-mono text-[11px]">{b.id}</div>
                                                <div className="text-[11px] text-ink-muted">{relativeTime(b.createdAt)}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-ink">{b.customer?.name}</div>
                                                <div className="text-xs text-ink-muted">{b.customer?.email}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-ink">{b.packageTitle}</div>
                                                <div className="text-[11px] text-ink-muted">{b.quotation?.travelers} pax · {b.travel_date}</div>
                                            </td>
                                            <td className="px-4 py-3 font-semibold tabular-nums">₹{(b.quotation?.total || 0).toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.cls}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => setActive(b)} className="text-brand-500 hover:underline mr-3 text-sm font-medium">View</button>
                                                <button onClick={() => del(b.id)} className="text-red-500 hover:bg-red-50 rounded-lg w-8 h-8 inline-flex items-center justify-center" title="Delete">
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {active && <BookingDrawer booking={active} onClose={() => setActive(null)} onStatus={(s) => setStatus(active.id, s)} onDelete={() => del(active.id)} />}
        </div>
    );
}

function BookingDrawer({ booking, onClose, onStatus, onDelete }) {
    const q = booking.quotation || {};
    const publicUrl = `${window.location.origin}/quotation/${booking.id}`;
    const copyLink = () => {
        navigator.clipboard?.writeText(publicUrl).then(() => toast.success('Quotation link copied'));
    };
    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                <motion.div
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="relative ml-auto w-full max-w-xl h-full bg-white shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between p-5 border-b border-slate-200">
                        <div className="min-w-0">
                            <h3 className="font-display text-xl font-bold truncate">{booking.packageTitle}</h3>
                            <p className="text-xs text-ink-muted font-mono mt-0.5">{booking.id}</p>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><FiX /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        <div>
                            <div className="label mb-2">Update status</div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(BOOKING_STATUS).map(([k, m]) => (
                                    <button key={k} onClick={() => onStatus(k)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${booking.status === k ? m.cls + ' ring-2 ring-offset-1 ring-brand-500/30' : 'bg-white text-ink-muted border-slate-200 hover:border-brand-500'}`}>
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4">
                            <div className="label mb-2">Customer</div>
                            <div className="space-y-1.5 text-sm">
                                <div><b>{booking.customer?.name}</b></div>
                                <div>{booking.customer?.email}</div>
                                <div>{booking.customer?.phone}</div>
                                <div className="text-xs text-ink-muted">Travel date: {booking.travel_date}</div>
                                {booking.notes && <div className="text-xs text-ink mt-2 p-2 bg-white rounded-lg border border-slate-200">{booking.notes}</div>}
                            </div>
                            <div className="flex gap-2 mt-3">
                                <a href={`mailto:${booking.customer?.email}`} className="btn-sm rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100"><FiMail /> Email</a>
                                <a href={`tel:${booking.customer?.phone}`} className="btn-sm rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100"><FiPhone /> Call</a>
                                <a href={`https://wa.me/${String(booking.customer?.phone || '').replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" className="btn-sm rounded-xl bg-green-50 text-green-700 hover:bg-green-100"><FiMessageCircle /> WhatsApp</a>
                            </div>
                        </div>

                        <div>
                            <div className="label mb-2">Quotation</div>
                            <div className="border border-slate-200 rounded-xl overflow-hidden text-sm">
                                {q.lineItems?.map((li, i) => (
                                    <div key={i} className="flex justify-between items-center px-4 py-2 border-b border-slate-100 last:border-0">
                                        <div className="flex-1">
                                            <div className="font-medium">{li.label}</div>
                                            {li.qty > 1 && <div className="text-[11px] text-ink-muted">{li.qty} × ₹{li.unit?.toLocaleString('en-IN')}</div>}
                                        </div>
                                        <div className="tabular-nums">₹{(li.amount || 0).toLocaleString('en-IN')}</div>
                                    </div>
                                ))}
                                <div className="bg-slate-50 px-4 py-2 text-xs">
                                    <div className="flex justify-between"><span>Subtotal</span><span>₹{q.subtotal?.toLocaleString('en-IN')}</span></div>
                                    {q.groupDiscount > 0 && <div className="flex justify-between text-green-600"><span>Group discount</span><span>-₹{q.groupDiscount.toLocaleString('en-IN')}</span></div>}
                                    <div className="flex justify-between"><span>GST</span><span>₹{q.gst?.toLocaleString('en-IN')}</span></div>
                                    <div className="flex justify-between font-bold text-ink text-sm pt-1 mt-1 border-t border-slate-300"><span>Total</span><span>₹{q.total?.toLocaleString('en-IN')}</span></div>
                                </div>
                            </div>
                        </div>

                        {booking.paymentRef && (
                            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
                                <div className="label mb-1"><FiSmartphone className="inline" /> UPI transaction reported</div>
                                <div className="font-mono text-sm text-violet-800">{booking.paymentRef}</div>
                                <div className="text-[11px] text-ink-muted mt-1">Reported {relativeTime(booking.paidAt)}</div>
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                            <div className="label mb-1">Public quotation link</div>
                            <div className="flex items-center justify-between gap-2">
                                <code className="text-xs text-blue-800 break-all">{publicUrl}</code>
                                <button onClick={copyLink} className="btn-sm rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-100"><FiCopy /> Copy</button>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-200 flex justify-between">
                        <button onClick={onDelete} className="text-red-500 hover:bg-red-50 rounded-xl px-3 py-2 text-sm inline-flex items-center gap-1.5"><FiTrash2 /> Delete</button>
                        <button onClick={onClose} className="btn-sm rounded-xl bg-slate-100 text-ink hover:bg-slate-200">Close</button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* =========================================================================
 * Ads / Promo
 * ========================================================================= */

const AD_PLACEMENTS = [
    { key: 'home_hero',      label: 'Home · Hero banner' },
    { key: 'home_mid',       label: 'Home · Mid-page promo' },
    { key: 'packages_top',   label: 'Packages · Top banner' },
    { key: 'sitewide_strip', label: 'Sitewide · Thin strip' },
];
const AD_THEMES = [
    { key: 'brand',   label: 'Orange (brand)' },
    { key: 'blue',    label: 'Blue' },
    { key: 'emerald', label: 'Emerald' },
    { key: 'dark',    label: 'Dark' },
];

function AdsPanel() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);

    const load = async () => {
        setLoading(true);
        const r = await api.adminAds();
        setLoading(false);
        if (r.ok) setRows(r.data.ads);
        else toast.error('Failed to load ads');
    };
    useEffect(() => { load(); }, []);

    const save = async (data) => {
        const isNew = !data.id;
        const r = isNew ? await api.adminCreateAd(data) : await api.adminUpdateAd(data.id, data);
        if (!r.ok) { toast.error(`Save failed (${r.error})`); return false; }
        setRows((prev) => isNew ? [r.data.ad, ...prev] : prev.map((p) => p.id === r.data.ad.id ? r.data.ad : p));
        toast.success(isNew ? 'Ad created' : 'Ad saved');
        return true;
    };

    const del = async (id) => {
        if (!confirm('Delete this ad?')) return;
        const r = await api.adminDeleteAd(id);
        if (r.ok) { setRows((p) => p.filter((x) => x.id !== id)); toast.success('Deleted'); }
        else toast.error('Delete failed');
    };

    const toggle = async (ad) => {
        const r = await api.adminUpdateAd(ad.id, { active: !(ad.active !== false) });
        if (r.ok) setRows((p) => p.map((x) => x.id === ad.id ? r.data.ad : x));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-ink-muted">
                    <span className="font-semibold text-ink">{rows.length}</span> ads
                    <span className="mx-2 text-slate-300">·</span>
                    <span className="text-green-600">{rows.filter((r) => r.active !== false).length} active</span>
                </div>
                <div className="ml-auto flex gap-2">
                    <button onClick={load} className="btn-sm rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-ink-muted"><FiRefreshCw /> Refresh</button>
                    <button onClick={() => setEditing({})} className="btn-sm rounded-xl bg-brand-500 text-white hover:bg-brand-600"><FiPlus /> New ad</button>
                </div>
            </div>

            {loading ? <Loading /> : rows.length === 0 ? (
                <EmptyState icon={<FiImage />} title="No ads yet" hint="Create a promo ad to feature on the public site." />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rows.map((ad) => {
                        const placement = AD_PLACEMENTS.find((p) => p.key === ad.placement)?.label || ad.placement;
                        return (
                            <motion.div key={ad.id} whileHover={{ y: -3 }} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
                                <div className="relative h-36 bg-cover bg-center bg-slate-200" style={{ backgroundImage: ad.image ? `url(${ad.image})` : undefined }}>
                                    {ad.video && (
                                        <video src={ad.video} poster={ad.image || undefined} autoPlay muted loop playsInline
                                            className="absolute inset-0 w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                        {ad.badge && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-500 text-white">{ad.badge}</span>}
                                        {ad.video && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/70 text-white">▶ Video</span>}
                                    </div>
                                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full ${ad.active !== false ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
                                        {ad.active !== false ? 'Active' : 'Paused'}
                                    </span>
                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <div className="font-display font-bold text-sm leading-tight line-clamp-2">{ad.title}</div>
                                        <div className="text-[11px] opacity-80">{placement}</div>
                                    </div>
                                </div>
                                <div className="p-3 flex gap-1.5">
                                    <button onClick={() => setEditing(ad)} className="flex-1 btn-sm rounded-lg bg-slate-100 text-ink hover:bg-slate-200"><FiEdit2 /> Edit</button>
                                    <button onClick={() => toggle(ad)} className={`btn-sm rounded-lg ${ad.active !== false ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                        <FiZap />
                                    </button>
                                    <button onClick={() => del(ad.id)} className="btn-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><FiTrash2 /></button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {editing && <AdEditor initial={editing} onClose={() => setEditing(null)} onSave={async (d) => { const ok = await save(d); if (ok) setEditing(null); }} />}
        </div>
    );
}

function AdEditor({ initial, onClose, onSave }) {
    const isNew = !initial?.id;
    const [form, setForm] = useState({
        id: initial.id,
        title: initial.title || '',
        subtitle: initial.subtitle || '',
        description: initial.description || '',
        badge: initial.badge || '',
        ctaText: initial.ctaText || 'Learn more',
        ctaLink: initial.ctaLink || '/packages',
        image: initial.image || '',
        video: initial.video || '',
        placement: initial.placement || 'home_hero',
        theme: initial.theme || 'brand',
        priority: initial.priority ?? 5,
        active: initial.active !== false,
        startDate: initial.startDate || '',
        endDate: initial.endDate || '',
    });
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title) return toast.error('Title is required');
        setBusy(true);
        await onSave({ ...form, priority: Number(form.priority) });
        setBusy(false);
    };

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25 }}
                    className="relative ml-auto w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between p-5 border-b border-slate-200">
                        <h3 className="font-display text-xl font-bold">{isNew ? 'New ad' : 'Edit ad'}</h3>
                        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><FiX /></button>
                    </div>
                    <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-4">
                        <div><label className="label">Title *</label><input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                        <div><label className="label">Subtitle</label><input className="input" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
                        <div><label className="label">Description</label><textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div><label className="label">Badge text</label><input className="input" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Limited Time" /></div>
                            <div><label className="label">Priority (higher shows first)</label><input type="number" className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} /></div>
                            <div><label className="label">CTA button text</label><input className="input" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} /></div>
                            <div><label className="label">CTA link</label><input className="input" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} placeholder="/packages" /></div>
                        </div>
                        <div><label className="label">Image URL (fallback / poster)</label><input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                            {form.image && <img src={form.image} alt="" className="mt-2 rounded-xl max-h-48 object-cover w-full" />}
                        </div>
                        <div>
                            <label className="label flex items-center gap-2"><FiSmartphone /> Video URL (optional — plays muted on loop)</label>
                            <input className="input" value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} placeholder="https://.../promo.mp4" />
                            <p className="text-[11px] text-ink-muted mt-1.5">Direct MP4/WebM URL. If set, video plays as the banner background; image is used as the poster and the fallback.</p>
                            {form.video && (
                                <video src={form.video} poster={form.image || undefined} autoPlay muted loop playsInline className="mt-2 rounded-xl max-h-48 w-full object-cover" />
                            )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div><label className="label">Placement</label>
                                <select className="input" value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}>
                                    {AD_PLACEMENTS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                                </select>
                            </div>
                            <div><label className="label">Theme</label>
                                <select className="input" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
                                    {AD_THEMES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                                </select>
                            </div>
                            <div><label className="label">Start date (optional)</label><input type="date" className="input" value={form.startDate?.slice(0, 10) || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                            <div><label className="label">End date (optional)</label><input type="date" className="input" value={form.endDate?.slice(0, 10) || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
                        </div>
                        <label className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 cursor-pointer">
                            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-brand-500" />
                            <div className="text-sm">
                                <div className="font-semibold text-ink">Active</div>
                                <div className="text-[11px] text-ink-muted">Only active ads are shown on the public site.</div>
                            </div>
                        </label>
                    </form>
                    <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
                        <button onClick={onClose} className="btn-sm rounded-xl bg-slate-100 text-ink hover:bg-slate-200">Cancel</button>
                        <button onClick={submit} disabled={busy} className="btn-sm rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60">
                            <FiSave /> {busy ? 'Saving…' : (isNew ? 'Create ad' : 'Save changes')}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* =========================================================================
 * Blogs
 * ========================================================================= */

function BlogsPanel() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [q, setQ] = useState('');

    const load = async () => {
        setLoading(true);
        const r = await api.adminBlogs();
        setLoading(false);
        if (r.ok) setRows(r.data.blogs);
        else toast.error('Failed to load blog posts');
    };
    useEffect(() => { load(); }, []);

    const save = async (data) => {
        const isNew = !data.id;
        const r = isNew ? await api.adminCreateBlog(data) : await api.adminUpdateBlog(data.id, data);
        if (!r.ok) {
            toast.error(r.error === 'slug_exists' ? 'A post with that slug already exists' : `Save failed (${r.error})`);
            return false;
        }
        setRows((prev) => isNew ? [r.data.blog, ...prev] : prev.map((p) => p.id === r.data.blog.id ? r.data.blog : p));
        toast.success(isNew ? 'Post published' : 'Post saved');
        return true;
    };

    const del = async (id, title) => {
        if (!confirm(`Delete "${title}"?`)) return;
        const r = await api.adminDeleteBlog(id);
        if (r.ok) { setRows((p) => p.filter((x) => x.id !== id)); toast.success('Deleted'); }
        else toast.error('Delete failed');
    };

    const toggle = async (blog) => {
        const r = await api.adminUpdateBlog(blog.id, { published: !(blog.published !== false) });
        if (r.ok) setRows((p) => p.map((x) => x.id === blog.id ? r.data.blog : x));
    };

    const filtered = q
        ? rows.filter((b) => (b.title + ' ' + (b.tags || []).join(' ')).toLowerCase().includes(q.toLowerCase()))
        : rows;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-ink-muted">
                    <span className="font-semibold text-ink">{rows.length}</span> posts
                    <span className="mx-2 text-slate-300">·</span>
                    <span className="text-green-600">{rows.filter((r) => r.published !== false).length} published</span>
                </div>
                <div className="ml-auto flex gap-2">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="input pl-9 py-2" style={{ width: 220 }} />
                    </div>
                    <button onClick={load} className="btn-sm rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-ink-muted"><FiRefreshCw /></button>
                    <button onClick={() => setEditing({})} className="btn-sm rounded-xl bg-brand-500 text-white hover:bg-brand-600"><FiPlus /> New post</button>
                </div>
            </div>

            {loading ? <Loading /> : filtered.length === 0 ? (
                <EmptyState icon={<FiFileText />} title="No blog posts yet" hint="Write your first SEO-optimised post to attract travellers." />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((b) => (
                        <motion.div key={b.id} whileHover={{ y: -3 }} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
                            <div className="relative h-36 bg-cover bg-center bg-slate-200" style={{ backgroundImage: b.coverImage ? `url(${b.coverImage})` : undefined }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full ${b.published !== false ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
                                    {b.published !== false ? 'Live' : 'Draft'}
                                </span>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-display text-sm font-bold text-ink leading-tight line-clamp-2">{b.title}</h3>
                                <p className="text-[11px] text-ink-muted mt-1">/{b.slug}</p>
                                {b.tags?.length > 0 && (
                                    <div className="mt-2 flex gap-1 flex-wrap">
                                        {b.tags.slice(0, 3).map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-600">{t}</span>)}
                                    </div>
                                )}
                                <div className="mt-auto pt-3 flex gap-1.5">
                                    <button onClick={() => setEditing(b)} className="flex-1 btn-sm rounded-lg bg-slate-100 text-ink hover:bg-slate-200"><FiEdit2 /> Edit</button>
                                    <button onClick={() => toggle(b)} className={`btn-sm rounded-lg ${b.published !== false ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}><FiZap /></button>
                                    <button onClick={() => del(b.id, b.title)} className="btn-sm rounded-lg bg-red-50 text-red-600"><FiTrash2 /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {editing && <BlogEditor initial={editing} onClose={() => setEditing(null)} onSave={async (d) => { const ok = await save(d); if (ok) setEditing(null); }} />}
        </div>
    );
}

function BlogEditor({ initial, onClose, onSave }) {
    const isNew = !initial?.id;
    const [form, setForm] = useState({
        id: initial.id,
        slug: initial.slug || '',
        title: initial.title || '',
        excerpt: initial.excerpt || '',
        coverImage: initial.coverImage || '',
        author: initial.author || 'Trip with uz Editorial',
        tags: (initial.tags || []).join(', '),
        seoTitle: initial.seoTitle || '',
        seoDescription: initial.seoDescription || '',
        content: initial.content || '',
        published: initial.published !== false,
    });
    const [busy, setBusy] = useState(false);

    const autoSlug = () => {
        if (!form.title) return;
        const s = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        setForm({ ...form, slug: s });
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title is required');
        setBusy(true);
        await onSave({
            ...form,
            tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        });
        setBusy(false);
    };

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25 }}
                    className="relative ml-auto w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between p-5 border-b border-slate-200">
                        <div>
                            <h3 className="font-display text-xl font-bold">{isNew ? 'New blog post' : 'Edit post'}</h3>
                            <p className="text-xs text-ink-muted mt-0.5">Markdown supported. Use `##` for headings, `**bold**`, `- list`, `[link](url)`.</p>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><FiX /></button>
                    </div>
                    <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-4">
                        <section className="bg-slate-50 rounded-2xl p-4 space-y-3">
                            <h4 className="text-xs uppercase tracking-widest text-ink-muted font-bold">Basics</h4>
                            <div><label className="label">Title *</label><input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} onBlur={() => { if (!form.slug) autoSlug(); }} /></div>
                            <div><label className="label flex items-center justify-between">
                                <span>Slug *</span>
                                <button type="button" onClick={autoSlug} className="text-brand-500 text-xs normal-case">Generate from title</button>
                            </label><input required pattern="[a-z0-9-]+" className="input font-mono text-sm" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
                            <div className="grid sm:grid-cols-2 gap-3">
                                <div><label className="label">Author</label><input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
                                <div><label className="label">Tags (comma separated)</label><input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Kerala, Honeymoon" /></div>
                            </div>
                            <div><label className="label">Cover image URL</label><input className="input" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
                                {form.coverImage && <img src={form.coverImage} alt="" className="mt-2 rounded-xl max-h-48 object-cover w-full" />}
                            </div>
                            <div><label className="label">Excerpt (1-2 sentences)</label><textarea rows={2} className="input" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
                        </section>

                        <section className="bg-slate-50 rounded-2xl p-4 space-y-3">
                            <h4 className="text-xs uppercase tracking-widest text-ink-muted font-bold">SEO</h4>
                            <div><label className="label">SEO title (max 60 chars)</label><input className="input" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></div>
                            <div><label className="label">Meta description (max 160 chars)</label><textarea rows={2} className="input" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></div>
                        </section>

                        <section className="bg-slate-50 rounded-2xl p-4">
                            <label className="label">Content (Markdown)</label>
                            <textarea rows={16} className="input font-mono text-sm" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                        </section>

                        <label className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 cursor-pointer">
                            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-brand-500" />
                            <div className="text-sm">
                                <div className="font-semibold text-ink">Publish this post</div>
                                <div className="text-[11px] text-ink-muted">Only published posts appear on the public /blog.</div>
                            </div>
                        </label>
                    </form>
                    <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
                        <button onClick={onClose} className="btn-sm rounded-xl bg-slate-100 text-ink hover:bg-slate-200">Cancel</button>
                        <button onClick={submit} disabled={busy} className="btn-sm rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60">
                            <FiSave /> {busy ? 'Saving…' : (isNew ? 'Publish post' : 'Save changes')}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* =========================================================================
 * Small helpers
 * ========================================================================= */

function summarize(e) {
    const f = e.fields || {};
    return f.Destination || f['Preferred Country'] || f['Target Country'] || f.Package || f.Message || f.Notes || '—';
}

function formatDate(iso, style = 'full') {
    try {
        const d = new Date(iso);
        if (style === 'short') return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
    } catch { return iso; }
}

function relativeTime(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return formatDate(iso, 'short');
}

function Loading() {
    return (
        <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
        </div>
    );
}

function EmptyState({ icon, title, hint }) {
    return (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-2xl">{icon}</div>
            <div className="font-semibold text-ink">{title}</div>
            {hint && <p className="text-sm text-ink-muted mt-1">{hint}</p>}
        </div>
    );
}

function ErrorBlock({ msg, onRetry }) {
    return (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3"><FiAlertCircle size={22} /></div>
            <div className="font-semibold text-ink">{msg}</div>
            {onRetry && <button onClick={onRetry} className="btn-sm mt-3 rounded-xl bg-slate-100 text-ink hover:bg-slate-200"><FiRefreshCw /> Retry</button>}
        </div>
    );
}
