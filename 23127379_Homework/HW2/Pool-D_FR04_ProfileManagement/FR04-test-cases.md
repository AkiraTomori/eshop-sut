## Test Cases — FR-04: Personal Profile Management
**Date:** 2026-06-14 22:15
**Designer:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**Based on:** FR04-domain-analysis.md + FR04-boundary-analysis.md (approved 2026-06-14)
**Platform:** Mobile App (React Native + Expo) · API: PUT /api/users/me · GET /api/users/me

---

## EP Test Cases (Valid)

---
**Test Case ID:** TC-FR04-EP-001
**Title:** Verify that profile update succeeds with all valid fields and a 10-digit phone number
**Description:** Covers the primary valid path: authenticated user submits a PUT request with valid name, valid 10-digit phone starting with `0`, and a non-empty shipping address. Verifies the API returns HTTP 200 and the mobile UI reflects updated values. Covers EC-FR04-001, 005, 010, 012, 016, 019, 021, 023, 025, 026.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Mobile app is running and connected to the backend via LAN
  3. Test user account `test@eshop.com` / `Test1234!` exists in the system
  4. User is logged in on the mobile app; a valid JWT token is stored in the client session
**Steps:**
  1. Navigate to the Profile screen on the mobile app
  2. Observe that all current profile fields (name, phone, address, email) are pre-populated from `GET /api/users/me`
  3. Clear the Full Name field and enter `"Nguyen Van Test"`
  4. Clear the Phone Number field and enter `"0912345678"` (10 digits, starts with `0`)
  5. Clear the Shipping Address field and enter `"123 Le Loi Street, District 1, Ho Chi Minh City"`
  6. Confirm the Email field is read-only and cannot be modified
  7. Tap the Save / Update button
  8. Observe the UI response and verify the profile screen reflects the updated values
**Test Data:**
  - Input: `name = "Nguyen Van Test"`, `phone = "0912345678"`, `shipping_address = "123 Le Loi Street, District 1, Ho Chi Minh City"`, `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 200 OK; profile updated in database; UI shows success notification
**Expected Result:** The system returns HTTP 200 OK. A success notification (toast or confirmation message) is displayed on the mobile screen. The Profile screen immediately shows `name = "Nguyen Van Test"`, `phone = "0912345678"`, and `shipping_address = "123 Le Loi Street, District 1, Ho Chi Minh City"`. The email field remains unchanged and read-only.
**Observed Result:** The system fails to process the valid 10-digit phone number. A validation error message stating "Lỗi, Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số" is triggered on the mobile UI screen, blocking the profile update. The database state remains unchanged.
**Status:** Failed
**EC Coverage:** EC-FR04-001, EC-FR04-005, EC-FR04-010, EC-FR04-012, EC-FR04-016, EC-FR04-019, EC-FR04-021, EC-FR04-023, EC-FR04-025, EC-FR04-026
**Req. Ref:** FR-04, SEC-02
**Bug ID:** BUG-FR04-001

---
**Test Case ID:** TC-FR04-EP-002
**Title:** Verify that profile update succeeds with a valid 11-digit phone number
**Description:** Covers the second valid phone-length class: authenticated user submits an update with an 11-digit phone number starting with `0`. Verifies the system accepts both 10-digit and 11-digit phones as valid. Covers EC-FR04-013.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Mobile app is running and connected to the backend
  3. User is logged in; valid JWT token is available
**Steps:**
  1. Navigate to the Profile screen on the mobile app
  2. Clear the Phone Number field and enter `"01234567890"` (11 digits, starts with `0`)
  3. Leave the Full Name and Shipping Address fields with their current or valid values
  4. Tap the Save / Update button
  5. Observe the UI response
**Test Data:**
  - Input: `phone = "01234567890"`, `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 200 OK; phone updated in database; UI shows success notification
**Expected Result:** The system returns HTTP 200 OK. A success notification is displayed. The Profile screen shows `phone = "01234567890"`. No error message is displayed.
**Observed Result:** The system fails to process the valid 11-digit phone number. A validation error message stating "Lỗi, Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số" is triggered on the mobile UI screen, blocking the profile update. The database state remains unchanged.
**Status:** Failed
**EC Coverage:** EC-FR04-001, EC-FR04-013, EC-FR04-016, EC-FR04-025
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-001

---
**Test Case ID:** TC-FR04-EP-003
**Title:** Verify that profile update succeeds when optional phone and address fields are left empty
**Description:** Covers the optional field behaviour: user submits a profile update with only the Full Name provided; phone and shipping address are omitted/empty. Verifies the system does not reject the request due to missing optional fields. Covers EC-FR04-009, EC-FR04-018.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Mobile app is running and connected to the backend
  3. User is logged in; valid JWT token is available
**Steps:**
  1. Navigate to the Profile screen on the mobile app
  2. Enter `"Nguyen Van A"` in the Full Name field
  3. Clear the Phone Number field entirely (leave empty)
  4. Clear the Shipping Address field entirely (leave empty)
  5. Tap the Save / Update button
  6. Observe the UI response
