# Roadmap: looktwice.uk

**Created:** 2026-04-29
**Granularity:** coarse
**Mode:** yolo
**Total v1 requirements:** 77
**Coverage:** 77/77 mapped (100%)

## Core Value

A warm referral lands, recognises their own problem in Kris's words within 60 seconds, and emails her — because the site is the demonstration of what she does, not just the description.

## Phases

- [ ] **Phase 1: Foundations & Deploy Pipeline** - File structure, design tokens, base CSS, fonts, semantic shell, nav, Cloudflare Pages preview live
- [ ] **Phase 2: Hero & Situation** - Above-the-fold identity (Hot Pink hero + cutout) and self-identification (Linen situation, five blocks)
- [x] **Phase 3: Mid-page Story** - Positioning interrupt (Signal Orange), work placeholder, services (three problem-first areas)
- [x] **Phase 4: Conversion & Persistent Surfaces** - Deep Teal contact, Midnight footer, floating sticky tab, all JS behaviours wired
- [x] **Phase 5: Hardening & Launch** - Accessibility, performance, SEO, responsive verification, cutover plan (code complete; Kris-side Lighthouse + UAT + cutover trigger pending)
- [x] **Phase 6: Post-UAT Polish** - Brand colour truth, nav cascade fix, logo + hero composition, drop chips/animations, situation 5-col + decorative numbers, work bio expansion, how-I-work icons, contact split, footer additions

### V1 Refresh milestone (numbering continues from 07; see ROADMAP-REFRESH.md for full per-phase detail)

- [x] **Phase 7: Design-system foundations** (refresh P1) - Min font sizes, one button style, unified CTA copy "Free 30-min chat" (completed 2026-06-01)
- [x] **Phase 8: Navigation & floating action bar** (refresh P2) - Header scrolls away (de-sticky, de-burger, drop Contact), floating gradient CTA pill + white/pink burger nav past the hero (completed 2026-06-01)
- [x] **Phase 9: P08 bug fixes & tweaks** (fix phase, not a refresh-roadmap phase) - 6 commits: gutter alignment, mobile menu stacking/hide, inverted colours + white borders, no stray focus, scroll-collapse, clean-URL on all internal anchors, header + bar aligned to content column (completed 2026-06-01). Menu-concept rework deferred — Kris's deviation examples not yet shared.
- [x] **Phase 10: Contact mechanic — form vs email** (refresh P7) - Decision gate resolved: form wins. Build a Formspree contact form (form-only, no visible mailto), remove all visible email, reverse the CLAUDE.md/STATE mailto lock. Started out of refresh order ahead of refresh P3–P6. (completed 2026-06-01)
- [ ] **Phase 12: Build pipeline & tooling foundation** - Stand up the Cloudflare Pages build command, build-time image optimization (srcset/AVIF/WebP), CSS/JS minify + autoprefix, and wire dev/test to serve built output. Records the CLAUDE.md tech-stack relaxation (2026-06-02). **Executes BEFORE Phase 11** (prerequisite for the cutout build function).
- [ ] **Phase 11: Cutout reveal system** (refresh P3) - Reusable `buildCutout(image, shapes)` cutout primitive (SVG-mask, single shared image) + hero refactor. Depends on Phase 12's build pipeline. GSD numbers = registration order; execution order is 12 then 11.

## Phase Details

### Phase 1: Foundations & Deploy Pipeline

**Goal**: A semantic, token-driven shell ships to a Cloudflare Pages preview from `new-site`, with working sticky nav, so every later phase lands visibly on the staging URL.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, DEPLOY-01, DEPLOY-02
**Success Criteria** (what must be TRUE):

  1. The `new-site` branch deploys to a Cloudflare Pages preview URL on every push, and the preview loads `index.html`
  2. The preview shows a semantic page shell (`<main>` + six empty `<section>` anchors + `<nav>` + `<footer>`) with one H1 reserved for the hero
  3. Epilogue 400/700 loads via Google Fonts with `font-display: swap` and no FOUC of a fallback weight
  4. The sticky top nav is transparent at the top of the page, fills with Linen on first scroll within 200ms, and shows a Hot Pink underline on link hover
  5. The mobile hamburger opens a Midnight overlay with stacked Linen links and correct `aria-expanded` / `aria-controls` state
  6. `tokens.css` exposes every OKLCH colour, the type scale, spacing, radii, shadows, and transitions specified in DESIGN-TOKENS.md

