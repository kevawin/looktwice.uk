# Phase 8: Navigation & floating action bar (V1 Refresh P2) - Context

**Gathered:** 2026-06-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Rework navigation in two parts:

1. **Header refactor** — stop the header being persistent. Remove `position:fixed` + the scroll-driven transparent→Linen colour fade (header scrolls away with the page). Remove the responsive 3-line hamburger + full-screen overlay entirely (markup + JS + CSS). Drop "Contact" from the menu. Align header left/right padding to the page section gutter (logo flush left, links right). Reorder the remaining menu items to page order.
2. **Floating action bar** — a persistent bar that appears only past the hero (reuse the existing scroll-entrance gate). Left: gradient CTA pill "Free 30-min chat" (the one place the brand gradient appears). Right: circular white-bg/pink-text burger, two lines rotating into an X. Mobile: tap reveals Work + Approach nav pills sliding up, stacked above the burger; X slides them down. Desktop: no burger — the CTA pill plus always-visible Approach + Work nav pills.

This bar also re-answers the two dangling segues refresh P1 left when it removed the mid-page CTAs (work `index.html:235`, services `index.html:264`).

Touches `index.html` (nav/header markup, sticky-tab markup), `css/components.css` (nav + sticky-tab blocks), `css/layout.css` (nav layout), `css/animations.css` (nav transitions), `js/main.js` (nav scroll-state, hamburger/overlay handlers, sticky-tab init). No new content sections, no copy rewrites (Kris owns segue copy in refresh P4).

</domain>

<decisions>
## Implementation Decisions

### Nav order (resolves the page-order vs locked-pill-order conflict)
- **D-01:** **Both the header menu and the floating nav pills follow page DOM order: Approach, then Work.** The page DOM is `#approach` (the "Dig. Reveal. Sharpen." interrupt, `index.html:188`) before `#work` (`index.html:200`). This SUPERSEDES the roadmap's locked floating-pill order "( CTA )( Work )( Approach )" — one consistent order everywhere is less surprising to a scrolling visitor than two menus that disagree. The page sections are NOT reordered.
- **D-02:** "Contact" is removed from both the header menu and the floating bar. The gradient CTA pill is the only contact entry point in the nav system.

### Header refactor
- **D-03:** Header becomes a normal in-flow (non-fixed) element that scrolls away with the page. Remove `position:fixed` + `.nav.scrolled` colour-fade logic (`components.css:8-21`), the `.nav` colour transition (`animations.css:5-7`), and the `toggleScrolled` scroll listener (`js/main.js:14-19`). Header sits on the Hot Pink hero and scrolls off with it.
- **D-04:** Remove the header hamburger + full-screen overlay completely — markup (`index.html:84-108`), CSS (`.nav-hamburger*`, `.nav-overlay*` in `components.css:87-160`, `layout.css`, `animations.css:10-18`), and JS (the entire mobile-overlay block, `js/main.js:25-59`). The floating bar is the only menu mechanism past the hero.
- **D-05:** Header padding aligns to the page section gutter so the logo sits flush with section content on the left and the links align right. Match the gutter the sections use (currently `calc(var(--space-lg) * 0.75)` on `.nav` — confirm against section inner padding and align to one shared value).
- **D-06:** **Mobile top header keeps logo + inline Approach/Work links** (no burger). Nav is available above the fold on mobile without a hamburger; the floating bar takes over once the header scrolls off past the hero. The `@media (max-width:1024px){ .nav-links{display:none} }` rule (`layout.css:35-37`) is removed/reworked so links stay visible on mobile — verify they don't crowd a narrow header at 375px.

### Floating action bar
- **D-07:** **Desktop layout: gradient CTA pill anchored bottom-left, one page-gutter from the left and bottom; Approach + Work nav pills anchored bottom-right** (where the mobile burger lives). Both bottom corners used. Nav pills read ( Approach )( Work ) per D-01.
- **D-08:** **Mobile layout: gradient CTA pill bottom-left; circular burger bottom-right.** Tapping the burger reveals Approach + Work pills sliding up, stacked above the burger — stack order Approach (top) → Work (bottom) to match D-01 page order. Tapping the X slides them back down.
- **D-09:** CTA pill label is **"Free 30-min chat"** — carried from refresh P1 D-01 (`07-CONTEXT.md`), which superseded the roadmap's "Free 30-min call". This replaces the existing sticky-tab label "Let's talk →" (`index.html:314`). Pill is natural-width + padding, rounded ends, sized like the in-page buttons.
- **D-10:** Burger is **two lines → rotate into an X** (per lock), white background / pink (Hot Pink) text+lines. Note: the existing header hamburger is THREE lines — the floating burger is a NEW two-line element, not a move of the old one.
- **D-11:** Nav pills are **white-background / pink-text** (NOT gradient). Gradient stays exclusively on the CTA pill (CLAUDE.md gradient discipline). The bar therefore has exactly one gradient surface.

