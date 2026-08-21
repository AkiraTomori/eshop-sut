# Pool A / FR-03 — Domain Testing Proposal

> Scope: `POST /api/forgot-password` and `POST /api/reset-password` only. No request has been executed. No GET request is designed.

## Specification basis and interpretation rules

- Assignment scope: `2026.HW06.API Testing_En.md` §§5–6 requires one Pool A API unit and domain partitions on every parameter.
- Business rules: root `README.md` §FR-03; password rules inherited from §FR-01; OTP lifecycle requirement from §SEC-07.
- Endpoint contracts: root `api_specification.md` §§1.3–1.4.
- `email` is treated as a required JSON string because FR-03 requires a registered email and both API bodies name the field. Valid email syntax follows the SRS example `user@domain.com`; no email length, case-folding, or whitespace-normalization rule is specified.
- `resetToken` is treated as a required JSON string of exactly six decimal digits because the API example quotes it and FR-03 calls it a 6-digit OTP. A live token value is always captured dynamically; `123456` below is notation or invalid-test data, never an assumed valid OTP.
- `newPassword` is a required JSON string with a one-sided length boundary of 8 characters and all four required character classes. The only allowed special characters documented by FR-01 are `@`, `$`, `!`, `%`, `*`, `?`, and `&`. No maximum length is specified.
- All negative-case status codes and response schemas are unspecified. The reset endpoint's success status and response schema are also unspecified. These cells therefore say `Not specified` rather than guessing `400`, `404`, or another code.
- The SRS requires a “confirm new password” UI value, but `api_specification.md` §1.4 does not define any confirmation field in the reset API request. No field name or server-side comparison behavior is invented.
- FR-03's token-to-email binding and SEC-07's expiry/one-time-use behavior are cross-field/state rules. They are inventoried here, but full state/event coverage belongs to the separate Pool A State Transition proposal.

## Baseline fixtures and isolation policy

| Fixture | Definition |
|---|---|
| `E1` | Registered default user `test@eshop.com` from root `README.md` |
| `E2` | Different registered default user `admin@eshop.com` from root `README.md` |
| `EU` | A test-controlled, verified-unregistered, well-formed address such as `hw06-unregistered@example.invalid` |
| `T1` | Fresh six-digit token returned by a successful `POST /api/forgot-password` for `E1`; obtain a new token for every independent reset case |
| `F0` | `{"email":"test@eshop.com"}` |
| `R0` | `{"email":"test@eshop.com","resetToken":"<T1>","newPassword":"Aa1!bbbb"}`; password length is exactly 8 |

Each negative case changes one independent input partition from `F0` or `R0`. Reset-email negatives cannot have a semantically valid token bound to that invalid email by definition; they therefore exercise the documented email/token-pair dependency while keeping token type, length, and format valid. The table calls out this unavoidable dependency instead of pretending the fields are independent.

## Parameter inventory

| Parameter ID | Endpoint | Location | Parameter | Type | Required? | Constraint/dependency | Valid baseline | Specification source | Coverage status |
|---|---|---|---|---|---|---|---|---|---|
| PA-FGT-ENV | `/api/forgot-password` | request envelope | JSON body | JSON object | Yes, implied by documented body | Must contain the documented request field; malformed JSON and non-object JSON cannot satisfy the contract | `F0` | API spec §1.3 | EC covered; no size limit specified |
| PA-FGT-EMAIL | `/api/forgot-password` | body | `email` | string | Yes | Syntactically valid and registered | `E1` | README §FR-03 step 1; §FR-01 email rule; API spec §1.3 | EC covered; no length/case/whitespace rules specified |
| PA-RST-ENV | `/api/reset-password` | request envelope | JSON body | JSON object | Yes, implied by documented body | Must contain the three documented request fields | `R0` | API spec §1.4 | EC covered; no size limit specified |
| PA-RST-EMAIL | `/api/reset-password` | body | `email` | string | Yes | Syntactically valid, registered, and identical to the email for which the token was issued | `E1`, paired with `T1` | README §FR-03 steps 1–2; API spec §1.4 | Structural/domain ECs covered; pair-state matrix deferred to State Transition |
| PA-RST-TOKEN | `/api/reset-password` | body | `resetToken` | string | Yes | Exactly 6 decimal digits; issued for the submitted email; unexpired and unused | `T1` | README §FR-03; §SEC-07; API spec §1.4 | Type/format/length EC and BVA covered; expiry/use states deferred |
| PA-RST-PASSWORD | `/api/reset-password` | body | `newPassword` | string | Yes | Length ≥8; at least one uppercase, lowercase, digit, and one of `@$!%*?&` | `Aa1!bbbb` | README §FR-03 step 2 → §FR-01; API spec §1.4 | EC and lower-bound BVA covered; maximum unspecified |
| PA-RST-CONFIRM | `/api/reset-password` | body/UI boundary | confirmation password | Not specified | Required by UI SRS; API inclusion unspecified | Two UI password values must match, but API spec defines no field name or comparison contract | Not specified | README §FR-03 step 2 versus API spec §1.4 | Contract gap; no assertable API domain case |
| PA-SHARED-CTYPE | both endpoints | header | `Content-Type` | string | JSON media type implied, exact header contract unspecified | Bodies are documented as JSON; behavior for missing/wrong media type is not documented | `application/json` | API spec §§1.3–1.4 | Inventoried; no assertable invalid EC/status |
| PA-SHARED-AUTH | both endpoints | auth context | `Authorization` | Not specified | No JWT requirement documented for Authentication endpoints | No Authorization header | API spec §1 (contrast explicit JWT note in §2) | Inference only; behavior with supplied/invalid JWT unspecified |
| PA-SHARED-STUDENT | both endpoints | harness header | `X-Student-Id` | string/environment value | Required for future HW06 execution, not an SUT business input | `{{StudentID}}` via collection pre-request script | Assignment §6; repository `AGENTS.md` §3.6 | Deferred to Stage 4; no domain partition |

