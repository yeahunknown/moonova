import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";
import { WithdrawLiquidityModal } from "@/components/modals/WithdrawLiquidityModal";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from "lucide-react";

const Portfolio = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [liquidityWithdrawn, setLiquidityWithdrawn] = useState(false);
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  
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

  // Get token data from localStorage (from token creation)
  const [tokenData, setTokenData] = useState(() => {
    const stored = localStorage.getItem('createdToken');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      name: 'asdas',
      symbol: 'ASDA',
      image: '/lovable-uploads/3fab2cd3-3a3b-446e-a166-a82e90c2cb60.png'
    };
  });

  // Calculate base stats from liquidity
  const calculateBaseStats = useCallback((liquiditySOL: number) => {
    const basePrice = Math.max(liquiditySOL * 0.001, 0.000001);
    return {
      volume24h: liquiditySOL * 18.9,
      marketCap: liquiditySOL * 10000,
      liquidity: liquiditySOL,
      holders: Math.floor(liquiditySOL * 2.8) + 15,
      currentPrice: basePrice
    };
  }, []);

  // Initialize stats from stored liquidity
  useEffect(() => {
    const storedLiquidity = localStorage.getItem('addedLiquidity');
    const liquidityAmount = storedLiquidity ? parseFloat(storedLiquidity) : 1.0;
    
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

  // Continuous animation for stats and chart
  useEffect(() => {
    if (liquidityWithdrawn) return;

    const animate = () => {
      setStats(prevStats => {
        const now = Date.now();
        const variation = 0.02; // 2% variation
        
        const newStats = {
          volume24h: prevStats.volume24h * (1 + (Math.sin(now * 0.001) * variation)),
          marketCap: prevStats.marketCap * (1 + (Math.sin(now * 0.0008) * variation)),
          liquidity: prevStats.liquidity * (1 + (Math.sin(now * 0.0012) * variation * 0.5)),
          holders: Math.floor(prevStats.holders * (1 + (Math.sin(now * 0.0006) * variation * 0.3))),
          currentPrice: prevStats.currentPrice * (1 + (Math.sin(now * 0.0015) * variation))
        };
        
        return newStats;
      });

      // Update chart data smoothly
      setChartData(prevChart => {
        const newChart = [...prevChart];
        const lastPrice = newChart[newChart.length - 1].price;
        const priceChange = (Math.random() - 0.5) * 0.02; // ±1% change
        const newPrice = Math.max(lastPrice * (1 + priceChange), 0.000001);
        
        // Shift data and add new point
        newChart.shift();
        newChart.push({ time: 'now', price: newPrice });
        
        return newChart;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [liquidityWithdrawn]);

  // Handle Shift + 6 override
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === '^') { // Shift + 6
        event.preventDefault();
        setIsOverrideMode(true);
        
        const overrideStats = {
          volume24h: 7520,
          marketCap: 12660,
          liquidity: 39.29,
          holders: 223,
          currentPrice: 0.088503
        };
        
        setStats(overrideStats);
        statsRef.current = overrideStats;
        
        // Store override values as new base
        localStorage.setItem('addedLiquidity', '39.29');
        
        // Update chart to match new values
        const newChartData = [
          { time: '6h', price: 0.0421 },
          { time: '5h', price: 0.0445 },
          { time: '4h', price: 0.0512 },
          { time: '3h', price: 0.0489 },
          { time: '2h', price: 0.0634 },
          { time: '1h', price: 0.0598 },
          { time: '30m', price: 0.0712 },
          { time: '15m', price: 0.0685 },
          { time: '5m', price: 0.0803 },
          { time: 'now', price: 0.088503 },
        ];
        setChartData(newChartData);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWithdrawSuccess = () => {
    setLiquidityWithdrawn(true);
    
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

    // Continue animation in rugged state
    setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      const animateRugged = () => {
        setChartData(prevChart => {
          const newChart = [...prevChart];
          const lastPrice = newChart[newChart.length - 1].price;
          const smallChange = (Math.random() - 0.5) * 0.001; // Very small changes
          const newPrice = Math.max(lastPrice * (1 + smallChange), 0.000001);
          
          newChart.shift();
          newChart.push({ time: 'now', price: newPrice });
          
          return newChart;
        });

        animationRef.current = requestAnimationFrame(animateRugged);
      };
      
      animationRef.current = requestAnimationFrame(animateRugged);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Token <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolio</span>
              </h1>
              <p className="text-muted-foreground">Track and manage all your created tokens</p>
            </div>

            {/* Token Dashboard */}
            <div className="relative">
              {liquidityWithdrawn && (
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center animate-fade-in">
                  <div className="text-center space-y-4">
                    <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
                    <h3 className="text-2xl font-bold text-red-400">Liquidity Withdrawn</h3>
                    <p className="text-gray-400">All liquidity has been removed from this token</p>
                  </div>
                </div>
              )}
              
              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className="p-8 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                          <span className="text-3xl font-bold text-white">
                            {tokenData.name.charAt(0).toUpperCase()}
                          </span>
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