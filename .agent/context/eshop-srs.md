# EShop — System Requirements Specification

> **Document Scope**: Describes the **correct business requirements** of the EShop system.
> Use this document as the basis for designing test cases, then test the actual system to identify implementation points that do not comply with the specification.

---

## 1. System Overview

The EShop system is an e-commerce platform consisting of 4 components:

| Component    | Technology                  | Default URL             |
| ------------ | --------------------------- | ----------------------- |
| Backend API  | Node.js + Express + SQLite  | `http://localhost:3000` |
| Frontend Web | React + Vite + Tailwind CSS | `http://localhost:5173` |
| Web Admin    | React + Vite + Tailwind CSS | `http://localhost:5174` |
| Mobile App   | React Native + Expo         | LAN IP of the host      |

**Default Accounts:**

- Admin: `admin@eshop.com` / `Admin123!`
- Test User: `test@eshop.com` / `Test1234!`

---

## 2. Account Management (Authentication & Authorization)

### FR-01: User Registration

- Users must provide: **Full Name**, **Email**, **Password**.
- Email must have a valid format (`user@domain.com`) and must be unique in the system.
- **Strong password requirements**: Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character (`@`, `$`, `!`, `%`, `*`, `?`, `&`).
- A **Confirm Password** field is required — the system rejects the registration if the two fields do not match.
- After successful registration, the user is redirected to the Login page.

### FR-02: Login & Account Lockout

- Users enter their Email and Password.
- After each failed login attempt, the system increments the counter by **exactly 1**.
- If the user fails to log in **3 or more consecutive times**, the account is temporarily locked for **30 seconds** (demo environment). The system returns an appropriate error message without revealing specific details of the cause.
- A successful login returns a JWT Token. The token is stored on the client side and sent with all authenticated requests via the `Authorization: Bearer <token>` header.
- The email field must use `type="email"` (with HTML5 format validation).

### FR-03: Forgot Password & Reset Password (2 Steps)

**Step 1 — Obtain OTP:**

- The user enters their registered Email address.
- The system generates a **6-digit random OTP** and sends it via Email (in the demo environment: displayed directly on screen).
- The interface must display a **Step Indicator** — e.g., "Step 1 / 2".
- A **Back to Login** button must be available.

**Step 2 — Reset Password:**

- The user enters the OTP, the new Password, and **Confirm New Password**.
- The new password must comply with the same conditions as FR-01.
- Both password fields must match.
- The OTP is only valid for the email that requested it; it cannot be used for a different email.

### FR-04: Personal Profile Management

- Logged-in users can update: **Full Name**, **Phone Number**, **Default Shipping Address**.
- **Valid phone number**: starts with `0`, 10–11 digits long.
- Email cannot be changed through the interface.
- Users can only update their own profile; they cannot change their own `role` attribute.

---

## 3. Categories & Products

### FR-05: View Product List & Search

- The home page displays a grid of all products.
- Each product displays: **Image** (standard aspect ratio, with descriptive alt text), **Product Name**, **Price** (unit: ₫, formatted with thousands separator).
- The search bar searches by product name. Search keywords must be **displayed safely** (no HTML rendering).
- A **loading** state must be shown while data is being fetched.
- An appropriate **empty state** message must be shown when no search results are found.
- The home page must have **exactly one `<h1>` tag**.
- Each page must have exactly 1 unique `<h1>`.

### FR-06: View Product Details

- Displays in full: Large Image, Name, Price, Description, Category.
- A **Quantity** input field (accepts only positive integers, minimum value of 1).
- An **Add to Cart** button — after clicking, a visual feedback is shown (toast notification or badge update).

---

## 4. Shopping Cart & Checkout

### FR-07: Shopping Cart

- Displays a list of products with columns: **Product**, **Unit Price**, **Quantity** (with +/- buttons to adjust), **Subtotal**, **Actions**.
- Adding the same product to the cart increments its quantity; it does not create a new row.
- The **Remove Product** button must show a confirmation dialog before proceeding.
- A **Continue Shopping** button must be available to return to the home page.
- The total price label must be exactly: **"Total"** (not "Subtotal").
- An empty cart must display an illustrative image and a clear message.

