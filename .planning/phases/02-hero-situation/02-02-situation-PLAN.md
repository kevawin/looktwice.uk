---
phase: 02-hero-situation
plan: 02
type: execute
wave: 2
depends_on:
  - "02-01"
files_modified:
  - index.html
  - css/components.css
  - css/layout.css
autonomous: true
requirements:
  - SITU-01
  - SITU-02
  - SITU-03
  - SITU-04
must_haves:
  truths:
    - "After scrolling past the hero, the visitor sees a Linen surface with a Midnight 'THE SITUATION' chip and the headline 'Sound familiar?'"
    - "Five numbered blocks 01–05 follow in client language: each has a Hot Pink number label, a bold title, and 1–3 body sentences"
    - "There are no icons, no card boxes, no borders, no shadows on the situation blocks (flat layout only)"
    - "On desktop ≥1025px the five blocks stagger across two columns (01/02/03 left; 04/05 offset down right) with --space-lg gap"
    - "On mobile <=640px the blocks render as a single column with --space-md between them"
  artifacts:
    - path: "index.html"
      provides: "Situation markup inside <section id=\"situation\"> — chip, H2, ordered list of five blocks each with H3 + body"
      contains: "class=\"situation\""
    - path: "css/components.css"
      provides: "Situation component classes (.situation, .situation__inner, .situation__header, .situation__headline, .situation__grid, .situation__block, .situation__number, .situation__title, .situation__body) + reusable .chip class"
      contains: ".situation {"
    - path: "css/layout.css"
      provides: "Situation grid: desktop staggered two-column, mobile single column"
      contains: ".situation__grid"
  key_links:
    - from: ".situation"
      to: "var(--color-linen)"
      via: "background property"
      pattern: "\\.situation\\s*\\{[^}]*background:\\s*var\\(--color-linen\\)"
    - from: ".situation__number"
      to: "var(--color-hot-pink)"
      via: "color property"
      pattern: "\\.situation__number[^}]*color:\\s*var\\(--color-hot-pink\\)"
    - from: ".chip"
      to: "var(--color-midnight)"
      via: "background property"
      pattern: "\\.chip[^}]*background:\\s*var\\(--color-midnight\\)"
---

<objective>
Fill the Phase 1 empty `<section id="situation">` anchor with the Linen self-recognition section: "THE SITUATION" Midnight chip, the H2 headline "Sound familiar?", and five numbered blocks 01–05 (Hot Pink number, bold title, body copy). Append situation component classes and a reusable `.chip` class to `css/components.css`. Append the staggered two-column grid (desktop) / single column (mobile) to `css/layout.css`. The five blocks ship as an `<ol role="list">` so screen readers announce semantic ordering. This plan does NOT wire scroll reveal — Plan 03 lands the IntersectionObserver and adds the `.reveal` class wiring.

Purpose: Self-identification beat. The visitor scrolls from the hero, hits one of five recognisable client situations, and recognises themselves. This is the section that converts a warm referral from "interesting" to "she gets it".

Output: A live situation section on the Cloudflare Pages preview that satisfies SITU-01 through SITU-04, ships all situation block copy verbatim from D-04 / D-05, and consumes only existing tokens. SITU-05 (scroll reveal) lands in Plan 03.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

@.planning/phases/02-hero-situation/02-CONTEXT.md
@.planning/phases/02-hero-situation/02-UI-SPEC.md
@.planning/phases/02-hero-situation/02-01-hero-PLAN.md
@.planning/seeds/CONTENT-DRAFT.md
@.planning/seeds/HOMEPAGE-SPEC.md
@.planning/seeds/DESIGN-TOKENS.md

@index.html
@css/tokens.css
@css/base.css
@css/layout.css
@css/components.css
@css/animations.css

