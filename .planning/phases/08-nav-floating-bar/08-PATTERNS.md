# Phase 8: Navigation & Floating Action Bar — Pattern Map

**Mapped:** 2026-06-01
**Files analysed:** 5 (index.html, css/components.css, css/layout.css, css/animations.css, js/main.js)
**Analogs found:** 5 / 5 (all files have strong in-codebase analogs)

---

## File Classification

| Modified File | Role | Data Flow | Closest Analog (in same file or sibling) | Match Quality |
|---|---|---|---|---|
| `index.html` (nav + overlay + sticky-tab markup) | template / markup shell | request-response | `index.html:313-315` `.sticky-tab` markup; `index.html:80-98` `.nav` markup | exact — same file, adjacent blocks |
| `css/components.css` (`.nav` block + `.sticky-tab` block) | component styles | request-response | `.sticky-tab` at `components.css:901-986`; `.btn` system at `components.css:171-225` | exact |
| `css/layout.css` (`.nav` layout block) | layout | request-response | `.nav` at `layout.css:13-37` | exact |
| `css/animations.css` (`.nav` + `.nav-overlay` transitions) | animation/motion | request-response | `.sticky-tab` reduced-motion guard at `components.css:966-986` | role-match |
| `js/main.js` (scroll-state toggle + hamburger block + `initStickyTab`) | behaviour / scroll-gate | event-driven | `initStickyTab` at `js/main.js:68-100` | exact |

---

## Pattern Assignments

### `index.html` — nav/header markup refactor + sticky-tab → floating bar

**Sections to edit:**
- Header nav: lines 80–98 (keep wordmark + `<ul>`; remove hamburger button lines 84–92)
- Overlay: lines 100–109 (remove entirely)
- Sticky-tab: lines 313–315 (replace `<a>` with new floating-bar block)

**Current header nav** (`index.html:80-98`):
```html
<nav class="nav" aria-label="Primary navigation">
  <a class="nav-wordmark" href="/" aria-label="Look Twice, home">
    <svg class="nav-logo" viewBox="0 0 691 321" role="img" aria-label="Look Twice"><use href="#logo"/></svg>
  </a>
  <button class="nav-hamburger"
          type="button"
          aria-expanded="false"
          aria-controls="nav-overlay"
          aria-label="Open menu">
    <span class="nav-hamburger-line" aria-hidden="true"></span>
    <span class="nav-hamburger-line" aria-hidden="true"></span>
    <span class="nav-hamburger-line" aria-hidden="true"></span>
  </button>
  <ul class="nav-links" role="list">
    <li><a class="nav-link" href="#work">WORK</a></li>
    <li><a class="nav-link" href="#approach">APPROACH</a></li>
    <li><a class="nav-link" href="#contact">CONTACT</a></li>
  </ul>
</nav>
```

**Remove:** hamburger `<button>` block (lines 84–92). Remove `#contact` list item (line 96). Reorder remaining items to Approach → Work (D-01).

**Current overlay markup** (`index.html:100-109`) — remove entirely:
```html
<div id="nav-overlay" class="nav-overlay" aria-hidden="true">
  <button class="nav-overlay-close"
          type="button"
          aria-label="Close menu">&times;</button>
  <nav aria-label="Mobile navigation">
    <a class="nav-overlay-link" href="#work">WORK</a>
    <a class="nav-overlay-link" href="#approach">APPROACH</a>
    <a class="nav-overlay-link" href="#contact">CONTACT</a>
  </nav>
</div>
```

**Current sticky-tab markup** (`index.html:313-315`) — replace with floating bar:
```html
<a class="sticky-tab" href="#contact" aria-label="Contact Kris">
  <span class="sticky-tab__label">Let's talk →</span>
</a>
```

**Floating bar markup pattern to build** (analog: `.sticky-tab` element, button pattern from existing `.nav-hamburger`, pill pattern from `.btn`):
```html
<div class="floating-bar" aria-hidden="true">
  <!-- CTA pill — gradient surface, bottom-left -->
  <a class="floating-bar__cta btn" href="#contact">Free 30-min chat</a>

  <!-- Nav cluster — bottom-right (desktop: always-visible pills; mobile: burger + slide-up pills) -->
  <div class="floating-bar__nav">
    <!-- Mobile burger (hidden on desktop) -->
    <button class="floating-bar__burger"
            type="button"
            aria-expanded="false"
            aria-label="Open menu">
      <span class="floating-bar__burger-line" aria-hidden="true"></span>
      <span class="floating-bar__burger-line" aria-hidden="true"></span>
    </button>
    <!-- Nav pills — always visible desktop; slide-up on mobile when burger open -->
    <ul class="floating-bar__pills" role="list">
      <li><a class="floating-bar__pill" href="#approach">Approach</a></li>
      <li><a class="floating-bar__pill" href="#work">Work</a></li>
    </ul>
  </div>
</div>
```

