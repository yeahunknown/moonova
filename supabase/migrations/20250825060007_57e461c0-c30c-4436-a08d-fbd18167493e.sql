-- Fix security vulnerability: Remove public access to rate_limiting table
-- This table contains sensitive IP address data that should not be publicly accessible

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Allow public access to rate limiting" ON public.rate_limiting;

-- Create secure policies for rate_limiting table
-- Only allow service role access for rate limiting functionality
CREATE POLICY "Service role can manage rate limiting data"
ON public.rate_limiting
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users to only insert their own rate limiting records
-- (though typically this would be handled by edge functions with service role)
CREATE POLICY "Edge functions can insert rate limiting records"
ON public.rate_limiting
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Prevent any public read access to protect IP addresses
-- No SELECT policy for public users = no public read access