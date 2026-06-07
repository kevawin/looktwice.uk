---
phase: 01-foundations-deploy-pipeline
plan: 02
type: execute
wave: 2
depends_on:
  - "01-01"
files_modified:
  - index.html
  - css/layout.css
  - css/components.css
  - css/animations.css
  - js/main.js
  - .planning/REQUIREMENTS.md
  - .planning/ROADMAP.md
autonomous: true
requirements:
  - FOUND-05
  - NAV-01
  - NAV-02
  - NAV-03
  - NAV-04
  - NAV-05

must_haves:
  truths:
    - "index.html on the new-site branch is the new shell (not the holding page) — overwriting the previous DM Sans + Syne + warm-gradient holding markup"
    - "index.html contains <nav>, <main> with exactly six <section> anchors in document order (#hero #situation #approach #work #services #contact), and <footer>"
    - "Zero <h1> elements appear in Phase 1 (one-H1-per-page rule reserves the H1 for the hero in Phase 2)"
    - "Sticky top nav is transparent at scrollY=0 and fills with Linen on any scroll, transitioning over 200ms"
    - "Nav links show a 2px Hot Pink underline 3px below the baseline on hover via ::after pseudo-element width grow"
    - "Mobile hamburger triggers a Midnight overlay sliding from translateY(-100%) to translateY(0) over 280ms ease-out-quart"
    - "Hamburger button has aria-expanded toggling between 'true' and 'false' and aria-controls='nav-overlay'; overlay aria-hidden mirrors inverse state"
    - "Hamburger is a 44×44px minimum hit target (WCAG 2.5.5)"
    - "Escape key closes the overlay and returns focus to the hamburger button"
    - "REQUIREMENTS.md FOUND-05 says 'six' (not 'eight'); ROADMAP.md Phase 1 SC#2 says 'six' (not 'eight')"
  artifacts:
    - path: "index.html"
      provides: "Page shell — semantic HTML, nav, six section anchors, footer placeholder, font preload, five-file CSS link order, deferred main.js"
      contains: "<section id=\"hero\">"
      contains_also: "rel=\"preload\""
      contains_also_2: "epilogue-400.woff2"
      min_lines: 40
    - path: "css/layout.css"
      provides: "Page layout — nav flex, main flow, footer min-height, six-section anchors with zero-padding"
      contains: ".nav"
    - path: "css/components.css"
      provides: "Nav components — .nav, .nav-wordmark, .nav-link, .nav-hamburger, .nav-overlay, .nav-overlay-link, .nav-overlay-close, .footer"
      contains: ".nav-link::after"
      contains_also: ".nav-overlay.open"
    - path: "css/animations.css"
      provides: "Nav transitions — nav 200ms ease-out, overlay 280ms cubic-bezier ease-out-quart, reduced-motion guards"
      contains: "prefers-reduced-motion"
    - path: "js/main.js"
      provides: "Phase 1 JS: nav scroll-state toggle, hamburger overlay open/close, Escape-key close, focus return"
      contains: "{ passive: true }"
      contains_also: "aria-expanded"
  key_links:
    - from: "index.html <head>"
      to: "fonts/epilogue-400.woff2"
      via: "<link rel='preload' as='font' type='font/woff2' crossorigin>"
      pattern: "rel=\"preload\".*epilogue-400\\.woff2"
    - from: "index.html <head>"
      to: "css/tokens.css → base.css → layout.css → components.css → animations.css"
      via: "five sequential <link rel='stylesheet'> in cascade order"
      pattern: "tokens\\.css.*base\\.css.*layout\\.css.*components\\.css.*animations\\.css"
    - from: "index.html <body>"
      to: "js/main.js"
      via: "<script src='/js/main.js' defer>"
      pattern: "<script src=\"/js/main\\.js\" defer"
    - from: "js/main.js scroll listener"
      to: ".nav.scrolled class"
      via: "nav.classList.toggle('scrolled', window.scrollY > 0)"
      pattern: "classList\\.toggle\\('scrolled'"
    - from: "js/main.js hamburger click handler"
      to: ".nav-overlay.open + aria-expanded + aria-hidden"
      via: "openOverlay() / closeOverlay() with aria attribute mutations"
      pattern: "setAttribute\\('aria-expanded'"
    - from: "nav anchor href values"
      to: "<section id> anchors"
      via: "#work → <section id='work'>, #approach → <section id='approach'>, #contact → <section id='contact'>"
      pattern: "href=\"#(work|approach|contact)\""
