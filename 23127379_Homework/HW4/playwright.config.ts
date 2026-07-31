import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import environment from './test-environment.json';

const htmlOutputFolder =
  process.env.PLAYWRIGHT_HTML_OUTPUT_DIR ?? 'playwright-report';
const resultsOutputFolder = process.env.HW4_RESULTS_DIR ?? 'test-results';
const jsonOutputFile =
  process.env.HW4_JSON_OUTPUT_FILE ?? `${resultsOutputFolder}/results.json`;
const runTimestamp = process.env.HW4_RUN_TIMESTAMP ?? new Date().toISOString();
const repositoryRoot = path.resolve(__dirname, '../..');
const backendUrl = new URL(environment.urls.backend);
const frontendUrl = new URL(environment.urls.frontend);
const adminUrl = new URL(environment.urls.admin);
const reuseExistingServer = !process.env.CI;
const serverTimeout = 120_000;

export default defineConfig({
  testDir: '.',
  testMatch: ['Pool-*/fr*.spec.ts'],
  metadata: {
    runBy: environment.studentId,
    runTimestamp,
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    [
      'html',
      {
        outputFolder: htmlOutputFolder,
        open: 'never',
        title: `EShop HW04 Automation — Run by: ${environment.studentId}`,
      },
    ],
    ['list'],
    ['json', { outputFile: jsonOutputFile }],
  ],
  use: {
    baseURL: environment.urls.frontend,
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: [
    {
      name: 'EShop Backend',
      command: 'node server.js',
      cwd: path.join(repositoryRoot, 'backend'),
      port: Number(backendUrl.port),
      reuseExistingServer,
      timeout: serverTimeout,
      stdout: 'pipe',
      stderr: 'pipe',
      gracefulShutdown: {
        signal: 'SIGTERM',
        timeout: 5_000,
      },
    },
    {
      name: 'EShop Web',
      command: `npm run dev -- --host ${frontendUrl.hostname} --port ${frontendUrl.port} --strictPort`,
      cwd: path.join(repositoryRoot, 'frontend-web'),
      url: environment.urls.frontend,
      reuseExistingServer,
      timeout: serverTimeout,
      stdout: 'pipe',
      stderr: 'pipe',
      gracefulShutdown: {
        signal: 'SIGTERM',
        timeout: 5_000,
      },
    },
    {
      name: 'EShop Web Admin',
      command: `npm run dev -- --host ${adminUrl.hostname} --port ${adminUrl.port} --strictPort`,
      cwd: path.join(repositoryRoot, 'frontend-admin'),
      url: environment.urls.admin,
      reuseExistingServer,
      timeout: serverTimeout,
      stdout: 'pipe',
      stderr: 'pipe',
      gracefulShutdown: {
        signal: 'SIGTERM',
        timeout: 5_000,
      },
    },
  ],
  outputDir: resultsOutputFolder,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
});
