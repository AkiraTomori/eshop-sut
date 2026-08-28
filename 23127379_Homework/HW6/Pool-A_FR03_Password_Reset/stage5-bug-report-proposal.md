# Pool A / FR-03 — Stage 5 Bug Report Proposal

> Scope: real evidence from the confirmed Stage 4 run of `POST /api/forgot-password` and `POST /api/reset-password` only. No API was rerun for this triage and no GET request was added. The three accepted findings were posted as GitHub Issues 68–70 on 2026-08-28, with redacted MSSV screenshots linked below.

## Evidence and reproduction state

| Item | Value |
|---|---|
| Execution window | 2026-08-21T16:25:45+07:00–2026-08-21T16:25:47+07:00 |
| Environment | Local Docker container `eshop-sut-backend-1`, `127.0.0.1:3000` |
| Repository HEAD | `f82ecf0a87aad4a9c11382b794509bf96ddc4a03` |
| Backend source version | Last `backend/server.js` commit `2905279438ecc8ec249e43963d14eb607be0f1a9`; SHA-256 `a9033d50e90f311b5d3448b277dc828efb5153a14590897633f5289c347bb8c9` |
| Newman result | 62 iterations; 79 POST requests; 266 assertions; 230 passed; 36 failed |
| Header evidence | Every executed request used the supplied `X-Student-Id`; zero header assertion failures |
| Primary evidence | `postman/newman/Pool-A_FR03_report.json`, `postman/newman/Pool-A_FR03_report.html`, `evidence/Pool-A_FR03_newman-cli.txt` |
| Database evidence | Redacted `evidence/Pool-A_FR03_fixture-snapshot-before.json` and `evidence/Pool-A_FR03_fixture-snapshot-after.json`; disposable rows were deleted after capture |
| Existing screenshot | `evidence/image.png` is a real Newman dashboard screenshot showing 79 requests and 36 failures, but it does not show failure details |
| Posted issue screenshots | `../evidence/github-issues/BUG-PA-001_23127379.png`, `BUG-PA-002_23127379.png`, and `BUG-PA-003_23127379.png`; each is embedded in its mapped GitHub Issue comment |

## False-positive exclusion

| Check | Finding |
|---|---|
| Approved oracle | Six-digit OTP is explicit in README FR-03 and SEC-07 and exemplified by API specification §1.3. Strong-password rejection is explicit through README FR-03 → FR-01. Plaintext storage is prohibited by SEC-01. |
| Test data | Each password-validation case obtained a fresh live token, then isolated one invalid `newPassword` class. The database check used one disposable primary row and redacted the credential value. |
| Environment | TCP readiness passed; all final-run URLs used one `/api/` separator; there were no request, script, DNS, or connection failures. |
| Header | `X-Student-Id` assertions all passed. |
| Runner correction | The initial diagnostic run produced false 404s because dynamic URLs rendered as `//api/...`. That collection defect was fixed, fixtures were restored, and all diagnostic reports were overwritten. It is classified as `Test script/data issue` and excluded from SUT bugs. |
| Unspecified behavior | No bug relies on an unspecified error status or response schema. The reports use only explicit OTP length, password rules, and non-plaintext storage requirements. |

## Failure classification table

