import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";
import { WithdrawLiquidityModal } from "@/components/modals/WithdrawLiquidityModal";
import CandlestickChart from "@/components/CandlestickChart";
import { AlertTriangle, Search } from "lucide-react";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";

const Portfolio = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [liquidityWithdrawn, setLiquidityWithdrawn] = useState(() => {
    return sessionStorage.getItem('liquidityWithdrawn') === 'true';
  });
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [chartIndependent, setChartIndependent] = useState(false);
  const { setSectionRef, isVisible } = useFadeInAnimation();
  
  // Dynamic stats based on liquidity - initialize immediately  
  const [stats, setStats] = useState(() => {
    const sessionToken = sessionStorage.getItem('sessionToken');
    const liquidityData = sessionStorage.getItem('liquidityAdded');
    
    let liquidityAmount = 1.0;
    if (sessionToken) {
      const tokenInfo = JSON.parse(sessionToken);
      liquidityAmount = tokenInfo.liquidityAmount || 1.0;
    } else if (liquidityData) {
      const liquidity = JSON.parse(liquidityData);
      liquidityAmount = liquidity.lpSize || 1.0;
    }
    
    // Calculate initial stats immediately
    const volume24h = liquidityAmount * (300 + Math.random() * 500);
    const marketCap = liquidityAmount * (800 + Math.random() * 700);
    const holders = Math.round(liquidityAmount * (15 + Math.random() * 25));
    const currentPrice = marketCap / 1000000000;
    
    return {
      volume24h,
      marketCap,
      liquidity: liquidityAmount,
      holders,
      currentPrice
    };
  });

  const [chartData, setChartData] = useState(() => {
    // Initialize chart with proper prices immediately
    const sessionToken = sessionStorage.getItem('sessionToken');
    const liquidityData = sessionStorage.getItem('liquidityAdded');
    
    let liquidityAmount = 1.0;
    if (sessionToken) {
      const tokenInfo = JSON.parse(sessionToken);
      liquidityAmount = tokenInfo.liquidityAmount || 1.0;
    } else if (liquidityData) {
      const liquidity = JSON.parse(liquidityData);
      liquidityAmount = liquidity.lpSize || 1.0;
    }
    
    // Calculate initial stats and price
    const marketCap = liquidityAmount * (800 + Math.random() * 700);
    const basePrice = marketCap / 1000000000;
    
    return [
      { time: '90m', open: basePrice * 0.85, high: basePrice * 0.92, low: basePrice * 0.82, close: basePrice * 0.88, isGreen: true },
      { time: '88m', open: basePrice * 0.88, high: basePrice * 0.91, low: basePrice * 0.84, close: basePrice * 0.86, isGreen: false },
      { time: '86m', open: basePrice * 0.86, high: basePrice * 0.94, low: basePrice * 0.83, close: basePrice * 0.91, isGreen: true },
      { time: '84m', open: basePrice * 0.91, high: basePrice * 0.96, low: basePrice * 0.88, close: basePrice * 0.89, isGreen: false },
      { time: '82m', open: basePrice * 0.89, high: basePrice * 0.95, low: basePrice * 0.86, close: basePrice * 0.93, isGreen: true },
      { time: '80m', open: basePrice * 0.93, high: basePrice * 0.98, low: basePrice * 0.90, close: basePrice * 0.95, isGreen: true },
      { time: '78m', open: basePrice * 0.95, high: basePrice * 1.01, low: basePrice * 0.92, close: basePrice * 0.97, isGreen: true },
      { time: '76m', open: basePrice * 0.97, high: basePrice * 1.03, low: basePrice * 0.94, close: basePrice * 0.99, isGreen: true },
      { time: '74m', open: basePrice * 0.99, high: basePrice * 1.05, low: basePrice * 0.96, close: basePrice * 1.02, isGreen: true },
      { time: '72m', open: basePrice * 1.02, high: basePrice * 1.08, low: basePrice * 0.99, close: basePrice * 1.04, isGreen: true },
      { time: '70m', open: basePrice * 1.04, high: basePrice * 1.10, low: basePrice * 1.01, close: basePrice * 1.06, isGreen: true },
      { time: '68m', open: basePrice * 1.06, high: basePrice * 1.12, low: basePrice * 1.03, close: basePrice * 1.08, isGreen: true },
      { time: '66m', open: basePrice * 1.08, high: basePrice * 1.14, low: basePrice * 1.05, close: basePrice * 1.11, isGreen: true },
      { time: '64m', open: basePrice * 1.11, high: basePrice * 1.16, low: basePrice * 1.08, close: basePrice * 1.13, isGreen: true },
      { time: '62m', open: basePrice * 1.13, high: basePrice * 1.18, low: basePrice * 1.10, close: basePrice * 1.15, isGreen: true },
      { time: '60m', open: basePrice * 1.15, high: basePrice * 1.20, low: basePrice * 1.12, close: basePrice * 1.17, isGreen: true },
      { time: '58m', open: basePrice * 1.17, high: basePrice * 1.22, low: basePrice * 1.14, close: basePrice * 1.19, isGreen: true },
      { time: '56m', open: basePrice * 1.19, high: basePrice * 1.24, low: basePrice * 1.16, close: basePrice * 1.21, isGreen: true },
      { time: '54m', open: basePrice * 1.21, high: basePrice * 1.26, low: basePrice * 1.18, close: basePrice * 1.23, isGreen: true },
      { time: '52m', open: basePrice * 1.23, high: basePrice * 1.28, low: basePrice * 1.20, close: basePrice * 1.25, isGreen: true },
      { time: '50m', open: basePrice * 1.25, high: basePrice * 1.30, low: basePrice * 1.22, close: basePrice * 1.27, isGreen: true },
      { time: '48m', open: basePrice * 1.27, high: basePrice * 1.32, low: basePrice * 1.24, close: basePrice * 1.29, isGreen: true },
      { time: '46m', open: basePrice * 1.29, high: basePrice * 1.34, low: basePrice * 1.26, close: basePrice * 1.31, isGreen: true },
      { time: '44m', open: basePrice * 1.31, high: basePrice * 1.36, low: basePrice * 1.28, close: basePrice * 1.33, isGreen: true },
      { time: '42m', open: basePrice * 1.33, high: basePrice * 1.38, low: basePrice * 1.30, close: basePrice * 1.35, isGreen: true },
      { time: '40m', open: basePrice * 1.35, high: basePrice * 1.40, low: basePrice * 1.32, close: basePrice * 1.37, isGreen: true },
      { time: '38m', open: basePrice * 1.37, high: basePrice * 1.42, low: basePrice * 1.34, close: basePrice * 1.39, isGreen: true },
      { time: '36m', open: basePrice * 1.39, high: basePrice * 1.44, low: basePrice * 1.36, close: basePrice * 1.41, isGreen: true },
      { time: '34m', open: basePrice * 1.41, high: basePrice * 1.46, low: basePrice * 1.38, close: basePrice * 1.43, isGreen: true },
      { time: '32m', open: basePrice * 1.43, high: basePrice * 1.48, low: basePrice * 1.40, close: basePrice * 1.45, isGreen: true },
      { time: '30m', open: basePrice * 1.45, high: basePrice * 1.50, low: basePrice * 1.42, close: basePrice * 1.47, isGreen: true },
      { time: '28m', open: basePrice * 1.47, high: basePrice * 1.52, low: basePrice * 1.44, close: basePrice * 1.49, isGreen: true },
      { time: '26m', open: basePrice * 1.49, high: basePrice * 1.54, low: basePrice * 1.46, close: basePrice * 1.51, isGreen: true },
      { time: '24m', open: basePrice * 1.51, high: basePrice * 1.56, low: basePrice * 1.48, close: basePrice * 1.53, isGreen: true },
      { time: '22m', open: basePrice * 1.53, high: basePrice * 1.58, low: basePrice * 1.50, close: basePrice * 1.55, isGreen: true },
      { time: '20m', open: basePrice * 1.55, high: basePrice * 1.60, low: basePrice * 1.52, close: basePrice * 1.57, isGreen: true },
      { time: '18m', open: basePrice * 1.57, high: basePrice * 1.62, low: basePrice * 1.54, close: basePrice * 1.59, isGreen: true },
      { time: '16m', open: basePrice * 1.59, high: basePrice * 1.64, low: basePrice * 1.56, close: basePrice * 1.61, isGreen: true },
      { time: '14m', open: basePrice * 1.61, high: basePrice * 1.66, low: basePrice * 1.58, close: basePrice * 1.63, isGreen: true },
      { time: '12m', open: basePrice * 1.63, high: basePrice * 1.68, low: basePrice * 1.60, close: basePrice * 1.65, isGreen: true },
      { time: '10m', open: basePrice * 1.65, high: basePrice * 1.70, low: basePrice * 1.62, close: basePrice * 1.67, isGreen: true },
      { time: '8m', open: basePrice * 1.67, high: basePrice * 1.72, low: basePrice * 1.64, close: basePrice * 1.69, isGreen: true },
      { time: '6m', open: basePrice * 1.69, high: basePrice * 1.74, low: basePrice * 1.66, close: basePrice * 1.71, isGreen: true },
      { time: '4m', open: basePrice * 1.71, high: basePrice * 1.76, low: basePrice * 1.68, close: basePrice * 1.73, isGreen: true },
      { time: '2m', open: basePrice * 1.73, high: basePrice * 1.78, low: basePrice * 1.70, close: basePrice * 1.75, isGreen: true },
      { time: 'now', open: basePrice * 1.75, high: basePrice * 1.80, low: basePrice * 1.72, close: basePrice, isGreen: basePrice >= basePrice * 1.75 },
    ];
  });

  const animationRef = useRef<number>();
  const statsRef = useRef(stats);

  // Get token data from session storage (from token creation and liquidity)
  const [tokenData, setTokenData] = useState(() => {
    const sessionToken = sessionStorage.getItem('sessionToken');
    const liquidityData = sessionStorage.getItem('liquidityAdded');
    
    if (sessionToken) {
      const tokenInfo = JSON.parse(sessionToken);
      return {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        image: tokenInfo.uploadedLogo || '/placeholder-token.png',
        hasToken: true,
        liquidityAmount: tokenInfo.liquidityAmount || 1.0
      };
    } else if (liquidityData) {
      const liquidity = JSON.parse(liquidityData);
      return {
        name: liquidity.tokenName || 'DEMO Token',
        symbol: liquidity.tokenSymbol || 'DEMO',
        image: '/placeholder-token.png',
        hasToken: true,
        liquidityAmount: liquidity.lpSize || 1.0
      };
    }
    
    return {
      name: '',
      symbol: '',
      image: '',
      hasToken: false,
      liquidityAmount: 1.0
    };
  });

  // Calculate base stats from liquidity with updated formulas
  const calculateBaseStats = useCallback((liquiditySOL: number) => {
    // Volume 24h: higher - random between liquidity * 300 and liquidity * 800
    const volume24h = liquiditySOL * (300 + Math.random() * 500);
    
    // Market Cap: higher - random between liquidity * 800 and liquidity * 1500
    const marketCap = liquiditySOL * (800 + Math.random() * 700);
    
    // Holders: higher - random between liquidity * 15 and liquidity * 40
    const holders = Math.round(liquiditySOL * (15 + Math.random() * 25));
    
    // Price: market cap / 1,000,000,000 (1B token supply)
    const currentPrice = marketCap / 1000000000;
    
    return {
      volume24h,
      marketCap,
      liquidity: liquiditySOL,
      holders,
      currentPrice
    };
  }, []);

  // Initialize stats from stored liquidity
  useEffect(() => {
    const sessionToken = sessionStorage.getItem('sessionToken');
    const liquidityData = sessionStorage.getItem('liquidityAdded');
    
    let liquidityAmount = 1.0;
    if (sessionToken) {
      const tokenInfo = JSON.parse(sessionToken);
      liquidityAmount = tokenInfo.liquidityAmount || 1.0;
    } else if (liquidityData) {
      const liquidity = JSON.parse(liquidityData);
      liquidityAmount = liquidity.lpSize || 1.0;
    }
    
    const baseStats = calculateBaseStats(liquidityAmount);
    setStats(baseStats);
    statsRef.current = baseStats;

    // Initialize chart with candlestick data
    const basePrice = baseStats.currentPrice;
    const newChartData = [
      { time: '90m', open: basePrice * 0.85, high: basePrice * 0.92, low: basePrice * 0.82, close: basePrice * 0.88, isGreen: true },
      { time: '88m', open: basePrice * 0.88, high: basePrice * 0.91, low: basePrice * 0.84, close: basePrice * 0.86, isGreen: false },
      { time: '86m', open: basePrice * 0.86, high: basePrice * 0.94, low: basePrice * 0.83, close: basePrice * 0.91, isGreen: true },
      { time: '84m', open: basePrice * 0.91, high: basePrice * 0.96, low: basePrice * 0.88, close: basePrice * 0.89, isGreen: false },
      { time: '82m', open: basePrice * 0.89, high: basePrice * 0.95, low: basePrice * 0.86, close: basePrice * 0.93, isGreen: true },
      { time: '80m', open: basePrice * 0.93, high: basePrice * 0.98, low: basePrice * 0.90, close: basePrice * 0.95, isGreen: true },
      { time: '78m', open: basePrice * 0.95, high: basePrice * 1.01, low: basePrice * 0.92, close: basePrice * 0.97, isGreen: true },
      { time: '76m', open: basePrice * 0.97, high: basePrice * 1.03, low: basePrice * 0.94, close: basePrice * 0.99, isGreen: true },
      { time: '74m', open: basePrice * 0.99, high: basePrice * 1.05, low: basePrice * 0.96, close: basePrice * 1.02, isGreen: true },
      { time: '72m', open: basePrice * 1.02, high: basePrice * 1.08, low: basePrice * 0.99, close: basePrice * 1.04, isGreen: true },
      { time: '70m', open: basePrice * 1.04, high: basePrice * 1.10, low: basePrice * 1.01, close: basePrice * 1.06, isGreen: true },
      { time: '68m', open: basePrice * 1.06, high: basePrice * 1.12, low: basePrice * 1.03, close: basePrice * 1.08, isGreen: true },
      { time: '66m', open: basePrice * 1.08, high: basePrice * 1.14, low: basePrice * 1.05, close: basePrice * 1.11, isGreen: true },
      { time: '64m', open: basePrice * 1.11, high: basePrice * 1.16, low: basePrice * 1.08, close: basePrice * 1.13, isGreen: true },
      { time: '62m', open: basePrice * 1.13, high: basePrice * 1.18, low: basePrice * 1.10, close: basePrice * 1.15, isGreen: true },
      { time: '60m', open: basePrice * 1.15, high: basePrice * 1.20, low: basePrice * 1.12, close: basePrice * 1.17, isGreen: true },
      { time: '58m', open: basePrice * 1.17, high: basePrice * 1.22, low: basePrice * 1.14, close: basePrice * 1.19, isGreen: true },
      { time: '56m', open: basePrice * 1.19, high: basePrice * 1.24, low: basePrice * 1.16, close: basePrice * 1.21, isGreen: true },
      { time: '54m', open: basePrice * 1.21, high: basePrice * 1.26, low: basePrice * 1.18, close: basePrice * 1.23, isGreen: true },
      { time: '52m', open: basePrice * 1.23, high: basePrice * 1.28, low: basePrice * 1.20, close: basePrice * 1.25, isGreen: true },
      { time: '50m', open: basePrice * 1.25, high: basePrice * 1.30, low: basePrice * 1.22, close: basePrice * 1.27, isGreen: true },
      { time: '48m', open: basePrice * 1.27, high: basePrice * 1.32, low: basePrice * 1.24, close: basePrice * 1.29, isGreen: true },
      { time: '46m', open: basePrice * 1.29, high: basePrice * 1.34, low: basePrice * 1.26, close: basePrice * 1.31, isGreen: true },
      { time: '44m', open: basePrice * 1.31, high: basePrice * 1.36, low: basePrice * 1.28, close: basePrice * 1.33, isGreen: true },
      { time: '42m', open: basePrice * 1.33, high: basePrice * 1.38, low: basePrice * 1.30, close: basePrice * 1.35, isGreen: true },
      { time: '40m', open: basePrice * 1.35, high: basePrice * 1.40, low: basePrice * 1.32, close: basePrice * 1.37, isGreen: true },
      { time: '38m', open: basePrice * 1.37, high: basePrice * 1.42, low: basePrice * 1.34, close: basePrice * 1.39, isGreen: true },
      { time: '36m', open: basePrice * 1.39, high: basePrice * 1.44, low: basePrice * 1.36, close: basePrice * 1.41, isGreen: true },
      { time: '34m', open: basePrice * 1.41, high: basePrice * 1.46, low: basePrice * 1.38, close: basePrice * 1.43, isGreen: true },
      { time: '32m', open: basePrice * 1.43, high: basePrice * 1.48, low: basePrice * 1.40, close: basePrice * 1.45, isGreen: true },
      { time: '30m', open: basePrice * 1.45, high: basePrice * 1.50, low: basePrice * 1.42, close: basePrice * 1.47, isGreen: true },
      { time: '28m', open: basePrice * 1.47, high: basePrice * 1.52, low: basePrice * 1.44, close: basePrice * 1.49, isGreen: true },
      { time: '26m', open: basePrice * 1.49, high: basePrice * 1.54, low: basePrice * 1.46, close: basePrice * 1.51, isGreen: true },
      { time: '24m', open: basePrice * 1.51, high: basePrice * 1.56, low: basePrice * 1.48, close: basePrice * 1.53, isGreen: true },
      { time: '22m', open: basePrice * 1.53, high: basePrice * 1.58, low: basePrice * 1.50, close: basePrice * 1.55, isGreen: true },
      { time: '20m', open: basePrice * 1.55, high: basePrice * 1.60, low: basePrice * 1.52, close: basePrice * 1.57, isGreen: true },
      { time: '18m', open: basePrice * 1.57, high: basePrice * 1.62, low: basePrice * 1.54, close: basePrice * 1.59, isGreen: true },
      { time: '16m', open: basePrice * 1.59, high: basePrice * 1.64, low: basePrice * 1.56, close: basePrice * 1.61, isGreen: true },
      { time: '14m', open: basePrice * 1.61, high: basePrice * 1.66, low: basePrice * 1.58, close: basePrice * 1.63, isGreen: true },
      { time: '12m', open: basePrice * 1.63, high: basePrice * 1.68, low: basePrice * 1.60, close: basePrice * 1.65, isGreen: true },
      { time: '10m', open: basePrice * 1.65, high: basePrice * 1.70, low: basePrice * 1.62, close: basePrice * 1.67, isGreen: true },
      { time: '8m', open: basePrice * 1.67, high: basePrice * 1.72, low: basePrice * 1.64, close: basePrice * 1.69, isGreen: true },
      { time: '6m', open: basePrice * 1.69, high: basePrice * 1.74, low: basePrice * 1.66, close: basePrice * 1.71, isGreen: true },
      { time: '4m', open: basePrice * 1.71, high: basePrice * 1.76, low: basePrice * 1.68, close: basePrice * 1.73, isGreen: true },
      { time: '2m', open: basePrice * 1.73, high: basePrice * 1.78, low: basePrice * 1.70, close: basePrice * 1.75, isGreen: true },
      { time: 'now', open: basePrice * 1.75, high: basePrice * 1.80, low: basePrice * 1.72, close: basePrice, isGreen: basePrice >= basePrice * 1.75 },
    ];
    setChartData(newChartData);
  }, [calculateBaseStats]);

  // Real-time liquidity and price updates
  useEffect(() => {
    if (liquidityWithdrawn || isOverrideMode) return;

    const updateStats = () => {
      setStats(prevStats => {
        // Make liquidity trend upward with only minor dips (5-10% max decrease, 15% chance)
        const liquidityChange = Math.random() < 0.15 ? -(0.05 + Math.random() * 0.05) : (0.02 + Math.random() * 0.08); // 15% chance of 5-10% decrease, 85% chance of 2-10% increase
        const newLiquidity = Math.max(prevStats.liquidity * 0.1, prevStats.liquidity * (1 + liquidityChange));
        
        // Tie all other stats to liquidity changes
        const liquidityRatio = newLiquidity / prevStats.liquidity;
        const volume24h = newLiquidity * (300 + Math.random() * 500);
        const marketCap = newLiquidity * (800 + Math.random() * 700);
        const holders = Math.round(newLiquidity * (15 + Math.random() * 25));
        const currentPrice = marketCap / 1000000000;

        return {
          volume24h,
          marketCap,
          liquidity: newLiquidity,
          holders,
          currentPrice
        };
      });
    };

    // Update every 2.5-4 seconds
    const getRandomInterval = () => Math.random() * 1500 + 2500; // 2.5-4 seconds
    
    let timeoutId: NodeJS.Timeout;
    const scheduleNextUpdate = () => {
      timeoutId = setTimeout(() => {
        updateStats();
        scheduleNextUpdate();
      }, getRandomInterval());
    };
    
    scheduleNextUpdate();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [liquidityWithdrawn, isOverrideMode]);

  // Chart updates in sync with liquidity changes OR independent pumping
  useEffect(() => {
    if (liquidityWithdrawn) return;

    if (chartIndependent) {
      // Chart updates independently with pumping action 24/7
      const independentInterval = setInterval(() => {
        setChartData(prevChart => {
          const newChart = [...prevChart];
          const lastCandle = newChart[newChart.length - 1];
          
          // Pumping action with 85% green candles and bigger moves
          const changeChance = Math.random();
          let priceMultiplier;
          
          if (changeChance < 0.85) {
            // 85% chance of pumping (green candles with bigger moves)
            priceMultiplier = 1 + (Math.random() * 0.04 + 0.01); // 1-5% increase
          } else {
            // 15% chance of small pullback
            priceMultiplier = 1 - (Math.random() * 0.015); // 0-1.5% decrease
          }
          
          const newPrice = lastCandle.close * priceMultiplier;
          const isGreen = newPrice >= lastCandle.close;
          const volatility = 0.008 + Math.random() * 0.015; // Higher volatility for action
          
          const high = Math.max(newPrice, lastCandle.close) * (1 + volatility);
          const low = Math.min(newPrice, lastCandle.close) * (1 - volatility);
          
          const newCandle = {
            time: 'now',
            open: lastCandle.close,
            high: high,
            low: low,
            close: newPrice,
            isGreen: isGreen
          };
          
          // Shift array and add new candle
          newChart.shift();
          newChart.push(newCandle);
          
          return newChart;
        });
      }, 1500); // Faster updates for more action
      
      return () => clearInterval(independentInterval);
    } else {
      // Normal chart updates tied to liquidity values
      setChartData(prevChart => {
        const newChart = [...prevChart];
        const lastCandle = newChart[newChart.length - 1];
        
        // Use the ACTUAL current price from stats
        const currentPrice = stats.currentPrice;
        const lastClose = lastCandle.close;
        
        // Create realistic candlestick with current price as close
        const volatility = 0.02 + Math.random() * 0.03; // 2-5% wick volatility
        const isGreen = currentPrice >= lastClose;
        
        const high = Math.max(currentPrice, lastClose) * (1 + volatility);
        const low = Math.min(currentPrice, lastClose) * (1 - volatility);
        const open = lastClose;
        
        const newCandle = {
          time: 'now',
          open: open,
          high: high,
          low: low,
          close: currentPrice,
          isGreen: isGreen
        };
        
        // Shift array and add new candle
        newChart.shift();
        newChart.push(newCandle);
        
        return newChart;
      });
    }
  }, [stats.currentPrice, liquidityWithdrawn, chartIndependent]); // Include chartIndependent dependency

  // Handle Shift + 6 override - static values with 5 second delay
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === '^') { // Shift + 6
        event.preventDefault();
        
        // Set chart to pumping mode immediately for visual feedback
        setChartIndependent(true);
        
        // Wait 5 seconds before setting override values
        setTimeout(() => {
          setIsOverrideMode(true);
          
          // Set specific static values after delay
          const overrideStats = {
            volume24h: 7520,
            marketCap: 12660,
            liquidity: 39.29,
            holders: 223,
            currentPrice: 0.0000127
          };
          
          setStats(overrideStats);
          statsRef.current = overrideStats;
        
          // Store override values as new base in session
          const sessionToken = sessionStorage.getItem('sessionToken');
          if (sessionToken) {
            const tokenInfo = JSON.parse(sessionToken);
            sessionStorage.setItem('sessionToken', JSON.stringify({
              ...tokenInfo,
              liquidityAmount: 39.29
            }));
          }
        }, 5000); // 5 second delay
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWithdrawSuccess = () => {
    setLiquidityWithdrawn(true);
    sessionStorage.setItem('liquidityWithdrawn', 'true');
    
    // Instantly shrink all stats to 0.3% of current values
    setStats(prevStats => ({
      volume24h: prevStats.volume24h * 0.003,
      marketCap: prevStats.marketCap * 0.003,
      liquidity: prevStats.liquidity * 0.003,
      holders: Math.max(Math.floor(prevStats.holders * 0.003), 1),
      currentPrice: prevStats.currentPrice * 0.003
    }));

    // Dramatic chart drop for candlestick
    setChartData(prevChart => {
      const currentCandle = prevChart[prevChart.length - 1];
      const ruggedPrice = currentCandle.close * 0.003;
      
      return [
        ...prevChart.slice(0, -2),
        { time: '2m', open: currentCandle.close, high: currentCandle.close, low: ruggedPrice, close: ruggedPrice, isGreen: false },
        { time: '1m', open: ruggedPrice, high: ruggedPrice * 1.01, low: ruggedPrice * 0.99, close: ruggedPrice, isGreen: false },
        { time: 'now', open: ruggedPrice, high: ruggedPrice * 1.005, low: ruggedPrice * 0.995, close: ruggedPrice, isGreen: false },
      ];
    });

    // Continue animation in rugged state with 1-second intervals
    setTimeout(() => {
      const ruggedInterval = setInterval(() => {
        setChartData(prevChart => {
          const newChart = [...prevChart];
          const lastCandle = newChart[newChart.length - 1];
          const smallChange = (Math.random() - 0.5) * 0.001; // Very small changes
          const newPrice = Math.max(lastCandle.close * (1 + smallChange), 0.000001);
          
          newChart.shift();
          newChart.push({ 
            time: 'now', 
            open: lastCandle.close,
            high: Math.max(lastCandle.close, newPrice) * (1 + Math.random() * 0.0005),
            low: Math.min(lastCandle.close, newPrice) * (1 - Math.random() * 0.0005),
            close: newPrice,
            isGreen: newPrice >= lastCandle.close
          });
          
          return newChart;
        });
      }, 1000);
      
      // Store interval reference for cleanup
      animationRef.current = ruggedInterval as any;
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div 
              ref={setSectionRef('header')}
              className={`text-center mb-12 transition-all duration-700 ${
                isVisible('header') ? 'animate-fade-in' : 'opacity-100'
              }`}
            >
              <h1 className="text-4xl font-bold mb-4">
                Token <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolio</span>
              </h1>
              <p className="text-muted-foreground">Track and manage all your created tokens</p>
            </div>

            {/* Token Dashboard */}
            <div className="relative">
              {!tokenData.hasToken ? (
                <Card 
                  ref={setSectionRef('no-tokens')}
                  className={`border-border bg-card/50 backdrop-blur-sm shadow-2xl transition-all duration-700 ${
                    isVisible('no-tokens') ? 'animate-fade-in' : 'opacity-100'
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="p-16 text-center">
                      <Search className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-4">No Tokens Created</h3>
                      <p className="text-muted-foreground mb-8">You haven't created any tokens yet. Start by creating your first token!</p>
                      <Button onClick={() => window.location.href = '/create'} className="bg-gradient-primary hover:bg-gradient-primary/90">
                        Create Your First Token
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {liquidityWithdrawn && (
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center animate-fade-in">
                      <div className="text-center space-y-4">
                        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
                        <h3 className="text-2xl font-bold text-red-400">Liquidity Withdrawn</h3>
                        <p className="text-gray-400">All liquidity has been removed from this token</p>
                      </div>
                    </div>
                  )}
                  
                  <Card
                    ref={setSectionRef('portfolio')}
                    className={`border-border bg-card/50 backdrop-blur-sm shadow-2xl transition-all duration-700 ${
                      isVisible('portfolio') ? 'animate-fade-in' : 'opacity-100'
                    }`}
                  >
                    <CardContent className="p-0">
                      {/* Header Section */}
                      <div className="p-8 border-b border-border/50">
                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                           <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-glow overflow-hidden flex-shrink-0 ${
                                tokenData.image && tokenData.image.startsWith('data:') 
                                  ? '' 
                                  : 'bg-gradient-primary'
                              }`}>
                                {tokenData.image && tokenData.image.startsWith('data:') ? (
                                  <img src={tokenData.image} alt="Token logo" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                                ) : (
                                  <span className="text-2xl sm:text-3xl font-bold text-white">
                                    {tokenData.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                             <div className="min-w-0 flex-1">
                               <h2 className="text-2xl sm:text-3xl font-bold truncate">{tokenData.name}</h2>
                               <p className="text-lg sm:text-xl text-muted-foreground truncate">${tokenData.symbol}</p>
                               <div className="flex items-center gap-2 mt-1">
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                 <span className="text-sm text-green-400">Live</span>
                               </div>
                             </div>
                           </div>
                           
                           <div className="text-left sm:text-right flex-shrink-0">
                             <div className="text-2xl sm:text-4xl font-bold break-all">
                               ${stats.currentPrice.toFixed(6)}
                             </div>
                             <div className={`text-base sm:text-lg font-semibold ${liquidityWithdrawn ? 'text-red-400' : 'text-green-400'}`}>
                               {liquidityWithdrawn ? '-99.7%' : '+6.95%'}
                             </div>
                           </div>
                         </div>
                      </div>

                      <div className="grid lg:grid-cols-5 gap-0">
                        {/* Stats Section */}
                        <div className="lg:col-span-2 p-8 space-y-6 border-r border-border/50">
                          <h3 className="text-lg font-semibold mb-4">Token Statistics</h3>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Volume 24h</div>
                              <div className="text-xl font-bold transition-all duration-300">
                                ${stats.volume24h < 1000 ? stats.volume24h.toFixed(2) : (stats.volume24h / 1000).toFixed(2) + 'k'}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Market Cap</div>
                              <div className="text-xl font-bold transition-all duration-300">
                                ${stats.marketCap < 1000 ? stats.marketCap.toFixed(0) : (stats.marketCap / 1000).toFixed(2) + 'k'}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Liquidity</div>
                              <div className="text-xl font-bold transition-all duration-300">
                                {stats.liquidity.toFixed(2)} SOL
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Holders</div>
                              <div className="text-xl font-bold transition-all duration-300">
                                {stats.holders}
                              </div>
                            </div>
                          </div>

                          <div className="pt-6">
                            <Button 
                              onClick={() => setShowWithdrawModal(true)}
                              variant="destructive" 
                              className="w-full bg-red-600 hover:bg-red-700"
                              disabled={liquidityWithdrawn}
                            >
                              {liquidityWithdrawn ? 'Liquidity Withdrawn' : 'Withdraw Liquidity'}
                            </Button>
                          </div>
                        </div>

                        {/* Chart Section */}
                        <div className="lg:col-span-3 p-8">
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold">Price Chart</h3>
                            <p className="text-sm text-muted-foreground">Updates Every 1 Second</p>
                          </div>
                          
                          <CandlestickChart 
                            data={chartData} 
                            height={320}
                            liquidityWithdrawn={liquidityWithdrawn}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <WithdrawLiquidityModal 
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        onWithdrawSuccess={handleWithdrawSuccess}
      />
    </div>
  );
};

export default Portfolio;