import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import TokenCreationForm from "@/components/forms/TokenCreationForm";
import PaymentModal from "@/components/modals/PaymentModal";
import { useToast } from "@/hooks/use-toast";

const CreateToken = () => {
  const [step, setStep] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
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
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = () => {
    toast({
      title: "Token Created Successfully!",
      description: "Your token has been deployed to the Solana blockchain.",
    });
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
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Create Your <span className="bg-gradient-primary bg-clip-text text-transparent">Token</span>
              </h1>
              <p className="text-muted-foreground">Follow the 3-step process to launch your token</p>
            </div>

            {/* Main Container */}
            <Card className="border-border bg-card/30 backdrop-blur-lg shadow-2xl">
              <CardContent className="p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-4">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                        step >= 1 ? 'bg-gradient-primary text-white' : 'bg-secondary text-muted-foreground'
                      }`}>
                        Basic Info
                      </span>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                        step >= 2 ? 'bg-gradient-primary text-white' : 'bg-secondary text-muted-foreground'
                      }`}>
                        Details
                      </span>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                        step >= 3 ? 'bg-gradient-primary text-white' : 'bg-secondary text-muted-foreground'
                      }`}>
                        Advanced Settings
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
                  </div>
                  <div className="relative">
                    <Progress value={progressPercentage} className="h-2" />
                    <div 
                      className="absolute top-0 left-0 h-2 bg-gradient-primary rounded-full transition-all duration-500 ease-out shadow-glow"
                      style={{ width: `${progressPercentage}%` }}
                    />
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
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalCost={calculateCost()}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default CreateToken;