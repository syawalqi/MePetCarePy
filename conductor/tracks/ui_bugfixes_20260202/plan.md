# Implementation Plan: UI Bugfixes & Refinement

## Phase 1: Environment Setup & Diagnostics
- [x] Task: Switch to `LOCAL-DEV` branch (create if not exists).
- [x] Task: Start Backend Server in background (logging to `logs/backend.log`).
- [x] Task: Start Frontend Server in background (logging to `logs/frontend.log`).
- [x] Task: Gather list of specific bugs from the user (`bugui.txt`).

## Phase 2: Bug Fixes (Iterative)
- [x] Task: Fix Blank Page on Medical Record Form (Route parameter mismatch).
- [x] Task: Overhaul Owner Details UI (Modern layout, Responsive).
- [x] Task: Implement Soft Delete for Owners (Backend & Frontend).
- [x] Task: Implement Session Management (Single session, 1-hour timeout).
- [x] Task: Project Organization (Move logs, clean root).

## Phase 3: Final Verification
- [x] Task: Ensure no console errors in frontend or backend logs.
- [x] Task: Merge `LOCAL-DEV` back to `master`.