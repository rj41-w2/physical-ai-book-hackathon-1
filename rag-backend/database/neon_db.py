import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("NEON_DATABASE_URL")

# Use the driver installed by requirements.txt; SQLAlchemy 2.1 otherwise defaults
# a plain postgresql:// URL to psycopg (v3).
if DATABASE_URL:
    for scheme in ("postgresql+psycopg://", "postgres://", "postgresql://"):
        if DATABASE_URL.startswith(scheme):
            DATABASE_URL = DATABASE_URL.replace(scheme, "postgresql+psycopg2://", 1)
            break

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
