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
  true-black: "#000000"
  true-white: "#FFFFFF"
  link-sage: "#65907C"
  link-pine: "#3A6054"
typography:
  display:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.5vw, 1.1rem)"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  md: "10px"
  lg: "20px"
  cutout: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "64px"
  xl: "96px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.linen}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.hot-pink}"
    textColor: "{colors.true-white}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  button-accent:
    backgroundColor: "{colors.hot-pink}"
    textColor: "{colors.true-white}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  button-accent-hover:
    backgroundColor: "{colors.rich-purple}"
    textColor: "{colors.true-white}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.midnight}"
    rounded: "{rounded.sm}"
    padding: "13px 31px"
  button-ghost-hover:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.linen}"
    rounded: "{rounded.sm}"
    padding: "13px 31px"
  chip:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.linen}"
    rounded: "{rounded.pill}"
    padding: "5px 14px"
  chip-accent:
    backgroundColor: "{colors.hot-pink}"
    textColor: "{colors.true-white}"
    rounded: "{rounded.pill}"
    padding: "5px 14px"
---

# Design System: Look Twice

## 1. Overview

**Creative North Star: "The Second Look"**

The surface is never the whole story. In this visual system, bold colour dominates
the foreground - then geometric cutouts reveal what is underneath. B&W photography
emerges through rounded rectangles and circles cut into solid fields of accent colour.
The brand name earns its place in every layout decision: look again, something was
there that was not visible at first. Restraint and revelation in the same frame.

This is a system of two modes. Hero (Cutout) mode is drenched in accent colour -
one saturated hue carries 60-80% of the surface, with desaturated photography
breaking through geometric apertures. Working (Colour Block) mode grounds everything
on Linen (`#F9F6F1`), using the accent palette structurally: category chips, vertical
bars, pull-quote blocks, data annotations. Both modes share one typeface, one weight
contrast logic, and one photography treatment. The cohesion is the system.

What this system rejects: generic consultancy polish, luxury serif aesthetics, stock
photography used carelessly, decorative gradients, glassmorphism, and identical card
grids. If a layout could belong to any solo brand strategist's site, it has failed.

**Key Characteristics:**
- Two-mode system: drenched Hero (Cutout) and structured Working (Colour Block)
- Single typeface (Epilogue), maximum weight contrast — Bold or Regular, nothing between
- B&W photography in hero compositions; full colour for evidence and research
- Geometric cutout as the signature visual device
- Colour is committed and purposeful, never ambient decoration
- Flat elevation: depth through tonal contrast, not shadows


## 2. Colors: The Two-Surface Palette

Six committed accents on two backgrounds. No colour is ambient or decorative —
each use is earned.

### Primary

- **Hot Pink** (`#E0006E`): The lead accent. Hero surfaces, primary CTAs on light
  backgrounds, the strongest emphasis state. When a single colour carries the weight
  of a surface, it is this one.

- **Signal Orange** (`#E9631A`): Secondary energy. Gradient pairings with Hot Pink
  (orange-to-pink, orange-to-purple), accent buttons on dark backgrounds, structural
  bars in Working mode.

- **Warm Amber** (`#F59300`): Supporting warmth. Highlight bars, data annotation,
  chips and labels where orange reads too intense.

### Secondary

- **Deep Teal** (`#2E7C80`): Calm authority. Standalone section openers, closing
  CTA surfaces where contrast from the warm accents is needed. The "let's talk" colour.

- **Rich Purple** (`#6C2C8C`): Depth and weight. Hero surfaces where gravitas matters;
  button hover states on pink elements; gradient endpoint in warm-to-dark transitions.

- **Cool Indigo** (`#5556CC`): Structural and digital. Navigation-adjacent treatments,
  interactive state accents, gradient pairings with Rich Purple.

### Neutral

- **Midnight** (`#26263E`): The dark background. A deep blue-violet neutral — not
  true black. Primary text on Linen, dark section backgrounds, button fills on light.

- **Linen** (`#F9F6F1`): The light background. A warm off-white with slight warmth.
  The primary working surface for all body and explanatory content.

- **True Black** (`#000000`): Body text only when maximum contrast is required for
  accessibility on Linen. Not a background colour.

- **True White** (`#FFFFFF`): Text and elements on dark and saturated accent surfaces.

- **Link Sage** (`#65907C`): Hyperlink default state on Linen. Muted green-teal,
  legible without competing with the accent palette.

- **Link Pine** (`#3A6054`): Visited hyperlink. Darker Sage variant.

### Named Rules

**The Commitment Rule.** Every accent surface is a deliberate choice, not a reflex.
Before placing a colour, name the reason: which section, which emotional register,
which moment in the user's journey needs to stop the eye here.

