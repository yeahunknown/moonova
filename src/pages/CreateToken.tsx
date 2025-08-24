import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TokenCreationForm from "@/components/forms/TokenCreationForm";
import { PaymentModal } from "@/components/modals/PaymentModal";
import { TrendingTokensModal } from "@/components/modals/TrendingTokensModal";
import { useToast } from "@/hooks/use-toast";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";
import { TrendingUp, Loader2 } from "lucide-react";
import type { TokenCreationFormRef } from "@/components/forms/TokenCreationForm";

interface TrendingToken {
  name: string;
  symbol: string;
  image: string;
  description: string;
  metadata: {
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
  };
  tokenAddress: string;
  chain: string;
}

const CreateToken = () => {
  const [step, setStep] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTrendingModalOpen, setIsTrendingModalOpen] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const { setSectionRef, isVisible } = useFadeInAnimation();
  const { toast } = useToast();
  const formRef = useRef<TokenCreationFormRef>(null);

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

  const handlePaymentComplete = () => {
    // Payment success handled by the success modal
  };

  const handleCopyTrendingTokens = async () => {
    setIsLoadingTrending(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTrendingModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load trending tokens",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTrending(false);
    }
  };

  const handleTokenSelect = (token: TrendingToken) => {
    if (formRef.current) {
      formRef.current.fillTokenData(token);
      toast({
        title: "Token Copied",
        description: `${token.name} (${token.symbol}) copied to form`,
      });
    }
  };

  const handleTokensSelect = (tokens: TrendingToken[]) => {
    if (tokens.length > 0 && formRef.current) {
      // For now, just copy the first token
      // In a real implementation, you might want to queue all tokens
      formRef.current.fillTokenData(tokens[0]);
      toast({
        title: "Tokens Copied",
        description: `Copied ${tokens[0].name} to form. ${tokens.length - 1} more tokens available.`,
      });
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
                  ref={formRef}
                  step={step}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onSubmit={handleFormSubmit}
                />

                {/* Copy Trending Tokens Button - Only show in step 3 */}
                {step === 3 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button
                      onClick={handleCopyTrendingTokens}
                      disabled={isLoadingTrending}
                      variant="secondary"
                      className="w-full bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground border border-border/50 transition-all duration-200 hover:scale-105"
                    >
                      {isLoadingTrending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Copy Trending Tokens
                        </>
                      )}
                    </Button>
                  </div>
                )}
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

      {/* Trending Tokens Modal */}
      <TrendingTokensModal
        open={isTrendingModalOpen}
        onOpenChange={setIsTrendingModalOpen}
        onTokenSelect={handleTokenSelect}
        onTokensSelect={handleTokensSelect}
      />
    </div>
  );
};

export default CreateToken;