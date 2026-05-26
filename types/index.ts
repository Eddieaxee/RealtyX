import {
  UserRole,
  UserStatus,
  KYCStatus,
  PropertyType,
  PropertyStatus,
  InvestmentStatus,
  TransactionType,
  TransactionStatus,
  WalletType,
} from "../lib/generated/prisma/client";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  slug: string;
  type: PropertyType;
  status: PropertyStatus;
  location: string;
  city: string;
  country: string;
  totalValue: string;
  tokenPrice: string;
  totalTokens: number;
  availableTokens: number;
  minInvestment: string;
  expectedReturn: string | null;
  rentalYield: string | null;
  images: string[];
  features: string[];
  tokenAddress: string | null;
  createdAt: Date;
}

export interface Investment {
  id: string;
  userId: string;
  propertyId: string;
  tokens: number;
  amount: string;
  tokenPrice: string;
  status: InvestmentStatus;
  txHash: string | null;
  createdAt: Date;
  property?: Property;
}

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  chainId: number;
  chain: string;
  type: WalletType;
  isPrimary: boolean;
  isVerified: boolean;
  balance: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  txHash: string | null;
  createdAt: Date;
}

export interface KYCRecord {
  id: string;
  userId: string;
  status: KYCStatus;
  firstName: string;
  lastName: string;
  nationality: string | null;
  riskLevel: string;
  submittedAt: Date | null;
}

export interface PortfolioStats {
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  propertiesOwned: number;
  avgReturn: number;
}

export interface ChartData {
  name: string;
  value: number;
  change?: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
