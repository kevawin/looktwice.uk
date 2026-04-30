---
phase: 01-foundations-deploy-pipeline
verified: 2026-04-30T07:30:00Z
status: passed
score: 6/6 success criteria verified
re_verification:
  is_re_verification: false
human_verification:
  - test: "Open https://new-site.looktwice-uk.pages.dev in a desktop browser and scroll one pixel."
    expected: "Sticky nav background fades from transparent to Linen within 200ms; nav links show a 2px Hot Pink underline grow on hover."
    why_human: "Animation timing and visual underline appearance are not introspectable via grep — JS class toggle and CSS transition both verified, but the perceived 200ms feel and 2px/3px-offset underline render need human eyes."
  - test: "On a viewport ≤1024px (or DevTools mobile preview), tap the hamburger button on the preview URL."
    expected: "Midnight overlay slides down from the top in ~280ms; aria-expanded flips to 'true'; pressing Escape closes it and returns focus to the hamburger; clicking a link closes it then anchor-scrolls."
    why_human: "Slide animation, focus-return behaviour, and reduced-motion fallback are wired in code but only observable in a real browser session."
  - test: "View source of https://new-site.looktwice-uk.pages.dev and confirm no FOUC of a fallback weight on first load (hard refresh with cache disabled)."
    expected: "Epilogue 400 paints the text with no visible weight swap; preload of /fonts/epilogue-400.woff2 fires before render."
    why_human: "FOUC perception is a visual judgement — the @font-face rules + preload tag are present but the swap behaviour can only be confirmed by watching the page paint."
---

# Phase 1: Foundations & Deploy Pipeline Verification Report

**Phase Goal:** A semantic, token-driven shell ships to a Cloudflare Pages preview from `new-site`, with working sticky nav, so every later phase lands visibly on the staging URL.

**Verified:** 2026-04-30T07:30:00Z
**Status:** passed (with three human-verification spot-checks queued)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `new-site` deploys to a Cloudflare Pages preview on push, preview loads `index.html` | VERIFIED | `curl -sI https://new-site.looktwice-uk.pages.dev/` returned `HTTP/2 200`. `git ls-remote origin new-site` matches commit `1512f7e`. `_headers` rules observable on response (immutable cache on fonts, three security headers on /). |
| 2 | Preview shows semantic shell: `<main>` + six `<section>` anchors + `<nav>` + `<footer>`, one H1 reserved for hero | VERIFIED | `grep -c '<section' index.html` = 6. Section IDs in document order: hero, situation, approach, work, services, contact. `grep -c '<h1' index.html` = 0 (one H1 reserved for Phase 2 hero, per plan). `<nav>`, `<main>`, `<footer>` all present. |
| 3 | Epilogue 400/700 loads with `font-display: swap` and no FOUC of fallback weight | VERIFIED (font load) / HUMAN (no-FOUC) | Two `@font-face` blocks in `css/base.css` with `font-display: swap`. Both `fonts/epilogue-{400,700}.woff2` start with `wOF2` magic bytes; sizes 14268 and 14640 bytes. `<link rel="preload" ... epilogue-400.woff2 ... crossorigin>` in `index.html`. NOTE: ROADMAP wording says "via Google Fonts" but Phase 1 plan D-03 deliberately self-hosts — REQUIREMENTS.md FOUND-04 still says "Google Fonts" (drift, not blocker — see Anti-Patterns). FOUC perception flagged for human verification. |
| 4 | Sticky top nav transparent at top, fills with Linen on first scroll within 200ms, Hot Pink underline on hover | VERIFIED (wiring) / HUMAN (timing) | `.nav { position: sticky; top: 0; background: transparent; }` and `.nav.scrolled { background: var(--color-linen); }` in components.css. `transition: var(--transition-nav)` (200ms) in animations.css. `js/main.js` toggles `.scrolled` class on `window.scrollY > 0` with `{ passive: true }`. `.nav-link::after` hover grows width 0→100% Hot Pink underline. Animation timing flagged for human verification. |
| 5 | Mobile hamburger opens Midnight overlay with stacked Linen links and correct aria-expanded / aria-controls state | VERIFIED | Hamburger has `aria-expanded="false"` and `aria-controls="nav-overlay"`. `js/main.js` `openOverlay()` sets `aria-expanded='true'` and `aria-hidden='false'`; `closeOverlay()` reverses and returns focus to hamburger. Overlay background `var(--color-midnight)`, link colour `var(--color-linen)`. Escape handler closes overlay. |
| 6 | `tokens.css` exposes every OKLCH colour, type scale, spacing, radii, shadows, transitions specified in DESIGN-TOKENS.md | VERIFIED | 44 custom-property declarations in tokens.css. All 12 colours, gradient, font-primary, 5 type sizes, 5 line-heights, 3 letter-spacings, measure, 6 spacings, 5 radii, shadow-float, 4 transitions all present. Zero hex / rgb / hsl matches. OKLCH-only confirmed. |

