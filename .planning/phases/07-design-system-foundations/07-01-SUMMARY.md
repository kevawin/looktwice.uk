---
phase: 07-design-system-foundations
plan: "01"
subsystem: tokens, buttons, copy
tags: [design-system, typography, buttons, copy, CLAUDE.md]
dependency_graph:
  requires: []
  provides:
    - "--text-label at 14px floor"
    - "Button system collapsed to two variants (btn--on-pink, btn--on-teal)"
    - "Single CTA string sitewide: 'Free 30-min chat'"
    - "Hero pre-button label as reassurance value line"
    - "CLAUDE.md allows number-word hyphens"
  affects:
    - "css/tokens.css"
    - "css/components.css"
    - "index.html"
    - "CLAUDE.md"
tech_stack:
  added: []
  patterns:
    - "Token bump propagates to all consumers via var(--text-label)"
    - "Button system: two white-fill-on-colour survivors, no Linen accent variants"
key_files:
  created: []
  modified:
    - css/tokens.css
    - css/components.css
    - index.html
    - CLAUDE.md
decisions:
  - "D-01/D-02: CTA string 'Free 30-min chat' applied to hero (btn--on-pink) and contact (btn--on-teal); sticky tab left for GSD 08"
  - "D-03/D-04/D-05: Work and services mid-page CTAs removed; all three accent variants and shared focus-ring block deleted"
  - "D-07: Hero label changed to reassurance line 'No sale, no follow-up unless you want one.' (provisional, Kris confirms in P4)"
  - "D-08: --text-label raised from 0.8rem to 0.875rem, lifting every sub-label to 14px floor"
  - "D-09: CLAUDE.md keeps em-dash ban; explicitly allows hyphens in number-word compounds e.g. '30-min'"
metrics:
  duration: "~6 minutes"
  completed: "2026-06-01"
  tasks: 4
  files: 4
---

# Phase 7 Plan 1: Design-system foundations Summary

Raised the label font token to 14px, collapsed the button system to two variants by removing redundant mid-page CTAs and unused accent CSS, unified the two surviving CTAs to a single string, reworded the hero pre-button label to a reassurance value line, and relaxed the CLAUDE.md em-dash ban for number-word hyphens.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Raise label token to 14px floor | 1295acb | css/tokens.css |
| 2 | Remove mid-page CTAs and drop unused accent CSS | 08ac8bc | index.html, css/components.css |
| 3 | Unify CTA copy and reword hero label | c7dc5ca | index.html |
| 4 | Relax CLAUDE.md em-dash ban for number-word hyphens | 44cd8ab | CLAUDE.md |

## Decisions Made

- **D-08 (token):** `--text-label` raised from `0.8rem` (12.8px) to `0.875rem` (14px). Single change lifts 11 consumer surfaces. No other font-size tokens touched.
- **D-04/D-05 (buttons):** Work-section "Get in touch" anchor and services-section "Let's talk" anchor removed from `index.html`. `.btn--accent-pink`, `.btn--accent-indigo`, `.btn--accent-amber` rule blocks and their shared Midnight focus-ring block removed from `components.css`. `.work__cta` layout helper removed.
- **D-01/D-02 (copy):** Hero CTA and contact-section mailto CTA both now read "Free 30-min chat". Sticky-tab "Let's talk →" left untouched (GSD 08 scope).
- **D-07 (hero label):** "Schedule a free 30-minute diagnosis." replaced with "No sale, no follow-up unless you want one." Provisional HTML comment added; Kris confirms final wording in refresh P4.
- **D-09 (CLAUDE.md):** Em-dash ban kept; explicit parenthetical allowance added for hyphens in number-word compounds.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Em-dash introduced in provisional HTML comment**
- **Found during:** Task 3 verification
- **Issue:** The comment `<!-- provisional: reassurance value line — Kris confirms... -->` contained an em-dash, bumping the index.html em-dash count from 1 to 2 (acceptance criteria required the count to stay at 1).
- **Fix:** Replaced "—" with ";" in the comment text.
- **Files modified:** index.html
- **Commit:** c7dc5ca (same task commit, fixed before committing)

## Known Stubs

None. No placeholder text or empty data sources introduced. The hero label is provisional by design (D-07 locks the structural decision; exact wording is Kris's call in P4). This is not a stub — the provisional string is intentionally shipped.

## Threat Flags

None. Static HTML/CSS/docs edits only. No new network endpoints, auth paths, file access, or schema changes.

## Deferred / Carryover

Removing the mid-page CTAs in Task 2 left two segue paragraphs dangling without a call to action:

- Work section (`index.html:220`): "Want to see an example of my work and how I think?"
- Services section (`index.html:262`): "If something here is your problem, the first 30 minutes are on me."

Both now end a section with a question or offer and no button to answer it. This is intentional for this plan — the floating action bar lands in refresh Phase 2 (GSD Phase 08) and must answer these segues (Work pill answers the work paragraph; the gradient CTA pill answers the services offer). Kris may also reword either paragraph in refresh Phase 4 once the floating bar is in place.

Carryover owners:
- **GSD 08 (refresh Phase 2):** floating action bar must answer both segues.
- **Refresh Phase 4:** Kris reviews and may reword both paragraphs.

## Checkpoint

Task 5 is a `checkpoint:human-verify` gate. Human visual verification required:

1. Open the branch preview on phone and desktop.
2. Hero: button reads "Free 30-min chat" on one line; label reads "No sale, no follow-up unless you want one."
3. Contact section: button reads "Free 30-min chat" on one line.
4. Work section: no "Get in touch" button — section ends cleanly.
5. Services section: no "Let's talk" button — section ends cleanly.
6. At ~375px both buttons still fit without text overflowing the pill edge.

Branch: `new-site` — Cloudflare Pages preview: https://new-site.looktwice-uk.pages.dev

## Self-Check: PASSED

- [x] css/tokens.css contains `--text-label:    0.875rem`
- [x] css/components.css: 0 occurrences of `btn--accent`, 4 occurrences each of `btn--on-pink` and `btn--on-teal`
- [x] index.html: 2 occurrences of `>Free 30-min chat<`, 0 of `btn--accent`, 0 of `work__cta`
- [x] index.html em-dash count unchanged at 1 (baseline preserved)
- [x] CLAUDE.md: em-dash ban present, hyphen allowance added, font-weight 500 ban intact
- [x] Commits 1295acb, 08ac8bc, c7dc5ca, 44cd8ab all exist in git log
