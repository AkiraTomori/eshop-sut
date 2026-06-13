## Boundary Value Analysis — FR-06: View Product Details
**Date:** 2026-06-13 10:34
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR06-domain-analysis.md (approved 2026-06-13)

### Source Sections Referenced
- `eshop-srs.md` — FR-06 (quantity: positive integer, min 1), FR-15 (price > 0)
- `eshop-api-spec.md` — §3.2 (GET /api/products/:id), §4.2 (POST /api/cart body)
- `theory-domain-testing.md` — §8 (BVA 9-point model), §11 (BP-05 risk-based BVA, BP-06 spec vs. system vs. DB boundaries)
- HITL Phase 2 resolutions: quantity no spec UB, price is integer, backend trusts client price

---

### EC Eligibility for BVA

| EC Range | Variable | Ordered/Numeric? | BVA Required? | Reason |
|----------|----------|:-----------------:|:-------------:|--------|
| EC-FR06-001 to 006 | `id` (URL) | Yes (integer) | ✓ | Positive integer range with spec LB=1 |
| EC-FR06-007 to 013 | `quantity` (UI) | Yes (integer) | ✓ | Range LB=1, no spec UB — test system boundaries |
| EC-FR06-014, 015 | Auth State | No (discrete) | ✗ | Boolean/discrete — representative only |
| EC-FR06-016, 017 | Cart body `id` | No (discrete match) | ✗ | Valid/invalid match — not ordered |
| EC-FR06-018, 019 | Cart body `price` | Yes (integer > 0) | ✓ | Financial field — high risk |
| EC-FR06-020, 021 | Cart body `quantity` | Yes (integer ≥ 1) | ✓ | Mirrors UI quantity at API level |
| EC-FR06-022 to 033 | Output variables | No (non-numeric) | ✗ | Observational outputs — no ordered boundary |

---

### Risk Level Assignment

| Variable | Risk Level | Justification | BVA Depth |
|----------|:----------:|---------------|:---------:|
| `id` (URL) | **Medium** | Data validation field — non-existent IDs trigger error pages; no financial impact | 4-point (`LB, LB+1, UB-1, UB`) |
| `quantity` (UI) | **High** | Directly affects cart total (financial calculation); HITL confirmed no input validation → NaN reaches backend | 6-point (`LB-1, LB, LB+1, UB-1, UB, UB+1`) |
| Cart body `price` | **High** | Financial field; HITL confirmed backend blindly trusts client-sent price — critical security concern | 6-point |
| Cart body `quantity` | **High** | Financial impact (order total); API-level bypass of UI constraints | 6-point |

> **Source:** `theory-domain-testing.md BP-05, BP-08` — High risk for financial/security fields, Medium for data validation.

---

### BVA Table

#### A. Variable: `id` (URL Path Parameter) — Risk: Medium — 4-point BVA

**Specification boundary:** `id` must be a positive integer (LB=1). No UB defined in SRS — product IDs are auto-incremented DB keys.

| EC ID | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|:----:|:---------:|---------------|:-----:|:----------:|:-------------:|-------|
| EC-FR06-003 | `id` (URL) | Medium | 4-point | Specification | LB-1 | `0` | INVALID | Below minimum valid ID; id=0 is not a valid product. SRS: FR-06 |
| EC-FR06-001 | `id` (URL) | Medium | 4-point | Specification | LB | `1` | VALID | Smallest valid product ID (assuming DB auto-increment starts at 1). SRS: FR-06 |
| EC-FR06-001 | `id` (URL) | Medium | 4-point | Specification | LB+1 | `2` | VALID | Second smallest valid ID. SRS: FR-06 |
| EC-FR06-001 | `id` (URL) | Medium | 4-point | Specification | Interior | `5` | VALID | Representative mid-range product ID. SRS: FR-06 |
| EC-FR06-001 | `id` (URL) | Medium | 4-point | UI/System | Max existing | _Last product ID in DB_ | VALID | Largest existing product ID — determine at test time. SRS: FR-06 |
| EC-FR06-002 | `id` (URL) | Medium | 4-point | UI/System | Max existing + 1 | _Last ID + 1_ | INVALID | First non-existent ID above valid range. SRS: FR-06 |
| EC-FR06-004 | `id` (URL) | Medium | 4-point | Specification | Far below LB | `-1` | INVALID | Negative ID. SRS: FR-06 |
| EC-FR06-006 | `id` (URL) | Medium | 4-point | Database | DB max | `9999999999999` | INVALID | Exceeds SQLite INTEGER max (2^63-1 = 9223372036854775807); tests DB boundary. SRS: FR-06 |

---

#### B. Variable: `quantity` (UI Input Field) — Risk: High — 6-point BVA

**Specification boundary:** LB=1 (SRS FR-06: "minimum value of 1"). No UB defined in SRS.
**System/UI boundary:** HITL confirmed numeric `<input>` with no `max` attribute — SUT doesn't restrict large numbers.
**Database boundary:** SQLite INTEGER can hold up to 2^63-1, but practical limit depends on cart total calculations.

##### B.1 Specification Boundaries (LB = 1, UB = not defined)

| EC ID | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|:----:|:---------:|---------------|:-----:|:----------:|:-------------:|-------|
| EC-FR06-008 | `quantity` (UI) | High | 6-point | Specification | LB-1 | `0` | INVALID | One below spec minimum. SRS: FR-06 "minimum value of 1" |
| EC-FR06-007 | `quantity` (UI) | High | 6-point | Specification | LB | `1` | VALID | Exact spec lower bound. SRS: FR-06 |
| EC-FR06-007 | `quantity` (UI) | High | 6-point | Specification | LB+1 | `2` | VALID | One above spec lower bound. SRS: FR-06 |
| EC-FR06-007 | `quantity` (UI) | High | 6-point | Specification | Interior | `10` | VALID | Representative mid-range value. SRS: FR-06 |
| EC-FR06-009 | `quantity` (UI) | High | 6-point | Specification | Far below LB | `-1` | INVALID | Negative quantity — dedicated invalid TC. SRS: FR-06 |

##### B.2 System/UI Boundaries (no spec UB — test practical limits)

| EC ID | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|:----:|:---------:|---------------|:-----:|:----------:|:-------------:|-------|
| EC-FR06-007 | `quantity` (UI) | High | 6-point | UI/System | Moderate high | `99` | VALID | Typical large order. BP-06: test system boundary |
| EC-FR06-007 | `quantity` (UI) | High | 6-point | UI/System | Large | `100` | VALID | Round number boundary. BP-06 |
| EC-FR06-013 | `quantity` (UI) | High | 6-point | UI/System | Very large | `999` | INVALID* | Tests whether SUT handles 3-digit boundary. BP-06 |
| EC-FR06-013 | `quantity` (UI) | High | 6-point | UI/System | Extreme | `9999` | INVALID* | Tests 4-digit input. BP-06 |
| EC-FR06-013 | `quantity` (UI) | High | 6-point | Database | DB practical limit | `999999999` | INVALID | Tests overflow/truncation in cart total calculation. BP-06 |

> *Note: Since SRS defines no UB, values 999 and 9999 are technically "valid" per spec. They are marked INVALID* at the system boundary level — the actual SUT behaviour determines the classification. HITL confirmed the SUT doesn't restrict these, so the test verifies whether the system **should** restrict them (potential missing validation bug).

---

#### C. Variable: Cart Body `price` (API-Level) — Risk: High — 6-point BVA

**Specification boundary:** Price must be a positive number > 0 (SRS FR-15; confirmed integer by HITL).
**System boundary:** Backend blindly trusts client-sent price (HITL finding).
**Database boundary:** SQLite INTEGER.

| EC ID | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|:----:|:---------:|---------------|:-----:|:----------:|:-------------:|-------|
| EC-FR06-019 | Cart `price` | High | 6-point | Specification | LB-1 | `0` | INVALID | Zero price — below spec minimum (> 0). SRS: FR-15 |
| EC-FR06-018 | Cart `price` | High | 6-point | Specification | LB | `1` | VALID | Smallest valid price (1 ₫). SRS: FR-15, API §4.2 |
| EC-FR06-018 | Cart `price` | High | 6-point | Specification | LB+1 | `2` | VALID | One above minimum price. SRS: FR-15 |
| EC-FR06-018 | Cart `price` | High | 6-point | Specification | Interior | `100000` | VALID | Typical mid-range product price. SRS: FR-15 |
| EC-FR06-019 | Cart `price` | High | 6-point | Specification | Far below LB | `-1` | INVALID | Negative price — dedicated invalid TC. SRS: FR-15 |
| EC-FR06-019 | Cart `price` | High | 6-point | Specification | Extreme negative | `-1000000` | INVALID | Large negative — tests if backend allows negative cart totals (security). SRS: FR-15, SEC-02 |
| EC-FR06-019 | Cart `price` | High | 6-point | API/Security | Tampered low | `1` (when actual DB price is `100000`) | INVALID** | Client sends falsified low price — backend should reject but doesn't (per HITL finding). API §4.2, SEC-02 |
| EC-FR06-018 | Cart `price` | High | 6-point | UI/System | Typical max | `99999999` | VALID | Tests very high price near system limits. BP-06 |
| EC-FR06-018 | Cart `price` | High | 6-point | Database | DB max | `9223372036854775807` | VALID*** | SQLite INTEGER max (2^63-1). BP-06 |

> **Note: This is the critical security boundary. The price field in `POST /api/cart` is not validated against the actual DB price, allowing price tampering.
>
> ***DB max is technically valid at the storage level but may cause overflow in cart total calculations.

---

#### D. Variable: Cart Body `quantity` (API-Level) — Risk: High — 6-point BVA

**Specification boundary:** Mirrors UI quantity: positive integer ≥ 1 (SRS FR-06).
**System boundary:** API accepts whatever the client sends (HITL: no validation).

