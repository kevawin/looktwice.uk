---
phase: 01-foundations-deploy-pipeline
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - css/tokens.css
  - css/base.css
  - css/layout.css
  - css/components.css
  - css/animations.css
  - fonts/epilogue-400.woff2
  - fonts/epilogue-700.woff2
  - fonts/OFL.txt
autonomous: true
requirements:
  - FOUND-01
  - FOUND-02
  - FOUND-03
  - FOUND-04

must_haves:
  truths:
    - "Project tree matches ARCHITECTURE.md flat layout (index.html, css/, js/, fonts/, images/)"
    - "css/tokens.css declares every token in DESIGN-TOKENS.md (OKLCH colours, type scale, spacing, radii, shadows, transitions, gradient)"
    - "css/base.css contains Andy Bell modern reset, two @font-face blocks for Epilogue 400 and 700, html scroll-behavior:smooth with reduced-motion guard, body defaults, --measure cap"
    - "Epilogue 400 + 700 woff2 files exist in fonts/ with OFL.txt licence alongside"
    - "All five CSS files exist (tokens, base, layout, components, animations) — files 03–05 may be empty stubs but must be present"
  artifacts:
    - path: "css/tokens.css"
      provides: "All design tokens as CSS custom properties under :root"
      contains: "--color-hot-pink"
      contains_also: "--gradient-brand"
      min_lines: 80
    - path: "css/base.css"
      provides: "Reset, fonts, scroll behaviour, body defaults"
      contains: "@font-face"
      contains_also: "Epilogue"
      min_lines: 40
    - path: "css/layout.css"
      provides: "Layout stub (Phase 1 minimal — extended in plan 02)"
    - path: "css/components.css"
      provides: "Components stub (Phase 1 minimal — populated in plan 02)"
    - path: "css/animations.css"
      provides: "Animations stub (Phase 1 minimal — populated in plan 02)"
    - path: "fonts/epilogue-400.woff2"
      provides: "Epilogue Regular weight binary"
    - path: "fonts/epilogue-700.woff2"
      provides: "Epilogue Bold weight binary"
    - path: "fonts/OFL.txt"
      provides: "Open Font License attribution (required by OFL)"
  key_links:
    - from: "css/base.css @font-face"
      to: "fonts/epilogue-400.woff2 + fonts/epilogue-700.woff2"
      via: "src: url('/fonts/...')"
      pattern: "url\\('/fonts/epilogue-(400|700)\\.woff2'\\)"
    - from: "css/base.css body"
      to: "css/tokens.css custom properties"
      via: "var(--color-linen), var(--color-midnight), var(--font-primary), var(--text-body)"
      pattern: "var\\(--color-linen\\)"
---

<objective>
Establish the design-token foundation and font assets the rest of Phase 1 (and every later phase) consumes. This plan creates the flat project tree (FOUND-01), writes `css/tokens.css` with every token from DESIGN-TOKENS.md (FOUND-02), drops Andy Bell's modern CSS reset plus body defaults plus `--measure` cap into `css/base.css` (FOUND-03), self-hosts Epilogue 400/700 woff2 in `fonts/` and wires `@font-face` with `font-display: swap` (FOUND-04 per D-03 — supersedes the Google Fonts wording), and stubs the remaining three CSS files so plan 02 can append cleanly.

Purpose: Every later phase reads from `var(--token-name)`. No phase ships before the token surface and the font face are real, otherwise the cascade is broken at the root.

Output: `css/tokens.css` (full token set), `css/base.css` (reset + fonts + scroll behaviour + body defaults), three CSS stub files, two woff2 binaries plus OFL.txt licence in `fonts/`.
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
@.planning/seeds/DESIGN-TOKENS.md
@.planning/seeds/ARCHITECTURE.md
@CLAUDE.md

<interfaces>
<!-- Tokens this plan establishes — every later plan and phase consumes via var(--name). -->
<!-- Source of truth: .planning/seeds/DESIGN-TOKENS.md lines 15–124. Copy verbatim. -->

Colour tokens (OKLCH only — never hex):
  --color-hot-pink, --color-signal-orange, --color-warm-amber,
  --color-deep-teal, --color-rich-purple, --color-cool-indigo,
  --color-midnight, --color-linen,
  --color-true-white, --color-true-black,
  --color-link-sage, --color-link-pine,
  --gradient-brand (declared, NOT painted in Phase 1 — sticky tab only in Phase 4)

