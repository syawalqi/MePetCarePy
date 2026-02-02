# Implementation Plan: PWA and Mobile UI Optimization (Refinement)

## Phase 1: PWA Configuration & Auto-Update [checkpoint: 1544174]
- [x] Task: Update `vite.config.js` to ensure the Web App Manifest is correctly generated with `display: standalone` and correct theme colors. df0378d
- [x] Task: Update `vite.config.js` to configure `vite-plugin-pwa` for prompt-based updates (`registerType: 'prompt'`) instead of `autoUpdate`. e32d5b0
- [x] Task: Implement a "New Version Available" toast or banner in the UI that triggers the update refresh when clicked. 3d828a2
- [x] Task: Configure the Service Worker (`vite-plugin-pwa` strategies) to cache specific API `GET` requests (e.g., `/owners`, `/patients`) for offline read-only access. 685f8fc
- [x] Task: Conductor - User Manual Verification 'Phase 1: PWA Configuration & Auto-Update' (Protocol in workflow.md) 1544174

## Phase 2: Offline UX & Read-Only Mode [checkpoint: 0a6aed1]
- [x] Task: Create an `OfflineBanner` component that appears when `!navigator.onLine`. 1bf421b
- [x] Task: Update `api/client.js` interceptors or UI components to disable "Save/Delete" buttons when offline. 1bf421b
- [x] Task: Verify that cached data loads correctly when network is disconnected (Simulate offline in DevTools). 0a6aed1
- [x] Task: Conductor - User Manual Verification 'Phase 2: Offline UX & Read-Only Mode' (Protocol in workflow.md) 0a6aed1

## Phase 3: Mobile Navigation & Layout Refinement [checkpoint: 0ded3e8]
- [x] Task: Refine the `BottomNav` component to ensure it hides/shows correctly on scroll or context, and doesn't overlap the main content (verify the spacer logic). 0a6aed1
- [x] Task: Verify and refine the `Offcanvas` (Sidebar) transition animation for a smoother feel. 0a6aed1
- [x] Task: Refactor the Staff Management UI (`StaffList`, `StaffForm`) to match the premium "Card" aesthetic of the Patient Timeline. 1bf421b
- [x] Task: Audit all forms (`OwnerForm`, `PatientForm`) on mobile view to ensure input types (`tel`, `date`) are correct and tap targets are accessible. df0378d
- [x] Task: Conductor - User Manual Verification 'Phase 3: Mobile Navigation & Layout Refinement' (Protocol in workflow.md) 0ded3e8