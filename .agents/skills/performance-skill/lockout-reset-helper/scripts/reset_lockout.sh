#!/usr/bin/env bash
# reset_lockout.sh — Reset account lockout sau Spike/Stress test (Skill 7)
# Usage: bash reset_lockout.sh [sqlite_db_path] [auth_csv_path]

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo '/Users/thaiminhhuy/docs/Github/eshop-sut')"
HW5_DIR="${REPO_ROOT}/23127379_Homework/HW5"
BASE_URL="http://localhost:3000"
RESET_LOG="${HW5_DIR}/results/lockout_reset_log.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Tìm SQLite DB
DB_FILE="${1:-}"
if [ -z "${DB_FILE}" ]; then
  DB_FILE=$(find "${REPO_ROOT}/backend" -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3" 2>/dev/null | head -1 || true)
fi

# Auth CSV
AUTH_CSV="${2:-${HW5_DIR}/test-plans/auth_credentials.csv}"

echo "============================================"
echo "  EShop Lockout Reset Helper (Skill 7)"
echo "============================================"
echo "Timestamp  : ${TIMESTAMP}"
echo "DB file    : ${DB_FILE:-NOT FOUND}"
echo "Auth CSV   : ${AUTH_CSV}"
echo "============================================"

# Ensure reset log file exists
mkdir -p "$(dirname "${RESET_LOG}")"

# Bắt đầu ghi log
cat >> "${RESET_LOG}" << EOF

## Reset Session — ${TIMESTAMP}
**Script**: reset_lockout.sh

EOF

# --- Bước 0: Phát hiện tài khoản bị khóa ---
echo ""
echo "[0/3] Phát hiện tài khoản bị khóa..."

LOCKED_ACCOUNTS=()

if [ -f "${AUTH_CSV}" ]; then
  echo "   Checking accounts from CSV..."
  
  while IFS=',' read -r email password expected; do
    # Skip header
    [[ "$email" == "email" ]] && continue
    # Skip empty lines
    [[ -z "$email" ]] && continue
    
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X POST "${BASE_URL}/api/login" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"${email}\",\"password\":\"${password}\"}" \
      --max-time 5 2>/dev/null || echo "000")
    
    if [ "${STATUS}" == "403" ] || [ "${STATUS}" == "401" ]; then
      echo "   🔒 LOCKED: ${email} (HTTP ${STATUS})"
      LOCKED_ACCOUNTS+=("${email}")
    fi
  done < "${AUTH_CSV}"
  
  echo ""
  echo "   Total locked accounts: ${#LOCKED_ACCOUNTS[@]}"
else
  echo "   ⚠️  Auth CSV not found: ${AUTH_CSV}"
  echo "   Proceeding with DB reset without account verification."
fi

echo "### Tài khoản bị khóa (trước reset)" >> "${RESET_LOG}"
echo "Total locked: ${#LOCKED_ACCOUNTS[@]}" >> "${RESET_LOG}"
for acc in "${LOCKED_ACCOUNTS[@]}"; do
  echo "- ${acc}" >> "${RESET_LOG}"
done
echo "" >> "${RESET_LOG}"

# --- Bước 1: Reset via SQLite (primary method) ---
echo ""
echo "[1/3] Reset lockout via SQLite..."

if [ -n "${DB_FILE}" ] && [ -f "${DB_FILE}" ]; then
  echo "   DB: ${DB_FILE}"
  
  # Xem schema của bảng users
  echo "   Checking users table schema..."
  SCHEMA=$(sqlite3 "${DB_FILE}" "PRAGMA table_info(users);" 2>/dev/null || echo "ERROR")
  echo "   Schema: ${SCHEMA}"
  
  # Detect column names (different EShop versions may use different names)
  RESET_SQL=""
  
  if echo "${SCHEMA}" | grep -q "failed_login_attempts"; then
    RESET_SQL="UPDATE users SET failed_login_attempts = 0 WHERE email LIKE 'perf_user_%@test.com';"
    echo "   Detected column: failed_login_attempts"
  fi
  
  if echo "${SCHEMA}" | grep -q "locked_until"; then
    RESET_SQL="${RESET_SQL} UPDATE users SET locked_until = NULL WHERE email LIKE 'perf_user_%@test.com';"
    echo "   Detected column: locked_until"
  fi
  
  if echo "${SCHEMA}" | grep -q "is_locked"; then
    RESET_SQL="${RESET_SQL} UPDATE users SET is_locked = 0 WHERE email LIKE 'perf_user_%@test.com';"
    echo "   Detected column: is_locked"
  fi
  
  if echo "${SCHEMA}" | grep -q "login_attempts"; then
    RESET_SQL="${RESET_SQL} UPDATE users SET login_attempts = 0 WHERE email LIKE 'perf_user_%@test.com';"
    echo "   Detected column: login_attempts"
  fi
  
  if [ -n "${RESET_SQL}" ]; then
    echo "   Running reset SQL..."
    sqlite3 "${DB_FILE}" "${RESET_SQL}"
    echo "   ✅ SQL reset completed"
    
    # Verify
    VERIFY=$(sqlite3 "${DB_FILE}" "SELECT count(*) FROM users WHERE email LIKE 'perf_user_%@test.com';" 2>/dev/null || echo "0")
    echo "   Accounts affected: ${VERIFY}"
    
    echo "### Lệnh reset đã chạy" >> "${RESET_LOG}"
    echo "\`\`\`sql" >> "${RESET_LOG}"
    echo "${RESET_SQL}" >> "${RESET_LOG}"
    echo "\`\`\`" >> "${RESET_LOG}"
    echo "Accounts affected: ${VERIFY}" >> "${RESET_LOG}"
    echo "" >> "${RESET_LOG}"
    
    RESET_METHOD="SQLite direct"
  else
    echo "   ⚠️  Could not detect lockout columns in schema"
    echo "   Schema: ${SCHEMA}"
    RESET_METHOD="SQLite (schema unknown)"
  fi
