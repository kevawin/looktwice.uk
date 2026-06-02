// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for looktwice.uk nav + floating bar QA suite.
 * Dev-only: never shipped to the site. node_modules/ is gitignored.
 *
 * Static server: python3 -m http.server (zero extra npm dep, already on macOS/darwin).
 * Port: 7777 (arbitrary fixed port, unlikely to conflict).
 * Three viewport projects: mobile 375, tablet 768, desktop 1440.
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  reporter: [['line']],

  use: {
    baseURL: 'http://localhost:7777',
    trace: 'off',
  },

  webServer: {
    // Build dist/ first, then serve it on 7777 (BUILD-06).
    // First build includes image encode — raise timeout to 60s to avoid flaky CI.
    // Do NOT reuse the browser-sync dev server on 3000 — its injected reload client
    // destabilises the suite (CLAUDE.md hard rule: dev 3000, tests 7777).
    command: 'npm run build && python3 -m http.server 7777 --directory dist',
    port: 7777,
    reuseExistingServer: true,
    timeout: 60_000,
  },

  projects: [
    {
      name: 'mobile-375',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: 'tablet-768',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'desktop-1440',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
