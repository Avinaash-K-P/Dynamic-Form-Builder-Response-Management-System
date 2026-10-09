from sqlalchemy.orm import Query


def paginate(query: Query, page: int, limit: int):
    
    total = query.count()

    offset = (page - 1) * limit

    items = query.offset(offset).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }