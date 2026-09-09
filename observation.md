# Agent Observation, Execution & Notes Checklist

Use this checklist for every remediation task.

---

# A. Observation Checklist

## Requirements

* [ ] I identified the exact FR(s).
* [ ] I copied or summarized the expected behavior.
* [ ] I checked whether `README.md` and `api_specification.md` agree.
* [ ] I recorded any ambiguity.
* [ ] I did not infer intended behavior from defective code.

### Notes

```text
FR:
Expected behavior:
API contract:
Ambiguity:
```

---

## Current Implementation

* [ ] I located the relevant routes/controllers/services.
* [ ] I identified data inputs.
* [ ] I identified trusted vs untrusted data.
* [ ] I identified persistent state changes.
* [ ] I checked authentication.
* [ ] I checked authorization.
* [ ] I checked validation.
* [ ] I checked error handling.
* [ ] I checked transaction requirements.
* [ ] I checked ownership rules.

### Notes

```text
Entry point:
Inputs:
Trusted inputs:
Untrusted inputs:
Writes:
Auth:
Authorization:
Validation:
Transactions:
Ownership:
```

---

## Existing Tests

* [ ] I found related HW2 tests.
* [ ] I found related HW4 automation tests.
* [ ] I found related HW6 API tests.
* [ ] I found bug reports / GitHub issues.
* [ ] I identified current RED tests.
* [ ] I verified that test expectations match requirements.
* [ ] I recorded tests that are missing.

### Notes

```text
Relevant tests:
Current status:
Bug IDs:
Missing coverage:
Questionable tests:
```

---

# B. Root Cause Checklist

Before implementing:

* [ ] I described the observable failure.
* [ ] I found the shared root cause.
* [ ] I checked whether multiple bugs share this root cause.
* [ ] I avoided designing one patch per failing test.
* [ ] I identified the architectural layer responsible.

### Root Cause Record

```text
Observed failures:
Root cause:
Affected requirements:
Affected endpoints:
Affected tests:
Affected files:
Severity:
Priority:
```

---

# C. Scope Checklist

* [ ] I explicitly stated in-scope behavior.
* [ ] I explicitly stated out-of-scope behavior.
* [ ] I listed expected files to change.
* [ ] I listed public contracts that must remain stable.
* [ ] I identified dependencies on later stages.

### Scope Record

```text
In scope:
Out of scope:
Files expected to change:
Contracts preserved:
Dependencies:
```

---

# D. Design Checklist

* [ ] The proposed design fixes the root cause.
* [ ] Business logic is not left inside large route handlers unnecessarily.
* [ ] Input validation occurs at the system boundary.
* [ ] Authorization is reusable.
* [ ] Server-side authoritative data is used.
* [ ] Domain rules are explicit.
* [ ] Transactions are used where partial state is unsafe.
* [ ] The design is no larger than necessary.
* [ ] Existing behavior outside scope is preserved.

### Design Record

```text
Current design:
Target design:
New components:
Removed responsibilities:
Key invariants:
Risks:
```

---

# E. Security Checklist

For every externally accessible endpoint:

* [ ] Does it require authentication?
* [ ] Does it require a specific role?
* [ ] Can the user act on another user's resource?
* [ ] Can the client provide `user_id`?
* [ ] Can the client provide `role`?
* [ ] Can the client provide authoritative price?
* [ ] Can the client provide authoritative total?
* [ ] Are secrets hard-coded?
* [ ] Are passwords stored securely?
* [ ] Are expired tokens rejected?
* [ ] Are sensitive database fields returned?
* [ ] Is mass assignment possible?
* [ ] Is IDOR/BOLA possible?

### Security Notes

```text
Threat:
Exploit path:
Protection:
Verification:
```

---

# F. Validation Checklist

* [ ] Required fields checked.
* [ ] Types checked.
* [ ] Blank strings rejected where invalid.
* [ ] String trimming considered.
* [ ] Minimum boundaries tested.
* [ ] Maximum boundaries tested.
* [ ] Equality boundary tested.
* [ ] Negative values tested.
* [ ] Zero tested.
* [ ] Integer-only constraints tested.
* [ ] Reference existence checked.
* [ ] Invalid enum/state rejected.
* [ ] Unexpected properties ignored/rejected safely.

---

# G. Business Rule Checklist

## Cart

* [ ] Duplicate product merges quantity.
* [ ] Quantity is positive integer.
* [ ] Product exists.
* [ ] Product price is server-authoritative.

## Checkout

