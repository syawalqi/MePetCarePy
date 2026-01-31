# Implementation Plan: Security Hardening & Production Readiness

## Phase 1: API Defensive Measures
- [ ] Task: Install and configure `slowapi` for role-aware rate limiting
- [ ] Task: Implement secure HTTP headers using middleware
- [ ] Task: Restrict CORS origins based on environment
- [ ] Task: Conductor - User Manual Verification 'Phase 1: API Defensive Measures' (Protocol in workflow.md)

## Phase 2: Database Security & RLS Versioning
- [ ] Task: Initialize `supabase/migrations` for RLS version control
- [ ] Task: Enable RLS on all public tables (owners, patients, medical_records, profiles)
- [ ] Task: Define and apply granular SQL Policies (SELECT, INSERT, UPDATE, DELETE)
- [ ] Task: Verify backend "Admin" override bypasses all RLS restrictions
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Database Security (Supabase RLS)' (Protocol in workflow.md)

## Phase 3: Auditing, PII Filtering & Sanitization
- [ ] Task: Implement structured backend logging for data modifications
- [ ] Task: Implement log filter to redact PII (Phone, Address, etc.) from logs
- [ ] Task: Update Pydantic schemas with extra validation (regex for phone/email)
- [ ] Task: Final audit of .env and .gitignore files
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Auditing & Sanitization' (Protocol in workflow.md)