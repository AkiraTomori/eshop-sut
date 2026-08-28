# Pool C / FR-15 — Stage 4 Postman Proposal and Execution Evidence

> Scope: the only scored endpoint is `PUT /api/products/:id`. The retained execution used localhost port 3000, sent no GET request, contacted no remote API, and used disposable products observed through SQLite rather than a GET state oracle.

## 1. Approved case input

| Input | Approved rows | Execution treatment |
|---|---:|---|
| Human-confirmed Stage 2 `VALID` cases | 60 | Executed without relabeling or changing approved oracles |
| Human-confirmed Stage 3 extensions | 7 | Executed with their approved deterministic or conditional oracles |
| Stage 2 `INCOMPLETE` cases | 0 of 26 | Excluded because their contracts remain unresolved |
| Total approved Stage 4 cases | **67** | 65 in the clean data-driven Newman run; 2 through the required external concurrency/replay harness |

The tracked runner data intentionally remains conservative: 62 rows are enabled and five external-fixture rows are disabled. The ignored local copy enabled the three controlled JWT rows (`FR15-DOM-012`, `FR15-SEC-007`, and `FR15-EXT-SEC-001`). `FR15-SEC-025` and `FR15-SEC-026` remained disabled in the ordinary run and were executed separately with their approved concurrency/replay procedures.

## 2. Final collection structure

```text
23127379 HW06 EShop API Testing - Pool C
└── Pool C - FR-15 Update Product
    └── {{testCaseId}} - PUT /api/products/:id
```

The collection has one data-driven request. Each iteration supplies its case ID, target path, authorization mode, body mode/body, optional header differential, HTTP-class oracle, persistent-state oracle, evidence requirement, and source.

The first diagnostic exposed a generator defect: a Postman URL object produced `//api/products/...`. That run reached only route-level 404/400 responses, left the fixture database byte-for-byte unchanged, and is not SUT evidence. The generator was corrected to emit the raw string `{{baseUrl}}{{targetPath}}`, statically revalidated, and rerun from unchanged fixtures. Only the corrected run is retained in the reports below.

## 3. Mandatory header and runtime safety

The collection-level pre-request script:

1. Requires non-empty `StudentID` from the active environment.
2. Restricts `baseUrl` to exactly `http://localhost:3000` or `http://127.0.0.1:3000`.
3. Uses `pm.request.headers.upsert` to attach `X-Student-Id` to every transmitted request.

The tracked environment contains `StudentID=23127379` but no JWT, password, or mutable fixture ID. JWTs and fixture IDs existed only in the ignored, permission-restricted local environment. All retained Newman report copies were redacted and scanned for JWT-shaped values.

| Header/method check | Result |
|---|---:|
| Clean main-run requests with matching `X-Student-Id` | **65 / 65** |
| Isolated state-replay requests with matching `X-Student-Id` | **65 / 65** |
| Concurrency/replay-harness requests with matching `X-Student-Id` | **4 / 4** |
| Retained-evidence request methods | **134 PUT; 0 GET** |
| Remote requests | **0** |

## 4. Retained artifacts

| Artifact | Purpose |
|---|---|
| `postman/23127379_HW06_EShop.postman_collection.json` | Corrected Collection v2.1 |
| `postman/23127379_HW06_EShop.postman_environment.json` | Localhost environment with `StudentID=23127379` and empty secrets |
| `postman/23127379_FR15_data.json` | 67 approved rows; tracked default has 62 enabled and five fixture-gated |
| `postman/newman/Pool-C_FR15_report.json` | Redacted machine-readable clean main run |
| `postman/newman/Pool-C_FR15_report.html` | Redacted htmlextra clean main run |
| `evidence/Pool-C_FR15_fixture-before.json` | Disposable fixture baseline |
| `evidence/Pool-C_FR15_per-case-state.json` | 65 isolated PUT replays with direct SQLite state and non-target fingerprints |
| `evidence/Pool-C_FR15_external-state.json` | Concurrency and sequential replay evidence for the two externally executed rows |
| `evidence/Pool-C_FR15_cleanup.json` | Proof that disposable products 101/102 were removed |
| `postman/generate_pool_c_collection.js` | Deterministic collection/data generator |
| `postman/validate_pool_c_collection.js` | Static validator; sends no request |
| `postman/run_pool_c_state_evidence.js` | Local-only isolated state-evidence harness |
| `postman/run_pool_c_external_evidence.js` | Local-only concurrency/replay harness |
| `postman/redact_pool_c_reports.js` | JWT redaction and validation before report retention |

## 5. Static validation

Static validation passed after the URL correction:

- exact match to 60 Stage 2 `VALID` IDs plus 7 Stage 3 IDs;
- 67 unique rows in the tracked data: 62 enabled and five explicitly fixture-gated;
- Collection v2.1, one Pool C folder, and one target definition;
- method inventory contains exactly one PUT definition and no GET definition;
- exact `StudentID` lookup and collection-level header upsert;
- localhost-only base URL, `StudentID=23127379`, and empty tracked secret/runtime fixture values;
- all Postman scripts compile;
- every row has an approved HTTP-class oracle, state oracle, and evidence requirement.

## 6. Clean main Newman result

