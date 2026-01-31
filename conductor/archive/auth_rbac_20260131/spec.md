# Specification: Authentication and Role-Based Access Control (RBAC) with Supabase

## Goal
Establish a secure authentication system and implement role-based access control (RBAC) to protect clinic data and differentiate user permissions.

## Requirements
- **Supabase Integration:** Transition from local SQLite to a live Supabase PostgreSQL instance.
- **Authentication:** Implement secure login/logout flows using Supabase Auth.
- **RBAC System:** Define and enforce roles:
    - `ADMINISTRATOR`: Full access to clinic settings, staff management, and records.
    - `VETERINARIAN`: Access to medical records, owner/patient management, and appointments.
    - `SUPPORT_STAFF`: Access to owner/patient registration and appointment scheduling.
- **Protected API:** Secure FastAPI endpoints using JWT verification and role checks.
- **Protected UI:** Implement route protection and conditional component rendering in React based on auth state and roles.

## Technical Constraints
- Backend: FastAPI, Supabase Python Client, JWT verification middleware.
- Frontend: React, Supabase JavaScript Client, Context API for auth state.
- Security: Use environment variables for all Supabase credentials.
