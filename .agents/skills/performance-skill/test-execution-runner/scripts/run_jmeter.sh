#!/usr/bin/env bash
# run_jmeter.sh — Chạy JMeter test plan cho EShop HW05
# Usage: bash run_jmeter.sh <ScenarioType> [JMX_FILE]
# Example: bash run_jmeter.sh Load
#          bash run_jmeter.sh Spike /path/to/custom.jmx

set -euo pipefail

SCENARIO="${1:-Load}"
STUDENT_ID="23127379"
BASE_URL="http://localhost:3000"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo '/Users/thaiminhhuy/docs/Github/eshop-sut')"
HW5_DIR="${REPO_ROOT}/23127379_Homework/HW5"
DATE=$(date +%Y%m%d)
TIME=$(date +%H%M%S)

# Tìm JMX file
if [ -n "${2:-}" ]; then
  JMX_FILE="$2"
else
  JMX_FILE="${HW5_DIR}/test-plans/${STUDENT_ID}_${SCENARIO}_${DATE}.jmx"
fi

# Output directory
OUTPUT_DIR="${HW5_DIR}/results/${STUDENT_ID}_${SCENARIO}_${DATE}_${TIME}"
JTL_FILE="${OUTPUT_DIR}/${STUDENT_ID}_${SCENARIO}_${DATE}.jtl"
HTML_REPORT="${OUTPUT_DIR}/html_report"
LOG_FILE="${OUTPUT_DIR}/jmeter_run.log"
RESOURCE_LOG="${OUTPUT_DIR}/resource_usage.txt"

echo "============================================"
echo "  EShop HW05 Performance Test Runner"
echo "============================================"
echo "Scenario   : ${SCENARIO}"
echo "JMX file   : ${JMX_FILE}"
echo "Output dir : ${OUTPUT_DIR}"
echo "Date/Time  : ${DATE} ${TIME}"
echo "============================================"

# --- Bước 0: Pre-flight checks ---
echo ""
echo "[0/5] Pre-flight checks..."

# Check JMX exists
if [ ! -f "${JMX_FILE}" ]; then
  echo "❌ ERROR: JMX file not found: ${JMX_FILE}"
  echo "   Chạy Skill 2 (test-plan-generator) trước."
  exit 1
fi

# Check JMeter
if ! command -v jmeter &>/dev/null; then
  echo "❌ ERROR: jmeter not found in PATH"
  echo "   Install JMeter: https://jmeter.apache.org/download_jmeter.cgi"
  echo "   Sau đó thêm vào PATH: export PATH=\$PATH:/path/to/jmeter/bin"
  exit 1
fi

JMETER_VERSION=$(jmeter --version 2>&1 | grep -o "Version [0-9.]*" | head -1)
echo "   JMeter: ${JMETER_VERSION} ✅"

# Check SUT
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/products" --max-time 5 || echo "000")
if [ "${HTTP_STATUS}" != "200" ]; then
  echo "❌ ERROR: SUT không sẵn sàng (HTTP ${HTTP_STATUS})"
  echo "   Chạy: bash ${REPO_ROOT}/run_servers.sh"
  echo "   Đợi 5 giây rồi thử lại."
  exit 1
fi
echo "   SUT (${BASE_URL}): HTTP ${HTTP_STATUS} ✅"

# --- Bước 1: Tạo output directory ---
echo ""
echo "[1/5] Tạo output directory..."
mkdir -p "${OUTPUT_DIR}/html_report"
echo "   Created: ${OUTPUT_DIR}"

# --- Bước 2: Start resource monitor (background) ---
echo ""
echo "[2/5] Start resource monitor (background)..."
echo "=== Resource Monitor Start: $(date) ===" > "${RESOURCE_LOG}"
echo "=== Test: ${SCENARIO} | JMX: ${JMX_FILE} ===" >> "${RESOURCE_LOG}"