**Key notes:**
- `aria-hidden="true"` on the bar root is toggled by JS (same pattern as overlay `aria-hidden` toggle in current `openOverlay`/`closeOverlay`)
- Burger is 2 lines (NOT 3 like the deleted header hamburger)
- CTA label is "Free 30-min chat" (D-09), NOT "Let's talk →" (current sticky-tab)
- Cache-bust: bump `?v=5` → `?v=6` on all touched CSS/JS `<link>`/`<script>` tags

---

### `css/components.css` — `.nav` block refactor + `.sticky-tab` → `.floating-bar`

**Analog 1: current `.nav` block** (`components.css:8-83`) — what changes:

```css
/* REMOVE: position:fixed, top/left/right, z-index, background, color (lines 8-16) */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  color: var(--color-true-white);
}

/* REMOVE: .nav.scrolled rule entirely (lines 18-21) */
.nav.scrolled {
  background: var(--color-linen);
  color: var(--color-midnight);
}
```

After refactor, `.nav` becomes a normal in-flow element. Retain `.nav-wordmark`, `.nav-logo`, `.nav-link`, `.nav-link::after`, and the focus-ring overrides (lines 23-83) — they remain valid.

**Remove:** entire hamburger block (`components.css:85-112`):
```css
.nav-hamburger {
  display: none;
  min-width: 44px;
  min-height: 44px;
  padding: 10px;
  background: transparent;
  border: 0;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  color: inherit;
}

.nav-hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background: currentColor;
}

@media (max-width: 1024px) {
  .nav-hamburger {
    display: inline-flex;
  }
}
```

**Remove:** entire overlay block (`components.css:114-162`):
```css
.nav-overlay { ... }
.nav-overlay.open { ... }
.nav-overlay-close { ... }
.nav-overlay nav { ... }
.nav-overlay-link { ... }
```

**Analog 2: `.btn` system** (`components.css:171-225`) — copy pill sizing + per-surface focus-ring pattern for `.floating-bar__cta` and `.floating-bar__pill`:

```css
/* Pill base — copy from .btn */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: var(--text-label);
  letter-spacing: var(--ls-label);
  line-height: var(--lh-label);
  text-transform: uppercase;
  text-decoration: none;
  padding: 12px 28px;
  border-radius: var(--radius-pill);
  border: 2px solid currentColor;
  background: currentColor;
  cursor: pointer;
  transition: var(--transition-button);
}

/* Per-surface focus-ring pattern — copy from .btn--on-pink */
.btn--on-pink:focus-visible {
  outline: 2px solid var(--color-true-white);
  outline-offset: 4px;
}
/* ...and .btn--on-teal:focus-visible for white-surface pills */
.btn--on-teal:focus-visible {
  outline: 2px solid var(--color-true-white);
  outline-offset: 4px;
}
```

**Analog 3: `.sticky-tab` block** (`components.css:901-986`) — this is the seed of the floating bar. Full current block:

```css
/* components.css:901-986 */
.sticky-tab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 150;
  background: var(--gradient-brand);
  color: var(--color-true-white);
  padding: 14px 28px;
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: var(--text-label);
  letter-spacing: var(--ls-label);
  line-height: var(--lh-label);
  text-transform: uppercase;
  text-decoration: none;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-float);
  transform: translateX(120%);
  transition: var(--transition-tab), opacity 240ms ease-out;
}

.sticky-tab--visible {
  transform: translateX(0);
}

.sticky-tab--suppressed {
  opacity: 0;
  pointer-events: none;
  transform: translateX(120%);
}

.sticky-tab:hover {
  transform: translateX(0) scale(1.03);
  transition: transform 180ms ease-out;
}

.sticky-tab:focus-visible {
  outline: 2px solid var(--color-true-white);
  outline-offset: 3px;
}

@media (max-width: 640px) {
  .sticky-tab {
    bottom: 0; right: 0; left: 0;
    height: 52px;
    padding: 0;
    display: flex; align-items: center; justify-content: center;
    border-radius: 0;
    transform: translateY(100%);
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease-out;
  }
  .sticky-tab--visible  { transform: translateY(0); }
  .sticky-tab--suppressed { transform: translateY(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .sticky-tab {
    transform: none;
    opacity: 0;
    transition: opacity 200ms ease-out;
  }
  .sticky-tab--visible { transform: none; opacity: 1; }
  .sticky-tab--suppressed { transform: none; opacity: 0; }
  .sticky-tab:hover { transform: none; }
}
```

