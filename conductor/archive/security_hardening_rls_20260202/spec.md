# Specification: Security Hardening (Phase 2): Invoice RLS & Enhanced Auditing

## Problem Statement
While core tables (owners, patients, medical records) have RLS enabled, the billing system (`invoices` and `invoice_items`) currently lacks database-level protection. Additionally, financial transactions require more robust auditing to track status changes and sensitive data modifications.

## Goals
- Protect financial data at the database layer using Supabase RLS.
- Ensure that only authorized staff can access and modify invoices.
- Provide a clear audit trail for all financial operations.
- Restrict sensitive report generation (monthly summaries) to Administrators.

## Requirements

### 1. Database Security (Supabase RLS)
- **Table: `invoices`**
    - `SELECT`: All authenticated staff.
    - `INSERT`: All authenticated staff.
    - `UPDATE`: All authenticated staff.
    - `DELETE`: Prohibited (Service Role only).
- **Table: `invoice_items`**
    - `SELECT`: All authenticated staff.
    - `INSERT`: All authenticated staff.
    - `UPDATE`: All authenticated staff.
    - `DELETE`: Prohibited (Service Role only).
- **Audit Policy:** Ensure that the backend service role continues to bypass these policies for administrative tasks and automated processes.

### 2. Enhanced Auditing
- Update `app/api/invoices.py` and `app/crud/invoice.py` to log:
    - Creation of new invoices.
    - Status updates (e.g., UNPAID -> PAID).
    - Modification of invoice items.
- Ensure audit logs capture the `user_id` and `role` of the initiator.

### 3. Access Control (RBAC)
- Verify that only `ADMINISTRATOR` users can access the monthly report endpoints (`/reports/monthly` and `/reports/monthly/pdf`).

## Success Criteria
- [ ] SQL migration file created and applied to enable RLS on `invoices` and `invoice_items`.
- [ ] Manual verification that an authenticated user can read/write invoices through the API.
- [ ] Manual verification that unauthorized access to the database (bypassing API) is restricted by RLS.
- [ ] Audit logs correctly record financial transactions with proper metadata.
- [ ] Monthly reports are inaccessible to `VETERINARIAN` and `SUPPORT_STAFF` roles.
