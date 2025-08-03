import * as React from "react"
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube, Check } from "lucide-react"

interface WithdrawLiquidityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWithdrawSuccess?: () => void
}

export function WithdrawLiquidityModal({ open, onOpenChange, onWithdrawSuccess }: WithdrawLiquidityModalProps) {
  const [address, setAddress] = React.useState("")
  const [step, setStep] = React.useState<"input"|"sending"|"sent">("input")

  const isValidSolanaAddress = (address: string) => {
    if (!address.trim()) return false;
    // Solana addresses are base58 encoded, typically 32-44 characters long
    // They contain alphanumeric characters excluding 0, O, I, and l to avoid confusion
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

  React.useEffect(() => {
    if (open) {
      setAddress("")
      setStep("input")
    }
  }, [open])

  const handleFakeSend = () => {
    setStep("sending")
    setTimeout(() => {
      setStep("sent")
      setTimeout(() => {
        if (onWithdrawSuccess) onWithdrawSuccess()
        onOpenChange(false)
      }, 1200)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className="p-0 gap-0 bg-[#0F0F23] border border-[#2A2D47] max-w-md rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="p-6 relative">
            {/* Header */}
            <div className="border-b border-[#2A2D47] pb-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
                  </div>
                  <span className="ml-3 text-xl font-bold text-white">SecurePay</span>
                </div>
                <div className="flex items-center gap-2 bg-[#EF4444]/10 px-3 py-1 rounded-full border border-[#EF4444]/20">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#EF4444] font-semibold">WITHDRAW</span>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Withdraw Liquidity</h2>
                <p className="text-[#9CA3AF] text-sm">Please input your Solana address to receive payment</p>
              </div>
            </div>

            {/* Content */}
            {step === "input" && (
              <div className="space-y-6">
                <div className="bg-[#1A1A3A] border border-[#2A2D47] rounded-xl p-5 shadow-lg">
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wide mb-3 block">Your Solana Address</label>
                  <input
                    type="text"
                    className={`w-full p-4 rounded-xl border bg-[#0F0F23] text-white placeholder-[#9CA3AF] text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all duration-200 shadow-inner ${
                      address && !isValidSolanaAddress(address) 
                        ? 'border-[#EF4444]' 
                        : 'border-[#2A2D47]'
                    }`}
                    placeholder="Enter your Solana address..."
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                  {address && !isValidSolanaAddress(address) && (
                    <p className="text-[#EF4444] text-xs mt-2">Invalid Solana address</p>
                  )}
                </div>
                <Button
                  className="w-full py-4 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                  onClick={handleFakeSend}
                  disabled={!isValidSolanaAddress(address)}
                >
                  Withdraw Liquidity
                </Button>
              </div>
            )}

            {step === "sending" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <svg className="animate-spin h-12 w-12 text-[#8B5CF6] mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-lg mb-2">Processing withdrawal...</p>
                  <p className="text-[#9CA3AF] text-sm">Please wait while we process your request</p>
                </div>
              </div>
            )}

            {step === "sent" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-[#22C55E]/20 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Check className="h-8 w-8 text-[#22C55E]" />
                </div>
                <div className="text-center">
                  <p className="text-[#22C55E] font-semibold text-lg mb-2">Withdrawal successful!</p>
                  <p className="text-[#9CA3AF] text-sm">The liquidity has been withdrawn</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}