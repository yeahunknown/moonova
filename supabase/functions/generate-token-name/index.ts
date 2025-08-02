import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt = "Generate a creative cryptocurrency token name" } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a cryptocurrency token name generator. Generate creative, memorable token names with their symbols. 
            
            Rules:
            - Token names should be 2-24 characters, letters and spaces only
            - Symbols should be 2-12 characters, letters only (uppercase)
            - Make them catchy, memorable, and crypto-themed
            - Avoid existing major cryptocurrency names
            - Be creative but professional
            
            Return ONLY a JSON object with this exact format:
            {"name": "Moon Rocket", "symbol": "MOON"}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 100,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content generated')
    }

    // Parse the JSON response
    const tokenData = JSON.parse(content.trim())
    
    // Validate the response format
    if (!tokenData.name || !tokenData.symbol) {
      throw new Error('Invalid response format')
    }

    return new Response(
      JSON.stringify(tokenData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate token name',
        fallback: {
          name: "Crypto Star",
          symbol: "STAR"
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})