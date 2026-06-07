# Phase 1: Foundations & Deploy Pipeline - Research

**Researched:** 2026-04-29
**Domain:** Static site foundations on Cloudflare Pages — semantic HTML shell, design-token CSS, self-hosted font loading, sticky nav with mobile overlay, branch-based preview deploy.
**Confidence:** HIGH

## Summary

Phase 1 is foundation work: ship a semantic, token-driven page shell from `new-site` to a Cloudflare Pages preview URL on every push, with a working sticky top nav (transparent over hero, Linen on first scroll) and mobile hamburger overlay. The five-file CSS split, OKLCH design tokens, self-hosted Epilogue, six empty `<section>` anchors, and `_headers` for cache + basic security are the deliverables. No section bodies, no hero, no scroll reveal — those are Phases 2–4.

The plan is constrained sharply by upstream artefacts. CONTEXT.md locks fourteen decisions (self-host fonts, vanilla CSS only, six sections not eight, six-section anchor list with three nav links, no holding-page copy on `new-site`, etc.). UI-SPEC.md gives exact CSS for the nav and overlay. ARCHITECTURE.md and DESIGN-TOKENS.md fix file structure and token names. The planner's job is to sequence these into tasks, not to choose between options on the locked surfaces.

**Primary recommendation:** Execute the spec — do not invent. Implementation surface for Claude's discretion is narrow: CSS reset choice (Andy Bell's "more modern" reset is the right pick), `_headers` cache durations, font subset strategy (Latin subset is fine; full charset still under budget), hamburger icon technique (CSS lines preferred — zero bytes, scales cleanly).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Holding page handover:**
- D-01: `main` branch is untouched and continues serving the existing holding page (`index.html` with DM Sans + Syne + warm gradient) until cutover. On `new-site`, Phase 1 overwrites `index.html` with the new shell. The holding page is preserved only on `main`. No `holding.html` copy on `new-site`.
- D-02: Cutover (DEPLOY-03, Phase 5) is the only moment `main` is touched.

**Font hosting:**
- D-03: Self-host Epilogue 400 and 700 as woff2 in `fonts/`. Use `@font-face` with `font-display: swap`. No Google Fonts request, no `preconnect` to fonts.googleapis.com / fonts.gstatic.com. Removes external DNS lookup, helps PERF budget, keeps domain self-contained.
- D-04: Source files: download Epilogue from Google Fonts repo or fontsource. Subset to Latin if straightforward; otherwise ship full character set (still under budget).

**CSS file structure:**
- D-05: Vanilla CSS only. No Tailwind, no preprocessor, no PostCSS, no build step. (Tailwind explicitly rejected.)
- D-06: Five-file split per ARCHITECTURE.md: `css/tokens.css`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/animations.css`. Loaded via separate `<link>` tags in `index.html` head, in that order (tokens → base → layout → components → animations).

**Cloudflare Pages wiring:**
- D-07: Cloudflare Pages is already connected to the GitHub repo and auto-deploys on push to `new-site`. No CI/CD code needed in the repo for the pipeline itself.
- D-08: Commit Pages config files to the repo (source of truth): `_headers` for cache + security headers, `_redirects` if needed. No `wrangler.toml` (not using Workers in V1). Phase 1 task: define minimal `_headers` (font caching, basic security headers) — leave room for Phase 5 to harden.
- D-09: Verify the auto-deploy by pushing the Phase 1 shell and confirming the Pages preview URL serves it. Capture the preview URL in STATE.md so later phases reference one stable URL.

**Section anchor list:**
- D-10: **Six** `<section>` blocks, not eight. HOMEPAGE-SPEC is the source of truth. Section ids in document order: `#hero`, `#situation`, `#approach`, `#work`, `#services`, `#contact`.
- D-11: ROADMAP.md Phase 1 success criterion #2 ("eight empty `<section>` anchors") and REQUIREMENTS.md FOUND-05 ("eight `<section>` blocks") are stale and need correcting to "six" as part of Phase 1 work — small doc-fix subtask included in plan.
- D-12: Nav links — three only: WORK / APPROACH / CONTACT — anchoring to `#work`, `#approach`, `#contact`. Situation and Services sections are not in nav.

**Phase 1 preview content:**
- D-13: Section bodies stay empty in Phase 1. Each `<section id="...">` is a bare anchor only — no placeholder copy, no "PHASE 2 GOES HERE" labels, no h2 stubs.
- D-14: Exception: `<nav>` is fully built (sticky behaviour + mobile hamburger overlay) and `<footer>` may carry minimal placeholder so the page has a visible bottom edge — leave to planner. Below-the-hero sections collapse to zero height in Phase 1, that's fine.

### Claude's Discretion

- CSS reset choice (modern minimal — Andy Bell style — vs hand-roll). Both fit FOUND-03; planner picks.
- Exact `_headers` rules for Phase 1 (cache-control durations, etc.). Phase 5 hardens.
- Whether to subset Epilogue woff2 to Latin or ship full character set.
- Hamburger icon: SVG inline vs CSS-drawn lines. Trivial.
- Where the favicon comes from in Phase 1 (placeholder ok, real one for Phase 5).

