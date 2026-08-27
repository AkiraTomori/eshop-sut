# Pool C / FR-15 — Domain Testing Proposal

> Scope: `PUT /api/products/:id` only. This is a Stage 1 proposal. No API request, GET request, Postman/Newman run, or product mutation has occurred.

## Specification basis and interpretation rules

- Assignment obligation: `2026.HW06.API Testing_En.md` §§5–6 selects one Pool C API and requires domain partitions on every parameter; the final reviewed API suite targets at least 35 cases.
- Business rules: root `README.md` §FR-12 requires a valid JWT whose role is `admin` for every data-changing Product API. Root `README.md` §FR-15 allows an admin to edit a product; requires `name` with at most 255 characters, a numeric `price > 0`, and an existing category; and requires all non-target products to remain unchanged.
- Endpoint contract: root `api_specification.md` §3.3 defines `PUT /api/products/:id` and shows a JSON body containing `name`, `price`, `description`, `imageUrl`, and `category_id`.
- The documents do not define the path `id` syntax/range, partial-versus-full update semantics, `description` or `imageUrl` requiredness/length/content rules, URL validation, unknown-property handling, numeric precision/maximum price, category-ID numeric range, concurrency semantics, or any success/error status and response schema. These remain `Not specified`.
- A JSON example establishes the documented representation of a field, but it does not silently create an undocumented coercion rule. Where rejection behavior is not explicit, the case is a characterization proposal and cannot become a final defect oracle without human confirmation.
- Every case isolates one changed partition from a valid baseline. Envelope cases necessarily make individual fields unavailable but do not count as combined field-invalid tests.
- Every future successful update must change only target `P1`; every rejected or unresolved invalid-input request must leave both `P1` and all non-target products unchanged. Later state observation must use an approved non-GET oracle, such as restricted test-datastore snapshots.
- Exact HTTP status codes are absent from the contract, so every `Expected status` cell says `Not specified`; the enforceable business outcome is recorded separately.

## Baseline fixtures and notation

| Fixture | Definition |
|---|---|
| `A1` | Valid, current JWT for an account whose token has `role = 'admin'`. |
| `U1` | Valid, current JWT for a normal account whose token does not have the admin role. |
| `P1` | Existing target product controlled by the test: `{id:101,name:"Baseline Product",price:100000,description:"Baseline description",imageUrl:"https://example.test/p1.png",category_id:1}`. |
| `P2+` | Snapshot of every product other than `P1`; these records form the FR-15 non-target invariance oracle. |
| `C1` | Existing category with `id = 1`. |
| `C2` | A second existing category with `id = 2`. |
| `C404` | A well-formed integer category ID known not to exist, represented by `999999`. |
| `H0` | `Authorization: Bearer <A1>` and `Content-Type: application/json`. |
| `B0` | `{"name":"Updated Product","price":150000,"description":"Updated description","imageUrl":"https://example.test/updated.png","category_id":1}`. |
| `N(n)` | A JSON string containing exactly `n` Unicode code points, using repeated `A` characters unless stated otherwise. This makes name-length BVA reproducible without embedding 255-character cells. |

`P1`, `P2+`, `C1`, `C2`, and `C404` are symbolic test-controlled fixtures, not claims about current database IDs. Future execution must create or resolve them without adding any GET test.

## Parameter inventory

