from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    auth,
    profile,
    role,
    form,
    form_field,
    field_option,
    form_response,
    response_detail,
    analytic,
    export,
    activity_log,
    notification
)

app = FastAPI(title="Dynamic Form Builder and Response Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(role.router)
app.include_router(form.router)
app.include_router(form_field.router)
app.include_router(field_option.router)
app.include_router(form_response.router)
app.include_router(response_detail.router)
app.include_router(analytic.router)
app.include_router(export.router)
app.include_router(activity_log.router)
app.include_router(notification.router)

@app.get("/")
def read_root():
    return {
        "message":"Fastapi running successfully!"
    }