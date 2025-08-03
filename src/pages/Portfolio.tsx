import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";
import { WithdrawLiquidityModal } from "@/components/modals/WithdrawLiquidityModal";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Search } from "lucide-react";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";

const Portfolio = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [liquidityWithdrawn, setLiquidityWithdrawn] = useState(() => {
    return sessionStorage.getItem('liquidityWithdrawn') === 'true';
  });
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const { setSectionRef, isVisible } = useFadeInAnimation();
  
  // Dynamic stats based on liquidity
  const [stats, setStats] = useState({
    volume24h: 0,
    marketCap: 0,
    liquidity: 0,
    holders: 0,
    currentPrice: 0.000001
  });

  const [chartData, setChartData] = useState([
    { time: '6h', price: 0.000001 },
    { time: '5h', price: 0.000001 },
    { time: '4h', price: 0.000001 },
    { time: '3h', price: 0.000001 },
    { time: '2h', price: 0.000001 },
    { time: '1h', price: 0.000001 },
    { time: '30m', price: 0.000001 },
    { time: '15m', price: 0.000001 },
    { time: '5m', price: 0.000001 },
    { time: 'now', price: 0.000001 },
  ]);

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
        hasToken: true
      };
    } else if (liquidityData) {
      const liquidity = JSON.parse(liquidityData);
      return {
        name: liquidity.tokenName || 'DEMO Token',
        symbol: liquidity.tokenSymbol || 'DEMO',
        image: '/placeholder-token.png',
        hasToken: true
      };
    }
    
    return {
      name: '',
      symbol: '',
      image: '',
      hasToken: false
    };
  });

  // Calculate base stats from liquidity with updated formulas
  const calculateBaseStats = useCallback((liquiditySOL: number) => {
    // Volume 24h: random between liquidity * 12 and liquidity * 30
    const volume24h = liquiditySOL * (12 + Math.random() * 18);
    
    // Market Cap: random between liquidity * 9,000 and liquidity * 11,500
    const marketCap = liquiditySOL * (9000 + Math.random() * 2500);
    
    // Holders: random whole number between liquidity * 6 and liquidity * 14
    const holders = Math.round(liquiditySOL * (6 + Math.random() * 8));
    
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

    // Initialize chart with smooth progression
    const basePrice = baseStats.currentPrice;
    const newChartData = [
      { time: '6h', price: basePrice * 0.47 },
      { time: '5h', price: basePrice * 0.50 },
      { time: '4h', price: basePrice * 0.58 },
      { time: '3h', price: basePrice * 0.55 },
      { time: '2h', price: basePrice * 0.72 },
      { time: '1h', price: basePrice * 0.68 },
      { time: '30m', price: basePrice * 0.80 },
      { time: '15m', price: basePrice * 0.77 },
      { time: '5m', price: basePrice * 0.91 },
      { time: 'now', price: basePrice },
    ];
    setChartData(newChartData);
  }, [calculateBaseStats]);

  // Real-time stats updates with realistic wobbles
  useEffect(() => {
    if (liquidityWithdrawn) return;

    const updateStats = () => {
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

      if (!isOverrideMode) {
        // Calculate fresh values from liquidity with small wobbles
        const wobble = () => 0.95 + Math.random() * 0.1; // ±5% wobble
        
        const volume24h = liquidityAmount * (12 + Math.random() * 18) * wobble();
        const marketCap = liquidityAmount * (9000 + Math.random() * 2500) * wobble();
        const holders = Math.round(liquidityAmount * (6 + Math.random() * 8) * wobble());
        const currentPrice = marketCap / 1000000000;

        setStats({
          volume24h,
          marketCap,
          liquidity: liquidityAmount,
          holders,
          currentPrice
        });
      }
    };

    // Update stats every 1-2 seconds
    const getRandomInterval = () => Math.random() * 1000 + 1000; // 1-2 seconds
    
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

    // Dramatic chart drop
    setChartData(prevChart => {
      const currentPrice = prevChart[prevChart.length - 1].price;
      const ruggedPrice = currentPrice * 0.003;
      
      return [
        ...prevChart.slice(0, -2),
        { time: '2m', price: currentPrice },
        { time: '1m', price: ruggedPrice },
        { time: 'now', price: ruggedPrice },
      ];
    });

    // Continue animation in rugged state with 1-second intervals
    setTimeout(() => {
      const ruggedInterval = setInterval(() => {
        setChartData(prevChart => {
          const newChart = [...prevChart];
          const lastPrice = newChart[newChart.length - 1].price;
          const smallChange = (Math.random() - 0.5) * 0.001; // Very small changes
          const newPrice = Math.max(lastPrice * (1 + smallChange), 0.000001);
          
          newChart.shift();
          newChart.push({ time: 'now', price: newPrice });
          
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
                            <p className="text-sm text-muted-foreground">Last 6 hours</p>
                          </div>
                          
                          <div className="h-80 w-full bg-gradient-to-b from-background/50 to-transparent rounded-lg p-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <XAxis 
                                  dataKey="time" 
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: '#666', fontSize: 12 }}
                                />
                                <YAxis 
                                  hide 
                                  domain={['dataMin - 0.01', 'dataMax + 0.01']}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="price" 
                                  stroke={liquidityWithdrawn ? "#ef4444" : "#00ff9d"} 
                                  strokeWidth={3}
                                  dot={false}
                                  strokeDasharray={liquidityWithdrawn ? "0" : "0"}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
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