**Test Data:**
  - Input: `name = "Nguyen Van A"`, `phone = ""`, `shipping_address = ""`, `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 200 OK; name updated; phone and address cleared or unchanged in database
**Expected Result:** The system returns HTTP 200 OK. A success notification is displayed. No validation error is shown for the empty phone or address fields. The Profile screen shows `name = "Nguyen Van A"` and the phone/address fields reflect the submitted empty state (or retain previous values depending on server implementation).
**Observed Result:** The system failed to process update profile, it's still said "Lỗi, Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số".
**Status:** Failed
**EC Coverage:** EC-FR04-001, EC-FR04-005, EC-FR04-009, EC-FR04-018, EC-FR04-021, EC-FR04-023, EC-FR04-025
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-001

---
**Test Case ID:** TC-FR04-EP-004
**Title:** Verify that the Profile screen pre-populates existing user data upon navigation
**Description:** Covers the GET /api/users/me profile load behaviour: when an authenticated user navigates to the Profile screen, the system fetches and displays the current profile data in all form fields. Also verifies that the email field is rendered as read-only and no role field is displayed. Covers EC-FR04-029, EC-FR04-030, EC-FR04-031.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Mobile app is running and connected to the backend
  3. User is logged in with known profile data: `name = "Test User"`, `email = "test@eshop.com"`, `phone = "0123456789"`, `shipping_address = "Test Address"`
**Steps:**
  1. From the mobile app home screen, navigate to the Profile screen
  2. Observe the form fields upon screen load (before any user interaction)
  3. Attempt to tap / interact with the Email field
  4. Inspect the screen for any `role` field, dropdown, or input
**Test Data:**
  - Input: `GET /api/users/me` called with `Authorization: Bearer <valid_token>`
  - Expected Output: Profile fields populated with existing data; email field non-editable; no role field visible
**Expected Result:**
  (a) The Full Name field displays the user's current stored name (`"Test User"`)
  (b) The Email field displays `"test@eshop.com"` but is rendered as disabled/read-only — tapping it produces no cursor or edit interaction
  (c) The Phone field displays the stored phone number
  (d) The Shipping Address field displays the stored address
  (e) No `role` field, label, or editable control exists anywhere on the Profile screen
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-001, EC-FR04-029, EC-FR04-030, EC-FR04-031
**Req. Ref:** FR-04, SEC-06
**Bug ID:** None

---

## NEG Test Cases (Invalid — one per invalid EC)

---
**Test Case ID:** TC-FR04-NEG-001
**Title:** Verify that profile update is rejected when no Authorization header is provided
**Description:** Covers EC-FR04-002: a PUT request to /api/users/me sent without any Authorization header must be rejected with HTTP 401.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Postman or equivalent API tool is available
**Steps:**
  1. Open Postman and create a PUT request to `http://localhost:3000/api/users/me`
  2. Set the request body to: `{"name": "Test", "phone": "0912345678", "shipping_address": "Test Address"}`
  3. Do NOT include any Authorization header
  4. Send the request
  5. Observe the HTTP response code and body
**Test Data:**
  - Input: No `Authorization` header; body: `{"name": "Test", "phone": "0912345678", "shipping_address": "Test Address"}`
  - Expected Output: HTTP 401 Unauthorized
**Expected Result:** The server returns HTTP 401 Unauthorized. The response body contains an error message indicating the request is unauthenticated (e.g., `{"message": "Unauthorized"}` or equivalent). The profile data in the database remains unchanged.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-002, EC-FR04-027
**Req. Ref:** FR-04, SEC-02
**Bug ID:** None

---
**Test Case ID:** TC-FR04-NEG-002
**Title:** Verify that profile update is rejected when the Authorization token is malformed
**Description:** Covers EC-FR04-003: a PUT request with a structurally invalid JWT (not a valid token format) must be rejected with HTTP 401.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Postman or equivalent API tool is available
**Steps:**
  1. Open Postman and create a PUT request to `http://localhost:3000/api/users/me`
  2. Set the request body to: `{"name": "Test", "phone": "0912345678", "shipping_address": "Test Address"}`
  3. Set the Authorization header to: `Bearer thisisnotavalidjwt`
  4. Send the request
  5. Observe the HTTP response code and body
**Test Data:**
  - Input: `Authorization: Bearer thisisnotavalidjwt`; body: `{"name": "Test", "phone": "0912345678", "shipping_address": "Test Address"}`
  - Expected Output: HTTP 401 Unauthorized
**Expected Result:** The server returns HTTP 401 Unauthorized. The response body contains an error message indicating invalid or unparseable token. The profile data in the database remains unchanged.
**Observed Result:** The server returns HTTP 403 Forbidden. The profile data in the database remains unchanged.
**Status:** Failed
**EC Coverage:** EC-FR04-003, EC-FR04-027
**Req. Ref:** FR-04, SEC-02
**Bug ID:** BUG-FR04-002

---
**Test Case ID:** TC-FR04-NEG-003
**Title:** Verify that profile update is rejected when the JWT token has expired
**Description:** Covers EC-FR04-004 (G4 split from EC-003): a structurally valid JWT that has passed its expiry time must be rejected with HTTP 401. This is distinct from a malformed token — the server must validate token expiry separately.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. An expired JWT token is available (obtained from a previous session that has since timed out, or manually crafted with a past `exp` claim)
  3. Postman or equivalent API tool is available
**Steps:**
  1. Open Postman and create a PUT request to `http://localhost:3000/api/users/me`
  2. Set the request body to: `{"name": "Test", "phone": "0912345678", "shipping_address": "Test Address"}`
  3. Set the Authorization header to: `Bearer <expired_jwt_token>`
  4. Send the request
  5. Observe the HTTP response code and body
**Test Data:**
  - Input: `Authorization: Bearer <expired_jwt_token>`; body: `{"name": "Test", "phone": "0912345678", "shipping_address": "Test Address"}`
  - Expected Output: HTTP 401 Unauthorized
**Expected Result:** The server returns HTTP 401 Unauthorized. The response body contains an error message indicating an expired or invalid token. The profile data in the database remains unchanged.
**Observed Result:** Server returns HTTP 200 OK and the profile is successfully updated, instead of rejecting with HTTP 401. The expired token was incorrectly accepted.
**Status:** Failed
**EC Coverage:** EC-FR04-004, EC-FR04-027
**Req. Ref:** FR-04, SEC-02
**Bug ID:** BUG-FR04-003

---
**Test Case ID:** TC-FR04-NEG-004
**Title:** Verify that profile update API rejects request when the Full Name field is submitted as an empty string
**Description:** Covers EC-FR04-006: sending a PUT request to /api/users/me with an empty string `""` for the mandatory `name` field must be strictly rejected at the API layer to safeguard data identity contracts.
**Priority:** High
**Pre-conditions:**
  1. EShop backend server is running at `http://localhost:3000`
  2. Postman or equivalent API testing tool is active
  3. Test user account `test@eshop.com` is authenticated; a valid JWT session token is available
