from typing import Any, Dict


SUPPORTED_OPERATORS = {
    "equals",
    "not_equals",
    "contains",
    "not_contains",
    "greater_than",
    "less_than",
    "greater_than_or_equal",
    "less_than_or_equal",
    "is_empty",
    "is_not_empty",
}


def evaluate_condition(
    actual_value: Any,
    operator: str,
    expected_value: Any = None
) -> bool:
    """
    Evaluate a single conditional logic rule.
    """

    if operator not in SUPPORTED_OPERATORS:
        raise ValueError(
            f"Unsupported conditional operator: {operator}"
        )

    if operator == "is_empty":
        return (
            actual_value is None
            or actual_value == ""
            or actual_value == []
        )

    if operator == "is_not_empty":
        return not (
            actual_value is None
            or actual_value == ""
            or actual_value == []
        )

    if operator == "equals":
        return actual_value == expected_value

    if operator == "not_equals":
        return actual_value != expected_value

    if operator == "contains":
        if isinstance(actual_value, list):
            return expected_value in actual_value

        if isinstance(actual_value, str):
            return str(expected_value) in actual_value

        return False

    if operator == "not_contains":
        if isinstance(actual_value, list):
            return expected_value not in actual_value

        if isinstance(actual_value, str):
            return str(expected_value) not in actual_value

        return True

    if operator == "greater_than":
        return compare_values(actual_value, expected_value, ">")

    if operator == "less_than":
        return compare_values(actual_value, expected_value, "<")

    if operator == "greater_than_or_equal":
        return compare_values(actual_value, expected_value, ">=")

    if operator == "less_than_or_equal":
        return compare_values(actual_value, expected_value, "<=")

    return False


def compare_values(
    actual_value: Any,
    expected_value: Any,
    operator: str
) -> bool:
    """
    Perform numeric comparison.
    """

    try:
        actual = float(actual_value)
        expected = float(expected_value)
    except (TypeError, ValueError):
        return False

    if operator == ">":
        return actual > expected

    if operator == "<":
        return actual < expected

    if operator == ">=":
        return actual >= expected

    if operator == "<=":
        return actual <= expected

    return False


def evaluate_conditional_logic(
    conditional_logic: Dict[str, Any],
    responses: Dict[int, Any]
) -> bool:
    """
    Evaluate the conditional logic configured for a field.

    Example:

    {
        "field_id": 2,
        "operator": "equals",
        "value": "Yes"
    }

    responses:
    {
        2: "Yes"
    }
    """

    if not conditional_logic:
        return True

    field_id = conditional_logic.get("field_id")
    operator = conditional_logic.get("operator")
    expected_value = conditional_logic.get("value")

    if field_id is None:
        raise ValueError(
            "Conditional logic requires field_id"
        )

    if not operator:
        raise ValueError(
            "Conditional logic requires operator"
        )

    actual_value = responses.get(field_id)

    return evaluate_condition(
        actual_value=actual_value,
        operator=operator,
        expected_value=expected_value
    )