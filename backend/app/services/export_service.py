import os
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from openpyxl import Workbook

from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from app.models.export import Export
from app.models.form import Form
from app.models.response import FormResponse, ResponseDetail
from app.models.form import FormField
from app.schemas.export import ExportCreate
from app.schemas.activity_log import ActivityLogCreate
from app.services.activity_log_service import create_activity_log
from app.services.notification_service import create_notification
from app.utils.cache import get_cache, set_cache, delete_cache
from app.celery_app.notification_tasks import create_notification_task

def generate_excel_export(
    db: Session,
    export: Export,
    form: Form
):
    export_directory = "exports"
    os.makedirs(export_directory, exist_ok=True)

    filename = f"form_{form.id}_export_{export.id}.xlsx"
    file_path = os.path.join(
        export_directory,
        filename
    )

    workbook = Workbook()
    worksheet = workbook.active
    worksheet.title = "Responses" #type: ignore

    # Get form fields
    fields = db.query(FormField).filter(
        FormField.form_id == form.id
    ).order_by(
        FormField.display_order
    ).all()

    # Get responses
    responses = db.query(FormResponse).filter(
        FormResponse.form_id == form.id
    ).all()

    # Headers
    headers = [
        "Response ID",
        "Submitted By",
        "Status",
        "Submitted At"
    ]

    headers.extend(
        [field.label for field in fields] #type: ignore
    )

    worksheet.append(headers) #type: ignore

    # Response rows
    for response in responses:

        row = [
            response.id,
            response.submitted_by,
            response.status,
            response.submitted_at
        ]

        for field in fields:

            detail = db.query(ResponseDetail).filter(
                ResponseDetail.response_id == response.id,
                ResponseDetail.field_id == field.id
            ).first()

            if detail:
                row.append(detail.response_value)
            else:
                row.append(None)

        worksheet.append(row) #type: ignore

    workbook.save(file_path)

    return file_path

def generate_pdf_export(
    db: Session,
    export: Export,
    form: Form
):
    export_directory = "exports"
    os.makedirs(export_directory, exist_ok=True)

    filename = f"form_{form.id}_export_{export.id}.pdf"
    file_path = os.path.join(
        export_directory,
        filename
    )

    document = SimpleDocTemplate(
        file_path,
        pagesize=landscape(A4),
        rightMargin=20,
        leftMargin=20,
        topMargin=20,
        bottomMargin=20
    )

    styles = getSampleStyleSheet()
    elements = []

    # Form title
    elements.append(
        Paragraph(
            form.title, #type:ignore
            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 10)
    )

    # Form description
    if form.description: #type:ignore
        elements.append(
            Paragraph(
                form.description, #type:ignore
                styles["Normal"]
            )
        )

        elements.append(
            Spacer(1, 10)
        )

    # Get fields
    fields = db.query(FormField).filter(
        FormField.form_id == form.id
    ).order_by(
        FormField.display_order
    ).all()

    # Get responses
    responses = db.query(FormResponse).filter(
        FormResponse.form_id == form.id
    ).all()

    # Headers
    headers = [
        "Response ID",
        "Submitted By",
        "Status",
        "Submitted At"
    ]

    headers.extend(
        [field.label for field in fields] #type:ignore
    )

    table_data = [headers]

    # Response rows
    for response in responses:

        row = [
            str(response.id),
            str(response.submitted_by),
            str(response.status),
            str(response.submitted_at)
        ]

        for field in fields:

            detail = db.query(ResponseDetail).filter(
                ResponseDetail.response_id == response.id,
                ResponseDetail.field_id == field.id
            ).first()

            if detail:
                row.append(
                    str(detail.response_value)
                    if detail.response_value is not None
                    else ""
                )
            else:
                row.append("")

        table_data.append(row)

    table = Table(
        table_data,
        repeatRows=1
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.grey
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.black
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                7
            ),
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "TOP"
            )
        ])
    )

    elements.append(table)

    document.build(elements)

    return file_path

