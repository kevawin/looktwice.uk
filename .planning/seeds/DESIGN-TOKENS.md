# DESIGN TOKENS: Look Twice

**Type:** Design system specification / CSS token reference
**Status:** Confirmed
**Date:** 2026-04-29
**Source:** DESIGN.md + shape session decisions

This file is the implementation-ready reference. Use it to generate the CSS
custom properties file and all component styles. Do not deviate without flagging.

---

## CSS Custom Properties

```css
:root {
  /* ============================================================
     COLOUR — Six accents, two neutrals, two true extremes, two links
     All in OKLCH. Chroma reduced at lightness extremes.
  ============================================================ */

  /* Warm accents */
  --color-hot-pink:      oklch(52% 0.28 0);       /* Primary accent. Hero surfaces, primary CTAs */
  --color-signal-orange: oklch(58% 0.22 35);      /* Secondary energy. Interrupt sections */
  --color-warm-amber:    oklch(68% 0.18 65);      /* Supporting warmth. Labels, gradient start */

  /* Cool accents */
  --color-deep-teal:     oklch(50% 0.09 195);     /* Authority. CTA/contact surfaces */
  --color-rich-purple:   oklch(38% 0.18 310);     /* Depth. Hover states, gradient */
  --color-cool-indigo:   oklch(50% 0.18 280);     /* Digital. Interactive accents, gradient */

  /* Neutrals */
  --color-midnight:      oklch(24% 0.04 275);     /* Dark surface and primary text on Linen */
  --color-linen:         oklch(97% 0.01 80);      /* Light surface. All body and working content */

  /* Extremes (use sparingly, specific roles only) */
  --color-true-white:    oklch(100% 0 0);         /* Text on dark/accent surfaces */
  --color-true-black:    oklch(0% 0 0);           /* Body text only where max contrast needed */

  /* Links */
  --color-link-sage:     oklch(58% 0.08 160);     /* Hyperlink default on Linen */
  --color-link-pine:     oklch(42% 0.08 160);     /* Visited hyperlink */

  /* Brand gradient (sticky tab only — one surface on the entire site) */
  --gradient-brand: linear-gradient(
    135deg,
    var(--color-warm-amber)    0%,
    var(--color-signal-orange) 18%,
    var(--color-hot-pink)      36%,
    var(--color-hot-pink)      58%,
    var(--color-rich-purple)   76%,
    var(--color-cool-indigo)   88%,
    var(--color-deep-teal)     100%
  );

  /* ============================================================
     TYPOGRAPHY — Epilogue only. Two weights: 700 and 400.
     No 500. No second family. IBM Plex Serif is retired.
  ============================================================ */

  --font-primary: 'Epilogue', system-ui, sans-serif;

  /* Scale */
  --text-display:  clamp(3rem, 7vw, 5.5rem);       /* Hero headline only */
  --text-headline: clamp(1.75rem, 3.5vw, 2.75rem); /* Section headings */
  --text-title:    clamp(1.25rem, 2vw, 1.5rem);    /* Service names, situation titles */
  --text-body:     clamp(1rem, 1.5vw, 1.1rem);     /* All running copy */
  --text-label:    0.8rem;                          /* Chips, nav, footer, captions */

  /* Line heights */
  --lh-display:  1;
  --lh-headline: 1.1;
  --lh-title:    1.2;
  --lh-body:     1.7;
  --lh-label:    1.4;

  /* Letter spacing */
  --ls-display:  -0.02em;
  --ls-headline: -0.01em;
  --ls-label:    0.1em;

  /* Body line length cap */
  --measure: 65ch;

  /* ============================================================
     SPACING
  ============================================================ */

  --space-xs:      8px;
  --space-sm:      16px;
  --space-md:      32px;
  --space-lg:      64px;
  --space-xl:      96px;
  --space-section: 120px;

  /* ============================================================
     RADIUS
  ============================================================ */

  --radius-sm:     4px;    /* Buttons — starting point, test at build */
  --radius-md:     10px;   /* Cards (used sparingly) */
  --radius-lg:     20px;
  --radius-cutout: 16px;   /* Cutout mask shapes — locked */
  --radius-pill:   999px;  /* Chips, sticky tab option */

  /* ============================================================
     SHADOWS — Flat system. Shadow appears only on floating elements.
  ============================================================ */

  --shadow-float: 0 8px 32px oklch(24% 0.04 275 / 0.15);
  /* Use only on: floating sticky tab */
  /* Never use on: cards, callouts, hover states */

  /* ============================================================
     TRANSITIONS
  ============================================================ */

  --transition-button: background-color 180ms ease-out, color 180ms ease-out;
  --transition-nav:    background-color 200ms ease-out, color 200ms ease-out;
  --transition-reveal: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1),
                       transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-tab:    transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## Typography Usage Rules

| Role | Size | Weight | LH | LS | Usage |
|---|---|---|---|---|---|
| Display | --text-display | 700 | 1 | -0.02em | Hero headline only |
| Headline | --text-headline | 700 | 1.1 | -0.01em | Section headings |
| Title | --text-title | 700 | 1.2 | — | Situation titles, service names |
| Body | --text-body | 400 | 1.7 | — | All running copy, max 65ch |
| Label | --text-label | 400 | 1.4 | 0.1em | Uppercase only at this scale |

**Rules:**
- Bold (700) or Regular (400). Never 500. Never anything between.
- Italic: Epilogue Bold Italic for pull-quote register shifts only. Not for inline emphasis.
- Emphasis within body copy: Bold (700), not italic.
- Label is always uppercase when used as a chip, nav item, or button.
- Body is never uppercase.

---

## Component Specs

### Buttons

**Primary (dark):**
```css
background: var(--color-midnight);
color: var(--color-linen);
border-radius: var(--radius-sm);   /* 4px — test at build */
padding: 14px 32px;
font: 700 var(--text-label) var(--font-primary);
letter-spacing: var(--ls-label);
text-transform: uppercase;
transition: var(--transition-button);

