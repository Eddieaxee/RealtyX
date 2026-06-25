/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname cleanly for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: "standalone",

  // 1. Correct location for production dependencies
  serverExternalPackages: ["@prisma/client", "hardhat"],

  // 2. Clear out the Turbopack / Webpack fallback mismatch
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.realtyx.io" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  reactStrictMode: true,

  // 3. Centralized Webpack pipeline configuration
  webpack: (config, { isServer, dev }) => {
    // Force all 3D/Web3 libraries to use a single shared copy of React
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    };

    // Prevent Webpack from breaking on MetaMask's uninstalled mobile code pathways
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "@react-native-async-storage/async-storage":
          "commonjs @react-native-async-storage/async-storage",
      });
    }

    // Disable disk caching to prevent stale binary mismatches during dev mode
    if (dev) {
      config.cache = false;
    }

    return config;
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
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/favicon.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
