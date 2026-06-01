# Phase 10: Contact mechanic — form vs email - Pattern Map

**Mapped:** 2026-06-01
**Files analyzed:** 3 (index.html modified; CLAUDE.md updated; .planning/STATE.md updated)
**Analogs found:** 3 / 3

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `index.html` (contact section, lines 246-271) | component (form markup) | request-response | `index.html` lines 80-141 (floating-bar JS wiring) | role-match |
| `index.html` (JS submit handler, appended to `js/main.js` or inline `<script>`) | utility (event handler) | request-response | `js/main.js` lines 25-141 (initFloatingBar IIFE) | exact |
| `index.html` (footer mailto removal, line 285) | markup removal | — | `index.html` lines 256-259 (contact CTA group) | exact |
| `CLAUDE.md` (contact rule update) | config | — | existing `CLAUDE.md` project section | exact |
| `.planning/STATE.md` (decision reversal note) | config | — | existing STATE.md Decisions section | exact |

---

## Pattern Assignments

### Form markup in `.contact__inner` (replaces `.contact__cta-group` + `.contact__list-wrap`)

**Analog:** `index.html` lines 246-271 — existing contact section scaffold

**Existing section structure** (lines 246-271):
```html
<section id="contact" class="contact">
  <div class="contact__inner">
    <div class="contact__intro">
      <h2 class="contact__headline">What happens at our free session?</h2>
      <p class="contact__body">...</p>
      <p class="contact__body">...</p>
      <div class="contact__cta-group">
        <a class="btn btn--on-teal" href="mailto:hello@looktwice.uk">Free 30-min chat</a>
        <a class="contact__email" href="mailto:hello@looktwice.uk">hello@looktwice.uk</a>
      </div>
    </div>
    <div class="contact__list-wrap">
      <h3 class="contact__list-title">Tell me, when you get in touch:</h3>
      <ul class="contact__list" role="list">
        <li>What the business does</li>
        <li>What the problem feels like right now</li>
        <li>What you've already tried</li>
      </ul>
    </div>
  </div>
</section>
```

**What to replace:** Remove `.contact__cta-group` (lines 256-259) and `.contact__list-wrap` (lines 262-269). Add the form in their place inside `.contact__intro`, after the two `.contact__body` paragraphs.

**Form pattern to use** (new markup, no existing analog — based on decisions + Formspree docs):
```html
<!-- aria-live region — announced on success and error, sits before the form -->
<div id="contact-status"
     role="status"
     aria-live="polite"
     aria-atomic="true"
     class="contact__status"></div>

<form class="contact__form"
      id="contact-form"
      action="https://formspree.io/f/xbdbnrkr"
      method="POST"
      novalidate>

  <!-- Honeypot — hidden from humans, Formspree _gotcha convention -->
  <input type="text"
         name="_gotcha"
         tabindex="-1"
         autocomplete="off"
         aria-hidden="true"
         style="display:none">

  <div class="contact__field">
    <label class="contact__label" for="contact-name">Your name <span aria-hidden="true">*</span></label>
    <input class="contact__input"
           id="contact-name"
           type="text"
           name="name"
           required
           aria-required="true"
           autocomplete="name">
  </div>

  <div class="contact__field">
    <label class="contact__label" for="contact-email">Your email <span aria-hidden="true">*</span></label>
    <input class="contact__input"
           id="contact-email"
           type="email"
           name="email"
           required
           aria-required="true"
           autocomplete="email">
  </div>

  <div class="contact__field">
    <label class="contact__label" for="contact-message">Tell me about your situation <span aria-hidden="true">*</span></label>
    <textarea class="contact__input contact__input--textarea"
              id="contact-message"
              name="message"
              required
              aria-required="true"
              rows="6"
              placeholder="What the business does, what the problem feels like right now, what you've already tried."></textarea>
  </div>

  <p class="contact__privacy">I'll only use this to arrange our free 30-minute chat. I won't add you to a newsletter or sell your email address to the devil.</p>

  <button class="btn btn--on-teal contact__submit" type="submit">Send</button>

</form>
```

**Design constraints from CLAUDE.md / tokens.css to honour:**
- Input and textarea: no card shadows (`--shadow-float` is banned on form fields). Border only.
- No `font-weight: 500`. Use 400 for labels and input text; 700 for the submit button (inherits from `.btn`).
- No gradient text, no glassmorphism.
- Focus ring: `outline: 2px solid var(--color-true-white); outline-offset: 4px` on inputs and button — matches `.btn--on-teal:focus-visible` (components.css line 122-125).
- Input border colour on Deep Teal surface: `var(--color-true-white)` at partial opacity, or full white. Never a mid-tone grey (banned).
- Font: `font-family: var(--font-primary)` — Epilogue.

