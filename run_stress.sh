#!/bin/bash
STUDENT_ID="23127379"
SCENARIO="Stress"
DATE="20260816"
OUTPUT_DIR="23127379_Homework/HW5/Group-3_Stress_Checkout/results"
mkdir -p "${OUTPUT_DIR}"

CSV_FILE="${OUTPUT_DIR}/${STUDENT_ID}_${SCENARIO}_${DATE}.csv"
SUMMARY_JSON="${OUTPUT_DIR}/summary.json"
RESOURCE_LOG="${OUTPUT_DIR}/resource_usage.txt"
HTML_REPORT_DIR="${OUTPUT_DIR}/html_report"
mkdir -p "${HTML_REPORT_DIR}"

echo "=== Resource Monitor Start: $(date) ===" > "${RESOURCE_LOG}"
(
  while true; do
    echo "--- $(date +%H:%M:%S) ---" >> "${RESOURCE_LOG}"
    top -l 1 -n 10 -stats pid,command,cpu,mem | head -20 >> "${RESOURCE_LOG}"
    ps aux | grep "node" | grep -v grep >> "${RESOURCE_LOG}" 2>/dev/null || true
    sleep 5
  done
) &
MONITOR_PID=$!

cd 23127379_Homework/HW5/Group-3_Stress_Checkout
k6 run \
  --out csv="results/${STUDENT_ID}_${SCENARIO}_${DATE}.csv" \
  --summary-export="results/summary.json" \
  -e BASE_URL=http://localhost:3000 \
  "23127379_Stress_20260814.js" \
  > "results/k6_console.txt" 2>&1
cd ../../../

kill $MONITOR_PID 2>/dev/null || true

npx k6-html-reporter --data "${SUMMARY_JSON}" --output "${HTML_REPORT_DIR}/index.html"

echo "Test run finished."
wc -l "${CSV_FILE}"
head -6 "${CSV_FILE}"
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