| Parameter ID | Endpoint | Location | Parameter | Type | Required? | Constraint/dependency | Valid baseline | Specification source | Coverage status |
|---|---|---|---|---|---|---|---|---|---|
| PC-ENV | `/api/products/:id` | request envelope | JSON body | JSON object implied | Yes indirectly: three required fields are carried in it | Body shown as a JSON object; malformed/non-object content cannot supply the documented fields | `B0` | README §FR-15; API spec §3.3 | EC covered; body-size/duplicate-key policy unspecified |
| PC-ID | `/api/products/:id` | path | `id` | Product identifier; syntax/type not specified | Yes | Identifies the sole target; valid edit needs an existing product; no numeric range/format/not-found response documented | `101` resolving to `P1` | README §FR-15; API spec §3.3 | Existing/non-existing/opaque/missing partitions covered; no BVA supported |
| PC-AUTH | `/api/products/:id` | header | `Authorization` | `Bearer <JWT>` | Yes | JWT must be present and valid for a data-changing Product API | `Bearer <A1>` | README §FR-02/FR-12 | Token ECs covered; error taxonomy/status unspecified |
| PC-ROLE | `/api/products/:id` | authentication context | token role | Role claim/value | Yes: must be `admin` | Token existence alone is insufficient; non-admin callers must not mutate products | `admin` in `A1` | README §FR-12; §SEC-03 | Admin/non-admin partitions covered |
| PC-CTYPE | `/api/products/:id` | header | `Content-Type` | Media type string | JSON implied; missing-header behavior not specified | Body contract is JSON | `application/json` | API spec §3.3 | JSON/missing/non-JSON partitions covered; exact parser behavior unspecified |
| PC-NAME | `/api/products/:id` | body | `name` | JSON string, measured in characters | Yes | Required; maximum 255 characters. Required/non-empty interpretation gives supported length range 1–255; whitespace trimming is not specified | `Updated Product` | README §FR-15; API spec §3.3 | EC + full two-sided BVA covered |
| PC-PRICE | `/api/products/:id` | body | `price` | JSON number | Yes | Must be numeric and strictly positive (`> 0`); integer-only/currency scale/upper bound not specified | `150000` | README §FR-15; API spec §3.3 | EC + lower-bound probes covered; upper BVA unsupported |
| PC-DESC | `/api/products/:id` | body | `description` | JSON string in example | Not specified | No requiredness, minimum/maximum length, normalization, or content rule | `Updated description` | API spec §3.3 | String/omitted/null/wrong-type representatives covered; no BVA supported |
| PC-IMAGE | `/api/products/:id` | body | `imageUrl` | JSON string in example | Not specified | Name/example suggest a URL, but no URL-format, scheme, requiredness, empty, or length rule is stated | `https://example.test/updated.png` | API spec §3.3 | URL-shaped/non-URL/empty/omitted/null/wrong-type representatives covered; no BVA supported |
| PC-CAT | `/api/products/:id` | body | `category_id` | JSON integer in example | Yes | Must identify a category from the existing list; numeric range and not-found response are unspecified | `1` resolving to `C1` | README §FR-15; API spec §3.3 | Existing/non-existing/missing/null/wrong-type/non-integer partitions covered; no BVA supported |
| PC-EXTRA | `/api/products/:id` | body | additional properties | JSON members | Not specified | Contract shows five fields but does not define strict versus lenient handling | none | API spec §3.3 | Documented-only and unknown-field partitions covered |
| PC-TARGET | `/api/products/:id` | persistent side effect | target product `P1` | Product record | Yes for successful edit | On success, accepted new values apply to the identified target only | pre-state of `P1` | README §FR-15 | Asserted across successful cases; atomicity/concurrency unspecified |
| PC-OTHERS | `/api/products/:id` | persistent side effect | every product except `P1` | Product-record set | Always invariant | All non-target products must remain unchanged | `P2+` snapshot | README §FR-15 | Asserted in every case; non-GET observation required later |
| PC-RESP | `/api/products/:id` | response | status/body/schema | Not specified | Not specified | No successful-update status/body or failure status/error schema is documented | `Not specified` | API spec §3.3 | Contract gap; response schema deferred to Security/Schema Checklist |
| PC-STUDENT | `/api/products/:id` | harness header | `X-Student-Id` | Environment string | Required for future HW06 execution, not an SUT domain | Must later be injected as `{{StudentID}}` by a collection-level pre-request script | `{{StudentID}}` | Assignment §6; `AGENTS.md` §3.6 | Deferred to Stage 4; no domain EC |

## Equivalence Class table

`Valid? = Unspecified` means the documents do not define acceptance or rejection. Such a representative records behavior but cannot receive a final pass/fail oracle until the human supplies or approves a contract.

