import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { CurrencyProvider } from "@/context/currency-context"; // <-- Imported here
import { Toaster } from "sonner";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { KYCStatusListener } from "@/components/notifications/kyc-listener";
import { auth } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RealtyX — Fractional Real Estate Investing",
    template: "%s | RealtyX",
  },
  description:
    "Invest in premium real estate from $100. Tokenized ownership, AI-powered insights, and institutional-grade security.",
  keywords: [
    "fractional real estate",
    "tokenized assets",
    "blockchain investing",
    "real estate tokens",
    "property investment",
  ],
  authors: [{ name: "RealtyX" }],
  creator: "RealtyX",
  publisher: "RealtyX",
  metadataBase: new URL("https://realtyx.io"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "RealtyX — Fractional Real Estate Investing",
    description: "Invest in premium real estate from $100",
    type: "website",
    locale: "en_US",
    url: "https://realtyx.io",
    siteName: "RealtyX",
    images: [
      { url: "/og-image.svg", width: 1200, height: 630, alt: "RealtyX" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RealtyX — Fractional Real Estate Investing",
    description: "Invest in premium real estate from $100",
    images: ["/og-image.svg"],
    creator: "@realtyx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // Fetch session server-side

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <CurrencyProvider>
            {/* Inject the listener only if the user is authenticated */}
            <Toaster position="top-right" richColors theme="dark" />
            {session?.user?.id && (
              <KYCStatusListener userId={session.user.id} />
            )}

            {children}
            <Toaster />
          </CurrencyProvider>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
