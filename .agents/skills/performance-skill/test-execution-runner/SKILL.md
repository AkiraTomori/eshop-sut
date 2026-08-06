---
name: test-execution-runner
description: >-
  Use this skill when the user has an approved Grafana k6 (.js) test script
  and wants to execute it against EShop (localhost:3000). Trigger phrases:
  "run test plan", "execute k6", "run k6", "start test run",
  or when user says "approved to run" after Skill 2 review. This skill:
  (1) verifies SUT is healthy, (2) runs the k6 script via CLI with real-time
  resource monitoring in parallel, (3) exports a raw CSV result log and JSON
  summary, (4) generates HTML report using k6-html-reporter,
  (5) prints a physical-evidence checklist for things only the HUMAN can do
  (screenshot with tool + resource monitor in same frame, video, hardware report).
  Must complete Group 1 execution before starting Group 2. STOPS after
  execution and waits for human confirmation that evidence has been captured.
---

# Skill 3 — test-execution-runner

## Purpose
Execute the approved k6 test script via CLI, capture resource metrics in parallel,
export CSV result and JSON summary, generate HTML report via k6-html-reporter.
Then list physical evidence that **only a human can produce**.

---

## Required Input

- `[TEST_SCRIPT_PATH]` — absolute path to the `.js` k6 script
- `[SCENARIO_TYPE]` — Load / Stress / Spike
- Confirmation that SUT is running at `http://localhost:3000`

---

## Step 0 — Pre-flight Checks

```bash
# Check SUT health
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/products
# Expected: 200

# Check k6
k6 version
# Expected: k6 v0.x.x ...

# Check k6-html-reporter (install if not present)
npm list -g k6-html-reporter 2>/dev/null || npm install -g k6-html-reporter
```

If SUT returns anything other than 200 → **STOP, report error, do not run test**.

---

## Step 1 — Create Output Directory

```bash
STUDENT_ID="23127379"
SCENARIO="Load"  # or Stress / Spike
DATE=$(date +%Y%m%d)
OUTPUT_DIR="23127379_Homework/HW5/results/${STUDENT_ID}_${SCENARIO}_${DATE}"

mkdir -p "${OUTPUT_DIR}"
echo "Output directory: ${OUTPUT_DIR}"
```

---

## Step 2 — Run k6

```bash
CSV_FILE="${OUTPUT_DIR}/${STUDENT_ID}_${SCENARIO}_${DATE}.csv"
SUMMARY_JSON="${OUTPUT_DIR}/summary.json"

k6 run \
  --out csv="${CSV_FILE}" \
  --summary-export="${SUMMARY_JSON}" \
  -e BASE_URL=http://localhost:3000 \
  "${TEST_SCRIPT_PATH}" \
  2>&1 | tee "${OUTPUT_DIR}/k6_console.txt"

echo "Exit code: $?"
```

**Key flags:**
- `--out csv` = export all raw metrics to CSV (used by Skill 4 for analysis)
- `--summary-export` = export final summary JSON (used for HTML report)
- `-e BASE_URL` = pass SUT URL as environment variable
- `tee` = log console output AND display in terminal simultaneously

> **Note**: The k6 script's `handleSummary()` function will also write `summary.json`
> into the test-plans directory. Copy it to OUTPUT_DIR if needed:
> `cp 23127379_Homework/HW5/test-plans/summary.json "${SUMMARY_JSON}"`

---

## Step 3 — Generate HTML Report

Use `k6-html-reporter` to convert the JSON summary into an HTML report:

```bash
HTML_REPORT_DIR="${OUTPUT_DIR}/html_report"
mkdir -p "${HTML_REPORT_DIR}"

# Option A: k6-html-reporter CLI (if installed globally)
k6-html-reporter \
  --data "${SUMMARY_JSON}" \
  --output "${HTML_REPORT_DIR}/index.html"

# Option B: Using npx (no global install required)
npx k6-html-reporter \
  --data "${SUMMARY_JSON}" \
  --output "${HTML_REPORT_DIR}/index.html"

echo "HTML report: ${HTML_REPORT_DIR}/index.html"
```

---

## Step 4 — Capture Resource Usage (run in parallel)