### FR-08: Checkout

- Only **logged-in** users can proceed to checkout.
- The **checkout total** is calculated automatically from the cart and cannot be directly edited by the user.
- The interface displays the full list of items being ordered.
- The backend must recalculate the total; it must not accept the `total_amount` value sent by the client.
- After a successful checkout, the cart is cleared.

### FR-09: Coupon Code

At the Checkout step, users can enter a coupon code. The system applies a discount based on the following **5 conditions**, all of which must be satisfied:

| #   | Condition                  | Description                                                              |
| --- | -------------------------- | ------------------------------------------------------------------------ |
| C1  | **Code exists**            | The code must exist in the database and be active (`is_active = 1`)      |
| C2  | **Not expired**            | The current date must be before `expired_at`                             |
| C3  | **Minimum order met**      | The order total must be **>= (greater than or equal to)** `min_order_amount` |
| C4  | **User is logged in**      | The user must have a valid JWT Token                                     |
| C5  | **Usage limit not reached**| The number of times this user has used the code < `max_uses_per_user`   |

**Discount Calculation Formula:**

- Type `percent`: `discount_amount = total × discount_value / 100`
- Type `fixed`: `discount_amount = discount_value`
- `final_amount = total - discount_amount`

**Sample coupon codes in the system:**

| Code      | Type    | Value     | Min. Order   | Expiry Date | Uses/User |
| --------- | ------- | --------- | ------------ | ----------- | --------- |
| `SAVE10`  | percent | 10%       | 300,000 ₫    | 2099-12-31  | 1         |
| `BIGBUY`  | fixed   | 50,000 ₫  | 500,000 ₫    | 2099-12-31  | 1         |
| `VIP100`  | fixed   | 100,000 ₫ | 300,000 ₫    | 2099-12-31  | 2         |
| `EXPIRED` | percent | 20%       | 100,000 ₫    | 2020-01-01  | 1         |

---

## 5. Order Management

### FR-10: Order Status (Order State Machine)

Orders have **5 statuses** and must follow the transition diagram below:

```
                 [Admin confirms]          [Admin ships]          [Admin completes]
  ┌──────────┐ ─────────────────► ┌───────────┐ ──────────────► ┌──────────┐ ──────────► ┌───────────┐
  │ pending  │                    │ confirmed │                  │ shipping │             │ delivered │
  └──────────┘                    └───────────┘                  └──────────┘             └───────────┘
       │                               │
       │ [User/Admin cancels]          │ [User/Admin cancels]
       ▼                               ▼
  ┌──────────┐                    ┌──────────┐
  │ canceled │                    │ canceled │
  └──────────┘                    └──────────┘
```

**Final State Constraints:**

- The `delivered` and `canceled` statuses are **final states** — no further transitions to any other status are permitted.
- Once an order is in the `shipping` status, **Users are not allowed to cancel it** — only an Admin can perform actions.
- All invalid transitions must return an error with an appropriate message.

### FR-11: View Order History (User)

- Users can only view their own orders.
- Displays: Order ID, Order Date, Total Amount, Current Status.
- Statuses must be translated clearly into English and differentiated by color.

---

## 6. Web Admin Subsystem

### FR-12: Access Control

- The Admin subsystem is restricted to accounts with `role = 'admin'`.
- **All** Admin APIs (`/api/admin/*`) and data-modifying APIs (`POST/PUT/DELETE /api/products`, `/api/categories`, `/api/coupons`) must require:
  1. A valid JWT Token.
  2. `role = 'admin'` present in the Token.

### FR-13: Dashboard

- Displays total revenue: Only sums the `total_amount` of orders with `status = 'delivered'`.
- Displays the total number of orders.

### FR-14: Category Management (Category CRUD)

- Admin can Create / View / Delete categories.
- Category name is mandatory and must not be empty.

### FR-15: Product Management (Product CRUD)

- Admin can Create / View / Edit / Delete products.
- **Input constraints:**
  - Product name: mandatory, maximum 255 characters.
  - Price: mandatory, must be a **positive** number (> 0).
  - Category: mandatory, must be selected from the existing list.
