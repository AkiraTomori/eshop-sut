# Pool A / FR-03 — Security & Schema Checklist Proposal

> Scope: `POST /api/forgot-password` and `POST /api/reset-password` only. This is a test-design proposal: no API request has been sent, no database has been inspected, and no GET request is designed.

## Specification basis and interpretation rules

- The assignment requires stepwise security coverage for SEC-01 through SEC-07 and exact response-schema validation.
- Root `README.md` §FR-03 defines the two-step recovery workflow, a random six-digit OTP, password-policy inheritance from §FR-01, and email binding. Section 9 defines SEC-01 through SEC-07.
- Root `api_specification.md` §§1.3–1.4 defines both POST request bodies. Only forgot-password has a specified success response: status `200` and `{"message":"Mã đặt lại mật khẩu đã được tạo","resetToken":"123456"}`.
- The specification places these endpoints in Authentication but does not require a JWT for either endpoint. A recovery OTP is required by reset-password, but it is not a JWT and is assessed under SEC-07.
- Reset-password success status/schema, all error statuses/schemas, response `Content-Type`, OTP TTL, failed-attempt policy, and old-token behavior after reissue are not specified. They remain `Not specified` and cannot become strict automated assertions without human-supplied contracts.
- The API contract intentionally exposes `resetToken` in the forgot-password demo response. This proposal tests that documented behavior and does not misreport it as a vulnerability.

## Safe fixtures, isolation, and recovery

| Fixture | Definition |
|---|---|
| `E1` | A disposable, registered test email seeded directly in the test database; do not use personal data |
| `E2` | A second disposable, registered test email with an independently snapshotted record |
| `T1` | A fresh OTP dynamically captured from a successful forgot-password response for `E1`; never hard-code a real OTP |
| `P1` | Valid strong password satisfying FR-01, e.g. `Aa1!bbbb` |
| `P2` | A different valid strong recovery password, e.g. `Bb2@cccc` |
| State oracle | Compare approved test-database snapshots for only `E1` and `E2`; do not add an out-of-scope API request |
| Recovery | Restore disposable fixture rows from their snapshots after each case, or issue a fresh OTP and reset through the two scoped POST endpoints |

Each case uses a fresh disposable fixture/OTP unless it explicitly tests expiry or reuse. Payloads are inert strings in an authorized local test environment. Setup failure, missing fixture data, or unavailable deterministic clock control must be reported as `BLOCKED`, not as an SUT security defect.

## Applicability matrix

| SEC ID / Threat | Applicability | Reason | Requirement source |
|---|---|---|---|
| SEC-01 / password storage | White-box check required | The requirement is about persistence. API responses can be checked for password/hash exposure, but proving hashing requires an approved database/code inspection. | README §9 SEC-01; skill constraint |
| SEC-02 / JWT handling | Not applicable | Neither scoped authentication endpoint is documented as JWT-protected. The reset OTP is covered under SEC-07, not SEC-02. | API spec §§1.3–1.4; README §9 SEC-02 |
| SEC-03 / admin role | Not applicable | Neither endpoint is an admin API and no role is part of either request contract. | API spec §§1.3–1.4; README §9 SEC-03 |
| SEC-04 / XSS reflection | Applicable | `email` is user-controlled and could be reflected in a response/UI. API checks can detect dangerous reflection; rendered escaping needs a separately authorized UI or white-box check. Passwords/tokens must not be reflected at all. | README §9 SEC-04; API spec §§1.3–1.4 |
| SEC-05 / SQL injection | Applicable | All three request fields may reach database-backed lookup/update logic and must be handled without query bypass or database-error disclosure. | README §9 SEC-05; API spec §§1.3–1.4 |
| SEC-06 / profile role mass assignment | Not applicable | SEC-06 is explicitly about profile updates. Pool A does not update a profile and the scoped contracts contain no `role` field. Unknown-field rejection is not specified and is not invented here. | README §9 SEC-06; API spec §§1.3–1.4 |
| SEC-07 / OTP entropy, binding, expiry, one-time use | Applicable | FR-03 and SEC-07 directly govern this recovery workflow. Exact TTL, sampling threshold, retry limit, and reissue policy are unspecified. | README FR-03 and §9 SEC-07 |
| Object targeting / email binding | Applicable | An OTP issued for `E1` must not authorize a password change for `E2`; this is the Pool A object-targeting analogue of IDOR. | README FR-03 |
| Forbidden-field tampering | Not applicable | No forbidden request field or unknown-field handling rule is defined for these endpoints; SEC-06 does not apply. | README §9 SEC-06; API spec §§1.3–1.4 |

