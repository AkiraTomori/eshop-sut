#!/bin/bash
# seed_accounts.sh — seeds 50 test accounts for Group 2 Spike Test
# Student ID: 23127379 | SUT: http://localhost:3000
# Date: 2026-08-14

BASE_URL="http://localhost:3000"
CSV_FILE="$(dirname "$0")/auth_users.csv"
PASS="Spike@Test123!"

echo "email,password,name,phone,shipping_address" > "$CSV_FILE"

SUCCESS=0
FAILED=0

for i in $(seq 1 50); do
  EMAIL="spike_user_${i}@eshop.test"
  NAME="Spike User $i"
  PHONE="09$(printf '%08d' $i)"
  ADDR="$i Spike Street, District $((i % 10 + 1)), Ho Chi Minh City"

  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | head -1)

  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo "$EMAIL,$PASS,$NAME,$PHONE,\"$ADDR\"" >> "$CSV_FILE"
    SUCCESS=$((SUCCESS + 1))
    echo "✅ [$i/50] Registered: $EMAIL"
  else
    FAILED=$((FAILED + 1))
    echo "⚠️  [$i/50] Failed ($HTTP_CODE): $EMAIL — $BODY"
    # Still add to CSV (account may already exist from a previous run)
    echo "$EMAIL,$PASS,$NAME,$PHONE,\"$ADDR\"" >> "$CSV_FILE"
  fi
done

echo ""
echo "====================================="
echo "Seeding complete: $SUCCESS created, $FAILED failed/skipped"
echo "CSV written to: $CSV_FILE"
echo "Total rows in CSV: $(wc -l < "$CSV_FILE") (including header)"
echo "====================================="
