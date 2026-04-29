# looktwice.uk

## What This Is

The website for Look Twice — Kristina (Kris) Evawin's independent brand and CX strategy consultancy for SMEs and scale-ups. V1 is a single-page proof-and-credibility asset for warm referrals: visitors arrive from LinkedIn or word of mouth, recognise their own situation, and contact Kris with no friction.

## Core Value

A warm referral lands, recognises their own problem in Kris's words within 60 seconds, and emails her — because the site is the demonstration of what she does, not just the description.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Single-page homepage with 8 sections + persistent nav + floating sticky tab
- [ ] Hero with cutout/drenched composition (Hot Pink, B&W cutouts of Kris + supporting image)
- [ ] Problem identification section — five client-language situations, numbered, staggered
- [ ] Positioning interrupt section (Signal Orange standalone statement)
- [ ] Case studies placeholder (V1 holding state, no detail pages yet)
- [ ] Services section — three problem-first service areas
- [ ] Contact section — Deep Teal CTA, mailto link with static prompts
- [ ] Footer — Midnight, minimal
- [ ] Sticky nav: transparent over hero, Linen fill on scroll
- [ ] Floating sticky tab: appears after 100vh, brand gradient, anchors to #contact
- [ ] Mobile nav: hamburger → Midnight overlay slide-down
- [ ] Mobile sticky tab: full-width bottom strip
- [ ] Vanilla JS only — three behaviours: nav scroll state, sticky tab entrance, IntersectionObserver scroll reveals
- [ ] Design tokens implemented as CSS custom properties (OKLCH, Epilogue 400/700 only)
- [ ] WCAG AA contrast on every surface; reduced-motion respected; keyboard navigable
- [ ] Performance: LCP < 2.5s, CLS < 0.1, FID < 100ms, page weight < 500KB excl. images
- [ ] SEO meta + JSON-LD ProfessionalService schema; semantic HTML hierarchy
- [ ] Deploy via Cloudflare Pages from `new-site` branch

### Out of Scope

- Case study detail pages — content not yet ready; V2 with Cloudflare Access auth
- Contact form — V1 uses mailto link with static prompts; V2 adds Cloudflare Worker form + Turnstile
- Standalone About / Approach / Work pages — single-page V1, ship fast
- Blog, newsletter, interactive features — outside the proof-and-credibility job
- JS frameworks (React/Vue/Next), CSS preprocessors, bundlers, npm deps — brochure site, no need
- Touching `main` branch — holds the live holding page; all build work on `new-site`
- Modifying root `DESIGN.md` / `PRODUCT.md` during build — source of truth
- Decorative motion, parallax, ambient animation — restraint is the brand
- Mid-tone greys, glassmorphism, gradient text, card shadows, font-weight 500, em-dashes in copy — design bans

## Context

**Pre-existing material (treat as source of truth):**

- `PRODUCT.md` (root) — audience, voice, design principles, brand personality
- `DESIGN.md` / `DESIGN.json` (root) — full design system reference
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
- **Typography**: Epilogue only, weights 400 and 700. No 500. No second family. Google Fonts (or self-hosted woff2) with font-display: swap.
- **Accessibility**: WCAG AA minimum on every surface. prefers-reduced-motion respected. One H1 per page (hero).
- **Performance**: LCP < 2.5s, CLS < 0.1, FID < 100ms, page weight < 500KB excluding images. Images in WebP with srcset; lazy-load below the fold.
- **Content**: All copy in `CONTENT-DRAFT.md` is directional — Kris refines in her own voice before launch. Several `[DECIDE]` and `[CONFIRM]` markers still open (hero headline, positioning interrupt option, public client names).
- **Design bans (hard stops)**: no card shadows, no gradient text, no glassmorphism, no mid-tone greys, no decorative card grids, no font-weight 500, no em-dashes in copy.
- **Gradient discipline**: brand gradient appears in exactly one place — the floating sticky tab. Cool accents (Rich Purple, Cool Indigo) are hover/gradient only, never section backgrounds.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single-page V1, anchor-scroll nav | Ship fast; site is proof asset for warm referrals, not a marketing funnel | — Pending |
| Plain HTML/CSS + vanilla JS, no framework | Brochure site; framework overhead has no payoff at this scope | — Pending |
| Cloudflare Pages + `new-site` branch deploy | Already on Cloudflare DNS; native path to V2 (Access for case studies, Workers for contact form) | — Pending |
| Email link, no form, in V1 | Lowest friction; static prompts shape email quality without backend | — Pending |
| Epilogue 400/700 only — IBM Plex Serif retired | Restraint matches brand; one family is the discipline | — Pending |
| OKLCH design tokens | Perceptual uniformity across the six accents + neutrals | — Pending |
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

---
*Last updated: 2026-04-29 after initialization*
