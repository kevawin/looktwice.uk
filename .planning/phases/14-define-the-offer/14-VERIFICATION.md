---
phase: 14-define-the-offer
verified: 2026-06-07T00:00:00Z
status: passed
score: 9/9 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: none
  previous_score: none
---

# Phase 14: Define the Offer Verification Report

**Phase Goal:** The set of services Kris sells is defined as named, priced packages — the spine every downstream section references.
**Verified:** 2026-06-07
**Status:** passed
**Re-verification:** No — initial verification

This is a content/strategy spec phase. It produces no production code: only `.planning/OFFER.md` plus a pointer in `.planning/STATE.md`. Verification is goal-backward against the three ROADMAP success criteria and the locked CONTEXT decisions D-01..D-10, read against the actual artifact, not SUMMARY claims.

## Goal Achievement

### ROADMAP Success Criteria

| # | Criterion | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | Each rung (Diagnose/Strategy/Embed) is a named package with a price/model and a one-line outcome | PASS | OFFER.md lines 24-41 (Rung 1: "The Diagnostic", ~£2,000 fixed, outcome line), 43-62 (Rung 2: "Strategy Sprint", from ~£6,000, outcome line), 64-82 (Rung 3: "Embedded Partner", from ~£2,500/month, outcome line). All three carry public name + Type + Price + Duration + one-line outcome + What's included + Disciplines + CTA. |
| 2 | Productised vs bespoke split is readable per rung | PASS | Type lines explicit: Rung 1 "Productised, fixed scope, fixed price" (L27); Rung 2 "Semi-productised, fixed shape, scoped per client" (L46); Rung 3 "Bespoke, tailored retainer" (L67). grep confirms one each of Productised / Semi-productised / Bespoke. Matches D-06. |
| 3 | OFFER.md structured so Process(16)/Services(15)/About(17)/Intro(19) can each reference a defined offer | PASS | Named rungs present plus a "Downstream Consumer Notes" section (L87-92) with one bullet each for Phase 15, 16, 17, 19. grep finds all four phase numbers. |

**Score:** 3/3 ROADMAP criteria PASS.

### Observable Truths (PLAN must_haves)

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Each rung is a named package with price/model + one-line outcome | VERIFIED | Three fully-specified rung sections (L24-82). |
| 2 | Productised/semi/bespoke split readable per rung | VERIFIED | Type lines L27/L46/L67. |
| 3 | Structured for downstream phases 15/16/17/19 | VERIFIED | Downstream Consumer Notes L87-92 names all four. |
| 4 | Free 30-min call is single primary CTA + entry, with no-sale reassurance, NOT a priced rung (D-07/D-08) | VERIFIED | "Free Call (Entry Point, not a rung)" section L11-22; "This is the single primary CTA site-wide" (L20); "not a priced rung, Diagnose is the first thing a client pays for" (L20); reassurance line "No sale, no follow-up unless you want one." (L16). |
| 5 | Every CTA routes to free call / Formspree #contact, no direct buy/booking (D-09) | VERIFIED | Each rung CTA line (L41, L61, L81) "routes to the free call / Formspree contact form at #contact"; free-call contact route L18 "single Formspree contact form at #contact. No mailto, no direct booking." No buy-now/book-now language present (the sole "booking" match is the prohibition "no direct booking"). |
| 6 | Three disciplines appear as "what this draws on" inside rungs, never as separate tiles (D-03) | VERIFIED | "Disciplines drawn on" lines inside each rung (L39, L59, L79) marked "applied within the rung, not sold separately". grep finds zero top-level `## Brand strategy` / `## Research` / `## Experience` / `## CX` headings. |
| 7 | Every provisional value carries [CONFIRM-KRIS] | VERIFIED | 20 [CONFIRM-KRIS] markers (PLAN required >= 9). Prices, public names, durations, outcomes, what's-included all flagged. |
| 8 | Reads as a commitment ladder, not Good/Better/Best | VERIFIED | Overview L9 "commitment ladder, not a Good/Better/Best tier choice"; dedicated "Not Cumulative Tiers" section L83-85 reinforces it. |
| 9 | RESEARCH's three open questions carried as flagged open items | VERIFIED | "Open Items for Kris" L94-98 carries all three: (1) rung vocabulary, (2) Embed anchor £2,500 vs ~£3,000/month, (3) actual Diagnostic process. Cross-checked against RESEARCH.md L402-415 — substance matches. |

