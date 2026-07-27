---
name: AutomationScriptGen
description: Converts HW2 test cases into data-driven Playwright automation scripts with at least 3 distinct assertion patterns, external test data files, and proper test isolation. Covers FR-06 (Product Detail), FR-08 (Checkout), and FR-15 (Product Management CRUD).
---

# SKILL: AutomationScriptGen — Data-Driven Playwright Script Generation

> **Skill:** AutomationScriptGen
> **Phase:** Core Automation (one invocation per FR)
> **Input:**
>   - `23127379_Homework/HW2/Pool-[X]_FR##_*/FR##-test-cases.md` — TC IDs and steps to automate
>   - `23127379_Homework/HW2/Pool-[X]_FR##_*/FR##-bug-report.md` — known bugs affecting assertion expectations
>   - `23127379_Homework/HW2/agents/context/eshop-srs.md` — expected behaviour for assertions
>   - `23127379_Homework/HW2/agents/context/eshop-api-spec.md` — API endpoints for setup/teardown
> **Output files:**
>   - `23127379_Homework/HW4/Pool-[X]_FR##/fr##.spec.ts` — Playwright test spec
>   - `23127379_Homework/HW4/Pool-[X]_FR##/fr##-test-data.json` — External test data file
> **Governance:** `AGENTS.md §4` (mandatory standards), `§5` (assertion patterns), `§7` (TC selection), `§8` (quality gate)

---

## Skill Purpose

Translate HW2 domain test cases into executable, data-driven Playwright automation scripts. This Skill ensures:
1. **Traceability** — every `test()` maps to a named HW2 TC ID (e.g., `TC-FR06-EP-001`).
2. **Data-driven** — all input values live in a `.json` file, never in the spec body.
3. **≥3 assertion patterns** per spec (see `AGENTS.md §5.2`).
4. **Test isolation** — each test is independent with proper before/after hooks.
5. **Known bug handling** — failing tests document the known bug from HW2.

---

## Execution Steps

### Step 1 — TC Selection (Read HW2 Source)

Before writing any code, read and list the TCs to automate:

1. Open `23127379_Homework/HW2/Pool-[X]_FR##_*/FR##-test-cases.md`.
2. Select **at least 12 TCs** per the priority in `AGENTS.md §7`.
3. Flag TCs that **cannot be automated** (pure visual checks without a testable assertion):
   ```
   ⚠️ CANNOT AUTOMATE: TC-FR##-EP-001 step "Verify the button is blue" 
   → Reason: Color assertion requires visual regression tool (Percy/Chromatic). 
   → Workaround: Assert CSS class name instead if deterministic.
   ```
4. For known bug TCs (Status: Failed in HW2): **include them** and note the known bug.

### Step 2 — Design the Test Data File

For each FR, create a `.json` file that contains ALL variable values used in tests:

**Template: `fr##-test-data.json`**
```json
{
  "meta": {
    "fr": "FR-##",
    "feature": "Feature Name",
    "student": "23127379",
    "sut": {
      "frontendUrl": "http://localhost:5173",
      "adminUrl": "http://localhost:5174",
      "apiUrl": "http://localhost:3000"
    },
    "accounts": {
      "user": { "email": "test@eshop.com", "password": "Test1234!" },
      "admin": { "email": "admin@eshop.com", "password": "Admin123!" }
    }
  },
  "testCases": [
    {
      "id": "TC-FR##-EP-001",
      "description": "Brief description",
      "inputs": {
        "fieldName": "value",
        "otherField": 123
      },
      "expected": {
        "url": "http://localhost:5173/expected-path",
        "messageContains": "Expected success text",
        "httpStatus": 200
      },
      "knownBug": null
    },
    {
      "id": "TC-FR##-NEG-001",
      "description": "Negative test description",
      "inputs": {
        "fieldName": ""
      },
      "expected": {
        "errorMessageContains": "Error text to assert",
        "shouldBlockAction": true
      },
      "knownBug": "BUG-FR##-001"
    }
  ]
}
```

### Step 3 — Write the Spec File Structure

Every spec file follows this structure:

