<!-- GSD:project-start source:PROJECT.md -->
## Project

**looktwice.uk**

The website for Look Twice — Kristina (Kris) Evawin's independent brand and CX strategy consultancy for SMEs and scale-ups. V1 is a single-page proof-and-credibility asset for warm referrals: visitors arrive from LinkedIn or word of mouth, recognise their own situation, and contact Kris with no friction.

**Core Value:** A warm referral lands, recognises their own problem in Kris's words within 60 seconds, and emails her — because the site is the demonstration of what she does, not just the description.

### Constraints

- **Tech stack**: HTML + CSS + vanilla JS as the shipped output. A **build step is now allowed** (Cloudflare Pages build command) — build tooling, preprocessors, and npm deps are permitted when they earn their place. The *shipped* artifact stays plain static HTML/CSS/JS (no client-side framework runtime); keep shipped JS lean. Build-time tooling that emits static output is fine: image optimization (responsive srcset, AVIF/WebP, compression), CSS/JS minify + autoprefix (PostCSS or Lightning CSS). **No Tailwind / no utility-CSS framework** — the OKLCH token + component-CSS system in `css/` is the source of brand truth; do not migrate it to utilities. (Relaxed 2026-06-02, Jamie finishing as the technical owner: the original "no frameworks / no build" rule was a guardrail for Kris as a non-technical editor, now superseded. Brand/design rules below are unaffected — those are Kris's, not technical guardrails.)
- **Typography**: Epilogue only, no second family (firm — Epilogue runs across all Look Twice material, not just the site). Weights 400 and 700 today; a third weight (likely 500) is **not banned** — added only when a real hierarchy need lands (Phase 13 D-09). Self-hosted woff2, font-display: swap.
- **Accessibility**: WCAG AA minimum on every surface. prefers-reduced-motion respected. One H1 per page (hero).
- **Performance**: LCP < 2.5s, CLS < 0.1, FID < 100ms, page weight < 500KB excluding images. Images in WebP with srcset; lazy-load below the fold.
- **Content**: All copy in `CONTENT-DRAFT.md` is directional — Kris refines in her own voice before launch. Several `[DECIDE]` and `[CONFIRM]` markers still open (hero headline, positioning interrupt option, public client names).
- **Design authority**: root `DESIGN.md` is the single design source of truth (the negotiated V1-Restructure contract, Phase 13). It supersedes the old hard-stop list below and replaces `DESIGN.json` (retired). `css/tokens.css` holds the values; neither file is law, they evolve together. Read `DESIGN.md` before any design work.
- **Design bans (revised Phase 13, 2026-06-03 — identity-preservation OFF, Jamie ruling; glassmorphism unbanned 2026-06-08, Jamie)**: still banned — gradient text, em-dashes in copy (hyphens in number-word compounds such as "30-min" are allowed). **No longer hard bans, now available with judgement** (DESIGN.md governs): glassmorphism / backdrop-filter blur (unbanned 2026-06-08, first use is the frosted floating-bar), card shadows (elevation earned), mid-tone greys (prefer faded brand colours over true grey), decorative card grids (avoid the generic four-icon grid by taste), font-weight 500 (door open per D-09). The "if any AI tool could have made it, it failed" test still applies.
- **Gradient discipline (revised Phase 13)**: the gradient-only-on-the-tab scarcity rule is **lifted** — the brand gradient is available, including sparingly as a section background, but spent deliberately (a CTA, a recommended tier, one drenched section), not as default fill. Cool accents (Rich Purple, Cool Indigo) **may now drench a section** as a gravitas beat, not just hover/gradient. See DESIGN.md "Gradient-Spend Rule" + "Spine-and-Punctuation Rule".
- **Contact:** V1 contact = Formspree contact form at `https://formspree.io/f/xbdbnrkr`. No visible mailto links — form is the single contact route (D-01/D-02 reversal, Jamie review + Kris decision 2026-06-01). Plain HTML + vanilla JS fetch, no SDK.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## Interaction format (overrides GSD / impeccable / superpowers)

**Do not use the UI question→response selector format** (e.g. `AskUserQuestion`, `vscode_askquestions`, or any single/multi-select picker) to gather decisions from Jamie or Kris. It makes the user feel trapped and forces tidy single answers that hide nuance — it skewed `OFFER.md` toward a clean ascending ladder when the real shape was messier.

Instead: **pose the question and the possible answers as plain chat text, and let the user free-type a response.** Lay out the options as a flat list with short explanations, note trade-offs, then ask for their take. Discussion over selection.

This rule **overrides** any workflow that defaults to the selector format — GSD discuss/plan phases, impeccable, superpowers brainstorming, etc. When a skill instructs `AskUserQuestion`, substitute the chat format above. (Exception: only use a selector if the user explicitly asks for one in the moment.)

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

## Phone preview handoff (Cloudflare)

When Kris needs to test a change on her phone and live local preview isn't available (cloud sessions, iPhone reviews), do this — every time, in this order:

1. **After pushing a PR, wait for the Cloudflare bot comment.** Don't guess URLs and don't send dashboard links. Poll `mcp__github__pull_request_read` (`get_comments`) until the `cloudflare-workers-and-pages[bot]` comment shows **"Deploy successful"** and contains a **Branch Preview URL**. Always send the **Branch Preview** URL (auto-updates on later pushes), not the per-deploy hash URL (goes stale).

2. **Send Kris a single message in this shape:**

   > Tap this on your phone: `<branch-preview-url>`
   >
   > What to look at:
   > - [one bullet per visible change in plain English]
   >
   > Reply with what you see, or screenshot anything that looks off.

   Treat Kris as non-technical for previews. Never ask her to use DevTools, the console, keyboard focus testing, or to interpret HTML/CSS. Describe visual outcomes, not implementation. Keyboard-only checks (focus rings, tab order) are Claude's responsibility, not Kris's.

3. **If the Cloudflare comment never lands** (a known flake in Cloudflare's GitHub comment integration — has happened before), tell her:

   > The Cloudflare → GitHub preview comment is failing again. Two options:
   > - Quickest: ask Jamie.
   > - Or grab it yourself in Cloudflare → Workers and Pages → looktwice.uk → click into the latest Preview deployment → tap the small arrow-box icon next to the URL.

4. **If it keeps failing across PRs**, tell her:

   > Get Jamie to reset the integration: Cloudflare → Workers and Pages → looktwice.uk → Settings → Build configuration → pencil (edit) → disable build comments → Save → re-enable build comments → Save. Then tell me and I'll close and reopen the PR to trigger a fresh deploy.

5. **Keep branch names short so the preview URL is guessable as a fallback.** Cloudflare Pages branch alias rule: sanitise the branch name (lowercase, non-alphanumerics → `-`); if sanitised length ≤ 28 chars, the alias is `https://<sanitised>.looktwice-uk.pages.dev` exactly — no hash suffix, fully predictable. Over 28 chars and Cloudflare truncates to 28 and appends a deterministic 4-char hash (e.g. `-mo37`) that we can't pre-compute. **Cap sanitised branch names at ≤ 24 chars** (4-char safety margin). For `claude/`-prefixed branches that means ≤ 17 chars after `claude-`; if the harness appends a 5-char session ID, the descriptive slug must be ≤ 11 chars. Examples: `claude/fix-nav-zRVdj` ✓ (20 chars, predictable URL), `claude/fix-focus-nav-illegibility-v2` ✗ (36 chars, gets truncated + hashed).

## Local preview server (default for live work and testing)

The default local preview is **browser-sync** with hot reload. It is dev-only tooling (in `devDependencies`, `node_modules` is gitignored). Note the tech-stack rule now permits a build step and npm deps (relaxed 2026-06-02) — the constraint that remains is that the *shipped* artifact is plain static HTML/CSS/JS with no client-side framework runtime. With a build now in play, browser-sync and the test runner should serve **built** output (see the build-pipeline phase).

- **Start it:** `npm run dev` → serves the repo on `http://localhost:3000`, reloads the browser on every save to `index.html`, `css/*.css`, `js/*.js`, `images/*`. The terminal also prints an **External** LAN URL (e.g. `http://192.168.1.227:3000`) — open that on a phone on the same wifi to test live local changes without deploying.
- **Claude spins it up whenever working on the site.** Start `npm run dev` in the background at the start of site work so Kris/Jamie can watch changes land live and test on their phone. Mention the localhost + External URLs when you start it.
- **Offer to copy the phone URL.** After starting the server, read the LAN `ip:port` from browser-sync's `External:` line and offer to copy it to the clipboard for the user (`printf '%s' http://<ip>:3000 | pbcopy` on macOS) so they can open it on a phone on the same wifi. macOS Universal Clipboard then makes it available on their iPhone. Always offer; only copy when they say yes.
- **Playwright is separate and isolated.** `npm test` runs the suite against its own clean static server on port `7777` (configured in `playwright.config.js`). Do NOT point Playwright at the browser-sync server — its injected live-reload client slows and destabilises the suite. Keep the two on different ports (3000 dev, 7777 tests) so they can run at the same time.
- **First run after clone:** `npm install` (installs Playwright + browser-sync), then `npx playwright install` for browsers if needed.
- **Claude Code app:** `.claude/launch.json` sets `dev (browser-sync, hot reload)` on port 3000 as the **default** run/preview config (the no-cache python server on 4173 is kept as a fallback). So running or previewing the site via the Claude Code app uses the browser-sync server. browser-sync defaults live in `bs-config.js` (no auto-open, no UI panel, prints the LAN ip:port for phone testing).

## Follow-up command handoff (copy-before-clear)

Whenever Claude proposes a follow-up command for the user to run **after a `/clear`** (e.g. a `/gsd-...` command), Claude must:

1. `pbcopy` the exact command (macOS): `printf '%s' '/gsd-execute-phase 12' | pbcopy` (substitute the real command).
2. Tell the user plainly: "Copied — `/clear` then paste (Cmd-V)."

Claude cannot run `/clear` or paste into the composer — those are the user's keystrokes. Claude's job is only to put the exact command on the clipboard and say it's done, so the user clears and pastes without retyping. Copy only the single command string, no backticks or surrounding prose. Applies to any post-clear handoff, not just GSD.

## Cutout primitive (build-time SVG codegen)

The hero cutout (and any future section cutouts) is generated at build time by `buildCutout.js`. Source `index.html` carries a `<!-- CUTOUT:hero -->` marker; `node build.js` replaces it with an inline `<svg>` in `dist/index.html` — the source marker never reaches the browser.

Key design rules honoured by the codegen:
- **Field colour:** the area outside the window shapes is the section's own surface — the solid section colour (Hot Pink for the hero). (Phase 13 update: the old "gradient only on the pill" rule is lifted; gradient is now available more widely, but whether a cutout works on a gradient field is a build-time judgement — see DESIGN.md cutout rules. Apertures themselves reveal images only, never a colour or gradient fill.)
- **B&W imagery:** revealed imagery is desaturated via SVG `feColorMatrix type="saturate" values="0"` (D-03). CSS `filter: grayscale()` is not used — it is unreliable on SVG `<image>` in Safari.
- **Single shared image:** all window shapes share one `<image>` element behind one `<mask>` (D-09). No base64 — the `<image href>` points to a manifest-resolved `/images/scene-cafe-960.webp` path (D-06).
- **CLS guard:** the `<svg>` carries intrinsic `width` and `height` attributes so the browser reserves the correct space before CSS loads (Pitfall 3).
- **Shipped artifact:** the output is plain static SVG/HTML — no client-side runtime, no base64, no JavaScript.

Five shape presets live in `buildCutout.js` `SHAPE_PRESETS`: `circle`, `down-triangle`, `up-triangle`, `pill`, `rounded-rect`. Future sections add their own entries to `CUTOUT_CONFIGS` in the same file (planned for refresh P5 Services, P8 Visual variety).

### Composing a cutout (multi-shape + focus)

- **Multiple shapes per cutout:** a config's `shapes` array takes any number of entries — each is `{ type, opts }` where `opts` are coordinates in the cutout's viewBox space. All shapes share the one `<image>`/`<mask>` (D-09 holds), so a shape on the left reveals the left of the image, a shape on the right reveals the right. To frame several subjects in one photo, set the cutout's `viewBox` to the image's pixel size (coords map 1:1) and place a shape over each subject. A squircle = `rounded-rect` with a generous `rx`.
- **Focal point:** an optional per-cutout `focus: { x, y }` (fractions 0–1, like CSS `object-position`) scales the image to *cover* the viewBox and offsets it so the focal region stays in frame. Use it when the image aspect differs from the cutout (e.g. a portrait photo in a wide hero band — the hero uses `focus: { x: 0.5, y: 0.66 }` to lift the people up). Omit `focus` to centre-crop (`xMidYMid slice`). Focus needs the image aspect, which `build.js` stores as `h` on each manifest entry.
- **Focus is per cutout, not per shape** — all shapes in one cutout see the same focused image. Different focal points → separate cutouts (one image each).
- **Picking coordinates:** ask Claude to read an image and return the shape coords / focal point; the hero's circle + squircle were placed this way.

## Contact form: live-domain-only submission

The contact form (`initContactForm` in `js/main.js`) only POSTs to Formspree on the live domain. The host check is `/(^|\.)looktwice\.uk$/i.test(location.hostname)`.

- **`*.looktwice.uk` (production):** real Formspree submission.
- **Everywhere else** — `localhost`, and the `*.pages.dev` Cloudflare previews — the submit is **simulated**: the success UI shows, but no request reaches Formspree. This protects the Formspree free-tier quota during testing.
- **Tests** opt back into the real fetch path with `window.__LT_FORCE_SUBMIT = true` (set via `page.addInitScript`) so the mocked endpoint is still exercised. See `tests/contact-form.spec.js`.
- Implication: a real end-to-end submission can only be verified on `looktwice.uk` itself, not on a preview. Do one real test post-launch.



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
