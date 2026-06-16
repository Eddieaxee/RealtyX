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

## Project Structure

```
realtyx-platform/
├── app/              # Next.js App Router
│   ├── (public)/     # Public pages (marketing)
│   ├── (dashboard)/  # Dashboard pages (auth required)
│   ├── (admin)/      # Admin pages (admin required)
│   ├── api/          # API routes
│   └── globals.css   # Global styles
├── components/       # React components
├── lib/              # Utility libraries
├── prisma/           # Database schema
├── types/            # TypeScript types
├── contracts/        # Smart contracts
├── hooks/            # Custom React hooks
├── context/          # React context providers
├── data/             # Static data files
└── public/           # Static assets
```

## License

MIT