"""
    Database Configuration (MySQL + SQLAlchemy)

    This module sets up the SQLAlchemy engine, session, and base for ORM operations.
    It reads environment variables to connect to a MySQL database and provides a 
    FastAPI-compatible dependency to inject the database session.

    Components:
        - Environment variable-based configuration
        - SQLAlchemy engine and session setup
        - Declarative base for ORM models
        - Dependency `get_db()` to be used in route handlers
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env file
load_dotenv()

# ✅ Environment variables with sensible defaults
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "1234567890")
DB_NAME = os.getenv("MYSQL_DB", "NethaTV")  # 🔄 use NethaTV as default
DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_PORT = os.getenv("MYSQL_PORT", "3306")

# ✅ MySQL connection URL with PyMySQL driver
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# ✅ SQLAlchemy engine and session setup
engine = create_engine(DATABASE_URL)

# ✅ Session factory
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# ✅ Declarative base
Base = declarative_base()

# ✅ Dependency to get DB session
def get_db():
    """
    Provides a database session for FastAPI routes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()