from celery import Celery
import app.models

celery_app = Celery(
    "dynamic_form_builder",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)


celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True
)

celery_app.autodiscover_tasks([
    "app.celery_app"
])