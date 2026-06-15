## Domain Analysis (Equivalence Partitioning) — FR-15: Product Management (Product CRUD)
**Date:** 2026-06-15 18:04
**Analyst:** Gemini QA Agent (reviewed by: [HITL name])
**Based on:** FR15-requirement-analysis.md (HITL-Accepted 2026-06-15)
**SRS Version:** 2.0 (2026-05-14)
**HITL Ambiguity Resolutions Applied:**
- AMB-01: `description` uses SQLite TEXT (unbounded); UI safety boundary = 1000 chars
- AMB-02: `imageUrl` is optional; if provided, must begin with `https://`; empty string treated as valid null
- AMB-03: `price` must be a positive integer only; floats (e.g., 99.5) are INVALID
- AMB-04: Non-integer `category_id` via API → HTTP 400 Bad Request
- AMB-05: Create → HTTP 201; Update/Delete → HTTP 200; Validation error → HTTP 400; Not Found → HTTP 404
- AMB-06: Delete confirmation dialog is mandatory; cancellation aborts deletion
- AMB-07: `price = 0` and `price < 0` are two distinct INVALID equivalence classes

---

### Equivalence Class Table

> **EC ID Format:** `EC-FR15-[NNN]`
> **Guideline Key:** G1=Range, G2=Discrete Set, G3=Must-Be Condition, G4=Split

---

#### GROUP A — Authentication / Access Control

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-001 | JWT Token | Token is present, valid (not expired, not malformed), and carries `role = 'admin'` | VALID | G3 | FR-12, SEC-02, SEC-03 |
| EC-FR15-002 | JWT Token | Token is absent (no `Authorization` header sent) | INVALID | G3 | FR-12, SEC-02 |
| EC-FR15-003 | JWT Token | Token is present but malformed / structurally invalid (cannot be decoded) | INVALID | G4 (split from EC-002: absent vs malformed are different failure modes) | FR-12, SEC-02 |
| EC-FR15-004 | JWT Token | Token is present and structurally valid but expired | INVALID | G4 (split: expired is a distinct temporal failure mode from malformed) | FR-12, SEC-02 |
| EC-FR15-005 | Admin Role (`role` in JWT) | `role = 'admin'` — admin privilege confirmed in token payload | VALID | G2 | FR-12, SEC-03 |
| EC-FR15-006 | Admin Role (`role` in JWT) | `role = 'user'` — valid token but insufficient privilege (regular user) | INVALID | G2 | FR-12, SEC-03 |

---

#### GROUP B — Product Name (`name`)

> Applied: G1 (length range), G3 (must-be: non-empty string), G4 (split: XSS-payload subset)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-007 | Product Name | Non-empty string, 1–255 characters, no special structure required | VALID | G1 + G3 | FR-15 |
| EC-FR15-008 | Product Name | Empty string (`""`) or null — mandatory field is missing | INVALID | G3 | FR-15, FR-22 |
| EC-FR15-009 | Product Name | String of exactly 256 characters (one above the 255-char upper bound) | INVALID | G1 (UB+1) | FR-15 |
| EC-FR15-010 | Product Name | String exceeding 255 characters (e.g., 500 chars — well above upper bound) | INVALID | G1 | FR-15 |
| EC-FR15-011 | Product Name | String containing HTML/script injection payload (e.g., `<script>alert(1)</script>`) | INVALID (security) | G4 (split: XSS-attempt is a distinct sub-class requiring safe-rendering output) | SEC-04 |

---

#### GROUP C — Price (`price`)

> Applied: G1 (numeric range: price > 0), G3 (must-be integer), G4 (split: zero vs negative vs float)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-012 | Price | Positive integer value > 0 (e.g., 100000) | VALID | G1 + G3 | FR-15 |
| EC-FR15-013 | Price | Value = 0 (violates > 0 constraint; boundary case at the lower forbidden value) | INVALID | G1 + G4 (AMB-07: price=0 is a distinct class from price<0) | FR-15 |
| EC-FR15-014 | Price | Negative integer value (< 0) (e.g., -1, -500) | INVALID | G1 + G4 (AMB-07: price<0 is a distinct class from price=0) | FR-15 |
| EC-FR15-015 | Price | Floating-point / decimal value (e.g., 99.5, 1000.99) — not a whole integer | INVALID | G3 + AMB-03 (floats declared invalid for ₫ currency) | FR-15 |
| EC-FR15-016 | Price | Non-numeric string (e.g., `"abc"`, `"price"`) | INVALID | G3 | FR-15 |
| EC-FR15-017 | Price | Empty / null / missing (mandatory field omitted) | INVALID | G3 | FR-15, FR-22 |

