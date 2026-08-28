# Pool A / FR-03 — Stage 3 Extension Proposal

> Scope: extend the user-confirmed Stage 2 table for `POST /api/forgot-password` and `POST /api/reset-password` only. No source row or human label is changed. No request, database check, time manipulation, or GET test has been executed.

## Confirmed baseline and gap-analysis policy

- The confirmed Stage 2 table contains 79 cases: 49 `VALID`, 12 `INVALID`, and 18 `INCOMPLETE` according to its row labels and coverage table.

- Root `README.md` §FR-03 and §FR-01 define the OTP/email/password rules; §9 defines SEC-01 through SEC-07. Root `api_specification.md` §§1.3–1.4 defines the two POST bodies and only the forgot-password success response.

- New domain cases cover genuinely absent valid representatives, not alternate representatives of an already covered class. In particular, Stage 1 used `!` as the only successfully consumed allowed special character; an `@` fixture appeared only in a rejected replay and therefore did not prove acceptance.

- State extensions use event sequences not present in the 0-switch table: concurrent consumption, two-subject isolation, and a complete second recovery lifecycle.

- Security extensions turn an acknowledged white-box SEC-01 gap into a concrete check and expose two password-recovery threats whose exact policies remain unspecified: account enumeration and repeated OTP guessing.

- Status precision policy: valid Reset Password requests expect `2xx Success`; invalid, expired, replayed, or incorrectly bound OTP requests expect `4xx Client Error`; Forgot Password success remains the documented `200`. Enumeration and throttling cases use explicit policy-dependent branches. Exact numeric Reset Password/error codes, response schemas, leading-zero issuance frequency, enumeration parity, retry/rate-limit policy, and OTP retention after failures remain contract gaps.

## Newness and priority ledger

| Gap ID | New case(s) | Why genuinely absent from the confirmed table | Priority/source |
|---|---|---|---|
| GAP-D01 | FR03-EXT-DOM-001–006 | The six listed valid special-character values other than `!` never complete a successful reset in any existing case. | Domain discrete-set completeness; README FR-01/FR-03 |
| GAP-D02 | FR03-EXT-DOM-007 | The original ledger explicitly lists leading-zero handling as a gap; numeric-token rejection does not test preservation of a live string token beginning with zero. | Domain/type serialization; API spec §1.4; README FR-03 |
| GAP-ST01 | FR03-EXT-ST-001 | Existing replay coverage is sequential; it cannot detect a race in one-time token consumption. | High: SEC-07 one-time use |
| GAP-ST02 | FR03-EXT-ST-002 | Existing modeling uses one token subject at a time and never proves that two users' valid recovery lifecycles are isolated. | High: FR-03 email binding |
| GAP-ST03 | FR03-EXT-ST-003 | FR03-ST-013 stops after issuing a new token from `OTPUsed`; no case consumes that new token and completes the second lifecycle. | High: state-path completion; FR-03/SEC-07 |
| GAP-S01 | FR03-EXT-SEC-001 | Stage 1 says hashing needs white-box evidence but defines no dedicated persistence assertion. | High: SEC-01 |
| GAP-S02 | FR03-EXT-SEC-002 | Registered and unregistered addresses are tested separately, but no paired response/timing comparison assesses account enumeration. | Security proposal requiring confirmation; FR-03 |
| GAP-S03 | FR03-EXT-SEC-003 | Existing wrong-token coverage sends one attempt; no case examines repeated guessing, throttling, or valid-token retention. | Security proposal requiring confirmation; SEC-07 |

## Domain-testing extensions

All reset cases use a disposable registered `E1`, a fresh live six-digit string `T1` bound to `E1`, and a password different from the current password. A new token/fixture snapshot is used per case. Only `newPassword` changes in FR03-EXT-DOM-001–006.

