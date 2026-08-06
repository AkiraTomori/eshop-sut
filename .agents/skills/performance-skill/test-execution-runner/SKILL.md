---
name: test-execution-runner
description: >-
  Use this skill when the user has an approved JMeter (.jmx) or k6 test plan
  and wants to execute it against EShop (localhost:3000). Trigger phrases:
  "run test plan", "execute jmeter", "run k6", "start test run",
  or when user says "approved to run" after Skill 2 review. This skill:
  (1) verifies SUT is healthy, (2) runs the test via CLI with real-time
  resource monitoring in parallel, (3) exports a raw .jtl log and HTML report,
  (4) prints a physical-evidence checklist for things only the HUMAN can do
  (screenshot with tool + resource monitor in same frame, video, hardware report).
  Must complete Group 1 execution before starting Group 2. STOPS after
  execution and waits for human confirmation that evidence has been captured.
---

# Skill 3 — test-execution-runner

## Purpose
Execute the approved test plan via CLI, capture resource metrics in parallel,
export `.jtl` and HTML report. Then list physical evidence that **only a human
can produce**.

---

## Required Input

- `[TEST_PLAN_PATH]` — absolute path to `.jmx` or `.js` file
- `[SCENARIO_TYPE]` — Load / Stress / Spike
- `[JMETER_HOME]` — JMeter installation path (or confirm `jmeter` is in PATH)
- Confirmation that SUT is running at `http://localhost:3000`

---

## Step 0 — Pre-flight Checks

```bash
# Check SUT health
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/products
# Expected: 200

# Check JMeter
jmeter --version 2>&1 | head -1

# Check k6 (if using k6)
k6 version
```

If SUT returns anything other than 200 → **STOP, report error, do not run test**.

---

## Step 1 — Create Output Directory

```bash
STUDENT_ID="23127379"
SCENARIO="Load"  # or Stress / Spike
DATE=$(date +%Y%m%d)
OUTPUT_DIR="23127379_Homework/HW5/results/${STUDENT_ID}_${SCENARIO}_${DATE}"

mkdir -p "${OUTPUT_DIR}/html_report"
echo "Output directory: ${OUTPUT_DIR}"
```

---

## Step 2 — Run JMeter (non-GUI / CLI mode)

```bash
JTL_FILE="${OUTPUT_DIR}/${STUDENT_ID}_${SCENARIO}_${DATE}.jtl"
LOG_FILE="${OUTPUT_DIR}/jmeter_run.log"

jmeter \
  -n \
  -t "${TEST_PLAN_PATH}" \
  -l "${JTL_FILE}" \
  -e \
  -o "${OUTPUT_DIR}/html_report" \
  -j "${LOG_FILE}" \
  -JBASE_URL=http://localhost:3000 \
  2>&1 | tee "${OUTPUT_DIR}/console_output.txt"

echo "Exit code: $?"
```

**Key flags:**
- `-n` = non-GUI mode (required for CLI)
- `-t` = test plan path
- `-l` = output `.jtl` file
- `-e -o` = auto-generate HTML report after run
- `-j` = JMeter log file

---

## Step 2b — Run k6 (if using k6)

```bash
k6 run \
  --out csv="${OUTPUT_DIR}/${STUDENT_ID}_${SCENARIO}_${DATE}.jtl" \
  --summary-export="${OUTPUT_DIR}/k6_summary.json" \
  "${TEST_PLAN_PATH}" \
  2>&1 | tee "${OUTPUT_DIR}/k6_console.txt"
```

---

## Step 3 — Capture Resource Usage (run in parallel)

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

```bash
# Linux alternative
vmstat 5 >> "${OUTPUT_DIR}/vmstat.txt" &
VMSTAT_PID=$!
# After test: kill $VMSTAT_PID
```

---

## Step 4 — Generate HTML Report (if not auto-generated)

```bash
jmeter \
  -g "${JTL_FILE}" \
  -o "${OUTPUT_DIR}/html_report"
```

---

## Step 5 — Quick Sanity Check

```bash
# Count total requests
wc -l "${JTL_FILE}"

# View first 6 lines
head -6 "${JTL_FILE}"

# Count errors (non-200 responses)
grep -v "^timeStamp" "${JTL_FILE}" | awk -F',' '$4 != "200"' | wc -l
```

---

## Step 6 — Lockout Reset (Spike/Stress with auth-heavy only)

After Spike test completes, **immediately** invoke Skill 7:

```
→ Switch to lockout-reset-helper (Skill 7) to unlock affected test accounts
```

---

## Helper Scripts

Full automated script: [scripts/run_jmeter.sh](./scripts/run_jmeter.sh)
k6 script: [scripts/run_k6.sh](./scripts/run_k6.sh)

---

## ⚠️ Physical Evidence Checklist — HUMAN ACTION REQUIRED

The following items **cannot be produced by the agent**. You must do them yourself:

```
📸 PHYSICAL EVIDENCE CHECKLIST — {SCENARIO_TYPE} Test

[ ] 1. SCREENSHOT — Tool + Resource Monitor in the same frame
        - JMeter GUI or terminal output visible
        - htop / Activity Monitor visible simultaneously
        - Timestamp visible on screen
        - Save to: {OUTPUT_DIR}/screenshots/screenshot_{scenario}.png

[ ] 2. HARDWARE REPORT
        - macOS: screenfetch or System Information screenshot
        - Windows: msinfo32 or dxdiag
        - Save: {OUTPUT_DIR}/hardware_report.png + hardware_spec.md
        - Include: CPU model, RAM size, OS version, Disk type (SSD/HDD)

[ ] 3. DEMO VIDEO (at least 6 minutes total, may be split per scenario)
        - Screen recording with Vietnamese narration
        - Must show: tool running + resource monitor in same frame
        - Upload to YouTube (Unlisted) → save link

[ ] 4. RAW FILES — Verify existence
        - [ ] {STUDENT_ID}_{SCENARIO}_{DATE}.jtl (full raw log, not truncated)
        - [ ] html_report/index.html
        - [ ] resource_usage.txt
        - [ ] console_output.txt
```

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-3] test-execution-runner — {timestamp}
- **Test plan**: {test_plan_path}
- **Start time**: {start_time}
- **End time**: {end_time}
- **Exit code**: {exit_code}
- **Output**: {jtl_path}, {html_report_path}
- **Resource log**: {resource_log_path}
- **Human evidence captured**: [ ] screenshot, [ ] hardware, [ ] video
```

---

## ⛔ Checkpoint — STOP HERE

```
✅ Skill 3 complete — test run finished.

📊 Quick results:
   - Total requests: {count}
   - Errors detected: {error_count}
   - Raw .jtl: {jtl_path}
   - HTML Report: {html_report_path}

📸 Action required from you:
   Complete all items in the Physical Evidence Checklist above.
   Capture all evidence BEFORE proceeding.

👉 Once evidence is captured, reply "analysis ready" to proceed to
   Skill 4 (jtl-log-analyzer) with the .jtl file path.
```
