---
name: decision-table-testing
description: "Design a decision table and derive test cases when multiple business conditions jointly determine outcomes, especially for FR-08 checkout."
---

# Decision Table Testing

Every generated table and test case is only a **proposal pending review**. Do not call an API, run a collection, or proceed to another skill automatically. Use only POST/PUT endpoints in the HW06 scope; do not design GET requests.

## 1. Expected input

- A business rule containing multiple causes and effects, with citations from `README.md` or `api_specification.md`.
- For FR-08 checkout, all four Boolean causes are mandatory:
  - C1: logged in Y/N;
  - C2: cart empty Y/N;
  - C3: client-supplied `total_amount` matches/does not match the actual cart;
  - C4: valid `shipping_address` Y/N.
- Observable effects: authentication rejection, empty-cart rejection, invalid-address rejection, order creation using the backend-recalculated total, and cart clearing after success.
- Valid fixtures, token/role, and expected status/schema when specified.

If the documents do not define a status code or the precedence of simultaneous errors, write `Not specified — user confirmation required`; never infer it.

## 2. Step-by-step process

1. **Identify Causes & Effects.** Normalize every cause to Y/N. Define each effect so it can be observed through a response or side effect, and cite its FR/API-spec source. When `total_amount` does not match, the FR-08 effect is that the backend distrusts the client value and recalculates it.
2. **Create full table.** For `n` causes, create all `2^n` rule columns. Checkout has four causes, so the full table must contain all 16 columns before reduction. Do not omit difficult-to-establish combinations or use `-` instead of `Y/N` in the full table.
3. **Reduce table.** Merge columns with identical effects when one or more conditions have no influence; use `-` only for those “don't care” conditions. Keep columns separate when their effects, side effects, or rule precedence differ. Map every reduced rule back to its source full rules.
4. **Derive test cases.** Create exactly one test case from each reduced column. Convert Y/N into concrete tokens, cart states, client totals, addresses, and expected effects. Trace each case to its reduced rule and requirement.

This is only one technique in the multi-step process for producing at least 35 cases per HW06 API unit, not a single prompt for generating the entire suite. After producing the output, stop for confirmation and record the AI invocation through `ai-audit-logger` when that logger is operating.

## 3. Output format

### Causes & Effects

| ID | Type | Description | Values | Specification source |
|---|---|---|---|---|

### Full decision table

| Cause/Effect | R1 | R2 | ... | R(2^n) |
|---|---|---|---|---|

### Reduced decision table

| Cause/Effect | RR1 | RR2 | ... |
|---|---|---|---|
| Source full rules | ... | ... | ... |

### Proposed test cases

| Test Case ID | Reduced Rule | Endpoint | Preconditions | Request data | Expected status | Expected effects/side effects | Requirement source |
|---|---|---|---|---|---|---|---|

End the output with: `Status: PROPOSED — pending user approval of the decision table and rule precedence.`

## 4. Short input → output example

**Input:** Checkout with C1=Y, C2=N, C3=N, C4=Y.

**Condensed output:**

| Cause/Effect | RR-SUCCESS-RECALC |
|---|---|
| Logged in | Y |
| Cart empty | N |
| Client total matches | - |
| Address valid | Y |
| Create order using backend-calculated total | X |
| Clear cart | X |
| Source full rules | C3=Y and C3=N combinations have the same effect under FR-08 |

| Test Case ID | Reduced Rule | Endpoint | Preconditions | Request data | Expected status | Expected effects/side effects | Requirement source |
|---|---|---|---|---|---|---|---|
| FR08-DT-001 | RR-SUCCESS-RECALC | `POST /api/checkout` | Valid token; non-empty cart | Incorrect client total; valid address | Not specified | Backend recalculates total, creates the order, and clears the cart | README FR-08 |

