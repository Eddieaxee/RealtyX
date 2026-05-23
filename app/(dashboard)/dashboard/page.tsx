import { PortfolioOverview } from "@/components/dashboard/portfolio-overview";
import { RecentInvestments } from "@/components/dashboard/recent-investments";
import { MarketInsights } from "@/components/dashboard/market-insights";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here is your portfolio overview.</p>
      </div>
      <PortfolioOverview />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentInvestments />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <MarketInsights />
        </div>
      </div>
    </div>
  );
}