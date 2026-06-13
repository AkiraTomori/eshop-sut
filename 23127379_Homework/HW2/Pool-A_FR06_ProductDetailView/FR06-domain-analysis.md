## Domain Analysis (Equivalence Partitioning) — FR-06: View Product Details
**Date:** 2026-06-13 10:04
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR06-requirement-analysis.md (approved 2026-06-13)

### Source Sections Referenced
- `eshop-srs.md` — FR-06 (§3), FR-07 (§4), FR-21–FR-24 (§8), SEC-02, SEC-04 (§9)
- `eshop-api-spec.md` — §3.2 (GET /api/products/:id), §4.2 (POST /api/cart)
- `theory-domain-testing.md` — §5 (EP types), §6 (4 EP Guidelines), §11 (BP-01 through BP-04)
- HITL ambiguity resolutions from Phase 1 AI-Audit (2026-06-13)

---

### Equivalence Class Table

#### A. Input Variable: `id` (URL Path Parameter — Product ID)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-001 | `id` (URL) | Valid existing product ID — positive integer matching a product in the database (e.g., `id=1`) | VALID | G1 + G3 | FR-06, API §3.2 |
| EC-FR06-002 | `id` (URL) | Valid positive integer but product does **not exist** in the database (e.g., `id=99999`) | INVALID | G4 (split from valid integer range — different system behaviour: 404 vs. display) | FR-06, API §3.2 |
| EC-FR06-003 | `id` (URL) | `id = 0` — zero value, not a valid product ID | INVALID | G1 (below LB of valid positive integer range) | FR-06 |
| EC-FR06-004 | `id` (URL) | Negative integer (e.g., `id=-1`) | INVALID | G1 (below LB) | FR-06 |
| EC-FR06-005 | `id` (URL) | Non-numeric value (e.g., `id=abc`, `id=@#$`) | INVALID | G3 (must-be: must be an integer) | FR-06 |
| EC-FR06-006 | `id` (URL) | Extremely large integer exceeding system limits (e.g., `id=99999999999999`) | INVALID | G1 (above practical UB) + G4 (may trigger different error vs. normal non-existent) | FR-06 |

#### B. Input Variable: `quantity` (UI Input Field)

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-007 | `quantity` (UI) | Valid positive integer ≥ 1 (e.g., `quantity=1`, `quantity=5`, `quantity=100`) | VALID | G1 (range: 1 to no spec-defined UB) | FR-06 |
| EC-FR06-008 | `quantity` (UI) | Zero value (`quantity=0`) — below minimum of 1 | INVALID | G1 (below LB=1) | FR-06 |
| EC-FR06-009 | `quantity` (UI) | Negative integer (e.g., `quantity=-1`, `quantity=-5`) | INVALID | G1 (below LB=1) | FR-06 |
| EC-FR06-010 | `quantity` (UI) | Non-integer decimal value (e.g., `quantity=1.5`, `quantity=2.7`) | INVALID | G3 (must-be: must be an integer) | FR-06 |
| EC-FR06-011 | `quantity` (UI) | Non-numeric string (e.g., `quantity=abc`, `quantity=!@#`) — HITL confirmed UI improperly allows these, causing NaN in API | INVALID | G3 (must-be: must be a number) | FR-06 |
| EC-FR06-012 | `quantity` (UI) | Empty / blank value (user clears the field) | INVALID | G3 (must-be: mandatory, cannot be empty) | FR-06 |
| EC-FR06-013 | `quantity` (UI) | Extremely large integer (e.g., `quantity=999999999`) — no spec UB, test system/UI boundary | INVALID | G1 (system boundary above practical UB) | FR-06, BP-06 |

#### C. Input Variable: User Authentication State

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-014 | Auth State | User is **authenticated** — valid JWT Token present in `Authorization` header | VALID | G2 (discrete set: authenticated / not authenticated) | SEC-02 |
| EC-FR06-015 | Auth State | User is **not authenticated** — no JWT Token or invalid/expired token | INVALID | G2 | SEC-02 |

