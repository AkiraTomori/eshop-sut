# Pool B / FR-08 — Decision Table Testing Proposal

> Scope: `POST /api/checkout` only. No request has been executed. No GET request is designed.

## Fixture-role clarification added for execution

The decision-table causes remain properties of the Checkout request and its pre-state; `POST /api/register`, `POST /api/login`, and `POST /api/cart` are not additional causes or scored API targets. They are user-authorized setup steps used to instantiate the concrete Y/N values:

| Decision-table cause | Fixture realization |
|---|---|
| C1 logged in = Y | Register a disposable subject if necessary, call Login, and chain the returned JWT into the Checkout authorization header |
| C1 logged in = N | Omit or mutate the Checkout authorization header; Login is skipped when no valid-token derivative is needed |
| C2 cart empty = Y | Use a new disposable account and do not call Cart setup |
| C2 cart empty = N | Call Cart setup with the exact independently known item/quantity fixture before Checkout |
| C3 `T=C` / `T!=C` | Compute `C` from the setup item prices and quantities, then send the matching or intentionally mismatching client value `T` |
| C4 address valid/invalid | Change only the Checkout body; fixture endpoints do not decide this cause |

The temporal extension establishes `C-old`, mutates the same disposable cart to `C-new` through a second setup call, and only then sends the stale `T`. Setup calls have no decision-table assertions, do not produce extra rules/cases, and do not count toward the Pool B minimum. A separate `Setup / Fixtures` folder runs before the Checkout folder solely to realize preconditions. No GET request is used.

## Specification basis and interpretation rules

- Root `README.md` §FR-08 requires authentication, backend total recomputation, and cart clearing after successful checkout.
- Root `README.md` §SEC-02 and root `api_specification.md` §4 require a valid bearer token.
- Root `api_specification.md` §4.3 shows `total_amount` as a number and `shipping_address` as a string, but it provides no checkout status, response schema, address validity policy, or empty-cart behavior.
- The four causes mandated by the Decision Table skill are retained even where the SRS is silent. A `shipping_address` is classified as structurally valid only for this proposal when it is a non-empty string like the API example; that working classifier is not asserted as a complete business rule. `N` uses `null` as a concrete type-invalid representative.
- For an empty cart, `C3=Y` means the supplied total equals the cart-derived value `0`; `C3=N` means it differs, such as `1`. This notation does not imply that empty-cart checkout is allowed.
- Symbols in effect rows: `X` = effect required by the cited specification; `?` = effect/outcome not specified and requiring user confirmation; `—` = effect does not apply. Every cause cell in the full table remains `Y` or `N` as required.
- If a request is rejected, the integrity oracle is no order creation and no cart clearing. Exact rejection status, response body, and precedence among simultaneous errors are not specified.

## Causes & Effects

| ID | Type | Description | Values | Specification source |
|---|---|---|---|---|
| C1 | Cause | Request is authenticated with a valid JWT | `Y` = valid bearer JWT; `N` = missing/invalid JWT | README §FR-08/§SEC-02; API spec §4 |
| C2 | Cause | Authenticated user's cart is empty | `Y` = zero items; `N` = at least one item | Cart is the total source in README §FR-08; empty-cart outcome not specified |
| C3 | Cause | Client `total_amount` matches server-computed cart total `C` | `Y` = `T=C`; `N` = `T!=C` | README §FR-08; API spec §4.3 |
| C4 | Cause | `shipping_address` is structurally valid under the working classifier | `Y` = non-empty string; `N` = `null` | String example in API spec §4.3; full validity rule not specified |
| E1 | Effect | Reject for missing/invalid authentication | Observable rejection; no order; cart unchanged | README §FR-08/§SEC-02; API spec §4 |
| E2 | Effect | Reject empty-cart checkout | Candidate effect only; actual policy and precedence are not specified | Contract gap in README §FR-08 and API spec §4.3 |
| E3 | Effect | Reject invalid `shipping_address` | Candidate effect only; exact validity rule and precedence are not specified | String example only in API spec §4.3 |
| E4 | Effect | Distrust client total and compute total from the server cart | Order total, if created, equals server `C`, including when `T!=C` | README §FR-08 |
| E5 | Effect | Create an order for the authenticated user | Observable persistent side effect; response schema unspecified | Checkout/order creation implied by README §FR-08 and API spec §4.3 |
| E6 | Effect | Clear the authenticated user's cart after success | Cart becomes empty only after successful checkout | README §FR-08 |
| E7 | Effect | Preserve order/cart state after rejection | No order created and original cart retained | Integrity consequence of rejected checkout; exact atomicity contract unspecified |
| E8 | Effect | Flag outcome/precedence for human confirmation | Required where empty-cart/address behavior is undocumented | `AGENTS.md` specification-grounding rule |

## Full decision table

The table enumerates all `2^4 = 16` combinations before any reduction.

