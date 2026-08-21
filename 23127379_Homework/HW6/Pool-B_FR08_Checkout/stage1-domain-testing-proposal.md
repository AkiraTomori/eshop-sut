# Pool B / FR-08 — Domain Testing Proposal

> Scope: `POST /api/checkout` only. No request has been executed. No GET request is designed.

## Specification basis and interpretation rules

- Assignment scope: `2026.HW06.API Testing_En.md` §§5–6 requires one Pool B API and domain partitions on every parameter, with at least 35 reviewed cases across the final API unit.
- Business rules: root `README.md` §FR-08; authentication transport from §FR-02; relevant security requirement §SEC-02.
- Endpoint contract: root `api_specification.md` §4 and §4.3.
- `Authorization: Bearer <token>` is required by API spec §4, and FR-08 allows checkout only for an authenticated user. Invalid authentication must not create an order or clear any cart. Exact error status and schema are not specified.
- `total_amount` is shown as a JSON number in API spec §4.3, but FR-08 says the backend must recalculate the total from the cart and must not accept the client value as authoritative. Therefore numeric client values are relation probes, not trusted price inputs. For any supplied value `T`, the invariant is: the backend may reject without checkout side effects or accept using server-computed cart total `C`, but it must never create an order whose total is derived from untrusted `T` when `T != C`.
- `shipping_address` is shown as a JSON string in API spec §4.3. Neither the SRS nor API specification states that it is required, non-empty, trimmed, normalized, or length-bounded. Those outcomes remain `Not specified`; string-type violations are separated from content-policy gaps.
- The endpoint's success status, response body, failure statuses, failure schemas, order response schema, currency precision/rounding, empty-cart policy, additional-property policy, and address persistence rules are not specified. They are not invented here.
- The authenticated user's server-side cart is a relevant state input because FR-08 requires server-side total recomputation and cart clearing after success. Cart setup for later execution must use test-controlled fixtures without adding an out-of-scope API test.
- Coupon behavior is outside this selected FR-08 endpoint. `/api/apply-coupon` and every GET endpoint are excluded.

## Baseline fixtures and isolation policy

| Fixture | Definition |
|---|---|
| `U1` | Test-controlled registered user with a currently valid JWT. |
| `A1` | Normal address string: `123 Le Loi, TP.HCM`. |
| `CART-M` | `U1` cart seeded directly as disposable test state with item A `100000 × 2` and item B `50000 × 1`; server-computed total `C = 250000`. |
| `CART-1` | `U1` cart with one item at `100000 × 1`; `C = 100000`. |
| `CART-Q` | `U1` cart with one item at `100000 × 2`; `C = 200000`. |
| `CART-0` | `U1` has no cart items. Empty-cart checkout behavior is unspecified. |
| `H0` | `Authorization: Bearer <valid-U1-JWT>` and `Content-Type: application/json`. |
| `B0` | `{"total_amount":250000,"shipping_address":"123 Le Loi, TP.HCM"}` used with `CART-M`. |

Every case changes one independent request or state partition from `H0` + `B0` + `CART-M`, except envelope tests where individual body fields are necessarily unavailable. Fixture totals are notation for an isolated disposable state, not values trusted from the request. Later execution must observe order creation and cart clearing without introducing any GET test.

## Parameter inventory

