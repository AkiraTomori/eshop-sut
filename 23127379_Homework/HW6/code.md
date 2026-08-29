## Pseudocode

```text
function generate_api_tests(api_unit, assignment, srs, api_spec):
    assert api_unit in {PoolA_FR03, PoolB_FR08, PoolC_FR15}
    assert api_unit uses only allowed POST/PUT endpoints

    contract = resolve_contract(api_unit, srs, api_spec)
    if contract has unspecified fields or oracles:
        mark_them_for_human_confirmation()

    domain = deep_domain_analysis(contract)
    assert every_relevant_parameter_in(domain.inventory)
    assert every_invalid_partition_has_isolated_case(domain)
    assert every_documented_boundary_is_covered(domain)

    technique_cases = []
    if api_unit == PoolA_FR03:
        technique_cases += complete_state_transition_analysis(contract)
    if api_unit == PoolB_FR08:
        technique_cases += full_then_reduced_decision_table(contract)

    technique_cases += applicable_security_and_schema_cases(contract)
    proposed_cases = deduplicate_with_traceability(domain.cases + technique_cases)

    output proposed_cases
    stop until human confirms Stage 1

    audited_cases = human_audit(proposed_cases)
    stop until human confirms Stage 2

    extensions = gap_analysis(audited_cases, minimum_new_cases=5)
    require why_ai_missed_it for every extensions item
    stop until human confirms Stage 3

    final_cases = audited_cases + human_confirmed(extensions)
    assert count(final_cases) >= 35
    return final_cases as proposal for Postman construction
```


## Hand-drawn Diagram

Show in hand-drawn-1.png and hand-drawn-2.png the flow of the test generation process, including the stages of human confirmation and auditing. The diagram should illustrate how the initial contract is analyzed, how technique cases are generated, and how human input is integrated at various stages to ensure comprehensive test coverage.