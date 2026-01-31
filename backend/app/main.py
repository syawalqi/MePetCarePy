from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import owners, patients, users
from app.database import engine
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MePetCarePy API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(owners.router)
app.include_router(patients.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MePetCarePy API"}