import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const holdings = await prisma.holding.findMany({
      include: {
        stock: true
      }
    })

    const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0)

    // Calculate sector allocation
    const sectorMap = new Map()
    holdings.forEach(holding => {
      const sector = holding.stock.sector
      const currentValue = sectorMap.get(sector) || 0
      sectorMap.set(sector, currentValue + holding.value)
    })

    const bySector = Object.fromEntries(
      Array.from(sectorMap.entries()).map(([sector, value]) => [
        sector,
        {
          value: Math.round(value),
          percentage: Math.round((value / totalValue) * 100 * 10) / 10
        }
      ])
    )

    // Calculate market cap allocation
    const marketCapMap = new Map()
    holdings.forEach(holding => {
      const marketCap = holding.stock.marketCap
      const currentValue = marketCapMap.get(marketCap) || 0
      marketCapMap.set(marketCap, currentValue + holding.value)
    })

    const byMarketCap = Object.fromEntries(
      Array.from(marketCapMap.entries()).map(([marketCap, value]) => [
        marketCap,
        {
          value: Math.round(value),
          percentage: Math.round((value / totalValue) * 100 * 10) / 10
        }
      ])
    )

    return NextResponse.json({
      bySector,
      byMarketCap
    })
  } catch (error) {
    console.error('Error fetching allocation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch allocation' },
      { status: 500 }
    )
  }
}
