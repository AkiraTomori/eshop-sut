# EShop Project — Comprehensive QA Engineering Master Report
**Methodology Baseline:** Domain Testing (Equivalence Partitioning) & Boundary Value Analysis (BVA)  
**Test Cycle:** HW02 Domain & Boundary Validation  
**Date:** June 18, 2026  
**Lead QA Engineer / Analyst:** Thái Minh Huy (Student ID: 23127379)  
**Environment Baseline:** macOS Tahoe 26.1 / Microsoft Edge Browser & Postman API Execution Layer  

---

## TABLE OF CONTENTS
1. EXECUTIVE METHODOLOGY OVERVIEW
2. POOL A — FR-06: PRODUCT DETAIL VIEW (WEB FRONTEND)
   - 2.1 Domain Analysis (Equivalence Partitioning)
   - 2.2 Boundary Value Analysis (BVA)
3. POOL B — FR-08: CHECKOUT (WEB FRONTEND)
   - 3.1 Domain Analysis (Equivalence Partitioning)
   - 3.2 Boundary Value Analysis (BVA)
4. POOL C — FR-15: PRODUCT MANAGEMENT (CRUD WEB ADMIN)
   - 4.1 Domain Analysis (Equivalence Partitioning)
   - 4.2 Boundary Value Analysis (BVA)
5. POOL D — FR-04: PERSONAL PROFILE MANAGEMENT (MOBILE APP)
   - 5.1 Domain Analysis (Equivalence Partitioning)
   - 5.2 Boundary Value Analysis (BVA)

---

## 1. EXECUTIVE METHODOLOGY OVERVIEW

This master specification report compiles the formal test design documentation executed over four critical pools of the EShop ecosystem. The objective is to apply mathematical partitioning models to establish strict security and validation firewalls across both client-side user interfaces and server-side backend API middlewares.

The core strategies applied are:
- **Equivalence Partitioning (EP):** Dividing input and output domains into mutually exclusive and collectively exhaustive (MECE) classes, utilizing four core guidelines:
  - **G1 (Range):** Applied to continuous numerical fields or string lengths.
  - **G2 (Discrete Set):** Applied to finite lists, token states, or enumerations.
  - **G3 (Must-Be Constraint):** Applied to format, structural, or mandatory constraints.
  - **G4 (Behavioral Split):** Isolating classes based on differing structural output reactions of the SUT.
- **Boundary Value Analysis (BVA):** Probing extreme data edge points. High-risk profiles (such as pricing and financial data mutations) are subjected to a rigorous **6-point model** (`LB-1, LB, LB+1, UB-1, UB, UB+1`) supplemented by type-coercion float probes, while medium-risk profiles utilize a robust **4-point model** (`LB, LB+1, UB-1, UB`).
- **Specification vs. System vs. Database Separation (BP-06):** Probing constraints independently across separate layers to uncover invisible validation drops where the client UI and the server-side persistence database mismatch.

---

## 2. POOL A — FR-06: PRODUCT DETAIL VIEW (WEB FRONTEND)

### 2.1 Domain Analysis (Equivalence Partitioning)

**Date:** 2026-06-13 10:04  
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)  
**Based on:** FR06-requirement-analysis.md (approved 2026-06-13)  
**Source Sections Referenced:**
- `eshop-srs.md` — FR-06 (§3), FR-07 (§4), FR-21–FR-24 (§8), SEC-02, SEC-04 (§9)
- `eshop-api-spec.md` — §3.2 (GET /api/products/:id), §4.2 (POST /api/cart)

#### Equivalence Class Table

##### A. Input Variable: `id` (URL Path Parameter — Product ID)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-001 | `id` (URL) | Valid existing product ID — positive integer matching a product in the database (e.g., `id=1`) | VALID | G1 + G3 | FR-06, API §3.2 |
| EC-FR06-002 | `id` (URL) | Valid positive integer but product does **not exist** in the database (e.g., `id=99999`) | INVALID | G4 (split from valid integer range — different system behaviour: 404 vs. display) | FR-06, API §3.2 |
| EC-FR06-003 | `id` (URL) | `id = 0` — zero value, not a valid product ID | INVALID | G1 (below LB of valid positive integer range) | FR-06 |
| EC-FR06-004 | `id` (URL) | Negative integer (e.g., `id=-1`) | INVALID | G1 (below LB) | FR-06 |
| EC-FR06-005 | `id` (URL) | Non-numeric value (e.g., `id=abc`, `id=@#$`) | INVALID | G3 (must-be: must be an integer) | FR-06 |
| EC-FR06-006 | `id` (URL) | Extremely large integer exceeding system limits (e.g., `id=99999999999999`) | INVALID | G1 (above practical UB) + G4 (may trigger different error vs. normal non-existent) | FR-06 |

##### B. Input Variable: `quantity` (UI Input Field)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-007 | `quantity` (UI) | Valid positive integer ≥ 1 (e.g., `quantity=1`, `quantity=5`, `quantity=100`) | VALID | G1 (range: 1 to no spec-defined UB) | FR-06 |
| EC-FR06-008 | `quantity` (UI) | Zero value (`quantity=0`) — below minimum of 1 | INVALID | G1 (below LB=1) | FR-06 |
| EC-FR06-009 | `quantity` (UI) | Negative integer (e.g., `quantity=-1`, `quantity=-5`) | INVALID | G1 (below LB=1) | FR-06 |
| EC-FR06-010 | `quantity` (UI) | Non-integer decimal value (e.g., `quantity=1.5`, `quantity=2.7`) | INVALID | G3 (must-be: must be an integer) | FR-06 |
| EC-FR06-011 | `quantity` (UI) | Non-numeric string (e.g., `quantity=abc`, `quantity=!@#`) — HITL confirmed UI improperly allows these, causing NaN in API | INVALID | G3 (must-be: must be a number) | FR-06 |
| EC-FR06-012 | `quantity` (UI) | Empty / blank value (user clears the field) | INVALID | G3 (must-be: mandatory, cannot be empty) | FR-06 |
| EC-FR06-013 | `quantity` (UI) | Extremely large integer (e.g., `quantity=999999999`) — no spec UB, test system/UI boundary | INVALID | G1 (system boundary above practical UB) | FR-06, BP-06 |

##### C. Input Variable: User Authentication State
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-014 | Auth State | User is **authenticated** — valid JWT Token present in `Authorization` header | VALID | G2 (discrete set: authenticated / not authenticated) | SEC-02 |
| EC-FR06-015 | Auth State | User is **not authenticated** — no JWT Token or invalid/expired token | INVALID | G2 | SEC-02 |

