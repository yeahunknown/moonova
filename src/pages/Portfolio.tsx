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
    const volume24h = liquidityAmount * (80 + Math.random() * 120);
    const marketCap = liquidityAmount * (150 + Math.random() * 250);
    const holders = Math.round(liquidityAmount * (1 + Math.random() * 3));
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
    const marketCap = liquidityAmount * (150 + Math.random() * 250);
    const basePrice = marketCap / 1000000000;
    
    return [
      { time: '20m', open: basePrice * 0.35, high: basePrice * 0.40, low: basePrice * 0.34, close: basePrice * 0.37, isGreen: true },
      { time: '18m', open: basePrice * 0.37, high: basePrice * 0.43, low: basePrice * 0.36, close: basePrice * 0.40, isGreen: true },
      { time: '16m', open: basePrice * 0.40, high: basePrice * 0.50, low: basePrice * 0.39, close: basePrice * 0.48, isGreen: true },
      { time: '14m', open: basePrice * 0.48, high: basePrice * 0.49, low: basePrice * 0.42, close: basePrice * 0.45, isGreen: false },
      { time: '12m', open: basePrice * 0.45, high: basePrice * 0.65, low: basePrice * 0.44, close: basePrice * 0.62, isGreen: true },
      { time: '10m', open: basePrice * 0.62, high: basePrice * 0.63, low: basePrice * 0.55, close: basePrice * 0.58, isGreen: false },
      { time: '8m', open: basePrice * 0.58, high: basePrice * 0.72, low: basePrice * 0.57, close: basePrice * 0.70, isGreen: true },
      { time: '6m', open: basePrice * 0.70, high: basePrice * 0.71, low: basePrice * 0.65, close: basePrice * 0.67, isGreen: false },
      { time: '4m', open: basePrice * 0.67, high: basePrice * 0.83, low: basePrice * 0.66, close: basePrice * 0.81, isGreen: true },
      { time: '2m', open: basePrice * 0.81, high: basePrice * 0.92, low: basePrice * 0.80, close: basePrice * 0.91, isGreen: true },
      { time: 'now', open: basePrice * 0.91, high: basePrice * 1.02, low: basePrice * 0.90, close: basePrice, isGreen: true },
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
    // Volume 24h: much higher - random between liquidity * 80 and liquidity * 200
    const volume24h = liquiditySOL * (80 + Math.random() * 120);
    
    // Market Cap: random between liquidity * 150 and liquidity * 400
    const marketCap = liquiditySOL * (150 + Math.random() * 250);
    
    // Holders: random between liquidity * 1 and liquidity * 4
    const holders = Math.round(liquiditySOL * (1 + Math.random() * 3));
    
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
      { time: '20m', open: basePrice * 0.35, high: basePrice * 0.40, low: basePrice * 0.34, close: basePrice * 0.37, isGreen: true },
      { time: '18m', open: basePrice * 0.37, high: basePrice * 0.43, low: basePrice * 0.36, close: basePrice * 0.40, isGreen: true },
      { time: '16m', open: basePrice * 0.40, high: basePrice * 0.50, low: basePrice * 0.39, close: basePrice * 0.48, isGreen: true },
      { time: '14m', open: basePrice * 0.48, high: basePrice * 0.49, low: basePrice * 0.42, close: basePrice * 0.45, isGreen: false },
      { time: '12m', open: basePrice * 0.45, high: basePrice * 0.65, low: basePrice * 0.44, close: basePrice * 0.62, isGreen: true },
      { time: '10m', open: basePrice * 0.62, high: basePrice * 0.63, low: basePrice * 0.55, close: basePrice * 0.58, isGreen: false },
      { time: '8m', open: basePrice * 0.58, high: basePrice * 0.72, low: basePrice * 0.57, close: basePrice * 0.70, isGreen: true },
      { time: '6m', open: basePrice * 0.70, high: basePrice * 0.71, low: basePrice * 0.65, close: basePrice * 0.67, isGreen: false },
      { time: '4m', open: basePrice * 0.67, high: basePrice * 0.83, low: basePrice * 0.66, close: basePrice * 0.81, isGreen: true },
      { time: '2m', open: basePrice * 0.81, high: basePrice * 0.92, low: basePrice * 0.80, close: basePrice * 0.91, isGreen: true },
      { time: 'now', open: basePrice * 0.91, high: basePrice * 1.02, low: basePrice * 0.90, close: basePrice, isGreen: true },
    ];
    setChartData(newChartData);
  }, [calculateBaseStats]);

  // Real-time liquidity and price updates
  useEffect(() => {
    if (liquidityWithdrawn) return;

    const updateStats = () => {
      setStats(prevStats => {
        // Make liquidity fluctuate by roughly 25% of current value (random and realistic)
        const liquidityChange = (Math.random() - 0.3) * 0.25; // Bias towards increase (-0.3 to +0.7)
        const newLiquidity = Math.max(0.1, prevStats.liquidity * (1 + liquidityChange));
        
        // Tie all other stats to liquidity changes
        const liquidityRatio = newLiquidity / prevStats.liquidity;
        const volume24h = newLiquidity * (80 + Math.random() * 120);
        const marketCap = newLiquidity * (150 + Math.random() * 250);
        const holders = Math.round(newLiquidity * (1 + Math.random() * 3));
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

  // Chart updates in sync with liquidity changes
  useEffect(() => {
    if (liquidityWithdrawn) return;

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
  }, [stats.currentPrice, liquidityWithdrawn]); // Only update when price changes!

  // Handle Shift + 6 override with 5-second delay
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === '^') { // Shift + 6
        event.preventDefault();
        setIsOverrideMode(true);
        
        // 5-second delay before applying override values
        setTimeout(() => {
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
          
          // DO NOT update chart data here - let it continue pumping normally
        }, 5000);
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow overflow-hidden ${
                               tokenData.image && tokenData.image.startsWith('data:') 
                                 ? '' 
                                 : 'bg-gradient-primary'
                             }`}>
                               {tokenData.image && tokenData.image.startsWith('data:') ? (
                                 <img src={tokenData.image} alt="Token logo" className="w-20 h-20 object-contain" />
                               ) : (
                                 <span className="text-3xl font-bold text-white">
                                   {tokenData.name.charAt(0).toUpperCase()}
                                 </span>
                               )}
                             </div>
                            <div>
                              <h2 className="text-3xl font-bold">{tokenData.name}</h2>
                              <p className="text-xl text-muted-foreground">${tokenData.symbol}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-green-400">Live</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-4xl font-bold">
                              ${stats.currentPrice.toFixed(6)}
                            </div>
                            <div className={`text-lg font-semibold ${liquidityWithdrawn ? 'text-red-400' : 'text-green-400'}`}>
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