| EC ID | Parameter ID | Field | Partition type | Condition/domain | Valid? | Representative | Specification source |
|---|---|---|---|---|---|---|---|
| ENV-V1 | PC-ENV | JSON body | structure | Valid JSON object containing the baseline fields | Yes | `B0` | API spec §3.3 |
| ENV-I1 | PC-ENV | JSON body | missing | Entire body absent, so required fields cannot be supplied | No | `<absent>` | README §FR-15; API spec §3.3 |
| ENV-I2 | PC-ENV | JSON body | syntax | Malformed JSON | No | raw `{"name":` | API spec §3.3 |
| ENV-I3 | PC-ENV | JSON body | structure | Valid JSON but not an object | No | `[]` | API spec §3.3 |
| ID-V1 | PC-ID | `id` | existence | Identifier resolves to existing target `P1` | Yes | `101` | README §FR-15; API spec §3.3 |
| ID-U1 | PC-ID | `id` | existence | Well-formed-looking identifier resolves to no product | Unspecified response; no mutation allowed | `999999` | API spec §3.3 |
| ID-U2 | PC-ID | `id` | format | Opaque/non-numeric path token; identifier syntax is undocumented | Unspecified | `abc` | API spec §3.3 |
| ID-I1 | PC-ID | `id` | missing | Path segment omitted from the route template | No route target | `<absent segment>` | API spec §3.3 |
| AUTH-V1 | PC-AUTH | `Authorization` | membership | Current valid bearer JWT | Yes with admin role | `Bearer <A1>` | README §FR-02/FR-12 |
| AUTH-I1 | PC-AUTH | `Authorization` | missing | Header absent | No | `<absent>` | README §FR-12; §SEC-02 |
| AUTH-I2 | PC-AUTH | `Authorization` | value | Bearer scheme with empty token | No | `Bearer ` | README §FR-12; §SEC-02 |
| AUTH-I3 | PC-AUTH | `Authorization` | format | Token sent under non-Bearer scheme | No | `Basic abc` | README §FR-02/FR-12 |
| AUTH-I4 | PC-AUTH | `Authorization` | integrity | JWT-like token with invalid signature | No | `<tampered-JWT>` | README §FR-12; §SEC-02 |
| AUTH-I5 | PC-AUTH | `Authorization` | time state | Expired JWT | No | `<expired-JWT>` | Valid-token rule in README §FR-12; §SEC-02 |
| ROLE-V1 | PC-ROLE | role | membership | Valid JWT with `role = 'admin'` | Yes | `A1` | README §FR-12; §SEC-03 |
| ROLE-I1 | PC-ROLE | role | membership | Valid JWT for a non-admin account | No | `U1` | README §FR-12; §SEC-03 |
| CTYPE-V1 | PC-CTYPE | `Content-Type` | discrete value | JSON media type | Yes | `application/json` | API spec §3.3 |
| CTYPE-U1 | PC-CTYPE | `Content-Type` | missing | Header omitted while JSON bytes are sent | Unspecified | `<absent>` | API spec §3.3 |
| CTYPE-U2 | PC-CTYPE | `Content-Type` | discrete value | Non-JSON media type for JSON-looking bytes | Unspecified parser behavior; outside shown media contract | `text/plain` | API spec §3.3 |
| NAME-V1 | PC-NAME | `name` | range | String length 1–255 characters | Yes | `N(1)`, `N(2)`, `N(254)`, `N(255)` | README §FR-15 |
| NAME-I1 | PC-NAME | `name` | range | Length below minimum required/non-empty interpretation: 0 | No | `""` | README §FR-15 |
| NAME-I2 | PC-NAME | `name` | range | Length above maximum: >255 | No | `N(256)` | README §FR-15 |
| NAME-I3 | PC-NAME | `name` | missing | Required member omitted | No | body without `name` | README §FR-15 |
| NAME-I4 | PC-NAME | `name` | nullability | Explicit `null` instead of required string | No | `null` | README §FR-15; API spec §3.3 |
| NAME-I5 | PC-NAME | `name` | type | Non-string JSON value | No | `123` | README §FR-15; API spec §3.3 |
| NAME-U1 | PC-NAME | `name` | content | Whitespace-only string within the length limit; trim/nonblank rule absent | Unspecified | `"   "` | README §FR-15 |
| PRICE-V1 | PC-PRICE | `price` | range/type | Finite JSON number strictly greater than 0 | Yes | `1`, `150000` | README §FR-15 |
| PRICE-V2 | PC-PRICE | `price` | precision | Positive fractional JSON number; integer/scale rule absent | Yes by written `number > 0` rule; persistence/rounding unspecified | `0.01` | README §FR-15; API spec §3.3 |
| PRICE-I1 | PC-PRICE | `price` | range | Number less than or equal to 0 | No | `-1`, `0` | README §FR-15 |
| PRICE-I2 | PC-PRICE | `price` | missing | Required member omitted | No | body without `price` | README §FR-15 |
| PRICE-I3 | PC-PRICE | `price` | nullability | Explicit `null` instead of number | No | `null` | README §FR-15; API spec §3.3 |
| PRICE-I4 | PC-PRICE | `price` | type | Numeric-looking string instead of number | No | `"150000"` | README §FR-15; API spec §3.3 |
| PRICE-I5 | PC-PRICE | `price` | type | Boolean instead of number | No | `true` | README §FR-15; API spec §3.3 |
| DESC-V1 | PC-DESC | `description` | type/content | Any documented string representation; no content/length restriction | Yes by shown type | ordinary, Vietnamese Unicode, and empty strings | API spec §3.3 |
| DESC-U1 | PC-DESC | `description` | missing | Member omitted; requiredness/partial-update semantics absent | Unspecified | body without `description` | API spec §3.3 |
| DESC-U2 | PC-DESC | `description` | nullability | Explicit `null`; null policy absent | Unspecified; outside shown string representation | `null` | API spec §3.3 |
| DESC-U3 | PC-DESC | `description` | type | Non-string JSON value; coercion/rejection policy absent | Unspecified; outside shown string representation | `{}` | API spec §3.3 |
| IMAGE-V1 | PC-IMAGE | `imageUrl` | type/format | URL-shaped JSON string matching the example's apparent intent | Yes by shown representation | `https://example.test/updated.png` | API spec §3.3 |
| IMAGE-U1 | PC-IMAGE | `imageUrl` | format | Non-URL string; no URL-format rule is documented | Unspecified | `not-a-url` | API spec §3.3 |
| IMAGE-U2 | PC-IMAGE | `imageUrl` | content | Empty string; empty policy absent | Unspecified | `""` | API spec §3.3 |
| IMAGE-U3 | PC-IMAGE | `imageUrl` | missing | Member omitted; requiredness/partial-update semantics absent | Unspecified | body without `imageUrl` | API spec §3.3 |
| IMAGE-U4 | PC-IMAGE | `imageUrl` | nullability | Explicit `null`; null policy absent | Unspecified; outside shown string representation | `null` | API spec §3.3 |
| IMAGE-U5 | PC-IMAGE | `imageUrl` | type | Non-string JSON value; coercion/rejection policy absent | Unspecified; outside shown string representation | `123` | API spec §3.3 |
| CAT-V1 | PC-CAT | `category_id` | membership | Integer identifies an existing category | Yes | `1` (`C1`), `2` (`C2`) | README §FR-15; API spec §3.3 |
| CAT-I1 | PC-CAT | `category_id` | membership | Integer identifies no existing category | No | `999999` (`C404`) | README §FR-15 |
| CAT-I2 | PC-CAT | `category_id` | missing | Required member omitted | No | body without `category_id` | README §FR-15 |
| CAT-I3 | PC-CAT | `category_id` | nullability | Explicit `null` cannot select an existing category | No | `null` | README §FR-15; API spec §3.3 |
| CAT-I4 | PC-CAT | `category_id` | type | Numeric-looking string rather than shown integer | No by documented representation | `"1"` | README §FR-15; API spec §3.3 |
| CAT-I5 | PC-CAT | `category_id` | type | Fractional number cannot identify the shown integer category ID | No by documented representation | `1.5` | README §FR-15; API spec §3.3 |
| EXTRA-V1 | PC-EXTRA | additional properties | structure | Only the five documented fields are present | Yes | `B0` | API spec §3.3 |
| EXTRA-U1 | PC-EXTRA | additional properties | structure | One unknown member is added | Unspecified | `"unexpected_field":"sentinel"` | API spec §3.3 |
| TARGET-V1 | PC-TARGET | target side effect | identity/isolation | Only the product resolved by `id` receives accepted changes | Yes; required invariant | compare `P1` before/after | README §FR-15 |
| OTHERS-V1 | PC-OTHERS | non-target side effect | identity/isolation | Every product other than target remains byte-for-byte/logically unchanged | Yes; required invariant | compare `P2+` before/after | README §FR-15 |
| RESP-U1 | PC-RESP | response | contract | Status, success body, error body, and schema are absent | Unspecified | record actual redacted response | API spec §3.3 |

