# Roadmap: V1 Refresh

> **SUPERSEDED 2026-06-03.** Phases 1, 2, 3, 7 shipped (GSD phases 7, 8, 11, 10). The unstarted phases — **P4 copy, P5 services, P6 credentials, P8 visual variety** — are replaced by the **V1 Restructure** build order (GSD phases 13-21) in `ROADMAP.md`. This file is kept as history and for the per-phase task detail the new phases still draw on. Do not start work from this file; use `ROADMAP.md` + `.planning/design-inputs.md`.

**Source:** Jamie website review (2026-05-04) + founder positioning chat (2026-05-08) + Kris site review (2026-05-31)
**Branch:** new-site
**Rule:** Check for uncommitted work before starting any phase. No new work on top of uncommitted work.

## How this roadmap works

- Work is grouped into 8 phases, ordered for development flow (not priority — everything ships before launch).
- **Each phase runs discuss → plan → execute → review.** Every detail gets further discussion at its phase, so decisions below are starting points, not final.
- A phase may hold several tasks/plans. Chunky design/redesign phases (3, 5, 6, 8) will get a `.planning/phases/NN-slug/` folder (numbering continues from 07) once they reach plan stage. Small phases run inline / `/gsd:quick`.
- **Done = all of a phase's boxes checked.** In progress = some. Not started = none.
- **Playwright (visual + QA automation): decided in each phase's discuss.** A lean is noted per phase; not committed until discuss.
- Active-phase pointer lives in `STATE.md`.

## Phase order (development flow)

1. **Design-system foundations** — type floor, one button style, CTA copy. Unblocked. Everything downstream uses these.
2. **Navigation & floating action bar** — header scroll-away + de-burger, floating pill CTA + burger nav. Uses Phase 1 buttons.
3. **Cutout reveal system** — reusable SVG-mask shape-windows-over-surface primitive; refactor hero onto it. Unblocked Claude build; later visual phases consume it.
4. **Copy pass (Kris voice)** — all copy revisions + the "how I work" section. Kris-blocked; start early to unblock 5 & 8.
5. **Services redesign** — columns, read-more, images (can use the cutout primitive), packaging sprint. Needs Phase 4 services copy.
6. **Credentials section** — client / agency / industry layers. Kris asset-blocked; independent of 5.
7. **Contact mechanic** — form vs email decision. Resolve before final visual polish.
8. **Visual variety** — break the rectangle pattern, section imagery (uses the cutout primitive). Jamie-dependent. Last, so it restyles finalized sections.

Why this order: Phases 1, 2, 3 and the Phase 7 decision are unblocked — start there. The cutout primitive (3) is built before the redesigns (5, 8) that consume it. Phases 4 (Kris copy) and 8 (Jamie) carry human blockers, so kick those conversations off early in parallel. Phases 5 and 6 wait on their inputs (copy, assets). Phase 8 goes last because breaking the rectangle pattern restyles every section — doing it before the others would mean redoing visual work.

---

## Phase 1: Design-system foundations

Settle the global primitives first — type scale and button system — because every later phase renders on top of them.

**Tasks**
- **Minimum font sizes (accessibility).** Prose floors at 16px; sub-labels (eyebrows, chips, captions) at 14px minimum. Concrete: `--text-label` 0.8rem (12.8px) → 0.875rem (14px) at `css/tokens.css:50`; audit `css/` for any other sub-16px prose. Body token already floors at 16px.
- **Button-style standardisation.** Collapse the current 4–5 button variants (`btn--on-pink`, `btn--accent-indigo`, `btn--accent-pink`, `btn--on-teal`, `btn--contact`) to one coherent system. *(Tracker: "standardise CTAs, pick one style.")*
- **CTA copy unification.** Every CTA label → "Free 30-min call" (hyphen), including the Work-section "Get in touch" (`index.html:221`). Relax the CLAUDE.md em-dash ban to allow hyphens in number-word content — this edit lands in this phase.