```typescript
/**
 * FR-##: [Feature Name] — Automation Test Suite
 * Student: 23127379
 * Based on HW2 test cases: FR##-test-cases.md
 * 
 * Assertion patterns used:
 * - A1: expect(page).toHaveURL(...)
 * - A2: expect(locator).toBeVisible()
 * - A3: expect(locator).toHaveText(...)
 * - A4: expect(locator).toHaveValue(...)
 * - A5: expect(locator).toHaveCount(...)
 */

import { test, expect, Page, APIRequestContext } from '@playwright/test';
import testData from './fr##-test-data.json';

// ============================================================
// CONSTANTS (from test data file — no hardcoding in tests)
// ============================================================
const { sut, accounts } = testData.meta;
const FRONTEND_URL = sut.frontendUrl;
const ADMIN_URL = sut.adminUrl;
const API_URL = sut.apiUrl;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Login via UI and return authenticated page */
async function loginAsUser(page: Page): Promise<void> {
  await page.goto(`${FRONTEND_URL}/login`);
  await page.fill('input[type="email"]', accounts.user.email);
  await page.fill('input[type="password"]', accounts.user.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(`${FRONTEND_URL}/`, { timeout: 15_000 });
}

/** Login as admin via UI */
async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto(`${ADMIN_URL}/login`);
  await page.fill('input[type="email"]', accounts.admin.email);
  await page.fill('input[type="password"]', accounts.admin.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(`${ADMIN_URL}/`, { timeout: 15_000 });
}

/** Get auth token via API (for API-level test setup) */
async function getToken(request: APIRequestContext, role: 'user' | 'admin'): Promise<string> {
  const creds = role === 'admin' ? accounts.admin : accounts.user;
  const response = await request.post(`${API_URL}/api/login`, {
    data: { email: creds.email, password: creds.password }
  });
  const body = await response.json();
  return body.token;
}

// ============================================================
// TEST SUITE
// ============================================================

test.describe('FR-##: [Feature Name] @FR##', () => {

  // Setup shared state
  let authToken: string;
  
  test.beforeAll(async ({ request }) => {
    authToken = await getToken(request, 'user');
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to SUT; verify it's running
    await page.goto(`${FRONTEND_URL}`);
    await expect(page).not.toHaveURL(/.*error.*/);
  });

  test.afterEach(async ({ request }) => {
    // Cleanup: reset state via API if needed
    // Example: clear cart, delete created products
  });

  // ----------------------------------------------------------
  // EP VALID TESTS
  // ----------------------------------------------------------
  
  test.describe('Valid Test Cases (EP)', () => {
    
    test('TC-FR##-EP-001: [Title from HW2]', async ({ page }) => {
      // Source TC: TC-FR##-EP-001 from FR##-test-cases.md
      const tc = testData.testCases.find(t => t.id === 'TC-FR##-EP-001')!;
      
      // [Steps from HW2 TC]
      
      // Assertions (A1): URL check
      await expect(page).toHaveURL(tc.expected.url);
      
      // Assertions (A2): Visibility
      await expect(page.locator('[role="main"]')).toBeVisible();
      
      // Assertions (A3): Text content
      await expect(page.locator('h1')).toHaveText(tc.expected.messageContains!);
    });
    
  });

  // ----------------------------------------------------------
  // NEG INVALID TESTS
  // ----------------------------------------------------------

  test.describe('Invalid Test Cases (NEG)', () => {
    
    test('TC-FR##-NEG-001: [Title from HW2]', async ({ page }) => {
      // Source TC: TC-FR##-NEG-001
      const tc = testData.testCases.find(t => t.id === 'TC-FR##-NEG-001')!;
      
      // Known bug annotation
      if (tc.knownBug) {
        console.log(`⚠️ Known bug: ${tc.knownBug} — this test is expected to fail until fixed`);
      }
      
      // [Steps]
      
      // Assertions (A8): Negative visibility
      await expect(page.locator('[data-testid="success-message"]')).not.toBeVisible();
      
      // Assertions (A9): Error text contains
      await expect(page.locator('[data-testid="error-message"]')).toContainText(
        tc.expected.errorMessageContains!
      );
    });
    
  });

});
```

### Step 4 — FR-06 Specific Implementation

Generate `23127379_Homework/HW4/Pool-A_FR06/fr06.spec.ts` based on these TCs from HW2:
**HW2 source:** `23127379_Homework/HW2/Pool-A_FR06_ProductDetailView/FR06-test-cases.md`

**TC selection for FR-06 (≥12 TCs):**
- `TC-FR06-EP-001`: Product detail displays all fields → automate (known bug: no category, no breadcrumb)
- `TC-FR06-EP-002`: Quantity field defaults to 1 → automate
- `TC-FR06-EP-003`: Add to Cart with valid quantity (authenticated) → automate
- `TC-FR06-EP-004`: Add same product increments quantity → automate (known bug: BUG-FR06-002)
- `TC-FR06-NEG-001`: Non-existent product ID (99999) → automate
- `TC-FR06-NEG-002`: Product ID = 0 → automate
- `TC-FR06-NEG-003`: Product ID = -1 → automate
- `TC-FR06-NEG-004`: Product ID = "abc" (non-numeric) → automate
- `TC-FR06-NEG-005`: Extremely large ID → automate
- `TC-FR06-NEG-006`: Quantity = 0 → automate (known bug: BUG-FR06-003)
- `TC-FR06-NEG-007`: Quantity = -1 → automate (known bug: BUG-FR06-004)
- `TC-FR06-NEG-009`: Quantity = "abc" → automate (known bug: BUG-FR06-006)
- `TC-FR06-BV-001`: Quantity = 1 (LB) → automate
- `TC-FR06-BV-003`: Quantity = 999 (UB) → automate

