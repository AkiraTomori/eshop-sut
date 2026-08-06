---
name: playwright-setup
description: "Initialize or repair the shared HW04 Playwright infrastructure, including three browser projects, reusable auth state, test-scoped fixtures, BasePage-derived page objects, data-driven environment configuration, and separate per-FR/per-browser HTML reports showing the student ID. Use once before FR automation or when infrastructure changes."
---

# Set up HW04 Playwright once

Obey `AGENTS.md`. Invoke `playwright-core` and `playwright-ci` as supporting skills for this gate. Read:

- `../playwright/core/configuration.md`
- `../playwright/core/authentication.md`
- `../playwright/ci/projects-and-dependencies.md`
- `../playwright/ci/reporting-and-artifacts.md`
- `../playwright/ci/global-setup-teardown.md`

Do not load a CI-provider guide unless the user requested that provider. Record the supporting skills and guides in this invocation's audit block.

## Required outputs

Maintain these shared files:

```text
23127379_Homework/HW4/package.json
23127379_Homework/HW4/playwright.config.ts
23127379_Homework/HW4/global-setup.ts
23127379_Homework/HW4/global-teardown.ts
23127379_Homework/HW4/test-environment.json
23127379_Homework/HW4/scripts/run-feature.mjs
23127379_Homework/HW4/tsconfig.json
23127379_Homework/HW4/fixtures/eshop.fixture.ts
23127379_Homework/HW4/pages/base.page.ts
23127379_Homework/HW4/pages/product-detail.page.ts
23127379_Homework/HW4/pages/checkout.page.ts
23127379_Homework/HW4/pages/product-management.page.ts
```

## Configuration requirements

- Use the installed Playwright version consistently; do not claim `latest` while pinning an unrelated old version.
- Support Node versions required by that installed Playwright release.
- Declare Chromium, Firefox, and WebKit projects.
- Configure a three-entry Playwright `webServer` array for Backend, Frontend Web, and Web Admin. Load readiness URLs/ports from `test-environment.json`, use explicit service working directories, reuse already-running services locally, wait for all services before setup/tests, and shut down only processes Playwright created.
- Treat the Backend web server as SUT infrastructure only; it does not authorize API testing, endpoint assertions, or API-based setup/cleanup.
- Set HTML report title to `EShop HW04 Automation — Run by: 23127379`.
- Keep retries CI-only, use web-first timeouts, and retain failure screenshot/trace/video.
- Load URLs, accounts, and auth-state paths from `test-environment.json`; do not hardcode them in setup code.
- Save user/admin storage states in global setup.
- Require authenticated tests to request `userPage`, `adminPage`, or the corresponding typed page-object fixture; unauthenticated tests use the default isolated `page`.
- Never state that storage state is reused unless the generated specs/config actually load it.
- Export the shared `test` and `expect` from `fixtures/eshop.fixture.ts`.
- Keep `userPage` and `adminPage` test-scoped: create a fresh context from saved storage state, call `await use(page)`, and close the context in `finally`.
- Do not create request/API fixtures or API-backed seeded-resource fixtures.
- Require all FR page objects to extend `pages/base.page.ts`; keep URLs/routes in `test-environment.json`.

## Report runner

`scripts/run-feature.mjs FR06|FR08|FR15` must run browsers sequentially and write:

```text
Pool-[X]_FR##/playwright-report/chromium/index.html
Pool-[X]_FR##/playwright-report/firefox/index.html
Pool-[X]_FR##/playwright-report/webkit/index.html
Pool-[X]_FR##/playwright-report/index.html
```

Keep each run's JSON/test artefacts in a browser-specific path so runs cannot overwrite one another.

After all three attempts, the runner must create or update:

```text
Pool-[X]_FR##/fr##-run-summary.md
```

Each runner invocation adds exactly one cumulative session with timestamp, per-browser process status, JSON-derived passed/failed/flaky/skipped/total counts, duration, and report/result links. Record missing JSON as `N/A` rather than reusing stale results. Generate the root `playwright-report/index.html` overview with latest-run statistics and links to all three isolated reports. Include the full-FR `npx playwright show-report <pool>/playwright-report` command and browser-specific variants in the summary. Setup, `--list`, and opening a report do not increment the count.

## Setup gate

Validate:

```text
npm install
npx playwright install
npx playwright --version
npx tsc --noEmit
npx playwright test --list
```

`--list` may report no tests before the first FR is generated; config/type errors must still be absent. Verify the report title through generated report metadata after the first real run.

After setup completes, invoke `ai-audit-logger` once and append to `Infrastructure-AI-Audit.md`. Do not rerun this skill for each FR unless infrastructure changed.