**Locked (2026-05-31)**
- Prose ≥16px, sub-labels ≥14px.
- One CTA string sitewide: "Free 30-min call".
- Brand gradient stays in exactly one place — the floating CTA pill (Phase 2). Button standardisation must not paint gradient anywhere else.

**For discuss**
- Which single button style wins, and how it adapts per surface (Hot Pink hero / Linen / Deep Teal) while reading as one style.
- Hero pre-button label "Schedule a free 30-minute diagnosis." — keep or drop now the button says "Free 30-min call"?

**Playwright lean:** light/none — token + component change. Visual glance at chips, labels, every button surface.

- [ ] Discuss
- [ ] Plan
- [ ] Execute
- [ ] Review (commit & push, tick phase, prompt Phase 2)

---

## Phase 2: Navigation & floating action bar

Rework navigation. The header stops being persistent; the floating bar takes over. Header changes land before the floating bar.

**Tasks**
- **Header refactor.** Remove sticky/fixed behaviour + the scroll-driven background/colour animation (header scrolls away). Remove the responsive burger + full-screen overlay (markup + JS). Remove "Contact" from the menu. Set header left/right padding to the page section gutter so logo aligns left, menu aligns right. Reorder menu items to match page order. *(Tracker: "align nav labels with section names.")*
- **Floating action bar.** Left: gradient CTA pill — "Free 30-min call", natural width + padding, rounded ends, one page-gutter from the left and bottom, sized like in-page buttons. Right: circular white-bg/pink burger, two lines → rotate into an X on tap. Mobile: tap reveals Work + Approach pills (white/pink) sliding up, stacked above the burger; X slides them down. Desktop: no burger, pills always visible — ( Free 30-min call ) ( Work ) ( Approach ). Appears after the hero (reuse the existing scroll-entrance gate, `js/main.js:62`).

**Locked (2026-05-31)**
- Two floating elements approved. **Supersedes** Jamie 2026-05-04 ("remove floating CTA", "no two floating elements"). Logged in STATE.md.
- CTA pill keeps the gradient; burger + nav pills are white-bg/pink-text.
- No double-menu: header scrolls off, floating bar only shows past the hero — never both at once.
- **Superseded tracker items, folded here:** "burger at 500–600px", "remove floating CTA / rainbow-in-menu", "remove second floating element", "change Contact label" — all resolved by this nav model.

**For discuss**
- Exact desktop left/right placement of the pill row relative to the page edge.
- Reduced-motion fallback (slide + line-rotate → opacity/instant).
- Focus management + keyboard (aria-expanded, pill tab order, Escape, focus return) — Claude's responsibility.

**Playwright lean:** yes. Header — responsive snapshots 375/768/1440, assert scroll-away + padding alignment + menu order. Floating bar — heavy: open/close, line→X (and absent under reduced-motion), mobile slide-up stack, desktop row + order, focus trap/return, keyboard.

- [ ] Discuss
- [ ] Plan
- [ ] Execute
- [ ] Review (commit & push, tick phase, prompt Phase 3)

---

## Phase 3: Cutout reveal system (visual primitive)

Build the cutout-reveal technique from `image-cutout-demo.html` once, as a reusable component, so the redesign phases (5, 8) and a hero refactor all consume the same primitive. Realizes the project's locked "cutout/drenched aesthetic — colour on surface, B&W in apertures."

**Technique:** an SVG `<mask>` — a black field hides a photo, white shapes (rounded triangles, pills, rounded-rects) are "windows" revealing it; everywhere else the section surface shows through. Responsive-stacks (demo reverses to a column at 500px).

**Tasks**
- Extract the demo into a reusable `.cutout` component: the SVG-mask pattern + a small set of authored shape presets (down-triangle, up-triangle, pill, rounded-rect) + tokens for window layout.
- Refactor the existing hero cutouts (current rounded-rect + circle from the v1 Phase 02 build) onto the mask technique — one image, multiple shape windows.
- Responsive behaviour: shapes reflow/stack on mobile.
- Image handling within budget: WebP + srcset, lazy-load below the fold, one image per band; stay under the CLAUDE.md <500KB (excl. images) + image-perf budget.
- Accessibility: decorative windows get empty alt / `aria-hidden`; meaningful imagery gets real alt.

