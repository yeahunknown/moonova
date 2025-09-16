import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const RefLanding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const trackVisit = async () => {
      const referralCode = searchParams.get('');
      
      if (referralCode) {
        try {
          // Track the visit
          await supabase
            .from('referral_visits')
            .insert({
              referral_code: referralCode,
              visitor_ip: 'anonymous' // Could use a service to get real IP
            });

          // Update visit count
          const { data: referralData } = await supabase
            .from('referrals')
            .select('visits_count')
            .eq('referral_code', referralCode)
            .single();

          if (referralData) {
            await supabase
              .from('referrals')
              .update({ visits_count: referralData.visits_count + 1 })
              .eq('referral_code', referralCode);
          }

          // Store referral code in localStorage for later conversion tracking
          localStorage.setItem('referral_code', referralCode);
        } catch (error) {
          console.error('Error tracking referral visit:', error);
        }
      }

      // Redirect to create token page
      navigate('/create');
    };

    trackVisit();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to token creation...</p>
      </div>
    </div>
  );
};

export default RefLanding;