## Equivalence classes

| EC ID | Parameter ID | Field | Partition type | Condition/domain | Valid? | Representative | Specification source |
|---|---|---|---|---|---|---|---|
| FENV-V1 | PA-FGT-ENV | JSON body | structure | Valid JSON object | Yes | `F0` | API spec §1.3 |
| FENV-I1 | PA-FGT-ENV | JSON body | missing | No request body | No | `<absent>` | API spec §1.3 |
| FENV-I2 | PA-FGT-ENV | JSON body | syntax | Malformed JSON | No | raw `{"email":` | API spec §1.3 |
| FENV-I3 | PA-FGT-ENV | JSON body | structure | Valid JSON but not an object | No | `[]` | API spec §1.3 |
| FEM-V1 | PA-FGT-EMAIL | `email` | membership/format | Well-formed registered email | Yes | `E1` | README §FR-03; §FR-01 |
| FEM-I1 | PA-FGT-EMAIL | `email` | membership | Well-formed but unregistered | No | `EU` | README §FR-03 |
| FEM-I2 | PA-FGT-EMAIL | `email` | format | String not in valid email form | No | `not-an-email` | README §FR-01/FR-03 |
| FEM-I3 | PA-FGT-EMAIL | `email` | missing | Field omitted | No | `{}` | API spec §1.3; README §FR-03 |
| FEM-I4 | PA-FGT-EMAIL | `email` | nullability | Explicit `null` | No | `{"email":null}` | Email string semantics in API spec §1.3 |
| FEM-I5 | PA-FGT-EMAIL | `email` | type | Non-string JSON value | No | `{"email":42}` | Email string semantics in API spec §1.3 |
| RENV-V1 | PA-RST-ENV | JSON body | structure | Valid JSON object | Yes | `R0` | API spec §1.4 |
| RENV-I1 | PA-RST-ENV | JSON body | missing | No request body | No | `<absent>` | API spec §1.4 |
| RENV-I2 | PA-RST-ENV | JSON body | syntax | Malformed JSON | No | raw `{"email":` | API spec §1.4 |
| RENV-I3 | PA-RST-ENV | JSON body | structure | Valid JSON but not an object | No | `[]` | API spec §1.4 |
| REM-V1 | PA-RST-EMAIL | `email` | format/membership/dependency | Registered email identical to token subject | Yes | `E1` + `T1` | README §FR-03 |
| REM-I1 | PA-RST-EMAIL | `email` | binding | Different registered email from token subject | No | `E2` + `T1` | README §FR-03 |
| REM-I2 | PA-RST-EMAIL | `email` | membership | Well-formed unregistered email | No | `EU` + six-digit input | README §FR-03 |
| REM-I3 | PA-RST-EMAIL | `email` | format | Malformed email string | No | `not-an-email` + six-digit input | README §FR-01/FR-03 |
| REM-I4 | PA-RST-EMAIL | `email` | missing | Field omitted | No | `email` omitted from `R0` | API spec §1.4; README §FR-03 |
| REM-I5 | PA-RST-EMAIL | `email` | nullability | Explicit `null` | No | `email:null` in `R0` | Email string semantics in API spec §1.4 |
| REM-I6 | PA-RST-EMAIL | `email` | type | Non-string JSON value | No | `email:42` in `R0` | Email string semantics in API spec §1.4 |
| TOK-V1 | PA-RST-TOKEN | `resetToken` | format/state | Exactly 6 digits and live, unused, bound to email | Yes | `T1` | README §FR-03; §SEC-07 |
| TOK-I1 | PA-RST-TOKEN | `resetToken` | range | Length <6 | No | `12345` | README §FR-03 |
| TOK-I2 | PA-RST-TOKEN | `resetToken` | range | Length >6 | No | `1234567` | README §FR-03 |
| TOK-I3 | PA-RST-TOKEN | `resetToken` | character set | Exactly 6 characters but at least one non-digit | No | `12345A` | README §FR-03 |
| TOK-I4 | PA-RST-TOKEN | `resetToken` | missing | Field omitted | No | `resetToken` omitted from `R0` | API spec §1.4 |
| TOK-I5 | PA-RST-TOKEN | `resetToken` | nullability | Explicit `null` | No | `resetToken:null` | Token string semantics in API spec §1.4 |
| TOK-I6 | PA-RST-TOKEN | `resetToken` | type | Numeric JSON value, even if six digits | No | `resetToken:123456` | Quoted string in API spec §1.4 |
| TOK-I7 | PA-RST-TOKEN | `resetToken` | membership | Correctly formatted but never issued for `E1` | No | Test-controlled six-digit value known not to equal current `T1` | README §FR-03 |
| PWD-V1 | PA-RST-PASSWORD | `newPassword` | range/must-be | Length ≥8 and contains all required classes using an allowed special | Yes | `Aa1!bbbb` | README §FR-03 → §FR-01 |
| PWD-I1 | PA-RST-PASSWORD | `newPassword` | range | Length <8 while all four required classes are present | No | `Aa1!bbb` (7) | README §FR-01 |
| PWD-I2 | PA-RST-PASSWORD | `newPassword` | must-be | No uppercase letter; all other rules met | No | `aa1!bbbb` | README §FR-01 |
| PWD-I3 | PA-RST-PASSWORD | `newPassword` | must-be | No lowercase letter; all other rules met | No | `AA1!BBBB` | README §FR-01 |
| PWD-I4 | PA-RST-PASSWORD | `newPassword` | must-be | No digit; all other rules met | No | `AaB!bbbb` | README §FR-01 |
| PWD-I5 | PA-RST-PASSWORD | `newPassword` | must-be | No special character; all other rules met | No | `Aa1bbbbb` | README §FR-01 |
| PWD-I6 | PA-RST-PASSWORD | `newPassword` | allowed set | Uses `#` as its only special character, not one of `@$!%*?&` | No | `Aa1#bbbb` | README §FR-01 |
| PWD-I7 | PA-RST-PASSWORD | `newPassword` | missing | Field omitted | No | `newPassword` omitted from `R0` | API spec §1.4; README §FR-03 |
| PWD-I8 | PA-RST-PASSWORD | `newPassword` | nullability | Explicit `null` | No | `newPassword:null` | Password string semantics in API spec §1.4 |
| PWD-I9 | PA-RST-PASSWORD | `newPassword` | type | Non-string JSON value | No | `newPassword:12345678` | Password string semantics in API spec §1.4 |