---

### Vanilla-JS submit handler (new IIFE in `js/main.js`)

**Analog:** `js/main.js` lines 25-141 — `initFloatingBar` IIFE

**IIFE structure pattern** (lines 25-30 + 125-141):
```js
(function initFloatingBar() {
  const bar = document.querySelector('.floating-bar');
  if (!bar) return;                          // guard: bail if element absent

  // ... feature code ...

  burger.addEventListener('click', () => {   // attach listener in JS, no inline handler
    if (burger.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });
})();
```

**Key conventions to copy:**
- Wrap in a named IIFE: `(function initContactForm() { ... })();`
- First line: query the element; return early if absent.
- Attach event listener in JS — no `onsubmit=""` inline attribute (Phase 05 rule: "no inline handlers, attach in JS").
- Use `{ passive: true }` for scroll/resize listeners; not needed for `submit` — just `addEventListener('submit', handler)`.

**prefers-reduced-motion pattern** (lines 187-189 in initWordRoller):
```js
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  roller.textContent = words[0];
  return;
}
```
Apply same guard for any CSS transition on the success/error message — if reduced motion is on, skip fade-in class and just show the text immediately.

**Fetch submit handler pattern to write** (new, no codebase analog — follows Formspree AJAX docs + project conventions):
```js
(function initContactForm() {
  const form   = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');
  if (!form || !status) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Client-side honeypot check (belt-and-braces alongside Formspree's own check)
    if (form.querySelector('[name="_gotcha"]').value) return;

    // Basic required-field validation — focus first invalid field
    const invalid = form.querySelector(':invalid');
    if (invalid) {
      invalid.focus();
      // announce error to screen readers
      status.textContent = 'Please fill in all required fields.';
      return;
    }

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // success
        form.reset();
        form.hidden = true;
        status.textContent = 'Thanks — I\'ll be in touch within one working day.';
      } else {
        const json = await res.json().catch(() => ({}));
        status.textContent = json.error
          ? json.error
          : 'Something went wrong. Try emailing hello@looktwice.uk directly.';
      }
    } catch (_err) {
      status.textContent = 'Could not send — check your connection, or email hello@looktwice.uk directly.';
    }
  });
})();
```

**Note:** The fetch fallback message includes the email address even though no visible mailto link remains (D-02 removes visible mailto; an error-state fallback reference is a usability exception, not a visible link).

---

### Footer mailto removal (line 285)

**Analog:** `index.html` line 285 — the item to remove

**Current markup** (line 285):
```html
<li><a class="footer__link" href="mailto:hello@looktwice.uk">hello@looktwice.uk</a></li>
```

**Action:** Remove this `<li>` entirely. The LinkedIn link (line 284) and Privacy/Copyright lines (286-287) remain. No replacement needed — the form in `#contact` is the single contact route (D-02).

**Verify:** After removal, `<ul class="footer__meta">` should contain exactly: LinkedIn, Privacy policy, and the copyright span. No second email `<li>`.

---

### Hero and floating bar CTAs (lines 109, 293) — verify-only, no change

**Analog:** `index.html` line 109 and line 293

**Current markup:**
```html
<!-- line 109 -->
<a class="btn btn--on-pink" href="#contact">Free 30-min chat</a>

<!-- line 293 -->
<a class="floating-bar__cta" href="#contact">Free 30-min chat</a>
```

Both already point to `#contact` — not `mailto:`. No change needed. Verify after the form lands that both scroll to the form and the form is the first focusable element in the section.

---

### CSS additions (new rules in `css/components.css`)

**Analog:** `css/components.css` lines 572-682 — existing `.contact` block

**Existing focus-ring pattern to copy** (lines 635-638):
```css
.contact__email:focus-visible {
  outline: 2px solid var(--color-true-white);
  outline-offset: 4px;
}
```

**Existing body text pattern** (lines 601-609):
```css
.contact__body {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-true-white);
  margin: 0;
  max-width: var(--measure);
}
```

