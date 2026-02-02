-- Enable RLS on Invoices and Invoice Items
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- 1. INVOICE ACCESS (Admins, Vets, and Support)
-- This checks if the person logged in (auth.uid()) has a profile with a valid role.
CREATE POLICY "Staff_Access_Invoices"
ON public.invoices 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()::text 
    AND profiles.role IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()::text 
    AND profiles.role IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF')
  )
);

-- 2. INVOICE ITEMS ACCESS (Linked to the profile-based role check)
CREATE POLICY "Staff_Access_Invoice_Items"
ON public.invoice_items 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()::text 
    AND profiles.role IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()::text 
    AND profiles.role IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF')
  )
);

-- NOTE: DELETE is intentionally omitted. 
-- Only the 'service_role' key (used by our backend) bypasses RLS to perform deletions.