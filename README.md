# Portfolio Manager - Wealth Management Dashboard

A modern, institutional-grade portfolio management dashboard built with Next.js, providing AI-powered insights and comprehensive portfolio analytics at scale.

## ✨ Features

### 📊 **Portfolio Analytics**
- Real-time portfolio valuation and performance tracking
- Comprehensive holdings management with detailed stock information
- Advanced performance charts with comparative analysis (Portfolio vs Nifty 50 vs Gold)
- Interactive allocation charts by sector and market capitalization

### 🎯 **AI-Powered Insights**
- Intelligent portfolio recommendations and rebalancing suggestions
- Risk assessment with diversification scoring
- Performance analytics with detailed gain/loss tracking
- Top and worst performers identification

### 🎨 **Premium User Experience**
- Modern glass-morphism design with golden accent theme
- Responsive layout optimized for all device sizes
- Smooth animations and transitions using Framer Motion
- Interactive charts and data visualizations with Recharts

### 🔧 **Technical Excellence**
- Built with Next.js 14 and TypeScript for type safety
- Prisma ORM with PostgreSQL for robust data management
- Tailwind CSS for responsive, utility-first styling
- Real-time data fetching with comprehensive error handling

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts for interactive data visualizations
- **Animations**: Framer Motion for smooth UI transitions
- **Styling**: Custom glass-morphism components with golden theme
- **Deployment**: AWS Amplify (Production ready)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm/yarn/pnpm package manager

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Priyanshu-sde/wealth-manager
   cd wealth-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   Configure your database connection:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/wealth_manager"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed with sample data
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/portfolio/           # API routes for portfolio data
│   │   ├── summary/            # Portfolio summary endpoint
│   │   ├── holdings/           # Holdings data endpoint
│   │   ├── allocation/         # Asset allocation endpoint
│   │   └── performance/        # Performance analytics endpoint
│   ├── globals.css             # Global styles and themes
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── PortfolioOverview.tsx    # Portfolio metrics cards
│   │   ├── HoldingsTable.tsx        # Interactive holdings table
│   │   ├── AllocationCharts.tsx     # Pie charts for allocations
│   │   ├── PerformanceChart.tsx     # Line chart for performance
│   │   └── TopPerformers.tsx        # Best/worst performers
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── prisma.ts              # Database connection
│   ├── utils.ts               # Utility functions
│   └── realSampleData.ts      # Sample portfolio data
└── generated/prisma/          # Generated Prisma client
```

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/portfolio/summary` | GET | Portfolio overview metrics |
| `/api/portfolio/holdings` | GET | Individual stock holdings |
| `/api/portfolio/allocation` | GET | Sector and market cap distribution |
| `/api/portfolio/performance` | GET | Historical performance data |

## 🔧 Key Components

### **PortfolioOverview**
Displays key portfolio metrics including total value, returns, holdings count, and risk assessment with animated cards and real-time data.

### **HoldingsTable**
Interactive table showing individual stock positions with sorting, search functionality, and detailed performance metrics.

### **AllocationCharts**
Responsive pie charts visualizing portfolio distribution by sector and market capitalization with custom tooltips.

### **PerformanceChart**
Comparative line chart tracking portfolio performance against market benchmarks (Nifty 50, Gold) with multiple timeframe options.

### **TopPerformers**
Highlights best and worst performing assets with detailed insights, diversification scoring, and risk analysis.

## 🎨 Design System

- **Color Palette**: Premium black background with golden accents (#fbbf24)
- **Typography**: Modern sans-serif with emphasis on readability
- **Glass Morphism**: Semi-transparent cards with backdrop blur effects
- **Responsive**: Mobile-first design with optimized layouts
- **Animations**: Smooth transitions and hover effects throughout

## 📊 Sample Data

The application includes comprehensive sample data featuring:
- 15+ real Indian stock holdings (RELIANCE, INFY, TCS, HDFC, etc.)
- 12 months of historical performance data
- Sector-wise allocation across Technology, Banking, Energy, Healthcare
- Market cap distribution (Large, Mid, Small cap)

## 🚀 Deployment

### **AWS Amplify (Current)**
The application is deployed on AWS Amplify with automatic builds from your Git repository.

### **Alternative Deployments**
- **Vercel**: Optimal for Next.js applications
- **Railway**: Simple PostgreSQL + Next.js deployment
- **Docker**: Containerized deployment option

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or support, please open an issue on GitHub or contact the development team.

---
