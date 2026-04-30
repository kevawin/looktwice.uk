---
phase: 02-hero-situation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - index.html
  - css/components.css
  - css/layout.css
autonomous: true
requirements:
  - HERO-01
  - HERO-02
  - HERO-03
  - HERO-04
  - HERO-05
  - HERO-06
must_haves:
  truths:
    - "Visitor lands on the preview and sees a Hot Pink hero filling at least 90vh, immediately, with no scroll reveal"
    - "Visitor reads the two-line headline and one-paragraph subhead in white Epilogue 700/400"
    - "Visitor sees Kris's desaturated portrait in a rounded-rect, plus a smaller supporting cutout (or Midnight fallback) positioned asymmetrically"
    - "Visitor sees two CTAs: BOOK A SESSION (primary, anchors to #contact) and SEE THE WORK (ghost, anchors to #work)"
    - "On desktop the text column sits left ~55%, cutouts right ~45%, never overlapping; on mobile they stack with cutouts below buttons"
  artifacts:
    - path: "index.html"
      provides: "Hero markup inside <section id=\"hero\"> with H1, subhead, CTA row, cutout group"
      contains: "class=\"hero\""
    - path: "css/components.css"
      provides: "Hero component classes (.hero, .hero__inner, .hero__text, .hero__headline, .hero__subhead, .hero__ctas, .hero__cutouts, .hero__cutout--main, .hero__cutout--support, .hero__cutout-fallback, .btn, .btn--primary, .btn--ghost-on-dark)"
      contains: ".hero {"
    - path: "css/layout.css"
      provides: "Hero layout grid + responsive stacking"
      contains: ".hero__inner"
  key_links:
    - from: "index.html .hero__cutout--main img"
      to: "images/kris-portrait.webp"
      via: "src attribute"
      pattern: "kris-portrait\\.webp"
    - from: ".btn--primary"
      to: "#contact"
      via: "href attribute"
      pattern: "href=\"#contact\""
    - from: ".btn--ghost-on-dark"
      to: "#work"
      via: "href attribute"
      pattern: "href=\"#work\""
---

<objective>
Fill the Phase 1 empty `<section id="hero">` anchor with the Hot Pink hero: two-line H1, one-paragraph subhead, two CTAs, and an asymmetric cutout composition (main portrait + supporting image, both desaturated via CSS). Append hero component classes to `css/components.css` and the hero layout grid to `css/layout.css`. Hero is visible on load — never carries `.reveal`.

Purpose: Above-the-fold identity. A warm referral arrives, sees Kris's voice in display type, recognises the surface as confident and editorial, and has two zero-friction next steps.

Output: A live hero on the Cloudflare Pages preview at https://new-site.looktwice-uk.pages.dev that satisfies HERO-01 through HERO-06, ships the locked copy from D-01 / D-02 / D-03 verbatim, and consumes only existing tokens (no hard-coded colours, sizes, spacing).
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
@.planning/seeds/CONTENT-DRAFT.md
@.planning/seeds/HOMEPAGE-SPEC.md
@.planning/seeds/DESIGN-TOKENS.md
@.planning/seeds/ARCHITECTURE.md

@index.html
@css/tokens.css
@css/base.css
@css/layout.css
@css/components.css
@css/animations.css

<interfaces>
Tokens already declared in `css/tokens.css` (do not redeclare):
- Colour: `--color-hot-pink`, `--color-linen`, `--color-midnight`, `--color-true-white`
- Type: `--text-display`, `--text-body`, `--text-label`; `--lh-display`, `--lh-body`, `--lh-label`; `--ls-display`, `--ls-label`; `--font-primary`
- Spacing: `--space-xs` (8px), `--space-sm` (16px), `--space-md` (32px), `--space-lg` (64px), `--space-xl` (96px)
- Radius: `--radius-sm` (4px), `--radius-cutout` (16px), `--radius-pill` (999px)
- Transitions: `--transition-button`
- Measure: `--measure` (65ch)

