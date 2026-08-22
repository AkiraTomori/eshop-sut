# Pool B / FR-08 — Stage 4 Postman Proposal

> Scope: convert the human-approved Pool B Stage 2 and Stage 3 cases into data-driven Postman artifacts for `POST /api/checkout`. This is a proposal. No API request or Newman run was executed, no Stage 5 classification was made, and `progress.md` remains unchanged pending the exact confirmation `confirm stage 4`.

## 1. Approved input and exclusion gate

| Input | Source rows | Included in data file | Treatment |
|---|---:|---:|---|
| Stage 2 `VALID` | 35 | 35 | Included without changing the approved labels or business/security oracles |
| Stage 3 approved extensions | 7 | 7 | Included with the approved branch-aware or success/rejection oracles |
| Stage 2 `INCOMPLETE` | 27 | 0 | Excluded because their contracts/oracles remain unresolved |
| Total approved collection inputs | **42** | **42** | Meets the Pool B ≥35 reviewed-case gate |

Excluded unresolved IDs: `FR08-DOM-004/005/013/014/019/023/024/025/026/027/028`, `FR08-DT-003/004/005/006/007/008`, `FR08-SEC-015/016/017/018`, and `FR08-SCH-001/002/003/004/005/007`.

No excluded row was relabeled, deleted from its source proposal, or silently assigned an expected status/schema.

## 2. Proposed artifacts

| Artifact | Purpose |
|---|---|
| `postman/StudentID_HW06_EShop.postman_collection.json` | Postman Collection v2.1 with exactly one Pool B folder and one data-driven `POST /api/checkout` request |
| `postman/StudentID_HW06_EShop.postman_environment.json` | Shareable local environment with `baseUrl` and empty placeholders for `StudentID`, test JWTs, and fixture user IDs |
| `postman/StudentID_FR08_data.json` | 42 unique approved iterations with case ID, technique, auth mode, raw body, oracle, requirement trace, fixture profile, and blocker state |
| `postman/.gitignore` | Prevents local environment/data copies containing user-supplied runtime values from being committed |

The collection name remains StudentID-generic. The real student ID, tokens, and user identifiers are not stored in any tracked artifact.

## 3. Folder and request structure

```text
StudentID HW06 EShop API Testing - Pool B
└── Pool B - FR-08 Checkout
    └── {{testCaseId}} - POST /api/checkout
```

- The only test request method is `POST`.
- Every iteration path starts with `/api/checkout`; the parameter-pollution case adds only the approved `?total_amount=1` query string.
- No GET request, GET readiness check, out-of-scope API setup request, or remote base URL exists in the collection.
- `baseUrl` is restricted at runtime to `http://localhost:3000` or `http://127.0.0.1:3000`.

## 4. Mandatory student header and runtime safety

The collection-level pre-request script:

1. reads `StudentID` from the active environment;
2. throws before transmission if it is blank;
3. refuses a non-local/non-port-3000 `baseUrl`; and
4. upserts `X-Student-Id` on every request.

The request-level script selects the authorization partition, preserves raw malformed/duplicate/extreme-number bodies, resolves only required local variables, and skips a disabled row with its explicit blocker reason. It never logs a token or other secret.

## 5. Assertion mapping

| Approved oracle | Automated assertion |
|---|---|
| Positive checkout outcome | HTTP success class (`2xx`); no invented exact status |
| Authentication/parser rejection | Client-error class (`4xx`); a `5xx` does not pass |
| Approved accept-or-reject invariant | Either `2xx` or `4xx`; a `5xx` does not pass |
| Method/scope | Request method is `POST` and normalized path is `/api/checkout` |
| Student traceability | Sent `X-Student-Id` equals the active environment value |
| SEC-01/SEC-05 non-disclosure | No obvious database/stack details and no password/JWT/token/secret response keys |
| Server-total integrity | If a successful response exposes a recognized total field, it must be numeric and equal the fixture's approved server total |
| Order/cart/ownership effects | Clearly logged as `MANUAL_STATE_ORACLE_REQUIRED`; not converted into a false passing Postman assertion |

Exact response statuses, media types, fields, types, and error schemas remain unspecified in the authoritative contract, so this proposal does not invent them.

## 6. Enabled and blocked iteration manifest

