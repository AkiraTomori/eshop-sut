---
name: ci-performance-pipeline-proposer
description: >-
  Use this skill when the user has REAL measured performance thresholds from
  Skill 4 (jtl-log-analyzer) for all three endpoint groups and wants to propose
  a continuous performance testing pipeline for EShop. Trigger phrases: "propose
  CI pipeline", "continuous performance testing", "integrate perf tests into CI",
  "Task 3 proposal", or "monitoring pipeline". This skill uses ACTUAL measured
  p95/error-rate/throughput values — NOT generic numbers — to design a
  commit-triggered pipeline with regression detection. Outputs a Mermaid
  flowchart and a cost-vs-false-alarm trade-off table. Run only after all three
  groups have been analyzed. STOPS after output for human review.
---

# Skill 6 — ci-performance-pipeline-proposer

## Purpose
Propose a continuous performance testing model tied to EShop commit history,
using the exact thresholds measured in Skill 4.
**No generic numbers — every value must come from real test results.**

---

## Required Input

- `[P95_LOAD]` — p95 response time from Load test (ms)
- `[P95_STRESS]` — p95 from Stress test (ms)
- `[P95_SPIKE]` — p95 from Spike test (ms)
- `[ERROR_RATE_BASELINE]` — normal error rate (%)
- `[THROUGHPUT]` — measured throughput (req/s)
- `[MAX_STABLE_USERS]` — max users before degradation
- `[BREAKING_POINT_USERS]` — user count at breaking point (Stress test)
- `[ENDURANCE_RPS]` — max stable RPS from soak test
- `[MEMORY_CEILING_MB]` — memory ceiling from soak test

If Skill 4 data is not yet available → **STOP and request Skill 4 to run first**.

---

## Step 1 — Pipeline Design

### Core pipeline logic

```
Commit → Trigger Decision → Run tests → Compare vs baseline → Alert on regression
```

**Trigger decision** (avoid running expensive tests after every commit):

| Commit type | Trigger test? | Reason |
|---|---|---|
| Only `.md`, docs changes | ❌ No | Does not affect backend |
| Changes to `backend/routes/*.js` | ✅ Yes — Full suite | Route changes affect API directly |
| Changes to `backend/db.js` | ✅ Yes — Full suite | DB layer is critical path |
| Changes to `frontend-web/` only | ⚠️ Load test only | Frontend may affect read-heavy endpoints |
| Release tag `v*` | ✅ Yes — Full suite + Stress | Pre-release validation required |
| Nightly schedule | ✅ Yes — Full suite + Endurance | Soak test needs long run time |

---

## Step 2 — Mermaid Flowchart

```mermaid
flowchart TD
    A[Git Push / Pull Request] --> B{Analyze diff}
    B -- "Docs/frontend only" --> C[Skip perf tests\nAdd PR comment: skipped]
    B -- "backend/*.js changed" --> D[Trigger Performance Pipeline]
    B -- "Release tag v*" --> D

    D --> E[Start EShop SUT\nnpm run dev / docker compose up]
    E --> F{Health check\nGET /api/products → 200?}
    F -- Fail --> G[❌ Abort: SUT not ready\nNotify via GitHub comment]
    F -- Pass --> H[Run 3 test plans in parallel]

    H --> H1[Load Test\nGET /api/products\nGroup 1 — Read-heavy]
    H --> H2[Spike Test\nPOST /api/login\nGroup 2 — Auth-heavy]
    H --> H3[Stress Test\nPOST /api/cart + checkout\nGroup 3 — Transactional]

    H1 --> I[Collect .jtl files]
    H2 --> I
    H3 --> I

    I --> J[Parse .jtl — compute p95, error rate, throughput]

    J --> K{Load p95 > {P95_LOAD * 1.2}ms?}
    K -- Yes --> L1[🔴 REGRESSION: Load test degraded]
    K -- No --> M1[✅ Load OK]

    J --> N{Error rate > {ERROR_RATE_BASELINE + 2}%?}
    N -- Yes --> L2[🔴 REGRESSION: Error rate spike]
    N -- No --> M2[✅ Error rate OK]

    J --> O{Throughput < {THROUGHPUT * 0.9} rps?}
    O -- Yes --> L3[🟡 WARNING: Throughput degraded]
    O -- No --> M3[✅ Throughput OK]

    L1 --> P[Create GitHub Issue + block PR merge]
    L2 --> P
    L3 --> Q[Add PR warning comment — allow merge]

    M1 --> R[✅ All checks passed]
    M2 --> R
    M3 --> R

    P --> S[Update baseline DB with new measurements]
    Q --> S
    R --> S
```

