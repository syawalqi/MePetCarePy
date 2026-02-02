-- Add ON DELETE CASCADE to foreign keys for automatic cleanup

-- 1. Patients -> Owners
ALTER TABLE patients
DROP CONSTRAINT IF EXISTS patients_owner_id_fkey;

ALTER TABLE patients
ADD CONSTRAINT patients_owner_id_fkey
FOREIGN KEY (owner_id) REFERENCES owners(id)
ON DELETE CASCADE;

-- 2. Medical Records -> Patients
ALTER TABLE medical_records
DROP CONSTRAINT IF EXISTS medical_records_patient_id_fkey;

ALTER TABLE medical_records
ADD CONSTRAINT medical_records_patient_id_fkey
FOREIGN KEY (patient_id) REFERENCES patients(id)
ON DELETE CASCADE;

-- 3. Invoices -> Patients
ALTER TABLE invoices
DROP CONSTRAINT IF EXISTS invoices_patient_id_fkey;

ALTER TABLE invoices
ADD CONSTRAINT invoices_patient_id_fkey
FOREIGN KEY (patient_id) REFERENCES patients(id)
ON DELETE CASCADE;

-- 4. Invoice Items -> Invoices
ALTER TABLE invoice_items
DROP CONSTRAINT IF EXISTS invoice_items_invoice_id_fkey;

ALTER TABLE invoice_items
ADD CONSTRAINT invoice_items_invoice_id_fkey
FOREIGN KEY (invoice_id) REFERENCES invoices(id)
ON DELETE CASCADE;

-- 5. User Sessions -> Profiles
ALTER TABLE user_sessions
DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;

ALTER TABLE user_sessions
ADD CONSTRAINT user_sessions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE CASCADE;
