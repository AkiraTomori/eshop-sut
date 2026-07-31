# HW04 — EShop Automation Testing

> **Student:** 23127379  
> **Framework:** Playwright (TypeScript)  
> **Browsers:** Chromium · Firefox · WebKit

---

## Project Structure

```
HW4/
├── playwright.config.ts        # Multi-browser Playwright config (Run by: 23127379)
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── global-setup.ts             # Auth state caching (user + admin login)
├── global-teardown.ts          # Auth state cleanup
├── test-environment.json       # Shared URLs, accounts, auth-state paths
├── scripts/run-feature.mjs     # 3 browser runs + cumulative Markdown summary
├── Infrastructure-AI-Audit.md  # Setup/workflow AI audit
│
├── fixtures/
│   └── eshop.fixture.ts        # Test-scoped auth pages + typed page objects
├── pages/
│   ├── base.page.ts            # Shared navigation/base Page contract
│   ├── product-detail.page.ts  # FR-06 UI actions and locators
│   ├── checkout.page.ts        # FR-08 UI actions and locators
│   └── product-management.page.ts # FR-15 UI actions and locators
│
├── Pool-A_FR06/                # FR-06: Product Detail View
│   ├── fr06.spec.ts
│   ├── fr06-test-data.json
│   ├── fr06-automation-review.md
│   ├── fr06-run-summary.md     # Run count, results, report commands
│   ├── FR06-AI-Audit.md
│   └── playwright-report/
│       ├── chromium/
│       ├── firefox/
│       └── webkit/
│
├── Pool-B_FR08/                # FR-08: Checkout
│   ├── fr08.spec.ts
│   ├── fr08-test-data.json
│   ├── fr08-automation-review.md
│   ├── fr08-run-summary.md
│   ├── FR08-AI-Audit.md
│   └── playwright-report/
│
├── Pool-C_FR15/                # FR-15: Product Management (CRUD)
│   ├── fr15.spec.ts
│   ├── fr15-test-data.json
│   ├── fr15-automation-review.md
│   ├── fr15-run-summary.md
│   ├── FR15-AI-Audit.md
│   └── playwright-report/
│
├── main_report.md              # Final summary report
├── bug_report.md               # All automation-discovered bugs
└── ai_critique.md              # AI tool critique (200–300 words)
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 20 (currently using v26)
- EShop SUT running:
  - Frontend: http://localhost:5173
  - Web Admin: http://localhost:5174
  - Backend API: http://localhost:3000

### Install Dependencies

```bash
cd 23127379_Homework/HW4
npm install
npx playwright install
```

### Run Tests

```bash
# Complete one feature on Chromium, Firefox and WebKit.
# Each browser writes to its own report directory.
npm run test:fr06
npm run test:fr08
npm run test:fr15

# Each command above adds exactly one session to the FR's
# fr##-run-summary.md after all three browser attempts finish.
```

### Open an FR report

Use `playwright show-report <report-directory>` from `23127379_Homework/HW4`. Open one report server at a time and stop it with `Ctrl+C`.

```bash
# Full FR overview (Chromium + Firefox + WebKit)
npm run report:fr06:all
npm run report:fr08:all
npm run report:fr15:all

# FR-06
npx playwright show-report Pool-A_FR06/playwright-report/chromium
npx playwright show-report Pool-A_FR06/playwright-report/firefox
npx playwright show-report Pool-A_FR06/playwright-report/webkit

# FR-08
npx playwright show-report Pool-B_FR08/playwright-report/chromium
npx playwright show-report Pool-B_FR08/playwright-report/firefox
npx playwright show-report Pool-B_FR08/playwright-report/webkit

# FR-15
npx playwright show-report Pool-C_FR15/playwright-report/chromium
npx playwright show-report Pool-C_FR15/playwright-report/firefox
npx playwright show-report Pool-C_FR15/playwright-report/webkit
```

The full-report command opens a generated overview page with latest-run statistics and links to all three detailed browser reports. Its direct Playwright form is `npx playwright show-report Pool-A_FR06/playwright-report`, replacing the pool for FR-08 or FR-15.

The single-browser npm shortcuts follow the pattern `npm run report:fr06:chromium`, replacing the FR and browser as needed. If the default port is busy, append `-- --port <number>` to an npm command, or `--port <number>` to the direct Playwright command.

---

## Test Summary

| Pool | FR | Tests | Chromium | Firefox | WebKit |
|------|----|-------|----------|---------|--------|
| A | FR-06 Product Detail | TBD | ⬜ | ⬜ | ⬜ |
| B | FR-08 Checkout | TBD | ⬜ | ⬜ | ⬜ |
| C | FR-15 Product Mgmt | TBD | ⬜ | ⬜ | ⬜ |

---

## Self-Assessment

| Criterion | Score |
|-----------|-------|
| Data-driven testing (no hardcoded values) | /10 |
| ≥3 assertion patterns per spec | /10 |
| Multi-browser (Chromium/Firefox/WebKit) | /10 |
| Test isolation (beforeEach/afterEach) | /10 |
| No flaky waits (no sleep > 500ms) | /10 |
| AI Audit logs complete | /10 |
| Git commits ≥8 over ≥4 days | /10 |

---

## Demo Video
> YouTube (unlisted): _to be added after recording_

---

*Run by: 23127379*
