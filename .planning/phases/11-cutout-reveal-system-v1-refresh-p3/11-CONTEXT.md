# Phase 11: Cutout reveal system (V1 Refresh P3) - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the cutout-reveal technique from `image-cutout-demo.html` once, as a reusable `.cutout` component, and refactor the existing hero onto it. The component is an SVG `<mask>`: the section's solid colour is the field, white shapes are "windows" that reveal a black-and-white image sitting behind. This realizes the project's locked "cutout/drenched aesthetic — colour on surface, B&W in apertures."

**In scope:**
- A reusable `buildCutout(image, shapes)` build function + the five-preset shape vocabulary (D-04, D-08).
- A Cloudflare deploy-time build command that runs the function and emits static HTML (D-10).
- Updating CLAUDE.md to permit the deploy-time build (constraint reversal, D-10a).
- Refactor the current single-shape hero cutout onto the new primitive (D-05).
- Responsive stacking/reflow of windows on mobile.
- External-WebP image handling within the perf budget (srcset, lazy below the fold; no base64).
- Accessibility: decorative windows `aria-hidden` / empty alt; meaningful imagery gets real alt.
- Wiring Playwright + browser-sync to run against built output.

**Out of scope (other phases):**
- Services-section imagery using the primitive → refresh P5 (Services redesign).
- "Break the rectangle" layout work / Approach imagery → refresh P8 (Visual variety).
- Animated/wipe-open mask reveals → P8 if ever (this phase ships static).
- New section copy → refresh P4.
</domain>

<decisions>
## Implementation Decisions

### Surface mechanic (resolves the gradient conflict)
- **D-01:** The field behind the windows is the **solid section colour** (Hot Pink hero, Linen, Deep Teal, etc.). The white mask shapes are windows that reveal an **image sitting behind** the surface. Mental model: "cutouts in the colour of the section revealing an image behind."
- **D-02:** This means the demo's mechanic is kept but its **gradient body is replaced by the solid section colour**. The CLAUDE.md one-gradient rule stays intact — the brand gradient remains only on the floating CTA pill. **No CLAUDE.md relaxation needed.**

### Aperture treatment
- **D-03:** Revealed images are **black-and-white / grayscale** inside every window — matches the locked "B&W in apertures" aesthetic and the current hero `filter: grayscale(100%)`.

### Shape presets
- **D-04:** The component authors **five** shape presets: circle, down-triangle (rounded), up-triangle (rounded), pill (stadium), rounded-rect. Down-triangle / up-triangle / pill come straight from the demo; rounded-rect matches the current hero; circle is added.

### Hero scope
- **D-05:** **Refactor the hero in this phase.** Move the current single rounded-rect grayscale hero (`index.html` `.hero__cutout`, `css/components.css:236`) onto the new mask primitive — one image, mask-based windows. Proves the component on a real surface immediately. Hero imagery (`scene-cafe.webp`) already exists.

### Image loading
- **D-06:** Images load via **external WebP referenced from the SVG (`<image href="…webp">`), with srcset, lazy-loaded below the fold** (hero stays eager / `fetchpriority="high"` as today). The demo's inline base64 (~112KB for one image) is **not shippable** — strip it. Honour the CLAUDE.md budget: <500KB excl. images, WebP + srcset, lazy below the fold.

### Motion
- **D-07:** **Static render — no scroll animation** on the cutout windows this phase. Keeps the primitive simple; no new reduced-motion branch beyond what exists. Animated/wipe reveals are deferred to P8 if ever pursued.

### Reusable build function
- **D-08:** The primitive is delivered as a **reusable build function** with an API shaped like `buildCutout(image, shapes)` — it receives one image and a set of shapes and produces the masked SVG markup. The five presets (D-04) are the `shapes` vocabulary.

