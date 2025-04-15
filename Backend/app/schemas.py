from pydantic import BaseModel, ConfigDict
from datetime import datetime

# ────────────────────────
# Vlog (Legacy or History)
# ────────────────────────
class VlogBase(BaseModel):
    title: str
    video_url: str
    description: str

class Vlog(VlogBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ────────────────────────
# Post
# ────────────────────────
class PostBase(BaseModel):
    title: str
    content: str

class Post(PostBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ────────────────────────
# Live Session
# ────────────────────────
class LiveBase(BaseModel):
    title: str
    schedule: datetime
    description: str

class Live(LiveBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ────────────────────────
# AllVlog (Full History)
# ────────────────────────
class AllVlogBase(BaseModel):
    title: str
    video_url: str
    description: str

class AllVlog(AllVlogBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ────────────────────────
# NewVlog (Top 5 Display)
# ────────────────────────
class NewVlogBase(BaseModel):
    title: str
    video_url: str
    description: str

class NewVlog(NewVlogBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)



class Event(BaseModel):
    id: int
    title: str
    description: str
    scheduled_time: datetime
    banner_path: str
    created_at: datetime

    class Config:
        orm_mode = True