**What to copy for `.floating-bar`:**
- `position: fixed; bottom: 24px; z-index: 150` — same anchoring
- `background: var(--gradient-brand)` — CTA pill only (D-11)
- `box-shadow: var(--shadow-float)` — allowed here (only shadow in project)
- `transform: translateX(120%)` → `translateY(100%)` entrance pattern (slide in from bottom for the bar)
- `--visible` / `--suppressed` class toggle pattern (reuse exact class names or rename to `.floating-bar--visible` / `--suppressed`)
- Reduced-motion block: `opacity: 0` → `opacity: 1` without transform — copy exactly for the bar

**New CSS to build** (pattern derived from sticky-tab):
- `.floating-bar` — `position: fixed; bottom: 24px; left: 24px; right: 24px; z-index: 150; display: flex; justify-content: space-between; align-items: flex-end; pointer-events: none` (bar is a transparent row, individual children have `pointer-events: auto`)
- `.floating-bar__cta` — gradient pill (`background: var(--gradient-brand)`), white text, `padding: 14px 28px`, `border-radius: var(--radius-pill)`, white focus ring (D-16), slide-in from bottom-left
- `.floating-bar__nav` — flex column (mobile: burger + pills; desktop: pills only)
- `.floating-bar__burger` — circular, 44px min touch target, white bg / Hot Pink lines, `border-radius: 50%`, 2 lines that rotate to X on `[aria-expanded="true"]`
- `.floating-bar__pills` — flex column (mobile), flex row (desktop); hidden mobile until burger open, always visible desktop
- `.floating-bar__pill` — white bg / Hot Pink text, `border-radius: var(--radius-pill)`, Hot Pink/Midnight focus ring; copy `.btn` base sizing

---

### `css/layout.css` — `.nav` layout refactor

**Current `.nav` layout** (`layout.css:13-37`):
```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-sm) calc(var(--space-lg) * 0.75);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links li {
  display: flex;
  align-items: center;
}

@media (max-width: 1024px) {
  .nav-links { display: none; }
}
```

**Changes:**
- Keep `display: flex; align-items: center; justify-content: space-between; gap: var(--space-md)`.
- Padding: align to section gutter. All sections use `padding-inline: calc(var(--space-lg) * 0.75)` (= `48px`). The nav currently uses the same value — verify it matches `.hero` padding-inline (`components.css:241`: `calc(var(--space-lg) * 0.75)`) and lock both to `--gutter: calc(var(--space-lg) * 0.75)` or use the same expression.
- **Remove:** `@media (max-width: 1024px) { .nav-links { display: none; } }` — D-06 keeps links visible on mobile.
- No structural layout rules needed for `.floating-bar` positioning (handled via `position: fixed` in components.css).

---

### `css/animations.css` — nav transitions removal + floating-bar entrance

**Current nav transitions** (`animations.css:1-20`) — full file:
```css
/* Nav transition — 200ms ease-out on background-color and color */
.nav {
  transition: var(--transition-nav);
}

/* Mobile overlay slide — 280ms ease-out-quart on transform */
.nav-overlay {
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  .nav-overlay {
    transition: none;
  }
}
```

**Remove:**
- `.nav { transition: var(--transition-nav); }` — D-03 removes the scrolled colour fade; nav needs no transition once it is non-fixed and always-Linen.
- `.nav-overlay` transition block and its reduced-motion guard — D-04 removes the overlay entirely.

**After removal, animations.css retains only:** the word-roller block (lines 25-43).

**Floating bar transition** — add to animations.css (or components.css alongside the `.sticky-tab` block, consistent with current project pattern where component transitions live with their component in components.css):

```css
/* Floating bar — entrance slide + mobile pills slide-up.
   Matches sticky-tab transition timing: 300ms cubic-bezier(0.16,1,0.3,1). */
.floating-bar {
  transition: opacity 240ms ease-out;
}

/* Mobile pill slide-up */
.floating-bar__pills {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease-out;
}

/* Burger line rotation */
.floating-bar__burger-line {
  transition: transform 200ms ease-out, opacity 150ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .floating-bar,
  .floating-bar__pills,
  .floating-bar__burger-line {
    transition: opacity 200ms ease-out;
  }
}
```