<interfaces>
Tokens from `css/tokens.css` (do not redeclare):
- Colour: `--color-linen`, `--color-midnight`, `--color-hot-pink`, `--color-true-white`
- Type: `--text-headline`, `--text-title`, `--text-body`, `--text-label`; `--lh-headline`, `--lh-title`, `--lh-body`, `--lh-label`; `--ls-headline`, `--ls-label`
- Spacing: `--space-xs` (8px), `--space-sm` (16px), `--space-md` (32px), `--space-lg` (64px), `--space-xl` (96px), `--space-section` (120px)
- Radius: `--radius-pill` (999px) for chip
- Measure: `--measure` (65ch) for body cap

Phase 1 conventions:
- BEM-ish class naming: extend with `.situation`, `.situation__block`, `.situation__number`, etc.
- `.chip` is a NEW reusable component class (not scoped to situation) — Phase 3 will reuse it on the WORK and HOW I WORK chips. Per UI-SPEC §Component Inventory note.
- Five-CSS-file split: append only.
- Token consumption only via `var(...)`.

Existing situation anchor (line 54 of `index.html`):
```html
<section id="situation"></section>
```
Phase 2 fills this body. Surrounding shell untouched.

Phase 1 base CSS already provides `ol[role='list'] { list-style: none; }` (base.css line 33) — so the `<ol>` will not render bullets when `role="list"` is set.

Phase 2 Plan 01 (preceding) already imported the hero design language. This plan is a separate visual surface (Linen vs Hot Pink) and a separate section anchor. They share `index.html` (different sections) and `css/components.css` (append-only). Sequence ensures Plan 01's CSS appends are committed before this plan reads/appends to the same files.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fill situation markup in index.html</name>
  <files>index.html</files>
  <read_first>
    - index.html (current empty `<section id="situation">` at line 54; verify Plan 01 hero markup is in place above it)
    - .planning/phases/02-hero-situation/02-UI-SPEC.md (Component Inventory — situation classes; Copywriting Contract — Situation table for verbatim copy of all five blocks)
    - .planning/phases/02-hero-situation/02-CONTEXT.md (D-04 headline, D-05 verbatim block copy, D-06 chip + headline render)
  </read_first>
  <action>
Replace the empty `<section id="situation"></section>` (line 54 in the current `index.html`; it will still be at the same logical position after Plan 01 fills the hero above it) with the following markup. Do not modify any other part of `index.html`.

```html
<section id="situation" class="situation">
  <div class="situation__inner">
    <header class="situation__header">
      <span class="chip">THE SITUATION</span>
      <h2 class="situation__headline">Sound familiar?</h2>
    </header>

    <ol class="situation__grid" role="list">
      <li class="situation__block">
        <span class="situation__number" aria-hidden="true">01</span>
        <h3 class="situation__title">The brand caught up with the growth</h3>
        <p class="situation__body">The business has grown faster than the brand. Something feels off, the website, the pitch, the way the team talks about what you do, but nobody can name it precisely. You're thinking about a rebrand, or entering a new market, and you need the foundations to be solid before you do.</p>
      </li>

      <li class="situation__block">
        <span class="situation__number" aria-hidden="true">02</span>
        <h3 class="situation__title">The strategy exists on paper</h3>
        <p class="situation__body">You inherited a brand strategy you didn't build and don't believe in. It lives in a deck someone made two years ago. It's not driving decisions, it's not changing behaviour, and nobody references it unless they have to.</p>
      </li>

      <li class="situation__block">
        <span class="situation__number" aria-hidden="true">03</span>
        <h3 class="situation__title">The experience is good. The story isn't.</h3>
        <p class="situation__body">You've built something that works. The operations are solid, the product is strong. But the marketing isn't sticking, the premium pricing isn't landing, and the brand doesn't reflect what you actually deliver. The gap is between what's true and what people think.</p>
      </li>

      <li class="situation__block">
        <span class="situation__number" aria-hidden="true">04</span>
        <h3 class="situation__title">The rebrand landed. Nothing changed.</h3>
        <p class="situation__body">Six months ago, you launched a new brand. It looks better. But the experience hasn't caught up, the way things feel to customers, the way the team talks about the business, the day-to-day reality. The new brand is on the assets. It's not in the organisation.</p>
      </li>

      <li class="situation__block">
        <span class="situation__number" aria-hidden="true">05</span>
        <h3 class="situation__title">You need senior firepower without a full hire.</h3>
        <p class="situation__body">You're running a project that spans brand, CX, and comms, and you need someone who can work at strategy level without becoming a permanent fixture. A senior thinking partner for the duration, not an account manager with a team behind them.</p>
      </li>
    </ol>
  </div>
</section>
```

