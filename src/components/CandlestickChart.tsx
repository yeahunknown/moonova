import React from 'react';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  isGreen: boolean;
}

interface CandlestickChartProps {
  data: CandleData[];
  height?: number;
  liquidityWithdrawn?: boolean;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  data, 
  height = 320, 
  liquidityWithdrawn = false 
}) => {
  if (!data || data.length === 0) return null;

  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const priceRange = maxPrice - minPrice;
  const padding = 40;
  const chartHeight = height - padding * 2;
  const chartWidth = 800;
  const candleWidth = 8;
  const candleSpacing = 14;
  const totalCandleArea = data.length * candleSpacing;
  const startX = padding;

  const getY = (price: number) => {
    return padding + ((maxPrice - price) / priceRange) * chartHeight;
  };

  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-chart backdrop-blur-chart rounded-lg relative overflow-hidden ${liquidityWithdrawn ? 'animate-withdraw-crash' : ''}`}>
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-pulse-glow" />
      
      {/* Chart container with glass effect */}
      <div className="relative w-full h-full bg-card/20 backdrop-blur-sm border border-border/30 rounded-lg shadow-elegant">
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${chartWidth} ${height}`} 
          className="overflow-visible" 
          preserveAspectRatio="none"
        >
          {/* Enhanced grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, i) => {
            const y = padding + chartHeight * ratio;
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="hsl(var(--chart-grid))"
                strokeWidth="1"
                strokeDasharray="2,4"
                className="transition-all duration-300"
              />
            );
          })}
          
          {/* Candlesticks with enhanced styling */}
          {data.map((candle, index) => {
            const x = startX + index * candleSpacing + candleWidth / 2;
            const openY = getY(candle.open);
            const closeY = getY(candle.close);
            const highY = getY(candle.high);
            const lowY = getY(candle.low);
            
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(openY - closeY);
            const isGreen = candle.isGreen;
            const color = liquidityWithdrawn 
              ? 'hsl(var(--chart-red))' 
              : (isGreen ? 'hsl(var(--chart-green))' : 'hsl(var(--chart-red))');
            
            return (
              <g key={index} className="transition-all duration-300 ease-smooth">
                {/* Glow effect for candles */}
                <filter id={`glow-${index}`}>
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Upper wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={bodyTop}
                  stroke={color}
                  strokeWidth="1.5"
                  className="transition-all duration-300 ease-smooth"
                  style={{ filter: liquidityWithdrawn ? 'brightness(0.7)' : 'brightness(1)' }}
                />
                
                {/* Body with enhanced styling */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={Math.max(bodyHeight, 2)}
                  fill={color}
                  stroke={color}
                  strokeWidth="1"
                  className="transition-all duration-300 ease-smooth hover:animate-chart-bounce"
                  rx="1"
                  style={{ 
                    filter: liquidityWithdrawn ? 'brightness(0.7) saturate(0.5)' : 'brightness(1)',
                    boxShadow: isGreen && !liquidityWithdrawn ? `0 0 8px ${color}40` : 'none'
                  }}
                />
                
                {/* Lower wick */}
                <line
                  x1={x}
                  y1={bodyTop + bodyHeight}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1.5"
                  className="transition-all duration-300 ease-smooth"
                  style={{ filter: liquidityWithdrawn ? 'brightness(0.7)' : 'brightness(1)' }}
                />
              </g>
            );
          })}
          
          {/* Enhanced price labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const price = minPrice + (maxPrice - minPrice) * (1 - ratio);
            const y = padding + chartHeight * ratio;
            return (
              <text
                key={i}
                x={chartWidth - 30}
                y={y + 4}
                textAnchor="end"
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
                fontFamily="monospace"
                className="transition-all duration-300 hover:fill-foreground"
                style={{ 
                  textShadow: '0 0 4px hsl(var(--background))',
                  filter: liquidityWithdrawn ? 'brightness(0.6)' : 'brightness(1)'
                }}
              >
                ${price.toFixed(6)}
              </text>
            );
          })}
          
          {/* Crash overlay when liquidity withdrawn */}
          {liquidityWithdrawn && (
            <rect
              x={0}
              y={0}
              width={chartWidth}
              height={height}
              fill="hsl(var(--destructive) / 0.1)"
              className="animate-fade-in"
            />
          )}
        </svg>
        
        {/* Liquidity withdrawn warning */}
        {liquidityWithdrawn && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm animate-fade-in">
            <div className="bg-destructive/20 border border-destructive/50 rounded-lg px-4 py-2 backdrop-blur-sm">
              <p className="text-destructive-foreground text-sm font-semibold">
                ⚠️ Liquidity Withdrawn - Chart Crashed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandlestickChart;