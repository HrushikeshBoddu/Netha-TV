# clear_all_data.py

from app.database import SessionLocal
from app.models import Post, LiveSession, Event  # Make sure these names match your actual models

def clear_tables():
    db = SessionLocal()
    try:
        # Delete all rows from each table
        db.query(Post).delete()
        db.query(LiveSession).delete()
        db.query(Event).delete()
        db.commit()
        print("✅ Cleared all data from Posts, LiveSessions, and Events tables.")
    except Exception as e:
        db.rollback()
        print("❌ Error while clearing data:", e)
    finally:
        db.close()

if __name__ == "__main__":
    clear_tables()
