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
│   ├── fr06-bug-report.md      # Detailed FR failure/bug evidence
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
│   ├── fr08-bug-report.md
│   ├── FR08-AI-Audit.md
│   └── playwright-report/
│
├── Pool-C_FR15/                # FR-15: Product Management (CRUD)
│   ├── fr15.spec.ts
│   ├── fr15-test-data.json
│   ├── fr15-automation-review.md
│   ├── fr15-run-summary.md
│   ├── fr15-bug-report.md
│   ├── FR15-AI-Audit.md
│   └── playwright-report/
│
├── main_report.md              # Final summary report
├── AI-Audit-Report.md          # Consolidated verbatim audit appendix
├── bug_report.md               # Consolidated cross-FR bug summary
├── ai_critique.md              # AI tool critique (200–300 words)
└── git-commit-log.txt           # Qualifying spec-file commit evidence
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
# Playwright automatically starts Backend, Web and Web Admin when absent.
npm run test:fr06
npm run test:fr08
npm run test:fr15

# Each command above adds exactly one session to the FR's
# fr##-run-summary.md after all three browser attempts finish.
```

### Automatic SUT servers

`playwright.config.ts` manages all three local services before test execution:

| Service | URL | Command directory |
|---|---|---|
| Backend | `http://localhost:3000` | `backend/` |
| Web | `http://localhost:5173` | `frontend-web/` |
| Web Admin | `http://localhost:5174` | `frontend-admin/` |

Locally, Playwright reuses a service that is already listening. Otherwise it starts the service, waits until it is ready, runs the tests, and stops only the process it created. The Backend is started solely as SUT infrastructure; HW4 test actions and assertions remain browser-UI-only.

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

The figures below come from the latest retained JSON-backed evidence run for each FR. A failed assertion is preserved evidence and has been classified in the detailed pool bug report.

| Pool | FR | UI tests | Chromium | Firefox | WebKit | Aggregate |
|---|---|---:|---|---|---|---|
| A | FR-06 Product Detail | 22 | 7 passed / 15 failed | 7 / 15 | 7 / 15 | 21 / 45 |
| B | FR-08 Checkout | 14 | 1 passed / 13 failed | 1 / 13 | 1 / 13 | 3 / 39 |
| C | FR-15 Product Management | 25 | 1 passed / 24 failed | 1 / 24 | 1 / 24 | 3 / 72 |
| **Total** | **3 features** | **61** | **9 / 52** | **9 / 52** | **9 / 52** | **27 passed / 156 failed** |

- Browser evidence runs: 9 (three browsers for each of three features)
- Browser-test executions: 183
- Genuine distinct defects: 28 (19 known, 9 automation-discovered)
- Latest-run failures classified: 156

---

## Self-Assessment

| Assignment criterion | Maximum | Provisional score |
|---|---:|---:|
| Task 1 — Feature A (FR-06) | 25 | 25 |
| Task 1 — Feature B (FR-08) | 25 | 25 |
| Task 1 — Feature C (FR-15) | 25 | 25 |
| Task 2 — Demo video | 15 | 15 |
| Agent Skills | 10 | 10 |
| **Total** | **100** | **100** |

---

## Demo Video

> YouTube playlist declared by the student:

This playlist will demonstrate about agent skills:
[Playlist](https://www.youtube.com/playlist?list=PLFKmUDyIY8sc)

Alternatively, you can watch the individual videos for workflow:
- [Part 1](https://www.youtube.com/watch?v=Co2b8frwZeg&list=PLFKmUDyIY8sc&index=1)
- [Part 2](https://www.youtube.com/watch?v=pAzKwHZEiD4&list=PLFKmUDyIY8sc&index=2)
- [Part 3](https://www.youtube.com/watch?v=EPHga8_g1Go&list=PLFKmUDyIY8sc&index=3)
- [Part 4](https://www.youtube.com/watch?v=qthcfm5Ihh4&list=PLFKmUDyIY8sc&index=4)
- [Part 5](https://www.youtube.com/watch?v=2IxUkkGh148&list=PLFKmUDyIY8sc&index=5)
- [Part 6](https://www.youtube.com/watch?v=RTrrBKdYq5A&list=PLFKmUDyIY8sc&index=6)

Demo videos: [Demo](https://www.youtube.com/watch?v=VD_Xu0Yz9UA&list=PLFKmUDyIY8sc&index=8)

DevOps Video to explain why Testing Process is now shift-left and how to run test with CI/CD pipeline:
- [DevOps Video](https://www.youtube.com/watch?v=6ccDGcsMSgc&list=PLFKmUDyIY8sc&index=7)

Before submission, confirm that the video evidence totals at least five minutes, is narrated in Vietnamese, shows a multi-browser run and HTML report, explains at least one AI-script correction, and displays face-cam or terminal `whoami` and `hostname`.

## Submission Status

- [x] Three specs and external data files
- [x] Chromium, Firefox, and WebKit HTML reports for each feature
- [x] Reviews, run summaries, detailed bug reports, consolidated bug summary, and signed audits
- [x] Final Markdown report, 240-word AI critique, consolidated AI Audit, spec commit log, and their PDFs
- [x] Link all nine automation-discovered defects to verified GitHub Issues 59–67 with screenshots
- [X] Confirm the demo-video content and authorship evidence
- [X] Confirm provisional self-assessed grade `100`
- [x] Generate the consolidated AI Audit PDF from all four source audit logs
- [X] Inspect all generated PDFs
- [X] Create `23127379_HW04_AI_Automation_100.zip` only after the pending HITL items are resolved
---

*Run by: 23127379*