| State | Count | Cases | Reason |
|---|---:|---|---|
| Enabled for HTTP-level execution after local `StudentID` is supplied | 8 | `DOM-008/009/010`, `DT-001`, `SEC-002/003/004/005` | Missing, empty, Basic, and malformed authentication representatives need no valid cart or secret token to exercise their HTTP rejection oracle |
| Disabled pending local fixture/token gates | 34 | All remaining approved rows | Need one or more of: valid/test JWT, fresh cart, two-user isolation state, temporal cart mutation, safe recovery after a successful checkout, or non-GET persistent-state evidence |

The eight enabled rows still require separate non-GET evidence to prove the approved “no order/cart mutation” side effect. The collection logs this requirement rather than claiming it is automated.

## 7. Static validation results

| Check | Result |
|---|---|
| Collection/environment/data parse as JSON | PASS |
| Collection schema is v2.1 | PASS |
| Exactly one Pool B folder and one data-driven request | PASS |
| Request methods are POST only | PASS |
| All iteration paths remain under `/api/checkout` | PASS |
| Data rows / unique IDs / exact approved ID set | PASS — `42 / 42 / exact match` |
| Enabled / disabled counts | PASS — `8 / 34` |
| Every disabled row has an explicit reason | PASS |
| Collection pre-request injects `X-Student-Id` and fails on blank value | PASS |
| Environment uses local port 3000 and empty secret placeholders | PASS |
| No hard-coded real student ID in the artifacts | PASS |
| All three Postman JavaScript event scripts parse | PASS |
| Ordinary body templates parse; special raw templates are preserved intentionally | PASS |

The intentional raw-body exceptions are `FR08-DOM-006` (malformed JSON), `FR08-EXT-SEC-004` (duplicate member), `FR08-EXT-DOM-001` (runtime-extreme exponent), and `FR08-SEC-010` (local user-ID substitution).

## 8. Execution gate and observed local prerequisites

| Gate | Observation | Result |
|---|---|---|
| Local SUT readiness | TCP connection to `127.0.0.1:3000` succeeded; no HTTP GET was used | AVAILABLE |
| Newman CLI | `newman` was not found on `PATH` | BLOCKED |
| Student header value | Tracked `StudentID` placeholder is intentionally empty | BLOCKED until supplied locally |
| JWT/user fixtures | All tracked secret and user-ID placeholders are intentionally empty | BLOCKED for dependent rows |
| Fresh-cart setup and recovery | No approved in-scope repeatable method was supplied; the selected Pool endpoint is checkout only | BLOCKED for cart-dependent rows |
| Order/cart/ownership evidence | No approved non-GET observation procedure or real evidence was supplied | BLOCKED |

Because these gates are unresolved, no partial or full Newman execution was attempted. There is no Stage 4 runtime pass/fail total, Newman report, or bug verdict yet.

## 9. Manual local-run procedure after gates are resolved

From `23127379_Homework/HW6/Pool-B_FR08_Checkout`:

```bash
cp postman/StudentID_HW06_EShop.postman_environment.json postman/StudentID_HW06_EShop.local.postman_environment.json
cp postman/StudentID_FR08_data.json postman/StudentID_FR08_data.local.json
```

Populate only the ignored local environment copy with the real `StudentID` and any required test-controlled token/user values. In the ignored local data copy, enable a blocked row only after its exact fixture, safe recovery step, and non-GET evidence method have been approved and prepared. Do not put secrets in either tracked source file.

After Newman is installed locally and the required gates are satisfied:

```bash
mkdir -p postman/newman
newman run postman/StudentID_HW06_EShop.postman_collection.json \
  -e postman/StudentID_HW06_EShop.local.postman_environment.json \
  -d postman/StudentID_FR08_data.local.json \
  --reporters cli,json \
  --reporter-json-export postman/newman/StudentID_FR08_results.json
```

Return the real CLI summary, JSON report, fixture/recovery record, and non-GET state evidence for review. If any request fails, Stage 5 must first distinguish a SUT defect from an oracle, fixture, token, data, or collection error.

## 10. Human confirmation gate

Please review the collection, environment, data manifest, disabled-case blockers, and execution limitations. If accepted, enter exactly:

```text
confirm stage 4
```

That confirmation marks only Pool B Stage 4 complete. It does not execute Newman, start Stage 5, change any audit-row decision, mark Pool B done, commit, or post an issue.

Status: **PENDING HUMAN REVIEW**.
