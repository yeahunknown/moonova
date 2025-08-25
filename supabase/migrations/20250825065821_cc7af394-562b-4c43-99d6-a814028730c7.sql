-- Security Fix: Restrict SELECT access to rate_limiting table to prevent IP address exposure

-- First, remove the overly permissive service role policy
DROP POLICY IF EXISTS "Service role can manage rate limiting data" ON public.rate_limiting;

-- Create separate, more specific policies for service role operations
CREATE POLICY "Service role can read rate limiting data" 
ON public.rate_limiting 
FOR SELECT 
USING (
  auth.role() = 'service_role' OR 
  auth.jwt() ->> 'role' = 'service_role'
);

CREATE POLICY "Service role can insert rate limiting data" 
ON public.rate_limiting 
FOR INSERT 
WITH CHECK (
  auth.role() = 'service_role' OR 
  auth.jwt() ->> 'role' = 'service_role'
);

CREATE POLICY "Service role can update rate limiting data" 
ON public.rate_limiting 
FOR UPDATE 
USING (
  auth.role() = 'service_role' OR 
  auth.jwt() ->> 'role' = 'service_role'
) 
WITH CHECK (
  auth.role() = 'service_role' OR 
  auth.jwt() ->> 'role' = 'service_role'
);

CREATE POLICY "Service role can delete rate limiting data" 
ON public.rate_limiting 
FOR DELETE 
USING (
  auth.role() = 'service_role' OR 
  auth.jwt() ->> 'role' = 'service_role'
);

-- Keep the existing edge function insert policy as it's appropriately scoped
-- "Edge functions can insert rate limiting records" already exists and is correct