### Deferred Ideas (OUT OF SCOPE)

- `_headers` hardening (HSTS, CSP, etc.) — Phase 5.
- Favicon + apple-touch-icon — Phase 5 (SEO-03).
- `robots.txt`, JSON-LD ProfessionalService schema, og: meta — Phase 5 (SEO-01..03).
- Performance + Lighthouse verification — Phase 5 (PERF-01..04).
- Sticky tab CSS + JS — Phase 4 (TAB-01..07, JS-03). File `js/main.js` exists from Phase 1 but tab logic is appended in Phase 4.
- Hero, situation, work, services, contact, footer content — Phases 2–4.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Project structure follows seeds/ARCHITECTURE.md (flat tree: index.html, css/, js/, images/) | ARCHITECTURE.md §File Structure — directory layout fixed |
| FOUND-02 | `css/tokens.css` implements every token from DESIGN-TOKENS.md | DESIGN-TOKENS.md §CSS Custom Properties — full token block |
| FOUND-03 | Base CSS reset, semantic typography defaults, body line-length cap (`--measure: 65ch`) | Andy Bell "more modern" reset (verified MDN + piccalil.li) |
| FOUND-04 | Epilogue (400, 700) loads with font-display: swap | Self-host via `@font-face` per D-03 (overrides original Google-Fonts wording in REQUIREMENTS.md) |
| FOUND-05 | Single `index.html` carries `<main>`, **six** `<section>` blocks (D-11 corrects "eight"), `<nav>`, `<footer>`, one H1 reserved for hero | HOMEPAGE-SPEC §Page Structure (canonical) |
| NAV-01 | Sticky top nav, transparent → Linen fill on first scroll (200ms) | UI-SPEC §1 + DESIGN-TOKENS.md §Navigation — exact CSS provided |
| NAV-02 | Wordmark left, three links right (WORK / APPROACH / CONTACT) anchoring to on-page sections | UI-SPEC §1 HTML structure |
| NAV-03 | Hover/active state — Hot Pink underline (2px, 3px offset), no background fill change | DESIGN-TOKENS.md §Navigation — `::after` pseudo-element grow |
| NAV-04 | Mobile nav — hamburger triggers full-width Midnight overlay sliding down (280ms ease-out-quart) with stacked Linen-text links | UI-SPEC §2 — exact CSS + JS provided |
| NAV-05 | Hamburger button has aria-expanded / aria-controls; close button top-right of overlay | UI-SPEC §Accessibility Contract — aria pattern locked |
| DEPLOY-01 | Cloudflare Pages project configured to build/serve from `new-site` branch | Cloudflare Pages docs (verified) — already auto-wired per D-07 |
| DEPLOY-02 | Preview URL accessible for accessibility/performance verification before cutover | D-09 — capture URL in STATE.md after first push |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

These directives have the same authority as locked decisions. Plans must comply.

- **Tech stack**: Plain HTML + CSS + minimal vanilla JS — no frameworks, no preprocessors, no bundlers, no npm deps for V1.
- **Hosting**: Cloudflare Pages, static deploy from `new-site`. `looktwice.uk` already on Cloudflare DNS.
- **Branch policy**: All work on `new-site`. `main` is the live holding page — do not touch until cutover.
- **Typography**: Epilogue only, weights 400 and 700. No 500. No second family. font-display: swap.
- **Accessibility**: WCAG AA minimum on every surface. prefers-reduced-motion respected. One H1 per page (hero) — and the hero ships in Phase 2, so Phase 1 must not emit any H1.
- **Performance**: LCP < 2.5s, CLS < 0.1, FID < 100ms, page weight < 500KB excluding images.
- **Design bans (hard stops)**: no card shadows, no gradient text, no glassmorphism, no mid-tone greys, no decorative card grids, no font-weight 500, no em-dashes in copy.
- **Gradient discipline**: brand gradient appears only on the floating sticky tab. Phase 1 must declare `--gradient-brand` in `tokens.css` but never paint it on a surface.
- **GSD workflow enforcement**: All edits must go through a GSD command — Phase 1 work runs under `/gsd:execute-phase`.

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|---|---|---|---|
| Plain HTML5 | living standard | Page shell | Constraint (no framework) |
| Plain CSS (custom properties) | CSS Color 4, CSS Custom Properties Level 1 | Design tokens, layout, components | Constraint (no preprocessor) |
| Vanilla JS (ES2020+) | ES2020 minimum (Cloudflare Pages serves any modern target) | Three behaviours: nav scroll toggle (P1), sticky tab entrance (P4), scroll reveal (P2) | Constraint (no libraries) |
| Cloudflare Pages | current platform | Static hosting + branch previews | Already connected (D-07) |
| Epilogue (Etienne Aubert Bonn / Tunera) | OFL — woff2 from fontsource | Brand typeface, 400 + 700 | Per D-03/D-04 |

