# HW04 Context — Feature and TC Reference

## Purpose
This file is a quick reference for the automation agent. It maps each FR to:
- The HW2 test case source
- The key SUT URLs
- The most important locator hints
- The known bugs that will cause automation failures

---

## FR-06: Product Detail View

**SUT URL:** `http://localhost:5173/product/:id`
**API Endpoint:** `GET /api/products/:id`
**HW2 TC Source:** `../../../HW2/Pool-A_FR06_ProductDetailView/FR06-test-cases.md`

### TC Selection (14 TCs)

| TC ID | Type | Automate? | Known Bug |
|-------|------|-----------|-----------|
| TC-FR06-EP-001 | EP | Yes | BUG-FR06-001 (category, breadcrumb, button color) |
| TC-FR06-EP-002 | EP | Yes | None |
| TC-FR06-EP-003 | EP | Yes | None |
| TC-FR06-EP-004 | EP | Yes | BUG-FR06-002 (cart row creation) |
| TC-FR06-NEG-001 | NEG | Yes | None |
| TC-FR06-NEG-002 | NEG | Yes | None |
| TC-FR06-NEG-003 | NEG | Yes | None |
| TC-FR06-NEG-004 | NEG | Yes | None |
| TC-FR06-NEG-005 | NEG | Yes | None |
| TC-FR06-NEG-006 | NEG | Yes | BUG-FR06-003 (qty=0 accepted) |
| TC-FR06-NEG-007 | NEG | Yes | BUG-FR06-004 (neg qty accepted) |
| TC-FR06-NEG-009 | NEG | Yes | BUG-FR06-006 (NaN qty accepted) |
| TC-FR06-BV-001 | BV | Yes | None |
| TC-FR06-BV-003 | BV | Yes | None |

### Cannot Automate
- TC-FR06-EP-001 step: "Verify the Add to Cart button is blue" — use CSS class assertion instead
- TC-FR06-EP-001 step: "Verify tab order" — keyboard tab navigation is automatable but complex

### Key Locator Hints (verify against live SUT)
```
Product image: img[alt]
Product name: h1 (or first heading)
Product price: element containing '₫'
Quantity input: input[type="number"]
Add to Cart button: button containing 'Thêm vào giỏ' or 'Add to Cart'
Cart badge: element in navbar with cart item count
Toast notification: .toast or [role="alert"]
Error message: text containing 'không tìm thấy' or 'not found'
```

---

## FR-08: Checkout

**SUT URL:** `http://localhost:5173/checkout`
**API Endpoint:** `POST /api/checkout`
**HW2 TC Source:** `../../../HW2/Pool-B_FR08_Checkout/FR08-test-cases.md`

### TC Selection (12 TCs)

| TC ID | Type | Automate? | Known Bug |
|-------|------|-----------|-----------|
| TC-FR08-EP-001 | EP | Yes | BUG-FR08-001 (no h1), BUG-FR08-002 (button color) |
| TC-FR08-EP-002 | EP | Yes | None |
| TC-FR08-EP-003 | EP | Yes | BUG-FR08-005 (no breadcrumb) |
| TC-FR08-NEG-001 | NEG | Yes | None |
| TC-FR08-NEG-003 | NEG | Yes | None |
| TC-FR08-NEG-004 | NEG | Yes | BUG-FR08-006 (empty address accepted) |
| TC-FR08-NEG-006 | NEG | Yes | BUG-FR08-007 (whitespace accepted) |
| TC-FR08-NEG-007 | NEG | Yes | BUG-FR08-001 (no h1) |
| TC-FR08-BV-001 | BV | Yes | None |
| TC-FR08-BV-002 | BV | Yes | None |
| TC-FR08-BV-003 | BV | Yes | None |
| TC-FR08-BV-004 | BV | Yes | None |

### Bonus TCs (API-level, using request fixture)
- TC-FR08-NEG-002: Malformed JWT → `request.post('/api/checkout', { headers: { Authorization: 'Bearer INVALID' } })`
- TC-FR08-NEG-005: Tampered total_amount → `request.post('/api/checkout', { data: { total_amount: 1 } })`

### Key Locator Hints
```
Shipping address: input[name="shipping_address"] or textarea
Place Order button: button containing 'Đặt hàng' or 'Place Order'
Cart items list: table or list of checkout items
Order total: element containing '₫' near 'Total' text
Breadcrumb: nav or ol with breadcrumb links
Success message: text containing 'đặt hàng thành công'
Empty cart message: text containing 'Giỏ hàng trống' or 'empty'
```

---

## FR-15: Product Management (CRUD)

**SUT URL:** `http://localhost:5174` (Web Admin)
**API Endpoints:** `POST/PUT/DELETE /api/products`
**HW2 TC Source:** `../../../HW2/Pool-C_FR15_ProductManagement/FR15-test-cases.md`

### TC Selection (12 TCs)

| TC ID | Type | Automate? | Known Bug |
|-------|------|-----------|-----------|
| TC-FR15-EP-001 | EP | Yes | BUG-FR15-001 (no toast), BUG-FR15-003 (price format) |
| TC-FR15-EP-002 | EP | Yes | BUG-FR15-001, BUG-FR15-003 |
| TC-FR15-EP-003 | EP | Yes | None |
| TC-FR15-EP-004 | EP | Yes | None (if exists) |
| TC-FR15-NEG-001 | NEG | Yes | None (name empty → reject) |
| TC-FR15-NEG-002 | NEG | Yes | None (price=0 → reject) |
| TC-FR15-NEG-003 | NEG | Yes | None (price<0 → reject) |
| TC-FR15-NEG-004 | NEG | Yes | None (no auth → redirect) |
| TC-FR15-NEG-005 | NEG | Yes | None (name>255 chars → reject) |
| TC-FR15-BV-001 | BV | Yes | None (name=1 char) |
| TC-FR15-BV-002 | BV | Yes | None (name=255 chars) |
| TC-FR15-BV-003 | BV | Yes | None (name=256 chars → reject) |

### Key Locator Hints (Web Admin at localhost:5174)
```
Add Product button: button containing 'Thêm' or 'Add Product'
Name field: input[name="name"] or first text input in form
Price field: input[name="price"] or input[type="number"]
Description: textarea[name="description"]
Image URL: input[name="imageUrl"]
Category dropdown: select[name="category_id"]
Save/Submit button: button[type="submit"] or button containing 'Lưu'
Product table rows: table tbody tr
Success toast: .toast-success or [role="alert"] with success style
Error message: .error or [role="alert"] with error style
Delete button: button containing 'Xóa' or 'Delete'
Edit button: button containing 'Sửa' or 'Edit'
Confirm dialog OK: button in modal containing 'Xác nhận' or 'OK'
```

---

## SUT Default Accounts

```
Regular User: test@eshop.com / Test1234!
Admin: admin@eshop.com / Admin123!
```

## SUT URLs

```
Frontend:  http://localhost:5173
Web Admin: http://localhost:5174
Backend:   http://localhost:3000
```

## Common API Setup Calls

```typescript
// Get user auth token
POST http://localhost:3000/api/login
{ "email": "test@eshop.com", "password": "Test1234!" }
→ response.token

// Add product to cart (for checkout tests)
POST http://localhost:3000/api/cart
Authorization: Bearer <token>
{ "id": 1, "name": "Product A", "price": 100000, "quantity": 1 }

// Clear cart (afterEach cleanup)
// No DELETE /api/cart endpoint — clear by removing each item
// Or: place a checkout to clear the cart

// Get category list (for FR-15 tests)
GET http://localhost:3000/api/categories
→ response[0].id (use first category_id)
```
