# Phase 5: Hardening & Launch — Context

**Gathered:** 2026-05-01
**Status:** Ready for research
**Branch:** claude/new-site-QGsb8

<domain>
## Phase Boundary

The site passes WCAG AA, hits the performance budget, is discoverable in search, holds together at every breakpoint from 375px to 1440px+, and is ready to cut over from the holding page on `main` once Kris approves.

**In scope:** accessibility audit + remediation, performance audit + remediation, SEO meta + JSON-LD + robots.txt + favicon, responsive verification across breakpoints, cutover plan documentation.

**Out of scope (V2):** case study detail pages with Cloudflare Access, contact form with Worker + Turnstile, additional language locales, blog/articles, analytics + cookie consent.
</domain>

<entry_state>
## Entry State (what Phase 5 inherits)

### Code on `claude/new-site-QGsb8`
- Six sections fully populated — hero, situation, approach (interrupt), work, services, contact.
- Footer + sticky tab (pill + 4px both rendered) live.
- `_headers` carries minimal cache + three security headers (X-Content-Type-Options, Referrer-Policy, X-Frame-Options) — Phase 5 hardens with HSTS, CSP, Permissions-Policy.
- Vanilla JS: nav scroll toggle, generic `.reveal` IntersectionObserver, sticky-tab entrance.
- Self-hosted Epilogue 400/700 woff2.
- One image: `images/kris-portrait.webp` (365KB). Hero supporting image deferred (Midnight fallback renders).

### Page weight baseline (measured 2026-05-01, excluding images)

| Asset | Bytes | Notes |
|-------|-------|-------|
| index.html | 12,724 | All six sections, sticky tab markup |
| css/tokens.css | 3,585 | OKLCH tokens + gradient + transitions |
| css/base.css | 2,727 | Andy Bell reset + @font-face + body |
| css/layout.css | 3,006 | Page shell + section grids |
| css/components.css | 22,465 | Largest file — every section's component CSS |
| css/animations.css | 1,100 | Reveal + nav transition |
| js/main.js | 5,117 | Three IIFEs |
| fonts/epilogue-400.woff2 | 14,268 | Latin subset |
| fonts/epilogue-700.woff2 | 14,640 | Latin subset |
| _headers | 301 | Phase 1 minimal — Phase 5 hardens |
| **TOTAL** | **79,933** | **~78KB / 500KB budget = 16%** |

Plenty of headroom under the page-weight budget. Headroom can absorb Phase 5 additions: JSON-LD (~1KB), favicon SVG (~1KB), expanded `_headers` (~0.5KB), any meta tags (~0.5KB).

### Image
- `images/kris-portrait.webp` — 365KB. Excluded from page-weight budget per CLAUDE.md ("page weight < 500KB excluding images") but contributes directly to LCP. WebP is correct; 365KB is reasonable for a hero portrait. Lighthouse will tell us if it crosses the 2.5s LCP target.
- Hero supporting image still deferred — Midnight token-block fallback renders. Phase 5 does not block on this.

### Open content decisions (six items, from STATE.md)
These block actual launch even though the code is done. Phase 5 must surface them to Kris and lock answers before cutover.

1. **Hero headline** — three options drafted in CONTENT-DRAFT.md. Currently shipping Option A.
2. **Positioning interrupt copy** — Option A or B, or Kris writes a third. Currently shipping A.
3. **"Dig. Reveal. Sharpen."** — use on site or keep for decks only. Currently not used.
4. **Case study holding statement** — apologetic vs confident wording. Currently apologetic.
5. **Public client names** — confirm which of Toolstation, Goodfella's, Merlin Entertainments, Sanofi can be named publicly.
6. **Sticky tab shape** — pill or 4px. Both currently rendering.

Phase 5 ships a single `OPEN-DECISIONS.md` that asks Kris to land all six in one pass, before cutover.

### What's already verified
- Phase 2-04 SUMMARY files document each phase's decisions and carryover.
- Phase 1 `_headers` lands cache + basic security; Phase 5 extends.
- prefers-reduced-motion guards are in place across `.reveal`, `.sticky-tab`, `html` (smooth-scroll).
- Generic IntersectionObserver fallback (no IO support) reveals content immediately.
- `.btn--primary`, `.btn--ghost-on-dark`, `.btn--ghost-on-light`, `.btn--contact` all carry focus-ring overrides for their respective surfaces.