### Supporting (for this phase only)

| Asset | Purpose | When to Use |
|---|---|---|
| `_headers` (Cloudflare Pages plain-text file) | Cache-Control on fonts + CSS, basic security headers | Commit at repo root for Phase 1 |
| `_redirects` (Cloudflare Pages plain-text file) | Path rewrites if needed | Skip in Phase 1 — single page, no rewrites |
| Andy Bell "more modern" CSS reset | Strip browser defaults sanely | Drop into top of `css/base.css` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff (rejected for Phase 1) |
|---|---|---|
| Self-hosted Epilogue | Google Fonts CDN | External DNS lookup adds ~50–200ms cold-load; FOUND-04 wording mentions Google Fonts but D-03 supersedes (PERF win) |
| Andy Bell reset | normalize.css, modern-normalize, hand-rolled | Andy Bell is targeted at 2025-era browsers; normalize is verbose for our needs |
| `_headers` text file | Worker for headers | Worker is overkill — V1 has no dynamic logic |
| CSS-drawn hamburger lines | Inline SVG hamburger | Both fine; CSS lines = 0 bytes, scales perfectly. SVG is fine if you prefer |
| `font-display: optional` | `font-display: swap` | Optional reduces CLS more aggressively but can show fallback for the entire session if network is slow; swap is the spec from CLAUDE.md and avoids that tradeoff |

**Installation:** None — no npm, no install. Just download woff2 files into `fonts/` once.

**Version verification (per CLAUDE.md "no npm deps"):** No registry packages to verify. Epilogue source file: download Epilogue 400 and 700 woff2 from `https://github.com/fontsource/font-files/tree/main/fonts/google/epilogue` (OFL licensed) or `https://fonts.google.com/specimen/Epilogue`. Confirm OFL.txt is committed alongside the woff2 files.

## Architecture Patterns

### Recommended Project Structure (post-Phase 1)

```
looktwice.uk/
├── index.html              Page shell — six empty <section> + nav + footer
├── _headers                Cloudflare Pages cache + security headers
├── css/
│   ├── tokens.css          ALL custom properties from DESIGN-TOKENS.md
│   ├── base.css            CSS reset + @font-face + body defaults + scroll-behavior
│   ├── layout.css          <main>, section, nav, footer layout (flex, sticky)
│   ├── components.css      .nav, .nav-link, .nav-overlay, .footer, button/chip stubs
│   └── animations.css      Reveal stub, nav transition, overlay slide, prefers-reduced-motion guards
├── js/
│   └── main.js             Phase 1: nav scroll toggle + hamburger overlay open/close
├── fonts/
│   ├── epilogue-400.woff2
│   ├── epilogue-700.woff2
│   └── OFL.txt             Open Font License — required attribution
└── images/                 (empty in Phase 1 — Phase 2 adds Kris portrait)
```

CSS link order in `<head>` (must be exact, cascade depends on it):
```html
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/base.css">
<link rel="stylesheet" href="/css/layout.css">
<link rel="stylesheet" href="/css/components.css">
<link rel="stylesheet" href="/css/animations.css">
```

### Pattern 1: Self-hosted woff2 with preload + font-display: swap

**What:** Two `@font-face` declarations in `css/base.css`, one `<link rel="preload">` in `<head>` for the regular weight (the one that paints on first render).

**When to use:** Always for V1 — D-03 locks self-hosting.

**Pattern:**
```html
<!-- in <head>, before stylesheets -->
<link rel="preload" href="/fonts/epilogue-400.woff2" as="font" type="font/woff2" crossorigin>
```

```css
/* in css/base.css */
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
```

Preload only the 400 weight in Phase 1 — that's what the nav links use. Phase 2 may want to also preload 700 (hero display headline). Don't preload both yet; one preload is enough and over-preloading hurts LCP.

The `crossorigin` attribute is mandatory on the preload tag for fonts (even same-origin) — without it the browser refetches the file. Verified: web.dev preload-fonts guidance.

### Pattern 2: CSS custom properties as design tokens

**What:** Every visual decision lives in `--token-name`. Components reference `var(--token-name)`. Never hard-code hex, px values, or durations outside `tokens.css`.

**When to use:** Always — FOUND-02 requires it.

**Convention (from DESIGN-TOKENS.md):**
- Colours: `--color-{name}` — e.g. `--color-hot-pink`, `--color-midnight`, `--color-linen`
- Type sizes: `--text-{role}` — `--text-display`, `--text-body`, `--text-label`
- Line heights: `--lh-{role}` — `--lh-body: 1.7`
- Letter spacing: `--ls-{role}`
- Spacing: `--space-{size}` — `--space-xs/sm/md/lg/xl`, `--space-section`
- Radius: `--radius-{name}` — `--radius-sm/md/lg/cutout/pill`
- Shadows: `--shadow-{role}` — `--shadow-float` (sticky tab only)
- Transitions: `--transition-{role}` — `--transition-nav`, `--transition-button`, `--transition-reveal`, `--transition-tab`
- Gradient: `--gradient-brand` (declared but unused in Phase 1)
- Measure: `--measure: 65ch`

