DROP POLICY IF EXISTS "blocks public read" ON public.availability_blocks;
REVOKE SELECT ON public.availability_blocks FROM anon;

CREATE POLICY "blocks admin read" ON public.availability_blocks
FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE VIEW public.availability_block_dates
WITH (security_invoker = off) AS
SELECT block_date FROM public.availability_blocks;

GRANT SELECT ON public.availability_block_dates TO anon, authenticated;