##### D. Input Variable: `POST /api/cart` Request Body (API-Level)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-016 | Cart body `id` | Product ID matches the viewed product and exists in DB | VALID | G3 (must-be: must match a valid product) | API §4.2 |
| EC-FR06-017 | Cart body `id` | Product ID does not exist in DB (e.g., tampered value) | INVALID | G3 | API §4.2 |
| EC-FR06-018 | Cart body `price` | Price matches the actual product price in DB (integer > 0) | VALID | G3 (must-be: positive number) | API §4.2 |
| EC-FR06-019 | Cart body `price` | Price is zero, negative, or tampered (e.g., `price=0`, `price=-1000`) | INVALID | G1 + G3 | API §4.2 |
| EC-FR06-020 | Cart body `quantity` | Positive integer ≥ 1 (mirrors UI quantity valid class) | VALID | G1 | FR-06, API §4.2 |
| EC-FR06-021 | Cart body `quantity` | Zero, negative, NaN, or non-integer (API receives invalid value from compromised frontend) | INVALID | G1 + G3 | FR-06, API §4.2 |

##### E. Output Variables — Product Detail Display
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-022 | Product Display | **Valid product detail display**: All 5 fields rendered correctly — Large Image (with non-empty `alt`), Name, Price (₫ + thousands separator), Description (escaped), Category | VALID OUTPUT | G3 | FR-06, FR-21, FR-24, SEC-04 |
| EC-FR06-023 | Product Display | **Error display — product not found**: Appropriate error/404 page when product ID does not exist | INVALID OUTPUT | G4 (split from display: different output for non-existent product) | FR-06 |

##### F. Output Variables — Add to Cart Feedback
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-024 | Add to Cart Response | **Success feedback**: Toast notification shown AND/OR cart badge quantity updates after successful add | VALID OUTPUT | G3 | FR-06, FR-24, FR-23 |
| EC-FR06-025 | Add to Cart Response | **Cart quantity increment**: Adding the same product increments existing quantity (no new row) | VALID OUTPUT | G4 (split: same-product add has different behaviour than first-time add) | FR-07 |
| EC-FR06-026 | Add to Cart Response | **Error — unauthenticated**: UI redirects to `/login` or shows descriptive error toast (per HITL resolution) | INVALID OUTPUT | G2 | SEC-02, FR-06 |
| EC-FR06-027 | Add to Cart Response | **Error — invalid quantity**: System rejects/prevents add-to-cart with invalid quantity (0, negative, NaN, decimal) | INVALID OUTPUT | G3 | FR-06 |

##### G. Output Variables — GUI / Navigation Requirements
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR06-028 | Breadcrumbs | Breadcrumb navigation is displayed on the Product Detail sub-page | VALID OUTPUT | G3 (must-be: breadcrumbs required on sub-pages) | FR-23 |
| EC-FR06-029 | Page `<h1>` | Exactly **one `<h1>` tag** present on the page, describing page content | VALID OUTPUT | G3 (must-be: exactly 1 `<h1>`) | FR-21 |
| EC-FR06-030 | Language | Entire interface displayed in Vietnamese (except standard technical terms) | VALID OUTPUT | G3 (must-be: Vietnamese) | FR-21 |
| EC-FR06-031 | Button Color | Add to Cart button uses **blue** colour (positive action) | VALID OUTPUT | G3 (must-be: blue for positive actions) | FR-21 |
| EC-FR06-032 | Tab Order | Focus order via Tab key follows top-to-bottom, left-to-right sequence | VALID OUTPUT | G3 (must-be: correct tab order) | FR-21 |
| EC-FR06-033 | Image `alt` | Product image has a **non-empty `alt` attribute** describing the image content | VALID OUTPUT | G3 (must-be: non-empty alt) | FR-24 |

#### Guideline Application Summary
- **G1 (Range):** Applied to URL Product ID, UI quantity, Cart body price, and Cart body quantity ranges.
- **G2 (Discrete Set):** Applied to user Auth states and discrete output feedback behaviors.
- **G3 (Must-Be Condition):** Enforced format specifications across all inputs and verified GUI elements (breadcrumbs, single h1, language, button color, tab order, non-empty alt text).
- **G4 (Split):** Split valid integer range from non-existent IDs based on 404 error output behaviors, and split same-product adds into a dedicated quantity increment output.

#### EC Summary Statistics
- Input: `id` (URL) — 1 Valid, 5 Invalid | Total: 6
- Input: `quantity` (UI) — 1 Valid, 6 Invalid | Total: 7
- Input: Auth State — 1 Valid, 1 Invalid | Total: 2
- Input: Cart API Body — 3 Valid, 3 Invalid | Total: 6
- Output: Product Display — 1 Valid, 1 Invalid | Total: 2
- Output: Add to Cart — 2 Valid, 2 Invalid | Total: 4
- Output: GUI/Navigation — 6 Valid, 0 Invalid | Total: 6
- **Grand Totals:** VALID: 15, INVALID: 18 | **Total Classes: 33**

---

### 2.2 Boundary Value Analysis (BVA)

**Date:** 2026-06-13 10:34  
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)  

#### Risk Level & BVA Depth Assignment
- **`id` (URL):** **Medium risk** — Data validation field. Triggers controlled 404 pages. No direct financial impact. Depth: **4-point** (`LB, LB+1, UB-1, UB`).
- **`quantity` (UI):** **High risk** — Multiplies cart totals. Directly affects transaction calculus. UI allows type="number" text overrides. Depth: **6-point** (`LB-1, LB, LB+1, UB-1, UB, UB+1`).
- **Cart body `price`:** **High risk** — Financial data structure. Crucial server security parameter. Backend validation must independently match DB. Depth: **6-point**.
- **Cart body `quantity`:** **High risk** — Financial calculation parameters. Controls data stream bypass. Depth: **6-point**.

#### BVA Tables