| Parameter ID | Endpoint | Location | Parameter | Type | Required? | Constraint/dependency | Valid baseline | Specification source | Coverage status |
|---|---|---|---|---|---|---|---|---|---|
| PB-ENV | `/api/checkout` | request envelope | JSON body | JSON object implied | Body documented; exact requiredness not stated | Documented fields are inside a JSON object; malformed/non-object JSON cannot match the shown contract | `B0` | API spec §4.3 | EC covered; body-size limit unspecified |
| PB-AUTH | `/api/checkout` | header/auth context | `Authorization` | `Bearer <JWT>` | Yes | Token must be present and valid; checkout identity and cart ownership derive from the authenticated subject | valid `U1` JWT | README §FR-02/FR-08; §SEC-02; API spec §4 | EC covered; exact JWT error taxonomy/status unspecified |
| PB-CTYPE | `/api/checkout` | header | `Content-Type` | media type string | JSON media type implied; exact behavior not stated | Request body is documented as JSON | `application/json` | API spec §4.3 | EC covered; missing-header behavior unspecified |
| PB-TOTAL | `/api/checkout` | body | `total_amount` | number in example | Presence requirement unspecified; non-authoritative | Backend must calculate `C` from the cart and must not trust client `T`; no numeric min/max/precision documented | `T = C = 250000` | README §FR-08; API spec §4.3 | Relation/type ECs covered; no supported numeric BVA |
| PB-ADDR | `/api/checkout` | body | `shipping_address` | string in example | Not specified | No requiredness, non-empty, format, normalization, or length rule; later safe display is an FR-18/SEC-04 concern | `A1` | API spec §4.3; README §FR-08 | Type/content probes covered; no supported length BVA |
| PB-EXTRA | `/api/checkout` | body | additional properties | JSON members | Not specified | Contract lists two fields but does not define strict/lenient unknown-field behavior | none | API spec §4.3 | One unknown-property probe; security/mass-assignment deferred |
| PB-CART | `/api/checkout` | authenticated server state | current user's cart contents | collection | Non-empty requirement not specified | Source for checkout items and server total; relevant partitions are empty, one item, repeated quantity, and multiple items | `CART-M` | README §FR-07/FR-08; API spec §4 | EC covered; item/count limits unspecified |
| PB-CALC | `/api/checkout` | derived server value | cart total `C` | number | Must be computed server-side | Must equal the server's arithmetic over the authenticated user's cart, independent of request `T` | `250000` | README §FR-08 | Covered through cart fixtures and `T` relation probes; rounding unspecified |
| PB-ORDER | `/api/checkout` | success side effect | created order | persistent state | Implied by checkout/order creation | On success, order total must be `C`; address storage and returned order fields are unspecified | order for `U1`, total `250000` | README §FR-08/FR-10; API spec §4.3 | Core invariant covered; schema deferred to Security/Schema Checklist |
| PB-CLEAR | `/api/checkout` | success side effect | authenticated user's cart | persistent state | Yes after successful checkout | Cart is empty after success; failed/rejected requests must not consume it | `CART-M` before success, empty after | README §FR-08 | Covered in every assertable success/failure oracle |
| PB-RESP | `/api/checkout` | response | status/body/schema | Not specified | Not specified | No checkout success status, response example, or error schema is documented | Not specified | API spec §4.3 | Contract gap; schema technique cannot invent fields |
| PB-STUDENT | `/api/checkout` | harness header | `X-Student-Id` | environment string | Required for future HW06 execution, not an SUT domain | Must be injected as `{{StudentID}}` by a collection-level pre-request script | `{{StudentID}}` | Assignment §6; `AGENTS.md` §3.6 | Deferred to Stage 4; no domain EC |

## Equivalence classes

`Valid? = Invariant only` means FR-08 does not say whether the request must be accepted, but it does define what must never happen if it is accepted. `Unspecified` means human confirmation or observed-and-reviewed behavior is required before a pass/fail oracle can be finalized.