### Bar behaviour
- **D-12:** **Reuse the existing scroll-entrance gate** — the bar appears once `scrollY > hero.offsetHeight` (current `initStickyTab` logic, `js/main.js:68-100`, threshold recomputed on resize). Never visible over the hero, so header and bar never both show at once (no double-menu).
- **D-13:** **Keep the contact-suppress rule** (D-6.11) — hide the bar while `#contact` is in view via the existing IntersectionObserver (`js/main.js:88-99`); it's redundant noise while the visitor is at the contact CTA. Apply to the whole bar (CTA + nav pills + burger).
- **D-14:** **Reduced-motion fallback:** under `prefers-reduced-motion: reduce`, the bar fades in (no slide), the mobile pills appear instantly (no slide-up), and the burger snaps to the X (no rotate). Mirrors the existing sticky-tab reduced-motion guard (`components.css:963+`).

### Accessibility / keyboard (Claude's responsibility — not asked, locked here)
- **D-15:** Burger is a `<button>` with `aria-expanded` reflecting open/closed and an `aria-label` ("Open menu" / "Close menu"). On mobile, opening moves focus into the revealed pills; Escape closes and returns focus to the burger; tab order is logical (CTA → burger/pills); closing on pill click returns focus appropriately. Desktop pills are always-visible links — no expand/collapse there.
- **D-16:** Pills and CTA are reachable by keyboard in visual order with visible focus rings. CTA pill (gradient surface) and nav pills (white surface) each need a focus-ring colour that passes AA on their own background — reuse the per-surface focus-ring override pattern (white ring on the gradient CTA, Hot Pink/Midnight ring on white pills).

### Segue carryover (confirmed)
- **D-17:** The persistent floating CTA covers the two dangling segues refresh P1 left — work paragraph segue (`index.html:235` "Want to see an example of my work and how I think?") and services offer segue (`index.html:264` "If something here is your problem, the first 30 minutes are on me."). Both now resolve to the always-present CTA pill instead of an in-section button. Kris may reword the segue copy in refresh P4 — copy is NOT changed in this phase.

### Testing
- **D-18:** **Heavy Playwright** suite for this phase: responsive snapshots at 375 / 768 / 1440; assert header scroll-away + gutter-padding alignment + menu order; floating bar open/close; line→X present (and ABSENT under reduced-motion); mobile slide-up pill stack; desktop CTA-left / nav-right row; focus trap + return; keyboard reachability.

### Claude's Discretion
- Whether to extend the existing `.sticky-tab` component into the floating bar or build a fresh `.floating-bar` / `.action-bar` component. The sticky-tab already has the gradient pill, scroll-gate, contact-suppress, and reduced-motion machinery — reuse vs rebuild is the planner's call.
- Exact gutter value to standardise header + bar offsets on (resolve against section inner padding).
- Pill sizing tokens, gap between pills, burger diameter — match the in-page button scale and the 44px min touch target.
- CSS/JS cleanup mechanics for the removed hamburger/overlay/scroll-fade (orphaned selectors, transitions, `?v=` cache-bust bump on touched CSS/JS files).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Refresh roadmap (source of truth for this phase)
- `.planning/ROADMAP-REFRESH.md` §"Phase 2: Navigation & floating action bar" — full task list + locked decisions (NOTE: the "Free 30-min call" label there is superseded by D-09 → "Free 30-min chat"; the "( Work )( Approach )" pill order is superseded by D-01 → Approach, Work)
- `.planning/ROADMAP.md` §"Phase 8" — GSD-registered detail block for this phase

