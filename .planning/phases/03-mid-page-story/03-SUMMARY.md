# Phase 3 — Mid-page Story: SUMMARY

**Phase:** 03-mid-page-story
**Status:** execution complete, verification = `human_needed`
**Date:** 2026-05-01
**Branch:** claude/new-site-QGsb8

## Goal

After the situation, the visitor hits a Signal Orange opinionated statement, sees that work exists (placeholder), and reads three problem-first service areas.

## Requirements satisfied

INTR-01..04, WORK-01..04, SERV-01..05 (13 / 13).

## What shipped

### Section: Positioning Interrupt (#approach) — INTR-01..04

- Signal Orange full-bleed surface, `--space-xl` vertical padding.
- One White Headline-scale statement, max-width 800px, left-aligned.
- No chip, no subheading, no CTA.
- Single `.reveal` wrapping the statement (fade + translateY, 400ms ease-out-quart).

Copy: Option A from CONTENT-DRAFT.md (diagnostic framing). Em-dashes substituted with commas per project ban.

### Section: Work placeholder (#work) — WORK-01..04

- Linen surface, `--space-section` vertical padding.
- "WORK" chip (reuses generic `.chip` from Phase 2), Headline-scale heading "The proof is in the diagnosis."
- Two-sentence holding statement capped at `--measure` (65ch).
- Ghost button "GET IN TOUCH" → `#contact` using new `.btn--ghost-on-light` variant (Midnight border + text on Linen, Midnight fill + Linen text on hover).
- Reveal stagger (80ms default): chip+headline (0), body (1), CTA (2).

### Section: Services (#services) — SERV-01..05

- Linen surface, `--space-section` vertical padding.
- "HOW I WORK" chip (reused), headline "Three problems. One frame."
- Three items in `<ol role="list">` separated by 1px Midnight-12% horizontal rules (border-top on each, plus bottom border on last item to close the rule stack visually before the CTA).
- Each item: Hot Pink number (Label typography), Bold service name (Title scale), two Body sentences capped at `--measure`.
- Ghost button "TALK THROUGH WHAT YOU NEED →" below item 03 → `#contact`.
- Reveal stagger 100ms (`data-reveal-step="100"` per HOMEPAGE-SPEC §6).

## Files touched

| File | Change |
|------|--------|
| `index.html` | Filled `#approach`, `#work`, `#services` placeholder sections with semantic markup + reveal attributes |
| `css/components.css` | Appended `.btn--ghost-on-light`, `.interrupt`, `.work`, `.services` (component-scoped: header, headline, body, list, item, number, title, body) |
| `css/layout.css` | Appended `.interrupt__inner`, `.work__inner`, `.services__inner` shared inner-wrapper rule (1280px max-width, centred) |
| `css/animations.css` | No change — generic `.reveal` from Phase 2 covers all three sections |
| `js/main.js` | No change — generic IntersectionObserver from Phase 2-03 picks up new `.reveal` elements automatically |

## Decisions

- **D-3.1 Cloud-session simplification:** Phase 3 ships without per-plan PLAN.md files. HANDOFF.md authorises plain-English execution for cloud Claude. Phase 2 plan files remain available as templates if Phase 4/5 need the formal pattern.
- **D-3.2 Em-dash substitution:** All draft copy from CONTENT-DRAFT.md had em-dashes replaced with commas (Option A interrupt copy + work holding statement + all three service descriptions). Project ban (CLAUDE.md / HANDOFF §Hard rules).
- **D-3.3 `.btn--ghost-on-light` is a new component variant** alongside the existing `.btn--ghost-on-dark` (used in hero). Same padding, radius, transition; inverted colours for Linen surface. Phase 4 reuses it on the Midnight footer-link surface only if the contact CTA design calls for ghost — otherwise stays scoped to Phase 3.
- **D-3.4 Hot Pink number reuse:** Services scopes its own `.services__number` rather than aliasing `.situation__number` because the styles are identical but the BEM scope keeps each section's component layer self-contained. Same pattern Phase 2 used for situation.
- **D-3.5 Services rule stack:** Spec says "items separated by 1px rules". Implemented as `border-top` on each item + `border-bottom` on `:last-child` so the rule stack closes visually below item 03 before the CTA. This reads as "rules wrap the list" rather than "rules float between items", which makes the closing CTA feel decisively below the section rather than orphaned.
- **D-3.6 Services CTA reveal index = 4** (after items 1, 2, 3 at indices 1, 2, 3 with step 100ms) — the CTA arrives 400ms after item 01 begins revealing, which lands as a natural punctuation beat, not a separate animation phase.

## Carryover items into Phase 4

- Footer (`<footer class="footer footer--placeholder">`) still empty — Phase 4 fills (FOOT-01..04).
- Sticky tab not yet rendered — Phase 4 (TAB-01..07).
- All anchor links (`#contact` from work + services CTAs, `#contact` from hero, etc.) work via `scroll-behavior: smooth` already wired in Phase 1. JS-01..06 verification still happens in Phase 4.

## Open content decisions (non-blocking)

Same as listed in `.planning/STATE.md` Open Content Decisions — Kris's review still required:

- Positioning interrupt copy — Option A or B (currently shipping A, swap is one Edit)
- Services copy — drafts are directional; Kris refines in her own framing

## Verification status

`human_needed` — Kris to inspect Phase 03 sections on Cloudflare Pages preview at `https://claude-new-site-qgsb8.looktwice-uk.pages.dev` (desktop, 1024px, 640px, 375px), check:

1. Signal Orange interrupt full-bleed, statement left-aligned, no chip/sub/CTA visible
2. Work chip hugs text (not stretched — Phase 2 fix in `.chip`), holding statement under 65ch, ghost button centred / left
3. Services rules render at 1px Midnight-12% across full content width
4. Services items reveal at 100ms stagger (not 80ms — confirms `data-reveal-step` override is working)
5. `prefers-reduced-motion: reduce` strips translateY but keeps fade
6. Em-dash absence in rendered copy (no remaining `—` characters)
