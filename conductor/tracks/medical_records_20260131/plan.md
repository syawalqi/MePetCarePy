# Implementation Plan: Medical Records and SOAP Notes System

## Phase 1: Backend Data Model & Schema
- [ ] Task: Define MedicalRecord database model with SOAP and Vital Sign fields
- [ ] Task: Create Pydantic schemas for medical record validation
- [ ] Task: Migrate medical_records table to Supabase
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Backend Data Model & Schema' (Protocol in workflow.md)

## Phase 2: Medical Records API
- [ ] Task: Implement Medical Record CRUD logic
    - [ ] Write Tests for Medical Records CRUD
    - [ ] Implement CRUD Logic with RBAC protection
- [ ] Task: Implement Patient History endpoint (Timeline)
    - [ ] Write Tests for Patient History
    - [ ] Implement History Logic
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Medical Records API' (Protocol in workflow.md)

## Phase 3: Clinical UI & SOAP Forms
- [ ] Task: Build Patient Health Timeline component
- [ ] Task: Build SOAP Entry Form for veterinarians
- [ ] Task: Implement role-based visibility for clinical actions
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Clinical UI & SOAP Forms' (Protocol in workflow.md)
