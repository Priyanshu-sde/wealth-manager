import { PrismaClient } from '../src/generated/prisma'
import { realStockData, historicalPerformanceData, portfolioSummaryData } from '../src/lib/realSampleData'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await prisma.holding.deleteMany()
    await prisma.stock.deleteMany()
    await prisma.performanceData.deleteMany()
    await prisma.portfolioSummary.deleteMany()
    
    console.log('📊 Seeding stocks and holdings...')
    
    // Seed stocks and holdings
    for (const stockData of realStockData) {
      const stock = await prisma.stock.create({
        data: {
          symbol: stockData.symbol,
          name: stockData.name,
          sector: stockData.sector,
          marketCap: stockData.marketCap,
          exchange: stockData.exchange,
        }
      })
      
      await prisma.holding.create({
        data: {
          stockId: stock.id,
          quantity: stockData.quantity,
          avgPrice: stockData.avgPrice,
          currentPrice: stockData.currentPrice,
          value: stockData.value,
          gainLoss: stockData.gainLoss,
          gainLossPercent: stockData.gainLossPercent,
        }
      })
      
      console.log(`✅ Created holding for ${stockData.symbol}`)
    }
    
    console.log('📈 Seeding historical performance data...')
    
    // Seed performance data
    for (const perfData of historicalPerformanceData) {
      await prisma.performanceData.create({
        data: {
          date: new Date(perfData.date),
          portfolioValue: perfData.portfolioValue,
          portfolioReturn: perfData.portfolioReturn,
          nifty50: perfData.nifty50,
          nifty50Return: perfData.nifty50Return,
          gold: perfData.gold,
          goldReturn: perfData.goldReturn,
        }
      })
    }
    
    console.log('📋 Seeding portfolio summary...')
    
    // Seed portfolio summary
    await prisma.portfolioSummary.create({
      data: portfolioSummaryData
    })
    
    console.log('✨ Database seeding completed successfully!')
    
    // Print summary
    const stockCount = await prisma.stock.count()
    const holdingCount = await prisma.holding.count()
    const perfDataCount = await prisma.performanceData.count()
    
    console.log('\n📊 Seeding Summary:')
    console.log(`   Stocks: ${stockCount}`)
    console.log(`   Holdings: ${holdingCount}`)
    console.log(`   Performance Records: ${perfDataCount}`)
    console.log(`   Total Portfolio Value: ₹${portfolioSummaryData.totalValue.toLocaleString()}`)
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('🔌 Disconnecting from database...')
    await prisma.$disconnect()
  })
