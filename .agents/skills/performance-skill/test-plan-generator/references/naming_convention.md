# Naming Convention — Test Plan Files

## Official Format

```
{StudentID}_{ScenarioType}_{YYYYMMDD}.jmx
```

## Examples (Student ID: 23127379, Date: 2026-08-06)

| Scenario | Filename |
|---|---|
| Load Testing | `23127379_Load_20260806.jmx` |
| Spike Testing | `23127379_Spike_20260806.jmx` |
| Stress Testing | `23127379_Stress_20260806.jmx` |

## k6 Alternative

If using k6 instead of JMeter:

| Scenario | Filename |
|---|---|
| Load Testing | `23127379_Load_20260806.js` |
| Spike Testing | `23127379_Spike_20260806.js` |
| Stress Testing | `23127379_Stress_20260806.js` |

## CSV Data Files (one per group — never shared)

| Endpoint Group | CSV Filename | Columns |
|---|---|---|
| Read-heavy | `products_data.csv` | `product_id,search_keyword` |
| Auth-heavy | `auth_credentials.csv` | `email,password,expected_result` |
| Transactional | `order_payloads.csv` | `product_id,product_name,price,quantity,shipping_address` |

## Submission ZIP Naming

```
{StudentID}_HW05_AI_Performance_{grade}.zip
```
Example: `23127379_HW05_AI_Performance_085.zip`

Where `{grade}` is a 3-digit self-assessed grade in the range [000, 100].

---

## Common Naming Mistakes

| ❌ Wrong | ✅ Correct | Reason |
|---|---|---|
| `23127379_load_20260806.jmx` | `23127379_Load_20260806.jmx` | ScenarioType must be capitalized |
| `23127379_LoadTest_20260806.jmx` | `23127379_Load_20260806.jmx` | Do not append "Test" |
| `23127379_Load_08062026.jmx` | `23127379_Load_20260806.jmx` | Date must be YYYYMMDD format |
| `load_test_plan.jmx` | `23127379_Load_20260806.jmx` | Must include StudentID |
| `23127379_Load_2026-08-06.jmx` | `23127379_Load_20260806.jmx` | No dashes in date |
