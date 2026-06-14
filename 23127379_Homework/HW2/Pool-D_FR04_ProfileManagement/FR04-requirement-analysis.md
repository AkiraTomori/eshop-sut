## Requirement Analysis — FR-04: Personal Profile Management
**Date:** 2026-06-14 16:49
**Analyst:** Gemini QA Agent (reviewed by: Thái Minh Huy)
**SRS Version:** 2.0 (2026-05-14)

### Knowledge Sources Referenced
- SRS §2 (FR-04, FR-01 password constraints for cross-reference)
- SRS §9 (SEC-02, SEC-06 security requirements)
- SRS §7 (FR-20 Mobile feature set)
- SRS §8 (FR-21 through FR-24 GUI requirements, applicable to Mobile UI forms)
- API Spec §2 (§2.1 GET /api/users/me, §2.2 PUT /api/users/me)

---

### Feature Scope
- **Platform:** Mobile App (React Native + Expo)
- **Access URL:** LAN IP of host (mobile device)
- **API Endpoints Used:**
  - `GET /api/users/me` — Retrieve current user profile (authenticated)
  - `PUT /api/users/me` — Update current user profile (authenticated)

---

### Input Variables

| # | Variable Name | Data Type | Constraints | Source Req. ID |
|---|--------------|-----------|-------------|----------------|
| 1 | **JWT Token** (Authorization Header) | string | Required. Must be a valid JWT token issued at login. Sent as `Authorization: Bearer <token>` header. Without it, request must be rejected. | FR-04, SEC-02 |
| 2 | **Full Name** (`name`) | string | Updatable field. Must not be empty (implied by profile completeness; SRS does not specify an explicit max length for updates — see ⚠️ AMBIGUITY-01). At least 1 character required based on registration rule (FR-01). | FR-04, FR-01 |
| 3 | **Phone Number** (`phone`) | string | Starts with digit `0`; total length must be 10–11 digits; only numeric characters allowed (implied by "digits"). | FR-04 |
| 4 | **Default Shipping Address** (`shipping_address`) | string | Updatable field. No explicit maximum length defined in SRS (see ⚠️ AMBIGUITY-02). Optional vs. mandatory not explicitly stated (see ⚠️ AMBIGUITY-03). | FR-04 |
| 5 | **Email** (`email`) | string | **Read-only.** Email cannot be changed through the interface. Any attempt to include `email` in the update payload must be ignored by the system. | FR-04 |
| 6 | **Role** (`role`) | enum | **Client cannot modify.** The `role` attribute cannot be changed from the client side (e.g., escalating from `user` to `admin`). System must silently ignore or reject any `role` field in the update request body. | FR-04, SEC-06 |

---

### Output Variables

| # | Output Variable | Output Type | Expected Value / Message | Condition | Source Req. ID |
|---|----------------|-------------|--------------------------|-----------|----------------|
| 1 | **Profile update success response** | HTTP Response + UI feedback | HTTP 200 OK; profile data updated in the system; UI shows success notification (toast or confirmation screen) | All mandatory fields provided with valid data; valid JWT token present | FR-04 |
| 2 | **Updated profile displayed** | UI state change | The Profile screen reflects the newly saved `name`, `phone`, and `shipping_address` values immediately after successful update | After successful PUT /api/users/me | FR-04 |
| 3 | **Authentication error** | HTTP Response + UI feedback | HTTP 401 Unauthorized; UI displays an appropriate error message indicating user is not logged in | No valid JWT token provided / token expired | FR-04, SEC-02 |
| 4 | **Invalid phone number error** | UI feedback / HTTP Response | Error message indicating invalid phone format (must start with `0`, be 10–11 digits) | `phone` value does not start with `0`, or length < 10 or > 11 digits, or contains non-numeric characters | FR-04 |
| 5 | **Email field immutability** | UI behaviour | Email input field is disabled / read-only in the mobile UI; the field cannot be edited | User attempts to click or edit the email field | FR-04 |
| 6 | **Role field absent from UI** | UI behaviour | No `role` field is displayed or editable on the Profile screen | At all times on the Profile Update screen | FR-04, SEC-06 |
| 7 | **Profile data loaded on entry** | UI state | `GET /api/users/me` response pre-populates the form fields with current `name`, `phone`, `shipping_address`, `email` | User navigates to the Profile screen while authenticated | FR-04 |
| 8 | **Role escalation rejected** | HTTP Response | Server ignores or rejects any `role` field included in the PUT request body; user role remains unchanged | Malicious or accidental `role` field sent in request payload | FR-04, SEC-06 |

