"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Activity, Award } from 'lucide-react'

interface PerformanceData {
  timeline: Array<{
    date: string
    portfolio: number
    nifty50: number
    gold: number
  }>
  returns: {
    portfolio: { "3months": number; "1year": number }
    nifty50: { "3months": number; "1year": number }
    gold: { "3months": number; "1year": number }
  }
}

type TimeRange = '3M' | '6M' | '1Y'

export function PerformanceChart() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<TimeRange>('1Y')
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/portfolio/performance')
        const performanceData = await response.json()
        setData(performanceData)
      } catch (error) {
        console.error('Error fetching performance data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="golden-glass-card p-6"
      >
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded w-1/3"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 w-12 bg-amber-500/10 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="h-80 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-xl"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-amber-500/5 rounded-lg"></div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  if (!data) return null

  const formatValue = (value: number, type: 'currency' | 'index' | 'gold') => {
    if (type === 'currency') return `₹${(value / 100000).toFixed(1)}L`
    if (type === 'index') return value.toLocaleString()
    if (type === 'gold') return `₹${value.toLocaleString()}`
    return value.toString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 shadow-xl border border-amber-500/20"
        >
          <p className="font-semibold text-white mb-3 text-sm">
            {new Date(label).toLocaleDateString('en-IN', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-300 text-sm">
                    {entry.dataKey === 'portfolio' && 'Portfolio'}
                    {entry.dataKey === 'nifty50' && 'Nifty 50'}
                    {entry.dataKey === 'gold' && 'Gold'}
                  </span>
                </div>
                <span className="font-medium text-white text-sm">
                  {entry.dataKey === 'portfolio' && formatValue(entry.value, 'currency')}
                  {entry.dataKey === 'nifty50' && formatValue(entry.value, 'index')}
                  {entry.dataKey === 'gold' && formatValue(entry.value, 'gold')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )
    }
    return null
  }

  // Updated periods array without 1M
  const periods = [
    { key: '3M' as const, label: '3M', months: 3 },
    { key: '6M' as const, label: '6M', months: 6 },
    { key: '1Y' as const, label: '1Y', months: 12 },
  ]

  const getFilteredData = () => {
    if (!data || !data.timeline) return []
    
    const now = new Date()
    let startDate = new Date()
    
    const selectedPeriodInfo = periods.find(p => p.key === selectedPeriod)
    if (selectedPeriodInfo) {
      startDate.setMonth(now.getMonth() - selectedPeriodInfo.months)
    }

    const filtered = data.timeline.filter(item => new Date(item.date) >= startDate)
    
    // If no data for the selected period, return all data
    return filtered.length > 0 ? filtered : data.timeline
  }

  const getReturnValue = (asset: 'portfolio' | 'nifty50' | 'gold') => {
    if (!data.returns[asset]) return 0
    
    switch (selectedPeriod) {
      case '3M':
        return data.returns[asset]["3months"] || 0
      case '6M':
        // If 6M data doesn't exist, fallback to 1year or 3months
        return data.returns[asset]["1year"] || data.returns[asset]["3months"] || 0
      case '1Y':
      default:
        return data.returns[asset]["1year"] || 0
    }
  }

  const getPerformanceIcon = (value: number) => {
    if (value > 10) return <Award className="w-4 h-4 text-green-400" />
    if (value > 0) return <TrendingUp className="w-4 h-4 text-amber-400" />
    return <Activity className="w-4 h-4 text-red-400" />
  }

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 premium-golden-gradient opacity-5 rounded-3xl blur-xl"></div>
      
      <div className="relative golden-glass-card overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold golden-text flex items-center gap-3">
              <div className="w-8 h-8 premium-golden-gradient rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              Performance Analysis
            </CardTitle>
            <div className="flex gap-2 bg-black/20 p-1 rounded-xl backdrop-blur">
              {periods.map((period) => (
                <Button
                  key={period.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPeriod(period.key)}
                  className={`
                    relative transition-all duration-300 rounded-lg px-4 py-2
                    ${selectedPeriod === period.key 
                      ? "premium-golden-gradient text-black font-semibold shadow-lg" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enhanced Chart Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl"></div>
            <div className="relative glass-card p-4 rounded-xl">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={getFilteredData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    tick={{ fill: '#9ca3af' }}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tick={{ fill: '#9ca3af' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="portfolio" 
                    stroke="#fbbf24" 
                    strokeWidth={3}
                    name="Portfolio"
                    dot={{ fill: '#fbbf24', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 6, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nifty50" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    name="Nifty 50"
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gold" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    name="Gold"
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Returns Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'portfolio', label: 'Portfolio', color: 'text-amber-400', bgColor: 'from-amber-500/20 to-amber-600/5' },
              { key: 'nifty50', label: 'Nifty 50', color: 'text-cyan-400', bgColor: 'from-cyan-500/20 to-cyan-600/5' },
              { key: 'gold', label: 'Gold', color: 'text-orange-400', bgColor: 'from-orange-500/20 to-orange-600/5' }
            ].map((asset) => {
              const returnValue = getReturnValue(asset.key as 'portfolio' | 'nifty50' | 'gold')
              return (
                <motion.div
                  key={asset.key}
                  whileHover={{ scale: 1.05, y: -4 }}
                  onMouseEnter={() => setHoveredAsset(asset.key)}
                  onMouseLeave={() => setHoveredAsset(null)}
                  className={`
                    relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
                    ${hoveredAsset === asset.key 
                      ? 'border-amber-400/50 shadow-lg shadow-amber-500/20' 
                      : 'border-white/10'
                    }
                  `}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${asset.bgColor} rounded-xl opacity-50`}></div>
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">{asset.label}</span>
                      {getPerformanceIcon(returnValue)}
                    </div>
                    <div className={`text-2xl font-bold ${getPerformanceColor(returnValue)}`}>
                      {returnValue > 0 ? '+' : ''}{returnValue.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <span>{selectedPeriod} Return</span>
                      {hoveredAsset === asset.key && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-amber-400"
                        >
                          •
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </div>
    </motion.div>
  )
}
