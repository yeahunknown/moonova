"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Users, Coins, Rocket } from "lucide-react"

interface StatData {
  id: string
  label: string
  value: number
  formatter: (val: number) => string
  icon: React.ReactNode
  color: string
}

export function LiveStats() {
  const [stats, setStats] = useState<StatData[]>([
    {
      id: "tokens",
      label: "Total Tokens Created",
      value: 48654789,
      formatter: (val) => val.toLocaleString(),
      icon: <Coins className="h-4 w-4" />,
      color: "text-primary"
    },
    {
      id: "users",
      label: "Active Users",
      value: 127894,
      formatter: (val) => val.toLocaleString(),
      icon: <Users className="h-4 w-4" />,
      color: "text-accent"
    },
    {
      id: "volume",
      label: "Total Volume",
      value: 1523485,
      formatter: (val) => `${val.toLocaleString()} SOL`,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-secondary"
    },
    {
      id: "mooning",
      label: "Tokens Mooning",
      value: 7241,
      formatter: (val) => val.toLocaleString(),
      icon: <Rocket className="h-4 w-4" />,
      color: "text-warning"
    }
  ])

  useEffect(() => {
    const updateStats = () => {
      setStats(prevStats => 
        prevStats.map(stat => {
          let newValue = stat.value
          const changePercent = (Math.random() - 0.3) * 0.1 // Slight bias towards increase
          
          switch (stat.id) {
            case "tokens":
              // Always increases (tokens created)
              newValue += Math.floor(Math.random() * 50) + 1
              break
            case "users":
              // Can fluctuate up/down
              const userChange = Math.floor(stat.value * changePercent)
              newValue = Math.max(100000, stat.value + userChange)
              break
            case "volume":
              // Mostly increases with occasional decreases
              const volumeChange = Math.floor(stat.value * changePercent * 2)
              newValue = Math.max(1000000, stat.value + volumeChange)
              break
            case "mooning":
              // Tends to go up more than down
              const mooningChange = Math.floor(Math.random() * 20) - 5
              newValue = Math.max(5000, stat.value + mooningChange)
              break
          }
          
          return { ...stat, value: newValue }
        })
      )
    }

    // Initial update after 1 second
    const initialTimer = setTimeout(updateStats, 1000)
    
    // Set up recurring updates every 3-6 seconds
    const interval = setInterval(() => {
      updateStats()
    }, Math.random() * 3000 + 3000) // 3-6 seconds

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 shadow-elegant">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  duration: 0.5
                }}
                className={`text-lg font-bold ${stat.color}`}
              >
                {stat.formatter(stat.value)}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}