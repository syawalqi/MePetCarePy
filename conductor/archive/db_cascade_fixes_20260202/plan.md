# Implementation Plan: Database Cascade & Fixes

## Phase 1: Owner Cascade Deletion [checkpoint: complete]
- [x] Task: Create a new SQL migration `supabase/migrations/20260203000000_cascade_owner.sql` to update foreign keys.
- [x] Task: Verify downstream dependencies (medical_records, invoices).
- [x] Task: Update SQLAlchemy models (`backend/app/models/`) to reflect these relationships (`cascade="all, delete-orphan"`).

## Phase 2: Database Integrity Audit [checkpoint: complete]
- [x] Task: Check `invoices` -> `invoice_items` constraints (added to migration).
- [x] Task: Check `users` -> `profiles` (sessions cascade added to migration).
- [x] Task: Fix any missing FK indexes for performance. (Existing models already use `index=True` on primary keys and FKs).

## Phase 3: Verification [checkpoint: complete]
- [x] Task: Add a test case `backend/tests/test_db_cascade.py` that creates an Owner with Patients, Records, and Invoices, then deletes the Owner and asserts all related data is gone.
- [x] Task: Run migrations and tests. (Tests passed successfully).