&:hover {
  background: var(--color-hot-pink);
  color: var(--color-true-white);
}
```

**Accent (pink) — use on Linen backgrounds or for maximum urgency:**
```css
background: var(--color-hot-pink);
color: var(--color-true-white);
/* same shape, padding, typography as Primary */

&:hover {
  background: var(--color-rich-purple);
}
```

**Ghost (on Linen):**
```css
background: transparent;
color: var(--color-midnight);
border: 1.5px solid var(--color-midnight);
/* same shape, padding, typography as Primary */

&:hover {
  background: var(--color-midnight);
  color: var(--color-linen);
}
```

**Ghost (on accent/dark surfaces — Hero, Deep Teal, Orange):**
```css
background: transparent;
color: var(--color-true-white);
border: 1.5px solid var(--color-true-white);

&:hover {
  background: var(--color-true-white);
  color: var(--color-midnight);
}
```

**Button shape:** --radius-sm (4px) is the starting point. Test pill (--radius-pill)
and sharp (0) at build — pick from rendered options before committing.
No transform lift on hover. No box-shadow.

### Chips / Tags

**Default:**
```css
background: var(--color-midnight);
color: var(--color-linen);
border-radius: var(--radius-pill);
padding: 5px 14px;
font: 400 var(--text-label) var(--font-primary);
letter-spacing: var(--ls-label);
text-transform: uppercase;
display: inline-flex;
```

**Ghost chip (on dark/accent surfaces):**
```css
background: transparent;
color: var(--color-true-white);
border: 1.5px solid var(--color-true-white);
/* same shape and typography */
```

**Accent chip (Hot Pink — active filter state, V2):**
```css
background: var(--color-hot-pink);
color: var(--color-true-white);
```

### Cutout Mask (Signature component)

```css
.cutout-surface {
  position: relative;
  overflow: hidden;
  background: var(--color-hot-pink); /* or current section accent */
}

