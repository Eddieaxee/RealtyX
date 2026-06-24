"use client";

import * as React from "react";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { SessionProvider } from "next-auth/react";
import { config } from "@/lib/blockchain/config";
import { ThemeProvider } from "next-themes";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({
  children,
  cookie,
}: {
  children: React.ReactNode;
  cookie?: string | null;
}) {
  const initialState = cookieToInitialState(config, cookie);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <WagmiProvider config={config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              modalSize="compact"
              showRecentTransactions={true}
            >
              {mounted ? (
                children
              ) : (
                <div className="invisible">{children}</div>
              )}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