**⚠️ CANNOT AUTOMATE:**
- Color assertions ("button is blue") → assert CSS class name presence instead

**Key selectors to use (stable, accessible):**
```typescript
// Product detail page
const productName = page.locator('h1');  // or page.getByRole('heading', { level: 1 })
const productPrice = page.locator('[data-testid="product-price"]');  // adjust after inspection
const quantityInput = page.locator('input[type="number"]');
const addToCartBtn = page.getByRole('button', { name: /add to cart|thêm vào giỏ/i });
const errorMessage = page.getByText(/not found|không tìm thấy/i);
const toastNotification = page.locator('.toast, [role="alert"]');
```

**Assertion patterns for FR-06 spec (≥3 types):**
```typescript
// A1 — URL
await expect(page).toHaveURL(`${FRONTEND_URL}/product/1`);

// A2 — Visibility
await expect(page.locator('img[alt]')).toBeVisible();
await expect(addToCartBtn).toBeVisible();

// A3 — Text
await expect(productName).toHaveText(tc.expected.productName);

// A4 — Value (quantity field)
await expect(quantityInput).toHaveValue('1');

// A5 — Count (exactly one h1)
await expect(page.locator('h1')).toHaveCount(1);

// A9 — Contains text (price format)
await expect(productPrice).toContainText('₫');
```

### Step 5 — FR-08 Specific Implementation

Generate `23127379_Homework/HW4/Pool-B_FR08/fr08.spec.ts` based on these TCs:
**HW2 source:** `23127379_Homework/HW2/Pool-B_FR08_Checkout/FR08-test-cases.md`

**TC selection for FR-08 (≥12 TCs):**
- `TC-FR08-EP-001`: Happy path checkout → automate (known bug: cart not cleared)
- `TC-FR08-EP-002`: Checkout without coupon → automate
- `TC-FR08-EP-003`: Breadcrumb and error position → automate (known bug: no breadcrumb)
- `TC-FR08-NEG-001`: Unauthenticated checkout → automate (UI redirect check)
- `TC-FR08-NEG-003`: Empty cart → automate
- `TC-FR08-NEG-004`: Empty shipping address → automate (known bug: BUG-FR08-006)
- `TC-FR08-NEG-006`: Whitespace-only address → automate (known bug)
- `TC-FR08-NEG-007`: h1 count and button color → automate (known bug: no h1)
- `TC-FR08-BV-001`: 1-char address (LB) → automate
- `TC-FR08-BV-002`: 2-char address (LB+1) → automate
- `TC-FR08-BV-003`: 254-char address (UB-1) → automate
- `TC-FR08-BV-004`: 255-char address (UB) → automate

**Note:** `TC-FR08-NEG-002` (malformed JWT via API) and `TC-FR08-NEG-005` (tampered total_amount via API) can be automated using `request` fixture — include them as bonus.

**Key selectors for FR-08:**
```typescript
const shippingAddressInput = page.locator('input[name="shipping_address"], textarea[name="shipping_address"]');
const placeOrderBtn = page.getByRole('button', { name: /place order|đặt hàng|thanh toán/i });
const cartTotal = page.locator('[data-testid="cart-total"], .total');
const breadcrumb = page.locator('nav[aria-label="breadcrumb"], .breadcrumb');
const successMessage = page.getByText(/order placed|đặt hàng thành công/i);
```

### Step 6 — FR-15 Specific Implementation

Generate `23127379_Homework/HW4/Pool-C_FR15/fr15.spec.ts` based on these TCs:
**HW2 source:** `23127379_Homework/HW2/Pool-C_FR15_ProductManagement/FR15-test-cases.md`

