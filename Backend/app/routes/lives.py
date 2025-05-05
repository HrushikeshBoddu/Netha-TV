from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas
import shutil, os, re
from datetime import datetime

router = APIRouter(prefix="/lives", tags=["Live Sessions"])
UPLOAD_FOLDER = "static/banners"
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
# POST: Create Live Session
# ───────────────────────────────
@router.post("/", response_model=schemas.Live)
def create_live(
    title: str = Form(...),
    schedule: datetime = Form(...),
    description: str = Form(None),
    url: str = Form(None),
    banner: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    sanitized_name = secure_filename(banner.filename)
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{sanitized_name}"
    path = os.path.join(UPLOAD_FOLDER, filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(banner.file, buffer)

    live = models.LiveSession(
        title=title,
        schedule=schedule,
        description=description,
        url=url,
        banner_path=path
    )
    db.add(live)
    db.commit()
    db.refresh(live)
    return live

# ───────────────────────────────
# GET: All Live Sessions
# ───────────────────────────────
@router.get("/all", response_model=list[schemas.Live])
def get_lives(db: Session = Depends(get_db)):
    return db.query(models.LiveSession).order_by(models.LiveSession.created_at.desc()).all()

# ───────────────────────────────
# GET: Live Session by ID
# ───────────────────────────────
@router.get("/{live_id}", response_model=schemas.Live)
def get_live_by_id(live_id: int, db: Session = Depends(get_db)):
    live = db.query(models.LiveSession).filter(models.LiveSession.id == live_id).first()
    if not live:
        raise HTTPException(status_code=404, detail="Live session not found.")
    return live

# ───────────────────────────────
# PUT: Update Live Session by ID
# ───────────────────────────────
@router.put("/{live_id}", response_model=schemas.Live)
def update_live(
    live_id: int,
    title: str = Form(...),
    schedule: datetime = Form(...),
    description: str = Form(None),
    url: str = Form(None),
    banner: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    live = db.query(models.LiveSession).filter(models.LiveSession.id == live_id).first()
    if not live:
        raise HTTPException(status_code=404, detail="Live session not found.")

    live.title = title
    live.schedule = schedule
    live.description = description
    live.url = url

    if banner:
        if live.banner_path and os.path.exists(live.banner_path):
            os.remove(live.banner_path)
        sanitized_name = secure_filename(banner.filename)
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{sanitized_name}"
        path = os.path.join(UPLOAD_FOLDER, filename)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(banner.file, buffer)
        live.banner_path = path

    db.commit()
    db.refresh(live)
    return live

# ───────────────────────────────
# DELETE: Live Session by ID
# ───────────────────────────────
@router.delete("/{live_id}")
def delete_live(live_id: int, db: Session = Depends(get_db)):
    live = db.query(models.LiveSession).filter(models.LiveSession.id == live_id).first()
    if not live:
        raise HTTPException(status_code=404, detail="Live session not found.")

    if live.banner_path and os.path.exists(live.banner_path):
        os.remove(live.banner_path)

    db.delete(live)
    db.commit()
    return {"message": "Live session deleted successfully"}