## Boundary Value Analysis

| Boundary ID | Parameter | Documented range/boundary | Required representatives | Proposed cases | Notes |
|---|---|---|---|---|---|
| BVA-NAME | `name` character length | Inclusive 1–255 | `0`, `1`, `2`, `254`, `255`, `256` | FR15-DOM-016–021 | Complete `LB-1`, `LB`, `LB+1`, `UB-1`, `UB`, `UB+1` coverage. Length is measured as Unicode code points for this proposal because the documents only say characters; byte/UTF-16 semantics remain unspecified. |
| BVA-PRICE-LB | `price` | Strictly greater than 0; no upper bound | `-1`, `0`, `1`, plus `0.01` precision probe | FR15-DOM-026–029 | `-1/0/1` are conventional below/at/above probes around the documented threshold. Because JSON number is not documented as integer-only, `0.01` covers the positive fractional valid class. There is no smallest positive real number and no supported upper BVA. |
| BVA-NONE-ID | path `id` | No numeric/length range | None | FR15-DOM-005–007 are existence/format/route probes | Do not invent `0`, maximum ID, or identifier length boundaries. |
| BVA-NONE-DESC | `description` length | No minimum or maximum | None | FR15-DOM-034–038 are type/content/requiredness probes | No fabricated length limit. |
| BVA-NONE-IMAGE | `imageUrl` length/format | No length, scheme, or format rule | None | FR15-DOM-039–043 | URL-shaped versus non-URL strings are contract-characterization partitions, not a fabricated URL validator. |
| BVA-NONE-CAT | `category_id` | Existing-membership rule; no numeric range | None | FR15-DOM-044–049 | Existing/non-existing membership is the supported domain; numeric BVA would be invented. |

## Proposed test-case table

Unless a row says otherwise, use endpoint `PUT /api/products/101`, headers `H0`, body `B0`, existing `P1`, `C1`, and an immutable `P2+` pre-state. `B0 with X` changes only `X`. Exact response status/schema is always unresolved; valid cases require the documented business update, invalid cases require no mutation, and characterization cases require observation plus human review.

