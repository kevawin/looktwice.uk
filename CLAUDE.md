<!-- GSD:project-start source:PROJECT.md -->
## Project

**looktwice.uk**

The website for Look Twice — Kristina (Kris) Evawin's independent brand and CX strategy consultancy for SMEs and scale-ups. V1 is a single-page proof-and-credibility asset for warm referrals: visitors arrive from LinkedIn or word of mouth, recognise their own situation, and contact Kris with no friction.

**Core Value:** A warm referral lands, recognises their own problem in Kris's words within 60 seconds, and emails her — because the site is the demonstration of what she does, not just the description.

### Constraints

- **Tech stack**: Plain HTML + CSS + minimal vanilla JS — no frameworks, no preprocessors, no bundlers, no npm deps for V1.
- **Typography**: Epilogue only, weights 400 and 700. No 500. No second family. Google Fonts (or self-hosted woff2) with font-display: swap.
- **Accessibility**: WCAG AA minimum on every surface. prefers-reduced-motion respected. One H1 per page (hero).
- **Performance**: LCP < 2.5s, CLS < 0.1, FID < 100ms, page weight < 500KB excluding images. Images in WebP with srcset; lazy-load below the fold.
- **Content**: All copy in `CONTENT-DRAFT.md` is directional — Kris refines in her own voice before launch. Several `[DECIDE]` and `[CONFIRM]` markers still open (hero headline, positioning interrupt option, public client names).
- **Design bans (hard stops)**: no card shadows, no gradient text, no glassmorphism, no mid-tone greys, no decorative card grids, no font-weight 500, no em-dashes in copy (hyphens in number-word compounds such as "30-min" are allowed).
- **Gradient discipline**: brand gradient appears in exactly one place — the floating sticky tab. Cool accents (Rich Purple, Cool Indigo) are hover/gradient only, never section backgrounds.
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

The default local preview is **browser-sync** with hot reload. It is dev-only tooling (in `devDependencies`, `node_modules` is gitignored, nothing ships to the site — this does not break the "no npm deps for V1" rule, which is about the shipped site).

- **Start it:** `npm run dev` → serves the repo on `http://localhost:3000`, reloads the browser on every save to `index.html`, `css/*.css`, `js/*.js`, `images/*`. The terminal also prints an **External** LAN URL (e.g. `http://192.168.1.227:3000`) — open that on a phone on the same wifi to test live local changes without deploying.
- **Claude spins it up whenever working on the site.** Start `npm run dev` in the background at the start of site work so Kris/Jamie can watch changes land live and test on their phone. Mention the localhost + External URLs when you start it.
- **Playwright is separate and isolated.** `npm test` runs the suite against its own clean static server on port `7777` (configured in `playwright.config.js`). Do NOT point Playwright at the browser-sync server — its injected live-reload client slows and destabilises the suite. Keep the two on different ports (3000 dev, 7777 tests) so they can run at the same time.
- **First run after clone:** `npm install` (installs Playwright + browser-sync), then `npx playwright install` for browsers if needed.

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