| Cause/Effect | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 | R9 | R10 | R11 | R12 | R13 | R14 | R15 | R16 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C1 Logged in | Y | Y | Y | Y | Y | Y | Y | Y | N | N | N | N | N | N | N | N |
| C2 Cart empty | N | N | N | N | Y | Y | Y | Y | N | N | N | N | Y | Y | Y | Y |
| C3 Client total matches | Y | Y | N | N | Y | Y | N | N | Y | Y | N | N | Y | Y | N | N |
| C4 Address structurally valid | Y | N | Y | N | Y | N | Y | N | Y | N | Y | N | Y | N | Y | N |
| E1 Authentication rejection | — | — | — | — | — | — | — | — | X | X | X | X | X | X | X | X |
| E2 Empty-cart rejection | — | — | — | — | ? | ? | ? | ? | — | — | — | — | — | — | — | — |
| E3 Invalid-address rejection | — | ? | — | ? | — | ? | — | ? | — | — | — | — | — | — | — | — |
| E4 Backend recalculates/uses `C` | X | ? | X | ? | ? | ? | ? | ? | — | — | — | — | — | — | — | — |
| E5 Create order | X | ? | X | ? | ? | ? | ? | ? | — | — | — | — | — | — | — | — |
| E6 Clear cart after success | X | ? | X | ? | ? | ? | ? | ? | — | — | — | — | — | — | — | — |
| E7 Rejection leaves state unchanged | — | ? | — | ? | ? | ? | ? | ? | X | X | X | X | X | X | X | X |
| E8 Human confirmation required | — | X | — | X | X | X | X | X | — | — | — | — | — | — | — | — |

## Full-rule interpretation ledger

| Full rule | C1/C2/C3/C4 | Specification-grounded interpretation | Reduction disposition |
|---|---|---|---|
| R1 | `Y/N/Y/Y` | Authenticated, non-empty cart, matching client total, structural address: backend still computes `C`, creates order, clears cart | Merge with R3 because FR-08 makes C3 non-authoritative |
| R2 | `Y/N/Y/N` | Address rejection/acceptance and error precedence are unspecified | Keep separate |
| R3 | `Y/N/N/Y` | Mismatching total cannot control outcome; backend uses `C`, creates order, clears cart | Merge with R1 |
| R4 | `Y/N/N/N` | Both total mismatch and invalid address are present; address behavior/precedence unspecified | Keep separate from R2 because precedence is undocumented |
| R5 | `Y/Y/Y/Y` | Empty-cart behavior unspecified even with otherwise valid inputs | Keep separate |
| R6 | `Y/Y/Y/N` | Empty cart plus invalid address; both outcome and precedence unspecified | Keep separate |
| R7 | `Y/Y/N/Y` | Empty cart plus mismatching client total; outcome unspecified, non-trust invariant still applies if accepted | Keep separate |
| R8 | `Y/Y/N/N` | Empty cart, mismatching total, invalid address; outcome and precedence unspecified | Keep separate |
| R9–R16 | `N/*/*/*` | Checkout is forbidden without valid authentication; no order/cart mutation regardless of other inputs | Merge by identical security and side-effect outcome |

## Reduced decision table

Only effect-equivalent rules are merged. `-` appears only in the reduced table and means the condition cannot change the documented effect.

| Cause/Effect | RR-AUTH | RR-SUCCESS | RR-ADDR-MATCH | RR-ADDR-MISMATCH | RR-EMPTY-MATCH-VALID | RR-EMPTY-MATCH-INVALID | RR-EMPTY-MISMATCH-VALID | RR-EMPTY-MISMATCH-INVALID |
|---|---|---|---|---|---|---|---|---|
| C1 Logged in | N | Y | Y | Y | Y | Y | Y | Y |
| C2 Cart empty | - | N | N | N | Y | Y | Y | Y |
| C3 Client total matches | - | - | Y | N | Y | Y | N | N |
| C4 Address structurally valid | - | Y | N | N | Y | N | Y | N |
| E1 Authentication rejection | X | — | — | — | — | — | — | — |
| E2 Empty-cart rejection | — | — | — | — | ? | ? | ? | ? |
| E3 Invalid-address rejection | — | — | ? | ? | — | ? | — | ? |
| E4 Backend recalculates/uses `C` | — | X | ? | ? | ? | ? | ? | ? |
| E5 Create order | — | X | ? | ? | ? | ? | ? | ? |
| E6 Clear cart after success | — | X | ? | ? | ? | ? | ? | ? |
| E7 Rejection leaves state unchanged | X | — | ? | ? | ? | ? | ? | ? |
| E8 Human confirmation required | — | — | X | X | X | X | X | X |
| Source full rules | R9–R16 | R1, R3 | R2 | R4 | R5 | R6 | R7 | R8 |

## Proposed test cases

