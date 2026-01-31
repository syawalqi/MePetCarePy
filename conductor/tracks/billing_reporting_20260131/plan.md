# Implementation Plan: Billing, Invoicing, and Financial Reporting

## Phase 1: Billing Data Model
- [ ] Task: Define Invoice and InvoiceItem database models (including `unit_price_at_billing`)
- [ ] Task: Create Pydantic schemas for Invoices and line items
- [ ] Task: Migrate billing tables to Supabase
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Billing Data Model' (Protocol in workflow.md)

## Phase 2: Open Invoicing API
- [ ] Task: Implement Invoice and InvoiceItem CRUD logic with RBAC
- [ ] Task: Implement Financial Reporting endpoint (Monthly aggregation)
    - [ ] Write Tests for Reporting Logic
    - [ ] Implement SQL Aggregations for monthly earnings
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Open Invoicing API' (Protocol in workflow.md)

## Phase 3: Billing UI
- [ ] Task: Build Manual Invoice Creation form (Manual Item/Price entry)
- [ ] Task: Build Invoice detail and status management (Paid/Unpaid)
- [ ] Task: Build Admin "Financial Reports" dashboard
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Billing UI' (Protocol in workflow.md)