Implementation notes:
- All five block copies are LOCKED verbatim from UI-SPEC §Copywriting Contract (which inherits from D-05 / CONTENT-DRAFT.md). Do not paraphrase. Do not add `[DRAFT]` markers. Kris refines on the live preview.
- Block numbers 01..05 are visible content inside `<span class="situation__number">`. Marked `aria-hidden="true"` because the `<ol>` already conveys order to screen readers — preventing double-announcement ("one… one…").
- Block titles are H3. Section headline is H2. Hero headline (Plan 01) is H1. No level skips (forward-compatible with A11Y-01 in Phase 5).
- Block 03, 04, 05 titles end with periods preserved verbatim from CONTENT-DRAFT. Block 01 and 02 titles do not — preserve verbatim.
- No em-dashes anywhere (`grep '—'` should return zero matches across the entire file).
- No icons. No `<svg>` inside the section. No `<i>` or icon classes.
- The reusable `.chip` class lands here for the first time. Plan 02-03 (situation reveal observer) does not edit it. Phase 3 will reuse `.chip` on `WORK` and `HOW I WORK` chips.
  </action>
  <verify>
    <automated>
grep -q '<section id="situation" class="situation">' index.html && grep -q '<span class="chip">THE SITUATION</span>' index.html && grep -q '<h2 class="situation__headline">Sound familiar?</h2>' index.html && grep -q '<ol class="situation__grid" role="list">' index.html && [ "$(grep -c 'situation__block' index.html)" -ge 5 ] && [ "$(grep -c '<h3 class="situation__title">' index.html)" -eq 5 ] && grep -q 'You need senior firepower without a full hire.' index.html && ! grep -q '—' index.html && ! grep -q '\[DRAFT\]' index.html && echo "OK"
    </automated>
  </verify>
  <done>
    - `<section id="situation" class="situation">` filled with `.situation__inner > .situation__header + .situation__grid`.
    - `.chip` text reads `THE SITUATION` exactly.
    - H2 reads `Sound familiar?` exactly.
    - Exactly 5 `<li class="situation__block">` items in document order 01..05.
    - Each block has exactly one `<span class="situation__number">`, one `<h3 class="situation__title">`, one `<p class="situation__body">`.
    - All block body copy matches the strings in UI-SPEC §Copywriting Contract verbatim (visual diff if checking manually).
    - No em-dash characters in `index.html`.
    - No `[DRAFT]` / `[DECIDE]` / `[CONFIRM]` markers in rendered HTML.
    - `<h1>` count remains 1 (still in hero); `<h2>` count is now 1 (situation); `<h3>` count is now 5 (one per block).
  </done>
</task>

<task type="auto">
  <name>Task 2: Append situation component CSS + reusable .chip to css/components.css</name>
  <files>css/components.css</files>
  <read_first>
    - css/components.css (verify Plan 01 hero CSS is appended; this plan appends below the hero block)
    - css/tokens.css (token names)
    - .planning/phases/02-hero-situation/02-UI-SPEC.md (Component Inventory; Color; Typography; Layout §Situation)
    - .planning/seeds/DESIGN-TOKENS.md (Chips spec: padding 5px 14px, --radius-pill, --text-label, weight 400, uppercase)
  </read_first>
  <action>
Append the following CSS block to the END of `css/components.css` (i.e. AFTER the Phase 2 hero block that Plan 01 added). Do not modify any earlier rules.

