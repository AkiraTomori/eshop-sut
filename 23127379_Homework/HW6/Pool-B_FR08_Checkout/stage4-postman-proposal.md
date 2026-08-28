# Pool B / FR-08 — Stage 4 Postman Proposal and Full Execution Evidence

> Scope: the only scored test target is `POST /api/checkout`. At the user's explicit direction, `POST /api/register`, `POST /api/login`, and `POST /api/cart` are used only as setup/fixture calls. They have no requirement assertions, add no test cases, and do not count toward the Pool B minimum. No GET request was designed or executed.

## 1. Approved case input

| Input | Included rows | Treatment |
|---|---:|---|
| Stage 2 `VALID` cases | 35 | Preserved without changing approved labels or oracles |
| Stage 3 approved extensions | 7 | Preserved with their approved branch-aware oracles |
| Stage 2 `INCOMPLETE` cases | 0 of 27 | Excluded because their contracts/oracles remain unresolved |
| Scored Checkout total | **42** | All 42 were enabled and executed in the final run |

Excluded unresolved IDs remain: `FR08-DOM-004/005/013/014/019/023/024/025/026/027/028`, `FR08-DT-003/004/005/006/007/008`, `FR08-SEC-015/016/017/018`, and `FR08-SCH-001/002/003/004/005/007`.

## 2. Final collection structure and fixture boundary

```text
StudentID HW06 EShop API Testing - Pool B
├── Setup / Fixtures
│   ├── Fixture only - Register U1
│   ├── Fixture only - Register U2
│   ├── Fixture only - Login U1 and capture JWT
│   ├── Fixture only - Login U2 and capture JWT
│   ├── Fixture only - Seed U1 cart item 1
│   ├── Fixture only - Seed U1 cart item 2
│   ├── Fixture only - Seed U2 cart item 1
│   └── Fixture only - Seed U2 cart item 2
└── Pool B - FR-08 Checkout
    └── {{testCaseId}} - POST /api/checkout
```

- Setup requests are conditional and run only when the current Checkout row needs that subject or cart item.
- Every Checkout iteration uses disposable per-case users so a previous mutation cannot contaminate the next case.
- Login scripts chain real local JWTs through `u1_token` and `u2_token`; Checkout uses the applicable environment token.
- `FR08-SEC-009` creates distinct U1 and U2 carts and sends the U2 token to test authenticated-subject isolation.
- Invalid-signature and `alg:none` inputs are derived from a valid disposable token. The expired token is generated locally and is never committed.
- Fixture response scripts contain zero `pm.test` calls. They stop only when the precondition cannot be established.
- All 174 transmitted requests were `POST`; there was no GET request or HTTP GET readiness check.

## 3. Artifacts

| Artifact | Purpose |
|---|---|
| `postman/23127379_HW06_EShop.postman_collection.json` | Collection v2.1 containing the fixture folder and the only scored Checkout folder |
| `postman/23127379_HW06_EShop.postman_environment.json` | Tracked environment with `StudentID=23127379`; passwords, user IDs, JWTs, and fixture runtime values are empty |
| `postman/23127379_FR08_data.json` | 42 enabled Checkout rows with fixture recipes and approved oracles |
| `postman/.gitignore` | Excludes local environment/data copies containing ephemeral runtime values |
| `postman/newman/Pool-B_FR08_full_report.json` | Redacted machine-readable full-run report |
| `postman/newman/Pool-B_FR08_full_report.html` | Redacted htmlextra report |
| `evidence/Pool-B_FR08_full_newman-cli.txt` | Redacted Newman CLI transcript |
| `evidence/Pool-B_FR08_full_db-before.json` | Restricted non-GET database baseline |
| `evidence/Pool-B_FR08_full_db-after.json` | Redacted per-case order ownership/total/status/address observations |
| `evidence/Pool-B_FR08_full_db-cleanup.json` | Proof that all 36 disposable users and 28 orders were removed |
| `evidence/Pool-B_FR08_full_diagnostic-cleanup.json` | Cleanup proof for the discarded assertion-runner diagnostic |

The earlier 13-case authentication artifacts remain as historical partial evidence. The `full_*` artifacts supersede that run for current Stage 4 and Stage 5 decisions.

## 4. Mandatory header and runtime safety

The collection-level pre-request script requires the active `StudentID`, restricts `baseUrl` to local port 3000, and upserts `X-Student-Id` on every request. Direct inspection of the final Newman JSON showed:

| Check | Result |
|---|---|
| Requests carrying `X-Student-Id` | **174/174** |
| Header values matching the environment `StudentID` | **174/174** |
| Request methods | **174 POST; 0 GET** |
| Remote URL | **None** |
| Non-empty runtime secrets in tracked environment | **None** |
| JWT literal in tracked collection | **None** |

The ignored local environment was permission-restricted during execution. After reports were redacted and database evidence was captured, its run ID, password, user IDs, and token values were cleared; only the user-supplied `StudentID` remains non-empty.

## 5. Final execution result

