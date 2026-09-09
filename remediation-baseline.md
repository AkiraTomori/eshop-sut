# EShop Remediation Baseline — Stage 0

**Date:** 2026-09-09  
**Status:** BASELINE — read-only observation. No production code was modified.

**Sources read:**
- `README.md` — business/system requirements (authoritative)
- `api_specification.md` — API contracts
- `backend/server.js` — all route handlers
- `backend/database.js` — schema + seed data
- HW2 `bug_report.md` (2088 lines, Pools A–D)
- HW4 `bug_report.md` (28 confirmed product defects)
- HW6 `bug_report.md` + Pool-A/B/C stage5 proposals

---

## 1. Root-Cause Groups (RCG)

All ~80 observed defect manifestations collapse into 21 root-cause groups.

---

### RCG-01 — Plaintext Password Storage  [P0]

**Root cause:** Every password operation stores and compares raw plaintext.
- `database.js` L92–93: admin/test accounts seeded in plaintext.
- `server.js` L48: `user.password === password` — direct string compare, no hash.
- `server.js` L25: INSERT stores raw password on register.
- `server.js` L92: UPDATE stores raw `newPassword` on reset.

| Field | Value |
|---|---|
| Requirements | SEC-01; FR-01; FR-03 |
| Priority | **P0** |
| Files | server.js L25,48,92; database.js L92–93 |
| Issues | #69 (BUG-PA-003 Critical) |
| Evidence | HW6: `passwordStorageType=text`, `equalsFinalExpectedRuntimePassword=true` on live run |

---

### RCG-02 — Hard-coded JWT Secret & No Token Expiry  [P0]

**Root cause:**
- `server.js` L11: `SECRET_KEY = "super_secret_key_that_should_not_be_here"` — embedded in source.
- `server.js` L53: `jwt.sign({ id, role }, SECRET_KEY)` — no `expiresIn`, tokens never expire.

| Files | server.js L11, L53 | Issues | #34 (BUG-FR04-003 Fatal) |
|---|---|---|---|
| Evidence | HW2: expired JWT accepted, HTTP 200 returned, profile updated |

---

### RCG-03 — Role Privilege Escalation via Mass Assignment  [P0]

**Root cause:** `PUT /api/users/me` (L120–137) reads `role` from request body and writes it to DB:

```js
const { name, shipping_address, phone, role } = req.body;
if (role) { query += ", role = ?"; params.push(role); }
```

Any standard user sends `"role":"admin"` → self-promotes in one API call.

| Files | server.js L121–129 | Issues | #40 (BUG-FR04-009 Fatal) |
|---|---|---|---|
| Requirements | SEC-06; FR-04; FR-12 |

---

### RCG-04 — Product/Category Endpoints Without Authentication  [P0]

**Root cause:** `POST /api/products` (L169), `PUT /api/products/:id` (L181), `DELETE /api/products/:id` (L193) have **no `authenticateToken` middleware** at all. Category mutation endpoints use `authenticateToken` but no admin check.

| Files | server.js L169,181,193,251,259,271 | Issues | #72 (BUG-PC-001 High) |
|---|---|---|---|
| Evidence | HW6: 16 auth variants all returned 200 and mutated catalog data |

---

### RCG-05 — Admin Routes Missing Role-Level Authorization  [P0]

**Root cause:** All `/api/admin/*` routes use `authenticateToken` but **never check `req.user.role === 'admin'`**. A standard-user JWT passes auth and accesses all admin functions.

Affected: `GET/DELETE /api/admin/users`, `GET/PUT /api/admin/orders/:id/status`, `POST/DELETE /api/admin/coupons`, `POST /api/admin/import-products`.

Additional gap: `DELETE /api/admin/users/:id` (L506) has no self-deletion guard (FR-19).

| Files | server.js L201,459,485,496,506,512,527 |
|---|---|

---

### RCG-06 — Client-Controlled `total_amount` at Checkout  [P0]

**Root cause:** `POST /api/checkout` (L299–311) reads `total_amount` from request body and inserts it verbatim. Server never loads cart, never fetches DB prices, never recalculates.

```js
const { total_amount, shipping_address } = req.body;
db.run("INSERT INTO orders (user_id, total_amount ...) VALUES (?, ?, ...)", [userId, total_amount, ...])
```

Additional gaps from same root: cart in-memory (resets on restart); no `order_items` table; cart not cleared after checkout.