##### Variable A: `id` (URL Path Parameter) — Risk: Medium — 4-point BVA
| EC ID | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|:----:|:---------:|---------------|:-----:|:----------:|:-------------:|-------|
| EC-FR06-003 | `id` (URL) | Medium | 4-point | Specification | LB-1 | `0` | INVALID | Below minimum valid ID. SRS: FR-06 |
| EC-FR06-001 | `id` (URL) | Medium | 4-point | Specification | LB | `1` | VALID | Smallest valid product ID. SRS: FR-06 |
| EC-FR06-001 | `id` (URL) | Medium | 4-point | Specification | LB+1 | `2` | VALID | Second smallest valid ID. SRS: FR-06 |
| EC-FR06-001 | `id` (URL) | Medium | 4-point | Specification | Interior | `5` | VALID | Representative mid-range ID. SRS: FR-06 |
| EC-FR06-001 | `id` (URL) | Medium | 4-point | UI/System | Max existing | *Last product ID in DB* | VALID | Largest existing product key. SRS: FR-06 |
| EC-FR06-002 | `id` (URL) | Medium | 4-point | UI/System | Max existing+1 | *Last ID + 1* | INVALID | First non-existent ID above valid range. SRS: FR-06 |
| EC-FR06-004 | `id` (URL) | Medium | 4-point | Specification | Far below LB | `-1` | INVALID | Negative integer index. SRS: FR-06 |
| EC-FR06-006 | `id` (URL) | Medium | 4-point | Database | DB max | `9999999999999` | INVALID | Checks DB boundary limits. SRS: FR-06 |

##### Variable B: `quantity` (UI Input Field) — Risk: High — 6-point BVA
| EC ID | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|:----:|:---------:|---------------|:-----:|:----------:|:-------------:|-------|
| EC-FR06-008 | `quantity` (UI) | High | 6-point | Specification | LB-1 | `0` | INVALID | Below spec minimum (min 1). SRS: FR-06 |
| EC-FR06-007 | `quantity` (UI) | High | 6-point | Specification | LB | `1` | VALID | Exact lower bound. SRS: FR-06 |
| EC-FR06-007 | `quantity` (UI) | High | 6-point | Specification | LB+1 | `2` | VALID | One above lower bound. SRS: FR-06 |
| EC-FR06-007 | `quantity` (UI) | High | 6-point | Specification | Interior | `10` | VALID | Mid-range parameter. SRS: FR-06 |
| EC-FR06-009 | `quantity` (UI) | High | 6-point | Specification | Far below LB | `-1` | INVALID | Negative quantity value. SRS: FR-06 |
| EC-FR06-007 | `quantity` (UI) | High | 6-point | UI/System | Moderate high | `99` | VALID | Large typical order. BP-06 |
| EC-FR06-007 | `quantity` (UI) | High | 6-point | UI/System | Large | `100` | VALID | Round boundary test. BP-06 |
| EC-FR06-013 | `quantity` (UI) | High | 6-point | UI/System | Very large | `999` | INVALID* | System boundary 3-digit test. BP-06 |
| EC-FR06-013 | `quantity` (UI) | High | 6-point | UI/System | Extreme | `9999` | INVALID* | System boundary 4-digit test. BP-06 |
| EC-FR06-013 | `quantity` (UI) | High | 6-point | Database | DB practical limit | `999999999` | INVALID* | Tests calculation overflow vectors. BP-06 |

##### Variable C: Cart Body `price` (API-Level Validation) — Risk: High — 6-point BVA
| EC ID | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|:----:|:---------:|---------------|:-----:|:----------:|:-------------:|-------|
| EC-FR06-019 | Cart `price` | High | 6-point | Specification | LB-1 | `0` | INVALID | Zero price parameter. SRS: FR-15 |
| EC-FR06-018 | Cart `price` | High | 6-point | Specification | LB | `1` | VALID | Smallest valid financial index. SRS: FR-15 |
| EC-FR06-018 | Cart `price` | High | 6-point | Specification | LB+1 | `2` | VALID | One step above minimum. SRS: FR-15 |
| EC-FR06-018 | Cart `price` | High | 6-point | Specification | Interior | `100000` | VALID | Standard mid-range base price. SRS: FR-15 |
| EC-FR06-019 | Cart `price` | High | 6-point | Specification | Far below LB | `-1` | INVALID | Negative price check. SRS: FR-15 |
| EC-FR06-019 | Cart `price` | High | 6-point | Specification | Extreme negative | `-1000000` | INVALID | Integrity and math test target. SEC-02 |
| **EC-FR06-019** | **Cart `price`** | **High** | **6-point** | **API/Security** | **Tampered low** | **`1` (vs DB `100000`)** | **INVALID** | **Exploits missing verification firewall. SEC-02** |
| EC-FR06-018 | Cart `price` | High | 6-point | UI/System | Typical max | `99999999` | VALID | Upper operational range test. BP-06 |
| EC-FR06-018 | Cart `price` | High | 6-point | Database | DB max | `9223372036854775807` | VALID | SQLite Max Integer validation limits. BP-06 |

##### Variable D: Cart Body `quantity` (API-Level Request) — Risk: High — 6-point BVA
| EC ID | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|:----:|:---------:|---------------|:-----:|:----------:|:-------------:|-------|
| EC-FR06-021 | Cart `quantity` | High | 6-point | Specification | LB-1 | `0` | INVALID | Zero quantity directly via API. SRS: FR-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | Specification | LB | `1` | VALID | Minimum API-level parameter. SRS: FR-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | Specification | LB+1 | `2` | VALID | One step inside valid boundary. SRS: FR-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | Specification | Interior | `10` | VALID | Standard purchase quantity. SRS: FR-06 |
| EC-FR06-021 | Cart `quantity` | High | 6-point | Specification | Far below LB | `-1` | INVALID | Negative API parameters injection. SRS: FR-06 |
| EC-FR06-021 | Cart `quantity` | High | 6-point | API/System | NaN value | `NaN` | INVALID | Passes unvalidated field boundaries. FR-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | API/System | Large | `999999` | VALID | Large API stress vector testing. BP-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | Database | DB practical limit | `999999999` | VALID | Max mathematical stress baseline. BP-06 |

#### Boundary Type Coverage Summary & High-Value Findings
- **`id` (URL):** Consistency maintained across UI and DB layers. Non-existent integers are trapped correctly.
- **`quantity` (UI):** **CRITICAL MISMATCH.** While specification restricts inputs to integers ≥ 1, browser forms allow empty states, letters, and negative inputs. API validation fails to filter, permitting rác parameters into active baskets.
- **Cart `price` (API):** **CRITICAL SECURITY HOLE.** Backend lacks data lineage verification against database keys. Accepts client-controlled values blindly, facilitating complete transaction manipulation.
- **Cart `quantity` (API):** Server-side verification is missing. Extreme integer spikes are processed completely unvalidated, rendering arithmetic parameters vulnerable to overflow.

---

## 3. POOL B — FR-08: CHECKOUT (WEB FRONTEND)

### 3.1 Domain Analysis (Equivalence Partitioning)

