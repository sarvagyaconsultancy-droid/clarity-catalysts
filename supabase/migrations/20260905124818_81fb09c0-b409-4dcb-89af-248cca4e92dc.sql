REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, PUBLIC;