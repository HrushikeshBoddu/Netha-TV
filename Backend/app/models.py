import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base

class Vlog(Base):
    __tablename__ = "vlogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    banner_path = Column(String(255))
    description = Column(Text, nullable=True)
    url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    content = Column(Text)
    banner_path = Column(String(255))
    url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class LiveSession(Base):
    __tablename__ = "lives"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    schedule = Column(DateTime)
    banner_path = Column(String(255))
    description = Column(Text, nullable=True)
    url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AllVlog(Base):
    __tablename__ = "all_vlogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    banner_path = Column(String(255))
    description = Column(Text, nullable=True)
    url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class NewVlog(Base):
    __tablename__ = "new_vlogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    banner_path = Column(String(255))
    description = Column(Text, nullable=True)
    url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    scheduled_time = Column(DateTime, nullable=False)
    banner_path = Column(String(255), nullable=True)
    url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
