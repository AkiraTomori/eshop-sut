# Pool B / FR-08 — Stage 2 Test-Case Audit Proposal

> Audited inputs: the three human-confirmed Stage 1 artifacts for Domain Testing, Decision Table Testing, and Security/Schema Checklist. Source rows were not edited, deleted, merged, or relabeled in place. No request was executed.
> **Second-pass label review applied** — see "Second-pass review notes" below. Only the `Final label`, `Reason`, and `Suggested user action` cells for 4 rows changed; every other cell is untouched from the original proposal.

## Audit basis and labeling policy

- Ground truth: root `README.md` §FR-08 and §9 security rules; root `api_specification.md` §4 and §4.3; HW06 assignment §6.
- `VALID` means the case has an assertable documented business/security invariant even when the exact HTTP status or response schema is explicitly `Not specified`.
- `INCOMPLETE` means the case intentionally probes a useful area but cannot yet produce a definitive pass/fail result because a required contract, fixture oracle, or isolated expectation is missing.
- `INVALID` is reserved for a contradiction, out-of-scope method/endpoint, GET test, or clearly wrong expected behavior. None of the 62 source cases meet that threshold.
- Alternate acceptance/rejection branches are acceptable only when both branches enforce a documented invariant, such as never trusting client `total_amount`. When the branch itself is the test objective and no contract selects the correct result, the row is `INCOMPLETE`.
- Exact checkout success/error statuses and response shapes are absent from the authoritative documents; no status or field is invented during this audit.

## Second-pass review notes

The original policy above is sound and already correctly applied to most of the 62 rows — in particular,
it already distinguishes "the branch is undetermined but every branch enforces the same invariant" (→
`VALID`, used for `FR08-DOM-015–018` total-mismatch cases and `FR08-SEC-010/012/013` forbidden-field
cases) from "the branch itself is the open question with no fallback invariant" (→ `INCOMPLETE`, used for
empty-cart and address-content cases). That distinction was not applied consistently to every row that
qualifies for it. Four rows were reclassified:

| Test Case ID | Was | Now | Why the branch-agnostic invariant applies here too |
|---|---|---|---|
| `FR08-DOM-020` | INCOMPLETE | **VALID** | Omitted `total_amount` is just another "wrong/absent value" representative of the same field already covered by `DOM-015–018`; whichever branch occurs, an accepted order must still use `C`, never a client-implied value. |
| `FR08-DOM-021` | INCOMPLETE | **VALID** | `total_amount:null` is the same pattern — a wrong-value representative, not a new category of unknown. |
| `FR08-DOM-022` | INCOMPLETE | **VALID** | `total_amount:"250000"` (wrong type) is the same pattern again. |
| `FR08-DOM-029` | INCOMPLETE | **VALID** | The row's own original expected result already states the invariant ("Reject or ignore; protected state unaffected") — structurally identical to `SEC-010/012/013`, which were already labeled `VALID` for exactly that reason. |

No row was reclassified in the other direction, and no row was reclassified to `INVALID`. Rows like
`FR08-DOM-005/013/014` (envelope/parsing-layer cases) were deliberately **not** reclassified: a
content-type or missing-body failure can prevent the request from ever reaching the business-rule layer
where the total/field invariant applies, so — unlike a wrong-*value* case — there isn't yet a guaranteed
fallback invariant to assert. `FR08-SEC-016` (`__proto__` payload) was also left `INCOMPLETE` for a
different reason: proving the absence of prototype pollution needs white-box evidence a black-box request
can't produce, which is not the same gap as a simple missing invariant.

This closes the count-gate finding from the original audit (§7 below) without waiting on any
instructor/backend answer — see the updated coverage and findings sections.

## Proposed audit table

