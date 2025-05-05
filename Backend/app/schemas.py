from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class VlogBase(BaseModel):
    title: str
    description: Optional[str] = None
    url: Optional[str] = None

class Vlog(VlogBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PostBase(BaseModel):
    title: str
    content: str
    url: Optional[str] = None

class Post(PostBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LiveBase(BaseModel):
    title: str
    schedule: datetime
    description: Optional[str] = None
    url: Optional[str] = None

class Live(LiveBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AllVlogBase(BaseModel):
    title: str
    description: Optional[str] = None
    url: Optional[str] = None

class AllVlog(AllVlogBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class NewVlogBase(BaseModel):
    title: str
    description: Optional[str] = None
    url: Optional[str] = None

class NewVlog(NewVlogBase):
    id: int
    banner_path: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Event(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    scheduled_time: datetime
    banner_path: str
    url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True