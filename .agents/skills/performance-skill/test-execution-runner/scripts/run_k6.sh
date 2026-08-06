#!/usr/bin/env bash
# run_k6.sh — Chạy k6 test plan cho EShop HW05 (alternative to JMeter)
# Usage: bash run_k6.sh <ScenarioType> [K6_SCRIPT]

set -euo pipefail

SCENARIO="${1:-Load}"
STUDENT_ID="23127379"
BASE_URL="http://localhost:3000"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo '/Users/thaiminhhuy/docs/Github/eshop-sut')"
HW5_DIR="${REPO_ROOT}/23127379_Homework/HW5"
DATE=$(date +%Y%m%d)
TIME=$(date +%H%M%S)

K6_SCRIPT="${2:-${HW5_DIR}/test-plans/${STUDENT_ID}_${SCENARIO}_${DATE}.js}"
OUTPUT_DIR="${HW5_DIR}/results/${STUDENT_ID}_${SCENARIO}_${DATE}_${TIME}"
CSV_OUTPUT="${OUTPUT_DIR}/${STUDENT_ID}_${SCENARIO}_${DATE}.jtl"

echo "============================================"
echo "  EShop HW05 k6 Test Runner"
echo "============================================"
echo "Scenario  : ${SCENARIO}"
echo "Script    : ${K6_SCRIPT}"
echo "Output    : ${OUTPUT_DIR}"
echo "============================================"

# Pre-flight
if ! command -v k6 &>/dev/null; then
  echo "❌ k6 not found. Install: brew install k6"
  exit 1
fi

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/products" --max-time 5 || echo "000")
if [ "${HTTP_STATUS}" != "200" ]; then
  echo "❌ SUT not ready (HTTP ${HTTP_STATUS})"
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

# Resource monitor (background)
RESOURCE_LOG="${OUTPUT_DIR}/resource_usage.txt"
echo "=== k6 Resource Monitor Start: $(date) ===" > "${RESOURCE_LOG}"
(
  while true; do
    echo "--- $(date +%H:%M:%S) ---" >> "${RESOURCE_LOG}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
      top -l 1 -n 10 -stats pid,command,cpu,mem 2>/dev/null | head -15 >> "${RESOURCE_LOG}"
    else
      top -bn1 | head -15 >> "${RESOURCE_LOG}"
    fi
    sleep 5
  done
) &
RESOURCE_PID=$!

# Run k6
k6 run \
  --out "csv=${CSV_OUTPUT}" \
  --summary-export="${OUTPUT_DIR}/k6_summary.json" \
  -e BASE_URL="${BASE_URL}" \
  "${K6_SCRIPT}" \
  2>&1 | tee "${OUTPUT_DIR}/k6_console.txt"

EXIT_CODE=$?
kill "${RESOURCE_PID}" 2>/dev/null || true

echo "✅ k6 test completed (exit code: ${EXIT_CODE})"
echo "   CSV output: ${CSV_OUTPUT}"
echo "   Summary: ${OUTPUT_DIR}/k6_summary.json"
echo ""
echo "📸 Remember to capture screenshots and video evidence!"

if [ "${SCENARIO}" == "Spike" ] || [ "${SCENARIO}" == "Stress" ]; then
  echo "⚠️  Run lockout reset: bash .agents/skills/performance-skill/lockout-reset-helper/scripts/reset_lockout.sh"
fi
