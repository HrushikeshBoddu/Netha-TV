
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, status
from sqlalchemy.orm import Session
from app import database, models, schemas
import shutil
import os
from datetime import datetime
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/vlogs", tags=["Vlogs"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_FOLDER = "static/banners"


@router.post("/", response_model=schemas.NewVlog)
def create_vlog(
    title: str = Form(...),
    video_url: str = Form(...),
    description: str = Form(...),
    banner: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save banner image
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{banner.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(banner.file, buffer)

    # Try saving to all_vlogs
    vlog_all = models.AllVlog(
        title=title,
        video_url=video_url,
        description=description,
        banner_path=path
    )

    db.add(vlog_all)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This video has already been posted."
        )

    # Handle new_vlogs (rolling top 5)
    new_vlogs = db.query(models.NewVlog).order_by(models.NewVlog.created_at).all()
    if len(new_vlogs) >= 5:
        db.delete(new_vlogs[0])

    vlog_new = models.NewVlog(
        title=title,
        video_url=video_url,
        description=description,
        banner_path=path
    )

    db.add(vlog_new)
    db.commit()
    db.refresh(vlog_new)
    return vlog_new


@router.get("/", response_model=list[schemas.Vlog])
def get_vlogs(db: Session = Depends(get_db)):
    return db.query(models.Vlog).order_by(models.Vlog.created_at.desc()).all()
