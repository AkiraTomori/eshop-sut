---
name: lockout-reset-helper
description: >-
  Use this skill immediately after any Spike or Stress test that may have
  triggered account lockout in EShop (POST /api/login failing after 3 attempts).
  Trigger phrases: "reset lockout", "unlock accounts", "accounts are locked",
  "unlock test users", or automatically after Skill 3 (test-execution-runner)
  completes a Spike or auth-heavy test. This skill executes the actual lockout
  reset via direct SQLite query or server restart, logs every step taken, and
  produces a reset log for inclusion in the submission report. Must be run
  between Group 2 test runs to restore test account state.
---

# Skill 7 — lockout-reset-helper

## Purpose
Execute the actual account lockout reset after each Spike/Stress test run.
Log every step taken for inclusion in the submission report.

---

## Understanding EShop Lockout Behavior

Per `api_specification.md`:
- `POST /api/login` with wrong password → after **3 failed attempts** → account locked
- Lockout state is stored in SQLite DB
- No public API endpoint for unlock → must reset via DB or server restart

---

## Step 0 — Detect Locked Accounts

### Method A: From .jtl log
```bash
JTL_FILE="23127379_Homework/HW5/results/{run_dir}/{run}.jtl"

# Find 403/401 responses — signs of lockout
grep -v "^timeStamp" "${JTL_FILE}" | awk -F',' '{
  if ($4 == "403" || $4 == "401") print $1, $3, $4, $5
}' | head -20

echo "Total lockout events:"
grep -v "^timeStamp" "${JTL_FILE}" | awk -F',' '$4 == "403"' | wc -l
```

### Method B: Test each account individually
```bash
AUTH_CSV="23127379_Homework/HW5/test-plans/auth_credentials.csv"
BASE_URL="http://localhost:3000"

tail -n +2 "${AUTH_CSV}" | while IFS=',' read -r email password expected; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "${BASE_URL}/api/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${email}\",\"password\":\"${password}\"}")

  if [ "${STATUS}" == "403" ] || [ "${STATUS}" == "401" ]; then
    echo "LOCKED: ${email} (HTTP ${STATUS})"
  elif [ "${STATUS}" == "200" ]; then
    echo "OK: ${email}"
  else
    echo "UNKNOWN: ${email} (HTTP ${STATUS})"
  fi
done
```

---

## Step 1 — Reset Lockout (priority order)

### Option A: Via Admin API (if available in EShop)

```bash
# Login as admin to get token
ADMIN_TOKEN=$(curl -s -X POST "${BASE_URL}/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eshop.com","password":"AdminPass123!"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))")

# Note: EShop may not have a public unlock endpoint
# Attempt (adjust endpoint based on actual implementation):
# curl -X PUT "${BASE_URL}/api/admin/users/{id}/unlock" \
#   -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Option B: Direct SQLite reset (recommended for local EShop)

```bash
# Locate the DB file
DB_FILE=$(find /Users/thaiminhhuy/docs/Github/eshop-sut/backend \
  -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3" 2>/dev/null | head -1)
echo "DB: ${DB_FILE}"

# Inspect schema to find lockout columns
sqlite3 "${DB_FILE}" "PRAGMA table_info(users);"

# Reset lockout — adjust column names to match actual schema
sqlite3 "${DB_FILE}" "
  UPDATE users
  SET failed_login_attempts = 0,
      locked_until = NULL,
      is_locked = 0
  WHERE email LIKE 'perf_user_%@test.com';
"

# Verify
sqlite3 "${DB_FILE}" "
  SELECT email, failed_login_attempts, is_locked
  FROM users
  WHERE email LIKE 'perf_user_%@test.com'
  LIMIT 10;
"
```

> **Note**: Column names (`failed_login_attempts`, `is_locked`, etc.) depend on
> EShop's actual implementation. Always run `PRAGMA table_info(users)` first.

### Option C: Restart EShop backend (last resort)

```bash
cd /Users/thaiminhhuy/docs/Github/eshop-sut
bash stop.sh
sleep 2
bash run_servers.sh
sleep 5

# Verify SUT is back up
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/products
```

---

## Step 2 — Verify Reset

```bash
TEST_EMAIL=$(head -2 "${AUTH_CSV}" | tail -1 | cut -d',' -f1)
TEST_PASS=$(head -2 "${AUTH_CSV}" | tail -1 | cut -d',' -f2)

curl -s -X POST "${BASE_URL}/api/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASS}\"}" \
  | python3 -m json.tool

# Expected: {"token": "...", "user": {...}}
```

---

## Step 3 — Write Reset Log

```bash
RESET_LOG="23127379_Homework/HW5/results/lockout_reset_log.md"

cat >> "${RESET_LOG}" << EOF

## Reset Session — $(date '+%Y-%m-%d %H:%M:%S')
**After test**: {SCENARIO_TYPE} test — {test_plan_name}
**Reset method**: {Option A / B / C}

### Accounts locked (before reset)
\`\`\`
{output from Step 0}
\`\`\`

### Commands executed
\`\`\`bash
{sqlite3 commands or restart commands}
\`\`\`

### Verification result
\`\`\`
{curl verify output}
\`\`\`

**Outcome**: ✅ Reset successful / ❌ Reset failed (reason: {reason})
**Time taken**: {duration}s
EOF
```

---

## Helper Script

Full automated script: [scripts/reset_lockout.sh](./scripts/reset_lockout.sh)

---

## Audit Log

Append to `hw05_audit_log.md`:

```markdown
## [SKILL-7] lockout-reset-helper — {timestamp}
- **Triggered by**: {SCENARIO_TYPE} test
- **Accounts locked**: {n_locked}
- **Reset method**: {method}
- **Reset success**: ✅ / ❌
- **Time taken**: {duration}s
```

---

## ⛔ Checkpoint — STOP HERE

```
✅ Skill 7 complete.

📊 Reset results:
   - Accounts locked: {n_locked}
   - Reset method: {method}
   - Verification: {status}

📁 Reset log: lockout_reset_log.md

👉 You may now:
   a) Re-run the test (Skill 3) if additional runs are needed
   b) Proceed to analysis (Skill 4) if sufficient .jtl files exist
```