**Conflict to resolve (discuss) — hard CLAUDE.md rule**
The demo paints the brand **gradient** as the surface behind the windows. CLAUDE.md locks gradient to exactly one place (the floating CTA pill). Two options: **(a)** windows sit over *solid* section colours (Hot Pink / Linen / Deep Teal — keeps the rule, matches the current solid hero), or **(b)** relax the gradient rule to allow gradient cutout surfaces. Kris decides.

**For discuss**
- Solid-vs-gradient surface (the conflict above).
- Which shape presets to support; per-section shape choices.
- Does the hero refactor ship here, or stay as-is until Phase 8?

**Blocked on:** section imagery from Kris/Jamie (shared pipeline with Services/Credentials).

**Playwright lean:** yes — responsive snapshots of the mask at breakpoints, perf check on image weight, reduced-motion if any reveal animation is added.

- [ ] Discuss
- [ ] Plan
- [ ] Execute
- [ ] Review (commit & push, tick phase, prompt Phase 4)

---

## Phase 4: Copy pass (Kris voice)

All copy revisions in one pass. Blocked on Kris writing in her own voice. Start the conversation early — it unblocks Phases 5 and 8.

**Tasks**
- Verify "12 years finding the gap" headline is actually gone; confirm the affirmative hero statement is live. *(Marked done previously — verify, don't assume.)*
- Cut copy length sitewide.
- Conversational rewrite (current copy reads AI-generated / overly clever).
- Shorten services descriptions (copy only; layout is Phase 4).
- **Approach section — add literal "how I actually work" detail** + the "what it's like to work with me" treatment (short summary, read-more to expand). *(Tracker calls the current version filler.)*
- Reassurance line near each CTA: "No sale, no follow-up unless you want one."
- Confirm the free-session 5/15/10 min timeline split.
- Lead-with-revenue framing (traffic/sales/revenue) and outreach directness in tone — mostly live; verify.

**Blocked on:** Kris drafting copy. Layout for the new "work with me" section is separate (overlaps Phase 7).

**Playwright lean:** no — copy/markup; Kris visual review.

- [ ] Discuss (open Qs resolved; copy drafted by Kris)
- [ ] Plan (map every copy change to its HTML location, propose diff)
- [ ] Execute
- [ ] Review (Kris on phone/desktop; commit & push, tick phase, prompt Phase 5)

---

## Phase 5: Services redesign

Rebuild the services section. Needs final services copy from Phase 4. Can use the Phase 3 cutout primitive for its imagery.

**Tasks**
- Column layout with expandable "read more".
- Background images — decide stock / abstract-textural / none (stock risks looking generic on a brand-strategy site).
- Packaging/unboxing sprint as a named service — needs a name, short description, and a real process if it's a live deliverable.

**For discuss**
- Is the packaging sprint a real deliverable now, or aspirational?
- Image direction.
- How much hidden copy exists — "read more" only earns its place if the content does.

**Playwright lean:** yes if expand/collapse ships — assert expand/collapse + mobile column stack.

- [ ] Discuss
- [ ] Plan
- [ ] Execute
- [ ] Review (commit & push, tick phase, prompt Phase 6)

---

## Phase 6: Credentials section

Three-layer credibility block, replacing or supplementing the current work prose. Blocked on Kris's logo assets + permissions; independent of Phase 5.

**Tasks**
- Client brand logos (primary layer) — which brands, and permission to show them publicly.
- Agency logos: TBWA, Havas, MediaCom (secondary layer) — employer credits, fine to use.
- Industry icons + subtitles (tertiary layer): retail, FMCG, healthcare, leisure, finance — confirm whether to keep or drop hospitality. Lucide SVGs (or ChatGPT-sourced).
- Compress current work prose to 2–3 lines, or remove once logos carry the credibility.

**Blocked on:** brand logo assets + permissions from Kris.

**Playwright lean:** light — visual hierarchy + responsive grid snapshot.

- [ ] Discuss (decisions + assets confirmed)
- [ ] Plan
- [ ] Execute (brand logos dropped in when Kris provides files)
- [ ] Review (commit & push, tick phase, prompt Phase 7)

---

## Phase 7: Contact mechanic (form vs email)

A decision gate before final visual polish, so Phase 7 styles the final contact markup.

**Conflict to resolve first:** CLAUDE.md + STATE.md lock V1 to a `mailto:` link, no form, for frictionless contact. Jamie's review suggests a form. Resolve the conflict before building.

**Tasks**
- Decide: form (Formspree/Netlify — adds spam risk + a third-party dependency) vs mailto (current, frictionless, zero-dep). If form wins: markup + service + validation, and update the CLAUDE.md V1 contact rule. If mailto stays: no-op, close the phase.

**Playwright lean:** yes if a form ships — submit + validation + success/error states.

- [ ] Discuss (resolve conflict + decision)
- [ ] Plan
- [ ] Execute (or no-op)
- [ ] Review (Kris tests send on phone; commit & push, tick phase, prompt Phase 8)

---

## Phase 8: Visual variety (break the rectangle)

Cross-cutting layout polish. Jamie-dependent. Last on purpose — it restyles sections every earlier phase finalizes, so doing it now avoids redoing visual work.

**Tasks**
- Break the rectangle-rectangle-rectangle rhythm — pick a direction: angled dividers / organic shapes / full-bleed images / asymmetric layout / mixed section heights. The Phase 3 cutout primitive is a tool here.
- Approach section imagery (less text, more visual) — pairs with the Phase 4 approach copy.
- General layout rhythm and shape work (Jamie).
- Image selection and placement (Jamie).

**For discuss**
- Is Jamie available and engaged? If not, defer.
- Which "break the rectangle" direction.
- Does the Approach section need a visual, or did Phase 3 copy already carry it?

**Playwright lean:** yes — responsive snapshots across breakpoints; layout regressions are easy to miss by eye.

- [ ] Discuss (Jamie looped in; direction agreed)
- [ ] Plan (layout sketch → HTML/CSS plan)
- [ ] Execute
- [ ] Review (Kris + Jamie; commit & push, tick phase, close the V1 Refresh milestone)

---

## Coverage map — every review item, placed

**Copy (Jamie review + positioning):** hero affirmative statement → P4 (verify) · "12 years" headline → P4 (verify gone) · cut length → P4 · conversational rewrite → P4 · shorten services copy → P4 (+P5 layout) · approach "how I work" detail → P4 · CTA wording → P1 · reassurance line → P4 · free-session 5/15/10 timeline → P4 · acquisition-cost framing → P4 (live) · lead with revenue → P4 · outreach directness in tone → P4

**Design & layout:** cutout reveal system + hero refactor → P3 · break rectangle pattern → P8 · services columns + read-more → P5 · services background images → P5 · approach imagery → P8 (+P4 copy) · credentials brand logos → P6 · agency logos → P6 · industry icons + subtitles → P6 · icon sourcing (Lucide/ChatGPT) → P6

**Navigation & structure:** burger at 500–600px → P2 (superseded) · align nav labels → P2 · remove floating CTA / rainbow-in-menu → P2 (superseded) · change Contact label → P1/P2 (superseded) · standardise CTA button style → P1 · remove second floating element → P2 (superseded) · email → contact form → P7

**Jamie's tasks:** layout/shape help → P8 · image selection/placement → P8

**Kris site review (2026-05-31):** min font sizes → P1 · CTA copy unify → P1 · header scroll-away + de-burger → P2 · floating action bar (pill + burger nav) → P2 · cutout reveal hero feature → P3

---

*Last updated: 2026-05-31 — regrouped into 8 development-flow phases; inserted Cutout reveal system (P3) from image-cutout-demo.html; added button-style standardisation (P1) and approach "how I work" detail (P4); labelled superseded nav items.*
