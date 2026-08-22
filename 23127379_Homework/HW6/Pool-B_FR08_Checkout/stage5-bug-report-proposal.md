# Pool B / FR-08 — Stage 5 Bug Report Proposal

> Scope: triage of the corrected full run for the scored target `POST /api/checkout`. Register, Login, and Cart were user-authorized fixture-only POST calls. No GET request was executed, and no GitHub Issue was created or posted.

## Evidence and reproduction state

| Item | Observed value |
|---|---|
| Execution window | `2026-08-22T10:30:46+07:00`–`2026-08-22T10:30:51+07:00` |
| Environment | Local Docker `eshop-sut-backend-1`, `127.0.0.1:3000`; TCP readiness only |
| Repository HEAD | `5b0b028790be0e1ee33faf1cfa82ff2a558cddc0` |
| Backend source version | Commit `2905279438ecc8ec249e43963d14eb607be0f1a9`; SHA-256 `a9033d50e90f311b5d3448b277dc828efb5153a14590897633f5289c347bb8c9` |
| Scored run | 42 Checkout requests; 210 assertions; **209 passed, 1 failed** |
| Fixture traffic | 36 Register + 36 Login + 60 Cart POST requests; **0 fixture assertions and 0 added cases** |
| Header/method evidence | `X-Student-Id` correct on 174/174 transmitted requests; 174 POST and 0 GET |
| Checkout responses | 28 × `200`, 1 × `400`, 5 × `401`, 8 × `403` |
| Database evidence | Baseline 2 users/0 orders; after run 36 disposable users/28 disposable orders; after cleanup 2 users/0 orders |
| Primary evidence | `postman/newman/Pool-B_FR08_full_report.json`, `postman/newman/Pool-B_FR08_full_report.html`, `evidence/Pool-B_FR08_full_newman-cli.txt` |
| State evidence | `evidence/Pool-B_FR08_full_db-before.json`, `evidence/Pool-B_FR08_full_db-after.json`, `evidence/Pool-B_FR08_full_db-cleanup.json` |
| Secret handling | JWTs, fixture password, emails/run ID redacted from reports; tracked runtime values empty; ignored local runtime values cleared after cleanup |

## False-positive exclusion

| Check | Finding |
|---|---|
| Approved oracle | Non-object JSON rejection comes from the approved `DOM-007` object-envelope case. Server-side cart-total recomputation is explicit in README FR-08 and is repeated across the approved domain, decision, security, schema, and extension cases. |
| Fixture isolation | Each cart-dependent iteration registered a unique disposable subject; U2 was separately created only for the two ownership cases. No previous Checkout could influence a later case. |
| Cart total | Expected `C` was independently computed from fixture item price × quantity. It was not copied from the Checkout request. |
| Ownership | The after-state joins each order to the disposable authenticated subject and maps it back to the exact test-case ID without retaining email/password/token values. |
| Environment | TCP readiness succeeded; all requests were local POSTs; no DNS, connection, request-script, or setup request failed in the final run. |
| Student header | 174/174 transmitted requests carried the environment `StudentID`. |
| Runner corrections | The earlier `StudentId` key mismatch and full-run regular-expression serialization error were corrected and rerun under new disposable run IDs. Diagnostic rows/reports are excluded from SUT findings. |
| Unspecified contracts | No bug relies on an exact success/error status or response schema. Branch-aware cases allow reject-or-accept, but acceptance must use server total `C`. |
| Cleanup | All 36 final-run fixture users and 28 orders were removed after evidence capture; the database returned to 2 users/0 orders. |

## Failure classification table

