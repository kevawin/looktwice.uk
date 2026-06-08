---
name: Look Twice
description: Independent brand & CX strategy — closing the gap between brand promise and lived experience
colors:
  hot-pink: "#E0006E"
  signal-orange: "#E9631A"
  warm-amber: "#F59300"
  deep-teal: "#2E7C80"
  rich-purple: "#6C2C8C"
  cool-indigo: "#5556CC"
  midnight: "#26263E"
  linen: "#F9F6F1"
  true-white: "#FFFFFF"
  true-black: "#000000"
  midnight-12: "#26263E1F"
  midnight-15: "#26263E26"
  link-sage: "#65907C"
  link-pine: "#3A6054"
typography:
  # Type scale revised Phase 13 (Jamie approved via live demo): body lifted, new
  # `lead` step, title lifted to open the mid-range gap, `mega` dropped. css/tokens.css
  # is synced to this scale as a follow-up implementation step (it changes body size
  # sitewide, so it lands with a visual check, not silently here).
  display:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.5vw + 1.1rem, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.25
  lead:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.2vw + 1rem, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1vw + 0.9rem, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  md: "10px"
  cutout: "16px"
  lg: "20px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "64px"
  xl: "96px"
  section: "120px"
components:
  button-on-pink:
    backgroundColor: "{colors.true-white}"
    textColor: "{colors.hot-pink}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-on-pink-hover:
    backgroundColor: "transparent"
    textColor: "{colors.true-white}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-on-teal:
    backgroundColor: "{colors.true-white}"
    textColor: "{colors.deep-teal}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-on-teal-hover:
    backgroundColor: "transparent"
    textColor: "{colors.true-white}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  input:
    backgroundColor: "{colors.true-white}"
    textColor: "{colors.midnight}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
---

# Design System: Look Twice

<!--
  This is the negotiated V1-Restructure design contract (Phase 13). It SUPERSEDES
  the prior inherited DESIGN.md and replaces DESIGN.json (retired). Authored via
  the impeccable skill; rulings made by Jamie (technical owner, CRO/UX).

  Two working files, neither is law: this contract owns intent / vocabulary /
  rules; css/tokens.css owns the exact values. They evolve together — a refresh
  may change tokens; a better value may update this file. The frontmatter above
  mirrors css/tokens.css; when they drift, reconcile rather than treat either as
  frozen. See .planning/phases/13-design-contract/13-CONTEXT.md for the full
  decision record and .planning/DESIGN-WORKFLOW.md for the GSD↔impeccable handoff.
-->

## 1. Overview

**Creative North Star: "The Second Look"**

The surface is never the whole story. Bold colour holds the foreground; geometric
apertures cut into it reveal what sits underneath. The brand name is the design
brief: look again, and something that was not obvious the first time is there. This
runs from the largest gesture (a black-and-white photograph emerging through a window
in a solid Hot Pink field) down to the smallest interaction (a shape that shifts just
enough that you check whether it moved). Restraint and revelation in the same frame.

The page runs on a **neutral spine with accent punctuation**. Linen (and Midnight) is the
default working ground that lets content breathe; full colour-drenched surfaces are reserved
for the emotional and conversion beats — the hero, the positioning interrupt, the contact
close. Colour is a signal, not wallpaper, so the drenched moments hit harder across a long
scroll (recognise → process → offer → who → proof → contact). The **cutout** — photography
revealed through a shape-vocabulary aperture — is the signature device, used at key moments
(openers), not on every section; elsewhere the "second look" lives in motion and layout. One
typeface, one weight logic, and one shape vocabulary hold it together; the discipline is what
stops it reading as a generic solo-consultant site.

What this system rejects (from PRODUCT.md anti-references): generic solo brand-strategist
patterns, luxury serif / high-polish agency aesthetics, "we help brands grow" filler,
stock photography used without consistency, and decorative motion that buries substance.
If a layout could have been generated by any solo consultant's AI tool, it has failed.

**Key Characteristics:**
- Neutral spine (Linen/Midnight) with colour-drenched surfaces as deliberate punctuation
- Cutouts as a key-moment signature, not a per-section reflex
- Single typeface (Epilogue), hierarchy through weight + scale contrast, no medium weight
- A named shape vocabulary reused with discipline across everything shaped
- Photography black-and-white by default on colour surfaces; colour available on neutral ground
- "The Second Look" expressed in motion: subtle interactions that reward a double-take
- Flat by default, but elevation, grids, faded-brand neutrals, and gradient are tools used with judgement

