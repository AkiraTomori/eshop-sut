# HW04 Main Report — Automation Testing

## Student information

| Field | Value |
|---|---|
| Student | 23127379 — Thái Minh Huy |
| Assignment | HW04 — Automation Testing |
| Repository | <https://github.com/AkiraTomori/eshop-sut> |
| Framework | Playwright 1.62.0 with TypeScript |
| Browsers | Chromium, Firefox, WebKit |
| Scope | Browser UI automation only |

## 1. Feature selection and automation scope

The same three web features selected in HW02 were automated. API/status/database clauses were excluded and documented in each automation review rather than simulated through Playwright request APIs.

| Pool | Feature | Automated UI TCs | Latest evidence run | Browser executions |
|---|---|---:|---:|---:|
| A | FR-06 — Product Detail View | 22 | Run #1 | 66 |
| B | FR-08 — Checkout | 14 | Run #6 | 42 |
| C | FR-15 — Product Management | 25 | Run #2 | 75 |
| **Total** | **3 features** | **61** |  | **183** |

Each feature exceeds the minimum of 12 UI test cases. The authoritative TC selections, hybrid-clause limitations, API exclusions, and source discrepancies are recorded in the pool-specific automation reviews.

## 2. AI-first workflow and human review

The work followed the repository's gated workflow: shared Playwright setup, one-feature script generation, script review and correction, isolated three-browser execution, failure classification, and HITL audit sign-off. The AI loaded the current FR's HW2 test cases, SRS, and known-bug report before generating each suite. External data, fixture lifecycle, BasePage-derived page objects, stable locators, and spec-correct expectations were reviewed at every FR gate.

Material corrections included:

- FR-06: replaced one-time boolean assertion branches with web-first assertions, removed a helper that masked the defective first Add-to-Cart click, and separated UI-observable clauses from API-only clauses.
- FR-08: corrected Profile controls to verified placeholder locators, reordered Profile/cart setup after discovering that cart state is not reload-persistent, and replaced an invalid accessible-name assumption for checkout list items.
- FR-15: corrected generated TC mappings and scope partitions, documented a destructive update case as HITL-only, and classified unrelated price-format and disputed tab-order assertions as test/source issues instead of product bugs.

The signed audit history is available in `Infrastructure-AI-Audit.md` and each pool's `FR##-AI-Audit.md`. Earlier partially accepted FR-08 runs remain in the history; later reviewed corrections and accepted Run #6 supersede those unsuccessful cycles.

## 3. Automation design

### 3.1 Data-driven implementation

All URLs, credentials, input values, labels, boundaries, and expected results are supplied outside the test bodies through `test-environment.json` and pool-specific JSON files:

- `Pool-A_FR06/fr06-test-data.json`
- `Pool-B_FR08/fr08-test-data.json`
- `Pool-C_FR15/fr15-test-data.json`

Specs import `test` and `expect` only from `fixtures/eshop.fixture.ts`. The fixture creates and closes a fresh authenticated context per test. Feature page objects extend `pages/base.page.ts`; they contain user-intent operations and verified locators, not mutable test data or assertions.

### 3.2 Assertions and isolation

Across the suites, assertions include `toHaveURL`, `toBeVisible`, `not.toBeVisible`, `toHaveText`, `toContainText`, `toHaveValue`, `toHaveCount`, `toHaveAttribute`, `toHaveCSS`, `toBeFocused`, and `expect.poll`. Tests use UI-based setup and cleanup and contain no request fixture, direct API/database action, response interception, `page.evaluate()` assertion, or wait longer than 500 ms.

### 3.3 Multi-browser reporting

`playwright.config.ts` defines Chromium, Firefox, and WebKit projects and starts or reuses the Backend, Web, and Web Admin services. Every retained browser report displays `Run by: 23127379` and records an ISO run timestamp in Playwright metadata. Each pool contains a full overview and isolated browser reports under `playwright-report/`.

## 4. Latest execution results

| Feature | Chromium | Firefox | WebKit | Aggregate |
|---|---|---|---|---|
| FR-06 | 7 passed / 15 failed | 7 / 15 | 7 / 15 | 21 passed / 45 failed |
| FR-08 | 1 passed / 13 failed | 1 / 13 | 1 / 13 | 3 passed / 39 failed |
| FR-15 | 1 passed / 24 failed | 1 / 24 | 1 / 24 | 3 passed / 72 failed |
| **Total** | **9 / 52** | **9 / 52** | **9 / 52** | **27 passed / 156 failed / 183 total** |

