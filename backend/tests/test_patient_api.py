import pytest

def test_create_patient(client):
    # Create owner first
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
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

def test_get_patients(client):
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    client.post("/patients/", json={"name": "P1", "species": "Cat", "owner_id": owner_id})
    
    response = client.get("/patients/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_get_patient_by_id(client):
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    create_resp = client.post("/patients/", json={"name": "P2", "species": "Cat", "owner_id": owner_id})
    patient_id = create_resp.json()["id"]
    
    response = client.get(f"/patients/{patient_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "P2"

def test_update_patient(client):
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    create_resp = client.post("/patients/", json={"name": "Old", "species": "Cat", "owner_id": owner_id})
    patient_id = create_resp.json()["id"]
    
    response = client.put(f"/patients/{patient_id}", json={"name": "New"})
    assert response.status_code == 200
    assert response.json()["name"] == "New"

def test_delete_patient(client):
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    create_resp = client.post("/patients/", json={"name": "Delete", "species": "Cat", "owner_id": owner_id})
    patient_id = create_resp.json()["id"]
    
    response = client.delete(f"/patients/{patient_id}")
    assert response.status_code == 200
    
    get_resp = client.get(f"/patients/{patient_id}")
    assert get_resp.status_code == 404