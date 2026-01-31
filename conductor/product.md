# Initial Concept

A web-based Animal Clinic Management System.

The system is designed to help veterinary clinics manage owners, animals (patients),
medical records, appointments, and staff accounts in a structured and reliable way.

Backend:
- Python FastAPI
- REST API
- Role-based access control
- Supabase (PostgreSQL) for database and authentication
- Soft delete for medical and patient data

Frontend:
- React web application
- Consumes FastAPI REST endpoints
- Auth handled via Supabase

Core principles:
- Single source of truth for business logic
- Backend-first correctness
- No duplicated logic
- Designed for small to medium veterinary clinics
- Built for future extensibility (mobile apps, integrations)

This is a greenfield project and architecture decisions should be treated as authoritative.

# Product Definition: Animal Clinic Management System (MePetCarePy)

## Vision
To provide a structured, reliable, and extensible web-based management system for small to medium veterinary clinics, ensuring high-quality care through efficient data management.

## Core Features (MVP)
*   **Owner and Patient Management:** Comprehensive CRUD operations for managing pet owners and their animals.
*   **Medical Records:** Tracking patient health history, including vaccinations, SOAP (Subjective, Objective, Assessment, Plan) notes, and full medical history.
*   **Authentication and RBAC:** Secure staff authentication via Supabase with role-based access control (Administrator, Veterinarian, Support Staff) to ensure data privacy and workflow integrity.
*   **Appointment Management:** (Planned) Future support for scheduling and calendar integrations.

## Target Users
*   **Veterinarians:** Accessing and updating medical records and patient history.
*   **Clinic Administrators:** Managing staff accounts, owner details, and overall clinic operations.
*   **Support Staff:** Handling registration and basic patient data entry.

## Design Principles
*   **Single Source of Truth:** Business logic resides solely in the backend.
*   **Backend-First Correctness:** Prioritizing data integrity and validation at the API level.
*   **Future Extensibility:** Architecture designed to support future mobile applications and third-party integrations.
*   **Reliability:** Utilizing soft deletes for critical medical and patient data to prevent accidental loss.