| Failure ID | Test Case ID | Proposed classification | Evidence | Requirement source | Reason/missing evidence |
|---|---|---|---|---|---|
| `PB-F-SHAPE-001` | `FR08-DOM-007` | **Probable SUT defect** | Newman observed `200` instead of a `4xx`; SQLite recorded one U1 order with `orderTotal=null` and `shippingAddress=null` after body `[]` | API specification §4.3 object request shape; confirmed Stage 2 oracle | Authentication and fixture setup passed. The endpoint accepted a non-object JSON envelope and created malformed order state. |
| `PB-F-TOTAL-001` | `FR08-DOM-015/016/017/018/020/021`, `FR08-DT-002`, `FR08-SEC-009`, `FR08-SEC-011`, `FR08-SCH-006`, `FR08-EXT-DOM-001`, `FR08-EXT-DT-001` | **Probable SUT defect** | All 12 returned `200` and created an order whose persisted total matched the untrusted request representation/value rather than fixture cart total `C`; observed totals were `249999`, `250001`, `0`, `-1`, `null`, `null`, `1`, `250000` for a U2 cart of `150000`, `1`, `1`, `null`, and stale `100000` for current cart `150000` | README FR-08 | The cases use isolated carts and independent totals. Rejecting was allowed, but accepted orders were required to use server `C`; no exact response schema is assumed. |
| `PB-F-RUNNER-001` | Superseded authentication diagnostic | **Test script/data issue** | Collection looked up `StudentId` instead of `StudentID` | Mandatory student-header rule | Corrected before the clean authentication and full runs; not SUT evidence. |
| `PB-F-RUNNER-002` | Superseded first full diagnostic | **Test script/data issue** | Escaped regex serialized incorrectly and raised `ReferenceError: i is not defined` in Checkout assertions | Collection assertion implementation | Diagnostic fixtures were deleted, the script was corrected and syntax-validated, reports were overwritten, and the final run used a new run ID. |
| `PB-EVIDENCE-CART-001` | All 28 accepted Checkout cases | **Insufficient evidence for cart-clearing sub-oracle** | SQLite proves orders but carts are held only in backend memory; no approved non-GET cart observation endpoint exists | README FR-08 | Cart clearing is not declared passed or failed. This gap does not weaken the independently proven order-total defects. |
| `PB-CONFORM-001` | Authentication cases; `SEC-010/012/013/014`; normal positive controls | **No failure / conforming observed portion** | Auth failures created no orders; injected U2 ID did not change U1 ownership; role/status were ignored; SQL apostrophe remained literal; normal controls used correct totals | README FR-08/SEC-02/SEC-05; API specification §4 | Only the observable approved invariants are classified; unspecified response fields and cart clearing are excluded. |

The final evidence supports two independent SUT root causes. They remain separate because request-envelope validation and monetary-total authority are different behaviors and impacts.

---

# BUG-PB-001: Checkout accepts a JSON array and creates an order with null fields

- API/FR: FR-08 — `POST /api/checkout`
- Proposed severity: Medium
- Environment/SUT version: Local Docker `eshop-sut-backend-1`; repository HEAD `5b0b028790be0e1ee33faf1cfa82ff2a558cddc0`
- Test Case ID: `FR08-DOM-007`
- Requirement source: API specification §4.3; confirmed Stage 2 object-envelope oracle

## Preconditions

- The authorized local backend is listening on `127.0.0.1:3000`.
- A disposable authenticated U1 exists with a valid bearer token and a non-empty fixture cart.
- The collection-level script supplies `X-Student-Id`.

## Reproduction steps

1. Use fixture-only POST calls to create/login the disposable U1 and seed its cart.
2. Send `POST /api/checkout` with U1's valid bearer token, `Content-Type: application/json`, and raw body `[]`.
3. Record the response.
4. Inspect only the disposable U1 order row through the approved restricted SQLite snapshot; do not add a GET verification request.

## Expected result

Reject the non-object JSON body with a client-error response and create no order. The exact status and error schema are unspecified.

## Actual result

The endpoint returned HTTP `200` with `{"message":"Checkout successful","orderId":32}`. The redacted after-state recorded an order for the authenticated U1 with `orderTotal=null` and `shippingAddress=null`.

## Impact

Authenticated clients can create malformed orders that violate the documented request structure and leave null monetary/address data in persistent order state.

## Evidence

- Newman CLI: `evidence/Pool-B_FR08_full_newman-cli.txt` — failure `FR08-DOM-007 - rejected without server error`
- Newman JSON/HTML: `postman/newman/Pool-B_FR08_full_report.json`, `postman/newman/Pool-B_FR08_full_report.html`
- Database mapping: `evidence/Pool-B_FR08_full_db-after.json`, record `FR08-DOM-007`
- Screenshot: `[USER MUST ATTACH A REAL FAILURE-DETAIL SCREENSHOT]`

## GitHub Issue content

- **Title:** `[FR-08][POST /api/checkout] JSON array body creates an order with null total and address`
- **Body:**
  - Preconditions: authorized local backend, disposable authenticated U1, and non-empty fixture cart.
  - Reproduction: send Checkout with raw JSON body `[]`; capture the response and restricted disposable-order snapshot.
  - Expected: `4xx` rejection and no order; exact status/schema unspecified.
  - Actual: HTTP `200` and one U1 order with null total/address.
  - Impact: malformed persistent order records can be created through a contract-invalid envelope.
  - Evidence: attach the redacted Newman case, database record, and `[USER MUST ATTACH A REAL FAILURE-DETAIL SCREENSHOT]`.
