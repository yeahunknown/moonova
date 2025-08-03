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
  const candleWidth = 12;
  const availableWidth = chartWidth - padding * 2;
  const candleSpacing = availableWidth / (data.length - 1);

  const getY = (price: number) => {
    return padding + ((maxPrice - price) / priceRange) * chartHeight;
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-background/50 to-transparent rounded-lg">
      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`} className="overflow-visible" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((ratio, i) => {
          const y = padding + chartHeight * ratio;
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="2,4"
            />
          );
        })}
        
        {/* Candlesticks */}
        {data.map((candle, index) => {
          const x = padding + index * candleSpacing;
          const openY = getY(candle.open);
          const closeY = getY(candle.close);
          const highY = getY(candle.high);
          const lowY = getY(candle.low);
          
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.abs(openY - closeY);
          const isGreen = candle.isGreen;
          const color = liquidityWithdrawn ? '#ff4444' : (isGreen ? '#00ff9d' : '#ff4444');
          
          return (
            <g key={index}>
              {/* Upper wick */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={bodyTop}
                stroke={color}
                strokeWidth="1"
                className="transition-all duration-200"
              />
              
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={Math.max(bodyHeight, 2)}
                fill={liquidityWithdrawn ? color : color}
                stroke={color}
                strokeWidth="1"
                className="transition-all duration-200"
                rx="0"
              />
              
              {/* Lower wick */}
              <line
                x1={x}
                y1={bodyTop + bodyHeight}
                x2={x}
                y2={lowY}
                stroke={color}
                strokeWidth="1"
                className="transition-all duration-200"
              />
              
              {/* Time label */}
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fill="#666"
                fontSize="10"
                fontFamily="monospace"
              >
                {candle.time}
              </text>
            </g>
          );
        })}
        
        {/* Price labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const price = minPrice + (maxPrice - minPrice) * (1 - ratio);
          const y = padding + chartHeight * ratio;
          return (
            <text
              key={i}
              x={chartWidth - 30}
              y={y + 4}
              textAnchor="end"
              fill="#666"
              fontSize="10"
              fontFamily="monospace"
            >
              ${price.toFixed(6)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default CandlestickChart;