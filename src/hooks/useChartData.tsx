import { useState, useEffect, useMemo } from 'react';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  isGreen: boolean;
}

interface UseChartDataProps {
  initialPrice: number;
  liquidityWithdrawn?: boolean;
  chartIndependent?: boolean;
  isOverrideMode?: boolean;
  currentPrice?: number;
}

export const useChartData = ({ 
  initialPrice, 
  liquidityWithdrawn = false, 
  chartIndependent = false, 
  isOverrideMode = false,
  currentPrice 
}: UseChartDataProps) => {
  const [chartData, setChartData] = useState<CandleData[]>([]);

  // Generate initial chart data with realistic price action
  const generateInitialData = useMemo(() => {
    if (initialPrice <= 0) return [];
    
    const data: CandleData[] = [];
    let price = initialPrice;
    
    for (let i = 0; i < 50; i++) {
      const volatility = 0.05 + Math.random() * 0.05; // 5-10% volatility
      const trend = Math.sin(i * 0.1) * 0.02; // Subtle trend
      const change = (Math.random() - 0.5) * volatility + trend;
      
      const open = price;
      const close = price * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.03);
      const low = Math.min(open, close) * (1 - Math.random() * 0.03);
      
      data.push({
        time: new Date(Date.now() - (49 - i) * 60000).toISOString(),
        open,
        high,
        low,
        close,
        isGreen: close > open
      });
      
      price = close;
    }
    
    return data;
  }, [initialPrice]);

  // Initialize chart data
  useEffect(() => {
    if (initialPrice > 0) {
      setChartData(generateInitialData);
    }
  }, [initialPrice, generateInitialData]);

  // Handle real-time chart updates
  useEffect(() => {
    if (liquidityWithdrawn || isOverrideMode || chartData.length === 0) return;

    const interval = setInterval(() => {
      setChartData(prevData => {
        const lastCandle = prevData[prevData.length - 1];
        if (!lastCandle) return prevData;

        let newPrice;
        if (chartIndependent) {
          // Pumping action - more upward movement with occasional dips
          const pumpChance = 0.75;
          const isPump = Math.random() < pumpChance;
          const change = isPump 
            ? Math.random() * 0.15 + 0.05  // 5-20% up
            : (Math.random() - 0.5) * 0.08;  // Smaller volatility on dips
          newPrice = lastCandle.close * (1 + change);
        } else {
          // Sync with current price if provided with natural volatility
          const volatility = 0.02;
          const change = (Math.random() - 0.5) * volatility;
          newPrice = (currentPrice || lastCandle.close) * (1 + change);
        }

        const open = lastCandle.close;
        const close = newPrice;
        const wickMultiplier = 1 + Math.random() * 0.02;
        const high = Math.max(open, close) * wickMultiplier;
        const low = Math.min(open, close) * (2 - wickMultiplier);

        const newCandle: CandleData = {
          time: new Date().toISOString(),
          open,
          high,
          low,
          close,
          isGreen: close > open
        };

        // Keep last 50 candles for smooth animation
        const newData = [...prevData.slice(1), newCandle];
        return newData;
      });
    }, chartIndependent ? 1000 : 3000);

    return () => clearInterval(interval);
  }, [liquidityWithdrawn, isOverrideMode, chartIndependent, currentPrice, chartData.length]);

  // Handle dramatic liquidity withdrawal crash
  useEffect(() => {
    if (liquidityWithdrawn && chartData.length > 0) {
      setChartData(prevData => {
        const lastCandle = prevData[prevData.length - 1];
        if (!lastCandle) return prevData;

        // Create massive crash candle
        const crashPrice = lastCandle.close * 0.015; // 98.5% drop
        const crashCandle: CandleData = {
          time: new Date().toISOString(),
          open: lastCandle.close,
          high: lastCandle.close * 1.001, // Tiny upper wick
          low: crashPrice,
          close: crashPrice,
          isGreen: false
        };

        return [...prevData.slice(1), crashCandle];
      });

      // Continue slow decline after crash
      const declineInterval = setInterval(() => {
        setChartData(prevData => {
          const lastCandle = prevData[prevData.length - 1];
          if (!lastCandle) return prevData;

          // Slow decline with occasional dead cat bounces
          const isDeadCatBounce = Math.random() < 0.1; // 10% chance
          const change = isDeadCatBounce 
            ? Math.random() * 0.03 + 0.01  // 1-4% bounce
            : -(Math.random() * 0.02 + 0.005); // 0.5-2.5% decline

          const declinePrice = lastCandle.close * (1 + change);
          const newCandle: CandleData = {
            time: new Date().toISOString(),
            open: lastCandle.close,
            high: Math.max(lastCandle.close, declinePrice) * (1 + Math.random() * 0.005),
            low: Math.min(lastCandle.close, declinePrice) * (1 - Math.random() * 0.01),
            close: declinePrice,
            isGreen: change > 0
          };

          return [...prevData.slice(1), newCandle];
        });
      }, 8000);

      return () => clearInterval(declineInterval);
    }
  }, [liquidityWithdrawn, chartData.length]);

  return { chartData, setChartData };
};
