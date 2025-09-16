import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import TokenCreationForm from "@/components/forms/TokenCreationForm";
import { PaymentModal } from "@/components/modals/PaymentModal";
import { useToast } from "@/hooks/use-toast";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";
import { supabase } from "@/integrations/supabase/client";

const CreateToken = () => {
  const [step, setStep] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const { setSectionRef, isVisible } = useFadeInAnimation();
  const { toast } = useToast();

  const progressPercentage = (step / 3) * 100;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFormSubmit = (data: any) => {
    setTokenData(data);
    // Store complete token data in session storage for later use
    sessionStorage.setItem('createdTokenData', JSON.stringify(data));
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = async () => {
    // Track referral conversion if user came from a referral link
    const referralCode = localStorage.getItem('referral_code');
    if (referralCode) {
      try {
        console.log('Tracking referral conversion for code:', referralCode);
        
        const { error } = await supabase.rpc('track_referral_conversion', {
          referral_code_param: referralCode
        });
        
        if (error) {
          console.error('Error tracking referral conversion:', error);
        } else {
          console.log('Successfully tracked referral conversion');
          // Clear the referral code after successful conversion
          localStorage.removeItem('referral_code');
        }
      } catch (error) {
        console.error('Error in referral conversion tracking:', error);
      }
    }
  };

  const calculateCost = () => {
    if (!tokenData) return "0.1";
    
    let cost = 0.1; // Base token creation
    if (tokenData.addMetadata) cost += 0.1;
    if (tokenData.revokeFreezeAuth) cost += 0.1;
    if (tokenData.revokeMintAuth) cost += 0.1;
    if (tokenData.revokeMetadataAuth) cost += 0.1;
    return cost.toFixed(1);
  };


  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div 
              ref={setSectionRef('header')}
              className={`text-center mb-8 lg:mb-12 transition-all duration-700 ${
                isVisible('header') ? 'animate-fade-in' : 'opacity-100'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Create Your <span className="bg-gradient-primary bg-clip-text text-transparent">Token</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">Follow the 3-step process to launch your token</p>
            </div>

            {/* Main Container */}
            <Card 
              ref={setSectionRef('form')}
              className={`border-border bg-card/30 backdrop-blur-lg shadow-2xl transition-all duration-700 ${
                isVisible('form') ? 'animate-fade-in' : 'opacity-100'
              }`}
            >
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* Progress Bar */}
                <div className="mb-6 lg:mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs sm:text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
                  </div>
                  <div className="relative">
                    <Progress value={progressPercentage} className="h-3" />
                    <div 
                      className="absolute top-0 left-0 h-3 bg-gradient-primary rounded-full transition-all duration-500 ease-out shadow-glow"
                      style={{ width: `${progressPercentage}%` }}
                    />
                    
                    {/* Dot indicators positioned over the progress bar */}
                    <div className="absolute top-1/2 left-0 w-full flex justify-between -translate-y-1/2 pointer-events-none px-1">
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        step >= 1 ? 'bg-gradient-primary border-primary shadow-glow scale-110' : 'bg-background border-muted-foreground'
                      }`} />
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        step >= 2 ? 'bg-gradient-primary border-primary shadow-glow scale-110' : 'bg-background border-muted-foreground'
                      }`} />
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        step >= 3 ? 'bg-gradient-primary border-primary shadow-glow scale-110' : 'bg-background border-muted-foreground'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Step labels */}
                  <div className="flex justify-between mt-4 text-xs sm:text-sm">
                    <span className={`transition-all duration-300 ${step >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      Basic Info
                    </span>
                    <span className={`transition-all duration-300 ${step >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      Details
                    </span>
                    <span className={`transition-all duration-300 ${step >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      Advanced
                    </span>
                  </div>
                </div>

                {/* Form */}
                <TokenCreationForm
                  step={step}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onSubmit={handleFormSubmit}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        amount={parseFloat(calculateCost())}
        onPaymentSuccess={handlePaymentComplete}
        type="token"
        tokenData={tokenData ? { name: tokenData.name, symbol: tokenData.symbol } : undefined}
      />
    </div>
  );
};

export default CreateToken;