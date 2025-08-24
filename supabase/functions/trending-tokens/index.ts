import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = "https://cupuoqzponoclqjsmaoq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cHVvcXpwb25vY2xxanNtYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5OTUxMjUsImV4cCI6MjA3MTU3MTEyNX0.q5VU33UtcunKsuVFDIy0vPGweMQNJSMSMpC2hf1ueuk";

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
}

// Rate limiting helper
async function checkRateLimit(supabase: any, clientIP: string): Promise<boolean> {
  try {
    const windowStart = new Date(Date.now() - 60000); // 1 minute window
    
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
      .eq('endpoint', 'trending-tokens')
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();

    if (rateLimitData && rateLimitData.request_count >= 30) {
      return false; // Rate limit exceeded
    }

    // Update or insert rate limit entry
    if (rateLimitData) {
      await supabase
        .from('rate_limiting')
        .update({ request_count: rateLimitData.request_count + 1 })
        .eq('ip_address', clientIP)
        .eq('endpoint', 'trending-tokens')
        .gte('window_start', windowStart.toISOString());
    } else {
      await supabase
        .from('rate_limiting')
        .insert({
          ip_address: clientIP,
          endpoint: 'trending-tokens',
          request_count: 1
        });
    }

    return true;
  } catch (error) {
    console.log('Rate limiting check failed, allowing request:', error);
    return true; // Allow request if rate limiting check fails
  }
}

// Cache helper
async function getCachedData(supabase: any): Promise<TrendingToken[] | null> {
  try {
    const cacheExpiry = new Date(Date.now() - 30000); // 30 seconds
    
    // Clean up old cache entries
    await supabase.rpc('cleanup_trending_tokens_cache');

    const { data: cachedData } = await supabase
      .from('trending_tokens_cache')
      .select('data')
      .gte('fetched_at', cacheExpiry.toISOString())
      .order('fetched_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return cachedData?.data || null;
  } catch (error) {
    console.log('Cache retrieval failed:', error);
    return null;
  }
}

// Store in cache
async function storeInCache(supabase: any, data: TrendingToken[]): Promise<void> {
  try {
    await supabase
      .from('trending_tokens_cache')
      .insert({ data });
  } catch (error) {
    console.log('Cache storage failed:', error);
  }
}

// Fetch from DexScreener
async function fetchFromDexScreener(): Promise<TrendingToken[]> {
  console.log('Fetching from DexScreener API...');
  
  const response = await fetch('https://api.dexscreener.com/latest/dex/trending?timeframe=6h&chain=solana');
  
  if (!response.ok) {
    throw new Error(`DexScreener API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('DexScreener API response:', JSON.stringify(data, null, 2));

  if (!data.pairs || !Array.isArray(data.pairs)) {
    throw new Error('Invalid response format from DexScreener');
  }

  // Extract top 10 tokens and transform the data
  const tokens: TrendingToken[] = data.pairs
    .slice(0, 10)
    .map((pair: any) => {
      const baseToken = pair.baseToken || {};
      const info = pair.info || {};
      
      // Extract metadata links
      const metadata: TrendingToken['metadata'] = {};
      
      if (info.websites && Array.isArray(info.websites) && info.websites.length > 0) {
        metadata.website = info.websites[0];
      }
      
      if (info.socials && Array.isArray(info.socials)) {
        info.socials.forEach((social: any) => {
          if (social.type === 'twitter' && social.url) {
            metadata.twitter = social.url;
          } else if (social.type === 'telegram' && social.url) {
            metadata.telegram = social.url;
          } else if (social.type === 'discord' && social.url) {
            metadata.discord = social.url;
          }
        });
      }

      return {
        name: baseToken.name || 'Unknown Token',
        symbol: baseToken.symbol || 'UNKNOWN',
        image: info.imageUrl || '',
        description: info.description || '',
        metadata
      };
    });

  console.log('Processed tokens:', JSON.stringify(tokens, null, 2));
  return tokens;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
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
    let tokens = await getCachedData(supabase);
    
    if (!tokens) {
      console.log('No cached data found, fetching from DexScreener...');
      try {
        tokens = await fetchFromDexScreener();
        // Store in cache for future requests
        await storeInCache(supabase, tokens);
      } catch (dexError) {
        console.error('DexScreener fetch failed:', dexError);
        
        // If DexScreener fails and Supabase is available, return a meaningful error
        return new Response(JSON.stringify({ 
          error: 'Unable to fetch trending tokens from DexScreener. Please try again later.',
          details: dexError.message 
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      console.log('Returning cached data');
    }

    return new Response(JSON.stringify(tokens), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in trending-tokens function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});