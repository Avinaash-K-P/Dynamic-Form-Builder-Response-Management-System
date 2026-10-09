from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_role
from app.schemas.role import CreateRole, UpdateRole 
from app.services.role_service import (
    create_role,
    get_role,
    get_roles,
    update_role,
    delete_role
)

router = APIRouter(tags=["Role Management"])

@router.post("/roles")
def add_role(
    payload: CreateRole,
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    return create_role(db=db, payload=payload)

@router.get("/roles")
def list_roles(
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_roles(db=db)

@router.get("/roles/{id}")
def view_role(
    id:int,
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("user"))
):
    return get_role(db=db, role_id=id)

@router.put("/roles/{id}")
def edit_role(
    id:int,
    payload: UpdateRole,
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    return update_role(db=db, payload=payload, role_id=id, user_id=current_user.id)

@router.delete("/roles/{id}")
def remove_roles(
    id:int,
    db:Session = Depends(get_db),
    current_user = Depends(verify_role("admin"))
):
    return delete_role(db=db, role_id=id, user_id=current_user.id)