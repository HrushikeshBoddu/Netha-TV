from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app import database, models, schemas
import shutil
import os
from datetime import datetime

router = APIRouter(prefix="/lives", tags=["Live Sessions"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_FOLDER = "static/banners"

@router.post("/", response_model=schemas.Live)
def create_live(
    title: str = Form(...),
    schedule: datetime = Form(...),
    description: str = Form(...),
    banner: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{banner.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(banner.file, buffer)

    db_live = models.LiveSession(
        title=title,
        schedule=schedule,
        description=description,
        banner_path=path
    )
    db.add(db_live)
    db.commit()
    db.refresh(db_live)
    return db_live

@router.get("/", response_model=list[schemas.Live])
def get_lives(db: Session = Depends(get_db)):
    return db.query(models.LiveSession).order_by(models.LiveSession.created_at.desc()).all()
