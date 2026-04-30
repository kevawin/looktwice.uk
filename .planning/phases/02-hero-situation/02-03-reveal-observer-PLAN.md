---
phase: 02-hero-situation
plan: 03
type: execute
wave: 3
depends_on:
  - "02-02"
files_modified:
  - index.html
  - js/main.js
autonomous: true
requirements:
  - SITU-05
must_haves:
  truths:
    - "When the visitor scrolls into the situation section, the chip and the headline reveal first (opacity 0→1, translateY 16px→0, 400ms)"
    - "Then the five blocks reveal in order with 80ms stagger between items (block 01 at 80ms, block 05 at 400ms)"
    - "Once revealed, blocks stay visible — no re-trigger on scroll-back (one-shot per element via observer.unobserve)"
    - "Visitors with prefers-reduced-motion: reduce see opacity-only fade (no transform)"
    - "The hero remains visible on load (no .reveal class anywhere on hero)"
  artifacts:
    - path: "index.html"
      provides: ".reveal class + data-reveal-index attribute on situation chip, headline, and five blocks"
      contains: "data-reveal-index"
    - path: "js/main.js"
      provides: "Generic IntersectionObserver that watches .reveal elements, computes transition-delay = data-reveal-index × (data-reveal-step || 80) ms, toggles .visible on intersection, and unobserves after first reveal"
      contains: "IntersectionObserver"
  key_links:
    - from: "js/main.js IntersectionObserver"
      to: ".reveal elements in DOM"
      via: "document.querySelectorAll('.reveal')"
      pattern: "querySelectorAll\\(['\"]\\.reveal['\"]\\)"
    - from: ".reveal element"
      to: "transition-delay computed value"
      via: "data-reveal-index attribute consumed by JS"
      pattern: "data-reveal-index"
---

<objective>
Land the generic `.reveal` IntersectionObserver in `js/main.js` and wire the situation chip, headline, and five blocks with `class="reveal"` + `data-reveal-index="..."` in `index.html`. The observer is the foundation for every later phase's scroll animation — Phase 3 (work, services with 100ms stagger) and Phase 4 (contact reveals) reuse this exact code. Phase 2 does not create per-section observers; one generic observer rules all `.reveal` elements site-wide. The stagger step is parametric (`data-reveal-step` attribute, defaulting to 80ms) so Phase 3 services (100ms) and any future override land without JS changes.

Purpose: The situation section's value is in recognition — but the section feels static if the five blocks all sit there at once. Staggered reveal as the visitor scrolls in adds a tempo of recognition: chip + headline appear, then each block lands one beat later, drawing the eye through 01..05.

Output: A live preview where scrolling into the situation section triggers a 80ms-staggered reveal of the chip → headline → blocks 01..05. Reduced-motion users get opacity-only fade. Hero remains static. Wave 3 of Phase 2.
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
@.planning/phases/02-hero-situation/02-02-situation-PLAN.md
@.planning/seeds/HOMEPAGE-SPEC.md
@.planning/seeds/ARCHITECTURE.md

@index.html
@css/animations.css
@js/main.js

<interfaces>
Existing `.reveal` CSS rules (already in `css/animations.css` from Phase 1; do not edit):
```css
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: var(--transition-reveal); /* opacity + transform 400ms cubic-bezier(0.16, 1, 0.3, 1) */
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    transform: none;
    transition: opacity 400ms ease-out;
  }
}
```

Existing `js/main.js` already contains:
- Nav scroll-state toggle (passive scroll listener)
- Mobile hamburger overlay open/close + Escape key handler

Phase 2 appends:
- A generic IntersectionObserver block — separate IIFE, separate event-loop boundary, does not interfere with existing nav code.

Stagger contract (UI-SPEC §Interaction & Motion table — locked from D-13):
| Element                | data-reveal-index | computed delay (step=80ms default) |
|------------------------|-------------------|------------------------------------|
| `.situation__chip`     | 0                 | 0ms                                |
| `.situation__headline` | 0                 | 0ms                                |
| Block 01               | 1                 | 80ms                               |
| Block 02               | 2                 | 160ms                              |
| Block 03               | 3                 | 240ms                              |
| Block 04               | 4                 | 320ms                              |
| Block 05               | 5                 | 400ms                              |

