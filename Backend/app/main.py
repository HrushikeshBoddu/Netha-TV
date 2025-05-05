from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.routes import vlogs, posts, lives, history  , events
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime
from app import models
from app import database

# Ensure static/banners folder exists
os.makedirs("static/banners", exist_ok=True)

# Initialize database
Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ CORS fix
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ["http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routes
app.include_router(vlogs.router)
app.include_router(posts.router)
app.include_router(lives.router)
app.include_router(history.router)
app.include_router(events.router)

@app.get("/")
def home():
    return {"message": "Well Come to Netha-Tv"}