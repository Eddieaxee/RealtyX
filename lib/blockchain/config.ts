"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, polygon, arbitrum, base } from "wagmi/chains";
import { http, createStorage, cookieStorage } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

// Public RPC endpoints for reliable transport fallbacks
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const hasValidAlchemyKey = alchemyKey && alchemyKey !== "your-alchemy-api-key";

const mainnetRpc = hasValidAlchemyKey
  ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
  : "https://ethereum-rpc.publicnode.com";

const baseRpc = hasValidAlchemyKey
  ? `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`
  : "https://base-rpc.publicnode.com";

export const config = getDefaultConfig({
  appName: "RealtyX Platform",
  projectId,
  chains: [mainnet, base, polygon, arbitrum, sepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(mainnetRpc),
    [base.id]: http(baseRpc),
    [polygon.id]: http("https://polygon-rpc.com"),
    [arbitrum.id]: http("https://arbitrum-one-rpc.publicnode.com"),
    [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
  },
});

export const supportedChains = [mainnet, base, polygon, arbitrum, sepolia];