#### D. Input Variable: `POST /api/cart` Request Body (API-Level)

> Note: Variables #3–#6 from Phase 1 (cart request body fields `id`, `name`, `price`, `quantity`) are sent by the frontend based on displayed product data and user input. The primary user-facing input is the `quantity` field (already partitioned above). The following cover **API-level** manipulation scenarios.

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-016 | Cart body `id` | Product ID matches the viewed product and exists in DB | VALID | G3 (must-be: must match a valid product) | API §4.2 |
| EC-FR06-017 | Cart body `id` | Product ID does not exist in DB (e.g., tampered value) | INVALID | G3 | API §4.2 |
| EC-FR06-018 | Cart body `price` | Price matches the actual product price in DB (integer > 0) | VALID | G3 (must-be: positive number) | API §4.2 |
| EC-FR06-019 | Cart body `price` | Price is zero, negative, or tampered (e.g., `price=0`, `price=-1000`) | INVALID | G1 + G3 | API §4.2 |
| EC-FR06-020 | Cart body `quantity` | Positive integer ≥ 1 (mirrors UI quantity valid class) | VALID | G1 | FR-06, API §4.2 |
| EC-FR06-021 | Cart body `quantity` | Zero, negative, NaN, or non-integer (API receives invalid value from compromised frontend) | INVALID | G1 + G3 | FR-06, API §4.2 |

#### E. Output Variables — Product Detail Display

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-022 | Product Display | **Valid product detail display**: All 5 fields rendered correctly — Large Image (with non-empty `alt`), Name, Price (₫ + thousands separator), Description (escaped), Category | VALID OUTPUT | G3 | FR-06, FR-21, FR-24, SEC-04 |
| EC-FR06-023 | Product Display | **Error display — product not found**: Appropriate error/404 page when product ID does not exist | INVALID OUTPUT | G4 (split from display: different output for non-existent product) | FR-06 |

#### F. Output Variables — Add to Cart Feedback

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-024 | Add to Cart Response | **Success feedback**: Toast notification shown AND/OR cart badge quantity updates after successful add | VALID OUTPUT | G3 | FR-06, FR-24, FR-23 |
| EC-FR06-025 | Add to Cart Response | **Cart quantity increment**: Adding the same product increments existing quantity (no new row) | VALID OUTPUT | G4 (split: same-product add has different behaviour than first-time add) | FR-07 |
| EC-FR06-026 | Add to Cart Response | **Error — unauthenticated**: UI redirects to `/login` or shows descriptive error toast (per HITL resolution) | INVALID OUTPUT | G2 | SEC-02, FR-06 |
| EC-FR06-027 | Add to Cart Response | **Error — invalid quantity**: System rejects/prevents add-to-cart with invalid quantity (0, negative, NaN, decimal) | INVALID OUTPUT | G3 | FR-06 |

#### G. Output Variables — GUI / Navigation Requirements

| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-028 | Breadcrumbs | Breadcrumb navigation is displayed on the Product Detail sub-page | VALID OUTPUT | G3 (must-be: breadcrumbs required on sub-pages) | FR-23 |
| EC-FR06-029 | Page `<h1>` | Exactly **one `<h1>` tag** present on the page, describing page content | VALID OUTPUT | G3 (must-be: exactly 1 `<h1>`) | FR-21 |
| EC-FR06-030 | Language | Entire interface displayed in English (except standard technical terms) | VALID OUTPUT | G3 (must-be: English) | FR-21 |
| EC-FR06-031 | Button Color | Add to Cart button uses **blue** colour (positive action) | VALID OUTPUT | G3 (must-be: blue for positive actions) | FR-21 |
| EC-FR06-032 | Tab Order | Focus order via Tab key follows top-to-bottom, left-to-right sequence | VALID OUTPUT | G3 (must-be: correct tab order) | FR-21 |
| EC-FR06-033 | Image `alt` | Product image has a **non-empty `alt` attribute** describing the image content | VALID OUTPUT | G3 (must-be: non-empty alt) | FR-24 |

---

### Guideline Application Summary

