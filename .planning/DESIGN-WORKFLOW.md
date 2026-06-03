# Design workflow — GSD ↔ impeccable handoff (V1 Restructure)

**Created:** 2026-06-03
**Scope:** V1 Restructure milestone, phases 13-21.
**Why this exists:** GSD has no built-in wiring to the impeccable skill (the word
"impeccable" appears nowhere in any GSD workflow). The roadmap states the intent in
prose, but nothing tells the planner or executor *when* to run impeccable and *when*
to resume GSD. This doc encodes that handoff explicitly so every phase 13-21 follows
the same rhythm, and records the operational fix that stops GSD's UI-SPEC gate from
fighting impeccable.

---

## Roles (the principle)

- **GSD = the workflow spine.** Discuss → plan → execute → verify, atomic commits,
  state tracking. GSD owns *what* gets built and the process around it.
- **impeccable = the design engine.** It authors and polices the visual/design work
  against `DESIGN.md`. impeccable owns *how it looks and feels*.
- **`DESIGN.md` = the design contract.** Built in Phase 13. It **supersedes**
  `gsd-ui-phase` / `UI-SPEC.md` for this milestone — do NOT generate a GSD UI-SPEC.
  Neither `DESIGN.md` nor `css/tokens.css` is "law"; they work together and both stay
  mutable (Phase 13 D-04).

## Operational fix — UI-SPEC gate disabled

`plan-phase.md` §5.6 (UI Design Contract Gate) would otherwise see a frontend phase,
find no `*-UI-SPEC.md`, and recommend `/gsd-ui-phase` — the exact artifact `DESIGN.md`
replaces. To stop that, this milestone sets in `.planning/config.json`:

```json
"workflow": { "ui_phase": false, "ui_safety_gate": false }
```

Both false → the gate skips silently (plan-phase.md:619). **Revisit after this
milestone** if a future phase wants GSD's UI-SPEC flow back.

> If you ever run `plan-phase` before the config propagates, pass `--skip-ui`.

---

## The standard handoff loop (phases 14-21)

Most phases follow this rhythm. The design step is a **manual, human-in-loop
checkpoint** — `gsd-executor` will not auto-invoke a skill, so the plan must carry an
explicit "DESIGN STEP" task that names the impeccable call and pauses for it.

1. **GSD discuss** — `/gsd-discuss-phase {N}` → CONTEXT.md (decisions, design intent).
2. **GSD plan** — `/gsd-plan-phase {N}` → PLAN.md. The plan MUST include an explicit
   design-step task, e.g. *"DESIGN STEP (manual): run impeccable `shape` against
   DESIGN.md for this section; Jamie rules on the draft before code is finalised."*
3. **impeccable (design engine)** — at the design-step task, invoke the impeccable
   skill in the mode named for that phase (table below), against `DESIGN.md`. Jamie
   reviews/rules. Output feeds the build.
4. **GSD execute** — `/gsd-execute-phase {N}` builds the impeccable-approved design;
   atomic commits.
5. **GSD verify** — `/gsd-verify-work` / phase verification against success criteria.

**Planner instruction:** when planning phases 14-21, emit the design-step task as a
real, ordered task in PLAN.md (not a footnote), so execution stops there for the
impeccable pass. Reference this doc by path in the plan.

---

## Per-phase stages

| Phase | Type | GSD role | impeccable | Notes |
|------|------|----------|-----------|-------|
| **13 Design contract** | Contract (impeccable-only deliverable) | Bracket only — no plan/execute tasks; mark phase done after the contract lands | `setup`/global (register = brand), ingest `design-inputs.md` + `css/` tokens; rule-by-rule keep/override/kill with Jamie | Deliverable *is* `DESIGN.md`. Skip GSD planning; run impeccable now. Rulings already captured in `13-CONTEXT.md`. |
| **14 Define the offer** | Decision/spec (no layout) | Full GSD: discuss → plan → execute | **None** — no visual design step | Jamie stands in for Kris. Pure offer definition; impeccable not needed. |
| **15 Services section** | Layout-heavy | Plan structure + execute build + verify | `shape` → build → `critique`/`polish` against DESIGN.md | Pip-decks scannability; uses the priced-comparison card-grid carve-out (13 D-06). |
| **16 Process section** | Structure | Plan + execute + verify | `shape` | bgn.agency structure (plain numbered steps, image per step), minus JS-takeover. |
| **17 About Kristina** | New section | Plan + execute + verify | `shape` → `polish` | Section does not exist today; design from scratch against the contract. |
| **18 Experience / proof** | Section (rework) | Plan + execute + verify | `shape` → `polish` | Reworks old credentials work; logos stubbed with placeholders. |
| **19 Intro re-tighten** | Rework | Plan + execute + verify | `shape` → `polish` | Reworks hero + recognition beat after the offer exists. |
| **20 Copy voice pass** | Copy | Plan + execute + verify | impeccable **copy rules** (no em-dashes, no buzzwords, no aphoristic cadence) | Voice, not layout. impeccable polices copy, not shape. |
| **21 Visual variety, motion & shape** | Cross-cutting (LAST) | Verify + bracket | `global-end` `polish` + `audit`; `live` mode for in-browser shape/layout iteration | Heavy impeccable. Apply shape vocabulary sitewide, build the "look twice" motion patterns (13 D-14/D-15), final audit sweep. |

---

## Quick reference — "what runs now?"

- **Phase 13:** impeccable now (contract). No GSD plan/execute.
- **Phase 14:** GSD only. No impeccable.
- **Phases 15-19:** GSD plan → **impeccable `shape`** (design step) → GSD execute → verify.
- **Phase 20:** GSD plan/execute with impeccable copy rules.
- **Phase 21:** mostly impeccable (`polish`/`audit`/`live`) → GSD verify.

*Maintained alongside `ROADMAP.md` (V1 Restructure) and `design-inputs.md`.*
