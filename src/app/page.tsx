"use client"

import { motion } from 'framer-motion'
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview'
import { AllocationCharts } from '@/components/dashboard/AllocationCharts'
import { HoldingsTable } from '@/components/dashboard/HoldingsTable'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { TopPerformers } from '@/components/dashboard/TopPerformers'
import { RefreshCw, TrendingUp, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header - Matching Wealth Manager Style */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-semibold text-white">Portfolio Manager</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">See Today's Market Brief</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-colors font-medium">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Join Waitlist</span>
            </button>
          </div>
        </div>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12 space-y-12"
      >
        {/* Header Section - Exact Wealth Manager Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            <span className="text-white">Institutional-grade insights at almost no cost for your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
              Portfolio
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Professional analysis powered by AI, validated by experts, and hyper-personalized for YOU!
          </p>
        </motion.div>

        {/* Portfolio Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-gray-900/50 backdrop-blur border border-gray-800 rounded-3xl p-1">
            <PortfolioOverview />
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        >
          {/* Allocation Charts */}
          <div className="xl:col-span-1">
            <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6 h-full hover:border-amber-500/30 transition-colors">
              <AllocationCharts />
            </div>
          </div>
          
          {/* Performance Chart */}
          <div className="xl:col-span-2">
            <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6 h-full hover:border-amber-500/30 transition-colors">
              <PerformanceChart />
            </div>
          </div>
        </motion.div>

        {/* Holdings and Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Holdings Table */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-colors">
              <HoldingsTable />
            </div>
          </div>
          
          {/* Top Performers Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6 hover:border-amber-500/30 transition-colors">
              <TopPerformers />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
