# Phase 2: Hero & Situation - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

A warm referral landing on the preview sees a Hot Pink hero with Kris's cutout portrait + a smaller supporting B&W cutout, reads the headline + subhead, and clicks one of two CTAs ("BOOK A SESSION" → #contact, "SEE THE WORK" → #work). They scroll into a Linen "THE SITUATION" section with a section headline and five numbered blocks (01–05) in client language, revealed on scroll with an 80ms stagger. The Phase 1 sticky nav, semantic shell, and token surface stay untouched — Phase 2 only fills `<section id="hero">` and `<section id="situation">` and appends to `js/main.js`.

In scope: hero markup + CSS (Hot Pink surface, two-column desktop / stacked mobile, cutout composition, headline, subhead, two CTAs), situation markup + CSS (Linen surface, chip + headline + five blocks, desktop staggered two-column / mobile single-column), one generic `.reveal` IntersectionObserver in `js/main.js`, hero image assets at agreed paths.

Out of scope: positioning interrupt + work + services (Phase 3), contact + footer + sticky tab (Phase 4), accessibility audit + performance verification + responsive breakpoint audit + cutover (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Hero copy
- **D-01:** Hero headline ships as **"Your brand makes a promise. But is your experience breaking it?"** — Option A from CONTENT-DRAFT, tweaked from the declarative two-statement form ("Your brand makes a promise. Your experience breaks it.") into a question. Two display lines, line break between sentences. Kris can refine in place on the live preview before launch.
- **D-02:** Hero subhead ships as **"I find where brand promise and experience are out of step. Then close the gap."** — CONTENT-DRAFT primary subhead, with the original em-dash split into a period to comply with the no-em-dash design ban. Two short sentences read as one beat. White at 85% opacity per HOMEPAGE-SPEC.
- **D-03:** Hero CTAs are locked at the spec level — primary "BOOK A SESSION" (Midnight fill → Hot Pink hover) → `#contact`, ghost "SEE THE WORK" (1.5px White border → White fill hover) → `#work`. No copy changes. Side-by-side on desktop, stacked on mobile.

### Situation copy
- **D-04:** Situation section headline ships as **"Sound familiar?"** — softer of the two CONTENT-DRAFT options, matches the recognise-your-own-situation purpose of the section.
- **D-05:** All five situation blocks 01–05 ship verbatim from CONTENT-DRAFT.md. No `[DRAFT]` markers in the rendered HTML — the preview is the review surface. Kris refines individual blocks in place via PR or follow-up phase.
- **D-06:** "THE SITUATION" Midnight chip + section headline render in the section header; the five numbered blocks follow with the layout in D-12.

### Hero photography
- **D-07:** Main cutout (large rounded-rect, ~40–50% section width on desktop) renders **a temp Kris headshot** at `images/kris-portrait.webp`. User (Kris/Jamie) sources and converts the JPG to WebP before plan-phase or before Wave 2 commit. Conversion path: Squoosh (https://squoosh.app, drag-drop, quality 75–80) or macOS `sips -s format webp <src>.jpg --out images/kris-portrait.webp`. Fully desaturated via `filter: grayscale(100%)` per HOMEPAGE-SPEC.
- **D-08:** Supporting cutout (smaller circle / rounded-rect, asymmetric to the main) renders **a stock greyscale image** (workshop / hands working / architectural detail per HOMEPAGE-SPEC §Section 2) at `images/hero-supporting.webp`. User selects manually (PROJECT.md bans automated picks). Same desaturate filter — note the source image can be colour, the CSS handles greyscale.
- **D-09:** Image format is WebP at fixed paths — single source per slot, no `srcset` for Phase 2. Responsive sizing handled via CSS `object-fit` + `max-width`. Phase 5 may add `srcset` if Lighthouse calls for it. Hero main cutout ships with `fetchpriority="high"` and `loading="eager"` in Phase 2 (the LCP-candidate above-the-fold image — defensible perf win even though broader LCP optimisation is deferred to Phase 5).
- **D-10:** **Fallback if either image is missing at execute time:** hero falls back to a Midnight token-block placeholder rendered at the exact size and position the real image will occupy. The plan does not block on the file's presence. Replacing the placeholder with the real image is a single-file commit on `new-site` later, no markup or CSS change required.
- **D-11:** Both cutouts are positioned on the Hot Pink surface only — text never overlaps photography. Asymmetric, not symmetrical.

### Situation layout + reveal
- **D-12:** Desktop layout = staggered two-column. Column 1: items 01, 02, 03. Column 2: items 04, 05, offset down ~1 item height. Gap `--space-lg` (64px). Mobile = single column, `--space-md` (32px) between items. Per HOMEPAGE-SPEC §Section 3.
- **D-13:** Reveal mechanics locked from HOMEPAGE-SPEC: chip + headline reveal first; then items 01–05 stagger in 80ms apart; opacity 0→1, translateY 16px→0, 400ms ease-out-quart; IntersectionObserver threshold 0.2.

### Reveal observer architecture
- **D-14:** Build **one generic `.reveal` IntersectionObserver** in `js/main.js`. It watches every element with class `.reveal`, applies the transition above, and reads a per-element stagger index from `data-reveal-index` (or `--stagger-delay` CSS custom property — planner picks). Phase 2 wires the chip, the section headline, and the five situation blocks; Phases 3 and 4 reuse the same observer by adding `.reveal` + index to their elements. Single source of truth for reveal animation rules.
- **D-15:** **One-shot per element** — once an element has revealed, the observer unobserves it. No re-trigger on re-entry. Lighter, less distracting on scroll-back, matches HOMEPAGE-SPEC's single-reveal language.
- **D-16:** Hero never reveals on scroll — visible immediately on load (HERO-06 / HOMEPAGE-SPEC). Hero markup carries no `.reveal` class.
- **D-17:** `prefers-reduced-motion: reduce` fallback: opacity-only fade, no transform. Same pattern Phase 1 used for nav transitions. Implemented in `css/animations.css` via `@media (prefers-reduced-motion: reduce)` override of the `.reveal` transition.

### File ownership (carried from Phase 1 D-06)
- **D-18:** Phase 2 writes into `index.html` (hero + situation section bodies), `css/components.css` (hero, situation, button, chip, cutout component classes), `css/animations.css` (`.reveal` transition + reduced-motion guard), `js/main.js` (append generic reveal observer alongside existing nav scroll handler). New asset directory: `images/` already exists from Phase 1; the two image files land there.

### Claude's Discretion
- Exact CSS class names within the BEM-ish convention (e.g. `.hero`, `.hero__cutout--main`, `.situation__block`, `.situation__number` vs alternatives). Planner picks consistent with Phase 1 naming.
- Whether to use a single `<picture>` element or plain `<img>` for the cutouts. Planner picks; both fit D-09.
- Stagger-delay implementation — `data-reveal-index` consumed by JS, or `--stagger-delay` CSS custom property set inline. Either is fine; planner picks.
- Hero responsive breakpoint pixel value (where two-column → stacked). Recommend ~768px (matches Phase 1 nav hamburger breakpoint) but planner confirms against actual content overflow.
- Alt text wording for cutouts. CONTENT-DRAFT §Photography Direction has guidance ("Kristina Evawin, brand and CX strategist" for portrait; describe content not visual device for supporting). Planner writes per that guidance.
- Cutout shape exact dimensions (HOMEPAGE-SPEC says ~40–50% section width for main, doesn't pin supporting). Planner picks within the asymmetric-tension brief.

### Folded Todos
None — `gsd-tools todo match-phase 2` returned no matches.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project specs (root, source of truth — do NOT modify)
- `PRODUCT.md` — audience, voice, brand personality
- `DESIGN.md` — full design system reference, hero + situation surface treatments
- `DESIGN.json` — design system in machine-readable form
- `DESIGN_NOTES.md` — supplementary design rationale

### Phase-2 implementation specs
- `.planning/seeds/HOMEPAGE-SPEC.md` §Section 2 (Hero / `#hero`) — surface, cutout composition, text, buttons, layout, scroll-reveal=none
- `.planning/seeds/HOMEPAGE-SPEC.md` §Section 3 (Problem Identification / `#situation`) — surface, padding, label chip, section headline, five-block structure, desktop staggered + mobile single-column layout, scroll-reveal mechanics (80ms stagger, 400ms ease-out-quart, threshold 0.2)
- `.planning/seeds/HOMEPAGE-SPEC.md` §Photography Direction — desaturate-via-CSS rule, hero main + supporting alt text guidance
- `.planning/seeds/HOMEPAGE-SPEC.md` §Animation Cheatsheet — situation stagger row authoritative
- `.planning/seeds/CONTENT-DRAFT.md` §Section 1 (Hero) — headline options + subhead options (D-01 / D-02 lock the picks)
- `.planning/seeds/CONTENT-DRAFT.md` §Section 2 (Problem Identification) — section headline options + five situation blocks 01–05 (D-04 / D-05 lock the picks)
- `.planning/seeds/DESIGN-TOKENS.md` — Hot Pink, Linen, Midnight, White colour tokens; type scale (Display / Headline / Title / Body / Label); spacing (`--space-section`, `--space-lg`, `--space-md`, `--space-xl`); transition tokens; cutout radius (16px)
- `.planning/seeds/ARCHITECTURE.md` — hero/situation file ownership (`components.css` + `animations.css`), JS pattern (`{ passive: true }`, IntersectionObserver), accessibility checklist

### Requirements + roadmap
- `.planning/REQUIREMENTS.md` — HERO-01 through HERO-06, SITU-01 through SITU-05 (Phase 2 scope)
- `.planning/ROADMAP.md` Phase 2 — five success criteria

### Phase 1 artefacts (foundation already in place)
- `index.html` — semantic shell with `<section id="hero">` and `<section id="situation">` empty anchors
- `css/tokens.css` — every token Phase 2 consumes
- `css/base.css` — modern reset, body type, `--measure` cap
- `css/components.css` — Phase 1 nav/overlay/button-base; Phase 2 appends hero, situation, chip, cutout, button-variants
- `css/animations.css` — Phase 1 nav transition + reduced-motion guard pattern; Phase 2 appends `.reveal` rules
- `js/main.js` — Phase 1 nav scroll-toggle + hamburger overlay; Phase 2 appends generic IntersectionObserver
- `fonts/epilogue-{400,700}.woff2` — already self-hosted with `font-display: swap`
- `.planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md` — Phase 1 decisions (six sections, file ownership, naming conventions)
- `.planning/phases/01-foundations-deploy-pipeline/01-VERIFICATION.md` — Phase 1 verification record
- Live preview: `https://new-site.looktwice-uk.pages.dev`

### CLAUDE.md
- `CLAUDE.md` (root) — project constraints, design bans (no em-dash, no card shadows, no font-weight 500, no glassmorphism, no mid-tone greys), GSD workflow enforcement

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Sticky nav, hamburger overlay, footer placeholder all live in `index.html` + `css/components.css` from Phase 1 — Phase 2 leaves them alone.
- Token surface in `css/tokens.css` is complete — Hot Pink, Linen, Midnight, White, all type and spacing scales already declared. Phase 2 consumes via `var(--token-name)`, never hard-codes.
- `prefers-reduced-motion` guard pattern established in `css/animations.css` for nav transitions — Phase 2 follows the same pattern for `.reveal`.
- Self-hosted Epilogue 400/700 already loaded with `font-display: swap` — no font work in Phase 2.

### Established Patterns
- BEM-ish class naming (`.nav`, `.nav-link`, `.nav-link--active`) — Phase 2 follows for `.hero`, `.hero__cutout--main`, `.situation__block`, etc.
- Token consumption only — every colour, spacing, type size, radius reads from `var(--token)`.
- Five-CSS-file split with predictable ownership — Phase 2 appends only to `components.css` and `animations.css`.
- IntersectionObserver + class-toggle pattern (Phase 1 used for nav scroll-state) — Phase 2 reuses the shape for `.reveal`.
- `{ passive: true }` on scroll listeners — already convention in `js/main.js`.

### Integration Points
- `<section id="hero">` and `<section id="situation">` are empty anchors in `index.html` — Phase 2 fills their bodies.
- `js/main.js` has a Phase 1 nav scroll handler — Phase 2 appends a separate IntersectionObserver block, no rework of existing JS.
- `images/` directory exists with `.gitkeep` from Phase 1 — Phase 2 commits two image files (`kris-portrait.webp`, `hero-supporting.webp`) into it. If files arrive after plan-phase, they slot into the agreed paths via a single follow-up commit.
- Nav transparent → Linen scroll-toggle on `scrollY > 0` already wired — Phase 2 hero needs to test the white-text-on-transparent-nav contrast looks right against Hot Pink (Phase 1 verifier flagged the wordmark may look low-contrast against the empty hero; with Hot Pink behind it, contrast actually improves).

### Constraints the existing setup imposes
- No new CSS files — must append to existing five.
- No new JS files — must append to `js/main.js`.
- No font work — Epilogue 400/700 only, both already loaded.
- No npm dependencies, no preprocessors — vanilla everything.

</code_context>

<specifics>
## Specific Ideas

- The hero headline change from declarative ("Your experience breaks it.") to interrogative ("But is your experience breaking it?") softens the accusation and invites the reader in. It's a meaningful voice shift worth flagging in CONTENT-DRAFT for Kris.
- Em-dash bans are real — the original primary subhead in CONTENT-DRAFT has one. Phase 2 ships a period-split version. Future copy edits should sweep CONTENT-DRAFT for the same issue.
- The Midnight-block fallback for missing images is a deliberate "ship the layout regardless" choice — it lets the hero be visually verifiable on the preview even if image files aren't ready, and the swap-in is a single-file commit. Avoids a hard dependency between content production and code work.
- The generic `.reveal` observer is the foundation for every later phase's scroll animation. Getting it right in Phase 2 means Phase 3 (work, services reveals with 100ms stagger per HOMEPAGE-SPEC) and Phase 4 (contact reveals) just add classes, no new JS.
- Stock supporting cutout sourcing: pexels.com or unsplash.com filtered to greyscale + workshop/hands/architectural detail keywords. User selects manually — no automated pulls.

</specifics>

<deferred>
## Deferred Ideas

- Responsive `srcset` for hero images — Phase 5 if Lighthouse demands it.
- Image LCP optimisation broader sweep (preload tag for main cutout, additional perf hints) — Phase 5 (PERF-01). Note: hero main cutout `fetchpriority="high"` lands in Phase 2 per D-09 (above-the-fold LCP candidate, defensible standalone win).
- Final Kris portrait + final supporting cutout — Kris commissions/selects late in the cycle. Phase 2 ships with temp/stock; the swap is a single-file commit on `new-site` once finals are ready, no markup change.
- Refining situation block 01–05 copy in Kris's voice — happens on the live preview after Phase 2 ships, not as a phase of its own.
- `[DECIDE]` markers elsewhere in CONTENT-DRAFT (positioning interrupt option A/B in §Section 3, work section public client names in §Section 4) — Phase 3 decisions.
- Hero supporting cutout shape (circle vs rounded-rect) — HOMEPAGE-SPEC says "circle (or rounded rect)". Planner can pick within the asymmetric-tension brief; not a user decision.

### Reviewed Todos (not folded)
None — `gsd-tools todo match-phase 2` returned no matches.

</deferred>

---

*Phase: 02-hero-situation*
*Context gathered: 2026-04-30*