**Steps:**
  1. Open Postman and configure a `PUT` request targeting the route: `http://localhost:3000/api/users/me`
  2. Add the authentication key to the headers container: `Authorization: Bearer <valid_token>`
  3. Configure the raw JSON body payload, explicitly setting the name parameter to empty:
     ```json
     {
       "name": "",
       "phone": "0912345678",
       "shipping_address": "Test Address"
     }
     ```
  4. Click the "Send" button to transmit the payload network stream
  5. Observe and audit the returned HTTP response status code and message body
  6. Perform a verification check: send a `GET` request to `/api/users/me` to inspect if any database cell mutation occurred
**Test Data:**
  - Input: `name = ""`, `phone = "0912345678"`, `shipping_address = "Test Address"`, `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 400 Bad Request or equivalent server-side validation rejection code
**Expected Result:** The server backend must aggressively reject the update payload. The API returns an HTTP 400 Bad Request status code with a clear validation error string specifying that the name field cannot be empty. A subsequent validation GET request confirms the profile data row inside the SQLite database remains completely unchanged.
**Observed Result:** The system did not reject the update via the API. The API failed to return an HTTP 400 Bad Request code, returning a false-positive HTTP 200 OK instead. The user profile row cell in the SQLite database was corrupted, successfully changing the name value to blank `""`.
**Status:** Failed
**EC Coverage:** EC-FR04-006
**Req. Ref:** FR-04, FR-01
**Bug ID:** BUG-FR04-004

---
**Test Case ID:** TC-FR04-NEG-005
**Title:** Verify that profile update is rejected when the Full Name exceeds 255 characters
**Description:** Covers EC-FR04-007: submitting a name longer than 255 characters (the assumed DB column ceiling) must be rejected at the API or DB layer.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Postman or equivalent API tool is available for direct API testing
  3. A valid JWT token is available
**Steps:**
  1. Open Postman and create a PUT request to `http://localhost:3000/api/users/me`
  2. Construct a name string of exactly 256 characters (e.g., `"A" × 256`)
  3. Set the request body to: `{"name": "<256-char-string>", "phone": "0912345678", "shipping_address": "Test Address"}`
  4. Set Authorization header to `Bearer <valid_token>`
  5. Send the request
  6. Observe the HTTP response code and body
  7. Also verify the database value is not silently truncated (query the database if accessible)
**Test Data:**
  - Input: `name = "AAAA...A"` (256 characters), `phone = "0912345678"`, `shipping_address = "Test Address"`, `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 400 Bad Request or equivalent rejection; or observable DB truncation error
**Expected Result:** The system rejects the update with HTTP 400 Bad Request and an error message indicating the name is too long. The profile data in the database remains unchanged. (If the system silently truncates to 255 chars and returns HTTP 200 without error, this is a defect and must be filed as a bug.)
**Observed Result:** The system didn't reject the update with HTTP 400 Bad Request and an error message indicating the name is too long. The profile data in the database changed. The system didn't silently truncate to 255 chars
**Status:** Failed
**EC Coverage:** EC-FR04-007
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-005

---
**Test Case ID:** TC-FR04-NEG-006
**Title:** Verify that profile update is rejected when the Full Name field is omitted from the request body
**Description:** Covers EC-FR04-008: sending a PUT request body without the `name` key at all (null / missing field) must be rejected by the API, as Full Name is mandatory.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Postman is available for direct API testing
  3. A valid JWT token is available
**Steps:**
  1. Open Postman and create a PUT request to `http://localhost:3000/api/users/me`
  2. Set the request body to: `{"phone": "0912345678", "shipping_address": "Test Address"}` — intentionally omit the `name` key
  3. Set Authorization header to `Bearer <valid_token>`
  4. Send the request
  5. Observe the HTTP response code and body
