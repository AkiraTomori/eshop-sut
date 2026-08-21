# Pool B / FR-08 — Security & Schema Checklist Proposal

> Scope: `POST /api/checkout` only. No payload has been sent, no vulnerability is claimed, and no GET request is designed.

## Specification basis, fixtures, and safety rules

- Business rules: root `README.md` §FR-08 requires authentication, server-side total recomputation, and cart clearing after successful checkout.
- Security rules: root `README.md` §9 (`SEC-01`–`SEC-07`), especially `SEC-02`, `SEC-04`, and `SEC-05`; FR-18 additionally says shipping addresses must be displayed safely.
- Endpoint contract: root `api_specification.md` §4 and §4.3 documents `Authorization: Bearer <token>` and the request example, but no checkout status or response schema.
- Fixtures use disposable users `U1` and `U2`, valid placeholder JWTs, and isolated carts. No real JWT, password, token, or student ID appears in this proposal. Each mutating case requires a fresh fixture or rollback.
- State protection is observed through approved disposable database snapshots or another non-GET mechanism. Setup failure, expired fixtures, or missing observation evidence must be classified as test-harness failure, not as a security defect.
- For unspecified input acceptance, the enforceable invariant is: rejection causes no order/cart mutation; acceptance creates an order only for the authenticated subject using server-computed cart total `C`, then clears only that subject's cart.
- XSS safety is primarily an output/rendering property. The checkout POST can probe reflection and persistence boundaries, but correct escaping in later UI rendering needs separate human/white-box evidence and is not declared proven by this API case.
- Future Stage 4 requests must receive `X-Student-Id: {{StudentID}}` through the collection-level pre-request script.

## Applicability matrix

| SEC ID / Threat | Applicability | Reason | Requirement source |
|---|---|---|---|
| SEC-01 / password exposure | Applicable | Checkout does not process passwords, so storage behavior is outside scope; however any checkout success/error response must not expose plaintext passwords or password hashes if user data is returned | README §SEC-01; checkout response schema is unspecified |
| SEC-02 / protected API authentication | Applicable | FR-08 permits checkout only for a logged-in user and API spec §4 requires a bearer token | README §FR-08/§SEC-02; API spec §4 |
| SEC-03 / admin-role enforcement | Not applicable | `POST /api/checkout` is not an Admin API and FR-08 requires authentication, not `role=admin` | README §SEC-03/§FR-12; API spec §§4, 6 |
| SEC-04 / reflected or stored XSS | White-box check required | `shipping_address` is user-controlled and FR-18 requires safe display; POST-side reflection can be checked, but render-time escaping cannot be proven through checkout alone | README §SEC-04/§FR-18; API spec §4.3 |
| SEC-05 / SQL injection | Applicable | `shipping_address` and body values may reach database operations during order creation and must use parameterized queries without database-error disclosure | README §SEC-05; API spec §4.3 |
| SEC-06 / profile-role mass assignment | Not applicable | The literal SEC-06 rule governs profile updates, not checkout; equivalent checkout mass-assignment threats are covered separately below | README §SEC-06; API spec §§2.2, 4.3 |
| SEC-07 / OTP entropy and lifecycle | Not applicable | Checkout has no OTP field or recovery lifecycle | README §SEC-07; API spec §4.3 |
| FR-08 / client-total tampering | Applicable | The backend must not trust client `total_amount`; any created order must use server total `C` | README §FR-08 |
| IDOR / authenticated-subject cart and order ownership | Applicable | Checkout must operate on the authenticated user's cart and must not accept client targeting of another user | README §FR-08; authentication context in API spec §4; exact object rule inferred from subject-scoped checkout |
| Forbidden-field / mass assignment | Applicable | `user_id`, `role`, and order `status` are not checkout request fields and must not retarget or elevate the operation | API spec §4.3; README §FR-10/§FR-12 |
| JWT algorithm/signature bypass | Applicable | A protected API must reject tokens that are not valid, including tampered signatures and unsecured algorithm variants | README §SEC-02; API spec §4 |
| Prototype/object injection | Applicable | Unknown nested/object-control keys are outside the request contract and must not alter server prototypes or protected state | API spec §4.3; additional-property policy itself is unspecified |
| Replay/concurrent duplicate checkout | White-box check required | Cart clearing is explicit, but idempotency, transaction isolation, and empty-cart behavior are not specified; tests may record duplicates but cannot label them defects without confirmation | README §FR-08; contract gap in API spec §4.3 |
| Success/error response schema | White-box check required | No status, Content-Type, required fields, field types, nullability, or error shape is documented for checkout | API spec §4.3 contract gap |

