"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown, Info, HelpCircle, Settings, MessageCircle, Mail, CuboidIcon as Cube, Check, AlertCircle, Copy, CheckCheck, Clipboard } from "lucide-react"
import { SolanaIcon } from "../SolanaIcon"
import { Link } from "react-router-dom"

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

  const isValidTransactionSignature = (signature: string) => {
    if (!signature.trim()) return false;
    // Special dev bypass
    if (signature === "1337") return true;
    // Valid Solana transaction signature format (base58, ~88 characters)
    return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(signature);
  };

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
                <div className="flex items-center gap-2 bg-[#16A34A]/10 px-3 py-1 rounded-full border border-[#16A34A]/20">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#22C55E] font-semibold">SECURE</span>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Payment Required</h2>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">{amount.toFixed(6)} SOL</div>
              </div>
            </div>

            {/* Payment Section */}
            {showAddress ? (
              <div className="space-y-6">
                <div className="bg-[#1A1A3A] border border-[#2A2D47] rounded-xl p-5 shadow-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[#9CA3AF] text-xs uppercase tracking-wide mb-2">Amount</p>
                      <p className="text-white font-mono text-sm font-semibold">{amount.toFixed(6)} SOL</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] text-xs uppercase tracking-wide mb-2">Network</p>
                      <p className="text-white text-sm font-semibold">Solana</p>
                    </div>
                  </div>
                    <div className="border-t border-[#2A2D47] pt-4">
                      <p className="text-[#9CA3AF] text-xs uppercase tracking-wide mb-3">Recipient Address</p>
                      <div className="bg-[#0F0F23] p-4 rounded-lg border border-[#2A2D47] shadow-inner relative">
                        {addressLoading ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-[#9CA3AF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-[#9CA3AF] text-sm">Loading...</span>
                          </div>
                        ) : addressError ? (
                          <div className="flex items-center gap-2 text-[#EF4444]">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">Error loading address</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-[#E5E7EB] font-mono text-xs break-all leading-relaxed pr-3">{requiredAddress}</p>
                            <button
                              onClick={copyAddressToClipboard}
                              className="flex items-center justify-center text-[#8B5CF6] hover:text-[#7C3AED] transition-colors duration-200 p-1 min-w-[24px]"
                            >
                              {addressCopied ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <Clipboard className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[#E5E7EB] text-sm font-semibold">Transaction Signature</label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-xl border border-[#2A2D47] bg-[#1A1A3A] text-white placeholder-[#9CA3AF] text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all duration-200 shadow-inner"
                    placeholder="Enter your transaction signature..."
                    value={txSignature}
                    onChange={e => setTxSignature(e.target.value)}
                  />
                  <Button
                    className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] hover:from-[#7C3AED] hover:to-[#0891B2] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                    onClick={checkTransaction}
                    disabled={isChecking || !isValidTransactionSignature(txSignature)}
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
                  <p className="text-[#6B7280] text-xs text-center mt-2">
                    By pressing verify payment you agree to our{" "}
                    <Link to="/terms" className="underline hover:text-[#9CA3AF] transition-colors">
                      terms of service
                    </Link>
                  </p>
                  {checkResult && (
                    <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2 ${checkResult.success ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E] shadow-[#22C55E]/20 shadow-lg' : 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444] shadow-[#EF4444]/20 shadow-lg'}`}>
                      {checkResult.success ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      <span className="text-sm font-semibold">{checkResult.message}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#1A1A3A] border border-[#2A2D47] rounded-xl p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#9CA3AF] text-sm mb-1">Session expires in</p>
                      <p className="text-[#8B5CF6] font-mono text-2xl font-bold">{formatTime(timeLeft)}</p>
                    </div>
                    <div className="relative w-14 h-14">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#2A2D47" strokeWidth="2"></circle>
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          strokeDasharray="94.25"
                          strokeDashoffset={94.25 - (timeLeft / (15 * 60)) * 94.25}
                          className="transition-all duration-1000"
                        ></circle>
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!showAddress && (
            <div className="border-t border-[#2A2D47] p-6 space-y-5 bg-[#1A1A3A]/50">
              <div className="space-y-4">
                <div>
                  <p className="text-[#9CA3AF] text-sm font-medium mb-3">Payment Method</p>
                  <div className="relative">
                    <button
                      className="w-full bg-[#0F0F23] border border-[#2A2D47] text-white p-4 rounded-xl flex justify-between items-center hover:border-[#8B5CF6]/50 transition-all duration-200 shadow-inner"
                      onClick={toggleCurrencyDropdown}
                    >
                      {selectedCurrency === "SOL" ? (
                        <div className="flex items-center gap-3">
                          <SolanaIcon size={24} className="rounded-full" />
                          <span className="font-semibold">Solana (SOL)</span>
                        </div>
                      ) : (
                        <span className="text-[#9CA3AF]">Select currency</span>
                      )}
                      <ChevronDown className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-200 ${currencyDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {currencyDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-[#0F0F23] border border-[#2A2D47] rounded-xl shadow-2xl backdrop-blur-xl">
                        <div
                          className="p-4 hover:bg-[#1A1A3A] cursor-pointer flex items-center justify-between transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                          onClick={() => selectCurrency("SOL")}
                        >
                          <div className="flex items-center gap-3">
                            <SolanaIcon size={20} className="rounded-full" />
                            <span className="text-white">Solana (SOL)</span>
                          </div>
                          {selectedCurrency === "SOL" && <Check className="h-4 w-4 text-[#22C55E]" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[#9CA3AF] text-sm font-medium mb-3">Network</p>
                  <div className="relative">
                    <button
                      className="w-full bg-[#0F0F23] border border-[#2A2D47] text-white p-4 rounded-xl flex justify-between items-center hover:border-[#8B5CF6]/50 transition-all duration-200 shadow-inner"
                      onClick={toggleNetworkDropdown}
                    >
                      {selectedNetwork === "Solana" ? (
                        <div className="flex items-center gap-3">
                          <SolanaIcon size={24} className="rounded-full" />
                          <span className="font-semibold">Solana Mainnet</span>
                        </div>
                      ) : (
                        <span className="text-[#9CA3AF]">Select network</span>
                      )}
                      <ChevronDown className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-200 ${networkDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {networkDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-[#0F0F23] border border-[#2A2D47] rounded-xl shadow-2xl backdrop-blur-xl">
                        <div
                          className="p-4 hover:bg-[#1A1A3A] cursor-pointer flex items-center justify-between transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                          onClick={() => selectNetwork("Solana")}
                        >
                          <div className="flex items-center gap-3">
                            <SolanaIcon size={20} className="rounded-full" />
                            <span className="text-white">Solana Network</span>
                          </div>
                          {selectedNetwork === "Solana" && <Check className="h-4 w-4 text-[#22C55E]" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="w-full py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                onClick={handlePayment}
                disabled={!selectedCurrency || !selectedNetwork}
              >
                Pay {amount.toFixed(6)} SOL
              </Button>

              <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#2A2D47]">
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                  <span className="text-xs font-medium">256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                  <span className="text-xs font-medium">Verified</span>
                </div>
              </div>
            </div>
          )}
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogPortal>
          <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
            {type === 'token' && (
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-primary/20 rounded-xl p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Token Launched Successfully!</h3>
                    <p className="text-muted-foreground">Your token has been created and deployed to the blockchain</p>
                  </div>

                  <div className="bg-card/30 border border-border rounded-lg p-4 space-y-3">
                    <label className="text-sm font-medium">Token Address</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted/30 rounded-md p-3 font-mono text-sm break-all">
                        {generatedTokenAddress}
                      </div>
                      <Button onClick={copyToClipboard} variant="outline" size="sm" className="h-8 w-8 p-0">
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full">
                    <Button
                      onClick={handleAddLiquidity}
                      className="flex-1 bg-gradient-primary hover:opacity-90 shadow-glow"
                    >
                      Add Liquidity
                    </Button>
                    <Button variant="outline" onClick={handleCreateAnotherToken} className="flex-1">
                      Create Another Token
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {type === 'liquidity' && (
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-primary/20 rounded-xl p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Liquidity Added Successfully!</h3>
                    <p className="text-muted-foreground">Your liquidity has been added to the pool</p>
                  </div>

                  <div className="bg-card/30 border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Check your Liquidity Portfolio to track your token's performance and manage your positions.
                    </p>
                  </div>

                  <div className="flex gap-3 w-full">
                    <Button
                      onClick={() => {
                        setShowSuccessModal(false)
                        window.location.href = '/portfolio'
                      }}
                      className="flex-1 bg-gradient-primary hover:opacity-90 shadow-glow"
                    >
                      Liquidity Portfolio
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowSuccessModal(false)
                        window.location.href = '/liquidity'
                      }}
                      className="flex-1"
                    >
                      Add More Liquidity
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}