.cutout-image {
  filter: grayscale(100%);
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.cutout-rect {
  border-radius: var(--radius-cutout); /* 16px — locked */
  overflow: hidden;
}

.cutout-circle {
  border-radius: 50%;
  overflow: hidden;
}
```

Rules:
- Rounded-rect (16px) and circles only. Never irregular or freeform.
- One dominant large cutout + one or two smaller supporting shapes.
- Never symmetrical equal-sized cutout grids.
- Images always desaturated. Colour is in the surface, not the photo.
- Text always on the solid colour surface, never over photography.

### Navigation

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  transition: var(--transition-nav);
}

.nav.scrolled {
  background: var(--color-linen);
}

.nav-link {
  font: 400 var(--text-label) var(--font-primary);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  text-decoration: none;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-hot-pink);
  transition: width 180ms ease-out;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}
```

### Floating Sticky Tab

```css
.sticky-tab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  background: var(--gradient-brand);
  color: var(--color-true-white);
  font: 700 var(--text-label) var(--font-primary);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: var(--radius-pill); /* or var(--radius-sm) — test at build */
  box-shadow: var(--shadow-float);
  transform: translateX(120%);
  transition: var(--transition-tab);
}

.sticky-tab.visible {
  transform: translateX(0);
}

.sticky-tab:hover {
  transform: scale(1.03);
  transition: transform 180ms ease-out;
}

/* Mobile: full-width bottom strip */
@media (max-width: 640px) {
  .sticky-tab {
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 0;
    text-align: center;
    padding: 16px;
  }

  .sticky-tab.visible {
    transform: translateY(0);
  }

  .sticky-tab {
    transform: translateY(100%);
  }
}
```

### Scroll Reveal

```css
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: var(--transition-reveal);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    transform: none;
    transition: opacity 400ms ease-out;
  }
}
```

JS pattern:
```js
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

Stagger pattern for situation/service items:
```js
document.querySelectorAll('.situation-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 80}ms`;
});
```

---

## Colour Usage Rules (Named)

**The Commitment Rule.** Every accent surface is a deliberate choice. Before placing
a colour, name the reason: which section, which moment in the visitor's journey.

**The One Surface Rule.** A single accent colour occupies a section. Two accents
on one surface create noise. Gradients are the one exception — they blend adjacent
accents but never introduce a third mid-section.

**The Gradient Rule.** The brand gradient appears in exactly one place on the site:
the floating sticky tab. Nowhere else.

**The Midnight-or-Linen Rule.** Background is Midnight or Linen. No mid-tone grey.
Linen for working and explanatory content; Midnight for footer and authority moments.

**The Cool Accent Rule.** Rich Purple and Cool Indigo are hover states and gradient
colours on this site. They do not appear as section backgrounds on the homepage.

---

## Absolute Design Bans

These are hard stops — rewrite rather than use:

- `border-left` or `border-right` > 1px as a coloured accent stripe. Never.
- `background-clip: text` with a gradient. Never.
- Glassmorphism (backdrop-filter blur). Never on this site.
- Box-shadow on cards, callouts, or hover states.
- Mid-tone grey backgrounds (#888, #ccc, etc.). Midnight or Linen.
- Identical card grids (same size, icon + heading + text, repeated).
- `font-weight: 500`.
- Em-dashes in copy (-- or —). Use commas, colons, or new sentences.

---

## Accessibility Checks Required

Before marking any section complete, verify:

| Surface | Text colour | Minimum ratio | Check |
|---|---|---|---|
| Hot Pink | White (700 weight) | 4.5:1 | Verify — borderline |
| Hot Pink | White (400 weight) | 4.5:1 | May fail — use 700 |
| Signal Orange | White (700) | 4.5:1 | Verify |
| Deep Teal | White (400) | 4.5:1 | Verify |
| Midnight | Linen | 4.5:1 | Passes |
| Linen | Midnight | 4.5:1 | Passes |
| Gradient tab | White (700) | 4.5:1 | Verify at darkest point |

Use the WebAIM contrast checker or equivalent. Fail = increase font weight or
adjust OKLCH lightness of the surface colour slightly.
