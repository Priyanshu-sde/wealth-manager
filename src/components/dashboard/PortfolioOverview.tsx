"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Package, Target, Shield, Wallet, BarChart3 } from 'lucide-react'

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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/portfolio/summary')
        const summaryData = await response.json()
        
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
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="golden-glass-card p-6 h-40 rounded-3xl"
          >
            <div className="animate-pulse space-y-4 text-center h-full flex flex-col justify-center">
              <div className="flex justify-center items-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl"></div>
              </div>
              <div className="space-y-3">
                <div className="h-8 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded mx-auto w-3/4"></div>
                <div className="h-6 bg-amber-500/5 rounded mx-auto w-16"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="golden-glass-card p-8 col-span-full rounded-3xl"
        >
          <div className="text-center space-y-4">
            <BarChart3 className="w-12 h-12 text-red-400 mx-auto" />
            <div className="text-red-400 font-medium">
              Failed to load portfolio summary
            </div>
            <p className="text-gray-400 text-sm">
              Please check your API endpoints and try refreshing the page
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  const safeData = {
    totalValue: data.totalValue || 0,
    totalInvested: data.totalInvested || 0,
    totalGainLoss: data.totalGainLoss || 0,
    totalGainLossPercent: data.totalGainLossPercent || 0,
    numberOfHoldings: data.numberOfHoldings || 16,
    diversificationScore: data.diversificationScore || 0,
    riskLevel: data.riskLevel || 'Unknown'
  }

  const isPositiveGain = safeData.totalGainLoss > 0
  const gainColor = isPositiveGain ? "text-emerald-400" : "text-red-400"
  const gainBg = isPositiveGain ? "from-emerald-500/20 to-green-500/10" : "from-red-500/20 to-pink-500/10"
  const gainBorder = isPositiveGain ? "border-emerald-500/30" : "border-red-500/30"

  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': 
        return { color: 'text-emerald-400', bg: 'from-emerald-500/20 to-green-500/10', border: 'border-emerald-500/30' }
      case 'moderate': 
        return { color: 'text-amber-400', bg: 'from-amber-500/20 to-yellow-500/10', border: 'border-amber-500/30' }
      case 'high': 
        return { color: 'text-red-400', bg: 'from-red-500/20 to-pink-500/10', border: 'border-red-500/30' }
      default: 
        return { color: 'text-gray-400', bg: 'from-gray-500/20 to-slate-500/10', border: 'border-gray-500/30' }
    }
  }

  const riskConfig = getRiskConfig(safeData.riskLevel)
  
  const cards = [
    {
      title: "Portfolio Value",
      value: `₹${safeData.totalValue.toLocaleString()}`,
      icon: Wallet,
      color: "golden-text",
      gradient: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-500/30",
      subtitle: "Current market value",
    },
    {
      title: "Total Returns",
      value: `₹${Math.abs(safeData.totalGainLoss).toLocaleString()}`,
      icon: isPositiveGain ? TrendingUp : TrendingDown,
      color: gainColor,
      gradient: gainBg,
      border: gainBorder,
      badge: `${isPositiveGain ? '+' : ''}${safeData.totalGainLossPercent.toFixed(2)}%`,
      badgeColor: `${gainColor} bg-gradient-to-r ${gainBg} ${gainBorder}`,
      subtitle: "Absolute gain/loss",
    },
    {
      title: "Holdings",
      value: safeData.numberOfHoldings.toString(),
      icon: Package,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/30",
      subtitle: "Active positions",
    },
    {
      title: "Risk Assessment",
      value: safeData.riskLevel,
      icon: Shield,
      color: riskConfig.color,
      gradient: riskConfig.bg,
      border: riskConfig.border,
      badge: `${safeData.diversificationScore}/10`,
      badgeColor: `${riskConfig.color} bg-gradient-to-r ${riskConfig.bg} ${riskConfig.border}`,
      subtitle: "Diversification score",
    },
  ]

  return (
    <div className="flex justify-center items-center min-h-full">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full max-w-7xl transform translate-y-[10px]">
    {cards.map((card, index) => (
      <motion.div
        key={card.title}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.15,
          type: "spring",
          stiffness: 100
        }}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        className="relative group"
      >
        {/* Dynamic Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>
        
        {/* Main Card with Fixed Height and Center Alignment */}
        <div className={`
          relative glass-card border transition-all duration-500 overflow-hidden rounded-3xl h-44
          ${hoveredCard === index 
            ? `${card.border} shadow-lg transform -translate-y-2 scale-105` 
            : 'border-white/10'
          }
        `}>
          {/* Background Pattern */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-30`}></div>
          
          {/* Content - Centered */}
          <div className="relative h-full flex flex-col">
            <CardHeader className="flex-shrink-0 text-center pb-2 pt-4">
              <div className="flex justify-center mb-3">
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                  ${hoveredCard === index ? 'bg-gradient-to-r ' + card.gradient + ' scale-110' : 'bg-black/20'}
                `}>
                  <card.icon className={`h-6 w-6 ${card.color} transition-all duration-300`} />
                </div>
              </div>
              <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {card.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-center items-center text-center space-y-3 pb-4">
              <div className={`
                text-2xl font-bold transition-all duration-300
                ${card.color}
                ${hoveredCard === index ? 'scale-105' : ''}
              `}>
                {card.value}
              </div>
              
              <div className="space-y-2">
                {card.subtitle && (
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    {card.subtitle}
                  </p>
                )}
                {card.badge && (
                  <Badge 
                    className={`
                      font-semibold transition-all duration-300 border
                      ${card.badgeColor}
                      ${hoveredCard === index ? 'scale-110 shadow-lg' : ''}
                    `}
                  >
                    {card.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </div>

          {/* Shimmer Effect */}
          {hoveredCard === index && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>
          )}
        </div>
      </motion.div>
    ))}
  </div>
</div>

  )
}
