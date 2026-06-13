/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.realtyx.io" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
  // Performance optimizations
  reactStrictMode: true,
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  // Bundle analyzer for development (uncomment to analyze)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.plugins.push(new BundleAnalyzerPlugin());
  //   }
  //   return config;
  // },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      "node:crypto": false,
      stream: false,
      "node:stream": false,
      buffer: false,
      "node:buffer": false,
      url: false,
      "node:url": false,
      util: false,
      "node:util": false,
    };

    // Optimize bundle splitting
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          chunks: "all",
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            threejs: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: "threejs-vendor",
              chunks: "all",
              priority: 20,
            },
            framer: {
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              name: "framer-vendor",
              chunks: "all",
              priority: 15,
            },
          },
        },
      };
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
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Cache static assets for 1 year
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

module.exports = nextConfig;