**The One Surface Rule.** A single accent colour occupies a hero or section opener.
Two accents on one surface create noise, not energy. Gradients are the one exception:
they blend adjacent accents (Pink-Orange, Purple-Indigo) but never introduce a third.

**The Midnight-or-Linen Rule.** Background is Midnight or Linen. There is no
mid-tone grey in this system. Linen for working and explanatory content; Midnight for
authority, transition moments, and sections that need to feel structurally distinct.


## 3. Typography: The Epilogue System

**Primary font:** Epilogue (all weights) — Google Fonts, free for commercial use.
Available as variable font; use static instances 400 and 700 only.
**Pull-quote accent:** IBM Plex Serif Italic (used sparingly as a register shift).
Epilogue Bold Italic is the within-family substitute.

**Character:** A single sans-serif family deployed through extreme weight contrast.
Bold headings at negative tracking read direct and confident; regular body with
generous line-height reads considered and human. It does not try to be clever — it
is legible, clear, and precise. One typeface used well beats two used lazily.

### Hierarchy

- **Display** (700, `clamp(3rem, 7vw, 5.5rem)`, lh 1, ls -0.02em): Homepage hero
  headline and major campaign openers. Used rarely — when the type is the visual event.

- **Headline** (700, `clamp(1.75rem, 3.5vw, 2.75rem)`, lh 1.1, ls -0.01em): Section
  headings, case study titles, page-level headers.

- **Title** (700, `clamp(1.25rem, 2vw, 1.5rem)`, lh 1.2): Service names, case study
  structural labels (Brief, Strategy, Impact), card headings.

- **Body** (400, `clamp(1rem, 1.5vw, 1.1rem)`, lh 1.7): All running copy. Max line
  length 65-75ch enforced. Never condensed or narrowed.

- **Label** (400, `0.8rem`, lh 1.4, ls 0.1em, uppercase): Tags, chips, navigation
  links, metadata, captions, footer. Uppercase only at this scale — not at body size.

### Named Rules

**The No Medium Rule.** Medium weight (500) is not in this system. The contrast is
Bold (700) or Regular (400). A third weight muddies the hierarchy. Use one or the other.

**The Italic Exception.** Italics are for pull quotes and register shifts only —
not for emphasis within body copy. Emphasis in running text uses Bold.


## 4. Elevation

This system is flat. Depth is created through the contrast between Midnight and Linen
surfaces, the visual weight of committed accent colour blocks, and the tension between
B&W photography and saturated colour fields — not through shadows.

Interactive elements use colour-state transitions as feedback, not elevation lift.
The one exception is a subtle diffuse shadow on genuinely floating UI (a persistent
contact tab, a sticky element that must read as above the page surface).

### Shadow Vocabulary

- **Ambient Float** (`0 8px 32px rgba(38, 38, 62, 0.15)`): Floating UI only — a
  persistent sticky tab or element that must visually separate from the page surface.
  Not for cards, callouts, or hover states.

### Named Rules

**The Flat-by-Default Rule.** Surfaces are flat at rest. Shadows appear only when an
element is genuinely floating above the page. Reaching for a shadow to make a card
feel designed is a signal to redesign the card.


## 5. Components

### Buttons

Direct and confident. No pill shape, no decoration. Buttons announce intent.

- **Shape:** To be determined during build — explore what looks best rendered.
  4px (rounded.sm) is a starting point; pill and sharper variants should both
  be tested before committing.
- **Primary (dark):** Midnight fill, Linen text, Label typography (uppercase,
  0.1em tracking), 14px / 32px padding. Hover: Hot Pink fill, White text.
- **Accent (pink):** Hot Pink fill, White text. The primary CTA on Linen backgrounds
  or where maximum urgency is needed. Hover: Rich Purple fill.
- **Ghost:** 1.5px Midnight border, Midnight text, transparent fill. For secondary
  actions on Linen. Hover: Midnight fill, Linen text.
- **Transition:** `background-color 0.18s ease-out, color 0.18s ease-out`. No
  transform lift on hover.

### Chips / Tags

Used for case study categorisation and service labels. Small, dense, clear.

- **Default:** Midnight fill, Linen text, pill shape, Label typography, 5px / 14px
  padding. No interactive state unless the chip is filterable.
- **Accent variant:** Hot Pink fill, White text. Used to highlight the primary
  category or an active filter state.

### Cards / Containers

Used sparingly. The default content pattern is open layout on Linen, not boxed.
Cards are appropriate for case study summaries and service tier listings only.

