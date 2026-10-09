from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.role import Role
from app.schemas.role import CreateRole, UpdateRole
from datetime import datetime
from app.utils.cache import (
    set_cache,
    get_cache,
    delete_cache
)

def create_role(db:Session, payload:CreateRole):

    role_exist = db.query(Role).filter(
        Role.name == payload.name
    ).first()

    if role_exist:
        raise HTTPException(status_code=409, detail="Role name already exist")

    new_role = Role(
        name = payload.name,
        description = payload.description
    )

    db.add(new_role)
    db.commit()
    db.refresh(new_role)    

    delete_cache("roles:all")

    return new_role

def get_roles(db:Session):

    cache_key = "roles:all" 

    cache_roles = get_cache(cache_key) 

    if cache_roles is not None:
        print("CACHING")
        return cache_roles

    roles = db.query(Role).all()

    result = [
        {
            "id": role.id,
            "name": role.name,
            "description": role.description
        }
        for role in roles
    ]


    set_cache(cache_key, result, 300)

    return roles

def get_role(db:Session, role_id:int):

    role = db.query(Role).filter(
        Role.id == role_id
    ).first() 

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    return role

def update_role(db:Session, payload:UpdateRole, role_id:int, user_id:int):

    role = db.query(Role).filter(
        Role.id == role_id
    ).first() 

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    role.name = payload.name # type: ignore
    role.description = payload.description # type: ignore
    role.updated_at = datetime.utcnow() # type: ignore

    db.commit()
    db.refresh(role)

    delete_cache("roles:all")

    return role

def delete_role(db:Session, role_id:int, user_id:int):

    role = db.query(Role).filter(
        Role.id == role_id
    ).first() 

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    db.delete(role)
    db.commit()

    delete_cache("roles:all")

    return {"message": f"Role id: {role.id} has been deleted"} 