**Date:** 2026-06-14 08:08 (revised 2026-06-15 — coupon content removed)  
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)  
**Based on:** FR08-requirement-analysis.md (revised 2026-06-15)

#### Equivalence Class Table

##### Group 1 — Authentication / Session (Input)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-001 | JWT Token | User is logged in — valid, non-expired JWT token present in `Authorization: Bearer <token>` header | VALID | G3 | FR-08, SEC-02 |
| EC-FR08-002 | JWT Token | User is NOT logged in — no JWT token supplied (unauthenticated request) | INVALID | G3 | FR-08, SEC-02 |
| EC-FR08-003 | JWT Token | JWT token is malformed / expired / tampered with — present but invalid | INVALID | G4 (split: server rejects token structurally vs. missing header) | SEC-02 |

##### Group 2 — Cart State (Input / Pre-condition)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-004 | Cart contents | Cart contains ≥ 1 item — checkout can proceed | VALID | G3 | FR-07, FR-08 |
| EC-FR08-005 | Cart contents | Cart is empty — 0 items; checkout must be blocked | INVALID | G3 | FR-07, FR-08 |

##### Group 3 — Shipping Address (Input)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-006 | `shipping_address` | Non-empty string, 1–255 characters — valid address provided | VALID | G1 | FR-08 |
| EC-FR08-007 | `shipping_address` | Empty string or whitespace-only — no meaningful address provided | INVALID | G1 (below lower bound) | FR-08 |
| EC-FR08-008 | `shipping_address` | String > 255 characters — exceeds UI safety baseline (stress boundary) | INVALID | G1 (above upper bound) | FR-08 (HITL baseline) |

##### Group 4 — `total_amount` Field in Checkout Request (Input — Security)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-009 | `total_amount` (body) | Value matches the actual server-computed cart total — sent correctly | VALID | G3 | FR-08 |
| EC-FR08-010 | `total_amount` (body) | Value is deliberately tampered — does NOT match server-computed total (e.g., sent as 1 ₫) | INVALID | G3 (Must-Be: backend must recalculate and ignore client value) | FR-08 |

##### Group 5 — Output Variables
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR08-011 | Order placement | Successful checkout — HTTP 200, order created with status `pending`, cart cleared | VALID OUTPUT | G3 | FR-08, FR-10 |
| EC-FR08-012 | Cart state after | Cart is cleared (0 items) immediately following successful checkout | VALID OUTPUT | G3 | FR-08 |
| EC-FR08-013 | Checkout rejected | HTTP 401 / redirect to login page | INVALID OUTPUT | G3 | FR-08, SEC-02 |
| EC-FR08-014 | Checkout rejected | Error shown; checkout blocked; cart page shown with empty-state message | INVALID OUTPUT | G3 | FR-07, FR-08 |
| EC-FR08-015 | Security: math recalculation | Order total in DB matches server-recalculated value regardless of what client sent | VALID OUTPUT | G3 | FR-08 |
| EC-FR08-016 | GUI — Breadcrumb | Breadcrumb trail visible on Checkout page (e.g., Trang chủ > Giỏ hàng > Thanh toán) | VALID OUTPUT | G3 | FR-23 |
| EC-FR08-017 | GUI — Single h1 | Exactly one `<h1>` tag rendered on the checkout page | VALID OUTPUT | G3 | FR-21 |
| EC-FR08-018 | GUI — Errors | Validation error messages appear **above** the submit button | VALID OUTPUT | G3 | FR-22 |
| EC-FR08-019 | GUI — Button Color | Checkout/submit button uses blue color (positive action) | VALID OUTPUT | G3 | FR-21 |
| EC-FR08-020 | GUI — Currency | Total amount displayed in ₫ with thousands-separator formatting | VALID OUTPUT | G3 | FR-21 |

#### EC Count Summary
- VALID Input/Pre-condition Classes: 4
- INVALID Input/Pre-condition Classes: 6
- VALID OUTPUT Classes: 8
- INVALID OUTPUT Classes: 2
- **Total Equivalence Classes: 20**

---

### 3.2 Boundary Value Analysis (BVA)

**Date:** 2026-06-14 09:36 (revised: 2026-06-15 — coupon content removed)  
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)  

#### Variable Screening & Risk Assignments
- **`shipping_address` (length):** **Medium risk** — Continuous string parameter containing characters [1, 255]. Eligible for a specialized **4-point BVA depth model** extended with UI-whitespace and DB stress allocations.
- Other fields (JWT Token structural configurations, empty cart metrics, and client-controlled totals) map exclusively to discrete sets or server-side math calculations, eliminating continuous numeric ranges.

#### BVA Table

##### Section A — `shipping_address` Character Length (EC-FR08-006, 007, 008)
| BV ID | EC Ref | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|--------|----------|------|-----------|--------------|-------|------------|:-------------:|-------|
| BV-FR08-001 | EC-FR08-006 | `shipping_address` | Medium | 4-point | Specification | LB (=1) | `"A"` (1 char) | **VALID** | Minimum non-empty spec ceiling. FR-08 |
| BV-FR08-002 | EC-FR08-006 | `shipping_address` | Medium | 4-point | Specification | LB+1 (=2) | `"AB"` (2 chars) | **VALID** | Lower bounding step test. FR-08 |
| BV-FR08-003 | EC-FR08-006 | `shipping_address` | Medium | 4-point | Specification | UB-1 (=254) | 254-char string | **VALID** | Upper boundary step line. FR-08 |
| BV-FR08-004 | EC-FR08-006 | `shipping_address` | Medium | 4-point | Specification | UB (=255) | 255-char string | **VALID** | Exact upper limit boundary baseline. FR-08 |
| BV-FR08-005 | EC-FR08-007 | `shipping_address` | Medium | 4-point | Specification | LB-1 (=0) | `""` (empty string) | **INVALID** | Empty values must trigger UI error blocks. FR-08 |
| BV-FR08-006 | EC-FR08-008 | `shipping_address` | Medium | 4-point | Specification | UB+1 (=256) | 256-char string | **INVALID** | First step breaking upper specification. FR-08 |
| BV-FR08-007 | EC-FR08-007 | `shipping_address` | Medium | 4-point | UI/System | System max | Whitespace `"   "` | **INVALID** | Logical space injection verification. FR-08 |
| BV-FR08-008 | EC-FR08-008 | `shipping_address` | Medium | 4-point | Database | DB stress | 1000-char string | **INVALID** | Probes SQLite text column boundaries. FR-08 |