**Score:** 6/6 truths verified (3 carry deferred human spot-checks for visual/timing confirmation, but core wiring all in place).

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `index.html` | Semantic shell, font preload, 5 CSS links in cascade, deferred main.js | VERIFIED | 67 lines. Contains `<section id="hero">`, `rel="preload"`, `epilogue-400.woff2`, five `<link rel="stylesheet">` in tokens→base→layout→components→animations order, `<script src="/js/main.js" defer>`. |
| `css/tokens.css` | 41+ token declarations under `:root`, OKLCH-only | VERIFIED | 92 lines, single `:root` block, 44 declarations. `--color-hot-pink`, `--gradient-brand`, `--font-primary: 'Epilogue', ...`, all spacings/radii/transitions present. Zero hex/rgb/hsl. |
| `css/base.css` | Reset + 2 @font-face + scroll behaviour + body defaults + measure cap + focus-visible | VERIFIED | 143 lines. Andy Bell reset (box-sizing, text-wrap balance, image max-width). Two `@font-face` blocks (Epilogue 400 and 700, both `font-display: swap`, absolute `/fonts/` paths). `scroll-behavior: smooth` with `prefers-reduced-motion` guard. Body uses `var(--color-linen)`, `var(--font-primary)`, `var(--text-body)`. `:focus-visible` outline `var(--color-hot-pink)`. |
| `css/layout.css` | Nav flex layout, hamburger media queries | VERIFIED | 49 lines. `.nav` flex, `.nav-links` row, `.footer` padding. Two-range media query (`max-width: 1024px` shows hamburger / `min-width: 1025px` hides). Avoids 1024px overlap. |
| `css/components.css` | Nav, wordmark, links, hamburger, overlay, footer placeholder | VERIFIED | 132 lines. `.nav` sticky / `.nav.scrolled` Linen. `.nav-link::after` hot-pink underline. `.nav-hamburger` 44×44 hit target. `.nav-overlay` Midnight slide. `.footer--placeholder` Midnight surface. |
| `css/animations.css` | Nav transition, overlay slide, reveal stub, reduced-motion guards | VERIFIED | 37 lines. `.nav` `transition: var(--transition-nav)` (200ms). `.nav-overlay` `transform 280ms cubic-bezier(0.16, 1, 0.3, 1)`. `prefers-reduced-motion` guard removes overlay transform. `.reveal` stub authored for Phase 2. |
| `js/main.js` | Scroll-state toggle + hamburger open/close + Escape + focus return | VERIFIED | 52 lines. `window.addEventListener('scroll', ..., { passive: true })`. `nav.classList.toggle('scrolled', window.scrollY > 0)`. `setAttribute('aria-expanded', ...)`. Escape handler closes overlay, returns focus to hamburger. |
| `fonts/epilogue-400.woff2` | woff2 binary, magic `wOF2`, > 5KB | VERIFIED | 14268 bytes; `head -c 4` returns `wOF2`. |
| `fonts/epilogue-700.woff2` | woff2 binary, magic `wOF2`, > 5KB | VERIFIED | 14640 bytes; `head -c 4` returns `wOF2`. |
| `fonts/OFL.txt` | OFL licence text | VERIFIED | Present alongside binaries. |
| `_headers` | Cache rules + 3 security headers | VERIFIED | 14 lines. `/fonts/*` → `Cache-Control: public, max-age=31536000, immutable` + `Access-Control-Allow-Origin: *`. `/css/*` and `/js/*` → 24h cache. `/*` → `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`. All confirmed live on preview via `curl -sI`. |
| `.planning/STATE.md` | Captured preview URL + phase progress | VERIFIED | `preview_url: https://new-site.looktwice-uk.pages.dev` in YAML frontmatter. Status reads "Phase 1 plans 01–03 executed; preview live; awaiting verifier". 3/3 plans complete in progress block. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `index.html <head>` | `fonts/epilogue-400.woff2` | preload link | WIRED | `<link rel="preload" href="/fonts/epilogue-400.woff2" as="font" type="font/woff2" crossorigin>` present. Crossorigin attribute correct. |
| `index.html <head>` | 5 CSS files in cascade | sequential `<link rel="stylesheet">` | WIRED | Order tokens.css → base.css → layout.css → components.css → animations.css confirmed in `<head>`. |
| `index.html <body>` | `js/main.js` | `<script ... defer>` | WIRED | `<script src="/js/main.js" defer></script>` immediately before `</body>`. |
| `js/main.js scroll listener` | `.nav.scrolled` class | `nav.classList.toggle('scrolled', window.scrollY > 0)` | WIRED | Exact match in main.js line 11. Wired with `{ passive: true }`. |
| `js/main.js hamburger handler` | `.nav-overlay.open` + aria mutations | `openOverlay()` / `closeOverlay()` | WIRED | Both functions update `.open` class, `aria-expanded`, `aria-hidden`. Close returns focus to hamburger. |
| nav anchor hrefs | `<section id>` anchors | `#work` / `#approach` / `#contact` | WIRED | All three nav links match section IDs in document. Mobile overlay links match same anchors. |
| `css/base.css @font-face` | `fonts/epilogue-{400,700}.woff2` | `src: url('/fonts/epilogue-{400|700}.woff2')` | WIRED | Two @font-face blocks reference exact absolute paths. Files exist on disk and on preview (HTTP 200). |
| `css/base.css body` | `css/tokens.css` custom properties | `var(--color-linen)`, `var(--font-primary)`, etc. | WIRED | Body rule uses `var(--color-linen)`, `var(--color-midnight)`, `var(--font-primary)`, `var(--text-body)`, `var(--lh-body)`. Cascade order in `<link>` tags ensures tokens load first. |
| `_headers /fonts/*` | Cloudflare Pages serving fonts | `Cache-Control: ... immutable` | WIRED | Live response on `https://new-site.looktwice-uk.pages.dev/fonts/epilogue-400.woff2` returned `cache-control: public, max-age=31536000, immutable` and `access-control-allow-origin: *`. |
| `_headers /*` | Every preview response | Three security headers | WIRED | Live response on preview root returned `referrer-policy: strict-origin-when-cross-origin`, `x-content-type-options: nosniff`, `x-frame-options: DENY`. |
| `git push origin new-site` | Cloudflare Pages preview deploy | Auto-deploy | WIRED | `git ls-remote origin new-site` SHA `1512f7e` matches Cloudflare-served preview. |