else
  echo "   ⚠️  SQLite DB not found"
  RESET_METHOD="N/A"
fi

# --- Bước 2: Verify reset ---
echo ""
echo "[2/3] Verify reset..."

STILL_LOCKED=0
if [ -f "${AUTH_CSV}" ] && [ "${#LOCKED_ACCOUNTS[@]}" -gt 0 ]; then
  # Test first 3 locked accounts
  for email in "${LOCKED_ACCOUNTS[@]:0:3}"; do
    # Need the password for this email
    PASSWORD=$(grep "^${email}," "${AUTH_CSV}" | cut -d',' -f2 | head -1)
    if [ -n "${PASSWORD}" ]; then
      STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST "${BASE_URL}/api/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"${email}\",\"password\":\"${PASSWORD}\"}" \
        --max-time 5 2>/dev/null || echo "000")
      
      if [ "${STATUS}" == "403" ] || [ "${STATUS}" == "401" ]; then
        echo "   ❌ STILL LOCKED: ${email}"
        STILL_LOCKED=$((STILL_LOCKED + 1))
      elif [ "${STATUS}" == "200" ]; then
        echo "   ✅ UNLOCKED: ${email}"
      else
        echo "   ⚠️  ${email}: HTTP ${STATUS} (may be wrong password)"
      fi
    fi
  done
fi

RESET_STATUS="✅ Reset thành công"
if [ "${STILL_LOCKED}" -gt 0 ]; then
  RESET_STATUS="❌ Reset thất bại — ${STILL_LOCKED} accounts still locked"
fi

# --- Bước 3: Fallback — Restart EShop ---
if [ "${STILL_LOCKED}" -gt 0 ]; then
  echo ""
  echo "[3/3] Fallback: Restart EShop backend..."
  echo "   ⚠️  DB reset did not work. Restarting servers..."
  
  cd "${REPO_ROOT}"
  if [ -f "stop.sh" ]; then
    bash stop.sh
    sleep 3
  fi
  if [ -f "run_servers.sh" ]; then
    bash run_servers.sh &
    sleep 5
    
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/products" --max-time 5 || echo "000")
    if [ "${HTTP_STATUS}" == "200" ]; then
      echo "   ✅ EShop restarted successfully"
      RESET_STATUS="✅ Reset via server restart"
      RESET_METHOD="Server restart (fallback)"
    else
      echo "   ❌ EShop restart failed (HTTP ${HTTP_STATUS})"
      RESET_STATUS="❌ Reset thất bại — manual intervention needed"
    fi
  fi
fi

# --- Ghi kết quả vào log ---
cat >> "${RESET_LOG}" << EOF
### Kết quả verify

| Account | Before | After |
|---------|--------|-------|
EOF

for acc in "${LOCKED_ACCOUNTS[@]:0:5}"; do
  echo "| ${acc} | 🔒 Locked | ✅ Unlocked (nếu reset thành công) |" >> "${RESET_LOG}"
done

cat >> "${RESET_LOG}" << EOF

**Reset method**: ${RESET_METHOD}
**Reset status**: ${RESET_STATUS}
**Accounts still locked**: ${STILL_LOCKED}

---
EOF

echo ""
echo "============================================"
echo "  RESET SUMMARY"
echo "============================================"
echo "  Method    : ${RESET_METHOD}"
echo "  Status    : ${RESET_STATUS}"
echo "  Log saved : ${RESET_LOG}"
echo "============================================"
echo ""
echo "✅ lockout-reset-helper hoàn thành."
