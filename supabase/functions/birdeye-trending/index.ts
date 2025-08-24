import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching top 10 trending tokens from Apify Task...');
    
    // Get environment variables from Supabase secrets
    const APIFY_TASK_ID = Deno.env.get('APIFY_TASK_ID');
    const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN');
    
    // Check if required environment variables are available
    if (!APIFY_TASK_ID || !APIFY_TOKEN) {
      console.error('Missing APIFY environment variables');
      return new Response(JSON.stringify({ 
        error: 'Missing APIFY_TASK_ID or APIFY_TOKEN'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`Using Apify Task: ${APIFY_TASK_ID}`);
    
    // POST to Apify run-sync-get-dataset-items endpoint
    const apifyUrl = `https://api.apify.com/v2/actor-tasks/${encodeURIComponent(APIFY_TASK_ID)}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&format=json&clean=1`;
    
    const apifyResponse = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blockchain: 'solana',
        timeframe: '24h',
        filter: '?rankBy=trendingScoreH24&order=desc',
        fromPage: 1,
        toPage: 1
      })
    });
    
    console.log(`Apify response status: ${apifyResponse.status}`);
    
    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text();
      console.error('Apify API error:', errorText);
      return new Response(JSON.stringify({ 
        error: `${apifyResponse.status}: ${errorText}`
      }), {
        status: apifyResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const apifyData = await apifyResponse.json();
    console.log('Apify API response received, processing data...');
    
    // Parse and transform the Apify data to our normalized token format
    let tokens = [];
    
    if (Array.isArray(apifyData)) {
      tokens = apifyData.slice(0, 10).map((item: any) => ({
        name: item.name || item.tokenName || item.baseToken?.name || "",
        symbol: item.symbol || item.tokenSymbol || item.baseToken?.symbol || "", 
        image: item.image || item.logo || item.info?.imageUrl || item.baseToken?.logo || null,
        description: item.info?.description || item.description || "",
        address: item.address || item.tokenAddress || item.baseToken?.address || item.info?.address || "",
        website: item.info?.websites?.[0] || item.websites?.[0] || null,
        twitter: item.info?.socials?.twitter || item.socials?.twitter || null,
        telegram: item.info?.socials?.telegram || item.socials?.telegram || null,
        dexUrl: item.url || item.dexUrl || item.info?.url || null
      }));
    } else if (apifyData && typeof apifyData === 'object') {
      // Handle single object or nested structure
      const dataArray = apifyData.items || apifyData.tokens || apifyData.results || apifyData.data || [apifyData];
      tokens = dataArray.slice(0, 10).map((item: any) => ({
        name: item.name || item.tokenName || item.baseToken?.name || "",
        symbol: item.symbol || item.tokenSymbol || item.baseToken?.symbol || "",
        image: item.image || item.logo || item.info?.imageUrl || item.baseToken?.logo || null,
        description: item.info?.description || item.description || "",
        address: item.address || item.tokenAddress || item.baseToken?.address || item.info?.address || "",
        website: item.info?.websites?.[0] || item.websites?.[0] || null,
        twitter: item.info?.socials?.twitter || item.socials?.twitter || null,
        telegram: item.info?.socials?.telegram || item.socials?.telegram || null,
        dexUrl: item.url || item.dexUrl || item.info?.url || null
      }));
    }
    
    // Fallback if no data received
    if (!tokens || tokens.length === 0) {
      console.log('No tokens received from Apify, providing fallback data');
      tokens = [
        {
          name: "Solana",
          symbol: "SOL", 
          image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          description: "Fast, decentralized blockchain built for scale",
          address: "So11111111111111111111111111111111111111112",
          website: "https://solana.com",
          twitter: "https://twitter.com/solana",
          telegram: "https://t.me/solana",
          dexUrl: null
        }
      ];
    }
    
    // Take only the first 10 tokens 
    const limitedTokens = tokens.slice(0, 10);
    
    console.log(`Successfully processed ${limitedTokens.length} trending tokens`);
    
    return new Response(JSON.stringify(limitedTokens), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      },
    });
    
  } catch (error) {
    console.error('Error in trending function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch trending tokens'
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});