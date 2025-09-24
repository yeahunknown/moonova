import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface TokenStat {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

interface TokenStatsGridProps {
  stats: TokenStat[];
  isVisible?: boolean;
}

const TokenStatsGrid: React.FC<TokenStatsGridProps> = ({ stats, isVisible = true }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <motion.p 
                  className="text-lg font-bold"
                  key={stat.value}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.value}
                </motion.p>
                {stat.change && (
                  <p className={`text-xs ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TokenStatsGrid;