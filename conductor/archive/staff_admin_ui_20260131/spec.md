# Specification: Staff Admin UI

## Goal
To provide clinic Administrators with a user interface to manage staff accounts, enabling them to create, view, and assign roles to veterinarians and support staff without using command-line scripts.

## Requirements
- **Staff Listing:** A table displaying all registered staff members, their roles, and emails.
- **Account Creation:** A form for Administrators to create new staff accounts (Full Name, Email, Role, Initial Password).
- **Service-Side Creation:** The backend must handle the creation of the Supabase Auth user and the corresponding public profile entry atomically using the Supabase Service Role Key.
- **RBAC Enforcement:**
    - Only `ADMINISTRATOR` can access the Staff Management UI and API endpoints.
- **API Endpoints:**
    - `GET /users/`: List all profiles.
    - `POST /users/`: Create a new auth user and profile.
- **UI:** A dedicated "Staff Management" page in the React application.

## Technical Constraints
- Backend: FastAPI using the Supabase Python Client with `service_role` permissions for administrative tasks.
- Frontend: React with role-based route protection (already implemented, needs application).
- Security: Sensitive operations restricted strictly to the `ADMINISTRATOR` role.