| EC ID | Parameter ID | Field | Partition type | Condition/domain | Valid? | Representative | Specification source |
|---|---|---|---|---|---|---|---|
| ENV-V1 | PB-ENV | JSON body | structure | Valid JSON object | Yes | `B0` | API spec §4.3 |
| ENV-U1 | PB-ENV | JSON body | missing | No request body | Unspecified | `<absent>` | API spec §4.3 |
| ENV-I1 | PB-ENV | JSON body | syntax | Malformed JSON | No | raw `{"total_amount":` | API spec §4.3 |
| ENV-I2 | PB-ENV | JSON body | structure | Valid JSON but not an object | No | `[]` | API spec §4.3 |
| AUTH-V1 | PB-AUTH | `Authorization` | membership | Valid current bearer token for `U1` | Yes | `Bearer <valid-U1-JWT>` | README §FR-08; API spec §4 |
| AUTH-I1 | PB-AUTH | `Authorization` | missing | Header absent | No | `<absent>` | README §FR-08; §SEC-02; API spec §4 |
| AUTH-I2 | PB-AUTH | `Authorization` | value | Bearer scheme with empty token | No | `Bearer ` | API spec §4 |
| AUTH-I3 | PB-AUTH | `Authorization` | format | Token supplied under a non-Bearer scheme | No | `Basic abc` | API spec §4 |
| AUTH-I4 | PB-AUTH | `Authorization` | membership/integrity | Syntactically JWT-like but signature invalid | No | `<tampered-JWT>` | README §SEC-02; API spec §4 |
| AUTH-I5 | PB-AUTH | `Authorization` | time state | Properly signed but expired JWT | No | `<expired-JWT>` | Valid-token requirement in README §SEC-02 |
| CTYPE-V1 | PB-CTYPE | `Content-Type` | discrete value | JSON media type | Yes | `application/json` | API spec §4.3 |
| CTYPE-U1 | PB-CTYPE | `Content-Type` | missing | Header omitted while sending JSON bytes | Unspecified | `<absent>` | API spec §4.3 |
| CTYPE-I1 | PB-CTYPE | `Content-Type` | discrete value | Non-JSON media type for JSON-looking body | No | `text/plain` | JSON body contract in API spec §4.3 |
| TOTAL-N1 | PB-TOTAL | `total_amount` | relation | Finite integer exactly equal to server cart total (`T = C`) | Invariant only | `250000` | README §FR-08; API spec §4.3 |
| TOTAL-N2 | PB-TOTAL | `total_amount` | relation | Positive integer lower than server cart total (`0 < T < C`) | Invariant only | `249999` | README §FR-08 |
| TOTAL-N3 | PB-TOTAL | `total_amount` | relation | Positive integer higher than server cart total (`T > C`) | Invariant only | `250001` | README §FR-08 |
| TOTAL-N4 | PB-TOTAL | `total_amount` | sign | Zero or negative number | Invariant only | `0`, `-1` | README §FR-08; numeric example in API spec §4.3 |
| TOTAL-U1 | PB-TOTAL | `total_amount` | precision | Fractional finite number; currency precision/rounding unspecified | Unspecified; still non-authoritative | `250000.5` | README §FR-08; API spec §4.3 |
| TOTAL-U2 | PB-TOTAL | `total_amount` | missing | Field omitted | Unspecified; still non-authoritative | body without `total_amount` | README §FR-08 versus API spec §4.3 |
| TOTAL-I1 | PB-TOTAL | `total_amount` | nullability | Explicit `null` instead of number | No by shown type; acceptance policy unspecified | `null` | Numeric example in API spec §4.3 |
| TOTAL-I2 | PB-TOTAL | `total_amount` | type | Non-number JSON value | No by shown type; acceptance policy unspecified | `"250000"` | Numeric example in API spec §4.3 |
| ADDR-V1 | PB-ADDR | `shipping_address` | type/content | Non-empty ordinary string | Yes by shown type; content rules unspecified | `A1` | API spec §4.3 |
| ADDR-U1 | PB-ADDR | `shipping_address` | encoding/content | Non-empty Vietnamese Unicode string | Unspecified | `123 Lê Lợi, TP.HCM` | API spec §4.3; no encoding rule documented |
| ADDR-U2 | PB-ADDR | `shipping_address` | missing | Field omitted | Unspecified | body without `shipping_address` | API spec §4.3 |
| ADDR-I1 | PB-ADDR | `shipping_address` | nullability | Explicit `null` instead of string | No by shown type | `null` | String example in API spec §4.3 |
| ADDR-I2 | PB-ADDR | `shipping_address` | type | Non-string JSON value | No by shown type | `12345` | String example in API spec §4.3 |
| ADDR-U3 | PB-ADDR | `shipping_address` | content | Empty string | Unspecified | `""` | No non-empty rule in README §FR-08 or API spec §4.3 |
| ADDR-U4 | PB-ADDR | `shipping_address` | content | Whitespace-only string | Unspecified | `"   "` | No trimming/non-empty rule documented |
| EXTRA-V1 | PB-EXTRA | additional properties | structure | Only documented fields present | Yes | `B0` | API spec §4.3 |
| EXTRA-U1 | PB-EXTRA | additional properties | structure | One unknown field added | Unspecified | `"unexpected_field":"sentinel"` | Additional-property policy absent from API spec §4.3 |
| CART-V1 | PB-CART | cart contents | cardinality/quantity | One item with quantity 1 | Yes | `CART-1` | README §FR-06/FR-08 |
| CART-V2 | PB-CART | cart contents | cardinality/quantity | One item with quantity greater than 1 | Yes | `CART-Q` | README §FR-06/FR-07/FR-08 |
| CART-V3 | PB-CART | cart contents | cardinality | Multiple items | Yes | `CART-M` | README §FR-08 |
| CART-U1 | PB-CART | cart contents | state/cardinality | Empty cart | Unspecified | `CART-0` | Empty-checkout rule absent from README §FR-08 and API spec §4.3 |