| Metric | Result |
|---|---:|
| Execution window | `2026-08-28T20:40:15+07:00`–`2026-08-28T20:40:16+07:00` |
| Iterations | 67 |
| PUT requests executed | **65** |
| Rows skipped for external harness | 2 |
| Assertions | **325** |
| Assertions passed / failed | **288 / 37** |
| Case rows passed / failed | **28 / 37** |
| HTTP outcomes | 63 × `200`; 1 × `400`; 1 × `404` |
| Response time | average 6.25 ms; min 2 ms; max 36 ms |
| Newman process result | Exit `1` because 37 approved HTTP-class assertions failed |

The two external cases both passed, so the complete approved-suite result is **30 passed and 37 failed out of 67 cases**.

## 7. Failed approved oracles

Every retained failure expected a `4xx` rejection but received `200`:

- Domain (22): `FR15-DOM-002`, `004`, `005`, `008`, `009`, `010`, `011`, `012`, `013`, `021`, `022`, `023`, `024`, `026`, `027`, `030`, `031`, `032`, `033`, `045`, `046`, `047`.
- Security (11): `FR15-SEC-002`, `003`, `004`, `005`, `006`, `007`, `008`, `009`, `016`, `018`, `023`.
- Schema/non-disclosure (1): `FR15-SCH-009`.
- Stage 3 security extensions (3): `FR15-EXT-SEC-001`, `002`, `003`.

These are execution observations, not yet consolidated defect claims. Stage 5 must distinguish root causes, duplicates, and reportable SUT defects.

## 8. Persistent-state evidence

Each of the 65 main-run rows was replayed once from a reset product-101/product-102 baseline. After every PUT, the harness read SQLite directly and compared the target, all non-target rows, and product count.

| State check | Result |
|---|---:|
| Isolated rows observed | 65 / 65 |
| Non-target product fingerprints unchanged | **65 / 65** |
| Product count unchanged | **65 / 65** |
| Rejection-oracle cases that changed target 101 | **34** |
| Failed rejection cases with no target mutation | 3 |

The three status failures without target mutation were the non-existent target (`FR15-DOM-005`) and two SQL-looking path cases (`FR15-SEC-016`, `FR15-SCH-009`). They still failed because the endpoint returned `200` instead of the approved `4xx` class.

The other 34 rejection-oracle cases changed target 101 despite requiring no mutation. This includes missing/invalid/expired/non-admin credentials, invalid required fields, invalid category values, and three Stage 3 security payloads. All seeded/non-target products remained unchanged.

## 9. External concurrency and replay cases

`FR15-SEC-025` used two synchronized collection executions against disposable products 101 and 102. Both returned `2xx`, retained distinct sentinel values on the correct target, preserved the five seeded products, and kept product count constant.

`FR15-SEC-026` sent an identical approved PUT twice. Both returned `2xx`; target state after the second request exactly matched state after the first, product count remained constant, and all non-target products remained unchanged.

Both cases passed all request, header, HTTP-class, and state checks.

## 10. Fixture cleanup

Only disposable products 101 and 102 were deleted after evidence capture. Cleanup reported two removed rows, zero remaining disposable rows, and five total products—the original seeded count. After redacted reports passed validation, the ignored local environment/data copies and temporary Newman/raw-report directory were deleted; the tracked environment template remains empty of runtime values.

## 11. Artifact hashes

| Artifact | SHA-256 |
|---|---|
| Collection | `b418ce4c09b0b1ebaad986d12d02be1df728ecaf6d9b5bfcaab57b14fe168fa8` |
| Environment template | `565938ee4b3f4693f5f2275c1420859f2717e63c493c55b9002d7e131b6d5908` |
| Runner data | `b82447b426bdc16af7737b22ae1a78fdcdb236d53da4b96d9179ef36f9ffea6a` |
| Redacted Newman JSON | `678e0a86f8031fdd8b0802bd829b2fd471f62bd7a6a3facd803735fbf96797a5` |
| Redacted Newman HTML | `6971d05a40c70208f1da0c91493b188be1181fb55341a03db2a78b04ef0ea278` |
| Per-case state evidence | `e344ec11719508c74fae70634d36147369e383632925f4c6930973f73aa992e1` |
| External-case state evidence | `446361ce88848e8c71fc59e456e0e006e965fe6587370d48908ec81755ed9425` |
| Fixture baseline | `b60a4dbe7aa32a932762f4505784b50f00deb272e5cdd30567d9d52881337c20` |
| Cleanup evidence | `9ed957317f070bdd0b0b11490b2516ae19065a6c16f22fe8fcdd66ed33223b35` |

## 12. Execution history and gate status

Actual transmitted requests during this invocation:

- 65 PUT requests in the discarded double-slash diagnostic; the database remained byte-identical.
- 65 PUT requests in the retained clean main run.
- 65 PUT requests in the retained isolated state-evidence replay.
- 4 PUT requests for retained concurrency/replay evidence.

Total: 199 PUT requests, zero GET requests, all against localhost port 3000. Only the corrected clean run and its state evidence are submission evidence.

Stage 4 remains **IN PROGRESS** until the human reviews this proposal and enters the exact confirmation `confirm stage 4`. Confirmation must update only Stage 4 and must not start Stage 5 automatically.

Status: **PROPOSED STAGE 4 EVIDENCE — executed locally; pending human review.**