---

## Step 3 — Baseline Threshold File

```yaml
# baseline_thresholds.yaml
# Update after each confirmed stable release

version: "1.0"
measured_on: "{date_from_skill4}"
hardware: "macOS, {CPU}, {RAM}GB RAM"

load_test:
  endpoint: "GET /api/products"
  p95_ms: {P95_LOAD}
  p95_regression_threshold_ms: {P95_LOAD * 1.2}   # +20% buffer
  error_rate_percent: {ERROR_RATE_LOAD}
  throughput_rps: {THROUGHPUT_LOAD}

spike_test:
  endpoint: "POST /api/login"
  p95_ms: {P95_SPIKE}
  recovery_time_s: {RECOVERY_TIME}
  lockout_events_per_run: {LOCKOUT_COUNT}

stress_test:
  endpoint: "POST /api/cart → POST /api/checkout"
  max_stable_users: {MAX_STABLE_USERS}
  breaking_point_users: {BREAKING_POINT_USERS}
  p95_at_stable_ms: {P95_STRESS}

endurance:
  max_stable_rps: {ENDURANCE_RPS}
  memory_ceiling_mb: {MEMORY_CEILING}
  duration_minutes: 15
```

---

## Step 4 — Trade-off Analysis

```markdown
## Trade-off: Cost vs False Alarm Rate

| Strategy | Cost | False Alarm Rate | Pipeline Duration | Best For |
|---|---|---|---|---|
| **Run after every commit** | High | Low | ~15 min/run | Large team, high SLA |
| **Backend changes only** (recommended) | Medium | Medium | ~15 min/run (less frequent) | EShop-sized project |
| **Release tags only** | Low | High (misses regressions between releases) | ~15 min/release | Early-stage startup |
| **Nightly scheduled** | Low | High (delayed detection) | ~30 min/night | Combine with option 2 |
| **Load test only, skip Stress/Spike** | Low | High for spike/stress regressions | ~5 min/run | Not recommended |

### Recommended Strategy for EShop

EShop is SQLite + single-process Node.js — test runs are cheap (~15 min).
Recommended: **Strategy 2 + Nightly schedule**:
- Every PR touching `backend/`: run Load + Spike (10 min)
- Nightly 2AM: full suite + 15-min endurance
- Pre-release: full suite + Stress

### Known False Alarm Sources

1. **Hardware variance** — results differ across machines → use +20% buffer in thresholds
2. **Concurrent system processes** — background work skews results → kill heavy processes before testing
3. **Cold start effect** — first run after restart is slower → add 30s warm-up before counting metrics
4. **SQLite lock after crash** — previous test crashed → reset DB state before next run
```

---

## Step 5 — Implementation Sketch

```bash
# Conceptual GitHub Actions workflow
# (requires self-hosted runner with JMeter installed)
# File: .github/workflows/performance.yml

name: Performance Regression Check
on:
  push:
    paths: ['backend/**', 'compose.yaml']
  schedule:
    - cron: '0 19 * * *'  # 2AM GMT+7

jobs:
  performance:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - name: Start EShop
        run: docker compose up -d && sleep 10
      - name: Health check
        run: curl -f http://localhost:3000/api/products
      - name: Run Load Test
        run: bash .agents/skills/performance-skill/test-execution-runner/scripts/run_jmeter.sh Load
      - name: Check regression
        run: python3 .agents/skills/performance-skill/jtl-log-analyzer/scripts/parse_jtl.py \
          results/23127379_Load_$(date +%Y%m%d)/*.jtl --check-regression
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: perf-results-${{ github.sha }}
          path: 23127379_Homework/HW5/results/
```

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-6] ci-performance-pipeline-proposer — {timestamp}
- **Input**: p95_load={P95_LOAD}ms, error_rate={ERR}%, throughput={T}rps (from Skill 4)
- **Output**: ci_pipeline_proposal.md (Mermaid flowchart + trade-off table)
- **Strategies compared**: 5
```

---

## ⛔ Checkpoint — STOP HERE

```
✅ Skill 6 complete — CI Pipeline proposal ready.

📄 Output: ci_pipeline_proposal.md
   - Mermaid flowchart: ✅
   - Measured thresholds used: ✅
   - Trade-off table: ✅
   - Implementation sketch: ✅

📋 Action required from you:
   [ ] Render the Mermaid diagram and verify the logic
   [ ] Confirm threshold values match Skill 4 output
   [ ] Include in final report (Skill 9)

👉 Run Skill 10 (independent-reviewer) to review this output.
```

## References
- [Pipeline Template](./references/pipeline_template.md)