#### Boundary Type Coverage Summary
The `shipping_address` parameter shows an structural verification gap. While the specification baseline assumes a maximum threshold of 255 characters, the underlying database uses the native SQLite TEXT format which is dynamically allocated and virtually unlimited. If the browser user interface lacks strict `maxlength="255"` attribute locks, overflow blocks pass unchecked directly down to the database layers.

---

## 4. POOL C — FR-15: PRODUCT MANAGEMENT (CRUD WEB ADMIN)

### 4.1 Domain Analysis (Equivalence Partitioning)

**Date:** 2026-06-15 18:04  
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)  
**Based on:** FR15-requirement-analysis.md (HITL-Accepted 2026-06-15)  

#### Equivalence Class Table

##### GROUP A — Authentication / Access Control
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-001 | JWT Token | Token is present, valid (not expired, not malformed), and carries `role = 'admin'` | VALID | G3 | FR-12, SEC-02, SEC-03 |
| EC-FR15-002 | JWT Token | Token is absent (no `Authorization` header sent) | INVALID | G3 | FR-12, SEC-02 |
| EC-FR15-003 | JWT Token | Token is present but malformed / structurally invalid (cannot be decoded) | INVALID | G4 (split: absent vs malformed are different failure modes) | FR-12, SEC-02 |
| EC-FR15-004 | JWT Token | Token is present and structurally valid but expired | INVALID | G4 (split: expired vs malformed) | FR-12, SEC-02 |
| EC-FR15-005 | Admin Role | `role = 'admin'` — admin privilege confirmed in token payload | VALID | G2 | FR-12, SEC-03 |
| EC-FR15-006 | Admin Role | `role = 'user'` — valid token but insufficient privilege (regular user) | INVALID | G2 | FR-12, SEC-03 |

##### GROUP B — Product Name (`name`)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-007 | Product Name | Non-empty string, 1–255 characters, no special structure required | VALID | G1 + G3 | FR-15 |
| EC-FR15-008 | Product Name | Empty string (`""`) or null — mandatory field is missing | INVALID | G3 | FR-15, FR-22 |
| EC-FR15-009 | Product Name | String of exactly 256 characters (one above the 255-char upper bound) | INVALID | G1 (UB+1) | FR-15 |
| EC-FR15-010 | Product Name | String exceeding 255 characters (e.g., 500 chars — well above upper bound) | INVALID | G1 | FR-15 |
| EC-FR15-011 | Product Name | String containing HTML/script injection payload (e.g., `<script>alert(1)</script>`) | INVALID | G4 (split: XSS script payload requiring encoding output) | SEC-04 |

##### GROUP C — Price (`price`)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-012 | Price | Positive integer value > 0 (e.g., 100000) | VALID | G1 + G3 | FR-15 |
| EC-FR15-013 | Price | Value = 0 (violates > 0 constraint; boundary case at lower forbidden value) | INVALID | G1 + G4 (split price=0 from price<0) | FR-15 |
| EC-FR15-014 | Price | Negative integer value (< 0) (e.g., -1, -500) | INVALID | G1 + G4 (split price<0 from price=0) | FR-15 |
| EC-FR15-015 | Price | Floating-point / decimal value (e.g., 99.5, 1000.99) — not a whole integer | INVALID | G3 + AMB-03 (floats invalid for ₫ currency) | FR-15 |
| EC-FR15-016 | Price | Non-numeric string (e.g., `"abc"`, `"price"`) | INVALID | G3 | FR-15 |
| EC-FR15-017 | Price | Empty / null / missing (mandatory field omitted) | INVALID | G3 | FR-15, FR-22 |

##### GROUP D — Description (`description`)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-018 | Description | Empty string (`""`) or omitted — field is optional; treated as null | VALID | G3 | FR-15 |
| EC-FR15-019 | Description | Non-empty string, 1–1000 characters (within UI safety boundary) | VALID | G1 + G3 | FR-15, AMB-01 |
| EC-FR15-020 | Description | String exceeding 1000 characters (beyond UI safety boundary) | INVALID | G1 (UB+1 of UI boundary) | FR-15, AMB-01 |
| EC-FR15-021 | Description | String containing HTML/script injection payload (e.g., `<img onerror=alert(1)>`) | INVALID | G4 (XSS sub-class requiring safe presentation) | SEC-04 |

##### GROUP E — Image URL (`imageUrl`)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-022 | Image URL | Empty string (`""`) or omitted — field is optional; valid null | VALID | G2 + AMB-02 | FR-15 |
| EC-FR15-023 | Image URL | Well-formed URL beginning with `https://` (e.g., `https://example.com/img.jpg`) | VALID | G2 + G3 + AMB-02 | FR-15 |
| EC-FR15-024 | Image URL | URL beginning with `http://` only (not `https://`) | INVALID | G3 + AMB-02 (enforces strict SSL protocols) | FR-15, AMB-02 |
| EC-FR15-025 | Image URL | Completely malformed / non-URL string (e.g., `"notaurl"`, `"ftp://..."`) | INVALID | G4 (split unencrypted protocol from raw string) | FR-15, AMB-02 |

##### GROUP F — Category (`category_id`)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-026 | Category ID | Valid positive integer referencing an existing category in the database | VALID | G2 + G3 | FR-15 |
| EC-FR15-027 | Category ID | Empty / null / not selected (mandatory field omitted) | INVALID | G3 | FR-15, FR-22 |
| EC-FR15-028 | Category ID | Integer value referencing a non-existent category | INVALID | G2 (not in valid set) | FR-15 |
| EC-FR15-029 | Category ID | Non-integer alphanumeric value (e.g., `"abc"`) sent directly to API | INVALID | G3 + AMB-04 (type mismatch handler) | FR-15, AMB-04 |

##### GROUP G — Product ID (`:id` path parameter — Edit & Delete)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-030 | Product ID (path) | Valid positive integer referencing an existing product in the database | VALID | G2 + G3 | FR-15, API §3.3 |
| EC-FR15-031 | Product ID (path) | Positive integer that does not reference any existing product | INVALID | G2 (non-existent ID index) | FR-15, AMB-05 |
| EC-FR15-032 | Product ID (path) | Non-integer value in the path (e.g., `/api/products/abc`) | INVALID | G3 (type validation path fault) | FR-15, API §3.3 |

##### GROUP H — Search Keyword (`?search=`)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-033 | Search Keyword | Empty / omitted — all products returned | VALID | G2 | FR-05 |
| EC-FR15-034 | Search Keyword | Non-empty keyword matching one or more product names | VALID | G2 + G3 | FR-05 |
| EC-FR15-035 | Search Keyword | Non-empty keyword matching no product names (no results) | VALID | G2 (empty layout output) | FR-05 |
| EC-FR15-036 | Search Keyword | HTML/script injection payload (e.g., `<script>alert(1)</script>`) | INVALID | G4 (XSS search sub-class) | SEC-04, FR-05 |

