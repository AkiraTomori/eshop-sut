# [SKILL-2] Test Plan Notes — Group 1 (Read-heavy)

**Generated:** 2026-08-13 22:04:00
**Scenario:** Load Testing + Endurance/Soak Testing
**Student ID:** 23127379

---

## Files Generated

| File | Purpose |
|---|---|
| `products_data.csv` | 5 product IDs from live SUT (`GET /api/products`) |
| `23127379_Load_20260813.js` | Load test: VUs 50→100→150, 9 min total |
| `23127379_Load_Endurance_20260813.js` | Soak test: 100 VUs for 15 min (find ceiling) |

---

## Design Decisions

| Decision | Rationale |
|---|---|
| `SharedArray` + `papaparse` | Thread-safe CSV loading; avoids re-parsing on every iteration |
| `(__VU - 1) % products.length` | Deterministic VU→product mapping; each VU cycles its own row |
| Strengthened `check()` | Verifies `.id` AND `.name` fields exist (not just `body.length > 0`) — fixes Skill 10 Low issue |
| `__ENV.BASE_URL` | Allows overriding SUT URL from CLI: `k6 run --env BASE_URL=http://...` |
| `handleSummary()` exports `summary.json` | Required for HTML report generation and Skill 4 analysis |
| Two separate files | Load (staged, 9 min) vs Endurance (flat 100 VU soak, 15 min) per plan |

---

## Pre-run Checklist

- [ ] SUT running at `http://localhost:3000`
- [ ] `products_data.csv` in same directory as `.js` script
- [ ] Activity Monitor open (CPU + Memory tab)
- [ ] Ready to screenshot: tool + Activity Monitor in same frame

---

## Run Commands

```bash
# Load test
k6 run --out csv=results/23127379_Load_20260813.csv \
       23127379_Homework/HW5/Group-1_Load_Products/23127379_Load_20260813.js

# Endurance / soak test
k6 run --out csv=results/23127379_Load_Endurance_20260813.csv \
       23127379_Homework/HW5/Group-1_Load_Products/23127379_Load_Endurance_20260813.js
```

---

## Review Status

- [ ] Approved by human reviewer
- [ ] Skill 10 independent review passed → see `skill10_review_script.md`
