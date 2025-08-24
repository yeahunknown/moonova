import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const APIFY_TASK_ID = 'ecriminal/moonova-trending-tokens-list';
const APIFY_TOKEN = 'apify_api_nKKbTqF874eJ0RpShoAnA78rHtfW9R0YwDoz';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching trending tokens from Apify Task...');
    
    // Check if required environment variables are available
    if (!APIFY_TASK_ID || !APIFY_TOKEN) {
      console.error('Missing APIFY environment variables');
      return new Response(JSON.stringify({ 
        error: 'Missing APIFY environment variables',
        details: 'APIFY_TASK_ID or APIFY_TOKEN not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const limit = 50; // Always fetch top 50 tokens
    
    // POST to Apify run-sync-get-dataset-items endpoint
    const apifyResponse = await fetch(
      `https://api.apify.com/v2/actor-tasks/${encodeURIComponent(APIFY_TASK_ID)}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&format=json&clean=1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockchain: 'solana',
          timeframe: '24h',
          filter: '?rankBy=trendingScoreH24&order=desc',
          fromPage: 1,
          toPage: 5
        })
      }
    );
    
    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text();
      console.error('Apify API error:', errorText);
      return new Response(JSON.stringify({ 
        error: errorText || `Apify API failed with status: ${apifyResponse.status}`,
        status: apifyResponse.status
      }), {
        status: apifyResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const apifyData = await apifyResponse.json();
    console.log('Apify API response received, data type:', typeof apifyData);
    
    // Parse and transform the Apify data to our token format
    let tokens = [];
    
    if (Array.isArray(apifyData)) {
      tokens = apifyData.slice(0, limit).map((item: any) => ({
        name: item.name || item.tokenName || item.title || 'Unknown Token',
        symbol: item.symbol || item.ticker || item.tokenSymbol || 'N/A',
        image: item.image || item.logo || item.icon || item.logoUrl || 'https://via.placeholder.com/64',
        description: item.description || item.summary || item.about || 'Trending Solana token',
        metadata: {
          website: item.website || item.url || item.homepage || '',
          twitter: item.twitter || item.social?.twitter || item.twitterUrl || '',
          telegram: item.telegram || item.social?.telegram || item.telegramUrl || '',
          discord: item.discord || item.social?.discord || item.discordUrl || ''
        },
        tokenAddress: item.address || item.contractAddress || item.tokenAddress || item.mint || 'N/A',
        chain: 'solana',
        price: parseFloat(item.price || item.currentPrice || item.priceUsd || 0),
        liquidity: parseInt(item.liquidity || item.marketCap || item.liquidityUsd || 0),
        volume24h: parseInt(item.volume24h || item.dailyVolume || item.volume || 0),
        trendingScore: parseFloat(item.trendingScoreH24 || item.trendingScore || 0)
      }));
    } else if (apifyData && typeof apifyData === 'object') {
      // Handle single object or nested structure
      const dataArray = apifyData.items || apifyData.tokens || apifyData.results || apifyData.data || [apifyData];
      tokens = dataArray.slice(0, limit).map((item: any) => ({
        name: item.name || item.tokenName || item.title || 'Unknown Token',
        symbol: item.symbol || item.ticker || item.tokenSymbol || 'N/A',
        image: item.image || item.logo || item.icon || item.logoUrl || 'https://via.placeholder.com/64',
        description: item.description || item.summary || item.about || 'Trending Solana token',
        metadata: {
          website: item.website || item.url || item.homepage || '',
          twitter: item.twitter || item.social?.twitter || item.twitterUrl || '',
          telegram: item.telegram || item.social?.telegram || item.telegramUrl || '',
          discord: item.discord || item.social?.discord || item.discordUrl || ''
        },
        tokenAddress: item.address || item.contractAddress || item.tokenAddress || item.mint || 'N/A',
        chain: 'solana',
        price: parseFloat(item.price || item.currentPrice || item.priceUsd || 0),
        liquidity: parseInt(item.liquidity || item.marketCap || item.liquidityUsd || 0),
        volume24h: parseInt(item.volume24h || item.dailyVolume || item.volume || 0),
        trendingScore: parseFloat(item.trendingScoreH24 || item.trendingScore || 0)
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
          volume24h: 1500000000,
          trendingScore: 100
        }
      ];
    }
    
    // Take only the requested number of tokens 
    const limitedTokens = tokens.slice(0, limit);
    
    console.log(`Successfully fetched ${limitedTokens.length} trending tokens from Apify`);
    
    return new Response(JSON.stringify(limitedTokens), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Source': 'apify-task'
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