### Pattern 3: Sticky nav with class-toggle on scroll

**What:** Nav is `position: sticky; top: 0; background: transparent` by default. JS toggles `.scrolled` on `window.scrollY > 0`. CSS transitions both `background-color` and `color` over 200ms.

**Spec is locked in UI-SPEC.md §1.** JS pattern:
```js
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 0);
}, { passive: true });
```

`{ passive: true }` is mandatory (JS-06) — tells the browser the listener won't `preventDefault`, so scroll stays on the compositor thread.

### Pattern 4: Mobile hamburger overlay with aria toggling

**What:** `<button class="nav-hamburger" aria-expanded="false" aria-controls="nav-overlay">`. Click toggles `.open` on the overlay AND flips `aria-expanded` and `aria-hidden`. Closing happens on close-button click, any link click inside the overlay, and (recommended) Escape key.

**Spec is locked in UI-SPEC.md §2.** Add Escape handling — UI-SPEC didn't include it but it's a standard a11y expectation:
```js
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) {
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.focus();
  }
});
```

Returning focus to the hamburger button on close is good a11y. The plan should include this even though it's not in NAV-04/05 verbatim.

### Pattern 5: Five-file CSS split (cascade order matters)

**Why split when single-page?** Each later phase touches a predictable file:
- Phase 2 → `components.css` (hero, situation) + `animations.css` (reveal)
- Phase 3 → `components.css` (interrupt, work, services)
- Phase 4 → `components.css` (sticky tab, footer, buttons), `animations.css` (tab entrance)
- Phase 5 → all of them (hardening)

Each file has a single specificity layer; `tokens` is loaded first so cascade resolves variables before they're consumed downstream.

**Phase 1 file contents (per UI-SPEC §CSS File Map):**
- `tokens.css` — full token set, complete in Phase 1
- `base.css` — Andy Bell reset + `@font-face` x 2 + `html { scroll-behavior: smooth }` (with reduced-motion guard) + body defaults + `--measure: 65ch` cap on `<p>`
- `layout.css` — `<main>` flex/grid layout, six `<section>` zero-padding stubs, nav layout, footer min-height
- `components.css` — `.nav` + `.nav-link` + `.nav-wordmark` + `.nav-hamburger` + `.nav-overlay` + `.footer` + button/chip stubs (declared, not exercised)
- `animations.css` — `.reveal` stub, nav `transition`, overlay `transition`, `@media (prefers-reduced-motion: reduce)` guards

### Anti-Patterns to Avoid

- **Inline `<style>` blocks beyond critical CSS.** Five-file split is the contract; inline anywhere except the optional critical-CSS hot path will fragment maintenance.
- **Hard-coded hex colours.** Always `var(--color-...)`. Greppable, swappable.
- **`font-weight: 500`.** Hard ban (CLAUDE.md). Don't accidentally pull it via a bold-italic shortcut.
- **`@import` chains in CSS.** Each `@import` is a render-blocking sequential request. Use `<link>` tags instead.
- **Touching `main` branch.** D-01 + CLAUDE.md branch policy. All Phase 1 work on `new-site`.
- **Adding a build step "just for fonts".** D-05 explicit no-build. Just download woff2 once.
- **Putting a Google Fonts `<link>` in `<head>`.** D-03 explicit — no external DNS lookup. Self-host only.
- **Using `<a href="#">` for the nav wordmark.** Use `href="/"` (UI-SPEC) — links to top of page on click, plays nicely with anchor router.
- **Decorative content in empty sections.** D-13 — bare `<section id>` only.
- **Setting `scroll-behavior: smooth` without the `prefers-reduced-motion` guard.** A11Y-05 expects motion-sensitive users to land instantly.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Sticky positioning | JS-driven `position: fixed` toggle, scroll math | `position: sticky; top: 0` | Native CSS, GPU-composited, no JS bottleneck; widely supported |
| Smooth anchor scroll | JS scroll animation library | `html { scroll-behavior: smooth }` (with reduced-motion guard) | Native CSS handles all anchor links automatically (JS-05) |
| Scroll listener throttling for nav toggle | rAF / debounce / throttle wrapper | `{ passive: true }` listener that just toggles a class | Class toggle is cheap; CSS `transition` does the smoothing. No throttle needed for a single class flip |
| First-scroll detection ("after first scroll") | IntersectionObserver on a sentinel, scroll-history flag | `window.scrollY > 0` toggle | NAV-01 is "transparent at top → Linen on any scroll". `scrollY > 0` is the simplest and exact match |
| CSS reset | Hand-rolling reset rules | Andy Bell modern reset (verified) | 30 lines, covers box-sizing, image defaults, form inheritance, `text-wrap: balance`, scroll-margin |
| Browser font-loading detection | `document.fonts.ready` polling, FontFaceObserver | `font-display: swap` + preload | Native, race-free, no JS |
| Modal focus trap (mobile overlay) | Custom focus-trap library | None needed in Phase 1 | Phase 1's overlay has 4 focusable items (close + 3 links). Default tab order is fine. Add Escape + focus-return to hamburger on close. Real focus trap is a Phase 5 a11y question — flag it but don't build a trap library |
| Mobile body scroll lock | Custom scroll-lock library | None needed in Phase 1 | Overlay covers the viewport; the underlying page scrolls only marginally. Phase 5 may add `body.no-scroll { overflow: hidden }` if real testing shows the issue. Do not pre-optimise |
| `_headers` syntax | Custom build step that writes headers | Plain-text `_headers` file at repo root | Cloudflare reads it on deploy. Verified format below |
| Branch preview deploy | GitHub Actions workflow | None — Cloudflare Pages auto-deploys per D-07 | Already wired |

