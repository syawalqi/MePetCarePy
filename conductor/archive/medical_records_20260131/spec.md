# Specification: Medical Records and SOAP Notes System

## Goal
To provide veterinarians with a structured way to record patient encounters using the industry-standard SOAP (Subjective, Objective, Assessment, Plan) method, along with vital signs tracking.

## Requirements
- **Encounter Records:** Create a `medical_records` table linked to `patients`.
- **SOAP Notes:**
    - **Subjective:** History, owner observations, and chief complaint.
    - **Objective:** Physical exam findings and vital signs.
    - **Assessment:** Differential diagnoses and final diagnosis.
    - **Plan:** Treatment plan, medications, and follow-up instructions.
- **Vital Signs:** Track Weight, Temperature, Heart Rate, and Respiration Rate per encounter.
- **RBAC Enforcement:**
    - Only `VETERINARIAN` and `ADMINISTRATOR` can create or update medical records.
    - All staff can view medical history.
- **Soft Delete:** Enable soft deletes for all medical records.
- **API:** RESTful endpoints for clinical note management.
- **UI:** A patient-centric timeline of health records and a clinical entry form.

## Technical Constraints
- Backend: FastAPI with role-based dependencies.
- Database: Supabase PostgreSQL.
- Frontend: React with dynamic form validation.
