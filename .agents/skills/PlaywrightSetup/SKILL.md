---
name: PlaywrightSetup
description: Sets up a complete Playwright automation project with multi-browser configuration, custom HTML reporter injecting "Run by: 23127379", and all required dependencies for EShop HW04 automation testing.
---

# SKILL: PlaywrightSetup — Playwright Project Initialization

> **Skill:** PlaywrightSetup
> **Phase:** Infrastructure (run ONCE before any FR automation)
> **Input:** None (reads `AGENTS.md` for project constraints)
> **Output files:**
>   - `23127379_Homework/HW4/playwright.config.ts` — Multi-browser Playwright configuration
>   - `23127379_Homework/HW4/package.json` — Project dependencies
>   - `23127379_Homework/HW4/global-setup.ts` — Global setup for auth state caching
>   - `23127379_Homework/HW4/global-teardown.ts` — Global teardown
>   - `23127379_Homework/HW4/tsconfig.json` — TypeScript config
>   - `23127379_Homework/HW4/README.md` — Project README with run instructions
> **Governance:** `AGENTS.md §5.3` (multi-browser), `§5.1` (no hardcoded values), `§8` (quality gate)

---

## Skill Purpose

Initialize the Playwright project with:
1. Three browser projects: Chromium, Firefox, WebKit.
2. HTML reporter that injects **"Run by: 23127379"** into the report title/metadata.
3. Allure reporter for richer output (optional, if Allure CLI is available).
4. Global auth state setup (login once, reuse across tests).
5. Base URL configuration so specs do not hardcode localhost URLs.

---

## Execution Steps

### Step 1 — Confirm Prerequisites (HITL Gate G1)

Before generating any files, confirm with HITL:

```
[CONFIRM BEFORE PROCEEDING]
1. Node.js version: ≥18 is required. Run: node --version
2. Playwright version to install: @playwright/test@latest (or specify version)
3. Reporter preference:
   - Option A: Playwright HTML reporter only (simpler)
   - Option B: Playwright HTML + Allure reporter (richer, requires allure CLI)
4. StudentID for injection: 23127379 (confirm correct)
5. Confirm SUT URLs:
   - Frontend: http://localhost:5173
   - Web Admin: http://localhost:5174
   - Backend API: http://localhost:3000
```

Halt and wait for HITL confirmation before proceeding.

### Step 2 — Generate `package.json`

Create `23127379_Homework/HW4/package.json` with the following content:

```json
{
  "name": "eshop-hw04-automation",
  "version": "1.0.0",
  "description": "HW04 Automation Testing — EShop — Student 23127379",
  "scripts": {
    "test": "npx playwright test",
    "test:chromium": "npx playwright test --project=chromium",
    "test:firefox": "npx playwright test --project=firefox",
    "test:webkit": "npx playwright test --project=webkit",
    "test:fr06": "npx playwright test --grep @FR06",
    "test:fr08": "npx playwright test --grep @FR08",
    "test:fr15": "npx playwright test --grep @FR15",
    "test:all-browsers": "npx playwright test --project=chromium --project=firefox --project=webkit",
    "report": "npx playwright show-report",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "allure-playwright": "^3.0.0",
    "csv-parse": "^5.5.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.0.0"
  },
  "keywords": ["playwright", "automation", "eshop", "hw04"],
  "author": "23127379"
}
```

### Step 3 — Generate `playwright.config.ts`

Create `23127379_Homework/HW4/playwright.config.ts`:

```typescript
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
    // Uncomment if Allure is installed:
    // ['allure-playwright', { detail: true, outputFolder: 'allure-results', suiteTitle: 'EShop HW04 — Run by: 23127379' }],
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
```

### Step 4 — Generate `global-setup.ts`

Create `23127379_Homework/HW4/global-setup.ts` to cache user and admin auth states:

