from fastapi import FastAPI
from app.api import owners
from app.database import engine
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MePetCarePy API", version="0.1.0")

app.include_router(owners.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MePetCarePy API"}