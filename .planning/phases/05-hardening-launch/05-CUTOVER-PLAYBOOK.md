# Phase 5 — Cutover Playbook

**Status:** ready to run when pre-flight checklist clears
**Trigger:** Kris (manual)
**Decision basis:** OPEN-DECISIONS Q7 → Option A (merge `claude/new-site-QGsb8` → `main`)

---

## What cutover means

Right now:
- `looktwice.uk` (production) serves the **holding page** — DM Sans + Syne + warm gradient — from the `main` branch.
- `https://claude-new-site-qgsb8.looktwice-uk.pages.dev` (preview) serves **V1** from `claude/new-site-QGsb8`.

After cutover:
- `looktwice.uk` serves V1.
- `main` history contains the V1 commits on top of the holding page commits (preserved, not overwritten).
- Preview branch can be deleted or kept around for V1.1 work.

---

## Pre-flight checklist (do these BEFORE running the merge)

Every line must be ✅ before kicking off the merge.

### Content + design sign-off

- [ ] Hero headline copy reviewed on preview (Q1: Option A locked).
- [ ] Interrupt + "Dig. Reveal. Sharpen." copy reviewed on preview (Q2 + Q3 locked).
- [ ] Work paragraph reviewed (Q4 locked, name-free version).
- [ ] Sticky tab pill renders correctly on phone + desktop (Q6 locked).
- [ ] All five Phase 2 HUMAN-UAT items previously open are now ✅ (hero paint, reveal feel, reduced-motion, focus rings, responsive 1440 → 375).

### A11Y + PERF + SEO checks

- [ ] Lighthouse run via PageSpeed Insights — result link captured in `05-VERIFICATION.md` — LCP < 2.5s, CLS < 0.1, FID < 100ms.
- [ ] If Lighthouse flagged the kris-portrait LCP, remediation has shipped (lower-quality export OR AVIF source OR srcset).
- [ ] Tab-walk confirmed visible focus ring on every interactive element.
- [ ] `prefers-reduced-motion: reduce` confirmed: reveals fade opacity-only, sticky tab fades-not-slides, smooth-scroll disabled.
- [ ] WCAG contrast measured (Chrome DevTools contrast picker or WebAIM) on Hot Pink hero, Signal Orange interrupt, Deep Teal contact. Service / situation numbers re-measured against the marginal ~4.2:1 estimate.
- [ ] JSON-LD validates at https://validator.schema.org/ — warnings on missing `address` / `telephone` accepted; no errors.

### Asset readiness

- [ ] og:image asset (`/images/og-share-1200x630.jpg`) exported and committed, OR meta tag accepts the placeholder gracefully on launch (LinkedIn / Twitter render the preview without image).
- [ ] Final favicon is in place, OR placeholder accepted.
- [ ] Hero supporting image — either the asset has landed (and `alt` text refined) or the Midnight fallback is acceptable for V1.

### Branch hygiene

- [ ] Current branch is `claude/new-site-QGsb8` and is up-to-date with `origin`.
- [ ] PR #6 (or successor) is open against `main` with the full Phase 1-5 changeset.
- [ ] PR description includes a link to this playbook.
- [ ] Cloudflare Pages preview on PR #6 shows the latest commit deployed and identical to local.

---

## The cutover (when checklist clears)

Run these in order. Each step is reversible up to the merge.

### 1. Final preview check

Open the preview URL on phone + desktop. Smoke test:
- Anchor links from nav (WORK / APPROACH / CONTACT) scroll to correct sections.
- Hero CTAs (BOOK A SESSION / SEE THE WORK) scroll to `#contact` / `#work`.
- Work + Services CTAs scroll to `#contact`.
- Sticky tab anchors to `#contact`.
- Contact CTA opens mail client with `mailto:hello@looktwice.uk`.
- Footer LinkedIn link opens new tab.
- Footer mailto opens mail client.

### 2. Merge PR

Two ways:

**Via GitHub UI (preferred):**
1. Open PR #6.
2. Confirm "All checks have passed" (Cloudflare Pages build green).
3. Click **Merge pull request** → **Confirm merge**.
4. Use a merge commit (not squash) — preserves Phase 1–5 commit history for future reference.

**Via CLI (if you prefer):**
```bash
git checkout main
git pull origin main
git merge --no-ff claude/new-site-QGsb8 -m "merge: Phase 1-5 V1 site"
git push origin main
```

### 3. Verify production deploy

- Cloudflare Pages dashboard → looktwice-uk → Deployments → latest "Production" deploy on `main`.
- Wait for status: "Success" (~30 seconds).
- Open `https://looktwice.uk/` in a fresh tab (or hard-refresh Cmd+Shift+R) — V1 should render.

### 4. Production smoke test

Same as step 1, but on `looktwice.uk` directly. Confirm:
- Page loads under 3 seconds.
- No console errors (DevTools → Console).
- DNS / TLS clean (no mixed content, no certificate warnings).
- Anchor scrolling works.
- Mailto CTA opens mail client.