##### GROUP I — GUI / Form-Level Inputs
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR15-037 | Required indicator | All mandatory fields (Name, Price, Category) display `*` next to label | VALID | G3 | FR-22 |
| EC-FR15-038 | Required indicator | One or more mandatory fields missing the `*` indicator | INVALID | G3 | FR-22 |
| EC-FR15-039 | Message position | Error message rendered **above** the submit button | VALID | G3 | FR-22 |
| EC-FR15-040 | Message position | Error message rendered **below** the submit button or elsewhere | INVALID | G3 | FR-22 |
| EC-FR15-041 | Submit button | Submit / confirm action buttons use blue colour | VALID | G2 | FR-21 |
| EC-FR15-042 | Delete button | Delete / dangerous action buttons use red colour | VALID | G2 | FR-21 |
| EC-FR15-043 | Button color fault | Action buttons use wrong colour (e.g., delete button is blue) | INVALID | G2 | FR-21 |
| EC-FR15-044 | Page h1 tags | Page contains exactly one `<h1>` tag | VALID | G3 | FR-21 |
| EC-FR15-045 | Page h1 tags | Page contains zero or more than one `<h1>` tag | INVALID | G3 | FR-21 |
| EC-FR15-046 | Tab key focus | Tab key navigates fields from top-to-bottom, left-to-right | VALID | G3 | FR-21 |
| EC-FR15-047 | Tab key focus | Tab key skips a field or navigates in wrong order | INVALID | G3 | FR-21 |
| EC-FR15-048 | Deletion Prompt | Confirmation dialog appears before deletion; Cancel aborts the action | VALID | G3 + AMB-06 | FR-21, AMB-06 |
| EC-FR15-049 | Deletion Prompt | No confirmation dialog appears; deletion executes immediately without prompt | INVALID | G3 + AMB-06 | FR-21, AMB-06 |

##### GROUP J — Output Variables (Success Outputs)
- `EC-FR15-050` [Create]: HTTP 201 Created issued; success toast notification rendered.
- `EC-FR15-051` [Update]: HTTP 200 OK issued; database product fields update isolated from other rows.
- `EC-FR15-052` [Delete]: HTTP 200 OK issued; target instance removed completely from entity rows.
- `EC-FR15-053` [View List]: Table output maps Name, Price (₫ separated), Image, and Category with active loading spinners.
- `EC-FR15-054` [View Detail]: Full presentation layout loading all 5 core fields safely.

##### GROUP K — Output Variables (Error / Invalid Outputs)
- `EC-FR15-055` to `EC-FR15-062`: Individual HTTP 400/404 descriptive error structures triggered above buttons.
- `EC-FR15-063` [Auth 401]: Missing credentials trigger instant gateway drop.
- `EC-FR15-064` [Privilege 403]: Token role = 'user' dropped at admin endpoint routes.
- `EC-FR15-065` [Security plain-text]: Transmitted XSS injections are neutralized via HTML-escaping before display.
- `EC-FR15-066` [Isolation]: State mutation changes inside Product X leave row metrics inside Product Y pristine.
- `EC-FR15-067` [Cancel]: Aborting delete requests safely rolls back the database transaction.

#### HITL Resolved Issues & Final Domain Alignment
- **RESOLVED-01 [XSS Isolation]:** Isolated `EC-FR15-011` as an invalid partition because script characters change investing investment parameters, triggering separate sanitization output routines (`EC-FR15-065`).
- **RESOLVED-02 [Float Price Exclusion]:** Decimal quantities (including trailing zeros like `100.0`) are locked as INVALID under `EC-FR15-015` to protect whole integer VND (₫) arithmetic operations.
- **RESOLVED-03 [Protocol SSL Guard]:** Non-encrypted prefixes (`http://`) fail verification filters (`EC-FR15-024`) to enforce strict `https://` transport middleware.
- **RESOLVED-04 [Description Clamping]:** Enforced strict application containment limits at 1000 characters (`EC-FR15-020`) to block backend overflow strings from breaking UI layouts.

---

### 4.2 Boundary Value Analysis (BVA)

**Date:** 2026-06-15 19:19  
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)  

#### Risk Level & Depth Configurations
- **Product Name:** Medium Risk (4-point depth). Integer string bounds span [1, 255] characters. Extended with direct Postman networks bypass probes.
- **Price:** **High Risk** (6-point depth full model). Financial parameters mapping continuous values > 0. Supplemented with float boundary probe injection checks.
- **Description:** Medium Risk (4-point depth). Continuous safe boundary spans [0, 1000] characters. Extended with server independent clamping verification.
- **Product ID:** Medium Risk. Discrete increment key indices mapped across floor index 0 and non-existent ranges.

#### BVA Tables (Purified & Consolidated Matrix)

##### SECTION A — Product Name Boundary Tests
- **Spec Bounding Range:** [1, 255] Characters.
- **LB/LB+1 Probes:** `TC-FR15-BV-001` checks `name = "A"` (LB=1) and `name = "AB"` (LB+1=2) on forms. Expected: HTTP 201 Created. Actual: HTTP 200 OK. Status: **Failed**.
- **UB-1/UB Probes:** `TC-FR15-BV-002` checks `name = "A" × 254` (UB-1) and `name = "A" × 255` (UB). Expected: HTTP 201 Created. Actual: HTTP 200 OK. Status: **Failed**.
- **UB+1 / Integrated DB Leak Probe (HVF-01):** `TC-FR15-BV-003` transmits `name = "A" × 256` via Postman bypassing client form locks. Expected: HTTP 400 Bad Request. Actual: HTTP 200 OK. Database query confirms the unvalidated 256 characters enter SQLite storage unchecked. Status: **Failed**.