### Data-Flow Trace (Level 4)

Phase 1 ships a static shell with empty section bodies. No dynamic data is rendered yet — Phase 2 onwards adds content. Data-flow trace not applicable for this phase. The only "data" is the toggle state on the nav, which traces:

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `.nav` | `window.scrollY` | Browser scroll event with `{ passive: true }` listener | Yes — toggle reflects real scroll | FLOWING |
| `.nav-overlay` | `.open` class state | Hamburger click + close button + Escape key + link click | Yes — class toggles drive transform | FLOWING |

### Behavioural Spot-Checks

| Behaviour | Command | Result | Status |
|-----------|---------|--------|--------|
| Preview URL reachable | `curl -sI https://new-site.looktwice-uk.pages.dev/` | `HTTP/2 200` | PASS |
| All 5 CSS files served | `curl -sI` each `/css/*.css` | All `HTTP/2 200` | PASS |
| Both font files served | `curl -sI` each `/fonts/epilogue-*.woff2` | Both `HTTP/2 200` | PASS |
| `js/main.js` served | `curl -sI` `/js/main.js` | `HTTP/2 200` | PASS |
| Font cache header active | `curl -sI` `/fonts/epilogue-400.woff2` \| grep cache-control | `cache-control: public, max-age=31536000, immutable` | PASS |
| Security headers active on / | `curl -sI` `/` \| grep -iE "x-content-type\|referrer-policy\|x-frame" | All three present and correct | PASS |
| Font binaries valid | `head -c 4 fonts/epilogue-{400,700}.woff2` | `wOF2` `wOF2` | PASS |
| OKLCH-only colour in tokens | `grep -E "#[0-9a-fA-F]{3,8}\|rgb(\|hsl(" css/tokens.css` | No matches | PASS |
| No font-weight 500 in css/ | `grep -rn "font-weight:[[:space:]]*500" css/ index.html` | No matches | PASS |
| No Google Fonts deps | `grep -rn "fonts.googleapis\|fonts.gstatic" .` (excluding `.git`, `.planning`) | No matches | PASS |
| No `@import` chains in css/ | `grep -rn "@import" css/` | No matches | PASS |
| Six sections in document order | `grep -oE 'id="[a-z]+"' index.html` | hero, situation, approach, work, services, contact | PASS |
| Zero H1 in Phase 1 (reserved for hero in Phase 2) | `grep -c '<h1' index.html` | 0 | PASS |
| HEAD on `new-site`, not `main` | `git rev-parse --abbrev-ref HEAD` | `new-site` | PASS |
| `origin/main` untouched | `git log origin/main -1 --oneline` | `1178c9b Adding Claude files` (pre-Phase-1 holding page) | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FOUND-01 | 01-01 | Flat tree (index.html, css/, js/, images/) | SATISFIED | `css/`, `js/`, `fonts/`, `images/` directories exist at repo root. |
| FOUND-02 | 01-01 | tokens.css implements every DESIGN-TOKENS.md token | SATISFIED | 44 declarations under `:root`; all required tokens spot-checked present; OKLCH-only. |
| FOUND-03 | 01-01 | Reset + semantic typography defaults + measure cap | SATISFIED | Andy Bell reset in base.css, `--measure: 65ch` applied to `p, .measure`, body uses tokens. |
| FOUND-04 | 01-01 | Epilogue 400, 700 with preconnect + font-display: swap | SATISFIED (with deviation) | Self-hosted woff2 with `font-display: swap` (per plan D-03 — supersedes the "Google Fonts" wording in REQUIREMENTS.md). Preload `<link>` substitutes for preconnect since fonts are same-origin. NOTE: REQUIREMENTS.md FOUND-04 text still says "Google Fonts" — drift (see Anti-Patterns). |
| FOUND-05 | 01-02 | Single index.html with `<main>`, six `<section>`, `<nav>`, `<footer>`, one H1 (hero) | SATISFIED | Six sections present in correct order; zero H1 in Phase 1 (reserved for hero per plan); REQUIREMENTS.md text was patched from "eight" to "six" (D-11 doc-fix). |
| NAV-01 | 01-02 | Sticky top nav, transparent over hero, transitions to Linen on first scroll (200ms) | SATISFIED | `position: sticky` + transparent default + `.scrolled` Linen + `--transition-nav` (200ms) + JS toggle on `scrollY > 0`. |
| NAV-02 | 01-02 | Wordmark left, nav links right (WORK / APPROACH / CONTACT), all anchor on-page | SATISFIED | `<a class="nav-wordmark" href="/">Look Twice</a>` + three nav links with `href="#work"`, `#approach`, `#contact`. |
| NAV-03 | 01-02 | Hot Pink underline (2px, 3px offset) on hover/active, no background fill change | SATISFIED | `.nav-link::after { width: 0; height: 2px; background: var(--color-hot-pink); bottom: -3px; }` grows to 100% on hover/active/focus-visible. No background change. |
| NAV-04 | 01-02 | Mobile hamburger triggers full-width Midnight overlay sliding down (280ms ease-out-quart) with stacked Linen links | SATISFIED | `.nav-overlay { background: var(--color-midnight); transform: translateY(-100%); }` + `.open { transform: translateY(0); }` + `transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1)`. Three `.nav-overlay-link` stacked, Linen colour. |
| NAV-05 | 01-02 | Hamburger button has aria-expanded / aria-controls; close button top-right of overlay | SATISFIED | Hamburger `aria-expanded` toggled, `aria-controls="nav-overlay"`. `.nav-overlay-close { align-self: flex-end; }` (top-right). Escape closes and returns focus to hamburger. |
| DEPLOY-01 | 01-03 | Cloudflare Pages project configured to build/serve from `new-site` | SATISFIED | Branch alias URL `https://new-site.looktwice-uk.pages.dev` returns HTTP 200; commit `1512f7e` on origin/new-site is the served deploy. |
| DEPLOY-02 | 01-03 | Preview URL accessible for verification before cutover | SATISFIED | URL captured in `STATE.md` `preview_url:` frontmatter. All assets (index.html, 5 CSS, 2 woff2, main.js) return HTTP 200. `_headers` rules confirmed applied (font immutable cache, three security headers). |

