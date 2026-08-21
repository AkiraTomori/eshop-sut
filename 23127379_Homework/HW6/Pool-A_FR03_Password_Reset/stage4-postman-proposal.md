# Pool A / FR-03 — Stage 4 Postman Collection Proposal

> This stage built, corrected, statically validated, and executed the Pool A artifacts against the user-authorized Docker backend on `127.0.0.1:3000`. The real Newman evidence contains 36 assertion failures and remains a proposal until the user enters the exact confirmation `confirm stage 4`.

## Approved input disposition

| Source | Rows | Included disposition |
|---|---:|---|
| Confirmed Stage 2 audit | 49 | Every row whose final user-owned label is `VALID` |
| Confirmed Stage 2 audit | 12 | Excluded because final label is `INVALID` |
| Confirmed Stage 2 audit | 18 | Excluded because final label remains `INCOMPLETE` |
| Approved Stage 3 extension | 13 | Included as traceable data rows; 6 executable with local fixtures and 7 disabled until their documented blockers are resolved |

The data file therefore contains exactly 62 unique IDs (`49 + 13`). Exclusion does not delete or relabel any Stage 2 row; the confirmed audit remains the disposition source.

## Proposed artifacts and manifest

| Artifact | Folder/API | Case count | Method/endpoint | Header script present? | User approval source | Status |
|---|---|---:|---|---|---|---|
| `postman/StudentID_HW06_EShop.postman_collection.json` | `Pool A - FR-03 Password Reset` | 62 data-driven records | POST `/api/forgot-password`; POST `/api/reset-password` | Yes, collection-level `pm.request.headers.upsert` with `StudentID`; empty value throws | Confirmed Stages 2–3 | Approved / static validation passed |
| `postman/StudentID_HW06_EShop.postman_environment.json` | Pool A local environment | 16 variables | `baseUrl=http://localhost:3000`; all mutable/secret values local-only | Supplies `StudentID`; value intentionally empty | AGENTS.md §3.6; builder skill | Approved / secrets empty |
| `postman/StudentID_FR03_data.json` | Pool A runner data | 62 total: 55 enabled, 7 disabled | 18 forgot targets; 44 reset targets | Every sent collection item inherits the collection script | Confirmed Stage 2 table + approved Stage 3 artifact | Approved / JSON valid |
| `postman/.gitignore` | Local secret protection | 1 rule | Excludes `*.local.postman_environment.json` | N/A | Builder secret-handling rule | Approved |
| `evidence/Pool-A_FR03_newman-cli.txt` | Real CLI transcript | 62 iterations | 79 POST requests | Logs runtime injection for student `23127379` | User-authorized local execution | Generated / 36 failures |
| `postman/newman/Pool-A_FR03_report.json` | Machine-readable Newman evidence | 266 assertions | 230 passed; 36 failed | Request assertions verify the injected header | User-authorized local execution | Generated |
| `postman/newman/Pool-A_FR03_report.html` | Human-readable Newman evidence | Full run | POST-only execution | Includes console/test details | User-authorized local execution | Generated |

The collection has exactly one top-level Pool A folder and three cooperating POST-only items per iteration:

1. Optional forgot-password setup captures a fresh token without logging it.
2. The target item sends the case selected by the data row.
3. An optional follow-up item covers approved sequential reissue/replay cases.

Dynamic test names preserve `testCaseId`. Exact `200`/schema assertions are used only for the specified forgot-password success contract. User-approved success/rejection cases assert only the HTTP class; unspecified exact statuses/schemas are logged rather than invented. Side effects that lack an in-scope observable API are retained in `expectedSideEffect` for human/database evidence and are not falsely reported as automated assertions.

## Disabled extension records

| Test Case ID | Reason disabled in Collection Runner | Required resolution |
|---|---|---|
| FR03-EXT-DOM-007 | A genuine live leading-zero OTP cannot be fabricated | Confirm issuance domain and supply a genuinely issued token |
| FR03-EXT-ST-001 | Collection Runner is sequential | Use an approved concurrent POST harness |
| FR03-EXT-ST-002 | Requires four steps and two isolated mutable accounts | Supply two disposable fixtures and an approved sequence/harness |
| FR03-EXT-ST-003 | Requires a four-POST, two-lifecycle path | Extend the runner only after reviewing fixture recovery |
| FR03-EXT-SEC-001 | SEC-01 persistence proof is white-box | Approve a database/code inspection and restore method |
| FR03-EXT-SEC-002 | Enumeration parity/timing oracle is unspecified | Confirm response parity and timing tolerance |
| FR03-EXT-SEC-003 | Attempt count, throttling, and retention are unspecified | Confirm `N`, rate-limit oracle, and token post-state |