(
  while true; do
    echo "--- $(date +%H:%M:%S) ---" >> "${RESOURCE_LOG}"
    # macOS Activity Monitor equivalent
    if [[ "$OSTYPE" == "darwin"* ]]; then
      top -l 1 -n 15 -stats pid,command,cpu,mem 2>/dev/null | head -20 >> "${RESOURCE_LOG}"
      # EShop Node.js process
      ps aux | grep "node" | grep -v grep >> "${RESOURCE_LOG}" 2>/dev/null || true
    else
      # Linux
      top -bn1 | head -20 >> "${RESOURCE_LOG}"
      ps aux | grep "node" | grep -v grep >> "${RESOURCE_LOG}" 2>/dev/null || true
    fi
    echo "" >> "${RESOURCE_LOG}"
    sleep 5
  done
) &
RESOURCE_PID=$!
echo "   Resource monitor PID: ${RESOURCE_PID}"

# --- Bước 3: Run JMeter ---
echo ""
echo "[3/5] Running JMeter test..."
echo "   Command: jmeter -n -t ${JMX_FILE} -l ${JTL_FILE} -e -o ${HTML_REPORT}"
echo ""

START_TIME=$(date +%s)

jmeter \
  -n \
  -t "${JMX_FILE}" \
  -l "${JTL_FILE}" \
  -e \
  -o "${HTML_REPORT}" \
  -j "${LOG_FILE}" \
  -JBASE_URL="${BASE_URL}" \
  2>&1 | tee "${OUTPUT_DIR}/console_output.txt"

EXIT_CODE=$?
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# --- Bước 4: Stop resource monitor ---
echo ""
echo "[4/5] Stop resource monitor..."
kill "${RESOURCE_PID}" 2>/dev/null || true
echo "=== Resource Monitor End: $(date) ===" >> "${RESOURCE_LOG}"
echo "   Resource log saved: ${RESOURCE_LOG}"

# --- Bước 5: Quick analysis ---
echo ""
echo "[5/5] Quick results analysis..."

if [ -f "${JTL_FILE}" ]; then
  TOTAL_LINES=$(wc -l < "${JTL_FILE}")
  TOTAL_REQUESTS=$((TOTAL_LINES - 1))  # minus header
  ERROR_COUNT=$(grep -v "^timeStamp" "${JTL_FILE}" | awk -F',' '$8 == "false"' | wc -l || echo "N/A")
  
  echo ""
  echo "============================================"
  echo "  RESULTS SUMMARY"
  echo "============================================"
  echo "  Exit code      : ${EXIT_CODE}"
  echo "  Duration       : ${DURATION}s"
  echo "  Total requests : ${TOTAL_REQUESTS}"
  echo "  Errors         : ${ERROR_COUNT}"
  echo "  JTL file       : ${JTL_FILE}"
  echo "  HTML report    : ${HTML_REPORT}/index.html"
  echo "  Resource log   : ${RESOURCE_LOG}"
  echo "============================================"
else
  echo "⚠️  WARNING: JTL file not found — test may have failed"
  echo "   Check log: ${LOG_FILE}"
fi

# --- Physical Evidence Reminder ---
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  📸 PHYSICAL EVIDENCE CHECKLIST          ║"
echo "║  (Bạn phải tự làm — agent không thể)    ║"
echo "╠══════════════════════════════════════════╣"
echo "║  [ ] Screenshot: tool + resource monitor ║"
echo "║      cùng khung hình, timestamp rõ       ║"
echo "║  [ ] Hardware report: screenfetch /       ║"
echo "║      System Information screenshot       ║"
echo "║  [ ] Video demo (≥ 6 phút, tiếng Việt)  ║"
echo "║      Tool + resource monitor cùng frame  ║"
echo "╚══════════════════════════════════════════╝"
echo ""

if [ "${SCENARIO}" == "Spike" ] || [ "${SCENARIO}" == "Stress" ]; then
  echo "⚠️  LOCKOUT REMINDER:"
  echo "   Chạy Skill 7 (lockout-reset-helper) để reset tài khoản bị khóa!"
  echo "   bash .agents/skills/performance-skill/lockout-reset-helper/scripts/reset_lockout.sh"
  echo ""
fi

echo "✅ test-execution-runner hoàn thành."
echo "👉 Tiếp theo: Skill 4 (jtl-log-analyzer)"
echo "   python3 .agents/skills/performance-skill/jtl-log-analyzer/scripts/parse_jtl.py ${JTL_FILE}"