IntersectionObserver config (D-13):
- threshold: 0.2
- rootMargin: "0px 0px -10% 0px" (small bottom inset so reveal fires comfortably inside the viewport, not the moment a single pixel touches; planner judgement, within UI-SPEC tolerance)
- One-shot: `observer.unobserve(el)` after class toggled.

Per-element step override (parametric for Phase 3 reuse):
- Default step is 80ms (Phase 2 situation).
- Phase 3 services (HOMEPAGE-SPEC §Animation Cheatsheet — 100ms stagger) will set `data-reveal-step="100"` on each service item.
- Formula: delay = index × (parseInt(dataset.revealStep) || 80) ms.
- Phase 2 elements do NOT need to set `data-reveal-step`; the 80ms default applies.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add .reveal class + data-reveal-index to situation elements in index.html</name>
  <files>index.html</files>
  <read_first>
    - index.html (verify Plan 02-02 situation markup is in place: chip, headline, five blocks)
    - .planning/phases/02-hero-situation/02-UI-SPEC.md (Interaction & Motion table — index values for each element)
    - .planning/phases/02-hero-situation/02-CONTEXT.md (D-13 stagger spec; D-14 generic observer; D-16 hero never reveals)
  </read_first>
  <action>
Modify three classes of element inside `<section id="situation">`. Do NOT add `.reveal` to the hero section, the nav, the footer, or any other element. The hero MUST remain free of `.reveal` per D-16 / HERO-06.

**Edit 1 — chip:** change
```html
<span class="chip">THE SITUATION</span>
```
to
```html
<span class="chip reveal" data-reveal-index="0">THE SITUATION</span>
```

**Edit 2 — headline:** change
```html
<h2 class="situation__headline">Sound familiar?</h2>
```
to
```html
<h2 class="situation__headline reveal" data-reveal-index="0">Sound familiar?</h2>
```

**Edit 3 — each of the five blocks:** change
```html
<li class="situation__block">
```
to (block 01)
```html
<li class="situation__block reveal" data-reveal-index="1">
```
…and continue for blocks 02..05 with `data-reveal-index="2"`, `"3"`, `"4"`, `"5"` respectively.

Final form per block (block 01 example):
```html
<li class="situation__block reveal" data-reveal-index="1">
  <span class="situation__number" aria-hidden="true">01</span>
  <h3 class="situation__title">The brand caught up with the growth</h3>
  <p class="situation__body">…</p>
</li>
```

Implementation notes:
- Do not touch the hero markup.
- Do not change any block copy (titles, body, numbers).
- Indices for chip and headline are BOTH `0` — they reveal as a single conceptual "header" beat (UI-SPEC: "Section headline + label chip fade in first").
- Indices for blocks are `1` through `5`, mapping to 80ms × index = 80, 160, 240, 320, 400ms delays at the default step.
- The observer in Task 2 reads `data-reveal-index` and `data-reveal-step` (default 80ms) and writes `transition-delay: ${i * step}ms` inline.
- Phase 2 elements DO NOT need `data-reveal-step` — the 80ms default applies. Phase 3 services will add `data-reveal-step="100"` to each item.
  </action>
  <verify>
    <automated>
grep -q 'class="chip reveal" data-reveal-index="0">THE SITUATION' index.html && grep -q 'class="situation__headline reveal" data-reveal-index="0">Sound familiar?' index.html && grep -q 'class="situation__block reveal" data-reveal-index="1"' index.html && grep -q 'class="situation__block reveal" data-reveal-index="2"' index.html && grep -q 'class="situation__block reveal" data-reveal-index="3"' index.html && grep -q 'class="situation__block reveal" data-reveal-index="4"' index.html && grep -q 'class="situation__block reveal" data-reveal-index="5"' index.html && [ "$(grep -c 'data-reveal-index' index.html)" -eq 7 ] && ! grep -E 'class="hero[^"]*reveal' index.html && ! grep -E 'class="hero__[a-z-]+ reveal' index.html && echo "OK"
    </automated>
  </verify>
  <done>
    - Exactly 7 elements carry `data-reveal-index`: chip (0), headline (0), block 01 (1), block 02 (2), block 03 (3), block 04 (4), block 05 (5).
    - All 7 elements also carry the `reveal` class.
    - The hero (`.hero`, `.hero__headline`, `.hero__subhead`, `.hero__cutout--main`, `.hero__cutout--support`, `.hero__ctas`, `.btn--primary`, `.btn--ghost-on-dark`) carries NO `reveal` class anywhere (D-16, HERO-06).
    - `<h1>` count still 1; H2 count 1; H3 count 5; total `reveal` class count is 7.
  </done>