| Files | server.js L299–311 | Issues | #28 (Fatal), #71, #23 |
|---|---|---|---|
| Evidence | HW2 BUG-FR08-008: order placed at 1 ₫; HW6 BUG-PB-002: 12 cases confirmed |

---

### RCG-07 — Client-Controlled Price in Cart  [P0]

**Root cause:** `POST /api/cart` (L292–297) pushes the entire request body into memory with no validation:

```js
userCarts[userId].push(req.body);  // L295
```

Server never fetches authoritative price from DB.

| Files | server.js L292–297 | Issues | #15,#11,#12,#18,#19,#10 |
|---|---|---|---|
| Evidence | HW2 BUG-FR06-015 (Fatal): price=1 accepted for ₫30M product |

Manifestations: price tampering (#15,#18); zero price (#11); negative price (#12); non-existent product ID accepted (#10); quantity=0/NaN/negative accepted (#13,#14,#19).

---

### RCG-08 — Coupon: No Auth, Client user_id, Wrong Threshold, Wrong Formula  [P0/P1]

**Root cause:** Three independent bugs in `POST /api/apply-coupon` (L365–443):

1. No `authenticateToken` middleware; `user_id` from request body (L366) — trivially bypassed.
2. Threshold operator wrong (L381): `total_amount > coupon.min_order_amount` should be `>=` (FR-09 C3).
3. Percent formula wrong (L401–403): `Math.floor(total * (1 - coupon.discount_value))` — for SAVE10 where `discount_value=10`, this computes `total * (1-10) = total * (-9)`. Correct: `Math.floor(total * discount_value / 100)`.

| Files | server.js L365–443 |
|---|---|
| Requirements | FR-09 C1–C5; coupon formulas |

---

### RCG-09 — OTP: Four Digits Instead of Six, No Expiry  [P0]

**Root cause:** `server.js` L74:

```js
// DEFECTIVE: generates [1000, 9999] — always 4 digits
Math.floor(1000 + Math.random() * 9000).toString()
// CORRECT:
Math.floor(100000 + Math.random() * 900000).toString()
```

No `reset_token_expires` column in schema — OTP never expires (SEC-07 violation).

| Files | server.js L74; database.js (schema) | Issues | #68 (BUG-PA-001 High) |
|---|---|---|---|
| Evidence | HW6: 26 cases / 27 assertions failed; every observed token was 4 digits |

---

### RCG-10 — Password Reset (& Register) Accept Any Password  [P0]

**Root cause:** Neither `POST /api/reset-password` (L89–100) nor `POST /api/register` (L22–32) validate password against FR-01 strong-password rules (min 8 chars, uppercase, lowercase, digit, allowed special).

| Files | server.js L89–100, L22–32 | Issues | #70 (BUG-PA-002 High) |
|---|---|---|---|
| Evidence | HW6: 9 invalid password classes all returned HTTP 200 |

---

### RCG-11 — Centralized Input Validation Absent  [P1]

**Root cause:** No validation middleware or schema layer. Every handler inserts whatever the body contains.

**Products (FR-15):** price=0 (#42); negative price (#43); float price (#44); string price (#45); missing price (#46); orphan category_id (#50); string category_id (#51); all same on PUT (#73).

**Profile (FR-04):** empty name (#35); 256+ char name (#36); missing name (#37); phone not starting with 0 (#38); non-numeric/12-digit phone (#39); 256+ char address (#41).

**Checkout (FR-08):** empty/whitespace address (#26,#27); 256+ char address (#29).

| Files | server.js — all POST/PUT handlers |
|---|---|
| Requirements | FR-01, FR-04, FR-08, FR-15, FR-16, FR-17 |

---

### RCG-12 — SQL Injection via String Concatenation  [P0]

**Root cause:** `GET /api/products` (L146) — only non-parameterized query in codebase:

```js
const query = `SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`;
```

All other queries use `?` placeholders. SEC-05 mandates parameterized queries for all DB access.

| Files | server.js L145–158 |
|---|---|
| Requirements | SEC-05 |

---

### RCG-13 — Order State Machine Allows Two Illegal Transitions  [P1]

**Root cause:**

1. **User cancel (L331):** only blocks `delivered`/`canceled`, not `shipping`. FR-10: user cannot cancel a shipping order.
2. **Admin transitions (L552):** `canceled → delivered` is explicitly allowed — terminal-state violation.

```js
// L331 DEFECTIVE — should also block 'shipping'
if (order.status === "delivered" || order.status === "canceled") { ... }
// L552 DEFECTIVE — canceled is terminal
if (currentStatus === "canceled" && status === "delivered") isValidTransition = true;
```

| Files | server.js L331, L552 | Requirements | FR-10; FR-20 |
|---|---|---|---|

---

### RCG-14 — IDOR on Order Detail Endpoint  [P0]

**Root cause:** `GET /api/orders/:id` (L346–351) has no `authenticateToken` middleware and no ownership check:

```js
app.get("/api/orders/:id", (req, res) => {  // No auth middleware
  db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], ...)
```

| Files | server.js L346–351 | Requirements | FR-11; SEC-02 |
|---|---|---|---|

---

### RCG-15 — `GET /api/users/me` Exposes Password  [P0]

**Root cause:** `SELECT * FROM users` returns the full row including `password`. Since passwords are plaintext (RCG-01), this directly exposes credentials via the profile API.

| Files | server.js L114–118 | Requirements | FR-19; SEC-01 |
|---|---|---|---|

---

### RCG-16 — CSV Import Not Atomic  [P2]

**Root cause:** `POST /api/admin/import-products` (L201–243) skips invalid rows and continues inserting valid ones. No DB transaction. FR-16 requires all-or-nothing rollback.

| Files | server.js L201–243 | Requirements | FR-16 |
|---|---|---|---|

---

### RCG-17 — Product API Returns 200 for Missing Product; Even-ID Price Type Bug  [P2]

**Root cause:** `GET /api/products/:id` (L163–166):

```js
if (!row) return res.status(200).json({});          // Should be 404
if (row.id % 2 === 0) row.price = row.price.toString(); // Type inconsistency
```

| Files | server.js L163–166 | Issues | #52 (BUG-FR15-011 — same false-200 on PUT) |
|---|---|---|---|

---

### RCG-18 — No `order_items` Table; Cart Never Persisted to DB  [P1]

**Root cause:** Database schema has no `order_items` table. Checkout stores only a total; no item-level records exist. `userCarts` object (L16) is in-memory — all cart data lost on server restart. Server-side total recalculation (RCG-06 fix) depends on this being resolved first.

| Files | database.js (schema); server.js L16, L299–311 | Issues | #23, #71 |
|---|---|---|---|

---

### RCG-19 — Login Attempt Counter +2; Lockout Duration 180s Instead of 30s  [P1]

**Root cause:**

```js
const newAttempts = user.login_attempts + 2;         // L56: should be + 1
lockedUntil = new Date(Date.now() + 180000);          // L59: 3 min, should be 30s
```

FR-02: increment by exactly 1 per failure; lock after ≥ 3 failures; lockout 30 seconds (demo).

| Files | server.js L56, L59 | Requirements | FR-02 |
|---|---|---|---|

---

### RCG-20 — Frontend/UI Defects  [P3]

**Root cause:** Multiple independent UI-layer omissions. Identified via HW2 manual testing and HW4 Playwright automation.

**Product Detail (FR-06):** category absent (#1); duplicate cart row instead of merge (#2); qty 0/neg/empty not blocked (#3,#4,#7); first Add-to-Cart silently ignored (#59).

**Checkout (FR-08):** missing `<h1>` (#21); green button (#22); no breadcrumb (#25); no error for empty address (#26); empty cart missing illustration (#60); total directly editable (#61).

**Product Management Admin (FR-15):** no `*` on required fields (#54); errors below field not above submit (#55); green save button (#56); no `<h1>` (#57); delete without confirm dialog (#58); prices lack thousands separators (#62); no success notification after delete (#63); search/empty-state absent (#64); loading indicator absent (#66); meaningful `<h1>` absent (#67).

**Mobile Profile (FR-04):** regex validates 9–10 digits instead of 10–11 (#32).

| Files | frontend-web/, frontend-admin/, frontend-mobile/ |
|---|---|

---

### RCG-21 — Wrong HTTP Status Code (403 vs 401)  [P4]

**Root cause:** `authenticateToken` (L108) returns `403 Forbidden` for invalid/missing tokens instead of `401 Unauthorized`. RFC 7235: 401 = not authenticated; 403 = authenticated but not authorized.

| Files | server.js L108 | Issues | #33 (BUG-FR04-002) |
|---|---|---|---|

---

## 2. Full Traceability Inventory

| Requirement | Test Cases | Failures | Bug IDs | Root Cause | Files | Priority |
|---|---|---|---|---|---|---|
| SEC-01 — no plaintext passwords | FR03-EXT-SEC-001 | Passwords stored as text | #69 | RCG-01 | server.js L25,48,92; database.js L92–93 | **P0** |
| SEC-02 — JWT expiry | TC-FR04-NEG-003 | Expired JWT accepted | #34 | RCG-02 | server.js L53 | **P0** |
| SEC-06 — role immutable | TC-FR04-NEG-013 | User self-promotes to admin | #40 | RCG-03 | server.js L121–129 | **P0** |
| FR-12/SEC-03 — admin check on products | PC-F-AUTH-001 (16 cases) | Any caller mutates catalog | #72 | RCG-04 | server.js L169–198 | **P0** |
| FR-12/SEC-03 — admin check on /api/admin/* | — | Standard user reaches admin routes | — | RCG-05 | server.js L496–570 | **P0** |
| SEC-05 — parameterized queries | — | Search uses string concat | — | RCG-12 | server.js L146 | **P0** |
| FR-08 — server-authoritative total | TC-FR08-NEG-005; BUG-PB-002 (12 cases) | Client total trusted | #28, #71 | RCG-06 | server.js L299–311 | **P0** |
| FR-06/07 — server-authoritative cart price | TC-FR06-NEG-018 | Client price trusted; zero/neg accepted | #15,11,12,18,19 | RCG-07 | server.js L292–297 | **P0** |
| FR-09 C4 — auth for coupon | — | apply-coupon unauthenticated | — | RCG-08 | server.js L365 | **P0** |
| FR-03/SEC-07 — 6-digit OTP | FR03-DOM-001 et al. (26 cases) | 4-digit OTP generated | #68 | RCG-09 | server.js L74 | **P0** |
| FR-11 — own orders only | — | /api/orders/:id no ownership check | — | RCG-14 | server.js L346–351 | **P0** |
| FR-19 — no password in response | — | SELECT * returns password field | — | RCG-15 | server.js L115–116 | **P0** |
| FR-03→FR-01 — password policy | FR03-DOM-028–036 (9 cases) | Weak passwords accepted | #70 | RCG-10 | server.js L89–100 | **P0** |
| FR-01 — password policy on register | — | No validation on /api/register | — | RCG-10 | server.js L22–32 | **P0** |
| FR-15 — product validation (create) | TC-FR15-NEG-009 to -022 | Zero/neg/string price; orphan category | #42–52 | RCG-11 | server.js L169–179 | **P1** |
| FR-15 — product validation (update) | PC-F-VALID-001 (18 cases) | Null name, neg price, bad category | #73 | RCG-11 | server.js L181–191 | **P1** |
| FR-04 — profile validation | TC-FR04-NEG-004 to -014 | Empty name; bad phone; overlong fields | #35–41 | RCG-11 | server.js L120–137 | **P1** |
| FR-08 — shipping address validation | TC-FR08-NEG-004,006 | Empty/whitespace/overlong accepted | #26,27,29 | RCG-11 | server.js L299–311 | **P1** |
| FR-10 — order state machine | — | User cancels shipping; canceled→delivered | — | RCG-13 | server.js L331, L552 | **P1** |
| FR-02 — login lockout | — | Counter +2; lockout 180s not 30s | — | RCG-19 | server.js L56,59 | **P1** |
| FR-09 — coupon threshold/formula | — | `>` instead of `>=`; wrong percent | — | RCG-08 | server.js L381,401–403 | **P1** |
| FR-08 — order_items & cart clear | BUG-FR08-003; BUG-PB-001 | Cart not cleared; no item rows | #23, #71 | RCG-18 | server.js L299–311; database.js | **P1** |
| FR-16 — atomic CSV import | — | Partial import on row error | — | RCG-16 | server.js L201–243 | **P2** |
| FR-06 — 404 for missing product | TC-FR15-NEG-021 | Returns 200 {} instead of 404 | #52 | RCG-17 | server.js L163 | **P2** |
| FR-06 — price type consistency | — | Even-ID products return string price | — | RCG-17 | server.js L164 | **P2** |
| FR-21 — one h1 per page | TC-FR08-EP-001; TC-FR15-NEG-027 | Missing h1 on checkout, admin | #21, #57 | RCG-20 | frontend-web, frontend-admin | **P3** |
| FR-21 — button colors blue | TC-FR08-EP-001; TC-FR15-NEG-026 | Green buttons | #22, #56 | RCG-20 | frontend-web, frontend-admin | **P3** |
| FR-22 — form validation UX | TC-FR15-NEG-024,025 | Missing *; errors in wrong position | #54, #55 | RCG-20 | frontend-admin | **P3** |
| FR-22 — breadcrumb | TC-FR08-EP-003 | Breadcrumb absent on checkout | #25 | RCG-20 | frontend-web | **P3** |
| FR-07 — cart quantity merge | BUG-FR06-002 | Duplicate rows instead of merge | #2 | RCG-20 | frontend-web | **P3** |
| FR-06 — quantity UI validation | TC-FR06-NEG-006 to -010 | Zero/neg/empty qty not blocked | #3,4,7 | RCG-20 | frontend-web | **P3** |
| FR-04 — mobile phone regex | TC-FR04-EP-001,002,003 | Mobile validates 9–10 instead of 10–11 | #32 | RCG-20 | frontend-mobile | **P3** |
| API — 401 vs 403 | TC-FR04-NEG-002 | 403 returned for invalid token | #33 | RCG-21 | server.js L108 | **P4** |

---

## 3. Implementation Dependency Order

```
Stage 1 — Authentication & Security Foundation          (RCG-01,02,03,04,05,12,15,21)
  • Hash passwords (bcrypt) — server.js register, login, reset; database.js seed
  • Move SECRET_KEY to env var; add expiresIn to jwt.sign
  • Strip role from PUT /api/users/me
  • Create requireAdmin middleware
  • Apply requireAdmin to ALL admin routes + product/category mutation routes
  • Fix product search to parameterized LIKE
  • Remove password from GET /api/users/me response
  • Return 401 instead of 403 for invalid token
  → Unblocks: Stages 2–6 (all depend on reliable auth)

Stage 2 — Centralized Input Validation                  (RCG-10,11,09,19,17)
  • Password policy validator (shared by register + reset-password)
  • Fix OTP to 6 digits; add expiry column + check to schema
  • Validate /api/register (name, email format, password strength)
  • Validate /api/reset-password (newPassword policy)
  • Validate PUT /api/users/me (name required; phone 10–11 digits starts 0; addr max 255)
  • Validate POST/PUT /api/products (name req; price > 0 integer; category exists)
  • Validate POST /api/checkout (shipping_address required, non-empty, max 255)
  • Fix login lockout: +1 per attempt; 30-second lockout
  • Fix product 404: return 404 when row missing; remove even-ID price cast
  → Unblocks: Stage 3 (valid cart data needed before checkout recalculation)

Stage 3 — Cart and Checkout Domain                      (RCG-06,07,18)
  • Add order_items table to schema
  • Redesign POST /api/cart: fetch authoritative price+name from DB; validate qty >= 1
  • Rewrite POST /api/checkout:
      - Load authenticated user's cart
      - Fetch current product data from DB
      - Calculate total server-side (ignore client total_amount)
      - Insert order + order_items in a transaction
      - Clear user's cart on success
  → Unblocks: Stage 4 (coupon applies to server-calculated total)

Stage 4 — Coupon Rules                                  (RCG-08)
  • Add authenticateToken to POST /api/apply-coupon
  • Use req.user.id instead of body user_id
  • Fix threshold: > to >=
  • Fix percent formula: total * discount_value / 100
  • Record coupon usage atomically with checkout (not as separate client call)
  → Unblocks: Stage 5 (trusted coupon usage before order state work)

Stage 5 — Order State Machine & IDOR                    (RCG-13,14)
  • Add ownership check + auth to GET /api/orders/:id
  • Fix user cancel: also block 'shipping' status
  • Fix admin transitions: remove canceled → delivered
  • Add self-deletion guard to DELETE /api/admin/users/:id
  • Implement explicit transition table (master.md P8 pattern)

Stage 6 — Product/Category/Import Integrity             (RCG-16)
  • Wrap CSV import in DB transaction
  • Collect all row errors before any write; rollback if any exist
  • (Category existence validation covered in Stage 2)

Stage 7 — Frontend Alignment                            (RCG-20)
  • h1 headings on all pages
  • Blue button colors (checkout, admin form, save)
  • Breadcrumbs on checkout and product detail
  • Category displayed on product detail
  • Quantity validation (min=1, integer only)
  • Cart merge on duplicate product
  • Delete confirmation dialog
  • Error message position (above submit)
  • Required field * indicators
  • Fix mobile phone regex (10–11 digits)

Stage 8 — Regression Engineering
  • Unit tests for all validators
  • API integration tests for auth, checkout, coupon, state machine
  • Playwright regression for FR-06, FR-08, FR-15

Stage 9 — Performance Re-Baseline (after correctness is stable)
```

### Minimum viable scope for Stage 1

| Action | File | Lines |
|---|---|---|
| Hash passwords with bcrypt on register/login/reset | server.js | L25, L48, L92 |
| Seed hashed credentials | database.js | L92–93 |
| Move SECRET_KEY to env; add `expiresIn` to jwt.sign | server.js + new config/security.js | L11, L53 |
| Strip `role` from PUT /api/users/me | server.js | L121–129 |
| Create `requireAdmin` middleware | new middleware/requireAdmin.js | — |
| Apply requireAdmin to product, category, admin routes | server.js | L169,181,193,201,251,459,485,496,506,512,527 |
| Fix search query to parameterized LIKE | server.js | L146 |
| Remove password from GET /api/users/me response | server.js | L115–116 |
| Return 401 instead of 403 for invalid token | server.js | L108 |

---

## 4. Unresolved Requirement Contradictions

| ID | Topic | Source A | Source B | Resolution |
|---|---|---|---|---|
| CONTRA-01 | `api_specification.md §4.3` lists `total_amount` as a checkout body field the client sends. | API spec: client sends total | README FR-08: "backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount` do client gửi lên." | **Resolved by README.** Spec reflects current defective implementation. Remove `total_amount` from trusted input in Stage 3. |
| CONTRA-02 | `api_specification.md §5.1` lists `user_id` as a coupon body field. | API spec: client sends `user_id` | README FR-09 C4: requires authenticated user identity from JWT. | **Resolved by README.** `user_id` must come from `req.user.id`. |
| CONTRA-03 | README does not specify maximum length for `shipping_address`. HW2 tests treat 255 as the maximum (HITL-resolved baseline). | Unspecified in README | HW2 uses 255-char limit | **Unresolved — user confirmation required.** Working assumption: 255 chars. |
| CONTRA-04 | README FR-15: price must be "dương" (positive). Does not explicitly say integer only. HW2 BUG-FR15-003 treats floats as invalid (RESOLVED-02). | README: positive only | HW2: integer only assumed | **Unresolved — user confirmation required.** Vietnamese ₫ is always integer in practice. |
| CONTRA-05 | `api_specification.md §4.5` shows `GET /api/orders/:id` without an explicit auth note. | API spec: no auth note | README FR-11: users see own orders only. | **Resolved by README.** Must add `authenticateToken` + ownership check (Stage 5). |

---

## 5. Recommended First Implementation Stage

**Recommendation: Stage 1 — Authentication & Security Foundation.**

### Rationale

1. **RCG-03 (role escalation)** is exploitable right now with a single `PUT /api/users/me` call by any standard user. All other stage improvements become worthless once an attacker has promoted themselves to admin.
2. **RCG-04/05 (missing auth/admin check)** means the entire product catalog and all admin functions are accessible to anonymous callers. This must be closed before any Stage 3–6 correctness work is added to those endpoints.
3. **RCG-01 (plaintext passwords)** means any DB read exposes every credential. Password hashing must exist before password-related validation work in Stage 2 is meaningful.
4. **RCG-12 (SQL injection in search)** is a single-line fix in the highest-traffic query path and cannot wait.
5. **RCG-15 (password in response)** is a trivial column-exclusion fix with immediate security impact.
6. Stage 1 introduces no behavioral changes visible to legitimate users — it tightens the security perimeter without altering functional flows.
7. All Stage 2 validator work depends on `requireAdmin` existing so only admins trigger product operations.

---

## 6. Defect Count Summary

| Priority | Root Cause Groups | Representative Issues |
|---|---|---|
| **P0** Security / Financial | RCG-01,02,03,04,05,06,07,08(auth),09,10,12,14,15 | #69,#34,#40,#72,#28,#68,#70,#15,#11,#12 + source-only |
| **P1** Core Business | RCG-08(formula/threshold),11,13,18,19 | #42–52,#73,#35–41,#26–29,#23,#71 |
| **P2** Data Integrity | RCG-16,17 | #52 |
| **P3** Frontend/UI | RCG-20 | #1–8,#21–25,#29,#32,#54–67 |
| **P4** Quality | RCG-21 | #33 |
| **Total** | **21 root-cause groups** | **73+ GitHub Issues; ~80 distinct manifestations** |

---

_Baseline compiled: 2026-09-09. No production code was modified._