## Boundary-value analysis

| Boundary ID | Parameter | Documented range | Required representatives | Proposed cases | Notes |
|---|---|---|---|---|---|
| BVA-NONE-TOTAL | `total_amount` | No accepted numeric range; value is non-authoritative | None | FR08-DOM-001, 015–019 are relation/sign/precision probes | `C-1`, `C`, and `C+1` test the trust boundary but are not claimed as classic numeric BVA |
| BVA-NONE-ADDR | `shipping_address` length | No lower or upper length bound | None | No fabricated length values | Empty/whitespace are content-policy probes, not boundary assertions |
| BVA-NONE-CART | cart item count/total | No checkout cardinality, maximum, currency precision, or total range | None | FR08-DOM-002–004 | One/many/empty are state partitions, not documented numeric boundaries |

There is no documented checkout range for which `LB-1`, `LB`, `LB+1`, `UB-1`, `UB`, and `UB+1` can be honestly generated. Inventing an address limit, order-total maximum, cart-size maximum, or currency scale would violate the specification-grounding rule.

## Proposed test cases

For any case whose acceptance is unspecified, the enforceable oracle is written as an invariant: rejection must leave order/cart state unchanged; acceptance must create the order for `U1` using server-computed `C` and then clear `U1`'s cart. Status and response body remain `Not specified`. No GET endpoint may be used to observe pre/post state.

