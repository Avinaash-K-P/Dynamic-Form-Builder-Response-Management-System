import os

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.export import ExportCreate, ExportResponse
from app.services.export_service import (
    create_export,
    get_exports,
    get_export,
    download_export
)
from app.core.security import verify_role

router = APIRouter(
    prefix="/exports",
    tags=["Exports"]
)


@router.post("/", response_model=ExportResponse)
def add_export(
    payload: ExportCreate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    return create_export(
        db=db,
        payload=payload,
        user_id=current_user.id
    )


@router.get("/", response_model=list[ExportResponse])
def list_exports(
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    return get_exports(
        db=db,
        user_id=current_user.id
    )


@router.get("/{export_id}", response_model=ExportResponse)
def view_export(
    export_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    return get_export(
        db=db,
        export_id=export_id,
        user_id=current_user.id
    )


@router.get("/{export_id}/download")
def download_export_file(
    export_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_role("admin"))
):
    file_path = download_export(
        db=db,
        export_id=export_id,
        user_id=current_user.id
    )

    return FileResponse(
        path=file_path, #type:ignore
        filename=os.path.basename(file_path) #type:ignore
    )