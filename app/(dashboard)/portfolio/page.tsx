import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { AssetBreakdown } from "@/components/dashboard/asset-breakdown";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";

export default function PortfolioPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground mt-1">Track your investments and performance.</p>
      </div>
      <PerformanceMetrics />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioChart />
        </div>
        <AssetBreakdown />
      </div>
    </div>
  );
}