from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas
import shutil
import os
from datetime import datetime

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
    # 🔐 Check for duplicate video URL
    existing = db.query(models.NewVlog).filter(models.NewVlog.video_url == video_url).first()

    if existing:
        raise HTTPException(status_code=400, detail="This video has already been posted.")

    # 💾 Save banner image
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{banner.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(banner.file, buffer)

    # 🧾 Save to all_vlogs (full history)
    vlog_all = models.AllVlog(
        title=title,
        video_url=video_url,
        description=description,
        banner_path=path
    )
    db.add(vlog_all)

    # 🔄 Maintain only 5 entries in new_vlogs
    new_vlogs = db.query(models.NewVlog).order_by(models.NewVlog.created_at).all()
    if len(new_vlogs) >= 5:
        db.delete(new_vlogs[0])

    # ➕ Add to new_vlogs
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


@router.get("/new", response_model=list[schemas.NewVlog])
def get_new_vlogs(db: Session = Depends(get_db)):
    return db.query(models.NewVlog).order_by(models.NewVlog.created_at.desc()).all()


@router.get("/all", response_model=list[schemas.AllVlog])
def get_all_vlogs(db: Session = Depends(get_db)):
    return db.query(models.AllVlog).order_by(models.AllVlog.created_at.desc()).all()


@router.delete("/new/{vlog_id}")
def delete_from_new(vlog_id: int, db: Session = Depends(get_db)):
    vlog = db.query(models.NewVlog).filter(models.NewVlog.id == vlog_id).first()
    if not vlog:
        raise HTTPException(status_code=404, detail="Vlog not found in new list.")
    db.delete(vlog)
    db.commit()
    return {"message": "Vlog removed from new list"}
