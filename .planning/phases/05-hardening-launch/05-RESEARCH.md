# Phase 5: Hardening & Launch — Research

**Researched:** 2026-05-02
**Domain:** WCAG AA contrast verification on OKLCH surfaces, Lighthouse / page-weight verification on Cloudflare Pages, JSON-LD ProfessionalService schema, security-headers hardening, three-option cutover plan from `main` holding page to the new site.
**Confidence:** HIGH on contrast + page weight + cutover (deterministic / measurable). MEDIUM on Lighthouse numbers (need actual run on deployed preview). HIGH on JSON-LD shape; MEDIUM on optional fields.

## Summary

Phase 5 has five independent threads — A11Y, PERF, SEO, RESP, DEPLOY — that can largely run in parallel once Kris's content decisions land. The biggest unknown is contrast on the three accent surfaces (Hot Pink hero, Signal Orange interrupt, Deep Teal contact), because OKLCH lightness values around 50–58% sit on the AA borderline. Pre-computed contrast estimates below show **two surfaces likely fail AA at body-text scale and need 700-weight remediation** (which the design already uses for headlines but not for the contact body). One surface (Linen with Hot Pink number on services) is well clear of AA. Page weight is at 16% of budget so we have generous headroom for Phase 5 additions. Cutover has three viable options with materially different rollback profiles — a Cloudflare-Pages-side production-branch swap is the recommended path.

