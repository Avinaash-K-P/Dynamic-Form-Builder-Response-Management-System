from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import verify_role

from app.schemas.response_detail import (
    ResponseDetailCreate,
    ResponseDetailUpdate,
    ResponseDetailResponse,
    ResponseDetailListResponse
)
from typing import Optional
from app.services.response_detail_service import (
    create_response_detail,
    get_response_details,
    get_response_detail,
    update_response_detail,
    delete_response_detail
)


router = APIRouter(
    prefix="/responses",
    tags=["Response Details"]
)


# Create Response Detail
@router.post(
    "/{response_id}/details",
    response_model=ResponseDetailResponse
)
def add_response_detail(
    response_id: int,
    payload: ResponseDetailCreate,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    # Ensure URL response_id matches payload response_id
    payload.response_id = response_id

    return create_response_detail(
        db=db,
        payload=payload,
        user_id=current_user.id
    )


# Get All Response Details
@router.get(
    "/responses/{response_id}/details",
    response_model=ResponseDetailListResponse
)
def list_response_details(
    response_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    field_id: Optional[int] = Query(None, gt=0),
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("user"))
):
    return get_response_details(
        db=db,
        response_id=response_id,
        user_id=current_user.id,
        page=page,
        limit=limit,
        search=search,
        field_id=field_id
    )


# Get Response Detail by ID
@router.get(
    "/{response_id}/details/{detail_id}",
    response_model=ResponseDetailResponse
)
def view_response_detail(
    response_id: int,
    detail_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    detail = get_response_detail(
        db=db,
        detail_id=detail_id,
        user_id=current_user.id
    )

    # Ensure detail belongs to the requested response
    if detail.response_id != response_id: #type:ignore
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Response detail not found"
        )

    return detail


# Update Response Detail
@router.put(
    "/{response_id}/details/{detail_id}",
    response_model=ResponseDetailResponse
)
def edit_response_detail(
    response_id: int,
    detail_id: int,
    payload: ResponseDetailUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    detail = get_response_detail(
        db=db,
        detail_id=detail_id,
        user_id=current_user.id
    )

    # Ensure detail belongs to requested response
    if detail.response_id != response_id: #type:ignore
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Response detail not found"
        )

    return update_response_detail(
        db=db,
        detail_id=detail_id,
        payload=payload,
        user_id=current_user.id
    )


# Delete Response Detail
@router.delete(
    "/{response_id}/details/{detail_id}"
)
def remove_response_detail(
    response_id: int,
    detail_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    return delete_response_detail(
        db=db,
        detail_id=detail_id
    )

