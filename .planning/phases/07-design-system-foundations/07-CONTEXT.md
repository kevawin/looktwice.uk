# Phase 7: Design-system foundations (V1 Refresh P1) - Context

**Gathered:** 2026-06-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Settle three global primitives so every later V1 Refresh phase renders on consistent foundations:
1. **Minimum font sizes** — raise the label token so no sub-label drops below 14px.
2. **Button system** — collapse to one coherent style by removing redundant in-page CTAs and dropping the now-unused accent variants.
3. **CTA copy** — one unified string sitewide on the remaining CTAs.

This phase touches `css/tokens.css`, `css/components.css`, `index.html`, and `CLAUDE.md` (rule relaxation). No new sections, no layout redesign — those belong to later refresh phases.

</domain>

<decisions>
## Implementation Decisions

### CTA copy
- **D-01:** One CTA string sitewide: **"Free 30-min chat"**. This SUPERSEDES the roadmap's 2026-05-31 lock of "Free 30-min call" — "chat" stays warm and low-pressure while keeping the free/30-min signal. Live labels "Let's talk" / "Get in touch" are replaced.
- **D-02:** Applies to the two REMAINING CTAs only: hero CTA (`index.html:129`) and contact-section mailto CTA (`index.html:279`). The mid-page CTAs are removed (see D-04), so they need no relabel.

### Button system
- **D-03:** "One coherent style" is achieved by REMOVAL, not by picking a Linen accent. After removing the mid-page CTAs, only the white-fill-on-colour variants remain (`btn--on-pink` on Hot Pink hero, `btn--on-teal` on Deep Teal contact) — these already share one shape + fill-then-invert-on-hover logic. No Linen accent button survives, so the indigo-vs-pink question dissolves.
- **D-04:** Remove the two mid-page in-page CTAs **for now**: work section (`index.html:221`, `btn--accent-indigo` "Get in touch") and services section (`index.html:264`, `btn--accent-pink` "Let's talk"). Rationale: refresh Phase 2 (GSD 08) ships a persistent floating action bar that carries the always-available CTA, making these mid-page "go to contact" anchors redundant. "For now" = revisit when the floating bar lands.
- **D-05:** Drop the now-unused CSS variants from `css/components.css`: `.btn--accent-pink`, `.btn--accent-indigo`, `.btn--accent-amber` (amber is already dead code), plus their shared accent focus-ring rule block (currently `components.css:268-273`). Keep `.btn`, `.btn--on-pink`, `.btn--on-teal`.
- **D-06:** Honours CLAUDE.md gradient/cool-accent discipline automatically — no cool-indigo button fill remains, so no rule relaxation needed there.

### Hero pre-button label
- **D-07:** Reword the hero pre-button label (`index.html:127`, currently "Schedule a free 30-minute diagnosis.") to a VALUE line that adds meaning the button can't, instead of duplicating "free 30-min". Proposed placeholder: **"No sale, no follow-up unless you want one."** (pulled forward from refresh Phase 4's reassurance line). FINAL wording is Kris's call in refresh Phase 4 — the STRUCTURAL decision (label = value line, not a duplicate) is locked here; mark the text as provisional/Kris-confirm.

### Font floor (locked, not discussed)
- **D-08:** Raise `--text-label` from `0.8rem` (12.8px) to `0.875rem` (14px) at `css/tokens.css:50`. This is the only sub-16px font in the codebase (no literal px/rem small fonts found); the token is used 11× across CSS, so one change lifts every sub-label to the 14px floor. Prose already floors at 16px via `--text-body` (clamp `1rem` min). Visually glance every `--text-label` surface (buttons, any chips/captions) after the bump — uppercase button text grows slightly.

### CLAUDE.md rule relaxation
- **D-09:** Relax the CLAUDE.md em-dash ban to allow hyphens in number-word content (e.g. "30-min"). This edit lands in this phase. Em-dash ban otherwise stays.

### Claude's Discretion
- Exact CSS deletion mechanics and whether to also tidy any orphaned focus-ring selectors left after variant removal.
- Whether the font-floor bump needs any per-surface padding tweak on buttons (verify the 12.8px→14px uppercase growth doesn't overflow at the hero/contact breakpoints).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Refresh roadmap (source of truth for this phase)
- `.planning/ROADMAP-REFRESH.md` §"Phase 1: Design-system foundations" — full task list + locked decisions (note: the "Free 30-min call" lock there is superseded by D-01 → "Free 30-min chat")
- `.planning/ROADMAP.md` §"Phase 7" — GSD-registered detail block for this phase

### Project constraints
- `CLAUDE.md` §Constraints + §Design bans — typography (Epilogue 400/700, no 500), gradient discipline (gradient in exactly one place), em-dash ban (relaxed by D-09), accessibility (WCAG AA, ≥14px sub-labels)

### Files this phase edits
- `css/tokens.css:50` — `--text-label` token (D-08)
- `css/components.css:171-273` — `.btn` base + variants (D-03, D-05)
- `index.html:127` (hero label, D-07), `:129` (hero CTA copy, D-02), `:221` + `:264` (remove, D-04), `:279` (contact CTA copy, D-02)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.btn` base class (`components.css:171`): shape, weight, uppercase, pill radius, `currentColor` fill, transition — shared by all variants. Keep.
- `.btn--on-pink` / `.btn--on-teal`: white-fill-on-colour with invert-on-hover + white focus-ring override. These two ARE the surviving system.

### Established Patterns
- Fill-then-invert-on-hover is the site's button idiom (post-Phase 6, `06-CONTEXT.md` D-6.3). Surviving buttons keep it.
- Per-surface focus-ring overrides (white ring on colour surfaces) — keep on the two survivors; the Midnight ring block for accent buttons (`components.css:268-273`) goes with the accent variants.

### Integration Points
- Floating action bar (refresh Phase 2 / GSD 08) is the downstream consumer of D-04 — it must carry the persistent CTA that the removed mid-page buttons used to provide. Flag for that phase's planning.

</code_context>

<specifics>
## Specific Ideas

- CTA string "Free 30-min chat" chosen over "Free 30-min call" specifically for warmth on a warm-referral site.
- Hero label should add a NEW value frame (reassurance: no sale, no follow-up), not echo the button.

</specifics>

<deferred>
## Deferred Ideas

- **Re-introducing in-page CTAs** — D-04 removes work + services CTAs "for now". Revisit in refresh Phase 2 (GSD 08) once the floating action bar is live; confirm sections don't feel like dead ends.
- **Final hero-label wording** — refresh Phase 4 (Kris copy) confirms the exact reassurance-line text; P7 ships a provisional string.
- **Linen accent button styling** — moot now (no Linen buttons), but if a future phase reintroduces a Linen CTA, the indigo-vs-pink + CLAUDE.md cool-accent question reopens.

</deferred>

---

*Phase: 07-design-system-foundations*
*Context gathered: 2026-06-01*