---

<objective>
Replace the holding `index.html` on the `new-site` branch with the new semantic shell (FOUND-05), populate `css/layout.css`, `css/components.css`, `css/animations.css` with the nav, overlay, and footer-placeholder rules, write `js/main.js` with the scroll-toggle and hamburger overlay handlers (NAV-01..05), and apply the doc-fix from CONTEXT.md D-11 (REQUIREMENTS.md FOUND-05 and ROADMAP.md Phase 1 SC#2: "eight" → "six").

Purpose: The shell is the foundation every later phase paints onto. Sections are intentionally empty (D-13). The nav is the only component fully built and visible in Phase 1. The doc-fix prevents downstream verifiers from flagging a six-vs-eight drift.

Output: A renderable single-page shell with working sticky nav (transparent → Linen on scroll), Hot Pink underline on hover, and a mobile hamburger overlay that respects aria + reduced-motion. ROADMAP.md and REQUIREMENTS.md aligned with HOMEPAGE-SPEC's six-section reality.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md
@.planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md
@.planning/phases/01-foundations-deploy-pipeline/01-UI-SPEC.md
@.planning/phases/01-foundations-deploy-pipeline/01-01-SUMMARY.md
@.planning/seeds/DESIGN-TOKENS.md
@.planning/seeds/HOMEPAGE-SPEC.md
@.planning/seeds/ARCHITECTURE.md
@CLAUDE.md
@css/tokens.css
@css/base.css

<interfaces>
<!-- Tokens this plan consumes (declared in plan 01 — css/tokens.css). Reference via var(--name) only. -->

Surfaces: var(--color-linen), var(--color-midnight), var(--color-true-white), var(--color-hot-pink)
Typography: var(--font-primary), var(--text-label), var(--ls-label)
Spacing: var(--space-xs), var(--space-sm), var(--space-md), var(--space-lg)
Transitions: var(--transition-nav)

<!-- Section anchors this plan creates (consumed by Phases 2–4 + nav links). -->

#hero       (Phase 2 lands hero)
#situation  (Phase 2 lands situation)
#approach   (Phase 3 lands positioning interrupt)
#work       (Phase 3 lands work placeholder)
#services   (Phase 3 lands services)
#contact    (Phase 4 lands contact)

<!-- Nav link → section mapping (NAV-02): three only — WORK / APPROACH / CONTACT -->
<!-- Situation and Services are scrolled into, not navigated to. Source: D-12 -->

<!-- JS contract this plan establishes (Phase 2 appends scroll-reveal observer; Phase 4 appends sticky-tab toggle). -->

window scroll listener (passive): toggles .nav.scrolled when scrollY > 0
hamburger click: toggles .nav-overlay.open + aria-expanded + aria-hidden
close button click: closes overlay
overlay-link click: closes overlay (so anchor scrolls to target with overlay gone)
Escape keydown: closes overlay if open + returns focus to hamburger
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Overwrite index.html with the semantic shell + apply doc-fix to REQUIREMENTS.md and ROADMAP.md</name>
  <files>index.html, .planning/REQUIREMENTS.md, .planning/ROADMAP.md</files>
  <read_first>
    - index.html (current holding page — read once to confirm it's the DM Sans + Syne + warm-gradient holding markup that's being replaced; verify branch is new-site before overwriting)
    - .planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md (Code Examples — `<head>` and `<body>` of index.html — these are the verbatim source)
    - .planning/phases/01-foundations-deploy-pipeline/01-UI-SPEC.md (Component Inventory §1 nav HTML, §2 overlay HTML, §4 page shell)
    - .planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md (D-01 main untouched, D-10 six-section list, D-11 doc-fix scope, D-12 three nav links, D-13 empty bodies, D-14 footer placeholder)
    - .planning/REQUIREMENTS.md (line containing FOUND-05 — confirm current text says "eight `<section>` blocks")
    - .planning/ROADMAP.md (Phase 1 success criteria #2 — confirm current text says "eight empty `<section>` anchors")
  </read_first>
  <action>
    Step A — branch safety check (STOP if wrong branch):
      Run `git rev-parse --abbrev-ref HEAD` and confirm output is exactly `new-site`. If it returns anything else (especially `main`), abort with an error message: "Phase 1 must run on new-site branch — D-01 forbids touching main." Do not proceed.

    Step B — overwrite index.html at repo root with the new shell (this replaces the existing holding page on this branch only; main keeps the holding page per branch isolation):

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Look Twice</title>

      <!-- Phase 1: minimal meta. Phase 5 (SEO) adds description, og:, canonical, JSON-LD. -->

      <!-- Preload critical font weight (400 — used by nav links and body). -->
      <!-- crossorigin is mandatory for fonts even when same-origin (browser refetches without it). -->
      <link rel="preload" href="/fonts/epilogue-400.woff2" as="font" type="font/woff2" crossorigin>

      <!-- Stylesheets in cascade order: tokens → base → layout → components → animations. Do not @import; @import is render-blocking sequential. -->
      <link rel="stylesheet" href="/css/tokens.css">
      <link rel="stylesheet" href="/css/base.css">
      <link rel="stylesheet" href="/css/layout.css">
      <link rel="stylesheet" href="/css/components.css">
      <link rel="stylesheet" href="/css/animations.css">
    </head>
    <body>

      <nav class="nav" aria-label="Primary navigation">
        <a class="nav-wordmark" href="/">Look Twice</a>
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

      <main>
        <section id="hero"></section>
        <section id="situation"></section>
        <section id="approach"></section>
        <section id="work"></section>
        <section id="services"></section>
        <section id="contact"></section>
      </main>

      <footer class="footer footer--placeholder">
        <!-- Phase 4 populates this -->
      </footer>

      <script src="/js/main.js" defer></script>
    </body>
    </html>
    ```

    Critical contract points (do NOT modify any of these):
    - Section ids appear in this exact document order: hero, situation, approach, work, services, contact (D-10).
    - Six sections — not eight (D-10, D-11). The current holding page being overwritten doesn't have any of these.
    - Three nav links only: WORK, APPROACH, CONTACT, anchored to #work, #approach, #contact (D-12). No SITUATION or SERVICES nav links.
    - Zero `<h1>` elements (one-H1-per-page rule — hero in Phase 2 takes the H1).
    - Footer is empty placeholder (D-14) — Phase 4 fills it.
    - Sections are bare anchors with no inner content (D-13) — no h2 stubs, no "PHASE 2 GOES HERE" labels.
    - `<script defer>` not blocking-script-at-end-of-body (RESEARCH.md State of the Art).
    - Absolute paths starting with `/` (RESEARCH.md Pitfall 6 — Cloudflare Pages serves from root, breaks otherwise).
    - `crossorigin` attribute on the preload (RESEARCH.md Pitfall 1 — without it browser refetches the woff2).

    Step C — apply doc-fix (D-11) to REQUIREMENTS.md:
      Find the FOUND-05 line. Current text:
        "**FOUND-05**: Single `index.html` carries `<main>`, eight `<section>` blocks with id anchors, `<nav>`, `<footer>` — semantic HTML hierarchy with one H1 (hero)"
      Replace "eight" with "six". Resulting text:
        "**FOUND-05**: Single `index.html` carries `<main>`, six `<section>` blocks with id anchors, `<nav>`, `<footer>` — semantic HTML hierarchy with one H1 (hero)"

    Step D — apply doc-fix (D-11) to ROADMAP.md:
      Find Phase 1 success criterion #2. Current text:
        "The preview shows a semantic page shell (`<main>` + eight empty `<section>` anchors + `<nav>` + `<footer>`) with one H1 reserved for the hero"
      Replace "eight empty" with "six empty". Resulting text:
        "The preview shows a semantic page shell (`<main>` + six empty `<section>` anchors + `<nav>` + `<footer>`) with one H1 reserved for the hero"

    Use `Edit` tool for the doc-fix (single targeted replace) — do not rewrite either file. Do not change any other content in REQUIREMENTS.md or ROADMAP.md.
  </action>
  <verify>
    <automated>[ "$(git rev-parse --abbrev-ref HEAD)" = "new-site" ] && test -f index.html && grep -q "<title>Look Twice</title>" index.html && [ "$(grep -cE "<section id=\"(hero|situation|approach|work|services|contact)\">" index.html)" = "6" ] && [ "$(grep -c "<h1" index.html)" = "0" ] && grep -q "rel=\"preload\".*epilogue-400.woff2" index.html && grep -q 'crossorigin' index.html && grep -q '/css/tokens.css' index.html && grep -q '/css/base.css' index.html && grep -q '/css/layout.css' index.html && grep -q '/css/components.css' index.html && grep -q '/css/animations.css' index.html && grep -q '<script src="/js/main.js" defer>' index.html && grep -q 'href="#work"' index.html && grep -q 'href="#approach"' index.html && grep -q 'href="#contact"' index.html && [ "$(grep -cE "href=\"#(work|approach|contact)\"" index.html)" -ge "6" ] && grep -q 'aria-expanded="false"' index.html && grep -q 'aria-controls="nav-overlay"' index.html && grep -q 'aria-hidden="true"' index.html && ! grep -q "fonts.googleapis\|fonts.gstatic" index.html && grep -q "six \`<section>\` blocks" .planning/REQUIREMENTS.md && grep -q "six empty \`<section>\` anchors" .planning/ROADMAP.md && ! grep -q "eight \`<section>\` blocks" .planning/REQUIREMENTS.md && ! grep -q "eight empty \`<section>\` anchors" .planning/ROADMAP.md</automated>
  </verify>
  <acceptance_criteria>
    - Branch is `new-site` (precondition — never run on main)
    - `index.html` at repo root is the new shell — `<title>Look Twice</title>` present, holding-page DM Sans / Syne / gradient markup is gone
    - Exactly six `<section>` anchors with ids in document order: hero, situation, approach, work, services, contact
    - Zero `<h1>` elements (Phase 2 introduces the only H1)
    - `<link rel="preload">` for `/fonts/epilogue-400.woff2` with `crossorigin` attribute, present in `<head>` BEFORE the stylesheet links
    - Five `<link rel="stylesheet">` tags in cascade order: tokens, base, layout, components, animations — all using absolute `/css/...` paths
    - `<script src="/js/main.js" defer>` at end of body
    - Three desktop nav links (WORK / APPROACH / CONTACT) anchoring to #work, #approach, #contact — appearing twice each (desktop nav-links list + mobile overlay)
    - Hamburger button has `aria-expanded="false"`, `aria-controls="nav-overlay"`, `aria-label="Open menu"`, `type="button"`
    - Mobile overlay has `aria-hidden="true"` initially
    - No `fonts.googleapis.com` / `fonts.gstatic.com` references anywhere
    - REQUIREMENTS.md FOUND-05 says "six `<section>` blocks" — old "eight" text removed
    - ROADMAP.md Phase 1 SC#2 says "six empty `<section>` anchors" — old "eight empty" text removed
  </acceptance_criteria>
  <done>The new-site branch's index.html is the semantic shell; doc-fix applied; ready for nav CSS + JS.</done>
</task>

<task type="auto">
  <name>Task 2: Wire nav + overlay CSS into layout.css, components.css, animations.css</name>
  <files>css/layout.css, css/components.css, css/animations.css</files>
  <read_first>
    - .planning/phases/01-foundations-deploy-pipeline/01-UI-SPEC.md (Component Inventory §1 sticky nav CSS spec, §2 mobile overlay CSS spec, §3 footer placeholder, CSS File Map, Accessibility Contract)
    - .planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md (Pattern 3 sticky nav, Pattern 4 hamburger, Pitfall 5 reduced-motion, Pitfall 7 44×44 hit target)
    - .planning/seeds/DESIGN-TOKENS.md (Navigation component spec, lines 270–308)
    - css/tokens.css (confirm tokens being referenced exist — should be the case from plan 01)
  </read_first>
  <action>
    Append to the three stub files (do not delete the header comments plan 01 added).

    File 1 — `css/layout.css` — page shell layout (append after the header comment):

    ```css
    /* Page shell: main flow, sections (zero-padding stubs in Phase 1), nav layout, footer min-height */

    main {
      display: block;
    }

    /* Empty section shells — collapse to zero height in Phase 1. Phases 2–4 paint backgrounds and padding. */
    main > section {
      /* No padding, no min-height. Bare anchor only per CONTEXT.md D-13. */
    }

    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-md);
      padding: var(--space-sm) calc(var(--space-lg) * 0.75); /* 16px 48px per UI-SPEC */
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

    /* Mobile breakpoint — hide desktop links, show hamburger. UI-SPEC: max-width 1024px. */
    @media (max-width: 1024px) {
      .nav-links { display: none; }
      .nav-hamburger { display: inline-flex; }
    }

    @media (min-width: 1025px) {
      .nav-hamburger { display: none; }
    }

    .footer {
      padding: var(--space-lg) calc(var(--space-lg) * 0.75);
      min-height: 64px;
    }
    ```

    File 2 — `css/components.css` — nav components, overlay, footer surface (append after the header comment):

    ```css
    /* Sticky nav (NAV-01, NAV-02, NAV-03) */

    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: transparent;
      color: var(--color-true-white);
    }

    .nav.scrolled {
      background: var(--color-linen);
      color: var(--color-midnight);
    }

    .nav-wordmark {
      font-family: var(--font-primary);
      font-weight: 700;
      font-size: clamp(1.4rem, 2.5vw, 1.7rem);
      letter-spacing: 0.04em;
      text-decoration: none;
      color: inherit;
    }

    .nav-link {
      font-family: var(--font-primary);
      font-weight: 400;
      font-size: var(--text-label);
      letter-spacing: var(--ls-label);
      text-transform: uppercase;
      text-decoration: none;
      color: inherit;
      position: relative;
      padding: var(--space-xs) 0;
    }

    /* Hot Pink underline (NAV-03): 2px, 3px below baseline, grows from width 0 to 100% on hover/active */
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--color-hot-pink);
      transition: width 180ms ease-out;
    }

    .nav-link:hover::after,
    .nav-link.active::after,
    .nav-link:focus-visible::after {
      width: 100%;
    }

    /* Hamburger button (NAV-04, NAV-05). 44×44 minimum hit target per WCAG 2.5.5. */
    .nav-hamburger {
      min-width: 44px;
      min-height: 44px;
      padding: 10px;
      background: transparent;
      border: 0;
      cursor: pointer;
      display: inline-flex;
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

    /* Mobile overlay (NAV-04, NAV-05) */

    .nav-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 200;
      background: var(--color-midnight);
      transform: translateY(-100%);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .nav-overlay.open {
      transform: translateY(0);
    }

    .nav-overlay-close {
      align-self: flex-end;
      min-width: 44px;
      min-height: 44px;
      font-size: 2rem;
      line-height: 1;
      color: var(--color-linen);
      background: transparent;
      border: 0;
      cursor: pointer;
    }

    .nav-overlay nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .nav-overlay-link {
      font-family: var(--font-primary);
      font-weight: 400;
      font-size: var(--text-label);
      letter-spacing: var(--ls-label);
      text-transform: uppercase;
      text-decoration: none;
      color: var(--color-linen);
      padding: var(--space-xs) 0;
    }

    /* Footer placeholder (D-14) — Midnight surface, no copy in Phase 1 */
    .footer--placeholder {
      background: var(--color-midnight);
    }
    ```

    File 3 — `css/animations.css` — transitions + reduced-motion guards (append after the header comment):

    ```css
    /* Nav transition (NAV-01) — 200ms ease-out on background-color and color */
    .nav {
      transition: var(--transition-nav);
    }

    /* Overlay slide (NAV-04) — 280ms ease-out-quart on transform */
    .nav-overlay {
      transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Reduced-motion guard: remove transform-based transition on overlay; keep nav colour fade (colour transitions are vestibular-safe). Smooth-scroll guard already lives in base.css. */
    @media (prefers-reduced-motion: reduce) {
      .nav-overlay {
        transition: none;
      }
    }

    /* Scroll reveal stub (Phase 2 lands the IntersectionObserver). Authored here so Phase 2 only adds JS, not CSS. */
    .reveal {
      opacity: 0;
      transform: translateY(16px);
      transition: var(--transition-reveal);
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

    Banned in this task (RESEARCH.md anti-patterns + DESIGN-TOKENS.md absolute bans):
    - No `font-weight: 500` anywhere
    - No `box-shadow` anywhere (sticky-tab is the only shadow surface — Phase 4)
    - No `background-clip: text` / no gradient text
    - No `backdrop-filter` / no glassmorphism
    - No mid-tone grey backgrounds — Midnight or Linen only
    - No hard-coded hex / rgb — use `var(--color-...)` only
    - No `--gradient-brand` painted on any surface (declared in tokens but unpainted in Phase 1)
  </action>
  <verify>
    <automated>grep -q "position: sticky" css/components.css && grep -q "background: transparent" css/components.css && grep -q "\\.nav\\.scrolled" css/components.css && grep -q "var(--color-linen)" css/components.css && grep -q "var(--color-midnight)" css/components.css && grep -q "\\.nav-link::after" css/components.css && grep -q "background: var(--color-hot-pink)" css/components.css && grep -q "transition: width 180ms" css/components.css && grep -q "min-width: 44px" css/components.css && grep -q "min-height: 44px" css/components.css && grep -q "\\.nav-overlay" css/components.css && grep -q "translateY(-100%)" css/components.css && grep -q "\\.nav-overlay\\.open" css/components.css && grep -q "translateY(0)" css/components.css && grep -q "var(--transition-nav)" css/animations.css && grep -q "cubic-bezier(0.16, 1, 0.3, 1)" css/animations.css && grep -q "prefers-reduced-motion" css/animations.css && grep -q "\\.reveal" css/animations.css && grep -q "max-width: 1024px" css/layout.css && grep -q "var(--space-sm)" css/layout.css && ! grep -rE "font-weight:[[:space:]]*500" css/ && ! grep -rE "#[0-9a-fA-F]{6}" css/components.css && ! grep -q "backdrop-filter" css/ && ! grep -q "box-shadow" css/components.css && ! grep -q "background-clip" css/ && ! grep -rE "var\\(--gradient-brand\\)" css/components.css css/layout.css css/animations.css</automated>
  </verify>
  <acceptance_criteria>
    - `css/layout.css` contains nav flex layout, .nav-links flex, hamburger media-query toggling at 1024px, footer min-height
    - `css/components.css` contains: `.nav { position: sticky; top: 0; background: transparent; color: var(--color-true-white); }`, `.nav.scrolled` flips to Linen + Midnight, `.nav-link::after` Hot Pink 2px underline that grows to 100% on hover/active/focus-visible, `.nav-hamburger` 44×44 min hit target, `.nav-overlay` fixed inset 0 with `translateY(-100%)` default and `translateY(0)` on `.open`, `.nav-overlay-close` 44×44, `.nav-overlay-link` Linen text, `.footer--placeholder` Midnight surface
    - `css/animations.css` contains: `transition: var(--transition-nav)` on .nav, `transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1)` on .nav-overlay, `@media (prefers-reduced-motion: reduce) { .nav-overlay { transition: none } }`, `.reveal` stub for Phase 2
    - Zero `font-weight: 500` anywhere in css/
    - Zero hex colour values in `css/components.css` (OKLCH-via-var only)
    - Zero `backdrop-filter`, `box-shadow` in `css/components.css`, `background-clip` anywhere in css/ (design bans)
    - Zero `var(--gradient-brand)` painted on any surface in any of the three files (Phase 1 declares but never paints — Phase 4 sticky tab is the only consumer)
  </acceptance_criteria>
  <done>Nav, overlay, and footer placeholder are styled via tokens; transitions wired with reduced-motion guard; .reveal stub ready for Phase 2; zero design-ban violations.</done>
</task>

<task type="auto">
  <name>Task 3: Write js/main.js with nav scroll toggle + hamburger overlay handlers</name>
  <files>js/main.js</files>
  <read_first>
    - .planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md (Code Examples — `js/main.js` Phase 1 only — verbatim source)
    - .planning/phases/01-foundations-deploy-pipeline/01-UI-SPEC.md (Component Inventory §1 nav JS, §2 overlay JS, Accessibility Contract aria toggling rules)
    - .planning/seeds/ARCHITECTURE.md (JS spec — vanilla only, passive listeners, IntersectionObserver pattern for later phases)
    - index.html (confirm element selectors match: .nav, .nav-hamburger, .nav-overlay, .nav-overlay-close)
  </read_first>
  <action>
    Create `js/main.js` with two behaviours and a placeholder comment for Phase-2/4 appendages.

    File contents (verbatim — derived from RESEARCH.md):

    ```js
    /* Look Twice — Phase 1 JS.
       Behaviours: nav scroll-state toggle (NAV-01, JS-02), mobile hamburger overlay open/close (NAV-04, NAV-05).
       Phase 2 will append: scroll-reveal IntersectionObserver.
       Phase 4 will append: sticky tab entrance toggle. */

    // Nav scroll-state toggle (NAV-01, JS-02, JS-06).
    // { passive: true } keeps scroll on the compositor thread — mandatory for scroll listeners.
    const nav = document.querySelector('.nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 0);
      }, { passive: true });
    }

    // Mobile hamburger overlay open/close (NAV-04, NAV-05).
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

      // Close overlay on link click so the anchor scrolls with overlay gone.
      overlay.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeOverlay);
      });

      // Escape closes the overlay and returns focus to the hamburger button (a11y best practice).
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
          closeOverlay();
        }
      });
    }
    ```

    Critical contract points (do NOT modify):
    - Vanilla JS only — no `import`, no `require`, no library references (JS-01, CLAUDE.md).
    - `{ passive: true }` on the scroll listener (JS-06, NAV-01) — non-passive scroll listeners block compositor thread.
    - `aria-expanded` toggles between literal strings `"true"` and `"false"` (NAV-05).
    - `aria-hidden` on overlay mirrors the inverse: `"false"` when open, `"true"` when closed (NAV-05).
    - `hamburger.focus()` on close — returns focus from a closing overlay back to the trigger element, standard a11y pattern.
    - Existence guards (`if (nav)`, `if (hamburger && overlay && closeBtn)`) — script is `defer`'d so DOM is ready when it runs, but guards protect against future markup changes.
    - No DOMContentLoaded wrapper — `<script defer>` already waits for parse.

    Banned (RESEARCH.md anti-patterns):
    - No `import` / `require` / `from '...'` — vanilla JS only
    - No `addEventListener('scroll', ..., false)` or `addEventListener('scroll', ...)` without options — passive flag mandatory for scroll
    - No `setTimeout`/`setInterval` for scroll detection — class toggle on scrollY > 0 is the spec
    - No focus-trap library, no scroll-lock library — UI-SPEC says these are not Phase 1 needs
  </action>
  <verify>
    <automated>test -f js/main.js && grep -q "querySelector('.nav')" js/main.js && grep -q "addEventListener('scroll'" js/main.js && grep -q "{ passive: true }" js/main.js && grep -q "classList.toggle('scrolled'" js/main.js && grep -q "window.scrollY > 0" js/main.js && grep -q "querySelector('.nav-hamburger')" js/main.js && grep -q "querySelector('.nav-overlay')" js/main.js && grep -q "querySelector('.nav-overlay-close')" js/main.js && grep -q "classList.add('open')" js/main.js && grep -q "classList.remove('open')" js/main.js && grep -q "setAttribute('aria-expanded', 'true')" js/main.js && grep -q "setAttribute('aria-expanded', 'false')" js/main.js && grep -q "setAttribute('aria-hidden', 'true')" js/main.js && grep -q "setAttribute('aria-hidden', 'false')" js/main.js && grep -q "hamburger.focus()" js/main.js && grep -q "e.key === 'Escape'" js/main.js && ! grep -qE "^(import|const.*require\\()" js/main.js && ! grep -q "from '" js/main.js && [ "$(node --check js/main.js > /dev/null 2>&1 && echo ok || echo fail)" = "ok" ]</automated>
  </verify>
  <acceptance_criteria>
    - `js/main.js` exists
    - Selects `.nav` and adds a scroll listener with `{ passive: true }` that toggles `.scrolled` when `window.scrollY > 0`
    - Selects `.nav-hamburger`, `.nav-overlay`, `.nav-overlay-close`
    - `openOverlay()` adds `.open` class, sets `aria-expanded="true"` on hamburger, sets `aria-hidden="false"` on overlay
    - `closeOverlay()` removes `.open`, sets `aria-expanded="false"`, sets `aria-hidden="true"`, calls `hamburger.focus()`
    - Hamburger click toggles via openOverlay/closeOverlay
    - Close button click calls closeOverlay
    - Each `<a>` inside the overlay calls closeOverlay on click (so anchor scrolls cleanly)
    - `keydown` listener on document closes overlay when `e.key === 'Escape'` and overlay is open
    - Existence guards (`if (nav)`, `if (hamburger && overlay && closeBtn)`) prevent runtime errors if markup changes
    - File parses as valid JS (`node --check js/main.js` succeeds)
    - Zero `import` / `require` / `from '...'` references — pure vanilla JS
  </acceptance_criteria>
  <done>main.js wires the only two Phase-1 JS behaviours, parses cleanly, leaves Phase 2 + 4 hooks as comments only.</done>
</task>

</tasks>

<verification>
End-of-plan smoke test (run after all three tasks):

```bash
# 1. Branch isolation
[ "$(git rev-parse --abbrev-ref HEAD)" = "new-site" ]

# 2. Shell shape
test -f index.html
[ "$(grep -cE "<section id=\"(hero|situation|approach|work|services|contact)\">" index.html)" = "6" ]
[ "$(grep -c "<h1" index.html)" = "0" ]
grep -q '<script src="/js/main.js" defer>' index.html

# 3. Doc-fix landed
grep -q "six \`<section>\` blocks" .planning/REQUIREMENTS.md
grep -q "six empty \`<section>\` anchors" .planning/ROADMAP.md
! grep -q "eight \`<section>\` blocks" .planning/REQUIREMENTS.md
! grep -q "eight empty \`<section>\` anchors" .planning/ROADMAP.md

# 4. Nav CSS wired
grep -q "position: sticky" css/components.css
grep -q ".nav.scrolled" css/components.css
grep -q ".nav-link::after" css/components.css
grep -q ".nav-overlay.open" css/components.css

# 5. Animation + reduced-motion wired
grep -q "var(--transition-nav)" css/animations.css
grep -q "prefers-reduced-motion" css/animations.css

# 6. JS parses
node --check js/main.js

# 7. JS contract
grep -q "{ passive: true }" js/main.js
grep -q "aria-expanded" js/main.js
grep -q "Escape" js/main.js
grep -q "hamburger.focus()" js/main.js

# 8. Bans clean
! grep -rE "font-weight:[[:space:]]*500" css/
! grep -q "backdrop-filter" css/
! grep -rE "var\\(--gradient-brand\\)" css/components.css css/layout.css css/animations.css
```

All must pass.

Manual sanity (no formal checkpoint — Phase 5 audits): Open `index.html` in a local HTTP server (`python3 -m http.server 8000`) and confirm:
- The page renders with Linen background and a transparent nav showing white "Look Twice" wordmark plus three uppercase links.
- Scroll the page (the page is mostly empty so a tiny scroll suffices once content lands; in Phase 1 you can scroll via `window.scrollTo(0, 1)` in DevTools console). Nav fills with Linen, text flips to Midnight.
- On a viewport ≤1024px, hamburger appears in place of the desktop links. Click it; Midnight overlay slides down from top. Click a link or the close button or press Escape; overlay closes and focus returns to the hamburger.

This manual sanity is for planner/dev awareness — Phase 5 owns the formal a11y + cross-breakpoint audit.
</verification>

<success_criteria>
- index.html on new-site is the new shell (FOUND-05) — semantic HTML, six sections in document order, zero H1, font preload, five CSS links in cascade order, deferred main.js
- Sticky nav transparent over (future) hero, fills Linen on first scroll within 200ms (NAV-01)
- Wordmark left + three nav links right (WORK / APPROACH / CONTACT) anchoring on-page (NAV-02)
- Hot Pink 2px underline 3px below baseline grows to 100% on hover/active/focus-visible (NAV-03)
- Mobile hamburger triggers Midnight overlay sliding from translateY(-100%) to translateY(0) over 280ms ease-out-quart (NAV-04)
- aria-expanded / aria-controls / aria-hidden / aria-label all wired on hamburger and overlay; close button top-right of overlay; 44×44 hit targets; Escape closes (NAV-05)
- prefers-reduced-motion guard on overlay transition; smooth-scroll guard inherited from base.css
- D-11 doc-fix landed: REQUIREMENTS.md and ROADMAP.md both say "six" instead of "eight"
- main untouched (D-01) — branch verified before any write
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundations-deploy-pipeline/01-02-SUMMARY.md` documenting: shell shape, doc-fix landed, nav CSS rules added per file, JS handlers wired, contract handed to Phase 2 (scroll-reveal observer extends main.js, hero section paints into #hero) and Phase 4 (sticky tab CSS appends to components.css, sticky-tab toggle appends to main.js).
</output>
