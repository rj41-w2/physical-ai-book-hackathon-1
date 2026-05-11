from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.neon_db import get_db
from models.schema import User, UserPreference
from services.auth_service import get_current_user

router = APIRouter(prefix="/api/user", tags=["user"])

class PreferencesUpdate(BaseModel):
    software_background: str
    hardware_background: str

@router.post("/preferences")
def update_preferences(prefs: PreferencesUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_prefs = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    
    background_combined = f"software:{prefs.software_background}, hardware:{prefs.hardware_background}"
    
    if db_prefs:
        db_prefs.background = background_combined
    else:
        db_prefs = UserPreference(user_id=current_user.id, background=background_combined)
        db.add(db_prefs)
    
    db.commit()
    return {"message": "Preferences updated successfully"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    software = "Beginner"
    hardware = "None"
    
    if current_user.preferences:
        # Simple parsing logic
        bg = current_user.preferences.background
        if bg:
            try:
                parts = bg.split(", ")
                software = parts[0].split(":")[1]
                hardware = parts[1].split(":")[1]
            except:
                pass

    return {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "software_background": software,
        "hardware_background": hardware
    }