## Proposed checklist test cases

All cases use `POST /api/checkout`. `B0` is a valid JSON body with a normal string address; `C` is the independently known server cart total. Exact statuses remain `Not specified` because the contract defines none.

| Test Case ID | Endpoint | Category | Threat/Schema rule | Role/Auth setup | Payload/Mutation | Expected status | Expected response/schema | Expected state protection | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR08-SEC-001 | `POST /api/checkout` | Authentication positive control | Valid bearer token is accepted for a normal user | Valid `U1` JWT; fresh non-empty `U1` cart (`C=250000`) | `B0`, with `T=C` | Not specified | Success shape unspecified; response must expose no password/hash, JWT, stack trace, or SQL detail | Order belongs to `U1`, total equals `C`, and only `U1` cart clears | README §FR-08/§SEC-02; API spec §4 |
| FR08-SEC-002 | `POST /api/checkout` | Authentication | Missing token | No Authorization header; fresh `U1` cart retained as latent fixture | `B0` | Not specified | Authentication error; exact body/Content-Type unspecified; no internal detail | No order and no cart mutation | README §FR-08/§SEC-02; API spec §4 |
| FR08-SEC-003 | `POST /api/checkout` | Authentication | Empty bearer credential | `Authorization: Bearer ` | `B0` | Not specified | Authentication error without token echo or internals | No order and no cart mutation | README §SEC-02; API spec §4 |
| FR08-SEC-004 | `POST /api/checkout` | Authentication | Wrong authorization scheme | `Authorization: Basic placeholder` | `B0` | Not specified | Authentication error; exact schema unspecified | No order and no cart mutation | README §SEC-02; API spec §4 |
| FR08-SEC-005 | `POST /api/checkout` | Authentication | Malformed non-JWT token | `Authorization: Bearer not-a-jwt` | `B0` | Not specified | Generic authentication failure; no parser/stack disclosure | No order and no cart mutation | README §SEC-02; API spec §4 |
| FR08-SEC-006 | `POST /api/checkout` | Authentication | JWT signature tampering | Copy a disposable `U1` token and alter one signature character | `B0` | Not specified | Generic authentication failure; never accept altered claims | No order and no cart mutation | README §SEC-02; API spec §4 |
| FR08-SEC-007 | `POST /api/checkout` | Authentication | Expired JWT | Properly signed disposable token with past expiry | `B0` | Not specified | Authentication failure; token is not refreshed or echoed | No order and no cart mutation | README §SEC-02; API spec §4 |
| FR08-SEC-008 | `POST /api/checkout` | Authentication | Unsecured JWT algorithm bypass | Test-only token declaring `alg:none` with no valid signature | `B0` | Not specified | Authentication failure; no claim is trusted | No order and no cart mutation | Valid-token rule in README §SEC-02 |
| FR08-SEC-009 | `POST /api/checkout` | Ownership/IDOR | Authenticated subject isolates cart and order | Valid `U2` JWT; both `U1` and `U2` have distinct non-empty carts | Normal body with `T` deliberately matching `U1` rather than `U2` | Not specified | If accepted, response represents only `U2`'s checkout and uses `U2` cart total; schema unspecified | `U1` order/cart unchanged; only `U2` may receive an order and cart clear | README §FR-08; API spec §4 |
| FR08-SEC-010 | `POST /api/checkout` | IDOR/mass assignment | Ignore or reject client-supplied `user_id` | Valid `U1` JWT; distinct `U1`/`U2` carts | `B0` plus `"user_id":"<U2-id>"` | Not specified | Reject or ignore extra field; never report checkout for `U2` | No mutation to `U2`; any accepted order belongs to `U1`, uses `U1` total, and clears only `U1` cart | API spec §4.3; authenticated-subject rule from FR-08 |
| FR08-SEC-011 | `POST /api/checkout` | Integrity/tampering | Client total cannot underpay | Valid `U1` JWT; cart `C=250000` | `B0` with `total_amount:1` | Not specified | Reject unchanged or accept with any reported total equal to `250000`, never `1` | No order using client total; accepted checkout clears cart only after correct order creation | README §FR-08 |
| FR08-SEC-012 | `POST /api/checkout` | Forbidden field | Client cannot elevate `role` | Valid `U1` JWT; fresh `U1` cart | `B0` plus `"role":"admin"` | Not specified | Reject or ignore field; response must not claim/administer elevated role | `U1` role unchanged; order ownership/total/cart invariants preserved | API spec §4.3; README §FR-12; SEC-06 analogous threat only |
| FR08-SEC-013 | `POST /api/checkout` | Forbidden field/state | Client cannot select order status | Valid `U1` JWT; fresh `U1` cart | `B0` plus `"status":"delivered"` | Not specified | Reject or ignore field; checkout must not grant an undocumented state-control path | No unauthorized delivered-state order or unrelated order mutation | API spec §4.3; README §FR-10 |
| FR08-SEC-014 | `POST /api/checkout` | SQL injection | Parameterized handling of address | Valid `U1` JWT; fresh cart | `shipping_address:"' OR 1=1--"`; other body value normal | Not specified | No SQL error/stack/query disclosure; reject or treat payload as literal data | No authentication bypass, cross-user mutation, bulk order effect, or incorrect total; normal accept/reject cart invariant | README §SEC-05; API spec §4.3 |
| FR08-SEC-015 | `POST /api/checkout` | XSS | Stored/reflected address payload | Valid `U1` JWT; fresh cart | `shipping_address:"<img src=x onerror=alert(1)>"` | Not specified | No dangerous executable reflection in checkout response. If stored, later rendering must encode it; that sink needs separate evidence | No cross-user/protected-state mutation; accepted order total remains `C` and cart clears | README §SEC-04/§FR-18; API spec §4.3 |
| FR08-SEC-016 | `POST /api/checkout` | Object injection | Prototype-control key is rejected or inert | Valid `U1` JWT; fresh cart | `B0` plus `"__proto__":{"role":"admin"}` | Not specified | No server error disclosure; reject or ignore without global/prototype behavior change | No role change, cross-user mutation, or incorrect order state/total | API spec §4.3; defensive proposal requiring confirmation |
| FR08-SEC-017 | `POST /api/checkout` | Replay/state protection | Sequentially replay a successful checkout request | Valid `U1` JWT; one fresh non-empty cart; preserve identical body | Send identical POST twice only after the first response completes | Not specified — user confirmation required | First success uses `C` and clears cart; second-response behavior is unspecified because empty-cart/idempotency rules are absent | Record order count and cart state; do not label a second order as a defect without confirmed contract | README §FR-08; idempotency/empty-cart contract absent |
| FR08-SEC-018 | `POST /api/checkout` | Concurrency/state protection | Two simultaneous checkout requests cannot be assessed without atomicity contract | Valid `U1` JWT; one fresh non-empty cart; identical bodies | Dispatch two POST requests concurrently | Not specified — user confirmation required | Record both responses; transaction/isolation precedence is unspecified | Record resulting order count/cart state using non-GET evidence; do not declare a race vulnerability without confirmation | README §FR-08; atomicity/idempotency unspecified |
| FR08-SCH-001 | `POST /api/checkout` | Success schema | Success status and Content-Type | Valid `U1` JWT; fresh non-empty cart | `B0` | Not specified | Record actual status and Content-Type; no pass/fail assertion is possible until contract is supplied | Assert only documented order-total and cart-clear side effects | API spec §4.3 contract gap; README §FR-08 |
| FR08-SCH-002 | `POST /api/checkout` | Success schema | Success body shape, required fields, types, and nullability | Valid `U1` JWT; fresh non-empty cart | `B0` | Not specified | Record top-level JSON/non-JSON shape and fields; `order_id`, `message`, items, address, and totals are all unspecified | Documented state invariants still apply independently of response shape | API spec §4.3 contract gap |
| FR08-SCH-003 | `POST /api/checkout` | Error schema | Authentication-error status/shape | Missing bearer token | `B0` | Not specified | Record status, Content-Type, fields, types, and nullability; require no password/hash, JWT, SQL, or stack disclosure | No order and no cart clear | README §SEC-01/§SEC-02/§SEC-05; API spec §4 contract gap |
| FR08-SCH-004 | `POST /api/checkout` | Error schema | Malformed-JSON parser error shape | Valid `U1` JWT; fresh cart | Raw truncated JSON object | Not specified | Parser-error status, Content-Type, fields, and types are unspecified; response must not expose a stack trace or internals | No order and cart unchanged | API spec §4.3 contract gap |
| FR08-SCH-005 | `POST /api/checkout` | Error schema | Address-type validation error shape | Valid `U1` JWT; fresh cart | `B0` with `shipping_address:null` | Not specified | Address validation and error schema are unspecified; record status, Content-Type, fields, types, and nullability | If rejected, no order and cart unchanged; acceptance policy requires confirmation | API spec §4.3 contract gap |
| FR08-SCH-006 | `POST /api/checkout` | Conditional schema/integrity | Any returned total must be server-derived | Valid `U1` JWT; cart `C=250000` | `total_amount:1`; normal address | Not specified | Field name/presence unspecified; if response contains an order total, it must be numeric and equal `250000`, never client `1` | Any created order total equals `C`; successful checkout clears cart | README §FR-08 |
| FR08-SCH-007 | `POST /api/checkout` | Sensitive/error disclosure | Forbid credential and internal-detail leakage | Run one success, one auth failure, and one SQLi-address scenario as separate test iterations with fresh fixtures | Use the corresponding minimal payload from SEC-001/002/014 | Not specified | Each response must not contain plaintext password, password hash, bearer JWT, raw SQL/database exception, or stack trace; all positive response fields otherwise remain unspecified | No additional state mutation beyond each iteration's documented effect | README §SEC-01/§SEC-05; response contract otherwise unspecified |

