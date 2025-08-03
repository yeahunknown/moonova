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
            content: `You are a MEMECOIN token name generator. Generate INSANELY creative, viral-worthy, memey token names that would absolutely MOON on crypto Twitter. 
            
            Rules:
            - Token names should be 2-24 characters, letters and spaces only
            - Symbols should be 2-12 characters, letters only (uppercase)
            - Make them VIRAL MEMEY content - think Pepe, Wojak, Chad, Based, Sigma level memes
            - Reference internet culture, gaming, anime, popular slang, crypto degeneracy
            - Be creative, funny, and memeable - stuff that would get reposted everywhere
            - Examples: "Gigachad Inu", "Wojak Moon", "Based Doge", "Sigma Grindset", "Touch Grass", "Wen Lambo", "Diamond Paws", "Paper Hands", "Cope Harder", "Monkey JPEG", "Number Go Up", "Degen Mode", "Fren Coin", "Honk Honk", "Rare Pepe"
            - Avoid boring generic crypto names like "Stellar Fire" or "Crypto Star"
            
            Be UNIQUE each time - generate completely different names on every request. Make it MEMEY and VIRAL.
            
            Return ONLY a JSON object with this exact format:
            {"name": "Gigachad Inu", "symbol": "CHAD"}`
          },
          {
            role: 'user',
            content: `${prompt}. Make this absolutely MEMEY and viral-worthy. Generate something completely unique that hasn't been used before. Think crypto Twitter degeneracy meets internet meme culture.`
          }
        ],
        temperature: 1.2,
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