from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas
import os, shutil, re
from datetime import datetime

router = APIRouter(prefix="/vlogs", tags=["Vlogs"])
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
# POST: Create vlog (AllVlog + NewVlog if unique)
# ───────────────────────────────
@router.post("/", response_model=schemas.AllVlog)
def create_vlog(
    title: str = Form(...),
    description: str = Form(None),
    url: str = Form(None),
    banner: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Avoid duplicate video_url in AllVlog
    if db.query(models.AllVlog).filter(models.AllVlog.url == url).first():
        raise HTTPException(status_code=400, detail="This video already exists.")

    sanitized_name = secure_filename(banner.filename)
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{sanitized_name}"
    path = os.path.join(UPLOAD_FOLDER, filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(banner.file, buffer)

    # Save to AllVlog
    vlog_all = models.AllVlog(
        title=title,
        description=description,
        url=url,
        banner_path=path
    )
    db.add(vlog_all)
    db.commit()
    db.refresh(vlog_all)

    # Insert into NewVlog only if not already present
    if not db.query(models.NewVlog).filter(models.NewVlog.url == url).first():
        new_vlogs = db.query(models.NewVlog).order_by(models.NewVlog.created_at).all()
        if len(new_vlogs) >= 6:
            db.delete(new_vlogs[0])
            db.commit()

        vlog_new = models.NewVlog(
            title=title,
            description=description,
            url=url,
            banner_path=path,
            created_at=vlog_all.created_at
        )
        db.add(vlog_new)
        db.commit()

    return vlog_all

# ───────────────────────────────
# GET: All vlogs (AllVlog)
# ───────────────────────────────
@router.get("/all", response_model=list[schemas.AllVlog])
def get_all_vlogs(db: Session = Depends(get_db)):
    return db.query(models.AllVlog).order_by(models.AllVlog.created_at.desc()).all()

# ───────────────────────────────
# GET: Newest 6 vlogs (AllVlog limited)
# ───────────────────────────────
@router.get("/new", response_model=list[schemas.AllVlog])
def get_new_vlogs(db: Session = Depends(get_db)):
    return db.query(models.AllVlog).order_by(models.AllVlog.created_at.desc()).limit(6).all()

# ───────────────────────────────
# GET: Vlog by ID (AllVlog)
# ───────────────────────────────
@router.get("/{vlog_id}", response_model=schemas.AllVlog)
def get_vlog_by_id(vlog_id: int, db: Session = Depends(get_db)):
    vlog = db.query(models.AllVlog).filter(models.AllVlog.id == vlog_id).first()
    if not vlog:
        raise HTTPException(status_code=404, detail="Vlog not found.")
    return vlog

# ───────────────────────────────
# PUT: Update vlog by ID (AllVlog)
# ───────────────────────────────
@router.put("/{vlog_id}", response_model=schemas.AllVlog)
def update_vlog(
    vlog_id: int,
    title: str = Form(...),
    description: str = Form(None),
    url: str = Form(None),
    banner: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    vlog = db.query(models.AllVlog).filter(models.AllVlog.id == vlog_id).first()
    if not vlog:
        raise HTTPException(status_code=404, detail="Vlog not found.")

    vlog.title = title
    vlog.description = description
    vlog.url = url

    if banner:
        if vlog.banner_path and os.path.exists(vlog.banner_path):
            os.remove(vlog.banner_path)
        sanitized_name = secure_filename(banner.filename)
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{sanitized_name}"
        path = os.path.join(UPLOAD_FOLDER, filename)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(banner.file, buffer)
        vlog.banner_path = path

    db.commit()
    db.refresh(vlog)
    return vlog

# ───────────────────────────────
# DELETE: Vlog by ID (AllVlog)
# ───────────────────────────────
@router.delete("/{vlog_id}")
def delete_vlog(vlog_id: int, db: Session = Depends(get_db)):
    vlog = db.query(models.AllVlog).filter(models.AllVlog.id == vlog_id).first()
    if not vlog:
        raise HTTPException(status_code=404, detail="Vlog not found.")

    if vlog.banner_path and os.path.exists(vlog.banner_path):
        os.remove(vlog.banner_path)

    db.delete(vlog)
    db.commit()
    return {"message": "Vlog deleted successfully"}