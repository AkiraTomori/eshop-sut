# EShop HW04 — Automation Testing
## Student: 23127379 | Thái Minh Huy

---

## Overview

This directory contains the complete automation testing deliverables for **HW04 — Automation Testing** of the EShop e-commerce application.

### Features Under Test (from HW2)

| Pool | FR | Feature | Spec File | Test Data |
|------|----|---------|-----------|-----------| 
| A | FR-06 | Product Detail View | `Pool-A_FR06/fr06.spec.ts` | `Pool-A_FR06/fr06-test-data.json` |
| B | FR-08 | Checkout | `Pool-B_FR08/fr08.spec.ts` | `Pool-B_FR08/fr08-test-data.json` |
| C | FR-15 | Product Management (CRUD) | `Pool-C_FR15/fr15.spec.ts` | `Pool-C_FR15/fr15-test-data.json` |

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- EShop SUT running:
  - Backend: `http://localhost:3000`
  - Frontend: `http://localhost:5173`
  - Web Admin: `http://localhost:5174`

### Installation

```bash
cd 23127379_Homework/HW4
npm install
npx playwright install
```

### Run Tests

```bash
# All features, all browsers
npm run test:all-browsers

# Single feature
npm run test:fr06    # Product Detail View
npm run test:fr08    # Checkout
npm run test:fr15    # Product Management

# Single browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# View HTML report
npm run report
```

---

## Test Summary Report

| Feature | TCs Automated | Passed | Failed | Skipped | Browser Runs |
|---------|--------------|--------|--------|---------|-------------|
| FR-06 Product Detail | TBD | TBD | TBD | TBD | 3 |
| FR-08 Checkout | TBD | TBD | TBD | TBD | 3 |
| FR-15 Product Mgmt | TBD | TBD | TBD | TBD | 3 |
| **Total** | **≥36** | TBD | TBD | TBD | **9** |

> *Fill this table after running the full suite.*

---

## Known Bugs (from HW2 — Expected Failures)

| Bug ID | Feature | Description | TC Affected |
|--------|---------|-------------|-------------|
| BUG-FR06-001 | FR-06 | Category not displayed; no breadcrumb; button not blue | TC-FR06-EP-001 |
| BUG-FR06-002 | FR-06 | Cart creates new row instead of incrementing | TC-FR06-EP-004 |
| BUG-FR06-003 | FR-06 | Quantity = 0 accepted by cart | TC-FR06-NEG-006 |
| BUG-FR06-004 | FR-06 | Negative quantity accepted | TC-FR06-NEG-007 |
| BUG-FR06-006 | FR-06 | NaN quantity accepted | TC-FR06-NEG-009 |
| BUG-FR08-001 | FR-08 | No h1 tag on checkout page | TC-FR08-EP-001 |
| BUG-FR08-006 | FR-08 | Empty shipping address not rejected | TC-FR08-NEG-004 |
| BUG-FR08-008 | FR-08 | Client total_amount not recalculated by server | TC-FR08-NEG-005 |
| BUG-FR15-001 | FR-15 | No success toast on product creation | TC-FR15-EP-001 |
| BUG-FR15-003 | FR-15 | Price displayed without thousands formatting | TC-FR15-EP-001 |

---

## Project Structure

```
HW4/
├── AGENTS.md                          # Governance rules for all agents
├── GEMINI.md                          # Gemini agent task definition
├── README.md                          # This file
├── playwright.config.ts               # Multi-browser config ("Run by: 23127379")
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── global-setup.ts                    # Login & auth state caching
├── global-teardown.ts                 # Auth state cleanup
│
├── Pool-A_FR06/                       # FR-06: Product Detail View
│   ├── fr06.spec.ts                   # Playwright spec (≥12 test cases)
│   ├── fr06-test-data.json            # External test data
│   ├── fr06-automation-review.md      # AI review & gap analysis
│   └── FR06-AI-Audit.md              # AI audit sessions
│
├── Pool-B_FR08/                       # FR-08: Checkout
│   ├── fr08.spec.ts
│   ├── fr08-test-data.json
│   ├── fr08-automation-review.md
│   └── FR08-AI-Audit.md
│
├── Pool-C_FR15/                       # FR-15: Product Management
│   ├── fr15.spec.ts
│   ├── fr15-test-data.json
│   ├── fr15-automation-review.md
│   └── FR15-AI-Audit.md
│
├── playwright-report/                 # HTML reports (all browsers)
│   ├── index.html                     # Combined report ("Run by: 23127379")
│   └── [browser-specific reports]
│
├── allure-results/                    # Allure raw results (if configured)
├── test-results/                      # Screenshots & traces (on failure)
│
├── .agents/
│   └── skills/
│       ├── PlaywrightSetup/SKILL.md   # Infra setup skill
│       ├── AutomationScriptGen/SKILL.md  # Script generation skill
│       ├── ScriptReview/SKILL.md      # Review & gap analysis skill
│       ├── BugReportAutomation/SKILL.md  # Bug reporting skill
│       └── AIAuditLogger/SKILL.md     # AI audit logging skill
│
├── bug_report.md                      # All automation-discovered bugs
├── main_report.md                     # Main HW04 report
└── ai_critique.md                     # 200–300 word AI critique
```

---

## Self-Assessment Table

| No. | Criteria | Max | Self-Assessed |
|-----|----------|-----|---------------|
| 1 | Task 1 — Feature A (FR-06) | 25 | |
| 1 | Task 1 — Feature B (FR-08) | 25 | |
| 1 | Task 1 — Feature C (FR-15) | 25 | |
| 2 | Task 2 — Demo video | 15 | |
| 3 | Agent Skills | 10 | |
| | **Total** | **100** | |

---

## Demo Video

> **YouTube Link:** [TBD — fill after recording]
> **Duration:** ≥ 5 minutes
> **Content:** Demonstrates FR-[##] automation script running on 3 browsers, including:
> - Full test execution with HTML report showing "Run by: 23127379"
> - At least one fix to the AI-generated script explained with narration
> - Face-cam or terminal showing `whoami` and `hostname`

---

## Git Commit Log

> Exported commit log: `git-commit-log.txt`
> Minimum: 8 commits touching `.spec.ts` files over 4+ calendar days.

---

## Agent Skills Demo

> **Skill Demo Video:** [TBD]
> Shows end-to-end use of the AutomationScriptGen skill on one complete feature.

---

## Submission

**Filename:** `23127379_HW04_AI_Automation_[SelfAssessedGrade].zip`

**Contents:**
- [x] Main report (main_report.md + PDF)
- [x] GitHub repository link
- [x] HTML reports (playwright-report/)
- [ ] Demo video YouTube link
- [x] AI Critique (ai_critique.md)
- [x] AI Audit Reports (FR##-AI-Audit.md)
- [x] Git commit log
- [ ] Bug report with GitHub Issues screenshots
- [x] README.md

---

*HW04 Automation Testing — EShop SUT — Student 23127379*