Phase 1 conventions to honour:
- BEM-ish class naming (`.nav`, `.nav-link`, `.nav-link--active`) — extend with `.hero`, `.hero__text`, `.hero__cutout--main`
- Five-CSS-file split: tokens → base → layout → components → animations. Phase 2 appends only.
- Token consumption only via `var(--token-name)`. Never hex / rgb / hard-coded px (8px scale exempt — use spacing tokens).
- Body breakpoint convention: `(max-width: 1024px)` is the desktop/mobile boundary used by the nav. Phase 2 hero may use a tighter breakpoint (~768px) where two-column → stacked makes more sense for two-column hero text+image; planner picks 768px to align with text-overflow risk.

Existing hero anchor (line 53 of `index.html`):
```html
<section id="hero"></section>
```
Phase 2 fills this; do not change the section id or its surrounding `<main>` shell.

Image already in place:
- `images/kris-portrait.webp` (365KB, present in working tree per `ls images/`).
- `images/hero-supporting.webp` is NOT yet committed. Per D-10, render Midnight token-block fallback at the supporting cutout's exact size and position when the file is absent. The Midnight block is replaced by a single later commit that drops in `images/hero-supporting.webp` — no markup or CSS change required, the `<picture>` / `<img>` structure is committed up front.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fill hero markup in index.html</name>
  <files>index.html</files>
  <read_first>
    - index.html (current empty `<section id="hero">` at line 53)
    - .planning/phases/02-hero-situation/02-UI-SPEC.md (Component Inventory — hero classes; Copywriting Contract — Hero table for verbatim strings)
    - .planning/phases/02-hero-situation/02-CONTEXT.md (D-01 headline, D-02 subhead, D-03 CTAs, D-07/D-08 cutout sources, D-10 fallback rule)
    - .planning/seeds/CONTENT-DRAFT.md §Section 1 (alt text guidance)
  </read_first>
  <action>
Replace the empty `<section id="hero"></section>` (line 53) with the following markup. Keep all surrounding HTML untouched.

```html
<section id="hero" class="hero">
  <div class="hero__inner">
    <div class="hero__text">
      <h1 class="hero__headline">
        Your brand makes a promise.<br>
        But is your experience breaking it?
      </h1>
      <p class="hero__subhead">
        I find where brand promise and experience are out of step. Then close the gap.
      </p>
      <div class="hero__ctas">
        <a class="btn btn--primary" href="#contact">BOOK A SESSION</a>
        <a class="btn btn--ghost-on-dark" href="#work">SEE THE WORK</a>
      </div>
    </div>

    <div class="hero__cutouts" aria-hidden="false">
      <picture class="hero__cutout hero__cutout--main">
        <img src="/images/kris-portrait.webp"
             alt="Kristina Evawin, brand and CX strategist"
             width="800"
             height="1000"
             loading="eager"
             decoding="async"
             fetchpriority="high">
      </picture>
      <!-- Supporting cutout: image not yet committed.
           Per D-10 the markup ships the picture/img with the agreed path,
           and a Midnight token-block fallback (.hero__cutout-fallback) renders behind it.
           When images/hero-supporting.webp lands later, the fallback drops out via CSS attribute selector — no markup change. -->
      <div class="hero__cutout hero__cutout--support">
        <div class="hero__cutout-fallback" aria-hidden="true"></div>
        <picture class="hero__cutout-image">
          <img src="/images/hero-supporting.webp"
               alt="A working session: hands annotating printed brand research on a desk"
               width="500"
               height="500"
               loading="eager"
               decoding="async"
               onerror="this.parentElement.parentElement.classList.add('hero__cutout--missing'); this.remove();">
        </picture>
      </div>
    </div>
  </div>
</section>
```

