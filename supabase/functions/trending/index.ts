import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const APIFY_TOKEN = Deno.env.get("APIFY_TOKEN")
  const APIFY_TASK_ID = Deno.env.get("APIFY_TASK_ID")

  if (!APIFY_TOKEN || !APIFY_TASK_ID) {
    return new Response(JSON.stringify({ error: "Missing APIFY_TOKEN or APIFY_TASK_ID" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  }

  const url = `https://api.apify.com/v2/actor-tasks/${encodeURIComponent(APIFY_TASK_ID)}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&format=json&clean=1`

  const input = {
    blockchain: "solana",
    timeframe: "24h",
    filter: "?rankBy=trendingScoreH24&order=desc",
    fromPage: 1,
    toPage: 1,
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const text = await res.text()
    return new Response(JSON.stringify({ error: `${res.status}: ${text}` }), {
      status: res.status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  }

const data = await res.json()

const normalized = (data || []).slice(0, 10).map((item: any) => {
  // Normalize name - never empty
  let name = (item.name || item.tokenName || item.baseToken?.name || "").trim()
  if (!name) {
    name = item.symbol || item.tokenSymbol || item.baseToken?.symbol || "Unknown"
  }
  
  // Normalize symbol - never empty
  let symbol = (item.symbol || item.tokenSymbol || item.baseToken?.symbol || "").trim()
  if (!symbol) {
    // Derive from name - take first letters
    symbol = name.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || "TOKEN"
  }
  
  // Normalize image - never null, always has fallback
  let image = item.image || item.logo || item.info?.imageUrl || item.baseToken?.logo || ""
  if (!image) {
    // Generate placeholder using initials
    image = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(symbol || name)}`
  }
  
  // Normalize description - never empty
  let description = (item.info?.description || item.description || "").trim()
  if (!description) {
    description = "Trending on Dexscreener (24h). Prefilled via Moonova."
  }
  // Truncate extremely long descriptions
  if (description.length > 600) {
    description = description.substring(0, 600) + "..."
  }
  
  // Normalize other fields
  const address = (item.address || item.tokenAddress || item.baseToken?.address || item.info?.address || "").trim()
  const website = (item.info?.websites?.[0] || item.websites?.[0] || "").trim() || null
  const twitter = (item.info?.socials?.twitter || item.socials?.twitter || "").trim() || null
  const telegram = (item.info?.socials?.telegram || item.socials?.telegram || "").trim() || null
  const dexUrl = (item.url || item.dexUrl || item.info?.url || "").trim() || null
  
  return {
    name,
    symbol,
    image,
    description,
    address,
    website,
    twitter,
    telegram,
    dexUrl,
  }
})

  return new Response(JSON.stringify(normalized), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  })
})