### What changed from the inherited system (Phase 13 rulings)

Identity-preservation was OFF for this audit. Each inherited rule was ruled keep /
override / kill. The contract below reflects the rulings; this ledger is the record.

| Inherited rule | Ruling | What it means now |
|---|---|---|
| Card-shadow ban (flat only) | **Kill** | Shadows are an available tool, used with judgement. Flat stays the resting default; reach for depth deliberately, never to rescue a weak card. |
| No decorative card grids | **Kill** | Card grids are available (the priced-package comparison in Services, and general use). The generic four-icon-card grid is still a failure to avoid — by taste, not by ban. |
| No mid-tone greys | **Kill, with a steer** | Functional neutrals are available (helper text, placeholders, disabled), but **prefer a faded/low-opacity brand colour over a true grey** — low-opacity Midnight or a faded accent keeps everything in the brand. Midnight and Linen remain the primary surfaces. |
| Gradient only on the floating tab | **Kill** | The brand gradient is freely available, and allowed sparingly as a section background. Its old scarcity was a signature; spend it deliberately so it still reads as a moment, not wallpaper. |
| Epilogue-only, weights 400/700 | **Keep family; weight door open** | Epilogue stays the only family (a second family means two fonts across ALL Look Twice material, not just the site). A third weight (likely 500) is not ruled out — added only when a real hierarchy need appears. |
| B&W cutout photography | **Kill → neutral** | No hard rule. B&W is the natural default on colour surfaces (colour-on-colour is overkill); colour imagery is allowed on white / neutral ground, decided per use. |

