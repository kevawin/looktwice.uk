# Requirements: looktwice.uk

**Defined:** 2026-04-29
**Core Value:** A warm referral lands, recognises their own problem in Kris's words within 60 seconds, and emails her — because the site is the demonstration of what she does, not just the description.

## v1 Requirements

Requirements for the V1 launch — single-page proof-and-credibility site.

### Foundations

- [x] **FOUND-01**: Project structure follows seeds/ARCHITECTURE.md (flat tree: index.html, css/, js/, images/)
- [x] **FOUND-02**: CSS custom properties file (`css/tokens.css`) implements every token from seeds/DESIGN-TOKENS.md (OKLCH colours, Epilogue scale, spacing, radius, shadows, transitions)
- [x] **FOUND-03**: Base CSS reset, semantic typography defaults, body line-length cap (`--measure: 65ch`)
- [x] **FOUND-04**: Epilogue (400, 700) loads via Google Fonts with preconnect + font-display: swap
- [ ] **FOUND-05**: Single `index.html` carries `<main>`, six `<section>` blocks with id anchors, `<nav>`, `<footer>` — semantic HTML hierarchy with one H1 (hero)

### Navigation

- [ ] **NAV-01**: Sticky top nav, transparent over hero, transitions to Linen fill on first scroll (200ms)
- [ ] **NAV-02**: Wordmark left ("Look Twice", Epilogue Bold), nav links right (WORK / APPROACH / CONTACT), all anchor to on-page sections
- [ ] **NAV-03**: Hover/active state — Hot Pink underline (2px, 3px offset), no background fill change
- [ ] **NAV-04**: Mobile nav — hamburger triggers full-width Midnight overlay sliding down (280ms ease-out-quart) with stacked Linen-text links
- [ ] **NAV-05**: Hamburger button has aria-expanded / aria-controls; close button top-right of overlay

### Hero (#hero)

- [ ] **HERO-01**: Hot Pink full-bleed surface, min-height 90vh, two-column layout on desktop (text left ~55%, cutout composition right)
- [ ] **HERO-02**: Display headline (Epilogue 700, --text-display, White) and one-line subhead (--text-body, White at 85%) per CONTENT-DRAFT.md
- [ ] **HERO-03**: Cutout composition — large rounded-rect (radius 16px) Kris portrait + smaller supporting circle/rect, asymmetric, both `filter: grayscale(100%)`, never overlapping text
- [ ] **HERO-04**: Two CTAs — Primary "BOOK A SESSION" (Midnight fill → Hot Pink hover) anchors to #contact, Ghost "SEE THE WORK" (1.5px White border → White fill hover) anchors to #work
- [ ] **HERO-05**: Mobile layout — headline above, scaled cutout (~85% width) below, buttons stacked
- [ ] **HERO-06**: Hero visible immediately on load — no scroll reveal

### Situation (#situation)

- [ ] **SITU-01**: Linen surface, --space-section vertical padding, Midnight chip "THE SITUATION", section headline per CONTENT-DRAFT.md
- [ ] **SITU-02**: Five situation blocks (01–05) — Hot Pink number label, Bold title (--text-title), 1–2 body sentences (lh 1.7, max 65ch); no icons, no card boxes, no borders, no shadows
- [ ] **SITU-03**: Desktop layout — 2-column stagger (col 1: 01,02,03 / col 2: 04,05 offset down ~1 item height), --space-lg gap
- [ ] **SITU-04**: Mobile layout — single column, --space-md between items
- [ ] **SITU-05**: Scroll reveal — chip + headline first, then items 01–05 stagger 80ms each (opacity 0→1, translateY 16px→0, 400ms ease-out-quart, IntersectionObserver threshold 0.2)

### Positioning Interrupt (#approach)

- [ ] **INTR-01**: Signal Orange full-bleed surface, --space-xl vertical padding
- [ ] **INTR-02**: Single text block per CONTENT-DRAFT.md — Headline scale, Epilogue 700, White, lh 1.1, max-width 800px, left-aligned, ≤50 words
- [ ] **INTR-03**: No chip, no subheading, no CTA — standalone statement only
- [ ] **INTR-04**: Scroll reveal — fade in + translateY 16px→0, 400ms ease-out-quart

