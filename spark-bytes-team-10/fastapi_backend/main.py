from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import food

app = FastAPI()

# Configure CORS with all necessary settings
origins = [
    "http://localhost:3000",    # Next.js frontend
    "http://127.0.0.1:3000",
    "http://localhost",
    "http://127.0.0.1"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)
# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include food router
app.include_router(food.router)

@app.get("/")
def root():
    return {"message": "FastAPI backend running"}