## Proposed checklist test cases

| Test Case ID | Endpoint | Category | Threat/Schema rule | Role/Auth setup | Payload/Mutation | Expected status | Expected response/schema | Expected state protection | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR03-SEC-001 | `POST /api/forgot-password` | Injection | SQL injection in `email` | Anonymous; snapshot `E1`/`E2` | `{"email":"' OR '1'='1"}` | Not specified | No database error/stack/SQL text and no successful lookup caused by the predicate | No OTP is created for `E1`, `E2`, or another account because of query bypass | README SEC-05; API spec §1.3 |
| FR03-SEC-002 | `POST /api/reset-password` | Injection | SQL injection in `email` | Anonymous; fresh `T1` for `E1` | Replace only email with `' OR '1'='1`; keep `T1`, `P1` | Not specified | No database error/stack/SQL text; request must not authorize through query manipulation | Neither `E1` nor any other account password changes; `T1` consumption after failure is unspecified | README SEC-05; FR-03; API spec §1.4 |
| FR03-SEC-003 | `POST /api/reset-password` | Injection | SQL injection in `resetToken` | Anonymous; `E1`; preserve a fresh real `T1` for cleanup | Replace only token with `' OR '1'='1`; keep `E1`, `P1` | Not specified | No database error/stack/SQL text; malformed value must not bypass token comparison | `E1` password remains unchanged; whether the unrelated fresh `T1` remains usable is unspecified | README SEC-05; FR-03; API spec §1.4 |
| FR03-SEC-004 | `POST /api/reset-password` | Injection | SQL injection string treated as password data | Anonymous; fresh `T1` for disposable `E1` | Use valid strong password `Aa1!' OR '1'='1`; keep email/token valid | Not specified | No database error/stack/SQL text; no password/hash echoed | Only `E1` may change; `T1` becomes one-time used after success; persistence hashing needs the white-box check | README FR-01; SEC-01; SEC-05; SEC-07 |
| FR03-SEC-005 | `POST /api/forgot-password` | XSS | Dangerous reflection of `email` | Anonymous; snapshot fixtures | `{"email":"<script>alert(1)</script>"}` | Not specified | No executable markup or dangerous raw reflection in any response field; exact error schema unspecified | No account/OTP state changes through the payload | README SEC-04; API spec §1.3 |
| FR03-SEC-006 | `POST /api/reset-password` | XSS | Dangerous reflection of `email` | Anonymous; fresh `T1` for `E1` | Replace only email with `<script>alert(1)</script>`; keep `T1`, `P1` | Not specified | No executable markup or dangerous raw reflection; no password/token/hash returned | No password changes; failed-attempt token consumption is unspecified | README SEC-04; FR-03; API spec §1.4 |
| FR03-SEC-007 | `POST /api/reset-password` | Object authorization | OTP/email binding (IDOR-style target swap) | Anonymous; fresh `T1` issued for `E1`; snapshot `E1`/`E2` | `{"email":"<E2>","resetToken":"<T1>","newPassword":"<P1>"}` | Not specified | Rejection without sensitive account, token, password, or internal details; error shape unspecified | Neither `E1` nor `E2` password changes; `T1` retention after mismatch is unspecified | README FR-03; SEC-07 |
| FR03-SEC-008 | `POST /api/reset-password` | OTP handling | Missing recovery token | Anonymous; `E1`; snapshot state | Omit only `resetToken`; keep `E1`, `P1` | Not specified | Reject; exact error fields/types are unspecified; no sensitive/internal details | `E1` password remains unchanged | FR-03; API spec §1.4; SEC-07 |
| FR03-SEC-009 | `POST /api/reset-password` | OTP handling | Token does not meet six-decimal-digit structure | Anonymous; `E1`; snapshot state | Replace only `resetToken` with `12A45!`; keep `E1`, `P1` | Not specified | Reject; exact error schema unspecified | `E1` password remains unchanged | README FR-03; SEC-07 |
| FR03-SEC-010 | `POST /api/reset-password` | OTP lifecycle | Expired token | Anonymous; issue `T1`; deterministic clock/real configured TTL required | Submit `E1`, `T1`, `P1` after the configured TTL | Not specified | Reject expired token; exact status/error schema unspecified | Password remains unchanged and expired `T1` cannot regain validity | README SEC-07 |
| FR03-SEC-011 | `POST /api/reset-password` | OTP lifecycle | One-time-use/replay protection | Anonymous; issue `T1`; first reset with `P1` succeeds | Replay the identical `E1` + `T1` with `P2` | Not specified | Second request is rejected; exact status/error schema unspecified | Password remains `P1`; `T1` stays invalidated | README SEC-07 |
| FR03-SEC-012 | `POST /api/forgot-password` | OTP entropy/shape | Issued token is exactly six decimal digits | Anonymous; disposable registered `E1` | Valid `{"email":"<E1>"}` | `200` | Exact documented message; `resetToken` is a JSON string matching `^[0-9]{6}$` | A token is bound only to `E1`; use a fresh fixture lifecycle | README FR-03; SEC-07; API spec §1.3 |
| FR03-SEC-013 | `POST /api/forgot-password` | OTP entropy/randomness | Repeated issuance must use a secure random generator | Anonymous; disposable registered `E1`; approved request count needed | Request multiple tokens for `E1` and record only redacted fingerprints | `200` per documented successful issuance | Every response satisfies FR03-SEC-012; no statistical pass/fail threshold is asserted until sample size/collision policy is confirmed | Do not expose tokens in evidence; old-token validity after reissue is unspecified | README FR-03; SEC-07; proposal requiring confirmation |
| FR03-SEC-014 | `POST /api/forgot-password` | Sensitive-data exposure | Response must not expose password/hash | Anonymous; registered `E1` | Valid forgot-password body | `200` | Exact documented `message` and `resetToken`; no plaintext password, password hash, or unrelated user fields | No password change | README SEC-01; API spec §1.3; black-box limit from skill |
| FR03-SEC-015 | `POST /api/reset-password` | Sensitive-data exposure | Reset response must not expose password/hash/token | Anonymous; fresh `T1`; disposable `E1` | Valid reset body with `P1` | Not specified | No plaintext password, password hash, OTP, or unrelated user fields; complete success schema unspecified | Only `E1` changes; `T1` invalidated; verify hashing separately | README SEC-01; SEC-07; API spec §1.4 |
| FR03-SCH-001 | `POST /api/forgot-password` | Success schema | Exact specified successful response shape | Anonymous; registered `E1` | Valid forgot-password body | `200` | JSON object has required string `message` equal to `Mã đặt lại mật khẩu đã được tạo` and required string `resetToken` matching six digits; no additional fields under the assignment's exact-shape rule; `Content-Type` unspecified | Token is issued only for `E1`; password unchanged | Assignment §6.1; README FR-03; API spec §1.3 |
| FR03-SCH-002 | `POST /api/forgot-password` | Error schema | Error response contract gap | Anonymous; use one otherwise isolated invalid body such as missing `email` | Not specified | Not specified | Record only; do not assert status, fields, types, nullability, exact shape, or `Content-Type` until the contract is supplied; still reject sensitive/internal disclosure | No OTP/account change from invalid input | API spec §1.3 omission; proposal requiring confirmation |
| FR03-SCH-003 | `POST /api/reset-password` | Success schema | Success response contract gap | Anonymous; fresh `T1`; disposable `E1` | Valid reset body with `P1` | Not specified | Record only; do not assert status, fields, types, nullability, exact shape, or `Content-Type`; independently assert no sensitive fields and required state change | Only `E1` changes and `T1` is invalidated | README FR-03; SEC-07; API spec §1.4 omission |
| FR03-SCH-004 | `POST /api/reset-password` | Error schema | Error response contract gap | Anonymous; fresh `T1`; snapshot state | Use one invalid mutation such as wrong bound email | Not specified | Record only; do not assert status, fields, types, nullability, exact shape, or `Content-Type`; independently assert no sensitive/internal disclosure | No password change; token-retention policy unspecified | README FR-03; API spec §1.4 omission |

