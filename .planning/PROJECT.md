# looktwice.uk

## What This Is

The website for Look Twice — Kristina (Kris) Evawin's independent brand and CX strategy consultancy for SMEs and scale-ups. V1 is a single-page proof-and-credibility asset for warm referrals: visitors arrive from LinkedIn or word of mouth, recognise their own situation, and contact Kris with no friction.

## Core Value

A warm referral lands, recognises their own problem in Kris's words within 60 seconds, and emails her — because the site is the demonstration of what she does, not just the description.

## Requirements

### Validated

- [x] Design tokens implemented as CSS custom properties (OKLCH, Epilogue 400/700 only) — Validated in Phase 01
- [x] Sticky nav: transparent over hero, Linen fill on scroll — Validated in Phase 01
- [x] Mobile nav: hamburger → Midnight overlay slide-down — Validated in Phase 01
- [x] Deploy via Cloudflare Pages from `new-site` branch — Validated in Phase 01 (preview live: https://new-site.looktwice-uk.pages.dev)

### Active

- [ ] Single-page homepage with six sections + persistent nav + floating sticky tab (semantic shell landed Phase 01; sections 2–6 fill in later phases)
- [ ] Hero with cutout/drenched composition (Hot Pink, B&W cutouts of Kris + supporting image)
- [ ] Problem identification section — five client-language situations, numbered, staggered
- [ ] Positioning interrupt section (Signal Orange standalone statement)
- [ ] Case studies placeholder (V1 holding state, no detail pages yet)
- [ ] Services section — three problem-first service areas
- [ ] Contact section — Deep Teal CTA, mailto link with static prompts
- [ ] Footer — Midnight, minimal
- [ ] Floating sticky tab: appears after 100vh, brand gradient, anchors to #contact
- [ ] Mobile sticky tab: full-width bottom strip
- [ ] Vanilla JS only — three behaviours: nav scroll state ✓, sticky tab entrance, IntersectionObserver scroll reveals
- [ ] WCAG AA contrast on every surface; reduced-motion respected; keyboard navigable
- [ ] Performance: LCP < 2.5s, CLS < 0.1, FID < 100ms, page weight < 500KB excl. images
- [ ] SEO meta + JSON-LD ProfessionalService schema; semantic HTML hierarchy

### Out of Scope

- Case study detail pages — content not yet ready; V2 with Cloudflare Access auth
- Contact form — V1 uses mailto link with static prompts; V2 adds Cloudflare Worker form + Turnstile
- Standalone About / Approach / Work pages — single-page V1, ship fast
- Blog, newsletter, interactive features — outside the proof-and-credibility job
- JS frameworks (React/Vue/Next), CSS preprocessors, bundlers, npm deps — brochure site, no need
- Touching `main` branch — holds the live holding page; all build work on `new-site`
- Modifying root `PRODUCT.md` during build — source of truth. (Root `DESIGN.md` is now the *editable* design contract, not off-limits — Phase 13 lifted that lock; `DESIGN.json` retired.)
- Decorative motion, parallax, ambient animation — restraint is the brand (subtle "look twice" interactions are the exception, per DESIGN.md)
- Still banned: gradient text, em-dashes in copy. **No longer banned (available with judgement — see DESIGN.md):** glassmorphism / backdrop-filter blur (unbanned 2026-06-08), card shadows, mid-tone greys (prefer faded brand colours), decorative card grids, font-weight 500.

## Context

**Pre-existing material (treat as source of truth):**

- `PRODUCT.md` (root) — audience, voice, design principles, brand personality
- `DESIGN.md` (root) — the negotiated design contract (Phase 13); single design source of truth, editable, supersedes `DESIGN.json` (retired)
- `.planning/seeds/PROJECT.md` — original PRD / vision
- `.planning/seeds/HOMEPAGE-SPEC.md` — section-by-section UI spec
- `.planning/seeds/DESIGN-TOKENS.md` — implementation-ready CSS tokens
- `.planning/seeds/ARCHITECTURE.md` — hosting, file structure, JS spec, V2 plan
- `.planning/seeds/CONTENT-DRAFT.md` — homepage copy draft (Kris refines before launch)

**Repo state:** `main` branch holds current static holding page (`index.html` + assets). All V1 work on `new-site` branch. Cloudflare Pages already wired to the domain via Cloudflare DNS.

**Audience nuance:** five trigger situations drive content (Outgrown Founder, Inherited Strategy Sceptic, Operations-First Leader, Post-Rebrand Disappointment, Agency Borrower). The site lets them self-identify before any service pitch.

**Voice:** clear, human, strategically opinionated. Short sentences. Plain English. Witty in dry doses. Anti-references: generic solo-consultant sites, corporate consultancy tone, luxury serif aesthetic, stock photography clichés.

**Photography:** all hero/cutout images desaturated via CSS. Temp headshot at `inspo/temp headshot.jpeg` usable for V1. Kris selects final images — Claude does not pull from Unsplash.

## Constraints

- **Tech stack**: Plain HTML + CSS + minimal vanilla JS — no frameworks, no preprocessors, no bundlers, no npm deps for V1.
- **Hosting**: Cloudflare Pages, static deploy from `new-site` branch. Already-registered domain `looktwice.uk` on Cloudflare DNS.
- **Branch policy**: All work on `new-site`. `main` is the live holding page — do not touch until cutover.
- **Typography**: Epilogue only, no second family (firm). Weights 400/700 today; a third weight (likely 500) is not banned, added on real need (Phase 13 D-09). Self-hosted woff2, font-display: swap.
- **Accessibility**: WCAG AA minimum on every surface. prefers-reduced-motion respected. One H1 per page (hero).
- **Performance**: LCP < 2.5s, CLS < 0.1, FID < 100ms, page weight < 500KB excluding images. Images in WebP with srcset; lazy-load below the fold.
- **Content**: All copy in `CONTENT-DRAFT.md` is directional — Kris refines in her own voice before launch. Several `[DECIDE]` and `[CONFIRM]` markers still open (hero headline, positioning interrupt option, public client names).
- **Design authority**: root `DESIGN.md` (Phase 13 contract) is the design source of truth; the bans below are revised by it. Read it before design work.
- **Design bans (revised Phase 13; glassmorphism unbanned 2026-06-08)**: still banned — gradient text, em-dashes in copy. Available with judgement (DESIGN.md governs) — glassmorphism / backdrop-filter blur, card shadows, mid-tone greys (prefer faded brand colours), decorative card grids, font-weight 500.
- **Gradient discipline (revised Phase 13)**: scarcity rule lifted — gradient is available, including sparingly as a section background, spent deliberately not as default fill. Cool accents (Rich Purple, Cool Indigo) may now drench a section as a gravitas beat.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single-page V1, anchor-scroll nav | Ship fast; site is proof asset for warm referrals, not a marketing funnel | — Pending |
| Plain HTML/CSS + vanilla JS, no framework | Brochure site; framework overhead has no payoff at this scope | Validated Phase 01 |
| Cloudflare Pages + `new-site` branch deploy | Already on Cloudflare DNS; native path to V2 (Access for case studies, Workers for contact form) | Validated Phase 01 — preview at new-site.looktwice-uk.pages.dev |
| Email link, no form, in V1 | Lowest friction; static prompts shape email quality without backend | — Pending |
| Epilogue 400/700 only — IBM Plex Serif retired | Restraint matches brand; one family is the discipline | Validated Phase 01 (self-hosted woff2, font-display: swap) |
| OKLCH design tokens | Perceptual uniformity across the six accents + neutrals | Validated Phase 01 |
| Cutout/drenched aesthetic — colour on surface, B&W in apertures | "The Second Look" — restraint and revelation in same frame; differentiates from luxury-serif consultancy peers | — Pending |
| Photography manually selected by Kris | Tonal contrast and human moments matter — automated picks would miss | — Pending |
| Holding page on `main` stays live until cutover | No risk to existing presence during build | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

## Current State

Phase 11 (cutout reveal system, V1 Refresh P3) complete. The hero is now a build-time generated SVG cutout: a single B&W image (`feColorMatrix` desaturate, not CSS filter) revealed through a window in the solid Hot Pink field, with no gradient. A reusable `buildCutout(manifest)` codegen module (`buildCutout.js`) holds the five-shape preset vocabulary and emits static SVG; `build.js` injects it at a `<!-- CUTOUT:hero -->` marker between `buildImages` and `buildHtml`, the dead `rewriteHeroImg` is gone, and the hero image is preloaded to protect LCP after the `<img>`→SVG swap. Hero styling lives on a `.cutout` primitive class for reuse by later refresh phases. Locked behind `tests/cutout.spec.js` (build-output + browser-render assertions) and documented in CLAUDE.md as build-time SVG codegen. Phase 12 (build pipeline) and Phase 11 both verified passed on `new-site`. Earlier phases below.

Phase 08 (nav + floating bar) complete — the final roadmap phase. The persistent header now scrolls away with the page; past the hero a floating action bar takes over with a gradient CTA pill (the one place the brand gradient appears) and a white/pink burger nav. Old mobile-nav machinery (hamburger overlay, scroll colour fade) removed. The bar's hidden/visible state is centralised in `setBarHidden()` — adds native `inert` and syncs `aria-hidden` in both the scroll-gate and the `#contact` suppression observer, so keyboard users cannot reach the bar while it is invisible (WCAG 4.1.2). A Playwright QA harness (dev-only, not shipped) covers the nav behaviour: 75 passing assertions across 375/768/1440px. Earlier phases delivered the token surface, self-hosted Epilogue 400/700, Hot Pink hero with cutout portrait, five Linen situation cards, and the Cloudflare Pages deploy pipeline. Live branch-alias preview at https://new-site.looktwice-uk.pages.dev; production `looktwice.uk` still serves the holding page on `main`. All roadmap phases verified passed.

---
*Last updated: 2026-06-02 after Phase 11 completion*
