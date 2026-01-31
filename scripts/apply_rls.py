import os
from sqlalchemy import text
from app.database import engine
from dotenv import load_dotenv

# Load .env
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, "backend", ".env"))

migration_path = os.path.join(base_dir, "supabase", "migrations", "20260131000000_enable_rls.sql")

def apply_migration():
    print(f"Reading migration from {migration_path}...")
    with open(migration_path, "r") as f:
        sql = f.read()

    print("Connecting to Supabase to apply RLS policies...")
    try:
        # Split by semicolon and filter out comments/empty lines
        statements = [s.strip() for s in sql.split(";") if s.strip()]
        
        with engine.connect() as conn:
            for statement in statements:
                # Remove inline comments for execution
                clean_statement = "\n".join([line for line in statement.split("\n") if not line.strip().startswith("--")])
                if clean_statement.strip():
                    conn.execute(text(clean_statement))
            conn.commit()
            print("RLS Policies applied successfully!")
            
    except Exception as e:
        print(f"Failed to apply policies: {e}")

if __name__ == "__main__":
    apply_migration()