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
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,

      // Prisma's generated client/runtime may import Node built-ins using the `node:` scheme.
      // Next/webpack can attempt to bundle these in some compilation paths (e.g. middleware/routes),
      // so we provide explicit fallbacks to avoid `UnhandledSchemeError`.
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
    ];
  },
};

module.exports = nextConfig;
