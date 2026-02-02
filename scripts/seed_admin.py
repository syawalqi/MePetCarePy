import os
import argparse
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load .env from the backend directory
base_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(base_dir, "..", "backend", ".env")
load_dotenv(env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print(f"Error: SUPABASE_URL or SUPABASE_ANON_KEY not found in {env_path}")
    sys.exit(1)

supabase: Client = create_client(url, key)

def create_admin(email, password, full_name, role="ADMINISTRATOR"):
    print(f"Creating Auth user for {email} with role {role}...")
    try:
        # 1. Create user in Supabase Auth
        auth_res = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })
        
        if not auth_res.user:
            print("Signup failed. Result:")
            print(auth_res)
            return

        user_id = auth_res.user.id
        print(f"Auth user created! ID: {user_id}")

        # 2. Create profile in public.profiles
        print("Creating profile...")
        profile_data = {
            "id": user_id,
            "full_name": full_name,
            "email": email,
            "role": role
        }
        
    except Exception as e:
        print(f"Detailed Error: {e}")
        if hasattr(e, 'message'):
            print(f"Message: {e.message}")

    # 3. Insert profile using SQLAlchemy (Bypass RLS)
    try:
        from sqlalchemy import create_engine, text
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            print("DATABASE_URL not found, cannot seed profile.")
            return

        engine = create_engine(db_url)
        with engine.connect() as conn:
            stmt = text("INSERT INTO profiles (id, full_name, email, role) VALUES (:id, :full_name, :email, :role)")
            conn.execute(stmt, {"id": user_id, "full_name": full_name, "email": email, "role": role})
            conn.commit()
            print(f"{role} profile created successfully! You can now log in.")
            
    except Exception as e:
        print(f"Profile insertion failed (SQL): {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed an admin user for MePetCarePy")
    parser.add_argument("--email", required=True, help="User email")
    parser.add_argument("--password", required=True, help="User password")
    parser.add_argument("--name", required=True, help="User full name")
    parser.add_argument("--role", default="ADMINISTRATOR", choices=["SUPERADMIN", "ADMINISTRATOR"], help="User role (default: ADMINISTRATOR)")
    
    args = parser.parse_args()
    create_admin(args.email, args.password, args.name, args.role)