### 5. Optional — final cleanups

- Delete the working branch on GitHub (`claude/new-site-QGsb8`) — the merge commit on `main` preserves history.
- Mark PR #6 closed (auto-closes on merge).
- Update STATE.md `status: launched`.

---

## Rollback (if something breaks)

Two paths, fastest first.

### Fast path — Cloudflare per-deploy rollback (~30 seconds)

1. Cloudflare Pages dashboard → looktwice-uk → **Deployments**.
2. Find the previous "Production" deploy on `main` (the holding page).
3. Click **⋯** → **Rollback to this deployment**.
4. Confirm. Cloudflare swaps production to the old deploy in seconds.

This does NOT touch the git repo. The merge commit is still on `main`. Rolling forward again = re-deploy the latest `main` commit from the dashboard.

### Slow path — git revert (~5 minutes)

If Cloudflare rollback isn't an option (e.g. multiple deploys have happened since the merge):

```bash
git checkout main
git pull origin main
git revert --no-edit -m 1 <merge-commit-sha>
git push origin main
```

Cloudflare auto-deploys the revert. Holding page returns within ~30 seconds.

### When to use which

- Just-merged, problem found within minutes → fast path.
- Multiple deploys have stacked on `main` since the cutover → slow path.
- Network / DNS / Cloudflare-side issue (not a code issue) → check Cloudflare status page first; rolling back code won't help.

---

## Post-cutover

### Immediate (day 0)

- Watch site for 24 hours. Any traffic, any errors → look at Cloudflare Pages logs.
- Tell Jamie (or whoever maintains DNS) that `looktwice.uk` now serves V1, not holding.

### Week 1 follow-ups (V1.1 candidates)

These were carryovers from Phase 5 SUMMARY:
- **Public client names** — once NDAs / engagement letters confirmed, single Edit on `.work__body` to re-add "for clients including X, Y, Z."
- **og:image asset** — if not landed pre-cutover, ship it now so social shares look clean.
- **Final favicon** — replace placeholder with brand-final mark.
- **Tighten CSP** — hash the inline JSON-LD, drop `'unsafe-inline'` from `script-src`.
- **Hero supporting image** — when Kris picks the right Unsplash crop, single-file commit lands it.

### Done criteria

V1 is "launched" when:
- `looktwice.uk` serves V1 successfully for ≥ 24 hours.
- No reported issues from warm referrals.
- Lighthouse on production matches preview (or better — production has CDN warm).

---

## Build model (added Phase 12, 2026-06-02)

Phase 12 introduced a build pipeline (`build.js`) that outputs to `dist/`. Cloudflare Pages is
configured to serve `dist/` as the output directory. Because Cloudflare has a single global
build command across all branches, a branch-gate wrapper controls which branch actually builds.

### Cloudflare Pages settings

| Setting | Value |
|---------|-------|
| Build command | `bash build.sh` |
| Output directory | `dist/` |

### How the gate works

`build.sh` reads the `CF_PAGES_BRANCH` environment variable that Cloudflare injects at build time:

- `CF_PAGES_BRANCH = new-site` → runs `npm ci && npm run build`, produces `dist/`.
- Any other branch (including `main`) → prints a no-build message, exits 0, does NOT create or alter `dist/`. Cloudflare then deploys the branch's own repo files as-is.

Supply-chain note: `build.sh` uses `npm ci` (not `npm install`) to enforce the committed `package-lock.json` exactly (T-12-SC mitigation).

### A1 caveat — main no-op behaviour

Cloudflare does **not** explicitly document what it does when the build command exits 0 without producing `dist/` under a single project configured with output directory `dist/`. The assumption (A1) is that Cloudflare falls back to deploying the branch's root files. This was human-verified: a trivial commit was pushed to `main` and the live `looktwice.uk` holding page confirmed unchanged (Task 3, checkpoint:human-verify, Plan 12-03). If that verification reveals main IS affected, see the two-projects fallback below.

### Two-projects fallback

If the single-project `CF_PAGES_BRANCH` gate proves unreliable (main holding page changes or breaks), split into two separate Cloudflare Pages projects:

- **Project A** — watches `main` only. No build command. Output directory = `/` (repo root). Serves the holding page as plain static.
- **Project B** — watches `new-site` only. Build command = `npm ci && npm run build`. Output directory = `dist/`. Serves the built preview.

This is a larger account change (two projects, two Cloudflare custom domains or DNS entries) but removes any ambiguity about cross-branch build behaviour.

### Cutover impact on the gate

When `new-site` is merged into `main` (the V1 cutover), `main` becomes the built branch. At that point:

1. The gate condition in `build.sh` must be updated — change `new-site` to `main` (or remove the gate and always build).
2. Verify the cutover deploy runs `npm run build` and serves `dist/` correctly.
3. The old `new-site` branch can be deleted after cutover.

This is a required step in the cutover procedure — do not merge without updating `build.sh`.

---

*Playbook drafted: 2026-05-02. Build model section added: 2026-06-02. Cutover trigger: Kris.*
