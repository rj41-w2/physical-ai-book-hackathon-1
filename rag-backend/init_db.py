from database.neon_db import engine, Base
from models.schema import User, UserPreference, ChatHistory

def init_database():
    print("Initializing the Neon Postgres database...")
    try:
        # Create all tables defined in the models
        # Note: In production, use migrations (like Alembic) instead of create_all
        Base.metadata.create_all(bind=engine)
        print("Successfully ensured tables exist: users, user_preferences, chat_history")
    except Exception as e:
        print(f"Error initializing database: {e}")

if __name__ == "__main__":
    init_database()
