import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ShieldAlert, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview";
import { RecentInvestments } from "@/components/dashboard/recent-investments";
import { MarketInsights } from "@/components/dashboard/market-insights";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AIInsights } from "@/components/ai/ai-insights";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch critical compliance indicator records directly from the database level
  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      status: true,
      // User model has `name`; keep UI safe for missing first name.
      name: true,
    },
  });

  const showKycBanner = userRecord?.status !== "ACTIVE";

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-white bg-[#090A0C] min-h-screen">
      {/* Top Header Segment */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Investor Console
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Welcome back
            {userRecord?.name ? `, ${userRecord.name}` : ""}. Monitoring
            tracking metrics and macro performance indexes.
          </p>
        </div>
        <div className="text-xs font-mono text-neutral-500 bg-[#13161C] border border-white/5 px-3 py-1.5 rounded-lg self-start sm:self-center">
          SYSTEM_STATUS:{" "}
          <span className="text-emerald-400 font-semibold">ONLINE</span>
        </div>
      </div>

      {/* Conditional CBN Compliance Prompt Layer */}
      {showKycBanner && (
        <div className="p-4 rounded-xl border border-[#E2B93B]/20 bg-[#E2B93B]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-[#E2B93B]/2 text-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#E2B93B] shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-semibold text-white">
                Identity Verification Status Restrained
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {userRecord?.status === "PENDING"
                  ? "Your CBN registry documents are undergoing validation check protocols. Safe trading opens shortly."
                  : "Your compliance file is empty. To interact with high-yield structural assets, unlock verification."}
              </p>
            </div>
          </div>
          {userRecord?.status !== "PENDING" && (
            <Link
              href="/kyc"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E2B93B] hover:text-[#B89221] bg-[#E2B93B]/10 hover:bg-[#E2B93B]/20 px-3 py-2 rounded-lg transition-all self-start sm:self-center shrink-0"
            >
              Complete Verification <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* Core Analytic Data Presentation Area */}
      <PortfolioOverview />

      {/* AI-Powered Diagnostic Insights */}
      <AIInsights />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Relational Asset Data Block */}
        <div className="lg:col-span-2 space-y-6">
          <RecentInvestments />
        </div>

        {/* Quick Action Control Panel & Secondary Market Metrics Block */}
        <div className="space-y-6">
          <QuickActions />
          <MarketInsights />
        </div>
      </div>
    </div>
  );
}
