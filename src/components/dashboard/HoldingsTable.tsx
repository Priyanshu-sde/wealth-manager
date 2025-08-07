"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react'

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

    // Sort the filtered results
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

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="text-left p-4 cursor-pointer hover:text-primary transition-colors group"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </th>
  )

  if (loading) {
    return (
      <Card className="bg-card border-accent">
        <CardHeader>
          <div className="h-8 bg-accent rounded animate-pulse mb-4"></div>
          <div className="h-10 bg-accent rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-accent rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-card border-accent">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
              📈 Portfolio Holdings
              <Badge variant="secondary" className="bg-accent text-primary">
                {filteredHoldings.length} stocks
              </Badge>
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks by symbol, name, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted border-accent text-white placeholder-muted-foreground"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-accent">
                  <SortableHeader field="symbol">Symbol</SortableHeader>
                  <SortableHeader field="name">Company</SortableHeader>
                  <SortableHeader field="quantity">Quantity</SortableHeader>
                  <SortableHeader field="currentPrice">Current Price</SortableHeader>
                  <SortableHeader field="value">Value</SortableHeader>
                  <SortableHeader field="gainLoss">Gain/Loss</SortableHeader>
                  <SortableHeader field="gainLossPercent">Performance</SortableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredHoldings.map((holding, index) => (
                  <motion.tr
                    key={holding.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-accent/30 hover:bg-accent/20 transition-colors group"
                  >
                    <td className="p-4 font-bold text-primary">{holding.symbol}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white group-hover:text-primary transition-colors">
                          {holding.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {holding.sector} • {holding.marketCap} Cap
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white">{holding.quantity}</td>
                    <td className="p-4 text-white">₹{holding.currentPrice.toLocaleString()}</td>
                    <td className="p-4 font-medium text-white">₹{holding.value.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {holding.gainLoss >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={holding.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                          ₹{Math.abs(holding.gainLoss).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={`${
                          holding.gainLossPercent >= 0
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        } font-medium`}
                      >
                        {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredHoldings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No holdings found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