| Test Case ID | Endpoint | Method | Objective | Preconditions | Input/body | Expected status | Expected response/side effect | EC/Partition tested | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR08-DOM-001 | `/api/checkout` | POST | Baseline checkout with multiple items and `T = C` | `U1`, `H0`, `CART-M` (`C=250000`) | `B0` | Not specified | Successful checkout creates an order for `U1` with total `250000` computed from cart, then clears `U1` cart; response schema unspecified | ENV-V1, AUTH-V1, CTYPE-V1, TOTAL-N1, ADDR-V1, EXTRA-V1, CART-V3 | README §FR-08; API spec §4.3 |
| FR08-DOM-002 | `/api/checkout` | POST | Recompute a one-item, quantity-1 cart | `U1`, `H0`, `CART-1` (`C=100000`) | `B0` adjusted to `total_amount:100000` | Not specified | On success order total is `100000` and cart is cleared | CART-V1, TOTAL-N1 | README §FR-06/FR-08 |
| FR08-DOM-003 | `/api/checkout` | POST | Recompute one item with quantity greater than 1 | `U1`, `H0`, `CART-Q` (`C=200000`) | `B0` adjusted to `total_amount:200000` | Not specified | On success order total is `200000`, proving quantity multiplication, then cart is cleared | CART-V2, TOTAL-N1 | README §FR-07/FR-08 |
| FR08-DOM-004 | `/api/checkout` | POST | Characterize checkout with an empty cart | `U1`, `H0`, `CART-0` | `{"total_amount":0,"shipping_address":"123 Le Loi, TP.HCM"}` | Not specified | Whether checkout is rejected or creates an order is unspecified; record observed behavior without final pass/fail labeling; never trust request total | CART-U1, TOTAL-N4 | README §FR-08; API spec §4.3 |
| FR08-DOM-005 | `/api/checkout` | POST | Characterize an absent request body | `U1`, valid auth, `CART-M` | `<absent>` | Not specified | Requiredness is unresolved; if accepted use `C=250000` and clear cart, otherwise create no order and retain cart | ENV-U1 | API spec §4.3 |
| FR08-DOM-006 | `/api/checkout` | POST | Reject malformed JSON | `U1`, `H0`, `CART-M` | raw `{"total_amount":` | Not specified | No order created and cart unchanged; failure schema unspecified | ENV-I1 | API spec §4.3 |
| FR08-DOM-007 | `/api/checkout` | POST | Reject a non-object JSON body | `U1`, `H0`, `CART-M` | `[]` | Not specified | No order created and cart unchanged; failure schema unspecified | ENV-I2 | API spec §4.3 |
| FR08-DOM-008 | `/api/checkout` | POST | Reject missing authentication | `CART-M` exists for `U1`; body otherwise baseline | `B0`, no Authorization header | Not specified | No order created and `U1` cart unchanged | AUTH-I1 | README §FR-08; §SEC-02; API spec §4 |
| FR08-DOM-009 | `/api/checkout` | POST | Reject empty bearer token | `CART-M`; body otherwise baseline | `B0`; `Authorization: Bearer ` | Not specified | No order created and cart unchanged | AUTH-I2 | README §FR-08; API spec §4 |
| FR08-DOM-010 | `/api/checkout` | POST | Reject wrong authorization scheme | `CART-M`; body otherwise baseline | `B0`; `Authorization: Basic abc` | Not specified | No order created and cart unchanged | AUTH-I3 | API spec §4 |
| FR08-DOM-011 | `/api/checkout` | POST | Reject invalid JWT signature | `CART-M`; body otherwise baseline | `B0`; tampered bearer JWT | Not specified | No order created and cart unchanged | AUTH-I4 | README §SEC-02; API spec §4 |
| FR08-DOM-012 | `/api/checkout` | POST | Reject expired JWT | `CART-M`; body otherwise baseline | `B0`; expired bearer JWT | Not specified | No order created and cart unchanged | AUTH-I5 | README §SEC-02; API spec §4 |
| FR08-DOM-013 | `/api/checkout` | POST | Characterize missing Content-Type | `U1`, valid auth, `CART-M` | JSON bytes for `B0`; header omitted | Not specified | Parser policy unspecified; any accepted checkout still uses `C`, while rejection has no side effects | CTYPE-U1 | API spec §4.3 |
| FR08-DOM-014 | `/api/checkout` | POST | Reject JSON-looking body labeled as text | `U1`, valid auth, `CART-M` | `B0` bytes; `Content-Type: text/plain` | Not specified | No checkout side effects expected for a body outside the documented JSON media type; exact parser/error behavior unspecified | CTYPE-I1 | API spec §4.3 |
| FR08-DOM-015 | `/api/checkout` | POST | Prevent one-unit underpayment tampering (`T=C-1`) | `U1`, `H0`, `CART-M` (`C=250000`) | `B0` with `total_amount:249999` | Not specified | Reject unchanged or accept with order total exactly `250000`; never create total `249999` | TOTAL-N2 | README §FR-08 |
| FR08-DOM-016 | `/api/checkout` | POST | Prevent one-unit overstatement (`T=C+1`) | `U1`, `H0`, `CART-M` (`C=250000`) | `B0` with `total_amount:250001` | Not specified | Reject unchanged or accept with order total exactly `250000`; never create total `250001` | TOTAL-N3 | README §FR-08 |
| FR08-DOM-017 | `/api/checkout` | POST | Prevent zero client total from controlling order | `U1`, `H0`, `CART-M` (`C=250000`) | `B0` with `total_amount:0` | Not specified | Reject unchanged or accept with order total exactly `250000`; never create total `0` | TOTAL-N4 | README §FR-08 |
| FR08-DOM-018 | `/api/checkout` | POST | Prevent negative client total from controlling order | `U1`, `H0`, `CART-M` (`C=250000`) | `B0` with `total_amount:-1` | Not specified | Reject unchanged or accept with order total exactly `250000`; never create a negative order total | TOTAL-N4 alternate representative | README §FR-08 |
| FR08-DOM-019 | `/api/checkout` | POST | Characterize fractional client total without trusting it | `U1`, `H0`, `CART-M` (`C=250000`) | `B0` with `total_amount:250000.5` | Not specified | Reject unchanged or accept with order total exactly `250000`; rounding/precision policy remains unspecified | TOTAL-U1 | README §FR-08; API spec §4.3 |
| FR08-DOM-020 | `/api/checkout` | POST | Characterize omitted non-authoritative total | `U1`, `H0`, `CART-M` (`C=250000`) | `{"shipping_address":"123 Le Loi, TP.HCM"}` | Not specified | Presence requirement unresolved; if accepted calculate `250000` from cart and clear it, otherwise no side effects | TOTAL-U2 | README §FR-08 versus API spec §4.3 |
| FR08-DOM-021 | `/api/checkout` | POST | Handle null client total without trusting it | `U1`, `H0`, `CART-M` (`C=250000`) | `B0` with `total_amount:null` | Not specified | Reject unchanged or ignore the untrusted value and use `C=250000`; never store null/zero due to coercion | TOTAL-I1 | README §FR-08; API spec §4.3 |
| FR08-DOM-022 | `/api/checkout` | POST | Handle string client total without coercive trust | `U1`, `H0`, `CART-M` (`C=250000`) | `B0` with `total_amount:"250000"` | Not specified | Reject unchanged or ignore the wrong-type value and use `C=250000`; never derive the order total from the string | TOTAL-I2 | README §FR-08; API spec §4.3 |
| FR08-DOM-023 | `/api/checkout` | POST | Characterize a normal Vietnamese Unicode address | `U1`, `H0`, `CART-M` | `B0` with `shipping_address:"123 Lê Lợi, TP.HCM"` | Not specified | If accepted, order total is `C` and cart clears; address encoding/persistence oracle is unspecified and requires confirmation | ADDR-U1 | API spec §4.3 |
| FR08-DOM-024 | `/api/checkout` | POST | Characterize omitted shipping address | `U1`, `H0`, `CART-M` | `{"total_amount":250000}` | Not specified | Requiredness unresolved; if accepted use `C` and clear cart, otherwise no side effects | ADDR-U2 | API spec §4.3 |
| FR08-DOM-025 | `/api/checkout` | POST | Reject null shipping address by shown string type | `U1`, `H0`, `CART-M` | `B0` with `shipping_address:null` | Not specified | No order/cart mutation expected; exact validation behavior unspecified | ADDR-I1 | API spec §4.3 |
| FR08-DOM-026 | `/api/checkout` | POST | Reject non-string shipping address | `U1`, `H0`, `CART-M` | `B0` with `shipping_address:12345` | Not specified | No order/cart mutation expected; exact validation behavior unspecified | ADDR-I2 | API spec §4.3 |
| FR08-DOM-027 | `/api/checkout` | POST | Characterize empty shipping address | `U1`, `H0`, `CART-M` | `B0` with `shipping_address:""` | Not specified | Non-empty policy is absent; record behavior without final pass/fail, while preserving total/cart invariants | ADDR-U3 | API spec §4.3 |
| FR08-DOM-028 | `/api/checkout` | POST | Characterize whitespace-only shipping address | `U1`, `H0`, `CART-M` | `B0` with `shipping_address:"   "` | Not specified | Trimming/non-empty policy is absent; record behavior without final pass/fail, while preserving total/cart invariants | ADDR-U4 | API spec §4.3 |
| FR08-DOM-029 | `/api/checkout` | POST | Characterize an unknown request property | `U1`, `H0`, `CART-M` | `B0` plus `"unexpected_field":"sentinel"` | Not specified | Reject unchanged or ignore unknown field and create the correct order; unknown field must not affect total or protected state | EXTRA-U1 | API spec §4.3 |

