## Session: 2026-07-31 14:02 — automation-script-gen: Generate FR-08 browser UI suite

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Generate the data-driven FR-08 Playwright suite from the complete HW2 test-case, bug, shared SRS, and HW04 assignment sources under the browser-UI-only scope.
- **Prompt:**
  > /hw4-generate FR-08
- **Supporting Playwright Skills:** `playwright-core` (`test-architecture.md`, `test-data-management.md`, `locators.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `authentication.md`, `react.md`, `forms-and-validation.md`, `error-and-edge-cases.md`); `playwright-pom` (`pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Generated 14 traceable FR-08 browser UI tests with external JSON data, expanded only the BasePage-derived FR-08 page class using current React-source locators, documented three API-only exclusions, hybrid clauses, and five source discrepancies, and created the generation review. `playwright-cli` was unavailable, so permitted React-source inspection was used. JSON and boundary-length validation, exact HW2 ID/title comparison, TypeScript checking, prohibited-pattern scanning, and whitespace checking passed; Playwright listed 42 project-test combinations across Chromium, Firefox, and WebKit. No browser suite was executed at F1.
- **Human Review Notes:** About testcases involves Shipping Address atributes, we need to traverse to Profile page to update it, other testcases are corrected.
- **What AI Got Wrong:** A.I is not wrong but they aren't known about the shipping address, they just based on SRS and testcases, so they didn't know about the shipping address, so they didn't traverse to profile page to update it.
- **Verdict:** Accepted with minor corrections. The AI-generated suite is valid, but the Shipping Address test cases need to be updated to include navigation to the Profile page for address updates.
---
## Session: 2026-07-31 14:21 — script-review: Review and correct FR-08 browser UI suite

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.3 (Analyse) + G9.4 (Collaborate)
- **Task:** Review and correct the FR-08 Playwright spec, external test data, BasePage-derived page object, shared-fixture usage, canonical traceability, browser-UI-only scope, isolation, and reliability; stop before browser execution.
- **Prompt:**
  > /hw4-review FR-08
- **Supporting Playwright Skills:** `playwright-core` (`locator-strategy.md`, `assertions-and-waiting.md`, `fixtures-and-hooks.md`, `flaky-tests.md`, `common-pitfalls.md`, `test-organization.md`); `playwright-pom` (`page-object-model.md`, `pom-vs-fixtures-vs-helpers.md`)
- **AI Output Summary:** Corrected the 14-case FR-08 suite to apply the accepted HITL Profile-address workflow through browser UI, strengthened exact item/total/non-editability assertions, repaired native-dialog sequencing, replaced brittle structural position/heading/illustration locators, restricted report annotations to UI-observable Bug IDs, and completed `fr08-automation-review.md` with findings, exclusions, discrepancies, expected failures, and architecture assessment. `playwright-cli` was unavailable, so permitted React-source inspection was used. JSON parsing, exact HW2 ID/title and boundary-length validation, TypeScript checking, prohibited-pattern scans, whitespace checking, and Playwright discovery of 42 project-test combinations passed. No browser suite was executed at F2.
- **Human Review Notes:** Approved
- **What AI Got Wrong:** Script is corrected, ready to run script test
- **Verdict:** Accepted
---
## Session: 2026-07-31 14:55 — playwright-ci: Run FR-08 three-browser evidence gate

- **AI Tool:** OpenAI Codex (GPT-5)
- **Bloom-AI Level:** G9.2 (Apply) + G9.3 (Analyse)
- **Task:** Execute the reviewed FR-08 browser UI suite through the local evidence runner for Chromium, Firefox, and WebKit; retain isolated reports, JSON results, screenshots, traces, error contexts, and the cumulative run summary; stop before failure classification.
- **Prompt:**
  > /hw4-run FR-08
- **Supporting Playwright Skills:** `playwright-ci` (`projects-and-dependencies.md`, `reporting-and-artifacts.md`); `playwright-core` (`debugging.md`, `trace-analysis.md`, `error-index.md`)
- **AI Output Summary:** The initial sandboxed runner invocation was prevented from starting the configured local web servers and was transparently preserved as Run #1 with zero executed tests. The approved rerun completed as Run #2: Chromium, Firefox, and WebKit each reported 1 passed and 13 failed out of 14, for 3 passed and 39 failed across 42 browser executions. All 39 failures retained a trace, screenshot, and error context. Evidence inspection found 36 failures at the reviewed Profile phone-field locator and three failures for the missing empty-cart illustration; the unauthenticated-protection case passed in every browser. The runner updated `fr08-run-summary.md` and generated the full overview plus three isolated HTML reports displaying student ID 23127379. `playwright-cli` was unavailable, so standard Playwright JSON, HTML, trace, screenshot, and error-context artifacts were used. No spec correction or bug classification was performed at F3.
- **Human Review Notes:** Approved test suite script
- **What AI Got Wrong:** But 12 testcases failed due to the locator issue, i guess it's not our fault for it, maybe because SUT's responsibility about the locator. But I think the another problem about changing profile in 12 testcases they all fill in phone number, but why the best pratice locator failed, need to review
- **Verdict:** Partially Accepted. The test suite script is approved, but the failures due to locator issues need further investigation and potential collaboration with the SUT team to resolve.
