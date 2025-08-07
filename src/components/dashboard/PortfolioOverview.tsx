"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react'

interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalGainLoss: number
  totalGainLossPercent: number
  diversificationScore: number
  riskLevel: string
}

export function PortfolioOverview() {
  const [data, setData] = useState<PortfolioSummary | null>(null)
  const [holdingsCount, setHoldingsCount] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch('/api/portfolio/summary').then(res => res.json()),
      fetch('/api/portfolio/holdings').then(res => res.json())
    ]).then(([summary, holdings]) => {
      setData(summary)
      setHoldingsCount(holdings.length)
    })
  }, [])

  const cards = [
    {
      title: "Total Portfolio Value",
      value: data ? `₹${data.totalValue.toLocaleString()}` : "Loading...",
      icon: DollarSign,
      trend: data && data.totalGainLoss > 0 ? "up" : "down",
    },
    {
      title: "Total Gain/Loss",
      value: data ? `₹${Math.abs(data.totalGainLoss).toLocaleString()}` : "Loading...",
      icon: data && data.totalGainLoss > 0 ? TrendingUp : TrendingDown,
      trend: data && data.totalGainLoss > 0 ? "up" : "down",
      percentage: data ? `${data.totalGainLossPercent.toFixed(2)}%` : "",
    },
    {
      title: "Portfolio Performance",
      value: data ? `${data.totalGainLossPercent.toFixed(2)}%` : "Loading...",
      icon: data && data.totalGainLoss > 0 ? TrendingUp : TrendingDown,
      trend: data && data.totalGainLoss > 0 ? "up" : "down",
      subtitle: "vs initial investment",
    },
    {
      title: "Number of Holdings",
      value: holdingsCount.toString(),
      icon: Package,
      trend: "neutral" as const,
      subtitle: "active positions",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="border-accent bg-card hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon 
                className={`h-4 w-4 ${
                  card.trend === 'up' 
                    ? 'text-green-500' 
                    : card.trend === 'down' 
                    ? 'text-red-500' 
                    : 'text-primary'
                }`} 
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {card.value}
              </div>
              {card.percentage && (
                <p className={`text-sm ${
                  card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {card.percentage}
                </p>
              )}
              {card.subtitle && (
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
