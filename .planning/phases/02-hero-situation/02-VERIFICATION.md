---
phase: 02-hero-situation
verified: 2026-04-30T00:00:00Z
status: human_needed
score: 5/5 must-haves verified
human_verification:
  - test: "Visual check on Cloudflare Pages preview"
    expected: "Hot Pink hero fills viewport at min 90vh; headline + subhead + two CTAs visible immediately on load with no fade; Kris portrait renders desaturated; Midnight fallback block visible at bottom-left where supporting cutout will go."
    why_human: "LCP, paint timing, and visual composition cannot be verified by grep — needs a rendered browser pass."
  - test: "Scroll into situation, then scroll back up and back down"
    expected: "Chip and 'Sound familiar?' headline fade in together as section enters; blocks 01–05 stagger in 80ms apart; once revealed they stay visible (no re-trigger on scroll-back)."
    why_human: "IntersectionObserver behaviour is runtime-only; threshold/rootMargin tuning needs an eyeball check at desktop and mobile widths."
  - test: "Toggle DevTools 'Emulate prefers-reduced-motion: reduce' and refresh"
    expected: "Reveal still happens but is opacity-only — no vertical translateY motion."
    why_human: "Reduced-motion behaviour requires triggering a media query in a real engine; CSS guard exists in animations.css line 32–37 but observed result needs human confirmation."
  - test: "Tab through hero with keyboard"
    expected: "BOOK A SESSION shows Hot-Pink-on-Midnight focus state; SEE THE WORK shows White outline ring (focus-ring exception per UI-SPEC) — both visibly distinct from non-focus."
    why_human: "Focus-visible states render runtime; visual contrast needs a live check, not a grep."
  - test: "Resize from 1440px down through 1024, 768, 640, 375"
    expected: "Hero stacks at <=768px (cutout below text, buttons full-width). Situation grid shifts: ≥1025px staggered (04/05 offset down one row in col 2), 641–1024px alternating 2-column, ≤640px single column. No horizontal scroll at 375px."
    why_human: "Responsive breakpoint behaviour and overflow checks are visual; CSS rules look correct but need a real viewport pass."
---

# Phase 02: Hero + Situation Verification Report