**Score:** 9/9 truths VERIFIED.

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `.planning/OFFER.md` | Locked offer spine, content contract | VERIFIED | 102 lines. Contains H1 "# The Offer: Look Twice", Overview, Free Call entry, three rung sections, Not Cumulative Tiers, Downstream Consumer Notes, Open Items, Confirmation Required. Substantive, not a stub. Committed (d753040). |
| `.planning/STATE.md` | Pointer to OFFER.md by stable path | VERIFIED | Five references to OFFER.md including a dedicated artifact pointer (L187) describing it as the locked offer spine / content contract for Phases 15/16/17/19. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| OFFER.md | #contact (Formspree) | every rung CTA + free-call CTA | WIRED | All CTA lines route to free call / Formspree #contact; matches CLAUDE.md single-contact-route lock. |
| STATE.md | OFFER.md | recorded artifact path | WIRED | grep `OFFER.md` returns 5 matches incl. stable-path pointer. |

### Locked Decision Carry-Through (D-01..D-10)

| Decision | Carried? | Evidence |
| --- | --- | --- |
| D-01 tiered ladder, not disciplines/single bespoke | Yes | Overview + Not Cumulative Tiers framing. |
| D-02 three rungs Diagnose→Strategy→Embed | Yes | Rungs 1-3 in order. |
| D-03 disciplines = substance within rungs | Yes | "Disciplines drawn on" inside each rung, no standalone tiles. |
| D-04 "from £X" anchors, Diagnose fixed | Yes | Diagnose "~£2,000 fixed"; Strategy "from ~£6,000"; Embed "from ~£2,500/month". |
| D-05 provisional figures all [CONFIRM-KRIS] | Yes | Each price flagged. |
| D-06 productised/semi/bespoke split | Yes | Type lines L27/L46/L67. |
| D-07 free call single primary CTA, no pitch | Yes | L20 + reassurance line. |
| D-08 free call not a priced rung; Diagnose first paid | Yes | L20 explicit. |
| D-09 every CTA → free call / contact form, no direct buy | Yes | All CTA lines + free-call route. |
| D-10 one-line outcomes per rung (em-dashes replaced) | Yes | Outcome lines L30/L49/L70; D-10 drafts had em-dashes, replaced with commas per CLAUDE.md ban (substance preserved). |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| — | — | None | — | No TBD/FIXME/XXX markers. The 20 [CONFIRM-KRIS] markers are the deliberate, specified provisional-value flags, not debt markers. No em-dash (grep U+2014 = 0). No buy/book language (sole "booking" hit is a prohibition). |

### Behavioral Spot-Checks

Not applicable. This phase produces a Markdown spec, no runnable entry points. SKIPPED (no runnable code).

### Probe Execution

Not applicable. No probes declared or implied (content/strategy spec phase).

### No Production Code Modified

Verified. The three phase-14 commits (d753040, 90140cd, 04cdb37) touch only `.planning/OFFER.md`, `.planning/STATE.md`, `.planning/ROADMAP.md`, and `14-01-SUMMARY.md`. `git diff --name-only HEAD~3 HEAD` shows no `index.html`, `css/`, `js/`, `build.js`, or `buildCutout.js`. Working tree clean.

### Gaps Summary

None. All three ROADMAP success criteria PASS, all 9 PLAN truths VERIFIED, both artifacts substantive and wired, all 10 locked decisions carried, all three RESEARCH open questions flagged forward, every provisional value marked [CONFIRM-KRIS], no production code touched, no em-dashes, no direct-buy language. The phase goal — a named, priced offer spine downstream phases can reference — is achieved.

---

_Verified: 2026-06-07_
_Verifier: Claude (gsd-verifier)_
