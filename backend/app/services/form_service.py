from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.form import Form
from app.schemas.form import FormCreate, FormUpdate, FormStatusUpdate
from app.schemas.activity_log import ActivityLogCreate
from app.services.activity_log_service import create_activity_log
from app.utils.cache import set_cache, get_cache, delete_cache

def create_form(
    db: Session,
    payload: FormCreate,
    user_id: int
):
    form = Form(
        title=payload.title,
        description=payload.description,
        created_by=user_id,
    )

    db.add(form)
    db.commit()
    db.refresh(form)

    create_activity_log(
    db=db,
    user_id=user_id,
    payload=ActivityLogCreate(
        action="FORM_CREATE",
        entity_type="Form",
        entity_id=form.id, # type: ignore
        description=f"Form '{form.title}' created successfully"
    )
    )

    delete_cache("forms:all")
    delete_cache(f"forms:{form.id}")  

    return form

def get_forms(db: Session):

    cache_key = "forms:all"

    cached_forms = get_cache(cache_key)

    if cached_forms is not None:
        return cached_forms

    forms = db.query(Form).order_by(
        Form.created_at.desc()
    ).all()

    data = [
        {
            "id": form.id,
            "title": form.title,
            "description": form.description,
            "created_by": form.created_by,
            "is_active": form.is_active,
            "created_at": form.created_at,
            "updated_at": form.updated_at
        }
        for form in forms
    ]

    set_cache(
        cache_key,
        data
    )

    return data

def get_form(db: Session, form_id: int):

    cache_key = f"forms:{form_id}"

    cached_form = get_cache(cache_key)

    if cached_form is not None:
        return cached_form

    form = db.query(Form).filter(
        Form.id == form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    data = {
        "id": form.id,
        "title": form.title,
        "description": form.description,
        "created_by": form.created_by,
        "is_active": form.is_active,
        "created_at": form.created_at,
        "updated_at": form.updated_at
    }

    set_cache(
        cache_key,
        data
    )

    return data

def update_form(
    db: Session,
    form_id: int,
    payload: FormUpdate,
    user_id:int
):
    form = get_form(db, form_id)

    if form.created_by != user_id: # type: ignore
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to update this form"
        )

    if payload.title is not None:
        form.title = payload.title # type: ignore

    if payload.description is not None:
        form.description = payload.description # type: ignore

    db.commit()
    db.refresh(form)

    delete_cache("forms:all")
    delete_cache(f"forms:{form_id}")

    return form

def delete_form(db:Session, form_id:int):

    form = get_form(db, form_id)

    db.delete(form)
    db.commit()

    delete_cache("forms:all")
    delete_cache(f"forms:{form_id}")

    return {
        "message": f"Form {form.get("title")} is deleted"
    }

def update_form_status(db:Session, payload: FormStatusUpdate, form_id:int):

    form = get_form(db, form_id)

    form.is_active = payload.is_active # type:ignore 

    db.commit()
    db.refresh(form)

    delete_cache("forms:all")
    delete_cache(f"forms:{form_id}")

    return {
        "message": f"Status changed to {form.get("is_active")}"
    }