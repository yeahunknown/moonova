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

  const normalized = (data || []).slice(0, 10).map((item: any) => ({
    name: item.name || item.tokenName || item.baseToken?.name || "",
    symbol: item.symbol || item.tokenSymbol || item.baseToken?.symbol || "",
    image: item.image || item.logo || item.info?.imageUrl || item.baseToken?.logo || null,
    description: item.info?.description || item.description || "",
    address: item.address || item.tokenAddress || item.baseToken?.address || item.info?.address || "",
    website: item.info?.websites?.[0] || item.websites?.[0] || null,
    twitter: item.info?.socials?.twitter || item.socials?.twitter || null,
    telegram: item.info?.socials?.telegram || item.socials?.telegram || null,
    dexUrl: item.url || item.dexUrl || item.info?.url || null,
  }))

  return new Response(JSON.stringify(normalized), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  })
})