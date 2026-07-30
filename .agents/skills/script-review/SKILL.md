---
name: script-review
description: "Review and correct one current HW04 FR's AI-generated Playwright spec and external test data against its complete HW2 sources, live SUT locators, isolation rules, and Playwright quality patterns. Use after automation-script-gen and before multi-browser execution."
---

# Review and correct one FR

Obey `AGENTS.md`; remain in the current FR.

Read the current spec, data file, full HW2 test-case file, HW2 bug report, and SRS. Invoke `playwright-core` and `playwright-pom` as supporting skills and read:

- `../playwright/core/locator-strategy.md`
- `../playwright/core/assertions-and-waiting.md`
- `../playwright/core/fixtures-and-hooks.md`
- `../playwright/core/flaky-tests.md`
- `../playwright/core/common-pitfalls.md`
- `../playwright/core/test-organization.md`
- `../playwright/pom/pom-vs-fixtures-vs-helpers.md`

Re-check whether the generated structure should remain fixtures/helpers or use POM; do not force POM without repeated page behaviour. If `playwright-cli` is installed, it may be used as a supporting skill for authorized live locator/flow verification after taking a snapshot. Otherwise use React source/DOM inspection and standard Playwright tooling. Record the decision, fallback, and all supporting guides in this invocation's audit block.

## Review in order

1. **Traceability:** exact TC IDs/titles; steps and expected results match HW2; Bug IDs match the detailed bug report. Document source discrepancies.
2. **Coverage and scope:** at least 12 UI TCs; required EP/NEG/BV priorities represented; API-dependent TCs listed as `Out of HW4 scope — API testing` and replaced; manual-only claims have concrete UI blockers.
3. **Data separation:** no test inputs, URLs, credentials, boundaries, or messages hardcoded in test bodies.
4. **Locators:** verify against live DOM/source; prefer accessible locators; reject invented selectors.
5. **Assertions:** verify every UI-observable expected-result clause, document non-UI clauses as not covered, use web-first assertions, and keep at least three distinct patterns.
6. **Isolation:** require `beforeEach`/`afterEach`, unique created data, UI-only setup/cleanup, and no order dependency.
7. **Reliability:** remove sleeps, missing `await`, broad catches, forced actions, and unnecessary `page.evaluate()`.
8. **Known bugs:** assert the spec-correct result and annotate the existing defect without skipping or weakening the test.
9. **No API testing:** reject `request`, `APIRequestContext`, `fetch`, direct endpoint calls, `waitForResponse`/response-status assertions, database assertions, API seeding, and API cleanup.

Colour checks may use `toHaveCSS`; tab-order checks may use keyboard focus assertions. Do not call these inherently manual.

## Correct and document

Apply in-scope fixes to the current spec/data, then create or update:

```text
23127379_Homework/HW4/Pool-[X]_FR##/fr##-automation-review.md
```

Include:

- TC coverage table
- each issue, severity, original pattern, correction, and root cause
- HW2 source discrepancies
- API-dependent HW2 TCs excluded from HW4, with replacement UI TC IDs
- any genuinely non-automatable step and concrete reason
- known failures expected during execution
- assertion-pattern inventory
- final quality assessment
- `Human Review: Pending HITL sign-off`

Validate JSON, TypeScript, test discovery, and prohibited-pattern searches. After review completes, invoke `ai-audit-logger` once. Do not mark the FR complete and do not start another FR until three browser runs and bug classification finish.
