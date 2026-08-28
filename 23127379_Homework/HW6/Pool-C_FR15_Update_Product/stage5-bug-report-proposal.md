# Pool C / FR-15 — Stage 5 Bug Report Proposal

> Scope: triage of the confirmed Stage 4 evidence for `PUT /api/products/:id`. No API was rerun, no GET request was designed or executed, no issue was posted, and no Stage 5/progress state was changed.

## 1. Evidence and reproduction state

| Item | Observed value |
|---|---|
| Execution window | `2026-08-28T20:40:15+07:00`–`2026-08-28T20:40:16+07:00` |
| Environment | Local Docker `eshop-sut-backend-1`, localhost port 3000; readiness by TCP only |
| Repository HEAD | `93f85686e85d00c2921b7dc38ae7633d8469f3a6` |
| Backend source version | Commit `2905279438ecc8ec249e43963d14eb607be0f1a9`; SHA-256 `a9033d50e90f311b5d3448b277dc828efb5153a14590897633f5289c347bb8c9` |
| Collection version | SHA-256 `b418ce4c09b0b1ebaad986d12d02be1df728ecaf6d9b5bfcaab57b14fe168fa8` |
| Clean main run | 65 PUT requests; 325 assertions; **288 passed and 37 failed** |
| Complete approved suite | **30 passed and 37 failed of 67 cases** after the two external cases passed |
| HTTP outcomes | 63 × `200`, 1 × `400`, 1 × `404` in the clean main run |
| Header/method evidence | Matching `X-Student-Id` on 134/134 retained requests; 134 PUT and 0 GET |
| Primary evidence | `postman/newman/Pool-C_FR15_report.json`, `postman/newman/Pool-C_FR15_report.html` |
| State evidence | `evidence/Pool-C_FR15_per-case-state.json`, `evidence/Pool-C_FR15_external-state.json` |
| Fixture/cleanup evidence | `evidence/Pool-C_FR15_fixture-before.json`, `evidence/Pool-C_FR15_cleanup.json` |
| Secret handling | JWTs were restricted to ignored runtime data; retained reports are redacted; runtime and raw temporary files were deleted |

## 2. False-positive exclusion

| Check | Finding |
|---|---|
| Approved oracle | Every retained failure uses a human-confirmed `4xx` class and no-mutation oracle derived from README FR-12/FR-15/SEC-02/SEC-03 or API §3.3. No exact numeric error code or response schema is asserted. |
| Corrected collection | The first double-slash URL diagnostic was classified as a test artifact, corrected, statically revalidated, and rerun from a byte-identical fixture database. Its responses are not used as SUT findings. |
| Fixture isolation | Every state observation reset only disposable products 101 and 102. Each case was replayed alone before the SQLite snapshot. |
| Environment | TCP readiness succeeded; the clean run had no DNS, connection, pre-request, or test-script failure. All retained calls were local PUTs. |
| Student traceability | All 134 retained requests carried the active environment `StudentID` through the collection-level header script. |
| Persistent state | All 65 isolated rows preserved every non-target product fingerprint and product count. Thirty-four rejection cases nonetheless changed target 101. |
| SQLi triage | SQL-looking values caused no bulk update, table loss, SQL/stack disclosure, or non-target mutation. Parameterization held; these are not reported as SQL-injection execution. Wrong-type body values remain validation evidence. |
| External cases | Concurrent distinct-target updates and identical sequential replay both passed; neither is included in a defect report. |
| Cleanup | Only disposable IDs 101/102 were removed; the database returned to the original five-product count. |
| Local known-issue search | The non-existent update target is already documented as HW2 `BUG-FR15-011` / GitHub Issue 52. It is classified as known rather than drafted again. |

## 3. Failure classification table

