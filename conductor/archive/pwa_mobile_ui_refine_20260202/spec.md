# Specification: PWA and Mobile UI Optimization (Refinement)

## Goal
Transform MePetCarePy into a high-quality Progressive Web App (PWA) that provides a native-like experience on mobile devices. This includes ensuring the app is installable, provides offline read-only access to cached data, and features a polished, touch-first mobile interface.

## Requirements

### 1. Progressive Web App (PWA)
- **Web App Manifest:** Correctly define `short_name`, `theme_color`, and `display: standalone`.
- **Icon Set:** Ensure all required icon sizes (192x192, 512x512) are present and medical-themed.
- **Offline Basic (Read-Only):** 
    - Implement a Service Worker to cache static assets and selected `GET` API responses (e.g., patient lists, owner details) for read-only access.
    - If offline, allow users to view cached data but disable "Save", "Update", or "Delete" buttons with a clear "Offline" status indicator.
- **Auto-Update:** Configure `vite-plugin-pwa` to notify users when a new version is available and reload on user confirmation (instead of silent auto-update).

### 2. Mobile UI & UX
- **Navigation:**
    - **Off-canvas Menu:** Refine the hamburger menu/sidebar for a smoother transition.
    - **Bottom Navigation Bar:** Ensure the fixed bottom bar is responsive and doesn't overlap content.
    - **Indonesian Localization:** Ensure all navigation and primary buttons use Bahasa Indonesia.
- **Touch Optimization:**
    - Increase tap targets for all buttons and form inputs.
    - Use `type="tel"`, `type="date"`, and `inputmode` where appropriate to trigger correct mobile keyboards.
- **Responsive Layouts:**
    - **Card View vs Table:** On mobile, default to a card-based layout for lists (Owners, Patients) while keeping the table view for desktop.
    - **Form Scaling:** Ensure forms don't cause horizontal scrolling on narrow devices.

## Technical Constraints
- **Framework:** React (Vite).
- **Styling:** Bootstrap 5 (Utility-first approach) + Custom CSS Variables.
- **PWA Plugin:** `vite-plugin-pwa`.
- **Language:** Bahasa Indonesia (Frontend).

## Acceptance Criteria
- [ ] App can be installed on Android/iOS home screens with a custom icon.
- [ ] App launches without a browser address bar (standalone mode).
- [ ] Users can navigate the app using the Bottom Nav bar on mobile.
- [ ] App displays a "Read-Only / Offline" notification when internet is lost.
- [ ] App prompts the user to refresh when a new deployment is detected.
- [ ] Data entry forms are easy to use with large buttons and appropriate keyboards.

## Out of Scope
- Background data synchronization (Sync API).
- Push notifications.
- Gesture-based navigation (swiping to go back).
