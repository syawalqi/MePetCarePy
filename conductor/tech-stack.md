# Technology Stack

## Backend
*   **Framework:** Python FastAPI
*   **Architecture:** REST API
*   **Database:** Supabase (PostgreSQL). FastAPI may use either the Supabase Python client or SQLAlchemy with direct PostgreSQL access, but the approach must be consistent and not mixed arbitrarily.
*   **Authentication:** Supabase Auth (Role-based access control)
*   **Key Libraries:** Pydantic (validation), Pytest (testing)

## Frontend
*   **Framework:** React
*   **State Management:** React Context API or similar lightweight solution (implied for small/medium app)
*   **API Client:** Axios or Fetch API
*   **UI/Styling:** CSS Modules or Styled Components (aligned with custom design/Material reference)

## Infrastructure & DevOps
*   **Services:** Supabase is used for database, authentication, and storage services.
*   **Backend Hosting:** The FastAPI backend is deployed separately (cloud-agnostic).
*   **Frontend Hosting:** Frontend hosting (e.g., Vercel/Netlify) is optional and not prescriptive.
*   **Version Control:** Git
