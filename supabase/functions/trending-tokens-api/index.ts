import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface TrendingToken {
  name: string;
  symbol: string;
  image: string;
  description: string;
  metadata: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  chain: string;
  tokenAddress: string;
}

// Rate limiting helper
async function checkRateLimit(supabase: any, clientIP: string): Promise<boolean> {
  try {
    const windowStart = new Date(Date.now() - 60000); // 1 minute window
    
    console.log(`[Rate Limit] Checking for IP: ${clientIP}`);

    // Clean up old rate limit entries
    await supabase
      .from('rate_limiting')
      .delete()
      .lt('window_start', windowStart.toISOString());

    // Check current rate for this IP
    const { data: rateLimitData } = await supabase
      .from('rate_limiting')
      .select('request_count')
      .eq('ip_address', clientIP)
      .eq('endpoint', '/api/trending-tokens')
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();

    if (rateLimitData && rateLimitData.request_count >= 30) {
      console.log(`[Rate Limit] Exceeded for IP: ${clientIP} (${rateLimitData.request_count} requests)`);
      return false; // Rate limit exceeded
    }

    // Update or insert rate limit entry
    if (rateLimitData) {
      await supabase
        .from('rate_limiting')
        .update({ request_count: rateLimitData.request_count + 1 })
        .eq('ip_address', clientIP)
        .eq('endpoint', '/api/trending-tokens')
        .gte('window_start', windowStart.toISOString());
      console.log(`[Rate Limit] Updated count to ${rateLimitData.request_count + 1} for IP: ${clientIP}`);
    } else {
      await supabase
        .from('rate_limiting')
        .insert({
          ip_address: clientIP,
          endpoint: '/api/trending-tokens',
          request_count: 1
        });
      console.log(`[Rate Limit] New window created for IP: ${clientIP}`);
    }

    return true;
  } catch (error) {
    console.log('[Rate Limit] Check failed, allowing request:', error);
    return true; // Allow request if rate limiting check fails
  }
}

// Cache helper
async function getCachedData(supabase: any, chain: string, timeframe: string): Promise<TrendingToken[] | null> {
  try {
    const cacheExpiry = new Date(Date.now() - 30000); // 30 seconds
    
    console.log(`[Cache] Checking for chain: ${chain}, timeframe: ${timeframe}`);

    const { data: cachedData } = await supabase
      .from('trending_tokens_cache')
      .select('data')
      .eq('chain', chain)
      .eq('timeframe', timeframe)
      .gte('fetched_at', cacheExpiry.toISOString())
      .order('fetched_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cachedData?.data) {
      console.log('[Cache] Hit - returning cached data');
      return cachedData.data;
    }
    
    console.log('[Cache] Miss - no valid cache found');
    return null;
  } catch (error) {
    console.log('[Cache] Retrieval failed:', error);
    return null;
  }
}

// Store in cache
async function storeInCache(supabase: any, chain: string, timeframe: string, data: TrendingToken[]): Promise<void> {
  try {
    await supabase
      .from('trending_tokens_cache')
      .insert({ 
        chain,
        timeframe,
        data 
      });
    console.log(`[Cache] Stored ${data.length} tokens for ${chain}/${timeframe}`);
  } catch (error) {
    console.log('[Cache] Storage failed:', error);
  }
}

// Get stale cache as fallback
async function getStaleCachedData(supabase: any, chain: string, timeframe: string): Promise<TrendingToken[] | null> {
  try {
    const { data: cachedData } = await supabase
      .from('trending_tokens_cache')
      .select('data')
      .eq('chain', chain)
      .eq('timeframe', timeframe)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return cachedData?.data || null;
  } catch (error) {
    console.log('[Cache] Stale retrieval failed:', error);
    return null;
  }
}