</task>

<task type="auto">
  <name>Task 2: Append generic IntersectionObserver block to js/main.js</name>
  <files>js/main.js</files>
  <read_first>
    - js/main.js (existing nav scroll-state + hamburger overlay code; append below, do not modify)
    - css/animations.css (existing `.reveal` CSS — observer toggles `.visible` to trigger the existing transition)
    - .planning/phases/02-hero-situation/02-UI-SPEC.md (Interaction & Motion §Reveal animation contract — threshold 0.2, one-shot, stagger formula)
    - .planning/phases/02-hero-situation/02-CONTEXT.md (D-13, D-14, D-15)
  </read_first>
  <action>
Append the following block to the END of `js/main.js`. Do NOT modify the existing nav or hamburger code blocks above.

```javascript

// ============================================================
// Generic .reveal IntersectionObserver (Phase 2 — D-14, D-15).
// One observer rules all .reveal elements site-wide. Phase 3 and
// Phase 4 add .reveal + data-reveal-index to their elements; no
// new JS needed.
// Stagger formula: delay = index × step, where step defaults to
// 80ms but can be overridden per element via data-reveal-step
// (e.g. Phase 3 services use data-reveal-step="100").
// One-shot: observer.unobserve(el) after first reveal (D-15).
// ============================================================

(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length === 0) return;

  // Set per-element transition-delay from data-reveal-index × data-reveal-step.
  // Done here once at boot — cheaper than reading the dataset on every intersect.
  revealEls.forEach((el) => {
    const i = parseInt(el.dataset.revealIndex || '0', 10);
    const step = parseInt(el.dataset.revealStep || '80', 10);
    el.style.transitionDelay = `${i * step}ms`;
  });

  // Graceful fallback for browsers without IntersectionObserver (very rare in 2026,
  // but covers older WebViews). Reveal everything immediately so content is never hidden.
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // one-shot per D-15
        }
      });
    },
    {
      threshold: 0.2,        // D-13: fires when 20% of the element is in view
      rootMargin: '0px 0px -10% 0px', // small bottom inset so reveal fires comfortably inside the viewport
    }
  );

  revealEls.forEach((el) => observer.observe(el));
})();
```

Implementation notes:
- Wrap in an IIFE so the local `revealEls` and `observer` constants don't pollute the module/global scope. Existing nav code uses top-level `const` (e.g. `const nav`) — keeping the new block scoped avoids accidental name collisions.
- `data-reveal-index` and `data-reveal-step` are read ONCE at boot and written to inline `style.transitionDelay`. The CSS in `animations.css` already declares `transition: var(--transition-reveal)` on `.reveal`; this just adds the per-element delay before the visitor scrolls.
- Default step is 80ms (Phase 2 situation). Phase 3 services will set `data-reveal-step="100"` on each item; observer needs no code change.
- `observer.unobserve(el)` after toggling makes this strictly one-shot. No re-trigger on scroll-back (D-15).
- The `prefers-reduced-motion` reduced-motion fallback is handled entirely by the existing CSS in `css/animations.css` — the observer still fires, the class still toggles, but the transition strips the transform. No JS branching needed for reduced motion.
- The `IntersectionObserver in window` fallback reveals everything if the API is missing. This is graceful degradation — better than hidden content if a vintage browser arrives.
- This observer is INTENTIONALLY generic. It does not care about which section an element belongs to. Phase 3 will add `.reveal` to interrupt + work + services elements; Phase 4 will add it to contact. No code change needed in this file when those phases ship.
  </action>
  <verify>
    <automated>
