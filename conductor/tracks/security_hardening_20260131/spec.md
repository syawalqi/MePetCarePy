# Specification: Security Hardening & Production Readiness

## Goal
To elevate the application's security posture by implementing defensive measures at the API, database, and infrastructure levels, ensuring clinic data is protected against common cyber threats and data leaks.

## Requirements
- **Role-Aware Rate Limiting:** Implement request rate limiting on the FastAPI backend using `slowapi`.
    - Unauthenticated: Lowest limits.
    - Staff: Moderate limits.
    - Veterinarian/Admin: Higher limits.
- **CORS Hardening:** Update CORS settings to restrict allowed origins to specific domains (transition away from `*`).
- **Supabase RLS (Row Level Security):**
    - Enable RLS on `owners`, `patients`, `medical_records`, and `profiles`.
    - **Granular Policies:** Implement separate SQL Policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. Avoid "all actions" policies.
    - **Admin Bypass:** Explicitly verify that the `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS for critical backend operations (e.g., account creation).
    - **Version Control:** Initialize `supabase/migrations` to track RLS policy changes.
- **Auditing & Logging:** 
    - Log data modification actions (Create/Update/Delete) for `owners`, `patients`, and `medical_records`.
    - Log entries must include: User ID, Role, Action, Entity ID, and Timestamp.
    - **PII Filter:** Implement a log filter to automatically redact PII (Phone, Address, etc.) from backend logs.
- **Input Validation:** Strengthen Pydantic schemas to ensure all incoming data is strictly typed and sanitized.
- **Secure Headers:** Add security-related headers (HSTS, X-Content-Type-Options, etc.) to API responses.

## Technical Constraints
- Backend: FastAPI, `slowapi`, standard Python `logging`.
- Database: Supabase SQL Editor and `supabase/migrations`.
- Infrastructure: Strict environment variable management for keys.