## Schema contract

| Scenario | Status | Field | Required? | Type | Constraint | Source/Confidence |
|---|---|---|---|---|---|---|
| Forgot-password success | `200` | response body | Yes | JSON object | Exact response example contains `message` and `resetToken`; no-additional-fields assertion follows assignment exact-shape wording | API spec §1.3 + assignment §6.1 — specified |
| Forgot-password success | `200` | `message` | Yes | string | Exact value `Mã đặt lại mật khẩu đã được tạo` | API spec §1.3 — specified |
| Forgot-password success | `200` | `resetToken` | Yes | string | Exactly six decimal digits; dynamic value, not literal `123456` | API spec §1.3 + README FR-03/SEC-07 — specified |
| Forgot-password success | `200` | `Content-Type` | Not specified | Not specified | Likely JSON from example, but strict media-type assertion needs confirmation | API spec §1.3 — proposal requiring confirmation |
| Forgot-password error | Not specified | entire response | Not specified | Not specified | Status, content type, fields, types, nullability, and shape absent | API spec §1.3 — unspecified |
| Reset-password success | Not specified | entire response | Not specified | Not specified | Status, content type, fields, types, nullability, and shape absent | API spec §1.4 — unspecified |
| Reset-password error | Not specified | entire response | Not specified | Not specified | Status, content type, fields, types, nullability, and shape absent | API spec §1.4 — unspecified |
| Any response | As scenario permits | `password`, `newPassword`, password hash | Forbidden by proposed black-box safety assertion | N/A | Must not expose credentials; persistence compliance still requires white-box evidence | README SEC-01; skill-defined black-box limit |
| Reset response | As scenario permits | `resetToken` | Forbidden after consumption by proposed safety assertion | N/A | Response should not re-expose a consumed OTP; explicit response contract still needed | README SEC-07 — proposal requiring confirmation |