**Key insight:** The platform (Cloudflare Pages, modern CSS, modern JS APIs) does almost everything Phase 1 needs natively. The temptation in this phase is to over-engineer scroll detection, focus management, or font-loading logic. Resist. Native primitives are the brief.

## Common Pitfalls

### Pitfall 1: FOUC of fallback weight when fonts are slow

**What goes wrong:** With `font-display: swap`, the user sees the fallback (`system-ui, sans-serif`) until the woff2 loads, then text reflows to Epilogue. On a slow connection this can flash. Success criterion #3 explicitly says "no FOUC of a fallback weight."

**Why it happens:** `swap` always shows the fallback first; without preload, the browser doesn't fetch the woff2 until it parses the CSS that declares `@font-face`.

**How to avoid:**
1. `<link rel="preload" as="font" type="font/woff2" crossorigin>` on the 400 weight in `<head>` BEFORE the stylesheet links — fetch starts in parallel with CSS parsing.
2. The `crossorigin` attribute is mandatory for fonts even when same-origin (otherwise the browser refetches).
3. Pick a fallback stack with similar metrics. `system-ui, sans-serif` is fine; if reflow is visible, look at `size-adjust` and `ascent-override` on a fallback `@font-face`.

**Warning signs:** On a throttled "Slow 3G" Network throttle in DevTools, watching the page render, you see two distinct text states. If yes, preload isn't wired correctly or the woff2 file path is wrong.

### Pitfall 2: Cloudflare Pages deploys from main when you wanted only previews

**What goes wrong:** Pushing to `new-site` works, but pushing accidentally to `main` triggers a production deploy that overwrites the holding page.

**Why it happens:** Cloudflare Pages by default deploys both production AND any preview branches. If `main` is the production branch and someone merges `new-site` → `main` prematurely, the holding page is gone.

**How to avoid:**
1. **Verify first:** Confirm in the Cloudflare Pages dashboard that production branch is `main` and that previews include `new-site` (or `*` if all previews are wanted).
2. **Plan a doc-fix subtask:** Phase 1 should re-confirm this state and capture the preview URL in STATE.md (D-09).
3. **Branch protection on main:** Optional but recommended — set `main` to require PR review on GitHub so an accidental local `git push origin main` is rejected.
4. CONTEXT.md D-01 + D-02 lock the rule: never touch `main` until cutover.

**Warning signs:** A push to `new-site` produces no preview URL. Or — worse — the production URL changes content unexpectedly.

### Pitfall 3: H1 in Phase 1 violates "one H1 per page" rule

**What goes wrong:** Tempting to put `<h1>Look Twice</h1>` somewhere (wordmark, footer placeholder) for "semantic completeness". A11Y-01 says one H1 per page (the hero in Phase 2). If Phase 1 emits an H1, when Phase 2 lands the hero H1 the page has two.

**Why it happens:** "But a page should have an H1" muscle memory.

**How to avoid:** Phase 1 emits zero H1s. The wordmark is a `<a class="nav-wordmark">` — no heading element. Footer placeholder has no text. Empty sections have no headings. The first H1 enters with the hero in Phase 2.

**Warning signs:** Lighthouse a11y "Document does not have a `<h1>`" warning. That's expected and correct in Phase 1 — ignore it (Phase 5 audit will pass once Phase 2 lands).

### Pitfall 4: Six vs eight sections inconsistency surviving Phase 1

**What goes wrong:** D-11 says doc-fix to ROADMAP.md SC#2 and REQUIREMENTS.md FOUND-05 (both say "eight"). If those edits don't ship in Phase 1, downstream verifiers and humans will compare the live shell to the docs and flag a mismatch.

**Why it happens:** Easy to skip — feels like a non-essential cleanup.

**How to avoid:** Plan must include an explicit doc-fix task. Edit `.planning/REQUIREMENTS.md` FOUND-05 ("eight" → "six") and `.planning/ROADMAP.md` Phase 1 SC#2 ("eight empty `<section>` anchors" → "six empty `<section>` anchors"). Commit alongside the shell.

**Warning signs:** `gsd:verify-work` flags a doc-vs-implementation drift.