**Test Data:**
  - Input: `{"phone": "0912345678", "shipping_address": "Test Address"}` (no `name` key), `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 400 Bad Request or validation error indicating `name` is required
**Expected Result:** The server returns HTTP 400 Bad Request with an error message indicating the `name` field is missing or required. The profile data in the database remains unchanged.
**Observed Result:** The server didn't return HTTP 400 Bad Request, return status HTTP 200. The profile data in the database changed.
**Status:** Failed
**EC Coverage:** EC-FR04-008
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-006

---
**Test Case ID:** TC-FR04-NEG-007
**Title:** Verify that profile update rejects a phone number that does not start with digit 0
**Description:** Covers EC-FR04-011: a phone number that starts with any digit other than `0` (e.g., `1`, `9`, `+`) must be rejected by the system per the SRS prefix rule.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Mobile app is running and connected to the backend, OR Postman is available
  3. User is logged in; valid JWT token is available
**Steps:**
  1. Navigate to the Profile screen on the mobile app
  2. Enter `"Nguyen Van Test"` in the Full Name field
  3. Enter `"1912345678"` in the Phone Number field (starts with `1`, not `0`)
  4. Enter `"Test Address"` in the Shipping Address field
  5. Tap the Save / Update button
  6. Observe the UI response
**Test Data:**
  - Input: `name = "Nguyen Van Test"`, `phone = "1912345678"`, `shipping_address = "Test Address"`, `Authorization: Bearer <valid_token>`
  - Expected Output: Validation error message indicating phone must start with `0`
**Expected Result:** The system rejects the update. An error message is displayed on the mobile UI (or returned by the API) indicating the phone number must start with the digit `0`. The profile data in the database remains unchanged.
**Observed Result:** The system didn't reject the update. There is no error message is displayed indicating the phone number must start with the digit `0` on the mobile UI. The profile data in the database changed.
**Status:** Failed
**EC Coverage:** EC-FR04-011, EC-FR04-028
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-007

---
**Test Case ID:** TC-FR04-NEG-008
**Title:** Verify that profile update rejects a phone number shorter than 10 digits
**Description:** Covers EC-FR04-014: a phone number of 9 digits (starts with `0`, but too short) must be rejected by the system.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Mobile app is running and connected to the backend, OR Postman is available
  3. User is logged in; valid JWT token is available
**Steps:**
  1. Navigate to the Profile screen on the mobile app
  2. Enter `"Nguyen Van Test"` in the Full Name field
  3. Enter `"012345678"` in the Phone Number field (9 digits, starts with `0`)
  4. Enter `"Test Address"` in the Shipping Address field
  5. Tap the Save / Update button
  6. Observe the UI response
**Test Data:**
  - Input: `name = "Nguyen Van Test"`, `phone = "012345678"`, `shipping_address = "Test Address"`, `Authorization: Bearer <valid_token>`
  - Expected Output: Validation error message indicating phone must be 10–11 digits
**Expected Result:** The system rejects the update. An error message is displayed indicating the phone number must be 10–11 digits long. The profile data in the database remains unchanged.
**Observed Result:** The system rejects the update. An error message is displayed indicating the phone number must be 9-10 digits long. The profile data in the database remains unchanged.
**Status:** Failed
**EC Coverage:** EC-FR04-014, EC-FR04-028
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-001

---
**Test Case ID:** TC-FR04-NEG-009
**Title:** Verify that profile update rejects a phone number longer than 11 digits
**Description:** Covers EC-FR04-015: a phone number of 12 digits (starts with `0`, but too long) must be rejected by the system.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Mobile app is running and connected to the backend, OR Postman is available
  3. User is logged in; valid JWT token is available
**Steps:**
  1. Navigate to the Profile screen on the mobile app
  2. Enter `"Nguyen Van Test"` in the Full Name field
  3. Enter `"012345678901"` in the Phone Number field (12 digits, starts with `0`)
  4. Enter `"Test Address"` in the Shipping Address field
  5. Tap the Save / Update button
  6. Observe the UI response
**Test Data:**
  - Input: `name = "Nguyen Van Test"`, `phone = "012345678901"`, `shipping_address = "Test Address"`, `Authorization: Bearer <valid_token>`
  - Expected Output: Validation error message indicating phone must be 10–11 digits
**Expected Result:** The system rejects the update. An error message is displayed indicating the phone number must be 10–11 digits long. The profile data in the database remains unchanged.
**Observed Result:** The system rejects the update. But an error message is dislayed indicating the phone number must be 9-10 digits long. The profile data in the database remains unchanged.
**Status:** Failed
**EC Coverage:** EC-FR04-015, EC-FR04-028
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-001

---
**Test Case ID:** TC-FR04-NEG-010
**Title:** Verify that profile update API rejects request when the phone number contains non-numeric characters
**Description:** Covers EC-FR04-017: sending a PUT request body with a phone value containing spaces, dashes, or formatting characters must be blocked by the server validation layer to enforce strict numeric constraints.
**Priority:** High
**Pre-conditions:**
  1. EShop backend server is running at `http://localhost:3000`
  2. Postman or equivalent API testing tool is active
  3. Test user account `test@eshop.com` is authenticated; a valid JWT session token is available
**Steps:**
  1. Open Postman and configure a `PUT` request targeting the route: `http://localhost:3000/api/users/me`
  2. Add the authentication key to the headers container: `Authorization: Bearer <valid_token>`
  3. Configure the raw JSON body payload, injecting invalid dash markers inside the phone parameter cell:
     ```json
     {
       "name": "Nguyen Van Test",
       "phone": "0912-345-678",
       "shipping_address": "Test Address"
     }
     ```
  4. Click the "Send" button to transmit the payload network stream
  5. Observe and audit the returned HTTP response status code and message body
  6. Perform a verification check: send a `GET` request to `/api/users/me` to inspect if the formatting characters bypassed storage filters
**Test Data:**
  - Input: `name = "Nguyen Van Test"`, `phone = "0912-345-678"`, `shipping_address = "Test Address"`, `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 400 Bad Request or equivalent server-side format validation rejection code
**Expected Result:** The server backend must reject the formatted string entry. The API returns an HTTP 400 Bad Request status code with a validation error response indicating that the phone number must exclusively contain numeric digits (0-9). The stored phone number row cell in the database remains unchanged.
**Observed Result:** The backend API failed to evaluate or reject the non-numeric input parameters, returning an HTTP 200 OK response code instead. The formatted character string `"0912-345-678"` bypassed server checks and successfully committed into the database record cell.
**Status:** Failed
**EC Coverage:** EC-FR04-017, EC-FR04-028
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-008

---
**Test Case ID:** TC-FR04-NEG-011
**Title:** Verify that profile update is rejected when the shipping address exceeds 255 characters
**Description:** Covers EC-FR04-020: submitting an address longer than 255 characters must be rejected at the API or DB layer. HITL confirmed the 255-char DB baseline from Phase 2.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Postman is available for direct API testing
  3. A valid JWT token is available
**Steps:**
  1. Open Postman and create a PUT request to `http://localhost:3000/api/users/me`
  2. Construct an address string of exactly 256 characters (e.g., `"A" × 256`)
  3. Set the request body to: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "<256-char-string>"}`
  4. Set Authorization header to `Bearer <valid_token>`
  5. Send the request
  6. Observe the HTTP response code and body
**Test Data:**
  - Input: `name = "Nguyen Van Test"`, `phone = "0912345678"`, `shipping_address = "AAAA...A"` (256 characters), `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 400 Bad Request or equivalent; profile not updated in database
**Expected Result:** The system returns HTTP 400 Bad Request with an error message indicating the shipping address is too long. The profile data in the database remains unchanged. (If the system silently truncates and returns HTTP 200, this is a defect to be filed as a bug.)
**Observed Result:** The system didn't return HTTP 400 Bad Request with an message indicating the shipping address is too long. The profile data in the database changed.
**Status:** Failed
**EC Coverage:** EC-FR04-020
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-010

