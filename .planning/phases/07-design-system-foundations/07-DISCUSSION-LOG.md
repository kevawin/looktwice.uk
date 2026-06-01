# Phase 7: Design-system foundations (V1 Refresh P1) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-01
**Phase:** 07-design-system-foundations
**Areas discussed:** CTA copy conflict, Button system, Hero pre-button label

---

## CTA copy conflict

| Option | Description | Selected |
|--------|-------------|----------|
| Let's talk | Keep live label; warm, drops explicit 30-min signal from button | |
| Free 30-min call | Apply roadmap lock; transactional, states offer/cost/time | |
| Free 30-min chat | Hybrid; keeps offer/cost/time, "chat" stays warm | ✓ |

**User's choice:** Free 30-min chat
**Notes:** Supersedes the 2026-05-31 roadmap lock of "Free 30-min call". One string sitewide. Live "Let's talk" / "Get in touch" replaced.

---

## Hero pre-button label

| Option | Description | Selected |
|--------|-------------|----------|
| Drop it | Button alone carries the offer | |
| Keep as-is | Leaves "Schedule a free 30-minute diagnosis." (repeats free/30) | |
| Reword to value | Replace with a line adding meaning the button can't (reassurance) | ✓ |

**User's choice:** Reword to value
**Notes:** Structural decision locked here (label = value line, not duplicate). Proposed text "No sale, no follow-up unless you want one." pulled from refresh P4; final wording is Kris's in P4.

---

## Button system

| Option | Description | Selected |
|--------|-------------|----------|
| Hot Pink | Unify Linen buttons to Hot Pink fill; honours CLAUDE.md | |
| Cool Indigo | Unify to indigo; bends cool-accent rule | |
| Keep per-section | Leave work=indigo, services=pink | |
| **Other** | Remove the in-page CTAs for now | ✓ |

**User's choice:** (Other) Remove the in-page CTAs for now
**Follow-up — Remove scope:**

| Option | Description | Selected |
|--------|-------------|----------|
| Work + services only | Remove 2 mid-page anchor buttons; keep hero + contact | ✓ |
| Work + services + hero | Also remove hero CTA (risky, no above-fold CTA) | |
| All four | Strip every button incl. contact mailto | |

**User's choice:** Work + services only
**Notes:** Refresh Phase 2 floating action bar will carry the persistent CTA, making mid-page anchors redundant. Removal collapses the button system to the two surviving white-fill-on-colour variants — already one coherent style. Unused accent variants (pink/indigo/amber) dropped from CSS.

---

## Claude's Discretion

- CSS deletion mechanics + tidying orphaned focus-ring selectors after variant removal.
- Whether the 12.8px→14px label bump needs per-surface button padding tweaks.
- Font-floor bump (`--text-label` 0.8rem → 0.875rem) folded without discussion — locked, only sub-16px font in codebase.

## Deferred Ideas

- Re-introducing in-page CTAs once the floating bar ships (refresh P2 / GSD 08).
- Final hero-label reassurance wording (refresh P4, Kris).
- Linen accent button styling if a future phase reintroduces a Linen CTA.
