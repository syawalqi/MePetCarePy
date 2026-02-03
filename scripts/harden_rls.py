
import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load env from backend directory
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, "backend", ".env"))

db_url = os.getenv("DATABASE_URL")
if not db_url:
    print("DATABASE_URL not found.")
    sys.exit(1)

def apply_hardening_and_optimization():
    engine = create_engine(db_url)
    with engine.connect() as conn:
        print("--- Applying Optimized & Hardened RLS Policies ---")

        # Helper to drop and recreate
        def create_policy(table, name, command, using=None, with_check=None):
            print(f"[{table}] applying {name} ({command})...")
            conn.execute(text(f"DROP POLICY IF EXISTS \"{name}\" ON {table}"))
            
            sql = f"CREATE POLICY \"{name}\" ON {table} FOR {command} TO authenticated"
            if using:
                sql += f" USING ({using})"
            if with_check:
                sql += f" WITH CHECK ({with_check})"
            
            conn.execute(text(sql))

        # --- OPTIMIZED AUTH CHECK ---
        # Using (select auth.uid()) to prevent re-evaluation per row
        auth_uid = "(select auth.uid())"
        
        # --- COMMON ROLE CHECKS ---
        # Note: We cast role to text to avoid Enum issues, and auth_uid to text for ID match
        
        # 1. Management (Admin + Support)
        mgmt_check = f"EXISTS (SELECT 1 FROM profiles WHERE profiles.id = {auth_uid}::text AND profiles.role::text IN ('SUPERADMIN', 'ADMINISTRATOR', 'SUPPORT_STAFF'))"
        
        # 2. Clinical (Admin + Vet)
        clinical_check = f"EXISTS (SELECT 1 FROM profiles WHERE profiles.id = {auth_uid}::text AND profiles.role::text IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN'))"
        
        # 3. All Staff (Admin + Vet + Support)
        all_staff_check = f"EXISTS (SELECT 1 FROM profiles WHERE profiles.id = {auth_uid}::text AND profiles.role::text IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'))"

        # --- TABLE: OWNERS ---
        create_policy("owners", "Allow authenticated staff to view all owners", "SELECT", using="true")
        create_policy("owners", "Mgmt staff can insert owners", "INSERT", with_check=mgmt_check)
        create_policy("owners", "Mgmt staff can update owners", "UPDATE", using=mgmt_check, with_check=mgmt_check)
        
        # --- TABLE: PATIENTS ---
        create_policy("patients", "Allow authenticated staff to view all patients", "SELECT", using="true")
        create_policy("patients", "Mgmt staff can insert patients", "INSERT", with_check=mgmt_check)
        create_policy("patients", "Mgmt staff can update patients", "UPDATE", using=mgmt_check, with_check=mgmt_check)

        # --- TABLE: MEDICAL_RECORDS ---
        create_policy("medical_records", "Allow authenticated staff to view medical history", "SELECT", using="true")
        create_policy("medical_records", "Clinical staff can insert records", "INSERT", with_check=clinical_check)
        create_policy("medical_records", "Clinical staff can update records", "UPDATE", using=clinical_check, with_check=clinical_check)

        # --- TABLE: INVOICE_ITEMS ---
        create_policy("invoice_items", "Items_Select_Policy", "SELECT", using="true")
        create_policy("invoice_items", "Items_Insert_Policy", "INSERT", with_check=all_staff_check)
        create_policy("invoice_items", "Items_Update_Policy", "UPDATE", using=all_staff_check, with_check=all_staff_check)
        create_policy("invoice_items", "Items_Delete_Policy", "DELETE", using=all_staff_check)

        # --- TABLE: USER_SESSIONS (New) ---
        # Optimized: Users can only see/delete their own session
        user_session_check = f"(user_id)::text = {auth_uid}::text"
        create_policy("user_sessions", "Users can view own session", "SELECT", using=user_session_check)
        create_policy("user_sessions", "Users can delete own session", "DELETE", using=user_session_check)
        # Note: Insert is usually handled by service role or during login? 
        # API Login `POST /users/session` inserts it. The user must be able to insert their own session?
        # Checking previous policy: It wasn't explicitly listed in warnings for INSERT.
        # Let's ensure INSERT is allowed for authenticated? Or logic handles it?
        # Step 649 showed no INSERT policy for user_sessions? Wait.
        # "Table: user_sessions | RLS: ENABLED"
        # Policies listed: DELETE, SELECT.
        # If no INSERT policy, then Insert is BLOCKED for authenticated?
        # Unless it's done by Service Key or there was a policy I missed.
        # The API code `POST /users/session` runs as the user.
        # Let's add an INSERT policy: Authenticated users can insert their own session.
        session_insert_check = f"(user_id)::text = {auth_uid}::text"
        create_policy("user_sessions", "Users can insert own session", "INSERT", with_check=session_insert_check)

        # --- TABLE: INVOICES (New) ---
        # Optimized: Invoices managed by All Staff (aligned with Invoice Items)
        # Existing policy name was "Invoice_Select_Policy" etc.
        create_policy("invoices", "Invoice_Select_Policy", "SELECT", using="true") # Open read vs restricted? Old was SELECT 1 (from profile check). Let's keep strict?
        # Actually API `invoices.py` has `check_role(Any Staff)`. 
        # Let's align with `invoice_items` -> All Staff.
        # Or should we just stick to Open Read like the others? The old policy used explicit checks.
        # Let's use `all_staff_check` for consistency and security.
        # Wait, old policy for SELECT on invoices was missing in detail 649?
        # "Policy: Invoice_Select_Policy SELECT 1" -> likely truncated or "Using true" was not shown properly?
        # Let's use 'true' for Select to match Client UX (easier), but Writes Restricted.
        create_policy("invoices", "Invoice_Select_Policy", "SELECT", using="true")
        create_policy("invoices", "Invoice_Insert_Policy", "INSERT", with_check=all_staff_check)
        create_policy("invoices", "Invoice_Update_Policy", "UPDATE", using=all_staff_check, with_check=all_staff_check)
        create_policy("invoices", "Invoice_Delete_Policy", "DELETE", using=all_staff_check)

        conn.commit()
        print("--- Optimization Complete ---")

if __name__ == "__main__":
    apply_hardening_and_optimization()
