REVOKE SELECT ON public.availability_blocks FROM authenticated;
GRANT SELECT (block_date) ON public.availability_blocks TO authenticated;