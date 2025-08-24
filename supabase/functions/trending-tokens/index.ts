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
    // Use DexScreener pairs API for Solana
    const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana`);
    
    if (!response.ok) {
      throw new Error(`DexScreener API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('DexScreener response:', { pairsCount: data.pairs?.length, hasData: !!data.pairs });
    
    if (!data.pairs || !Array.isArray(data.pairs)) {
      throw new Error('Invalid response format - no pairs array');
    }
    
    // Filter and sort pairs by volume, deduplicate by baseToken address
    const tokenMap = new Map<string, any>();
    
    for (const pair of data.pairs) {
      if (!pair.baseToken?.address || !pair.baseToken?.name || !pair.baseToken?.symbol) continue;
      if (!pair.volume?.h24 || pair.volume.h24 < 1000) continue; // Filter low volume pairs
      
      const tokenAddress = pair.baseToken.address;
      const currentPair = tokenMap.get(tokenAddress);
      
      // Keep the pair with higher volume
      if (!currentPair || (pair.volume?.h24 || 0) > (currentPair.volume?.h24 || 0)) {
        tokenMap.set(tokenAddress, pair);
      }
    }
    
    const processedTokens: TrendingToken[] = Array.from(tokenMap.values())
      .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
      .slice(0, limit)
      .map(pair => ({
        symbol: pair.baseToken.symbol,
        name: pair.baseToken.name,
        image: pair.info?.imageUrl || '/placeholder-token.png',
        description: generateDescription(pair.baseToken.name),
        metadata: {
          website: pair.info?.websites?.[0]?.url || '',
          twitter: pair.info?.socials?.find((s: any) => s.type === 'twitter')?.url || '',
          telegram: pair.info?.socials?.find((s: any) => s.type === 'telegram')?.url || '',
          discord: pair.info?.socials?.find((s: any) => s.type === 'discord')?.url || '',
        },
        tokenAddress: pair.baseToken.address,
        chain,
        randomized: generateRandomizedFields(),
      }));
    
    console.log(`Processed ${processedTokens.length} tokens from ${data.pairs.length} pairs`);
    return processedTokens;
    
  } catch (error) {
    console.error('Primary API failed, trying fallback:', error);
    
    // Fallback: return some mock trending tokens for demonstration
    const mockTokens: TrendingToken[] = [
      {
        symbol: 'PEPE',
        name: 'Pepe',
        image: '/placeholder-token.png',
        description: generateDescription('Pepe'),
        metadata: { website: '', twitter: '', telegram: '', discord: '' },
        tokenAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
        chain,
        randomized: generateRandomizedFields(),
      },
      {
        symbol: 'DOGE',
        name: 'Dogecoin',
        image: '/placeholder-token.png',
        description: generateDescription('Dogecoin'),
        metadata: { website: '', twitter: '', telegram: '', discord: '' },
        tokenAddress: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
        chain,
        randomized: generateRandomizedFields(),
      },
      {
        symbol: 'SHIB',
        name: 'Shiba Inu',
        image: '/placeholder-token.png',
        description: generateDescription('Shiba Inu'),
        metadata: { website: '', twitter: '', telegram: '', discord: '' },
        tokenAddress: 'CiKu4eHsVrc1eueVQeHn7qhXTcVu95gSQmBpX4utjL9z',
        chain,
        randomized: generateRandomizedFields(),
      },
    ].slice(0, limit);
    
    console.log(`Returning ${mockTokens.length} mock tokens as fallback`);
    return mockTokens;
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
      data: { tokens },
      timestamp: Date.now(),
    };

    console.log(`Successfully fetched ${tokens.length} trending tokens`);
    
    return new Response(JSON.stringify({ tokens }), {
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