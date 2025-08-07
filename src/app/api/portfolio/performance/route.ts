import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const performanceData = await prisma.performanceData.findMany({
      orderBy: {
        date: 'asc'
      }
    })

    const timeline = performanceData.map((data: { date: { toISOString: () => string }; portfolio: any; nifty50: any; gold: any }) => ({
      date: data.date.toISOString().split('T')[0],
      portfolio: data.portfolio,
      nifty50: data.nifty50,
      gold: data.gold
    }))

    // Calculate returns (simplified calculation for demo)
    const returns = {
      portfolio: { 
        "1month": 2.3, 
        "3months": 8.1, 
        "1year": 15.7 
      },
      nifty50: { 
        "1month": 1.8, 
        "3months": 6.2, 
        "1year": 12.4 
      },
      gold: { 
        "1month": -0.5, 
        "3months": 4.1, 
        "1year": 8.9 
      }
    }

    return NextResponse.json({
      timeline,
      returns
    })
  } catch (error) {
    console.error('Error fetching performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance' },
      { status: 500 }
    )
  }
}