---
**Test Case ID:** TC-FR04-NEG-012
**Title:** Verify that a PUT request attempting to change the email address is silently ignored by the API
**Description:** Covers EC-FR04-022: including an `email` field in the PUT /api/users/me request body must not result in any change to the user's stored email address. HITL confirmed dual-layer enforcement: UI disables the field AND the API ignores the key.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Postman is available for direct API testing
  3. User `test@eshop.com` is logged in; valid JWT token is available
  4. The user's current email is confirmed as `test@eshop.com`
**Steps:**
  1. Open Postman and create a PUT request to `http://localhost:3000/api/users/me`
  2. Set the request body to: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "Test Address", "email": "attacker@evil.com"}`
  3. Set Authorization header to `Bearer <valid_token>`
  4. Send the request
  5. Observe the HTTP response code
  6. Send a GET request to `http://localhost:3000/api/users/me` with the same token
  7. Verify the `email` field in the response still shows `test@eshop.com`
**Test Data:**
  - Input: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "Test Address", "email": "attacker@evil.com"}`, `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 200 OK (or any non-error response); email in database remains `test@eshop.com`
**Expected Result:** The API processes the request and returns HTTP 200 OK (updating only name, phone, and address). The `email` field in the request body is silently ignored. A subsequent GET /api/users/me confirms the user's email is still `test@eshop.com` — unchanged. If the email is changed to `attacker@evil.com`, this is a critical security defect.
**Observed Result:** The API processes the request and returns HTTP 200 OK (updating only name, phone, and address). The `email` field in the request body is silently ignored. A subsequent GET /api/users/me confirms the user's email is still `test@eshop.com` — unchanged.
**Status:** Passed
**EC Coverage:** EC-FR04-022
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-NEG-013
**Title:** Verify that a PUT request attempting to escalate user role to admin is rejected or silently ignored
**Description:** Covers EC-FR04-024 (SEC-06): including a `role` field in the PUT /api/users/me request body must not result in any change to the user's stored role. This is a security-critical test.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Postman is available for direct API testing
  3. User `test@eshop.com` is logged in; valid JWT token is available
  4. The user's current role is confirmed as `user` (not `admin`)
**Steps:**
  1. Open Postman and create a PUT request to `http://localhost:3000/api/users/me`
  2. Set the request body to: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "Test Address", "role": "admin"}`
  3. Set Authorization header to `Bearer <valid_token>`
  4. Send the request
  5. Observe the HTTP response code
  6. Send a GET request to `http://localhost:3000/api/users/me` with the same token
  7. Verify the `role` field in the response still shows `user`
  8. Attempt to access an admin-only endpoint (e.g., `GET /api/admin/users`) with the same token to confirm no privilege was gained
**Test Data:**
  - Input: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "Test Address", "role": "admin"}`, `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 200 OK (only valid fields updated); role in database remains `user`; admin endpoint returns HTTP 403
**Expected Result:** The API processes the request and returns HTTP 200 OK (updating only name, phone, and address). The `role` field is silently ignored. A subsequent GET /api/users/me confirms `role = "user"`. An attempt to call an admin-only endpoint with the same token returns HTTP 403 Forbidden. If the role is changed to `admin`, this is a **critical security vulnerability** and must be filed immediately.
**Observed Result:** The `role` field is not ignored. A subsequent GET /api/users/me confirms `role = "admin"`.
**Status:** Failed
**EC Coverage:** EC-FR04-024, EC-FR04-032
**Req. Ref:** FR-04, SEC-06
**Bug ID:** BUG-FR04-009

---

## BV Test Cases (Boundary)

---
**Test Case ID:** TC-FR04-BV-001
**Title:** Verify that profile update succeeds when Full Name is exactly 1 character (lower boundary)
**Description:** BVA on Full Name length — LB point. A single-character name is the minimum valid value per the non-empty constraint derived from FR-01.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available
**Steps:**
  1. Open Postman and send a PUT request to `http://localhost:3000/api/users/me`
  2. Set body: `{"name": "A", "phone": "0912345678", "shipping_address": "Test Address"}`
  3. Set Authorization header to `Bearer <valid_token>`
  4. Send the request and observe the response
**Test Data:**
  - Input: `name = "A"` (1 character = LB), `phone = "0912345678"`, `shipping_address = "Test Address"`
  - Expected Output: HTTP 200 OK
**Expected Result:** The system returns HTTP 200 OK. The profile is updated with `name = "A"`. No error is displayed. The 1-character name is accepted as valid.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-005
**Req. Ref:** FR-04, FR-01
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-002
**Title:** Verify that profile update succeeds when Full Name is exactly 2 characters (LB+1)
**Description:** BVA on Full Name length — LB+1 point. Confirms that values immediately above the lower boundary are also accepted.
**Priority:** Low
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available
**Steps:**
  1. Open Postman and send a PUT request to `http://localhost:3000/api/users/me`
  2. Set body: `{"name": "AB", "phone": "0912345678", "shipping_address": "Test Address"}`
  3. Set Authorization header to `Bearer <valid_token>`
  4. Send the request and observe the response
**Test Data:**
  - Input: `name = "AB"` (2 characters = LB+1), `phone = "0912345678"`, `shipping_address = "Test Address"`
  - Expected Output: HTTP 200 OK
**Expected Result:** The system returns HTTP 200 OK. The profile is updated with `name = "AB"`. No error is displayed.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-005
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-003
**Title:** Verify that profile update succeeds when Full Name is exactly 254 characters (UB-1)
**Description:** BVA on Full Name length — UB-1 point. One character below the assumed 255-char DB ceiling; must be accepted.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available; Postman available
**Steps:**
  1. Construct a string of exactly 254 characters (e.g., `"N" × 254`)
  2. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  3. Set body: `{"name": "<254-char-string>", "phone": "0912345678", "shipping_address": "Test"}`
  4. Set Authorization header to `Bearer <valid_token>`
  5. Send and observe the response
