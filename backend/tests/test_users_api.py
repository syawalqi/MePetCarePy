import pytest

def test_read_users_as_admin(client):
    # client fixture in conftest.py already mocks an ADMINISTRATOR
    response = client.get("/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    # At least the admin themselves should be in the list
    assert len(response.json()) >= 1