### Pitfall 5: `prefers-reduced-motion` not respected on smooth-scroll

**What goes wrong:** `html { scroll-behavior: smooth }` is great for most users but causes vestibular distress for motion-sensitive users (A11Y-05).

**Why it happens:** `scroll-behavior: smooth` does not auto-respect `prefers-reduced-motion`.

**How to avoid:** Always pair the smooth-scroll declaration with the guard:
```css
html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```
Same for the nav and overlay transitions (UI-SPEC §Accessibility Contract has the patterns).

**Warning signs:** Manually toggle "Reduce motion" in OS settings, click a nav link, observe whether the page jumps instantly (correct) or smooth-scrolls (broken).

### Pitfall 6: Preload tag fetching the wrong URL on the deployed preview

**What goes wrong:** `<link rel="preload" href="fonts/epilogue-400.woff2">` (relative) works locally and on the preview root, but breaks if the page is ever served from a sub-path. Or `href="/fonts/..."` with a leading slash works on Cloudflare Pages root but breaks if a future `/work/[slug]` deeplink is added in V2.

**Why it happens:** Path semantics differ between dev server, preview, and production.

**How to avoid:** Use absolute root paths (`/fonts/epilogue-400.woff2`, `/css/tokens.css`, `/js/main.js`) — Cloudflare Pages serves from root for the entire site. V2 case-study sub-paths still resolve correctly because they're under the same domain.

**Warning signs:** Preview loads CSS/JS but woff2 returns 404 in the Network tab.

### Pitfall 7: Hamburger button needs 44×44 hit target — easy to miss

**What goes wrong:** Hamburger renders a tiny 24×24 icon, button is sized to icon. WCAG 2.5.5 Touch Target requires 44×44 minimum.

**Why it happens:** Default button styling is content-sized.

**How to avoid:** UI-SPEC §Spacing Scale calls this out. `.nav-hamburger { min-width: 44px; min-height: 44px; padding: 10px; background: transparent; border: 0; cursor: pointer; }` — icon stays small visually, hit area is generous.

**Warning signs:** Mobile testers report "had to tap the menu button three times".

### Pitfall 8: Cache-Control on woff2 missing from `_headers`

**What goes wrong:** Browser refetches the woff2 on every navigation. Hurts repeat-visit performance.

**Why it happens:** Cloudflare's default cache headers for static assets are sane but font caching benefits from explicit `immutable`.

**How to avoid:** Minimal Phase 1 `_headers` (Phase 5 hardens):
```
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

/css/*
  Cache-Control: public, max-age=86400

/js/*
  Cache-Control: public, max-age=86400

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
```

Notes:
- `immutable` on fonts is safe because we self-host and only change them by deliberate file replacement (which gets a new path or busted cache via deploy).
- `Access-Control-Allow-Origin: *` on fonts is conventional defensive — even though we serve from same origin and don't need it for V1, it future-proofs against subdomain fetches.
- HSTS, full CSP, COOP/COEP — Phase 5 (deferred).

## Code Examples

Verified, ready-to-paste patterns. All sources cross-referenced with Cloudflare and MDN docs.

### `_headers` file (Cloudflare Pages — verified syntax)

Source: https://developers.cloudflare.com/pages/configuration/headers/ (verified 2026-04-29)

```
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

/css/*
  Cache-Control: public, max-age=86400

/js/*
  Cache-Control: public, max-age=86400

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
```

Place at repo root (same level as `index.html`). Cloudflare reads it on deploy.

### `<head>` of index.html (Phase 1)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Look Twice</title>

  <!-- Phase 1: minimal meta. Phase 5 (SEO) adds description, og:, canonical, JSON-LD. -->

  <!-- Preload critical font weight (400 = nav links, body) -->
  <link rel="preload" href="/fonts/epilogue-400.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Stylesheets in cascade order: tokens first, animations last -->
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/base.css">
  <link rel="stylesheet" href="/css/layout.css">
  <link rel="stylesheet" href="/css/components.css">
  <link rel="stylesheet" href="/css/animations.css">
</head>
```

### `<body>` of index.html (Phase 1)

```html
<body>
  <nav class="nav" aria-label="Primary navigation">
    <a class="nav-wordmark" href="/">Look Twice</a>
    <button class="nav-hamburger"
            aria-expanded="false"
            aria-controls="nav-overlay"
            aria-label="Open menu">
      <span class="nav-hamburger-line"></span>
      <span class="nav-hamburger-line"></span>
      <span class="nav-hamburger-line"></span>
    </button>
    <ul class="nav-links">
      <li><a class="nav-link" href="#work">WORK</a></li>
      <li><a class="nav-link" href="#approach">APPROACH</a></li>
      <li><a class="nav-link" href="#contact">CONTACT</a></li>
    </ul>
  </nav>

  <div id="nav-overlay" class="nav-overlay" aria-hidden="true">
    <button class="nav-overlay-close" aria-label="Close menu">&times;</button>
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