```css

/* ============================================================
   Phase 2 — Reusable .chip component (DESIGN-TOKENS Chips spec).
   Phase 2 ships it for "THE SITUATION".
   Phase 3 reuses for "WORK" and "HOW I WORK".
   ============================================================ */

.chip {
  display: inline-block;
  background: var(--color-midnight);
  color: var(--color-linen);
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: var(--text-label);
  letter-spacing: var(--ls-label);
  line-height: var(--lh-label);
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: var(--radius-pill);
}

/* ============================================================
   Phase 2 — Situation (#situation) component
   SITU-01 through SITU-04. Linen surface, no boxes/shadows/icons/borders.
   ============================================================ */

.situation {
  background: var(--color-linen);
  color: var(--color-midnight);
  padding-block: var(--space-section);
  padding-inline: calc(var(--space-lg) * 0.75); /* matches nav + hero gutter (48px) */
}

.situation__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-block-end: var(--space-lg);
}

.situation__headline {
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: var(--text-headline);
  line-height: var(--lh-headline);
  letter-spacing: var(--ls-headline);
  color: var(--color-midnight);
  margin: 0;
}

/* The grid + stagger layout lives in css/layout.css. */

.situation__block {
  /* No card box. No border. No shadow. No background. Flat layout per SITU-02. */
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.situation__number {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: var(--text-label);
  letter-spacing: var(--ls-label);
  line-height: var(--lh-label);
  text-transform: uppercase;
  color: var(--color-hot-pink);
  display: inline-block;
}

.situation__title {
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: var(--text-title);
  line-height: var(--lh-title);
  color: var(--color-midnight);
  margin: 0;
}

.situation__body {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-midnight);
  max-width: var(--measure);
  margin-block-start: var(--space-xs);
  margin-block-end: 0;
}

/* Mobile: collapse situation section padding from --space-section (120px) to --space-xl (96px).
   This is forward-compatible with RESP-02 (Phase 5 verifies). */
@media (max-width: 640px) {
  .situation {
    padding-block: var(--space-xl);
  }
}
```

Implementation notes:
- `.chip` lands BEFORE `.situation` in this append block so the cascade is clean and the chip is reusable in Phase 3 without re-ordering.
- No `border`, no `box-shadow`, no `background-color` (other than transparent inherit) on `.situation__block`. SITU-02 design ban — verify the rule contains exactly the four CSS properties listed (`display`, `flex-direction`, `gap`, plus comments).
- No icons in this file (no `::before { content: '✓' }` or similar).
- Padding scale: `--space-section` desktop, `--space-xl` mobile. Forward-compatible with RESP-02.
- Body `max-width: var(--measure)` enforces the 65ch reading width per SITU-02.
- The grid layout (two-column desktop stagger, single column mobile) lives in `css/layout.css` per the project's five-file split discipline. This file owns component appearance only.
  </action>
  <verify>
    <automated>
grep -q '\.chip\s*{' css/components.css && grep -q 'background: var(--color-midnight);' css/components.css && grep -q '\.situation\s*{' css/components.css && grep -q 'background: var(--color-linen);' css/components.css && grep -q '\.situation__number' css/components.css && grep -q 'color: var(--color-hot-pink);' css/components.css && grep -q '\.situation__title' css/components.css && grep -q '\.situation__body' css/components.css && grep -q 'max-width: var(--measure);' css/components.css && ! grep -E '\.situation__block\s*\{[^}]*(border|box-shadow|background)' css/components.css && grep -q '@media (max-width: 640px)' css/components.css && echo "OK"
    </automated>
  </verify>
  <done>
    - `.chip` declared with Midnight bg, Linen text, padding `5px 14px`, `var(--radius-pill)`.
    - `.situation` has Linen background, `padding-block: var(--space-section)`.
    - `.situation__number` uses Hot Pink colour with Label typography.
    - `.situation__title` is H3-styled with Title typography (700 weight, --text-title).
    - `.situation__body` capped at `var(--measure)`.
    - `.situation__block` has NO border, NO box-shadow, NO background-color (regex above must fail = pass).
    - Mobile padding override at `(max-width: 640px)` to `--space-xl`.
    - No `font-weight: 500` anywhere in the appended block.
  </done>
</task>

