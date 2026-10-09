from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.form import FormField
from app.schemas.form_field import FormFieldCreate, FormFieldUpdate


def create_form_field(
    db: Session,
    form_id: int,
    user_id: int,
    data: FormFieldCreate
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
            detail="You are not allowed to add fields to this form"
        )

    # Create form field
    form_field = FormField(
        form_id=form_id,
        label=data.label,
        field_type=data.field_type,
        placeholder=data.placeholder,
        description=data.description,
        is_required=data.is_required,
        display_order=data.display_order,
        validation_rules=data.validation_rules,
        conditional_logic=data.conditional_logic
    )

    db.add(form_field)
    db.commit()
    db.refresh(form_field)

    return form_field

def get_form_fields(
    db: Session,
    form_id: int
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

    # Get form fields
    fields = db.query(FormField).filter(
        FormField.form_id == form_id
    ).order_by(
        FormField.display_order.asc()
    ).all()

    return fields

def get_form_field(db:Session, form_id:int,  form_field_id:int):

    form_field = db.query(FormField).filter(
        FormField.id == form_field_id,
        FormField.form_id == form_id
    ).first()

    if not form_field:
        raise HTTPException(status_code=404, detail="Form field not found")

    return form_field

def update_form_field(
    db: Session,
    form_id: int,
    field_id: int,
    user_id: int,
    data: FormFieldUpdate
):
    # Check whether the form exists
    form_field = get_form_field(db, form_id, field_id)

    form = db.query(Form).filter(
        Form.id == form_id
    ).first()

    # Check form ownership
    if form.created_by != user_id: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to edit fields in this form"
        )

    # Update only supplied fields
    if data.label is not None:
        form_field.label = data.label # type: ignore

    if data.field_type is not None:
        form_field.field_type = data.field_type # type: ignore

    if data.placeholder is not None:
        form_field.placeholder = data.placeholder # type: ignore

    if data.description is not None:
        form_field.description = data.description # type: ignore

    if data.is_required is not None:
        form_field.is_required = data.is_required # type: ignore

    if data.display_order is not None:
        form_field.display_order = data.display_order # type: ignore

    if data.validation_rules is not None:
        form_field.validation_rules = data.validation_rules # type: ignore

    if data.conditional_logic is not None:
        form_field.conditional_logic = data.conditional_logic # type: ignore

    db.commit()
    db.refresh(form_field)

    return form_field

def delete_form_field(db:Session, form_id:int, form_field_id:int, user_id:int):

    form_field = get_form_field(db, form_id, form_field_id)

    # Check form ownership
    if form.created_by != user_id: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete fields in this form"
        )

    db.delete(form_field)
    db.commit()

    return {
        "message": f"Form field {form_field.label} is deleted"
    }