| Metric | Result |
|---|---:|
| Execution window | `2026-08-22T10:30:46+07:00`–`2026-08-22T10:30:51+07:00` |
| Data iterations | 42 |
| Scored `POST /api/checkout` requests | **42** |
| Fixture `POST /api/register` requests | 36 |
| Fixture `POST /api/login` requests | 36 |
| Fixture `POST /api/cart` requests | 60 |
| Total transmitted requests | 174 |
| Fixture assertions | **0** |
| Checkout assertions | **210** |
| Checkout assertions passed / failed | **209 / 1** |
| Checkout HTTP outcomes | 28 × `200`; 1 × `400`; 5 × `401`; 8 × `403` |
| Newman process result | Exit `1` because one approved rejection assertion failed |

The one automated failure is `FR08-DOM-007`: the non-object JSON body `[]` was expected to be rejected, but Checkout returned `200` and created an order with null total/address. Other business-integrity cases intentionally used branch-aware HTTP assertions because FR-08 permits rejection or acceptance only when the server total is used. Their state verdict therefore comes from the restricted order snapshot rather than an invented response-field assertion.

## 6. Persistent-state evidence

| Snapshot | Total users | Total orders | Current-run fixture users | Current-run fixture orders |
|---|---:|---:|---:|---:|
| Before | 2 | 0 | 0 | 0 |
| After Checkout run, before cleanup | 38 | 28 | 36 | 28 |
| After cleanup | 2 | 0 | 0 | 0 |

The after-state maps each disposable order to its Checkout `testCaseId` and subject without retaining fixture email, password, JWT, or run ID. It proves order ownership and persisted totals for all 28 accepted Checkouts.

State findings:

- Normal controls `DOM-001/002/003`, `SEC-001`, and `EXT-SEC-005` created correctly owned orders with the expected totals.
- Authentication/parser rejection controls other than `DOM-007` created no order.
- `SEC-010` ignored injected `user_id` and kept the order owned by U1.
- `SEC-012` and `SEC-013` did not apply injected `role` or `status`; the order remained U1-owned and `pending`.
- `SEC-014` stored the apostrophe/SQL probe as literal address data without SQL failure or cross-user mutation.
- Twelve cases persisted the untrusted client total instead of the independently calculated cart total: `DOM-015/016/017/018/020/021`, `DT-002`, `SEC-009`, `SEC-011`, `SCH-006`, `EXT-DOM-001`, and `EXT-DT-001`.
- Cart clearing cannot be proven from SQLite because carts are in memory and the selected contract provides no non-GET cart observation endpoint. It remains explicitly unverified rather than falsely passed.

## 7. Assertion mapping

| Approved oracle | Automated or evidence-backed check |
|---|---|
| Positive Checkout outcome | HTTP `2xx`; exact status is not invented |
| Authentication/parser rejection | HTTP `4xx`; `5xx` cannot pass |
| Accept-or-reject invariant | `2xx` or `4xx`; persisted order must still use the server cart total |
| Method/scope | `POST` and normalized `/api/checkout` path |
| Student traceability | Sent header equals active `StudentID` |
| Non-disclosure | No obvious database/stack detail and no sensitive credential key in Checkout response |
| Server-total integrity | Response total, if present, plus per-case SQLite order total |
| Ownership/order status/address | Per-case redacted SQLite observation |
| Cart clearing | Explicit evidence gap; no false assertion |

## 8. Validation and execution-history corrections

Static validation passed for JSON parsing, Collection v2.1, two ordered folders, 8 setup items, one Checkout target, 42 unique enabled rows, allowed POST-only endpoints, zero setup assertions, exact `StudentID` lookup, fixture mappings, and empty tracked secrets.

Two discarded diagnostics are retained only as runner lessons:

1. The earlier authentication diagnostic exposed `StudentId` versus `StudentID`; the collection was corrected before the clean 13-case run.
2. The first full diagnostic had an escaped regular-expression serialization error in the `noInternal` assertion. All Checkout assertions failed with `ReferenceError: i is not defined`. Its 36 disposable users and 28 orders were deleted, its reports were overwritten, the script was syntax-validated, and a new run ID was used for the final run.

Neither diagnostic is SUT evidence. The final report contains only the corrected collection and the clean full run.

## 9. Version record

| Item | SHA-256 / revision |
|---|---|
| Repository HEAD | `5b0b028790be0e1ee33faf1cfa82ff2a558cddc0` |
| Last `backend/server.js` commit | `2905279438ecc8ec249e43963d14eb607be0f1a9` |
| `backend/server.js` SHA-256 | `a9033d50e90f311b5d3448b277dc828efb5153a14590897633f5289c347bb8c9` |
| Collection | `9d04c466098582d9564fa16da3aabea32dfe5d84c77c4ab23ad31fd7b5dfbcf5` |
| Tracked environment | `074e38fe53474f0130a398727347d2ba82ab4df0f4b42e3b6a5c98931e676399` |
| Runner data | `66798164cb2eaf7337c0f278f78ec09ca14ca61f4aeaf088f3d54ab68e26a9f4` |
| Redacted Newman JSON | `eaaa9c8cdf9bf4409f9e5a63995221b4bc6eb418df98836b639e96cfa50ff407` |
| Redacted Newman HTML | `6d11da1e4b8e83c69911d022852e2811fce0062839d5de7bbe9728487bdb6a03` |

## 10. Gate status

The user had already confirmed Stage 4 before requesting this expanded execution. The Stage 4 checkbox remains checked. The full run is complete, but Stage 5 remains a proposal until the exact confirmation is received.

Status: **STAGE 4 CONFIRMED; FULL 42-CASE CHECKOUT EXECUTION RECORDED.**