grep -q 'IntersectionObserver' js/main.js && grep -q 'querySelectorAll(.\\.reveal.)' js/main.js && grep -q 'threshold: 0.2' js/main.js && grep -q 'unobserve' js/main.js && grep -q 'dataset.revealIndex' js/main.js && grep -q 'dataset.revealStep' js/main.js && grep -q 'i \* step' js/main.js && grep -q "if (!('IntersectionObserver' in window))" js/main.js && node --check js/main.js && echo "OK"
    </automated>
  </verify>
  <done>
    - `js/main.js` contains a new IIFE block with an `IntersectionObserver`.
    - The observer config uses `threshold: 0.2`.
    - `observer.unobserve(entry.target)` is called inside the intersection callback (one-shot).
    - `data-reveal-index` and `data-reveal-step` are read once at boot and applied as `style.transitionDelay = ${i * step}ms` (step defaults to 80).
    - A no-IntersectionObserver fallback adds `.visible` to all reveal elements.
    - File parses as valid JavaScript: `node --check js/main.js` exits 0.
    - Existing nav scroll-state and hamburger overlay code is unchanged (verify by diff against pre-edit `js/main.js`).
  </done>
</task>

</tasks>

<verification>
After both tasks complete:

1. **JS syntax** — `node --check js/main.js` exits 0.
2. **Markup integrity** — `xmllint --html --noout index.html 2>&1 | grep -i error || echo "no errors"` returns "no errors".
3. **Reveal element count** — `grep -c 'data-reveal-index' index.html` returns 7 (chip + headline + 5 blocks). Total `.reveal` class instances should also be 7 (`grep -oE 'class="[^"]*\breveal\b[^"]*"' index.html | wc -l` returns 7).
4. **Hero is reveal-free** — `grep -E 'class="(hero|hero__|btn--)[^"]*\breveal\b' index.html` returns nothing.
5. **Cascade unchanged** — `<link rel="stylesheet">` order in `<head>` is still tokens → base → layout → components → animations.
6. **Visual check (manual on preview after deploy)**:
   - Open https://new-site.looktwice-uk.pages.dev in a fresh tab — hero loads instantly, fully visible, no fade-in.
   - Scroll slowly down. As the situation section enters the viewport at ~20% threshold, the chip and "Sound familiar?" headline fade in together (translateY 16px→0, ~400ms).
   - Each block then fades in 80ms after the previous: visible cascade through 01 → 02 → 03 → 04 → 05. Total time from first block to last = 320ms (4 × 80ms).
   - Scroll back up past the situation section, then scroll back down. Blocks stay visible — no re-fade. (One-shot per D-15.)
   - DevTools console: no errors, no warnings.
   - In DevTools, set "Emulate CSS prefers-reduced-motion: reduce" via Rendering tab. Refresh. Scroll to situation. Reveal still happens but is opacity-only — no vertical movement.
7. **Performance** — open the Network tab. `js/main.js` loads with `defer`; no new HTTP requests added. The observer block is a few lines of additional JS; total `main.js` size should still be well under 5KB unminified.
8. **Idempotency** — refresh, scroll, refresh again. The reveal pattern is consistent. No race condition between hero load and observer init (the IIFE runs after `defer` script execution, after DOM is parsed; `.reveal` elements exist in the DOM at observer init time).
</verification>

<success_criteria>
- SITU-05: Situation chip + headline reveal first; blocks 01–05 stagger in 80ms apart; opacity 0→1, translateY 16px→0; 400ms ease-out-quart (cubic-bezier(0.16, 1, 0.3, 1)) via existing `--transition-reveal` token; threshold 0.2; one-shot per element; reduced-motion users get opacity-only fade (no transform) via the existing CSS guard in `css/animations.css`.
- The observer is generic and parametric (`data-reveal-step` overrides the default 80ms). Phase 3 services can ship `data-reveal-step="100"` and Phase 4 contact can use defaults — both without JS changes.
</success_criteria>

<output>
After completion, create `.planning/phases/02-hero-situation/02-03-SUMMARY.md` documenting:
- Files modified
- The seven elements wired with `.reveal` + `data-reveal-index` (chip 0, headline 0, blocks 1–5)
- Confirmation that hero carries no `.reveal` class
- IntersectionObserver config notes (threshold 0.2, rootMargin -10% bottom, one-shot)
- prefers-reduced-motion verification (chrome devtools rendering panel toggle was used / not used)
- Forward note for Phase 3 / Phase 4 planners: the observer in `js/main.js` reads two attributes — `data-reveal-index` (mandatory if you want a non-zero delay) and `data-reveal-step` (optional override of the 80ms default). Phase 3 services should set `data-reveal-step="100"` on each item (per HOMEPAGE-SPEC §Animation Cheatsheet). Phase 4 contact reveals can rely on the 80ms default. No JS changes needed in either phase.
</output>