---

### `js/main.js` — remove scroll-state + hamburger blocks; extend initStickyTab

**Block 1 — remove: scroll-state toggle** (`js/main.js:12-19`):
```js
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const nav = document.querySelector('.nav');
if (nav) {
  const toggleScrolled = () => nav.classList.toggle('scrolled', window.scrollY > 0);
  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });
}
```

**Note:** The `scrollRestoration` line at line 12 is standalone. If no other behaviour depends on it, remove it too — there is no other scroll-restoration consumer in the file.

**Block 2 — remove: hamburger overlay** (`js/main.js:25-59`):
```js
const hamburger = document.querySelector('.nav-hamburger');
const overlay = document.querySelector('.nav-overlay');
const closeBtn = document.querySelector('.nav-overlay-close');

function openOverlay() {
  overlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  overlay.setAttribute('aria-hidden', 'false');
}

function closeOverlay() {
  overlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.setAttribute('aria-hidden', 'true');
  hamburger.focus();
}

if (hamburger && overlay && closeBtn) {
  hamburger.addEventListener('click', () => {
    if (overlay.classList.contains('open')) closeOverlay();
    else openOverlay();
  });

  closeBtn.addEventListener('click', closeOverlay);

  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeOverlay);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeOverlay();
    }
  });
}
```

**Copy pattern for floating bar burger:** The `openOverlay`/`closeOverlay` pattern (aria-expanded toggle, focus return on close, Escape key listener, close on link click) is the direct model for the new `openBar`/`closeBar` functions. The responsibility for Escape + focus-return moves from the deleted overlay block to the new floating-bar burger block.

**Block 3 — keep and extend: `initStickyTab`** (`js/main.js:68-100`):
```js
(function initStickyTab() {
  const tabs = document.querySelectorAll('.sticky-tab');
  if (tabs.length === 0) return;

  const hero = document.querySelector('.hero');
  const getThreshold = () => (hero ? hero.offsetHeight : window.innerHeight);
  let threshold = getThreshold();

  window.addEventListener('resize', () => {
    threshold = getThreshold();
  }, { passive: true });

  const onScroll = () => {
    const past = window.scrollY > threshold;
    tabs.forEach((tab) => tab.classList.toggle('sticky-tab--visible', past));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const contact = document.querySelector('#contact');
  if (contact && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          tabs.forEach((tab) => tab.classList.toggle('sticky-tab--suppressed', entry.isIntersecting));
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(contact);
  }
})();
```

**Extension pattern:**
- Rename IIFE to `initFloatingBar` (or keep `initStickyTab` if `.sticky-tab` selector is retained)
- Change selector from `.sticky-tab` to `.floating-bar` (or keep as-is if the element keeps that class)
- Change class names from `sticky-tab--visible` / `sticky-tab--suppressed` to `floating-bar--visible` / `floating-bar--suppressed`
- `aria-hidden` toggle on the bar root: add `bar.setAttribute('aria-hidden', past ? 'false' : 'true')` inside `onScroll`
- Everything else — `getThreshold`, resize listener, IntersectionObserver on `#contact`, `{ threshold: 0.15 }` — copy verbatim (D-12, D-13)

**New: floating burger block** (pattern copied from removed hamburger block):
```js
(function initFloatingBurger() {
  const bar   = document.querySelector('.floating-bar');
  const burger = document.querySelector('.floating-bar__burger');
  const pills  = document.querySelector('.floating-bar__pills');
  if (!bar || !burger || !pills) return;

  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    pills.classList.add('floating-bar__pills--open');
    // move focus to first pill (D-15)
    const firstPill = pills.querySelector('a');
    if (firstPill) firstPill.focus();
  }

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    pills.classList.remove('floating-bar__pills--open');
    burger.focus();  // return focus (D-15)
  }

  burger.addEventListener('click', () => {
    if (burger.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  // Close on pill click
  pills.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Escape closes (D-15)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
})();
```

---

## Shared Patterns

### Gradient usage — one surface only
**Source:** `css/tokens.css:29-38`, `css/components.css:901-920`, `CLAUDE.md`
**Apply to:** `.floating-bar__cta` only — `background: var(--gradient-brand)`
```css
/* tokens.css:29 */
--gradient-brand: linear-gradient(
  135deg,
  var(--color-warm-amber)    0%,
  var(--color-signal-orange) 18%,
  var(--color-hot-pink)      36%,
  var(--color-hot-pink)      58%,
  var(--color-rich-purple)   76%,
  var(--color-cool-indigo)   88%,
  var(--color-deep-teal)     100%
);
```

