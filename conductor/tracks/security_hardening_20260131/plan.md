# Implementation Plan: Security Hardening & Production Readiness

## Phase 1: API Defensive Measures
- [ ] Task: Install and configure `slowapi` for rate limiting
- [ ] Task: Implement secure HTTP headers using middleware
- [ ] Task: Restrict CORS origins based on environment
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API Defensive Measures' (Protocol in workflow.md)

## Phase 2: Database Security (Supabase RLS)
- [ ] Task: Enable RLS on all public tables (owners, patients, medical_records, profiles)
- [ ] Task: Define and apply SQL Policies for staff access
- [ ] Task: Verify backend database connection continues to work with RLS enabled
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Database Security (Supabase RLS)' (Protocol in workflow.md)

## Phase 3: Auditing & Sanitization
- [ ] Task: Implement backend logging for data modification actions
- [ ] Task: Final audit of .env and .gitignore files
- [ ] Task: Update Pydantic schemas with extra validation (regex for phone/email)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Auditing & Sanitization' (Protocol in workflow.md)