Notes for the executor:
- Headline ships with `<br>` between sentences per UI-SPEC Typography §Rules. Two display lines.
- Subhead is one `<p>` containing two short sentences with a period between them — never an em-dash (D-02; CLAUDE.md design ban).
- Both CTAs are `<a>` with `href="#contact"` and `href="#work"` respectively (CLAUDE.md anchor-scroll convention).
- Main portrait `alt` text is locked verbatim from CONTENT-DRAFT §Alt Text Drafts ("Kristina Evawin, brand and CX strategist"). Do not change.
- Supporting cutout `alt` text is provisional ("A working session: hands annotating printed brand research on a desk"). Kris/Jamie can refine when the final image is selected. Never empty, never the word "cutout".
- The `onerror` handler on the supporting `<img>` is a defence-in-depth: if the file is missing on the server (Cloudflare Pages will 404 it), the JS removes the broken `<img>` and adds `hero__cutout--missing` to the wrapper so CSS can keep the Midnight fallback visible. This is one inline JS expression, not a script — keeps the autonomous degradation per D-10 even if the file absence is server-side rather than git-side.
- `loading="eager"` and `fetchpriority="high"` are intentional on hero images (above the fold; LCP candidate). Do not change.
- `width` / `height` reserve aspect-ratio space and prevent CLS — values match the source file aspect (kris-portrait.webp is portrait orientation; 800×1000 is the hint, browser scales to actual via CSS).
- No `srcset` Phase 2 (D-09).
  </action>
  <verify>
    <automated>
grep -q 'class="hero"' index.html && grep -q '<h1 class="hero__headline">' index.html && grep -q 'But is your experience breaking it?' index.html && grep -q 'href="#contact"' index.html && grep -q 'href="#work"' index.html && grep -q 'kris-portrait.webp' index.html && grep -q 'hero-supporting.webp' index.html && grep -q 'hero__cutout-fallback' index.html && ! grep -q '—' index.html && echo "OK"
    </automated>
  </verify>
  <done>
    - `index.html` contains `<section id="hero" class="hero">` with `.hero__inner`, `.hero__text`, `.hero__cutouts`.
    - Exactly one `<h1>` lives inside `.hero` (verify: `grep -c '<h1' index.html` = 1).
    - Both CTAs (`href="#contact"`, `href="#work"`) present.
    - Both cutout image references present (`images/kris-portrait.webp`, `images/hero-supporting.webp`).
    - No em-dash characters anywhere in the file.
    - File still parses as valid HTML (no orphan tags) — visually confirm with browser dev-tools or `xmllint --html --noout index.html` (warnings ok, errors not).
  </done>
</task>

<task type="auto">
  <name>Task 2: Append hero component CSS to css/components.css</name>
  <files>css/components.css</files>
  <read_first>
    - css/components.css (existing nav classes — append below, do not modify)
    - css/tokens.css (token names — copy verbatim into var() calls)
    - .planning/phases/02-hero-situation/02-UI-SPEC.md (Component Inventory; Color; Typography; Hover & focus states table — note focus-ring exception on .btn--ghost-on-dark)
    - .planning/seeds/DESIGN-TOKENS.md (Buttons spec: padding 14px 32px, radius --radius-sm; Chips spec for cross-reference)
  </read_first>
  <action>
Append the following CSS block to the END of `css/components.css` (do NOT insert it between existing nav rules). Preserve the existing file's nav and footer-placeholder rules verbatim.

