import { useState, useEffect, useCallback, useMemo } from 'react';

interface TokenStats {
  volume: number;
  marketCap: number;
  liquidity: number;
  holders: number;
  price: number;
}

interface UseTokenStatsProps {
  initialLiquidity: number;
  liquidityWithdrawn?: boolean;
  isOverrideMode?: boolean;
  frozenValues?: boolean;
}

export const useTokenStats = ({ 
  initialLiquidity, 
  liquidityWithdrawn = false, 
  isOverrideMode = false,
  frozenValues = false 
}: UseTokenStatsProps) => {
  const [stats, setStats] = useState<TokenStats>({
    volume: 0,
    marketCap: 0,
    liquidity: 0,
    holders: 0,
    price: 0
  });

  const calculateBaseStats = useCallback((liquidity: number) => {
    const basePrice = Math.pow(liquidity / 1000, 0.7) * 0.000001;
    return {
      volume: liquidity * (0.8 + Math.random() * 0.4),
      marketCap: basePrice * 1000000000,
      liquidity,
      holders: Math.floor(liquidity / 50) + Math.floor(Math.random() * 20),
      price: basePrice
    };
  }, []);

  // Initialize stats
  useEffect(() => {
    if (initialLiquidity > 0) {
      setStats(calculateBaseStats(initialLiquidity));
    }
  }, [initialLiquidity, calculateBaseStats]);

  // Handle real-time updates
  useEffect(() => {
    if (liquidityWithdrawn || isOverrideMode || frozenValues || initialLiquidity <= 0) return;

    const interval = setInterval(() => {
      setStats(prevStats => {
        const volatility = 0.02;
        const trend = Math.random() > 0.45 ? 1 : -1;
        const change = (Math.random() * volatility * 2 - volatility) * trend;
        
        const newLiquidity = Math.max(1000, prevStats.liquidity * (1 + change));
        const newPrice = Math.max(0.000001, prevStats.price * (1 + change * 1.2));
        
        return {
          volume: newLiquidity * (0.8 + Math.random() * 0.4),
          marketCap: newPrice * 1000000000,
          liquidity: newLiquidity,
          holders: Math.max(1, prevStats.holders + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
          price: newPrice
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [liquidityWithdrawn, isOverrideMode, frozenValues, initialLiquidity]);

  // Handle withdrawal crash
  useEffect(() => {
    if (liquidityWithdrawn) {
      const crashStats = {
        volume: stats.volume * 0.05,
        marketCap: stats.marketCap * 0.02,
        liquidity: 0,
        holders: Math.max(1, stats.holders - Math.floor(stats.holders * 0.8)),
        price: stats.price * 0.02
      };
      setStats(crashStats);

      // Slow decline after crash
      const declineInterval = setInterval(() => {
        setStats(prev => ({
          volume: Math.max(0, prev.volume * 0.95),
          marketCap: Math.max(0, prev.marketCap * 0.98),
          liquidity: 0,
          holders: Math.max(1, prev.holders - (Math.random() > 0.9 ? 1 : 0)),
          price: Math.max(0.000001, prev.price * 0.98)
        }));
      }, 5000);

      return () => clearInterval(declineInterval);
    }
  }, [liquidityWithdrawn, stats.volume, stats.marketCap, stats.holders, stats.price]);

  const formattedStats = useMemo(() => ({
    volume: `$${stats.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    marketCap: `$${stats.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    liquidity: `$${stats.liquidity.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    holders: stats.holders.toLocaleString(),
    price: `$${stats.price.toFixed(8)}`
  }), [stats]);

  return { stats, formattedStats, setStats, calculateBaseStats };
};