**All 12 phase requirement IDs satisfied.** Zero orphans (REQUIREMENTS.md traceability table maps exactly these 12 to Phase 1).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `.planning/REQUIREMENTS.md` | 15 (FOUND-04) | Description still says "Epilogue (400, 700) loads via Google Fonts with preconnect + font-display: swap" but Phase 1 D-03 deliberately self-hosts and the implementation has zero Google Fonts refs | Info | Doc/implementation drift. Plan-01 SUMMARY notes "D-03 supersedes Google Fonts wording". Recommend a follow-up doc-fix to REQUIREMENTS.md FOUND-04 to reflect self-hosted reality (similar pattern to the D-11 six-vs-eight fix already applied to FOUND-05). Does not block goal — implementation is correct, only the requirements text is stale. |
| Local repo | HEAD | Local HEAD `5103560 docs(01-03): complete deploy-pipeline plan` is one commit ahead of `origin/new-site` (`1512f7e`) | Info | Docs/SUMMARY commit not pushed to origin. The deployed Phase 1 shell is `1512f7e` which is the correct foundation; the unpushed commit is documentation only (`01-03-SUMMARY.md`, `STATE.md`, `ROADMAP.md`/`REQUIREMENTS.md` progress flags). Push before Phase 2 starts so future verifiers see consistent state across local and origin. |
| `js/main.js` | 17 | `const overlay = document.querySelector('.nav-overlay')` — overlay accessed before guard, but used inside conditional block | Info | Cosmetic — `if (hamburger && overlay && closeBtn)` gate prevents null deref; works correctly. No fix required. |

