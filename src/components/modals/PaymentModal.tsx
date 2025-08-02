import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCost: string;
  onPaymentComplete: () => void;
}

const PaymentModal = ({ isOpen, onClose, totalCost, onPaymentComplete }: PaymentModalProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState("SOL");
  const [selectedNetwork, setSelectedNetwork] = useState("Solana");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      onPaymentComplete();
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <Card className="border-none shadow-none">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Complete Payment</h2>
              <p className="text-muted-foreground">Finalize your token creation</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Currency</label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOL">SOL - Solana</SelectItem>
                    <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                    <SelectItem value="USDT">USDT - Tether</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Network</label>
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solana">Solana</SelectItem>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="BSC">Binance Smart Chain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="font-semibold">{totalCost} {selectedCurrency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Network Fee</span>
                  <span className="text-sm">~0.000005 {selectedCurrency}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Expires in {formatTime(timeLeft)}</span>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              Proceed to Payment
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By proceeding, you agree to our terms of service and privacy policy.
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;