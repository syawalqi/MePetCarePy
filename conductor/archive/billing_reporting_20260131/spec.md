# Specification: Billing, Invoicing, and Financial Reporting

## Goal
To implement an internal financial workflow that supports manual price entry (Open Billing) for clinical services and medicines, providing a historical record of costs and monthly financial summaries for administrators.

## Requirements
- **Invoicing System (Open Billing):**
    - Create `invoices` table linked to `patients` and optionally `medical_records`.
    - Create `invoice_items` for granular, manual billing.
    - **No Inventory Dependency:** Staff will manually input the service/item name and cost.
    - **Price Persistence:** Each line item must store `unit_price_at_billing` to ensure the historical record remains accurate even if standard prices change later.
    - **No Tax:** Tax handling is not required.
- **Support Staff Workflow:**
    - UI to create new invoices manually.
    - Ability to mark invoices as `PAID`, `UNPAID`, or `CANCELLED`.
- **Admin Reporting:**
    - A financial dashboard for Administrators.
    - **Monthly Summary:** Total earnings, total patients billed, and revenue breakdown per month.
    - **PDF Export:** Ability to download a PDF summary of the monthly financial report for record-keeping.
- **Security & RBAC:**
    - Financial data is strictly internal. 
    - RBAC: Vets/Admins/Support can create invoices; Support/Admins can process payments; Admins only for full financial reports.

## Technical Constraints
- Backend: FastAPI with SQLAlchemy aggregation queries for reporting.
- Database: Supabase PostgreSQL.
- Frontend: React components for manual invoice entry and Admin dashboard.