from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_role
from app.schemas.form import (
    FormCreate,
    FormUpdate,
    FormResponse,
    FormStatusUpdate
)
from app.services.form_service import (
    create_form,
    get_forms,
    get_form,
    update_form,
    delete_form,
    update_form_status
)


router = APIRouter(
    prefix="/forms",
    tags=["Forms"]
)


@router.post("/", response_model=FormResponse)
def add_form(
    payload: FormCreate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    return create_form(
        db=db,
        payload=payload,
        user_id=current_user.id
    )


@router.get("/", response_model=list[FormResponse])
def list_forms(
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("user"))
):
    return get_forms(db=db)


@router.get("/{form_id}", response_model=FormResponse)
def view_form(
    form_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("user"))
):
    return get_form(db=db,form_id=form_id)


@router.put("/{form_id}", response_model=FormResponse)
def edit_form(
    form_id: int,
    payload: FormUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    return update_form(
        db=db,
        form_id=form_id,
        payload=payload,
        user_id = current_user.id
    )


@router.delete("/{form_id}")
def remove_form(
    form_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    return delete_form(
        db=db,
        form_id=form_id
    )


@router.patch("/{form_id}/status")
def edit_form_status(
    form_id: int,
    payload: FormStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    return update_form_status(
        db=db,
        payload=payload,
        form_id=form_id,
    )