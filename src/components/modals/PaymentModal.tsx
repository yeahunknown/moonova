import * as React from "react"
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CuboidIcon as Cube, Check, ChevronDown } from "lucide-react"

interface FakePaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount?: number
  onPaymentSuccess?: () => void
}

export function FakePaymentModal({ open, onOpenChange, amount = 0.1, onPaymentSuccess }: FakePaymentModalProps) {
  const [step, setStep] = React.useState<"select"|"payment"|"checking"|"success">("select")
  const [currency, setCurrency] = React.useState("SOL")
  const [network, setNetwork] = React.useState("Solana")
  const [timeLeft, setTimeLeft] = React.useState(300) // 5 minutes
  const [txSignature, setTxSignature] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setStep("select")
      setCurrency("SOL")
      setNetwork("Solana")
      setTimeLeft(300)
      setTxSignature("")
    }
  }, [open])

  React.useEffect(() => {
    if (step === "select" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProceedToPayment = () => {
    setStep("payment")
  }

  const handleCheckTransaction = () => {
    setStep("checking")
    setTimeout(() => {
      setStep("success")
      setTimeout(() => {
        if (onPaymentSuccess) onPaymentSuccess()
        onOpenChange(false)
      }, 1500)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className="p-0 gap-0 bg-[#1e1e1e] border-[#2a2a2a] max-w-md rounded-xl overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cube className="h-6 w-6 text-white" />
                <span className="text-white font-medium">PGPAY</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-full bg-white text-black hover:bg-gray-200 border-0">
                Sign up
              </Button>
            </div>

            {step === "select" && (
              <>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Select currency</h2>
                  <div className="text-xl font-semibold text-white">{amount} SOL</div>
                </div>

                <div className="space-y-4">
                  <div className="text-white font-medium">Select network</div>
                  <div className="text-gray-400 text-sm">You pay network fee</div>
                  
                  <div className="flex items-center justify-between bg-[#252525] rounded-lg p-4">
                    <div className="text-white">Expires in: {formatTime(timeLeft)}</div>
                    <div className="w-8 h-8 rounded-full border-2 border-[#00ff9d] flex items-center justify-center">
                      <div className="w-3 h-3 bg-[#00ff9d] rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Currency</label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="bg-[#252525] border-[#333] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#252525] border-[#333]">
                          <SelectItem value="SOL" className="text-white focus:bg-[#333]">SOL</SelectItem>
                          <SelectItem value="USDC" className="text-white focus:bg-[#333]">USDC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Network</label>
                      <Select value={network} onValueChange={setNetwork}>
                        <SelectTrigger className="bg-[#252525] border-[#333] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#252525] border-[#333]">
                          <SelectItem value="Solana" className="text-white focus:bg-[#333]">Solana</SelectItem>
                          <SelectItem value="Ethereum" className="text-white focus:bg-[#333]">Ethereum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    className="w-full py-4 bg-[#00ff9d] hover:bg-[#00cc7d] text-black font-medium rounded-lg"
                    onClick={handleProceedToPayment}
                  >
                    Proceed to the payment
                  </Button>
                </div>

                <div className="text-center text-gray-400 text-xs space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Encrypted & Secure Payment</span>
                  </div>
                  <div>By continuing, you agree to our Terms and Privacy Policy</div>
                </div>
              </>
            )}

            {step === "payment" && (
              <>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Send exactly</h2>
                  <div className="text-xl font-semibold text-white">{amount} SOL</div>
                </div>

                <div className="space-y-4">
                  <div className="text-white">to this address:</div>
                  <div className="bg-[#252525] rounded-lg p-4">
                    <div className="text-gray-300 text-sm font-mono break-all">
                      9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Paste your transaction signature</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg bg-[#252525] text-white border border-[#333] placeholder-gray-500"
                      placeholder="Transaction signature"
                      value={txSignature}
                      onChange={e => setTxSignature(e.target.value)}
                    />
                  </div>

                  <Button
                    className="w-full py-4 bg-[#00ff9d] hover:bg-[#00cc7d] text-black font-medium rounded-lg"
                    onClick={handleCheckTransaction}
                    disabled={!txSignature.trim()}
                  >
                    Check Transaction
                  </Button>
                </div>
              </>
            )}

            {step === "checking" && (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-[#00ff9d] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span className="text-white">Checking transaction...</span>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center justify-center py-12">
                <Check className="h-8 w-8 text-green-400 mb-4" />
                <span className="text-green-400 font-bold">Transaction verified!</span>
              </div>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default FakePaymentModal