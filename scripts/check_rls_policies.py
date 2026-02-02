import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, "backend", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
if "sslmode=" not in DATABASE_URL:
    DATABASE_URL += "&sslmode=require" if "?" in DATABASE_URL else "?sslmode=require"

engine = create_engine(DATABASE_URL)

RLS_STATUS_QUERY = """
SELECT 
    tablename, 
    relrowsecurity AS rls_enabled
FROM pg_tables 
JOIN pg_class ON pg_tables.tablename = pg_class.relname
WHERE schemaname = 'public'
ORDER BY tablename;
"""

POLICIES_QUERY = """
SELECT 
    tablename, 
    policyname, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
"""

def check_security():
    try:
        with engine.connect() as conn:
            # 1. Check RLS Status
            print("\n--- TABLE RLS STATUS ---")
            status_res = conn.execute(text(RLS_STATUS_QUERY))
            status_map = {}
            for row in status_res:
                status_map[row.tablename] = row.rls_enabled
                status_str = "ENABLED" if row.rls_enabled else "DISABLED"
                print(f"Table: {row.tablename:<20} | RLS: {status_str}")

            # 2. Check Policies
            print("\n--- DETAILED POLICIES ---")
            policy_res = conn.execute(text(POLICIES_QUERY))
            current_table = ""
            for p in policy_res:
                if p.tablename != current_table:
                    current_table = p.tablename
                    print(f"\n[ {current_table.upper()} ]")
                
                print(f"  - Policy: {p.policyname}")
                print(f"    Command: {p.cmd}")
                print(f"    Condition (USING): {p.qual}")
                if p.with_check:
                    print(f"    Check (WITH CHECK): {p.with_check}")
                
    except Exception as e:
        print(f"Error checking security: {str(e)}")

if __name__ == "__main__":
    check_security()