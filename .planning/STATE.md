# State: looktwice.uk

**Last updated:** 2026-04-29
**Session:** Initialization

## Project Reference

**Core Value:** A warm referral lands, recognises their own problem in Kris's words within 60 seconds, and emails her — because the site is the demonstration of what she does, not just the description.

**Current focus:** Phase 1 — Foundations & Deploy Pipeline

## Current Position

- **Milestone:** v1
- **Phase:** 1 — Foundations & Deploy Pipeline
- **Plan:** none yet (run `/gsd:plan-phase 1` to decompose)
- **Status:** Roadmap approved, awaiting first phase plan
- **Progress:** 0 / 5 phases complete

```
[░░░░░] 0% (0/5 phases)
```

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

### Open Content Decisions (block launch, not phases)

- Hero headline — three options drafted in CONTENT-DRAFT.md, Kris picks one
- Positioning interrupt copy — Option A or B, or Kris writes a third
- "Dig. Reveal. Sharpen." — use on site or keep for decks only
- Case study holding statement — apologetic vs. confident wording
- Public client names — confirm which can be named before launch
- Sticky tab shape — pill or 4px (both render at build, Kris picks)

### Todos

- Run `/gsd:plan-phase 1` to decompose Phase 1 into plans
- Confirm seed images (`inspo/temp headshot.jpeg`) usable for V1 hero before Phase 2

### Blockers

None.

## Session Continuity

**Last session:** 2026-04-29 — initialization (PROJECT, REQUIREMENTS, ROADMAP, STATE created)

**Next session entry point:** `/gsd:plan-phase 1`

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
