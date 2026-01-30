import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db
from app.models import Base
from app.models.owner import Owner
from app.models.patient import Patient

# Use a separate file for tests
TEST_DB_FILE = "./test_patient_api.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB_FILE}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def setup_db():
    if os.path.exists(TEST_DB_FILE):
        try: os.remove(TEST_DB_FILE)
        except PermissionError: pass
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists(TEST_DB_FILE):
        try: os.remove(TEST_DB_FILE)
        except PermissionError: pass

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_patient():
    # Create owner first
    owner_resp = client.post("/owners/", json={"full_name": "Owner 1", "phone_number": "123"})
    owner_id = owner_resp.json()["id"]
    
    response = client.post(
        "/patients/",
        json={
            "name": "Buddy",
            "species": "Dog",
            "breed": "Golden Retriever",
            "owner_id": owner_id
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Buddy"
    assert data["owner_id"] == owner_id

def test_get_patients():
    owner_resp = client.post("/owners/", json={"full_name": "Owner 1", "phone_number": "123"})
    owner_id = owner_resp.json()["id"]
    client.post("/patients/", json={"name": "P1", "species": "Cat", "owner_id": owner_id})
    
    response = client.get("/patients/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_get_patient_by_id():
    owner_resp = client.post("/owners/", json={"full_name": "Owner 1", "phone_number": "123"})
    owner_id = owner_resp.json()["id"]
    create_resp = client.post("/patients/", json={"name": "P2", "species": "Cat", "owner_id": owner_id})
    patient_id = create_resp.json()["id"]
    
    response = client.get(f"/patients/{patient_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "P2"

def test_update_patient():
    owner_resp = client.post("/owners/", json={"full_name": "Owner 1", "phone_number": "123"})
    owner_id = owner_resp.json()["id"]
    create_resp = client.post("/patients/", json={"name": "Old", "species": "Cat", "owner_id": owner_id})
    patient_id = create_resp.json()["id"]
    
    response = client.put(f"/patients/{patient_id}", json={"name": "New"})
    assert response.status_code == 200
    assert response.json()["name"] == "New"

def test_delete_patient():
    owner_resp = client.post("/owners/", json={"full_name": "Owner 1", "phone_number": "123"})
    owner_id = owner_resp.json()["id"]
    create_resp = client.post("/patients/", json={"name": "Delete", "species": "Cat", "owner_id": owner_id})
    patient_id = create_resp.json()["id"]
    
    response = client.delete(f"/patients/{patient_id}")
    assert response.status_code == 200
    
    get_resp = client.get(f"/patients/{patient_id}")
    assert get_resp.status_code == 404