## Schema contract

`Confidence = Specified` means an assertion follows directly from the SRS/API documents. `Proposal requiring confirmation` means the current documents do not define the response rule.

| Scenario | Status | Field | Required? | Type | Constraint | Source/Confidence |
|---|---|---|---|---|---|---|
| Successful checkout | Not specified | Response `Content-Type` | Not specified | Not specified | No media type documented | API spec §4.3 — Proposal requiring confirmation |
| Successful checkout | Not specified | Top-level response shape | Not specified | Not specified | No success example or schema | API spec §4.3 — Proposal requiring confirmation |
| Successful checkout | Not specified | `order_id` / `id` | Not specified | Not specified | Field name, presence, type, and nullability absent | API spec §4.3 — Proposal requiring confirmation |
| Successful checkout | Not specified | `message` | Not specified | Not specified | Field name, text, and locale absent | API spec §4.3 — Proposal requiring confirmation |
| Successful checkout | Not specified | Returned total field | Not specified | Not specified | If any returned value represents the order total, it must equal server-computed `C`, not client `T` | README §FR-08 — Specified conditional invariant; response field itself unspecified |
| Successful checkout | Not specified | Returned `shipping_address` | Not specified | Not specified | Presence, encoding, and nullability absent; dangerous executable reflection is forbidden | API spec §4.3 gap; README §SEC-04/§FR-18 — conditional security invariant |
| Successful checkout | Not applicable to body schema | Persistent order total | Yes on created order | Numeric semantics; exact database type unspecified | Must equal server-computed cart total `C` | README §FR-08 — Specified side effect |
| Successful checkout | Not applicable to body schema | Authenticated user's cart | Must be cleared after success | Persistent state | Empty after successful checkout | README §FR-08 — Specified side effect |
| Authentication failure | Not specified | Response `Content-Type` | Not specified | Not specified | No error media type documented | API spec §4 — Proposal requiring confirmation |
| Authentication failure | Not specified | Error body/fields | Not specified | Not specified | No message/code/schema/nullability contract | API spec §4 — Proposal requiring confirmation |
| Body/address rejection | Not specified | Error body/fields | Not specified | Not specified | Address validity and validation-error schema absent | API spec §4.3 — Proposal requiring confirmation |
| Empty-cart request | Not specified | Entire response | Not specified | Not specified | Acceptance, status, shape, and precedence all absent | README §FR-08/API spec §4.3 — Proposal requiring confirmation |
| Any checkout response | Not specified | `password`, password hash | Must not expose | Must not be present as sensitive value | No plaintext credential or password-hash disclosure | README §SEC-01 — Specified security invariant |
| Any checkout response | Not specified | JWT, SQL/database exception, stack trace | Must not expose | Must not be present as sensitive/internal value | Do not echo credentials or disclose query/implementation internals | README §SEC-02/§SEC-05 — security invariant; exact field list is proposal |