**Plans**: 3 plans

  - [x] 01-01-tokens-base-fonts-PLAN.md — File scaffold, tokens.css with full DESIGN-TOKENS.md set, base.css with Andy Bell reset + Epilogue self-host @font-face + scroll-behavior + body defaults, three CSS stubs
  - [x] 01-02-shell-nav-PLAN.md — Overwrite index.html with semantic shell (six sections), wire nav + overlay CSS + JS (sticky transparent → Linen, Hot Pink underline, hamburger overlay with aria + Escape), apply doc-fix correcting eight→six in REQUIREMENTS.md and ROADMAP.md
  - [x] 01-03-deploy-pipeline-PLAN.md — _headers (cache + basic security), push to new-site, verify Cloudflare Pages preview deploy, capture branch-alias URL in STATE.md, confirm main untouched

**UI hint**: yes

### Phase 2: Hero & Situation

**Goal**: A warm referral landing on the preview sees a Hot Pink hero with Kris's cutout portrait, reads the headline, and scrolls into five recognisable client situations on Linen.
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, HERO-06, SITU-01, SITU-02, SITU-03, SITU-04, SITU-05
**Success Criteria** (what must be TRUE):

  1. The hero renders Hot Pink full-bleed at min 90vh, with display headline, subhead, and two CTAs ("BOOK A SESSION" → #contact, "SEE THE WORK" → #work) visible immediately on load with no scroll reveal
  2. On desktop the hero shows a two-column layout (text ~55% left, asymmetric desaturated cutout composition right) with text never overlapping photography; on mobile the headline sits above a scaled cutout and buttons stack
  3. The situation section shows the "THE SITUATION" Midnight chip, section headline, and five numbered blocks (01–05) in client language with no icons, no card boxes, no borders, no shadows
  4. On desktop situations stagger across two columns (01/02/03 left, 04/05 offset right); on mobile they collapse to a single column with --space-md between items
  5. Situation blocks reveal on scroll with 80ms stagger between items via IntersectionObserver, and reduced-motion users get opacity-only fade

**Plans**: 3 plans

  - [x] 02-01-hero-PLAN.md — Hero markup + Hot Pink CSS + two-column layout (HERO-01..06)
  - [x] 02-02-situation-PLAN.md — Situation markup + Linen CSS + .chip component + staggered grid (SITU-01..04)
  - [x] 02-03-reveal-observer-PLAN.md — Generic .reveal IntersectionObserver wired to situation chip/headline/blocks (SITU-05)

**UI hint**: yes

### Phase 3: Mid-page Story

**Goal**: After the situation, the visitor hits a Signal Orange opinionated statement, sees that work exists (placeholder), and reads three problem-first service areas.
**Depends on**: Phase 2
**Requirements**: INTR-01, INTR-02, INTR-03, INTR-04, WORK-01, WORK-02, WORK-03, WORK-04, SERV-01, SERV-02, SERV-03, SERV-04, SERV-05
**Success Criteria** (what must be TRUE):

  1. The positioning interrupt renders as a Signal Orange full-bleed surface with one White Headline-scale statement, max-width 800px, left-aligned, and no chip / subheading / CTA
  2. The work section renders on Linen with the "WORK" chip, headline, a 2–3 sentence holding statement under 65ch, and a ghost "GET IN TOUCH" button anchoring to #contact
  3. The services section renders three items separated by 1px Midnight-12% horizontal rules, each with Hot Pink number, Bold service name, and two body sentences — no card grid
  4. A ghost "TALK THROUGH WHAT YOU NEED →" button sits below service 03 and anchors to #contact
  5. Interrupt fades in on scroll; work section reveals on the shared stagger pattern; services reveal headline-first then items 01–03 with 100ms stagger

**Plans**: shipped without per-plan PLAN.md files — see `.planning/phases/03-mid-page-story/03-SUMMARY.md` (cloud-session simplification per HANDOFF.md)
**UI hint**: yes

### Phase 4: Conversion & Persistent Surfaces

**Goal**: The visitor reaches a low-friction Deep Teal contact moment, can email Kris in one click, sees a minimal Midnight footer, and a brand-gradient sticky tab follows them after the hero.
**Depends on**: Phase 3
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, FOOT-01, FOOT-02, FOOT-03, FOOT-04, TAB-01, TAB-02, TAB-03, TAB-04, TAB-05, TAB-06, TAB-07, JS-01, JS-02, JS-03, JS-04, JS-05, JS-06
**Success Criteria** (what must be TRUE):

  1. The contact section renders Deep Teal full-bleed with the "FREE SESSION" ghost-on-dark chip, headline, 2-sentence body, a White → Midnight-on-hover CTA labelled `hello@looktwice.uk` opening a `mailto:` link, and the static prompt copy beneath
  2. Clicking the contact CTA on desktop opens the user's mail client with `mailto:hello@looktwice.uk`; on mobile the same link opens the native mail composer
  3. The Midnight footer shows wordmark + tagline left and LinkedIn / mailto / copyright right on desktop, stacks left-aligned on mobile, and footer links flip to Link Sage on hover
  4. The sticky tab is hidden on load, slides in from the right (or up from the bottom on mobile) once `scrollY > hero height`, anchors to #contact, has `aria-label="Contact Kris"`, and uses the brand gradient — the only place gradient appears on the site
  5. Both pill and 4px sticky-tab variants render at build (toggle / both visible) so Kris can pick one before launch
  6. All JS is vanilla (no libraries), uses `{ passive: true }` scroll listeners, and `scroll-behavior: smooth` is suppressed under `prefers-reduced-motion: reduce`
  7. Anchor links from nav, hero buttons, work button, and services button smooth-scroll to the correct sections on click

**Plans**: shipped without per-plan PLAN.md files — see `.planning/phases/04-conversion-persistent/04-SUMMARY.md` (cloud-session simplification per HANDOFF.md)
**UI hint**: yes

### Phase 5: Hardening & Launch

**Goal**: The site passes WCAG AA, hits the performance budget, is discoverable in search, holds together at every breakpoint from 375px to 1440px+, and is ready to cut over from the holding page on `main`.
**Depends on**: Phase 4
**Requirements**: A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, PERF-01, PERF-02, PERF-03, PERF-04, SEO-01, SEO-02, SEO-03, RESP-01, RESP-02, RESP-03, RESP-04, DEPLOY-03
**Success Criteria** (what must be TRUE):

  1. Lighthouse on the deployed preview reports LCP < 2.5s, CLS < 0.1, FID < 100ms, and total page weight under 500KB excluding images
  2. WCAG AA contrast verified on Hot Pink, Signal Orange, and Deep Teal surfaces (700 weight where 400 fails); heading order is H1 → H2 → H3 with no skips; every image has descriptive alt text; every interactive element shows a visible focus ring and is reachable by keyboard in visual order
  3. With `prefers-reduced-motion: reduce` set, scroll reveals fade opacity-only with no transform and smooth-scroll is disabled
  4. Every section reads cleanly and stays visually intact at iPhone SE width (375px), tablet (768px), and desktop (1440px+); section padding collapses from --space-section to --space-xl on mobile
  5. View source shows correct `<title>`, meta description, canonical, and og: tags; `ProfessionalService` JSON-LD validates; `robots.txt` allows all crawlers and a favicon is present
  6. A documented cutover plan exists for switching Cloudflare Pages production source from `main` to `new-site` (or merging) once Kris approves, with `main` untouched until then

**Plans**: shipped without per-plan PLAN.md files — see `.planning/phases/05-hardening-launch/` (CONTEXT, RESEARCH, DISCUSSION-LOG, OPEN-DECISIONS, SUMMARY, VERIFICATION, CUTOVER-PLAYBOOK)
**UI hint**: yes

### Phase 7: Design-system foundations (V1 Refresh P1)

**Goal**: Settle the global primitives — minimum font sizes, one standardised button system, and unified CTA copy — so every later refresh phase renders on consistent foundations.
**Depends on**: Phase 6 (post-UAT polish, complete)
**Requirements**: V1 Refresh review items (Kris site review 2026-05-31) — see ROADMAP-REFRESH.md Phase 1
**Success Criteria** (what must be TRUE):

  1. All prose floors at 16px; all sub-labels (eyebrows, chips, captions) floor at 14px — `--text-label` raised 0.8rem (12.8px) → 0.875rem (14px) at `css/tokens.css:50`, and `css/` audited for any other sub-16px prose
  2. The button system collapses by REMOVING the two mid-page in-page CTAs (work `index.html:221`, services `index.html:264`); the two surviving buttons (`btn--on-pink` hero, `btn--on-teal` contact) already share one white-fill-on-colour, invert-on-hover style; unused accent variants (`btn--accent-pink`, `btn--accent-indigo`, `btn--accent-amber`) dropped from `css/components.css`
  3. The two remaining CTAs (hero `index.html:129`, contact mailto `index.html:279`) read "Free 30-min chat" — one string sitewide
  4. The brand gradient still appears in exactly one place (the floating CTA pill, refresh Phase 2 / GSD 08) — button work paints no gradient anywhere else
  5. The CLAUDE.md em-dash ban is relaxed to allow hyphens in number-word content
  6. The hero pre-button label (`index.html:127`) is reworded to a value line, not a duplicate of the button — provisional "No sale, no follow-up unless you want one." (final wording confirmed by Kris in refresh P4)

**Decisions**: locked in `07-CONTEXT.md` (supersedes earlier "Free 30-min call" / per-surface-accent assumptions). See `07-DISCUSSION-LOG.md` for alternatives.
**UI hint**: yes
**Plans**: 1 plan

  - [x] 07-01-PLAN.md — token bump (14px label floor), button-variant removal, CTA copy unify, hero label reword, CLAUDE.md em-dash relaxation

### Phase 8: Navigation & floating action bar (V1 Refresh P2)

**Goal**: The header stops being persistent and scrolls away; a floating action bar takes over past the hero — a gradient CTA pill plus white/pink burger nav — so navigation never double-menus and the persistent CTA re-answers the two mid-page segues that refresh P1 left dangling.
**Depends on**: Phase 7 (design-system foundations — button system + CTA copy), complete
**Requirements**: V1 Refresh review items (Kris site review 2026-05-31) — see ROADMAP-REFRESH.md Phase 2
**Success Criteria** (what must be TRUE):

  1. The header no longer sticks or fixes; it scrolls away with the page, and the scroll-driven background/colour animation is removed (markup + JS)
  2. The responsive burger + full-screen overlay is removed entirely (markup + JS); "Contact" is dropped from the menu; remaining menu items are reordered to match page order; header left/right padding aligns to the page section gutter (logo left, menu right)
  3. A floating action bar appears only after the hero (reusing the existing scroll-entrance gate at `js/main.js`), never overlapping the header — no double-menu
  4. The bar's left element is a gradient CTA pill (the one place the brand gradient appears), labelled with the unified CTA string; its right element is a circular white-bg/pink-text burger whose two lines rotate into an X on tap
  5. On mobile, tapping the burger reveals Work + Approach pills (white/pink) sliding up stacked above it; tapping the X slides them down. On desktop there is no burger — the pills are always visible as a row: ( CTA ) ( Work ) ( Approach )
  6. Keyboard + focus management is correct: `aria-expanded` on the burger, logical pill tab order, Escape closes, focus returns to the burger on close; line→X and slide animations collapse to opacity/instant under `prefers-reduced-motion: reduce`
  7. The persistent floating CTA covers the two dangling segues refresh P1 left (work paragraph `index.html:220`, services offer `index.html:262`) — confirmed in discuss

**Decisions**: to be locked in `08-CONTEXT.md` during discuss. Carryover from refresh P1: reconcile the CTA string — refresh P1 shipped "Free 30-min chat" sitewide, ROADMAP-REFRESH.md Phase 2 still reads "Free 30-min call". Resolve in discuss.
**UI hint**: yes
**Plans**: 3 plans

  - [x] 08-01-PLAN.md — Header refactor: non-fixed scroll-away, remove hamburger/overlay/scroll-fade, drop Contact, reorder Approach→Work, align section gutter, keep mobile links (Wave 1)
  - [x] 08-02-PLAN.md — Floating action bar: gradient CTA pill + circular white/pink two-line burger, mobile slide-up Approach/Work stack, desktop pill row, scroll-gate + contact-suppress + reduced-motion + focus/keyboard, cache-bust bump (Wave 2)
  - [x] 08-03-PLAN.md — Heavy Playwright suite (D-18): dev-only harness + responsive/scroll-away/menu-order/bar-gate/slide-up/desktop-row/focus-trap/line-to-X tests at 375/768/1440 (Wave 3)

### Phase 9: P08 bug fixes & tweaks (fix phase)

**Goal**: Fix the bugs Kris found in the shipped Phase 08 floating action bar and rework the menu concept to match her new ideas (which deviate from the original concept Phase 08 built). Keep the shipped P08 as baseline; this phase corrects and evolves it.

**Depends on**: Phase 8 (navigation & floating action bar, complete + verified 7/7)
**Requirements**: Bug reports + tweak requests from Kris (captured in `09-CONTEXT.md` during discuss); menu-deviation examples to be shared.
**Numbering note**: This is a fresh fix/tweak phase, NOT a continuation of ROADMAP-REFRESH.md numbering. Refresh P3 (Cutout reveal system) is still the next *refresh-roadmap* phase and is unstarted.
**Success Criteria** (what must be TRUE): to be derived in discuss once bugs + menu deviation are captured.

**Decisions**: to be locked in `09-CONTEXT.md` during discuss.
**UI hint**: yes
**Plans**: TBD after discuss

### Phase 10: Contact mechanic — form vs email (V1 Refresh P7)

**Goal**: Replace the `mailto:` contact with a working, accessible Formspree contact form. Decision gate resolved (form wins, 2026-06-01): build form-only contact (name, email, message), remove ALL visible mailto links and the visible email address (D-02), wire a vanilla-JS fetch submit to the real Formspree endpoint with honeypot spam protection and the verbatim data-use note, and reverse the CLAUDE.md + STATE mailto lock.

**Depends on**: Phase 8 (navigation & floating action bar, complete) for the CTA surfaces that point at contact. Independent of refresh P3–P6 (started ahead of them by Kris's choice).
**Requirements**: No formal REQ IDs — decisions D-01..D-09 locked in `10-CONTEXT.md`. Goal-backward must_haves derived from the phase goal + those decisions.
**Numbering note**: GSD Phase 10 = refresh-roadmap P7. Refresh P3 (Cutout reveal) and P4–P6 remain unstarted; GSD numbers are assigned in start order, not refresh order.
**Success Criteria** (what must be TRUE):

  1. The contact section renders a form (name, email, message) on the Deep Teal surface; no mailto button and no visible email address remain anywhere on the page (D-02)
  2. A valid submit POSTs to `https://formspree.io/f/xbdbnrkr` via vanilla-JS fetch (`Accept: application/json`) and shows an inline success message with no reload or redirect (D-05, D-08)
  3. Empty required fields block submit, announce via an `aria-live="polite"` region, and focus moves to the first invalid field; every field has a real `<label>`; all inputs + submit show a visible focus ring (D-09)
  4. A hidden `_gotcha` honeypot plus Formspree's filter guard against spam; failed submits show a generic retry message with NO email address (D-06, D-02)
  5. The data-use note appears verbatim per D-07; the form honours all design bans (no shadows, no weight 500, no gradients, no mid-tone greys) and Epilogue 400/700
  6. CLAUDE.md and STATE.md record the mailto→form reversal with rationale; a Playwright spec covers submit / validation / honeypot / error states against a mocked endpoint

**Decisions**: locked in `10-CONTEXT.md` (D-01..D-09). Pattern map in `10-PATTERNS.md`.
**UI hint**: yes
**Plans**: 2 plans

  - [x] 10-01-PLAN.md — Form markup + Deep Teal CSS + vanilla-JS fetch submit handler; remove all visible mailto/email (Wave 1)
  - [x] 10-02-PLAN.md — Reverse the mailto lock in CLAUDE.md + STATE.md; add Playwright E2E spec (mocked Formspree) (Wave 2)

### Phase 12: Build pipeline & tooling foundation

**Goal**: Convert the project from "static files served as-is" to a built artifact, so later phases (starting with the Phase 11 cutout build function) have a real pipeline. Set the Cloudflare Pages build command, add build-time image optimization (responsive srcset + AVIF/WebP + compression), CSS/JS minify + autoprefix (PostCSS or Lightning CSS), and point browser-sync (3000) + Playwright (7777) at the built output. Records the CLAUDE.md tech-stack relaxation (2026-06-02): build step + npm deps now allowed; shipped artifact stays plain static HTML/CSS/JS, no client-side framework, no Tailwind.

**Depends on**: Phase 8 (complete). **Executes before Phase 11.**
**Requirements**: No formal REQ IDs — derived in discuss. Tech-stack relaxation already recorded in `CLAUDE.md` (2026-06-02).
**Numbering note**: GSD Phase 12 = registration order. It runs BEFORE Phase 11 (which was registered first but depends on this pipeline).
**Open decisions for discuss**:

  1. Build tool choice: zero-dep Node script vs a light builder; PostCSS vs Lightning CSS for CSS.
  2. Image pipeline: which formats/sizes, where generated assets live, how `srcset` is wired into markup.
  3. Source→output model: token-replace in committed `index.html` vs template→generated output; output dir (root vs `dist/`).
  4. Cloudflare Pages config: build command + output directory; keep `main` holding-page deploy untouched.
  5. Dev/test wiring: `npm run build` ahead of `npm test`; browser-sync serving built output without breaking hot reload.

**Decisions**: to be locked in `12-CONTEXT.md`.
**UI hint**: no (infrastructure)
**Plans**: 3 plans

- [x] 12-01-PLAN.md — build.js core: deps install, Lightning CSS minify, sharp AVIF+WebP x4 widths + srcset rewrite, static-asset copy into dist/, mtime image cache, build-smoke spec
- [ ] 12-02-PLAN.md — dev/test wiring: Playwright builds-first + serves dist/ on 7777, browser-sync serves dist/ on 3000 with source-watch rebuild + hot reload
- [ ] 12-03-PLAN.md — Cloudflare branch gate (build.sh on CF_PAGES_BRANCH), preview header check, blocking human-verify that main holding page stays untouched

### Phase 11: Cutout reveal system (V1 Refresh P3)

**Goal**: Build the cutout-reveal technique from `image-cutout-demo.html` once, as a reusable `.cutout` component, so later refresh phases (5 Services, 8 Visual variety) and a hero refactor all consume the same SVG-mask primitive. Realizes the locked "cutout/drenched aesthetic — colour on surface, B&W in apertures."

**Depends on**: Phase 12 (build pipeline & tooling foundation) — provides the Cloudflare build command + image pipeline the cutout build function runs on. Also Phase 8 (nav/floating bar, complete). Independent of refresh P4–P6. Partly unblocked — `kris-portrait.webp` + `scene-cafe.webp` already in repo; new section imagery from Kris/Jamie still pending for non-hero bands.
**Requirements**: No formal REQ IDs — decisions locked in `11-CONTEXT.md` during discuss. See `ROADMAP-REFRESH.md` Phase 3 for full task detail.
**Numbering note**: GSD Phase 11 = refresh-roadmap P3. Refresh P4–P6 + P8 remain unstarted; GSD numbers assigned in start order, not refresh order.
**Success Criteria** (what must be TRUE): to be derived in plan from the locked decisions below.

**Decisions** (locked in `11-CONTEXT.md`, 2026-06-02):

  - D-01/02 Surface: field = solid section colour, windows reveal a B&W image behind. Gradient rule untouched (no CLAUDE.md relaxation for gradient).
  - D-03 Apertures: B&W/grayscale.
  - D-04/08 Reusable `buildCutout(image, shapes)` function; five presets — circle, down-triangle, up-triangle, pill, rounded-rect.
  - D-05 Hero: refactor onto the primitive this phase.
  - D-06 Images: external WebP + srcset, lazy below fold, no base64. Hero eager.
  - D-07 Motion: static, no scroll animation.
  - D-09 Single shared `<image>` behind one `<mask>` with all shape paths in one viewBox coordinate space — never per-shape image copies.
  - D-10/10a Cloudflare **deploy-time build command** generates static HTML. **Relaxes the CLAUDE.md "no build step / no bundlers" V1 rule** — CLAUDE.md updated this phase (constraint reversal, mirrors Phase 10).

**UI hint**: yes
**Plans**: TBD after plan-phase

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundations & Deploy Pipeline | 0/3 | Not started | - |
| 2. Hero & Situation | 0/3 | Not started | - |
| 3. Mid-page Story | 0/0 | Not started | - |
| 4. Conversion & Persistent Surfaces | 0/0 | Not started | - |
| 5. Hardening & Launch | 0/0 | Not started | - |
| 6. Post-UAT Polish | shipped | Complete | 2026-05-04 |
| 7. Design-system foundations (refresh P1) | 1/1 | Complete   | 2026-06-01 |
| 8. Navigation & floating action bar (refresh P2) | 4/4 | Complete    | 2026-06-01 |
| 12. Build pipeline & tooling foundation | 1/3 | In Progress|  |
| 11. Cutout reveal system (refresh P3) | 0/0 | Not started | - |
| 9. P08 bug fixes & tweaks (fix phase) | shipped | Complete (bug/tweak scope) | 2026-06-01 |
| 10. Contact mechanic — form vs email (refresh P7) | 2/2 | Complete    | 2026-06-01 |

## Coverage Summary

| Category | Count | Phase |
|----------|-------|-------|
| FOUND | 5 | 1 |
| NAV | 5 | 1 |
| HERO | 6 | 2 |
| SITU | 5 | 2 |
| INTR | 4 | 3 |
| WORK | 4 | 3 |
| SERV | 5 | 3 |
| CONT | 6 | 4 |
| FOOT | 4 | 4 |
| TAB | 7 | 4 |
| JS | 6 | 4 |
| A11Y | 6 | 5 |
| PERF | 4 | 5 |
| SEO | 3 | 5 |
| RESP | 4 | 5 |
| DEPLOY | 3 | split (01,02 → Phase 1 / 03 → Phase 5) |

**Total mapped:** 77 / 77 v1 requirements ✓
**Orphans:** 0
**Duplicates:** 0

## Notes

- DEPLOY-01 and DEPLOY-02 are pulled into Phase 1 deliberately — a working preview pipeline from day one means every later phase ships visibly to a URL Kris can review. DEPLOY-03 (cutover) stays in Phase 5 because it's a launch-time action.
- Cross-cutting concerns (A11Y, PERF, RESP, SEO) are concentrated in Phase 5 rather than spread across earlier phases. Each section phase still produces accessible, responsive output, but the formal verification, Lighthouse run, and contrast audit happen once at the end. This matches coarse granularity.
- Phase 5 also documents the cutover; no automatic switch.
- All five phases involve UI work — every detail block carries a UI hint.

---
*Last updated: 2026-04-29 after roadmap creation*