Notes:
- `<ul>` for nav links is more semantic than UI-SPEC's `role="list"` div pattern. Either works; ul is conventional.
- `&times;` close icon is a Unicode multiplication sign — no extra asset.
- `<script defer>` instead of `<script>` at end of body — defer waits for HTML parse, runs in document order, and doesn't block render. Better than blocking script tag.

### `js/main.js` (Phase 1 only)

```js
// Nav scroll-state toggle (NAV-01, JS-02)
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 0);
}, { passive: true });

// Mobile hamburger overlay open/close (NAV-04, NAV-05)
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

// Phase 2 will append: scroll reveal IntersectionObserver
// Phase 4 will append: sticky tab entrance
```

Source: derived from UI-SPEC.md §1 and §2, with Escape-key + focus-return additions per a11y best practice.

### `@font-face` declarations (in `css/base.css`)

```css
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
```

### Andy Bell "more modern" CSS reset (in `css/base.css`)

Source: piccalil.li/blog/a-more-modern-css-reset (verified 2026-04-29)

```css
*, *::before, *::after { box-sizing: border-box; }

html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

body, h1, h2, h3, h4, p, figure, blockquote, dl, dd { margin-block-end: 0; }

ul[role='list'], ol[role='list'] { list-style: none; }

body { min-height: 100vh; line-height: 1.5; }

h1, h2, h3, h4, button, input, label { line-height: 1.1; }

h1, h2, h3, h4 { text-wrap: balance; }

a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}

img, picture { max-width: 100%; display: block; }

input, button, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

textarea:not([rows]) { min-height: 10em; }

:target { scroll-margin-block: 5ex; }
```

### Smooth scroll with reduced-motion guard (in `css/base.css`)

```css
html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

### Body and measure cap

```css
body {
  background: var(--color-linen);
  color: var(--color-midnight);
  font-family: var(--font-primary);
  font-size: var(--text-body);
  line-height: var(--lh-body);
  font-weight: 400;
}

