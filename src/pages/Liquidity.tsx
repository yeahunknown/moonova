import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FakePaymentModal } from "@/components/modals/PaymentModal";

const Liquidity = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [lpSize, setLpSize] = useState("");
  const [boostVisibility, setBoostVisibility] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(lpSize) || 0;
    const boostPrice = boostVisibility ? 0.15 : 0;
    return (basePrice + boostPrice).toFixed(2);
  };

  const handleLpSizeChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0.2 && numValue <= 100) {
      setLpSize(value);
    }
  };

  const handleAddLiquidity = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = () => {
    console.log("Liquidity added successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Add <span className="bg-gradient-primary bg-clip-text text-transparent">Liquidity</span>
              </h1>
              <p className="text-muted-foreground">Create liquidity pools for your tokens</p>
            </div>

            {/* Liquidity Form */}
            <Card className="border-border bg-card/30 backdrop-blur-lg shadow-2xl">
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
                      <Label>Choose LP Size</Label>
                      <Select value={lpSize} onValueChange={handleLpSizeChange}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select LP size (0.2 - 100 SOL)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.2">0.2 SOL</SelectItem>
                          <SelectItem value="0.5">0.5 SOL</SelectItem>
                          <SelectItem value="1.0">1.0 SOL</SelectItem>
                          <SelectItem value="2.0">2.0 SOL</SelectItem>
                          <SelectItem value="5.0">5.0 SOL</SelectItem>
                          <SelectItem value="10.0">10.0 SOL</SelectItem>
                          <SelectItem value="25.0">25.0 SOL</SelectItem>
                          <SelectItem value="50.0">50.0 SOL</SelectItem>
                          <SelectItem value="100.0">100.0 SOL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Boost Token Visibility */}
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg transition-all duration-200 hover:shadow-lg">
                    <div>
                      <Label>Boost Token Visibility</Label>
                      <p className="text-sm text-muted-foreground">+0.15 SOL</p>
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
      <FakePaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        amount={parseFloat(calculateTotalPrice())}
        onPaymentSuccess={handlePaymentComplete}
      />
    </div>
  );
};

export default Liquidity;