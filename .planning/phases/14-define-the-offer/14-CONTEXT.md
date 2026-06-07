# Phase 14: Define the offer - Context

**Gathered:** 2026-06-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Define the set of services Kris sells as **named, priced packages** — the spine that every downstream section (Services 15, Process 16, About 17, Intro 19) references. This is a content/strategy decision, not layout. No impeccable design step (GSD-only per `.planning/DESIGN-WORKFLOW.md`).

Jamie stands in for Kris; she iterates the specifics later. Provisional numbers and copy are flagged `[CONFIRM-KRIS]`.

**In scope:** the offer structure, pricing model, productised/bespoke split, the free-call → paid-work relationship, working rung names, and draft one-line outcomes.

**Out of scope:** the Services *section* layout/build (Phase 15), final copy voice (Phase 20), case-study/proof content (Phase 18), and Kris's final numbers and public names.
</domain>

<decisions>
## Implementation Decisions

### Offer shape (the spine)
- **D-01:** The offer is a **tiered ladder**, not three discipline packages and not a single bespoke engagement. Chosen because it mirrors the brand principle "name the problem before offering the solution", gives a low-commitment way in, and scales price by depth.
- **D-02:** The ladder has **three rungs: Diagnose → Strategy → Embed.** A paid diagnostic (fixed) → a strategy sprint/project (the core engagement) → an ongoing embedded partnership (retainer).
- **D-03:** The three disciplines — **brand strategy, experience/CX strategy, research & insight** — are the **substance applied within each rung**, not separately purchasable items. Surface them as "what this draws on", not as their own offer tiles. One offer to scan, no overlap confusion.

### Pricing model
- **D-04:** Price is expressed as **"from £X" anchors per rung** (Diagnose shows a fixed price; Strategy and Embed show "from"). Filters poor-fit enquiries, signals SME-appropriate (not unaffordable), keeps room to scope up, and matches the priced-comparison layout Phase 15 reserved.
- **D-05:** **Provisional anchor figures, all flagged `[CONFIRM-KRIS]`** so they read as Kris's to set. Downstream may render them so the section looks real:
  - Diagnose — **~£2,000 fixed**
  - Strategy — **from ~£6,000**
  - Embed — **from ~£2,500 / month**
  These are placeholders for layout/credibility, not committed prices. Every appearance must carry the `[CONFIRM-KRIS]` marker until Kris confirms.

### Productised vs bespoke split (success criterion #2)
- **D-06:** The productised→bespoke line runs along the ladder:
  - **Diagnose = productised** — fixed scope and fixed price (off-the-shelf).
  - **Strategy = semi-productised** — fixed shape/deliverables, scoped per client ("from £X").
  - **Embed = bespoke** — tailored retainer ("from £X/month").
  This must be **visible in the offer** (each rung labelled or clearly readable as fixed vs scoped vs bespoke) so the section meets criterion #2.

### Entry product & the free call
- **D-07:** The **free 30-min call is the single primary CTA site-wide** and the way in: qualification plus a genuinely useful problem-naming conversation, **no pitch** ("No sale, no follow-up unless you want one"). It routes into Diagnose, or straight to Strategy/Embed when the fit is obvious.
- **D-08:** The free call is **not a priced rung** in the comparison. **Diagnose is the first thing a client pays for.**
- **D-09:** **Every package CTA routes to the free call / contact form** — the single contact route already locked in Phase 10 / CLAUDE.md (Formspree, no direct buy/booking in V1).

### Draft one-line outcomes (per success criterion #1 — provisional, `[CONFIRM-KRIS]`)
- **D-10:** Each rung carries a one-line outcome statement. Working drafts (Kris refines in Phase 20 voice pass):
  - Diagnose — "Name the real problem, not the symptom — with a clear direction out."
  - Strategy — "Turn the diagnosis into a brand-and-experience strategy your team can act on."
  - Embed — "Keep the strategy alive — ongoing senior partnership as you grow."

