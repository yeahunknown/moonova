import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PaymentModal } from "@/components/modals/PaymentModal";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";

const Liquidity = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [lpSize, setLpSize] = useState("");
  const [boostVisibility, setBoostVisibility] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { setSectionRef, isVisible } = useFadeInAnimation();

  // Handle pre-filled data from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const prefilledTokenAddress = urlParams.get('tokenAddress');
    const prefilledTokenName = urlParams.get('tokenName');
    const prefilledTokenSymbol = urlParams.get('tokenSymbol');
    
    if (prefilledTokenAddress) setTokenAddress(prefilledTokenAddress);
    if (prefilledTokenName) setTokenName(prefilledTokenName);
    if (prefilledTokenSymbol) setTokenSymbol(prefilledTokenSymbol);
  }, []);

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(lpSize) || 0;
    const boostPrice = boostVisibility ? 0.15 : 0;
    return (basePrice + boostPrice).toFixed(2);
  };

  const handleLpSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for user to clear input
    if (value === "") {
      setLpSize("");
      return;
    }
    // Only allow numbers and decimal point
    if (!/^\d*\.?\d*$/.test(value)) return;
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0.2 && numValue <= 100) {
      setLpSize(value);
    } else if (numValue < 0.2 || numValue > 100) {
      // Don't update state if outside range
      return;
    } else {
      setLpSize(value); // Allow partial inputs like "0." or "10."
    }
  };

  const handleAddLiquidity = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = () => {
    console.log("Payment completed for liquidity");
    // Store the added liquidity in session storage and mark token as having liquidity
    sessionStorage.setItem('liquidityAdded', JSON.stringify({
      tokenAddress,
      tokenName,
      tokenSymbol,
      lpSize: parseFloat(lpSize),
      addedAt: Date.now()
    }));
    
    // Update the session token with liquidity info
    const sessionToken = sessionStorage.getItem('sessionToken');
    if (sessionToken) {
      const tokenData = JSON.parse(sessionToken);
      sessionStorage.setItem('sessionToken', JSON.stringify({
        ...tokenData,
        hasLiquidity: true,
        liquidityAmount: parseFloat(lpSize)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div 
              ref={setSectionRef('header')}
              className={`text-center mb-12 transition-all duration-700 ${
                isVisible('header') ? 'animate-fade-in' : 'opacity-100'
              }`}
            >
              <h1 className="text-4xl font-bold mb-4">
                Add <span className="bg-gradient-primary bg-clip-text text-transparent">Liquidity</span>
              </h1>
              <p className="text-muted-foreground">Create the Fuel for your Token.</p>
            </div>

            {/* Liquidity Form */}
            <Card 
              ref={setSectionRef('form')}
              className={`border-border bg-card/30 backdrop-blur-lg shadow-2xl transition-all duration-700 ${
                isVisible('form') ? 'animate-fade-in' : 'opacity-100'
              }`}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Token Address</Label>
                      <Input
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        placeholder="Enter token address"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Token Name</Label>
                      <Input
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        placeholder="Enter token name"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Token Symbol</Label>
                      <Input
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value)}
                        placeholder="Enter token symbol"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Add Supply</Label>
                      <Input
                        value={supply}
                        onChange={(e) => setSupply(e.target.value)}
                        placeholder="Enter supply amount"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>LP Size (SOL)</Label>
                      <Input
                        type="text"
                        value={lpSize}
                        onChange={handleLpSizeChange}
                        placeholder="Enter amount (0.2 - 100 SOL)"
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum: 0.2 SOL • Maximum: 100 SOL
                      </p>
                    </div>
                  </div>

                  {/* Boost Token Visibility */}
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg transition-all duration-200 hover:shadow-lg">
                    <div>
                      <Label>Boost Token Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Increases visibility on DEX token screening websites and aggregators for better discovery (+0.15 SOL)
                      </p>
                    </div>
                    <Switch
                      checked={boostVisibility}
                      onCheckedChange={setBoostVisibility}
                    />
                  </div>

                  {/* Total Price */}
                  <div className="bg-card/50 p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total Price</span>
                      <span className="text-xl font-bold text-primary">
                        {calculateTotalPrice()} SOL
                      </span>
                    </div>
                  </div>

                  {/* Add Liquidity Button */}
                  <Button 
                    onClick={handleAddLiquidity}
                    className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
                    size="lg"
                    disabled={!tokenAddress || !tokenName || !tokenSymbol || !supply || !lpSize}
                  >
                    Add Liquidity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        amount={parseFloat(calculateTotalPrice())}
        onPaymentSuccess={handlePaymentComplete}
        type="liquidity"
      />
    </div>
  );
};

export default Liquidity;