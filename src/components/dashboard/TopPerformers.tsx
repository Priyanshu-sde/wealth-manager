"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Shield, Target, Award, AlertTriangle } from 'lucide-react'

interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalGainLoss: number
  totalGainLossPercent: number
  topPerformer: {
    symbol: string
    name: string
    gainPercent: number
  }
  worstPerformer: {
    symbol: string
    name: string
    gainPercent: number
  }
  diversificationScore: number
  riskLevel: string
}

export function TopPerformers() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio/summary')
      .then(res => res.json())
      .then(data => {
        setSummary(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching summary:', error)
        setLoading(false)
      })
  }, [])

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'text-green-500'
      case 'moderate': return 'text-yellow-500'
      case 'high': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return Shield
      case 'moderate': return Target
      case 'high': return AlertTriangle
      default: return Shield
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="bg-card border-accent">
            <CardHeader>
              <div className="h-6 bg-accent rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-accent rounded animate-pulse"></div>
                <div className="h-4 bg-accent rounded animate-pulse w-3/4"></div>
                <div className="h-8 bg-accent rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) {
    return (
      <Card className="bg-card border-accent">
        <CardContent className="p-8">
          <div className="text-center text-red-500">Failed to load portfolio summary</div>
        </CardContent>
      </Card>
    )
  }

  const RiskIcon = getRiskIcon(summary.riskLevel)

  return (
    <div className="space-y-6">
      {/* Top Performer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:border-green-500/40 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-green-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="font-bold text-xl text-white">
                  {summary.topPerformer.symbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  {summary.topPerformer.name}
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-bold text-lg px-3 py-1">
                +{summary.topPerformer.gainPercent.toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Worst Performer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20 hover:border-red-500/40 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-red-400 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Worst Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="font-bold text-xl text-white">
                  {summary.worstPerformer.symbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  {summary.worstPerformer.name}
                </div>
              </div>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-bold text-lg px-3 py-1">
                {summary.worstPerformer.gainPercent.toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Portfolio Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5" />
              Portfolio Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Diversification Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Diversification Score
                </span>
                <span className="text-sm font-bold text-primary">
                  {summary.diversificationScore}/10
                </span>
              </div>
              <Progress 
                value={summary.diversificationScore * 10} 
                className="h-3 bg-accent"
                style={{
                  background: '#2d2d2d'
                } as React.CSSProperties}
              />
              <div className="mt-1 text-xs text-muted-foreground">
                {summary.diversificationScore >= 8 
                  ? "Excellent diversification" 
                  : summary.diversificationScore >= 6 
                  ? "Good diversification" 
                  : "Consider more diversification"
                }
              </div>
            </div>

            {/* Risk Level */}
            <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
              <div className="flex items-center gap-2">
                <RiskIcon className={`h-5 w-5 ${getRiskColor(summary.riskLevel)}`} />
                <span className="font-medium text-white">Risk Level</span>
              </div>
              <Badge 
                variant="secondary" 
                className={`${getRiskColor(summary.riskLevel)} font-medium`}
              >
                {summary.riskLevel}
              </Badge>
            </div>

            {/* Key Metrics */}
            <div className="space-y-2 pt-2 border-t border-accent">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Return</span>
                <span className="font-medium text-green-400">
                  +{summary.totalGainLossPercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Absolute Gain</span>
                <span className="font-medium text-green-400">
                  ₹{summary.totalGainLoss.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Portfolio Value</span>
                <span className="font-medium text-primary">
                  ₹{summary.totalValue.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

