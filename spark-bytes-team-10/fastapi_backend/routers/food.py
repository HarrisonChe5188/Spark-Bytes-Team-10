from fastapi import APIRouter, HTTPException
from supabase_client import supabase
from models import FoodCreate, FoodOut

router = APIRouter(prefix="/api/food", tags=["food"])

@router.post("/", response_model=FoodOut)
async def create_food(food: FoodCreate):
    result = supabase.table("food").insert({
        "name": food.name,
        "allergies": food.allergies,
        "total_quantity": food.total_quantity,
        "quantity_left": food.total_quantity,
        "event_id": food.event_id,
    }).execute()

    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create food")
    return result.data[0]
