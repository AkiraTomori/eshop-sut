# Pool B / FR-08 — Stage 3 Extension Proposal

> Scope: gap analysis against the human-confirmed Stage 2 audit for `POST /api/checkout`. These are new proposed cases; no Stage 1 row or Stage 2 label was edited. No request was executed and no GET request is designed.

## Confirmed baseline and extension policy

- Confirmed Stage 2 baseline: 62 unique cases, comprising 35 confirmation-ready `VALID`, 0 `INVALID`, and 27 `INCOMPLETE` after the user's second-pass reclassification of `FR08-DOM-020/021/022/029`.
- The extension adds only cases absent from all 62 source IDs. It does not count a renamed representative, an unresolved response-schema row, or a duplicate of an existing threat as a new case.
- Every new case has an enforceable FR/SEC invariant despite the absent exact status/schema. For branch-agnostic cases: rejection must make no order/cart mutation; acceptance must ignore the attacker-controlled value, use server cart total `C`, create only the authenticated user's order, and clear only that user's cart.
- Security gaps are prioritized: five of seven new cases address business-logic or parser/input-location tampering.
- Fixtures use disposable users/carts and placeholder identifiers. Future execution must use non-GET state observation and collection-level `X-Student-Id: {{StudentID}}` injection.

## Absence and non-duplication ledger

| Gap ID | Applicable skill | Confirmed coverage already present | Genuinely absent dimension | New case |
|---|---|---|---|---|
| GAP-DOM-01 | Domain Testing | Finite matching/mismatching, zero, negative, fractional, omitted, null, and string `total_amount` representatives | Valid JSON exponent whose runtime magnitude exceeds ordinary finite-number handling; not claimed as a documented BVA boundary | FR08-EXT-DOM-001 |
| GAP-DT-01 | Decision Table Testing | All 16 static combinations of authentication, empty cart, total relation, and address validity | Client total changes from matching to stale because the server cart is modified and settled before the checkout POST | FR08-EXT-DT-001 |
| GAP-SEC-01 | Security/Schema | Scalar extra fields `user_id`, `role`, `status`, and generic/prototype keys | Nested client-supplied order-line/item array attempts to replace server cart contents | FR08-EXT-SEC-001 |
| GAP-SEC-02 | Security/Schema | Client `total_amount` tampering and order-status/role mass assignment | Direct monetary discount injection without a valid coupon flow | FR08-EXT-SEC-002 |
| GAP-SEC-03 | Security/Schema | Body-field total tampering only | Query/body parameter-location collision for `total_amount` | FR08-EXT-SEC-003 |
| GAP-SEC-04 | Security/Schema | Malformed JSON, non-object JSON, and ordinary single-key bodies | Duplicate JSON member names with conflicting totals | FR08-EXT-SEC-004 |
| GAP-SEC-05 | Security/Schema | Malicious SQLi address payload | Benign address containing an apostrophe, needed to detect unsafe concatenation or overblocking false positives | FR08-EXT-SEC-005 |

## Proposed extension cases

