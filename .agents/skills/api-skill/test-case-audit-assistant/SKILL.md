---
name: test-case-audit-assistant
description: "Audit raw HW06 test-case tables against the SRS/API specification and propose VALID, INVALID, or INCOMPLETE labels before Postman collection construction."
---

# Test Case Audit Assistant

This skill only **proposes labels and reasons**. Do not directly edit, delete, merge, or add to the source test cases; do not treat the audit table as final or proceed to the Postman builder without user confirmation.

## 1. Expected input

- Raw test-case tables from `domain-testing`, `decision-table-testing`, `state-transition-testing`, and `security-schema-checklist`.
- Each case's endpoint/method, preconditions, request, expected status/response/side effect, partition/rule/transition/threat, and requirement source.
- The current `README.md` and `api_specification.md` as ground truth.

The scope includes only POST/PUT requests for FR-03, FR-08, and FR-15. FR-03 is one two-step workflow API unit; reject any case that tests a GET endpoint.

## 2. Step-by-step process

1. Preserve every original row and ID. Normalize only the displayed audit copy when necessary; never overwrite source data.
2. Compare the endpoint, method, request fields, business rules, role, state, expected response, and status against the SRS/API specification.
3. Assign exactly one `Proposed label`:
   - `VALID`: complete, consistent with the specification, and traceable.
   - `INVALID`: contradicts the specification, is out of scope, uses GET, or contains clearly incorrect expected behavior.
   - `INCOMPLETE`: lacks a precondition/input/expected result/source, depends on an unspecified rule/status/schema, or does not isolate the intended condition.
4. Write a specific `Reason`, cite the FR/SEC/API section, and identify exactly what is missing or incorrect. A `Suggested user action` may be included, but never modify the case automatically.
5. Summarize coverage by API unit and technique. Warn when an API unit has fewer than 35 cases, IDs are duplicated, negative/security/schema cases are missing, or FR-03 does not adequately cover both endpoints.

After the audit, stop and ask the user to confirm or revise the result. Only a user-approved table may become input for `postman-collection-builder`. Record the AI invocation through `ai-audit-logger` when that logger is operating.

## 3. Output format

### Proposed audit table

| Test Case ID | API unit | Technique | Original case summary | Original expected result | Original source | Proposed label | Reason | Suggested user action |
|---|---|---|---|---|---|---|---|---|

### Coverage summary

| API unit | Total cases | VALID | INVALID | INCOMPLETE | Domain | Decision table | State | Security/Schema | Meets ≥35? |
|---|---|---|---|---|---|---|---|---|---|

End the output with: `Status: PROPOSED AUDIT — no case was automatically edited or approved; pending user confirmation.`

## 4. Short input → output example

**Input:** `FR08-DT-001` describes successful checkout but does not specify the cart state after the response.

**Output:**

| Test Case ID | API unit | Technique | Original case summary | Original expected result | Original source | Proposed label | Reason | Suggested user action |
|---|---|---|---|---|---|---|---|---|
| FR08-DT-001 | FR-08 Checkout | Decision table | Valid token, non-empty cart, valid address | Create order | README FR-08 | INCOMPLETE | FR-08 also requires clearing the cart after successful checkout, but this case has no corresponding expected side effect | User should consider adding a cart-clearing check |