**Phase Goal:** A warm referral landing on the preview sees a Hot Pink hero with Kris's cutout portrait, reads the headline, and scrolls into five recognisable client situations on Linen.
**Verified:** 2026-04-30
**Status:** human_needed (all automated checks pass; runtime/visual behaviour needs human pass on Cloudflare Pages preview)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                                                                                                       | Status     | Evidence                                                                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero Hot Pink full-bleed min 90vh, display headline, subhead, two CTAs ("BOOK A SESSION" → #contact, "SEE THE WORK" → #work), visible immediately on load no scroll reveal                  | ✓ VERIFIED | `index.html:53–97` ships full hero markup; `components.css:139–150` declares `background: var(--color-hot-pink); min-height: 90vh`; both CTAs anchor correctly; no `.reveal` class on any hero element (grep clean). |
| 2   | Desktop hero two-column (text ~55% left, asymmetric desaturated cutout composition right), text never overlapping photography; mobile headline above scaled cutout, buttons stack          | ✓ VERIFIED | `layout.css:57–65` declares `grid-template-columns: minmax(0, 55fr) minmax(0, 45fr)`; `layout.css:73–78` collapses to `1fr` at ≤768px; `components.css:319–326` stacks CTAs full-width on mobile.                    |
| 3   | Situation shows "THE SITUATION" Midnight chip, headline, five numbered blocks 01–05 in client language, no icons/cards/borders/shadows                                                       | ✓ VERIFIED | `index.html:98–137` ships chip + headline + 5 `<li>` blocks; `components.css:335–347` declares `.chip` Midnight bg; `components.css:380–385` confirms `.situation__block` has only `display/flex-direction/gap` (no border/shadow/background). Headings audit: H1=1, H2=1, H3=5. |
| 4   | Desktop situations stagger two-column (01/02/03 left, 04/05 offset right); mobile single column with --space-md between                                                                     | ✓ VERIFIED | `layout.css:118–128` at ≥1025px places blocks 1/2/3 in col 1 rows 1/2/3 and blocks 4/5 in col 2 rows 2/3 (offset down one row); `layout.css:94–101` baseline single column with `gap: var(--space-md)`.             |
| 5   | Situation blocks reveal on scroll with 80ms stagger via IntersectionObserver, reduced-motion → opacity-only fade                                                                            | ✓ VERIFIED | `js/main.js:65–100` declares the IIFE observer with `threshold: 0.2`, `rootMargin: '0px 0px -10% 0px'`, computes `transitionDelay = i × step` (default 80ms), one-shot via `unobserve`; `animations.css:32–37` strips transform under `prefers-reduced-motion: reduce`. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact            | Expected                                                                                                            | Status      | Details                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`        | `<section id="hero" class="hero">` with H1, subhead, CTAs, cutouts; `<section id="situation" class="situation">` with chip, H2, 5 blocks; `.reveal` + `data-reveal-index` on 7 situation elements | ✓ VERIFIED  | Hero at lines 53–97; situation at lines 98–137. 7 `data-reveal-index` matches expected count. No `.reveal` on any hero element.                                       |
| `css/components.css` | `.hero`, `.hero__inner` placeholder, `.hero__headline`, `.hero__subhead`, `.hero__ctas`, `.hero__cutouts`, `.hero__cutout--main`, `.hero__cutout--support`, `.hero__cutout-fallback`, `.btn`, `.btn--primary`, `.btn--ghost-on-dark`, `.chip`, `.situation`, `.situation__block`, `.situation__number`, `.situation__title`, `.situation__body` | ✓ VERIFIED  | All classes present (lines 139–424). Hot Pink hero, grayscale filter on `.hero__cutout`, Hot Pink `.situation__number`, Midnight `.chip`, Linen `.situation` confirmed. |
| `css/layout.css`    | `.hero__inner` 55/45 grid + ≤768px stack; `.situation__inner`, `.situation__grid` with 1-col/2-col/staggered media queries | ✓ VERIFIED  | Hero grid at lines 57–78. Situation grid + tablet alternating + desktop stagger at lines 88–128.                                                                     |
| `css/animations.css` | `.reveal` + `.visible` + reduced-motion guard (Phase 1 stub, Phase 2 consumes)                                       | ✓ VERIFIED  | Lines 21–37 unchanged from Phase 1 stub; observer in main.js consumes correctly.                                                                                     |
| `js/main.js`        | Generic IntersectionObserver IIFE that toggles `.visible`, computes per-element delay from `data-reveal-index × data-reveal-step`, one-shot via unobserve, fallback for missing API | ✓ VERIFIED  | Lines 65–100. `node --check` passes. All required attributes read.                                                                                                   |

### Key Link Verification

| From                                | To                                | Via                          | Status   | Details                                                                                                |
| ----------------------------------- | --------------------------------- | ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `.hero__cutout--main img`           | `images/kris-portrait.webp`       | `src` attribute              | ✓ WIRED  | `index.html:71`. File present on disk (365KB).                                                          |
| `.btn--primary`                     | `#contact` anchor                 | `href` attribute             | ✓ WIRED  | `index.html:64`. Anchor target exists at line 141.                                                     |
| `.btn--ghost-on-dark`               | `#work` anchor                    | `href` attribute             | ✓ WIRED  | `index.html:65`. Anchor target exists at line 139.                                                     |
| `.situation`                        | `var(--color-linen)`              | `background` property        | ✓ WIRED  | `components.css:355`.                                                                                  |
| `.situation__number`                | `var(--color-hot-pink)`           | `color` property             | ✓ WIRED  | `components.css:394`.                                                                                  |
| `.chip`                             | `var(--color-midnight)`           | `background` property        | ✓ WIRED  | `components.css:337`.                                                                                  |
| `js/main.js` IntersectionObserver   | `.reveal` elements in DOM         | `document.querySelectorAll('.reveal')` | ✓ WIRED  | `js/main.js:66`. 7 elements match the selector.                                                       |
| `.reveal` element                   | computed `transition-delay`       | `data-reveal-index` consumed | ✓ WIRED  | `js/main.js:71–75` reads `dataset.revealIndex` × `dataset.revealStep`, writes `style.transitionDelay`. |
| `.hero__cutout--support` fallback   | `images/hero-supporting.webp`     | `<picture>` + onerror handler | ⚠️ INTENTIONAL FALLBACK | File is NOT yet committed (per plan D-10 / SUMMARY note). Midnight token-block fallback renders behind the missing image; `onerror` strips broken `<img>` and adds `.hero__cutout--missing`. This is a deliberate deferred image, not a defect. |

### Data-Flow Trace (Level 4)

Not applicable. This phase ships static HTML/CSS/JS with no data-fetching layer. The "data" is locked copy in `index.html` and tokens in `css/tokens.css` — both consumed at parse time, not fetched.

### Behavioral Spot-Checks

| Behavior                                | Command                                                       | Result                                                                                       | Status |
| --------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| JS file parses                          | `node --check js/main.js`                                     | exit 0                                                                                       | ✓ PASS |
| Single H1 in document                   | `grep -c '<h1' index.html`                                    | 1                                                                                            | ✓ PASS |
| Five situation blocks present           | `grep -c '<h3 class="situation__title">' index.html`          | 5                                                                                            | ✓ PASS |
| Seven `.reveal` data attributes         | `grep -c 'data-reveal-index' index.html`                      | 7 (chip, headline, blocks 01–05)                                                              | ✓ PASS |
| Hero carries no `.reveal`               | `grep -E 'class="hero[^"]*reveal' index.html`                 | empty                                                                                        | ✓ PASS |
| No font-weight 500 anywhere             | `grep 'font-weight: 500' css/*.css`                           | empty                                                                                        | ✓ PASS |
| No hex colours in components/layout CSS | `grep -E '#[0-9a-fA-F]{3,6}' css/components.css css/layout.css` | empty (all colour via tokens)                                                                | ✓ PASS |
| No box-shadow on hero/btn/situation     | `grep -E 'box-shadow.*\.(hero\|btn\|situation)' css/*.css`    | empty                                                                                        | ✓ PASS |
| `.situation__block` flat (no border/shadow/background) | regex inspection of block scope                | Only `display`, `flex-direction`, `gap` — flat                                               | ✓ PASS |
| Visual rendering on Cloudflare Pages    | open preview, eyeball                                         | needs human                                                                                  | ? SKIP |
| Scroll reveal stagger timing            | scroll into situation in browser                              | needs human                                                                                  | ? SKIP |
| Reduced-motion behaviour                | DevTools Rendering panel toggle                               | needs human                                                                                  | ? SKIP |

### Requirements Coverage

| Requirement | Source Plan | Description                                                                                                            | Status      | Evidence                                                                                                                       |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| HERO-01     | 02-01       | Hot Pink full-bleed min 90vh, two-column desktop                                                                       | ✓ SATISFIED | `components.css:139–150` (`background: var(--color-hot-pink); min-height: 90vh`); `layout.css:57–65` (55fr/45fr grid).         |
| HERO-02     | 02-01       | Display headline (Epilogue 700, --text-display, White) + subhead (--text-body, White at 85%)                            | ✓ SATISFIED | `components.css:152–172`. Subhead has `opacity: 0.85` per UI-SPEC. Copy locked verbatim.                                       |
| HERO-03     | 02-01       | Cutout composition: rounded-rect main + supporting circle, both `filter: grayscale(100%)`, asymmetric                   | ✓ SATISFIED | `components.css:192–223`. `border-radius: var(--radius-cutout)` on main, `50%` on support, `filter: grayscale(100%)` on `.hero__cutout`. |
| HERO-04     | 02-01       | Two CTAs, locked labels, anchors `#contact`/`#work`, hover states                                                       | ✓ SATISFIED | `index.html:64–65`; `components.css:269–296`. Primary Midnight→Hot Pink hover; Ghost transparent→White-fill hover.             |
| HERO-05     | 02-01       | Mobile: headline above, scaled cutout below, buttons stacked                                                            | ✓ SATISFIED | `components.css:304–327` (≤768px). `.hero__cutouts` width 85%, `.hero__ctas` flex-direction column, `.btn` width 100%.         |
| HERO-06     | 02-01       | Hero visible immediately on load — no scroll reveal                                                                     | ✓ SATISFIED | No `.reveal` class on any hero element (grep `class="hero[^"]*reveal"` returns empty).                                         |
| SITU-01     | 02-02       | Linen surface, --space-section padding, "THE SITUATION" chip, headline                                                  | ✓ SATISFIED | `components.css:354–359`; chip + H2 at `index.html:101–102`. Mobile padding override at line 420.                             |
| SITU-02     | 02-02       | Five blocks: Hot Pink number, bold title, body capped at measure; no icons/cards/borders/shadows                        | ✓ SATISFIED | `index.html:106–134` (5 blocks). `components.css:380–416`. `.situation__block` strictly flat (verified).                       |
| SITU-03     | 02-02       | Desktop ≥1025px: 01/02/03 left, 04/05 offset right                                                                       | ✓ SATISFIED | `layout.css:118–128`: blocks 1/2/3 col 1 rows 1/2/3; blocks 4/5 col 2 rows 2/3 (skipping row 1 = offset).                      |
| SITU-04     | 02-02       | Mobile ≤640px: single column, --space-md gap                                                                             | ✓ SATISFIED | `layout.css:94–101` baseline 1fr with `gap: var(--space-md)`.                                                                  |
| SITU-05     | 02-03       | Scroll reveal: chip + headline first, blocks 01–05 stagger 80ms; reduced-motion opacity-only                             | ✓ SATISFIED | `js/main.js:65–100` (observer); `index.html:101–130` (7 reveal elements with correct indices); `animations.css:32–37` (reduced-motion guard). |

All 11 declared requirements satisfied by code evidence. No orphaned requirements (REQUIREMENTS.md maps all eleven IDs to Phase 2 and all eleven appear in plan frontmatter).

### Anti-Patterns Found

| File                  | Line       | Pattern                                                                  | Severity | Impact                                                                                                                                                       |
| --------------------- | ---------- | ------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.html`          | 144        | `class="footer footer--placeholder"` (Phase 4 will populate)             | ℹ️ Info   | Expected — Phase 1 stub; not in Phase 2 scope.                                                                                                                |
| `css/components.css`  | 129        | Comment "Footer placeholder (D-14)"                                      | ℹ️ Info   | Comment only.                                                                                                                                                  |
| `css/layout.css`      | 9          | Comment "Empty section shells … Phase 1"                                 | ℹ️ Info   | Comment only.                                                                                                                                                  |
| `index.html`          | 86, 92     | `images/hero-supporting.webp` referenced; file not yet committed          | ⚠️ Expected (deferred) | Plan D-10 explicitly defers this image; Midnight token-block fallback renders. SUMMARY 02-01 documents this. Not a defect.                                     |
| `images/.gitkeep`     | -          | Empty 0-byte file                                                        | ℹ️ Info   | Phase 1 placeholder to keep dir tracked.                                                                                                                       |
| Em-dashes in CSS comments | various | `—` characters in comment text                                          | ℹ️ Info   | CLAUDE.md design ban scope is "no em-dashes in copy"; comments are not user-visible copy. Not a violation.                                                    |

No 🛑 Blocker patterns. No ⚠️ Warning patterns beyond the deferred image which is documented and intentional.

### Human Verification Required

See `human_verification` block in frontmatter. Five items need a real-browser pass on the Cloudflare Pages preview:

1. **Visual check on Cloudflare Pages preview** — Hot Pink hero fills viewport at min 90vh; headline + subhead + two CTAs visible immediately on load with no fade; Kris portrait renders desaturated; Midnight fallback block visible at bottom-left where supporting cutout will go.
2. **Scroll reveal behaviour** — Scroll into situation: chip and "Sound familiar?" fade in together; blocks 01–05 stagger 80ms apart; once revealed they stay visible (no re-trigger).
3. **prefers-reduced-motion** — Toggle DevTools Rendering panel: reveal still happens but is opacity-only, no translateY.
4. **Keyboard focus rings** — Tab through hero: BOOK A SESSION shows Hot-Pink focus state; SEE THE WORK shows White outline ring.
5. **Responsive breakpoints** — Resize from 1440 down to 375: hero stacks at ≤768px; situation grid shifts at 1025/641/640; no horizontal scroll at 375px.

### Gaps Summary

No gaps. All 5 truths verified, all 11 requirements satisfied by code evidence, all key links wired (with the supporting cutout image intentionally deferred per plan), zero blocker anti-patterns. The phase goal is achieved at the code level. Human verification is required only to confirm runtime behaviour and visual composition on the Cloudflare Pages preview — these are inherently visual/runtime properties that cannot be asserted by grep.

---

_Verified: 2026-04-30_
_Verifier: Claude (gsd-verifier)_
