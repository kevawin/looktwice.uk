---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed Phase 03 (interrupt + work + services)
last_updated: "2026-05-01T23:35:00.000Z"
progress:
  total_phases: 5
  completed_phases: 3
  total_plans: 6
  completed_plans: 6
  percent: 60
---

# State: looktwice.uk

**Last updated:** 2026-05-01
**Session:** Phase 03 complete — Signal Orange positioning interrupt, Linen work placeholder, three problem-first services shipped on `claude/new-site-QGsb8`

## Project Reference

**Core Value:** A warm referral lands, recognises their own problem in Kris's words within 60 seconds, and emails her — because the site is the demonstration of what she does, not just the description.

**Current focus:** Phase 03 complete — Phase 04 (contact + footer + sticky tab + JS wiring) next

## Current Position

Phase: 03 (mid-page-story) — COMPLETE
Plan: Phase 03 shipped without per-plan PLAN.md files (cloud-session simplification per HANDOFF.md). Phase 04 next.

- **Milestone:** v1
- **Phase:** 3 complete
- **Plan:** Phase 03 SUMMARY landed; Phase 04 next
- **Status:** Phase 03 complete; ready for Phase 04 entry
- **Progress:** [██████░░░░] 60% (3 of 5 phases)
- **Preview URL:** https://claude-new-site-qgsb8.looktwice-uk.pages.dev (Cloudflare Pages branch alias for current working branch)
- **Legacy preview URL:** https://new-site.looktwice-uk.pages.dev (Phase 1+2 shipped here on `new-site`)

## Configuration

- **Granularity:** coarse (3–5 phases, 1–3 plans each)
- **Parallelization:** enabled
- **Mode:** yolo
- **UI phase:** enabled
- **Verifier:** enabled
- **Plan check:** enabled

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | not measured |
| CLS | < 0.1 | not measured |
| FID | < 100ms | not measured |
| Page weight (excl. images) | < 500KB | not measured |
| WCAG AA | pass on all surfaces | not verified |
| Phase 01 P01 | 6min | 3 tasks | 10 files |
| Phase 01 P02 | 2min | 3 tasks | 7 files |
| Phase 02-hero-situation P01 | 6min | 3 tasks | 3 files |
| Phase 02-hero-situation P02 | 2min | 3 tasks | 3 files |
| Phase 02-hero-situation P03 | 1m 20s | 2 tasks | 2 files |

## Accumulated Context

### Decisions