**Beyond the six inherited rules, this audit also reopened and re-ruled the prior design author's framing (identity-preservation OFF throughout):**
- **North star "The Second Look": kept** — it is the brand name and the motion idea; it stays the organising metaphor.
- **Two-mode system: replaced** by the neutral-spine + accent-punctuation model above (better for a 6-section page than a binary).
- **Cool accents (Rich Purple, Cool Indigo): now allowed as drenched section backgrounds** (a gravitas punctuation beat), not just hover/gradient.
- **Type scale: revised** (body up, new `lead` step, title up, `mega` dropped) — see Typography.
- **Palette and the type/spacing scales: kept** (palette is Kris's brand law; the scales are sound). All remain mutable, none are frozen.

### The shape vocabulary (strict)

One vocabulary, reused with discipline, applied to everything shaped — cutout apertures,
container and card corners, buttons, dividers. This is the cure for shape inconsistency,
and it is the one place the contract is deliberately strict even though the bans above
were loosened: the bans were guardrails; the vocabulary is the positive system.

The vocabulary is built on the five cutout presets already shipped in `buildCutout.js`:

- **Circle** — focal aperture. A single subject, a portrait, an eye drawn to one point.
- **Squircle** (rounded-rect with a generous radius) — the primary image / content window.
- **Up-triangle / Down-triangle** — directional accent. Energy and motion; points the eye.
- **Pill** — interactive and label surfaces: buttons, chips, the floating CTA.
- **Rounded-rect** (tight radius) — containers, cards, inputs.

**The One Vocabulary Rule.** Every shaped element draws from this set. Introducing a new
shape is not a per-section decision — it requires updating this contract first. A section
that wants a shape the vocabulary does not have is a signal to revisit the vocabulary, not
to improvise.

**Radius scale.** The shipped scale is `sm 4px` / `md 10px` / `cutout 16px` / `lg 20px` /
`pill 999px`, and the vocabulary names these for now. Whether to consolidate the close
middle steps into a tighter scale is **deferred to Phase 21**, when the shapes get applied
sitewide and the values can be seen in context rather than judged in the abstract. No radius
change lands before then.

### Motion: "The Second Look" in interaction

Motion is part of the build, not decoration applied afterward. The north star: **subtle
interactions that make the user literally look twice** — *did that image just move?* Few,
intentional, brand-reinforcing. The reference sites that overdo scroll feedback are the
anti-pattern; restraint is the voice.

Candidate interactions to draw from (explored and chosen per phase, mostly Phase 21 —
none is baked in here): a subtle parallax on the black-and-white image behind a cutout
window; colour surfacing on a neutral-ground image; small reveals that reward attention.
The earlier "B&W → colour → B&W on scroll" idea is dropped — colour image on a colour
section is overkill.

**The Already-Visible Rule.** Reveals enhance content that is already on the page. Never
gate visibility on a class-triggered transition; transitions pause on hidden tabs and in
headless renders, so a gated section ships blank.

**Reduced motion.** Under `prefers-reduced-motion: reduce`, everything is static and all
content is fully visible: no parallax, no reveals, no movement; cutout images rest in their
default state (B&W on colour). This is fixed in the contract; the specific motions are not.

## 2. Colors: Neutral Spine, Accent Punctuation

Six committed accents over a Linen/Midnight spine. No colour is ambient — each use is earned.
Exact values live in `css/tokens.css`; the names and roles below are the contract.

### Primary
- **Hot Pink** (`#E0006E`): The lead accent. Hero surface, the strongest emphasis, the
  cutout field. When one colour carries a surface, it is this one.
- **Signal Orange** (`#E9631A`): Secondary energy. The positioning-interrupt surface,
  gradient pairings with Hot Pink, structural accents in Working mode.
- **Warm Amber** (`#F59300`): Supporting warmth. Highlight bars, the rotating-word accent
  in the hero, labels where orange reads too hot. Gradient warm endpoint.

### Secondary
- **Deep Teal** (`#2E7C80`): Calm authority. The contact surface, closing CTA moments.
  The "let's talk" colour.
- **Rich Purple** (`#6C2C8C`): Depth and weight. Hover and gradient endpoint in warm-to-dark
  transitions, and now available as a drenched section background for a gravitas beat.
- **Cool Indigo** (`#5556CC`): Structural and digital. Interactive-state accents, gradient
  pairing with Rich Purple, and available as a drenched section background.

### Neutral
- **Midnight** (`#26263E`): The dark background and primary ink on Linen. A deep
  blue-violet, not true black.
- **Linen** (`#F9F6F1`): The light background — a warm off-white. The primary working surface.
- **Midnight 12% / 15%** (`#26263E` at 0.12 / 0.15): Rule lines, dividers, the float shadow.
  AA-safe against Linen on hairline rules.
- **Functional neutrals** (prefer faded brand colour over true grey): for helper text,
  placeholders, and disabled states, reach first for a low-opacity Midnight or a faded accent
  (the `midnight-12/15` tints are the existing pattern). Verify 4.5:1 contrast before use.
- **True Black** (`#000000`): Ink only, where Midnight cannot hit AA. Never a background.
- **True White** (`#FFFFFF`): Text and fills on dark and accent surfaces; the on-colour button fill.
- **Link Sage / Link Pine** (`#65907C` / `#3A6054`): Hyperlink default / visited on Linen.

### Named Rules
**The Spine-and-Punctuation Rule.** Linen and Midnight are the default ground; a
colour-drenched surface is punctuation, reserved for an emotional or conversion beat. If most
of a long scroll is drenched, nothing is — pace the colour so the drenched moments still land.

**The Commitment Rule.** Every accent surface is a deliberate choice. Before placing a
colour, name the reason: which section, which register, which moment in the journey needs
to stop the eye here.

**The One-Accent Surface Rule.** A single accent owns a drenched surface (warm or, now, a
cool gravitas beat). Two accents on one surface make noise, not energy. Gradients are the
exception: they blend adjacent accents (Pink-Orange, Purple-Indigo) and never introduce a third.

**The Gradient-Spend Rule.** The brand gradient is available anywhere now, including sparingly
as a section background, but it is a finite-feeling currency: spend it where a moment deserves
it (a primary CTA, a recommended tier, one drenched section), not as a default fill. Today it
appears on the floating CTA pill; new uses are a deliberate choice, logged against this rule.

## 3. Typography: The Epilogue System

**Primary font:** Epilogue — the only family, sitewide and across all Look Twice material.
Static weights 400 and 700. Self-hosted woff2, `font-display: swap`.

**Character:** One sans-serif deployed through extreme weight contrast. Bold at negative
tracking reads direct and confident; Regular at generous line-height reads considered and
human. It does not try to be clever. One typeface used well beats two used lazily.

### Hierarchy

Revised Phase 13 (Jamie approved via live demo). The moves: bigger body, a new Lead step,
title lifted so subheads and copy separate cleanly, `mega` dropped so Display leads.
`css/tokens.css` is synced to this scale as a follow-up implementation step.

- **Display** (700, `clamp(2.75rem, 6vw, 5rem)` → 44–80px, lh 1, ls -0.02em): The hero
  headline and major openers. Used rarely — when type is the visual event.
- **Headline** (700, `clamp(2rem, 4vw, 3rem)` → 32–48px, lh 1.1, ls -0.01em): Section headings.
- **Title** (700, `clamp(1.5rem, 1.5vw + 1.1rem, 1.875rem)` → 24–30px, lh 1.25): Service names,
  structural labels, card headings, subheads.
- **Lead** (400, `clamp(1.25rem, 1.2vw + 1rem, 1.5rem)` → 20–24px, lh 1.5): Section intros,
  standfirst paragraphs, large body. The step between Body and Title — weight without shouting.
- **Body** (400, `clamp(1.125rem, 1vw + 0.9rem, 1.25rem)` → 18–20px, lh 1.7): All running copy.
  Line length capped 65-75ch. Never condensed.
- **Label** (700, `0.875rem` (14px floor), lh 1.4, ls 0.1em, uppercase): Eyebrows, chips,
  nav links, captions, button text. Uppercase only at this scale, never at body size.

### Named Rules
**The Weight-Contrast Rule.** Hierarchy comes from Bold (700) vs Regular (400) and from
scale, not from a mid weight. A third weight (likely 500) is allowed only when a real
hierarchy need appears — dense pricing tables are the likely first trigger — and is added
to the contract and `tokens.css` together, not improvised per section.

**The Emphasis Rule.** Emphasis in running text is Bold, not italic. Italics are reserved
for the hero's rotating word and genuine register shifts, set in Epilogue — there is no
second family and no serif accent.

## 4. Elevation

Flat by default. Depth comes first from the contrast between Midnight and Linen, the visual
weight of committed colour blocks, and the tension between B&W photography and saturated
fields — not from shadow on every surface.

Shadows are now an available tool (the flat-only ban is lifted), but availability is not
licence: a shadow earns its place on something that genuinely sits above the page, or on a
deliberately elevated moment (a recommended pricing tier, a primary CTA). Reaching for a
shadow to make an ordinary card "feel designed" is still the signal to redesign the card.

### Shadow Vocabulary
- **Ambient Float** (`0 8px 32px rgba(38, 38, 62, 0.15)` → `--shadow-float`): Floating UI —
  the persistent CTA pill / bar that must read as above the page.
- **Elevation (new, define on first use):** when a card or tier is deliberately raised, add a
  single soft, low-contrast shadow consistent with Ambient Float's character (diffuse, cool,
  no hard edge). Define the token when the first real use lands; do not scatter ad-hoc values.

