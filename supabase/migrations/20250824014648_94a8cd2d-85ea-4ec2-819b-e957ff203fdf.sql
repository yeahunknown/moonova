-- Fix function search path mutable security warning by setting search_path
CREATE OR REPLACE FUNCTION cleanup_trending_tokens_cache()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.trending_tokens_cache 
  WHERE fetched_at < now() - interval '5 minutes';
END;
$$;