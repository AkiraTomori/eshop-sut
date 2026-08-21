# Pool A — FR-03 Password Recovery Pipeline

Use `../templates/api-pipeline-template.md` as the detailed working format.

## Scope

- `POST /api/forgot-password`
- `POST /api/reset-password`
- No GET tests.

## Stage 1 command sequence

1. `/domain-test pool-a` — inventory all parameters across both steps, including `email`, `resetToken`, `newPassword`, authentication/context dependencies, and every constraint supported by the SRS/spec.
2. `/state-transition pool-a` — `NoOTP → OTPValid → OTPUsed/Expired`, including every invalid state × event transition.
3. `/security-check pool-a` — applicable SEC requirements, especially OTP binding, expiry, one-time use, injection handling, password exposure, and response schemas.

## Expected future artifacts

- `pool-a-test-cases.csv` or `.xlsx`
- Pool A folder(s) inside the approved Postman collection
- Pool A runner data JSON/CSV
- Pool A Newman HTML report
- Pool A execution screenshot(s)
- Pool A bug report/issue links, or explicit no-defect result

Do not create or claim these artifacts before their confirmed stage.

