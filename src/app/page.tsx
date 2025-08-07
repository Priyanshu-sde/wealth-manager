"use client"

import { motion } from 'framer-motion'
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview'
import { AllocationCharts } from '@/components/dashboard/AllocationCharts'
import { HoldingsTable } from '@/components/dashboard/HoldingsTable'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { TopPerformers } from '@/components/dashboard/TopPerformers'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Portfolio Analytics Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your investments with real-time insights and comprehensive analytics
          </p>
        </motion.div>

        {/* Portfolio Overview Cards */}
        <PortfolioOverview />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Charts */}
          <div className="lg:col-span-2 space-y-8">
            <AllocationCharts />
          </div>
          
          {/* Middle - Performance Chart */}
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
        </div>

        {/* Holdings and Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Holdings Table */}
          <div className="lg:col-span-3">
            <HoldingsTable />
          </div>
          
          {/* Top Performers Sidebar */}
          <div className="lg:col-span-1">
            <TopPerformers />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
