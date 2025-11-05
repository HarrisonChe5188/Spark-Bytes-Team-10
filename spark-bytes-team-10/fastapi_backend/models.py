from pydantic import BaseModel

class FoodCreate(BaseModel):
    name: str
    allergies: str = ""
    total_quantity: int
    event_id: int = 1  # default if you want

class FoodOut(FoodCreate):
    id: int
    quantity_left: int