## Static validation results

| Check | Result |
|---|---|
| Collection/environment/data parse as JSON | PASS (`jq empty`) |
| Data IDs unique | PASS: 62/62 |
| Data ID set equals 49 confirmed `VALID` IDs + 13 approved extension IDs | PASS: no missing or extra IDs |
| Top-level API folders | PASS: exactly one Pool A folder |
| Request methods | PASS: POST only |
| Scoped endpoint paths | PASS: forgot-password/reset-password only through fixed or data-controlled paths |
| Collection-level student header | PASS: upsert script present; empty `StudentID` throws before send |
| Real student ID, OTP, or mutable password committed | PASS: none; local variables remain empty |
| Exact assertions limited to approved oracles | PASS; unknown exact contracts are not asserted |

## Local Docker execution gate and result — 2026-08-21

| Check | Real evidence | Result |
|---|---|---|
| Target is local | Docker container `eshop-sut-backend-1` publishes `127.0.0.1:3000`; local environment uses that base URL | PASS |
| SUT readiness | `nc -z 127.0.0.1 3000`; no HTTP GET health check | PASS |
| Newman CLI | Newman `6.2.2` and `newman-reporter-htmlextra` installed under a temporary directory | PASS |
| Student header value | Ignored local environment contains user-supplied `StudentID=23127379`; transcript logs injection | PASS |
| Mutable fixtures | Two exact disposable emails were absent before insertion, used for the run, then deleted (`remaining=0`) | PASS |
| URL construction | Initial diagnostic exposed `//api/...`; collection URL representation corrected and final transcript contains only `/api/...` | PASS after correction |
| Executed iterations | Newman JSON `run.stats.iterations.total` | 62 |
| Sent requests | Newman JSON `run.stats.requests.total`; collection validation reports POST only | 79 |
| Assertions | Newman JSON `run.stats.assertions` | 266 total; 230 passed; 36 failed |
| Failure classification pending Stage 5 | 27 failures: four-digit OTP violates required six-digit schema; 9 failures: invalid passwords returned HTTP 200 instead of rejection | Real observations; defect/false-positive triage not yet performed |

No other failure signature appears in the final JSON report. The first double-slash diagnostic run is not accepted as SUT evidence and was overwritten by the corrected final run. The redacted before/after fixture snapshots preserve mutation evidence without storing credential or token values.

## Exact manual preparation and execution

For this execution, the backend was already running in Docker as `eshop-sut-backend-1`. For a later rerun, first verify the authorized container rather than starting a second Node process:

```bash
docker ps --filter name=eshop-sut-backend-1
```

In a second terminal, verify readiness without GET:

```bash
nc -z 127.0.0.1 3000
```

Install the runner/reporting prerequisites if needed:

```bash
npm install --global newman newman-reporter-htmlextra
```

From `23127379_Homework/HW6/Pool-A_FR03_Password_Reset/postman`, copy the environment to the ignored local filename:

```bash
cp StudentID_HW06_EShop.postman_environment.json StudentID_HW06_EShop.local.postman_environment.json
```

Populate only the local copy with:

- the real `StudentID`;
- two disposable registered emails;
- one known-wrong six-digit `invalidOtp`;
- two valid, distinct strong passwords;
- six valid local test passwords whose required special character is respectively `@`, `$`, `%`, `*`, `?`, and `&`.

Do not commit the local environment. Snapshot the disposable database rows before running because successful and defective reset behavior can mutate credentials.

Then execute from the same `postman` directory:

```bash
mkdir -p newman
newman run StudentID_HW06_EShop.postman_collection.json \
  --environment StudentID_HW06_EShop.local.postman_environment.json \
  --iteration-data StudentID_FR03_data.json \
  --folder "Pool A - FR-03 Password Reset" \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export newman/Pool-A_FR03_report.html
```

The real CLI/JSON/HTML outputs are now preserved. A human screenshot is still human-owned evidence. The disposable fixture rows were restored by deletion after their redacted post-run state was captured.

Status: Execution complete — awaiting `confirm stage 4`
