# Specification: Core Owner and Patient Management

## Goal
Implement a robust foundation for managing clinic clients (owners) and their pets (patients), ensuring data integrity and professional standards.

## Requirements
- **Owner Management:** CRUD operations for owners (Name, Phone, Email, Address).
- **Patient Management:** CRUD operations for pets linked to owners (Name, Species, Breed, Date of Birth).
- **Search:** Capability to find patients by name or owner contact info.
- **Data Integrity:** Implement soft deletes for both owners and patients to prevent accidental data loss.
- **API First:** All logic must be handled via FastAPI REST endpoints.
- **Authentication:** Integrated with Supabase Auth.

## Technical Constraints
- Backend: FastAPI, Pydantic, SQLAlchemy/Supabase.
- Frontend: React with standard API consumption.
- Soft Delete: Use a `deleted_at` timestamp or `is_deleted` boolean.