##### SECTION B — Price Boundary Tests
- **Spec Bounding Range:** Whole integers > 0.
- **LB-1 Negative Check:** `TC-FR15-BV-004` sends `price = -1` via Postman. Expected: HTTP 400. Actual: HTTP 200 OK. Negative price saved to database. Status: **Failed**.
- **Forbidden Lower Bound:** `TC-FR15-BV-005` sends `price = 0` via Postman (HVF-02 core probe). Expected: HTTP 400. Actual: HTTP 200 OK. Zero-priced entity created. Status: **Failed**.
- **LB/LB+1 Valid Probes:** `TC-FR15-BV-006` checks `price = 1` and `price = 2`. Expected: HTTP 201. Actual: HTTP 200 OK. Status: **Failed**.
- **High-Value UI Ceilings:** `TC-FR15-BV-007` checks `price = 999999998` and `price = 999999999`. Expected: Rendered with thousands splitters ("999,999,999 ₫"). Actual: Raw strings display thô ("999999999 đ"). Status: **Failed**.
- **10-Digit Operational Check:** `TC-FR15-BV-008` checks `price = 1000000000`. Expected: Formatted currency display. Actual: Prints raw unformatted integer. Status: **Failed**.
- **Float Below LB Check:** `TC-FR15-BV-009` transmits `price = 0.5`. Expected: HTTP 400 with validation message. Actual: HTTP 400 issued but body remains empty. Status: **Failed**.
- **Float Coercion Test:** `TC-FR15-BV-010` transmits `price = 1.0` (RESOLVED-02 check). Expected: HTTP 400 Bad Request. Actual: HTTP 200 OK. Backend coerces decimal to 1, breaking whole integer types. Status: **Failed**.

##### SECTION C — Description Boundary Tests
- **UI Safety Bound:** [0, 1000] Characters.
- **LB/LB+1 Valid Probes:** `TC-FR15-BV-011` checks `desc = ""` (0 chars) and `desc = "A"` (1 char). Expected: HTTP 201. Actual: HTTP 200 OK. Status: **Failed**.
- **UB-1/UB Valid Probes:** `TC-FR15-BV-012` checks `desc = "A" × 999` and `desc = "A" × 1000`. Expected: HTTP 201. Actual: HTTP 200 OK. Status: **Failed**.
- **UB+1 DB Bypass Check (HVF-03):** `TC-FR15-BV-013` injects `desc = "C" × 1001` via Postman directly to API. Expected: HTTP 400 Bad Request. Actual: HTTP 200 OK. SQLite text field accepts the oversized string, breaking application safety boundaries. Status: **Failed**.

##### SECTION D — Product ID Path Parameter Boundary Tests
- **auto-increment Floor checks:** - `TC-FR15-BV-014` executes `GET /api/products/1` (Valid) and `PUT /api/products/[max+1]` (Invalid non-existent). Expected: 404 Not Found. Actual: HTTP 200 OK returning empty brackets `{}`. Status: **Failed**.
  - `TC-FR15-BV-015` executes `DELETE /api/products/abc` (String parameter type fault) and `GET /api/products/0` (Index below floor). Expected for 'abc': HTTP 400. Actual: HTTP 200 OK ("Product deleted"). Status: **Failed**.

---

## 5. POOL D — FR-04: PERSONAL PROFILE MANAGEMENT (MOBILE APP)

### 5.1 Domain Analysis (Equivalence Partitioning)

**Date:** 2026-06-14 21:57  
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)  
**Based on:** FR04-requirement-analysis.md (approved 2026-06-14)  

#### Equivalence Class Table

##### Variable Category 1 — Authentication / Session (Input)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR04-001 | JWT Token | Valid JWT token present in `Authorization: Bearer <token>` header; token is active and not expired | VALID | G3 | FR-04, SEC-02 |
| EC-FR04-002 | JWT Token | No Authorization header provided (request sent without token) | INVALID | G3 | FR-04, SEC-02 |
| EC-FR04-003 | JWT Token | Authorization header present but token is malformed / structurally invalid (not a JWT) | INVALID | G3 | FR-04, SEC-02 |
| EC-FR04-004 | JWT Token | Authorization header present but token is expired (past expiry time) | INVALID | G4 (split: expired token distinguished from malformed token) | FR-04, SEC-02 |

##### Variable Category 2 — Full Name (`name`)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR04-005 | Full Name | Non-empty string; length 1–255 characters; contains valid characters (letters, spaces, Unicode/Vietnamese diacritics) | VALID | G1 + G3 | FR-04, FR-01 |
| EC-FR04-006 | Full Name | Empty string `""` (length = 0) | INVALID | G1 / G3 | FR-04, FR-01 |
| EC-FR04-007 | Full Name | Length > 255 characters (exceeds assumed DB column maximum) | INVALID | G1 | FR-04 |
| EC-FR04-008 | Full Name | Field omitted entirely from PUT request body (null / missing key) | INVALID | G3 | FR-04 |

##### Variable Category 3 — Phone Number (`phone`)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR04-009 | Phone Number | Field is omitted or left empty — phone update not submitted (optional field skipped) | VALID | G2 (optional field) | FR-04 |
| EC-FR04-010 | Phone Number | Phone provided AND starts with digit `0` | VALID | G3 | FR-04 |
| EC-FR04-011 | Phone Number | Phone provided AND does NOT start with `0` (e.g., starts with `1`–`9`, `+`, or letter) | INVALID | G3 | FR-04 |
| EC-FR04-012 | Phone Number | Phone provided, starts with `0`, length exactly 10 digits | VALID | G1 | FR-04 |
| EC-FR04-013 | Phone Number | Phone provided, starts with `0`, length exactly 11 digits | VALID | G1 | FR-04 |
| EC-FR04-014 | Phone Number | Phone provided, starts with `0`, length < 10 digits (e.g., 9 digits) | INVALID | G1 | FR-04 |
| EC-FR04-015 | Phone Number | Phone provided, starts with `0`, length > 11 digits (e.g., 12 digits) | INVALID | G1 | FR-04 |
| EC-FR04-016 | Phone Number | Phone provided, starts with `0`, correct length, contains ONLY numeric digits (0–9) | VALID | G3 | FR-04 |
| EC-FR04-017 | Phone Number | Phone provided, starts with `0`, correct length, but contains non-numeric characters | INVALID | G3 | FR-04 |

##### Variable Category 4 — Shipping Address (`shipping_address`)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR04-018 | Shipping Address | Field omitted or empty string — address update not submitted (optional field skipped) | VALID | G3 | FR-04 |
| EC-FR04-019 | Shipping Address | Non-empty string, length 1–255 characters (typical valid address) | VALID | G1 + G3 | FR-04 |
| EC-FR04-020 | Shipping Address | Non-empty string, length > 255 characters | INVALID | G1 | FR-04 |

##### Variable Category 5 — Email (Read-Only Safety)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR04-021 | Email | Email field not included in PUT request body (correct behaviour — read-only respected) | VALID | G2 | FR-04 |
| EC-FR04-022 | Email | Email field included in PUT request body in an attempt to change the email address | INVALID | G2 | FR-04 |