<task type="auto">
  <name>Task 3: Append situation grid layout (staggered desktop / single column mobile) to css/layout.css</name>
  <files>css/layout.css</files>
  <read_first>
    - css/layout.css (verify Plan 01 hero layout is in place; this plan appends below)
    - .planning/phases/02-hero-situation/02-UI-SPEC.md (Layout §Situation — desktop two-column staggered, items 01/02/03 left, 04/05 right offset down ~1 item height; mobile single column with --space-md gap)
  </read_first>
  <action>
Append the following block to the END of `css/layout.css`. Do not modify earlier rules.

```css

/* ============================================================
   Phase 2 — Situation layout (SITU-03, SITU-04).
   Desktop (>=1025px): two-column grid, column 2 offset down ~1 item.
   Tablet  (641–1024px): two-column grid, no offset (cleaner at narrower widths).
   Mobile  (<=640px): single column, --space-md gap.
   Implementation: CSS Grid using grid-row-start to place items 04/05 in column 2 with a leading empty cell that creates the visual offset.
   ============================================================ */

.situation__inner {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
}

.situation__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 641px) {
  .situation__grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
  }

  /* Tablet baseline: alternate items into columns naturally — items 01,03,05 left; 02,04 right.
     Desktop will override with explicit row placement. */
  .situation__block:nth-child(1) { grid-column: 1; grid-row: 1; }
  .situation__block:nth-child(2) { grid-column: 2; grid-row: 1; }
  .situation__block:nth-child(3) { grid-column: 1; grid-row: 2; }
  .situation__block:nth-child(4) { grid-column: 2; grid-row: 2; }
  .situation__block:nth-child(5) { grid-column: 1; grid-row: 3; }
}

@media (min-width: 1025px) {
  /* Desktop staggered layout per SITU-03 / D-12.
     Column 1 holds items 01, 02, 03 stacked.
     Column 2 holds items 04, 05 — offset down by approximately one item height (grid-row-start: 2).
     This creates the asymmetric visual rhythm without absolute positioning. */
  .situation__block:nth-child(1) { grid-column: 1; grid-row: 1; }
  .situation__block:nth-child(2) { grid-column: 1; grid-row: 2; }
  .situation__block:nth-child(3) { grid-column: 1; grid-row: 3; }
  .situation__block:nth-child(4) { grid-column: 2; grid-row: 2; }
  .situation__block:nth-child(5) { grid-column: 2; grid-row: 3; }
}
```

Implementation notes:
- The desktop offset is achieved by leaving `grid-row: 1` of column 2 empty — block 04 starts at row 2, which is approximately one item-height down from block 01 (matches D-12: "offset down ~1 item height").
- The tablet rule (641–1024px) gives a clean alternating grid as a graceful midpoint. The desktop rule overrides only at >=1025px.
- All grid placement is CSS Grid — NO flexbox column-count tricks, NO float layouts, NO absolute positioning of blocks.
- The `<ol>` having `role="list"` already strips bullet styling via `base.css` line 33 (Andy Bell reset). Setting `list-style: none` here is defensive and explicit for `.situation__grid`.
- Do not add `align-items` or `justify-items` — defaults (`stretch` / `start`) are correct.
- Do not add column rules / hr / borders between blocks (SITU-02).
  </action>
  <verify>
    <automated>
grep -q '\.situation__inner' css/layout.css && grep -q '\.situation__grid' css/layout.css && grep -q 'grid-template-columns: 1fr;' css/layout.css && grep -q '@media (min-width: 641px)' css/layout.css && grep -q '@media (min-width: 1025px)' css/layout.css && grep -q '\.situation__block:nth-child(4) { grid-column: 2; grid-row: 2; }' css/layout.css && grep -q '\.situation__block:nth-child(5) { grid-column: 2; grid-row: 3; }' css/layout.css && echo "OK"
    </automated>
  </verify>
  <done>
    - `.situation__inner` max-width 1280px, centred.
    - `.situation__grid` is a CSS Grid: 1 column at <=640px, 2 columns ≥641px, with explicit row placement at ≥1025px to create the staggered "01/02/03 left; 04/05 offset right" rhythm per D-12.
    - Block 04 starts at column 2 / row 2 (skipping row 1) — visually offset down one item height.
    - Block 05 lives at column 2 / row 3.
    - Mobile gap is `--space-md`; desktop gap is `--space-lg`.
    - File still loads in cascade order; no `@import` introduced.
  </done>
