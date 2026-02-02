-- 1. Create User Role Enum
CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF');

-- 2. Create Invoice Status Enum
CREATE TYPE invoice_status AS ENUM ('UNPAID', 'PAID', 'CANCELLED');

-- 3. Convert Profiles Table
ALTER TABLE public.profiles 
  ALTER COLUMN role TYPE user_role 
  USING role::user_role;

-- 4. Convert Invoices Table
ALTER TABLE public.invoices 
  ALTER COLUMN status TYPE invoice_status 
  USING status::invoice_status;
