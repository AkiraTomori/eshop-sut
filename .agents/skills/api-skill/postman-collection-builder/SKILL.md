---
name: postman-collection-builder
description: "Convert an audited and user-approved HW06 test-case table into a data-driven Postman collection, environment, and runner data files."
---

# Postman Collection Builder

Build only **proposed artifacts** after the user confirms the audit table. Do not run Postman/Newman, call EShop, treat the collection as final, or proceed automatically to bug reporting or CI/CD.

## 1. Expected input

- A test-case table processed by `test-case-audit-assistant`, plus evidence that the user approved the cases allowed into the collection.
- At least 35 cases for each HW06 API unit:
  - Pool A / FR-03: `POST /api/forgot-password` + `POST /api/reset-password` workflow;
  - Pool B / FR-08: `POST /api/checkout`;
  - Pool C / FR-15: `PUT /api/products/:id`.
- Student ID, default base URL `http://localhost:3000`, fixture data, and token placeholders.
- Expected status, response/schema, side effect, and requirement source for every case.

If approval is missing, any `INVALID/INCOMPLETE` case remains unresolved by the user, or an API unit has fewer than 35 cases, stop and report the gap; do not generate replacement cases automatically.

## 2. Step-by-step process

1. Validate the approved input, unique IDs, selected POST/PUT methods only, absence of real secrets, and at least 35 cases per API unit.
2. Create one Postman Collection v2.1 with exactly one folder per API unit: `Pool A - FR-03 Password Reset`, `Pool B - FR-08 Checkout`, and `Pool C - FR-15 Update Product`. The FR-03 folder contains both requests in the two-step workflow. Add no GET request.
3. Parameterize URLs, path IDs, bodies, authentication, and expected values using environment/data variables. Preserve the `Test Case ID`, technique, and requirement relationship in request/test names or descriptions.
4. Add this collection-level pre-request script so it applies to **every Newman/Postman request**:

   ```javascript
   pm.request.headers.upsert({
     key: 'X-Student-Id',
     value: pm.environment.get('StudentID')
   });
   ```

   The script must fail clearly or warn when `StudentID` is empty; never hard-code the student ID.
5. Create data-driven test scripts that validate status, Content-Type, schema/field/type, and side effects only when an approved oracle exists. Do not invent assertions for unspecified contract details.
6. Create environment JSON containing `baseUrl`, `StudentID`, and token/ID placeholders. Leave secrets empty or mark them local-only. Create a suitable JSON or CSV data file for each folder/API unit so Collection Runner/Newman can execute its test cases.
7. Statically inspect the structure and produce a manifest without executing the collection. Present the artifacts as proposals and stop for review.

Record the AI invocation through `ai-audit-logger` when that logger is operating.

## 3. Output format

### Proposed artifacts

- `{StudentID}_HW06_EShop.postman_collection.json`
- `{StudentID}_HW06_EShop.postman_environment.json`
- `{StudentID}_FR03_data.json` or `.csv`
- `{StudentID}_FR08_data.json` or `.csv`
- `{StudentID}_FR15_data.json` or `.csv`

### Minimum data columns

| testCaseId | requestName | enabled | requestBody/path variables | authVariant | expectedStatus | expectedSchema/fields | expectedSideEffect | requirementSource |
|---|---|---|---|---|---|---|---|---|

### Manifest

| Artifact | Folder/API | Case count | Method/Endpoint | Header script present? | User approval source | Status |
|---|---|---|---|---|---|---|

End the output with: `Status: PROPOSED COLLECTION — Postman/Newman not run; pending user review.`

## 4. Short input → output example

**Input:** Approved case `FR08-DT-001`, StudentID=`22123456`, expected behavior is backend total recalculation.

**Condensed output:**

```json
{
  "testCaseId": "FR08-DT-001",
  "requestName": "Checkout recalculates client total",
  "total_amount": 1,
  "shipping_address": "123 Le Loi Street, Ho Chi Minh City",
  "expectedStatus": "UNSPECIFIED_REVIEW_REQUIRED",
  "requirementSource": "README FR-08"
}
```

The manifest marks `X-Student-Id` as sourced from the environment and the artifact status as `PROPOSED`.