</task>

</tasks>

<verification>
After all three tasks complete:

1. **Markup integrity** — `xmllint --html --noout index.html 2>&1 | grep -i error || echo "no errors"` returns "no errors".
2. **Heading order** — `grep -E '<h[1-6]' index.html` shows H1 (hero) → H2 (situation) → H3 (5 block titles), no skipped levels.
3. **Verbatim copy** — `grep -c "Sound familiar?" index.html` returns 1; `grep -c "THE SITUATION" index.html` returns 1; all five block titles present.
4. **No icons** — `grep -E '<svg|<i class' index.html` returns nothing inside the situation section; `grep -E "::before.*content" css/components.css` shows no decorative icon insertion on situation classes.
5. **Flat blocks** — search for `border|box-shadow|background` rules INSIDE `.situation__block { ... }` block scope; should return zero (the block is empty styling-wise except for `display`, `flex-direction`, `gap`).
6. **Token usage** — `grep -E '#[0-9a-fA-F]{3,6}' css/components.css` returns no hex colour matches.
7. **Visual check (manual on preview after deploy)**:
   - Open https://new-site.looktwice-uk.pages.dev — scroll past hero, Linen surface appears.
   - "THE SITUATION" pill chip is dark Midnight with Linen text, uppercase, ~5px/14px padding.
   - "Sound familiar?" headline in Midnight Epilogue 700, ~Headline scale.
   - Five blocks visible below. Each: small Hot Pink "01" / "02" / "03" / "04" / "05" label, then bold black title, then Body paragraph capped at ~65ch.
   - At desktop ≥1025px: blocks 01/02/03 stack in left column; blocks 04/05 stack in right column starting one item-height lower than block 01 (visible offset).
   - At tablet 768px: blocks alternate left/right naturally without offset.
   - At mobile 375px: single column, blocks stacked top-to-bottom with `--space-md` (32px) gap.
   - No card shadows, no borders, no boxes around any block.
   - Body copy never exceeds the measure cap on any breakpoint.
8. **Reveal NOT yet wired** — `grep '\.reveal' index.html | grep situation` returns nothing yet (Plan 03 wires this).
</verification>

<success_criteria>
- SITU-01: `.situation` has Linen background, `padding-block: var(--space-section)` (desktop) collapsing to `--space-xl` at ≤640px; chip "THE SITUATION" Midnight + Linen text rendered; H2 "Sound familiar?" rendered.
- SITU-02: Five blocks, each with Hot Pink Label number, bold Title (H3) name, body paragraph capped at `var(--measure)`. NO icons, NO card boxes, NO borders, NO shadows on `.situation__block` (verified by inspecting computed styles in browser dev-tools).
- SITU-03: At ≥1025px, blocks 01/02/03 stack in column 1; blocks 04/05 stack in column 2 starting at grid-row 2 (visibly offset down by ~1 item height); column gap `--space-lg`.
- SITU-04: At ≤640px, single column with `gap: var(--space-md)` between blocks.
</success_criteria>

<output>
After completion, create `.planning/phases/02-hero-situation/02-02-SUMMARY.md` documenting:
- Files modified
- Token usage audit (which new tokens this plan introduced into situation/chip surfaces)
- The reusable `.chip` class is now available for Phase 3 (note for downstream)
- Any deviations from UI-SPEC and why (e.g. exact gap on tablet vs desktop)
- Visual verification: screenshot at desktop showing the staggered offset (block 04 starts at column 2, row 2 — clearly lower than block 01)
- Forward note: Plan 03 will add `.reveal` + `data-reveal-index` to chip, headline, and the five blocks; this plan deliberately ships them WITHOUT reveal so the section is verifiable on its own
</output>