---

#### GROUP D — Description (`description`)

> Applied: G3 (must-be: if provided, must be a string), G1 (UI safety range: 0–1000 chars), G4 (XSS split)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-018 | Description | Empty string (`""`) or omitted — field is optional; treated as null | VALID | G3 | FR-15 |
| EC-FR15-019 | Description | Non-empty string, 1–1000 characters (within UI safety boundary) | VALID | G1 + G3 | FR-15, AMB-01 |
| EC-FR15-020 | Description | String exceeding 1000 characters (beyond UI safety boundary) | INVALID | G1 (UB+1 of UI boundary) | FR-15, AMB-01 |
| EC-FR15-021 | Description | String containing HTML/script injection payload (e.g., `<img onerror=alert(1)>`) | INVALID (security) | G4 (XSS sub-class requiring safe-rendering verification) | SEC-04 |

---

#### GROUP E — Image URL (`imageUrl`)

> Applied: G3 (if provided: must start with `https://`), G2 (two accepted states: empty vs valid URL), G4 (split: missing https:// prefix vs completely malformed)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-022 | Image URL | Empty string (`""`) or omitted — field is optional; treated as valid null | VALID | G2 + AMB-02 | FR-15 |
| EC-FR15-023 | Image URL | Well-formed URL beginning with `https://` (e.g., `https://example.com/img.jpg`) | VALID | G2 + G3 + AMB-02 | FR-15 |
| EC-FR15-024 | Image URL | URL beginning with `http://` only (not `https://`) | INVALID | G3 + AMB-02 (schema requires https prefix) | FR-15, AMB-02 |
| EC-FR15-025 | Image URL | Completely malformed / non-URL string (e.g., `"notaurl"`, `"ftp://..."`) | INVALID | G4 (split from EC-024: different invalid form) | FR-15, AMB-02 |

---

#### GROUP F — Category (`category_id`)

> Applied: G2 (discrete set: ID must be from existing list), G3 (must-be integer), G4 (split: non-existent ID vs non-integer type)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-026 | Category ID | Valid positive integer referencing an existing category in the database | VALID | G2 + G3 | FR-15 |
| EC-FR15-027 | Category ID | Empty / null / not selected (mandatory field omitted) | INVALID | G3 | FR-15, FR-22 |
| EC-FR15-028 | Category ID | Integer value referencing a non-existent category (valid integer type but no matching DB record) | INVALID | G2 (not in the allowed set) | FR-15 |
| EC-FR15-029 | Category ID | Non-integer alphanumeric value (e.g., `"abc"`) sent directly to API — type violation | INVALID | G3 + AMB-04 (type mismatch → HTTP 400) | FR-15, AMB-04 |

---

#### GROUP G — Product ID (`:id` path parameter — Edit & Delete)

> Applied: G2 (must reference existing product), G3 (must be a positive integer), G4 (split: non-existent vs non-integer)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-030 | Product ID (path) | Valid positive integer referencing an existing product in the database | VALID | G2 + G3 | FR-15, API §3.3 |
| EC-FR15-031 | Product ID (path) | Positive integer that does not reference any existing product (non-existent ID) | INVALID | G2 (not in the existing set → HTTP 404) | FR-15, AMB-05 |
| EC-FR15-032 | Product ID (path) | Non-integer value in the path (e.g., `/api/products/abc`) | INVALID | G3 (type violation → HTTP 400) | FR-15, API §3.3 |

---

#### GROUP H — Search Keyword (`?search=`)

> Applied: G3 (must-be: safe rendering), G2 (empty vs populated), G4 (XSS split)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-033 | Search Keyword | Empty / omitted — all products returned | VALID | G2 | FR-05 |
| EC-FR15-034 | Search Keyword | Non-empty keyword matching one or more product names | VALID | G2 + G3 | FR-05 |
| EC-FR15-035 | Search Keyword | Non-empty keyword matching no product names (no results) | VALID | G2 (distinct valid output: empty state rendered) | FR-05 |
| EC-FR15-036 | Search Keyword | HTML/script injection payload (e.g., `<script>alert(1)</script>`) — must render as plain text | INVALID (security) | G4 (XSS sub-class) | SEC-04, FR-05 |

---

#### GROUP I — GUI / Form-Level Inputs

> Applied: G2 (discrete acceptable states for each UI requirement), G3 (must-be conditions)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-037 | Required field indicator (`*`) | All mandatory fields (Name, Price, Category) display `*` next to label | VALID | G3 | FR-22 |
| EC-FR15-038 | Required field indicator (`*`) | One or more mandatory fields missing the `*` indicator | INVALID | G3 | FR-22 |
| EC-FR15-039 | Error message position | Error message rendered **above** the submit button | VALID | G3 | FR-22 |
| EC-FR15-040 | Error message position | Error message rendered **below** the submit button or elsewhere | INVALID | G3 | FR-22 |
| EC-FR15-041 | Submit button colour | Submit / confirm action buttons use blue colour | VALID | G2 | FR-21 |
| EC-FR15-042 | Delete button colour | Delete / dangerous action buttons use red colour | VALID | G2 | FR-21 |
| EC-FR15-043 | Submit or Delete button colour | Action buttons use wrong colour (e.g., delete button is blue) | INVALID | G2 | FR-21 |
| EC-FR15-044 | Page `<h1>` tag count | Page contains exactly one `<h1>` tag | VALID | G3 | FR-21 |
| EC-FR15-045 | Page `<h1>` tag count | Page contains zero or more than one `<h1>` tag | INVALID | G3 | FR-21 |
| EC-FR15-046 | Tab key focus order | Tab key navigates fields from top-to-bottom, left-to-right | VALID | G3 | FR-21 |
| EC-FR15-047 | Tab key focus order | Tab key skips a field or navigates in wrong order | INVALID | G3 | FR-21 |
| EC-FR15-048 | Delete Confirmation Dialog | Confirmation dialog appears before deletion; Cancel aborts the action | VALID | G3 + AMB-06 | FR-21, AMB-06 |
| EC-FR15-049 | Delete Confirmation Dialog | No confirmation dialog appears; deletion executes immediately without user confirmation | INVALID | G3 + AMB-06 | FR-21, AMB-06 |

---

#### GROUP J — Output Variables (Success Outputs)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-050 | Create Product Output | HTTP 201 Created returned; success notification displayed; new product appears in product list | VALID OUTPUT | G2 | FR-15, AMB-05 |
| EC-FR15-051 | Update Product Output | HTTP 200 OK returned; success notification displayed; edited product reflects new values; all other products unchanged (isolation) | VALID OUTPUT | G2 | FR-15, AMB-05 |
| EC-FR15-052 | Delete Product Output | HTTP 200 OK returned; success notification displayed; product removed from list | VALID OUTPUT | G2 | FR-15, AMB-05 |
| EC-FR15-053 | View Product List Output | All products displayed with Name, Price (₫ format with thousands separator), Image, Category; loading state shown during fetch | VALID OUTPUT | G2 | FR-15, FR-05, FR-21 |
| EC-FR15-054 | View Product Detail Output | Single product detail: Name, Price, Description, Image URL, Category rendered correctly | VALID OUTPUT | G2 | FR-15, FR-06 |

---

#### GROUP K — Output Variables (Error / Invalid Outputs)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-055 | Name Validation Error Output | HTTP 400; error message above submit button indicating name is required | INVALID OUTPUT | G2 | FR-15, FR-22, AMB-05 |
| EC-FR15-056 | Name Length Error Output | HTTP 400; error message above submit button indicating name exceeds 255 characters | INVALID OUTPUT | G2 | FR-15, FR-22, AMB-05 |
| EC-FR15-057 | Price Missing Error Output | HTTP 400; error message above submit button indicating price is required | INVALID OUTPUT | G2 | FR-15, FR-22, AMB-05 |
| EC-FR15-058 | Price Zero / Invalid Error Output | HTTP 400; error message above submit button indicating price must be a positive integer | INVALID OUTPUT | G2 | FR-15, FR-22, AMB-05, AMB-07 |
| EC-FR15-059 | Price Non-Numeric Error Output | HTTP 400; error message above submit button indicating price must be a valid number | INVALID OUTPUT | G2 | FR-15, FR-22, AMB-05 |
| EC-FR15-060 | Category Missing Error Output | HTTP 400; error message above submit button indicating category is required | INVALID OUTPUT | G2 | FR-15, FR-22, AMB-05 |
| EC-FR15-061 | Category Non-Existent Error Output | HTTP 400; error message indicating the selected category does not exist | INVALID OUTPUT | G2 | FR-15, AMB-05 |
| EC-FR15-062 | Product Not Found Error Output (Edit/Delete) | HTTP 404; appropriate error message displayed; no data mutation occurs | INVALID OUTPUT | G2 | FR-15, AMB-05 |
| EC-FR15-063 | Unauthorized Access Output (No Token) | HTTP 401 Unauthorized; user redirected to login or error page | INVALID OUTPUT | G2 | FR-12, SEC-02, AMB-05 |
| EC-FR15-064 | Forbidden Access Output (Non-Admin Token) | HTTP 403 Forbidden; operation rejected; no data exposed or mutated | INVALID OUTPUT | G2 | FR-12, SEC-03, AMB-05 |
| EC-FR15-065 | XSS Prevention Output | Malicious payload rendered as plain text (HTML-escaped); no script execution in browser | INVALID OUTPUT (security pass) | G3 | SEC-04 |
| EC-FR15-066 | Product Isolation Output (Edit/Delete) | After modifying product X, all other products Y, Z retain their original field values unchanged | VALID OUTPUT | G3 | FR-15 |
| EC-FR15-067 | Delete Cancellation Output | After clicking Cancel on the delete confirmation dialog, the product remains in the database and list | VALID OUTPUT | G3 + AMB-06 | FR-15, AMB-06 |

---

### Guideline Application Summary

| Variable | G1 | G2 | G3 | G4 | EC IDs | Notes |
|----------|----|----|----|----|--------|-------|
| JWT Token | | | ✓ | ✓ | 001–004 | G4 splits absent vs malformed vs expired |
| Admin Role | | ✓ | | | 005–006 | Discrete: admin / user |
| Product Name | ✓ | | ✓ | ✓ | 007–011 | Length range 1–255; G4 adds XSS sub-class |
| Price | ✓ | | ✓ | ✓ | 012–017 | G4 splits: zero vs negative vs float vs non-numeric |
| Description | ✓ | | ✓ | ✓ | 018–021 | Optional; G1 on UI boundary 0–1000; G4 adds XSS |
| Image URL | | ✓ | ✓ | ✓ | 022–025 | G2: empty vs https URL; G4 splits http vs malformed |
| Category ID | | ✓ | ✓ | ✓ | 026–029 | G4 splits: non-existent vs non-integer |
| Product ID (path) | | ✓ | ✓ | ✓ | 030–032 | G4 splits: non-existent vs non-integer |
| Search Keyword | | ✓ | ✓ | ✓ | 033–036 | G2: empty/match/no-match; G4 adds XSS |
| Required field `*` | | | ✓ | | 037–038 | Must-be: present vs absent |
| Error message position | | | ✓ | | 039–040 | Must-be: above vs not-above submit button |
| Button colour | | ✓ | | | 041–043 | Discrete: blue for submit, red for delete |
| `<h1>` tag count | | | ✓ | | 044–045 | Must-be: exactly 1 |
| Tab focus order | | | ✓ | | 046–047 | Must-be: top-bottom left-right |
| Delete Confirmation Dialog | | | ✓ | | 048–049 | Must-be: dialog present + cancel works |
| Output: Create | | ✓ | | | 050 | Valid output class |
| Output: Update | | ✓ | | | 051 | Valid output class (includes isolation) |
| Output: Delete | | ✓ | | | 052 | Valid output class |
| Output: List/Detail | | ✓ | | | 053–054 | Valid output classes |
| Output: Error states | | ✓ | ✓ | | 055–065 | Invalid output classes per error type |
| Output: Isolation | | | ✓ | | 066 | Valid isolation output |
| Output: Cancel deletion | | | ✓ | | 067 | Valid cancellation output |

**Total Equivalence Classes: 67**
- VALID classes: 22 (EC-FR15-001, 005, 007, 012, 018–019, 022–023, 026, 030, 033–035, 037, 039, 041–042, 044, 046, 048, 050–054, 066–067)
- INVALID classes: 35 (EC-FR15-002–004, 006, 008–011, 013–017, 020–021, 024–025, 027–029, 031–032, 036, 038, 040, 043, 045, 047, 049, 055–065)
- VALID OUTPUT classes: 10 (050–054, 066–067 — plus valid GUI outputs embedded)
- INVALID OUTPUT classes: 13 (055–065)

---

### Mutual Exclusivity & Exhaustiveness Verification

```
✅ JWT Token: {absent} ∪ {malformed} ∪ {expired} ∪ {valid+admin} = all possible token states — MECE
✅ Admin Role: {admin} ∪ {non-admin} = all role values — MECE
✅ Product Name: {empty} ∪ {1–255 chars} ∪ {256 chars} ∪ {>256 chars} ∪ {XSS payload} — MECE (XSS overlaps length classes by design for security isolation; justified by G4)
✅ Price: {null/empty} ∪ {<0} ∪ {=0} ∪ {>0 integer} ∪ {float} ∪ {non-numeric} = all numeric input states — MECE
✅ Description: {empty/null} ∪ {1–1000 chars} ∪ {>1000 chars} ∪ {XSS payload} — MECE (XSS subset justified by G4)
✅ Image URL: {empty} ∪ {valid https://} ∪ {http:// only} ∪ {malformed} = all URL states — MECE
✅ Category ID: {valid existing int} ∪ {empty/null} ∪ {valid int, non-existent} ∪ {non-integer} = all states — MECE
✅ Product ID: {valid existing int} ∪ {valid int, non-existent} ∪ {non-integer} = all states — MECE
✅ All output types identified in Phase 1 have corresponding VALID OUTPUT or INVALID OUTPUT EC classes
```

---

### Open Issues for HITL

- [ ] **ISSUE-01 [Product Name — XSS class boundary]:** EC-FR15-011 (XSS payload) may overlap with EC-FR15-007 (1–255 chars valid string) if the payload is short. The split is justified by G4 because the expected *output behaviour* differs (safe-rendering check vs standard acceptance). Confirm this split is acceptable or if XSS should be treated as a sub-test within EC-FR15-007.

- [ ] **ISSUE-02 [Price — Float with zero decimal, e.g., `100.0`]:** A value like `100.0` is technically a float but equals an integer. Clarify: should `100.0` be treated as VALID (coerced to 100) or INVALID (as EC-FR15-015 — float)? HITL to verify system behaviour.

- [ ] **ISSUE-03 [Image URL — `http://` validity]:** EC-FR15-024 classifies `http://` as INVALID per AMB-02. Verify at the API level that the system actually rejects `http://` URLs and does not silently accept them.

- [ ] **ISSUE-04 [Description 1001-char boundary vs DB limit]:** The UI safety limit of 1000 chars is an AMB-01 interpretation. If the backend does not enforce this limit independently, a string of 1001+ chars accepted by the API would constitute a spec deviation. HITL to confirm whether backend also enforces a maximum.

---

### Self-Audit Checklist (AGENTS.md §7 — Domain Analysis Gate)

```
✅ All input AND output variables from Phase 1 are partitioned (21 inputs → 67 ECs; 16 outputs → covered by Groups J & K)
✅ At least 1 valid + all applicable invalid classes per variable
✅ All 4 EP guidelines applied and documented (G1: price, name, description; G2: role, category, image URL, outputs; G3: all must-be conditions; G4: token states, price sub-classes, XSS splits)
✅ Every class labelled with a unique EC ID (EC-FR15-001 through EC-FR15-067)
✅ Classes are mutually exclusive and collectively exhaustive (verified above)
✅ Every class traces to a requirement (FR-XX or SEC-XX)
```

---

### HITL Resolved Issues & Final Domain Alignment

- **RESOLVED-01 [Product Name — XSS Isolation]:** Maintained `EC-FR15-011` as a dedicated INVALID input partition. Even if short script payloads physically fit within the 1-255 length window, they trigger a distinct structural output behavior requiring HTML-escaping sanitization counters (`EC-FR15-065`), justifying the G4 split rule.
- **RESOLVED-02 [Price — Float Coercion Refusal]:** Inputs containing decimal parameters (including zero trailing nodes like `100.0`) are strictly declared INVALID under `EC-FR15-015`. The SUT operates on whole integer representations for Vietnamese currency (₫) to eliminate mutation rounding errors.
- **RESOLVED-03 [Image URL — Protocol Enforcement]:** Maintained `EC-FR15-024` as INVALID. Non-SSL unencrypted prefixes (`http://`) are rejected at the API middleware layer to secure system layout parameters, enforcing strict `https://` routing filters.
- **RESOLVED-04 [Description — Application Layer Clamping]:** Bound the application containment limit strictly at 1000 characters. Values reaching 1001+ characters (`EC-FR15-020`) must be intercepted and dropped by the Express backend layer to proactively insulate front-end web rendering grids from layout breakage.

---

**HITL Review:** [X] Accepted / [ ] Partially Accepted / [ ] Rejected — [Notes to be filled by HITL]