**TC selection for FR-15 (≥12 TCs):**
- `TC-FR15-EP-001`: Create product with all fields → automate (known bug: no toast, price format)
- `TC-FR15-EP-002`: Create product with only mandatory fields → automate
- `TC-FR15-EP-003`: Update existing product → automate
- `TC-FR15-EP-004`: Delete product with confirmation → automate (if exists)
- `TC-FR15-NEG-001`: Create product without name → automate
- `TC-FR15-NEG-002`: Create product with price = 0 → automate
- `TC-FR15-NEG-003`: Create product with negative price → automate
- `TC-FR15-NEG-004`: Access admin without auth → automate (redirect check)
- `TC-FR15-NEG-005`: Create product with name > 255 chars → automate
- `TC-FR15-BV-001`: Name = 1 char (LB) → automate
- `TC-FR15-BV-002`: Name = 255 chars (UB) → automate
- `TC-FR15-BV-003`: Name = 256 chars (UB+1 — invalid) → automate

**Key selectors for FR-15 (Web Admin at localhost:5174):**
```typescript
const addProductBtn = page.getByRole('button', { name: /add product|thêm sản phẩm/i });
const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
const priceInput = page.locator('input[name="price"], input[type="number"]');
const descriptionInput = page.locator('textarea[name="description"]');
const imageUrlInput = page.locator('input[name="imageUrl"]');
const categorySelect = page.locator('select[name="category_id"]');
const submitBtn = page.getByRole('button', { name: /save|submit|tạo|lưu/i });
const productTable = page.locator('table tbody tr');
const successToast = page.locator('.toast-success, [role="alert"]');
```

### Step 7 — Assertion Patterns Summary

Every spec file must document its assertion patterns as a header comment:

```typescript
/**
 * ASSERTION PATTERNS USED:
 * - A1 (toHaveURL): Redirect and navigation verification
 * - A2 (toBeVisible): Element presence on page
 * - A3 (toHaveText): Exact text content check
 * - A4 (toHaveValue): Form field value verification
 * - A5 (toHaveCount): Element count (e.g., h1 tag count)
 * - A8 (not.toBeVisible): Negative visibility check
 * - A9 (toContainText): Partial text match
 * Total: 7 patterns — satisfies ≥3 requirement from AGENTS.md §5.2
 */
```

### Step 8 — Self-Audit Before Presenting

```
□ All input values (URLs, credentials, test inputs) read from fr##-test-data.json
□ No hardcoded strings in test() bodies (except comments)
□ At least 3 distinct assertion patterns documented in header
□ beforeEach navigates to SUT and checks it's running
□ afterEach / afterAll cleans up created data via API
□ Each test() is labeled with its TC ID in the title
□ Known bugs are annotated with inline comments
□ ⚠️ CANNOT AUTOMATE items are listed and explained
□ Locators prefer role/label/text over fragile XPath
□ No waitForTimeout() > 500ms without justification
□ Test tags (@FR06, @FR08, @FR15) are present for selective runs
```

---

## Output Block Template

After completing this skill for an FR, present to HITL:

```
[AutomationScriptGen Complete — FR-##]

FILES CREATED:
- 23127379_Homework/HW4/Pool-[X]_FR##/fr##.spec.ts     ✅ (N test cases)
- 23127379_Homework/HW4/Pool-[X]_FR##/fr##-test-data.json ✅ (N test data entries)

TC COVERAGE:
- EP valid: N cases automated
- NEG invalid: N cases automated  
- BV boundary: N cases automated
- Total: N/N TCs automated (N% coverage)

ASSERTION PATTERNS: A1, A2, A3, A4, A5, A8, A9 (7 patterns)

⚠️ CANNOT AUTOMATE (N cases):
- TC-FR##-XXX: [reason]

KNOWN BUGS (from HW2) covered:
- BUG-FR##-001 → TC-FR##-XXX (expected to fail)
- BUG-FR##-002 → TC-FR##-XXX (expected to fail)

HITL ACTIONS REQUIRED:
1. Review every test() block in fr##.spec.ts
2. Inspect all locators — verify against live SUT
3. Update fr##-test-data.json with actual product IDs from SUT
4. Run: npx playwright test 23127379_Homework/HW4/Pool-[X]_FR##/fr##.spec.ts --project=chromium
5. Fix any selector failures, then re-run
6. Confirm Gate G2 cleared → proceed to ScriptReview
```

---

## HITL Action After This Skill

1. Read every `test()` block — verify steps match HW2 TC steps.
2. Run the spec against the live SUT on Chromium first.
3. Fix any failing selectors or navigation issues.
4. Document what you changed in `fr##-automation-review.md`.
5. Run on all 3 browsers:
   ```bash
   cd 23127379_Homework/HW4
   npx playwright test --project=chromium --project=firefox --project=webkit
   ```
6. Commit:
   ```bash
   git add 23127379_Homework/HW4/Pool-[X]_FR##/fr##.spec.ts
   git add 23127379_Homework/HW4/Pool-[X]_FR##/fr##-test-data.json
   git commit -m "feat(FR##): add Playwright automation spec with N test cases"
   ```