* [ ] User authenticated.
* [ ] Cart belongs to authenticated user.
* [ ] Cart not empty.
* [ ] Product data loaded server-side.
* [ ] Total calculated server-side.
* [ ] Shipping address validated.
* [ ] Order items persisted.
* [ ] Cart cleared after successful checkout.
* [ ] Operation is atomic.

## Coupon

* [ ] Coupon exists.
* [ ] Coupon active.
* [ ] Not expired.
* [ ] Threshold uses `>=`.
* [ ] User authenticated.
* [ ] Usage count enforced.
* [ ] Percent formula correct.
* [ ] Fixed formula correct.
* [ ] Final amount cannot become invalid.
* [ ] Usage is tied to authenticated user.

## Orders

* [ ] Ownership checked.
* [ ] User cancel rules correct.
* [ ] Admin transition rules correct.
* [ ] Delivered terminal.
* [ ] Canceled terminal.
* [ ] Invalid state rejected.

## Products

* [ ] Name required.
* [ ] Name <= 255.
* [ ] Price > 0.
* [ ] Category valid.
* [ ] Admin required.
* [ ] Only intended product changes.

## Import

* [ ] CSV contract validated.
* [ ] Every row validated.
* [ ] No partial success when one row invalid.
* [ ] Transaction rollback works.
* [ ] Error report identifies invalid rows.

---

# H. Implementation Checklist

During implementation:

* [ ] Changes are incremental.
* [ ] Unrelated formatting avoided.
* [ ] Unrelated refactors avoided.
* [ ] Public API changes documented.
* [ ] Error responses are consistent.
* [ ] No dead code introduced.
* [ ] No duplicated domain logic introduced.
* [ ] New reusable logic has focused tests.
* [ ] Data migration needs considered.

### Change Notes

For every meaningful change:

```text
Change:
Reason:
Requirement:
Root cause addressed:
Files:
Risk:
```

---

# I. Verification Checklist

## Narrow verification

* [ ] New unit tests pass.
* [ ] Relevant domain tests pass.
* [ ] Relevant API tests pass.

## Existing regression

* [ ] Previously failing relevant tests rerun.
* [ ] Expected RED became GREEN.
* [ ] Previously passing tests remain passing.
* [ ] No unrelated new failures.

## Broader verification

* [ ] HW6 relevant suite rerun.
* [ ] HW4 relevant suite rerun.
* [ ] Security cases rerun.
* [ ] Full regression considered.

### Evidence Record

```text
Command:
Test suite:
Before:
After:
Failures:
Interpretation:
```

---

# J. Failure Classification Checklist

For every remaining failure, assign exactly one:

* [ ] Remaining product defect
* [ ] Regression introduced by remediation
* [ ] Test defect
* [ ] Requirement ambiguity
* [ ] Fixture/data issue
* [ ] Environment issue
* [ ] Flaky/non-deterministic
* [ ] Out-of-scope known defect

Never leave:

`FAILED — unknown`

without investigation notes.

---

# K. Remediation Note Template

```markdown
# Remediation Stage XX — <Title>

## Status
DONE | PARTIAL | BLOCKED

## Scope

### In Scope
-

### Out of Scope
-

## Requirements
-

## Baseline

| Test/Case | Before |
|---|---|
| | |

## Findings

### Root Cause 1
...

### Root Cause 2
...

## Design Decision

### Before
...

### After
...

## Files Changed

| File | Change | Reason |
|---|---|---|
| | | |

## Verification

| Suite | Before | After | Result |
|---|---:|---:|---|
| | | | |

## Remaining Failures

| Failure | Classification | Follow-up |
|---|---|---|
| | | |

## Risks
-

## Decisions / Assumptions
-

## Follow-up
-
```

---

# L. Session Notes Template

At the end of every Agent session, append:

```markdown
## Agent Session — YYYY-MM-DD

### Goal
...

### Observed
...

### Changed
...

### Verified
...

### Not Changed
...

### Remaining
...

### Next Recommended Action
...
```

Never overwrite previous session notes.

Append new sessions chronologically.

---

# M. Final Stage Exit Checklist

A remediation stage cannot be marked DONE unless:

* [ ] Requirement restored.
* [ ] Root cause documented.
* [ ] Implementation updated.
* [ ] Relevant regression executed.
* [ ] Before/after evidence recorded.
* [ ] Remaining failures classified.
* [ ] No unexplained regression.
* [ ] Notes updated.
* [ ] Next stage dependencies recorded.

If any required item is missing:

`Status = PARTIAL`

If progress requires unresolved human decision:

`Status = BLOCKED`
