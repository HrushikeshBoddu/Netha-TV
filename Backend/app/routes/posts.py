from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas
import shutil, os, re
from datetime import datetime

router = APIRouter(prefix="/posts", tags=["Posts"])
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
# POST: Create Post
# ───────────────────────────────
@router.post("/", response_model=schemas.Post)
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    url: str = Form(None),
    banner: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    sanitized_name = secure_filename(banner.filename)
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{sanitized_name}"
    path = os.path.join(UPLOAD_FOLDER, filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(banner.file, buffer)

    post = models.Post(
        title=title,
        content=content,
        url=url,
        banner_path=path
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

# ───────────────────────────────
# GET: All Posts
# ───────────────────────────────
@router.get("/all", response_model=list[schemas.Post])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).all()

# ───────────────────────────────
# GET: Post by ID
# ───────────────────────────────
@router.get("/{post_id}", response_model=schemas.Post)
def get_post_by_id(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    return post

# ───────────────────────────────
# PUT: Update Post by ID
# ───────────────────────────────
@router.put("/{post_id}", response_model=schemas.Post)
def update_post(
    post_id: int,
    title: str = Form(...),
    content: str = Form(...),
    url: str = Form(None),
    banner: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    post.title = title
    post.content = content
    post.url = url

    if banner:
        if post.banner_path and os.path.exists(post.banner_path):
            os.remove(post.banner_path)
        sanitized_name = secure_filename(banner.filename)
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{sanitized_name}"
        path = os.path.join(UPLOAD_FOLDER, filename)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(banner.file, buffer)
        post.banner_path = path

    db.commit()
    db.refresh(post)
    return post

# ───────────────────────────────
# DELETE: Post by ID
# ───────────────────────────────
@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    if post.banner_path and os.path.exists(post.banner_path):
        os.remove(post.banner_path)

    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}