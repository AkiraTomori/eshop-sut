---
name: domain-testing
description: "Design API test cases with Equivalence Partitioning and Boundary Value Analysis when a field, data type, and specification constraints are available."
---

# Domain Testing

Create only **proposed test cases** for user review. Do not call an API, run Newman/Postman, treat the result as final, or proceed to the next skill without confirmation. Design only for POST/PUT endpoints in the HW06 scope; do not create tests for GET endpoints.

## 1. Expected input

- Endpoint and requirement ID: FR-03 (`POST /api/forgot-password`, `POST /api/reset-password`), FR-08 (`POST /api/checkout`), or FR-15 (`PUT /api/products/:id`).
- Exactly one field to analyze.
- Data type, required/optional status, value domain, length, or format.
- Constraint citations from `README.md` and/or `api_specification.md`.
- Valid baseline values for fields that are not under analysis.

If neither document defines a limit, mark it `Not specified`; do not invent a boundary or expected status code.

## 2. Step-by-step process

1. **Identify input/output.** Record the endpoint, input field, data type, constraint, expected response/status, and FR/API-spec source. Keep every other field valid to isolate the variable under test.
2. **Identify valid and invalid Equivalence Classes.** For a `range`, create exactly 1 valid class and 2 invalid classes: below the lower bound and above the upper bound. For a discrete value set, create 1 valid class per value and 1 shared invalid class. For a `must be` rule, create 1 valid class and 1 invalid class. Create additional wrong-type, missing, or null classes only when the constraint/spec supports them.
3. **Select representatives.** Multiple independent valid classes may be combined in one valid test case. Every invalid class must have its own test case while all other fields remain valid; never combine two invalid classes in one case.
4. **Perform Boundary Value Analysis.** For each range with lower bound `LB` and upper bound `UB`, propose all of `LB-1`, `LB`, `LB+1`, `UB-1`, `UB`, and `UB+1`. If only one boundary is specified, analyze only that supported boundary and explicitly mark the other side as unspecified.

Every case must have a traceable ID such as `FR15-DOM-001`. This proposal is one part of a technique-by-technique case-generation process; do not turn it into one prompt that generates the entire suite of at least 35 cases. After producing the output, stop for user review and record the AI invocation through `ai-audit-logger` when that logger is operating.

## 3. Output format

### Equivalence Class table

| EC ID | Field | Partition type | Condition/domain | Valid? | Representative | Specification source |
|---|---|---|---|---|---|---|

### Proposed test-case table

| Test Case ID | Endpoint | Method | Objective | Preconditions | Input/body | Expected status | Expected response/side effect | EC/Partition tested | Source |
|---|---|---|---|---|---|---|---|---|---|

End the output with: `Status: PROPOSED — pending user confirmation; not approved as automatic input for the next stage.`

## 4. Short input → output example

**Input:** FR-15, field `name`, string, required, length 1–255 characters.

**Condensed output:**

| EC ID | Field | Partition type | Condition/domain | Valid? | Representative | Specification source |
|---|---|---|---|---|---|---|
| EC-NAME-V1 | name | range | 1–255 characters | Yes | `A` | README FR-15 |
| EC-NAME-I1 | name | range | < 1 character | No | `""` | README FR-15 |
| EC-NAME-I2 | name | range | > 255 characters | No | 256-character string | README FR-15 |

| Test Case ID | Endpoint | Method | Objective | Preconditions | Input/body | Expected status | Expected response/side effect | EC/Partition tested | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR15-DOM-001 | `/api/products/:id` | PUT | Test LB | Valid admin; existing product | 1-character `name`; all other fields valid | Not specified | Accept the name and update only the targeted product | EC-NAME-V1 / LB | README FR-12, FR-15 |

