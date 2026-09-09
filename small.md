# Stage Prompts — EShop Remediation

## Prompt 00 — Baseline & Traceability

Inspect the EShop repository without changing application behavior.

Your goal is to create the remediation baseline.

Read:

* root `README.md`;
* `api_specification.md`;
* backend implementation;
* relevant HW2, HW4, HW6 reports and test suites;
* GitHub Issues or bug reports when referenced.

Create a traceability inventory:

```text
Requirement
→ related test cases
→ observed failures
→ bug IDs
→ probable shared root cause
→ affected source files
→ remediation priority
```

Group defects by root cause rather than listing only individual bugs.

Classify remediation priority:

* P0 Security / privilege / financial integrity
* P1 core business correctness
* P2 data integrity
* P3 frontend/UI behavior
* P4 quality/maintainability
* P5 performance

Do not modify production code.

Deliver:

1. `remediation-baseline.md`
2. root-cause groups
3. dependency order
4. unresolved requirement contradictions
5. recommended first implementation stage.

---

## Prompt 01 — Authentication & Authorization

Remediate the authentication and authorization foundation.

First inspect the current implementation and identify all endpoints requiring authentication or admin authorization.

Verify against FR-01, FR-02, FR-04 and FR-12.

Address at minimum:

* plaintext password storage;
* password verification;
* password strength enforcement;
* JWT secret configuration;
* JWT expiration;
* expired/invalid token handling;
* authentication middleware;
* reusable admin authorization middleware;
* user role mass assignment;
* protected admin/product/category/coupon mutation endpoints;
* sensitive fields returned from user endpoints.

Do not modify unrelated business logic.

Add focused regression tests.

Produce:

`remediation-stage-01-auth-security.md`

including before/after test evidence.

---

## Prompt 02 — Validation Layer

Introduce centralized boundary validation.

Inspect duplicated or absent validation across endpoints.

Create reusable schemas or validators for:

* registration;
* login;
* password reset;
* profile update;
* product create/update;
* category operations;
* cart requests;
* checkout requests;
* coupon requests.

Requirements remain the source of truth.

Do not mix authorization logic into validation schemas.

Differentiate:

* malformed input;
* invalid domain value;
* missing resource;
* unauthorized;
* forbidden.

Add unit tests for boundary conditions.

Produce:

`remediation-stage-02-validation.md`

---

## Prompt 03 — Cart & Checkout

Refactor the Cart and Checkout domain.

Requirements:

* cart must not trust client price/name;
* duplicate products increase quantity;
* quantities must be positive integers;
* checkout is authenticated;
* backend calculates total;
* client `total_amount` is not authoritative;
* successful checkout clears cart;
* order creation is atomic.

Design a clear service boundary.

Recommended direction:

```text
CartService
CheckoutService
ProductRepository
OrderRepository
```

Do not over-engineer.

Add domain and API regression tests, including tampering scenarios.

Produce:

`remediation-stage-03-cart-checkout.md`

---

## Prompt 04 — Coupons

Remediate coupon evaluation.

Implement all requirement conditions exactly.

Verify boundaries, especially:

```text
total >= min_order_amount
```

Correct percentage calculation.

Use authenticated user identity.

Do not trust client-provided:

* user_id;
* total_amount.

Ensure coupon usage recording is transactionally consistent with successful checkout where applicable.

Add boundary and abuse tests.

Produce:

`remediation-stage-04-coupons.md`

---

## Prompt 05 — Orders

Refactor order state logic into an explicit domain rule.

Implement an allowed-transition model.

Protect order access by ownership and role.

Review:

* user cancellation;
* admin status transition;
* terminal states;
* direct order detail access;
* missing authentication;
* invalid transition responses.

Add exhaustive state-transition tests.

Produce:

`remediation-stage-05-orders.md`

---

## Prompt 06 — Product / Category / Import

Remediate product, category and CSV import behavior.

Enforce:

* admin authorization;
* product validation;
* category existence;
* exact record update;
* no unintended adjacent mutation;
* atomic import.

For CSV import:

1. validate every row;
2. reject invalid dataset before partial persistence, or rollback transaction;
3. preserve RFC 4180-compatible values;
4. provide useful error reporting without partial writes.

Add API/integration regression.

Produce:

`remediation-stage-06-product-data.md`

---

## Prompt 07 — Frontend Alignment

Do not begin until backend enforcement is sufficiently stable.

Review frontend-web, frontend-admin and frontend-mobile behavior against requirements and corrected API contracts.

Fix only observable frontend mismatches.

Areas:

* validation UX;
* loading state;
* empty state;
* error state;
* quantity input;
* checkout totals;
* product formatting;
* accessibility;
* h1 rules;
* alt text;
* confirmations;
* feedback/toasts;
* admin behavior.

Do not duplicate authoritative business calculations in frontend.

Update Playwright tests only when the previous test was inconsistent with the requirement.

Produce:

`remediation-stage-07-frontends.md`

---

## Prompt 08 — Regression Consolidation

Run a structured regression campaign after remediation.

Order:

1. validation/unit;
2. domain/service;
3. API integration;
4. HW6/Newman;
5. HW4/Playwright;
6. relevant HW2 black-box scenarios;
7. security regression.

For every remaining failure classify:

* genuine remaining defect;
* obsolete test due to approved contract change;
* environment issue;
* fixture issue;
* flaky test;
* unclear requirement.

Never leave an unexplained failure.

Produce:

`remediation-regression-report.md`

with:

```text
Before remediation:
...

After remediation:
...

Fixed:
...

Remaining:
...

Regression introduced:
...

Release recommendation:
...
```

---

## Prompt 09 — Performance Re-Baseline

Only run after correctness regression is stable.

Use HW5 as a historical baseline, not as an unconditional performance target.

Re-run:

* load;
* spike;
* stress;
* endurance.

Compare:

* p95;
* throughput;
* error rate;
* CPU;
* memory;
* DB behavior.

Explain performance differences caused by:

* validation;
* password hashing;
* database reads;
* authorization;
* transactions;
* server-side total calculation.

Do not remove correctness/security controls to recover old performance numbers.

Produce:

`remediation-performance-report.md`.
