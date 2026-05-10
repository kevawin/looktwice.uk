# Roadmap: V1 Refresh (Jamie review + founder positioning)

**Source:** Jamie website review (2026-05-04) + founder positioning chat (2026-05-08)
**Branch:** new-site
**Rule:** Check for uncommitted work before starting any phase. No new work on top of uncommitted work.

---

## Items

- [ ] Item 1: Copy revisions
- [ ] Item 2: Navigation and CTA structure
- [ ] Item 3: Services layout
- [ ] Item 4: Credentials section
- [ ] Item 5: Visual variety (Jamie-dependent)

---

## Item 1: Copy revisions

**Scope:** Hero, approach, services descriptions, CTA text, free session timeline, value prop direction.

### Decisions before plan phase
- [x] Hero headline: "Improve the return on your investment in [rotating word]" -- done, live
- [x] Value prop direction: lead with commercial argument now. Subhead = transformation line; two paragraphs = mechanism + cost of misalignment. Done, live.
- [x] CTA label: keep "Let's talk" on button; add "Schedule a free 30-minute diagnosis." as pre-button label in hero only. Done, live.
- [x] Approach / Dig: replaced by new "what it's like to work with me" section (see below)
- [ ] Free session timeline: confirm the 5/15/10 min split is accurate.

### New section: what it's like to work with me
- Position: immediately after hero (after the "Let's talk" button)
- Format: short summary visible by default, "read more" to expand full detail
- Content: outlines what Kris does and how she works -- to be written by Kris
- Styling: will need layout work (separate from Item 1 copy decisions)

### Phases
- [ ] **Discuss** - open Qs above resolved; copy written by Kris
- [ ] **Plan** - Claude maps every copy change to its HTML location, proposes diff
- [ ] **Tweak** - Kris adjusts plan if needed
- [ ] **Execute** - Claude implements approved copy changes
- [ ] **Review** - Kris checks on phone/desktop, notes anything off
- [ ] **Wrap up** - commit & push, update this roadmap, prompt for Item 2, remind to clear context

---

## Item 2: Navigation and CTA structure

**Scope:** Burger breakpoint, nav label alignment, sticky tab fate, button standardisation, contact form vs email.

### Decisions before plan phase
- [ ] Sticky tab: keep (relabel to "Free 30min call →"), remove, or relocate to nav? Jamie's objection was "two floating elements" - currently only one exists. Confirm whether the concern still applies.
- [ ] Contact form vs email: form (Netlify/Formspree, adds spam risk) or mailto link (current, frictionless)? 
- [ ] Desktop nav label: "Free 30min call" is long for a nav item - OK with that or shorten to "Book a call"?

### Phases
- [ ] **Discuss** - decisions above resolved
- [ ] **Plan** - Claude proposes nav changes, sticky tab treatment, form markup if needed
- [ ] **Tweak** - Kris adjusts
- [ ] **Execute** - Claude implements
- [ ] **Review** - Kris checks on phone (burger behaviour, CTA visibility while scrolling)
- [ ] **Wrap up** - commit & push, update roadmap, prompt for Item 3, remind to clear context

---

## Item 3: Services layout

**Scope:** Column layout, expandable "read more", background images, packaging sprint as named service.

### Decisions before plan phase
- [ ] Packaging sprint: is this a real deliverable you're selling now, or aspirational? (If yes, it needs a name, a short description, and a real process behind it.)
- [ ] Background images: Unsplash stock risks looking generic on a brand strategy site. Do you want images, abstract/textural images, or no images?
- [ ] Expandable detail: how much extra copy is there to reveal? "Read more" only makes sense if the hidden content earns it.

### Phases
- [ ] **Discuss** - decisions above resolved
- [ ] **Plan** - Claude designs column layout + expand mechanism + image treatment
- [ ] **Tweak** - Kris adjusts
- [ ] **Execute** - Claude implements
- [ ] **Review** - Kris checks expand/collapse behaviour, image feel, mobile layout
- [ ] **Wrap up** - commit & push, update roadmap, prompt for Item 4, remind to clear context

---

## Item 4: Credentials section

**Scope:** Three-layer logo/icon structure (client brands, agency logos, industry icons) replacing or supplementing current work prose.

### Decisions before plan phase
- [ ] Client brands: which ones? Do you have permission to display their logos publicly?
- [ ] Logo assets: do you have SVG/PNG files, or do they need sourcing?
- [ ] Agency logos (TBWA, Havas, MediaCom): treat as employer credits - fine to use.
- [ ] Industry icons: Lucide SVGs are fine. Confirm the five sectors (retail, FMCG, healthcare, leisure, finance - current site has hospitality too, drop or keep?).
- [ ] Current work prose: compress to 2-3 lines or remove entirely once logos carry the credibility?

### Phases
- [ ] **Discuss** - decisions above resolved, assets confirmed
- [ ] **Plan** - Claude proposes three-layer layout, sourcing plan for icons, placeholder for brand logos
- [ ] **Tweak** - Kris adjusts
- [ ] **Execute** - Claude implements; brand logos dropped in once Kris provides files
- [ ] **Review** - Kris checks visual hierarchy, logo quality, section feel
- [ ] **Wrap up** - commit & push, update roadmap, prompt for Item 5, remind to clear context

---

## Item 5: Visual variety

**Scope:** Break rectangle pattern, Approach section imagery, general layout rhythm. Jamie-dependent.

### Decisions before plan phase
- [ ] Is Jamie available and engaged for this? If not, defer.
- [ ] What does "break the rectangle" mean specifically? Options: angled dividers, blob/organic shapes, full-bleed images, asymmetric layout, mixed section heights. Pick a direction.
- [ ] Approach section: what should it look like? Currently 3 words + 2 sentences. Does it need a visual, or does it need better copy first (Item 1)?

### Phases
- [ ] **Discuss** - Jamie looped in; direction agreed
- [ ] **Plan** - Claude or Jamie proposes layout sketch; Claude translates to HTML/CSS plan
- [ ] **Tweak** - Kris adjusts
- [ ] **Execute** - Claude implements
- [ ] **Review** - Kris and Jamie review
- [ ] **Wrap up** - commit & push, update roadmap, close refresh milestone, remind to clear context

---

*Last updated: 2026-05-10*