**New rules to add** after the existing `.contact__list li::before` block (after line 676):
```css
/* Contact form — inputs, labels, status, privacy note */

.contact__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  max-width: var(--measure);
}

.contact__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.contact__label {
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: var(--text-label);
  letter-spacing: var(--ls-label);
  line-height: var(--lh-label);
  color: var(--color-true-white);
}

.contact__input {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-midnight);
  background: var(--color-true-white);
  border: 2px solid var(--color-true-white);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
}

.contact__input:focus-visible {
  outline: 2px solid var(--color-true-white);
  outline-offset: 4px;
  border-color: var(--color-true-white);
}

.contact__input--textarea {
  resize: vertical;
  min-height: 140px;
}

.contact__privacy {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: var(--text-label);
  letter-spacing: 0;
  line-height: var(--lh-body);
  color: var(--color-true-white);
  opacity: 0.85;
  margin: 0;
}

.contact__status {
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-true-white);
  margin: 0;
  min-height: 1.5em; /* prevents layout shift when message appears */
}

.contact__submit {
  align-self: flex-start;
}
```

**Design ban checklist for these rules:**
- No `box-shadow` on inputs (card shadows banned).
- No `font-weight: 500`.
- No gradient on inputs or form.
- `background: var(--color-true-white)` on inputs — white on Deep Teal, not a mid-tone grey.
- Focus rings use `var(--color-true-white)` outline — matches the `.btn--on-teal:focus-visible` ring in components.css line 122.

---

### CLAUDE.md — contact rule update

**Analog:** `CLAUDE.md` lines 1-19 (Project section, Constraints list)

**Current relevant text (line in Constraints):**

The STATE.md line 73 records: `"Email link (mailto:) in V1, no form"` — this must change.

**CLAUDE.md update:** In the Constraints block, find and replace the V1 contact rule. The replacement text:
```
- **Contact:** V1 contact = Formspree contact form at `https://formspree.io/f/xbdbnrkr`. No visible mailto links — form is the single contact route (D-01/D-02 reversal, Jamie review + Kris decision 2026-06-01). Plain HTML + vanilla JS fetch, no SDK.
```

---

### .planning/STATE.md — decision reversal

**Analog:** `.planning/STATE.md` lines 73-74 (Decisions section)

**Current text** (line 73):
```
- Email link (`mailto:`) in V1, no form
```

**Replacement text:**
```
- V1 contact = Formspree form (reversed 2026-06-01: D-01/D-02 in Phase 10 context; mailto removed entirely per D-02)
```

---

## Shared Patterns

### Focus rings — on Deep Teal surface
**Source:** `css/components.css` lines 105-108 and 122-125
**Apply to:** all interactive elements in the contact form (`input`, `textarea`, `button`)
```css
:focus-visible {
  outline: 2px solid var(--color-true-white);
  outline-offset: 4px;
}
```

### Event-listener attachment — no inline handlers
**Source:** `js/main.js` lines 125-128
**Apply to:** form `submit` listener
```js
element.addEventListener('event', () => { /* handler */ });
// Never: <form onsubmit="...">
```

### IIFE module pattern
**Source:** `js/main.js` lines 25-26
**Apply to:** new `initContactForm` function in `js/main.js`
```js
(function initContactForm() {
  const el = document.querySelector('#contact-form');
  if (!el) return;
  // ...
})();
```

### prefers-reduced-motion guard
**Source:** `js/main.js` lines 187-190 and `css/animations.css` (motion-strip media query)
**Apply to:** any CSS transition on `.contact__status` appearance
```js
// In JS: check before applying transition class
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```
```css
/* In CSS: strip transitions under reduced motion */
@media (prefers-reduced-motion: reduce) {
  .contact__status {
    transition: none;
  }
}
```

### Epilogue 400/700 only
**Source:** `css/tokens.css` line 44; `CLAUDE.md` Typography constraint
**Apply to:** all new CSS rules
- Labels: `font-weight: 700`
- Input text and body copy: `font-weight: 400`
- Never `font-weight: 500`

---

## No Analog Found

| File/Construct | Role | Data Flow | Reason |
|---|---|---|---|
| Formspree fetch handler | utility | request-response | No async fetch / form submission exists anywhere in the codebase yet |
| `aria-live` status region | markup | event-driven | No existing live regions in the project |
| Honeypot field | markup (spam) | — | No existing spam protection constructs |

For these, use the Formspree AJAX docs pattern (referenced in CONTEXT.md canonical refs) combined with the IIFE + event-listener conventions above.

---

## Metadata

**Analog search scope:** `index.html`, `js/main.js`, `css/components.css`, `css/tokens.css`, `CLAUDE.md`, `.planning/STATE.md`
**Files scanned:** 6
**Pattern extraction date:** 2026-06-01
