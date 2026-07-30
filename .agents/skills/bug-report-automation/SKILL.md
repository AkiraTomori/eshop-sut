---
name: bug-report-automation
description: "Classify all failing results from one current HW04 FR browser run, link known HW2 defects, and draft new automation-discovered bug entries and GitHub Issue content. Use once per FR after its three browser reports exist."
---

# Classify one FR run

Obey `AGENTS.md`; batch all failures from the current FR in one invocation.

## Inputs

Read:

- current FR spec and data
- current FR automation review
- Chromium, Firefox, and WebKit reports/results
- failure screenshots and traces
- current FR HW2 test cases and bug report
- `23127379_Homework/HW4/bug_report.md`

Invoke `playwright-core` and `playwright-ci` as supporting skills. Read:

- `../playwright/core/debugging.md`
- `../playwright/core/trace-analysis.md`
- `../playwright/core/error-index.md`
- `../playwright/ci/reporting-and-artifacts.md`

If installed, `playwright-cli` may be used for a focused, authorized reproduction or trace capture after snapshotting the page. Record all supporting skills/guides and any CLI fallback in this invocation's audit block.

## Classify every failure

For each failure:

1. If the locator, data, environment, setup, or assertion is wrong, classify it as a test/infrastructure issue. Return it to script-review; do not file a product bug.
2. If a test used direct API/database operations or came from an API-dependent HW2 TC, classify it as an out-of-scope automation issue and return it to script-review for UI-TC replacement.
3. If expected UI behaviour matches HW2/SRS and actual UI behaviour differs, classify it as a genuine product defect.
4. If it matches an HW2 defect, reuse the canonical HW2 Bug ID and GitHub link. Do not create a duplicate.
5. Otherwise assign the next available `BUG-FR##-AUTO-###`.

Preserve the severity vocabulary used by the HW2 bug report (`Fatal`, `Serious`, `Medium`, `Cosmetic`) unless HITL requests another scheme.

## Update artefacts

Update `23127379_Homework/HW4/bug_report.md` with:

- Bug ID and source TC
- affected browsers
- exact reproducible steps
- spec-correct expected and observed actual result
- exact assertion failure
- screenshot, trace, and HTML report paths
- SRS reference and user impact
- known/new classification
- GitHub Issue URL for known bugs or `Pending HITL creation` for new bugs

Update the current `fr##-automation-review.md` Known Failures section with the same classification.

Prepare ready-to-paste GitHub Issue content for new bugs, but do not create external issues without explicit user authorization. Never fabricate screenshots, report results, issue numbers, or links.

After the batch is complete, invoke `ai-audit-logger` once. The FR completion gate still requires HITL sign-off and all three report paths.