Type tokens:
  --font-primary: 'Epilogue', system-ui, sans-serif;
  --text-display, --text-headline, --text-title, --text-body, --text-label
  --lh-display, --lh-headline, --lh-title, --lh-body, --lh-label
  --ls-display, --ls-headline, --ls-label
  --measure: 65ch

Spacing: --space-xs (8px) through --space-section (120px)
Radius:  --radius-sm, --radius-md, --radius-lg, --radius-cutout (16px), --radius-pill (999px)
Shadow:  --shadow-float (sticky tab only)
Transition: --transition-button, --transition-nav, --transition-reveal, --transition-tab

@font-face contract (consumed by every page render):
  font-family: 'Epilogue';
  weight: 400 (regular) and 700 (bold) — NEVER 500;
  font-display: swap;
  src: url('/fonts/epilogue-{400|700}.woff2') format('woff2');
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create flat project tree and download Epilogue woff2 + OFL licence</name>
  <files>fonts/epilogue-400.woff2, fonts/epilogue-700.woff2, fonts/OFL.txt, css/.gitkeep, js/.gitkeep, images/.gitkeep</files>
  <read_first>
    - .planning/seeds/ARCHITECTURE.md (file-structure section — flat tree contract)
    - .planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md (D-03, D-04 — font hosting decisions)
    - .planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md (Standard Stack section, Pitfall 6 absolute paths, Open Question 3 subset choice)
  </read_first>
  <action>
    Create the flat project tree at the repo root. Required directories: `css/`, `js/`, `fonts/`, `images/`. The repo is bare except for the existing holding `index.html` (which plan 02 overwrites — do not touch in this task).

    Create empty marker files so the directories are tracked: `css/.gitkeep`, `js/.gitkeep`, `images/.gitkeep`. The `fonts/` directory is populated below — no .gitkeep needed once binaries are in.

    Download Epilogue woff2 binaries for weights 400 and 700 (Latin subset preferred per RESEARCH.md Open Question 3 — keeps file size to ~50–70KB total versus 100–160KB for full charset; Kris's content is Latin-only).

    Source URL pattern (Fontsource OSS, OFL-licensed, current as of 2026-04-29):
      https://cdn.jsdelivr.net/fontsource/fonts/epilogue@latest/latin-400-normal.woff2
      https://cdn.jsdelivr.net/fontsource/fonts/epilogue@latest/latin-700-normal.woff2

    Save them as:
      fonts/epilogue-400.woff2
      fonts/epilogue-700.woff2

    If the Fontsource CDN URLs above 404 at execution time, fall back to:
      https://github.com/fontsource/font-files/raw/main/fonts/google/epilogue/files/epilogue-latin-400-normal.woff2
      https://github.com/fontsource/font-files/raw/main/fonts/google/epilogue/files/epilogue-latin-700-normal.woff2

    Use `curl -L -o fonts/epilogue-400.woff2 <URL>` (and same for 700). The `-L` flag follows redirects (jsdelivr / GitHub raw both redirect). Verify each file is non-empty and starts with the woff2 magic bytes (`wOF2`):
      head -c 4 fonts/epilogue-400.woff2  # should output: wOF2
      head -c 4 fonts/epilogue-700.woff2  # should output: wOF2

    Reject any download under 5KB (likely an HTML error page, not a font). Reject any download whose first 4 bytes are not `wOF2`.

    Download the OFL licence text (required attribution for OFL fonts):
      curl -L -o fonts/OFL.txt https://raw.githubusercontent.com/fontsource/font-files/main/fonts/google/epilogue/OFL.txt

    If that URL 404s, write a minimal SIL OFL 1.1 header into `fonts/OFL.txt` referencing "Copyright 2020 The Epilogue Project Authors (https://github.com/Etbon/Epilogue)" and the SIL Open Font License Version 1.1 standard text (search-engine-fetchable via `curl -L https://openfontlicense.org/documents/OFL.txt -o fonts/OFL.txt`).

    Do NOT touch the existing root `index.html` in this task. Plan 02 overwrites it after the shell is ready. Per CONTEXT.md D-01, the holding-page index.html on `main` is preserved by branch isolation, not by file copy.

    Do NOT add a Google Fonts `<link>` anywhere — D-03 is locked: self-host only.
  </action>
  <verify>
    <automated>test -d css && test -d js && test -d fonts && test -d images && test -f fonts/epilogue-400.woff2 && test -f fonts/epilogue-700.woff2 && test -f fonts/OFL.txt && [ "$(head -c 4 fonts/epilogue-400.woff2)" = "wOF2" ] && [ "$(head -c 4 fonts/epilogue-700.woff2)" = "wOF2" ] && [ "$(stat -f%z fonts/epilogue-400.woff2 2>/dev/null || stat -c%s fonts/epilogue-400.woff2)" -gt 5000 ] && [ "$(stat -f%z fonts/epilogue-700.woff2 2>/dev/null || stat -c%s fonts/epilogue-700.woff2)" -gt 5000 ]</automated>
  </verify>
  <acceptance_criteria>
    - `css/`, `js/`, `fonts/`, `images/` directories exist at repo root
    - `fonts/epilogue-400.woff2` exists, starts with bytes `wOF2`, is >5KB
    - `fonts/epilogue-700.woff2` exists, starts with bytes `wOF2`, is >5KB
    - `fonts/OFL.txt` exists and is non-empty
    - `index.html` at repo root is UNCHANGED (still the holding page) — verifiable via `git diff index.html` returning empty
    - No `<link>` to fonts.googleapis.com or fonts.gstatic.com appears anywhere in the repo: `grep -r "fonts.googleapis\\|fonts.gstatic" .` returns no matches
  </acceptance_criteria>
  <done>Flat project tree exists; Epilogue 400 + 700 woff2 binaries are present and valid; OFL licence text is committed; no Google Fonts dependency anywhere.</done>
</task>

<task type="auto">
  <name>Task 2: Write css/tokens.css with the full token set from DESIGN-TOKENS.md</name>
  <files>css/tokens.css</files>
  <read_first>
    - .planning/seeds/DESIGN-TOKENS.md (lines 15–124 — the :root block is the source of truth)
    - .planning/phases/01-foundations-deploy-pipeline/01-UI-SPEC.md (Color, Typography, Spacing tables — token names + values)
    - .planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md (Pattern 2 token convention, Open Question 2 — declare ALL tokens even if Phase 1 only uses some)
  </read_first>
  <action>
    Create `css/tokens.css`. Single `:root { ... }` block declaring every token from DESIGN-TOKENS.md verbatim. Section the file with the same comment headers DESIGN-TOKENS.md uses (COLOUR, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TRANSITIONS).

    Copy these declarations verbatim (every token must appear, including ones not painted in Phase 1):

    Colour (OKLCH only — never hex, never rgb):
      --color-hot-pink:      oklch(52% 0.28 0);
      --color-signal-orange: oklch(58% 0.22 35);
      --color-warm-amber:    oklch(68% 0.18 65);
      --color-deep-teal:     oklch(50% 0.09 195);
      --color-rich-purple:   oklch(38% 0.18 310);
      --color-cool-indigo:   oklch(50% 0.18 280);
      --color-midnight:      oklch(24% 0.04 275);
      --color-linen:         oklch(97% 0.01 80);
      --color-true-white:    oklch(100% 0 0);
      --color-true-black:    oklch(0% 0 0);
      --color-link-sage:     oklch(58% 0.08 160);
      --color-link-pine:     oklch(42% 0.08 160);

    Brand gradient (declared but NEVER painted in Phase 1 — Phase 4 sticky tab only):
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

    Typography:
      --font-primary: 'Epilogue', system-ui, sans-serif;
      --text-display:  clamp(3rem, 7vw, 5.5rem);
      --text-headline: clamp(1.75rem, 3.5vw, 2.75rem);
      --text-title:    clamp(1.25rem, 2vw, 1.5rem);
      --text-body:     clamp(1rem, 1.5vw, 1.1rem);
      --text-label:    0.8rem;
      --lh-display: 1; --lh-headline: 1.1; --lh-title: 1.2; --lh-body: 1.7; --lh-label: 1.4;
      --ls-display: -0.02em; --ls-headline: -0.01em; --ls-label: 0.1em;
      --measure: 65ch;

    Spacing:
      --space-xs: 8px; --space-sm: 16px; --space-md: 32px;
      --space-lg: 64px; --space-xl: 96px; --space-section: 120px;

    Radius:
      --radius-sm: 4px; --radius-md: 10px; --radius-lg: 20px;
      --radius-cutout: 16px; --radius-pill: 999px;

    Shadows:
      --shadow-float: 0 8px 32px oklch(24% 0.04 275 / 0.15);
      /* Use only on: floating sticky tab. Never on: cards, callouts, hover states. */

    Transitions:
      --transition-button: background-color 180ms ease-out, color 180ms ease-out;
      --transition-nav:    background-color 200ms ease-out, color 200ms ease-out;
      --transition-reveal: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1),
                           transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
      --transition-tab:    transform 300ms cubic-bezier(0.16, 1, 0.3, 1);

    Add a top-of-file comment: `/* Look Twice — design tokens. Source: .planning/seeds/DESIGN-TOKENS.md. Do not hard-code values elsewhere — reference via var(--name). */`

    Do NOT include any selector other than `:root`. Do NOT add component CSS, resets, or media queries — those go in `base.css` / `layout.css` / `components.css` / `animations.css` (FOUND-02 + D-06 cascade contract).

    Do NOT include hex / rgb / hsl colour values anywhere in this file. OKLCH only.
  </action>
  <verify>
    <automated>test -f css/tokens.css && grep -q "^:root" css/tokens.css && grep -q "\\-\\-color-hot-pink:[[:space:]]*oklch(52% 0.28 0)" css/tokens.css && grep -q "\\-\\-color-midnight:[[:space:]]*oklch(24% 0.04 275)" css/tokens.css && grep -q "\\-\\-color-linen:[[:space:]]*oklch(97% 0.01 80)" css/tokens.css && grep -q "\\-\\-gradient-brand:" css/tokens.css && grep -q "\\-\\-font-primary:[[:space:]]*'Epilogue'" css/tokens.css && grep -q "\\-\\-text-display:" css/tokens.css && grep -q "\\-\\-space-section:[[:space:]]*120px" css/tokens.css && grep -q "\\-\\-radius-cutout:[[:space:]]*16px" css/tokens.css && grep -q "\\-\\-shadow-float:" css/tokens.css && grep -q "\\-\\-transition-nav:" css/tokens.css && grep -q "\\-\\-measure:[[:space:]]*65ch" css/tokens.css && ! grep -E "#[0-9a-fA-F]{3,8}" css/tokens.css && ! grep -E "rgb\\(|hsl\\(" css/tokens.css</automated>
  </verify>
  <acceptance_criteria>
    - File `css/tokens.css` exists
    - Single `:root { ... }` block — no other selectors
    - Every token name from DESIGN-TOKENS.md present (12 colours + gradient + 5 type sizes + 5 line heights + 3 letter spacings + measure + 6 spacings + 5 radii + shadow-float + 4 transitions = 41 declarations minimum)
    - All colour values use `oklch(...)` notation — zero hex / rgb / hsl matches via grep
    - Gradient declared via `var(--color-...)` references (not duplicated OKLCH literals)
    - File has top-of-file comment referencing DESIGN-TOKENS.md as source of truth
    - File length ≥ 80 lines (rough proxy for completeness — actual is ~120 with comments + spacing)
  </acceptance_criteria>
  <done>Every design token from DESIGN-TOKENS.md is declared in `css/tokens.css` under `:root`; no hard-coded hex anywhere; gradient declared but unpainted; file is loadable as a stylesheet.</done>