### Per-surface focus-ring override
**Source:** `css/components.css:72-83` (nav links on pink hero) and `css/components.css:204-207` (btn--on-pink)
**Apply to:**
- `.floating-bar__cta` (gradient surface) → white `outline`
- `.floating-bar__pill` (white surface) → Hot Pink or Midnight `outline`
```css
/* Pattern from components.css:72-78 */
.nav .nav-link:focus-visible,
.nav .nav-wordmark:focus-visible {
  outline: 2px solid var(--color-true-white);
  outline-offset: 3px;
}

/* Pattern from components.css:204-207 */
.btn--on-pink:focus-visible {
  outline: 2px solid var(--color-true-white);
  outline-offset: 4px;
}
```

### Reduced-motion guard pattern
**Source:** `css/components.css:966-986`
**Apply to:** all floating bar transforms
```css
/* Strip transforms, keep opacity fade — project standard */
@media (prefers-reduced-motion: reduce) {
  .sticky-tab {
    transform: none;
    opacity: 0;
    transition: opacity 200ms ease-out;
  }
  .sticky-tab--visible { transform: none; opacity: 1; }
  .sticky-tab--suppressed { transform: none; opacity: 0; }
  .sticky-tab:hover { transform: none; }
}
```

### Section gutter value
**Source:** `css/components.css:241` (hero), `css/layout.css:18` (nav), multiple sections
**Apply to:** `.nav` padding + `.floating-bar` left/right offsets — all use `calc(var(--space-lg) * 0.75)` = `48px`. Use the same expression (not a hardcoded `48px`) so a future token change propagates.
```css
padding-inline: calc(var(--space-lg) * 0.75);
/* --space-lg: 64px → 48px */
```

### Cache-bust version bump
**Source:** `index.html:28-32` + line 317
**Apply to:** every `<link href="/css/...?v=5">` and `<script src="/js/main.js?v=5">` touched in this phase — bump to `?v=6`.
```html
<link rel="stylesheet" href="/css/tokens.css?v=5">    <!-- → v=6 if tokens.css touched -->
<link rel="stylesheet" href="/css/layout.css?v=5">    <!-- → v=6 -->
<link rel="stylesheet" href="/css/components.css?v=5"><!-- → v=6 -->
<link rel="stylesheet" href="/css/animations.css?v=5"><!-- → v=6 -->
<script src="/js/main.js?v=5" defer></script>         <!-- → v=6 -->
```

---

## Orphaned Selectors / JS After Removal

These become dead code once D-03 and D-04 are applied. The planner must include explicit removal steps.

| Orphan | Location | Reason Orphaned |
|---|---|---|
| `.nav.scrolled` | `components.css:18-21` | D-03 removes scroll-state toggle; class never set |
| `.nav { transition: var(--transition-nav); }` | `animations.css:5-7` | D-03; no colour fade needed |
| `.nav-overlay { transition: ... }` | `animations.css:10-18` | D-04 removes overlay |
| `@media (prefers-reduced-motion) { .nav-overlay ... }` | `animations.css:16-19` | D-04 removes overlay |
| `.nav-hamburger`, `.nav-hamburger-line`, `@media (max-width:1024px) { .nav-hamburger ... }` | `components.css:87-112` | D-04 removes hamburger |
| `.nav-overlay`, `.nav-overlay.open`, `.nav-overlay-close`, `.nav-overlay nav`, `.nav-overlay-link` | `components.css:116-162` | D-04 removes overlay |
| `@media (max-width: 1024px) { .nav-links { display: none; } }` | `layout.css:35-37` | D-06 keeps links visible on mobile |
| `--transition-nav` token usage (only in `animations.css:6`) | `tokens.css:94` | Token can be left (no harm); the rule referencing it is removed |
| JS: scroll-state block (`nav`, `toggleScrolled`) | `js/main.js:12-19` | D-03 |
| JS: `hamburger`, `overlay`, `closeBtn` vars + `openOverlay`, `closeOverlay`, event listeners | `js/main.js:25-59` | D-04 |

---

## No Analog Found

None. All modified files have direct in-codebase analogs.

---

## Metadata

**Analog search scope:** `index.html`, `css/components.css`, `css/layout.css`, `css/animations.css`, `js/main.js`, `css/tokens.css`
**Files scanned:** 6
**Pattern extraction date:** 2026-06-01