```css

/* ============================================================
   Phase 2 — Hero (#hero) component
   HERO-01 through HERO-06. Hot Pink full-bleed surface.
   ============================================================ */

.hero {
  background: var(--color-hot-pink);
  color: var(--color-true-white);
  min-height: 90vh;
  display: flex;
  align-items: center;
  /* Internal padding: clear sticky nav at top, breathe at bottom. Token-driven. */
  padding-block: var(--space-lg);
  padding-inline: calc(var(--space-lg) * 0.75); /* matches nav gutter (48px) per Phase 1 layout */
  position: relative;
  overflow: hidden; /* prevents asymmetric cutout offset bleeding past surface */
}

.hero__headline {
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: var(--text-display);
  line-height: var(--lh-display);
  letter-spacing: var(--ls-display);
  color: var(--color-true-white);
  margin: 0;
}

.hero__subhead {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-true-white);
  opacity: 0.85;
  max-width: var(--measure);
  margin-block-start: var(--space-sm);
  margin-block-end: 0;
}

.hero__ctas {
  display: flex;
  flex-direction: row;
  gap: var(--space-sm);
  margin-block-start: var(--space-md);
  flex-wrap: wrap;
}

/* Cutout column — asymmetric composition.
   Main cutout dominates; supporting cutout offsets bottom-left to break the rectangle. */
.hero__cutouts {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1; /* keeps the composition stable while content scales */
  max-width: 520px;
  justify-self: end;
}

.hero__cutout {
  position: absolute;
  display: block;
  filter: grayscale(100%);
}

.hero__cutout img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero__cutout--main {
  top: 0;
  right: 0;
  width: 78%;
  height: 86%;
  border-radius: var(--radius-cutout);
  overflow: hidden;
  z-index: 1;
}

.hero__cutout--support {
  bottom: 0;
  left: 0;
  width: 42%;
  height: 42%;
  border-radius: 50%; /* circle per HOMEPAGE-SPEC §Section 2 — supporting cutout is a circle for asymmetric tension against the main rounded-rect */
  overflow: hidden;
  z-index: 2;
}

/* Midnight token-block fallback (D-10).
   Sits behind the <picture>; if the image is present, it covers the fallback.
   If the image fails to load (or .hero__cutout--missing is added by the inline onerror handler in index.html), the fallback shows through. */
.hero__cutout-fallback {
  position: absolute;
  inset: 0;
  background: var(--color-midnight);
  border-radius: inherit;
  z-index: 0;
}

.hero__cutout-image {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hero__cutout--missing .hero__cutout-image {
  display: none;
}

/* ============================================================
   Buttons — base + hero variants (HERO-04).
   Padding 14px 32px is locked by DESIGN-TOKENS Buttons spec.
   ============================================================ */

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
  padding: 14px 32px;
  border-radius: var(--radius-sm);
  border: 0;
  cursor: pointer;
  transition: var(--transition-button);
}

.btn--primary {
  background: var(--color-midnight);
  color: var(--color-linen);
}

.btn--primary:hover,
.btn--primary:focus-visible {
  background: var(--color-hot-pink);
  color: var(--color-true-white);
}

.btn--ghost-on-dark {
  background: transparent;
  color: var(--color-true-white);
  border: 1.5px solid var(--color-true-white);
}

.btn--ghost-on-dark:hover {
  background: var(--color-true-white);
  color: var(--color-midnight);
}

/* Focus-ring exception (UI-SPEC Hover & focus): Hot Pink outline disappears on Hot Pink surface.
   Override only on .btn--ghost-on-dark to keep contrast against hero. */
.btn--ghost-on-dark:focus-visible {
  outline: 2px solid var(--color-true-white);
  outline-offset: 3px;
}

/* ============================================================
   Hero responsive — single-column stack at narrow viewports.
   Breakpoint 768px keeps the 2-col hero readable on tablets while
   stacking it on phones (matches HERO-05).
   ============================================================ */

@media (max-width: 768px) {
  .hero {
    /* Allow content to grow taller than 90vh on small screens if cutout + buttons need it. */
    min-height: 90vh;
    padding-block: var(--space-md);
  }

  .hero__cutouts {
    width: 85%; /* HERO-05: scaled cutout ~85% section width */
    margin-block-start: var(--space-md);
    aspect-ratio: 4 / 5; /* taller composition on mobile */
    max-width: none;
    justify-self: center;
  }

  .hero__ctas {
    flex-direction: column;
    align-items: stretch;
  }

  .hero__ctas .btn {
    width: 100%;
  }
}
```

Implementation notes for executor:
- Append at end of file. Do not edit nav rules.
- All values consume tokens; the only literal pixel values are `1.5px` (button border, locked by DESIGN-TOKENS), `14px 32px` (button padding, locked by DESIGN-TOKENS), `2px`/`3px` (focus ring widths matching base.css convention), `768px` breakpoint, percentages on cutout dimensions (composition geometry, not design system).
- Do NOT introduce a `--color-white-85` token. The 85% white subhead is `color: var(--color-true-white); opacity: 0.85;` per UI-SPEC.
- Do NOT add box-shadow on cutouts or buttons (CLAUDE.md design ban).
- Do NOT add a hover transform on buttons (UI-SPEC: 180ms ease-out colour fade only, no transform).
  </action>
  <verify>
    <automated>