</entry_state>

<decisions>
## Implementation Decisions (locked entering research)

### Cutover (DEPLOY-03)
- **D-5.1:** Cutover is a single deliberate action, not automatic. Phase 5 documents the playbook; Kris triggers it manually after she's reviewed the preview, signed off on copy, and picked the sticky-tab shape.
- **D-5.2:** `main` stays untouched until cutover. Holding page continues to serve `looktwice.uk` until the moment Kris approves the switch.

### Content decisions
- **D-5.3:** All six open content decisions (hero headline, positioning interrupt, "Dig. Reveal. Sharpen.", case study statement, client names, sticky-tab shape) are Kris's calls. Phase 5 surfaces them in `OPEN-DECISIONS.md` with options, recommendation, and the file/line each lands at — Claude does not pick.

### A11Y
- **D-5.4:** Contrast measurement is the source of truth. If a colour combination measures < 4.5:1 (or < 3:1 for large/bold ≥18pt or 14pt-bold), it fails AA — no judgement calls. Where contrast fails, use 700 weight (already in design tokens) or shift opacity to bring contrast above threshold.
- **D-5.5:** Heading order is verified against the rendered HTML — one H1 (hero), H2 per section heading (situation, approach has none, work, services, contact), H3 for situation + service item titles. No skips. Approach interrupt is a `<p>` not a heading by spec.
- **D-5.6:** Focus rings are verified by tab-walking the page — every interactive element (nav links, buttons, sticky tab pill, mailto link, footer links) shows a visible ring on its surface.

### PERF
- **D-5.7:** Lighthouse runs on the deployed Cloudflare Pages preview (not local) so caching, CDN behaviour, and `_headers` are real. Mobile + desktop runs.
- **D-5.8:** Page weight budget is < 500KB excluding images. Already at 78KB, so headroom is not the concern — LCP is. The 365KB hero portrait is the LCP candidate.
- **D-5.9:** Image optimisation: kris-portrait.webp at 365KB is acceptable; if Lighthouse flags it, options are (a) re-export at lower quality, (b) add an AVIF source for browsers that prefer it, (c) generate srcset for smaller viewports. Decision deferred to actual measurement.

### SEO
- **D-5.10:** JSON-LD schema is `ProfessionalService` (extends `LocalBusiness`), inlined in `<head>` as `<script type="application/ld+json">`. Single block; not paginated.
- **D-5.11:** Meta description from CONTENT-DRAFT.md §Page Title and Meta. og:image is `kris-portrait.webp` (already shipping at 800x1000 — good aspect for LinkedIn previews).
- **D-5.12:** Favicon: SVG favicon (single file) preferred over multi-file ICO bundle. Cloudflare Pages serves SVG correctly.

### RESP
- **D-5.13:** Verification surface = three breakpoints documented in HOMEPAGE-SPEC: 375px (iPhone SE), 768px (tablet), 1440px (desktop). Each surface gets a screenshot + visual notes; any breakage gets a fix.
- **D-5.14:** Existing breakpoints in code: hero stacks at <768px, situation grid collapses at <641px, sections collapse padding at <640px, nav goes hamburger at <1024px, sticky tab becomes bottom strip at <640px, footer stacks at <640px. Phase 5 verifies these all work as drawn.

### Hardening (`_headers`)
- **D-5.15:** Add HSTS (Strict-Transport-Security with 1y max-age + preload), CSP (Content-Security-Policy with `default-src 'self'`, allowing inline styles for the `onerror` handler if still present, no external scripts), Permissions-Policy (deny camera/microphone/geolocation), expanded Referrer-Policy if needed. Cache durations from Phase 1 stay.

### Claude's discretion
- Exact CSP directive list — needs to permit inline `onerror` on the hero supporting image fallback (or drop the inline handler in favour of a JS listener — research evaluates).
- JSON-LD field completeness — minimum viable vs richer schema.
- Whether to ship a separate `humans.txt`, `security.txt`, etc. (skip unless requested).
- Favicon design (placeholder vs final — defer to Kris).
- Whether og:image needs a dedicated 1200x630 export or kris-portrait.webp suffices.

</decisions>

<canonical_refs>
## Canonical References