---

### Open Ambiguities (HITL Resolution Required)

- [ ] ⚠️ **AMBIGUITY-01** [Full Name — Minimum/Maximum Length]: SRS FR-04 states users can update Full Name but does not define a minimum or maximum character length for the update operation. FR-01 implies a non-empty name is required for registration, but the profile update endpoint may or may not enforce the same rule.
  → **Recommended clarification:** Treat empty string `""` as invalid (consistent with FR-01). For maximum length, assume the database schema default (typically 255 characters) unless SRS or DB schema specifies otherwise. HITL should confirm by inspecting the database schema or actual system behaviour.

- [ ] ⚠️ **AMBIGUITY-02** [Shipping Address — Maximum Length]: SRS FR-04 does not define a maximum character length for `shipping_address`. The API spec shows an example value of 43 characters but does not state a constraint.
  → **Recommended clarification:** Test with typical long addresses (0–255 chars) and an extreme value (1000+ chars) to discover the system boundary. Document the actual limit as a DB/system boundary in Phase 3 BVA.

- [ ] ⚠️ **AMBIGUITY-03** [Shipping Address — Mandatory vs. Optional]: SRS FR-04 says users "can update" these fields but does not state which fields are mandatory and which are optional when submitting a profile update. It is unclear whether a user may submit an update with an empty `shipping_address`.
  → **Recommended clarification:** Assume `shipping_address` is optional (user may not yet have a delivery address set). `name` is mandatory (required for account identity). `phone` is optional unless the SRS explicitly states otherwise. HITL should test an empty submission to verify.

- [ ] ⚠️ **AMBIGUITY-04** [Phone Number — Non-numeric character handling]: SRS specifies "starts with `0`, 10–11 digits long" but does not explicitly state whether the field rejects non-numeric characters (e.g., spaces, dashes like `0912-345-678`) or strips them before validation.
  → **Recommended clarification:** Treat non-numeric characters as an invalid phone input. Test with formatted phone numbers (spaces/dashes) to determine system behaviour.

- [ ] ⚠️ **AMBIGUITY-05** [Full Name — Allowed Character Set]: SRS does not define whether Full Name accepts only alphabetic characters, allows digits, allows special characters, or allows Unicode/Vietnamese diacritics (e.g., `Nguyễn Văn A`). Given the platform targets Vietnamese users (FR-21), Unicode support is expected but not guaranteed.
  → **Recommended clarification:** Assume Full Name must accept Unicode characters including Vietnamese diacritics (FR-21 language consistency). HITL should verify by testing Vietnamese names with diacritical marks.

- [ ] ⚠️ **AMBIGUITY-06** [Phone Number — Mandatory vs. Optional on Update]: Similar to AMBIGUITY-03, it is unclear whether `phone` is required when submitting the profile update form, or whether a user can submit without providing a phone number (e.g., if not set yet).
  → **Recommended clarification:** Assume `phone` is optional (a new user may not have provided a phone number). HITL should test submitting the form with `phone` field left empty to confirm expected system behaviour.

---

### Self-Audit Checklist

```
✅ Every input field in the FR's UI form is listed
✅ Every API request parameter is listed (GET /api/users/me, PUT /api/users/me)
✅ Every distinct output behaviour is listed
✅ Every variable is traced to a specific FR-XX or SEC-XX
✅ All ambiguities are flagged for HITL (6 ambiguities identified)
```

---

**HITL Review:** Accepted
