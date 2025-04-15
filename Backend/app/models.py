import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base

class Vlog(Base):
    __tablename__ = "vlogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    video_url = Column(String, unique=True)
    banner_path = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Correct datetime usage

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    banner_path = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Correct datetime usage

class LiveSession(Base):
    __tablename__ = "lives"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    schedule = Column(DateTime)
    banner_path = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Correct datetime usage

class AllVlog(Base):
    __tablename__ = "all_vlogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    video_url = Column(String, unique=True)
    banner_path = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Correct datetime usage

class NewVlog(Base):
    __tablename__ = "new_vlogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    video_url = Column(String, unique=True)
    banner_path = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Correct datetime usage

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    scheduled_time = Column(DateTime, nullable=False)  # Provided by user (ISO format with Z)
    banner_path = Column(String, nullable=True)        # Path to the saved image
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Auto-g