**Test Data:**
  - Input: `name = "NNN...N"` (254 characters = UB-1), `phone = "0912345678"`, `shipping_address = "Test"`
  - Expected Output: HTTP 200 OK
**Expected Result:** The system returns HTTP 200 OK. The profile is updated with the 254-character name stored correctly in the database. No truncation occurs.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-005
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-004
**Title:** Verify that profile update succeeds when Full Name is exactly 255 characters (upper boundary)
**Description:** BVA on Full Name length — UB point. The assumed DB column ceiling; this is the maximum valid name length. Critical test to confirm the system accepts exactly 255 chars without rejection or truncation.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available; Postman available
**Steps:**
  1. Construct a string of exactly 255 characters (e.g., `"N" × 255`)
  2. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  3. Set body: `{"name": "<255-char-string>", "phone": "0912345678", "shipping_address": "Test"}`
  4. Set Authorization header to `Bearer <valid_token>`
  5. Send the request and observe the response
  6. Send a GET request to verify the stored name is the full 255-char string (not truncated)
**Test Data:**
  - Input: `name = "NNN...N"` (255 characters = UB), `phone = "0912345678"`, `shipping_address = "Test"`
  - Expected Output: HTTP 200 OK; database stores all 255 characters without truncation
**Expected Result:** The system returns HTTP 200 OK. A subsequent GET /api/users/me confirms the stored name is exactly 255 characters — not truncated. No error is displayed.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-005
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-005
**Title:** Verify that profile update is rejected when Full Name is exactly 256 characters (UB+1)
**Description:** BVA on Full Name length — UB+1 point. One character above the 255-char DB ceiling; must be rejected. This is an INVALID boundary test case and must be isolated.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available; Postman available
**Steps:**
  1. Construct a string of exactly 256 characters (e.g., `"N" × 256`)
  2. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  3. Set body: `{"name": "<256-char-string>", "phone": "0912345678", "shipping_address": "Test"}`
  4. Set Authorization header to `Bearer <valid_token>`
  5. Send the request and observe the response
**Test Data:**
  - Input: `name = "NNN...N"` (256 characters = UB+1), `phone = "0912345678"`, `shipping_address = "Test"`
  - Expected Output: HTTP 400 Bad Request; name not stored or truncated
**Expected Result:** The system returns HTTP 400 Bad Request with an error message indicating the name exceeds the maximum allowed length. The database is not updated. (If HTTP 200 is returned with silent truncation to 255 chars, this is a defect — the spec boundary is violated without user feedback.)
**Observed Result:** The system didn't return HTTP 400 Bad Request with an error messgae indicating the name exceeds the maximum allowed length. The database is still updated and the API Response is 200 OK with no truncation to 255 chars.
**Status:** Failed
**EC Coverage:** EC-FR04-007
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-005

---
**Test Case ID:** TC-FR04-BV-006
**Title:** Verify that profile update is rejected when the phone number has exactly 9 digits (LB-1)
**Description:** BVA on Phone length — LB-1 point. A 9-digit phone number starting with `0` is one step below the 10-digit minimum; must be rejected.
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. Mobile app is running and connected to the backend, OR Postman available
  3. User is logged in; valid JWT token is available
**Steps:**
  1. Navigate to the Profile screen on the mobile app
  2. Enter `"Nguyen Van Test"` in Full Name
  3. Enter `"012345678"` in the Phone field (9 digits, starts with `0`)
  4. Enter `"Test Address"` in the Address field
  5. Tap Save / Update and observe the response
  6. Also test directly via Postman: `{"name": "Nguyen Van Test", "phone": "012345678", "shipping_address": "Test Address"}`
**Test Data:**
  - Input: `phone = "012345678"` (9 digits = LB-1), all other fields valid
  - Expected Output: Validation error message; phone not updated
**Expected Result:** The system rejects the update. An error message is displayed indicating the phone number must be 10–11 digits. The database is not updated.
**Observed Result:** The system rejects the update. An error message is displayed indicating the phone number must be 9–10 digits. The database is not updated.
**Status:** Failed
**EC Coverage:** EC-FR04-014, EC-FR04-028
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-001

---
**Test Case ID:** TC-FR04-BV-007
**Title:** Verify that profile update succeeds when the phone number has exactly 10 digits (lower boundary)
**Description:** BVA on Phone length — LB point. A 10-digit phone number starting with `0` is the exact lower boundary; must be accepted. (Supplements TC-FR04-EP-001 with a dedicated boundary-focused test.)
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available
**Steps:**
  1. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  2. Set body: `{"name": "Nguyen Van Test", "phone": "0123456789", "shipping_address": "Test Address"}`
  3. Set Authorization header to `Bearer <valid_token>`
  4. Send and observe the response
**Test Data:**
  - Input: `phone = "0123456789"` (10 digits = LB)
  - Expected Output: HTTP 200 OK; phone updated
**Expected Result:** The system returns HTTP 200 OK. The phone number `"0123456789"` is stored. No error is displayed.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-012
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-008
**Title:** Verify that profile update succeeds when the phone number has exactly 11 digits (upper boundary)
**Description:** BVA on Phone length — UB point. An 11-digit phone number starting with `0` is the exact upper boundary; must be accepted. (Supplements TC-FR04-EP-002 with a dedicated boundary-focused test.)
**Priority:** High
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available
**Steps:**
  1. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  2. Set body: `{"name": "Nguyen Van Test", "phone": "01234567890", "shipping_address": "Test Address"}`
  3. Set Authorization header to `Bearer <valid_token>`
  4. Send and observe the response
**Test Data:**
  - Input: `phone = "01234567890"` (11 digits = UB)
  - Expected Output: HTTP 200 OK; phone updated
