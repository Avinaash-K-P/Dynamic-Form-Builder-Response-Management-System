from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.form import Form
from app.models.form import FormField, FieldOption
from app.schemas.field_option import (
    FieldOptionCreate,
    FieldOptionUpdate
)
from app.utils.field_validation import validate_field_value

def create_field_option(
    db: Session,
    form_id: int,
    field_id: int,
    user_id: int,
    data: FieldOptionCreate
):
    # Check whether the form exists
    form = db.query(Form).filter(
        Form.id == form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )

    # Check form ownership
    if form.created_by != user_id: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to modify this form"
        )

    # Check whether the field exists
    form_field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()

    if not form_field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form field not found"
        )

    try:
        validate_field_value(
        field=form_field,
        value=data.value
        )
        
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        )

    # Create field option
    field_option = FieldOption(
        field_id=field_id,
        label=data.label,
        value=data.value,
        display_order=data.display_order,
        is_active=True
    )

    db.add(field_option)
    db.commit()
    db.refresh(field_option)

    return field_option

def get_field_options(
    db: Session,
    form_id: int,
    field_id: int
):
    # Check whether the form exists
    form = db.query(Form).filter(
        Form.id == form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )

    # Check whether the field belongs to the form
    form_field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()

    if not form_field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form field not found"
        )

    # Get field options
    options = db.query(FieldOption).filter(
        FieldOption.field_id == field_id
    ).order_by(
        FieldOption.display_order.asc()
    ).all()

    return options


def get_field_option(
    db: Session,
    form_id: int,
    field_id: int,
    option_id: int
):
    # Check whether the form exists
    form = db.query(Form).filter(
        Form.id == form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )

    # Check whether the field belongs to the form
    form_field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()

    if not form_field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form field not found"
        )

    # Get field option
    field_option = db.query(FieldOption).filter(
        FieldOption.id == option_id,
        FieldOption.field_id == field_id
    ).first()

    if not field_option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field option not found"
        )

    return field_option


def update_field_option(
    db: Session,
    form_id: int,
    field_id: int,
    option_id: int,
    user_id: int,
    data: FieldOptionUpdate
):
    # Check whether the form exists
    form = db.query(Form).filter(
        Form.id == form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )

    # Check form ownership
    if form.created_by != user_id: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to modify this form"
        )

    # Check whether the field belongs to the form
    form_field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()

    if not form_field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form field not found"
        )

    # Check whether the option belongs to the field
    field_option = db.query(FieldOption).filter(
        FieldOption.id == option_id,
        FieldOption.field_id == field_id
    ).first()

    if not field_option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field option not found"
        )

    # Update supplied fields
    if data.label is not None:
        field_option.label = data.label # type: ignore

    if data.value is not None:
        field_option.value = data.value # type: ignore 

    if data.display_order is not None:
        field_option.display_order = data.display_order # type: ignore

    db.commit()
    db.refresh(field_option)

    return field_option

def delete_field_option(
    db: Session,
    form_id: int,
    field_id: int,
    option_id: int,
    user_id: int
):
    # Check whether the form exists
    form = db.query(Form).filter(
        Form.id == form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )

    # Check form ownership
    if form.created_by != user_id: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to modify this form"
        )

    # Check whether the field belongs to the form
    form_field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()

    if not form_field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form field not found"
        )

    # Check whether the option belongs to the field
    field_option = db.query(FieldOption).filter(
        FieldOption.id == option_id,
        FieldOption.field_id == field_id
    ).first()

    if not field_option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field option not found"
        )

    db.delete(field_option)
    db.commit()

    return None

def update_field_option_status(
    db: Session,
    form_id: int,
    field_id: int,
    option_id: int,
    user_id: int,
    is_active: bool
):
    # Check whether the form exists
    form = db.query(Form).filter(
        Form.id == form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )

    # Check form ownership
    if form.created_by != user_id: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to modify this form"
        )

    # Check whether the field belongs to the form
    form_field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()

    if not form_field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form field not found"
        )

    # Check whether the option belongs to the field
    field_option = db.query(FieldOption).filter(
        FieldOption.id == option_id,
        FieldOption.field_id == field_id
    ).first()

    if not field_option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field option not found"
        )

    # Update status
    field_option.is_active = is_active # type: ignore

    db.commit()
    db.refresh(field_option)

    return field_option