</task>

<task type="auto">
  <name>Task 3: Write css/base.css (reset + @font-face + scroll behaviour + body defaults) and stub the three remaining CSS files</name>
  <files>css/base.css, css/layout.css, css/components.css, css/animations.css</files>
  <read_first>
    - css/tokens.css (from task 2 — must exist before this task references its tokens)
    - .planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md (Pattern 1 self-hosted woff2, Andy Bell reset code block, Smooth scroll with reduced-motion guard, Body and measure cap, :focus-visible)
    - .planning/phases/01-foundations-deploy-pipeline/01-UI-SPEC.md (CSS File Map — what lives in each of the five files in Phase 1)
    - .planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md (D-06 cascade order)
  </read_first>
  <action>
    Create `css/base.css` with five sections in this order:

    1. Andy Bell modern minimal CSS reset (verbatim from RESEARCH.md "Andy Bell 'more modern' CSS reset" code block, ~25 lines):
       - `*, *::before, *::after { box-sizing: border-box; }`
       - `html { -moz-text-size-adjust: none; -webkit-text-size-adjust: none; text-size-adjust: none; }`
       - `body, h1, h2, h3, h4, p, figure, blockquote, dl, dd { margin-block-end: 0; }`
       - `ul[role='list'], ol[role='list'] { list-style: none; }`
       - `body { min-height: 100vh; line-height: 1.5; }`
       - `h1, h2, h3, h4, button, input, label { line-height: 1.1; }`
       - `h1, h2, h3, h4 { text-wrap: balance; }`
       - `a:not([class]) { text-decoration-skip-ink: auto; color: currentColor; }`
       - `img, picture { max-width: 100%; display: block; }`
       - `input, button, textarea, select { font-family: inherit; font-size: inherit; }`
       - `textarea:not([rows]) { min-height: 10em; }`
       - `:target { scroll-margin-block: 5ex; }`

    2. Two `@font-face` blocks — verbatim:

       @font-face {
         font-family: 'Epilogue';
         font-style: normal;
         font-weight: 400;
         font-display: swap;
         src: url('/fonts/epilogue-400.woff2') format('woff2');
       }

       @font-face {
         font-family: 'Epilogue';
         font-style: normal;
         font-weight: 700;
         font-display: swap;
         src: url('/fonts/epilogue-700.woff2') format('woff2');
       }

       Use absolute paths starting with `/fonts/` (per RESEARCH.md Pitfall 6 — Cloudflare Pages serves from root, absolute paths are stable across previews and deeplinks).

    3. Smooth scroll with reduced-motion guard:

       html { scroll-behavior: smooth; }

       @media (prefers-reduced-motion: reduce) {
         html { scroll-behavior: auto; }
       }

    4. Body defaults consuming tokens (no hard-coded values):

       body {
         background: var(--color-linen);
         color: var(--color-midnight);
         font-family: var(--font-primary);
         font-size: var(--text-body);
         line-height: var(--lh-body);
         font-weight: 400;
       }

    5. Measure cap on running text + global focus ring:

       p, .measure {
         max-width: var(--measure);
       }

       :focus-visible {
         outline: 2px solid var(--color-hot-pink);
         outline-offset: 3px;
       }

    Add a top-of-file comment: `/* Look Twice — base CSS. Reset + @font-face + scroll behaviour + body defaults. Cascade-order: loaded after tokens.css, before layout.css. */`

    Then create three stub files. Each must exist (so plan 02 and later phases can append) and contain only a header comment. Stub contents:

    `css/layout.css`:
      /* Look Twice — layout. Page shell, sections, nav layout, footer layout. Phase 1 plan 02 populates the nav and shell layout; Phase 2+ populate sections. */

    `css/components.css`:
      /* Look Twice — components. Nav, buttons, chips, footer, sticky tab, cutout mask. Phase 1 plan 02 populates the nav components; Phase 2+ append sections. */

    `css/animations.css`:
      /* Look Twice — animations. Nav transition, overlay slide, scroll reveal. Phase 1 plan 02 populates the nav transition and overlay; Phase 2 adds reveal. */

    Do NOT add any other content to the three stubs. Plan 02 needs the files to exist but empty.

    Do NOT add `@import` to any CSS file — RESEARCH.md anti-pattern: each `@import` is a render-blocking sequential request. Loading order is enforced via `<link>` tags in `index.html` (plan 02's job).
  </action>
  <verify>
    <automated>test -f css/base.css && test -f css/layout.css && test -f css/components.css && test -f css/animations.css && grep -q "box-sizing: border-box" css/base.css && grep -cE "@font-face" css/base.css | grep -q "^2$" && grep -q "font-family: 'Epilogue'" css/base.css && grep -q "font-weight: 400" css/base.css && grep -q "font-weight: 700" css/base.css && grep -q "font-display: swap" css/base.css && grep -q "url('/fonts/epilogue-400.woff2')" css/base.css && grep -q "url('/fonts/epilogue-700.woff2')" css/base.css && grep -q "scroll-behavior: smooth" css/base.css && grep -q "prefers-reduced-motion: reduce" css/base.css && grep -q "scroll-behavior: auto" css/base.css && grep -q "var(--color-linen)" css/base.css && grep -q "var(--measure)" css/base.css && grep -q ":focus-visible" css/base.css && ! grep -q "@import" css/base.css && ! grep -q "@import" css/layout.css && ! grep -q "@import" css/components.css && ! grep -q "@import" css/animations.css && ! grep -q "font-weight: 500" css/base.css</automated>
  </verify>
  <acceptance_criteria>
    - `css/base.css` exists and contains: Andy Bell reset rules (box-sizing, text-wrap balance, image max-width, etc.), exactly two `@font-face` blocks (Epilogue 400 and Epilogue 700, both `font-display: swap`, both absolute `/fonts/...` paths), smooth-scroll declaration with reduced-motion guard, body defaults using tokens, `--measure` cap on `<p>`, `:focus-visible` ring
    - `css/layout.css`, `css/components.css`, `css/animations.css` all exist with header comment only (plan 02 populates)
    - Zero `@import` rules anywhere — cascade is enforced via `<link>` order in `index.html`
    - Zero `font-weight: 500` declarations anywhere (hard ban from CLAUDE.md)
    - Zero hard-coded colour hex / rgb in `css/base.css` — body uses `var(--color-...)` only
    - `:focus-visible` outline uses `var(--color-hot-pink)` per UI-SPEC accessibility contract
  </acceptance_criteria>
  <done>Five CSS files exist in cascade order; base.css has reset + fonts + scroll + body defaults wired through tokens; three stubs ready for plan 02 to append.</done>
</task>

</tasks>

<verification>
Phase-1 plan-01 success state (run as a single sequence at the end):

```bash
# 1. Tree exists
test -d css && test -d js && test -d fonts && test -d images

# 2. All five CSS files exist
ls css/tokens.css css/base.css css/layout.css css/components.css css/animations.css

# 3. Fonts present and valid
[ "$(head -c 4 fonts/epilogue-400.woff2)" = "wOF2" ]
[ "$(head -c 4 fonts/epilogue-700.woff2)" = "wOF2" ]
test -f fonts/OFL.txt

# 4. Tokens declared (spot-check 6 critical tokens)
grep -q "color-hot-pink" css/tokens.css
grep -q "color-midnight" css/tokens.css
grep -q "color-linen" css/tokens.css
grep -q "gradient-brand" css/tokens.css
grep -q "font-primary.*Epilogue" css/tokens.css
grep -q "transition-nav" css/tokens.css

# 5. No Google Fonts anywhere
! grep -r "fonts.googleapis\|fonts.gstatic" .

# 6. No font-weight 500 anywhere in css/
! grep -r "font-weight:[[:space:]]*500" css/

# 7. No hex colour in tokens.css (OKLCH only)
! grep -E "#[0-9a-fA-F]{3,8}" css/tokens.css

# 8. Holding index.html untouched
git diff --quiet index.html
```

All eight checks must pass.
</verification>

<success_criteria>
- Flat project tree (FOUND-01) exists at repo root: index.html (still holding page), css/, js/, fonts/, images/
- css/tokens.css declares every token from DESIGN-TOKENS.md (FOUND-02) — 41+ declarations under :root, OKLCH-only, gradient included
- css/base.css has Andy Bell modern reset, body line-length cap (--measure: 65ch), body typography defaults consuming tokens, smooth-scroll with reduced-motion guard (FOUND-03)
- Epilogue 400 + 700 self-hosted woff2 + OFL.txt licence in fonts/, with @font-face blocks in css/base.css using font-display: swap and absolute /fonts/ paths (FOUND-04 per D-03)
- Three stub files (css/layout.css, css/components.css, css/animations.css) exist for plan 02 to append
- No Google Fonts request, no @import chains, no font-weight 500, no hard-coded hex
- Holding index.html on this branch is unchanged (plan 02 overwrites)
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundations-deploy-pipeline/01-01-SUMMARY.md` documenting: tokens declared (count), font weights wired, base CSS rules added, files stubbed for plan 02. Note any source-URL substitution made for Epilogue download. Flag the open question on Latin subset vs full charset (resolved in favour of Latin per RESEARCH.md Open Question 3).
</output>