No blocker or warning anti-patterns. Hard design bans (no shadows except `--shadow-float`, no gradients except `--gradient-brand` declared-not-painted, no `font-weight: 500`, no em-dashes in code/markup, no glassmorphism, no mid-tone greys) all respected in Phase 1 surfaces.

### Human Verification Required

Three deferred spot-checks. None block Phase 1 progression — code-level wiring is verified — but visual/timing confirmation needs eyes:

#### 1. Sticky nav transition feel

**Test:** Open https://new-site.looktwice-uk.pages.dev in a desktop browser and scroll one pixel.
**Expected:** Sticky nav background fades from transparent to Linen within 200ms; nav links show a 2px Hot Pink underline grow on hover.
**Why human:** Animation timing and perceived 2px/3px-offset underline render cannot be confirmed via grep — JS class toggle and CSS transition are both present, but the actual fade and underline geometry require a real browser.

#### 2. Mobile hamburger overlay flow

**Test:** On a viewport ≤1024px (or DevTools mobile preview), tap the hamburger button on the preview URL.
**Expected:** Midnight overlay slides down from the top in ~280ms; aria-expanded flips to `true`; pressing Escape closes it and returns focus to the hamburger; clicking a link closes it then anchor-scrolls.
**Why human:** Slide animation, focus-return behaviour, and reduced-motion fallback are wired in code but only observable in a real browser session.

#### 3. No FOUC of fallback weight on first paint

**Test:** View source of https://new-site.looktwice-uk.pages.dev with cache disabled (DevTools → Network → "Disable cache") and hard refresh.
**Expected:** Epilogue 400 paints the text with no visible weight swap; preload of `/fonts/epilogue-400.woff2` fires before render.
**Why human:** FOUC is a visual judgement — `@font-face` rules + preload tag are present and correct, but the swap behaviour can only be confirmed by watching the page paint.

### Gaps Summary

No goal-blocking gaps. Phase 1 delivered the foundation contract: token surface declared, base CSS and self-hosted Epilogue wired, semantic six-section shell shipped, sticky nav and mobile overlay behaviour in place, `_headers` driving cache + security on the live preview, branch-alias URL captured in STATE.md, `main` untouched.

Two Info-level items worth tracking for tidiness:

1. **REQUIREMENTS.md FOUND-04 text drift** — still references "Google Fonts" while implementation self-hosts. Mirror the D-11 six-vs-eight fix pattern to amend the requirement text.
2. **Unpushed docs commit on local `new-site`** — `5103560` is one commit ahead of origin. Push so origin reflects the same SUMMARY/STATE state the verifier sees locally.

Three human-verification spot-checks queued for visual/timing confirmation before Phase 2 begins.

---

*Verified: 2026-04-30T07:30:00Z*
*Verifier: Claude (gsd-verifier)*
