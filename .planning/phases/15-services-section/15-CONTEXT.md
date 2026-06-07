# Phase 15: Services section - Context

**Gathered:** 2026-06-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Render the offer (rebuilt in `.planning/OFFER.md` during this discussion) as a scannable, buyable Services section. The offer is a **catalogue across two audiences**, not a single three-rung ladder. This phase builds the rendering; the *content* (copy, prices, products) is the OFFER.md contract.

**In scope:** the four-block catalogue, the businesses/agencies split, expanders, per-card CTA routing, and the contact-form carry-through that this introduces. Replaces the current discipline-first `#services` section (Brand strategy / CX / Research) entirely.

**Out of scope (deferred / other phases):** final voice polish (Phase 20, Kris); the Process section (Phase 16); the About section (Phase 17). Exact pixels/colour/motion are decided in the impeccable design step within this phase, not pre-decided here.

> **Note on OFFER.md:** this discussion reopened and rebuilt OFFER.md. The Phase 14 version (single ascending ladder) was built on a wrong premise via a constrained question format. The corrected OFFER.md is the content contract for this phase. Read it first.
</domain>

<decisions>
## Implementation Decisions

### Structure & audience split
- **D-01:** Services is a **structured catalogue**, not a flat grid. Top-level split into **For businesses** and **For agencies**. The agencies lane may be a tab (design-step decision); it sits footnote-weight but is not an afterthought.
- **D-02:** Four content blocks: (1) **Strategy Suite** — connected sequence Diagnosis → Strategy → Embedding, one section-level CTA; (2) **Strat-bombs** — product grid of one-off hits, per-card CTA; (3) **Retainer** — single offer, three usage levels + timeline visual; (4) **Agency work** — single offer, price hidden.

### Why it must not read as Good/Better/Best tiers
- **D-03:** The anti-tier device is a **blend of copy + design + lead-with-the-entry**, primarily **different-by-design**: each service has its own copy, colour, and imagery so the "same template, three prices" tier grammar breaks on its own. Not a numbered must-do-all-three sequence. The Suite is the one block shown *as* a sequence; the rest are parallel selections.
- **D-04:** Retainer levels are framed as **roles** (how you use Kris) — Advisor / Consultant / Team member — not amounts, to kill the tier read. Labels are provisional (Jamie wants more personality; Kris may differ).

### Card rendering
- **D-05:** **Card face short, expander deep.** The visible card is minimal and scannable (name, one-line outcome, price, scoped CTA hook + generic button). Depth (description, how-it-works, deliverable) lives in a keyboard-accessible expander. (This corrects the first drafts, which front-loaded the face.) Satisfies success criteria 1 (scannable in seconds) and 2 (expand earns its place, real hidden content).
- **D-06:** **Theming = accent-on-neutral.** Cards on a calm Linen/neutral ground, each carrying its colour as an accent (strip/label/border/image treatment), not full-drench. Keeps the page's spine-and-punctuation colour discipline (DESIGN.md §2) intact while reading as distinct products. Exact treatment is the impeccable `shape` step's call.
- **D-07:** **CTA = generic button label, scoped hook line.** Each card shows a personal hook ("Chat to me about market-fit analysis") above a consistent generic button (working label "Book a call", final wording TBD — Jamie wants to judge busyness in mockups). All CTAs route to the free call at `#contact`.

### Price display
- **D-08:** The card system handles five price formats: **fixed** ("£3,500"), **from** ("from ~£6,000"), **per month** ("£2,000/mo"), **per project** ("Priced per project"), and **hidden** (agency). VAT shown once as "All costs exclude VAT" at the **section end**, not per card.

### Contact-form carry-through (cross-section)
- **D-09:** Each service CTA carries its product context to the contact form. On arrival from a service, the form shows a contextual state: "I'm interested in: [service]" as a small visual echo of the card (mini-card), plus an **optional** "anything you'd like to add?" free-text field (the service is the message). The selected service is included in the Formspree submission (hidden field). **Default** (non-service CTA): blank "I'm interested in" with a placeholder.
- **D-10:** This **modifies** the existing contact section (`initContactForm`, `js/main.js`), it does not just link to it. The planner must treat `#contact` as in-scope to extend.

### Build approach
- **D-11:** Build a **data-driven, repeatable block/card system**, not hand-built bespoke blocks. These are starter services that will grow and reorder over time. Four block types (see OFFER.md "Build steer"); none should assume a fixed count or order. Some future services may chain into a sequence, some stand alone.

### Claude's / impeccable's Discretion
- Exact layout, colour assignment per card, divider/arrow treatment, expander interaction, the Retainer timeline visual, and the agencies tab-vs-section choice are **design-step decisions** (impeccable `shape` → build → `critique`/`polish` against DESIGN.md). This CONTEXT locks intent and constraints, not pixels.

