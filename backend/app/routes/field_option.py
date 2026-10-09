from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import verify_role

from app.schemas.field_option import (
    FieldOptionCreate,
    FieldOptionUpdate,
    FieldOptionStatusUpdate,
    FieldOptionResponse
)

from app.services.field_option_service import (
    create_field_option,
    get_field_options,
    get_field_option,
    update_field_option,
    delete_field_option,
    update_field_option_status
)


router = APIRouter(
    prefix="/forms",
    tags=["Field Options"]
)


@router.post(
    "/{form_id}/fields/{field_id}/options",
    response_model=FieldOptionResponse,
    status_code=status.HTTP_201_CREATED
)
def add_field_option(
    form_id: int,
    field_id: int,
    payload: FieldOptionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    return create_field_option(
        db,
        form_id,
        field_id,
        current_user.id,
        payload
    )


@router.get(
    "/{form_id}/fields/{field_id}/options",
    response_model=list[FieldOptionResponse]
)
def list_field_options(
    form_id: int,
    field_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_field_options(
        db,
        form_id,
        field_id
    )


@router.get(
    "/{form_id}/fields/{field_id}/options/{option_id}",
    response_model=FieldOptionResponse
)
def view_field_option(
    form_id: int,
    field_id: int,
    option_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_field_option(
        db,
        form_id,
        field_id,
        option_id
    )


@router.put(
    "/{form_id}/fields/{field_id}/options/{option_id}",
    response_model=FieldOptionResponse
)
def edit_field_option(
    form_id: int,
    field_id: int,
    option_id: int,
    payload: FieldOptionUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    return update_field_option(
        db,
        form_id,
        field_id,
        option_id,
        current_user.id,
        payload
    )


@router.delete(
    "/{form_id}/fields/{field_id}/options/{option_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def remove_field_option(
    form_id: int,
    field_id: int,
    option_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    delete_field_option(
        db,
        form_id,
        field_id,
        option_id,
        current_user.id
    )

    return None


@router.patch(
    "/{form_id}/fields/{field_id}/options/{option_id}/status",
    response_model=FieldOptionResponse
)
def edit_field_option_status(
    form_id: int,
    field_id: int,
    option_id: int,
    payload: FieldOptionStatusUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    return update_field_option_status(
        db,
        form_id,
        field_id,
        option_id,
        current_user.id,
        payload.is_active
    )