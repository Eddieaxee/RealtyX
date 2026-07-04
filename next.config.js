import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "hardhat"],

  // Force consistent React/Lit/three.js instances for all web3 + 3D packages
  transpilePackages: [
    "@react-three/fiber",
    "@react-three/drei",
    "three",
    "@reown/appkit",
    "@rainbow-me/rainbowkit",
    "@walletconnect/web3wallet",
    "@web3modal/ui",
    "@web3modal/core",
    "@lit/reactive-element",
    "lit",
  ],

  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.realtyx.io" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
  },

  /**
   * Centralized Webpack configuration with context-aware React aliasing.
   *
   * RATIONALE:
   * - On the client bundle, we alias react / react-dom to a SINGLE canonical copy
   *   to prevent ReactCurrentOwner duplication and "cache is not a function" crashes
   *   from heavy client-side packages (reown/appkit, @react-three/fiber, wagmi).
   * - On the server bundle, we DO NOT alias React. This lets Next.js 16 RSC resolve
   *   its internal _react.cache functions without interference from the client copy.
   * - Polyfills for buffer/crypto/stream/process are only injected client-side
   *   (needed by viem, ethers, wagmi in the browser).
   */
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Force single React/three.js instances ONLY on the CLIENT bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.resolve(__dirname, "node_modules/react"),
        "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
        three: path.resolve(__dirname, "node_modules/three"),
      };

      // Polyfill node modules for wagmi/viem/ethers browser usage
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: path.resolve(__dirname, "node_modules/buffer"),
        crypto: path.resolve(__dirname, "node_modules/crypto-browserify"),
        stream: path.resolve(__dirname, "node_modules/stream-browserify"),
        process: path.resolve(__dirname, "node_modules/process"),
      };

      // Replace Metamask's @react-native-async-storage with a mock for the browser
      config.resolve.alias["@react-native-async-storage/async-storage"] =
        path.resolve(
          __dirname,
          "stubs/@react-native-async-storage/async-storage.js",
        );
    }

    if (dev) {
      config.cache = false;
    }

    return config;
  },

  /**
   * Turbopack configuration for Next.js 16 (default bundler on Vercel).
   *
   * RATIONALE:
   * - Next.js 16 uses Turbopack by default on Vercel. The webpack config below
   *   is still kept for local `--webpack` usage, but Turbopack needs its own
   *   React aliasing to prevent duplicate React instances.
   * - Without these aliases, packages like @react-three/fiber, rainbowkit, and
   *   wagmi resolve to different React copies, causing:
   *   "Cannot read properties of undefined (reading 'ReactCurrentBatchConfig')"
   * - Uses relative paths (not path.resolve) because Turbopack on Windows does
   *   not support absolute paths with drive letters (e.g. C:\...).
   */
  turbopack: {
    resolveAlias: {
      react: "./node_modules/react",
      "react-dom": "./node_modules/react-dom",
      three: "./node_modules/three",
      "@react-native-async-storage/async-storage":
        "./stubs/@react-native-async-storage/async-storage.js",
    },
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL || "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