p, .measure {
  max-width: var(--measure); /* 65ch */
}
```

### `:focus-visible` ring (per UI-SPEC accessibility contract)

```css
:focus-visible {
  outline: 2px solid var(--color-hot-pink);
  outline-offset: 3px;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| `outline: none` + custom focus ring on `:focus` | `:focus-visible` only — keyboard users get ring, mouse users don't | ~2021 (browser support stable) | Cleaner UX, still a11y-compliant |
| Hex / rgb colours | OKLCH for design tokens | Baseline May 2023; "widely available" by 2026 | Perceptual lightness uniformity, better gradients, clear chroma. Verified MDN |
| `position: fixed` + JS scroll math for sticky nav | `position: sticky; top: 0` | ~2017 | Native, GPU-composited, simpler |
| Google Fonts `<link>` | Self-hosted woff2 + preload | Best practice ~2020+ | One fewer DNS handshake, faster cold load, GDPR-friendly |
| `<script>` at end of body | `<script defer>` in head | Always available; preferred since modules era | Parses HTML and JS in parallel, runs after parse |
| FontFaceObserver / `document.fonts.ready` | `font-display: swap` + preload | ~2020 | Native, race-free |
| Webpack/Rollup bundling for tiny sites | Native ES modules + plain `<script>` | ES modules baseline 2018 | No build step needed for V1 |

**Deprecated/outdated for this stack:**
- `font-weight: 500` — not in this brand system (CLAUDE.md hard ban). Skip the entire weight.
- IE11 support — irrelevant. OKLCH and CSS custom properties are baseline.
- `XMLHttpRequest` / jQuery — no fetch in Phase 1, but if any phase needs it, use native `fetch`.

## Open Questions

1. **Is `inspo/temp headshot.jpeg` Kris-approved for the hero cutout?**
   - What we know: STATE.md "Todos" lists "Confirm seed images usable for V1 hero before Phase 2."
   - What's unclear: not Phase 1's problem — Phase 2 needs the answer before HERO-03.
   - Recommendation: Phase 1 ignores. Flag in handoff to Phase 2.

2. **Should `tokens.css` declare ALL token names from DESIGN-TOKENS.md or only Phase-1-active ones?**
   - What we know: FOUND-02 says "implements every token from DESIGN-TOKENS.md". UI-SPEC says all colour tokens are declared in `tokens.css` even though only some are active in Phase 1.
   - What's unclear: nothing — the spec is consistent.
   - Recommendation: Declare ALL tokens in `tokens.css` even if Phase 1 only uses Linen, Midnight, Hot Pink, True White. Future phases need them; declaring once avoids mid-phase additions.

3. **Latin-only subset vs full character set for Epilogue woff2?**
   - What we know: D-04 leaves to discretion. Epilogue Latin subset is ~25–35KB per weight; full charset (Latin + Latin-ext + Vietnamese + others) is ~50–80KB.
   - What's unclear: whether Kris's content uses any non-Latin characters (the open content decisions in STATE.md don't suggest so).
   - Recommendation: Latin subset. 50–70KB total for two weights vs 100–160KB. Uses Fontsource or Google Fonts subset URL pattern. If Kris later needs ext chars, swap in full files (no code change).

4. **Cloudflare Pages preview URL format and persistence.**
   - What we know: Pages auto-generates a per-deploy preview URL like `<commit-hash>.<project>.pages.dev`, plus a per-branch alias like `new-site.<project>.pages.dev`.
   - What's unclear: which one D-09 wants captured in STATE.md.
   - Recommendation: Capture the **branch alias** (`new-site.<project>.pages.dev`) — it stays stable across pushes. The per-deploy hash URL is for diff'ing specific commits.

5. **Does the empty `<main>` with zero-height sections break Lighthouse semantic-HTML or a11y checks in Phase 1?**
   - What we know: A11Y verification is Phase 5. Phase 1 success criteria do not require Lighthouse to pass yet.
   - What's unclear: whether `gsd:verify-work` for Phase 1 will run any audits.
   - Recommendation: Don't fix issues that don't block Phase 1 success criteria. Phase 5 is the audit gate.

## Environment Availability

This phase has minimal external dependencies. Verified locally:

| Dependency | Required By | Available | Version | Fallback |
|---|---|---|---|---|
| Git | Repo + Cloudflare Pages auto-deploy | ✓ (assumed — repo already exists) | — | None — required |
| Cloudflare Pages | DEPLOY-01, DEPLOY-02 | ✓ (per D-07: already wired) | live | None — required |
| Modern browser (Chrome 113+ / Safari 16.4+ / Firefox 113+) | OKLCH support, `text-wrap: balance` | ✓ (target audience) | — | OKLCH falls back to invalid declaration → previous declaration applies. Keep tokens OKLCH-only; oldest non-supporting browsers see broken colours, but they're <1% globally as of 2026 |
| Epilogue woff2 source | FOUND-04 | ✓ (downloadable from Fontsource OSS or Google Fonts) | OFL — current | None — required |
| Text editor | All work | ✓ | — | — |
| Local HTTP server (optional, for testing) | Local preview before push | ✓ — `python3 -m http.server` or similar | — | Push to `new-site` and use Cloudflare preview directly |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

**Dev environment notes:** No npm, no node_modules, no build step. `index.html` opens directly in a browser for local check, though anchor links and font paths are happiest when served via a local HTTP server (`python3 -m http.server 8000`).

## Sources

### Primary (HIGH confidence)
- `.planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md` — fourteen locked decisions
- `.planning/phases/01-foundations-deploy-pipeline/01-UI-SPEC.md` — exact CSS for nav and overlay
- `.planning/seeds/ARCHITECTURE.md` — file structure, JS spec, hosting model, "what GSD should NOT do"
- `.planning/seeds/DESIGN-TOKENS.md` — full CSS custom properties, component specs, design bans
- `.planning/seeds/HOMEPAGE-SPEC.md` (referenced by CONTEXT) — six-section anchor list, nav links
- `.planning/REQUIREMENTS.md` — FOUND-01..05, NAV-01..05, DEPLOY-01..02
- `.planning/ROADMAP.md` — Phase 1 success criteria
- `CLAUDE.md` (root) — project constraints, design bans, branch policy
- Cloudflare Pages docs — branch-build-controls (https://developers.cloudflare.com/pages/configuration/branch-build-controls/) — verified preview-deploy behaviour
- Cloudflare Pages docs — headers (https://developers.cloudflare.com/pages/configuration/headers/) — verified `_headers` syntax
- MDN — OKLCH (https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) — verified Baseline status (May 2023 → widely available 2026)
- piccalil.li — A More Modern CSS Reset (https://piccalil.li/blog/a-more-modern-css-reset/) — verified Andy Bell reset code

### Secondary (MEDIUM confidence)
- web.dev — Preload optional fonts pattern — verified preload + crossorigin requirement for woff2
- Fontsource — Epilogue listing — confirmed Epilogue is OFL-licensed and downloadable as woff2; specific URL within fontsource for woff2 binaries needs final verification at execution time

### Tertiary (LOW confidence)
- None — every claim made above is grounded in a HIGH or MEDIUM source. Where I had only training data (e.g., exact behaviour of `font-display: optional` vs `swap` in 2026 Chrome), I deferred to web.dev.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every choice is constrained by CONTEXT.md or CLAUDE.md, and externally verified docs back the platform claims.
- Architecture: HIGH — five-file split, file paths, link order, JS pattern all dictated by ARCHITECTURE.md and UI-SPEC.md.
- Pitfalls: HIGH for items 1, 2, 5, 6, 8 (verified against Cloudflare and MDN); MEDIUM for items 3, 4, 7 (general best-practice + UI-SPEC, no single source contradicts).

**Research date:** 2026-04-29
**Valid until:** 2026-05-29 — Cloudflare Pages config and CSS baseline are stable; revisit only if a Pages dashboard change or browser baseline shift occurs.

---

*Phase: 01-foundations-deploy-pipeline*
*Research complete: 2026-04-29*
