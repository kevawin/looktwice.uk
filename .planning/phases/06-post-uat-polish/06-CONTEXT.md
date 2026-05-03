# Phase 6 — Post-UAT Polish

**Phase:** 06-post-uat-polish
**Status:** in-progress
**Trigger:** Kris UAT feedback (2026-05-03) on Phase 5 preview
**Branch:** `claude/new-site-QGsb8`

## Why this phase exists

Phase 5 shipped the site code-complete and pushed to the Cloudflare Pages preview. Kris ran a visual UAT and surfaced 18 items spanning brand truth (exact hex), nav bug, hero composition, copy hierarchy, layout depth (5-col situation, columned how-I-work, split contact), and footer additions.

Some items are bugs (cascade, broken cutout). Most are design refinements that take the site from "code-correct V1" to "design-truthful V1". The original V1 launch criteria still hold; Phase 6 tightens the visual + content delivery before cutover.

## Scope

### In

- Brand colour migration: OKLCH approximations → exact brand hex (all six accents + Midnight + Linen + Black)
- Nav cascade bug — hamburger leaking into desktop
- Logo system — single SVG with `currentColor`, surface-driven colour
- Hero composition — new copy, single CTA, wider text column, cleaner photo placement
- Drop site-wide chip eyebrows ("THE SITUATION", "WORK", "HOW I WORK")
- Drop broken supporting cutout (alt-text leakage bug)
- Strip site-wide reveal animations
- Interrupt section hierarchy flip — "Dig. Reveal. Sharpen." becomes H2
- Situation grid — 5-column desktop, decorative numbers
- Work section — expanded with bio + sector list, restyled CTA
- How-I-work — 3 columns + geometric SVG icons, drop rule lines
- Contact / free session — split layout, sentence-case title, what-to-bring list, CTA at bottom
- Sticky tab — hide when contact section is on screen
- Pill CTA system — surface-aware (accent fill on Linen, white fill on colour), inverts on hover
- Footer — Manchester location, Privacy policy placeholder link

### Out (deferred, surfaced in SUMMARY for V1.1)

- Custom shape vocabulary for portrait + future image slots — Kris will provide shape refs after this phase
- Real Privacy policy content — link is placeholder
- Re-enable reveal animations once content is final
- Real og:image asset
- Final favicon
- Tightening CSP (hash JSON-LD, drop `'unsafe-inline'`)

## Decisions locked

See `06-DISCUSSION-LOG.md` for the full Q&A. Headlines:

- **D-6.1 Colour truth**: hex values from Kris's brand spec replace all OKLCH tokens. Variable names retained.
- **D-6.2 Logo**: single SVG with `fill="currentColor"`, CSS sets colour per surface.
- **D-6.3 CTA system**: gradient locked to sticky tab only. All other CTAs = pill, surface-aware. On Linen → accent fill + white text → hover: outlined accent. On colour → white fill + surface-colour text → hover: outlined white.
- **D-6.4 Chips**: dropped site-wide. Confusing on a single-page site; section headlines do the work.
- **D-6.5 Animations**: removed site-wide for V1. Re-enable with final content.
- **D-6.6 Hero copy**: pitches free session directly. Contact section reframes to "what happens at the session". Two-tier funnel.
- **D-6.7 Session length**: standardised to "30 minutes" everywhere.
- **D-6.8 Situation**: 5-column desktop prototype shipped for visual judgement; falls back to staggered grid at narrower viewports.
- **D-6.9 How-I-work**: option A (3-column + geometric SVG icons).
- **D-6.10 Free session**: option A (split layout). Title sentence-case ("What happens at our free session?"). Right column = checklist. CTA at bottom.
- **D-6.11 Sticky tab visibility**: hide while `#contact` is in viewport (its own CTA replaces it).
- **D-6.12 Footer**: location "UK-wide, based in Manchester" + Privacy policy link (placeholder href).
- **D-6.13 Photo shape**: deferred — keeping rounded-rect main cutout, dropping the broken supporting circle. Kris will supply shape vocabulary post-Phase 6.

## Entry state

- All Phase 1–5 code on `claude/new-site-QGsb8` (last commit: `a533412`).
- Cloudflare preview: https://claude-new-site-qgsb8.looktwice-uk.pages.dev
- `main` still serves holding page.

## Exit state

- All in-scope items shipped, committed, pushed.
- Cloudflare auto-deploys; new preview URL same alias.
- 06-SUMMARY.md captures what shipped, deferred, and any new V1.1 carryovers.
- STATE.md updated to reflect Phase 6 complete.
- Cutover gate (Lighthouse + tab-walk + visual UAT) still pending — Phase 5 verification doc still applies, re-run on the polished site.