### Named Rules
**The Earned-Elevation Rule.** Surfaces are flat at rest. A shadow appears only when an
element floats or is deliberately elevated, and reuses a defined token. No shadow as decoration.

## 5. Components

Components reference `css/tokens.css` for values; the descriptions are the contract.

### Buttons
One pill system, two surface contexts. No second button family.
- **Shape:** Pill (`rounded.pill`, 999px). 2px border in `currentColor`, `12px 28px` padding,
  Label typography (uppercase, 0.1em tracking, weight 700).
- **On colour** (`btn--on-pink`, `btn--on-teal`): White fill, surface-colour text. Hover and
  focus invert to transparent fill, white text, white border.
- **On Linen** (future): accent fill, white text; hover inverts to outlined accent.
- **Transition:** colour only (`background-color`, `color`, `border-color` 180ms ease-out).
  No transform lift.

### Chips / Labels
Section eyebrows and category labels in Label typography (uppercase, 14px floor, 0.1em
tracking). The old filled Midnight/Hot-Pink "chip" component was retired in Phase 6; labels
now sit inline. Use a chip surface (pill, Midnight or accent fill) only where a label needs
to read as a distinct tag, not above every section — repeated eyebrows on every section are
AI scaffolding, not voice.

### Cards / Containers
Available, not the default. Open layout on Linen is still the first reach; cards are for
when boxing genuinely helps (service tiers, a priced comparison).
- **Corner:** `rounded.md` (cards) — pending the Phase 21 radius-consolidation decision.
- **Background:** Linen or White on Linen pages; Midnight on dark sections.
- **Border:** 1px `midnight-12` on Linen; none on dark.
- **Shadow:** none by default; a defined elevation token only when deliberately raised.
- **Padding:** `spacing.md` (32px).
- **Grids:** allowed (the no-grid ban is lifted). A priced-package comparison grid is expected
  in Services. Avoid the identical four-icon-card grid by taste — vary size, weight, content.

### Inputs / Fields
As shipped on the Deep Teal contact surface: functional, not decorative.
- **Style:** White fill, 2px White border, `rounded.sm` (4px), `10px 14px` padding, Midnight text.
- **Label:** Above the field, Label typography, White on the teal surface.
- **Focus:** 2px White outline, 4px offset. **Error:** announced via `aria-live`, focus moves
  to the first invalid field.
