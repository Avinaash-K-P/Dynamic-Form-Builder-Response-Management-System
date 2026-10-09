from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.models.form import Form, FormField, FieldOption
from app.models.response import FormResponse, ResponseDetail
from datetime import datetime, time

def get_total_forms(db:Session):

    data = db.query(Form).count()

    return data


def get_active_forms(db:Session):

    data = db.query(Form).filter(
        Form.is_active == True
    ).count()

    return data


def get_inactive_forms(db:Session):
    
    data = db.query(Form).filter(
        Form.is_active == False
    ).count()

    return data


def get_total_responses(db:Session):

    data = db.query(FormResponse).count() 

    return data


def get_today_responses(db:Session):

    today = datetime.utcnow().date()

    start_of_day = datetime.combine(today, time.min)
    end_of_day = datetime.combine(today, time.max)

    data = db.query(FormResponse).filter(
        FormResponse.submitted_at >= start_of_day,
        FormResponse.submitted_at <= end_of_day
    ).count() 

    return data

def get_total_users(db:Session):

    data = db.query(User).count() 

    return data   

def get_active_users(db:Session):

    data = db.query(User).filter(
        User.is_active == True
    ).count() 

    return data   

def get_responses_by_form(db:Session):

    data = db.query(
        Form.id.label("form_id"),
        Form.title.label("form_title"),
        func.count(FormResponse.id).label("response_count")
    ).outerjoin(
        FormResponse,
        Form.id == FormResponse.form_id
    ).group_by(
        Form.id,
        Form.title
    ).all()

    return data

def get_form_by_id(db, form_id):

    data = db.query(Form).filter(
        Form.id == form_id
    ).first()

    return data


def get_form_total_responses(db, form_id):

    data = db.query(FormResponse).filter(
        FormResponse.id == form_id
    ).count()

    return data


def get_form_today_responses(db, form_id):

    today = datetime.utcnow().date()

    start_of_day = datetime.combine(today, time.min)
    end_of_day = datetime.combine(today, time.max)

    data = db.query(FormResponse).filter(
        FormResponse.form_id == form_id,
        FormResponse.submitted_at >= start_of_day,
        FormResponse.submitted_at <= end_of_day
    ).count()

    return data


def get_form_fields_analytics(db, form_id):

    fields = db.query(FormField).filter(
        FormField.form_id == form_id
    ).order_by(
        FormField.display_order.asc()
    ).all()

    result = []

    for field in fields:

        total_answers = db.query(ResponseDetail).filter(
            ResponseDetail.field_id == field.id
        ).count()

        options = None

        if field.field_type in ["dropdown", "radio", "checkbox"]:

            option_data = db.query(
                FieldOption.label.label("option_label"),
                FieldOption.value.label("option_value"),
                func.count(ResponseDetail.id).label("response_count")
            ).outerjoin(
                ResponseDetail,
                (
                    ResponseDetail.field_id == field.id
                ) &
                (
                    ResponseDetail.response_value == FieldOption.value
                )
            ).filter(
                FieldOption.field_id == field.id
            ).group_by(
                FieldOption.id,
                FieldOption.label,
                FieldOption.value
            ).order_by(
                FieldOption.display_order.asc()
            ).all()

            options = option_data

        result.append({
            "field_id": field.id,
            "label": field.label,
            "field_type": field.field_type,
            "total_answers": total_answers,
            "options": options
        })

    return result


def get_dashboard_analytics(db:Session):

    return {
        "total_forms": get_total_forms(db),
        "active_forms": get_active_forms(db),
        "inactive_forms": get_inactive_forms(db),
        "total_responses": get_total_responses(db),
        "today_responses": get_today_responses(db),
        "total_users": get_total_users(db),
        "active_users": get_active_users(db),
        "responses_by_form": get_responses_by_form(db)
    }

def get_form_analytics(db, form_id):

    form = get_form_by_id(db, form_id)

    total_responses = get_form_total_responses(
        db,
        form_id
    )

    today_responses = get_form_today_responses(
        db,
        form_id
    )

    fields = get_form_fields_analytics(
        db,
        form_id
    )

    return {
        "form_id": form.id,
        "title": form.title,
        "is_active": form.is_active,
        "total_responses": total_responses,
        "today_responses": today_responses,
        "fields": fields
    }