- **Proposed labels:** `bug`, `validation`, `data-integrity`, `FR-08`, `api`

---

# BUG-PB-002: Checkout trusts client total instead of recalculating from the authenticated cart

- API/FR: FR-08 — `POST /api/checkout`
- Proposed severity: High
- Environment/SUT version: Local Docker `eshop-sut-backend-1`; repository HEAD `5b0b028790be0e1ee33faf1cfa82ff2a558cddc0`
- Test Case ID: 12 cases listed under `PB-F-TOTAL-001`
- Requirement source: README FR-08

## Preconditions

- Create a unique disposable U1 through fixture-only Register/Login calls and capture its valid bearer token.
- Seed U1's cart through fixture-only Cart calls with independently known total `C=250000` (or the per-case `C=150000`).
- Record the zero-order before-state for only that disposable subject.

## Reproduction steps

1. Send `POST /api/checkout` with the valid subject token and a normal address, but set `total_amount` to a value different from cart total `C`. Minimal representative: send `1` while `C=250000` (`FR08-SEC-011`).
2. Record the response.
3. Inspect only the disposable subject's created order through the approved SQLite snapshot; do not add a GET verification request.
4. Compare the persisted total with independently calculated `C`.

## Expected result

The server may reject without mutation or accept after recalculating from the authenticated subject's cart. Any accepted order total must equal `C=250000`, never the client value `1`.

## Actual result

The representative returned HTTP `200` and persisted an order total of `1`. Eleven additional isolated cases reproduced the same client-authority behavior across lower/higher, zero, negative, omitted, null, extreme, stale-total, schema, and U2-isolation probes. In `FR08-SEC-009`, the order correctly belonged to U2 but stored client `250000` instead of U2 cart `150000`.

## Impact

An authenticated client can underpay, create zero/negative/null totals, overstate totals, or submit a stale total. This breaks FR-08's authoritative server-side pricing rule and threatens order/payment integrity.

## Evidence

- Per-case responses: `postman/newman/Pool-B_FR08_full_report.json`
- CLI execution summary: `evidence/Pool-B_FR08_full_newman-cli.txt`
- Persisted totals and subject ownership: `evidence/Pool-B_FR08_full_db-after.json`
- Before/cleanup proof: `evidence/Pool-B_FR08_full_db-before.json`, `evidence/Pool-B_FR08_full_db-cleanup.json`
- Screenshot: `[USER MUST ATTACH A REAL SCREENSHOT OF THE REDACTED NEWMAN CASE AND DATABASE TOTAL COMPARISON]`

## GitHub Issue content

- **Title:** `[FR-08][POST /api/checkout] Backend persists attacker-controlled total_amount instead of cart total`
- **Body:**
  - Preconditions: disposable authenticated subject and fixture cart with independently known server total.
  - Reproduction: with cart `C=250000`, submit Checkout using `total_amount:1`, then inspect only the disposable order row.
  - Expected: reject unchanged or accept using server-recalculated `250000` under README FR-08.
  - Actual: HTTP `200`; persisted order total was `1`. Twelve isolated cases demonstrate the same root cause, including null, negative, stale, and distinct-user-cart totals.
  - Impact: client-controlled pricing permits underpayment and invalid financial records.
  - Evidence: attach redacted Newman/database evidence and `[USER MUST ATTACH A REAL SCREENSHOT OF THE REDACTED TOTAL COMPARISON]`.
- **Proposed labels:** `bug`, `security`, `business-logic`, `data-integrity`, `FR-08`, `api`

## Historical evidence ledger

- The initial Stage 5 proposal found no runtime evidence and correctly drafted no bug.
- The later 13-case authentication-only run passed 65/65 assertions and supported no authentication defect.
- The user then explicitly authorized Register/Login/Cart as fixture-only infrastructure. The corrected full run supersedes the earlier evidence gap and supports the two proposals above.
- No historical audit row or runner correction is reclassified as a SUT bug.

## Human review and posting gate

- Review the two proposed classifications and severities.
- Attach real failure-detail screenshots; none was fabricated.
- Manually post only accepted GitHub Issues. The agent has not posted or applied labels.
- Enter `confirm stage 5` only if this revised proposal is accepted. That confirmation marks only Stage 5 complete; Pool B remains `IN_PROGRESS` until the Pool-local AI audit is reviewed and `confirm pool audit` is entered.

Status: Approved for Stage 5 submission. The two proposed GitHub Issues are supported by the final full-run evidence and meet the requirements of the assignment.
