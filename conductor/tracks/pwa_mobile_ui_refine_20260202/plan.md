# Implementation Plan: PWA and Mobile UI Optimization (Refinement)

## Phase 1: PWA Configuration & Auto-Update
- [x] Task: Update `vite.config.js` to ensure the Web App Manifest is correctly generated with `display: standalone` and correct theme colors. 5cc204c
- [x] Task: Update `vite.config.js` to configure `vite-plugin-pwa` for prompt-based updates (`registerType: 'prompt'`) instead of `autoUpdate`. 7c43c5b
- [x] Task: Implement a "New Version Available" toast or banner in the UI that triggers the update refresh when clicked. 3d828a2
- [ ] Task: Configure the Service Worker (`vite-plugin-pwa` strategies) to cache specific API `GET` requests (e.g., `/owners`, `/patients`) for offline read-only access.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: PWA Configuration & Auto-Update' (Protocol in workflow.md)

## Phase 2: Offline UX & Read-Only Mode
- [ ] Task: Create an `OfflineBanner` component that appears when `!navigator.onLine`.
- [ ] Task: Update `api/client.js` interceptors or UI components to disable "Save/Delete" buttons when offline.
- [ ] Task: Verify that cached data loads correctly when network is disconnected (Simulate offline in DevTools).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Offline UX & Read-Only Mode' (Protocol in workflow.md)

## Phase 3: Mobile Navigation & Layout Refinement
- [ ] Task: Refine the `BottomNav` component to ensure it hides/shows correctly on scroll or context, and doesn't overlap the main content (verify the spacer logic).
- [ ] Task: Verify and refine the `Offcanvas` (Sidebar) transition animation for a smoother feel.
- [ ] Task: Audit all forms (`OwnerForm`, `PatientForm`) on mobile view to ensure input types (`tel`, `date`) are correct and tap targets are accessible.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Mobile Navigation & Layout Refinement' (Protocol in workflow.md)
