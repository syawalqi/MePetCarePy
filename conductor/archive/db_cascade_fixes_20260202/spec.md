# Specification: Database Cascade & Integrity

## Goal
To ensure that deleting a parent record (specifically an **Owner**) automatically cleans up all associated child records (**Patients**, and transitively **Medical Records**, **Invoices**), preventing orphaned data and database errors.

## Schema Changes

### 1. Owners -> Patients
- **Current:** `owner_id` FK (Default: `NO ACTION` or `RESTRICT`).
- **New:** `owner_id` FK with `ON DELETE CASCADE`.
- **Reason:** If an owner is removed, their pets cannot exist in the system without an owner.

### 2. Patients -> Medical Records
- **Current:** `patient_id` FK.
- **New:** `patient_id` FK with `ON DELETE CASCADE`.
- **Reason:** Clinical history belongs to the patient.

### 3. Patients -> Invoices
- **Current:** `patient_id` FK.
- **New:** `patient_id` FK with `ON DELETE CASCADE`.
- **Reason:** Invoices are linked to the patient's treatment. *Warning: In a real ERP, we'd keep these, but for this MVP/System, we cascade.*

### 4. Invoices -> Invoice Items
- **Current:** `invoice_id` FK.
- **New:** `invoice_id` FK with `ON DELETE CASCADE`.
- **Reason:** Line items cannot exist without an invoice.

## SQLAlchemy Models
All `relationship()` definitions in `backend/app/models/` must be updated to include `cascade="all, delete-orphan"` where appropriate to ensure the ORM stays in sync with the DB state if deletion happens via ORM.

## Migration Strategy
We will use raw SQL migrations via Supabase to alter the existing constraints.
1. `ALTER TABLE patients DROP CONSTRAINT ...`
2. `ALTER TABLE patients ADD CONSTRAINT ... ON DELETE CASCADE`
