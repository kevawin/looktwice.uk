# HOMEPAGE SPEC: looktwice.uk

**Type:** Design brief / UI specification
**Status:** Confirmed
**Date:** 2026-04-29
**Feeds into:** GSD build session via /gsd-ingest-docs

---

## Page Structure

Single page. Eight sections plus persistent navigation and floating sticky tab.
All nav items anchor to sections on this page — no standalone pages in V1.

```
looktwice.uk/
  [nav]            sticky, transparent → Linen on scroll
  #hero            Hot Pink, Cutout/Drenched
  #situation       Linen, problem identification
  #approach        Signal Orange, positioning interrupt
  #work            Linen, case study placeholder
  #services        Linen, three service areas
  #contact         Deep Teal, CTA
  [footer]         Midnight
  [sticky-tab]     Persistent, gradient, floating
```

---

## Design Direction

**Color strategy:** Full palette across the page. Each section has one committed
surface colour. No section mixes two accents. Cool accents (Rich Purple, Cool Indigo)
appear as hover states and interactive moments only — not section backgrounds.

**Theme:** Light mode throughout. Clear reading hierarchy. Immediately legible at a skim.
The visitor is time-poor and half-sceptical. Every section must earn the next scroll.

**Typography:** Epilogue only. Bold (700) and Regular (400). No medium weight.
No second font family. Pull-quote register shifts use Epilogue Bold Italic.

**Layout:** Left-aligned throughout. No centred-stack hero. Asymmetric compositions.
Body copy capped at 65ch max-width. Generous vertical rhythm between sections
(--space-section: 120px). Tighter groupings within sections.

**Elevation:** Flat throughout. No card shadows. Shadow appears only on the floating
sticky tab (--shadow-float).

---

## Section 1: Navigation

**Behaviour:**
- Transparent background with White text/links when over the hero
- On scroll past hero (1px): transitions to solid Linen fill, Midnight text, 200ms
- Sticky — stays at top of viewport throughout
- No blur, no backdrop-filter, no shadow at any state

**Layout:** Logo wordmark left, nav links right. On mobile: wordmark left,
hamburger right.

