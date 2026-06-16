## Bug Reports — FR-04: Personal Profile Management
**Date:** 2026-06-15
**Reporter:** Gemini QA Agent + Thái Minh Huy
**Pool:** D — Mobile App
**Sources:** FR04-test-cases.md (executed results) · theory-test-report.md §4, §5 · SRS FR-04, SEC-06

---
## Bug Report: BUG-FR04-001
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Phone Number Validation
**Problem Summary:** Profile update API rejects all valid 10-digit and 11-digit phone numbers, and also rejects empty/optional phone submissions, because the mobile UI validation regex enforces an incorrect 9–10 digit range instead of the SRS-specified 10–11 digit range (Expected: phone numbers of 10–11 digits are accepted; Actual: error message "Vui lòng nhập đúng 9-10 chữ số" blocks all valid phone inputs)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop mobile app is running and connected to the backend at `http://localhost:3000`
- Test user `test@eshop.com` is logged in with a valid JWT session token
- User navigates to the Profile screen

**Steps:**
1. Navigate to the **Profile** screen in the mobile app
2. Enter `"Nguyen Van Test"` in the Full Name field
3. Enter `"0912345678"` (10 digits, starts with `0`) in the Phone Number field
4. Enter `"Test Address"` in the Shipping Address field
5. Tap the **Save / Update** button
6. Observe the UI response

**Expected Result:**
Per SRS FR-04, phone numbers of 10 or 11 digits starting with `0` are valid. The system should return HTTP 200 OK, display a success notification, and update the profile in the database. The same behaviour is expected for 11-digit inputs (`"01234567890"`) and for an empty phone field (optional field per FR-04).

**Actual Result:**
The mobile UI displays a validation error message: **"Lỗi, Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số"** — the error indicates 9–10 digits, not 10–11 digits as specified in the SRS. The form submission is blocked. The database state remains unchanged. This defect is reproduced consistently for:
- 10-digit phones (TC-FR04-EP-001): **Failed**
- 11-digit phones (TC-FR04-EP-002): **Failed**
- Empty phone field (TC-FR04-EP-003): **Failed**
- 9-digit phone boundary (TC-FR04-NEG-008, BV-006): rejected correctly but with wrong error text
- 12-digit phone boundary at API level (TC-FR04-BV-009): accepted instead of rejected (see BUG-FR04-008)

**Root Cause (Suspected):** The client-side validation regex in the mobile app enforces `length >= 9 && length <= 10` instead of `length >= 10 && length <= 11`. The off-by-one error in the allowed range means all SRS-valid phones are rejected and 9-digit phones (which should be invalid) are incorrectly accepted by the UI validation rule (though subsequently the error message is still shown, which is also wrong).

**Environment:**
- OS: Android (mobile device / emulator)
- App: EShop Mobile App (React Native + Expo)
- Backend: Node.js + Express at `http://localhost:3000`
- Test Data: `phone = "0912345678"` (10 digits), `phone = "01234567890"` (11 digits), `phone = ""`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/32
**Linked Test Cases:** TC-FR04-EP-001, TC-FR04-EP-002, TC-FR04-EP-003, TC-FR04-NEG-008, TC-FR04-NEG-009, TC-FR04-BV-006

---
## Bug Report: BUG-FR04-002
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — JWT Authentication Error Code
**Problem Summary:** The API returns HTTP 403 Forbidden when a malformed JWT token is sent in the Authorization header, instead of the expected HTTP 401 Unauthorized (Expected: HTTP 401; Actual: HTTP 403)
**Severity:** Medium
**Priority:** Medium
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the request body to:
   ```json
   { "name": "Test", "phone": "0912345678", "shipping_address": "Test Address" }
   ```
3. Set the Authorization header to: `Bearer thisisnotavalidjwt`
4. Send the request
5. Observe the HTTP response status code and body

**Expected Result:**
Per SEC-02, any request with an invalid or unparseable token must be rejected with **HTTP 401 Unauthorized** and an error body indicating the request is unauthenticated.

**Actual Result:**
The server returns **HTTP 403 Forbidden** instead of HTTP 401 Unauthorized. The profile data in the database remains unchanged (the rejection is correct, but the status code is wrong). Reproduced consistently across 2 attempts from a clean state.

