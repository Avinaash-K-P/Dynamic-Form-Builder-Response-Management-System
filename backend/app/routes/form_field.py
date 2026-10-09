from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import verify_role

from app.schemas.form_field import (
    FormFieldCreate,
    FormFieldUpdate,
    FormFieldResponse
)

from app.services.form_field_service import (
    create_form_field,
    get_form_fields,
    get_form_field,
    update_form_field,
    delete_form_field
)

router = APIRouter(
    prefix="/forms",
    tags=["Form Fields"]
)


@router.post("/{form_id}/fields",response_model=FormFieldResponse)
def add_form_field(
    form_id: int,
    data: FormFieldCreate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin")),
):
    return create_form_field(
        db = db,
        form_id = form_id,
        user_id =  current_user.id,
        data = data
    )


@router.get("/{form_id}/fields", response_model=list[FormFieldResponse])
def list_form_fields(
    form_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("user"))

):
    return get_form_fields(db=db, form_id=form_id)


@router.get("/{form_id}/fields/{field_id}", response_model=FormFieldResponse)
def view_form_field(
    form_id: int,
    field_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_form_field(db=db, form_id=form_id, form_field_id= field_id)

@router.put("/{form_id}/fields/{field_id}", response_model=FormFieldResponse)
def edit_form_field(
    form_id: int,
    field_id: int,
    data: FormFieldUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    return update_form_field(
        db,
        form_id,
        field_id,
        current_user.id,
        data
    )

@router.delete("/{form_id}/fields/{field_id}")
def remove_form_field(
    form_id: int,
    field_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    delete_form_field(
        db=db,
        form_id=form_id,
        form_field_id=field_id,
        user_id=current_user.id
    )
