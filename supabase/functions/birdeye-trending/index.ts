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
    
    // Use the provided Apify API endpoint
    const apifyUrl = 'https://api.apify.com/v2/actor-runs/iTTwDgQmiWSFaHwfV?token=apify_api_nKKbTqF874eJ0RpShoAnA78rHtfW9R0YwDoz';
    
    console.log('Calling Apify API:', apifyUrl);
    
    let response;
    let data;
    
    try {
      response = await fetch(apifyUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; Trending-Bot/1.0)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Apify API error: ${response.status} ${response.statusText}`);
      }
      
      data = await response.json();
      console.log('Apify API response status:', response.status);
      console.log('Apify API response structure:', JSON.stringify(data, null, 2).slice(0, 2000));
      
    } catch (fetchError) {
      console.error('Network error calling Apify API:', fetchError);
      throw new Error(`Failed to connect to Apify API: ${fetchError.message}`);
    }
    
    // Extract and normalize tokens from Apify response
    const normalizedTokens: any[] = [];
    
    // Handle different possible response structures from Apify
    let tokenList: any[] = [];
    
    if (data.data && Array.isArray(data.data)) {
      tokenList = data.data;
    } else if (data.items && Array.isArray(data.items)) {
      tokenList = data.items;
    } else if (data.results && Array.isArray(data.results)) {
      tokenList = data.results;
    } else if (data.tokens && Array.isArray(data.tokens)) {
      tokenList = data.tokens;
    } else if (Array.isArray(data)) {
      tokenList = data;
    } else {
      console.error('Unexpected Apify response structure:', data);
      throw new Error('Invalid API response format from Apify');
    }
    
    console.log(`Processing ${tokenList.length} tokens from Apify API...`);
    
    for (const item of tokenList) {
      // Skip tokens without basic info
      if (!item.symbol && !item.name && !item.address && !item.tokenAddress) {
        continue;
      }
      
      // Stop when we have enough tokens (limit to 10)
      if (normalizedTokens.length >= limit) {
        break;
      }
      
      
      // Extract metadata safely from various possible field structures
      const extractMetadata = () => {
        const metadata = {
          website: "",
          twitter: "",
          telegram: "",
          discord: ""
        };
        
        // Handle various metadata structures from Apify
        const extensions = item.extensions || item.info || item.metadata || {};
        const links = item.links || item.socialLinks || item.urls || [];
        
        // Website
        if (extensions.website) {
          metadata.website = extensions.website;
        } else if (item.website) {
          metadata.website = item.website;
        } else if (extensions.websites && Array.isArray(extensions.websites) && extensions.websites.length > 0) {
          metadata.website = extensions.websites[0];
        }
        
        // Social links - handle arrays or objects
        const socials = extensions.socials || extensions.social || links || [];
        if (Array.isArray(socials)) {
          for (const social of socials) {
            const type = (social.type || social.platform || social.name || '').toLowerCase();
            const url = social.url || social.link || social.href || '';
            
            if (type.includes('twitter') || type.includes('x')) {
              metadata.twitter = url;
            } else if (type.includes('telegram')) {
              metadata.telegram = url;
            } else if (type.includes('discord')) {
              metadata.discord = url;
            }
          }
        }
        
        // Handle direct social properties
        if (extensions.twitter || item.twitter) {
          const twitterHandle = extensions.twitter || item.twitter;
          metadata.twitter = twitterHandle.startsWith('http') 
            ? twitterHandle 
            : `https://twitter.com/${twitterHandle.replace('@', '')}`;
        }
        if (extensions.telegram || item.telegram) {
          const telegramHandle = extensions.telegram || item.telegram;
          metadata.telegram = telegramHandle.startsWith('http') 
            ? telegramHandle 
            : `https://t.me/${telegramHandle}`;
        }
        if (extensions.discord || item.discord) {
          metadata.discord = extensions.discord || item.discord;
        }
        
        return metadata;
      };
      
      // Normalize token data - handle multiple possible field names
      const normalizedToken = {
        name: item.name || item.tokenName || item.symbol || "Unknown Token",
        symbol: item.symbol || item.ticker || item.tokenSymbol || "",
        image: item.logoURI || item.logo || item.image || item.icon || item.thumbnail || "",
        description: (item.description || item.info?.description || item.extensions?.description || "").slice(0, 200),
        metadata: extractMetadata(),
        tokenAddress: item.address || item.tokenAddress || item.contractAddress || "",
        chain: "solana",
        price: item.price || item.priceUsd || item.currentPrice || undefined,
        liquidity: item.liquidity?.usd || item.liquidityUsd || item.totalLiquidity || undefined,
        volume24h: item.v24hUSD || item.volume24h || item.dailyVolume || undefined
      };
      
      normalizedTokens.push(normalizedToken);
    }
    
    console.log(`Successfully normalized ${normalizedTokens.length} tokens`);
    
    if (normalizedTokens.length === 0) {
      throw new Error('No valid tokens found in API response');
    }
    
    return new Response(JSON.stringify(normalizedTokens), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Source': 'birdeye-api'
      },
    });
    
  } catch (error) {
    console.error('Error in birdeye-trending function:', error);
    
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