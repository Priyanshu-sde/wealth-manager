"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, TrendingDown, ArrowUpDown, BarChart3, Filter } from 'lucide-react'

interface Stock {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  sector: string
  marketCap: string
  value: number
  gainLoss: number
  gainLossPercent: number
}

type SortField = keyof Stock
type SortDirection = 'asc' | 'desc'

export function HoldingsTable() {
  const [holdings, setHoldings] = useState<Stock[]>([])
  const [filteredHoldings, setFilteredHoldings] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('symbol')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  useEffect(() => {
    fetch('/api/portfolio/holdings')
      .then(res => res.json())
      .then(data => {
        setHoldings(data)
        setFilteredHoldings(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching holdings:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let filtered = holdings.filter(holding =>
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.sector.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      const aString = String(aValue).toLowerCase()
      const bString = String(bValue).toLowerCase()
      
      if (sortDirection === 'asc') {
        return aString.localeCompare(bString)
      } else {
        return bString.localeCompare(aString)
      }
    })

    setFilteredHoldings(filtered)
  }, [holdings, searchTerm, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-40" />
    }
    return sortDirection === 'asc' ? 
      <TrendingUp className="w-4 h-4 text-amber-400" /> : 
      <TrendingDown className="w-4 h-4 text-amber-400" />
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="text-left p-4 cursor-pointer hover:text-amber-400 transition-colors group border-b border-white/10"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2 text-gray-300 group-hover:text-amber-400 font-medium">
        {children}
        {getSortIcon(field)}
      </div>
    </th>
  )

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="golden-glass-card p-6"
      >
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded w-1/3"></div>
            <div className="h-10 bg-amber-500/10 rounded-xl w-80"></div>
          </div>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 premium-golden-gradient opacity-5 rounded-3xl blur-xl"></div>
      
      <div className="relative golden-glass-card overflow-hidden">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-amber-500/5 to-yellow-500/5">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mt-4">
    <CardTitle className="golden-text text-2xl font-bold flex items-center gap-3">
      <div className="w-10 h-10 premium-golden-gradient rounded-xl flex items-center justify-center">
        <BarChart3 className="w-5 h-5 text-black" />
      </div>
      Portfolio Holdings
      <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30 font-semibold">
        {filteredHoldings.length} stocks
      </Badge>
    </CardTitle>
    
    {/* Enhanced Search Bar */}
    <div className="relative w-full lg:w-96">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl blur opacity-50"></div>
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
        <Input
          placeholder="Search by symbol, company, or sector..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
        />
        <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  </div>
</CardHeader>


        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gradient-to-r from-black/20 to-black/10 backdrop-blur">
                <tr>
                  <SortableHeader field="symbol">Symbol</SortableHeader>
                  <SortableHeader field="name">Company</SortableHeader>
                  <SortableHeader field="quantity">Quantity</SortableHeader>
                  <SortableHeader field="currentPrice">Current Price</SortableHeader>
                  <SortableHeader field="value">Market Value</SortableHeader>
                  <SortableHeader field="gainLoss">Gain/Loss</SortableHeader>
                  <SortableHeader field="gainLossPercent">Performance</SortableHeader>
                </tr>
              </thead>
              <tbody className="backdrop-blur">
                {filteredHoldings.map((holding, index) => (
                  <motion.tr
                    key={holding.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-b border-white/5 hover:bg-gradient-to-r hover:from-amber-500/5 hover:to-yellow-500/5 transition-all duration-300 group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-amber-400 text-lg group-hover:text-amber-300 transition-colors">
                        {holding.symbol}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-medium text-white group-hover:text-amber-100 transition-colors">
                          {holding.name}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs font-medium">
                            {holding.sector}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span>{holding.marketCap} Cap</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">{holding.quantity.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">₹{holding.currentPrice.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-bold">₹{holding.value.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {holding.gainLoss >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`font-semibold ${holding.gainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {holding.gainLoss >= 0 ? '+' : ''}₹{Math.abs(holding.gainLoss).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={`font-bold border transition-all duration-300 ${
                          holding.gainLossPercent >= 0
                            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30 hover:scale-105'
                            : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30 hover:scale-105'
                        }`}
                      >
                        {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredHoldings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-gray-400 font-medium">
                  No holdings found matching your search
                </div>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search terms or clearing the filter
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </div>
    </motion.div>
  )
}
