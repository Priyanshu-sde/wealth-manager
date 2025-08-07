"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Package, Target, Shield } from 'lucide-react'

interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalGainLoss: number
  totalGainLossPercent: number
  numberOfHoldings: number
  diversificationScore: number
  riskLevel: string
}

export function PortfolioOverview() {
  const [data, setData] = useState<PortfolioSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/portfolio/summary')
        const summaryData = await response.json()
        
        // Add validation to ensure we have the expected data structure
        if (summaryData && typeof summaryData === 'object') {
          setData(summaryData)
        } else {
          console.error('Invalid summary data received:', summaryData)
        }
      } catch (error) {
        console.error('Error fetching portfolio summary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-accent animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-accent">
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              Failed to load portfolio summary. Please check your API endpoints.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Add safety checks with default values
  const safeData = {
    totalValue: data.totalValue || 0,
    totalInvested: data.totalInvested || 0,
    totalGainLoss: data.totalGainLoss || 0,
    totalGainLossPercent: data.totalGainLossPercent || 0,
    numberOfHoldings: data.numberOfHoldings || 0,
    diversificationScore: data.diversificationScore || 0,
    riskLevel: data.riskLevel || 'Unknown'
  }

  const isPositiveGain = safeData.totalGainLoss > 0
  
  const cards = [
    {
      title: "Total Portfolio Value",
      value: `₹${safeData.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      subtitle: "Current market value",
    },
    {
      title: "Total Gain/Loss",
      value: `₹${Math.abs(safeData.totalGainLoss).toLocaleString()}`,
      icon: isPositiveGain ? TrendingUp : TrendingDown,
      color: isPositiveGain ? "text-green-400" : "text-red-400",
      badge: `${isPositiveGain ? '+' : ''}${safeData.totalGainLossPercent.toFixed(2)}%`,
      badgeColor: isPositiveGain ? "text-green-400 bg-green-400/10 border-green-400/20" : "text-red-400 bg-red-400/10 border-red-400/20",
    },
    {
      title: "Number of Holdings",
      value: safeData.numberOfHoldings.toString(),
      icon: Package,
      color: "text-primary",
      subtitle: "Active positions",
    },
    {
      title: "Risk Assessment",
      value: safeData.riskLevel,
      icon: Shield,
      color: safeData.riskLevel === 'Low' ? "text-green-400" : safeData.riskLevel === 'Moderate' ? "text-yellow-400" : "text-red-400",
      badge: `${safeData.diversificationScore}/10`,
      subtitle: "Diversification score",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-card border-accent hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-black">
                {card.value}
              </div>
              <div className="flex items-center justify-between">
                {card.subtitle && (
                  <p className="text-xs text-slate-400">
                    {card.subtitle}
                  </p>
                )}
                {card.badge && (
                  <Badge 
                    variant="secondary" 
                    className={`${card.badgeColor || 'text-primary bg-primary/10 border-primary/20'} font-medium`}
                  >
                    {card.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
