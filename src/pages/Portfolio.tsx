import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { WithdrawLiquidityModal } from "@/components/modals/WithdrawLiquidityModal";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Portfolio = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [chartData, setChartData] = useState([
    { time: '00:00', price: 45 },
    { time: '04:00', price: 52 },
    { time: '08:00', price: 48 },
    { time: '12:00', price: 61 },
    { time: '16:00', price: 55 },
    { time: '20:00', price: 67 },
    { time: '24:00', price: 58 },
  ]);

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

  const handleWithdrawSuccess = () => {
    // Simulate liquidity being pulled - chart crashes down
    setChartData([
      { time: '00:00', price: 45 },
      { time: '04:00', price: 52 },
      { time: '08:00', price: 48 },
      { time: '12:00', price: 61 },
      { time: '16:00', price: 55 },
      { time: '20:00', price: 67 },
      { time: '21:00', price: 58 },
      { time: '21:30', price: 12 },
      { time: '22:00', price: 5 },
      { time: '22:30', price: 2 },
      { time: '23:00', price: 1 },
      { time: '24:00', price: 0.5 },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Token <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolio</span>
              </h1>
              <p className="text-muted-foreground">Track and manage all your created tokens</p>
            </div>

            {/* Token Dashboard */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Token Info Section */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {tokenData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{tokenData.name}</h2>
                        <p className="text-muted-foreground">${tokenData.symbol}</p>
                        <p className="text-sm text-muted-foreground">884.14 SOL</p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Price</span>
                        <div className="text-right">
                          <div className="font-semibold">$0.088503</div>
                          <div className="text-sm text-green-400">+6.95%</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Volume 24h</span>
                        <div className="font-semibold">$16,807</div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Market Cap</span>
                        <div className="font-semibold">$885,026</div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Liquidity</span>
                        <div className="font-semibold">884.14 SOL</div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setShowWithdrawModal(true)}
                      variant="destructive" 
                      className="w-full"
                    >
                      Withdraw Liquidity
                    </Button>
                  </div>

                  {/* Chart Section */}
                  <div className="lg:col-span-2">
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis 
                            dataKey="time" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                          />
                          <YAxis hide />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#00ff9d" 
                            strokeWidth={2}
                            dot={false}
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

      <WithdrawLiquidityModal 
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        onWithdrawSuccess={handleWithdrawSuccess}
      />
    </div>
  );
};

export default Portfolio;