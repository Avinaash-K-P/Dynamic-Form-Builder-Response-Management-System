from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.models.response import FormResponse, ResponseDetail
from app.models.form import FormField
from app.schemas.response_detail import (
    ResponseDetailCreate,
    ResponseDetailUpdate
)
from app.schemas.activity_log import ActivityLogCreate
from app.services.activity_log_service import create_activity_log
from app.utils.pagination import paginate
from app.utils.field_validation import validate_field_value
from app.utils.conditional_logic import evaluate_conditional_logic

def create_response_detail(
    db: Session,
    payload: ResponseDetailCreate,
    user_id: int
):
    # Check whether response exists
    response = db.query(FormResponse).filter(
        FormResponse.id == payload.response_id
    ).first()

    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form response not found"
        )

    # Check response ownership
    if response.submitted_by != user_id:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to add details to this response"
        )

    # Check whether field exists
    field = db.query(FormField).filter(
        FormField.id == payload.field_id
    ).first()

    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form field not found"
        )

    should_display = evaluate_conditional_logic(
        conditional_logic=field.conditional_logic, # type: ignore
        responses=response
    )

    if not should_display:
        raise HTTPException(
            status_code=400,
            detail=f"Conditional rule for '{field.label}' is not satisfied"
        )

    # Check field belongs to the same form
    if field.form_id != response.form_id:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Field does not belong to this form"
        )

    # Prevent duplicate answer for the same field
    existing_detail = db.query(ResponseDetail).filter(
        ResponseDetail.response_id == payload.response_id,
        ResponseDetail.field_id == payload.field_id
    ).first()

    if existing_detail:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Response detail already exists for this field"
        )

    # Validate submitted value
    try:
        validate_field_value(
            field=field,
            value=payload.response_value
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        )

    # Create response detail
    detail = ResponseDetail(
        response_id=payload.response_id,
        field_id=payload.field_id,
        response_value=payload.response_value
    )

    db.add(detail)
    db.commit()
    db.refresh(detail)

    create_activity_log(
        db=db,
        user_id=user_id,
        payload=ActivityLogCreate(
            action="RESPONSE_SUBMIT",
            entity_type="FormResponse",
            entity_id=response.id,  # type: ignore
            description=f"Response submitted for form ID {response.form_id}"
        )
    )

    return detail


def get_response_details(
    db: Session,
    response_id: int,
    user_id: int,
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    field_id: Optional[int] = None
):
    # Verify response ownership
    response = db.query(FormResponse).filter(
        FormResponse.id == response_id,
        FormResponse.submitted_by == user_id
    ).first()

    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found"
        )

    query = db.query(ResponseDetail).filter(
        ResponseDetail.response_id == response_id
    )

    # Search inside submitted answer
    if search:
        query = query.filter(
            ResponseDetail.response_value.ilike(f"%{search}%")
        )

    # Filter by field
    if field_id:
        query = query.filter(
            ResponseDetail.field_id == field_id
        )

    query = query.order_by(
        ResponseDetail.id.desc()
    )

    return paginate(
        query=query,
        page=page,
        limit=limit
    )


def get_response_detail(
    db: Session,
    detail_id: int,
    user_id: int
):
    # Find response detail
    detail = db.query(ResponseDetail).filter(
        ResponseDetail.id == detail_id
    ).first()

    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response detail not found"
        )

    # Find parent response
    response = db.query(FormResponse).filter(
        FormResponse.id == detail.response_id
    ).first()

    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form response not found"
        )

    # Check response ownership
    if response.submitted_by != user_id:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this response detail"
        )

    return detail


def update_response_detail(
    db: Session,
    detail_id: int,
    payload: ResponseDetailUpdate,
    user_id: int
):
    # Find response detail
    detail = db.query(ResponseDetail).filter(
        ResponseDetail.id == detail_id
    ).first()

    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response detail not found"
        )

    # Find parent response
    response = db.query(FormResponse).filter(
        FormResponse.id == detail.response_id
    ).first()

    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form response not found"
        )

    # Check response ownership
    if response.submitted_by != user_id:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this response detail"
        )

    # Find field
    field = db.query(FormField).filter(
        FormField.id == detail.field_id
    ).first()

    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form field not found"
        )

    # Validate updated value
    if payload.response_value is not None:
        try:
            validate_field_value(
                field=field,
                value=payload.response_value
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(exc)
            )

        detail.response_value = payload.response_value  # type: ignore

    db.commit()
    db.refresh(detail)

    return detail


def delete_response_detail(
    db: Session,
    detail_id: int
):
    # Find response detail
    detail = db.query(ResponseDetail).filter(
        ResponseDetail.id == detail_id
    ).first()

    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response detail not found"
        )

    db.delete(detail)
    db.commit()

    return {
        "message": "Response detail deleted successfully"
    }