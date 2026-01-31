# Implementation Plan: Billing, Invoicing, and Financial Reporting

## Phase 1: Billing Data Model [checkpoint: 0dcdc47]
- [x] Task: Define Invoice and InvoiceItem database models (including `unit_price_at_billing`) 498e1f2
- [x] Task: Create Pydantic schemas for Invoices and line items 3673552
- [x] Task: Migrate billing tables to Supabase 6f117cd
- [x] Task: Conductor - User Manual Verification 'Phase 1: Billing Data Model' (Protocol in workflow.md)

## Phase 2: Open Invoicing API [checkpoint: a084e4e]
- [x] Task: Implement Invoice and InvoiceItem CRUD logic with RBAC 62a40bd
- [x] Task: Implement Financial Reporting endpoint (Monthly aggregation) a084e4e
- [x] Task: Implement Financial Report PDF Export (Backend) f6e8a1d
- [x] Task: Conductor - User Manual Verification 'Phase 2: Open Invoicing API' (Protocol in workflow.md)

## Phase 3: Billing UI [checkpoint: f6e8a1d]
- [x] Task: Build Manual Invoice Creation form (Manual Item/Price entry) 8e9a1d2
- [x] Task: Build Invoice detail and status management (Paid/Unpaid) 8e9a1d2
- [x] Task: Build Admin "Financial Reports" dashboard 8e9a1d2
- [x] Task: Add "Download PDF" functionality to Admin dashboard f6e8a1d
- [x] Task: Conductor - User Manual Verification 'Phase 3: Billing UI' (Protocol in workflow.md)