**Primary recommendation:** Land OPEN-DECISIONS.md first (gets Kris's six content + sticky-tab calls in one pass), then run A11Y + SEO + RESP work in parallel under one PLAN, push the result, then run Lighthouse on the deployed preview to size any PERF remediation. Cutover is its own PLAN, runs last, requires Kris's manual trigger.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked decisions

- **D-5.1**: Cutover is manual; Kris triggers after sign-off.
- **D-5.2**: `main` untouched until cutover.
- **D-5.3**: Six open content decisions are Kris's calls; surfaced in OPEN-DECISIONS.md.
- **D-5.4**: Contrast measurement is the source of truth — < 4.5:1 fails AA for normal text, < 3:1 fails for large/bold ≥18pt or 14pt-bold.
- **D-5.5**: Heading order: one H1 (hero), H2 per section (5 H2s), H3 for situation/service item titles. Approach interrupt is a `<p>`.
- **D-5.6**: Focus rings verified by tab-walk on the deployed preview.
- **D-5.7**: Lighthouse runs on the deployed preview (mobile + desktop), not locally.
- **D-5.8**: Page-weight budget < 500KB excluding images; current 78KB.
- **D-5.10**: JSON-LD = `ProfessionalService`, inlined in `<head>`.
- **D-5.13**: RESP verification at 375 / 768 / 1440px.
- **D-5.15**: `_headers` extends with HSTS, CSP, Permissions-Policy.

### Claude's discretion
- Exact CSP directive list (depends on whether the inline `onerror` stays).
- JSON-LD field completeness.
- Favicon source / design.
- og:image dedicated 1200x630 export vs reusing kris-portrait.

### Deferred (V2 — out of scope)
- Cloudflare Access on case study pages.
- Worker + Turnstile contact form.
- i18n, dark mode, analytics, service worker, print CSS.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research support |
|----|-------------|------------------|
| A11Y-01 | One H1, H2 sections, H3 children, no skips | Verify against rendered HTML — section below |
| A11Y-02 | Every image has descriptive alt text | Audit table below |
| A11Y-03 | WCAG AA contrast on every surface; 700 weight where 400 fails | Contrast computation table below |
| A11Y-04 | Keyboard navigation, tab order, visible focus rings | Manual tab-walk on deployed preview |
| A11Y-05 | prefers-reduced-motion respected | Code audit confirms — already covered |
| A11Y-06 | Sticky tab `aria-label="Contact Kris"`; mobile nav `aria-expanded`/`aria-controls` | Code audit confirms — already in place |
| PERF-01 | LCP < 2.5s, CLS < 0.1, FID < 100ms (Lighthouse on preview) | Hero portrait is LCP candidate — sized below |
| PERF-02 | Page weight < 500KB excluding images | Current 78KB, 16% of budget |
| PERF-03 | All photos WebP + srcset; below-fold lazy; hero eager | Audit table below |
| PERF-04 | Hero images dimensions set / aspect-ratio reserved | Confirmed in markup; verify CLS |
| SEO-01 | `<title>`, meta description, canonical, og: tags | Schema below |
| SEO-02 | `ProfessionalService` JSON-LD validates | Schema below |
| SEO-03 | `robots.txt`, favicon | Specs below |
| RESP-01 | Three breakpoints (mobile <640, tablet 640–1024, desktop >1024) | Code audit confirms |
| RESP-02 | Section padding `--space-section` → `--space-xl` on mobile | Code audit confirms |
| RESP-03 | All sections legible at 375 / 1440 | Visual verification on preview |
| RESP-04 | Body max-width relaxes to full column on mobile | Code audit |
| DEPLOY-03 | Documented cutover plan from `main` to `new-site`, `main` untouched until then | Three-option table below |

</phase_requirements>

## Project constraints (from CLAUDE.md)

Hard rules Phase 5 must enforce on every output:
- WCAG AA on every surface.
- LCP < 2.5s, CLS < 0.1, FID < 100ms, page weight < 500KB excluding images.
- prefers-reduced-motion respected.
- One H1 per page.
- Brand gradient appears in exactly one place: the floating sticky tab.
- No card shadows, gradient text, glassmorphism, mid-tone greys, font-weight 500, em-dashes in copy.

---

## Research findings

### 1. WCAG AA contrast on accent surfaces (A11Y-03)

The accent surfaces are the only contrast risk. Linen and Midnight are well within AA at every weight; the question is what passes on **Hot Pink (52% L)**, **Signal Orange (58% L)**, **Deep Teal (50% L)**, and the **brand-gradient** sticky tab.

WCAG 2.x requires:
- ≥ 4.5:1 for normal text (< 18pt, or < 14pt bold).
- ≥ 3:1 for large text (≥ 18pt regular or ≥ 14pt bold).
- ≥ 3:1 for non-text contrast (icons, focus rings, button borders).

**Estimated contrast ratios** (computed from OKLCH → sRGB → WCAG relative luminance; verify with a tool before launch):

| Surface | Foreground | Approx. ratio | AA normal | AA large/bold | Where used |
|---------|------------|---------------|-----------|---------------|------------|
| Hot Pink (52% L) | True White | ~4.0:1 | ❌ borderline | ✅ pass | Hero headline (Bold 48–88px), subhead (400, 16–17.6px), button text |
| Hot Pink (52% L) | Midnight | ~6.5:1 | ✅ pass | ✅ pass | `.btn--primary` text on hover |
| Signal Orange (58% L) | True White | ~3.5:1 | ❌ fail | ✅ pass at 700 | Interrupt statement (Bold ≥28px) |
| Deep Teal (50% L) | True White | ~5.0:1 | ✅ pass | ✅ pass | Contact headline (Bold), body, prompts |
| Deep Teal (50% L) | True White at 60% opacity | ~3.0:1 | ❌ fail | ⚠️ marginal | `.contact__prompts` (Label 0.8rem = 12.8px regular) |
| Deep Teal (50% L) | True White at 85% opacity | ~4.3:1 | ⚠️ marginal | ✅ pass | `.contact__body` |
| Linen (97% L) | Midnight | ~14:1 | ✅ pass | ✅ pass | Body text on situation, work, services |
| Linen (97% L) | Hot Pink | ~3.5:1 | ❌ fail | ✅ pass at 700 | Service number `.services__number` (Label 0.8rem) |
| Midnight (24% L) | Linen | ~14:1 | ✅ pass | ✅ pass | Footer text |
| Midnight (24% L) | Linen at 60% opacity | ~6.5:1 | ✅ pass | ✅ pass | Footer tagline |
| Brand gradient (mean ~50% L) | True White | ~4.0:1 worst-spot | ❌ borderline at 0.8rem | ✅ pass at 700 | Sticky tab "LET'S TALK →" (Label 0.8rem 700) — passes via 700 weight |

**Five concerns to address in the A11Y plan:**

1. **Hero subhead (400 weight, 16–17.6px) on Hot Pink** — likely fails AA normal. Spec says "White at 85% opacity" which makes it worse. Remedy: lift opacity to 100% AND/OR bump to 700 weight (Bold). Token already supports both.
2. **Interrupt statement (700 weight, 28–44px) on Signal Orange** — 700 + ≥18pt clears the large-bold threshold (3:1) at ~3.5:1. Passes; no change needed.
3. **`.contact__prompts` (400, 12.8px) on Deep Teal at 60% opacity** — fails. Remedy: lift opacity to 75–80% AND keep the 700 weight (currently 400). Or restructure as Label-700 typography.
4. **`.contact__body` (400, 16–17.6px) on Deep Teal at 85% opacity** — marginal. Remedy: lift to 100% opacity, or shift to 700, or both.
5. **`.services__number` (400, 12.8px) on Linen** — fails AA normal. Already uses 700 elsewhere on similar use cases. Remedy: bump number weight from 400 to 700. Same fix applies to `.situation__number`.

**Caveat:** these ratios are estimated from OKLCH-to-sRGB conversion. The plan must verify with a measurement tool (Chrome DevTools' contrast picker, or `oklch.com` / `palettte.app` / WebAIM contrast checker after viewing rendered colours). If the measurement disagrees with the table, the measurement wins.

### 2. Heading order audit (A11Y-01)

Reading the rendered `index.html`:

| Element | Tag | Section | Pass? |
|---------|-----|---------|-------|
| Hero headline | H1 | #hero | ✅ one H1 |
| "Sound familiar?" | H2 | #situation | ✅ |
| Five situation titles | H3 | #situation | ✅ inside H2 |
| Interrupt statement | P | #approach | ✅ correct (no heading by spec) |
| "The proof is in the diagnosis." | H2 | #work | ✅ |
| "Three problems. One frame." | H2 | #services | ✅ |
| Three service titles | H3 | #services | ✅ inside H2 |
| Contact headline | H2 | #contact | ✅ |

No skips. One H1. A11Y-01 already passes.

### 3. Image audit (A11Y-02, PERF-03, PERF-04)

| Image | Alt | Loading | Width/Height | Notes |
|-------|-----|---------|--------------|-------|
| `kris-portrait.webp` | "Kristina Evawin, brand and CX strategist" | eager | 800 × 1000 | Hero LCP candidate. CLS reserved by `aspect-ratio: 1/1` on `.hero__cutouts`. ✅ |
| `hero-supporting.webp` (deferred) | "A working session: hands annotating printed brand research on a desk" | eager | 500 × 500 | Provisional alt — refines when image lands. Inline `onerror` swaps to Midnight fallback. ⚠️ alt is provisional, in scope when image lands |

No other images. PERF-03 and A11Y-02 pass for current shipped images. The provisional alt text on the supporting image is a known carryover and not blocking V1 launch.

### 4. Page-weight headroom (PERF-02)

Already measured in CONTEXT.md: **79,933 bytes (78KB) / 500KB budget = 16%**. Headroom for Phase 5 additions:

| Phase 5 addition | Estimated bytes | Cumulative |
|------------------|------------------|------------|
| Current shipped | 79,933 | 79,933 |
| JSON-LD ProfessionalService block | +900 | 80,833 |
| Expanded `<head>` (description, canonical, og:, twitter:) | +500 | 81,333 |
| `_headers` HSTS/CSP/Permissions-Policy expansion | +400 | 81,733 |
| `robots.txt` | +50 | 81,783 |
| `favicon.svg` | +800 | 82,583 |
| A11Y remediation (token weight bumps, opacity tweaks) | +200 | 82,783 |
| **Projected total post-Phase-5** | | **~82.8KB / 500KB = 17%** |

No risk of breaching budget.

### 5. LCP candidate analysis (PERF-01)

`kris-portrait.webp` at 365KB is the LCP candidate. Considerations:

- **`fetchpriority="high"`** — already set in markup (Phase 2-01). Good.
- **`loading="eager"`** — already set. Good.
- **`decoding="async"`** — already set. Good.
- **`width=800 height=1000`** — set, prevents CLS.
- **WebP format** — modern browsers (~96% support). Good.
- **365KB** — reasonable for a 800×1000 hero portrait, but on slow 3G this is the LCP bottleneck. If Lighthouse reports LCP > 2.5s on mobile, options:
  1. Re-export at lower quality (target ~150–200KB).
  2. Add AVIF source via `<picture><source type="image/avif">` for ~30% smaller payload on supporting browsers.
  3. Add srcset with smaller variants for narrow viewports (`<img srcset="kris-portrait-400.webp 400w, kris-portrait-800.webp 800w" sizes="(max-width: 768px) 85vw, 45vw">`).

Decision deferred to actual Lighthouse run. Likely fine on broadband + LCP includes more than just byte payload (server, CDN, decode time).

### 6. JSON-LD ProfessionalService schema (SEO-02)

Schema.org `ProfessionalService` is a child of `LocalBusiness` → `Organization`. Useful fields for Look Twice:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Look Twice",
  "alternateName": "Look Twice Consultancy",
  "description": "Independent brand and customer experience strategy for SMEs and scale-ups.",
  "url": "https://looktwice.uk",
  "image": "https://looktwice.uk/images/kris-portrait.webp",
  "logo": "https://looktwice.uk/favicon.svg",
  "email": "hello@looktwice.uk",
  "founder": {
    "@type": "Person",
    "name": "Kristina Evawin",
    "jobTitle": "Brand and CX Strategist",
    "sameAs": "https://www.linkedin.com/in/krisevawin/"
  },
  "areaServed": {
    "@type": "Place",
    "name": "United Kingdom"
  },
  "knowsAbout": [
    "Brand strategy",
    "Customer experience strategy",
    "Research and insight"
  ],
  "priceRange": "$$$"
}
```

Notes:
- `priceRange` is required by `LocalBusiness` validators; "$$$" is a non-committal indicator.
- `address` and `telephone` are normally required by LocalBusiness validators. Look Twice is independent / remote, no public address, no public phone. Two options:
  - Use `Person` schema instead (less rich but no fake address).
  - Use `ProfessionalService` and accept that some validators flag address/telephone warnings.
- Recommended path: **`ProfessionalService` without address/phone**, accept the validator warning. Google still indexes the rich result; the missing fields are not errors. Discussion to confirm with Kris.

### 7. SEO meta tags (SEO-01)

```html
<title>Look Twice | Independent Brand & CX Strategy</title>
<meta name="description" content="Closing the gap between brand promise and lived customer experience. Independent brand and CX strategy for SMEs and scale-ups.">
<link rel="canonical" href="https://looktwice.uk/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://looktwice.uk/">
<meta property="og:title" content="Look Twice | Independent Brand & CX Strategy">
<meta property="og:description" content="Closing the gap between brand promise and lived customer experience.">
<meta property="og:image" content="https://looktwice.uk/images/kris-portrait.webp">
<meta property="og:image:width" content="800">
<meta property="og:image:height" content="1000">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Look Twice | Independent Brand & CX Strategy">
<meta name="twitter:description" content="Closing the gap between brand promise and lived customer experience.">
<meta name="twitter:image" content="https://looktwice.uk/images/kris-portrait.webp">
```

**Open question for discussion:** og:image is currently kris-portrait at 800×1000 — that's tall, not the 1.91:1 (~1200×630) most platforms prefer. LinkedIn and Twitter will crop. Options:
- (a) Generate a dedicated 1200×630 og:image with the Hot Pink hero composition.
- (b) Accept the crop — kris-portrait will centre-crop to a square preview, which is acceptable for a personal/consultancy brand.
- (c) Use a brand-gradient + wordmark composition at 1200×630.

Recommended: (a) for cleanest sharing, (b) for V1 simplicity. Kris's call.

### 8. Security headers hardening (D-5.15)

Current `_headers` has:
- `/fonts/*` — `Cache-Control: public, max-age=31536000, immutable`
- `/css/*`, `/js/*` — `Cache-Control: public, max-age=86400`
- `/*` — `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`

Phase 5 adds:

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

**CSP conflict:** The hero supporting image markup currently has an inline `onerror` handler (Phase 2-01 D-10 defence-in-depth). A strict CSP without `unsafe-inline` on `script-src` will block it.

Options:
1. Drop the inline `onerror` and add a JS listener in `main.js` (`img.addEventListener('error', ...)`).
2. Add `'unsafe-inline'` to `script-src` (weakens CSP).
3. Use `script-src 'self' 'unsafe-hashes' 'sha256-…'` to allow the specific inline handler (works but verbose).

Recommended: **option 1** — refactor to a JS listener. Three-line change. Strict CSP is worth it.

### 9. Cutover options (DEPLOY-03)

Three viable paths from "holding page on `main`, V1 on `claude/new-site-QGsb8`" to "V1 live on looktwice.uk".

#### Option A: Merge `claude/new-site-QGsb8` → `main`
Standard PR workflow. Cloudflare Pages production stays pointed at `main`; the merge triggers a production deploy.

| Pros | Cons |
|------|------|
| Simple, familiar git workflow | `main` history is replaced with V1; old holding page gone from default branch |
| Single source of truth on `main` | Rollback = `git revert` + redeploy (slow if it goes wrong) |
| Cloudflare config unchanged | If anything fails post-deploy, recovery is a code rollback not a config flip |

#### Option B: Change Cloudflare Pages production source from `main` to `claude/new-site-QGsb8` (or rename branch)
Cloudflare-side config change. `main` keeps holding-page history; production starts serving from the new-site branch.

| Pros | Cons |
|------|------|
| Instant cutover via Cloudflare config | Production tracks a non-`main` branch — non-standard; surprising for future contributors |
| Rollback = flip the config back to `main` (immediate) | Two branches to maintain post-cutover unless eventual merge |
| `main` history preserved untouched | Branch name `claude/new-site-QGsb8` is awkward for production |

#### Option C: Rename current branch to `production`, then change Cloudflare Pages source
Clean variant of B — rename `claude/new-site-QGsb8` to `production`, swap Cloudflare to `production`, optionally retire `main` later.

| Pros | Cons |
|------|------|
| Production source has a meaningful name | Two-step (rename + Cloudflare flip) |
| Rollback = flip back to `main` | Renaming a remote branch breaks PR refs in GitHub history |
| Clear separation: `production` = live, working branches PR into it | Slightly more disruptive to existing PR #6 |

**Recommendation:** **Option A — merge to `main`**. It's the most conventional, has the clearest mental model ("main is what's live"), and the rollback cost is acceptable because Cloudflare Pages keeps every deploy as a permanent rollback target in the dashboard. The "history replaced" concern is a non-issue — git history is preserved on the merge commit; the holding page commits are still in the log.

If Kris wants instant rollback safety net, B is the safer option. C is over-engineered for a single-page site.

### 10. RESP verification approach

Code audit confirms breakpoints are wired:
- `<640px`: section padding collapses, situation grid → 1 col, sticky tab → bottom strip, footer stacks, hero CTAs stack
- `<768px`: hero stacks (text above cutout), hero CTAs stack
- `<1024px`: nav goes hamburger
- `>=1025px`: hamburger hides

Verification surface = three viewports (375, 768, 1440). Each gets a manual visual pass on the Cloudflare preview, recorded in HUMAN-UAT.md alongside the existing Phase 2 UAT items.

</research_findings>

## Open questions for discussion

1. **Cutover option** — A (merge to main), B (Cloudflare-side branch swap), or C (rename to `production`)?
2. **og:image** — generate a dedicated 1200×630 image, or accept centre-crop on kris-portrait?
3. **Inline `onerror` handler** — refactor to JS listener (recommended for strict CSP) or keep inline + add CSP exception?
4. **JSON-LD address/phone** — accept validator warning on missing fields, or switch to `Person` schema?
5. **Six open content decisions** — surfaced separately in `OPEN-DECISIONS.md`. Land before or in parallel with Phase 5 execution?
6. **Lighthouse run** — Kris triggers on her side after Phase 5 a11y/SEO work lands, or do we hand off the deployed preview URL to a Lighthouse CI service?

## Recommended Phase 5 plan structure

Three plans, runnable in this order:

1. **`05-01-a11y-seo-resp-PLAN.md`** — A11Y remediation (contrast bumps, weight tweaks, opacity adjustments), SEO meta + JSON-LD, robots.txt + favicon, RESP visual verification at three breakpoints. One push, one preview, one verification round.
2. **`05-02-perf-hardening-PLAN.md`** — `_headers` HSTS/CSP/Permissions-Policy + inline-onerror refactor. After 05-01 ships, run Lighthouse on the preview, capture numbers, remediate any LCP/CLS regressions surfaced.
3. **`05-03-cutover-PLAN.md`** — Documented cutover playbook based on Kris's option pick. Includes pre-flight checklist (all UAT items closed, all six open content decisions answered, sticky-tab variant chosen), the cutover steps, and the rollback procedure.

OPEN-DECISIONS.md gets surfaced before plan 05-01 starts — the answers to the six content questions are inputs to that plan.

