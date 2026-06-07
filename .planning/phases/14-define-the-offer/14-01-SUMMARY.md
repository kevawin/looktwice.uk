---
phase: 14-define-the-offer
plan: 01
subsystem: content
tags: [offer, pricing, productised-consulting, content-contract, commitment-ladder]

requires:
  - phase: 13-design-contract
    provides: V1 Restructure sequence and phase ordering (offer feeds Services 15)
provides:
  - .planning/OFFER.md — the locked offer spine (free-call entry + Diagnose/Strategy/Embed rungs, prices, outcomes, productised/bespoke split, all [CONFIRM-KRIS])
  - STATE.md pointer recording the stable OFFER.md path for downstream phases
affects: [15-services-section, 16-process, 17-about, 19-intro]

tech-stack:
  added: []
  patterns:
    - "Provisional + confirmed field: every price/name/outcome carries [CONFIRM-KRIS] until Kris signs off"
    - "Offer-as-content-contract: a single .planning Markdown spec consumed by all downstream content phases"

key-files:
  created:
    - .planning/OFFER.md
  modified:
    - .planning/STATE.md

key-decisions:
  - "OFFER.md lives at .planning/OFFER.md (stable path, root kept clean) per RESEARCH A6"
  - "Provisional public rung names used: The Diagnostic / Strategy Sprint / Embedded Partner (all [CONFIRM-KRIS])"
  - "D-10 one-line outcomes carried with em-dashes substituted for commas to honour the CLAUDE.md em-dash ban (substance preserved)"

patterns-established:
  - "Commitment ladder framing (not Good/Better/Best): explicit Not-Cumulative-Tiers note enforces it for Phase 15"
  - "Three disciplines surfaced as 'what this draws on' inside each rung, never as separate purchasable tiles (D-03)"

requirements-completed: []

duration: 8 min
completed: 2026-06-07
---

# Phase 14 Plan 01: Define the Offer Summary

**Authored `.planning/OFFER.md`, the locked three-rung commitment ladder (Diagnose / Strategy / Embed) plus the free-call entry, with provisional prices, one-line outcomes, what's-included lists, and the productised/semi-productised/bespoke split, every provisional value flagged [CONFIRM-KRIS].**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-06-07
- **Completed:** 2026-06-07
- **Tasks:** 2
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments

- Wrote the offer spine: overview, free-call entry point, three fully-specified rungs, not-cumulative note, downstream-consumer notes, open items, confirmation note.
- Made the productised → bespoke split readable per rung (Diagnose = Productised, Strategy = Semi-productised, Embed = Bespoke).
- Carried RESEARCH's three open questions forward as flagged Open Items for Kris (rung vocabulary, Embed anchor £2,500 vs £3,000/month, the actual Diagnostic process).
- Recorded the stable OFFER.md path in STATE.md so Phases 15/16/17/19 find it by reference.
- All three ROADMAP Phase 14 success criteria self-verified satisfiable from OFFER.md alone.

## Task Commits

1. **Task 1: Write the offer spine — .planning/OFFER.md** - `d753040` (feat)
2. **Task 2: Record the OFFER.md pointer in STATE.md and self-verify** - `90140cd` (docs)

## Files Created/Modified

- `.planning/OFFER.md` - The locked offer spine. Content contract consumed by Phases 15/16/17/19.
- `.planning/STATE.md` - Added OFFER.md to Files of record with a one-line description.

## Decisions Made

- OFFER.md placed at `.planning/OFFER.md` (stable, co-located with planning artifacts) per RESEARCH A6.
- Provisional public rung names: "The Diagnostic", "Strategy Sprint", "Embedded Partner" (RESEARCH recommendation, all `[CONFIRM-KRIS]`).
- Free call kept distinct from paid Diagnose via an explicit scope note (conversation vs investigation with written output), closing RESEARCH Pitfalls 1 and 3.
- Embed framed around outcomes and availability, not hours (RESEARCH Pitfall 5).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] D-10 outcomes carried with em-dashes replaced by commas**
- **Found during:** Task 1 (writing the three one-line outcomes)
- **Issue:** The plan said carry the D-10 outcomes "verbatim", but the D-10 source strings in CONTEXT/RESEARCH contain em-dashes (e.g. "the symptom — with a clear direction out"). The CLAUDE.md em-dash ban, the task's own copy rules, the `<acceptance_criteria>` ("No em-dash characters present"), and the `<verify>` automated check (`! grep -q $'—'`) all forbid em-dashes. Carrying them verbatim would fail the automated gate.
- **Fix:** Preserved the exact substance and wording of all three outcomes, replacing the em-dash with a comma in each. Example: "Name the real problem, not the symptom, with a clear direction out."
- **Files modified:** .planning/OFFER.md
- **Verification:** `! grep -q $'—' .planning/OFFER.md` passes; outcomes still carry `[CONFIRM-KRIS]`; outcome count = 3.
- **Committed in:** d753040 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug — copy-rule conflict resolved toward the hard em-dash ban).
**Impact on plan:** No scope change. The hard em-dash ban and the automated verify gate take precedence over "verbatim" when they conflict; substance of the D-10 outcomes is fully preserved. Final voice polish is Phase 20.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. This phase produces a planning Markdown spec only.

## Open Items Flagged for Kris

Carried into OFFER.md `## Open Items for Kris` for pre-launch confirmation:

1. Rung vocabulary — does Kris have her own client names for the rungs?
2. Embed anchor — move from ~£2,500/month up to a mid-market ~£3,000/month?
3. The Diagnostic process — what it actually involves vs a thorough free call.

Plus every `[CONFIRM-KRIS]` marker (20 total across prices, public names, durations, outcomes, and what's-included lists) awaits sign-off before any copy goes live.

## Next Phase Readiness

- The offer spine is locked and downstream-consumable. Phase 15 (Services section) can render the priced comparison directly from OFFER.md (name, price, outcome, what's-included per rung).
- Phases 16/17/19 have named rungs and downstream-consumer notes to reference.
- No production code touched (`git status` confined to `.planning/`). No blockers.

## Self-Check: PASSED

- `.planning/OFFER.md` exists on disk: FOUND.
- `.planning/STATE.md` modified and committed: FOUND.
- Commit `d753040` (Task 1): FOUND in git log.
- Commit `90140cd` (Task 2): FOUND in git log.
- Task 1 automated verify: PASS (What's included = 3, CONFIRM-KRIS = 20 ≥ 9, Productised/Semi-productised/Bespoke present, reassurance line present, no em-dash).
- Task 2 automated verify: PASS (OFFER.md referenced in STATE.md; no production code modified).

---
*Phase: 14-define-the-offer*
*Completed: 2026-06-07*
