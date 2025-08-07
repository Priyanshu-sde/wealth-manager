import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const holdings = await prisma.holding.findMany({
      include: {
        stock: true
      }
    })

    const response = holdings.map((holding: { stock: { symbol: any; name: any; sector: any; marketCap: any }; quantity: any; avgPrice: any; currentPrice: any; value: any; gainLoss: any; gainLossPercent: number }) => ({
      symbol: holding.stock.symbol,
      name: holding.stock.name,
      quantity: holding.quantity,
      avgPrice: holding.avgPrice,
      currentPrice: holding.currentPrice,
      sector: holding.stock.sector,
      marketCap: holding.stock.marketCap,
      value: holding.value,
      gainLoss: holding.gainLoss,
      gainLossPercent: Math.round(holding.gainLossPercent * 10) / 10
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching holdings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch holdings' },
      { status: 500 }
    )
  }
}