### Process note
- **D-12:** The selector (UI question→response) format is **banned** for this project — pose questions and options in chat, let the user free-type. Recorded in `CLAUDE.md` ("Interaction format"); overrides GSD/impeccable/superpowers defaults. This rule emerged because the constrained format had skewed the original OFFER.md.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### The offer content (read first)
- `.planning/OFFER.md` — the rebuilt content contract: four blocks, two audiences, all card copy (provisional, `[PROVISIONAL]`), price formats, contact-form carry-through, and the build steer with the four block types. This file is the *what*; CONTEXT.md is the *how*.

### Design authority
- `DESIGN.md` — single design source of truth. Especially §2 (Neutral Spine, Accent Punctuation / Spine-and-Punctuation Rule), Cards/Containers (`DESIGN.md` "Cards / Containers", grids allowed for a priced comparison, avoid the four-icon grid by taste), Inputs/Fields (contact form), and the Cutout component (imagery).
- `CLAUDE.md` — project constraints: em-dash ban in copy (hyphens in number-word compounds allowed), Epilogue 400/700, contact-form live-domain-only submission behaviour, the new "Interaction format" rule.

### Roadmap
- `.planning/ROADMAP.md` §"Phase 15: Services section" — goal + the three success criteria.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Situation cards** (`.situation__*` in `css/components.css:282+`, `css/layout.css:98+`): closest existing analog for a card grid on Linen (numbered, staggered blocks). Reuse the spacing/type patterns; the Services grid is a richer variant.
- **Contact form** (`initContactForm`, `js/main.js:244`): the form to extend for D-09/D-10. Note the host-gated submit (`__LT_FORCE_SUBMIT`, live-domain-only) and `_gotcha` honeypot. Add a contextual "I'm interested in" state + hidden field.
- **Cutout primitive** (`buildCutout.js`, `CUTOUT_CONFIGS`): build-time SVG codegen for B&W imagery in shape apertures. Candidate for per-card imagery if the design uses photos. Kris selects images; Claude does not pull stock.
- **OKLCH accent tokens** (`css/tokens.css`): the six committed accents for the accent-on-neutral theming (D-06).
- **Build data injection** (`build.js`, the cutout marker pattern): precedent for a data-driven, build-time block system (D-11).

### Established Patterns
- **Spine-and-punctuation colour** (`DESIGN.md` §2): constrains D-06 — accents are punctuation, not wallpaper. A row of full-drench cards would violate it.
- **Shipped artifact stays static** (HTML/CSS/vanilla JS, no client framework runtime): the data-driven block system is a *build-time* concern, output is plain static markup.
- **Bar hidden/visible authority** (`setBarHidden`, `js/main.js`): the accessibility pattern (inert + aria-hidden) to mirror for any keyboard-reachable expander/state.

### Integration Points
- Replaces the current `#services` section in `index.html:194-234` (discipline-first; now obsolete).
- Extends `#contact` (`index.html:236+`, `initContactForm`) for the carry-through.
- The floating bar's "Book a call" CTA and the new per-card CTAs share the same `#contact` destination.
</code_context>

<specifics>
## Specific Ideas

- **Card mockup (Jamie):** name · short outcome · price · divider · scoped hook line ("Chat to me about X") · generic button. Dividers not baked.
- **Contact mini-card (Jamie):** "Tell me about your situation" → "I'm interested in: [Market-fit Analysis]" mini-card + optional "anything you'd like to add?" textarea.
- **Retainer timeline visual (Jamie):** a 6-month strip — months 1: a couple of one-shots · 2-3: discovery + strategy · 4-6: embedding + consult. Communicates flexibility + that it's prioritised (what you want + what Kris thinks you need).
- **Agencies register:** peer-to-peer, knowing, credibility-led (Havas Lynx, TBWA, MediaCom), no price.
- All card copy drafted in this discussion lives in OFFER.md as `[PROVISIONAL]`; Kris does the final voice pass (Phase 20).
</specifics>

<deferred>
## Deferred Ideas

- **Naming polish:** the Retainer block title and tier labels (Advisor/Consultant/Team member) need a personality/tongue-in-cheek pass — Jamie to refine, Kris may differ. Captured in OFFER.md, finalised in Phase 20.
- **Strat-bomb menu growth:** more strat-bombs beyond the launch three — handled by the data-driven block system, added over time, not in this phase.
- **CX → Retainer cross-sell:** CX alignment's optional "ongoing consultancy to embed" is a connective thread to the Retainer; light hint only, not a hard upsell mechanic in V1.

*Discussion stayed within phase scope; the OFFER.md rebuild was a necessary correction to the upstream content contract, not scope creep.*
</deferred>

---

*Phase: 15-services-section*
*Context gathered: 2026-06-07*
