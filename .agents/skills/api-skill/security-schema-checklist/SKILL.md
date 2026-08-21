---
name: security-schema-checklist
description: "Generate applicable SEC-01 through SEC-07 security cases and response-schema checks for an endpoint with a known required role and specified contract."
---

# Security & Schema Checklist

Generate only **proposed cases** for an application the user is authorized to test. Do not send payloads, call an API, declare a vulnerability, or proceed to the next stage before user approval. Do not create tests for GET endpoints.

## 1. Expected input

- One POST/PUT endpoint within FR-03, FR-08, or FR-15.
- Required role/token, ownership/object rule, and allowed/forbidden fields.
- Request schema, response schema, and status codes from `README.md` and `api_specification.md`.
- Non-destructive fixture IDs/emails/carts/products and a state-recovery method when necessary.
- The applicable requirements among SEC-01 through SEC-07.

Do not treat a field, status, or schema absent from the specification as a known requirement. Mark it `Not specified` and ask the user to supply the contract instead of creating a fabricated assertion.

## 2. Step-by-step process

1. Build an applicability matrix for every SEC ID using `Applicable`, `Not applicable`, or `White-box check required`, with a reason:
   - SEC-01: passwords must not be plaintext. Black-box coverage can only verify that responses do not expose a password/hash; persistence must be marked as white-box.
   - SEC-02: missing, malformed, expired, or otherwise invalid tokens on protected APIs.
   - SEC-03: a regular-user token against an admin API such as `PUT /api/products/:id`; do not merely test token presence.
   - SEC-04: XSS payloads in fields that may be reflected or displayed; expected behavior is no dangerous reflection and proper escaping when rendered.
   - SEC-05: SQL injection payloads in path/body values; expected behavior is parameterized handling, no bypass, and no database-error disclosure.
   - SEC-06: mass-assignment or forbidden-field tampering such as `role`; for FR-08, also test `total_amount` tampering under FR-08 even though it is not a profile field.
   - SEC-07: at least six digits of OTP entropy, expiry, email binding, and one-time use.
2. Generate separate security cases for SQLi, IDOR/object targeting, role checks, token handling, forbidden-field tampering, reflected/stored XSS, and OTP behavior when applicable. Each case must focus on one threat, use a minimal payload, and specify that unauthorized state changes must not occur.
3. Generate schema-validation cases for success and error responses: status code, Content-Type, required/forbidden fields, type, nullability, and shape. Separate `specified` rules from `proposal requiring confirmation`.
4. Verify that there are no GET requests, no operations outside the assigned endpoint, no real secrets in test data, and no setup failure mislabeled as a security defect.

The output contributes to the suite of at least 35 cases per API unit but must not generate the entire suite in a single prompt. After producing the output, stop for review and record the AI invocation through `ai-audit-logger` when that logger is operating.

## 3. Output format

### Applicability matrix

| SEC ID / Threat | Applicability | Reason | Requirement source |
|---|---|---|---|

### Proposed checklist test cases

| Test Case ID | Endpoint | Category | Threat/Schema rule | Role/Auth setup | Payload/Mutation | Expected status | Expected response/schema | Expected state protection | Source |
|---|---|---|---|---|---|---|---|---|---|

### Schema contract

| Scenario | Status | Field | Required? | Type | Constraint | Source/Confidence |
|---|---|---|---|---|---|---|

End the output with: `Status: PROPOSED — pending user confirmation of applicability and unspecified contracts.`

## 4. Short input → output example

**Input:** `PUT /api/products/:id`, admin required, body contains `name`, `price`, `description`, `imageUrl`, and `category_id`.

**Condensed output:**

| SEC ID / Threat | Applicability | Reason | Requirement source |
|---|---|---|---|
| SEC-03 / role-check | Applicable | Product-modifying APIs must verify the admin role | README FR-12 |

| Test Case ID | Endpoint | Category | Threat/Schema rule | Role/Auth setup | Payload/Mutation | Expected status | Expected response/schema | Expected state protection | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR15-SEC-001 | `PUT /api/products/1` | Authorization | Role-check | Valid non-admin user JWT | Valid product body | Not specified | Error response exposes no internals | Product 1 and all other products remain unchanged | README FR-12, FR-15 |

