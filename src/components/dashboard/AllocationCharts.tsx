"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface AllocationData {
  bySector: Record<string, { value: number; percentage: number }>
  byMarketCap: Record<string, { value: number; percentage: number }>
}

const COLORS = ['#FFD700', '#F4C430', '#DAA520', '#B8860B', '#9ACD32', '#8FBC8F', '#DEB887', '#CD853F', '#D2691E']

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-accent p-3 rounded-lg shadow-lg">
          <p className="font-medium text-primary">{data.name}</p>
          <p className="text-white">₹{data.value.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-accent">
          <CardHeader>
            <div className="h-6 bg-accent rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-accent rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!allocationData) {
    return (
      <Card className="bg-card border-accent">
        <CardContent className="p-8">
          <div className="text-center text-red-500">Failed to load allocation data</div>
        </CardContent>
      </Card>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Sector Distribution */}
      <Card className="bg-card border-accent hover:border-primary/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
            📊 Sector Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="percentage"
                stroke="#0a0a0a"
                strokeWidth={2}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                labelLine={false}
              >
                {sectorData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Market Cap Distribution */}
      <Card className="bg-card border-accent hover:border-primary/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
            🏢 Market Cap Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketCapData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
                stroke="#0a0a0a"
                strokeWidth={2}
              >
                {marketCapData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
