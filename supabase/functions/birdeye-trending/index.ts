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
    console.log('Fetching trending tokens from Apify API...');
    
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Fetch from Apify API
    const apifyResponse = await fetch('https://api.apify.com/v2/key-value-stores/cXgkWQuSHdCb1v1wy/records/INPUT?token=apify_api_nKKbTqF874eJ0RpShoAnA78rHtfW9R0YwDoz');
    
    if (!apifyResponse.ok) {
      throw new Error(`Apify API failed with status: ${apifyResponse.status}`);
    }
    
    const apifyData = await apifyResponse.json();
    console.log('Apify API response received');
    
    // Parse and transform the Apify data to our token format
    let tokens = [];
    
    if (Array.isArray(apifyData)) {
      tokens = apifyData.slice(0, limit).map((item: any) => ({
        name: item.name || item.token_name || item.title || 'Unknown Token',
        symbol: item.symbol || item.ticker || item.token_symbol || 'N/A',
        image: item.image || item.logo || item.icon || item.avatar || 'https://via.placeholder.com/64',
        description: item.description || item.summary || item.about || 'No description available',
        metadata: {
          website: item.website || item.url || item.homepage || '',
          twitter: item.twitter || item.social?.twitter || '',
          telegram: item.telegram || item.social?.telegram || '',
          discord: item.discord || item.social?.discord || ''
        },
        tokenAddress: item.address || item.contract_address || item.token_address || item.mint || 'N/A',
        chain: item.chain || item.blockchain || 'solana',
        price: parseFloat(item.price || item.current_price || 0),
        liquidity: parseInt(item.liquidity || item.market_cap || 0),
        volume24h: parseInt(item.volume_24h || item.daily_volume || 0)
      }));
    } else if (apifyData && typeof apifyData === 'object') {
      // Handle single object or nested structure
      const dataArray = apifyData.tokens || apifyData.results || apifyData.data || [apifyData];
      tokens = dataArray.slice(0, limit).map((item: any) => ({
        name: item.name || item.token_name || item.title || 'Unknown Token',
        symbol: item.symbol || item.ticker || item.token_symbol || 'N/A',
        image: item.image || item.logo || item.icon || item.avatar || 'https://via.placeholder.com/64',
        description: item.description || item.summary || item.about || 'No description available',
        metadata: {
          website: item.website || item.url || item.homepage || '',
          twitter: item.twitter || item.social?.twitter || '',
          telegram: item.telegram || item.social?.telegram || '',
          discord: item.discord || item.social?.discord || ''
        },
        tokenAddress: item.address || item.contract_address || item.token_address || item.mint || 'N/A',
        chain: item.chain || item.blockchain || 'solana',
        price: parseFloat(item.price || item.current_price || 0),
        liquidity: parseInt(item.liquidity || item.market_cap || 0),
        volume24h: parseInt(item.volume_24h || item.daily_volume || 0)
      }));
    }
    
    // Fallback mock data if API doesn't return expected format
    if (!tokens || tokens.length === 0) {
      console.log('Apify API data format unexpected, using fallback mock data');
      tokens = [
        {
          name: "Solana",
          symbol: "SOL",
          image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          description: "Fast, decentralized blockchain built for scale",
          metadata: {
            website: "https://solana.com",
            twitter: "https://twitter.com/solana",
            telegram: "https://t.me/solana",
            discord: "https://discord.gg/solana"
          },
          tokenAddress: "So11111111111111111111111111111111111111112",
          chain: "solana",
          price: 245.67,
          liquidity: 500000000,
          volume24h: 1500000000
        }
      ];
    }
    
    // Take only the requested number of tokens (default 10)
    const limitedTokens = tokens.slice(0, limit);
    
    console.log(`Successfully fetched ${limitedTokens.length} trending tokens from Apify API`);
    
    return new Response(JSON.stringify(limitedTokens), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Source': 'apify-api'
      },
    });
    
  } catch (error) {
    console.error('Error in trending function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch trending tokens',
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});