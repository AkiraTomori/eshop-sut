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
