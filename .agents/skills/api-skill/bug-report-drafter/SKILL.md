---
name: bug-report-drafter
description: "Analyze failed or unexpected Newman results and draft a Markdown bug report plus GitHub Issue content for user review and manual posting."
---

# Bug Report Drafter

Create only a **proposed bug report** from supplied real evidence. Do not rerun Newman, call an API, post a GitHub Issue, or treat a failure as a defect before excluding test, data, and environment problems.

## 1. Expected input

- A failed or unexpected Newman result containing the test case ID, redacted request/response, assertion, timestamp, and environment.
- The audited and approved test-case table and its oracle from `README.md` or `api_specification.md`.
- Collection/data version, SUT version or commit when available, and reproduction state.
- Existing logs or images; never ask AI to fabricate a screenshot.

Handle only POST/PUT requests for FR-03, FR-08, and FR-15. Mark failures from GET endpoints or outside this scope as out of scope.

## 2. Step-by-step process

1. Compare the failure with the approved case and requirement source; verify that the expected result is not based on an unspecified assumption.
2. Assign a preliminary classification: `Probable SUT defect`, `Test script/data issue`, `Environment/setup issue`, `Duplicate/known issue`, or `Insufficient evidence`.
3. Draft a bug only for `Probable SUT defect`. Group failures under one root cause only when evidence supports it; do not combine independent behaviors. Redact tokens, OTPs, passwords, and PII.
4. Write minimal reproduction steps, method/endpoint, preconditions, request, expected result, actual result, impact, requirement reference, and evidence. Do not add a GET verification step.
5. Produce both a Markdown report and content ready to paste into GitHub Issues. Include the mandatory placeholder reminding the user to attach a real screenshot.
6. Stop for the user to approve the content, proposed severity, and posting decision; never post automatically or proceed to CI/CD.

Record the AI invocation through `ai-audit-logger` when that logger is operating.

## 3. Output format

### Failure classification table

| Failure ID | Test Case ID | Proposed classification | Evidence | Requirement source | Reason/missing evidence |
|---|---|---|---|---|---|

### Markdown bug report

```markdown
# BUG-<id>: <title>

- API/FR:
- Proposed severity:
- Environment/SUT version:
- Test Case ID:
- Requirement source:

## Preconditions
## Reproduction steps
## Expected result
## Actual result
## Impact
## Evidence
- Newman excerpt: <redacted excerpt/path>
- Screenshot: [USER MUST ATTACH A REAL SCREENSHOT]
```

### GitHub Issue content

- `Title`: a concise title containing the endpoint/FR and incorrect behavior.
- `Body`: Preconditions, Reproduction Steps, Expected, Actual, Impact, Evidence, and the screenshot placeholder.
- `Proposed labels`: suggestions only; do not apply them automatically.

End the output with: `Status: PROPOSED BUG REPORT — pending user review and manual posting.`

## 4. Short input → output example

**Input:** Newman reports that `FR08-SEC-004` failed because the server stored `total_amount=1` instead of the actual cart total; the oracle is README FR-08.

**Condensed output:**

- Proposed classification: `Probable SUT defect`.
- Title: `[FR-08][POST /api/checkout] Backend accepts tampered total_amount`.
- Expected: the backend recalculates the total from the cart.
- Actual: response/order evidence shows a total of `1`.
- Screenshot: `[USER MUST ATTACH A REAL SCREENSHOT]`.