| EC ID | Variable | Risk | BVA Depth | Boundary Type | Point | Test Value | Valid/Invalid | Notes |
|-------|----------|:----:|:---------:|---------------|:-----:|:----------:|:-------------:|-------|
| EC-FR06-021 | Cart `quantity` | High | 6-point | Specification | LB-1 | `0` | INVALID | Zero quantity via API. SRS: FR-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | Specification | LB | `1` | VALID | Minimum valid quantity. SRS: FR-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | Specification | LB+1 | `2` | VALID | One above minimum. SRS: FR-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | Specification | Interior | `10` | VALID | Typical quantity. SRS: FR-06 |
| EC-FR06-021 | Cart `quantity` | High | 6-point | Specification | Far below LB | `-1` | INVALID | Negative quantity via API — should be rejected. SRS: FR-06 |
| EC-FR06-021 | Cart `quantity` | High | 6-point | API/System | NaN value | `NaN` | INVALID | Non-numeric reaches API (HITL finding #4). FR-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | UI/System | Large | `999999` | VALID* | Tests API handling of very large quantity. BP-06 |
| EC-FR06-020 | Cart `quantity` | High | 6-point | Database | DB practical limit | `999999999` | VALID* | Tests overflow in cart total (quantity × price). BP-06 |

> *Technically valid per spec (no UB defined), but may cause overflow in `total_amount` calculation.

---

### Boundary Type Coverage Summary

| Variable | Spec Boundary | UI/System Boundary | DB Boundary | Mismatch Detected? |
|----------|:-------------:|:------------------:|:-----------:|:------------------:|
| `id` (URL) | LB=1 (positive integer) | No `max` constraint on URL param | SQLite INTEGER max (2^63-1) | **No** — all layers reject invalid IDs consistently |
| `quantity` (UI) | LB=1; no UB defined | `<input type="number">` with no `min`/`max` attr; accepts non-numeric chars | SQLite INTEGER | **YES** — Spec says "positive integers, min 1" but UI allows 0, negative, NaN, and strings; API accepts all without validation |
| Cart `price` (API) | Must be > 0 (integer) | API body accepts any JSON number | SQLite INTEGER | **YES** — Spec says positive, API blindly trusts client; client can send 0, negative, or falsified values |
| Cart `quantity` (API) | Must be ≥ 1 (integer) | API body accepts any JSON value | SQLite INTEGER | **YES** — Same as UI quantity; API has no server-side validation |

---

### Potential High-Value Findings (Boundary Mismatches)

1. **`quantity` (UI → API): CRITICAL mismatch**
   - **Spec:** Positive integers, minimum 1
   - **UI:** `<input type="number">` allows typing non-numeric characters
   - **API:** `POST /api/cart` accepts `NaN`, `0`, `-1` without validation
   - **Impact:** Invalid quantities reach the cart and persist in the order
   - **Test targets:** `quantity=0` (LB-1), `quantity=-1`, `quantity=NaN`, `quantity=abc`

2. **Cart `price` (API): CRITICAL security mismatch**
   - **Spec:** Price must be positive (> 0)
   - **API:** Backend blindly trusts client-sent `price` field in `POST /api/cart`
   - **Impact:** User can manipulate the price of products in their cart (price tampering attack)
   - **Test targets:** `price=0` (LB-1), `price=-1`, `price=1` (when actual is 100000)

3. **`quantity` system UB: No upper limit enforced**
   - **Spec:** No UB defined
   - **UI/API:** Accepts arbitrarily large values (999999999+)
   - **Impact:** Potential integer overflow in `total_amount = price × quantity` calculation
   - **Test targets:** `quantity=999999999`, `quantity=9223372036854775807`

---

### Self-Audit (AGENTS.md §7 — Boundary Analysis Gate)

```
[x] BVA applied to all ordered/numeric EC classes from Phase 2 (id, quantity UI, cart price, cart quantity)
[x] Risk level assigned and documented for each variable (Medium for id; High for quantity, price, cart quantity)
[x] Correct BVA depth selected per risk level (4-point for Medium id; 6-point for High quantity/price/cart quantity)
[x] Specification, UI/System, and DB boundaries all documented in separate rows
[x] LB-1 and UB+1 are clearly marked as INVALID
[x] Every boundary point traces back to an EC-FR06-[###] ID
```

---

### Open Issues for HITL

- [ ] **`quantity` system UB classification:** Values like 999 and 9999 are marked *INVALID* at the system boundary level since there is no spec UB. HITL should determine: (a) Is the absence of a UB in the SRS a spec deficiency? (b) Should a practical upper limit (e.g., 999) be recommended as a test baseline?
- [ ] **Cart `price` tampered boundary:** The test value `price=1` (when actual DB price is 100000) is the most critical security test. HITL should confirm whether this is tested via the UI flow or directly via API (Postman/cURL). Recommend API-level testing for this scenario.
- [ ] **DB boundary for `price` (2^63-1):** Testing SQLite INTEGER max may cause application crash or undefined behaviour. HITL should decide whether to include this extreme boundary in formal test cases or flag it as an exploratory test only.

---

**HITL Review:** Accepted
