import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: simple in-memory store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const CACHE_DURATION = 30000; // 30 seconds

// Simple cache
let cache: { data: any; timestamp: number } | null = null;

interface TrendingToken {
  symbol: string;
  name: string;
  image: string;
  description: string;
  metadata: {
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
  };
  tokenAddress: string;
  chain: string;
  randomized: {
    supply: string;
    decimals: number;
    burnable: boolean;
    mintable: boolean;
    transactionTax: number;
    revokeFreezeAuth: boolean;
    revokeMintAuth: boolean;
    revokeMetadataAuth: boolean;
  };
}

function generateRandomizedFields(): TrendingToken['randomized'] {
  const supplies = ['1000000', '10000000', '100000000', '1000000000'];
  return {
    supply: supplies[Math.floor(Math.random() * supplies.length)],
    decimals: Math.floor(Math.random() * 10),
    burnable: Math.random() > 0.5,
    mintable: Math.random() > 0.7,
    transactionTax: Math.floor(Math.random() * 10),
    revokeFreezeAuth: Math.random() > 0.6,
    revokeMintAuth: Math.random() > 0.6,
    revokeMetadataAuth: Math.random() > 0.6,
  };
}

function generateDescription(name: string): string {
  const templates = [
    `${name} is the next generation meme coin taking the crypto world by storm.`,
    `Join the ${name} revolution and ride the wave to the moon!`,
    `${name} - where memes meet money and dreams become reality.`,
    `Community-driven token ${name} is building the future of decentralized finance.`,
    `${name} brings fun and utility together in the ultimate crypto experience.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return true;
  }
  
  userLimit.count++;
  return false;
}

async function fetchTrendingTokens(timeframe: string, limit: number, chain: string): Promise<TrendingToken[]> {
  try {
    // Try DexScreener API first
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/trending/${timeframe}?chain=${chain}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('DexScreener API failed');
    }
    
    const data = await response.json();
    
    if (!data.tokens || !Array.isArray(data.tokens)) {
      throw new Error('Invalid response format');
    }
    
    // Process and deduplicate tokens
    const tokenMap = new Map<string, any>();
    
    for (const token of data.tokens) {
      const tokenAddress = token.address || token.tokenAddress;
      if (!tokenAddress) continue;
      
      if (!tokenMap.has(tokenAddress) || 
          (token.trendingScoreH6 || 0) > (tokenMap.get(tokenAddress)?.trendingScoreH6 || 0)) {
        tokenMap.set(tokenAddress, token);
      }
    }
    
    const processedTokens: TrendingToken[] = Array.from(tokenMap.values())
      .slice(0, limit)
      .map(token => ({
        symbol: token.symbol || 'TOKEN',
        name: token.name || 'Unknown Token',
        image: token.image || token.logo || '/placeholder-token.png',
        description: token.description || generateDescription(token.name || 'Unknown Token'),
        metadata: {
          website: token.website || token.url || '',
          twitter: token.twitter || (token.socials?.find((s: any) => s.type === 'twitter')?.url) || '',
          telegram: token.telegram || (token.socials?.find((s: any) => s.type === 'telegram')?.url) || '',
          discord: token.discord || (token.socials?.find((s: any) => s.type === 'discord')?.url) || '',
        },
        tokenAddress: token.address || token.tokenAddress,
        chain,
        randomized: generateRandomizedFields(),
      }));
    
    return processedTokens;
    
  } catch (error) {
    console.error('Primary API failed, trying fallback:', error);
    
    // Fallback: scrape DexScreener trending page
    try {
      const fallbackResponse = await fetch(`https://dexscreener.com/solana?rankBy=trendingScoreH6&order=desc`);
      const html = await fallbackResponse.text();
      
      // Basic parsing of the HTML for token data
      const tokens: TrendingToken[] = [];
      const tokenRegex = /"address":"([^"]+)"[^}]*"name":"([^"]+)"[^}]*"symbol":"([^"]+)"/g;
      let match;
      
      while ((match = tokenRegex.exec(html)) !== null && tokens.length < limit) {
        const [, address, name, symbol] = match;
        tokens.push({
          symbol: symbol || 'TOKEN',
          name: name || 'Unknown Token',
          image: '/placeholder-token.png',
          description: generateDescription(name || 'Unknown Token'),
          metadata: {
            website: '',
            twitter: '',
            telegram: '',
            discord: '',
          },
          tokenAddress: address,
          chain,
          randomized: generateRandomizedFields(),
        });
      }
      
      return tokens;
      
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      throw new Error('All data sources failed');
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    
    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse query parameters
    const url = new URL(req.url);
    const timeframe = url.searchParams.get('timeframe') || '6h';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const chain = url.searchParams.get('chain') || 'solana';

    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      console.log('Returning cached data');
      return new Response(JSON.stringify(cache.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch fresh data
    const tokens = await fetchTrendingTokens(timeframe, limit, chain);
    
    // Update cache
    cache = {
      data: tokens,
      timestamp: Date.now(),
    };

    console.log(`Successfully fetched ${tokens.length} trending tokens`);
    
    return new Response(JSON.stringify(tokens), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in trending-tokens function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});