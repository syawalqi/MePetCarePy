# Implementation Plan: Security Hardening (Phase 2)

## Phase 1: Database RLS Implementation
- [x] Task: Create a new SQL migration file `supabase/migrations/20260202000000_invoice_rls.sql`.
- [x] Task: Define `ENABLE ROW LEVEL SECURITY` for `invoices` and `invoice_items`.
- [x] Task: Apply `SELECT`, `INSERT`, and `UPDATE` policies for the `authenticated` role.
- [x] Task: Manually apply the migration to Supabase and confirm RLS is active.

## Phase 2: Enhanced Audit Logging
- [x] Task: Review `app/crud/invoice.py` for opportunities to add `log_action` calls.
- [x] Task: Update `update_invoice_status` to log transitions.
- [x] Task: Update `create_invoice` to log itemized totals.
- [x] Task: Ensure PII is not leaked in financial logs.

## Phase 3: Verification & Testing
- [x] Task: Run existing test suite to ensure no regressions in billing logic.
- [x] Task: Add new tests for role-based access to reports.
- [x] Task: Manually verify RLS restrictions by attempting unauthorized DB operations.
