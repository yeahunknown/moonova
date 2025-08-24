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
    console.log('Fetching trending tokens...');
    
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // For now, return realistic mock data to ensure the flow works
    console.log('Creating 10 realistic trending tokens...');
    
    const mockTokens = [
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
      },
      {
        name: "USD Coin",
        symbol: "USDC",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        description: "Digital dollar stablecoin backed by US dollar reserves",
        metadata: {
          website: "https://centre.io",
          twitter: "https://twitter.com/centre_io",
          telegram: "",
          discord: ""
        },
        tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        chain: "solana",
        price: 1.00,
        liquidity: 800000000,
        volume24h: 2000000000
      },
      {
        name: "Tether USD",
        symbol: "USDT",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
        description: "The world's most widely used stablecoin",
        metadata: {
          website: "https://tether.to",
          twitter: "https://twitter.com/tether_to",
          telegram: "https://t.me/tether_to",
          discord: ""
        },
        tokenAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        chain: "solana",
        price: 1.00,
        liquidity: 600000000,
        volume24h: 1800000000
      },
      {
        name: "Raydium",
        symbol: "RAY",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
        description: "An on-chain order book AMM powering the evolution of DeFi",
        metadata: {
          website: "https://raydium.io",
          twitter: "https://twitter.com/RaydiumProtocol",
          telegram: "https://t.me/raydiumprotocol",
          discord: "https://discord.gg/raydium"
        },
        tokenAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        chain: "solana",
        price: 5.23,
        liquidity: 45000000,
        volume24h: 120000000
      },
      {
        name: "Serum",
        symbol: "SRM",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt/logo.png",
        description: "A decentralized exchange protocol built on Solana",
        metadata: {
          website: "https://projectserum.com",
          twitter: "https://twitter.com/ProjectSerum",
          telegram: "",
          discord: "https://discord.gg/serum"
        },
        tokenAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        chain: "solana",
        price: 0.45,
        liquidity: 12000000,
        volume24h: 25000000
      },
      {
        name: "Bonk",
        symbol: "BONK",
        image: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
        description: "The first Solana dog coin for the people, by the people",
        metadata: {
          website: "https://bonkcoin.com",
          twitter: "https://twitter.com/bonk_inu",
          telegram: "https://t.me/bonkinu",
          discord: ""
        },
        tokenAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        chain: "solana",
        price: 0.000025,
        liquidity: 8000000,
        volume24h: 15000000
      },
      {
        name: "Jupiter",
        symbol: "JUP",
        image: "https://static.jup.ag/jup/icon.png",
        description: "The best swap aggregator on Solana",
        metadata: {
          website: "https://jup.ag",
          twitter: "https://twitter.com/JupiterExchange",
          telegram: "https://t.me/jupiterexchange",
          discord: "https://discord.gg/jupiter"
        },
        tokenAddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        chain: "solana",
        price: 0.85,
        liquidity: 35000000,
        volume24h: 85000000
      },
      {
        name: "Pyth Network",
        symbol: "PYTH",
        image: "https://pyth.network/token.svg",
        description: "High-fidelity, high-frequency market data for DeFi",
        metadata: {
          website: "https://pyth.network",
          twitter: "https://twitter.com/PythNetwork",
          telegram: "",
          discord: "https://discord.gg/pyth"
        },
        tokenAddress: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
        chain: "solana",
        price: 0.42,
        liquidity: 18000000,
        volume24h: 32000000
      },
      {
        name: "Orca",
        symbol: "ORCA",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png",
        description: "A user-friendly DEX built on Solana",
        metadata: {
          website: "https://orca.so",
          twitter: "https://twitter.com/orca_so",
          telegram: "https://t.me/orca_so",
          discord: "https://discord.gg/orca"
        },
        tokenAddress: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
        chain: "solana",
        price: 3.45,
        liquidity: 22000000,
        volume24h: 45000000
      },
      {
        name: "Marinade",
        symbol: "MNDE",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey/logo.png",
        description: "Liquid staking protocol for Solana",
        metadata: {
          website: "https://marinade.finance",
          twitter: "https://twitter.com/MarinadeFinance",
          telegram: "https://t.me/marinadefinance",
          discord: "https://discord.gg/marinade"
        },
        tokenAddress: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
        chain: "solana",
        price: 0.15,
        liquidity: 8500000,
        volume24h: 12000000
      }
    ];
    
    // Take only the requested number of tokens (default 10)
    const limitedTokens = mockTokens.slice(0, limit);
    
    console.log(`Successfully created ${limitedTokens.length} trending tokens`);
    
    return new Response(JSON.stringify(limitedTokens), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Source': 'mock-data'
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