```typescript
import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global Setup — HW04 EShop Automation
 * 
 * Logs in as regular user and admin once, saves auth state to file.
 * Tests reuse these auth states via storageState in playwright.config.ts.
 * This avoids repeated login UI interactions across test runs.
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const adminURL = 'http://localhost:5174';
  
  // Ensure auth directory exists
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();

  // --- Regular User Auth ---
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  
  await userPage.goto(`${baseURL}/login`);
  await userPage.fill('input[type="email"]', 'test@eshop.com');
  await userPage.fill('input[type="password"]', 'Test1234!');
  await userPage.click('button[type="submit"]');
  await userPage.waitForURL(`${baseURL}/`, { timeout: 15_000 });
  await userContext.storageState({ path: path.join(authDir, 'user.json') });
  await userContext.close();

  // --- Admin Auth ---
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  
  await adminPage.goto(`${adminURL}/login`);
  await adminPage.fill('input[type="email"]', 'admin@eshop.com');
  await adminPage.fill('input[type="password"]', 'Admin123!');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForURL(`${adminURL}/`, { timeout: 15_000 });
  await adminContext.storageState({ path: path.join(authDir, 'admin.json') });
  await adminContext.close();

  await browser.close();
  
  console.log('✅ Global setup complete. Auth states saved for user and admin.');
}

export default globalSetup;
```

### Step 5 — Generate `global-teardown.ts`

Create `23127379_Homework/HW4/global-teardown.ts`:

```typescript
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global Teardown — HW04 EShop Automation
 * Cleans up auth state files after all tests complete.
 */
async function globalTeardown() {
  const authDir = path.join(__dirname, '.auth');
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
  }
  console.log('✅ Global teardown complete. Auth state files cleaned.');
}

export default globalTeardown;
```

### Step 6 — Generate `tsconfig.json`

Create `23127379_Homework/HW4/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": ".",
    "types": ["node", "@playwright/test"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "playwright-report", "allure-results", "test-results"]
}
```

### Step 7 — Verify Installation Commands

Provide HITL with the exact commands to run:

```bash
# Navigate to HW4 directory
cd 23127379_Homework/HW4

# Install dependencies
npm install

# Install browser binaries
npx playwright install

# Verify installation
npx playwright --version

# Run a smoke test (single browser)
npx playwright test --project=chromium --list
```

### Step 8 — Self-Audit Before Presenting

```
□ playwright.config.ts declares projects: chromium, firefox, webkit
□ reporter config includes 'html' with title containing "Run by: 23127379"
□ baseURL is set (http://localhost:5173) — no hardcoded URLs in specs
□ globalSetup logs in and saves auth state
□ timeout, actionTimeout, navigationTimeout are all configured
□ screenshot: 'only-on-failure' is set for debugging failed tests
□ trace: 'retain-on-failure' is set
□ workers: 1 to avoid SUT conflicts
□ package.json scripts cover per-browser and per-FR runs
```

---

## Output Block Template

After completing this skill, present to HITL:

```
[PlaywrightSetup Complete]
- 23127379_Homework/HW4/playwright.config.ts: ✅ Generated
- 23127379_Homework/HW4/package.json: ✅ Generated
- 23127379_Homework/HW4/global-setup.ts: ✅ Generated
- 23127379_Homework/HW4/global-teardown.ts: ✅ Generated
- 23127379_Homework/HW4/tsconfig.json: ✅ Generated

Next steps for HITL:
1. cd 23127379_Homework/HW4 && npm install
2. npx playwright install
3. Start the EShop SUT (frontend + backend + web admin)
4. Run: npx playwright test --project=chromium --list  (verify discovery)
5. Confirm Gate G1 cleared → proceed to AutomationScriptGen for FR-06
```

---

## HITL Action After This Skill

1. Run `npm install` and `npx playwright install`.
2. Start the SUT (EShop backend, frontend, web admin).
3. Run a smoke discovery: `npx playwright test --list`.
4. Confirm no config errors.
5. Commit: `git commit -m "feat(infra): add Playwright config with multi-browser and custom reporter"`

---

## Known Issues & Mitigations

| Issue | Mitigation |
|-------|-----------|
| `storageState` login fails if SUT is not running | Document in error message; HITL must start SUT first |
| Firefox/WebKit may need extra timeout on slow machines | Increase `navigationTimeout` to `60_000` if needed |
| HTML reporter `title` option may not be supported in older Playwright versions | Fall back to custom reporter in `/reporters/` directory |
| Allure reporter requires separate CLI install | Make optional; document install command |
