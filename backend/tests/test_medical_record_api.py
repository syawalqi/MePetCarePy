import pytest

def test_create_medical_record(client):
    # 1. Create owner and patient first
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    patient_resp = client.post("/patients/", json={"name": "Buddy", "species": "Dog", "owner_id": owner_id})
    patient_id = patient_resp.json()["id"]
    
    # 2. Create medical record
    response = client.post(
        "/medical-records/",
        json={
            "patient_id": patient_id,
            "subjective": "Limping on left leg",
            "objective": "Swelling in left paw",
            "assessment": "Possible sprain",
            "plan": "Rest and ice",
            "weight": 25.5,
            "temperature": 101.5
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["subjective"] == "Limping on left leg"
    assert data["patient_id"] == patient_id

def test_get_medical_records(client):
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    patient_resp = client.post("/patients/", json={"name": "Buddy", "species": "Dog", "owner_id": owner_id})
    patient_id = patient_resp.json()["id"]
    client.post("/medical-records/", json={"patient_id": patient_id, "subjective": "Checkup"})
    
    response = client.get("/medical-records/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_get_medical_record_by_id(client):
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    patient_resp = client.post("/patients/", json={"name": "Buddy", "species": "Dog", "owner_id": owner_id})
    patient_id = patient_resp.json()["id"]
    create_resp = client.post("/medical-records/", json={"patient_id": patient_id, "subjective": "Detail Test"})
    record_id = create_resp.json()["id"]
    
    response = client.get(f"/medical-records/{record_id}")
    assert response.status_code == 200
    assert response.json()["subjective"] == "Detail Test"

def test_update_medical_record(client):
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    patient_resp = client.post("/patients/", json={"name": "Buddy", "species": "Dog", "owner_id": owner_id})
    patient_id = patient_resp.json()["id"]
    create_resp = client.post("/medical-records/", json={"patient_id": patient_id, "subjective": "Old"})
    record_id = create_resp.json()["id"]
    
    response = client.put(f"/medical-records/{record_id}", json={"subjective": "New"})
    assert response.status_code == 200
    assert response.json()["subjective"] == "New"

def test_delete_medical_record(client):
    owner_resp = client.post("/owners/", json={"full_name": "Owner One", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    patient_resp = client.post("/patients/", json={"name": "Buddy", "species": "Dog", "owner_id": owner_id})
    patient_id = patient_resp.json()["id"]
    create_resp = client.post("/medical-records/", json={"patient_id": patient_id, "subjective": "Delete Me"})
    record_id = create_resp.json()["id"]
    
    response = client.delete(f"/medical-records/{record_id}")
    assert response.status_code == 200
    
    get_resp = client.get(f"/medical-records/{record_id}")
    assert get_resp.status_code == 404