| Test Case ID | Endpoint | Method | Objective | Preconditions | Input/body | Expected status | Expected response/side effect | EC/Partition tested | Source |
|---|---|---|---|---|---|---|---|---|---|
| FR15-DOM-001 | `/api/products/101` | PUT | Baseline valid admin update using all documented fields | `A1`, `P1`, `C1`, snapshot `P2+` | `B0` | Not specified (successful update expected) | `P1` receives exactly the accepted values; every `P2+` record remains unchanged; response schema unspecified | ENV-V1, ID-V1, AUTH-V1, ROLE-V1, CTYPE-V1, NAME-V1, PRICE-V1, DESC-V1, IMAGE-V1, CAT-V1, EXTRA-V1, TARGET-V1, OTHERS-V1 | README §FR-12/FR-15; API spec §3.3 |
| FR15-DOM-002 | `/api/products/101` | PUT | Reject an absent request body | Baseline except body | `<absent>` | Not specified (rejection required) | Required product inputs are absent; no product changes | ENV-I1 | README §FR-15; API spec §3.3 |
| FR15-DOM-003 | `/api/products/101` | PUT | Reject malformed JSON | Baseline | raw `{"name":` | Not specified (rejection required) | Body cannot supply valid fields; no product changes; error schema unspecified | ENV-I2 | API spec §3.3 |
| FR15-DOM-004 | `/api/products/101` | PUT | Reject a non-object JSON body | Baseline | `[]` | Not specified (rejection required) | Body does not match documented object representation; no product changes | ENV-I3 | API spec §3.3 |
| FR15-DOM-005 | `/api/products/999999` | PUT | Characterize a well-formed-looking but non-existent product identifier | `A1`; `999999` resolves to no product; snapshot all products | `B0` | Not specified (not-found behavior unresolved) | No existing product may change; exact not-found status/body unspecified | ID-U1, OTHERS-V1 | API spec §3.3 |
| FR15-DOM-006 | `/api/products/abc` | PUT | Characterize opaque/non-numeric `id` when identifier syntax is undocumented | `A1`; snapshot all products | `B0` | Not specified (identifier format unresolved) | Record behavior; request must not be redirected to or mutate any existing product | ID-U2, OTHERS-V1 | API spec §3.3 |
| FR15-DOM-007 | `/api/products/` | PUT | Exercise an omitted required path segment as a negative route-template instantiation | `A1`; snapshot all products | `B0`; no `:id` segment | Not specified (route behavior unresolved) | No product may change; this is not a separate API selection, only the missing-path-parameter partition | ID-I1, OTHERS-V1 | API spec §3.3 |
| FR15-DOM-008 | `/api/products/101` | PUT | Reject missing authentication | `P1`, `C1`, snapshot `P2+`; no auth header | `B0` | Not specified (authentication rejection required) | No product changes; exact authentication status/body unspecified | AUTH-I1 | README §FR-12; §SEC-02 |
| FR15-DOM-009 | `/api/products/101` | PUT | Reject an empty bearer token | Baseline except `Authorization: Bearer ` | `B0` | Not specified (authentication rejection required) | No product changes | AUTH-I2 | README §FR-12; §SEC-02 |
| FR15-DOM-010 | `/api/products/101` | PUT | Reject a non-Bearer authorization scheme | Baseline except `Authorization: Basic abc` | `B0` | Not specified (authentication rejection required) | No product changes | AUTH-I3 | README §FR-02/FR-12 |
| FR15-DOM-011 | `/api/products/101` | PUT | Reject a JWT with invalid signature | Baseline except tampered JWT | `B0` | Not specified (authentication rejection required) | No product changes | AUTH-I4 | README §FR-12; §SEC-02 |
| FR15-DOM-012 | `/api/products/101` | PUT | Reject an expired JWT | Baseline except expired JWT | `B0` | Not specified (authentication rejection required) | No product changes | AUTH-I5 | README §FR-12; §SEC-02 |
| FR15-DOM-013 | `/api/products/101` | PUT | Reject a valid JWT whose role is not admin | Use `U1`; `P1`, `C1`, snapshot `P2+` | `B0` | Not specified (authorization rejection required) | No product changes; token existence alone must not authorize update | ROLE-I1 | README §FR-12; §SEC-03 |
| FR15-DOM-014 | `/api/products/101` | PUT | Characterize omitted `Content-Type` | Baseline auth/state; omit header while sending JSON bytes | bytes for `B0` | Not specified (media policy unresolved) | If rejected, no product changes; if accepted by parser, only `P1` changes correctly; final verdict needs confirmed media policy | CTYPE-U1 | API spec §3.3 |
| FR15-DOM-015 | `/api/products/101` | PUT | Characterize JSON-looking bytes labeled `text/plain` | Baseline except `Content-Type: text/plain` | bytes for `B0` | Not specified (parser behavior unresolved) | Record behavior; rejection leaves all products unchanged, while acceptance may change only `P1` | CTYPE-U2 | API spec §3.3 |
| FR15-DOM-016 | `/api/products/101` | PUT | Test `name` length `LB-1 = 0` | Baseline | `B0` with `name:""` | Not specified (rejection required by required/non-empty interpretation) | No product changes | NAME-I1; BVA `LB-1` | README §FR-15 |
| FR15-DOM-017 | `/api/products/101` | PUT | Test minimum valid `name` length `LB = 1` | Baseline | `B0` with `name:N(1)` | Not specified (successful update expected) | `P1.name` becomes the 1-character value; `P2+` unchanged | NAME-V1; BVA `LB` | README §FR-15 |
| FR15-DOM-018 | `/api/products/101` | PUT | Test `name` length `LB+1 = 2` | Baseline | `B0` with `name:N(2)` | Not specified (successful update expected) | `P1.name` becomes the 2-character value; `P2+` unchanged | NAME-V1; BVA `LB+1` | README §FR-15 |
| FR15-DOM-019 | `/api/products/101` | PUT | Test `name` length `UB-1 = 254` | Baseline | `B0` with `name:N(254)` | Not specified (successful update expected) | `P1.name` becomes the 254-character value; `P2+` unchanged | NAME-V1; BVA `UB-1` | README §FR-15 |
| FR15-DOM-020 | `/api/products/101` | PUT | Test maximum valid `name` length `UB = 255` | Baseline | `B0` with `name:N(255)` | Not specified (successful update expected) | `P1.name` becomes the 255-character value; `P2+` unchanged | NAME-V1; BVA `UB` | README §FR-15 |
| FR15-DOM-021 | `/api/products/101` | PUT | Test `name` length `UB+1 = 256` | Baseline | `B0` with `name:N(256)` | Not specified (rejection required) | No product changes | NAME-I2; BVA `UB+1` | README §FR-15 |
| FR15-DOM-022 | `/api/products/101` | PUT | Reject omitted required `name` | Baseline | `B0` without `name` | Not specified (rejection required) | No product changes | NAME-I3 | README §FR-15 |
| FR15-DOM-023 | `/api/products/101` | PUT | Reject null `name` | Baseline | `B0` with `name:null` | Not specified (rejection required) | No product changes | NAME-I4 | README §FR-15; API spec §3.3 |
| FR15-DOM-024 | `/api/products/101` | PUT | Reject non-string `name` | Baseline | `B0` with `name:123` | Not specified (rejection required) | No product changes | NAME-I5 | README §FR-15; API spec §3.3 |
| FR15-DOM-025 | `/api/products/101` | PUT | Characterize whitespace-only `name` | Baseline | `B0` with `name:"   "` | Not specified (trim/nonblank behavior unresolved) | Record behavior; do not label acceptance/rejection a defect without human-confirmed policy; `P2+` must remain unchanged | NAME-U1 | README §FR-15 |
| FR15-DOM-026 | `/api/products/101` | PUT | Test price below the strict lower threshold | Baseline | `B0` with `price:-1` | Not specified (rejection required) | No product changes | PRICE-I1; lower-bound below probe | README §FR-15 |
| FR15-DOM-027 | `/api/products/101` | PUT | Test price exactly at excluded threshold 0 | Baseline | `B0` with `price:0` | Not specified (rejection required) | No product changes | PRICE-I1; lower-bound threshold | README §FR-15 |
| FR15-DOM-028 | `/api/products/101` | PUT | Test conventional just-above positive price | Baseline | `B0` with `price:1` | Not specified (successful update expected) | `P1.price` becomes `1`; `P2+` unchanged | PRICE-V1; lower-bound above probe | README §FR-15 |
| FR15-DOM-029 | `/api/products/101` | PUT | Test positive fractional number when integer/scale restriction is absent | Baseline | `B0` with `price:0.01` | Not specified (successful update expected by written rule) | Only `P1.price` changes; exact storage precision/rounding is unspecified and must be recorded | PRICE-V2; fractional precision probe | README §FR-15; API spec §3.3 |
| FR15-DOM-030 | `/api/products/101` | PUT | Reject omitted required `price` | Baseline | `B0` without `price` | Not specified (rejection required) | No product changes | PRICE-I2 | README §FR-15 |
| FR15-DOM-031 | `/api/products/101` | PUT | Reject null `price` | Baseline | `B0` with `price:null` | Not specified (rejection required) | No product changes | PRICE-I3 | README §FR-15; API spec §3.3 |
| FR15-DOM-032 | `/api/products/101` | PUT | Reject numeric-looking string `price` | Baseline | `B0` with `price:"150000"` | Not specified (rejection required) | No product changes; no undocumented string-to-number coercion oracle is assumed | PRICE-I4 | README §FR-15; API spec §3.3 |
| FR15-DOM-033 | `/api/products/101` | PUT | Reject Boolean `price` | Baseline | `B0` with `price:true` | Not specified (rejection required) | No product changes | PRICE-I5 | README §FR-15; API spec §3.3 |
| FR15-DOM-034 | `/api/products/101` | PUT | Accept a Vietnamese Unicode description string | Baseline | `B0` with `description:"Mô tả sản phẩm cập nhật"` | Not specified (successful update expected by shown string type) | Only `P1.description` changes; encoding normalization is unspecified; `P2+` unchanged | DESC-V1 | API spec §3.3 |
| FR15-DOM-035 | `/api/products/101` | PUT | Exercise empty description with no non-empty rule | Baseline | `B0` with `description:""` | Not specified (successful update expected by unrestricted shown string type) | Only `P1.description` becomes empty; `P2+` unchanged | DESC-V1 | API spec §3.3 |
| FR15-DOM-036 | `/api/products/101` | PUT | Characterize omitted `description` | Baseline | `B0` without `description` | Not specified (requiredness/update semantics unresolved) | Record whether value is preserved, cleared, or request rejected; only `P1` may differ and final verdict needs confirmation | DESC-U1 | API spec §3.3 |
| FR15-DOM-037 | `/api/products/101` | PUT | Characterize null `description` | Baseline | `B0` with `description:null` | Not specified (null policy unresolved) | Record behavior; rejection must not mutate products; acceptance semantics need human confirmation | DESC-U2 | API spec §3.3 |
| FR15-DOM-038 | `/api/products/101` | PUT | Characterize non-string `description` | Baseline | `B0` with `description:{}` | Not specified (type/coercion policy unresolved) | Record behavior; no non-target mutation; do not invent coercion expectations | DESC-U3 | API spec §3.3 |
| FR15-DOM-039 | `/api/products/101` | PUT | Characterize a non-URL string in `imageUrl` | Baseline | `B0` with `imageUrl:"not-a-url"` | Not specified (URL-format rule absent) | Record behavior; only `P1` may change and final verdict needs confirmed format policy | IMAGE-U1 | API spec §3.3 |
| FR15-DOM-040 | `/api/products/101` | PUT | Characterize empty `imageUrl` | Baseline | `B0` with `imageUrl:""` | Not specified (empty policy absent) | Record behavior; only `P1` may change | IMAGE-U2 | API spec §3.3 |
| FR15-DOM-041 | `/api/products/101` | PUT | Characterize omitted `imageUrl` | Baseline | `B0` without `imageUrl` | Not specified (requiredness/update semantics unresolved) | Record whether value is preserved, cleared, or request rejected; `P2+` unchanged | IMAGE-U3 | API spec §3.3 |
| FR15-DOM-042 | `/api/products/101` | PUT | Characterize null `imageUrl` | Baseline | `B0` with `imageUrl:null` | Not specified (null policy unresolved) | Record behavior; rejection leaves all products unchanged; accepted semantics need confirmation | IMAGE-U4 | API spec §3.3 |
| FR15-DOM-043 | `/api/products/101` | PUT | Characterize non-string `imageUrl` | Baseline | `B0` with `imageUrl:123` | Not specified (type/coercion policy unresolved) | Record behavior; no non-target mutation | IMAGE-U5 | API spec §3.3 |
| FR15-DOM-044 | `/api/products/101` | PUT | Update target to a different existing category | `A1`, `P1`, both `C1` and `C2`, snapshot `P2+` | `B0` with `category_id:2` | Not specified (successful update expected) | `P1.category_id` becomes `2`; all `P2+` records unchanged | CAT-V1 | README §FR-15; API spec §3.3 |
| FR15-DOM-045 | `/api/products/101` | PUT | Reject category ID that does not select an existing category | `A1`, `P1`, `C404` confirmed absent, snapshot `P2+` | `B0` with `category_id:999999` | Not specified (rejection required) | No product changes | CAT-I1 | README §FR-15 |
| FR15-DOM-046 | `/api/products/101` | PUT | Reject omitted required `category_id` | Baseline | `B0` without `category_id` | Not specified (rejection required) | No product changes | CAT-I2 | README §FR-15 |
| FR15-DOM-047 | `/api/products/101` | PUT | Reject null `category_id` | Baseline | `B0` with `category_id:null` | Not specified (rejection required) | No product changes | CAT-I3 | README §FR-15; API spec §3.3 |
| FR15-DOM-048 | `/api/products/101` | PUT | Reject numeric-looking string `category_id` | Baseline | `B0` with `category_id:"1"` | Not specified (rejection required by documented representation) | No product changes; no undocumented coercion assumed | CAT-I4 | README §FR-15; API spec §3.3 |
| FR15-DOM-049 | `/api/products/101` | PUT | Reject fractional `category_id` | Baseline | `B0` with `category_id:1.5` | Not specified (rejection required by documented integer representation) | No product changes | CAT-I5 | README §FR-15; API spec §3.3 |
| FR15-DOM-050 | `/api/products/101` | PUT | Characterize one unknown body property | Baseline | `B0` plus `"unexpected_field":"sentinel"` | Not specified (additional-property policy unresolved) | Reject unchanged or ignore the member and update only documented fields on `P1`; the unknown member must not alter another product/protected state | EXTRA-U1 | API spec §3.3 |