| Failure ID | Test Case ID | Proposed classification | Evidence | Requirement source | Reason/missing evidence |
|---|---|---|---|---|---|
| PA-F-OTP-001 | 27 assertions across 26 cases: `FR03-DOM-001`, `010`, `011`, `028`–`036`; `FR03-EXT-DOM-001`–`006`; `FR03-SCH-001`; `FR03-SEC-011`, `012`, `014`; `FR03-ST-001`, `008`, `013`, `014` | Probable SUT defect | Every failure observed a four-digit string where `/^[0-9]{6}$/` was required; no other OTP-shape failure signature occurred | README FR-03; SEC-07; API specification §1.3 | Repeated assertions share one supported OTP-generation root cause; `FR03-ST-013` observes it twice in one lifecycle |
| PA-F-PWD-001 | `FR03-DOM-028`–`FR03-DOM-036` | Probable SUT defect | All nine target requests returned HTTP `200` and `{"message":"Password reset successfully"}` for invalid password classes | README FR-03 → FR-01; API specification §1.4 | Fresh-token setup succeeded for every case; the invalid class was isolated and the expected rejection is specified |
| PA-F-SEC-001 | `FR03-EXT-SEC-001` | Probable SUT defect | Redacted post-run database evidence reports `passwordStorageType=text` and `equalsFinalExpectedRuntimePassword=true` for the disposable primary row | README SEC-01; FR-03; API specification §1.4 | The approved white-box oracle is explicit. Values are redacted and the row was deleted after inspection |
| PA-F-RUNNER-001 | Superseded diagnostic run | Test script/data issue | Diagnostic-only `//api/...` requests returned false 404s | Collection URL construction | Corrected before the final run; not included in the 36 final failures and no SUT report drafted |

The 36 final assertion failures reduce to two response-level SUT defects. The approved white-box observation adds one independent persistence defect. These are kept as three reports because OTP generation, input validation, and credential storage are separate behaviors and impacts.

---

# BUG-PA-001: Forgot-password generates four-digit OTPs instead of six digits

