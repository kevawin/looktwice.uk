# Phase 13: Design contract - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Produce a negotiated `DESIGN.md` — the single design source of truth for the V1
restructure (phases 14-21). No code ships; this is a decisions/foundation phase.

The contract must contain:
1. A named **shape vocabulary** (shapes + one consolidated fixed-radius set) every section reuses.
2. A **colour/type contract** that extends the existing OKLCH tokens (no fresh palette) except where a rule was explicitly overridden below.
3. A **motion philosophy** + the reduced-motion fallback, set as principles.
4. An explicit **keep/override/kill ruling** on each of the six flagged inherited rules, with rationale.

Authored via the **impeccable** skill in global-setup mode (register = brand):
impeccable proposes a recommended draft, Jamie rules on each item. Identity-preservation
is OFF — inherited rules are not auto-kept.

</domain>

<decisions>
## Implementation Decisions

### Contract file & authorship
- **D-01: Overwrite root `DESIGN.md`.** It becomes the single living negotiated contract. The PROJECT.md / CLAUDE.md "do not modify root DESIGN.md during build" lock is **lifted** (mirrors the 2026-06-02 tech-stack relaxation, Jamie as technical owner). Record the reversal in CLAUDE.md + STATE.md.
- **D-02: Retire `DESIGN.json`.** `DESIGN.md` is the sole design source of truth. Nothing in the build reads the JSON (values live in `css/tokens.css`). Delete it or mark it archived/stale — do not keep it in sync.
- **D-03: impeccable proposes, Jamie rules.** impeccable drafts the full contract (shape vocabulary, rule rulings with rationale, motion spec); Jamie reviews and accepts/edits each. impeccable adds design judgement; Jamie is the decider.
- **D-04: Neither file is law — they work together.** `DESIGN.md` captures design intent / theme / brand / rule rulings; `css/tokens.css` holds the values. **Both are mutable.** Refreshing the design may change tokens; finding a better value may update DESIGN.md. Build flexibility in — do NOT frame either as frozen or as a strict authority hierarchy. The contract owns rules + vocabulary + principles and **references `css/tokens.css` for exact values** rather than duplicating them (avoids drift), but tokens are not "truth DESIGN.md must obey" — they evolve together.

