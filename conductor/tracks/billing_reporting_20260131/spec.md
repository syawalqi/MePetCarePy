# Specification: Billing, Invoicing, and Financial Reporting

## Goal
To implement an internal financial workflow that links clinical treatments to front-desk payments and provides administrators with monthly earnings reports.

## Requirements
- **Invoicing System:**
    - Create `invoices` table linked to `medical_records` and `patients`.
    - Create `invoice_items` for granular billing (e.g., "Consultation - $50", "Antibiotics - $20").
- **Clinical Integration:**
    - Update the Medical Record flow so Veterinarians can list billable items during or after a SOAP session.
- **Receptionist Workflow:**
    - A "Pending Payments" view for Support Staff to see visits that haven't been paid.
    - Ability to mark invoices as `PAID`, `UNPAID`, or `CANCELLED`.
- **Admin Reporting:**
    - A financial dashboard for Administrators.
    - **Monthly Summary:** Total earnings, total patients seen, and breakdown of revenue per month.
- **Internal-Only Security:**
    - Ensure financial data is strictly internal. 
    - RBAC: Vets/Admins can add items; Support/Admins can process payments; Admins only for full financial reports.

## Technical Constraints
- Backend: FastAPI with SQLAlchemy aggregation queries for reporting.
- Database: Supabase PostgreSQL.
- Frontend: React components for invoice management and simple chart/data summaries for Admin.
