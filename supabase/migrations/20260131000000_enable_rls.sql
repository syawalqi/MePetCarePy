-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
-- Allow all authenticated users to view profiles
CREATE POLICY "Allow authenticated staff to view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

-- 2. OWNERS POLICIES
-- Allow all authenticated users to view owners
CREATE POLICY "Allow authenticated staff to view all owners" 
ON public.owners FOR SELECT 
TO authenticated 
USING (true);

-- Allow all authenticated users to insert/update owners
CREATE POLICY "Allow authenticated staff to create/update owners" 
ON public.owners FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated staff to update owners" 
ON public.owners FOR UPDATE 
TO authenticated 
USING (true);

-- 3. PATIENTS POLICIES
CREATE POLICY "Allow authenticated staff to view all patients" 
ON public.patients FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated staff to create/update patients" 
ON public.patients FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated staff to update patients" 
ON public.patients FOR UPDATE 
TO authenticated 
USING (true);

-- 4. MEDICAL RECORDS POLICIES
CREATE POLICY "Allow authenticated staff to view medical history" 
ON public.medical_records FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated staff to create medical notes" 
ON public.medical_records FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated staff to update medical notes" 
ON public.medical_records FOR UPDATE 
TO authenticated 
USING (true);

-- NOTE: DELETE is intentionally omitted. 
-- Only the 'service_role' key (used by our backend) bypasses RLS to perform deletions.
