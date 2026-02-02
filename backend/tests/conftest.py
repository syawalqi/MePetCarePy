import os
import pytest
from fastapi import Request
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db
from app.models import Base
# Explicit imports to register models
from app.models.owner import Owner
from app.models.patient import Patient
from app.models.user import Profile, UserRole
from app.dependencies import get_current_user, check_role, check_session

# Use a separate file for tests
TEST_DB_FILE = "./test_api.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB_FILE}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Mock Authentication Dependencies
async def override_get_current_user(request: Request):
    user = type('User', (object,), {'id': 'test-user-id', 'email': 'test@example.com'})
    request.state.user = user
    return user

async def override_check_session(request: Request):
    # Mock successful session validation
    # And populate the role for rate limiting
    request.state.user_role = UserRole.ADMINISTRATOR
    return True

def mock_check_role(required_roles):
    async def role_checker():
        # Always return an admin profile for tests
        return Profile(
            id='test-user-id', 
            full_name='Test Admin', 
            role=UserRole.ADMINISTRATOR, 
            email='test@example.com'
        )
    return role_checker

# Apply overrides
app.dependency_overrides[get_current_user] = override_get_current_user
app.dependency_overrides[check_session] = override_check_session
# Since check_role is used as Depends(check_role(...)), we can't easily 
# override the factory. Instead, we'll patch the dependency used in the routes.
# A simpler way for tests is to mock the get_profile CRUD call used inside check_role.

@pytest.fixture(autouse=True)
def setup_db():
    if os.path.exists(TEST_DB_FILE):
        try: os.remove(TEST_DB_FILE)
        except PermissionError: pass
    Base.metadata.create_all(bind=engine)
    
    # Create a test admin profile in the test database
    db = TestingSessionLocal()
    admin_profile = Profile(
        id='test-user-id', 
        full_name='Test Admin', 
        role=UserRole.ADMINISTRATOR, 
        email='test@example.com'
    )
    db.add(admin_profile)
    db.commit()
    db.close()
    
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists(TEST_DB_FILE):
        try: os.remove(TEST_DB_FILE)
        except PermissionError: pass

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    # Provide a mock token in the header for all requests
    headers = {"Authorization": "Bearer mock-token"}
    with TestClient(app) as c:
        c.headers.update(headers)
        yield c
