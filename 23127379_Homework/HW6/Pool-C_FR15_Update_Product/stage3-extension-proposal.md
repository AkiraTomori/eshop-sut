# Pool C / FR-15 — Stage 3 Extension Proposal

> Scope: gap analysis against the human-confirmed Stage 2 audit for `PUT /api/products/:id`. These are new proposed cases; no Stage 1 row or Stage 2 label was edited. No request was executed and no GET request is designed.

## Confirmed baseline and extension policy

- Authoritative confirmed Stage 2 baseline: 86 unique cases, currently labeled 60 `VALID`, 0 `INVALID`, and 26 `INCOMPLETE` after human revision.

- The extension adds only dimensions absent from all 86 source IDs. It does not rename an existing representative, treat an unresolved schema row as new, or reuse an existing primary payload.

- Every new case has a source-backed pass/fail invariant. The expected HTTP class is completed below as `2xx`, `4xx`, or an explicit policy-dependent `2xx/4xx` branch; only exact numeric codes and response schemas remain undocumented.

- Security is prioritized: five of seven additions address JWT claim/header parsing or SQL injection in body fields not exercised by the confirmed security set.

- Fixtures reuse test-controlled admin `A1`, normal user `U1`, target product `P1`, non-target products `P2+`, existing category `C1`, valid headers `H0`, and valid body `B0`. No real JWT, secret, product ID, or student ID is embedded.

- Future execution must use a fresh fixture or rollback, approved non-GET before/after state evidence, and collection-level `X-Student-Id: {{StudentID}}` injection.

## Absence and non-duplication ledger

| Gap ID | Applicable skill | Confirmed coverage already present | Genuinely absent dimension | New case |

|---|---|---|---|---|

| GAP-DOM-01 | Domain Testing | Name BVA uses ASCII `N(n)` at 0, 1, 2, 254, 255, and 256 characters | A 255-character value whose UTF-8 byte length exceeds 255, separating the documented character limit from an accidental byte limit | FR15-EXT-DOM-001 |

| GAP-DOM-02 | Domain Testing | Positive price representatives use ordinary integer and decimal notation | Equivalent positive JSON number encoded with exponent notation | FR15-EXT-DOM-002 |

| GAP-SEC-01 | Security/Schema | Valid admin string role, ordinary non-admin role, signature tampering, and `alg:none` | Properly signed JWT whose `role` claim is an array containing `admin`, probing type confusion against exact `role='admin'` | FR15-EXT-SEC-001 |

| GAP-SEC-02 | Security/Schema | Missing, empty, wrong-scheme, malformed, altered, expired, and single-token non-admin Authorization cases | Duplicate Authorization header instances where neither credential grants admin authority | FR15-EXT-SEC-002 |

| GAP-SEC-03 | Security/Schema | SQLi probes cover path `id`, `name`, and `category_id`; price wrong-type cases use non-malicious values | SQL-looking string in required numeric `price` | FR15-EXT-SEC-003 |

| GAP-SEC-04 | Security/Schema | `description` has Unicode/type/XSS cases but no SQLi representative | SQL-looking string in `description` | FR15-EXT-SEC-004 |

| GAP-SEC-05 | Security/Schema | `imageUrl` has format/type/XSS-scheme cases but no SQLi representative | SQL-looking string in `imageUrl` | FR15-EXT-SEC-005 |

## Proposed extension cases

| Test Case ID | Originating skill | Endpoint | Category/objective | Preconditions | Request/payload | Expected status | Expected response/side effects | Requirement source |

|---|---|---|---|---|---|---|---|---|

| FR15-EXT-DOM-001 | Domain Testing gap analysis | `PUT /api/products/101` | Multi-byte Unicode representative at the documented 255-character upper boundary | Valid `A1`, existing `P1`, existing `C1`, snapshot `P2+`; construct exactly 255 precomposed Vietnamese `á` code points | `B0` with `name` equal to the 255-character Unicode fixture; its UTF-8 representation exceeds 255 bytes | `2xx Success` — exact code not documented | Do not reject merely because encoded byte length exceeds 255. `P1.name` becomes the submitted 255-character value, subject only to unspecified normalization; `P2+` unchanged | README §FR-15; API §3.3 |

| FR15-EXT-DOM-002 | Domain Testing gap analysis | `PUT /api/products/101` | Equivalent valid JSON numeric encoding for positive price | Valid `A1`, existing `P1`, `C1`, snapshot `P2+`; send raw JSON so exponent notation is preserved | Valid JSON body based on `B0` with `"price":1e2` | `2xx Success` — exact code not documented | Treat the JSON number as numeric `100`, update only `P1.price`, and leave `P2+` unchanged; response schema remains unspecified | README §FR-15; JSON number example in API §3.3 |

| FR15-EXT-SEC-001 | Security/Schema gap analysis | `PUT /api/products/101` | JWT role-claim type confusion | Properly signed disposable test JWT with otherwise valid claims but `role:["admin"]`; existing `P1`, `C1`, snapshot `P2+` | `B0` with bearer token containing the array-valued role claim | `4xx Authorization Error` — exact code not documented | Array membership must not satisfy the exact `role='admin'` requirement; response exposes no token/internal detail and no product changes | README §FR-12/§SEC-02/§SEC-03 |