## Coverage ledger

| Parameter ID | Valid ECs covered | Invalid ECs covered separately? | Boundaries covered | Related non-domain technique | Gap/unspecified contract |
|---|---|---|---|---|---|
| PB-ENV | ENV-V1: 001–004, 008–029 | ENV-U1/I1/I2 separately in 005–007 | No body-size boundary documented | Security/schema: parser errors and response leakage | Body requiredness, maximum size, duplicate-key policy, and failure status/schema unspecified |
| PB-AUTH | AUTH-V1: 001–007, 013–029 | Yes: AUTH-I1–I5 separately in 008–012 | No token-length/time boundary documented | Security checklist: SEC-02, identity/cart isolation, malformed claims | Token expiry semantics and exact authentication responses unspecified |
| PB-CTYPE | CTYPE-V1: all except 013–014 | CTYPE-U1/I1 separately in 013–014 | No media/body-size boundary documented | Security/schema: parser robustness | Missing header, charset parameters, and exact rejection response unspecified |
| PB-TOTAL | TOTAL-N1: 001–003; N2/N3/N4/U1: 015–019 | Omitted/null/type classes isolated in 020–022 | No supported numeric BVA; relational `C-1/C/C+1` in 015/001/016 | Decision Table: login × cart × total relation × address; Security: tampering/coercion | Presence, acceptance policy, numeric precision, overflow, and failure response unspecified; non-trust invariant is explicit |
| PB-ADDR | ADDR-V1 baseline: 001–022, 029; Unicode probe 023 | Omitted/null/type/empty/whitespace isolated in 024–028 | No length boundary documented | Decision Table: valid-address condition; Security: injection/XSS and safe rendering | Requiredness, empty/whitespace policy, length, trimming, normalization, allowed characters, and persistence unspecified |
| PB-EXTRA | EXTRA-V1: 001–028 | EXTRA-U1 isolated in 029 | Not applicable | Security: mass assignment/prototype/object injection | Strict versus lenient additional-property policy unspecified |
| PB-CART | CART-V1/V2/V3: 002/003/001 | Empty CART-U1 isolated in 004; validity itself unspecified | No count/total maximum or minimum checkout boundary documented | Decision Table: empty/non-empty; state-protection checks | Empty-cart outcome, stale cart, concurrency, item price source, quantity/type limits, and rounding unspecified |
| PB-CALC | Integer recomputation covered by 001–003; request mismatch probes 015–022 | Client values isolated from server `C`; no direct invalid `C` fixture invented | No documented currency/precision range | Decision Table and Security: total tampering; later execution evidence | Price source, tax/shipping fees, overflow, decimal scale, and rounding unspecified |
| PB-ORDER | Correct-user order and `total=C` oracle in every accepted non-empty case | Auth/parser/type rejections require no order | None documented | Security/schema: ownership, response fields, data exposure | Success status, returned order ID/schema, address field, item snapshot, and atomicity details unspecified |
| PB-CLEAR | Clear-after-success oracle in accepted cases | All rejected cases retain original cart | Not applicable | Decision Table/state protection: repeated/concurrent checkout | Atomic order-create/cart-clear transaction and retry/idempotency behavior unspecified |
| PB-RESP | No schema EC can be asserted from current contract | No—the contract provides no status/body fields | None documented | Security/Schema Checklist must record the same contract gap | Entire success/error response contract unspecified |
| PB-STUDENT | Deferred `{{StudentID}}` baseline | Not applicable | Not applicable | Stage 4 collection-level pre-request script | Execution evidence only; real ID must not be hard-coded into templates |

## Completeness summary and open confirmations

- Inventory: 12 request/auth/state/output/harness entries for the sole allowed endpoint.
- Equivalence classes: 34 total across the request envelope, auth context, media type, client total, address, additional properties, and cart state.
- Proposed Domain cases: 29. Every invalid or unspecified independent class has a separate representative; two extra representatives exercise zero versus negative totals inside `TOTAL-N4`.
- BVA: no classic supported range exists in the checkout specification. `C-1/C/C+1` are explicitly relation probes, not fabricated field boundaries.
- Core assertable oracles: valid JWT required; client `total_amount` cannot control the order total; successful checkout uses server-computed cart total; successful checkout clears the authenticated user's cart.
- Human confirmation is required before later automation can finalize: empty-cart expected behavior; `total_amount` presence/validation policy; address requiredness/content/length/normalization; media-type behavior; all status codes and response schemas; currency precision/rounding; unknown-field policy; and an allowed non-GET observation method for order/cart pre/post state.
- No GET request, API execution, Newman run, progress update, or next-stage action occurred.

Status: Approved for Stage 1. No execution or pass/fail labeling has been performed. All proposed cases are designed to be executed in a later stage with a test harness that can observe order/cart state without using any GET request.
