import pytest

def test_create_owner(client):
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

def test_get_owners(client):
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

def test_get_owner_by_id(client):
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

def test_update_owner(client):
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

def test_delete_owner(client):
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
