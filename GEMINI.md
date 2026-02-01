# Project Context: MePetCarePy

## Overview
**MePetCarePy** is a secure, web-based Animal Clinic Management System designed for internal use by veterinary staff. It features role-based access control (RBAC), medical record management (SOAP), and a manual invoicing system with financial reporting.

## Architecture
- **Backend:** Python FastAPI (REST API). Hosted on **Railway**.
- **Frontend:** React (Vite + Bootstrap 5). Hosted on **GitHub Pages** (PWA).
- **Database:** Supabase PostgreSQL (via Transaction Pooler).
- **Auth:** Supabase Auth (JWT).
- **Deployment:**
    - **Frontend:** GitHub Actions (`.github/workflows/deploy.yml`) builds `frontend/` and deploys artifacts.
    - **Backend:** Railway (Connected to GitHub `master` branch).

## Deployment Details
- **Frontend URL:** `https://syawalqi.github.io/MePetCarePy/`
- **Backend URL:** [REDACTED] (Check Railway Dashboard)
- **Repo:** `https://github.com/syawalqi/MePetCarePy`

### Environment Variables
**Frontend (GitHub Secrets):**
- `VITE_SUPABASE_URL`: Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase Public Key.
- `VITE_API_URL`: Backend URL (Check Railway Dashboard).

**Backend (Railway Variables):**
- `SUPABASE_URL`
- `SUPABASE_KEY` (Service Role Key)
- `SUPABASE_ANON_KEY`
- `DATABASE_URL` (Connection string port 6543, `?sslmode=require`)
- `ALLOWED_ORIGINS` (Set to `https://syawalqi.github.io` or `*`)

## Key Features
1.  **Clinical Flow:**
    - SOAP Notes (Subjective, Objective, Assessment, Plan).
    - Patient Timeline & Vital Signs.
2.  **Billing & Finance:**
    - Open Invoicing (Manual item/price entry).
    - Status tracking (UNPAID -> PAID).
    - Monthly Financial Reports (Admin only) + PDF Export.
3.  **Security:**
    - Role-Based Access Control (Admin, Vet, Support).
    - Row Level Security (RLS) on database tables.
    - API Rate Limiting.

## Development Workflows

### Run Locally
**Backend:**
```bash
$env:PYTHONPATH="backend"; .venv\Scripts\python -m uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Database Management
- **Migrations:** Located in `scripts/`.
- **Admin Seeding:** `scripts/seed_admin.py`.

## Directory Structure
- `backend/app/`: FastAPI application code.
- `frontend/src/`: React application code.
- `conductor/`: Project planning tracks and archives.
- `.github/workflows/`: CI/CD configuration.

## Current Status
- **Phase:** Production Ready (MVP).
- **Latest Action:** Deployed to Railway & GitHub Pages. UI overhauled with Bootstrap 5.
