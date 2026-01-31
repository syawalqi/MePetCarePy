# Implementation Plan: Billing, Invoicing, and Financial Reporting

## Phase 1: Billing Data Model
- [ ] Task: Define Invoice and InvoiceItem database models
- [ ] Task: Create Pydantic schemas for Invoices and line items
- [ ] Task: Migrate billing tables to Supabase
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Billing Data Model' (Protocol in workflow.md)

## Phase 2: Integrated Invoicing API
- [ ] Task: Update Medical Record API to allow adding billable items
- [ ] Task: Implement Invoice CRUD logic with RBAC
- [ ] Task: Implement Financial Reporting endpoint (Monthly aggregation)
    - [ ] Write Tests for Reporting Logic
    - [ ] Implement SQL Aggregations for total earnings
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Integrated Invoicing API' (Protocol in workflow.md)

## Phase 3: Frontdesk & Admin UI
- [ ] Task: Build "Pending Payments" queue for Support Staff
- [ ] Task: Build Invoice detail and payment processing UI
- [ ] Task: Build Admin "Financial Reports" dashboard
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontdesk & Admin UI' (Protocol in workflow.md)