### Project specs (root, source of truth)
- `PRODUCT.md` — audience, voice
- `DESIGN.md` / `DESIGN.json` / `DESIGN_NOTES.md` — design system
- `CLAUDE.md` — tech stack constraints, design bans, performance budget

### Phase 5 inputs
- `.planning/REQUIREMENTS.md` §Accessibility, §Performance, §SEO & Meta, §Responsive — A11Y-01..06, PERF-01..04, SEO-01..03, RESP-01..04, DEPLOY-03
- `.planning/seeds/HOMEPAGE-SPEC.md` §Accessibility — surface-level a11y notes, contrast warnings
- `.planning/seeds/ARCHITECTURE.md` — V1 vs V2 boundary (V2 items must NOT leak into Phase 5)
- `.planning/seeds/CONTENT-DRAFT.md` — title, meta description, alt text, content decisions still open
- `.planning/seeds/DESIGN-TOKENS.md` — OKLCH values for contrast measurement

### Existing build artefacts
- `index.html` — 12,724 bytes; six sections + nav + footer + two sticky tabs
- `css/tokens.css` — OKLCH values for measurement
- `_headers` — Phase 1 baseline; Phase 5 extends
- All Phase 2-04 SUMMARY.md files — capture decisions Phase 5 must not undo

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable assets
- The `.reveal` mechanism, `.chip`, `.btn` variants, focus-ring overrides — all stable. Phase 5 does not refactor; it verifies and extends.
- `_headers` already exists; Phase 5 appends new directives without removing old ones.
- `js/main.js` is small (5KB) and clean; Phase 5 does not add new JS unless an a11y fix requires it.

### Established patterns Phase 5 must respect
- Vanilla CSS with token consumption — no hard-coded values.
- BEM-ish naming.
- IIFE wrappers around new behaviour in main.js.
- prefers-reduced-motion guard on every animation.
- Five-CSS-file split.

### Integration points Phase 5 touches
- `<head>`: title, meta description, canonical, og:, JSON-LD all land here.
- `index.html` root: `lang="en"` already set; verify other root attributes.
- `_headers`: append HSTS + CSP + Permissions-Policy.
- Repo root: `robots.txt`, `favicon.svg` (or `favicon.ico`), `og-image.jpg` if separate.

### Constraints existing setup imposes
- The hero supporting image's inline `onerror` handler may conflict with a strict CSP. Two options: relax CSP to allow `unsafe-inline` for inline events, or refactor to a JS listener. Research evaluates.
- Sticky tab uses `--gradient-brand` — this is the only place the gradient appears (per design ban). Phase 5 must not introduce another gradient surface even by accident in og:image generation.

</code_context>

<specifics>
## Specific Ideas

- **Lighthouse = source of truth for PERF.** Every measurement must come from a real run on the deployed preview, not a synthetic local check. CI can't run Lighthouse from this sandbox; treat the run as a Kris-side action with results pasted back in DISCUSSION-LOG.md.
- **Contrast can be computed deterministically from OKLCH.** Convert to sRGB, then to relative luminance per WCAG 2.x formula. Research builds a small table so the verification step is "compare to the table", not "measure live".
- **Cutover trade-offs are real.** Three viable options with different rollback profiles — research lays them out, discussion picks one.
- **Six open content decisions can land in a single Kris session.** Phase 5 deliberately batches them rather than spreading across multiple touch-points.
- **The 4px sticky-tab variant gets dropped at cutover.** This is one of the six decisions and it's also a code change — surfacing it in the same `OPEN-DECISIONS.md` keeps it tracked.

</specifics>

<deferred>
## Deferred (V2 / out of scope)

- Cloudflare Access on `/work/[slug]` for case study detail pages.
- Cloudflare Worker + Turnstile contact form.
- Multiple language locales.
- Analytics / cookie consent banner.
- Print stylesheet.
- Service worker / offline behaviour.
- Dark mode toggle.

### Reviewed todos (not folded)
- "Source `images/hero-supporting.webp`" — still deferred per Phase 2 D-10. Midnight fallback renders. Single-file commit lands it later, no markup change needed. Not a Phase 5 blocker.
- "Refine provisional supporting cutout `alt` text" — depends on the image landing. Not a Phase 5 blocker.

</deferred>

---

*Phase: 05-hardening-launch*
*Context gathered: 2026-05-01*
