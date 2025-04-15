from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import database, models
from datetime import datetime

router = APIRouter(prefix="/history", tags=["History"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_history(db: Session = Depends(get_db)):
    now = datetime.utcnow()

    # vlogs = db.query(models.Vlog).all()
    # posts = db.query(models.Post).all()
    lives = db.query(models.LiveSession).all()
    past_events = db.query(models.Event).filter(models.Event.scheduled_time < now).all()

    history = []

    # for item in vlogs:
    #     history.append({
    #         "id": item.id,
    #         "type": "vlog",
    #         "title": item.title,
    #         "created_at": item.created_at
    #     })

    # for item in posts:
    #     history.append({
    #         "id": item.id,
    #         "type": "post",
    #         "title": item.title,
    #         "created_at": item.created_at
    #     })

    for item in lives:
        history.append({
            "id": item.id,
            "type": "live",
            "title": item.title,
            "created_at": item.created_at
        })

    for item in past_events:
        history.append({
            "id": item.id,
            "type": "event",
            "title": item.title,
            "created_at": item.scheduled_time
        })

    return sorted(history, key=lambda x: x["created_at"], reverse=True)
