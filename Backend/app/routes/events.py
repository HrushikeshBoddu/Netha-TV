from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, status
from sqlalchemy.orm import Session
from app import database, models, schemas
import shutil
import os
from datetime import datetime
from dateutil import parser 

router = APIRouter(prefix="/events", tags=["Events"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_FOLDER = "static/event_banners"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/", response_model=schemas.Event)
def create_event(
    title: str = Form(...),
    description: str = Form(...),
    scheduled_time: str = Form(...),  # User must provide
    banner: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        scheduled_time_obj = parser.isoparse(scheduled_time)  # Handles "Z"
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid datetime format. Use ISO format like 2025-04-04T10:31:15.466Z"
        )

    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{banner.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(banner.file, buffer)

    event = models.Event(
        title=title,
        description=description,
        scheduled_time=scheduled_time_obj,
        banner_path=path
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.get("/", response_model=list[schemas.Event])
def get_events(db: Session = Depends(get_db)):
    return db.query(models.Event).order_by(models.Event.scheduled_time).all()

@router.get("/{event_id}", response_model=schemas.Event)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.delete("/delete/all", status_code=204)
def delete_all_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()
    for event in events:
        if event.banner_path and os.path.exists(event.banner_path):
            os.remove(event.banner_path)
    db.query(models.Event).delete()
    db.commit()


@router.get("/stats")
def get_event_stats(db: Session = Depends(get_db)):
    now = datetime.utcnow()

    total = db.query(models.Event).count()
    upcoming = db.query(models.Event).filter(models.Event.scheduled_time >= now).count()
    past = db.query(models.Event).filter(models.Event.scheduled_time < now).count()

    return {
        "total_events": total,
        "upcoming_events": upcoming,
        "past_events": past
    }