### Upstream phase context (carryover)
- `.planning/phases/07-design-system-foundations/07-CONTEXT.md` — D-01 (CTA string "Free 30-min chat"), D-04 (mid-page CTAs removed → segues now dangling, this bar answers them), code_context integration note flagging this phase as the consumer

### Project constraints
- `CLAUDE.md` §Constraints + §Design bans — Epilogue 400/700 (no 500), WCAG AA, gradient in exactly one place (the CTA pill), no card shadows, prefers-reduced-motion respected, one H1
- `CLAUDE.md` §"Phone preview handoff (Cloudflare)" — preview protocol for Kris's visual review (375px); keep branch name short (≤24 sanitised chars) for a predictable preview URL

### Files this phase edits
- `index.html` — nav/header markup (`:80-98`), overlay markup (`:100-108`, remove), sticky-tab markup (`:313-315`)
- `css/components.css` — `.nav` block (`:8-160`, refactor + remove hamburger/overlay), `.sticky-tab` block (`:895-975`, becomes the floating bar)
- `css/layout.css` — `.nav` layout (`:13-37`)
- `css/animations.css` — `.nav` + `.nav-overlay` transitions (`:5-18`)
- `js/main.js` — scroll-state toggle (`:14-19`, remove), hamburger/overlay block (`:25-59`, remove), `initStickyTab` scroll-gate + contact-suppress (`:68-100`, reuse/extend)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.sticky-tab` (`components.css:901`): already a fixed gradient pill using `--gradient-brand`, with `--visible` (slide-in past hero) + `--suppressed` (hide while contact in view) states, mobile bottom-strip variant, and a reduced-motion guard. This is the seed of the floating bar's CTA pill — extend or lift its machinery.
- `initStickyTab` (`js/main.js:68-100`): scroll-past-hero threshold (recomputed on resize) + `#contact` IntersectionObserver suppression. Reuse verbatim for D-12 + D-13; extend to toggle the whole bar.
- `--gradient-brand` token (`tokens.css:29`): the single brand gradient — paint only on the CTA pill (D-11).
- `.btn` / `.btn--on-pink` / `.btn--on-teal` (`components.css`): the surviving button system (post-P7) — pill radius, weight 700, uppercase, fill-then-invert-on-hover idiom + per-surface focus-ring override. Match pill sizing + focus-ring approach to these (D-16).

### Established Patterns
- Per-surface focus-ring override (white ring on colour surfaces, Hot Pink/Midnight on light) — established in nav + buttons; apply to gradient CTA vs white pills (D-16).
- Reduced-motion guards live in `animations.css` / component reduced-motion media blocks; observer still fires, only transforms are stripped (project standard since Phase 2). Mirror for the bar (D-14).
- `?v=N` cache-bust query on CSS/JS `<link>`/`<script>` (currently `v=5`) — bump when touching these files.

### Integration Points
- Header (`<nav class="nav">`) and floating bar must never both show: header scrolls off the hero, bar appears only past it (D-12). The scroll-gate threshold = hero height ties them together.
- Removing the header hamburger/overlay deletes JS that currently owns Escape + focus-return; that responsibility moves to the floating-bar burger (D-15).
- Page section anchors `#approach` (:188) and `#work` (:200) are the pill targets; order Approach→Work (D-01) matches their DOM order.

</code_context>

<specifics>
## Specific Ideas

- One consistent nav order everywhere (Approach, Work) chosen over honouring the literal locked pill order — visitor-facing consistency beats matching two conflicting written instructions.
- CTA bottom-left / nav bottom-right uses both corners and keeps nav where the mobile burger sits, so the desktop and mobile mental models align.
- Mobile keeps inline header links (not logo-only) so nav exists above the fold without a hamburger.
- Burger is explicitly a NEW two-line element (white/pink), distinct from the deleted three-line header hamburger.

</specifics>

<deferred>
## Deferred Ideas

- **Segue copy rewording** — D-17 confirms the floating CTA answers the dangling segues structurally; the exact segue wording (`index.html:235`, `:264`) is Kris's call in refresh Phase 4 (copy pass), not this phase.
- **Section reordering (Work before Approach)** — considered (option "reorder the page") and rejected for this phase; D-01 keeps DOM order and aligns both menus to it instead. If a later phase restructures content, revisit.

</deferred>

---

*Phase: 08-nav-floating-bar*
*Context gathered: 2026-06-01*
