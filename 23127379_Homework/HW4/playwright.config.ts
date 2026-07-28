import { defineConfig, devices } from '@playwright/test';

/**
 * HW04 Playwright Configuration
 * Student: 23127379
 * Features under test: FR-06 (Product Detail), FR-08 (Checkout), FR-15 (Product Management)
 *
 * Anti-AI-Cheat: This config injects "Run by: 23127379" into all HTML reports.
 */
export default defineConfig({
  testDir: '.',
  fullyParallel: false,        // Sequential within each project for SUT stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,                  // Single worker per project to avoid SUT conflicts

  /* Reporter configuration — CRITICAL: must show "Run by: 23127379" */
  reporter: [
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
        // Custom title injected into the HTML report
        title: 'EShop HW04 Automation — Run by: 23127379',
      }
    ],
    ['list'],                   // Console output during run
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    /* Base URLs — never hardcode in spec files */
    baseURL: 'http://localhost:5173',

    /* Browser defaults */
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    /* Timeouts */
    actionTimeout: 10_000,
    navigationTimeout: 30_000,

    /* Tracing — capture on failure for debugging */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Extra HTTP headers to identify test runs */
    extraHTTPHeaders: {
      'X-Test-Runner': '23127379',
    },
  },

  /* Global setup — login and save auth state */
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  /* Multi-browser projects — required by HW04 */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],

  /* Output directory for test artifacts */
  outputDir: 'test-results/',

  /* Timeout for each test */
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
});