| Failure ID | Test Case ID(s) | Proposed classification | Evidence | Requirement source | Reason/missing evidence |
|---|---|---|---|---|---|
| `PC-F-AUTH-001` | `FR15-DOM-008/009/010/011/012/013`; `FR15-SEC-002/003/004/005/006/007/008/009`; `FR15-EXT-SEC-001/002` | **Probable SUT defect** | All 16 returned `200`; isolated snapshots show target 101 changed for every missing, malformed, tampered, expired, unsigned, non-admin, array-role, and duplicate-header variant | README FR-12; SEC-02; SEC-03 | Valid admin JWT and exact admin role are explicit requirements. Token fixture variants were controlled and the positive admin control passed. |
| `PC-F-VALID-001` | `FR15-DOM-002/004/021/022/023/024/026/027/030/031/032/033/045/046/047`; `FR15-SEC-018/023`; `FR15-EXT-SEC-003` | **Probable SUT defect** | All 18 returned `200`; state evidence persisted null/missing/wrong-type/overlength/non-positive/non-existent-category values on target 101 | README FR-15; API §3.3 | These are documented required fields, types, maximum length, positive-price, and existing-category rules—not unspecified behavior. |
| `PC-F-NOTFOUND-001` | `FR15-DOM-005`, `FR15-SEC-016`, `FR15-SCH-009` | **Duplicate/known issue** | All three returned `200 {"message":"Product updated"}` while no product changed | README FR-15; API §3.3; confirmed `4xx` oracle | Same zero-matched-row symptom as HW2 `BUG-FR15-011`, already posted as GitHub Issue 52. The two SQL-looking path cases add representatives but not a new root cause. |
| `PC-F-RUNNER-001` | Discarded first Stage 4 diagnostic | **Test script/data issue** | Generated URL contained `//api/products/...`; fixture database remained byte-identical | Collection implementation | Corrected to `{{baseUrl}}{{targetPath}}`, regenerated, validated, and rerun. Not SUT evidence. |
| `PC-CONFORM-001` | `FR15-SEC-017/019/024/025/026`; `FR15-EXT-SEC-004/005` and other passing controls | **No failure / conforming observed portion** | Literal apostrophe/SQL text caused no cross-target effect; method override did not delete; concurrency/replay passed | README FR-15/SEC-05; API §3.3 | Only documented observable invariants are marked passed. No unproven response schema or SQLi claim is added. |

The 37 retained assertion failures are partitioned exactly once: 16 authentication/authorization, 18 input validation, and three known zero-row success responses. No failure is dropped or counted twice.

---

# BUG-PC-001: Product update permits unauthenticated and non-admin modification

- API/FR: FR-15 — `PUT /api/products/:id`
- Proposed severity: **High**
- Environment/SUT version: Local Docker `eshop-sut-backend-1`; repository HEAD `93f85686e85d00c2921b7dc38ae7633d8469f3a6`; backend commit `2905279438ecc8ec249e43963d14eb607be0f1a9`
- Test Case IDs: 16 cases under `PC-F-AUTH-001`
- Requirement source: README FR-12; SEC-02; SEC-03

## Preconditions

- The authorized local backend is listening on localhost port 3000.
- Disposable target product 101 exists with a recorded SQLite baseline.
- The collection-level script supplies `X-Student-Id`.
- No valid administrator JWT is supplied for the minimal representative.

## Reproduction steps

1. Capture the disposable product-101 baseline through the restricted SQLite fixture snapshot; do not use a GET verification request.
2. Send `PUT /api/products/101` with `Content-Type: application/json`, no `Authorization` header, and body:

   ```json
   {
     "name": "Updated Product",
     "price": 150000,
     "description": "Updated description",
     "imageUrl": "https://example.test/updated.png",
     "category_id": 1
   }
   ```

3. Record the response.
4. Inspect only disposable product 101 through the restricted SQLite snapshot.

## Expected result

Reject with a `4xx` authentication/authorization response and leave every product unchanged. The exact error code and body are unspecified.

## Actual result

