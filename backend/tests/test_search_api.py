import pytest

def test_search_owners(client):
    client.post("/owners/", json={"full_name": "Unique Search Name", "phone_number": "5556667778"})
    
    response = client.get("/owners/search/?query=Unique")
    assert response.status_code == 200
    data = response.json()
    assert any(o["full_name"] == "Unique Search Name" for o in data)

def test_search_patients(client):
    owner_resp = client.post("/owners/", json={"full_name": "Owner Search", "phone_number": "9998887776"})
    owner_id = owner_resp.json()["id"]
    client.post("/patients/", json={"name": "RarePetName", "species": "Dog", "owner_id": owner_id})
    
    # Search by pet name
    response = client.get("/patients/search/?query=RarePet")
    assert response.status_code == 200
    assert any(p["name"] == "RarePetName" for p in response.json())
    
    # Search by owner phone
    response = client.get("/patients/search/?query=999")
    assert response.status_code == 200
    assert any(p["name"] == "RarePetName" for p in response.json())
