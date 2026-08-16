# AI Critique — HW05 Performance Testing
**Student ID**: 23127379

## Analysis of AI Errors and Limitations

During HW05, I used Antigravity (Claude Sonnet) to support the performance testing workflow. The following is an honest assessment of where the AI fell short, with concrete evidence from the audit log.

### Error 1: Missing Endurance Parameters (Skill 1, Group 3, v1)
When generating parameters for the Group 3 Transactional endpoint, the AI successfully mapped the scenario to a Stress test (10→200 VUs). However, it omitted the endurance test variant, a mandatory HW05 Task 1 requirement. Flagged as a High severity issue by the independent reviewer (Skill 10), this occurred because the initial prompt focused heavily on finding the "breaking point," causing the model to lose context on global assignment requirements.

### Error 2: Arithmetic Hallucination in Test Duration (Skill 1, Group 3, v1)
In the same Group 3 v1 output, the AI defined the VU stepping logic: 12 steps of 30 seconds (6 minutes), plus a 1-minute ramp-down. However, it hallucinated the sum, stating the total duration was 13 minutes instead of 7. This is a classic Large Language Model arithmetic failure, generating plausible text but failing to evaluate basic math over its own generated data.

### What the AI Did Well
The AI was exceptional at data extraction. The `jtl-log-analyzer` accurately parsed 45,000+ CSV rows without hallucinating metrics, correctly verifying that `POST /api/checkout` survived 200 VUs with 0.00% errors.

### Lessons Learned
1. **Implement independent reviews**: The AI caught its own math errors when placed in a fresh, independent context (Skill 10).
2. **Restate constraints**: AI struggles with multi-constraint optimization. When prompted to find a breaking point, it forgot the endurance requirement. Explicitly restating all global rules in every prompt maintains context.

**Word count**: 288 words
