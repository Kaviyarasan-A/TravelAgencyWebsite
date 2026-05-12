import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiCalendar, FiUser, FiTag, FiArrowRight, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { api } from '../api.js';
import { BRAND } from '../data.js';

function formatDate(d) {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }); }
    catch { return d; }
}

// Tiny, safe-ish markdown → HTML renderer. Handles headings, lists, bold, italic,
// inline links, line breaks. For richer content, the admin can paste clean HTML.
function md(src = '') {
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lines = src.split(/\r?\n/);
    const out = [];
    let inUl = false, inOl = false, inTable = false;

    const closeLists = () => {
        if (inUl) { out.push('</ul>'); inUl = false; }
        if (inOl) { out.push('</ol>'); inOl = false; }
        if (inTable) { out.push('</tbody></table>'); inTable = false; }
    };

    const inline = (s) => esc(s)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-[13px]">$1</code>')
        .replace(/\[(.+?)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-500 underline hover:text-brand-600">$1</a>');

    for (let raw of lines) {
        const line = raw.trimEnd();
        if (!line.trim()) { closeLists(); continue; }

        let m;
        if ((m = line.match(/^######\s+(.+)/))) { closeLists(); out.push(`<h6 class="font-display font-bold text-base mt-5 mb-2">${inline(m[1])}</h6>`); continue; }
        if ((m = line.match(/^#####\s+(.+)/)))  { closeLists(); out.push(`<h5 class="font-display font-bold text-lg mt-6 mb-2">${inline(m[1])}</h5>`); continue; }
        if ((m = line.match(/^####\s+(.+)/)))   { closeLists(); out.push(`<h4 class="font-display font-bold text-xl mt-6 mb-2">${inline(m[1])}</h4>`); continue; }
        if ((m = line.match(/^###\s+(.+)/)))    { closeLists(); out.push(`<h3 class="font-display font-bold text-2xl mt-8 mb-3">${inline(m[1])}</h3>`); continue; }
        if ((m = line.match(/^##\s+(.+)/)))     { closeLists(); out.push(`<h2 class="font-display font-extrabold text-3xl mt-10 mb-4">${inline(m[1])}</h2>`); continue; }
        if ((m = line.match(/^#\s+(.+)/)))      { closeLists(); out.push(`<h1 class="font-display font-extrabold text-4xl mt-12 mb-5">${inline(m[1])}</h1>`); continue; }

        if (/^[-*+]\s+/.test(line)) {
            if (!inUl) { closeLists(); out.push('<ul class="list-disc ml-6 space-y-1.5 my-4">'); inUl = true; }
            out.push(`<li>${inline(line.replace(/^[-*+]\s+/, ''))}</li>`);
            continue;
        }
        if (/^\d+\.\s+/.test(line)) {
            if (!inOl) { closeLists(); out.push('<ol class="list-decimal ml-6 space-y-1.5 my-4">'); inOl = true; }
            out.push(`<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`);
            continue;
        }
        if (line.startsWith('|') && line.endsWith('|')) {
            const cells = line.slice(1, -1).split('|').map((c) => c.trim());
            if (cells.every((c) => /^[-: ]+$/.test(c))) continue; // separator row
            if (!inTable) {
                closeLists();
                out.push('<table class="w-full my-6 border-collapse text-sm"><thead><tr>' +
                    cells.map((c) => `<th class="border border-ink-line px-3 py-2 bg-slate-50 text-left font-semibold">${inline(c)}</th>`).join('') +
                    '</tr></thead><tbody>');
                inTable = true;
            } else {
                out.push('<tr>' + cells.map((c) => `<td class="border border-ink-line px-3 py-2">${inline(c)}</td>`).join('') + '</tr>');
            }
            continue;
        }

        closeLists();
        out.push(`<p class="leading-relaxed text-ink my-4 text-[15.5px]">${inline(line)}</p>`);
    }
    closeLists();
    return out.join('\n');
}

export default function BlogDetail() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        api.getBlog(slug).then((r) => {
            if (!alive) return;
            setLoading(false);
            if (r.ok) { setBlog(r.data.blog); setRelated(r.data.related || []); }
            else setErr(r.error);
        });
        return () => { alive = false; };
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }
    if (err || !blog) {
        return (
            <div className="container-x py-20 text-center">
                <h1 className="font-display text-3xl font-bold">Article not found</h1>
                <Link to="/blog" className="btn-primary mt-6">Browse all articles</Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`${blog.seoTitle || blog.title} | ${BRAND.name}`}</title>
                <meta name="description" content={blog.seoDescription || blog.excerpt} />
                <meta name="keywords" content={(blog.tags || []).join(', ')} />
                <link rel="canonical" href={`https://tripwithuz.com/blog/${blog.slug}`} />
                <meta property="og:title" content={blog.seoTitle || blog.title} />
                <meta property="og:description" content={blog.seoDescription || blog.excerpt} />
                {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://tripwithuz.com/blog/${blog.slug}`} />
                <meta property="article:published_time" content={blog.createdAt} />
                <meta property="article:modified_time" content={blog.updatedAt || blog.createdAt} />
                <meta property="article:author" content={blog.author || 'Trip with uz'} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={blog.seoTitle || blog.title} />
                <meta name="twitter:description" content={blog.seoDescription || blog.excerpt} />
                {blog.coverImage && <meta name="twitter:image" content={blog.coverImage} />}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: blog.title,
                        description: blog.seoDescription || blog.excerpt,
                        image: blog.coverImage,
                        author: { '@type': 'Person', name: blog.author || 'Trip with uz' },
                        publisher: {
                            '@type': 'Organization',
                            name: BRAND.name,
                            logo: { '@type': 'ImageObject', url: 'https://tripwithuz.com/logo.png' },
                        },
                        datePublished: blog.createdAt,
                        dateModified: blog.updatedAt || blog.createdAt,
                        keywords: (blog.tags || []).join(', '),
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `https://tripwithuz.com/blog/${blog.slug}`,
                        },
                    })}
                </script>
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tripwithuz.com/' },
                        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://tripwithuz.com/blog' },
                        { '@type': 'ListItem', position: 3, name: blog.title, item: `https://tripwithuz.com/blog/${blog.slug}` },
                    ],
                })}</script>
            </Helmet>

            <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${blog.coverImage})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                <div className="container-x relative h-full flex items-end pb-10 text-white">
                    <div className="max-w-3xl">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white mb-4">
                            <FiArrowLeft /> All articles
                        </Link>
                        {blog.tags?.length > 0 && (
                            <div className="flex gap-2 flex-wrap mb-3">
                                {blog.tags.slice(0, 4).map((t) => (
                                    <span key={t} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium"><FiTag className="inline mr-1" size={10} />{t}</span>
                                ))}
                            </div>
                        )}
                        <h1 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight text-balance">{blog.title}</h1>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/85">
                            <span className="inline-flex items-center gap-1.5"><FiUser /> {blog.author || 'Trip with uz'}</span>
                            <span className="inline-flex items-center gap-1.5"><FiCalendar /> {formatDate(blog.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container-x grid lg:grid-cols-[1fr_300px] gap-10 items-start">
                    <article className="max-w-3xl prose prose-ink" dangerouslySetInnerHTML={{ __html: md(blog.content || blog.excerpt || '') }} />

                    <aside className="lg:sticky lg:top-24 space-y-4">
                        <div className="card p-5 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                            <h3 className="font-display text-lg font-bold">Plan a trip like this</h3>
                            <p className="text-sm opacity-90 mt-1">Talk to a human who actually travels. Free 15-min call.</p>
                            <Link to="/contact" className="btn-white w-full mt-4">Request itinerary <FiArrowRight /></Link>
                        </div>
                        <div className="card p-5">
                            <h4 className="font-semibold text-ink text-sm mb-3">Quick contact</h4>
                            <a href={`tel:${BRAND.phone.replace(/\s+/g,'')}`} className="flex items-center gap-2 py-1.5 hover:text-brand-500 text-sm">
                                <FiPhone className="text-brand-500" /> {BRAND.phone}
                            </a>
                            <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 py-1.5 hover:text-brand-500 text-sm">
                                <FiMessageCircle className="text-green-500" /> Chat on WhatsApp
                            </a>
                        </div>
                    </aside>
                </div>
            </section>

            {related.length > 0 && (
                <section className="py-14 bg-ink-line/30">
                    <div className="container-x">
                        <h2 className="font-display text-2xl font-bold text-ink mb-6">You might also like</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((b) => (
                                <Link key={b.slug} to={`/blog/${b.slug}`} className="card overflow-hidden group hover:-translate-y-1 hover:shadow-card transition-all">
                                    <div className="h-44 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${b.coverImage})` }} />
                                    <div className="p-5">
                                        <div className="text-[11px] text-ink-muted">{formatDate(b.createdAt)}</div>
                                        <h3 className="font-display text-lg font-bold text-ink leading-snug mt-1 group-hover:text-brand-500 transition">{b.title}</h3>
                                        <p className="text-sm text-ink-muted mt-2 line-clamp-2">{b.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
