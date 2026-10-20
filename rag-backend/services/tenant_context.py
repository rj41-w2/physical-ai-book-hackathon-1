from sqlalchemy import text
from sqlalchemy.orm import Session


def set_current_user_context(db: Session, user_id: int) -> None:
    """Set the transaction-local tenant id used by PostgreSQL RLS policies."""
    if db.get_bind().dialect.name == "postgresql":
        db.execute(
            text("SELECT set_config('app.current_user_id', :user_id, true)"),
            {"user_id": str(user_id)},
        )