- API/FR: FR-03 — `POST /api/forgot-password`
- Proposed severity: High
- Environment/SUT version: Local Docker `eshop-sut-backend-1`; repository HEAD `f82ecf0a87aad4a9c11382b794509bf96ddc4a03`
- Test Case ID: 27 failed assertions across the 26 cases listed under `PA-F-OTP-001`
- Requirement source: README FR-03; README SEC-07; API specification §1.3
- GitHub Issue: [Issue 68](https://github.com/AkiraTomori/eshop-sut/issues/68)
- Screenshot comment: [MSSV 23127379 evidence](https://github.com/AkiraTomori/eshop-sut/issues/68#issuecomment-5455295856)

## Preconditions

- The authorized local Docker backend is listening on `127.0.0.1:3000`.
- A disposable registered email exists.
- The collection-level pre-request script supplies the required student header.

## Reproduction steps

1. Send `POST /api/forgot-password` with JSON `{"email":"<DISPOSABLE_REGISTERED_EMAIL>"}`.
2. Inspect the successful response body without logging or publishing the token value.
3. Check that `resetToken` is a string matching `/^[0-9]{6}$/`.

## Expected result

HTTP `200` returns the documented message and a random six-digit decimal-string `resetToken`.

## Actual result

HTTP `200` returned the documented response shape, but every observed token was a four-digit decimal string (`<REDACTED_4_DIGIT_OTP>`). Twenty-seven assertions reproduced the same behavior.

## Impact

The recovery token violates FR-03 and SEC-07 and has materially less search space than the required six-digit OTP, weakening account-recovery security.

## Evidence

- Newman excerpt: `evidence/Pool-A_FR03_newman-cli.txt` — assertion failures beginning with `FR03-DOM-001 - exact forgot-password schema`
- Machine-readable evidence: `postman/newman/Pool-A_FR03_report.json`
- Screenshot: [BUG-PA-001_23127379.png](../evidence/github-issues/BUG-PA-001_23127379.png), embedded in [Issue 68 evidence comment](https://github.com/AkiraTomori/eshop-sut/issues/68#issuecomment-5455295856)

## GitHub Issue content

- **Title:** `[FR-03][POST /api/forgot-password] Recovery endpoint generates four-digit OTPs instead of six digits`
- **Body:**
  - Preconditions: authorized local Docker backend and a disposable registered account.
  - Reproduction: POST a registered email to `/api/forgot-password`; inspect the successful `resetToken` length.
  - Expected: six decimal digits under README FR-03/SEC-07 and API specification §1.3.
  - Actual: repeated responses returned four-digit decimal-string tokens; values are redacted.
  - Impact: reduced OTP entropy and non-compliance with the password-recovery contract.
  - Evidence: Newman JSON/HTML excerpt and the redacted [MSSV screenshot](../evidence/github-issues/BUG-PA-001_23127379.png) embedded in [Issue 68](https://github.com/AkiraTomori/eshop-sut/issues/68#issuecomment-5455295856).
- **Proposed labels:** `bug`, `security`, `FR-03`, `api`

---

# BUG-PA-002: Reset-password accepts invalid new passwords

- API/FR: FR-03 — `POST /api/reset-password`
- Proposed severity: High
- Environment/SUT version: Local Docker `eshop-sut-backend-1`; repository HEAD `f82ecf0a87aad4a9c11382b794509bf96ddc4a03`
- Test Case ID: `FR03-DOM-028`–`FR03-DOM-036`
- Requirement source: README FR-03 → FR-01; API specification §1.4
- GitHub Issue: [Issue 70](https://github.com/AkiraTomori/eshop-sut/issues/70)
- Screenshot comment: [MSSV 23127379 evidence](https://github.com/AkiraTomori/eshop-sut/issues/70#issuecomment-5455295653)

## Preconditions

- A disposable registered email has a fresh valid recovery token.
- The target request otherwise follows API specification §1.4.

## Reproduction steps

1. Obtain a fresh token using `POST /api/forgot-password` for the disposable account.
2. Send `POST /api/reset-password` with the matching email/token and one invalid password class. A minimal representative is a seven-character value that otherwise contains uppercase, lowercase, digit, and an allowed special character.
3. Repeat independently for: missing uppercase, missing lowercase, missing digit, missing allowed special, disallowed-only `#`, missing `newPassword`, `null`, and numeric type.
4. Do not reuse tokens between cases; obtain a fresh token for each attempt.

## Expected result

Each request is rejected and the account password remains unchanged. Exact error status and schema are unspecified and are not asserted.

## Actual result

All nine requests returned HTTP `200` with `{"message":"Password reset successfully"}`.

## Impact

Attackers or users can set passwords that violate the required minimum length, character classes, allowed-special set, presence, and type constraints, weakening account security and allowing malformed credential state.

## Evidence

- Newman excerpt: `evidence/Pool-A_FR03_newman-cli.txt` — `FR03-DOM-028` through `FR03-DOM-036`, each failing the rejection-class assertion
- Machine-readable evidence: `postman/newman/Pool-A_FR03_report.json`
- Screenshot: [BUG-PA-002_23127379.png](../evidence/github-issues/BUG-PA-002_23127379.png), embedded in [Issue 70 evidence comment](https://github.com/AkiraTomori/eshop-sut/issues/70#issuecomment-5455295653)

## GitHub Issue content

- **Title:** `[FR-03][POST /api/reset-password] Endpoint accepts weak, missing, null, and non-string passwords`
- **Body:**
  - Preconditions: disposable registered account and a fresh valid recovery token per attempt.
  - Reproduction: submit the reset request with an invalid `newPassword` class, beginning with the seven-character boundary representative; repeat for the eight other isolated classes.
  - Expected: rejection and no password change under README FR-03 → FR-01.
  - Actual: all nine cases returned HTTP `200` and “Password reset successfully.”
  - Impact: the recovery path bypasses the specified strong-password policy and accepts malformed credential values.
  - Evidence: Newman JSON/HTML cases and the redacted [MSSV screenshot](../evidence/github-issues/BUG-PA-002_23127379.png) embedded in [Issue 70](https://github.com/AkiraTomori/eshop-sut/issues/70#issuecomment-5455295653).
- **Proposed labels:** `bug`, `security`, `validation`, `FR-03`, `api`

---

# BUG-PA-003: Reset-password persists the new password as plaintext

- API/FR: FR-03 / SEC-01 — `POST /api/reset-password`
- Proposed severity: Critical
- Environment/SUT version: Local Docker `eshop-sut-backend-1`; repository HEAD `f82ecf0a87aad4a9c11382b794509bf96ddc4a03`
- Test Case ID: `FR03-EXT-SEC-001`
- Requirement source: README SEC-01; README FR-03; API specification §1.4
- GitHub Issue: [Issue 69](https://github.com/AkiraTomori/eshop-sut/issues/69)
- Screenshot comment: [MSSV 23127379 evidence](https://github.com/AkiraTomori/eshop-sut/issues/69#issuecomment-5455295452)

## Preconditions

- Use one disposable account in the authorized local database.
- Record a narrowly scoped before-state and prepare a unique valid test password whose value will not be published.
- Have approved read access to only that disposable row and a cleanup method.

## Reproduction steps

1. Obtain a fresh token using `POST /api/forgot-password` for the disposable account.
2. Complete `POST /api/reset-password` with a valid unique password (`<REDACTED_PASSWORD>`).
3. Inspect only the disposable row's stored password value and compare it with the supplied plaintext without printing either value.
4. Capture a redacted boolean comparison and delete/restore the disposable row.

## Expected result

The persisted credential must not equal the supplied plaintext password. SEC-01 does not prescribe a specific hash algorithm, so no hash format is asserted.

## Actual result

The redacted post-run snapshot records `passwordStorageType=text` and `equalsFinalExpectedRuntimePassword=true` for the primary disposable row. The reset token was cleared, and the disposable rows were subsequently deleted.

## Impact

Database disclosure would directly expose usable account passwords. This violates SEC-01 and creates a high-impact credential-compromise risk.

## Evidence

- Before-state: `evidence/Pool-A_FR03_fixture-snapshot-before.json`
- Redacted post-state: `evidence/Pool-A_FR03_fixture-snapshot-after.json`
- Supporting Newman execution: `postman/newman/Pool-A_FR03_report.json`
- Screenshot: [BUG-PA-003_23127379.png](../evidence/github-issues/BUG-PA-003_23127379.png), embedded in [Issue 69 evidence comment](https://github.com/AkiraTomori/eshop-sut/issues/69#issuecomment-5455295452); no password value is exposed

## GitHub Issue content

- **Title:** `[SEC-01][FR-03][POST /api/reset-password] New password is persisted as plaintext`
- **Body:**
  - Preconditions: authorized local database access and one disposable account.
  - Reproduction: perform a successful reset with a unique redacted password, then compare only the disposable row's stored value with the input and record the boolean result.
  - Expected: stored credential does not equal plaintext; no specific hash format is assumed.
  - Actual: the redacted equality check returned true and storage type was text.
  - Impact: database compromise directly exposes usable credentials.
  - Evidence: both redacted fixture snapshots and the redacted [MSSV screenshot](../evidence/github-issues/BUG-PA-003_23127379.png) embedded in [Issue 69](https://github.com/AkiraTomori/eshop-sut/issues/69#issuecomment-5455295452).
- **Proposed labels:** `bug`, `security`, `critical`, `SEC-01`, `FR-03`, `api`

## Posting record

- `BUG-PA-001` → [Issue 68](https://github.com/AkiraTomori/eshop-sut/issues/68) and [screenshot comment](https://github.com/AkiraTomori/eshop-sut/issues/68#issuecomment-5455295856).
- `BUG-PA-002` → [Issue 70](https://github.com/AkiraTomori/eshop-sut/issues/70) and [screenshot comment](https://github.com/AkiraTomori/eshop-sut/issues/70#issuecomment-5455295653).
- `BUG-PA-003` → [Issue 69](https://github.com/AkiraTomori/eshop-sut/issues/69) and [screenshot comment](https://github.com/AkiraTomori/eshop-sut/issues/69#issuecomment-5455295452).
- Labels remain suggestions unless independently confirmed on GitHub.

Status: POSTED AND RECONCILED — Issue and screenshot URLs verified on 2026-08-28.
