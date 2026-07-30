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
├── scripts/run-feature.mjs     # 3 isolated browser reports per FR
├── Infrastructure-AI-Audit.md  # Setup/workflow AI audit
│
├── Pool-A_FR06/                # FR-06: Product Detail View
│   ├── fr06.spec.ts
│   ├── fr06-test-data.json
│   ├── fr06-automation-review.md
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
│   ├── FR08-AI-Audit.md
│   └── playwright-report/
│
├── Pool-C_FR15/                # FR-15: Product Management (CRUD)
│   ├── fr15.spec.ts
│   ├── fr15-test-data.json
│   ├── fr15-automation-review.md
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
- Node.js ≥ 22 (currently using v26)
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

# View HTML report
npm run report
```

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
