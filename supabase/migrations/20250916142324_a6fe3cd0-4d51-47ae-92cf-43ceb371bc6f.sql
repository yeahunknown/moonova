-- Fix critical security issues in RLS policies

-- 1. Secure trending_tokens_cache table - restrict write access to service role only
DROP POLICY IF EXISTS "Allow public insert/update to trending tokens cache" ON public.trending_tokens_cache;

CREATE POLICY "Service role can manage trending tokens cache" 
ON public.trending_tokens_cache 
FOR ALL 
USING (
  (auth.role() = 'service_role'::text) OR 
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
)
WITH CHECK (
  (auth.role() = 'service_role'::text) OR 
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
);

-- 2. Keep public read access for trending tokens cache
CREATE POLICY "Allow public read access to trending tokens cache" 
ON public.trending_tokens_cache 
FOR SELECT 
USING (true);

-- 3. Enhance rate limiting table security - restrict edge function access
DROP POLICY IF EXISTS "Edge functions can insert rate limiting records" ON public.rate_limiting;

CREATE POLICY "Service role can manage rate limiting data" 
ON public.rate_limiting 
FOR ALL 
USING (
  (auth.role() = 'service_role'::text) OR 
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
)
WITH CHECK (
  (auth.role() = 'service_role'::text) OR 
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
);

-- 4. Create secure function for atomic referral visit updates
CREATE OR REPLACE FUNCTION public.increment_referral_visits(referral_code_param TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert visit record
  INSERT INTO public.referral_visits (referral_code, visitor_ip)
  VALUES (referral_code_param, 'anonymous');
  
  -- Atomically increment visit count
  UPDATE public.referrals 
  SET visits_count = visits_count + 1,
      updated_at = now()
  WHERE referral_code = referral_code_param;
END;
$$;

-- 5. Create secure function for token creation tracking
CREATE OR REPLACE FUNCTION public.track_referral_conversion(referral_code_param TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert conversion record
  INSERT INTO public.referral_conversions (referral_code)
  VALUES (referral_code_param);
  
  -- Atomically increment tokens_created count and update level
  UPDATE public.referrals 
  SET tokens_created = tokens_created + 1,
      level = CASE 
        WHEN tokens_created + 1 >= 100 THEN 4
        WHEN tokens_created + 1 >= 50 THEN 3
        WHEN tokens_created + 1 >= 10 THEN 2
        ELSE 1
      END,
      updated_at = now()
  WHERE referral_code = referral_code_param;
END;
$$;