### Single shared image / single mask (hard technical constraint)
- **D-09:** All shapes reveal the **same image**, via **one `<image>` element behind one `<mask>` that holds all the shape paths, in a single shared SVG `viewBox` coordinate space.** The image is drawn once and positioned once; each white shape is a window at its own coordinates in that same space. This is what keeps the shapes correctly positioned relative to each other and guarantees they all reveal one continuous photo. **Never per-shape image copies / never multiple masked image instances.** (This is exactly the demo's mechanic.)

### Pipeline (relaxes a hard CLAUDE.md rule)
- **D-10:** The build function runs as a **Cloudflare Pages deploy-time build command**. `index.html` (or marked cutout regions) is **generated at deploy** from a source template/config + the build script. Output is static HTML — so the hero stays LCP-safe and no-JS-safe (the reason for choosing build-time over runtime JS).
- **D-10a — CLAUDE.md reversal required this phase:** This **relaxes the CLAUDE.md V1 hard rule** "no frameworks, no preprocessors, no bundlers, no npm deps for V1 / no build step." It is **build-time code generation that emits plain static HTML**, not a shipped framework or runtime dependency. CLAUDE.md MUST be updated this phase to permit a deploy-time build, document the source→output split, and record the rationale — mirroring the Phase 10 mailto→form constraint-reversal pattern (reversal recorded in CLAUDE.md + STATE).

### Claude's Discretion
- Exact mask `viewBox` coordinates, per-shape path math, and token names for window layout.
- The internal form of each shape preset (path string, parameterised generator, etc.) — planner/researcher decides the cleanest reuse pattern inside the function.
- Per-section window composition (how many windows, which shapes) for the hero refactor, within D-03/D-04.

### Build pipeline is owned by Phase 12 (prerequisite)
The Cloudflare deploy-time build, image pipeline, CSS/JS minify, source→output model, Cloudflare config, and dev/test wiring are **set up in Phase 12 (Build pipeline & tooling foundation), which executes before this phase.** Phase 11 **consumes** that pipeline — it adds the `buildCutout(image, shapes)` codegen into the build Phase 12 establishes, and refactors the hero. Do not re-decide pipeline mechanics here; read `12-CONTEXT.md` once it exists and slot the cutout build step into the established build.

CLAUDE.md tech-stack relaxation (build step + npm deps allowed; shipped artifact stays plain static; no Tailwind) was **already recorded in CLAUDE.md on 2026-06-02** — so D-10a is largely done at the doc level; Phase 12 implements the pipeline it permits.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Technique source
- `image-cutout-demo.html` — the reference implementation. SVG `<mask id="shape-windows">`: black rect hides all, white shapes (down-triangle path, up-triangle path, pill rounded-rect) are windows; `<image>` revealed inside them. **Strip the base64 image and the gradient body** when extracting (see D-02, D-06).

### Locked project rules this phase touches
- `CLAUDE.md` — "Gradient discipline: brand gradient appears in exactly one place — the floating sticky tab." D-01/D-02 preserve this; do not relax it.
- `CLAUDE.md` — "Cutout/drenched aesthetic — colour on surface, B&W in apertures." This phase realizes it. Performance budget: LCP < 2.5s, CLS < 0.1, page weight < 500KB excl. images; WebP + srcset, lazy below fold.
- `CLAUDE.md` — "no frameworks, no preprocessors, no bundlers, no npm deps for V1." **D-10a relaxes this for a deploy-time build that emits static HTML.** Edit CLAUDE.md this phase (mirror the Phase 10 reversal pattern; see `10-CONTEXT.md` and the CLAUDE.md "Local preview server" note for how dev-tooling carve-outs were worded).
- `.planning/ROADMAP-REFRESH.md` §"Phase 3: Cutout reveal system" — full task list + Playwright lean.

### Build/test pipeline files to touch
- `package.json` — add a `build` script (the buildCutout runner); ensure `test` runs against built output.
- `playwright.config.js` — port 7777 static server; must serve built output.
- `bs-config.js` / browser-sync — port 3000 dev server; point at build result, keep hot reload.
- Cloudflare Pages project settings — build command + output directory (leave `main` holding-page deploy untouched).

### Current code to refactor
- `index.html:112-122` — current `.hero__cutouts` / `.hero__cutout` markup (single `scene-cafe.webp`, grayscale rounded-rect).
- `css/components.css:228-264` — `.hero__cutouts` / `.hero__cutout` styles (aspect-ratio 4/5, `--radius-cutout`, grayscale, mobile rules).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **SVG sprite** (`index.html:66` `<svg class="svg-sprite">`) — existing pattern for reusable SVG symbols (`#logo` via `<use href>`). Shape presets could live here as symbols, or as a dedicated mask defs block.
- **`.reveal` IntersectionObserver** (situation/services) — NOT used this phase (D-07 static), but the reduced-motion plumbing exists if motion is ever added in P8.
- **`scene-cafe.webp`, `kris-portrait.webp`** — images already in `images/`, already grayscale-treated in the hero.
- **`--radius-cutout`** token — current hero corner radius; reuse / generalise for the rounded-rect preset.

### Established Patterns
- Plain HTML + CSS + vanilla JS, no build step (CLAUDE.md hard constraint). The primitive must be hand-authored SVG/CSS — no component framework.
- Hero image loads eager with `fetchpriority="high"` (it's the LCP element) — preserve this in the refactor; only below-the-fold cutouts lazy-load.
- Grayscale via CSS `filter: grayscale(100%)` on the cutout wrapper — reuse for D-03.

### Integration Points
- Hero section (`#hero`) is where the primitive first lands (D-05).
- Future consumers: refresh P5 (Services) and P8 (Visual variety) — author the component's API with those in mind, but do not build their bands here.

</code_context>

<specifics>
## Specific Ideas

- The user's framing verbatim: "images — they're cutouts in the colour of the section revealing an image behind." Field = section colour; windows = B&W image. This is the canonical mental model for the whole primitive.
- Demo shapes to preserve: rounded down-triangle, rounded up-triangle, stadium pill. Add: circle, rounded-rect.

</specifics>

<deferred>
## Deferred Ideas

- **Services-section cutout imagery** — uses this primitive, but belongs to refresh P5 (Services redesign).
- **Approach-section imagery / break-the-rectangle layout** — refresh P8 (Visual variety).
- **Animated mask reveal (windows wipe/grow open on scroll)** — possible P8 enhancement; explicitly out this phase per D-07.
- **New section imagery from Kris/Jamie for non-hero bands** — still pending; hero refactor proceeds on existing `scene-cafe.webp`.

</deferred>

---

*Phase: 11-cutout-reveal-system-v1-refresh-p3*
*Context gathered: 2026-06-02*