| Variable | G1 (Range) | G2 (Discrete Set) | G3 (Must-Be) | G4 (Split) | Notes |
|----------|:----------:|:------------------:|:-------------:|:----------:|-------|
| `id` (URL) | ✓ | | ✓ | ✓ | Range: positive integers. G3: must be integer. G4: existing vs. non-existent ID have different outputs |
| `quantity` (UI) | ✓ | | ✓ | | Range: LB=1, no spec UB. G3: must be integer, must be non-empty |
| Auth State | | ✓ | | | Discrete set: {authenticated, not authenticated} |
| Cart body `id` | | | ✓ | | Must match existing product |
| Cart body `price` | ✓ | | ✓ | | Must be positive; G3: must match actual price |
| Cart body `quantity` | ✓ | | ✓ | | Range: LB=1; G3: must be integer |
| Product Display | | | ✓ | ✓ | G3: must render all 5 fields correctly. G4: split valid display vs. not-found error |
| Add to Cart Response | | ✓ | ✓ | ✓ | G2: auth vs. unauth. G3: must show feedback. G4: first add vs. increment |
| GUI Elements | | | ✓ | | G3 applied to each GUI requirement (breadcrumbs, h1, language, colour, tab order, alt) |

---

### EC Summary Statistics

| Category | VALID | INVALID | Total |
|----------|:-----:|:-------:|:-----:|
| Input: `id` (URL) | 1 | 5 | 6 |
| Input: `quantity` (UI) | 1 | 6 | 7 |
| Input: Auth State | 1 | 1 | 2 |
| Input: Cart API body | 3 | 3 | 6 |
| Output: Product Display | 1 | 1 | 2 |
| Output: Add to Cart | 2 | 2 | 4 |
| Output: GUI/Navigation | 6 | 0 | 6 |
| **Total** | **15** | **18** | **33** |

---

### Mutual Exclusivity & Exhaustiveness Verification

```
[x] No value can belong to two classes simultaneously (mutually exclusive)
    — id: 0 ∈ EC-003 only; negative ∈ EC-004 only; non-numeric ∈ EC-005 only; no overlap
    — quantity: 0 ∈ EC-008; negative ∈ EC-009; decimal ∈ EC-010; string ∈ EC-011; empty ∈ EC-012; no overlap
[x] Every possible input value falls into exactly one class (collectively exhaustive)
    — id covers: valid existing, valid non-existent, 0, negative, non-numeric, extremely large
    — quantity covers: valid (≥1 integer), 0, negative, decimal, non-numeric, empty, extremely large
    — auth covers: authenticated, not authenticated
[x] Every INVALID class is distinct — no two INVALID classes cover the same input range
```

---

### Self-Audit (AGENTS.md §7 — Domain Analysis Gate)

```
[x] All input AND output variables from Phase 1 are partitioned
[x] At least 1 valid + all applicable invalid classes per variable
[x] All 4 EP guidelines applied and documented (see Guideline Application Summary)
[x] Every class labelled with a unique EC ID (EC-FR06-001 through EC-FR06-033)
[x] Classes are mutually exclusive and collectively exhaustive (verified above)
[x] Every class traces to a requirement (FR-XX or SEC-XX)
```

---

### Open Issues for HITL

- [ ] **EC-FR06-013 (quantity extremely large):** Classified as INVALID based on system/UI boundary testing (BP-06). HITL should confirm whether there is any practical upper limit observed in the SUT (e.g., cart total overflow, database integer limit). If the SUT accepts 999999999 without error, this may need reclassification or the boundary moved.
- [ ] **EC-FR06-025 (cart quantity increment):** This is classified as a separate VALID OUTPUT from EC-FR06-024 (first-time add success) per G4 split, because FR-07 specifies different system behaviour (increment vs. new row). HITL should confirm this split is appropriate.
- [ ] **EC-FR06-019 (tampered price):** The SRS does not explicitly state whether the backend validates the price sent in `POST /api/cart` against the actual database price. If the backend blindly trusts the client-sent price, this is a security concern. HITL should test and document.

---

**HITL Review:** Accepted