`C` always denotes the disposable server-side cart total. Each case uses `POST /api/checkout`; later fixture setup/observation must not add a GET request. For an unspecified branch, the case records behavior for human review while enforcing only the invariant: rejection preserves state; acceptance uses `C` and clears the cart.

| Test Case ID | Reduced Rule | Endpoint | Preconditions | Request data | Expected status | Expected effects/side effects | Requirement source |
|---|---|---|---|---|---|---|---|
| FR08-DT-001 | RR-AUTH | `POST /api/checkout` | Prepare a non-empty `U1` cart with `C=250000`; omit or invalidate the request JWT | `T=250000`; non-empty string address | Not specified | Authentication rejection; no order created; prepared cart remains unchanged. Represents R9–R16 because all other causes are security-irrelevant without valid auth | README §FR-08/§SEC-02; API spec §4 |
| FR08-DT-002 | RR-SUCCESS | `POST /api/checkout` | Valid `U1` JWT; non-empty cart with `C=250000` | `T=1` (`T!=C`); `shipping_address:"123 Le Loi, TP.HCM"` | Not specified | Backend distrusts `T`, creates order total `250000`, then clears `U1` cart. One concrete mismatching representative covers reduced C3 `-`; matching baseline already exists in Domain case FR08-DOM-001 | README §FR-08 |
| FR08-DT-003 | RR-ADDR-MATCH | `POST /api/checkout` | Valid `U1` JWT; non-empty cart with `C=250000` | `T=250000`; `shipping_address:null` | Not specified — user confirmation required | Address policy is undocumented. If rejected: no order/cart change. If accepted: order total must be `250000` and cart must clear. Record which effect occurs | API spec §4.3; address rule absent from README §FR-08 |
| FR08-DT-004 | RR-ADDR-MISMATCH | `POST /api/checkout` | Valid `U1` JWT; non-empty cart with `C=250000` | `T=1`; `shipping_address:null` | Not specified — user confirmation required | Address/total precedence is undocumented. Rejection preserves state; acceptance must ignore `T`, create total `250000`, and clear cart | README §FR-08; API spec §4.3 |
| FR08-DT-005 | RR-EMPTY-MATCH-VALID | `POST /api/checkout` | Valid `U1` JWT; empty cart (`C=0`) | `T=0`; non-empty string address | Not specified — user confirmation required | Empty-cart policy is undocumented. Record rejection/no side effects or acceptance/order total `0` plus post-success empty cart without assigning final pass/fail | Contract gap in README §FR-08/API spec §4.3 |
| FR08-DT-006 | RR-EMPTY-MATCH-INVALID | `POST /api/checkout` | Valid `U1` JWT; empty cart (`C=0`) | `T=0`; `shipping_address:null` | Not specified — user confirmation required | Empty-cart versus address-error precedence and resulting side effects are unspecified; record observed behavior and preserve rejection integrity | Contract gaps in README §FR-08/API spec §4.3 |
| FR08-DT-007 | RR-EMPTY-MISMATCH-VALID | `POST /api/checkout` | Valid `U1` JWT; empty cart (`C=0`) | `T=1`; non-empty string address | Not specified — user confirmation required | Empty-cart outcome is unspecified. If accepted, backend must ignore `T` and use `C=0`; if rejected, no order/cart mutation | README §FR-08; empty-cart policy absent |
| FR08-DT-008 | RR-EMPTY-MISMATCH-INVALID | `POST /api/checkout` | Valid `U1` JWT; empty cart (`C=0`) | `T=1`; `shipping_address:null` | Not specified — user confirmation required | Three-way precedence is undocumented. Record the response/effects; any rejection preserves state, and any acceptance must use `C=0`, never `T=1` | README §FR-08; API spec §4.3 contract gaps |

## Coverage and reduction summary

- Full rules: 16 of 16 Boolean combinations (`R1`–`R16`), with no don't-care cause cells.
- Reduced rules and derived cases: 8. Exactly one case is derived from each reduced rule.
- `R1` and `R3` merge because FR-08 explicitly makes the client total irrelevant to the server-computed successful order total.
- `R9`–`R16` merge because a valid JWT is mandatory and all eight rules have the same assertable outcome: authentication rejection with no checkout side effects.
- Rules involving an empty cart or structurally invalid address are not over-reduced. Their acceptance, error response, and precedence are unspecified.
- Status codes and response schemas remain `Not specified`; no `400`, `401`, `422`, or success code is guessed.
- Future requests must receive `X-Student-Id: {{StudentID}}` through the Stage 4 collection-level pre-request script.
- No API call, GET request, Newman run, progress update, or automatic next-skill action occurred.

Status: Approved for Stage 1. No execution or pass/fail labeling has been performed. All proposed cases are designed to be executed in a later stage with a test harness that can observe order/cart state without using any GET request.
