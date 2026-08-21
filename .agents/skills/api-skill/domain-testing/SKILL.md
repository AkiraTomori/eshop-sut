---
name: domain-testing
description: "Perform a deep full-API parameter analysis and design Equivalence Partitioning and Boundary Value Analysis cases for every relevant input supported by the specification."
---

# Domain Testing

Create only **proposed test cases** for user review. Do not call an API, run Newman/Postman, treat the result as final, or proceed to the next skill without confirmation. Design only for POST/PUT endpoints in the HW06 scope; do not create tests for GET endpoints.

Use a depth-first analysis policy. Take as much reasoning time as necessary to inspect the complete request surface and specification before drafting cases. Do not stop after the first obvious field or optimize for a short response. Completeness and traceability are more important than speed.

## 1. Expected input

- API unit and requirement ID: FR-03 (`POST /api/forgot-password`, `POST /api/reset-password`), FR-08 (`POST /api/checkout`), or FR-15 (`PUT /api/products/:id`).
- The complete request surface: path parameters, headers that affect behavior, authentication context, body fields, and relevant cross-field dependencies.
- Data type, required/optional status, value domain, length, format, and business constraints for every relevant parameter.
- Constraint citations from `README.md` and/or `api_specification.md`.
- Valid baseline fixtures for isolating one invalid partition at a time.
- An optional user-specified focus area. A focus area narrows attention but does not remove the obligation to inventory every parameter.

If neither document defines a limit, mark it `Not specified`; do not invent a boundary or expected status code.

## 2. Step-by-step process

1. **Identify the complete input/output surface.** Inventory every endpoint in the selected API unit and every relevant path, header/auth, and body parameter. Record data type, required/optional status, constraints, dependencies, expected response/side effect, and FR/API-spec source. Mark undocumented details as `Not specified`. Do not silently omit a parameter because it appears optional or difficult to test.
2. **Identify valid and invalid Equivalence Classes for every parameter.** For a `range`, create exactly 1 valid class and 2 invalid classes: below the lower bound and above the upper bound. For a discrete value set, create 1 valid class per value and 1 shared invalid class. For a `must be` rule, create 1 valid class and 1 invalid class. Add wrong-type, missing, null, empty, malformed, or encoding classes only when the parameter semantics or specification justify them. Record cross-field dependencies separately so they can be traced to Decision Table or State Transition coverage when those techniques are more appropriate.
3. **Select representatives across the API.** Multiple independent valid classes may be combined into a minimal valid baseline case. Every invalid class must have its own test case while all unrelated parameters remain valid; never combine two invalid classes in one case. Use a coverage ledger to prove that every EC has at least one representative and that every parameter has been addressed.
4. **Perform Boundary Value Analysis for every supported range.** For each numeric, length, count, or time range with lower bound `LB` and upper bound `UB`, propose all of `LB-1`, `LB`, `LB+1`, `UB-1`, `UB`, and `UB+1`. If only one boundary is specified, analyze only that supported boundary and explicitly mark the other side as unspecified. Finish only after the coverage ledger accounts for every documented boundary.

Every case must have a traceable ID such as `FR15-DOM-001`. The Domain output may be extensive because HW06 requires domain partitions on every parameter. It remains one technique-specific Stage 1 output, not a generic prompt for the entire suite of at least 35 cases. After producing the complete proposal, stop for user review and record the AI invocation through `ai-audit-logger` when that logger is operating.

## 3. Output format

### Parameter inventory

| Parameter ID | Endpoint | Location | Parameter | Type | Required? | Constraint/dependency | Valid baseline | Specification source | Coverage status |
|---|---|---|---|---|---|---|---|---|---|

### Equivalence Class table

| EC ID | Parameter ID | Field | Partition type | Condition/domain | Valid? | Representative | Specification source |
|---|---|---|---|---|---|---|---|

### Proposed test-case table

| Test Case ID | Endpoint | Method | Objective | Preconditions | Input/body | Expected status | Expected response/side effect | EC/Partition tested | Source |
|---|---|---|---|---|---|---|---|---|---|

### Coverage ledger

| Parameter ID | Valid ECs covered | Invalid ECs covered separately? | Boundaries covered | Related non-domain technique | Gap/unspecified contract |
|---|---|---|---|---|---|

End the output with: `Status: PROPOSED — pending user confirmation; not approved as automatic input for the next stage.`

## 4. Short input → output example

**Input:** Pool C / FR-15, `PUT /api/products/:id`; analyze all relevant parameters.

**Condensed output:**

| Parameter ID | Endpoint | Location | Parameter | Type | Required? | Constraint/dependency | Valid baseline | Specification source | Coverage status |
|---|---|---|---|---|---|---|---|---|---|
| P-FR15-01 | `/api/products/:id` | path | `id` | integer | Yes | Existing target product; exact range not specified | Existing product ID | API spec 3.3, README FR-15 | EC required |
| P-FR15-02 | `/api/products/:id` | body | `name` | string | Yes | 1–255 characters | `A` | README FR-15 | EC + BVA required |
| P-FR15-03 | `/api/products/:id` | body | `price` | number | Yes | `> 0` | `1` | README FR-15 | EC + one-sided BVA required |

| EC ID | Parameter ID | Field | Partition type | Condition/domain | Valid? | Representative | Specification source |
|---|---|---|---|---|---|---|---|
| EC-NAME-V1 | P-FR15-02 | name | range | 1–255 characters | Yes | `A` | README FR-15 |
| EC-NAME-I1 | P-FR15-02 | name | range | < 1 character | No | `""` | README FR-15 |
| EC-PRICE-I1 | P-FR15-03 | price | range | `<= 0` | No | `0` | README FR-15 |

| Test Case ID | Endpoint | Method | Objective | Preconditions | Input/body | Expected status | Expected response/side effect | EC/Partition tested | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR15-DOM-001 | `/api/products/:id` | PUT | Test LB | Valid admin; existing product | 1-character `name`; all other fields valid | Not specified | Accept the name and update only the targeted product | EC-NAME-V1 / LB | README FR-12, FR-15 |