### Inherited rule rulings (the six flagged rules)
- **D-05: Card-shadow ban → KILL.** Shadows become an available tool. The contract frames them as "available, used with judgement" (not banned, not "decorate freely") so impeccable still pushes against the generic-card look without a hard stop.
- **D-06: No-card-grids ban → KILL.** Card grids available (covers the Phase 15 priced-package comparison and general use). Same judgement framing — guard against the "four icon cards any AI tool would generate" failure mode, but no hard ban.
- **D-07: No mid-tone greys → KILL.** Mid-tone greys available (helps form helper text, placeholders, disabled states, and general use).
- **D-08: Gradient-only-on-the-tab → KILL.** The brand gradient is freely available; the one-place scarcity rule is gone. (Tradeoff noted: scarcity was a stated brand signature — the contract should flag this, no hard stop.)
- **D-09: Epilogue-only → KEEP. Weight restriction (no-500) → OVERRIDE (door left open).** Epilogue stays the **only** type family, firm — a second family would mean running two typefaces across ALL Look Twice material, not just the site (brand-wide cost, not a web decision). But the 400/700-only limit is **not locked**: a third weight (likely 500) stays on the table for hierarchy, decided when a real need appears (dense pricing tables in Phase 15 are the likely trigger). CLAUDE.md's hard "no weight 500" ban softens to "revisit when hierarchy demands" — not relaxed now, not forbidden.
- **D-10: B&W cutout desaturation → KILL → settle to neutral (no hard rule).** B&W stays the natural default on coloured surfaces (Kris's point: coloured section + coloured image = colour overkill — accepted). Colour imagery is neither banned nor baked in: explicitly left open on white/neutral surfaces, decided per-use. The earlier B&W→colour→B&W scroll-reveal idea is **dropped**; replaced as a candidate by a subtle parallax on the B&W images behind the cutout window (explored in Phase 21, not baked in here).

### Shape vocabulary
- **D-11: Build on existing presets.** Seed the vocabulary from the five shipped cutout presets (`circle`, `down-triangle`, `up-triangle`, `pill`, `rounded-rect` in `buildCutout.js`) plus current radius tokens; impeccable rationalises them into a named vocabulary, adding/removing as needed. Continuity with the shipped hero, minimal churn.
- **D-12: Strict reuse — no new shapes without a contract update.** Every section MUST draw from the named set; introducing a new shape requires updating `DESIGN.md` first. This is the deliberate cure for the current shape inconsistency (Koto reference). Note: discipline on the shape *system* is intentional even though the inherited *bans* were loosened — the bans were guardrails, the vocabulary is the positive system.
- **D-13: Govern everything shaped under one fixed-radius set; consolidation deferred to Phase 21.** The vocabulary covers cutout apertures, container/card corners, buttons, and dividers. The named shapes are locked now; the current five radii (`--radius-sm` 4 / `--radius-md` 10 / `--radius-cutout` 16 / `--radius-lg` 20 / `--radius-pill` 999) stand and are named by the vocabulary. **Whether to consolidate the close middle steps is deferred to Phase 21** (Jamie: "I need to see them" — decide when shapes are applied sitewide). No radius value changes before then. (Updated from the original "consolidate now" intent after Jamie ruled to see them in context first.)

### Motion & scroll-reveal
- **D-14: Motion principle = the "look twice" feel.** The design language should create subtle interactions that make the user literally look twice — *did that image just move?* This is the north star; every per-phase animation is justified against it (and against motion restraint — few, intentional, brand-reinforcing, never decorative).
- **D-15: Candidate interactions listed, none baked in.** Parallax behind cutouts, colour-on-white imagery, micro-reveals — the contract lists these as explorations to draw from; specific interactions are decided per-phase (mostly Phase 21), not prescribed now.
- **D-16: Reduced-motion fallback = everything static, content fully visible.** Under `prefers-reduced-motion: reduce`: no parallax, no reveals, no movement; cutout images rest in their default state (B&W on colour); content shows immediately with zero motion dependence. Matches impeccable's rule that reveals enhance an already-visible default. This is the one motion item fixed in the contract now.
- **D-17: Drop the old scroll-reveal; build fresh.** The legacy IntersectionObserver opacity+stagger content reveal is already gone from the code (verified: `js/main.js` only uses IntersectionObserver for the floating-bar scroll-gate and `#contact` suppression; `css/animations.css` holds only the word-roller). The contract does not carry it forward — Phase 21 builds fresh "look twice" patterns from a clean slate.

### Contract authoring session (impeccable, 2026-06-03)

DESIGN.md was authored this session (impeccable proposes, Jamie rules — D-03). Jamie then reopened every carried-forward "locked" state ("nothing stays locked just because it was locked before"). Additional rulings:

- **D-18: DESIGN.md authored + DESIGN.json retired.** Root `DESIGN.md` rewritten in the Stitch six-section format (frontmatter mirrors `css/tokens.css`; motion + shape folded into Overview, since the format forbids extra top-level sections). `DESIGN.json` deleted (D-02). Note: Stitch is only the file format — zero design decisions came from it.
- **D-19: North star "The Second Look" — kept.** It is the brand name and the "look twice" motion idea; stays the organising metaphor (reopened and reaffirmed, not inherited-by-default).
- **D-20: Surface model = neutral spine + accent punctuation (replaces the two-mode system).** Linen/Midnight is the default ground; colour-drenched surfaces are reserved for emotional/conversion beats (hero, interrupt, contact). Better for a 6-section page than the inherited drenched-vs-Linen binary.
- **D-21: Cutouts are a key-moment device, not every section.** Used at openers; other sections express the second look via motion/layout (leans on Phase 21).
- **D-22: Cutout apertures reveal images ONLY.** Never a colour or gradient fill inside a window. The field is the section surface; a cutout on a gradient-background section is a build-time judgement ("decide after seeing it").
- **D-23: Gradient = soft discipline + sparing backgrounds.** Available, spent on deliberate moments (CTA, recommended tier), not default fill; allowed sparingly as a section background. (Extends D-08.)
- **D-24: Palette kept as Kris's brand law.** The 6 accents + neutrals + exact hex stand; reopening colour is Kris's call, not a technical one. Mutable, not frozen.
- **D-25: Functional neutrals — prefer faded brand colours over true grey.** Where a mid-tone grey would go (helper text, placeholders, disabled), reach first for low-opacity Midnight or a faded accent (the `midnight-12/15` pattern). Refines D-07's "greys available."
- **D-26: Cool accents allowed as drenched section backgrounds.** Rich Purple / Cool Indigo can own a gravitas punctuation beat, not just hover/gradient. Revises the old "never a background" rule.
- **D-27: Type scale revised (Jamie approved via live demo).** Body up (18–20px), new **Lead** step (20–24px), Title up (24–30px), Headline 32–48px, Display 44–80px, `--text-mega` dropped (declared but unused). Line-heights unchanged. `css/tokens.css` sync is a follow-up implementation step (changes body size sitewide → lands with a visual check, not in this contract-only phase).
- **D-28: Spacing scale kept as-is** (8px base 8/16/32/64/96/120 — sound).

### Claude's Discretion
- Precise wording of the motion/rule sections is impeccable's to propose, with Jamie ruling.
- How aggressively to push the "judgement" framing on the killed bans (D-05/06/07/08) so the contract still steers away from the generic-consultant look.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design inputs & inherited system
- `.planning/design-inputs.md` — the V1-restructure design inputs: signature-interaction intent, motion-restraint philosophy, steal-list (Pip Decks, bgn.agency, Koto), and the six inherited rules flagged for re-ruling. The brief impeccable ingests.
- `DESIGN.md` (root) — the inherited design system being overwritten this phase. Read it first to know what's being negotiated (two-surface palette, type hierarchy, elevation, components, Do's/Don'ts). After this phase it IS the contract.
- `DESIGN.json` (root) — inherited machine-readable twin; **being retired** (D-02). Read only to confirm nothing else consumes it before deletion.
- `css/tokens.css` — the live token values the contract references (D-04): exact brand hex, Epilogue 400/700, radius set, `--shadow-float`, `--gradient-brand`. The implementation half of the contract.

### Brand & product truth
- `PRODUCT.md` (root) — audience, voice, brand personality; the "why" behind design intent.
- `.planning/PROJECT.md` — core value, constraints, key decisions; carries the design bans and gradient-discipline rules this phase re-rules.
- `CLAUDE.md` (root) — project instructions; carries the design bans, the Epilogue-only/no-500 constraint (softened by D-09), the gradient-discipline rule (killed by D-08), and the cutout primitive docs. Update for D-01 (DESIGN.md lock lift), D-08, D-09 after this phase.

### Shape & cutout implementation
- `buildCutout.js` (root) — the five `SHAPE_PRESETS` (`circle`, `down-triangle`, `up-triangle`, `pill`, `rounded-rect`) that seed the shape vocabulary (D-11); also the B&W desaturation hook (`feColorMatrix saturate=0`) relevant to D-10.

### Skill
- The **impeccable** skill — authors the contract in global-setup mode (D-03). Invoked during the phase's design/execution step, not during this discussion.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `css/tokens.css`: OKLCH/brand-hex tokens, type scale, spacing, radii, `--shadow-float`, `--gradient-brand`, transitions. The contract references these rather than duplicating values (D-04). Radii get consolidated (D-13).
- `buildCutout.js` `SHAPE_PRESETS`: the five cutout shapes that seed the named vocabulary (D-11).
- `css/components.css` (29 KB): the realised components (buttons, chips, cutout primitive, service rules, floating bar) — the current shape/radius usage the vocabulary must rationalise.

### Established Patterns
- Token-referenced CSS: components use `var(--token)` not hardcoded values — change-once-propagates. Reinforces D-04 (values live in one place).
- Build-time SVG cutout codegen (`buildCutout.js` → `dist/index.html` at `<!-- CUTOUT:hero -->`): shapes are a build concept, so the shape vocabulary is enforceable in code, not just prose.
- IntersectionObserver is used only for the floating-bar gate + `#contact` suppression (D-17) — no content-reveal pattern survives to constrain Phase 21.

### Integration Points
- The contract (`DESIGN.md`) is read by every restructure phase's design step (14-21) and by impeccable.
- Radius consolidation (D-13) touches `css/tokens.css` and any component referencing the five radius tokens — a downstream (post-contract) change, scoped by the contract.
- D-01/D-08/D-09 require edits to CLAUDE.md (and STATE.md) recording the lock lift, gradient-rule kill, and Epilogue/no-500 softening.

</code_context>

<specifics>
## Specific Ideas

- **"Look twice" motion north star** (D-14): subtle interactions that make the user literally look twice — *did that image move?* This is the brand's literal expression in the design language.
- **Koto** — one shape vocabulary repeated with discipline; the model for D-11/D-12/D-13.
- **Pip Decks** — text-light, scannable "here's exactly what you get" clarity; informs the killed card-grid carve-out (D-06) for Phase 15 services/pricing.
- **bgn.agency** — process-section structure (5 plain steps, images, short paragraphs), steal the structure not the JS-takeover; relevant to Phase 16.
- **Kris's input on B&W** (D-10): coloured section + coloured image = colour overkill — drove the settle-to-neutral ruling and the shift from colour-reveal to subtle parallax.

</specifics>

<deferred>
## Deferred Ideas

- **Sync `css/tokens.css` to the revised type scale (D-27)** — update `--text-display/headline/title/body`, add `--text-lead`, remove `--text-mega`. Changes body size sitewide, so do it with a visual check (a quick task, or folded into the first build phase). The contract leads; tokens follow.
- **Radius consolidation (D-13)** — decide in **Phase 21** when shapes are applied sitewide.
- **Parallax behind cutouts, colour-on-white imagery, specific micro-reveals** — candidate "look twice" interactions; explored and implemented in **Phase 21** (visual variety, motion & shape consistency), not baked into the contract (D-15, D-21).
- **CLAUDE.md / PROJECT.md rule updates** — record the design-rule reversals so the old bans don't contradict the contract: DESIGN.md lock lifted (D-01), shadows/grids/greys/gradient-scarcity killed (D-05/06/07/08/23), Epilogue no-500 softened (D-09), gradient-discipline + cool-accent-background rules revised (D-23/26).
- **Adding a third Epilogue weight (likely 500)** — door left open (D-09); decided when a real hierarchy need appears, likely **Phase 15** pricing tables.
- **Priced-package comparison layout using the now-allowed card grid** — **Phase 15** (services), enabled by D-06.
- **Accessibility/contrast re-check after killing the bans** — killing shadows/greys/gradient-scarcity and possibly adding a weight has WCAG-AA implications; verify on each surface as those phases build (the AA-minimum constraint still holds project-wide).

### Reviewed Todos (not folded)
None — no pending todos matched this phase.

</deferred>

---

*Phase: 13-design-contract*
*Context gathered: 2026-06-03*
