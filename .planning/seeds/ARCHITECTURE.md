# ARCHITECTURE: looktwice.uk

**Type:** Technical architecture / ADR
**Status:** Confirmed
**Date:** 2026-04-29

---

## V1 Summary

Static single-page site. Plain HTML and CSS. Minimal vanilla JS for three specific
behaviours: sticky nav transition, sticky tab entrance, scroll reveals. No framework,
no build tooling, no backend.

Hosted on Cloudflare Pages. Deployed from the `new-site` branch.
Main branch (`main`) holds the current live holding page — do not touch.

---

## Hosting: Cloudflare Pages

**Platform:** Cloudflare Pages (static hosting, global CDN, free tier)
**Deployment source:** Git repository, `new-site` branch
**Custom domain:** looktwice.uk (already registered, DNS via Cloudflare)

**Why Cloudflare Pages:**
- Already the registrar/DNS provider — no extra setup
- Global CDN with no configuration
- Cloudflare Access available natively for V2 case study auth
- Cloudflare Workers available natively for V2 contact form
- Free tier is sufficient for V1 and likely V2

**No build step required for V1.** Cloudflare Pages can serve static files directly.
If a build step is added later (e.g. for asset optimisation), use a minimal config.

---

## File Structure

```
looktwice.uk/
  index.html              Main homepage (all sections)
  css/
    tokens.css            CSS custom properties (generated from DESIGN-TOKENS.md)
    base.css              Reset, base styles, typography
    layout.css            Section layout and spacing
    components.css        Buttons, chips, nav, sticky tab, cutout masks
    animations.css        Scroll reveals, transitions
  js/
    main.js               Nav scroll state, sticky tab entrance, scroll reveals
  fonts/                  (if self-hosting — see Typography below)
  images/
    kris-portrait.jpg     Hero cutout main image (B&W or desaturated in CSS)
    hero-support.jpg      Hero cutout supporting image
    [additional images as needed]
  favicon.ico
  robots.txt
```

**Keep it flat.** Do not introduce complexity (bundlers, preprocessors, component
systems) unless there is a specific reason. This is a brochure site.

---

## Typography Loading

**Font:** Epilogue, weights 400 and 700 only. Via Google Fonts.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700&display=swap" rel="stylesheet">
```

`font-display: swap` is set by Google Fonts automatically with `display=swap`.

**Alternative (self-hosted for performance/privacy):** Download Epilogue woff2 files
for weights 400 and 700, serve from `/fonts/`, use @font-face with font-display: swap.
Self-hosting removes the Google Fonts DNS lookup and is marginally faster.
Either approach is acceptable for V1.

---

## JavaScript: Three Behaviours Only

V1 JavaScript is limited to these three functions. No libraries. No dependencies.

**1. Nav scroll state:**
```js
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 0);
}, { passive: true });
```

**2. Sticky tab entrance:**
```js
const tab = document.querySelector('.sticky-tab');
const heroHeight = document.querySelector('#hero').offsetHeight;

window.addEventListener('scroll', () => {
  tab.classList.toggle('visible', window.scrollY > heroHeight);
}, { passive: true });
```

**3. Scroll reveals (IntersectionObserver):**
```js
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Stagger delays set in HTML via data attributes or inline style
document.querySelectorAll('[data-stagger]').forEach((el, i) => {
  el.style.transitionDelay = `${i * parseInt(el.dataset.stagger)}ms`;
});
```

**No jQuery. No animation libraries. No frameworks.**

---

## Performance Targets

| Metric | Target |
|---|---|
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| First Input Delay | < 100ms |
| Total page weight | < 500KB (excl. images) |
| Images | WebP format, width-appropriate srcset |

**Image optimisation:** All images compressed to WebP. Use `srcset` for the hero
cutout (different sizes for mobile/desktop). Lazy load all images below the fold.
Hero images load eagerly (`loading="eager"`).

---

## SEO and Discoverability

**Primary goal:** search and LLM discoverability for brand strategy, CX strategy,
and brand-CX alignment terms.

**Required meta:**
```html
<title>Look Twice | Independent Brand & CX Strategy</title>
<meta name="description" content="Closing the gap between brand promise and lived customer experience. Independent brand and CX strategy for SMEs and scale-ups.">
<meta property="og:title" content="Look Twice | Independent Brand & CX Strategy">
<meta property="og:description" content="[same as description]">
<meta property="og:url" content="https://looktwice.uk">
<meta property="og:type" content="website">
<link rel="canonical" href="https://looktwice.uk">
```

**robots.txt:** Allow all crawlers. No restrictions in V1.

**Semantic HTML:** Use correct heading hierarchy (one H1 per page — the hero
headline). Section headings are H2. Situation titles and service names are H3.
Use `<section>`, `<nav>`, `<footer>`, `<main>` correctly.

**Schema markup (optional but recommended):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Look Twice",
  "description": "Independent brand and CX strategy consultancy",
  "url": "https://looktwice.uk",
  "email": "hello@looktwice.uk",
  "founder": {
    "@type": "Person",
    "name": "Kristina Evawin"
  }
}
</script>
```