### Case Studies Placeholder (#work)

- [ ] **WORK-01**: Linen surface, --space-section padding, Midnight chip "WORK", section headline per CONTENT-DRAFT.md
- [ ] **WORK-02**: Brief 2–3 sentence holding statement (--text-body, max 65ch) per CONTENT-DRAFT.md
- [ ] **WORK-03**: Ghost button "GET IN TOUCH" anchors to #contact
- [ ] **WORK-04**: Section reveals on scroll using same stagger pattern

### Services (#services)

- [ ] **SERV-01**: Linen surface, --space-section padding, Midnight chip "HOW I WORK", section headline per CONTENT-DRAFT.md
- [ ] **SERV-02**: Three service items separated by 1px Midnight-12% full-width horizontal rules — each: Hot Pink number, Bold service name, two body sentences
- [ ] **SERV-03**: Single column, full content width, body max 65ch
- [ ] **SERV-04**: Ghost button "TALK THROUGH WHAT YOU NEED →" below item 03, anchors to #contact
- [ ] **SERV-05**: Scroll reveal — headline first, items 01–03 stagger 100ms each

### Contact / CTA (#contact)

- [ ] **CONT-01**: Deep Teal full-bleed surface, --space-section padding, ghost-on-dark chip "FREE SESSION"
- [ ] **CONT-02**: Section headline (Epilogue 700, White) and 2-sentence body (White at 85%) per CONTENT-DRAFT.md
- [ ] **CONT-03**: CTA button — White fill, Deep Teal text, label "hello@looktwice.uk", `href="mailto:hello@looktwice.uk"`; hover: Midnight fill, Linen text
- [ ] **CONT-04**: Static prompts beneath the button (Label typography, White at 60%) per CONTENT-DRAFT.md — no form
- [ ] **CONT-05**: Left-aligned, max content width 680px
- [ ] **CONT-06**: Scroll reveal stagger — chip → headline → body → button

### Footer

- [ ] **FOOT-01**: Midnight surface, --space-lg vertical padding, two-column desktop layout
- [ ] **FOOT-02**: Left — "Look Twice" wordmark (Epilogue Bold) + tagline "Independent brand & CX strategy" (Label, Linen at 60%)
- [ ] **FOOT-03**: Right — LinkedIn link, mailto link, "© 2026 Look Twice" — Label typography, Linen text, Link Sage hover
- [ ] **FOOT-04**: Mobile layout — stacked, left-aligned

### Sticky Tab

- [ ] **TAB-01**: Fixed bottom-right (24px/24px), z-index above sections, hidden on load
- [ ] **TAB-02**: Appears after >100vh scroll — slide in from right (translateX 120% → 0, 300ms ease-out-quart)
- [ ] **TAB-03**: Brand gradient background (the only place gradient appears), White text "LET'S TALK →" in Label typography, --shadow-float
- [ ] **TAB-04**: Pill (--radius-pill) and 4px (--radius-sm) variants both rendered at build — Kris picks one before launch
- [ ] **TAB-05**: Hover: scale(1.03), 180ms ease-out — no colour change
- [ ] **TAB-06**: Anchors to #contact; aria-label="Contact Kris"
- [ ] **TAB-07**: Mobile — full-width bottom strip (height 52px), slides up from bottom (translateY 100% → 0)

### Behaviour & JS

- [ ] **JS-01**: Vanilla JS only — no libraries, no dependencies, no npm
- [ ] **JS-02**: Nav scroll-state toggle (window.scrollY > 0 adds `.scrolled`)
- [ ] **JS-03**: Sticky tab entrance toggle (window.scrollY > hero height adds `.visible`)
- [ ] **JS-04**: IntersectionObserver scroll-reveal with stagger via inline transition-delay; observer unobserves after first reveal
- [ ] **JS-05**: Smooth anchor scroll via `scroll-behavior: smooth` (CSS), suppressed under prefers-reduced-motion
- [ ] **JS-06**: All scroll listeners use `{ passive: true }`

