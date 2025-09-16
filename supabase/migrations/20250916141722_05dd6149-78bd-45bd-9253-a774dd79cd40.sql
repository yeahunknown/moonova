-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  visits_count INTEGER NOT NULL DEFAULT 0,
  tokens_created INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referral visits table
CREATE TABLE public.referral_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code TEXT NOT NULL,
  visitor_ip TEXT,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referral conversions table
CREATE TABLE public.referral_conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code TEXT NOT NULL,
  token_created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Allow public read access to referrals" 
ON public.referrals 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert/update to referrals" 
ON public.referrals 
FOR ALL 
USING (true);

CREATE POLICY "Allow public insert to referral visits" 
ON public.referral_visits 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read access to referral visits" 
ON public.referral_visits 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to referral conversions" 
ON public.referral_conversions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read access to referral conversions" 
ON public.referral_conversions 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_referrals_updated_at
BEFORE UPDATE ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();