---

## Branch Strategy

| Branch | Purpose | Deploy target |
|---|---|---|
| `main` | Current live holding page | looktwice.uk (production) |
| `new-site` | Full site build | Preview / staging until ready |

**Do not commit to `main` during the build.** All work goes on `new-site`.
When the new site is ready to go live, merge `new-site` → `main` or switch
Cloudflare Pages to deploy from `new-site`.

---

## V2 Technical Additions (document now, build later)

### Case Study Authentication (Cloudflare Access)

Case study detail pages at `/work/[slug]` will be protected behind Cloudflare Access.

**How it works:**
- Cloudflare Access sits in front of specific URL paths
- Visitors are prompted to authenticate via email OTP (one-time passcode)
  or a supported OAuth provider (Google, GitHub, etc.)
- Kris controls who gets access via the Cloudflare dashboard
- No backend, no custom auth code — all handled by Cloudflare
- Static HTML pages at `/work/[slug]` serve the case study content
- Teasers on the homepage are always public

**Setup:** In Cloudflare Zero Trust dashboard, create an Access Application
covering the path `looktwice.uk/work/*`. Choose email OTP as the auth method.
Invite specific email addresses or allow any email (adjust based on use case).

### Contact Form (Cloudflare Worker)

V2 replaces the email link with a short form. A Cloudflare Worker handles
form submission and forwards to hello@looktwice.uk.

Simple Worker pattern:
```js
// worker.js
export default {
  async fetch(request) {
    if (request.method !== 'POST') return new Response('Not allowed', { status: 405 });
    const data = await request.formData();
    // Forward to email via Mailchannels (free on Cloudflare Workers) or equivalent
    // Return success/error JSON
  }
}
```

Cloudflare Turnstile (CAPTCHA alternative, privacy-respecting) recommended
for spam protection on the form.

---

## Accessibility Checklist (run before launch)

- [ ] One H1 per page (hero headline)
- [ ] Heading hierarchy: H1 → H2 → H3, no skips
- [ ] All images have descriptive alt text
- [ ] Cutout composition alt text describes the image content, not "cutout"
- [ ] All interactive elements keyboard focusable with visible focus ring
- [ ] Focus ring visible on all buttons, links, and the sticky tab
- [ ] Mobile nav has aria-expanded, aria-controls on hamburger button
- [ ] Sticky tab has aria-label="Contact Kris"
- [ ] Colour contrast verified on all surfaces (see DESIGN-TOKENS.md)
- [ ] prefers-reduced-motion: reveals use opacity only, no transform
- [ ] Smooth scroll respects prefers-reduced-motion (disable if set)
- [ ] Font display: swap prevents invisible text during load

---

## What GSD Should NOT Do

- Do not install React, Vue, Next.js, or any JS framework
- Do not introduce a CSS preprocessor (Sass, Less) — plain CSS with custom properties
- Do not add a bundler (Webpack, Vite) for V1 — not needed
- Do not use CSS-in-JS
- Do not add any npm dependencies for V1
- Do not touch the `main` branch
- Do not modify DESIGN.md or PRODUCT.md during build — they are source of truth