Nonzero exits are retained evidence, not incomplete runs. FR-06 and FR-08 failures were classified predominantly as genuine spec-correct product failures. FR-15 contains 57 genuine product-failure results and 15 results caused exclusively by two test/source issues. The cumulative run summaries also preserve infrastructure-only attempts with zero discovery; these are not substituted for the latest evidence runs.

## 5. Defect results

The consolidated report records 28 distinct genuine defects: 19 known HW2 defects reproduced and nine automation-discovered defects. All 156 failed browser results are classified in the detailed pool reports; failures are not automatically treated as bugs.

| Feature | Genuine defects | Known | New | Test/source issues |
|---|---:|---:|---:|---:|
| FR-06 | 8 | 7 | 1 | 1 secondary observation |
| FR-08 | 8 | 6 | 2 | 0 in latest run |
| FR-15 | 12 | 6 | 6 | 2 |
| **Total** | **28** | **19** | **9** | **3** |

All 28 known and automation-discovered defects link to verified GitHub Issues. The nine automation-discovered defects are Issues 59–67, and their detailed reports include the submitted evidence. See `bug_report.md` and the three detailed `fr##-bug-report.md` files.

## 6. Cases not fully automated

- Direct HTTP, authorization-header, malformed-token, response-status, tampered-payload, and database verification cases are listed as `Out of HW4 scope — API testing` in the respective reviews.
- Hybrid cases automate only their explicit UI path and UI-observable outcome; API/database clauses are listed as uncovered.
- FR-15 EP-003 is not counted because its update behavior mutates unrelated shared products and the current UI cannot safely restore their identities. It requires a disposable database snapshot under HITL control.

## 7. Demo video

The repository declares the unlisted YouTube playlist <https://www.youtube.com/playlist?list=PLFKmUDyIY8sc>, with six linked workflow parts listed in `README.md`. Before submission, the student must confirm that the submitted video evidence totals at least five minutes, is narrated in Vietnamese, demonstrates an end-to-end multi-browser run and HTML report, explains at least one correction, and shows face-cam or terminal `whoami` and `hostname`. Those content requirements cannot be established from repository metadata alone.

## 8. Reusable Agent Skills

The repository contains reusable skills for Playwright infrastructure, data-driven script generation, script review, three-browser evidence, failure classification, and AI-audit logging under `.agents/skills/`. They enforce the browser-UI-only boundary, sequential FR gates, external test data, BasePage-derived POM structure, isolated reports, and HITL sign-off.

## 9. Git history

`git-commit-log.txt` records nine commits that modify HW4 `.spec.ts` files. This satisfies the eight-commit count but spans only 2026-07-31 and 2026-08-01—two calendar days, not the required four. This is disclosed as a submission-compliance gap and must not be corrected by rewriting commit history.

## 10. Provisional self-assessment

| Criterion | Maximum | Provisional score | Rationale |
|---|---:|---:|---|
| Feature A — FR-06 | 25 | 23 | Complete suite, evidence, classification, and GitHub Issue links |
| Feature B — FR-08 | 25 | 23 | Complete corrected evidence, classification, and GitHub Issue links |
| Feature C — FR-15 | 25 | 21 | Complete evidence and Issue links, with two classified test/source issues |
| Demo video | 15 | 9 | Playlist supplied; duration/content/authorship require human confirmation |
| Agent Skills | 10 | 9 | Reusable gated workflow and audit tooling are present |
| **Total** | **100** | **85** | **Provisional filename grade: 085** |

The student should confirm or change this self-assessment before naming the submission archive.

## 11. Submission readiness

Completed locally:

- Three data-driven Playwright suites and external JSON files
- Three-browser reports for all three features, including full-FR overviews
- Automation reviews, cumulative run summaries, detailed bug reports, consolidated bug index, and signed AI audits
- Main report, AI critique, README summary, spec-focused Git commit log, and consolidated Markdown/PDF AI Audit appendix

HITL actions still required before Moodle submission:

- Confirm the playlist/video satisfies duration, Vietnamese narration, end-to-end report demonstration, correction narration, and authorship evidence
- Confirm the provisional self-assessed grade and final archive filename
- Inspect the generated PDFs and build the ZIP after the remaining HITL checks are resolved
- Acknowledge that the existing qualifying commit history spans two days and cannot satisfy the four-day rule retroactively without falsification

## References

- HW04 assignment: `2026.HW04.Automation Testing_En.md`
- HW2 canonical sources: `../HW2/Pool-A_FR06_ProductDetailView`, `../HW2/Pool-B_FR08_Checkout`, and `../HW2/Pool-C_FR15_ProductManagement`
- Shared SRS: `../HW2/agents/context/eshop-srs.md`
- Playwright documentation: <https://playwright.dev>
