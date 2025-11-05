from pydantic import BaseModel

class FoodCreate(BaseModel):
    name: str
    allergies: str = ""
    total_quantity: int

class FoodOut(FoodCreate):
    id: int
    quantity_left: int