| Test Case ID | Endpoint | Method | Objective | Preconditions | Input/body | Expected status | Expected response/side effect | EC/Partition tested | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR03-EXT-DOM-001 | `/api/reset-password` | POST | Accept `@` as the required listed special | Fresh `T1` for disposable `E1` | Valid email/token; `newPassword:"Aa1@bbbb"` | `2xx Success` — exact code not documented | Password updates; response schema unspecified; token becomes used | PWD valid discrete value `@` | README FR-01/FR-03; API spec §1.4 |
| FR03-EXT-DOM-002 | `/api/reset-password` | POST | Accept `$` as the required listed special | Fresh `T1` for disposable `E1` | Valid email/token; `newPassword:"Aa1$bbbb"` | `2xx Success` — exact code not documented | Password updates; response schema unspecified; token becomes used | PWD valid discrete value `$` | README FR-01/FR-03; API spec §1.4 |
| FR03-EXT-DOM-003 | `/api/reset-password` | POST | Accept `%` as the required listed special | Fresh `T1` for disposable `E1` | Valid email/token; `newPassword:"Aa1%bbbb"` | `2xx Success` — exact code not documented | Password updates; response schema unspecified; token becomes used | PWD valid discrete value `%` | README FR-01/FR-03; API spec §1.4 |
| FR03-EXT-DOM-004 | `/api/reset-password` | POST | Accept `*` as the required listed special | Fresh `T1` for disposable `E1` | Valid email/token; `newPassword:"Aa1*bbbb"` | `2xx Success` — exact code not documented | Password updates; response schema unspecified; token becomes used | PWD valid discrete value `*` | README FR-01/FR-03; API spec §1.4 |
| FR03-EXT-DOM-005 | `/api/reset-password` | POST | Accept `?` as the required listed special | Fresh `T1` for disposable `E1` | Valid email/token; `newPassword:"Aa1?bbbb"` | `2xx Success` — exact code not documented | Password updates; response schema unspecified; token becomes used | PWD valid discrete value `?` | README FR-01/FR-03; API spec §1.4 |
| FR03-EXT-DOM-006 | `/api/reset-password` | POST | Accept `&` as the required listed special | Fresh `T1` for disposable `E1` | Valid email/token; `newPassword:"Aa1&bbbb"` | `2xx Success` — exact code not documented | Password updates; response schema unspecified; token becomes used | PWD valid discrete value `&` | README FR-01/FR-03; API spec §1.4 |
| FR03-EXT-DOM-007 | `/api/reset-password` | POST | Preserve a live six-digit token whose first digit is zero | Test harness obtains an actually issued live token matching `^0[0-9]{5}$`; do not fabricate validity | Valid `E1`, leading-zero `T1`, and `Aa1!bbbb` | `2xx Success` — exact code not documented; mark `BLOCKED` if no live leading-zero fixture can be obtained | Reset succeeds without numeric coercion/truncation; fixture unavailability is not an SUT failure | Valid token string serialization subpartition | API spec §1.4 string example; README FR-03 |

Why AI missed it: FR03-EXT-DOM-001 was missed because the initial generator collapsed the documented special-character set into one valid representative (`!`) instead of applying the skill rule of one valid class per discrete value.

Why AI missed it: FR03-EXT-DOM-002 was missed for the same partition-collapsing reason; `$` appeared in the requirement but never in a successful-reset oracle.

Why AI missed it: FR03-EXT-DOM-003 was missed because `%` was treated as interchangeable with `!`, hiding implementation-specific regex defects for an explicitly listed value.

Why AI missed it: FR03-EXT-DOM-004 was missed because the original prompt emphasized boundaries and invalid classes more than each member of the valid special-character set.

Why AI missed it: FR03-EXT-DOM-005 was missed because `?` was inventoried only as part of the allowed set and never given its own executable representative.

Why AI missed it: FR03-EXT-DOM-006 was missed because `&` can be mishandled by encoding/parsing layers, but the JSON-specific valid representative was not separated from the generic password class.

Why AI missed it: FR03-EXT-DOM-007 was missed because the initial BVA focused on token length and type; it noted but did not convert the leading-zero serialization risk into a conditional live-token case.

## State-transition extensions

| Test Case ID | Coverage type | Setup state | Request sequence | Expected states | Expected status/response | Requirement source |
|---|---|---|---|---|---|---|
| FR03-EXT-ST-001 | Concurrent invalid transition / atomicity | Issue one fresh `T1` for `E1`; snapshot password state | Send two reset-password POSTs concurrently with the same `E1`/`T1` and distinct valid `P1`/`P2` | `OTPValid → OTPUsed`; the competing transition remains rejected from `OTPUsed` | Exactly one request returns `2xx Success`; the loser returns `4xx Token/Replay Error`. Exactly one password update and one token consumption occur; exact codes and response schemas are not documented | README SEC-07 |
| FR03-EXT-ST-002 | Two-subject state isolation | Issue `T1` for `E1`, then `T2` for distinct registered `E2`; both are fresh | Reset `E1` with `T1`/`P1`, then reset `E2` with `T2`/`P2` | `(E1: OTPValid → OTPUsed)` and `(E2: OTPValid → OTPUsed)` independently | Both requests return `2xx Success`; both passwords update only for their owner; using `T1` must not consume/invalidate `T2`; exact codes and response schemas are not documented | README FR-03; SEC-07 |
| FR03-EXT-ST-003 | 2-switch valid path | Issue `T1`; reset `E1` to `P1`; request fresh `T2` after `T1` is used | Reset `E1` with `T2` and distinct valid `P2` | `OTPValid(T1) → OTPUsed(T1) → OTPValid(T2) → OTPUsed(T2)` | Each forgot-password request returns documented `200`; both resets return `2xx Success`. Both passwords update in sequence and `T1` remains unusable; exact reset codes and schemas are not documented | README FR-03; SEC-07; API spec §§1.3–1.4 |