## Boundary-value analysis

| Boundary ID | Parameter | Documented range | Required representatives | Proposed cases | Notes |
|---|---|---|---|---|---|
| BVA-TOK-LEN | `resetToken` length | Exactly 6 digits (`LB = UB = 6`) | 5, 6, 7 characters; duplicate exact-boundary points collapse | FR03-DOM-021, FR03-DOM-010, FR03-DOM-022 | The 6-character valid representative must be the live issued `T1`; there is no documented numeric min/max for the token value |
| BVA-PWD-LEN | `newPassword` length | `LB = 8`; upper bound not specified | 7, 8, 9 characters | FR03-DOM-028, FR03-DOM-010, FR03-DOM-011 | Only the supported lower boundary is analyzed; no `UB-1/UB/UB+1` is invented |

No email length boundary, request-body size boundary, OTP lifetime value, or maximum password length appears in the SRS or API specification.

## Proposed test cases

For every reset case, create a fresh `T1` unless the objective intentionally changes the token. This prevents prior successful resets from introducing an unintended `OTPUsed` state. “No reset” means the stored password remains unchanged and no usable credential change occurs; the allowed observation mechanism is unspecified and must not be replaced with an out-of-scope GET test.

| Test Case ID | Endpoint | Method | Objective | Preconditions | Input/body | Expected status | Expected response/side effect | EC/Partition tested | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR03-DOM-001 | `/api/forgot-password` | POST | Accept registered, well-formed email | `E1` exists | `F0` | `200` | Exact documented message and a `resetToken` value; token generation side effect occurs | FENV-V1, FEM-V1 | README §FR-03; API spec §1.3 |
| FR03-DOM-002 | `/api/forgot-password` | POST | Reject absent body | None | `<absent>` | Not specified | Must not issue a usable token; failure schema unspecified | FENV-I1 | API spec §1.3 |
| FR03-DOM-003 | `/api/forgot-password` | POST | Reject malformed JSON | None | raw `{"email":` | Not specified | Must not issue a usable token; failure schema unspecified | FENV-I2 | API spec §1.3 |
| FR03-DOM-004 | `/api/forgot-password` | POST | Reject non-object JSON body | None | `[]` | Not specified | Must not issue a usable token; failure schema unspecified | FENV-I3 | API spec §1.3 |
| FR03-DOM-005 | `/api/forgot-password` | POST | Handle well-formed unregistered email | `EU` verified absent | `{"email":"hw06-unregistered@example.invalid"}` | Not specified | No token usable for `EU`; whether response is generic to prevent enumeration is unspecified here | FEM-I1 | README §FR-03 |
| FR03-DOM-006 | `/api/forgot-password` | POST | Reject malformed email string | None | `{"email":"not-an-email"}` | Not specified | Must not issue a usable token; failure schema unspecified | FEM-I2 | README §FR-01/FR-03 |
| FR03-DOM-007 | `/api/forgot-password` | POST | Reject missing email field | None | `{}` | Not specified | Must not issue a usable token; failure schema unspecified | FEM-I3 | README §FR-03; API spec §1.3 |
| FR03-DOM-008 | `/api/forgot-password` | POST | Reject null email | None | `{"email":null}` | Not specified | Must not issue a usable token; failure schema unspecified | FEM-I4 | API spec §1.3 |
| FR03-DOM-009 | `/api/forgot-password` | POST | Reject wrong email type | None | `{"email":42}` | Not specified | Must not issue a usable token; failure schema unspecified | FEM-I5 | API spec §1.3 |
| FR03-DOM-010 | `/api/reset-password` | POST | Accept valid pair and password at length LB=8 | Fresh `T1` for `E1`; password differs from current | `R0` | Not specified | Password is updated; response schema unspecified; token invalidation is covered by State Transition/SEC-07 | RENV-V1, REM-V1, TOK-V1, PWD-V1; BVA 6 and 8 | README §FR-03; API spec §1.4 |
| FR03-DOM-011 | `/api/reset-password` | POST | Accept valid password at LB+1=9 | Fresh `T1` for `E1` | `R0` with `newPassword:"Aa1!bbbbb"` | Not specified | Password is updated; response schema unspecified | PWD-V1; BVA 9 | README §FR-01/FR-03 |
| FR03-DOM-012 | `/api/reset-password` | POST | Reject absent body | None | `<absent>` | Not specified | No password change; failure schema unspecified | RENV-I1 | API spec §1.4 |
| FR03-DOM-013 | `/api/reset-password` | POST | Reject malformed JSON | None | raw `{"email":` | Not specified | No password change; failure schema unspecified | RENV-I2 | API spec §1.4 |
| FR03-DOM-014 | `/api/reset-password` | POST | Reject non-object JSON body | None | `[]` | Not specified | No password change; failure schema unspecified | RENV-I3 | API spec §1.4 |
| FR03-DOM-015 | `/api/reset-password` | POST | Reject token used with a different registered email | Fresh `T1` issued for `E1`; `E2` exists | `R0` with `email:"admin@eshop.com"` | Not specified | Neither account password changes; failure schema unspecified | REM-I1 (email/token dependency) | README §FR-03 |
| FR03-DOM-016 | `/api/reset-password` | POST | Reject well-formed unregistered email | `EU` absent; use a six-digit string not issued for it | `R0` with `email:"hw06-unregistered@example.invalid"` | Not specified | No password change; failure schema unspecified | REM-I2 (membership/pair dependency) | README §FR-03 |
| FR03-DOM-017 | `/api/reset-password` | POST | Reject malformed email | Use a six-digit string; no token can validly bind to malformed email | `R0` with `email:"not-an-email"` | Not specified | No password change; failure schema unspecified | REM-I3 (format/pair dependency) | README §FR-01/FR-03 |
| FR03-DOM-018 | `/api/reset-password` | POST | Reject missing email | Fresh `T1` for `E1` | `R0` without `email` | Not specified | No password change; failure schema unspecified | REM-I4 (presence/pair dependency) | README §FR-03; API spec §1.4 |
| FR03-DOM-019 | `/api/reset-password` | POST | Reject null email | Fresh `T1` for `E1` | `R0` with `email:null` | Not specified | No password change; failure schema unspecified | REM-I5 (null/pair dependency) | API spec §1.4 |
| FR03-DOM-020 | `/api/reset-password` | POST | Reject wrong email type | Fresh `T1` for `E1` | `R0` with `email:42` | Not specified | No password change; failure schema unspecified | REM-I6 (type/pair dependency) | API spec §1.4 |
| FR03-DOM-021 | `/api/reset-password` | POST | Reject token length LB-1=5 | `E1` exists | `R0` with `resetToken:"12345"` | Not specified | No password change; failure schema unspecified | TOK-I1; BVA 5 | README §FR-03 |
| FR03-DOM-022 | `/api/reset-password` | POST | Reject token length UB+1=7 | `E1` exists | `R0` with `resetToken:"1234567"` | Not specified | No password change; failure schema unspecified | TOK-I2; BVA 7 | README §FR-03 |
| FR03-DOM-023 | `/api/reset-password` | POST | Reject six-character token containing non-digit | `E1` exists | `R0` with `resetToken:"12345A"` | Not specified | No password change; failure schema unspecified | TOK-I3 | README §FR-03 |
| FR03-DOM-024 | `/api/reset-password` | POST | Reject missing token | `E1` exists | `R0` without `resetToken` | Not specified | No password change; failure schema unspecified | TOK-I4 | README §FR-03; API spec §1.4 |
| FR03-DOM-025 | `/api/reset-password` | POST | Reject null token | `E1` exists | `R0` with `resetToken:null` | Not specified | No password change; failure schema unspecified | TOK-I5 | API spec §1.4 |
| FR03-DOM-026 | `/api/reset-password` | POST | Reject numeric token type | `E1` exists | `R0` with `resetToken:123456` | Not specified | No password change; failure schema unspecified | TOK-I6 | API spec §1.4 |
| FR03-DOM-027 | `/api/reset-password` | POST | Reject correctly formatted but unissued token | Fresh `T1` exists; choose a different controlled six-digit value | `R0` with `resetToken:"<not-T1>"` | Not specified | No password change; failure schema unspecified | TOK-I7 | README §FR-03 |
| FR03-DOM-028 | `/api/reset-password` | POST | Reject password at LB-1=7 while preserving all character classes | Fresh `T1` for `E1` | `R0` with `newPassword:"Aa1!bbb"` | Not specified | No password change; failure schema unspecified | PWD-I1; BVA 7 | README §FR-01/FR-03 |
| FR03-DOM-029 | `/api/reset-password` | POST | Reject password without uppercase | Fresh `T1` for `E1` | `R0` with `newPassword:"aa1!bbbb"` | Not specified | No password change; failure schema unspecified | PWD-I2 | README §FR-01/FR-03 |
| FR03-DOM-030 | `/api/reset-password` | POST | Reject password without lowercase | Fresh `T1` for `E1` | `R0` with `newPassword:"AA1!BBBB"` | Not specified | No password change; failure schema unspecified | PWD-I3 | README §FR-01/FR-03 |
| FR03-DOM-031 | `/api/reset-password` | POST | Reject password without digit | Fresh `T1` for `E1` | `R0` with `newPassword:"AaB!bbbb"` | Not specified | No password change; failure schema unspecified | PWD-I4 | README §FR-01/FR-03 |
| FR03-DOM-032 | `/api/reset-password` | POST | Reject password without special character | Fresh `T1` for `E1` | `R0` with `newPassword:"Aa1bbbbb"` | Not specified | No password change; failure schema unspecified | PWD-I5 | README §FR-01/FR-03 |
| FR03-DOM-033 | `/api/reset-password` | POST | Reject password whose only special is outside allowed set | Fresh `T1` for `E1` | `R0` with `newPassword:"Aa1#bbbb"` | Not specified | No password change; failure schema unspecified | PWD-I6 | README §FR-01/FR-03 |
| FR03-DOM-034 | `/api/reset-password` | POST | Reject missing new password | Fresh `T1` for `E1` | `R0` without `newPassword` | Not specified | No password change; failure schema unspecified | PWD-I7 | README §FR-03; API spec §1.4 |
| FR03-DOM-035 | `/api/reset-password` | POST | Reject null new password | Fresh `T1` for `E1` | `R0` with `newPassword:null` | Not specified | No password change; failure schema unspecified | PWD-I8 | API spec §1.4 |
| FR03-DOM-036 | `/api/reset-password` | POST | Reject non-string new password | Fresh `T1` for `E1` | `R0` with `newPassword:12345678` | Not specified | No password change; failure schema unspecified | PWD-I9 | API spec §1.4 |