- When editing a product, only that product is changed — other products remain unaffected.

### FR-16: Import Products from CSV

- Admin can upload a CSV file to import multiple products at once.
- **CSV file requirements:**
  - File extension must be `.csv`.
  - The first row is the header: `name,price,description,imageUrl,category_id`.
  - Supports fields containing commas if enclosed in double quotes (RFC 4180).
- **Validation before import:**
  - `name` must not be empty.
  - `price` must be a positive number.
- If there is an error in any row, the entire import must be **rolled back** (atomic transaction — all-or-nothing).
- The system must display a clear report: how many rows succeeded, how many failed, and the reasons.

### FR-17: Coupon Management (Coupon CRUD)

- Admin can Create / View / Delete coupon codes.
- Required fields: `code` (unique), `type` (percent/fixed), `discount_value` (positive), `expired_at`, `min_order_amount` (>= 0), `max_uses_per_user` (>= 1).

### FR-18: Order Management (Admin)

- Admin can view all orders from all users.
- Admin can transition order statuses according to the State Machine defined in FR-10.
- Shipping addresses must be displayed **safely** (no HTML rendering).

### FR-19: User Management (Admin)

- Admin can view the list of all users (passwords must not be exposed).
- Admin can delete users, **except they cannot delete their own currently logged-in account**.

---

## 7. Mobile Subsystem (React Native)

### FR-20: Mobile Features

- Full feature set: View Products, Login, Logout, Register, Shopping Cart, Checkout, Profile, Order History.
- The Cancel Order feature must comply with the State Machine in FR-10 (cancellation is only permitted when the order is `pending` or `confirmed`).

---

## 8. GUI Requirements

### FR-21: General Interface Standards

- **Language consistency**: The entire interface uses English (except for standard technical terms).
- **Color consistency**: Positive action buttons (Submit, Purchase) use blue. Dangerous/cancel buttons use red.
- **Currency consistency**: Always use the `₫` symbol with thousands-separator formatting.
- **Page title**: Each page has exactly 1 `<h1>` tag describing the page content.
- **Tab Order**: Focus order via Tab key must go from top to bottom, left to right.

### FR-22: Form Requirements

- All required fields must have an `*` symbol next to the label.
- The Email field must use `type="email"`.
- The Password field must use `type="password"` (input is hidden).
- Error messages must appear **above** the submit button, not below it.
- Forms with 2 or more steps must have a clear **Step Indicator**.

### FR-23: Navigation Requirements

- The navigation bar (Navbar) must **highlight** the currently selected page.
- The "Cart" link must display a **quantity badge** showing the number of items in the cart.
- The Logout button must be labeled "Logout" (not "Exit" or "Quit").
- Breadcrumbs are required on sub-pages (Cart, Checkout, Product Detail).

### FR-24: Feedback & State Requirements

- After clicking "Add to Cart", a visual feedback (toast/badge) must be shown.
- When removing an item from the cart, a confirmation dialog must appear.
- Empty State pages must include an icon/illustration and a friendly message.
- All product images must have a non-empty `alt` attribute describing the image content.

---

## 9. Security Requirements (Reference)

| ID     | Requirement                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| SEC-01 | Passwords must **not** be stored in plaintext.                                                                        |
| SEC-02 | Security-sensitive APIs must require a valid JWT Token.                                                               |
| SEC-03 | Admin APIs must verify `role = 'admin'` within the Token, not just check for the Token's existence.                  |
| SEC-04 | All user-supplied data displayed in the UI must be properly escaped; `innerHTML` must not be used directly.           |
| SEC-05 | Database queries must use Parameterized Queries; direct string concatenation is not permitted.                         |
| SEC-06 | The profile update API must not allow the `role` field to be changed from the client.                                 |
| SEC-07 | Password reset OTPs must have sufficient entropy (minimum 6 digits), have an expiry time, and be invalidated after use.|

---

_This document is for educational and Software Testing practice purposes. Version: 2.0 — Updated: 2026-05-14._