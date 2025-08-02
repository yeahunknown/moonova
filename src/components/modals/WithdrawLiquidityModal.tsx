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
        <DialogContent className="p-0 gap-0 bg-[#1e1e1e] border-[#2a2a2a] max-w-md rounded-xl overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="border-b border-[#2a2a2a] pb-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <svg width="120" height="30" viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="50" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontSize="48" fontWeight="600" letterSpacing="1" fill="white">Paygrid</text>
                    <rect x="0" y="58" width="140" height="4" fill="white" rx="2"/>
                  </svg>
                </div>
                <Button variant="outline" size="sm" className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300 text-xs px-3 py-1">
                  Sign up
                </Button>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-1">Send Payment</h2>
                <p className="text-gray-400 text-sm">Please input your Solana address to receive payment</p>
              </div>
            </div>

            {/* Content */}
            {step === "input" && (
              <div className="space-y-4">
                <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-4">
                  <label className="text-gray-300 text-sm font-medium mb-3 block">Your Solana Address</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded border border-[#2a2a2a] bg-[#1a1a1a] text-white placeholder-gray-500 text-sm"
                    placeholder="Enter your Solana address..."
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full py-4 bg-[#00ff9d] hover:bg-[#00cc7d] text-black font-medium text-base"
                  onClick={handleFakeSend}
                  disabled={!address.trim()}
                >
                  Send Payment
                </Button>
              </div>
            )}

            {step === "sending" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <svg className="animate-spin h-12 w-12 text-[#00ff9d] mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium mb-1">Processing payment...</p>
                  <p className="text-gray-400 text-sm">Please wait while we process your request</p>
                </div>
              </div>
            )}

            {step === "sent" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-semibold text-lg mb-1">Payment sent successfully!</p>
                  <p className="text-gray-400 text-sm">The payment has been processed</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}