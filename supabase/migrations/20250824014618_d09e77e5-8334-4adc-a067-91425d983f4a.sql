-- Create table for caching trending tokens
CREATE TABLE IF NOT EXISTS public.trending_tokens_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data JSONB NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limiting (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  endpoint VARCHAR(100) NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables (not user-specific data, but good practice)
ALTER TABLE public.trending_tokens_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limiting ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for these specific use cases
CREATE POLICY "Allow public read access to trending tokens cache" 
ON public.trending_tokens_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert/update to trending tokens cache" 
ON public.trending_tokens_cache 
FOR ALL 
USING (true);

CREATE POLICY "Allow public access to rate limiting" 
ON public.rate_limiting 
FOR ALL 
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trending_tokens_cache_fetched_at ON public.trending_tokens_cache(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_ip_endpoint ON public.rate_limiting(ip_address, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_window_start ON public.rate_limiting(window_start);

-- Create function to cleanup old cache entries (older than 5 minutes)
CREATE OR REPLACE FUNCTION cleanup_trending_tokens_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.trending_tokens_cache 
  WHERE fetched_at < now() - interval '5 minutes';
END;
$$ LANGUAGE plpgsql;