Open a **separate terminal** and run this the moment the test starts:

```bash
RESOURCE_LOG="${OUTPUT_DIR}/resource_usage.txt"
echo "=== Resource Monitor Start: $(date) ===" > "${RESOURCE_LOG}"

while true; do
  echo "--- $(date +%H:%M:%S) ---" >> "${RESOURCE_LOG}"
  # macOS
  top -l 1 -n 10 -stats pid,command,cpu,mem | head -20 >> "${RESOURCE_LOG}"
  # EShop Node.js process
  ps aux | grep "node" | grep -v grep >> "${RESOURCE_LOG}" 2>/dev/null || true
  sleep 5
done
# Press Ctrl+C when test finishes
```

---

## Step 5 — Quick Sanity Check

```bash
# Count total raw metric rows in CSV
wc -l "${CSV_FILE}"

# View first 6 lines of CSV to confirm format
head -6 "${CSV_FILE}"

# Quick summary from k6 JSON
python3 -c "
import json
with open('${SUMMARY_JSON}') as f:
    s = json.load(f)
metrics = s.get('metrics', {})
duration = metrics.get('http_req_duration', {}).get('values', {})
failed = metrics.get('http_req_failed', {}).get('values', {})
print(f'p95 response time : {duration.get(\"p(95)\", \"N/A\")} ms')
print(f'avg response time : {duration.get(\"avg\", \"N/A\")} ms')
print(f'error rate        : {failed.get(\"rate\", \"N/A\")}')
"
```

---

## Step 6 — Lockout Reset (Spike/Stress with auth-heavy only)

After Spike test completes, **immediately** invoke Skill 7:

```
→ Switch to lockout-reset-helper (Skill 7) to unlock affected test accounts
```

---

## Helper Scripts

Full automated script: [scripts/run_k6.sh](./scripts/run_k6.sh)

---

## ⚠️ Physical Evidence Checklist — HUMAN ACTION REQUIRED

The following items **cannot be produced by the agent**. You must do them yourself:

```
📸 PHYSICAL EVIDENCE CHECKLIST — {SCENARIO_TYPE} Test

[ ] 1. SCREENSHOT — Tool + Resource Monitor in the same frame
        - k6 terminal output visible
        - htop / Activity Monitor visible simultaneously
        - Timestamp visible on screen
        - Save to: {OUTPUT_DIR}/screenshots/screenshot_{scenario}.png

[ ] 2. HARDWARE REPORT
        - macOS: screenfetch or System Information screenshot
        - Save: {OUTPUT_DIR}/hardware_report.png + hardware_spec.md
        - Include: CPU model, RAM size, OS version, Disk type (SSD/HDD)

[ ] 3. DEMO VIDEO (at least 6 minutes total, may be split per scenario)
        - Screen recording with Vietnamese narration
        - Must show: k6 running in terminal + resource monitor in same frame
        - Upload to YouTube (Unlisted) → save link

[ ] 4. RAW FILES — Verify existence
        - [ ] {STUDENT_ID}_{SCENARIO}_{DATE}.csv (full raw log, not truncated)
        - [ ] summary.json
        - [ ] html_report/index.html
        - [ ] resource_usage.txt
        - [ ] k6_console.txt
```

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-3] test-execution-runner — {timestamp}
- **Test script**: {test_script_path}
- **Start time**: {start_time}
- **End time**: {end_time}
- **Exit code**: {exit_code}
- **Output**: {csv_path}, {summary_json_path}, {html_report_path}
- **Resource log**: {resource_log_path}
- **Human evidence captured**: [ ] screenshot, [ ] hardware, [ ] video
```

---

## ⛔ Checkpoint — STOP HERE

```
✅ Skill 3 complete — test run finished.

📊 Quick results (from summary.json):
   - p95 response time: {p95}ms
   - Error rate: {rate}
   - Raw CSV: {csv_path}
   - HTML Report: {html_report_path}

📸 Action required from you:
   Complete all items in the Physical Evidence Checklist above.
   Capture all evidence BEFORE proceeding.

👉 Once evidence is captured, reply "analysis ready" to proceed to
   Skill 4 (jtl-log-analyzer) with the CSV file path.
```
