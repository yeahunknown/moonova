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
    console.log('Fetching trending tokens from Birdeye API...');
    
    const url = new URL(req.url);
    const chain = url.searchParams.get('chain') || 'solana';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Get API key from environment
    const apiKey = Deno.env.get('BIRDEYE_API_KEY');
    
    // First, try the trending endpoint with API key if available
    let response;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    if (apiKey) {
      headers['X-API-KEY'] = apiKey;
    }
    
    try {
      response = await fetch(`https://public-api.birdeye.so/defi/token_trending?chain=${chain}&offset=0&limit=100`, {
        headers
      });
      
      if (!response.ok) {
        console.error(`Birdeye API error: ${response.status} ${response.statusText}`);
        
        // If API fails, try alternative approach - get token list from a different endpoint
        const fallbackResponse = await fetch(`https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=${limit}`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (fallbackResponse.ok) {
          response = fallbackResponse;
        } else {
          throw new Error(`Both endpoints failed. Primary: ${response.status}, Fallback: ${fallbackResponse.status}`);
        }
      }
    } catch (fetchError) {
      console.error('Network error:', fetchError);
      throw new Error('Failed to connect to Birdeye API');
    }
    
    const data = await response.json();
    console.log('Raw API response structure:', JSON.stringify(data, null, 2).slice(0, 1000));
    
    // Extract and normalize tokens
    const normalizedTokens: any[] = [];
    
    // Handle different response structures
    let tokenList: any[] = [];
    if (data.data && Array.isArray(data.data)) {
      tokenList = data.data;
    } else if (data.tokens && Array.isArray(data.tokens)) {
      tokenList = data.tokens;
    } else if (Array.isArray(data)) {
      tokenList = data;
    } else {
      console.error('Unexpected API response structure:', data);
      throw new Error('Invalid API response format');
    }
    
    console.log(`Processing ${tokenList.length} tokens from API...`);
    
    for (const item of tokenList) {
      // Skip tokens without basic info
      if (!item.symbol || !item.address) {
        continue;
      }
      
      // Stop when we have enough tokens
      if (normalizedTokens.length >= limit) {
        break;
      }
      
      // Extract metadata safely
      const extractMetadata = () => {
        const metadata = {
          website: "",
          twitter: "",
          telegram: "",
          discord: ""
        };
        
        // Handle various metadata structures
        const extensions = item.extensions || item.info || {};
        
        // Website
        if (extensions.website) {
          metadata.website = extensions.website;
        } else if (extensions.websites && Array.isArray(extensions.websites) && extensions.websites.length > 0) {
          metadata.website = extensions.websites[0];
        }
        
        // Social links
        const socials = extensions.socials || extensions.social || [];
        if (Array.isArray(socials)) {
          for (const social of socials) {
            const type = social.type?.toLowerCase() || social.platform?.toLowerCase() || '';
            const url = social.url || social.link || '';
            
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
        if (extensions.twitter) {
          metadata.twitter = extensions.twitter.startsWith('http') 
            ? extensions.twitter 
            : `https://twitter.com/${extensions.twitter.replace('@', '')}`;
        }
        if (extensions.telegram) {
          metadata.telegram = extensions.telegram.startsWith('http') 
            ? extensions.telegram 
            : `https://t.me/${extensions.telegram}`;
        }
        if (extensions.discord) {
          metadata.discord = extensions.discord;
        }
        
        return metadata;
      };
      
      // Normalize token data
      const normalizedToken = {
        name: item.name || item.symbol || "Unknown Token",
        symbol: item.symbol || "",
        image: item.logoURI || item.logo || item.image || "",
        description: (item.extensions?.description || item.info?.description || item.description || "").slice(0, 200),
        metadata: extractMetadata(),
        tokenAddress: item.address || "",
        chain: chain,
        price: item.price || item.priceUsd || undefined,
        liquidity: item.liquidity?.usd || item.liquidityUsd || undefined,
        volume24h: item.v24hUSD || item.volume24h || undefined
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