"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { WalletBalance } from "@/components/wallet/wallet-balance";
import { WalletTransactions } from "@/components/wallet/wallet-transactions";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type KycApiResponse = {
  status?: string | null;
  kycRecord?: { status?: string | null };
};

export default function WalletPage() {
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [kycLoading, setKycLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadKyc() {
      try {
        setKycLoading(true);
        const res = await fetch("/api/kyc", { method: "GET" });
        if (!res.ok) {
          if (!alive) return;
          setKycStatus(null);
          return;
        }
        const data = (await res.json()) as KycApiResponse;
        const status =
          data?.status ?? data?.kycRecord?.status ?? (null as string | null);

        if (!alive) return;
        setKycStatus(typeof status === "string" ? status : null);
      } catch {
        if (!alive) return;
        setKycStatus(null);
      } finally {
        if (!alive) return;
        setKycLoading(false);
      }
    }

    loadKyc();
    return () => {
      alive = false;
    };
  }, []);

  const canConnect = useMemo(() => {
    return (
      kycStatus === "SUBMITTED" ||
      kycStatus === "UNDER_REVIEW" ||
      kycStatus === "APPROVED"
    );
  }, [kycStatus]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Capital Ledger & Wallet
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Monitor your fiat balances, manage Web3 smart contract connections,
            and review distribution logs.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs font-mono text-emerald-400 self-start md:self-center">
          SECURED NODE: <span className="font-bold">AES_256_GCM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <WalletBalance />
          <WalletTransactions />
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          {kycLoading ? (
            <div className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 shadow-xl">
              <p className="text-sm text-neutral-300">
                Checking KYC verification…
              </p>
            </div>
          ) : canConnect ? (
            <WalletConnect />
          ) : (
            <div className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 shadow-xl">
              <h2 className="text-base font-bold text-white tracking-tight">
                KYC required to connect
              </h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Complete the verification pipeline before establishing Web3
                connections.
              </p>

              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-xl bg-[#13161C]/50 border border-white/5">
                  <p className="text-[11px] text-neutral-300 font-medium">
                    Current verification status:{" "}
                    <span className="text-neutral-200">
                      {kycStatus ?? "Unknown"}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-black font-bold rounded-xl h-10 px-5 shadow-lg shadow-[#E2B93B]/5"
                  >
                    <Link href="/dashboard/kyc">Complete KYC</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 bg-transparent rounded-xl h-10 px-4"
                  >
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12]/40 text-xs text-neutral-400 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-neutral-300">
                Audited Execution Gateway
              </p>
              <p className="leading-relaxed">
                All transactions process securely using smart contracts verified
                by external security audits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
