# Endpoint Groups Reference — EShop HW05

## Group 1: Read-heavy (Load Testing)

| Attribute | Value |
|---|---|
| Endpoints | `GET /api/products`, `GET /api/products/:id` |
| Auth required | No |
| Expected response | 200 OK, JSON array / object |
| Potential bottleneck | SQLite full scan on products table |
| Lockout risk | None |

**Why Load Testing?**
Read-heavy endpoints handle steady concurrent traffic without sudden failure.
Load Testing measures throughput and p95 under "high but normal" sustained load.

---

## Group 2: Auth-heavy (Spike Testing)

| Attribute | Value |
|---|---|
| Endpoint | `POST /api/login` |
| Request body | `{"email": "...", "password": "..."}` |
| Auth required | No (this step obtains the token) |
| Expected response (success) | 200 OK + `{"token": "...", "user": {...}}` |
| Expected response (lockout) | 403 or 401 after **3 failed attempts** |
| Potential bottleneck | JWT generation CPU + SQLite write (login_attempts counter) |
| **Lockout risk** | **VERY HIGH — each thread must use its own credentials** |

**Why Spike Testing?**
Login endpoints are prime targets for flash spikes (bots, DDoS, flash sales).
Spike Testing simulates a sudden traffic burst → measures resilience and recovery time.

---

## Group 3: Transactional (Stress Testing)

| Attribute | Value |
|---|---|
| Endpoints | `POST /api/cart` → `POST /api/checkout` |
| Auth required | **Yes** — `Authorization: Bearer <token>` |
| Cart request body | `{"id": 1, "name": "...", "price": 100000, "quantity": 2}` |
| Checkout request body | `{"total_amount": 200000, "shipping_address": "..."}` |
| Expected response (cart) | 200 OK |
| Expected response (checkout) | 200 OK + order confirmation with `order_id` |
| Potential bottleneck | SQLite write lock under concurrent INSERT on orders table |
| Lockout risk | None (uses valid JWT token) |

**Why Stress Testing?**
Transactional workflows involve DB writes — heavier than reads.
Stress Testing finds the "breaking point" — the maximum users before system failure.

---

## Base URL
```
http://localhost:3000
```

## File Naming Convention
```
{StudentID}_{ScenarioType}_{YYYYMMDD}
```
Example: `23127379_Load_20260806.jmx`

Exact scenario type spellings (case-sensitive):
- `Load`
- `Stress`
- `Spike`

## Sequential Execution Rule
Complete **all stages** for Group 1 before starting Group 2.
Complete **all stages** for Group 2 before starting Group 3.