- **Corner style:** 10px radius (rounded.md).
- **Background:** Linen or True White on a Linen page; Midnight on dark sections.
- **Border:** 1px solid `rgba(38, 38, 62, 0.12)` on Linen. No border on dark.
- **Shadow:** None.
- **Padding:** 32px (spacing.md).
- **No nested cards. No card grids where every card is the same size and layout.**

### Inputs / Fields

Clean and undecorated. Forms should feel functional, not designed.

- **Style:** Bottom-border only at rest — 1.5px, Midnight at 40% opacity. No
  outer border box, no background fill.
- **Focus:** Bottom border shifts to full Midnight opacity at 2px. No glow, no colour.
- **Error:** Bottom border shifts to Hot Pink.
- **Label:** Above the field, Label typography, Midnight at 70% opacity.
- **Placeholder:** Body size, Midnight at 40% opacity.

### Navigation

Minimal and clear. No raised shadow when sticky. No glassmorphism.

- **Wordmark:** Epilogue Bold, `clamp(1.4rem, 2.5vw, 1.7rem)`, ls 0.04em.
- **Nav links:** Label typography (0.8rem, uppercase, ls 0.1em). Midnight on Linen
  pages; Linen or White on dark and accent pages.
- **Hover / active:** Hot Pink underline, 2px, offset 3px. No background highlight.
- **Sticky behaviour:** Solid Linen or Midnight fill. No blur, no backdrop filter.
- **Mobile:** Full-width overlay. Same typography. Wordmark visible throughout.

### Cutout Mask (Signature Component)

The defining visual device. A solid accent colour surface with desaturated photography
revealed through geometric apertures.

- **Surface:** Single accent fill, full-bleed. Any of the six accents.
- **Cutout shapes:** Rounded rectangles (16px radius) and circles only. Never
  irregular or freeform shapes.
- **Photography:** Fully desaturated (grayscale) or heavily muted. Colour lives in
  the surface field, not the photograph.
- **Composition:** One dominant large cutout and one to two smaller supporting shapes.
  Avoid symmetrical grids of equal-sized cutouts.
- **Text:** Placed on the solid colour surface, not over photography. Linen or White
  at Display or Headline scale.
- **When to use:** Homepage hero, section openers, work teasers. Not for body content
  or working sections.


## 6. Do's and Don'ts

### Do

- **Do** use a single accent colour as the dominant surface in hero and section openers.
  Commit to it fully — half-committed colour reads as uncertainty.
- **Do** desaturate or convert to B&W all photography in Cutout/Hero mode. Colour comes
  from the surface field. The photograph is the texture, not the statement.
- **Do** show evidence and research photography in full natural colour — never
  desaturate material that must convey real-world context and human truth.
- **Do** use Epilogue Bold (700) and Epilogue Regular (400) only. No medium weight.
  Emphasis in body copy uses Bold, not italic.
- **Do** cap body line length at 65-75ch. No full-width paragraphs.
- **Do** check WCAG AA contrast on every surface. Linen and White on dark and accent
  backgrounds; Midnight and True Black on Linen.
- **Do** write descriptive alt text for all images, including cutout compositions.
- **Do** use motion to aid understanding — scroll-driven content reveals, timeline
  animations that sequence information. Not to transition between states decoratively.

### Don't

- **Don't** produce generic solo brand strategist site patterns: stock hero photo,
  "We help brands grow" headline, four icon-plus-text cards in a grid. If the layout
  could have been generated by any solo consultant's AI tool, it has failed.
- **Don't** use luxury serif typography or high-polish agency aesthetics. Wrong register
  for the SME and scale-up audience — it signals unaffordable, not expert.
- **Don't** use identical card grids. Same-sized card, icon, heading, text, repeated
  endlessly is the lazy answer. Cards are used sparingly; grids of them never are.
- **Don't** use `border-left` or `border-right` greater than 1px as a coloured stripe
  on cards, callouts, or list items. Rewrite with a background tint, full border,
  leading numbers, or nothing.
- **Don't** use gradient text (`background-clip: text` with a gradient fill). Use a
  solid colour. Emphasis through weight or scale.
- **Don't** use glassmorphism — blurred backdrop, semi-transparent panels — except
  where absolutely necessary for spatial grounding.
- **Don't** place two competing accent colours on the same surface. One accent per
  surface. Gradients blend adjacent accents; a third does not enter.
- **Don't** use decorative motion: no fade-in-from-below on every paragraph, no
  parallax for atmosphere, no animated background gradients.
- **Don't** use `#000000` as a background. Midnight (`#26263E`) is the dark surface.
- **Don't** use mid-tone grey backgrounds. This system has Midnight and Linen. Nothing
  in between.
- **Don't** use box shadows on cards, callouts, or hover states. The system is flat.
  Shadows appear only on genuinely floating elements.