## Coverage and review ledger

| Area | Cases | Covered assertion | Remaining limitation |
|---|---|---|---|
| SEC-01 response exposure | SEC-001; SCH-003/SCH-007 | No password/plaintext/hash disclosure | Checkout does not exercise password persistence |
| SEC-02 token handling | SEC-001–008 | Positive token, missing, empty, wrong scheme, malformed, bad signature, expired, `alg:none` | Exact statuses/error schema unspecified; token generation must be controlled |
| SEC-03 role enforcement | None | Correctly excluded because checkout is not admin-only | Whether an admin-role account may shop is unspecified and not treated as denial requirement |
| SEC-04 XSS | SEC-015; conditional schema rows | No dangerous reflection; later address rendering must be escaped | Render sink cannot be proven through checkout POST; needs human/white-box evidence |
| SEC-05 SQLi | SEC-014; SCH-007 | Parameterized behavior, no bypass/bulk effect/DB-error disclosure | Query implementation proof is white-box; response status unspecified |
| SEC-06 literal profile rule | None | Correctly excluded | Checkout-specific `role` mass assignment covered by SEC-012 without mislabeling it as literal SEC-06 applicability |
| SEC-07 OTP | None | Correctly excluded | No OTP surface in FR-08 |
| Total integrity | SEC-011; SCH-006 | Client `T` never controls created order total | Price source, rounding, limits, and response total field unspecified |
| Ownership/IDOR | SEC-009–010 | Token subject controls cart/order; extra `user_id` cannot retarget | Exact ownership response and empty-cart error unspecified |
| Forbidden/object fields | SEC-012–013, SEC-016 | `role`, `status`, and prototype keys cannot elevate or corrupt state | Unknown-field rejection versus ignore policy unspecified |
| Replay/concurrency | SEC-017–018 | Capture order/cart effects without fabricating verdict | Idempotency, empty-cart behavior, and transaction isolation require confirmation |
| Success/error schema | SCH-001–007; schema table | Records specified side-effect invariants and all response-contract gaps | No exact response status, Content-Type, required fields, types, or nullability can yet be asserted |

## Completeness summary

- Applicability entries: all SEC-01–SEC-07 plus seven checkout-specific threat/schema areas.
- Proposed cases: 25 total — 18 security/state-protection cases and 7 schema cases.
- Each active payload is minimal and scoped to one primary threat; state-changing cases require isolated fixtures and teardown.
- No exact status code, response field, error precedence, empty-cart policy, address-validation rule, or idempotency guarantee was invented.
- No GET request, API call, Newman execution, vulnerability claim, progress update, or next-stage action occurred.

Status: Approved for Stage 1. No execution or pass/fail labeling has been performed. All proposed cases are designed to be executed in a later stage with a test harness that can observe order/cart state without using any GET request.