def create_export(
    db: Session,
    payload: ExportCreate,
    user_id: int
):
    # Check if form exists
    form = db.query(Form).filter(
        Form.id == payload.form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    # Validate export type
    export_type = payload.export_type.lower()

    if export_type not in ["excel", "pdf"]:
        raise HTTPException(
            status_code=400,
            detail="Export type must be either excel or pdf"
        )

    # Create export record
    export = Export(
        form_id=payload.form_id,
        requested_by=user_id,
        export_type=export_type,
        status="pending"
    )

    db.add(export)
    db.commit()
    db.refresh(export)

    try:

        # Mark as processing
        export.status = "processing" # type: ignore
        db.commit()

        # Generate file
        if export_type == "excel":

            file_path = generate_excel_export(
                db=db,
                export=export,
                form=form
            )

        else:

            file_path = generate_pdf_export(
                db=db,
                export=export,
                form=form
            )

        # Update export record
        export.file_path = file_path # type: ignore
        export.status = "completed" # type: ignore
        export.completed_at = datetime.utcnow() # type: ignore

        db.commit()
        db.refresh(export)


        create_activity_log(
        db=db,
        user_id=user_id,
        payload=ActivityLogCreate(
        action="EXPORT_CREATE",
        entity_type="Export",
        entity_id=export.id, # type: ignore
        description=f"{export.export_type.upper()} export created for form ID {export.form_id}"
        )
        )

        create_notification_task.delay(
            user_id=export.requested_by,
            title="Export Completed",
            message=f"Your {export.export_type.upper()} export is ready for download.",
            notification_type="export"
        )
        
        delete_cache(f"exports:user:{user_id}")
        delete_cache(f"export:{export.id}:user:{user_id}")

        return export

    except Exception as e:

        db.rollback()

        export = db.query(Export).filter(
            Export.id == export.id
        ).first()

        if export:
            export.status = "failed" # type: ignore
            db.commit()

        raise HTTPException(
            status_code=500,
            detail=f"Export generation failed: {str(e)}"
        )

def get_exports(
    db: Session,
    user_id: int
):
    cache_key = f"exports:user:{user_id}"

    cached_exports = get_cache(cache_key)

    if cached_exports is not None:
        return cached_exports

    exports = db.query(Export).filter(
        Export.requested_by == user_id
    ).order_by(
        Export.created_at.desc()
    ).all()

    data = [
        {
            "id": export.id,
            "form_id": export.form_id,
            "requested_by": export.requested_by,
            "export_type": export.export_type,
            "status": export.status,
            "file_path": export.file_path,
            "created_at": export.created_at,
            "completed_at": export.completed_at
        }
        for export in exports
    ]

    set_cache(
        cache_key,
        data
    )

    return data

def get_export(
    db: Session,
    export_id: int,
    user_id: int
):
    cache_key = f"export:{export_id}:user:{user_id}"

    cached_export = get_cache(cache_key)

    if cached_export is not None:
        return cached_export

    export = db.query(Export).filter(
        Export.id == export_id
    ).first()

    if not export:
        raise HTTPException(
            status_code=404,
            detail="Export not found"
        )

    if export.requested_by != user_id: #type:ignore
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to view this export"
        )

    data = {
        "id": export.id,
        "form_id": export.form_id,
        "requested_by": export.requested_by,
        "export_type": export.export_type,
        "status": export.status,
        "file_path": export.file_path,
        "created_at": export.created_at,
        "completed_at": export.completed_at
    }

    set_cache(
        cache_key,
        data
    )

    return data

def download_export(
    db: Session,
    export_id: int,
    user_id: int
):
    export = db.query(Export).filter(
        Export.id == export_id
    ).first()

    if not export:
        raise HTTPException(
            status_code=404,
            detail="Export not found"
        )

    if export.requested_by != user_id: # type: ignore
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to download this export"
        )

    if export.status != "completed": # type: ignore
        raise HTTPException(
            status_code=400,
            detail=f"Export is not ready. Current status: {export.status}"
        )

    if not export.file_path: # type: ignore
        raise HTTPException(
            status_code=404,
            detail="Export file not found"
        )

    if not os.path.exists(export.file_path): # type: ignore 
        raise HTTPException(
            status_code=404,
            detail="Export file does not exist"
        )

    return export.file_path