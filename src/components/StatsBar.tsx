"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Coins, Users, BarChart3, Rocket } from "lucide-react"

interface StatData {
  id: string
  label: string
  value: number
  formatter: (val: number) => string
  icon: React.ReactNode
}

export function StatsBar() {
  const [stats, setStats] = useState<StatData[]>([
    {
      id: "tokens",
      label: "Total Tokens Created",
      value: 48300,
      formatter: (val) => val.toLocaleString(),
      icon: <Coins className="h-5 w-5 text-primary" />
    },
    {
      id: "users", 
      label: "Active Users",
      value: 12750,
      formatter: (val) => val.toLocaleString(),
      icon: <Users className="h-5 w-5 text-accent" />
    },
    {
      id: "volume",
      label: "Total Volume", 
      value: 27.4,
      formatter: (val) => `$${val.toFixed(1)}M`,
      icon: <BarChart3 className="h-5 w-5 text-secondary" />
    },
    {
      id: "mooning",
      label: "Tokens Mooning",
      value: 7000,
      formatter: (val) => val.toLocaleString(),
      icon: <Rocket className="h-5 w-5 text-warning" />
    }
  ])

  useEffect(() => {
    const updateStats = () => {
      setStats(prevStats => 
        prevStats.map(stat => {
          let newValue = stat.value
          
          switch (stat.id) {
            case "tokens":
              // Always increases (tokens created)
              newValue += Math.floor(Math.random() * 50) + 1
              break
            case "users":
              // Can fluctuate up/down
              const userChange = Math.floor(Math.random() * 200) - 100
              newValue = Math.max(10000, stat.value + userChange)
              break
            case "volume":
              // Volume in millions, can fluctuate
              const volumeChange = (Math.random() - 0.4) * 2
              newValue = Math.max(20, stat.value + volumeChange)
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

    // Update every 3-6 seconds
    const interval = setInterval(() => {
      updateStats()
    }, Math.random() * 3000 + 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full py-6 bg-card border-y border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Stat
              key={stat.id}
              icon={stat.icon}
              value={stat.formatter(stat.value)}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, value, label, delay }: { icon: React.ReactNode; value: string; label: string; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            className="text-xl md:text-2xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground">{label}</span>
    </motion.div>
  )
}