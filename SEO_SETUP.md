# SEO + Google Business Profile setup — finishing checklist

This file lists every placeholder I left in the codebase. Replace each one with the real value when you have it, then redeploy.

---

## 1. Google Business Profile (GBP) — already wired

| Setting | Value | Where it lives |
|---|---|---|
| GBP share URL | `https://share.google/UfYZ9ExJmRx4r1Kk6` | `client/src/data.js` → `BRAND.gbp.shareUrl` |
| GBP review URL | `https://g.page/r/Cf5lmIQe-KpfEBM/review` | `client/src/data.js` → `BRAND.gbp.reviewUrl` |
| GBP CID | `6893957108253123070` | `client/src/data.js` → `BRAND.gbp.cid` |
| Coordinates | `11.683555, 78.135265` | `client/src/data.js` → `BRAND.geo` |

These are already used by:
- LocalBusiness JSON-LD (`hasMap`, `sameAs`, `geo`) in `client/index.html` and `client/src/pages/Home.jsx`
- The `Get Directions` / `Leave a Google Review` / `View on Google` buttons on `client/src/pages/Contact.jsx`
- The Google Map iframe embed on `client/src/pages/Contact.jsx`
- The "Write a Review on Google" CTA inside the `GoogleReviews` component on the homepage
- Footer social row

---

## 2. Social media URLs — placeholders to confirm

Edit `client/src/data.js` → `BRAND.social`. I used best-guess URLs:

```js
social: {
    facebook:  'https://www.facebook.com/tripwithuz',
    instagram: 'https://www.instagram.com/tripwithuz',
    youtube:   'https://www.youtube.com/@tripwithuz',
}
```

If your real handle is different, just paste the correct URL.

Same handles also referenced in:
- `client/index.html` → JSON-LD `sameAs` array (hardcoded — update there too)

---

## 3. Search Console + GA4 + Bing — to set up

### 3a. Google Search Console
1. Go to https://search.google.com/search-console
2. Add property → URL prefix → `https://tripwithuz.com`
3. Choose **HTML tag** verification
4. Copy the `content="..."` value
5. Replace `TODO_GSC_CONTENT` in `client/index.html` (line ~17)
6. Deploy
7. Click **Verify** in Search Console
8. Submit your sitemap: `https://tripwithuz.com/sitemap.xml`

### 3b. Google Analytics 4
1. Go to https://analytics.google.com → Admin → Create Property
2. Set timezone: India Standard Time, currency: INR
3. Create a Web data stream for `https://tripwithuz.com`
4. Copy the Measurement ID (`G-XXXXXXXXXX`)
5. Replace `TODO_GA4_ID` in `client/index.html` (inside the `<script>` block near the bottom of `<head>`)
6. Deploy → check Real-Time report in GA4

### 3c. Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Easiest: click **Import from Google Search Console**
3. Or manually add `https://tripwithuz.com` → choose **Meta tag** verification
4. Copy the `content="..."` value
5. Replace `TODO_BING_CONTENT` in `client/index.html` (line ~18)
6. Deploy → click Verify

### 3d. Facebook Domain Verification (optional but useful for FB Ads)
1. https://business.facebook.com → Brand Safety → Domains → Add
2. Choose Meta-tag method
3. Replace `TODO_FB_CONTENT` in `client/index.html` (line ~19)

---

## 4. og-image.jpg

Currently every page falls back to `logo.png` for the social-share preview. For best Facebook/WhatsApp/Twitter previews you should create a proper Open Graph image:

- **Size:** 1200 × 630 pixels (16:8.4 ratio)
- **Save as:** `client/public/og-image.jpg`
- **Suggested content:** logo + tagline ("Best travel agency in Salem") + a hero photo
- **Tools:** Canva has a free "Facebook Post" template at exactly 1200×630

Then update:
- `client/index.html` — change `<meta property="og:image" content="/logo.png" />` to `/og-image.jpg`
- `client/src/data.js` — change `BRAND.ogImage` to `'/og-image.jpg'`

---

## 5. Link the accounts together (do this AFTER all 3 are verified)

1. **GA4 ↔ Search Console**: GA4 Admin → Search Console links → connect your property
2. **GBP ↔ GA4**: GBP dashboard → Performance → connect GA4 (currently only available in some regions)
3. **GBP ↔ Search Console**: not direct, but make sure your GBP website field matches `https://tripwithuz.com` exactly

---

## 6. Recommended GBP content actions (no code, but high impact)

- Upload **20+ photos** to GBP (interior, team, certificates, customer trips). Aim for at least one photo per week.
- Add **5–10 Q&A** yourself before customers ask — questions like "Do you offer Kerala packages?", "Where is your office?"
- Reply to **every** review within 48 hours
- Post a weekly **GBP Update** (offer, new package, festive deal). These show up in Search.

---

## 7. After deploying — verify with Google's tools

- **Rich Results Test**: https://search.google.com/test/rich-results — paste your homepage URL. Should show LocalBusiness, FAQPage, Service, WebSite.
- **Schema Markup Validator**: https://validator.schema.org/ — same idea, more detailed.
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly — should pass.
- **PageSpeed Insights**: https://pagespeed.web.dev/ — aim for 80+ on mobile.

---

Generated alongside the SEO/GBP integration work on 2026-05-12.