**Elements:**
- Wordmark: "Look Twice", Epilogue Bold, clamp(1.4rem, 2.5vw, 1.7rem), ls 0.04em
- Nav links: WORK / APPROACH / CONTACT, Label style (0.8rem, uppercase, ls 0.1em)
- All three anchor to sections on the page (#work, #approach, #contact)
- Hover/active: Hot Pink underline, 2px solid, offset 3px. No background.

**Mobile nav:**
- Hamburger icon triggers full-width Midnight overlay
- Overlay slides down from top, 280ms ease-out-quart
- Same nav links, Linen text, Label style, stacked vertically
- Wordmark visible throughout. Close button top-right.
- No backdrop blur.

---

## Section 2: Hero (#hero)

**Surface:** Hot Pink (#E0006E), full-bleed, min-height 90vh.
**Mode:** Cutout/Drenched — single accent dominates, B&W photography in geometric apertures.

**Cutout composition:**
- Large rounded-rect cutout (16px radius): B&W headshot of Kris, right-dominant
  or centre-right. Dominant shape — roughly 40-50% of the section width.
- Small supporting circle (or rounded rect): B&W contextual image (workshop,
  hands working, architectural detail). Positioned to create asymmetric tension
  with the large cutout. Not symmetrical.
- Both images: fully desaturated (CSS filter: grayscale(100%))
- Text placed on the pink surface only — never over photography

**Text (left column, on pink):**
- Display headline: Epilogue 700, clamp(3rem, 7vw, 5.5rem), lh 1, ls -0.02em,
  White. See CONTENT-DRAFT.md for copy.
- Subhead: Body size (clamp(1rem, 1.5vw, 1.1rem)), 400, White at 85% opacity,
  lh 1.7. One sentence max.

**Buttons (below text, side-by-side desktop / stacked mobile):**
- Primary: Midnight fill, Linen text, Epilogue 700, Label size, uppercase, ls 0.1em,
  14px/32px padding, 4px radius. Text: "BOOK A SESSION". Anchors to #contact.
  Hover: Hot Pink fill, White text, 180ms ease-out.
- Ghost: 1.5px White border, White text, transparent fill, same padding and radius.
  Text: "SEE THE WORK". Anchors to #work.
  Hover: White fill, Midnight text, 180ms ease-out.

**Layout:** Two-column on desktop — text group left (~55%), cutout composition right.
On mobile: headline above, scaled-down cutout below, buttons stacked.

**Scroll reveal:** None on hero — visible immediately on load.

---

## Section 3: Problem Identification (#situation)

**Surface:** Linen (#F9F6F1), full-width.
**Padding:** --space-section top and bottom.

This is the most important section on the page. Not a service list.
Not a capability statement. Five recognisable situations in client language.
Visitors self-identify. Services follow from that.

**Elements:**
- Label chip: "THE SITUATION" — Midnight fill, Linen text, pill shape (radius 999px),
  Label typography (0.8rem, uppercase, ls 0.1em), 5px/14px padding
- Section headline: Epilogue 700, clamp(1.75rem, 3.5vw, 2.75rem), Midnight.
  See CONTENT-DRAFT.md.
- Five situation blocks (see CONTENT-DRAFT.md for copy):
  Each block: number (01-05) in Hot Pink, Label typography — then Bold title
  (Title scale: clamp(1.25rem, 2vw, 1.5rem)) — then 1-2 Body sentences (400, lh 1.7)
- Numbers are the visual anchor. No icons. No card boxes. No borders. No shadows.
- Max line length on body text: 65ch

**Layout:**
- Desktop: 2-column stagger. Col 1: items 01, 02, 03. Col 2: items 04, 05 (offset
  down by ~1 item height to create rhythm). Gap: --space-lg (64px).
- Mobile: single column, full width, --space-md (32px) between items.

**Scroll reveal:** Section headline + label chip fade in first. Then items 01-05
stagger in with 80ms delay between each. opacity 0→1, translateY 16px→0,
400ms ease-out-quart. IntersectionObserver, trigger at 20% viewport entry.

---

## Section 4: Positioning Interrupt (#approach)

**Surface:** Signal Orange (#E9631A), full-bleed. White text.
**Padding:** --space-xl (96px) top and bottom.

No chip. No subheading. No CTA. A standalone opinionated statement.
Reads like a pull quote at section scale. 40-50 words maximum.

**Element:**
- Single text block: Headline scale (clamp(1.75rem, 3.5vw, 2.75rem)), Epilogue 700,
  White, lh 1.1, ls -0.01em. Left-aligned. Max-width: 800px.
  See CONTENT-DRAFT.md for copy.

**Scroll reveal:** Fade in + translateY 16px→0, 400ms ease-out-quart.

---

## Section 5: Case Studies (#work) — PLACEHOLDER STATE FOR V1

**Surface:** Linen, full-width.
**Padding:** --space-section top and bottom.

V1 launches without detailed case study content. This section is a lightweight
placeholder that signals work exists without committing to content not yet ready.

**Elements:**
- Label chip: "WORK" — Midnight fill, Linen text, pill
- Section headline: Epilogue 700. See CONTENT-DRAFT.md.
- Brief holding statement: Body (400), 2-3 sentences. See CONTENT-DRAFT.md.
- Ghost button: "GET IN TOUCH" → anchors to #contact
  Midnight border, Midnight text, transparent fill. Hover: Midnight fill, Linen text.

**V2 spec (document here for future reference):**
- 2-3 case study teasers, asymmetric layout (first teaser large ~60% width,
  subsequent narrower)
- Each: sector label chip (Midnight), Bold problem statement (Title scale),
  one-sentence outcome (Body), "VIEW CASE STUDY →" link in Hot Pink
- Detail pages at /work/[slug] protected via Cloudflare Access (zero-trust auth,
  no backend required — see ARCHITECTURE.md)
- Anonymised where requested. Credit line in Label typography below section.
- 5 case studies available in portfolio deck: repurpose for V2

---

## Section 6: Services (#services)

**Surface:** Linen, full-width.
**Padding:** --space-section top and bottom.

Three service areas. Problem-first framing. Not discipline descriptions.
Numbered list structure — not a card grid.

**Elements:**
- Label chip: "HOW I WORK" — Midnight fill, Linen text, pill
- Section headline: Epilogue 700. See CONTENT-DRAFT.md.
- Three service items, separated by 1px Midnight-at-12% full-width horizontal rules:
  Each: number (01, 02, 03) in Hot Pink Label typography — Bold service name
  (Title scale) — 2 Body sentences describing the problem it solves.
  See CONTENT-DRAFT.md for copy.
- Ghost button below item 03: "TALK THROUGH WHAT YOU NEED →" → anchors to #contact

**Layout:** Single column, full content width. Rules span the full section width.
Max body line length: 65ch.

**Scroll reveal:** Headline first, then items 01-03 stagger in, 100ms delay each.
Same reveal spec as Section 3.

---

## Section 7: Contact / CTA (#contact)

**Surface:** Deep Teal (#2E7C80), full-bleed. Linen/White text.
**Padding:** --space-section top and bottom.

Low-friction contact. Email link, not a form (V1). Static copy prompts below
the CTA tell the visitor what to include — reduces friction, improves email quality.

**Elements:**
- Label chip: "FREE SESSION" — White border (1.5px), White text, transparent fill,
  pill shape. Same Label typography.
- Section headline: Epilogue 700, Headline or Display scale. White. See CONTENT-DRAFT.md.
- Body: 400, White at 85%, lh 1.7, 2 sentences. See CONTENT-DRAFT.md.
- CTA button: White fill, Deep Teal text, Midnight hover fill / Linen text.
  Epilogue 700, Label size, uppercase, ls 0.1em, 14px/32px padding.
  Text: "hello@looktwice.uk". href: mailto:hello@looktwice.uk
  Hover transition: 180ms ease-out.
- Static prompts below button: Label typography (0.8rem), White at 60% opacity.
  See CONTENT-DRAFT.md for prompt copy.

**Layout:** Left-aligned. Max content width 680px.

**Scroll reveal:** Same pattern. Chip → headline → body → button stagger.

---

## Section 8: Footer

**Surface:** Midnight (#26263E), full-width.
**Padding:** --space-lg (64px) top and bottom.

Minimal. Nothing beyond the essentials.

**Layout:** Two columns on desktop — left and right.
- Left: "Look Twice" wordmark (Epilogue Bold) + "Independent brand & CX strategy"
  (Label, Linen at 60%)
- Right: LinkedIn link / hello@looktwice.uk / © 2026 Look Twice
  All Label typography. Linen text. Links: Link Sage (#65907C) on hover.
- Mobile: stacked, left-aligned.

---

## Persistent Element: Floating Sticky Tab

**Position:** Fixed, bottom-right, 24px from bottom, 24px from right edge.
**Visibility:** Hidden on page load. Appears after user scrolls 100vh.
**Entrance:** slides in from right — translateX(120%) → translateX(0),
300ms ease-out-quart.
**Anchors to:** #contact

**Appearance:**
- Background: brand gradient — linear-gradient(135deg,
  --color-warm-amber 0%,
  --color-signal-orange 18%,
  --color-hot-pink 36%,
  --color-hot-pink 58%,
  --color-rich-purple 76%,
  --color-cool-indigo 88%,
  --color-deep-teal 100%)
- Text: "LET'S TALK →", Epilogue Bold, White, 0.8rem, uppercase, ls 0.1em
- Shape: test pill (radius 999px) and 4px rounded at build — pick from rendered options
- Padding: 14px 28px
- Shadow: 0 8px 32px oklch(24% 0.04 275 / 0.15)
- No hover colour change. Subtle scale: transform: scale(1.03) on hover, 180ms ease-out.

**Mobile:** Bottom-centre strip instead of corner tab.
Full-width, fixed to bottom of viewport. Same gradient, same text.
Height: 52px. No radius on top edge (flush to bottom), radius on bottom edge optional.

---

## Interaction Summary

| Element | Trigger | Behaviour | Duration |
|---|---|---|---|
| Nav background | 1px scroll | transparent → Linen fill | 200ms |
| Sticky tab | 100vh scroll | slides in from right | 300ms ease-out-quart |
| Section reveals | IntersectionObserver 20% | opacity+translateY | 400ms ease-out-quart |
| Situation items | stagger | 80ms delay between items | 400ms each |
| Service items | stagger | 100ms delay between items | 400ms each |
| All buttons | hover | background + color swap | 180ms ease-out |
| Sticky tab | hover | scale(1.03) | 180ms ease-out |
| Mobile nav | hamburger tap | Midnight overlay slides down | 280ms ease-out-quart |
| Anchor scroll | nav / button click | smooth scroll | scroll-behavior: smooth |

**No parallax. No decorative animation. No ambient motion.**
All reveals respect prefers-reduced-motion: reduce (skip transforms, keep opacity).

---

## Responsive Behaviour

**Breakpoints (suggested, GSD to confirm):**
- Mobile: < 640px
- Tablet: 640px–1024px
- Desktop: > 1024px

**Key mobile adaptations:**
- Hero: headline above cutout, cutout scales to 85% width, buttons stack
- Problem identification: single column, 32px gap between items
- Sticky tab: becomes full-width bottom strip
- Nav: hamburger triggers Midnight overlay
- Body text: max-width constraint relaxed to full column width
- Section padding: --space-section reduces to --space-xl on mobile

---

## Accessibility

- WCAG AA minimum throughout
- All images have descriptive alt text (cutout compositions too)
- Colour contrast checked on every surface:
  - White on Hot Pink: verify AA (hot pink is borderline — use 700 weight for headlines)
  - Linen on Midnight: passes AAA
  - White on Deep Teal: verify AA
  - White on Signal Orange: verify — may require Bold weight for body text
- Keyboard navigable: tab order follows visual order
- Mobile nav has aria-expanded state on hamburger button
- Smooth scroll respects prefers-reduced-motion
- Scroll reveals: opacity transition only (no translateY) when prefers-reduced-motion
- Sticky tab: aria-label="Contact Kris"
- Font display: swap on Google Fonts load

---

## Photography

All photography in hero and cutout sections: desaturated via CSS filter: grayscale(100%).

**Hero main cutout (Kris portrait):**
Current: temp headshot at inspo/temp headshot.jpeg — usable for V1.
Pre-launch: replace with editorial portrait (clean background, camera-level,
shoulders-and-up with breathing room around the subject).

**Hero supporting cutout:**
Search Unsplash: "conversation overhead", "notebook writing hands",
"architecture detail concrete", "workshop discussion candid".
Needs: high tonal contrast, works at small size, not colour-dependent.
Avoid: posed office stock, laptop clichés, anything where colour is the point.

**General Unsplash guidance:**
- Check desaturated contrast before committing (preview in grayscale)
- Faces and genuine human moments work better than objects
- Geometric and architectural details read well in small cutout shapes
- Add Unsplash credit in HTML comment + footer attribution per license

**Note:** Claude cannot pull directly from Unsplash. Kris selects images.
Brief gives search guidance. Images from portfolio deck (event/crowd photos)
are already confirmed as Unsplash and usable on the site.
