# RealtyX Platform

A production-grade fractional real estate investing platform built with Next.js 14, TypeScript, TailwindCSS, Prisma, and blockchain integrations.

## Features

- **Fractional Real Estate Investing**: Invest in premium properties from $100
- **Tokenized Assets**: Blockchain-backed ownership with full transparency
- **AI Investment Copilot**: AI-powered portfolio insights and recommendations
- **Multi-Chain Wallet Support**: Ethereum, Base, Polygon, Arbitrum via RainbowKit
- **Institutional Security**: Bank-grade KYC, audited smart contracts, multi-sig custody
- **Real-Time Analytics**: Live portfolio tracking with Recharts visualizations
- **Admin Dashboard**: User management, KYC review, asset management, analytics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Auth**: NextAuth.js v5 (Beta) with credentials + OAuth
- **Blockchain**: Wagmi v2, Viem, RainbowKit, WalletConnect
- **3D/WebGL**: React Three Fiber, Three.js
- **Charts**: Recharts
- **Animation**: Framer Motion
- **UI**: Radix UI primitives, Lucide icons

## Quick Start

### Prerequisites

- Node.js 18.17.0+
- PostgreSQL database
- WalletConnect Project ID

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd realtyx-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/realtyx?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Optional
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_ALCHEMY_API_KEY=
OPENAI_API_KEY=
```

### Default Login Credentials

After seeding:
- **Admin**: admin@realtyx.io / admin123
- **User**: user@example.com / user123

## Deployment

### Vercel

```bash
vercel --prod
```

### Docker

```bash
docker build -t realtyx-platform .
docker run -p 3000:3000 realtyx-platform
```

### Manual

```bash
npm run build
npm start
```

## Project Structure

```
realtyx-platform/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (marketing)
│   ├── (dashboard)/       # Dashboard pages (auth required)
│   ├── (admin)/           # Admin pages (admin required)
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI primitives
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard components
│   ├── public/           # Public page components
│   ├── admin/            # Admin components
│   ├── wallet/           # Wallet components
│   ├── ai/               # AI assistant components
│   └── three/            # 3D/WebGL components
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   ├── utils.ts          # Utility functions
│   └── blockchain/       # Blockchain config
├── prisma/
│   └── schema.prisma     # Database schema
├── types/                 # TypeScript types
└── public/                # Static assets
```

## License

MIT
