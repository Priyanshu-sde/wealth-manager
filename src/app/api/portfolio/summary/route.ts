import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const metrics = await prisma.portfolioSummary.findFirst({
      orderBy: {
        updatedAt: 'desc'
      }
    })

    if (!metrics) {
      return NextResponse.json(
        { error: 'No portfolio metrics found' },
        { status: 404 }
      )
    }

    const response = {
      totalValue: metrics.totalValue,
      totalInvested: metrics.totalInvested,
      totalGainLoss: metrics.totalGainLoss,
      totalGainLossPercent: Math.round(metrics.totalGainLossPercent * 100) / 100,
      topPerformer: {
        symbol: metrics.topPerformerSymbol,
        name: metrics.topPerformerName,
        gainPercent: metrics.topPerformerGain
      },
      worstPerformer: {
        symbol: metrics.worstPerformerSymbol,
        name: metrics.worstPerformerName,
        gainPercent: metrics.worstPerformerGain
      },
      diversificationScore: metrics.diversificationScore,
      riskLevel: metrics.riskLevel
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    )
  }
}