**Expected Result:** The system returns HTTP 200 OK. The phone number `"01234567890"` is stored. No error is displayed.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-013
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-009
**Title:** Verify that profile update API rejects request when the phone number has exactly 12 digits (UB+1)
**Description:** Covers EC-FR04-015 (via BV-FR04-009): sending a PUT request body with a 12-digit phone number (one unit above the 11-digit maximum constraint) must be rejected by the backend validation filters to maintain data integrity.
**Priority:** High
**Pre-conditions:**
  1. EShop backend server is running at `http://localhost:3000`
  2. Postman or equivalent API testing tool is active
  3. Test user account `test@eshop.com` is authenticated; a valid JWT session token is available
**Steps:**
  1. Open Postman and configure a `PUT` request targeting the route: `http://localhost:3000/api/users/me`
  2. Add the authentication key to the headers container: `Authorization: Bearer <valid_token>`
  3. Configure the raw JSON body payload, injecting an over-length 12-digit phone number string:
     ```json
     {
       "name": "Nguyen Van Test",
       "phone": "012345678901",
       "shipping_address": "Test Address"
     }
     ```
  4. Click the "Send" button to transmit the payload network stream
  5. Observe and audit the returned HTTP response status code and message body
  6. Perform a verification check: send a `GET` request to `/api/users/me` to inspect if the over-length string was written to the DB row
**Test Data:**
  - Input: `name = "Nguyen Van Test"`, `phone = "012345678901"` (12 digits = UB+1), `shipping_address = "Test Address"`, `Authorization: Bearer <valid_token>`
  - Expected Output: HTTP 400 Bad Request or equivalent server-side length validation rejection code
**Expected Result:** The server backend must aggressively reject the update request due to the upper-bound violation. The API returns an HTTP 400 Bad Request status code with a clear validation error string specifying that the phone number must be 10–11 digits. The stored phone number row cell in the SQLite database remains completely unchanged.
**Observed Result:** The backend API failed to evaluate or reject the upper-bound violation, returning a false-positive HTTP 200 OK response code instead. The over-length 12-digit phone string `"012345678901"` bypassed server checks and was committed directly into the database record cell without truncation.
**Status:** Failed
**EC Coverage:** EC-FR04-015, EC-FR04-028
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-008

---
**Test Case ID:** TC-FR04-BV-010
**Title:** Verify that profile update succeeds when the shipping address is exactly 1 character (lower boundary)
**Description:** BVA on Shipping Address length — LB point. A 1-character address is the minimum non-empty value; must be accepted.
**Priority:** Low
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available
**Steps:**
  1. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  2. Set body: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "A"}`
  3. Set Authorization header to `Bearer <valid_token>`
  4. Send and observe the response
**Test Data:**
  - Input: `shipping_address = "A"` (1 character = LB)
  - Expected Output: HTTP 200 OK
**Expected Result:** The system returns HTTP 200 OK. The address `"A"` is stored. No error is displayed.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-019
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-011
**Title:** Verify that profile update succeeds when the shipping address is exactly 2 characters (LB+1)
**Description:** BVA on Shipping Address length — LB+1 point. Confirms values immediately above the minimum are accepted.
**Priority:** Low
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available
**Steps:**
  1. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  2. Set body: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "AB"}`
  3. Set Authorization header to `Bearer <valid_token>`
  4. Send and observe the response
**Test Data:**
  - Input: `shipping_address = "AB"` (2 characters = LB+1)
  - Expected Output: HTTP 200 OK
**Expected Result:** The system returns HTTP 200 OK. The address `"AB"` is stored. No error is displayed.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-019
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-012
**Title:** Verify that profile update succeeds when the shipping address is exactly 254 characters (UB-1)
**Description:** BVA on Shipping Address length — UB-1 point. One character below the 255-char DB ceiling; must be accepted.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available; Postman available
**Steps:**
  1. Construct a string of exactly 254 characters
  2. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  3. Set body: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "<254-char-string>"}`
  4. Set Authorization header to `Bearer <valid_token>`
  5. Send and observe the response
**Test Data:**
  - Input: `shipping_address = "AAA...A"` (254 characters = UB-1)
  - Expected Output: HTTP 200 OK; full 254-char address stored without truncation
**Expected Result:** The system returns HTTP 200 OK. A subsequent GET confirms the full 254-character address is stored. No truncation or error occurs.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-019
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-013
**Title:** Verify that profile update succeeds when the shipping address is exactly 255 characters (upper boundary)
**Description:** BVA on Shipping Address length — UB point. The assumed DB column ceiling; must be accepted without truncation.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available; Postman available
**Steps:**
  1. Construct a string of exactly 255 characters
  2. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  3. Set body: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "<255-char-string>"}`
  4. Set Authorization header to `Bearer <valid_token>`
  5. Send the request and observe the response
  6. Send a GET request to verify the stored address is the full 255-char string
**Test Data:**
  - Input: `shipping_address = "AAA...A"` (255 characters = UB)
  - Expected Output: HTTP 200 OK; full 255-char address stored
**Expected Result:** The system returns HTTP 200 OK. A subsequent GET /api/users/me confirms the address is stored as exactly 255 characters — not truncated. No error is displayed.
**Observed Result:** As Expected Result
**Status:** Passed
**EC Coverage:** EC-FR04-019
**Req. Ref:** FR-04
**Bug ID:** None

---
**Test Case ID:** TC-FR04-BV-014
**Title:** Verify that profile update is rejected when the shipping address is exactly 256 characters (UB+1)
**Description:** BVA on Shipping Address length — UB+1 point. One character above the 255-char DB ceiling; must be rejected. This is an INVALID boundary test case and must be isolated.
**Priority:** Medium
**Pre-conditions:**
  1. EShop backend is running at `http://localhost:3000`
  2. User is logged in; valid JWT token is available; Postman available
**Steps:**
  1. Construct a string of exactly 256 characters
  2. Open Postman and send PUT to `http://localhost:3000/api/users/me`
  3. Set body: `{"name": "Nguyen Van Test", "phone": "0912345678", "shipping_address": "<256-char-string>"}`
  4. Set Authorization header to `Bearer <valid_token>`
  5. Send the request and observe the response
