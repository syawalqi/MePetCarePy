# Specification: Security Hardening & Production Readiness

## Goal
To elevate the application's security posture by implementing defensive measures at the API, database, and infrastructure levels, ensuring clinic data is protected against common cyber threats.

## Requirements
- **Rate Limiting:** Implement request rate limiting on the FastAPI backend using `slowapi` or similar to prevent brute-force attacks on login and data endpoints.
- **CORS Hardening:** Update CORS settings to restrict allowed origins to specific domains (transition away from `*`).
- **Supabase RLS (Row Level Security):**
    - Enable RLS on `owners`, `patients`, `medical_records`, and `profiles`.
    - Implement SQL Policies so that only authenticated staff can read/write data.
- **Input Validation:** Strengthen Pydantic schemas to ensure all incoming data is strictly typed and sanitized.
- **Secure Headers:** Add security-related headers (HSTS, X-Content-Type-Options, etc.) to API responses.
- **Audit Logging:** Implement basic backend logging for create/delete actions to maintain a clinical audit trail.

## Technical Constraints
- Backend: FastAPI, `slowapi`, `uvicorn` security configurations.
- Database: Supabase SQL Editor for RLS Policy creation.
- Infrastructure: Strict environment variable management.