**Root Cause (Suspected):** The authentication middleware uses HTTP 403 for all token-related rejections without distinguishing between "not authenticated" (401) and "authenticated but not authorized" (403). RFC 7235 defines 401 for authentication failure and 403 for authorization failure — these are different semantics.

**Environment:**
- OS: macOS (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `Authorization: Bearer thisisnotavalidjwt`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/33
**Linked Test Case:** TC-FR04-NEG-002

---
## Bug Report: BUG-FR04-003
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Expired JWT Token Acceptance
**Problem Summary:** The API accepts an expired JWT token and successfully updates the user profile, instead of rejecting the request with HTTP 401 Unauthorized (Expected: HTTP 401; Actual: HTTP 200 OK with profile data updated in database)
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- An expired JWT token is available (from a previous session that has timed out, or manually constructed with a past `exp` claim)
- Postman or equivalent API testing tool is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the request body to:
   ```json
   { "name": "Test", "phone": "0912345678", "shipping_address": "Test Address" }
   ```
3. Set the Authorization header to: `Bearer <expired_jwt_token>`
4. Send the request
5. Observe the HTTP response status code and body
6. Send a `GET` request to `http://localhost:3000/api/users/me` using the same expired token and verify the database state

**Expected Result:**
Per SEC-02, the server must validate the JWT token's expiry claim (`exp`). An expired token must be rejected with **HTTP 401 Unauthorized** and an error body indicating the token has expired. The profile data must not be modified.

**Actual Result:**
The server returns **HTTP 200 OK** and successfully updates the user profile in the database. The expired JWT token is accepted as valid, bypassing the token expiry check entirely. This defect was reproduced consistently across 2 attempts from a clean state.

**Security Impact:** This is a **Fatal** defect. An attacker in possession of a stolen or leaked JWT token can continue to access and modify user profile data indefinitely, even after the token has expired — effectively making the token non-revocable by expiry. This defeats the purpose of JWT token expiration as a security control.

**Environment:**
- OS: macOS (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `Authorization: Bearer <expired_jwt_token>` (token with past `exp` claim)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/34
**Linked Test Case:** TC-FR04-NEG-003

---
## Bug Report: BUG-FR04-004
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Empty Name Validation
**Problem Summary:** The API accepts an empty string `""` for the mandatory `name` field and successfully updates the user profile with a blank name, instead of rejecting the request with HTTP 400 Bad Request (Expected: HTTP 400; Actual: HTTP 200 OK with blank name stored in database)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Test user `test@eshop.com` is authenticated; valid JWT token is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Set the request body to:
   ```json
   { "name": "", "phone": "0912345678", "shipping_address": "Test Address" }
   ```
4. Send the request
5. Observe the HTTP response status code and body
6. Send a `GET` request to `http://localhost:3000/api/users/me` and verify the stored name value

**Expected Result:**
Per FR-04 and FR-01, the `name` field is mandatory. The server must reject a request where `name` is an empty string with **HTTP 400 Bad Request** and an error message such as `{"message": "Name is required"}`. The profile data in the database must remain unchanged.

**Actual Result:**
The server returns **HTTP 200 OK**. A subsequent `GET /api/users/me` confirms the stored name has been updated to an empty string `""`. The database record is corrupted — the user account now has a blank display name. Reproduced consistently across 2 attempts from a clean state.

**Environment:**
- OS: macOS (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"name": "", "phone": "0912345678", "shipping_address": "Test Address"}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/35
**Linked Test Case:** TC-FR04-NEG-004

---
## Bug Report: BUG-FR04-005
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Full Name Length Upper Bound Not Enforced
**Problem Summary:** The API accepts a Full Name value of 256 characters (and longer) without error, storing the full oversized string in the database, instead of rejecting the request with HTTP 400 Bad Request (Expected: HTTP 400 for name > 255 chars; Actual: HTTP 200 OK with full string stored)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Valid JWT token is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Construct a name string of exactly **256 characters** (e.g., `"A" × 256`)
4. Set the request body to:
   ```json
   { "name": "AAA...A (256 chars)", "phone": "0912345678", "shipping_address": "Test Address" }
   ```
5. Send the request
6. Observe the HTTP response status code and body
7. Send a `GET` request to `http://localhost:3000/api/users/me` and verify the stored name length

**Expected Result:**
The server must reject the request with **HTTP 400 Bad Request** and an error message indicating the name exceeds the maximum allowed length (255 characters). The profile data in the database must remain unchanged.

**Actual Result:**
The server returns **HTTP 200 OK**. A subsequent `GET /api/users/me` confirms the full 256-character string is stored in the database without truncation. No error or warning is returned. The same behaviour was observed with names significantly longer than 255 characters (TC-FR04-BV-005). Reproduced consistently across 2 attempts.

**Environment:**
- OS: macOS (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"name": "A" × 256, "phone": "0912345678", "shipping_address": "Test Address"}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/36
**Linked Test Cases:** TC-FR04-NEG-005, TC-FR04-BV-005

---
## Bug Report: BUG-FR04-006
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Missing Name Field Accepted by API
**Problem Summary:** The API accepts a PUT request body that entirely omits the mandatory `name` key and successfully updates the profile, instead of rejecting with HTTP 400 Bad Request (Expected: HTTP 400; Actual: HTTP 200 OK with database state changed)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Valid JWT token is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Set the request body to — intentionally omitting the `name` key entirely:
   ```json
   { "phone": "0912345678", "shipping_address": "Test Address" }
   ```
4. Send the request
5. Observe the HTTP response status code and body
6. Send a `GET` request to `http://localhost:3000/api/users/me` and verify if the database was modified

**Expected Result:**
Per FR-04, `name` is a mandatory field. The server must reject a request where the `name` key is absent with **HTTP 400 Bad Request** and an error message such as `{"message": "Name is required"}`. The profile data in the database must remain unchanged.

**Actual Result:**
The server returns **HTTP 200 OK**. The database state is changed (phone and address are updated). The missing mandatory `name` field is not enforced at the API validation layer. Reproduced consistently across 2 attempts.

**Environment:**
- OS: macOS (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"phone": "0912345678", "shipping_address": "Test Address"}` (no `name` key)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/37
**Linked Test Case:** TC-FR04-NEG-006

---
## Bug Report: BUG-FR04-007
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Phone Prefix `0` Rule Not Enforced
**Problem Summary:** The API and mobile UI accept a phone number that does not start with digit `0` (e.g., `"1912345678"`), storing it in the database without error, instead of rejecting the input per the SRS prefix constraint (Expected: validation error; Actual: HTTP 200 OK with invalid phone stored)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop mobile app is running and connected to the backend at `http://localhost:3000`
- Test user `test@eshop.com` is logged in with a valid JWT session token

**Steps:**
1. Navigate to the **Profile** screen in the mobile app
2. Enter `"Nguyen Van Test"` in the Full Name field
3. Enter `"1912345678"` in the Phone Number field (10 digits, starts with `1` — not `0`)
4. Enter `"Test Address"` in the Shipping Address field
5. Tap the **Save / Update** button
6. Observe the UI response
7. Also send directly via Postman:
   ```json
   { "name": "Nguyen Van Test", "phone": "1912345678", "shipping_address": "Test Address" }
   ```

**Expected Result:**
Per SRS FR-04, a valid phone number must start with digit `0`. A phone number starting with any other digit (e.g., `1`) must be rejected with a validation error message indicating the phone must start with `0`. The profile data must not be modified.

**Actual Result:**
Neither the mobile UI nor the API rejects the phone number. No error message is displayed on the mobile app screen. The API returns **HTTP 200 OK** and the phone number `"1912345678"` is stored in the database. The `0` prefix constraint is not enforced at either the frontend or backend validation layer. Reproduced consistently across 2 attempts.

**Environment:**
- OS: Android (mobile device / emulator)
- App: EShop Mobile App (React Native + Expo)
- Backend: Node.js + Express at `http://localhost:3000`
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `phone = "1912345678"` (starts with `1`)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/38
**Linked Test Case:** TC-FR04-NEG-007

---
## Bug Report: BUG-FR04-008
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Non-Numeric Phone Accepted by API; 12-Digit Phone Accepted by API
**Problem Summary:** The backend API accepts phone numbers containing non-numeric characters (e.g., `"0912-345-678"`) and also accepts phone numbers exceeding the 11-digit maximum (e.g., `"012345678901"` — 12 digits), storing them in the database without any validation error (Expected: HTTP 400; Actual: HTTP 200 OK with invalid data stored)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Valid JWT token is available

**Steps — Scenario A (Non-numeric phone):**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Set the request body to:
   ```json
   { "name": "Nguyen Van Test", "phone": "0912-345-678", "shipping_address": "Test Address" }
   ```
4. Send the request and observe the HTTP response
5. Send a `GET` to `/api/users/me` to confirm if `"0912-345-678"` is stored in the database

**Steps — Scenario B (12-digit phone):**
1. Repeat steps 1–2 above
2. Set the request body to:
   ```json
   { "name": "Nguyen Van Test", "phone": "012345678901", "shipping_address": "Test Address" }
   ```
3. Send the request and observe the HTTP response
4. Send a `GET` to `/api/users/me` to confirm if the 12-digit string is stored

**Expected Result:**
- **Scenario A:** The API must reject the request with HTTP 400 Bad Request and a validation error stating the phone must contain only numeric digits (0–9). The database must not be modified.
- **Scenario B:** The API must reject the request with HTTP 400 Bad Request and a validation error stating the phone must be 10–11 digits long. The database must not be modified.

**Actual Result:**
- **Scenario A:** The API returns **HTTP 200 OK** and stores `"0912-345-678"` (with dashes) directly into the database. The backend has no numeric-character validation for the phone field at the API layer (TC-FR04-NEG-010).
- **Scenario B:** The API returns **HTTP 200 OK** and stores `"012345678901"` (12 digits) into the database without truncation or error (TC-FR04-BV-009). Both defects are attributed to a missing server-side phone validation layer.

Both scenarios reproduced consistently across 2 attempts from a clean state.

**Environment:**
- OS: macOS (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data Scenario A: `phone = "0912-345-678"` (contains dashes)
- Test Data Scenario B: `phone = "012345678901"` (12 digits)

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/39
**Linked Test Cases:** TC-FR04-NEG-010, TC-FR04-BV-009

---
## Bug Report: BUG-FR04-009
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Role Privilege Escalation via PUT Payload
**Problem Summary:** A standard user can escalate their own account role to `"admin"` by including `"role": "admin"` in a PUT /api/users/me request; the API does not strip or reject the `role` field and writes it to the database — directly violating SEC-06 (Expected: `role` field silently ignored, `role = "user"` unchanged; Actual: `role = "admin"` stored in database)
**Severity:** Fatal
**Priority:** Immediate
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Test user `test@eshop.com` is authenticated; valid JWT token is available
- The test user's current `role` is confirmed as `"user"` via `GET /api/users/me`

**Steps:**
1. Open Postman and send a `GET` request to `http://localhost:3000/api/users/me` with `Bearer <valid_token>` — confirm `role = "user"`
2. Open a new `PUT` request to `http://localhost:3000/api/users/me`
3. Set the Authorization header to: `Bearer <valid_token>`
4. Set the request body to:
   ```json
   {
     "name": "Nguyen Van Test",
     "phone": "0912345678",
     "shipping_address": "Test Address",
     "role": "admin"
   }
   ```
5. Send the request and observe the HTTP response
6. Send a `GET` request to `http://localhost:3000/api/users/me` with the same token
7. Inspect the `role` field in the GET response body

**Expected Result:**
Per SEC-06, the `role` attribute is read-only from the client. The server must silently ignore any `role` key present in the PUT request body. A subsequent `GET /api/users/me` must confirm the user's role is still `"user"`. Attempting to access an admin-only endpoint must return HTTP 403.

**Actual Result:**
The API returns **HTTP 200 OK**. A subsequent `GET /api/users/me` confirms `role = "admin"` — the role has been successfully escalated from `"user"` to `"admin"`. The attacker now has administrator-level privileges on the account. This represents a **critical privilege escalation vulnerability** — any authenticated user can promote themselves to admin through a single API call. Reproduced consistently across 2 attempts from a clean state.

**Security Impact (Critical):** An attacker exploiting this vulnerability gains full administrator access to the EShop system, including all admin-only endpoints. This could result in unauthorized access to all user data, the ability to modify/delete products and orders, and full system compromise. This defect must be treated as a **P0 / Immediate priority** security incident.

**Environment:**
- OS: macOS (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"role": "admin"}` injected in PUT body of a standard `user`-role account

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/40
**Linked Test Case:** TC-FR04-NEG-013

---
## Bug Report: BUG-FR04-010
**Date:** 2026-06-15
**Function Name:** FR-04 Personal Profile Management — Shipping Address Length Upper Bound Not Enforced
**Problem Summary:** The API accepts a Shipping Address value exceeding 255 characters (e.g., 256+ chars) without error, storing the full oversized string in the database, instead of rejecting the request with HTTP 400 Bad Request (Expected: HTTP 400 for address > 255 chars; Actual: HTTP 200 OK with full string stored)
**Severity:** Serious
**Priority:** Serious
**Status:** New
**Reported By:** Gemini QA Agent + Thái Minh Huy
**Assign To:** Development Team

### Steps to Reproduce

**Pre-conditions:**
- EShop backend is running at `http://localhost:3000`
- Postman or equivalent API testing tool is available
- Valid JWT token is available

**Steps:**
1. Open Postman and create a `PUT` request to `http://localhost:3000/api/users/me`
2. Set the Authorization header to: `Bearer <valid_token>`
3. Construct an address string of exactly **256 characters** (e.g., `"A" × 256`)
4. Set the request body to:
   ```json
   { "name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "AAA...A (256 chars)" }
   ```
5. Send the request
6. Observe the HTTP response status code and body
7. Send a `GET` request to `http://localhost:3000/api/users/me` and verify the stored address length

**Expected Result:**
The server must reject the request with **HTTP 400 Bad Request** and an error message indicating the shipping address exceeds the maximum allowed length (255 characters). The profile data in the database must remain unchanged.

**Actual Result:**
The server returns **HTTP 200 OK**. A subsequent `GET /api/users/me` confirms the full 256-character address string is stored in the database without truncation. No error or warning is returned (TC-FR04-NEG-011, TC-FR04-BV-014). Reproduced consistently across 2 attempts.

**Environment:**
- OS: macOS (Postman desktop client)
- API Endpoint: `PUT http://localhost:3000/api/users/me`
- Test Data: `{"shipping_address": "A" × 256, "name": "Nguyen Van Test", "phone": "0912345678"}`

**GitHub Issue:** https://github.com/AkiraTomori/eshop-sut/issues/41
**Linked Test Cases:** TC-FR04-NEG-011, TC-FR04-BV-014

---

### Bug Report Self-Audit (AGENTS.md §7 + theory-test-report.md §6)

```
✅ Bug ID assigned in BUG-FR04-[###] format for all 10 reports
✅ Problem summary follows: [Objective] + [Actual Result] (Expected: [Expected Result])
✅ Steps to reproduce are numbered and complete for each report
✅ Preconditions stated for each report
✅ Exact actual result (HTTP code, error message, stored value) documented
✅ Environment specified for each report (OS, tool, endpoint, test data)
✅ Severity assigned by QA — NOT by developer:
     BUG-FR04-003 (Expired JWT accepted): Fatal
     BUG-FR04-009 (Role escalation): Fatal
     BUG-FR04-001 (Wrong phone validation range): Serious
     BUG-FR04-004 (Empty name accepted): Serious
     BUG-FR04-005 (Name > 255 accepted): Serious
     BUG-FR04-006 (Missing name accepted): Serious
     BUG-FR04-007 (Phone prefix not validated): Serious
     BUG-FR04-008 (Non-numeric / too-long phone accepted): Serious
     BUG-FR04-010 (Address > 255 accepted): Serious
     BUG-FR04-002 (HTTP 403 instead of 401): Medium
✅ GitHub Issue placeholder present in every report
✅ Language is factual and non-judgmental
✅ One defect per report (BUG-FR04-008 groups two symptoms of the same root cause: absent API phone validation)
✅ All reports trace back to at least one TC-FR04-[TYPE]-[###]
```

---

**HITL Review:** Accepted
