DROP VIEW IF EXISTS public.availability_block_dates;

CREATE POLICY "blocks public read dates" ON public.availability_blocks
FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT (block_date) ON public.availability_blocks TO anon, authenticated;