from sqlalchemy import text
from database.neon_db import engine, Base
from models.schema import User, UserPreference, ChatHistory, BookChunk

def init_database():
    print("Initializing the Neon Postgres database...")
    with engine.begin() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    # Note: In production, use migrations (like Alembic) instead of create_all
    Base.metadata.create_all(bind=engine)
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY"))
        connection.execute(text("ALTER TABLE chat_history FORCE ROW LEVEL SECURITY"))
        connection.execute(text("""
            DO $$ BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'public'
                      AND tablename = 'chat_history'
                      AND policyname = 'chat_history_tenant_isolation'
                ) THEN
                    CREATE POLICY chat_history_tenant_isolation ON chat_history
                    USING (user_id = NULLIF(current_setting('app.current_user_id', true), '')::integer)
                    WITH CHECK (user_id = NULLIF(current_setting('app.current_user_id', true), '')::integer);
                END IF;
            END $$
        """))
    print("Successfully ensured vector and user/chat tables exist")

if __name__ == "__main__":
    init_database()