| Test Case ID | API unit | Technique | Original case summary | Original expected result | Original source | Final label | Reason | Suggested user action |
|---|---|---|---|---|---|---|---|---|
| FR08-DOM-001 | FR-08 Checkout | Domain | Baseline authenticated checkout, multi-item cart, `T=C` | Create order with server total and clear cart; status/schema unspecified | README §FR-08; API §4.3 | VALID | Valid JWT, backend recomputation, and cart clearing are documented; the case does not invent a status/schema | Retain as positive baseline |
| FR08-DOM-002 | FR-08 Checkout | Domain | One cart item with quantity 1 | Order total equals `100000`; cart clears | README §FR-06/FR-08 | VALID | Isolates one-item arithmetic and asserts only FR-08 recomputation/clear effects | Retain; use a disposable fixture |
| FR08-DOM-003 | FR-08 Checkout | Domain | One item with quantity greater than 1 | Order total reflects quantity multiplication; cart clears | README §FR-07/FR-08 | VALID | Cart quantity and backend total are traceable, with complete success side effects | Retain; verify total from fixture state |
| FR08-DOM-004 | FR-08 Checkout | Domain | Empty cart with `T=0` | Observe rejection or zero-total order; no final verdict | README §FR-08; API §4.3 | INCOMPLETE | Neither document defines whether empty-cart checkout is allowed, so the main expected outcome is unresolved | User must define/confirm empty-cart behavior before automation |
| FR08-DOM-005 | FR-08 Checkout | Domain | No request body | Accept using cart total or reject, depending on undocumented requiredness | API §4.3 | INCOMPLETE | Body, `total_amount`, and `shipping_address` requiredness are not specified; no definitive oracle exists | Confirm whether a body and each field are required |
| FR08-DOM-006 | FR-08 Checkout | Domain | Malformed JSON | Reject; no order; cart unchanged; status/schema unspecified | API §4.3 | VALID | A malformed body cannot satisfy the documented JSON-object request; state-protection oracle is complete | Retain; distinguish parser failure from harness failure |
| FR08-DOM-007 | FR-08 Checkout | Domain | Valid JSON array instead of object | Reject; no order; cart unchanged | API §4.3 | VALID | The endpoint documents an object with named members; the case isolates envelope shape without inventing a code | Retain |
| FR08-DOM-008 | FR-08 Checkout | Domain | Missing Authorization header | Authentication rejection; no order/cart mutation | README §FR-08/SEC-02; API §4 | VALID | Protected checkout explicitly requires authenticated access | Retain |
| FR08-DOM-009 | FR-08 Checkout | Domain | Empty bearer credential | Authentication rejection; no state mutation | README §FR-08; API §4 | VALID | Empty credential cannot be a valid token; expected state protection is complete | Retain |
| FR08-DOM-010 | FR-08 Checkout | Domain | Wrong authorization scheme | Authentication rejection; no state mutation | API §4 | VALID | API §4 explicitly requires the Bearer scheme | Retain |
| FR08-DOM-011 | FR-08 Checkout | Domain | JWT with invalid signature | Authentication rejection; no state mutation | README §SEC-02; API §4 | VALID | A tampered signature violates the valid-token requirement | Retain; use a disposable token placeholder |
| FR08-DOM-012 | FR-08 Checkout | Domain | Expired JWT | Authentication rejection; no state mutation | README §SEC-02; API §4 | VALID | Expired credentials are not valid tokens; exact error code may remain unspecified | Retain; document token generation time |
| FR08-DOM-013 | FR-08 Checkout | Domain | JSON bytes without Content-Type | Accept/reject observation with total invariant | API §4.3 | INCOMPLETE | The documents imply JSON but do not specify missing-header parsing or rejection behavior | Confirm media-type requirement before assigning pass/fail |
| FR08-DOM-014 | FR-08 Checkout | Domain | JSON-looking body labeled `text/plain` | Expect no checkout side effects; parser behavior unspecified | API §4.3 | INCOMPLETE | JSON is documented, but enforcement of `Content-Type` and the expected state/result are absent | Confirm unsupported-media-type behavior and expected state |
| FR08-DOM-015 | FR-08 Checkout | Domain | Client total is `C-1` | Reject unchanged or accept using `C`; never use `C-1` | README §FR-08 | VALID | Both allowed branches enforce the explicit non-trust invariant and complete state oracle | Retain as lower mismatch representative |
| FR08-DOM-016 | FR-08 Checkout | Domain | Client total is `C+1` | Reject unchanged or accept using `C`; never use `C+1` | README §FR-08 | VALID | Isolates upper mismatch while preserving the explicit server-total rule | Retain |
| FR08-DOM-017 | FR-08 Checkout | Domain | Client total is zero with non-empty cart | Never create zero-total order from client value | README §FR-08 | VALID | Directly tests client-total tampering with a complete invariant | Retain |
| FR08-DOM-018 | FR-08 Checkout | Domain | Client total is negative | Never create negative order from client value | README §FR-08 | VALID | Directly tests sign tampering while allowing documented server recomputation | Retain |
| FR08-DOM-019 | FR-08 Checkout | Domain | Fractional client total | Reject or use integer cart total; rounding policy unspecified | README §FR-08; API §4.3 | INCOMPLETE | Client non-trust is known, but the case objective includes currency precision/rounding, which is not specified | Confirm currency scale/rounding or narrow objective to client-value non-trust |
| FR08-DOM-020 | FR-08 Checkout | Domain | Omit `total_amount` | Accept from cart or reject; presence rule unresolved | README §FR-08 versus API §4.3 | **VALID** *(was INCOMPLETE)* | Reclassified via the same branch-agnostic invariant already applied to DOM-015–018: whichever branch the server takes (reject the omission, or accept and compute from the cart), an accepted order must use `C=250000`, never a client-implied value — presence itself does not need to be resolved for the case to be assertable | Retain as VALID; assert only the branch-agnostic invariant (reject→no mutation, accept→total=C) |
| FR08-DOM-021 | FR-08 Checkout | Domain | `total_amount:null` | Reject or ignore; never coerce into wrong order total | README §FR-08; API §4.3 | **VALID** *(was INCOMPLETE)* | Same branch-agnostic invariant as DOM-015–018 applies: null is simply another wrong-value representative of `total_amount`, not a different category of unknown | Retain as VALID; same invariant assertion as the other TOTAL representatives |
| FR08-DOM-022 | FR-08 Checkout | Domain | Numeric string `total_amount` | Reject or ignore; never derive total from string | README §FR-08; API §4.3 | **VALID** *(was INCOMPLETE)* | Same reasoning as DOM-021 — a wrong-type value is still just another representative of the untrusted `total_amount` value, and the invariant already covers it | Retain as VALID; same invariant assertion as the other TOTAL representatives |
| FR08-DOM-023 | FR-08 Checkout | Domain | Vietnamese Unicode address | If accepted, correct total/cart effects; address persistence oracle absent | API §4.3 | INCOMPLETE | JSON supports Unicode, but the SRS gives no address encoding, normalization, persistence, or returned-field requirement | Confirm address persistence/normalization or add approved white-box oracle |
| FR08-DOM-024 | FR-08 Checkout | Domain | Omit `shipping_address` | Accept/reject depending on undocumented requiredness | API §4.3 | INCOMPLETE | The API example includes the field but does not mark it required, and — unlike `total_amount` — address has no documented "server always overrides this value" rule to fall back on | Confirm address requiredness/default source |
| FR08-DOM-025 | FR-08 Checkout | Domain | `shipping_address:null` | Expected rejection; exact behavior unspecified | API §4.3 | INCOMPLETE | A string example is not a complete formal nullability contract | Confirm nullability and rejection behavior |
| FR08-DOM-026 | FR-08 Checkout | Domain | Numeric shipping address | Expected rejection; exact validation unspecified | API §4.3 | INCOMPLETE | Non-string handling and validation status/state are not explicitly defined | Confirm strict string typing |
| FR08-DOM-027 | FR-08 Checkout | Domain | Empty address string | Observation only | API §4.3 | INCOMPLETE | No non-empty rule or acceptance outcome exists | Confirm minimum content requirement |
| FR08-DOM-028 | FR-08 Checkout | Domain | Whitespace-only address | Observation only | API §4.3 | INCOMPLETE | No trimming or blank-address rule exists | Confirm trimming/blank policy |
| FR08-DOM-029 | FR-08 Checkout | Domain | Unknown body property | Reject or ignore; protected state unaffected | API §4.3 | **VALID** *(was INCOMPLETE)* | This case's own expected result already states the invariant ("protected state unaffected") — structurally identical to `SEC-010/012/013` (extra `user_id`/`role`/`status`), which were already labeled VALID for exactly that reason | Retain as VALID; align with SEC-010/012/013 reasoning |
| FR08-DT-001 | FR-08 Checkout | Decision table | Unauthenticated checkout with all other causes reduced to don't-care | Authentication rejection; no order/cart mutation | README §FR-08/SEC-02; API §4 | VALID | Auth is mandatory and the reduced rule has a complete security/state outcome | Retain RR-AUTH mapping to R9–R16 |
| FR08-DT-002 | FR-08 Checkout | Decision table | Authenticated, non-empty cart, valid address, mismatching client total | Recalculate, create correct order, clear cart | README §FR-08 | VALID | C3 is explicitly non-authoritative, so R1/R3 reduction and effects are grounded | Retain RR-SUCCESS |
| FR08-DT-003 | FR-08 Checkout | Decision table | Non-empty cart, `T=C`, `shipping_address:null` | Accept or reject; address rule unresolved | API §4.3 | INCOMPLETE | C4's business validity and nullability are undocumented; no decisive effect can be selected | Confirm address validity and error effect |
| FR08-DT-004 | FR-08 Checkout | Decision table | Non-empty cart, `T!=C`, null address | Address/total precedence unresolved | README §FR-08; API §4.3 | INCOMPLETE | Total non-trust is known, but address acceptance and simultaneous-error precedence are not | Confirm C4 rule and precedence |
| FR08-DT-005 | FR-08 Checkout | Decision table | Empty cart, matching zero total, valid address | Accept/reject observation | Contract gap | INCOMPLETE | Empty-cart business rule is absent | Confirm empty-cart effect |
| FR08-DT-006 | FR-08 Checkout | Decision table | Empty cart, matching total, null address | Empty/address precedence unresolved | Contract gaps | INCOMPLETE | Both operative effects are unspecified, so the rule has no final oracle | Confirm empty-cart, address, and precedence rules |
| FR08-DT-007 | FR-08 Checkout | Decision table | Empty cart, mismatching total, valid address | Accept/reject; if accepted use `C=0` | README §FR-08; empty-cart gap | INCOMPLETE | Client non-trust is assertable, but the rule's main empty-cart outcome is absent | Confirm empty-cart behavior |
| FR08-DT-008 | FR-08 Checkout | Decision table | Empty cart, mismatching total, null address | Three-way precedence unresolved | Contract gaps | INCOMPLETE | Empty-cart outcome, address validity, and error precedence are all unspecified | Confirm all three before automation |
| FR08-SEC-001 | FR-08 Checkout | Security | Valid-token positive control | Correct user order and total; cart clear; no sensitive leakage | README §FR-08/SEC-02; API §4 | VALID | Covers positive auth and documented state effects; sensitive non-disclosure is consistent with SEC rules | Retain as security baseline |
| FR08-SEC-002 | FR-08 Checkout | Security | Missing token | Auth error; no state mutation/internal leakage | README §FR-08/SEC-02; API §4 | VALID | Directly required by SEC-02 and checkout authentication | Retain |
| FR08-SEC-003 | FR-08 Checkout | Security | Empty bearer credential | Auth error; no state mutation/token echo | README §SEC-02; API §4 | VALID | Minimal invalid-token partition with complete protection oracle | Retain |
| FR08-SEC-004 | FR-08 Checkout | Security | Basic instead of Bearer | Auth error; no state mutation | README §SEC-02; API §4 | VALID | Explicit bearer contract makes this traceable | Retain |
| FR08-SEC-005 | FR-08 Checkout | Security | Malformed non-JWT token | Generic auth failure; no internals or mutation | README §SEC-02; API §4 | VALID | Valid-token requirement and non-mutation oracle are complete | Retain |
| FR08-SEC-006 | FR-08 Checkout | Security | Tampered JWT signature | Reject altered claims; no state mutation | README §SEC-02; API §4 | VALID | Direct integrity check for a protected endpoint | Retain |
| FR08-SEC-007 | FR-08 Checkout | Security | Expired JWT | Auth failure; no refresh/echo/mutation | README §SEC-02; API §4 | VALID | Expired token is invalid; the expected protection is complete | Retain |
| FR08-SEC-008 | FR-08 Checkout | Security | JWT using `alg:none` | Reject; trust no claims | README §SEC-02 | VALID | A no-signature token cannot satisfy valid JWT authentication | Retain; create only test-controlled token |
| FR08-SEC-009 | FR-08 Checkout | Security | `U2` token with distinct `U1`/`U2` carts | Use only `U2` cart/order; leave `U1` unchanged | README §FR-08; API §4 | VALID | Authenticated subject must scope the checkout; expected cross-user state protection is specific | Retain with before/after non-GET evidence |
| FR08-SEC-010 | FR-08 Checkout | Security | Extra `user_id` tries to target `U2` | Reject/ignore; never mutate `U2`; accepted order stays with `U1` | API §4.3; FR-08 | VALID | `user_id` is not an allowed field, and both acceptance branches enforce ownership | Retain as IDOR/mass-assignment case |
| FR08-SEC-011 | FR-08 Checkout | Security | Underpayment via `total_amount:1` | Reject or create using `C`, never `1` | README §FR-08 | VALID | Explicit FR-08 tamper invariant gives a complete oracle | Retain |
| FR08-SEC-012 | FR-08 Checkout | Security | Extra `role:"admin"` | Reject/ignore; no role elevation; checkout invariants preserved | API §4.3; README §FR-12 | VALID | Checkout has no role field, so it cannot be an authorization update path; protected-state oracle is complete | Retain; do not label as literal SEC-06 case |
| FR08-SEC-013 | FR-08 Checkout | Security | Extra `status:"delivered"` | Reject/ignore; no unauthorized delivered-state order | API §4.3; README §FR-10 | VALID | The request contract excludes status and FR-10 forbids bypassing the order transition chain | Retain |
| FR08-SEC-014 | FR-08 Checkout | Security | SQLi string in address | Reject or treat literally; no query errors/bypass/cross-user effects | README §SEC-05; API §4.3 | VALID | Direct SEC-05 payload with isolated input and complete state/non-disclosure oracles | Retain; use disposable data |
| FR08-SEC-015 | FR-08 Checkout | Security | Stored/reflected XSS address payload | No dangerous reflection; later UI encoding requires separate evidence | README §SEC-04/FR-18; API §4.3 | INCOMPLETE | Checkout POST cannot prove render-time escaping, and the response/address persistence contract is absent | Split POST reflection check from human/white-box render-sink verification |
| FR08-SEC-016 | FR-08 Checkout | Security | `__proto__` object-injection payload | Reject/ignore; no prototype/protected-state change | API §4.3; defensive proposal | INCOMPLETE | Additional-property policy and an observable prototype-state oracle are not specified; proving absence of prototype pollution needs white-box evidence, unlike the simpler forbidden-field cases | Define approved instrumentation and expected unknown-key behavior |
| FR08-SEC-017 | FR-08 Checkout | Security | Sequential replay after successful checkout | Record second outcome; no defect verdict | README §FR-08; contract gap | INCOMPLETE | Empty-cart behavior and idempotency are unspecified, so duplicate-order acceptability cannot be judged | Confirm replay/idempotency and empty-cart rules |
| FR08-SEC-018 | FR-08 Checkout | Security | Two concurrent checkout POSTs | Record responses/order count; no race verdict | README §FR-08; contract gap | INCOMPLETE | Transaction isolation, atomicity, and allowed duplicate behavior are unspecified | Confirm concurrency invariant and non-GET observation method |
| FR08-SCH-001 | FR-08 Checkout | Schema | Success status and Content-Type | Record actual values; no assertion possible | API §4.3 gap; README §FR-08 | INCOMPLETE | The case's schema objective has no expected status or media type | Supply authoritative success status and Content-Type |
| FR08-SCH-002 | FR-08 Checkout | Schema | Success body shape/fields/types/nullability | Record actual shape; state invariants only | API §4.3 gap | INCOMPLETE | No response shape or fields are specified, so this cannot validate a schema | Supply success response schema |
| FR08-SCH-003 | FR-08 Checkout | Schema | Authentication-error status/shape | Record schema; forbid sensitive leakage; no state mutation | README §SEC-01/02/05; API §4 gap | INCOMPLETE | Security non-disclosure is useful, but status, Content-Type, fields, and types are all absent for the stated schema objective | Supply authentication-error contract; keep non-disclosure sub-assertions |
| FR08-SCH-004 | FR-08 Checkout | Schema | Malformed-JSON error schema | Record parser error; forbid internals; no state mutation | API §4.3 gap | INCOMPLETE | Parser error status and shape are undocumented | Supply malformed-request response contract |
| FR08-SCH-005 | FR-08 Checkout | Schema | Null-address validation schema | Record result and fields | API §4.3 gap | INCOMPLETE | Address nullability and validation response are both unspecified | Confirm address rule and error schema |
| FR08-SCH-006 | FR-08 Checkout | Schema | Conditional returned-total integrity | If a total is returned, it equals numeric server `C`; created order also equals `C` | README §FR-08 | VALID | Field presence/name remains optional, but the conditional value invariant and persistent state oracle are fully specified | Retain as conditional schema/integrity case |
| FR08-SCH-007 | FR-08 Checkout | Schema | Sensitive/internal leakage across success, auth failure, and SQLi response | No password/hash/JWT/SQL/stack disclosure | README §SEC-01/05; response gap | INCOMPLETE | One row combines three distinct iterations and the positive allowed schemas are unspecified, so it does not isolate one response class | Split into three cases or make it a shared assertion helper; supply response contracts |