| Test Case ID | Originating skill | Endpoint | Category/objective | Preconditions | Request/payload | Expected status | Expected response/side effects | Requirement source |
|---|---|---|---|---|---|---|---|---|
| FR08-EXT-DOM-001 | Domain Testing gap analysis | `POST /api/checkout` | Extreme numeric-encoding representative for non-authoritative `total_amount` | Valid `U1` JWT; normal address; fresh non-empty cart with independently known finite `C=250000` | Raw valid-grammar JSON object using `"total_amount":1e309` | Not specified | Parser rejection leaves order/cart unchanged and exposes no internals; if accepted, backend ignores the runtime-extreme client number, creates order total exactly `250000`, and clears the cart | README §FR-08; numeric body example in API §4.3 |
| FR08-EXT-DT-001 | Decision Table gap analysis | `POST /api/checkout` | Temporal stale-total rule after a completed cart change | Valid `U1` JWT/address; client captures `T=100000` while cart is `C-old=100000`; before POST, fixture setup completes an additional item and establishes `C-new=150000` | Send the old `total_amount:100000` only after the cart mutation is complete | Not specified | Backend recalculates the current cart, creates order total `150000` rather than stale `100000`, includes the current cart state, then clears `U1` cart | README §FR-08 |
| FR08-EXT-SEC-001 | Security/Schema gap analysis | `POST /api/checkout` | Nested order-line mass assignment | Valid `U1` JWT; fresh cart with known products/quantities and `C=250000` | Baseline body plus `"items":[{"id":999,"price":1,"quantity":999}]` | Not specified | Reject unchanged or ignore injected items; any accepted order contains only server-cart items/quantities and total `250000`, never the attacker array | README §FR-08; allowed body fields in API §4.3 |
| FR08-EXT-SEC-002 | Security/Schema gap analysis | `POST /api/checkout` | Unauthorized monetary discount/final-total injection | Valid `U1` JWT; fresh cart `C=250000`; no coupon was applied and no coupon usage state exists | Baseline body plus `"discount_amount":249999` | Not specified | Reject unchanged or ignore the injected discount; any accepted order remains based on server cart total `250000` and no coupon usage is recorded | README §FR-08/FR-09; checkout body in API §4.3; coupon endpoint in API §5.1 |
| FR08-EXT-SEC-003 | Security/Schema gap analysis | `POST /api/checkout` | Query/body parameter pollution | Valid `U1` JWT/address; fresh cart `C=250000` | `POST /api/checkout?total_amount=1` with baseline JSON body containing `total_amount:250000` | Not specified | Reject unchanged or ignore undocumented query value; any accepted order total is server-derived `250000`, never query value `1` | README §FR-08; API §4.3 documents body fields and no query parameter |
| FR08-EXT-SEC-004 | Security/Schema gap analysis | `POST /api/checkout` | Duplicate-key parser differential | Valid `U1` JWT/address; fresh cart `C=250000`; send raw JSON bytes without client reserialization | `{"total_amount":1,"total_amount":250000,"shipping_address":"123 Le Loi, TP.HCM"}` | Not specified | Reject ambiguous input without mutation or accept while ignoring both client representations and using server `C=250000`; no parser/stack disclosure | README §FR-08; JSON-object request in API §4.3 |
| FR08-EXT-SEC-005 | Security/Schema gap analysis | `POST /api/checkout` | Benign SQL delimiter / false-positive control | Valid `U1` JWT; fresh cart `C=250000`; otherwise normal body | `shipping_address:"12 O'Connor Street"` | Not specified | Parameterized handling does not cause a SQL error, truncation, or broad mutation; checkout succeeds with order total `250000`, literal address data, and cart clearing | README §SEC-05/FR-08; string address in API §4.3 |

## Required omission explanations

### FR08-EXT-DOM-001

Why AI missed it: The initial Domain pass correctly avoided inventing an undocumented maximum and selected ordinary finite representatives, but it did not separate JSON exponent/runtime-overflow encoding from the already-covered finite `T>C` class.

### FR08-EXT-DT-001

Why AI missed it: The mandatory four-cause decision table modeled `T=C` versus `T!=C` only at one instant; it did not add a temporal cause for a client total that was correct when displayed but became stale after a completed cart change.

### FR08-EXT-SEC-001

Why AI missed it: The initial Security pass covered scalar forbidden fields (`user_id`, `role`, and `status`) and total tampering, but it did not enumerate nested order-line mass assignment that attempts to replace the server cart itself.

### FR08-EXT-SEC-002

Why AI missed it: The selected endpoint prompt emphasized FR-08 and deliberately excluded the separate coupon API, so the model did not cross-check adjacent FR-09 monetary fields as attacker-supplied checkout properties.

### FR08-EXT-SEC-003

Why AI missed it: The initial parameter inventory found no documented checkout query parameters and therefore stopped at body/header locations instead of probing the same sensitive name across an undocumented query location.

### FR08-EXT-SEC-004

Why AI missed it: Envelope coverage included absent, malformed, and non-object JSON, but the prompt did not explicitly request duplicate-member parser differentials and the model treated a JSON object as having one value per field name.

### FR08-EXT-SEC-005

Why AI missed it: The security generation favored a malicious SQLi payload and omitted its benign apostrophe control, a common model bias toward attack strings without a paired false-positive test for parameterized handling.

## Coverage effect if approved

| Metric | Confirmed Stage 2 baseline | Stage 3 additions | Projected approved total |
|---|---:|---:|---:|
| Unique cases | 62 | 7 | 69 |
| Confirmation-ready cases | 35 | 7 with enforceable invariants | 42 |
| Domain extensions | — | 1 | 1 |
| Decision-table/temporal extensions | — | 1 | 1 |
| Security-focused extensions | — | 5 | 5 |

The five-case extension minimum is met without relying on any of the 27 still-incomplete Stage 2 rows. Exact statuses and response schemas remain unspecified; later automation must assert the documented state/integrity invariants and preserve branch-aware outcomes where shown.

No duplicate ID, GET request, out-of-scope endpoint, real secret, API execution, Newman run, source-case edit, progress update, or automatic Stage 4 action occurred.

Status: Approved for Stage 3 submission.
