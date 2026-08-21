# Pool C — FR-15 Update Product Pipeline

Use `../templates/api-pipeline-template.md` as the detailed working format.

## Scope

- `PUT /api/products/:id`
- No GET tests.

## Stage 1 command sequence

1. `/domain-test pool-c` — inventory `id`, admin/auth context, `name`, `price`, `description`, `imageUrl`, `category_id`, and every documented type/range/required constraint.
2. `/security-check pool-c` — missing/invalid token, non-admin role, injection/XSS where applicable, object targeting, forbidden fields, schema, and assurance that only the targeted product changes.

## Expected future artifacts

- `pool-c-test-cases.csv` or `.xlsx`
- Pool C folder inside the approved Postman collection
- Pool C runner data JSON/CSV
- Pool C Newman HTML report
- Pool C execution screenshot(s)
- Pool C bug report/issue links, or explicit no-defect result
- Pool-local AI audit: `ai_audit_report.md`, with every row human-reviewed before Pool completion

Do not create or claim these artifacts before their confirmed stage.