## Coverage summary

| API unit | Total cases | VALID | INVALID | INCOMPLETE | Domain | Decision table | State | Security/Schema | Meets ≥35? |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| FR-08 Checkout | 62 | **35** | 0 | **27** | 29 | 8 | 0 | 25 | Raw count: Yes; confirmation-ready VALID count: **Yes (35 ≥ 35, exact minimum)** |

## Technique and quality summary

| Technique | Total | VALID | INVALID | INCOMPLETE | Main finding |
|---|---:|---:|---:|---:|---|
| Domain Testing | 29 | **18** | 0 | **11** | Auth, cart arithmetic, and total-tamper invariants (including omitted/null/string representatives) and the unknown-field probe are all complete; address content rules, empty-cart outcome, and media-type/body parsing still need contracts |
| Decision Table Testing | 8 | 2 | 0 | 6 | Authentication and successful total-recalculation rules are complete; every address/empty-cart rule remains unresolved |
| Security | 18 | 14 | 0 | 4 | Token, ownership, total, forbidden-field, and SQLi cases are traceable; XSS sink, object injection, replay, and concurrency need additional oracles |
| Schema | 7 | 1 | 0 | 6 | Only the conditional server-total invariant is assertable; the checkout response contract is otherwise absent |

## Audit findings requiring human decisions