Why AI missed it: FR03-EXT-ST-001 was missed because the original FSM assumed serialized events; it covered sequential replay but not two requests racing before either observes `OTPUsed`.

Why AI missed it: FR03-EXT-ST-002 was missed because the initial model was keyed only to one email (`E1`) and therefore could not reveal accidental global-token invalidation or cross-user state leakage.

Why AI missed it: FR03-EXT-ST-003 was missed because the initial state suite stopped at 0-switch transitions; FR03-ST-013 proves only token reissue and not successful consumption of the new lifecycle token.

## Security/schema extensions

| Test Case ID | Endpoint | Category | Threat/Schema rule | Role/Auth setup | Payload/Mutation | Expected status | Expected response/schema | Expected state protection | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR03-EXT-SEC-001 | `POST /api/reset-password` | SEC-01 white-box | New password must not persist as plaintext | Anonymous recovery request; disposable `E1`; approved test-database access and before-snapshot | Valid `E1`, fresh `T1`, and unique strong `P1`; inspect only `E1` password storage after success | `2xx Success` — exact code not documented | Reset response schema unspecified; database value must not equal plaintext `P1`; hash algorithm/format is outside the documented contract | Only `E1` credential changes; restore snapshot afterward | README SEC-01; FR-03; API spec §1.4 |
| FR03-EXT-SEC-002 | `POST /api/forgot-password` | Enumeration comparison | Registered-email existence must not be inferred unless product contract permits it | Anonymous; disposable registered `E1` and verified-unregistered `EU`; same local environment | Send otherwise identical requests for `E1` and `EU`; compare status, response keys/message, size, and repeated latency distributions | Registered case: `200`; unregistered case: `2xx Generic Success` or `4xx Client Error` — enumeration policy not documented | No parity assertion until the enumeration policy and timing tolerance are confirmed; never expose a usable token for `EU` | No state outside the two fixture identities changes | README FR-03; API spec §1.3; policy requires confirmation |
| FR03-EXT-SEC-003 | `POST /api/reset-password` | OTP brute-force resistance | Repeated wrong six-digit guesses before expiry | Anonymous; fresh `T1` for disposable `E1`; attempt count `N` requires confirmation | Send `N` distinct, correctly formatted values known not to equal `T1`, one per reset POST, with valid `E1`/`P1` | Each attempt: `4xx Token Validation Error`; later attempts may return `4xx Throttling/Rate-limit Error` if an implemented policy activates — exact codes not documented | Every wrong guess is rejected without sensitive/internal disclosure; throttling/lockout schema is not documented | Password never changes; whether `T1` remains usable and whether a rate-limit state begins require confirmation | README SEC-07; retry/rate-limit contract unspecified |

Why AI missed it: FR03-EXT-SEC-001 was missed because the security generator correctly declared SEC-01 a white-box requirement but stopped at a note instead of creating a dedicated, narrowly scoped persistence check.

Why AI missed it: FR03-EXT-SEC-002 was missed because the initial techniques tested registered and unregistered partitions independently; they did not compare observable responses as an account-enumeration side channel, which is not named in SEC-01–SEC-07.

Why AI missed it: FR03-EXT-SEC-003 was missed because the initial state model represented a single wrong-token event and the specification omits a retry/rate-limit policy, so repeated guessing was left only as an unresolved ledger note.

## Extension coverage summary

| Technique | New cases | Primary new coverage | Contract blockers retained |
|---|---:|---|---|
| Domain Testing | 7 | Six remaining valid special-character values; leading-zero token serialization | Exact reset success code/schema; leading-zero issuance frequency |
| State Transition Testing | 3 | Atomic one-time use; per-email isolation; full second recovery lifecycle | Reset response schemas; concurrency scheduling |
| Security/Schema Checklist | 3 | Direct plaintext-persistence evidence; enumeration comparison; repeated guessing | Enumeration policy/tolerance; retry/rate-limit policy; reset responses |
| ****Total**** | ****13**** | All cases are absent from the confirmed 79-row table | No unspecified contract was invented |

Expected-status completion: all 13 extensions now have a documented `200`, a status class (`2xx`/`4xx`), or an explicit policy-dependent branch; no unresolved Expected Status cell remains.

The candidate pool becomes 92 rows before disposition (`79` confirmed-audit rows plus `13` extensions). This arithmetic does not reinstate the 12 Stage 2 rows labeled `INVALID`; Stage 4 input must use the human-approved final disposition of each row plus only confirmed extensions.

Every future Postman/Newman request must receive `X-Student-Id: {{StudentID}}` through the collection-level pre-request script. The real student ID, OTPs, and passwords must not be hard-coded or exposed in reports.

Status: Approved 