`FR15-DOM-008` returned HTTP `200` with `{"message":"Product updated"}`. Product 101 stored every submitted value despite the absent Authorization header.

Fifteen additional isolated variants reproduced the same unauthorized mutation with an empty bearer token, Basic scheme, malformed JWT, altered signature, expired JWT, `alg:none`, valid normal-user role, array-valued role claim, and duplicate non-admin/malformed Authorization headers.

## Impact

An anonymous or non-admin caller can change catalog product names, prices, descriptions, images, and categories. This bypasses the explicit admin-only control and permits unauthorized catalog/data-integrity compromise.

## Evidence

- Clean Newman response/assertions: `postman/newman/Pool-C_FR15_report.json`, cases under `PC-F-AUTH-001`
- Human-readable report: `postman/newman/Pool-C_FR15_report.html`
- Per-case mutation proof: `evidence/Pool-C_FR15_per-case-state.json`
- Fixture and cleanup proof: `evidence/Pool-C_FR15_fixture-before.json`, `evidence/Pool-C_FR15_cleanup.json`
- Screenshot: `[USER MUST ATTACH A REAL SCREENSHOT]`

## GitHub Issue content

- **Title:** `[FR-15][PUT /api/products/:id] Product update accepts missing, invalid, and non-admin credentials`
- **Body:**
  - Preconditions: local backend, disposable existing product, and collection-level student header.
  - Reproduction: send a valid update body to `PUT /api/products/101` without an Authorization header; capture the response and restricted product-101 SQLite snapshot.
  - Expected: `4xx` rejection and no product mutation under README FR-12/SEC-02/SEC-03; exact code/schema unspecified.
  - Actual: HTTP `200`, success message, and all submitted values persisted. Fifteen controlled token/role/header variants independently produced the same unauthorized mutation.
  - Impact: anonymous and non-admin callers can modify catalog data.
  - Evidence: attach the redacted Newman/state evidence and `[USER MUST ATTACH A REAL SCREENSHOT]`.
- **Proposed labels:** `bug`, `security`, `authorization`, `authentication`, `data-integrity`, `FR-15`, `api`

---

# BUG-PC-002: Product update accepts invalid required fields and persists corrupt values

- API/FR: FR-15 — `PUT /api/products/:id`
- Proposed severity: **High**
- Environment/SUT version: Local Docker `eshop-sut-backend-1`; repository HEAD `93f85686e85d00c2921b7dc38ae7633d8469f3a6`; backend commit `2905279438ecc8ec249e43963d14eb607be0f1a9`
- Test Case IDs: 18 cases under `PC-F-VALID-001`
- Requirement source: README FR-15; API specification §3.3
- Related existing reports: GitHub Issues 42/43 cover zero/negative price on **POST create**, and Issue 55 covers UI validation feedback. The current proposal covers the distinct **PUT update** endpoint plus a broader required-field/type/category set.

## Preconditions

- The local backend is listening on localhost port 3000.
- Disposable product 101 and existing category 1 are present.
- A controlled valid administrator JWT and collection-level student header are supplied.
- Product 101's baseline is recorded through SQLite.

## Reproduction steps

1. Send `PUT /api/products/101` with valid admin authorization, `Content-Type: application/json`, and no request body (`FR15-DOM-002`).
2. Record the response.
3. Inspect only disposable product 101 through the restricted SQLite snapshot; do not add a GET request.
4. Optionally repeat from the reset fixture with one isolated invalid representative, such as `price:-1`, a 256-character name, or `category_id:999999`.

## Expected result

Reject the request with a `4xx` validation response and preserve product 101 and every non-target product. Name is required and at most 255 characters, price is required and greater than zero, and category is required and must exist. The exact numeric error code and body are unspecified.

## Actual result

The absent-body request returned HTTP `200` with `{"message":"Product updated"}` and persisted `null` for name, price, description, image URL, and category.