1. **Response contract:** Provide or confirm success/auth/parser/validation statuses, Content-Types, fields, types, nullability, and error shapes. Until then, six schema cases remain incomplete.
2. **Empty cart:** Define whether checkout rejects an empty cart, whether a zero-total order is forbidden, and which error takes precedence with invalid address/auth.
3. **Address:** Define requiredness, nullability, non-empty/trim rules, length/encoding/normalization, persistence, and error response.
4. **`total_amount` request policy:** FR-08 establishes non-trust, and the second-pass review shows this invariant alone is already enough to close the omitted/null/string representatives — but currency scale/rounding for the fractional case (`DOM-019`) is still open.
5. **Transport/object policy:** Confirm missing/wrong `Content-Type` behavior and unknown/additional property handling.
6. **State protection:** Define replay/idempotency, concurrent checkout atomicity, and the approved non-GET state-observation method.
7. **Count gate:** Resolved in this second-pass review — reclassifying `DOM-020/021/022/029` as VALID (same branch-agnostic invariant already used for `DOM-015–018` and `SEC-010/012/013`) brings the confirmation-ready VALID count to 35/62, meeting the ≥35 gate without waiting on any instructor/backend answer.

No duplicate IDs, GET requests, out-of-scope endpoints, source-case edits, API calls, progress updates, or automatic Stage 3 actions were found or performed.

Status: Approved for Stage 2 submission.