// Fetch from DexScreener
async function fetchFromDexScreener(chain: string, timeframe: string, limit: number): Promise<TrendingToken[]> {
  console.log(`[DexScreener] Fetching trending tokens - chain: ${chain}, timeframe: ${timeframe}, limit: ${limit}`);
  
  const response = await fetch(`https://api.dexscreener.com/latest/dex/trending?timeframe=${timeframe}&chain=${chain}`);
  
  if (!response.ok) {
    throw new Error(`DexScreener API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`[DexScreener] Received ${data.pairs?.length || 0} pairs from API`);

  if (!data.pairs || !Array.isArray(data.pairs)) {
    throw new Error('Invalid response format from DexScreener');
  }

  // De-duplicate by base token address and take top N
  const seenAddresses = new Set<string>();
  const uniquePairs = data.pairs.filter((pair: any) => {
    const address = pair.baseToken?.address;
    if (!address || seenAddresses.has(address)) {
      return false;
    }
    seenAddresses.add(address);
    return true;
  });

  // Extract and transform top tokens
  const tokens: TrendingToken[] = uniquePairs
    .slice(0, limit)
    .map((pair: any) => {
      const baseToken = pair.baseToken || {};
      const info = pair.info || {};
      
      // Extract metadata links
      const metadata: TrendingToken['metadata'] = {};
      
      // Handle websites - can be array of strings or objects
      if (info.websites && Array.isArray(info.websites) && info.websites.length > 0) {
        const firstWebsite = info.websites[0];
        metadata.website = typeof firstWebsite === 'string' ? firstWebsite : firstWebsite?.url || '';
      }
      
      // Handle socials - array of objects with type and url
      if (info.socials && Array.isArray(info.socials)) {
        info.socials.forEach((social: any) => {
          if (social.type && social.url) {
            const type = social.type.toLowerCase();
            if (type === 'twitter' || type === 'x') {
              metadata.twitter = social.url;
            } else if (type === 'telegram') {
              metadata.telegram = social.url;
            } else if (type === 'discord') {
              metadata.discord = social.url;
            }
          }
        });
      }

      return {
        name: baseToken.name || '',
        symbol: baseToken.symbol || '',
        image: info.imageUrl || '',
        description: info.description || '',
        metadata,
        chain: chain,
        tokenAddress: baseToken.address || ''
      };
    });

  console.log(`[DexScreener] Processed ${tokens.length} unique tokens`);
  return tokens;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Parse query parameters
    const url = new URL(req.url);
    const chain = url.searchParams.get('chain') || 'solana';
    const timeframe = url.searchParams.get('timeframe') || '6h';
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    console.log(`[API] Request - chain: ${chain}, timeframe: ${timeframe}, limit: ${limit}`);
    
    // Get client IP for rate limiting
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    '127.0.0.1';

    // Check rate limit
    const rateLimitOk = await checkRateLimit(supabase, clientIP);
    if (!rateLimitOk) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Try to get cached data first
    let tokens = await getCachedData(supabase, chain, timeframe);
    let fromCache = true;
    
    if (!tokens) {
      fromCache = false;
      console.log('[API] No cached data found, fetching from DexScreener...');
      try {
        tokens = await fetchFromDexScreener(chain, timeframe, limit);
        // Store in cache for future requests
        await storeInCache(supabase, chain, timeframe, tokens);
      } catch (dexError) {
        console.error('[API] DexScreener fetch failed:', dexError);
        
        // Try to get stale cache as fallback
        tokens = await getStaleCachedData(supabase, chain, timeframe);
        if (tokens) {
          console.log('[API] Using stale cache as fallback');
          return new Response(JSON.stringify(tokens), {
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'X-Source': 'stale-cache'
            },
          });
        }
        
        // No cache available, return error
        return new Response(JSON.stringify({ 
          error: 'DexScreener unavailable' 
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    console.log(`[API] Returning ${tokens?.length || 0} tokens (source: ${fromCache ? 'cache' : 'live'})`);

    return new Response(JSON.stringify(tokens), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Source': fromCache ? 'cache' : 'live'
      },
    });

  } catch (error) {
    console.error('[API] Error in trending-tokens function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});