##### Variable Category 6 — Role (Security Firewall)
| EC ID | Variable | Equivalence Class Description | Type | EP Guideline | Source Req. ID |
|-------|----------|-------------------------------|------|-------------|----------------|
| EC-FR04-023 | Role | `role` field absent from PUT request body (standard, expected behaviour) | VALID | G2 | FR-04, SEC-06 |
| EC-FR04-024 | Role | `role` field included in PUT request body with an elevated value (e.g., `"admin"`) | INVALID | G2 | FR-04, SEC-06 |

##### Variable Category 7 — Outputs & Presentation Enforcements
- `EC-FR04-025` / `026`: Profile metrics commit successfully to database; fields re-render immediately without stale layouts.
- `EC-FR04-027` [401 Error]: Invalid sessions throw formal unauthorized responses.
- `EC-FR04-028` [Phone Format Error]: UI alerts specify prefix and [10, 11] parameters.
- `EC-FR04-029` [Email Input]: UI rendering layout forces input element to remain disabled/read-only at all times.
- `EC-FR04-030` [Role Element]: Component layout fully drops role field items from mobile forms.
- `EC-FR04-031` [Pre-population]: Form entry fires GET requests to fill fields smoothly.
- `EC-FR04-032` [Escalation Firewall]: Backend ignores injected payload role mutations silently, preserving SEC-06.

---

### 5.2 Boundary Value Analysis (BVA)

**Date:** 2026-06-14 22:08  
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)  

#### Variable Screening & Depth Strategy
- **Full Name Length:** Medium Risk (4-point depth on range [1, 255]).
- **Phone Number Length:** Medium Risk (Narrow range constraints spanning exactly [10, 11] digits). Standard BVA collapses structurally (`LB-1=9, LB=10, UB=11, UB+1=12`). Both endpoints are distinct valid specification values requiring dedicated passing test cases.
- **Shipping Address Length:** Medium Risk (4-point depth on range [1, 255]). Empty values (LB-1=0) map safely to optional class skip configurations.

#### BVA Tables

##### Field 1: Full Name Character Length Bounds
| EC ID | Variable | Risk Level | BVA Depth | Boundary Type | Point | Test Value | Sample Value | Valid/Invalid | Notes |
|-------|----------|:----------:|:---------:|--------------|:-----:|:-----------------:|-------------|:-------------:|-------|
| EC-FR04-006 | Full Name | Medium | 4-point | Specification | LB-1 | 0 | `""` | **INVALID** | Mandatory emptiness check. FR-01 |
| EC-FR04-005 | Full Name | Medium | 4-point | Specification | LB | 1 | `"A"` | **VALID** | Minimum character length. FR-04 |
| EC-FR04-005 | Full Name | Medium | 4-point | Specification | LB+1 | 2 | `"An"` | **VALID** | Lower stepping line. FR-04 |
| EC-FR04-005 | Full Name | Medium | 4-point | Specification | UB-1 | 254 | 254-char string | **VALID** | Upper stepping line. FR-04 |
| EC-FR04-005 | Full Name | Medium | 4-point | Specification | UB | 255 | 255-char string | **VALID** | Max baseline threshold. FR-04 |
| EC-FR04-007 | Full Name | Medium | 4-point | Specification | UB+1 | 256 | 256-char string | **INVALID** | Breaks upper constraint bounds. FR-04 |
| EC-FR04-005 | Full Name | Medium | Representative | UI/System | UI min | `""` (attempt) | `""` | **INVALID** | Form required asterisk check. FR-22 |
| EC-FR04-007 | Full Name | Medium | Representative | Database | DB ceiling | 1000 chars | 1000-char string | **INVALID** | Backend verification check. FR-04 |

##### Field 2: Phone Number Digit Length Bounds (Narrow Range Collapse Model)
| EC ID | Variable | Risk Level | BVA Depth | Boundary Type | Point | Test Value | Sample Value | Valid/Invalid | Notes |
|-------|----------|:----------:|:---------:|--------------|:-----:|:------------------:|--------------------|:-------------:|-------|
| EC-FR04-014 | Phone length | Medium | 4-point | Specification | LB-1 | 9 digits | `"012345678"` | **INVALID** | Too short; begins with 0. FR-04 |
| EC-FR04-012 | Phone length | Medium | 4-point | Specification | LB | 10 digits | `"0123456789"` | **VALID** | Exact lower valid bound. FR-04 |
| EC-FR04-013 | Phone length | Medium | 4-point | Specification | UB | 11 digits | `"01234567890"` | **VALID** | Exact upper valid bound. FR-04 |
| EC-FR04-015 | Phone length | Medium | 4-point | Specification | UB+1 | 12 digits | `"012345678901"` | **INVALID** | Too long; begins with 0. FR-04 |
| EC-FR04-014 | Phone length | Medium | Representative | UI/System | UI min | 1 digit | `"0"` | **INVALID** | Checks form alert triggers. FR-04 |
| EC-FR04-015 | Phone length | Medium | Representative | UI/System | UI max | 15 digits | `"012345678901234"` | **INVALID** | Verifies UI input layout constraints. |

##### Field 3: Shipping Address Character Length Bounds
| EC ID | Variable | Risk Level | BVA Depth | Boundary Type | Point | Test Value | Sample Value | Valid/Invalid | Notes |
|-------|----------|:----------:|:---------:|--------------|:-----:|:-----------------:|-------------|:-------------:|-------|
| EC-FR04-018 | Shipping address | Medium | 4-point | Specification | LB-1 | 0 | `""` | **VALID** | Empty address represents optional skip. |
| EC-FR04-019 | Shipping address | Medium | 4-point | Specification | LB | 1 | `"A"` | **VALID** | Minimum non-empty character node. |
| EC-FR04-019 | Shipping address | Medium | 4-point | Specification | LB+1 | 2 | `"AB"` | **VALID** | Step value inside lower bound. |
| EC-FR04-019 | Shipping address | Medium | 4-point | Specification | UB-1 | 254 | 254-char string | **VALID** | Step value inside upper bound. |
| EC-FR04-019 | Shipping address | Medium | 4-point | Specification | UB | 255 | 255-char string | **VALID** | Max assumed upper bound line. |
| EC-FR04-020 | Shipping address | Medium | 4-point | Specification | UB+1 | 256 | 256-char string | **INVALID** | Exceeds upper limit threshold. |
| EC-FR04-020 | Shipping address | Medium | Representative | Database | DB stress | 1000 chars | 1000-char string | **INVALID** | Postman direct network stress probe. |

---
**End of Master Report.**