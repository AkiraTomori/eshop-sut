# Pool B — FR-08 Checkout Pipeline

Use `../templates/api-pipeline-template.md` as the detailed working format.

## Scope

- `POST /api/checkout`
- No GET tests.

## Stage 1 command sequence

1. `/domain-test pool-b` — inventory every request/auth parameter and documented constraint, including `total_amount`, `shipping_address`, token context, and cart-related preconditions.
2. `/decision-table pool-b` — create all 16 full rules for login, empty cart, client total match, and valid address; reduce only after the full table is complete.
3. `/security-check pool-b` — authentication, total tampering, injection/XSS where applicable, schema, and state-protection cases.

## Expected future artifacts

- `pool-b-test-cases.csv` or `.xlsx`
- Pool B folder inside the approved Postman collection
- Pool B runner data JSON/CSV
- Pool B Newman HTML report
- Pool B execution screenshot(s)
- Pool B bug report/issue links, or explicit no-defect result

Do not create or claim these artifacts before their confirmed stage.

