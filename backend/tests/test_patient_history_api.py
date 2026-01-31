import pytest

def test_get_patient_history(client):
    # 1. Setup: Create Owner and Patient
    owner_resp = client.post("/owners/", json={"full_name": "History Owner", "phone_number": "555"})
    owner_id = owner_resp.json()["id"]
    patient_resp = client.post("/patients/", json={"name": "TimelinePet", "species": "Dog", "owner_id": owner_id})
    patient_id = patient_resp.json()["id"]
    
    # 2. Setup: Create multiple records
    client.post("/medical-records/", json={"patient_id": patient_id, "subjective": "First visit"})
    client.post("/medical-records/", json={"patient_id": patient_id, "subjective": "Second visit"})
    
    # 3. Test: Fetch history
    response = client.get(f"/medical-records/patient/{patient_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    # Verify chronological order (most recent first)
    assert data[0]["subjective"] == "Second visit"
    assert data[1]["subjective"] == "First visit"