## Coverage ledger

| Parameter ID | Valid ECs covered | Invalid ECs covered separately? | Boundaries covered | Related non-domain technique | Gap/unspecified contract |
|---|---|---|---|---|---|
| PC-ENV | ENV-V1 in 001 and every field-level case | Yes: ENV-I1/I2/I3 separately in 002–004 | No body-size boundary documented | Security/schema: parser errors, duplicate keys, error leakage | Maximum body size, duplicate-member handling, and failure schema unspecified |
| PC-ID | ID-V1 in 001–004 and 008–050 | ID-U1/U2/I1 isolated in 005–007; U classes intentionally await confirmation | No ID boundary supported | Security: object targeting/IDOR and authorization-before-existence behavior | Identifier syntax/type/range, not-found status/body, and route error contract unspecified |
| PC-AUTH | AUTH-V1 in all cases except 008–012 | Yes: AUTH-I1–I5 separately in 008–012 | No token-length/expiry boundary documented | Security checklist: malformed claims, signature algorithms, claim validation | Exact auth error status/schema and accepted JWT claims unspecified |
| PC-ROLE | ROLE-V1 in all baseline-auth cases | Yes: ROLE-I1 isolated in 013 | Discrete role rule; no BVA | Security checklist: SEC-03 role escalation/claim tampering | Exact forbidden response and role vocabulary beyond `admin` unspecified |
| PC-CTYPE | CTYPE-V1 in all except 014–015 | CTYPE-U1/U2 isolated in 014–015 | No media/body-size boundary documented | Security/schema: parser differentials | Missing header, charset, and non-JSON parser behavior unspecified |
| PC-NAME | NAME-V1 in baseline and 017–020 | Yes: NAME-I1–I5 separately in 016, 021–024; NAME-U1 isolated in 025 | Full `0/1/2/254/255/256` in 016–021 | Security: injection/XSS/Unicode normalization; schema | Character-count unit, whitespace trimming/nonblank rule, and normalization unspecified |
| PC-PRICE | PRICE-V1 in baseline/028; PRICE-V2 in 029 | Yes: PRICE-I1–I5 separately in 026–027 and 030–033 | Supported lower threshold probed at `-1/0/1`; fractional `0.01`; no upper BVA | Security: coercion/overflow; schema | Currency unit, decimal scale/rounding, finite-number/storage maximum, and upper bound unspecified |
| PC-DESC | DESC-V1 in baseline and 034–035 | DESC-U1/U2/U3 isolated in 036–038; final validity awaits missing/null/type policy | No documented length boundary | Security: stored XSS/injection; schema | Requiredness, partial-update behavior, nullability, length, content, normalization unspecified |
| PC-IMAGE | IMAGE-V1 in baseline | IMAGE-U1–U5 isolated in 039–043; final validity awaits contract | No supported length/format BVA | Security: unsafe schemes/content; schema | Requiredness, URL grammar/schemes, empty/null/coercion, fetch behavior, maximum length unspecified |
| PC-CAT | CAT-V1 in baseline and 044 | Yes: CAT-I1–I5 separately in 045–049 | No numeric range; membership only | Security: foreign-key/object targeting; schema | Not-found status/error, coercion, and category-deletion race unspecified |
| PC-EXTRA | EXTRA-V1 in 001–049 | EXTRA-U1 isolated in 050 | Not applicable | Security: mass assignment/prototype/object injection/forbidden fields | Strict versus lenient additional-property policy unspecified |
| PC-TARGET | TARGET-V1 asserted in every accepted case | Rejected cases require unchanged target | Not applicable | Security/state protection: atomicity, concurrent updates | Partial replacement, no-op behavior, timestamps/versioning, and atomicity unspecified |
| PC-OTHERS | OTHERS-V1 asserted in all 50 cases | Yes: every rejection/unresolved case preserves all products | Not applicable | Security: cross-object mutation and IDOR | Approved non-GET observation method needed for execution evidence |
| PC-RESP | No response EC is assertable | No documented status/body contract exists | None | Security/Schema Checklist must preserve the gap | Entire success and error response contract unspecified |
| PC-STUDENT | Future baseline `{{StudentID}}` only | Not applicable | Not applicable | Stage 4 collection-level pre-request script | Harness evidence only; no hard-coded real ID and no Stage 1 request |

## Completeness summary and open confirmations

- Inventory: 15 request/auth/body/state/output/harness entries for the sole selected endpoint.
- Equivalence analysis: 54 request/state/contract classes, including every documented body member and every relevant path, authentication, role, media, and side-effect input.
- Proposed Domain cases: 50. Every invalid or unresolved independent partition has its own representative; envelope cases are isolated at the envelope level.
- BVA: complete six-point coverage for `name` length 1–255; supported one-sided threshold coverage for `price > 0`; no ID/category/description/image/price-upper boundary was invented.
- Assertable oracles: valid admin authorization is required; `name` is required and at most 255 characters; `price` is a required number greater than 0; `category_id` must select an existing category; and only the identified product may change.
- Human confirmation is required before later automation finalizes: `id` syntax/not-found behavior; whether `name` must be nonblank after trimming; positive fractional-price scale/rounding; `description` and `imageUrl` omission/null/type/format semantics; Content-Type behavior; unknown-property policy; every exact status/response schema; and the allowed non-GET state oracle.
- Security-specific injection, XSS, mass-assignment, IDOR, role-escalation, schema, atomicity, and parser-differential cases remain for the separate `/security-check pool-c` technique and are not silently counted here.
- No progress checkbox is changed by this proposal.

Status: Approved