## Coverage ledger

| Parameter ID | Valid ECs covered | Invalid ECs covered separately? | Boundaries covered | Related non-domain technique | Gap/unspecified contract |
|---|---|---|---|---|---|
| PA-FGT-ENV | FENV-V1: FR03-DOM-001 | Yes: FENV-I1–I3 in 002–004 | None documented | Security/schema will examine parser/error leakage | Body/media size limits and failure status/schema unspecified |
| PA-FGT-EMAIL | FEM-V1: 001 | Yes: FEM-I1–I5 in 005–009 | No length bounds documented | Security will address enumeration, injection, and safe errors | Maximum length, Unicode, case, trimming, and generic-response rule unspecified |
| PA-RST-ENV | RENV-V1: 010–011 | Yes: RENV-I1–I3 in 012–014 | None documented | Security/schema will examine parser/error leakage | Body/media size limits and all response contracts unspecified |
| PA-RST-EMAIL | REM-V1: 010–011 | Yes at the pair level: REM-I1–I6 in 015–020 | No length bounds documented | State Transition must expand NoOTP/wrong-email/expired/used states | Invalid email cannot be paired with a semantically valid token; exact failure response unspecified |
| PA-RST-TOKEN | TOK-V1: 010–011 | Yes for independent domain ECs: TOK-I1–I7 in 021–027 | Length 5/6/7 in 021/010/022 | State Transition: NoOTP, OTPValid, OTPUsed, Expired; Security: entropy, binding, replay | Lifetime duration, retry/rate limit, leading-zero handling, storage/transport protection, and failure response unspecified |
| PA-RST-PASSWORD | PWD-V1: 010–011 | Yes: PWD-I1–I9 in 028–036 | Lower boundary 7/8/9 in 028/010/011; upper boundary unspecified | Security: storage/non-disclosure; schema checks | Maximum length, whitespace, Unicode, reuse/history, and success/failure response unspecified |
| PA-RST-CONFIRM | None—no API field defined | No assertable API EC can be derived | None documented | Human contract clarification; possibly UI/API integration testing | Field name, request inclusion, and mismatch response/status unspecified |
| PA-SHARED-CTYPE | `application/json` used by every case | No—invalid behavior not specified | None documented | Security/schema/parser robustness | Required header spelling/media-type parameters and wrong/missing behavior unspecified |
| PA-SHARED-AUTH | No auth header baseline | No—behavior with provided/invalid JWT unspecified | Not applicable | Security checklist must decide whether anonymous availability and token handling are applicable | Authentication endpoints appear anonymous by placement; explicit statement absent |
| PA-SHARED-STUDENT | Deferred execution baseline `{{StudentID}}` | Not applicable | Not applicable | Stage 4 Postman collection-level pre-request script | Not an SUT domain; real student value must not be hard-coded |

## Completeness summary and open confirmations

- Parameters/context inventoried: 10 entries across both endpoints, including the API/SRS confirmation-field mismatch and execution-only student header.
- Equivalence classes: 39 total (6 valid, 33 invalid).
- Proposed domain cases: 36 (3 positive, 33 negative); every independent invalid EC has its own case. Reset-email negatives are explicitly classified as email/token-pair cases because isolation from token binding is impossible by definition.
- Supported BVA points: 6-digit token length represented at 5/6/7; password minimum represented at 7/8/9. No unsupported upper boundary is invented.
- No GET request, API execution, Newman run, progress update, or next-stage action occurred.
- Human clarification is needed before later automation can assert: the reset success status/schema, all error statuses/schemas, OTP lifetime, confirmation-password API field, and normalization/maximum-length behavior.

Status: PROPOSED — pending user confirmation; not approved as automatic input for the next stage.