### Responsive

- [ ] **RESP-01**: Three breakpoints — mobile <640px, tablet 640–1024px, desktop >1024px
- [ ] **RESP-02**: Section padding collapses --space-section → --space-xl on mobile
- [ ] **RESP-03**: All sections legible and visually intact at iPhone SE width (375px) through 1440px+
- [ ] **RESP-04**: Body text max-width relaxes to full column width on mobile

### Accessibility

- [ ] **A11Y-01**: One H1 (hero), H2 for section headings, H3 for situation/service titles — no skipped levels
- [ ] **A11Y-02**: Every image has descriptive alt text describing content (not "cutout")
- [ ] **A11Y-03**: WCAG AA contrast verified on every surface (Hot Pink, Signal Orange, Deep Teal especially); use 700 weight where 400 fails
- [ ] **A11Y-04**: Keyboard navigation — tab order matches visual order, all interactive elements reachable, visible focus rings on buttons / links / sticky tab
- [ ] **A11Y-05**: prefers-reduced-motion respected — reveal uses opacity only (no transform), smooth-scroll disabled
- [ ] **A11Y-06**: Sticky tab `aria-label="Contact Kris"`; mobile nav button aria-expanded/controls

### Performance

- [ ] **PERF-01**: LCP < 2.5s, CLS < 0.1, FID < 100ms (verified via Lighthouse on deployed preview)
- [ ] **PERF-02**: Total page weight < 500KB excluding images
- [ ] **PERF-03**: All photos served as WebP with srcset + responsive sizes; below-fold images `loading="lazy"`; hero images `loading="eager"`
- [ ] **PERF-04**: Hero images dimensions set or aspect-ratio reserved to avoid layout shift

### SEO & Meta

- [ ] **SEO-01**: `<title>`, meta description, canonical, og:title/description/url/type per ARCHITECTURE.md
- [ ] **SEO-02**: JSON-LD `ProfessionalService` schema (name, description, url, email, founder)
- [ ] **SEO-03**: `robots.txt` allows all crawlers; favicon present

### Deployment

- [ ] **DEPLOY-01**: Cloudflare Pages project configured to build/serve from `new-site` branch
- [ ] **DEPLOY-02**: Preview URL accessible for accessibility/performance verification before cutover
- [ ] **DEPLOY-03**: Cutover plan documented — switch Pages production source from `main` to `new-site` (or merge `new-site` → `main`) when Kris approves; `main` untouched until then

## v2 Requirements

Deferred to a future milestone. Documented now so they're not forgotten.

### Case Study Detail Pages

- **WORK-V2-01**: 2–3 case study teasers on homepage (asymmetric layout, sector chip, problem statement, outcome line, "VIEW CASE STUDY →")
- **WORK-V2-02**: Detail pages at `/work/[slug]` (static HTML)
- **WORK-V2-03**: Cloudflare Access protects `/work/*` (email OTP or OAuth) — no backend code

### Contact Form

- **CONT-V2-01**: Replace mailto link with short form (name, organisation, problem framing)
- **CONT-V2-02**: Cloudflare Worker handles form POST and forwards to hello@looktwice.uk via MailChannels
- **CONT-V2-03**: Cloudflare Turnstile spam protection on the form

### Other V2 Surfaces

- **PAGE-V2-01**: Standalone About / Approach page if relationship-led BD shifts to needing depth on Kris's background
- **CONT-V2-04**: Newsletter or long-form notes section if content cadence justifies it

## Out of Scope

