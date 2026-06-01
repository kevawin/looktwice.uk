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
    // python3 -m http.server: serves the repo root as static files on the given port.
    // stdout/stderr from python go to the Playwright log.
    command: 'python3 -m http.server 7777',
    port: 7777,
    reuseExistingServer: true,
    timeout: 15_000,
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
