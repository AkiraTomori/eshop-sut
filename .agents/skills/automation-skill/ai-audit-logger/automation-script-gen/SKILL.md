---
name: automation-script-gen
description: "Generate one HW04 FR's data-driven Playwright spec, external JSON/CSV, and current BasePage-derived page-object updates from its complete HW2 test-case and bug sources. Use only after Playwright setup passes and only for the current sequential FR: FR-06, then FR-08, then FR-15."
---

# Generate one FR automation suite

Obey `AGENTS.md`. HW2 is authoritative; `.agents/context/hw04-feature-reference.md` is navigation only.

## Load routed Playwright guidance

Read the current FR's full test-case file, bug report, and the shared SRS. Invoke `playwright-core` and `playwright-pom` as supporting skills. Read:

- `../playwright/core/test-architecture.md`
- `../playwright/core/locators.md`
- `../playwright/core/assertions-and-waiting.md`
- `../playwright/core/test-data-management.md`
- `../playwright/core/fixtures-and-hooks.md`
- `../playwright/core/authentication.md`
- `../playwright/core/react.md`
- `../playwright/pom/pom-vs-fixtures-vs-helpers.md`
- For forms and validation TCs: `../playwright/core/forms-and-validation.md`
- For invalid/error paths: `../playwright/core/error-and-edge-cases.md`
- For FR-15 CRUD: `../playwright/core/crud-testing.md`

Make an explicit POM-versus-fixture-versus-helper decision before generating code. Do not create POM files merely to satisfy the routing step.

Use the required shared architecture:

- Import `test` and `expect` from `../fixtures/eshop.fixture`.
- Reuse `userPage`, `adminPage`, and the relevant typed page-object fixture.
- Update only the current FR page class in `../pages/`; every FR page class must extend `BasePage`.
- Keep test inputs and expected results in the pool data file, never in fixtures or page objects.
- Never add API/request fixtures. Add a resource fixture only when its complete lifecycle is implemented through the UI.

If `playwright-cli` is installed, it may be invoked as a supporting skill to inspect the authorized local SUT: snapshot before interaction and use named sessions. If it is unavailable, inspect React source/DOM through the available standard tooling and record that fallback. Never install it implicitly.

Generic Playwright guidance is subordinate to `AGENTS.md`. Record every supporting Playwright skill/guide materially used in this invocation's audit block.

## Build a traceability manifest first

1. Select at least 12 TCs using `AGENTS.md` priority rules.
2. Copy each selected TC ID and title exactly from HW2.
3. Exclude every API-only TC requiring a direct HTTP call, API response/status assertion, or database inspection. Record it separately as `Out of HW4 scope — API testing`; do not count it toward the minimum.
4. A hybrid TC may be selected only when it has an explicit UI path and primary UI-observable outcome. Record every non-UI clause as not covered by HW4.
5. For each selected TC, record type, UI steps, data, complete UI-observable spec-correct expected result, known Bug ID, and UI cleanup need.
6. Cross-check Bug IDs against the detailed HW2 bug report.
7. If HW2 sources disagree, record the discrepancy and do not guess.

Never use a TC mapping copied from this skill.

## Inspect before locating

Inspect the live DOM or current React source before choosing locators. Prefer role, label, placeholder, text, then stable test ID. Do not invent `name`, class, toast, or breadcrumb selectors.

Colour and focus order are automatable with `toHaveCSS()` and `toBeFocused()`. Malformed-token, tampered-payload, HTTP-status, and database-only TCs are outside HW4 scope.

## Generate outputs

Write only to the current pool:

```text
fr##.spec.ts
fr##-test-data.json (or CSV)
```

The only allowed shared edit is the current FR's existing page class under `HW4/pages/`. Do not edit another FR's page class, `base.page.ts`, or `fixtures/eshop.fixture.ts` during generation.

Requirements:

- Put URLs, credentials, inputs, expected messages, and boundaries in external data.
- Put the exact TC ID in every test title.
- Use at least three distinct Playwright assertion patterns.
- Assert spec-correct outcomes for known bugs; do not weaken assertions to match the SUT.
- Use `beforeEach` and `afterEach`; keep tests order-independent.
- Use UI actions for setup, test steps, assertions, and cleanup.
- Do not use `request`, `APIRequestContext`, `fetch`, direct endpoint calls, `waitForResponse`/response-status assertions, database queries/assertions, API seeding, or API cleanup.
- Do not use `waitForTimeout()` above 500 ms, brittle XPath/`nth-child`, unnecessary `page.evaluate()`, or `innerHTML` assignments.
- Authenticated tests request `userPage`, `adminPage`, or the corresponding typed page-object fixture; unauthenticated tests use the default isolated `page`/page-object fixture.
- Add `@FR06`, `@FR08`, or `@FR15`.

## Gate and hand off

Run JSON validation, TypeScript checking, `playwright test --list` for the current spec, and static searches for prohibited patterns including API-testing primitives. Do not execute the full multi-browser suite before script-review.

After successful generation, invoke `ai-audit-logger` once for this invocation. Then stop at the script-review gate; do not start another FR.