grep -q '\.hero {' css/components.css && grep -q 'background: var(--color-hot-pink);' css/components.css && grep -q 'min-height: 90vh;' css/components.css && grep -q '\.btn {' css/components.css && grep -q '\.btn--primary' css/components.css && grep -q '\.btn--ghost-on-dark' css/components.css && grep -q 'filter: grayscale(100%);' css/components.css && grep -q '\.hero__cutout-fallback' css/components.css && grep -q '@media (max-width: 768px)' css/components.css && ! grep -E 'box-shadow.*hero|box-shadow.*btn' css/components.css && echo "OK"
    </automated>
  </verify>
  <done>
    - `.hero { background: var(--color-hot-pink); ... min-height: 90vh; }` declared.
    - `.hero__headline` uses `var(--text-display)`, `var(--color-true-white)`, weight 700.
    - `.hero__subhead` uses `var(--color-true-white)` with `opacity: 0.85` and `max-width: var(--measure)`.
    - `.btn`, `.btn--primary`, `.btn--ghost-on-dark` declared. Primary hover swaps to Hot Pink. Ghost hover swaps to White fill / Midnight text.
    - `.btn--ghost-on-dark:focus-visible` overrides outline to White (focus-ring exception).
    - `filter: grayscale(100%)` applied to `.hero__cutout`.
    - `.hero__cutout-fallback` Midnight rule present.
    - `@media (max-width: 768px)` collapses `.hero__ctas` to column and shows scaled cutouts.
    - No `box-shadow` on any `.hero` or `.btn` selector (design ban).
    - No `font-weight: 500` anywhere.
  </done>
</task>

<task type="auto">
  <name>Task 3: Append hero layout grid to css/layout.css</name>
  <files>css/layout.css</files>
  <read_first>
    - css/layout.css (existing nav layout + section stub comment — append below)
    - .planning/phases/02-hero-situation/02-UI-SPEC.md (Layout §Hero — desktop two-column, mobile stack)
  </read_first>
  <action>
Append the following block to the END of `css/layout.css`. Do not modify existing nav-layout rules.

```css

/* ============================================================
   Phase 2 — Hero layout (HERO-01, HERO-03, HERO-05).
   Two-column grid at >=769px: text ~55%, cutouts ~45%.
   Single column at <=768px: text first, then cutouts (HERO-05).
   ============================================================ */

.hero__inner {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(0, 55fr) minmax(0, 45fr);
  gap: var(--space-lg);
  align-items: center;
}

.hero__text {
  /* Vertical stack — headline, subhead, CTAs already gap'd via margin in components.css. */
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
}
```

Implementation notes:
- The `.hero__inner` max-width 1280px gives a comfortable text measure on ultra-wide displays without the hero growing infinitely. Tune this value only if the rendered preview shows the text column getting too wide on >1440px screens.
- Keep `align-items: center` so the text column visually centres against the (taller) cutout column on desktop.
- Leave `min-height: 90vh` on `.hero` (set in components.css) to drive vertical rhythm. Do not duplicate here.
  </action>
  <verify>
    <automated>
grep -q '\.hero__inner' css/layout.css && grep -q 'grid-template-columns: minmax(0, 55fr) minmax(0, 45fr);' css/layout.css && grep -q '@media (max-width: 768px)' css/layout.css && grep -q 'grid-template-columns: 1fr;' css/layout.css && echo "OK"
    </automated>
  </verify>
  <done>
    - `.hero__inner` is a CSS grid with `minmax(0, 55fr) minmax(0, 45fr)` on desktop, single column under 768px.
    - `gap: var(--space-lg)` desktop, `var(--space-md)` mobile.
    - `max-width: 1280px` and `margin-inline: auto` cap and centre the inner container.
    - File still loads in cascade order (tokens → base → layout → components → animations); no `@import` introduced.
  </done>
</task>

</tasks>

<verification>
After all three tasks complete:

1. **Markup integrity** — `xmllint --html --noout index.html 2>&1 | grep -i error || echo "no errors"` returns "no errors".
2. **Single H1** — `grep -c '<h1' index.html` returns `1`.
3. **Anchor links present** — `grep -c 'href="#contact"' index.html` returns at least 1; `grep -c 'href="#work"' index.html` returns at least 1.
4. **No em-dashes** — `grep '—' index.html css/components.css css/layout.css` returns nothing.
5. **No font-weight 500** — `grep 'font-weight: 500' css/*.css` returns nothing.
6. **Token usage** — `grep -E '#[0-9a-fA-F]{3,6}' css/components.css` returns no hex colour matches in Phase 2 appended rules (Phase 1 nav rules also use tokens — no hex anywhere).
7. **Image referenced** — `images/kris-portrait.webp` referenced in `index.html` AND file exists on disk (`ls images/kris-portrait.webp`).
8. **Visual check (manual on preview after deploy)**:
   - Open https://new-site.looktwice-uk.pages.dev — Hot Pink hero fills viewport at min 90vh.
   - Headline reads "Your brand makes a promise." line break "But is your experience breaking it?" in white display weight.
   - Subhead reads "I find where brand promise and experience are out of step. Then close the gap." in white at 85% opacity body size.
   - Primary "BOOK A SESSION" Midnight pill button → Hot Pink on hover. Ghost "SEE THE WORK" White-bordered → White fill on hover.
   - Kris portrait visible in greyscale rounded-rect; supporting circle is Midnight block (until image lands) at bottom-left, asymmetric to the main.
   - Resize to <=768px: layout stacks (headline → subhead → buttons full-width → cutouts at 85% width). Test at 375px (iPhone SE) — no horizontal scroll, no overflow.
   - Click "BOOK A SESSION" — page scrolls to `#contact` anchor (currently empty, will be filled in Phase 4 — anchor still resolves).
   - Tab through hero with keyboard — both buttons receive visible focus rings (primary Hot Pink ring, ghost White ring).
9. **Hero is NOT revealed via scroll** — `grep '\.reveal' index.html | grep hero` returns nothing. `grep 'class="hero"' index.html | grep reveal` returns nothing.
</verification>

<success_criteria>
- HERO-01: `.hero` has `background: var(--color-hot-pink)` and `min-height: 90vh`; on desktop `.hero__inner` is a 2-col grid with text ~55% and cutouts ~45%.
- HERO-02: H1 uses `var(--text-display)`/700/White; `.hero__subhead` uses `var(--text-body)`/400/White at 85% opacity; both copy strings ship verbatim from D-01 / D-02.
- HERO-03: `.hero__cutout--main` is a rounded-rect (`--radius-cutout`), `.hero__cutout--support` is a circle, both `filter: grayscale(100%)`, asymmetric absolute positioning inside `.hero__cutouts`, and the cutout column is constrained so text never overlaps photography.
- HERO-04: Two CTAs ship with locked labels ("BOOK A SESSION", "SEE THE WORK"), correct anchors (`#contact`, `#work`), Midnight→Hot Pink primary hover, White-bordered→White-fill ghost hover.
- HERO-05: At ≤768px the layout stacks (text → cutouts), buttons go full-width, cutout group scales to 85% section width.
- HERO-06: No `.reveal` class on any hero element; hero is fully visible on initial load with no JS-driven animation.
</success_criteria>

<output>
After completion, create `.planning/phases/02-hero-situation/02-01-SUMMARY.md` documenting:
- Files modified (line ranges if useful)
- Token usage audit (which tokens this plan introduced into hero/button surfaces)
- Any deviations from UI-SPEC and why (e.g. exact cutout dimensions, breakpoint pixel choice)
- Image status: `images/kris-portrait.webp` shipped, `images/hero-supporting.webp` deferred to single-file commit (Midnight fallback live until then)
- Manual verification screenshot or a note that the preview was inspected at desktop + 768px + 375px widths
- Open issues for Kris (e.g. which supporting cutout image to commission/source)
</output>