| Feature | Reason |
|---------|--------|
| JavaScript framework (React/Vue/Next) | Brochure site, no client state, no payoff for framework overhead |
| CSS preprocessor (Sass/Less) | CSS custom properties cover the token model |
| Bundler (Webpack/Vite) | No build step needed for V1 |
| npm dependencies | Plain HTML/CSS/JS keeps surface area minimal |
| Contact form in V1 | Mailto with prompts is lower friction; form is V2 work |
| Standalone About / Approach / Work pages in V1 | Single-page V1 ships fast; pages are V2 if needed |
| Blog, newsletter, interactive features | Outside the proof-and-credibility job |
| Case study detail pages in V1 | Content not yet ready; placeholder section only |
| Decorative motion, parallax, ambient animation | Restraint is the brand — motion only when it aids understanding |
| Mid-tone grey backgrounds | Hard design ban — Midnight or Linen only |
| Glassmorphism, backdrop-filter blur | Hard design ban |
| Card shadows / hover-state shadows | Flat system; shadow only on floating sticky tab |
| `font-weight: 500` and a second font family | Epilogue 400/700 only |
| Em-dashes in copy | Voice rule — commas, colons, or new sentences instead |
| Touching `main` branch during build | Holds the live holding page |

## Traceability

Each requirement maps to exactly one phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Pending |
| NAV-01 | Phase 1 | Pending |
| NAV-02 | Phase 1 | Pending |
| NAV-03 | Phase 1 | Pending |
| NAV-04 | Phase 1 | Pending |
| NAV-05 | Phase 1 | Pending |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| HERO-05 | Phase 2 | Pending |
| HERO-06 | Phase 2 | Pending |
| SITU-01 | Phase 2 | Pending |
| SITU-02 | Phase 2 | Pending |
| SITU-03 | Phase 2 | Pending |
| SITU-04 | Phase 2 | Pending |
| SITU-05 | Phase 2 | Pending |
| INTR-01 | Phase 3 | Pending |
| INTR-02 | Phase 3 | Pending |
| INTR-03 | Phase 3 | Pending |
| INTR-04 | Phase 3 | Pending |
| WORK-01 | Phase 3 | Pending |
| WORK-02 | Phase 3 | Pending |
| WORK-03 | Phase 3 | Pending |
| WORK-04 | Phase 3 | Pending |
| SERV-01 | Phase 3 | Pending |
| SERV-02 | Phase 3 | Pending |
| SERV-03 | Phase 3 | Pending |
| SERV-04 | Phase 3 | Pending |
| SERV-05 | Phase 3 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| CONT-04 | Phase 4 | Pending |
| CONT-05 | Phase 4 | Pending |
| CONT-06 | Phase 4 | Pending |
| FOOT-01 | Phase 4 | Pending |
| FOOT-02 | Phase 4 | Pending |
| FOOT-03 | Phase 4 | Pending |
| FOOT-04 | Phase 4 | Pending |
| TAB-01 | Phase 4 | Pending |
| TAB-02 | Phase 4 | Pending |
| TAB-03 | Phase 4 | Pending |
| TAB-04 | Phase 4 | Pending |
| TAB-05 | Phase 4 | Pending |
| TAB-06 | Phase 4 | Pending |
| TAB-07 | Phase 4 | Pending |
| JS-01 | Phase 4 | Pending |
| JS-02 | Phase 4 | Pending |
| JS-03 | Phase 4 | Pending |
| JS-04 | Phase 4 | Pending |
| JS-05 | Phase 4 | Pending |
| JS-06 | Phase 4 | Pending |
| RESP-01 | Phase 5 | Pending |
| RESP-02 | Phase 5 | Pending |
| RESP-03 | Phase 5 | Pending |
| RESP-04 | Phase 5 | Pending |
| A11Y-01 | Phase 5 | Pending |
| A11Y-02 | Phase 5 | Pending |
| A11Y-03 | Phase 5 | Pending |
| A11Y-04 | Phase 5 | Pending |
| A11Y-05 | Phase 5 | Pending |
| A11Y-06 | Phase 5 | Pending |
| PERF-01 | Phase 5 | Pending |
| PERF-02 | Phase 5 | Pending |
| PERF-03 | Phase 5 | Pending |
| PERF-04 | Phase 5 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| DEPLOY-01 | Phase 1 | Pending |
| DEPLOY-02 | Phase 1 | Pending |
| DEPLOY-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 77 total
- Mapped to phases: 77
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-29*
*Last updated: 2026-04-29 after roadmap traceability mapping*
