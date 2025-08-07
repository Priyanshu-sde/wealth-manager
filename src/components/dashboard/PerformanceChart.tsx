"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceData {
  timeline: Array<{
    date: string
    portfolio: number
    nifty50: number
    gold: number
  }>
  returns: {
    portfolio: { "1month": number; "3months": number; "1year": number }
    nifty50: { "1month": number; "3months": number; "1year": number }
    gold: { "1month": number; "3months": number; "1year": number }
  }
}

type TimeRange = '1M' | '3M' | '6M' | '1Y'

export function PerformanceChart() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>('6M')

  useEffect(() => {
    fetch('/api/portfolio/performance')
      .then(res => res.json())
      .then(data => {
        setPerformanceData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching performance data:', error)
        setLoading(false)
      })
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-accent p-3 rounded-lg shadow-lg">
          <p className="font-medium text-primary mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem)
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <Card className="bg-card border-accent">
        <CardHeader>
          <div className="h-6 bg-accent rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-accent rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (!performanceData) {
    return (
      <Card className="bg-card border-accent">
        <CardContent className="p-8">
          <div className="text-center text-red-500">Failed to load performance data</div>
        </CardContent>
      </Card>
    )
  }

  const timeRanges: TimeRange[] = ['1M', '3M', '6M', '1Y']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-card border-accent hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
              📊 Performance Comparison
            </CardTitle>
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <Button
                  key={range}
                  variant={activeTimeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTimeRange(range)}
                  className={
                    activeTimeRange === range
                      ? "bg-primary text-black hover:bg-primary/90"
                      : "border-accent text-muted-foreground hover:text-primary hover:border-primary"
                  }
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData.timeline}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisLabel}
                  stroke="#888888"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#ffffff' }}
                />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#FFD700"
                  strokeWidth={3}
                  dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }}
                  name="Portfolio"
                />
                <Line
                  type="monotone"
                  dataKey="nifty50"
                  stroke="#F4C430"
                  strokeWidth={2}
                  dot={{ fill: '#F4C430', strokeWidth: 2, r: 3 }}
                  name="Nifty 50"
                />
                <Line
                  type="monotone"
                  dataKey="gold"
                  stroke="#DAA520"
                  strokeWidth={2}
                  dot={{ fill: '#DAA520', strokeWidth: 2, r: 3 }}
                  name="Gold"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Returns Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-accent/20 p-4 rounded-lg border border-accent">
              <h4 className="font-medium text-primary mb-2">Portfolio Returns</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1 Month:</span>
                  <span className="text-green-400">+{performanceData.returns.portfolio["1month"]}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">3 Months:</span>
                  <span className="text-green-400">+{performanceData.returns.portfolio["3months"]}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1 Year:</span>
                  <span className="text-green-400">+{performanceData.returns.portfolio["1year"]}%</span>
                </div>
              </div>
            </div>

            <div className="bg-accent/20 p-4 rounded-lg border border-accent">
              <h4 className="font-medium text-primary mb-2">Nifty 50 Returns</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1 Month:</span>
                  <span className="text-green-400">+{performanceData.returns.nifty50["1month"]}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">3 Months:</span>
                  <span className="text-green-400">+{performanceData.returns.nifty50["3months"]}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1 Year:</span>
                  <span className="text-green-400">+{performanceData.returns.nifty50["1year"]}%</span>
                </div>
              </div>
            </div>

            <div className="bg-accent/20 p-4 rounded-lg border border-accent">
              <h4 className="font-medium text-primary mb-2">Gold Returns</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1 Month:</span>
                  <span className="text-red-400">{performanceData.returns.gold["1month"]}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">3 Months:</span>
                  <span className="text-green-400">+{performanceData.returns.gold["3months"]}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1 Year:</span>
                  <span className="text-green-400">+{performanceData.returns.gold["1year"]}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
