import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { signature, expectedAmount, recipientAddress } = await req.json()

    // Get API key from environment variables (Supabase Secrets)
    const heliusApiKey = Deno.env.get('HELIUS_API_KEY')
    if (!heliusApiKey) {
      throw new Error('HELIUS_API_KEY not configured')
    }

    // Validate input parameters
    if (!signature || !expectedAmount || !recipientAddress) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Verify transaction with Helius API
    const response = await fetch(`https://api.helius.xyz/v0/transactions/?api-key=${heliusApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions: [signature]
      })
    })

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Transaction not found' 
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const transaction = data[0]
    
    // Verify transaction details
    const isConfirmed = transaction.meta && !transaction.meta.err
    const hasCorrectRecipient = transaction.transaction?.message?.accountKeys?.some(
      (key: string) => key === recipientAddress
    )
    
    // Check if transaction amount matches expected amount
    let hasCorrectAmount = false
    if (transaction.meta?.postBalances && transaction.meta?.preBalances) {
      const recipientIndex = transaction.transaction?.message?.accountKeys?.indexOf(recipientAddress)
      if (recipientIndex !== -1) {
        const amountTransferred = (transaction.meta.postBalances[recipientIndex] - transaction.meta.preBalances[recipientIndex]) / 1000000000 // Convert lamports to SOL
        hasCorrectAmount = Math.abs(amountTransferred - expectedAmount) < 0.001 // Allow small precision differences
      }
    }

    const isValid = isConfirmed && hasCorrectRecipient && hasCorrectAmount

    return new Response(
      JSON.stringify({
        success: isValid,
        confirmed: isConfirmed,
        correctRecipient: hasCorrectRecipient,
        correctAmount: hasCorrectAmount,
        details: {
          signature,
          blockTime: transaction.blockTime,
          slot: transaction.slot
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error verifying transaction:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})