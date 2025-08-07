"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { TrendingUp, Building2, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react'

interface AllocationData {
  bySector: Record<string, { value: number; percentage: number }>
  byMarketCap: Record<string, { value: number; percentage: number }>
}

const GOLDEN_COLORS = [
  '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#fcd34d', '#fed7aa', '#fdba74',
]

export function AllocationCharts() {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio/allocation')
      .then(res => res.json())
      .then(data => {
        setAllocationData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching allocation data:', error)
        setLoading(false)
      })
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 shadow-xl border border-amber-500/30 min-w-[200px]"
        >
          <div className="space-y-2">
            <p className="font-bold golden-text text-lg">{data.name}</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Value:</span>
                <span className="text-white font-semibold">₹{data.value.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Allocation:</span>
                <span className="text-amber-400 font-bold">{data.percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }: any) => {
    if (percentage < 5) return null
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    )
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {Array(2).fill(0).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="golden-glass-card p-6"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex justify-center items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-xl"></div>
                <div className="h-6 bg-amber-500/10 rounded w-48"></div>
              </div>
              <div className="h-80 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-2xl flex items-center justify-center">
                <div className="w-48 h-48 bg-amber-500/10 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  if (!allocationData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="golden-glass-card p-8"
      >
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <div className="text-red-400 font-medium">Failed to load allocation data</div>
          <p className="text-gray-400 text-sm">Please try refreshing the page</p>
        </div>
      </motion.div>
    )
  }

  const sectorData = Object.entries(allocationData.bySector).map(([sector, data]) => ({
    name: sector,
    value: data.value,
    percentage: data.percentage,
  }))

  const marketCapData = Object.entries(allocationData.byMarketCap).map(([cap, data]) => ({
    name: cap,
    value: data.value,
    percentage: data.percentage,
  }))
  const SolidPieChartIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className}>
      {/* Solid yellow background circle */}
      <circle cx="12" cy="12" r="10" fill="#fbbf24" />
      
      {/* Pie chart segments in black for contrast */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8 0 1.12-.23 2.19-.64 3.17L12 12V4z" fill="#000000"/>
      <path d="M12 12l7.36 3.17C18.77 16.81 17.7 18.36 16.24 19.36L12 12z" fill="#1f2937"/>
      <path d="M12 12l4.24 7.36C15.19 19.77 13.64 20.23 12 20v-8z" fill="#374151"/>
      <path d="M12 12v8c-1.64 0-3.19-.46-4.24-1.64L12 12z" fill="#4b5563"/>
    </svg>
  )

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-6"
  >
    {/* Sector Distribution */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="golden-glass-card border border-amber-500/20">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 ">
          <CardTitle className="golden-text text-xl font-bold flex justify-center items-center gap-3 mt-3.5">
            <div className="w-10 h-10 premium-golden-gradient rounded-xl flex items-center justify-center">
              <SolidPieChartIcon className="w-10 h-10 text-black" />
            </div>
            Sector Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl"></div>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="percentage"
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth={2}
                  filter="url(#glow)"
                >
                  {sectorData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={GOLDEN_COLORS[index % GOLDEN_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    color: '#ffffff', 
                    paddingTop: '20px',
                    fontSize: '14px'
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </div>
    </motion.div>
  
    {/* Market Cap Distribution */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="glass-card border border-blue-500/20">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 ">
          <CardTitle className="text-blue-400 text-xl font-bold flex justify-center items-center gap-3 mt-3.5">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            Market Cap Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl"></div>
            <ResponsiveContainer width="100%" height={330}>
              <PieChart>
                <defs>
                  <filter id="glow2">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <Pie
                  data={marketCapData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="percentage"
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth={2}
                  filter="url(#glow2)"
                >
                  {marketCapData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={GOLDEN_COLORS[index % GOLDEN_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    color: '#ffffff', 
                    paddingTop: '20px',
                    fontSize: '14px'
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </div>
    </motion.div>
  </motion.div>
  
  )
}
