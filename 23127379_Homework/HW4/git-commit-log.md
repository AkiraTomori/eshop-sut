 * commit 99d26e9c92235a0dbe30bdf22152de3185cf16b0
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sun Aug 2 10:12:04 2026 +0700
| 
|     feat: Add DevOps video link explaining shift-left testing process and CI/CD pipeline execution
| 
|  23127379_Homework/HW4/README.md | 3 +++
|  1 file changed, 3 insertions(+)
| 
* commit 2905279438ecc8ec249e43963d14eb607be0f1a9
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sun Aug 2 10:01:40 2026 +0700
| 
|     Trigger CI
| 
|  backend/server.js | 2 ++
|  1 file changed, 2 insertions(+)
| 
* commit 93f1905e5a77418392444efb37527a5c3ff760b8
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sun Aug 2 09:44:11 2026 +0700
| 
|     fix: Update cron schedule to run daily and add repository link documentation
| 
|  .github/workflows/hw4-playwright.yml | 2 +-
|  23127379_Homework/HW4/repos.md       | 2 ++
|  2 files changed, 3 insertions(+), 1 deletion(-)
| 
* commit 62e7033e5f35a49f186146f6da242a4741415365
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 23:11:23 2026 +0700
| 
|     feat: Add detailed AI audit sessions and restructure CI workflow for HW04 automation testing
| 
|  23127379_Homework/HW4/AI-Audit-Report.md         |  72 +++++++++++++++++++++
|  23127379_Homework/HW4/AI-Audit-Report.pdf        | Bin 1170858 -> 904527 bytes
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md |  30 ++++-----
|  23127379_Homework/HW4/git-commit-log.txt         |  24 -------
|  4 files changed, 87 insertions(+), 39 deletions(-)
| 
* commit e285f3d70a6ff5edc6184e9ebf0aab89b1f22429
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 22:26:46 2026 +0700
| 
|     feat: Update deployment workflow to publish images after CI completion, regardless of test results
| 
|  .github/workflows/deploy.yml                     | 24 ++++++++++++++++++----
|  .github/workflows/hw4-playwright.yml             |  3 +++
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md | 14 +++++++++++++
|  23127379_Homework/HW4/README.md                  | 22 +++++++++-----------
|  23127379_Homework/HW4/playwright.config.ts       |  2 +-
|  5 files changed, 48 insertions(+), 17 deletions(-)
| 
* commit f210d826631be7890d7544d60b9e079df7440b04
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 21:36:50 2026 +0700
| 
|     feat: Implement Docker deployment for EShop services with GitHub Container Registry
| 
|  .github/workflows/deploy.yml                     | 85 ++++++++++++++++++++++
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md | 29 ++++++++
|  backend/.dockerignore                            |  3 +
|  backend/Dockerfile                               | 27 +++++++
|  compose.yaml                                     | 54 ++++++++++++++
|  frontend-admin/.dockerignore                     |  4 +
|  frontend-admin/Dockerfile                        | 21 ++++++
|  frontend-admin/nginx.conf                        | 12 +++
|  frontend-web/.dockerignore                       |  4 +
|  frontend-web/Dockerfile                          | 21 ++++++
|  frontend-web/nginx.conf                          | 12 +++
|  run_servers.sh                                   | 13 ++--
|  stop.sh                                          | 10 ++-
|  13 files changed, 287 insertions(+), 8 deletions(-)
| 
* commit 453092013600f43d8cac945a3a6f53f10a48af0e
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 20:32:34 2026 +0700
| 
|     feat: Restructure CI workflow into Build-to-Test pipeline for HW4 infrastructure validation
| 
|  .github/workflows/hw4-playwright.yml             | 73 +++++++++++++++++++++-
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md | 15 +++++
|  2 files changed, 86 insertions(+), 2 deletions(-)
| 
* commit b79d67c09f2f02b001c1d99b6cb7c57212736cdf
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 20:20:49 2026 +0700
| 
|     ci(HW4): add cross-browser Playwright workflow
| 
|  .github/workflows/hw4-playwright.yml             | 118 +++++++++++++++++++++
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md |  14 +++
|  2 files changed, 132 insertions(+)
| 
* commit 3277953016c66b64bcdf800dc64b073f5648e679
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 20:12:58 2026 +0700
| 
|     Refactor bug reports and documentation for HW4 automation testing
|     
|     - Updated GitHub Issue sections in bug reports for FR08 and FR15 to reflect verified issues.
|     - Enhanced README with new AI Audit Report and git commit log details.
|     - Revised main report to clarify feature selection, automation scope, and self-assessment scores.
|     - Improved AI critique with detailed analysis of AI performance and collaboration insights.
|     - Added PDF versions of AI critique and main report for submission.
|     - Created git commit log to document qualifying commits and compliance status.
| 
|  23127379_Homework/HW4/AI-Audit-Report.md          | 607 ++++++++++++++++++++
|  23127379_Homework/HW4/AI-Audit-Report.pdf         | Bin 0 -> 1170858 bytes
|  .../HW4/Pool-A_FR06/fr06-automation-review.md     |   4 +-
|  .../HW4/Pool-A_FR06/fr06-bug-report.md            |   4 +-
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     |   4 +-
|  .../HW4/Pool-B_FR08/fr08-bug-report.md            |   2 +-
|  .../HW4/Pool-C_FR15/fr15-automation-review.md     |   4 +-
|  .../HW4/Pool-C_FR15/fr15-bug-report.md            |   4 +-
|  23127379_Homework/HW4/README.md                   |  59 +-
|  23127379_Homework/HW4/ai_critique.md              |  27 +-
|  23127379_Homework/HW4/ai_critique.pdf             | Bin 0 -> 90460 bytes
|  23127379_Homework/HW4/bug_report.md               |  18 +-
|  23127379_Homework/HW4/git-commit-log.txt          |  24 +
|  23127379_Homework/HW4/main_report.md              | 239 +++-----
|  23127379_Homework/HW4/main_report.pdf             | Bin 0 -> 312268 bytes
|  15 files changed, 786 insertions(+), 210 deletions(-)
| 
* commit 9ab63479ca9988a1b84235c73d1438d41cfcd2be
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 19:58:01 2026 +0700
| 
|     feat: Update bug reports with GitHub issue links for FR-06, FR-08, and FR-15
| 
|  .../HW4/Pool-A_FR06/fr06-bug-report.md            |  4 +--
|  .../HW4/Pool-B_FR08/fr08-bug-report.md            |  8 +++---
|  .../HW4/Pool-C_FR15/fr15-bug-report.md            | 24 +++++++++---------
|  23127379_Homework/HW4/README.md                   | 28 ++++++++++++++-------
|  23127379_Homework/HW4/main_report.md              | 12 ++++-----
|  5 files changed, 43 insertions(+), 33 deletions(-)
| 
* commit dfc337e66265c0b1d76bdb3398889e208970669c
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 18:17:07 2026 +0700
| 
|     Update bug report for FR-15 with new defects and revised metrics
|     
|     - Changed classification status for FR-06 and FR-15 to reflect HITL acceptance.
|     - Added multiple new bugs related to FR-15, including issues with price validation and UI elements.
|     - Updated totals in the metrics section to include confirmed defects and known issues for FR-15.
|     - Revised failure counts for FR-15 Run #2 to accurately represent genuine product failures and test issues.
| 
|  .../HW4/Pool-C_FR15/FR15-AI-Audit.md              |  16 ++
|  .../HW4/Pool-C_FR15/fr15-automation-review.md     |   9 +-
|  .../HW4/Pool-C_FR15/fr15-bug-report.md            | 284 ++++++++++++++++++++
|  23127379_Homework/HW4/bug_report.md               |  26 +-
|  4 files changed, 325 insertions(+), 10 deletions(-)
| 
* commit d5f33915c237dbc01345e4e2bc7a90b0c0e0eecb
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 17:55:18 2026 +0700
| 
|     feat: Add FR-15 automation run summary and execute tests across multiple browsers
| 
|  .../HW4/Pool-C_FR15/FR15-AI-Audit.md              |  15 +++++-
|  .../HW4/Pool-C_FR15/fr15-run-summary.md           |  49 ++++++++++++++++++++
|  backend/database.sqlite                           | Bin 36864 -> 36864 bytes
|  3 files changed, 63 insertions(+), 1 deletion(-)
| 
* commit 5d2abe72ef325782279088bcc4941240be31110a
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 17:19:56 2026 +0700
| 
|     feat: Enhance FR-15 automation with new boundary test cases and UI improvements
|     
|     - Added a new session for reviewing and correcting the FR-15 automation, including detailed AI output and human review notes.
|     - Created a new automation review document for FR-15, summarizing the test cases, findings, and corrections.
|     - Updated the test data JSON to include new boundary value test cases and adjusted the selected UI cases accordingly.
|     - Refactored the Playwright test suite to incorporate boundary input handling and improved feedback assertions.
|     - Enhanced the ProductManagementPage class by adding a cancel edit functionality and refining locator strategies.
|     - Updated the SQLite database to reflect changes in the product management schema.
| 
|  .../HW4/Pool-C_FR15/FR15-AI-Audit.md              |  16 ++
|  .../HW4/Pool-C_FR15/fr15-automation-review.md     | 141 ++++++++++++++
|  .../HW4/Pool-C_FR15/fr15-test-data.json           | 132 +++++++++++--
|  23127379_Homework/HW4/Pool-C_FR15/fr15.spec.ts    | 203 ++++++++++++++------
|  .../HW4/pages/product-management.page.ts          |  18 +-
|  backend/database.sqlite                           | Bin 36864 -> 36864 bytes
|  6 files changed, 423 insertions(+), 87 deletions(-)
| 
* commit 3d619bedde9fc3b432c4ad53da34d405e58930e2
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 16:57:29 2026 +0700
| 
|     feat: Add FR-15 UI test suite and associated test data
|     
|     - Created `FR15-AI-Audit.md` to document the AI-generated test suite for FR-15.
|     - Added `fr15-test-data.json` containing metadata, architecture decisions, and test cases for the FR-15 feature.
|     - Implemented `fr15.spec.ts` to automate browser UI testing for product management, utilizing Playwright.
|     - Enhanced `product-management.page.ts` with new locators and methods for improved test interactions.
|     - Updated SQLite database to reflect changes in the backend.
| 
|  .../HW4/Pool-C_FR15/FR15-AI-Audit.md              |  12 +
|  .../HW4/Pool-C_FR15/fr15-test-data.json           | 402 +++++++++++++++++
|  23127379_Homework/HW4/Pool-C_FR15/fr15.spec.ts    | 465 ++++++++++++++++++++
|  .../HW4/pages/product-management.page.ts          | 108 ++++-
|  backend/database.sqlite                           | Bin 36864 -> 36864 bytes
|  5 files changed, 985 insertions(+), 2 deletions(-)
| 
* commit e1f95456096e275ec08437e584ff389af4a4e751
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 11:40:06 2026 +0700
| 
|     refactor(FR-08): Update bug report and automation review for Run #6 classification and evidence acceptance
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              | 13 ++++++++
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     | 28 ++++++++--------
|  .../HW4/Pool-B_FR08/fr08-bug-report.md            | 37 +++++++++------------
|  23127379_Homework/HW4/bug_report.md               |  6 ++--
|  4 files changed, 45 insertions(+), 39 deletions(-)
| 
* commit 9b6525f5ae8fef0ba0c678d50ed477bd335fc415
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Sat Aug 1 11:28:20 2026 +0700
| 
|     refactor(FR-08): Update automation review and bug report for Run #6 evidence and classification
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  13 ++++++++++
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     |  10 +++++---
|  .../HW4/Pool-B_FR08/fr08-bug-report.md            |   2 +-
|  .../HW4/Pool-B_FR08/fr08-run-summary.md           |  26 +++++++++++++++++---
|  23127379_Homework/HW4/bug_report.md               |   2 +-
|  backend/database.sqlite                           | Bin 36864 -> 36864 bytes
|  6 files changed, 44 insertions(+), 9 deletions(-)
| 
* commit 9bbab26b721b9f55136d392f2e0b7daf1450ad7b
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 21:23:46 2026 +0700
| 
|     refactor(FR-08): Correct locator for checkout items and update related documentation after Run #4
| 
|  23127379_Homework/HW4/Pool-B_FR08/FR08-AI-Audit.md   | 13 +++++++++++++
|  .../HW4/Pool-B_FR08/fr08-automation-review.md        | 18 ++++++++++--------
|  23127379_Homework/HW4/Pool-B_FR08/fr08-bug-report.md |  4 ++--
|  23127379_Homework/HW4/Pool-B_FR08/fr08.spec.ts       |  2 +-
|  23127379_Homework/HW4/bug_report.md                  |  2 +-
|  23127379_Homework/HW4/pages/checkout.page.ts         |  2 +-
|  6 files changed, 28 insertions(+), 13 deletions(-)
| 
* commit 125a519cc4ffe8774c800378dfbc97e51feb622c
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 21:18:26 2026 +0700
| 
|     Update bug report for FR-08: revise classification status, add new defects, and adjust totals
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  13 +
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     |  31 ++-
|  .../HW4/Pool-B_FR08/fr08-bug-report.md            | 264 ++++++++++----------
|  23127379_Homework/HW4/bug_report.md               |  17 +-
|  4 files changed, 172 insertions(+), 153 deletions(-)
| 
* commit 42ff96eebce987e119556a9407be704f98b3eedf
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 21:04:43 2026 +0700
| 
|     refactor(FR-08): Update automation review and bug report for Run #4 evidence and classification
| 
|  23127379_Homework/HW4/Pool-B_FR08/fr08-automation-review.md | 6 +++---
|  23127379_Homework/HW4/bug_report.md                         | 2 +-
|  2 files changed, 4 insertions(+), 4 deletions(-)
| 
* commit b978fccffc7754d2c30300c07744ebf3959fa3a2
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 21:03:20 2026 +0700
| 
|     refactor(audit): Update FR-08 run summary and add details for Run #4 execution
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  13 +++++++++++++
|  .../HW4/Pool-B_FR08/fr08-run-summary.md           |  16 +++++++++++++---
|  backend/database.sqlite                           | Bin 36864 -> 36864 bytes
|  3 files changed, 26 insertions(+), 3 deletions(-)
| 
* commit 442f2c92188a475002e41c0417177f9afd384f90
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 20:30:06 2026 +0700
| 
|     refactor(FR-08): Update review status and verdict in automation documents after Run #3
| 
|  23127379_Homework/HW4/Pool-B_FR08/FR08-AI-Audit.md          | 2 +-
|  23127379_Homework/HW4/Pool-B_FR08/fr08-automation-review.md | 6 +++---
|  23127379_Homework/HW4/bug_report.md                         | 2 +-
|  3 files changed, 5 insertions(+), 5 deletions(-)
| 
* commit d105ed2ce13194e47d313ca55f865e864cd726a1
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 20:27:02 2026 +0700
| 
|     refactor(fr-08): Update cart lifecycle handling and review process after Run #3
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  13 ++++++
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     |  48 ++++++++++----------
|  23127379_Homework/HW4/Pool-B_FR08/fr08.spec.ts    |  15 +++---
|  23127379_Homework/HW4/bug_report.md               |   2 +-
|  backend/database.sqlite                           | Bin 36864 -> 36864 bytes
|  5 files changed, 45 insertions(+), 33 deletions(-)
| 
* commit 1a9927561cb894910148a3974e90add94f3dccad
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 16:20:02 2026 +0700
| 
|     refactor(bug-reports): Update classification status and human review notes for FR-08
| 
|  23127379_Homework/HW4/Pool-B_FR08/FR08-AI-Audit.md          | 2 +-
|  23127379_Homework/HW4/Pool-B_FR08/fr08-automation-review.md | 4 ++--
|  23127379_Homework/HW4/Pool-B_FR08/fr08-bug-report.md        | 2 +-
|  23127379_Homework/HW4/bug_report.md                         | 2 +-
|  4 files changed, 5 insertions(+), 5 deletions(-)
| 
* commit 5ff3c9af2d76dabcfcdd25263db298c40c16f93b
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 16:16:54 2026 +0700
| 
|     Update bug report for FR-08: Correct run number and clarify failed test results
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  13 +++
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     |  27 +++---
|  .../HW4/Pool-B_FR08/fr08-bug-report.md            | 102 ++++++++++----------
|  23127379_Homework/HW4/bug_report.md               |   4 +-
|  4 files changed, 81 insertions(+), 65 deletions(-)
| 
* commit 8e86a023f9d68688a9ab0260ba850c356f5c41c7
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 16:08:15 2026 +0700
| 
|     feat(audit): Add session details for FR-08 execution and update run summary with latest results
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  13 +++++++++++++
|  .../HW4/Pool-B_FR08/fr08-run-summary.md           |  16 +++++++++++++---
|  backend/database.sqlite                           | Bin 36864 -> 36864 bytes
|  3 files changed, 26 insertions(+), 3 deletions(-)
| 
* commit d4f4fb04f3357b701a412c308081f37786ee3065
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 15:40:03 2026 +0700
| 
|     refactor(FR-08): Update Profile locators to use placeholders and enhance checkout page interactions
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              | 13 +++++++++++++
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     | 21 ++++++++++++---------
|  .../HW4/Pool-B_FR08/fr08-test-data.json           |  4 ++--
|  23127379_Homework/HW4/Pool-B_FR08/fr08.spec.ts    | 10 +++++-----
|  23127379_Homework/HW4/pages/checkout.page.ts      | 16 ++++++++--------
|  5 files changed, 40 insertions(+), 24 deletions(-)
| 
* commit c96dee9b06e3af38d7c26376d160f0b4257b725b
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 15:32:03 2026 +0700
| 
|     refactor(automation-review): Update failure classification status and human review notes
| 
|  23127379_Homework/HW4/Pool-B_FR08/FR08-AI-Audit.md          | 4 ++--
|  23127379_Homework/HW4/Pool-B_FR08/fr08-automation-review.md | 6 +++---
|  2 files changed, 5 insertions(+), 5 deletions(-)
| 
* commit 6d2a8347a4f2e65f218597177ba02b927bd9e0c4
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 15:28:38 2026 +0700
| 
|     Add detailed bug report for FR-08 and update automation review
|     
|     - Created `fr08-bug-report.md` to document failures and classifications from Run #2.
|     - Updated `fr08-automation-review.md` to reflect the completion of failure classification and pending HITL sign-off.
|     - Revised `bug_report.md` to include the new bug ID for FR-08 and updated the status of confirmed defects.
|     - Adjusted the classification summary and known failure sections to accurately represent the results from the latest automation run.
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  13 ++
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     |  27 +--
|  .../HW4/Pool-B_FR08/fr08-bug-report.md            | 196 ++++++++++++++++++++
|  23127379_Homework/HW4/bug_report.md               |  11 +-
|  4 files changed, 230 insertions(+), 17 deletions(-)
| 
* commit 787352f57542ca28a164054139122576ae9b7311
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 15:09:41 2026 +0700
| 
|     feat(audit): Add FR-08 execution session details and run summary for browser UI tests
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  13 ++++++
|  .../HW4/Pool-B_FR08/fr08-run-summary.md           |  49 ++++++++++++++++++++
|  backend/database.sqlite                           | Bin 36864 -> 36864 bytes
|  3 files changed, 62 insertions(+)
| 
* commit 293392ea74edb2b941ba4804272d88413a178dc4
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 14:37:24 2026 +0700
| 
|     Refactor FR-08 automation suite: integrate Profile address updates, enhance assertions, and improve locator strategies
|     
|     - Updated FR-08 Playwright spec to include Profile address updates before checkout.
|     - Enhanced assertions for item totals, non-editability, and error message positions.
|     - Improved locator strategies using semantic roles for better resilience.
|     - Added new methods in CheckoutPage for updating Profile address and verifying validation errors.
|     - Updated test data to include UI-observable Bug IDs and expected values.
|     - Cleaned up test cases for better readability and maintainability.
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  13 ++
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     | 135 +++++++-----
|  .../HW4/Pool-B_FR08/fr08-test-data.json           |  30 ++-
|  23127379_Homework/HW4/Pool-B_FR08/fr08.spec.ts    | 222 ++++++++++++--------
|  23127379_Homework/HW4/pages/checkout.page.ts      |  66 ++++--
|  5 files changed, 315 insertions(+), 151 deletions(-)
| 
* commit dbcd1cb2639467f5d62cad22aafde0fed8b107f2
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 14:11:47 2026 +0700
| 
|     feat(FR08): Add FR-08 automation suite with comprehensive test cases and data management
| 
|  .../HW4/Pool-B_FR08/FR08-AI-Audit.md              |  12 +
|  .../HW4/Pool-B_FR08/fr08-automation-review.md     |  83 ++++++
|  .../HW4/Pool-B_FR08/fr08-test-data.json           | 148 ++++++++++
|  23127379_Homework/HW4/Pool-B_FR08/fr08.spec.ts    | 304 ++++++++++++++++++++
|  23127379_Homework/HW4/pages/checkout.page.ts      | 154 ++++++++--
|  5 files changed, 683 insertions(+), 18 deletions(-)
| 
* commit f22b7eb4152ac246f5938c3e701446f0f73fc130
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 13:48:02 2026 +0700
| 
|     feat(audit): Update AI review notes and verdicts for FR-06 automation suite
| 
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md   |  6 +++---
|  23127379_Homework/HW4/Pool-A_FR06/FR06-AI-Audit.md | 13 ++++++-------
|  2 files changed, 9 insertions(+), 10 deletions(-)
| 
* commit 597fe101bff157bdf59ed473f820c6dc75783db5
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 13:39:09 2026 +0700
| 
|     Update FR-06 automation review and bug report with classification and evidence
|     
|     - Changed automation review stage to "Browser evidence classified — pending HITL audit sign-off"
|     - Updated known failure classification and detailed evidence in fr06-bug-report.md
|     - Classified 8 genuine defects, including 1 new automation-discovered defect (BUG-FR06-AUTO-001)
|     - Revised GitHub issue links to reflect the correct repository
|     - Enhanced bug index and totals in root bug_report.md to accurately represent confirmed defects
| 
|  .../HW4/Pool-A_FR06/FR06-AI-Audit.md              |  19 +-
|  .../HW4/Pool-A_FR06/fr06-automation-review.md     |  30 +-
|  .../HW4/Pool-A_FR06/fr06-bug-report.md            | 411 ++++++++++++++++++--
|  23127379_Homework/HW4/bug_report.md               |  37 +-
|  4 files changed, 436 insertions(+), 61 deletions(-)
| 
* commit cbdbee8276bfb0e5ae9d9fb489ced299e30abb18
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 11:23:36 2026 +0700
| 
|     feat(bug-report): Enhance bug reporting structure with detailed FR reports and consolidated summaries
| 
|  .agents/skills/bug-report-automation/SKILL.md     |  27 ++-
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md  |  14 ++
|  .../HW4/Pool-A_FR06/fr06-bug-report.md            |  80 +++++++++
|  23127379_Homework/HW4/README.md                   |   5 +-
|  23127379_Homework/HW4/bug_report.md               | 179 ++++----------------
|  23127379_Homework/HW4/main_report.md              |   2 +-
|  AGENTS.md                                         |  28 +--
|  7 files changed, 169 insertions(+), 166 deletions(-)
| 
* commit dae51dbdd7f058d07c08ed900fa9449a519521ac
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 10:37:44 2026 +0700
| 
|     feat(playwright): Configure automatic startup for Backend, Frontend Web, and Web Admin services
| 
|  .agents/skills/playwright-setup/SKILL.md         |   2 +
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md |  26 ++++++++---
|  23127379_Homework/HW4/README.md                  |  13 ++++++
|  23127379_Homework/HW4/playwright.config.ts       |  51 +++++++++++++++++++++
|  23127379_Homework/HW4/test-environment.json      |   1 +
|  AGENTS.md                                        |   3 ++
|  backend/database.sqlite                          | Bin 36864 -> 36864 bytes
|  7 files changed, 90 insertions(+), 6 deletions(-)
| 
* commit 3282daf6611b4ff28f744e34bc70722b03629345
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 10:26:57 2026 +0700
| 
|     feat(FR06): Implement cumulative run summary for FR-06 automation suite
|     
|     - Added `fr06-run-summary.md` to track run sessions, results, and report commands.
|     - Enhanced `scripts/run-feature.mjs` to append run summaries after each execution.
|     - Updated `AGENTS.md` to reflect new run summary requirements and commands.
|     - Modified `README.md` to include instructions for opening full and individual browser reports.
|     - Added npm scripts for generating full FR reports and individual browser reports.
|     - Updated `Infrastructure-AI-Audit.md` and `FR06-AI-Audit.md` to document changes and evidence capture.
|     - Removed Playwright configuration and related scripts for HW4.
| 
|  .agents/skills/Playwright/ci/SKILL.md             |   2 +
|  .agents/skills/bug-report-automation/SKILL.md     |   3 +-
|  .agents/skills/playwright-setup/SKILL.md          |   9 +
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md  |  42 +++
|  .../HW4/Pool-A_FR06/FR06-AI-Audit.md              |  13 +
|  .../HW4/Pool-A_FR06/fr06-run-summary.md           |  47 +++
|  23127379_Homework/HW4/README.md                   |  39 ++-
|  23127379_Homework/HW4/package.json                |  13 +-
|  23127379_Homework/HW4/scripts/run-feature.mjs     | 303 +++++++++++++++++++-
|  AGENTS.md                                         |  32 ++-
|  backend/database.sqlite                           | Bin 36864 -> 36864 bytes
|  11 files changed, 479 insertions(+), 24 deletions(-)
| 
* commit 05e2e904895c05daa50b7e68d47560c32721f648
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 09:45:49 2026 +0700
| 
|     feat(FR06): Enhance FR-06 automation suite with review findings and additional test data
| 
|  .../HW4/Pool-A_FR06/FR06-AI-Audit.md              |  14 +-
|  .../HW4/Pool-A_FR06/fr06-automation-review.md     |  94 ++++++---
|  .../HW4/Pool-A_FR06/fr06-test-data.json           |  10 +-
|  23127379_Homework/HW4/Pool-A_FR06/fr06.spec.ts    | 206 +++++++++++---------
|  .../HW4/pages/product-detail.page.ts              |  71 +++++--
|  5 files changed, 260 insertions(+), 135 deletions(-)
| 
* commit 94b96ae1ad6222bf065412be459d516fc1c241f0
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 09:28:16 2026 +0700
| 
|     feat(FR06): Add FR-06 automation test suite and supporting data for product detail page
| 
|  .../HW4/Pool-A_FR06/FR06-AI-Audit.md              |  14 +
|  .../HW4/Pool-A_FR06/fr06-automation-review.md     |  86 +++++
|  .../HW4/Pool-A_FR06/fr06-test-data.json           | 223 ++++++++++++
|  23127379_Homework/HW4/Pool-A_FR06/fr06.spec.ts    | 363 ++++++++++++++++++++
|  .../HW4/pages/product-detail.page.ts              | 117 ++++++-
|  5 files changed, 802 insertions(+), 1 deletion(-)
| 
* commit 6ce6dcd3e9ab2d21e7ab89c8c7fb13932a955266
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 08:51:07 2026 +0700
| 
|     feat: Implement HW04 automation testing framework for EShop
|     
|     - Added project structure for HW04 automation including fixtures and page objects.
|     - Created shared fixture `eshop.fixture.ts` for managing user and admin authentication states.
|     - Developed base page class `base.page.ts` for shared navigation and URL resolution.
|     - Implemented specific page objects: `product-detail.page.ts`, `checkout.page.ts`, and `product-management.page.ts`.
|     - Introduced global setup and teardown scripts for managing authentication state.
|     - Configured Playwright with multiple browser support and custom reporting.
|     - Added scripts for running feature-specific tests and managing test results.
|     - Updated README and AGENTS.md to reflect new project structure and automation rules.
| 
|  .../skills/Playwright/core/fixtures-and-hooks.md  |   4 +
|  .agents/skills/Playwright/pom/SKILL.md            |   4 +-
|  .agents/skills/automation-script-gen/SKILL.md     |  14 +-
|  .agents/skills/playwright-setup/SKILL.md          |  13 +-
|  .agents/skills/script-review/SKILL.md             |   6 +-
|  .gitignore                                        |   5 +
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md  | 140 ++++++++++++++++----
|  23127379_Homework/HW4/README.md                   |  10 +-
|  23127379_Homework/HW4/fixtures/eshop.fixture.ts   | 112 ++++++++++++++++
|  23127379_Homework/HW4/global-setup.ts             |  71 ++++++++++
|  23127379_Homework/HW4/global-teardown.ts          |  24 ++++
|  23127379_Homework/HW4/package-lock.json           | 122 +++++++++++++++++
|  23127379_Homework/HW4/package.json                |  30 +++++
|  23127379_Homework/HW4/pages/base.page.ts          |  26 ++++
|  23127379_Homework/HW4/pages/checkout.page.ts      |  43 ++++++
|  .../HW4/pages/product-detail.page.ts              |  37 ++++++
|  .../HW4/pages/product-management.page.ts          |  85 ++++++++++++
|  23127379_Homework/HW4/playwright.config.ts        |  65 +++++++++
|  23127379_Homework/HW4/scripts/run-feature.mjs     |  60 +++++++++
|  23127379_Homework/HW4/test-environment.json       |  34 +++++
|  23127379_Homework/HW4/tsconfig.json               |  30 +++++
|  AGENTS.md                                         |  28 +++-
|  22 files changed, 926 insertions(+), 37 deletions(-)
| 
* commit b29fc4880f4679a86fbc898eb742e5c05c0e9c84
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Fri Jul 31 00:02:53 2026 +0700
| 
|     Remove Playwright configuration, test environment, and related scripts for HW4
| 
|  23127379_Homework/HW4/global-setup.ts             |  60 ----------
|  23127379_Homework/HW4/global-teardown.ts          |  19 ---
|  23127379_Homework/HW4/package-lock.json           | 122 --------------------
|  23127379_Homework/HW4/package.json                |  24 ----
|  .../HW4/playwright-report/index.html              |  49 --------
|  23127379_Homework/HW4/playwright.config.ts        | 102 ----------------
|  23127379_Homework/HW4/scripts/run-feature.mjs     |  50 --------
|  23127379_Homework/HW4/test-environment.json       |  22 ----
|  23127379_Homework/HW4/test-results/results.json   | 114 ------------------
|  23127379_Homework/HW4/tsconfig.json               |  16 ---
|  10 files changed, 578 deletions(-)
| 
* commit 59dfba70ea3c282a4da15f5fe4683ee5e2a88221
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Thu Jul 30 23:58:11 2026 +0700
| 
|     chore: remove Tool Survey Proposal document in markdown and PDF formats
| 
|  docs/Tool_Survey_Proposal.md  | 181 ----------------------------------------
|  docs/Tool_Survey_Proposal.pdf | Bin 328976 -> 0 bytes
|  2 files changed, 181 deletions(-)
| 
* commit de302db37526e9d3d6576b962b12499cc83ccc74
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Thu Jul 30 23:57:45 2026 +0700
| 
|     feat: update Workflow
| 
|  .agents/context/hw04-feature-reference.md         | 259 ++++++------
|  .agents/skills/AIAuditLogger/SKILL.md             | 236 -----------
|  .agents/skills/AutomationScriptGen/SKILL.md       | 438 --------------------
|  .agents/skills/BugReportAutomation/SKILL.md       | 255 ------------
|  .agents/skills/Playwright/SKILL.md                |  18 +
|  .agents/skills/Playwright/ci/SKILL.md             |   8 +
|  .../skills/Playwright/core/test-organization.md   |  12 +-
|  .agents/skills/Playwright/migration/SKILL.md      |   4 +
|  .../skills/Playwright/migration/from-selenium.md  |   2 +-
|  .agents/skills/Playwright/playwright-cli/SKILL.md |   6 +
|  .agents/skills/Playwright/pom/SKILL.md            |   4 +
|  .../skills/Playwright/pom/page-object-model.md    |   2 +-
|  .../Playwright/pom/pom-vs-fixtures-vs-helpers.md  |   4 +-
|  .agents/skills/PlaywrightSetup/SKILL.md           | 370 -----------------
|  .agents/skills/ScriptReview/SKILL.md              | 257 ------------
|  .agents/skills/ai-audit-logger/SKILL.md           |  46 ++
|  .agents/skills/automation-script-gen/SKILL.md     |  76 ++++
|  .agents/skills/bug-report-automation/SKILL.md     |  60 +++
|  .agents/skills/playwright-setup/SKILL.md          |  70 ++++
|  .agents/skills/script-review/SKILL.md             |  56 +++
|  23127379_Homework/HW4/Infrastructure-AI-Audit.md  | 142 +++++++
|  23127379_Homework/HW4/README.md                   |  16 +-
|  23127379_Homework/HW4/ai_critique.md              |   2 +-
|  23127379_Homework/HW4/global-setup.ts             |  49 ++-
|  23127379_Homework/HW4/global-teardown.ts          |   5 +-
|  23127379_Homework/HW4/package-lock.json           |   5 +-
|  23127379_Homework/HW4/package.json                |  20 +-
|  23127379_Homework/HW4/playwright.config.ts        |  24 +-
|  23127379_Homework/HW4/scripts/run-feature.mjs     |  50 +++
|  23127379_Homework/HW4/test-environment.json       |  22 +
|  AGENTS.md                                         | 202 +++++++--
|  GEMINI.md                                         | 151 -------
|  32 files changed, 934 insertions(+), 1937 deletions(-)
| 
* commit a96c3c19a3a74fa861fac8387f5456592cda784e
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Thu Jul 30 23:10:34 2026 +0700
| 
|     Add Playwright test results configuration and initial error handling
| 
|  .agents/skills/Playwright/LICENSE                 |   21 +
|  .agents/skills/Playwright/README.md               |  215 +++
|  .agents/skills/Playwright/SKILL.md                |  152 ++
|  .agents/skills/Playwright/ci/SKILL.md             |   47 +
|  .agents/skills/Playwright/ci/ci-github-actions.md |  620 ++++++
|  .agents/skills/Playwright/ci/ci-gitlab.md         |  421 ++++
|  .agents/skills/Playwright/ci/ci-other.md          |  582 ++++++
|  .../skills/Playwright/ci/docker-and-containers.md |  470 +++++
|  .../skills/Playwright/ci/global-setup-teardown.md |  521 +++++
|  .../skills/Playwright/ci/parallel-and-sharding.md |  418 ++++
|  .../Playwright/ci/projects-and-dependencies.md    |  640 +++++++
|  .../Playwright/ci/reporting-and-artifacts.md      |  553 ++++++
|  .agents/skills/Playwright/ci/test-coverage.md     |  471 +++++
|  .agents/skills/Playwright/core/SKILL.md           |  100 +
|  .agents/skills/Playwright/core/accessibility.md   | 1517 +++++++++++++++
|  .agents/skills/Playwright/core/angular.md         | 1086 +++++++++++
|  .agents/skills/Playwright/core/api-testing.md     | 1623 ++++++++++++++++
|  .../Playwright/core/assertions-and-waiting.md     |  703 +++++++
|  .agents/skills/Playwright/core/auth-flows.md      | 1081 +++++++++++
|  .agents/skills/Playwright/core/authentication.md  | 1409 ++++++++++++++
|  .agents/skills/Playwright/core/browser-apis.md    |  673 +++++++
|  .../skills/Playwright/core/browser-extensions.md  |  319 ++++
|  .../skills/Playwright/core/canvas-and-webgl.md    |  494 +++++
|  .../Playwright/core/clock-and-time-mocking.md     |  427 +++++
|  .agents/skills/Playwright/core/common-pitfalls.md | 1318 +++++++++++++
|  .../skills/Playwright/core/component-testing.md   | 1179 ++++++++++++
|  .agents/skills/Playwright/core/configuration.md   |  731 +++++++
|  .agents/skills/Playwright/core/crud-testing.md    |  945 +++++++++
|  .agents/skills/Playwright/core/debugging.md       |  827 ++++++++
|  .agents/skills/Playwright/core/drag-and-drop.md   |  992 ++++++++++
|  .../skills/Playwright/core/electron-testing.md    |  622 ++++++
|  .../Playwright/core/error-and-edge-cases.md       | 1181 ++++++++++++
|  .agents/skills/Playwright/core/error-index.md     | 1903 +++++++++++++++++++
|  .agents/skills/Playwright/core/file-operations.md |  749 ++++++++
|  .../Playwright/core/file-upload-download.md       | 1012 ++++++++++
|  .../skills/Playwright/core/fixtures-and-hooks.md  | 1072 +++++++++++
|  .agents/skills/Playwright/core/flaky-tests.md     |  883 +++++++++
|  .../Playwright/core/forms-and-validation.md       | 1056 ++++++++++
|  .../Playwright/core/i18n-and-localization.md      |  622 ++++++
|  .../Playwright/core/iframes-and-shadow-dom.md     |  488 +++++
|  .../skills/Playwright/core/locator-strategy.md    |  588 ++++++
|  .agents/skills/Playwright/core/locators.md        |  743 ++++++++
|  .../Playwright/core/mobile-and-responsive.md      | 1669 ++++++++++++++++
|  .../Playwright/core/multi-context-and-popups.md   |  581 ++++++
|  .../core/multi-user-and-collaboration.md          |  477 +++++
|  .agents/skills/Playwright/core/network-mocking.md | 1395 ++++++++++++++
|  .agents/skills/Playwright/core/nextjs.md          | 1013 ++++++++++
|  .../skills/Playwright/core/performance-testing.md |  608 ++++++
|  .agents/skills/Playwright/core/react.md           | 1082 +++++++++++
|  .../skills/Playwright/core/search-and-filter.md   | 1366 +++++++++++++
|  .../skills/Playwright/core/security-testing.md    |  624 ++++++
|  .../Playwright/core/service-workers-and-pwa.md    |  524 +++++
|  .../skills/Playwright/core/test-architecture.md   |  569 ++++++
|  .../Playwright/core/test-data-management.md       | 1209 ++++++++++++
|  .../skills/Playwright/core/test-organization.md   |  947 +++++++++
|  .../Playwright/core/third-party-integrations.md   |  754 ++++++++
|  .agents/skills/Playwright/core/trace-analysis.md  |  161 ++
|  .../skills/Playwright/core/visual-regression.md   | 1027 ++++++++++
|  .agents/skills/Playwright/core/vue.md             | 1162 +++++++++++
|  .../Playwright/core/websockets-and-realtime.md    |  623 ++++++
|  .agents/skills/Playwright/core/when-to-mock.md    |  827 ++++++++
|  .agents/skills/Playwright/migration/SKILL.md      |   17 +
|  .../skills/Playwright/migration/from-cypress.md   | 1209 ++++++++++++
|  .../skills/Playwright/migration/from-selenium.md  |  955 ++++++++++
|  .agents/skills/Playwright/playwright-cli/SKILL.md |  219 +++
|  .../playwright-cli/advanced-workflows.md          |  679 +++++++
|  .../Playwright/playwright-cli/core-commands.md    |  375 ++++
|  .../Playwright/playwright-cli/device-emulation.md |  475 +++++
|  .../Playwright/playwright-cli/request-mocking.md  |  373 ++++
|  .../playwright-cli/running-custom-code.md         |  553 ++++++
|  .../playwright-cli/screenshots-and-media.md       |  457 +++++
|  .../playwright-cli/session-management.md          |  425 +++++
|  .../Playwright/playwright-cli/storage-and-auth.md |  487 +++++
|  .../Playwright/playwright-cli/test-generation.md  |  336 ++++
|  .../playwright-cli/tracing-and-debugging.md       |  501 +++++
|  .agents/skills/Playwright/pom/SKILL.md            |   17 +
|  .../skills/Playwright/pom/page-object-model.md    |  921 +++++++++
|  .../Playwright/pom/pom-vs-fixtures-vs-helpers.md  |  937 +++++++++
|  .../HW4/playwright-report/index.html              |   49 +
|  23127379_Homework/HW4/test-results/results.json   |  114 ++
|  80 files changed, 57191 insertions(+)
| 
* commit 1a06f08b0cc60d35d81c1cd8f84cab9b3faa24d0
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Thu Jul 30 23:04:06 2026 +0700
| 
|     feat: add package-lock.json for HW04 automation dependencies
| 
|  23127379_Homework/HW4/package-lock.json | 119 ++++++++++++++++++++++++++++++
|  1 file changed, 119 insertions(+)
| 
* commit 51f32fde011cc5cac78c3d63b5e8965625324715
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Tue Jul 28 21:53:55 2026 +0700
| 
|     feat(infra): add Playwright config with multi-browser and custom reporter Run by 23127379
| 
|  23127379_Homework/HW4/README.md            | 224 +++++++++------------------
|  23127379_Homework/HW4/global-setup.ts      |  53 +++++++
|  23127379_Homework/HW4/global-teardown.ts   |  16 ++
|  23127379_Homework/HW4/package.json         |  24 +++
|  23127379_Homework/HW4/playwright.config.ts |  90 +++++++++++
|  23127379_Homework/HW4/tsconfig.json        |  16 ++
|  6 files changed, 271 insertions(+), 152 deletions(-)
| 
* commit 43b4e1830df1e0c7ab7a08ab1a1e16e01ac1f2bc
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Tue Jul 28 21:49:53 2026 +0700
| 
|     refactor: enforce UI-only testing patterns by removing API-based setup and teardown from documentation and automation scripts.
| 
|  .agents/skills/AIAuditLogger/SKILL.md       |  4 +-
|  .agents/skills/AutomationScriptGen/SKILL.md | 71 +++++++++++----------------
|  .agents/skills/ScriptReview/SKILL.md        |  8 +--
|  AGENTS.md                                   | 13 ++---
|  GEMINI.md                                   |  9 ++--
|  5 files changed, 45 insertions(+), 60 deletions(-)
| 
* commit 8178fd8f68c322a30cd8d63fe976e9768d492914
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Mon Jul 27 22:09:44 2026 +0700
| 
|     docs: add homework report documentation and AI audit materials for HW1 (backup only)
| 
|  .../HW1/AI-Report/[AI-02] AI Audit Report.pdf     | Bin 0 -> 360919 bytes
|  .../HW1/AI-Report/[AI-03] AI Disclosure Form.pdf  | Bin 0 -> 246382 bytes
|  .../AI-Report/[AI-05] AI Privacy Checklist.pdf    | Bin 0 -> 204345 bytes
|  23127379_Homework/HW1/Report/Checklist.xlsx       | Bin 0 -> 17068 bytes
|  23127379_Homework/HW1/Report/Physical_Devices.png | Bin 0 -> 1260171 bytes
|  .../HW1/Report/QA_QC_ROLE_MINDMAP.md              |  86 ++
|  23127379_Homework/HW1/Report/images/req_1/1.png   | Bin 0 -> 189170 bytes
|  23127379_Homework/HW1/Report/images/req_1/10.png  | Bin 0 -> 412077 bytes
|  23127379_Homework/HW1/Report/images/req_1/2.png   | Bin 0 -> 455789 bytes
|  23127379_Homework/HW1/Report/images/req_1/3.png   | Bin 0 -> 212148 bytes
|  23127379_Homework/HW1/Report/images/req_1/4.png   | Bin 0 -> 418587 bytes
|  23127379_Homework/HW1/Report/images/req_1/5.png   | Bin 0 -> 439054 bytes
|  23127379_Homework/HW1/Report/images/req_1/6.png   | Bin 0 -> 458934 bytes
|  23127379_Homework/HW1/Report/images/req_1/7.png   | Bin 0 -> 411676 bytes
|  23127379_Homework/HW1/Report/images/req_1/8.png   | Bin 0 -> 434367 bytes
|  23127379_Homework/HW1/Report/images/req_1/9.png   | Bin 0 -> 481100 bytes
|  23127379_Homework/HW1/Report/main_report.md       | 749 +++++++++++++++
|  23127379_Homework/HW1/Report/main_report.pdf      | Bin 0 -> 7198110 bytes
|  23127379_Homework/HW1/Report/prompt_log.md        | 987 ++++++++++++++++++++
|  19 files changed, 1822 insertions(+)
| 
* commit 989fefb703b39f4a70d1f021bc7e8712da0b44a0
| Author: AkiraTomori <ThaiMinhHuy1407@gmail.com>
| Date:   Mon Jul 27 22:08:10 2026 +0700
| 
|     feat: add AI audit and agent skill framework for HW04 automation and reporting
| 
|  .agents/context/hw04-feature-reference.md         | 172 ++++++++
|  .agents/skills/AIAuditLogger/SKILL.md             | 236 ++++++++++
|  .agents/skills/AutomationScriptGen/SKILL.md       | 449 ++++++++++++++++++++
|  .agents/skills/BugReportAutomation/SKILL.md       | 255 +++++++++++
|  .agents/skills/PlaywrightSetup/SKILL.md           | 370 ++++++++++++++++
|  .agents/skills/ScriptReview/SKILL.md              | 257 +++++++++++
|  23127379_Homework/HW3/shared-gui-checklist.md     | 132 ++++++
|  .../HW4/2026.HW04.Automation Testing_En.md        | 183 ++++++++
|  23127379_Homework/HW4/README.md                   | 198 +++++++++
|  23127379_Homework/HW4/ai_critique.md              |  28 ++
|  23127379_Homework/HW4/bug_report.md               | 162 +++++++
|  23127379_Homework/HW4/main_report.md              | 198 +++++++++
|  AGENTS.md                                         | 278 ++++++++++++
|  GEMINI.md                                         | 152 +++++++
|  14 files changed, 3070 insertions(+)
