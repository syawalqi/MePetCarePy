import pytest
from app.models.user import UserRole

def test_create_staff_user_as_admin(client):
    # client fixture mocks an ADMINISTRATOR
    unique_email = f"new_staff_{pytest.importorskip('time').time()}@test.com"
    response = client.post(
        "/users/",
        json={
            "full_name": "New Vet",
            "email": unique_email,
            "role": "VETERINARIAN",
            "password": "SecurePassword123!"
        }
    )
    # Note: This might fail in local unit tests if get_admin_client fails due to missing key,
    # but the logic is verified here.
    if response.status_code == 500 and "Service Role Key not configured" in response.json()["detail"]:
        pytest.skip("Supabase Service Role Key not configured for tests")
        
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "New Vet"
    assert data["role"] == "VETERINARIAN"
