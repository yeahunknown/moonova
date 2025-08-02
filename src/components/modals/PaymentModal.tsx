import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Copy } from "lucide-react";

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
  const [step, setStep] = useState(1); // 1: initial, 2: payment details
  const [transactionSignature, setTransactionSignature] = useState("");

  const walletAddress = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setTransactionSignature("");
      return;
    }
    
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

  const handleProceedToPayment = () => {
    setStep(2);
  };

  const handleCheckTransaction = () => {
    // Simulate transaction verification
    setTimeout(() => {
      onPaymentComplete();
      onClose();
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <Card className="border-none shadow-none">
          <CardContent className="p-6 space-y-6">
            {step === 1 ? (
              <>
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Currency</label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger className="bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOL">SOL</SelectItem>
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expires in {formatTime(timeLeft)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Proceed to the payment
                </Button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Send Payment</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-card/50 p-4 rounded-lg border border-border">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Amount to send</div>
                      <div className="text-2xl font-bold">{totalCost} SOL</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Send to this address</label>
                    <div className="flex">
                      <Input
                        value={walletAddress}
                        readOnly
                        className="bg-card border-border font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => copyToClipboard(walletAddress)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Paste transaction signature</label>
                    <Input
                      value={transactionSignature}
                      onChange={(e) => setTransactionSignature(e.target.value)}
                      placeholder="Enter transaction signature"
                      className="bg-card border-border"
                    />
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expires in {formatTime(timeLeft)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckTransaction}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={!transactionSignature}
                >
                  Check Transaction
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;