- Single-page V1, anchor-scroll nav (logged in PROJECT.md)
- Plain HTML/CSS + vanilla JS, no framework or build step
- Cloudflare Pages deploy from `new-site` branch; `main` holds live holding page until cutover
- Email link (`mailto:`) in V1, no form
- Epilogue 400/700 only; OKLCH design tokens
- Cutout/drenched aesthetic — colour on surface, B&W in apertures
- Brand gradient appears in exactly one place: the floating sticky tab
- DEPLOY-01/02 pulled into Phase 1 so every later phase ships to a visible preview URL
- Cross-cutting concerns (A11Y/PERF/SEO/RESP) concentrated in Phase 5 rather than spread per section
- [Phase 01]: Plan 01-01: Latin subset of Epilogue (~14KB/weight) chosen over full charset
- [Phase 01]: Plan 01-01: Brand gradient declared in tokens, painted only on Phase 4 sticky tab
- [Phase 01]: Plan 01-02: Holding-page index.html overwritten in single Write on new-site only (D-01 honoured)
- [Phase 01]: Plan 01-02: Two-range hamburger media query (max-width:1024px shows / min-width:1025px hides) avoids the 1024px overlap edge case
- [Phase 01]: Plan 01-02: D-11 doc-fix landed — REQUIREMENTS.md FOUND-05 + ROADMAP.md SC#2 say 'six' (not 'eight')
- [Phase 01]: Plan 01-03: `_headers` written at repo root with `/fonts/*` immutable cache, `/css/*` + `/js/*` 24h cache, and three security headers on `/*` (X-Content-Type-Options, Referrer-Policy, X-Frame-Options); HSTS/CSP/COOP/COEP deferred to Phase 5
- [Phase 01]: Plan 01-03: Phase 1 shell pushed to `origin/new-site`; Cloudflare Pages auto-deployed; branch-alias preview URL captured at https://new-site.looktwice-uk.pages.dev — single source of truth for every later phase
- [Phase 01]: Plan 01-03: `main` confirmed unchanged on origin — production holding page at looktwice.uk untouched (D-01 honoured)
- [Phase 02]: Plan 02-01: Hot Pink hero shipped — `<section id="hero">` filled with two-line H1, subhead, two CTAs, asymmetric cutouts (main rounded-rect 78%×86%, support circle 42%×42%) and Midnight token-block fallback for the missing supporting image (D-10 pattern)
- [Phase 02]: Plan 02-01: Hero responsive breakpoint = 768px (distinct from nav's 1024px); single-column stack with full-width buttons and 85%-width cutouts on phones
- [Phase 02]: Plan 02-01: `.btn` / `.btn--primary` / `.btn--ghost-on-dark` component classes ship with focus-ring override on the ghost variant only (Hot Pink global outline disappears on Hot Pink surface; White outline override scoped to the modifier where it fails)
- [Phase 02]: Plan 02-01: Subhead at 85% white via `opacity: 0.85` on `--color-true-white` (no new colour token introduced)
- [Phase 02]: Plan 02-01: Inline `onerror` handler on supporting cutout `<img>` toggles `.hero__cutout--missing` so Midnight fallback survives even if Cloudflare Pages 404s the file (defence-in-depth on top of CSS layering)
- [Phase 02]: Plan 02-02: Linen situation section shipped — .situation surface, THE SITUATION chip, 'Sound familiar?' H2, five blocks 01-05 in <ol role='list'> with Hot Pink number / bold title / body capped at --measure
- [Phase 02]: Plan 02-02: .chip is a generic reusable component class (not .situation__chip) — Phase 3 reuses verbatim on WORK / HOW I WORK chips, no rename or override
- [Phase 02]: Plan 02-02: Staggered desktop layout via grid-row: 2 on block 04 (skipping row 1 of column 2) — pure CSS Grid expression of D-12, no padding hacks or absolute positioning
- [Phase 02]: Plan 02-02: Three-breakpoint cascade for situation grid (mobile baseline → 641px tablet alternation → 1025px desktop stagger) gives an intentional shape at every viewport
- [Phase 02]: Plan 02-02: Visible 01..05 number spans marked aria-hidden — <ol> already conveys order semantically, prevents SR double-announcement
- [Phase 02-hero-situation]: Plan 02-03: generic IntersectionObserver lands in js/main.js — one IIFE-scoped observer rules all .reveal elements site-wide; Phase 3 + 4 add .reveal + data-reveal-index in HTML, no JS changes
- [Phase 02-hero-situation]: Plan 02-03: stagger formula is parametric — delay = data-reveal-index × (data-reveal-step || 80) ms; Phase 3 services will ship data-reveal-step=100 per HOMEPAGE-SPEC, no JS change required
- [Phase 02-hero-situation]: Plan 02-03: one-shot reveal contract via observer.unobserve() after first intersect — re-trigger on scroll-back is a deliberate non-feature (D-15); becomes the project standard for every later phase
- [Phase 02-hero-situation]: Plan 02-03: prefers-reduced-motion handled entirely by existing CSS guard in animations.css — observer still fires, class still toggles, but transform is stripped to opacity-only fade; zero JS branching for reduced motion
- [Phase 03]: Cloud-session simplification — Phase 03 ships without per-plan PLAN.md files (HANDOFF.md authorises plain-English execution); single 03-SUMMARY.md captures decisions + carryover
- [Phase 03]: Em-dashes substituted with commas in all CONTENT-DRAFT copy lifted into the page (project ban — CLAUDE.md / HANDOFF Hard rules)
- [Phase 03]: New `.btn--ghost-on-light` variant added alongside `.btn--ghost-on-dark` — Midnight border + text on Linen, Midnight fill + Linen text on hover; reused by work and services CTAs
- [Phase 03]: Hot Pink number style scoped per-section (`.services__number`, mirroring Phase 2's `.situation__number`) rather than aliased — keeps each section's component layer self-contained
- [Phase 03]: Services rule stack closes top + bottom (border-top on each item + border-bottom on `:last-child`) so the rules visually wrap the list rather than orphaning the closing CTA
- [Phase 03]: Services CTA reveal index = 4 with `data-reveal-step="100"` — arrives 400ms after item 01 begins, lands as a punctuation beat after the three-item stagger

### Open Content Decisions (block launch, not phases)

- Hero headline — three options drafted in CONTENT-DRAFT.md, Kris picks one
- Positioning interrupt copy — Option A or B, or Kris writes a third
- "Dig. Reveal. Sharpen." — use on site or keep for decks only
- Case study holding statement — apologetic vs. confident wording
- Public client names — confirm which can be named before launch
- Sticky tab shape — pill or 4px (both render at build, Kris picks)

### Todos

- Source `images/hero-supporting.webp` (Kris/Jamie pick — supports the asymmetric working-session beat). Single-file commit lands it; Midnight fallback drops out automatically.
- Inspect Phase 02 hero + situation + reveal cascade on Cloudflare Pages preview at https://new-site.looktwice-uk.pages.dev (desktop, 1024px, 640px, 375px) when `887057d` deploys.
- Verify reduced-motion behaviour: DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce → refresh → scroll into situation. Reveal should still happen but opacity-only (no vertical movement).
- Refine provisional supporting cutout `alt` text in `index.html` once final image is chosen.
- Phase 02 complete — entry point for Phase 03 is `/gsd:execute-phase 3` (approach + work + services).
- Phase 03 complete — entry point for Phase 04 is `/gsd:execute-phase 4` (contact + footer + sticky tab + JS wiring).
- Inspect Phase 03 (interrupt / work / services) on Cloudflare Pages preview at https://claude-new-site-qgsb8.looktwice-uk.pages.dev.

### Blockers

None.

## Session Continuity

**Last session:** 2026-04-30T07:50:46.142Z

**Next session entry point:** `/gsd:execute-phase 4` (begin Phase 4 — contact + footer + sticky tab + JS wiring)

**Stopped at:** Completed Phase 03 mid-page-story (interrupt + work + services)

**Files of record:**

- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/config.json`
- `.planning/seeds/HOMEPAGE-SPEC.md`
- `.planning/seeds/ARCHITECTURE.md`
- `.planning/seeds/DESIGN-TOKENS.md`
- `.planning/seeds/CONTENT-DRAFT.md`
- root `PRODUCT.md`, `DESIGN.md`, `DESIGN.json` (source of truth, do not modify)

---
*State initialized: 2026-04-29*
