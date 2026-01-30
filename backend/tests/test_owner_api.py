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

# Use a separate file for tests to avoid in-memory connection sharing issues
TEST_DB_FILE = "./test_api.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB_FILE}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def setup_db():
    # Ensure a clean start
    if os.path.exists(TEST_DB_FILE):
        try:
            os.remove(TEST_DB_FILE)
        except PermissionError:
            pass
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists(TEST_DB_FILE):
        try:
            os.remove(TEST_DB_FILE)
        except PermissionError:
            pass

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_owner():
    response = client.post(
        "/owners/",
        json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "123456789",
            "address": "123 Pet St"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "John Doe"
    assert "id" in data

def test_get_owners():
    # Create an owner first
    client.post(
        "/owners/",
        json={
            "full_name": "Owner 1",
            "phone_number": "111"
        }
    )
    response = client.get("/owners/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_get_owner_by_id():
    create_response = client.post(
        "/owners/",
        json={
            "full_name": "Jane Doe",
            "phone_number": "987654321"
        }
    )
    owner_id = create_response.json()["id"]
    
    response = client.get(f"/owners/{owner_id}")
    assert response.status_code == 200
    assert response.json()["full_name"] == "Jane Doe"

def test_update_owner():
    create_response = client.post(
        "/owners/",
        json={
            "full_name": "Old Name",
            "phone_number": "000"
        }
    )
    owner_id = create_response.json()["id"]
    
    response = client.put(
        f"/owners/{owner_id}",
        json={"full_name": "New Name"}
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "New Name"

def test_delete_owner():
    create_response = client.post(
        "/owners/",
        json={
            "full_name": "Delete Me",
            "phone_number": "111"
        }
    )
    owner_id = create_response.json()["id"]
    
    response = client.delete(f"/owners/{owner_id}")
    assert response.status_code == 200
    
    # Verify soft delete
    get_response = client.get(f"/owners/{owner_id}")
    assert get_response.status_code == 404