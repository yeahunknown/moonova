import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const RefLanding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const trackVisit = async () => {
      const referralCode = searchParams.get('ref');
      
      if (referralCode) {
        try {
          console.log('Tracking visit for referral code:', referralCode);
          
          // Use the secure function to atomically track visit and increment count
          const { error } = await supabase.rpc('increment_referral_visits', {
            referral_code_param: referralCode
          });

          if (error) {
            console.error('Error calling increment_referral_visits:', error);
            // Fallback to manual tracking if function fails
            await supabase
              .from('referral_visits')
              .insert({
                referral_code: referralCode,
                visitor_ip: 'anonymous'
              });
          } else {
            console.log('Successfully tracked referral visit');
          }

          // Store referral code in localStorage for later conversion tracking
          localStorage.setItem('referral_code', referralCode);
        } catch (error) {
          console.error('Error tracking referral visit:', error);
        }
      }

      // Redirect to create token page after a short delay to ensure tracking completes
      setTimeout(() => navigate('/create'), 500);
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