| FR15-EXT-SEC-002 | Security/Schema gap analysis | `PUT /api/products/101` | Duplicate Authorization header parser differential | Existing `P1`, `C1`, snapshot `P2+`; raw-capable client preserves two header instances | Two Authorization headers: one `Bearer <valid-U1-non-admin-JWT>` and one `Bearer not-a-jwt`; body `B0` | `4xx Authentication/Authorization Error` — exact code and precedence not documented | Neither supplied credential grants valid admin authority. No header-combination or precedence behavior may authorize the update; no token/parser disclosure and no product changes | README §FR-12/§SEC-02/§SEC-03 |

| FR15-EXT-SEC-003 | Security/Schema gap analysis | `PUT /api/products/101` | SQL injection in required numeric price | Valid `A1`, existing `P1`, `C1`, snapshot all products | `B0` with `price:"0); DROP TABLE products;--"` | `4xx Validation Error` — exact code not documented | Reject because price is not a positive JSON number; expose no SQL/database/stack detail and leave every product/table unchanged | README §FR-15/§SEC-05; API §3.3 |

| FR15-EXT-SEC-004 | Security/Schema gap analysis | `PUT /api/products/101` | SQL injection in description | Valid `A1`, existing `P1`, `C1`, snapshot `P2+` and product count | `B0` with `description:"x', price=0 WHERE 1=1--"` | `2xx Success` if accepted as inert text; otherwise `4xx Client Error` under an implemented content policy | Parameterized handling causes no SQL error, bulk price change, or query/stack disclosure. If accepted, only `P1.description` stores the literal string; rejection changes nothing | README §FR-15/§SEC-05; API §3.3 |

| FR15-EXT-SEC-005 | Security/Schema gap analysis | `PUT /api/products/101` | SQL injection in image URL string | Valid `A1`, existing `P1`, `C1`, snapshot `P2+` and product count | `B0` with `imageUrl:"https://example.test/p.png?x=' OR 1=1--"` | `2xx Success` if accepted as inert text; otherwise `4xx Client Error` under an implemented content policy | Parameterized handling causes no SQL error, bulk/cross-target effect, or internal disclosure. If accepted, only `P1.imageUrl` stores the literal string; rejection changes nothing | README §FR-15/§SEC-05; API §3.3 |

## Required omission explanations

### FR15-EXT-DOM-001

Why AI missed it: The initial Domain pass completed six-point name BVA with repeated ASCII characters and noted that the word “characters” lacked an encoding definition, but it did not add a multi-byte representative at the same upper boundary to expose accidental byte-count validation.

### FR15-EXT-DOM-002

Why AI missed it: The initial Domain pass partitioned price by sign, type, and fractional precision and selected ordinary decimal literals, but it treated equivalent JSON numeric encodings as the same class and omitted exponent notation that can follow a different parser/coercion path.

### FR15-EXT-SEC-001

Why AI missed it: The initial Security pass separated token validity from admin authorization but modeled `role` as a scalar claim; it did not probe a properly signed non-string claim that contains the word `admin` and may trigger permissive membership or coercion logic.

### FR15-EXT-SEC-002

Why AI missed it: Authentication generation varied one Authorization value at a time and did not request duplicate-header differentials, so it missed ambiguity introduced before JWT verification by HTTP header normalization or last-value precedence.

### FR15-EXT-SEC-003

Why AI missed it: The model classified `price` primarily as a numeric domain and covered ordinary wrong types, while SQLi generation concentrated on the path, free-text name, and category lookup; it did not revisit the numeric field with a malicious string coercion payload.

### FR15-EXT-SEC-004

Why AI missed it: The initial pass selected one representative free-text field (`name`) for body SQLi and used `description` only for Unicode, type, and XSS coverage, implicitly assuming parameterization was shared across update columns.

### FR15-EXT-SEC-005

Why AI missed it: `imageUrl` was analyzed as a format and browser-sink field, so the model focused on non-URL and `javascript:` inputs and overlooked that the same string may reach the database update statement through a separately implemented binding path.

## Coverage effect if approved

| Metric | Confirmed Stage 2 baseline | Stage 3 additions | Projected approved total |

|---|---:|---:|---:|

| Unique cases | 86 | 7 | 93 |

| Source-complete / confirmation-ready cases | 60 | 7 with enforceable invariants | 67 |

| Domain extensions | — | 2 | 2 |

| Security-focused extensions | — | 5 | 5 |

The five-case extension minimum is met without relying on any of the 26 still-incomplete Stage 2 rows. All seven extension cases now have an actionable HTTP-class oracle; exact numeric codes and response schemas remain undocumented. Future automation must assert both the applicable status class/branch and the documented numeric, role, parameterization, and target-isolation invariants shown above.

No duplicate ID, GET request, out-of-scope endpoint, real secret, API execution, Newman run, source-case edit, Stage 2 label change, progress update, or automatic Stage 4 action occurred.

Status: Approved for Stage 3 extension proposal. All 86 Stage 1 IDs are preserved with final `VALID / INVALID / INCOMPLETE` labels and audit reasons.
