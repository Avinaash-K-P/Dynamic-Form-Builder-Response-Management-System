from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.response import FormResponse
from app.schemas.form_response import (
    FormResponseCreate,
    FormResponseUpdate
)
from app.utils.cache import set_cache, get_cache, delete_cache
from app.services.notification_service import create_notification
from app.celery_app.notification_tasks import create_notification_task

def create_form_response(
    db: Session,
    payload: FormResponseCreate,
    user_id: int
):
    # Check whether form exists
    form = db.query(Form).filter(
        Form.id == payload.form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    # Check whether form is active
    if not form.is_active: #type:ignore 
        raise HTTPException(
            status_code=400,
            detail="Form is inactive"
        )

    # Create response
    response = FormResponse(
        form_id=payload.form_id,
        submitted_by=user_id,
        status="submitted"
    )

    db.add(response)
    db.commit()
    db.refresh(response)

    delete_cache(f"responses:user:{user_id}") 
    
    create_notification_task.delay(
        user_id=form.created_by,
        title="New Response Received",
        message=f"A new response has been submitted for your form '{form.title}'.",
        notification_type="response"
    )
        
    return response

def get_form_responses(
    db: Session,
    user_id: int
):
    cache_key = f"responses:user:{user_id}"

    # Check Redis first
    cached_responses = get_cache(cache_key)

    if cached_responses is not None:
        print("CACHING")
        return cached_responses
    
    responses = db.query(FormResponse).filter(
        FormResponse.submitted_by == user_id
    ).order_by(
        FormResponse.submitted_at.desc()
    ).all()

    data = [
        {
            "id": response.id,
            "form_id": response.form_id,
            "submitted_by": response.submitted_by,
            "status": response.status,
            "submitted_at": response.submitted_at
        }
        for response in responses
    ]

    set_cache(cache_key, data)

    return responses


def get_form_response(
    db: Session,
    response_id: int,
    user_id: int
):

    cache_key = f"response:{response_id}:user:{user_id}"

    # Check Redis first
    cached_response = get_cache(cache_key)

    if cached_response is not None:
        return cached_response

    response = db.query(FormResponse).filter(
        FormResponse.id == response_id
    ).first()

    if not response:
        raise HTTPException(
            status_code=404,
            detail="Form response not found"
        )

    # Check ownership
    if response.submitted_by != user_id: # type: ignore
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to view this response"
        ) 

    data = {
        "id": response.id,
        "form_id": response.form_id,
        "submitted_by": response.submitted_by,
        "status": response.status,
        "submitted_at": response.submitted_at
    }

    # Store in Redis
    set_cache(cache_key,data)
    
    return response

def update_form_response(
    db: Session,
    response_id: int,
    payload: FormResponseUpdate,
    user_id: int
):
    # Find response
    response = db.query(FormResponse).filter(
        FormResponse.id == response_id
    ).first()

    if not response:
        raise HTTPException(
            status_code=404,
            detail="Form response not found"
        )

    # Check ownership
    if response.submitted_by != user_id: # type:ignore
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to update this response"
        )

    # Update supplied fields
    if payload.status is not None:
        response.status = payload.status # type:ignore

    db.commit()
    db.refresh(response)

    delete_cache(f"responses:user:{user_id}")
    delete_cache(f"response:{response_id}:user:{user_id}")

    return response

def delete_form_response(
    db: Session,
    response_id: int,
    user_id:int
):
    # Find response
    response = db.query(FormResponse).filter(
        FormResponse.id == response_id
    ).first()

    if not response:
        raise HTTPException(
            status_code=404,
            detail="Form response not found"
        )

    db.delete(response)
    db.commit()

    delete_cache(f"responses:user:{user_id}")
    delete_cache(f"response:{response_id}:user:{user_id}")

    return {
        "message": "Form response deleted successfully"
    }