- **Placeholder / helper / disabled:** a faded brand neutral (low-opacity Midnight or accent)
  rather than a true grey; verify 4.5:1 contrast.

### Navigation
- **Wordmark / logo** left; **nav links** right in Label typography. Header scrolls away with
  the page (Phase 8) — not sticky, no scroll colour-fade.
- **Hover / active:** Hot Pink underline (2px, 3px offset). No background highlight, no blur.
- **Focus on Hot Pink hero:** focus ring overrides to a visible colour (Hot Pink ring is
  invisible on Hot Pink).

### Cutout (Signature Component)
The defining device, used at key moments (openers), not every section. Photography revealed
through apertures from the shape vocabulary. Build-time SVG codegen (`buildCutout.js`), not a
runtime effect.
- **Apertures reveal images only.** A cutout window always shows a photograph — never a colour
  or gradient fill inside the aperture. The image is the reveal.
- **Field:** the section's own surface (a solid accent, typically Hot Pink for the hero). If a
  section uses a gradient background, a cutout may be tested there, but whether it reads well on
  a gradient field is a build-time judgement, decided after seeing it.
- **Apertures:** shapes from the vocabulary only (circle, squircle, triangle, rounded-rect).
  One shared `<image>` behind one `<mask>`; multiple shapes reveal different regions of one photo.
- **Photography:** desaturated via SVG `feColorMatrix saturate=0` (not CSS `filter`, which is
  unreliable on SVG `<image>` in Safari). B&W is the default on a colour field; colour is an
  option on neutral ground.
- **Focal point:** optional per-cutout `focus { x, y }` covers and offsets the image so the
  subject stays framed.
- **CLS guard:** the `<svg>` carries intrinsic width/height so space is reserved before CSS loads.
- **Motion:** the "second look" parallax (a candidate, Phase 21) drives the image behind the
  mask; the mask and layout stay put.

## 6. Do's and Don'ts

### Do
- **Do** commit fully to one accent as a section's dominant surface. Half-committed colour
  reads as uncertainty.
- **Do** reuse the named shape vocabulary on every shaped element. New shapes update the
  contract first.
- **Do** keep photography B&W on colour surfaces; reach for colour imagery only on white /
  neutral ground, and decide it per use.
- **Do** use Epilogue 400 and 700 only. Emphasis is Bold, not italic. Add a third weight only
  when a real hierarchy need lands, in the contract and tokens together.
- **Do** cap body line length at 65-75ch.
- **Do** keep motion subtle and intentional — the "second look", not scroll decoration. Justify
  every animation against that north star, and ship a static reduced-motion path.
- **Do** check WCAG AA contrast on every surface, including faded-brand helper text (4.5:1)
  and any new shadow, gradient, or cool-accent background placement.
- **Do** write descriptive alt text for every image, including cutout compositions.

### Don't
- **Don't** produce generic solo-strategist patterns: stock hero photo, "we help brands grow"
  headline, four identical icon-cards in a grid. If any AI tool could have made it, it has failed.
- **Don't** use luxury serif or high-polish agency aesthetics — wrong register for SME and
  scale-up buyers; it signals unaffordable, not expert.
- **Don't** add a second type family or a serif accent. Epilogue only.
- **Don't** put a tiny uppercase tracked eyebrow above every section. One named label is voice;
  an eyebrow on every section is AI grammar.
- **Don't** use gradient text (`background-clip: text`). Emphasis through weight or scale.
- **Don't** spend the brand gradient as a default fill. It is available, but it is a moment.
- **Don't** fill a cutout aperture with colour or a gradient — a cutout window always reveals a photograph.
- **Don't** drench every section. Colour is punctuation on a Linen/Midnight spine; wall-to-wall colour flattens the pacing.
- **Don't** use `#000000` as a background (Midnight is the dark surface). (Glassmorphism is no longer banned — available with judgement per Jamie's ruling 2026-06-08; first use is the frosted floating-bar treatment.)
- **Don't** add a shadow to make an ordinary card feel designed. Elevation is earned; redesign
  the card instead.
- **Don't** gate content visibility on a scroll/class transition — the section will ship blank
  in headless renders and on hidden tabs.
- **Don't** use em-dashes in copy (hyphens in number-word compounds like "30-min" are fine),
  marketing buzzwords, or aphoristic short-rebuttal cadence as the recurring voice.
