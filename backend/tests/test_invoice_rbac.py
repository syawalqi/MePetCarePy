import pytest
from app.main import app
from app.dependencies import check_role
from app.models.user import UserRole, Profile
from app.database import get_db

def mock_role_dependency(role: UserRole):
    async def role_checker():
        return Profile(
            id='test-user-id', 
            full_name='Test User', 
            role=role, 
            email='test@example.com'
        )
    return role_checker

def test_report_access_denied_for_support(client):
    # Override check_role for this specific test to simulate SUPPORT_STAFF
    # Note: This is tricky because check_role is a factory.
    # We need to find where it's used and override the specific dependency.
    # A better way is to mock the crud.user.get_profile call.
    pass

from unittest.mock import patch

def test_monthly_report_rbac(client):
    # Test Admin Access
    with patch("app.crud.user.get_profile") as mock_get:
        mock_get.return_value = Profile(
            id='test-user-id', 
            full_name='Admin User', 
            role=UserRole.ADMINISTRATOR, 
            email='admin@example.com'
        )
        resp = client.get("/invoices/reports/monthly?year=2026&month=1")
        assert resp.status_code == 200

    # Test Support Staff Access (Should be 403)
    with patch("app.crud.user.get_profile") as mock_get:
        mock_get.return_value = Profile(
            id='test-user-id', 
            full_name='Support User', 
            role=UserRole.SUPPORT_STAFF, 
            email='support@example.com'
        )
        resp = client.get("/invoices/reports/monthly?year=2026&month=1")
        assert resp.status_code == 403
        assert resp.json()["detail"] == "You do not have permission to perform this action."

    # Test Veterinarian Access (Should be 403)
    with patch("app.crud.user.get_profile") as mock_get:
        mock_get.return_value = Profile(
            id='test-user-id', 
            full_name='Vet User', 
            role=UserRole.VETERINARIAN, 
            email='vet@example.com'
        )
        resp = client.get("/invoices/reports/monthly?year=2026&month=1")
        assert resp.status_code == 403