## Coverage and confirmation ledger

| Coverage item | Evidence | Status/gap |
|---|---|---|
| SEC-01 | FR03-SEC-004, 014, 015 | API non-exposure proposed; hashing/persistence requires white-box evidence |
| SEC-02 | Applicability matrix | Not applicable because JWT protection is not documented for either endpoint |
| SEC-03 | Applicability matrix | Not applicable because neither endpoint is administrative |
| SEC-04 | FR03-SEC-005, 006 | API reflection covered; rendered UI escaping is outside this API-only command |
| SEC-05 | FR03-SEC-001 through 004 | Each request field receives an isolated minimal injection mutation |
| SEC-06 | Applicability matrix | Not applicable to the recovery workflow; no forbidden-field rule invented |
| SEC-07 | FR03-SEC-007 through 013, 015 | Format, binding, expiry, replay, and proposed randomness sampling covered |
| IDOR/object targeting | FR03-SEC-007 | Cross-email password change prohibited |
| JWT/role checks | Applicability matrix | Correctly excluded rather than sending irrelevant authorization mutations |
| Forbidden-field tampering | Applicability matrix | Correctly excluded because no Pool A rule defines it |
| Success/error schema | FR03-SCH-001 through 004; schema table | Forgot success fully asserted; all absent contracts remain explicit blockers |
| Scope controls | Every request row | POST only; no GET, external API, real secret, execution, or fabricated evidence |

Human confirmation is required for the reset success status/schema, all error statuses/schemas, response `Content-Type`, concrete OTP TTL/clock control, randomness sample/oracle, failed-attempt token consumption, and token reissue policy. Until supplied, those checks must remain observational or assert only the independently specified state/security rule.

Status: Approved 
