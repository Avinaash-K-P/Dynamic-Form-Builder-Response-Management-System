from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import verify_role
from app.schemas.form_response import (
    FormResponseCreate,
    FormResponseUpdate,
    FormResponseResponse
)
from app.services.form_response_service import (
    create_form_response,
    get_form_responses,
    get_form_response,
    update_form_response,
    delete_form_response
)


router = APIRouter(
    prefix="/responses",
    tags=["Form Responses"]
)


# Create Form Response
@router.post(
    "/",
    response_model=FormResponseResponse
)
def add_form_response(
    payload: FormResponseCreate,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return create_form_response(
        db=db,
        payload=payload,
        user_id=current_user.id
    )


# Get All Form Responses
@router.get(
    "/",
    response_model=list[FormResponseResponse]
)
def list_form_responses(
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_form_responses(
        db=db,
        user_id=current_user.id
    )


# Get Form Response by ID
@router.get(
    "/{response_id}",
    response_model=FormResponseResponse
)
def view_form_response(
    response_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_form_response(
        db=db,
        response_id=response_id,
        user_id=current_user.id
    )


# Update Form Response
@router.put(
    "/{response_id}",
    response_model=FormResponseResponse
)
def edit_form_response(
    response_id: int,
    payload: FormResponseUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return update_form_response(
        db=db,
        response_id=response_id,
        payload=payload,
        user_id=current_user.id
    )


# Delete Form Response
@router.delete(
    "/{response_id}"
)
def remove_form_response(
    response_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    return delete_form_response(
        db=db,
        response_id=response_id,
        user_id = current_user.id
    )