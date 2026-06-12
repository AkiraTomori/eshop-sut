# EShop — API Specification

> **Purpose:** This document provides the list and usage instructions for the EShop backend APIs.
> Students can use Postman, cURL, or similar tools to interact with the APIs for software testing purposes.
>
> **Base URL:** `http://localhost:3000`

---

## 1. Authentication

### 1.1 User Registration
- **Endpoint:** `POST /api/register`
- **Request Body (JSON):**
  ```json
  {
    "name": "Nguyen Van A",
    "email": "test@domain.com",
    "password": "Password123!"
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "message": "User registered successfully",
    "id": 1
  }
  ```

### 1.2 User Login
- **Endpoint:** `POST /api/login`
- **Request Body (JSON):**
  ```json
  {
    "email": "test@domain.com",
    "password": "Password123!"
  }
  ```
- **Successful Response (200 OK):**
  Returns a JWT `token` along with the authenticated `user` information.

### 1.3 Forgot Password (Generate Reset Token)
- **Endpoint:** `POST /api/forgot-password`
- **Request Body (JSON):**
  ```json
  {
    "email": "test@domain.com"
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "message": "Password reset token generated",
    "resetToken": "123456"
  }
  ```

### 1.4 Reset Password
- **Endpoint:** `POST /api/reset-password`
- **Request Body (JSON):**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```

---

## 2. Users

> **Note:** The following APIs require an authorization token in the request header:
>
> `Authorization: Bearer <token>`

### 2.1 Get Current User Profile
- **Endpoint:** `GET /api/users/me`

### 2.2 Update User Profile
- **Endpoint:** `PUT /api/users/me`
- **Description:** Only basic personal information can be updated.
- **Request Body (JSON):**
  ```json
  {
    "name": "Nguyen Van A",
    "shipping_address": "123 Le Loi Street, District 1, Ho Chi Minh City",
    "phone": "0912345678"
  }
  ```

---

## 3. Products & Categories

### 3.1 Get Product List
- **Endpoint:** `GET /api/products`
- **Optional Query Parameter:**
  - `?search=keyword` — Search products by name.

### 3.2 Get Product Details
- **Endpoint:** `GET /api/products/:id`

### 3.3 Create / Update / Delete Products (Admin Only)

#### Create Product
- **Endpoint:** `POST /api/products`

#### Update Product
- **Endpoint:** `PUT /api/products/:id`

#### Delete Product
- **Endpoint:** `DELETE /api/products/:id`

#### Request Body for Create/Update (JSON)
```json
{
  "name": "Product Name",
  "price": 100000,
  "description": "Product description",
  "imageUrl": "http://...",
  "category_id": 1
}
```

### 3.4 Categories

#### Get Category List
- **Endpoint:** `GET /api/categories`

#### Create Category
- **Endpoint:** `POST /api/categories`
- **Request Body (JSON):**
  ```json
  {
    "name": "Category Name"
  }
  ```

#### Update Category
- **Endpoint:** `PUT /api/categories/:id`

#### Delete Category
- **Endpoint:** `DELETE /api/categories/:id`

---

## 4. Cart & Orders

> **Required Header:**
>
> `Authorization: Bearer <token>`

### 4.1 Get Shopping Cart
- **Endpoint:** `GET /api/cart`

### 4.2 Add Item to Cart
- **Endpoint:** `POST /api/cart`
- **Request Body (JSON):**
  ```json
  {
    "id": 1,
    "name": "Product A",
    "price": 100000,
    "quantity": 2
  }
  ```

### 4.3 Checkout
- **Endpoint:** `POST /api/checkout`
- **Request Body (JSON):**
  ```json
  {
    "total_amount": 200000,
    "shipping_address": "123 Le Loi Street, Ho Chi Minh City"
  }
  ```

### 4.4 Get My Order History
- **Endpoint:** `GET /api/orders/my-orders`

### 4.5 Get Order Details
- **Endpoint:** `GET /api/orders/:id`

### 4.6 Cancel Order
- **Endpoint:** `PUT /api/orders/:id/cancel`
- **Description:** Changes the order status to `canceled`. This action is only allowed if the order has not been delivered yet.

---

## 5. Coupons

### 5.1 Apply Coupon
- **Endpoint:** `POST /api/apply-coupon`
- **Description:** Calculates the discounted total amount and returns a JSON response containing `discount_amount` and `final_amount`.
- **Request Body (JSON):**
  ```json
  {
    "code": "SAVE10",
    "total_amount": 500000,
    "user_id": 1
  }
  ```

### 5.2 Get Coupon List (Admin Only)
- **Endpoint:** `GET /api/coupons`
- **Required Header:**
  ```
  Authorization: Bearer <token>
  ```

---

## 6. Admin APIs

> All APIs below require:
>
> `Authorization: Bearer <token>`
>
> and the authenticated account must have **Admin** privileges.

### 6.1 User Management

#### Get User List
- **Endpoint:** `GET /api/admin/users`

#### Delete User
- **Endpoint:** `DELETE /api/admin/users/:id`

### 6.2 Order Management (System-wide)

#### Get All Orders
- **Endpoint:** `GET /api/admin/orders`

#### Update Order Status
- **Endpoint:** `PUT /api/admin/orders/:id/status`

- **Request Body (JSON):**
  ```json
  {
    "status": "confirmed"
  }
  ```

- **Available Status Values:**
  - `pending`
  - `confirmed`
  - `shipping`
  - `delivered`
  - `canceled`

### 6.3 Import Products from CSV (JSON Array)

- **Endpoint:** `POST /api/admin/import-products`

- **Request Body (JSON):**
  ```json
  {
    "products": [
      {
        "name": "Product 1",
        "price": 10000,
        "description": "Description 1",
        "imageUrl": "",
        "category_id": 1
      }
    ]
  }
  ```

### 6.4 Coupon Management

#### Create Coupon
- **Endpoint:** `POST /api/admin/coupons`

- **Request Body (JSON):**
  ```json
  {
    "code": "TET2025",
    "type": "percent",
    "discount_value": 15,
    "min_order_amount": 200000,
    "expired_at": "2025-01-31",
    "max_uses_per_user": 1
  }
  ```

#### Delete Coupon
- **Endpoint:** `DELETE /api/admin/coupons/:id`