from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app import database, models, schemas
import shutil
import os
from datetime import datetime

router = APIRouter(prefix="/posts", tags=["Posts"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_FOLDER = "static/banners"

@router.post("/", response_model=schemas.Post)
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    banner: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{banner.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(banner.file, buffer)

    db_post = models.Post(
        title=title,
        content=content,
        banner_path=path
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/", response_model=list[schemas.Post])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).all()