Seventeen additional isolated cases also returned `200` and persisted invalid values, including:

- 256-character, omitted, null, and numeric names;
- negative, zero, omitted, null, numeric-string, Boolean, and SQL-looking string prices;
- non-existent, omitted, null, SQL-looking string, and object-valued categories;
- a non-object JSON array envelope.

Representative state evidence records `price:-1`, `category_id:999999`, and the 256-character name. All non-target product fingerprints remained unchanged.

## Impact

An administrator—or any caller while BUG-PC-001 is present—can corrupt product rows with null, invalid-type, non-positive, oversized, or non-existent-category values. Downstream catalog rendering, pricing, filtering, and order flows may receive invalid persistent data.

## Evidence

- Clean Newman response/assertions: `postman/newman/Pool-C_FR15_report.json`, cases under `PC-F-VALID-001`
- Human-readable report: `postman/newman/Pool-C_FR15_report.html`
- Per-case persisted values/non-target fingerprints: `evidence/Pool-C_FR15_per-case-state.json`
- Fixture and cleanup proof: `evidence/Pool-C_FR15_fixture-before.json`, `evidence/Pool-C_FR15_cleanup.json`
- Screenshot: `[USER MUST ATTACH A REAL SCREENSHOT]`

## GitHub Issue content

- **Title:** `[FR-15][PUT /api/products/:id] Invalid required product fields are accepted and persisted`
- **Body:**
  - Preconditions: local backend, disposable product 101, existing category 1, valid admin token, and collection-level student header.
  - Reproduction: send `PUT /api/products/101` with valid admin authorization and an absent body; inspect only product 101 through the restricted SQLite snapshot.
  - Expected: `4xx` rejection and no mutation under README FR-15; exact code/schema unspecified.
  - Actual: HTTP `200`, success message, and all product fields became null. Seventeen isolated invalid name/price/category/envelope cases also returned `200` and persisted invalid values.
  - Impact: contract-invalid and referentially invalid product state can enter the catalog.
  - Related: Issues 42/43 (POST price validation) and Issue 55 (UI feedback) overlap partially but do not cover this PUT endpoint and full input set.
  - Evidence: attach the redacted Newman/state evidence and `[USER MUST ATTACH A REAL SCREENSHOT]`.
- **Proposed labels:** `bug`, `validation`, `data-integrity`, `FR-15`, `api`

---

## 4. Known issue evidence — no duplicate draft

`FR15-DOM-005`, `FR15-SEC-016`, and `FR15-SCH-009` sent identifiers that matched no product. Each received HTTP `200` and `{"message":"Product updated"}`, while SQLite proved zero mutation and unchanged count/non-target fingerprints.

This behavior matches HW2 `BUG-FR15-011` and existing [GitHub Issue 52](https://github.com/AkiraTomori/eshop-sut/issues/52): Edit Product returns success for a non-existent ID. No new issue is drafted. After human review, the current redacted Newman/SQLite evidence may be added manually to Issue 52 if desired.

The SQL-looking path representatives are not reported as successful SQL injection: parameterization prevented cross-row effects and internal disclosure. Their only failed invariant is the known false-success response when no row matches.

## 5. Human review and posting gate

- Review the two proposed root-cause classifications and High severities.
- Review the known-issue mapping to GitHub Issue 52 and the related-not-duplicate treatment of Issues 42/43/55.
- Attach real screenshots; none was fabricated.
- Manually post only accepted new issues and manually update Issue 52 if desired. The agent posted nothing and applied no labels.
- Enter `confirm stage 5` only if this proposal is accepted. That confirmation marks only Stage 5 complete; Pool C remains `IN_PROGRESS` until the local AI audit is reviewed and `confirm pool audit` is entered.

Status: Approved for Stage 5 bug-report proposal. All 67 Stage 4 IDs are preserved with final `PASS / FAIL` labels and triage reasons.