### Claude's Discretion
- **Rung names** — "Diagnose / Strategy / Embed" are working internal labels. Final public-facing names are Kris's call; planner/executor may use the working names with a `[CONFIRM-KRIS]` note, or propose provisional public names (e.g. "The Diagnostic", "Strategy Sprint", "Embedded Partner") flagged the same way.
- **"What's included" per rung** — not enumerated in discussion. Planner may draft a short included-items list per rung (provisional, `[CONFIRM-KRIS]`); Phase 15 success criterion #1 expects "what's included" to be scannable.
- **Rung display order** — Diagnose → Strategy → Embed (low to high commitment) unless Phase 15 layout reasons argue otherwise.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### The offer & audience (defines WHAT to package and for WHOM)
- `PRODUCT.md` (root) — audience, five trigger situations, "Services direction" note (three areas, problem-first packages, structure still being finalised), brand voice, design principles (esp. #2 "help them name the problem before the solution"). Source of truth.
- `.planning/seeds/CONTENT-DRAFT.md` §"Section 5: Services" (lines ~152–188) — the three current draft service areas (Brand strategy, Experience/CX strategy, Research & insight) and the free-session contact copy (§"Section 6"). Directional copy Kris refines.
- `.planning/PROJECT.md` — Core Value, Key Decisions table (email/free-session CTA), requirements list.

### Phase scope & sequence
- `.planning/ROADMAP.md` §"Phase 14: Define the offer" — goal, three success criteria, "highest-leverage, highest-risk" note. Also §"Phase 15: Services section" — the offer renders as a scannable, buyable priced-comparison section (the consumer of this CONTEXT).
- `.planning/DESIGN-WORKFLOW.md` rows 14–15 — Phase 14 is GSD-only (no impeccable); Phase 15 uses the priced-comparison card-grid carve-out.

### Design authority (for downstream Phase 15 build, not this phase)
- `DESIGN.md` (root) — single design source of truth (Phase 13 contract). Governs how the offer is rendered later; the no-card-grids ban has a carve-out for the priced comparison layout (13 D-06).

### Contact mechanic (constrains every CTA)
- `CLAUDE.md` §"Contact form: live-domain-only submission" + Phase 10 context — V1 contact is a single Formspree form; no visible mailto, no direct booking/buy. Every package CTA routes here.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Current Services section markup in `index.html` (the three problem-first service areas, `.services__number` pattern) — Phase 15 reworks this into the priced ladder; the existing chip/number/CTA component classes (`.chip`, `.btn--ghost-on-light`) are reusable.
- The single contact form (`initContactForm` in `js/main.js`) + `#contact` anchor — the only route every package CTA points to.

### Established Patterns
- All CTAs already unified to "Free 30-min chat/call" (Phase 07) — the offer's free-call entry point reuses this, no new CTA vocabulary.
- Problem-first framing is the established content pattern (situation cards → services). The ladder must keep "name the problem first" (Diagnose) ahead of "here's the bigger engagement" (Strategy/Embed).

### Integration Points
- This CONTEXT is consumed primarily by **Phase 15 (Services section build)**, and referenced by Process (16), About (17), Intro (19). It produces no code itself — it produces the locked offer those phases render.

</code_context>

<specifics>
## Specific Ideas

- The ladder should read in seconds (pip-decks scannability, noted for Phase 15): three rows, each with name · type (fixed/scoped/bespoke) · "from £X" · one-line outcome · CTA.
- Keep Kris's voice: direct, no consultant waffle, problem-first. The free call's "no sale, no follow-up" reassurance line sits near its CTA (also a Phase 20 requirement).
- Anti-reference: do not turn the offer into a generic three-tier SaaS pricing table (Good/Better/Best). It's a commitment ladder (diagnose → strategy → embed), not feature gating.

</specifics>

<deferred>
## Deferred Ideas

- **Final pricing numbers and public rung names** — Kris's decision; provisional values flagged `[CONFIRM-KRIS]` throughout. Not a separate phase, a pre-launch content confirmation.
- **"What's included" detail per rung** — drafted at planning/Phase 15 as provisional; Kris refines.
- **Copy voice pass on all offer language** — Phase 20.
- **Direct booking / buy-now for the productised Diagnose** — out of scope for V1 (single contact form only); a possible V2 enhancement once a payment/booking mechanic exists.

</deferred>

---

*Phase: 14-define-the-offer*
*Context gathered: 2026-06-07*