**Test Data:**
  - Input: `shipping_address = "AAA...A"` (256 characters = UB+1)
  - Expected Output: HTTP 400 Bad Request; address not stored or truncated
**Expected Result:** The system returns HTTP 400 Bad Request with an error message indicating the address exceeds the maximum allowed length. The database is not updated. (If HTTP 200 is returned with silent truncation, this is a defect.)
**Observed Result:** The system didn't return HTTP 400 Bad Request with an error message indicating the address exceeds the maximum allowed length. The database is updated and the API Response is 200 OK with no truncation.
**Status:** Failed
**EC Coverage:** EC-FR04-020
**Req. Ref:** FR-04
**Bug ID:** BUG-FR04-010

---

## Coverage Matrix

| EC ID | Description | Type | Covered By |
|-------|-------------|:----:|------------|
| EC-FR04-001 | Valid JWT token present and active | VALID | TC-FR04-EP-001, EP-002, EP-003, EP-004, all BV TCs |
| EC-FR04-002 | No Authorization header | INVALID | TC-FR04-NEG-001 |
| EC-FR04-003 | Malformed JWT | INVALID | TC-FR04-NEG-002 |
| EC-FR04-004 | Expired JWT | INVALID | TC-FR04-NEG-003 |
| EC-FR04-005 | Full Name: non-empty, 1–255 chars, valid chars | VALID | TC-FR04-EP-001, BV-001, BV-002, BV-003, BV-004 |
| EC-FR04-006 | Full Name: empty string | INVALID | TC-FR04-NEG-004 |
| EC-FR04-007 | Full Name: length > 255 chars | INVALID | TC-FR04-NEG-005, BV-005 |
| EC-FR04-008 | Full Name: field omitted from request | INVALID | TC-FR04-NEG-006 |
| EC-FR04-009 | Phone: field omitted / empty (optional) | VALID | TC-FR04-EP-003 |
| EC-FR04-010 | Phone: starts with `0` | VALID | TC-FR04-EP-001 |
| EC-FR04-011 | Phone: does NOT start with `0` | INVALID | TC-FR04-NEG-007 |
| EC-FR04-012 | Phone: exactly 10 digits | VALID | TC-FR04-EP-001, BV-007 |
| EC-FR04-013 | Phone: exactly 11 digits | VALID | TC-FR04-EP-002, BV-008 |
| EC-FR04-014 | Phone: length < 10 digits | INVALID | TC-FR04-NEG-008, BV-006 |
| EC-FR04-015 | Phone: length > 11 digits | INVALID | TC-FR04-NEG-009, BV-009 |
| EC-FR04-016 | Phone: numeric digits only | VALID | TC-FR04-EP-001 |
| EC-FR04-017 | Phone: contains non-numeric characters | INVALID | TC-FR04-NEG-010 |
| EC-FR04-018 | Shipping Address: empty / omitted (optional) | VALID | TC-FR04-EP-003 |
| EC-FR04-019 | Shipping Address: non-empty, 1–255 chars | VALID | TC-FR04-EP-001, BV-010, BV-011, BV-012, BV-013 |
| EC-FR04-020 | Shipping Address: length > 255 chars | INVALID | TC-FR04-NEG-011, BV-014 |
| EC-FR04-021 | Email: not included in PUT payload | VALID | TC-FR04-EP-001 |
| EC-FR04-022 | Email: included in PUT payload (change attempt) | INVALID | TC-FR04-NEG-012 |
| EC-FR04-023 | Role: absent from PUT payload | VALID | TC-FR04-EP-001 |
| EC-FR04-024 | Role: included in PUT payload (escalation attempt) | INVALID | TC-FR04-NEG-013 |
| EC-FR04-025 | Output: HTTP 200 + success notification | VALID OUTPUT | TC-FR04-EP-001, EP-002, EP-003, all valid BV TCs |
| EC-FR04-026 | Output: Updated UI state after save | VALID OUTPUT | TC-FR04-EP-001 |
| EC-FR04-027 | Output: HTTP 401 Unauthorized | INVALID OUTPUT | TC-FR04-NEG-001, NEG-002, NEG-003 |
| EC-FR04-028 | Output: Phone validation error message | INVALID OUTPUT | TC-FR04-NEG-007, NEG-008, NEG-009, NEG-010, BV-006, BV-009 |
| EC-FR04-029 | Output: Email field disabled/read-only in UI | VALID OUTPUT | TC-FR04-EP-004 |
| EC-FR04-030 | Output: Role field absent from Profile screen | VALID OUTPUT | TC-FR04-EP-004 |
| EC-FR04-031 | Output: Profile data pre-loaded on screen entry | VALID OUTPUT | TC-FR04-EP-004 |
| EC-FR04-032 | Output: Role escalation silently rejected | VALID OUTPUT | TC-FR04-NEG-013 |

**Total: 4 EP test cases · 13 NEG test cases · 14 BV test cases = 31 test cases**

---

### Self-Audit Checklist (AGENTS.md §7 — Test Case Gate)

```
✅ Each invalid class has its own isolated test case (13 NEG TCs, one per invalid EC — P-01 enforced)
✅ Valid classes are efficiently combined (4 EP TCs cover all 11 valid input ECs + 8 output ECs)
✅ Every title follows: Action + Function + Condition
✅ Expected results are precise and written before execution (no vague language)
✅ Every TC references at least one EC ID and one FR/SEC ID
✅ Test cases are self-standing (pre-conditions and steps fully described)
✅ Test cases note cleanup where applicable (TC-FR04-NEG-012, NEG-013 include verification GET step)
✅ Every VALID EC → covered by at least one EP or BV TC
✅ Every INVALID EC → covered by exactly one isolated NEG TC
✅ Every BVA boundary point → covered by a dedicated BV TC
✅ All FR-04 and SEC-06 requirements referenced
```

---

**HITL Review:** Accepted
