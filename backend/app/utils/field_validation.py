from datetime import datetime
from email_validator import validate_email, EmailNotValidError


SUPPORTED_FIELD_TYPES = {
    "text",
    "number",
    "email",
    "date",
    "dropdown",
    "checkbox",
    "radio",
    "file",
    "rating"
}


def validate_field_value(field, value):
    """
    Validate a submitted field value based on
    field type and validation rules.
    """

    field_type = field.field_type.lower()
    rules = field.validation_rules or {}

    # Check supported field type
    if field_type not in SUPPORTED_FIELD_TYPES:
        raise ValueError(
            f"Unsupported field type: {field.field_type}"
        )

    # Required field validation
    if field.is_required and (
        value is None or value == "" or value == []
    ):
        raise ValueError(
            f"{field.label} is required"
        )

    # Optional empty field
    if value is None or value == "" or value == []:
        return True

    if field_type == "text":
        return validate_text(value, rules)

    if field_type == "number":
        return validate_number(value, rules)

    if field_type == "email":
        return validate_email_field(value, rules)

    if field_type == "date":
        return validate_date(value, rules)

    if field_type == "dropdown":
        return validate_dropdown(field, value)

    if field_type == "checkbox":
        return validate_checkbox(field, value, rules)

    if field_type == "radio":
        return validate_radio(field, value)

    if field_type == "file":
        return validate_file(value, rules)

    if field_type == "rating":
        return validate_rating(value, rules)

    return True


def validate_text(value, rules):
    if not isinstance(value, str):
        raise ValueError("Text field must contain a string")

    min_length = rules.get("min_length")
    max_length = rules.get("max_length")
    pattern = rules.get("pattern")

    if min_length is not None and len(value) < min_length:
        raise ValueError(
            f"Text must contain at least {min_length} characters"
        )

    if max_length is not None and len(value) > max_length:
        raise ValueError(
            f"Text must not exceed {max_length} characters"
        )

    if pattern:
        import re

        if not re.fullmatch(pattern, value):
            raise ValueError(
                "Text format is invalid"
            )

    return True


def validate_number(value, rules):
    try:
        number = float(value)
    except (TypeError, ValueError):
        raise ValueError(
            "Number field must contain a valid number"
        )

    min_value = rules.get("min")
    max_value = rules.get("max")
    integer_only = rules.get("integer_only", False)

    if integer_only and not float(number).is_integer():
        raise ValueError(
            "Number must be an integer"
        )

    if min_value is not None and number < min_value:
        raise ValueError(
            f"Number must be at least {min_value}"
        )

    if max_value is not None and number > max_value:
        raise ValueError(
            f"Number must not exceed {max_value}"
        )

    return True


def validate_email_field(value, rules):
    if not isinstance(value, str):
        raise ValueError(
            "Email must be a string"
        )

    try:
        validate_email(value)
    except EmailNotValidError:
        raise ValueError(
            "Invalid email address"
        )

    return True


def validate_date(value, rules):
    try:
        date_value = datetime.strptime(
            value,
            "%Y-%m-%d"
        ).date()
    except (TypeError, ValueError):
        raise ValueError(
            "Date must be in YYYY-MM-DD format"
        )

    min_date = rules.get("min_date")
    max_date = rules.get("max_date")

    if min_date:
        min_date = datetime.strptime(
            min_date,
            "%Y-%m-%d"
        ).date()

        if date_value < min_date:
            raise ValueError(
                f"Date must be on or after {min_date}"
            )

    if max_date:
        max_date = datetime.strptime(
            max_date,
            "%Y-%m-%d"
        ).date()

        if date_value > max_date:
            raise ValueError(
                f"Date must be on or before {max_date}"
            )

    return True


def validate_dropdown(field, value):
    valid_values = {
        option.value
        for option in field.options
        if option.is_active
    }

    if value not in valid_values:
        raise ValueError(
            f"Invalid option selected for {field.label}"
        )

    return True


def validate_radio(field, value):
    return validate_dropdown(field, value)


def validate_checkbox(field, value, rules):
    if not isinstance(value, list):
        raise ValueError(
            "Checkbox value must be a list"
        )

    valid_values = {
        option.value
        for option in field.options
        if option.is_active
    }

    for selected_value in value:
        if selected_value not in valid_values:
            raise ValueError(
                f"Invalid checkbox option: {selected_value}"
            )

    min_selections = rules.get("min_selections")
    max_selections = rules.get("max_selections")

    if (
        min_selections is not None
        and len(value) < min_selections
    ):
        raise ValueError(
            f"Select at least {min_selections} options"
        )

    if (
        max_selections is not None
        and len(value) > max_selections
    ):
        raise ValueError(
            f"Select no more than {max_selections} options"
        )

    return True


def validate_file(value, rules):
    """
    File validation expects a file metadata dictionary.

    Example:
    {
        "filename": "document.pdf",
        "size": 1048576
    }
    """

    if not isinstance(value, dict):
        raise ValueError(
            "File value must contain file information"
        )

    filename = value.get("filename")
    file_size = value.get("size")

    if not filename:
        raise ValueError(
            "File name is required"
        )

    allowed_extensions = rules.get(
        "allowed_extensions"
    )

    if allowed_extensions:
        extension = filename.rsplit(
            ".",
            1
        )[-1].lower()

        allowed_extensions = [
            ext.lower().lstrip(".")
            for ext in allowed_extensions
        ]

        if extension not in allowed_extensions:
            raise ValueError(
                "File type is not allowed"
            )

    max_size_mb = rules.get("max_size_mb")

    if max_size_mb is not None:
        max_size_bytes = max_size_mb * 1024 * 1024

        if file_size > max_size_bytes:
            raise ValueError(
                f"File size must not exceed {max_size_mb} MB"
            )

    return True


def validate_rating(value, rules):
    try:
        rating = int(value)
    except (TypeError, ValueError):
        raise ValueError(
            "Rating must be a number"
        )

    min_rating = rules.get("min", 1)
    max_rating = rules.get("max", 5)

    if rating < min_rating or rating > max_rating:
        raise ValueError(
            f"Rating must be between "
            f"{min_rating} and {max_rating}"
        )

    return True