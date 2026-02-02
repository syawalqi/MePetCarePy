-- Enable RLS on Invoices and Invoice Items
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- 1. INVOICES POLICIES

-- SELECT (READ): Everyone (SuperAdmin, Admin, Vet, Support)
CREATE POLICY "Invoice_Select_Policy"
ON public.invoices FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()::text 
    AND profiles.role IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF')
  )
);

-- INSERT (CREATE): Everyone (SuperAdmin, Admin, Vet, Support)
CREATE POLICY "Invoice_Insert_Policy"
ON public.invoices FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()::text 
    AND profiles.role IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF')
  )
);

-- UPDATE: SuperAdmin, Admin, Vet ONLY
CREATE POLICY "Invoice_Update_Policy"
ON public.invoices FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()::text 
    AND profiles.role IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()::text 
    AND profiles.role IN ('SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN')
  )
);

-- DELETE: SuperAdmin ONLY
CREATE POLICY "Invoice_Delete_Policy"
ON public.invoices FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()::text 
    AND profiles.role = 'SUPERADMIN'
  )
);

-- 2. INVOICE_ITEMS POLICIES (Matches parent invoice logic for simplicity)
CREATE POLICY "Items_Select_Policy" ON public.invoice_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Items_Insert_Policy" ON public.invoice_items FOR INSERT TO authenticated WITH CHECK (true);
-- Update and Delete on items are usually handled via invoice cascade or service role.
