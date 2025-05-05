from fastapi import APIRouter, UploadFile, File, Form, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas
import shutil, os, re
from datetime import datetime
from dateutil import parser

router = APIRouter(prefix="/events", tags=["Events"])
UPLOAD_FOLDER = "static/event_banners"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def secure_filename(filename: str) -> str:
    return re.sub(r'[^\w_.-]', '_', filename)

# ───────────────────────────────
# POST: Create Event
# ───────────────────────────────
@router.post("/", response_model=schemas.Event)
def create_event(
    title: str = Form(...),
    description: str = Form(None),
    scheduled_time: str = Form(...),
    url: str = Form(None),
    banner: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        scheduled_time_obj = parser.isoparse(scheduled_time)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format.")

    sanitized_name = secure_filename(banner.filename)
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{sanitized_name}"
    path = os.path.join(UPLOAD_FOLDER, filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(banner.file, buffer)

    event = models.Event(
        title=title,
        description=description,
        scheduled_time=scheduled_time_obj,
        url=url,
        banner_path=path
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

# ───────────────────────────────
# GET: All Events
# ───────────────────────────────
@router.get("/all", response_model=list[schemas.Event])
def get_events(db: Session = Depends(get_db)):
    return db.query(models.Event).order_by(models.Event.scheduled_time).all()

# ───────────────────────────────
# GET: Event by ID
# ───────────────────────────────
@router.get("/{event_id}", response_model=schemas.Event)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# ───────────────────────────────
# PUT: Update Event by ID
# ───────────────────────────────
@router.put("/{event_id}", response_model=schemas.Event)
def update_event(
    event_id: int,
    title: str = Form(...),
    description: str = Form(None),
    scheduled_time: str = Form(...),
    url: str = Form(None),
    banner: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    try:
        event.scheduled_time = parser.isoparse(scheduled_time)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format.")

    event.title = title
    event.description = description
    event.url = url

    if banner:
        if event.banner_path and os.path.exists(event.banner_path):
            os.remove(event.banner_path)
        sanitized_name = secure_filename(banner.filename)
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{sanitized_name}"
        path = os.path.join(UPLOAD_FOLDER, filename)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(banner.file, buffer)
        event.banner_path = path

    db.commit()
    db.refresh(event)
    return event

# ───────────────────────────────
# DELETE: Event by ID
# ───────────────────────────────
@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.banner_path and os.path.exists(event.banner_path):
        os.remove(event.banner_path)

    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}

# # ───────────────────────────────
# # GET: Event Statistics
# # ───────────────────────────────
# @router.get("/stats")
# def get_event_stats(db: Session = Depends(get_db)):
#     now = datetime.utcnow()
#     total = db.query(models.Event).count()
#     upcoming = db.query(models.Event).filter(models.Event.scheduled_time >= now).count()
#     past = db.query(models.Event).filter(models.Event.scheduled_time < now).count()

#     return {
#         "total_events": total,
#         "upcoming_events": upcoming,
#         "past_events": past
#     }

# ───────────────────────────────
# DELETE: All Events (Dangerous)
# ───────────────────────────────
@router.delete("/delete/all", status_code=204)
def delete_all_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()
    for event in events:
        if event.banner_path and os.path.exists(event.banner_path):
            os.remove(event.banner_path)
    db.query(models.Event).delete()
    db.commit()