import { PropertiesGrid } from "@/components/dashboard/properties-grid";
import { InvestmentFilters } from "@/components/dashboard/investment-filters";

export default function InvestPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Invest</h1>
        <p className="text-muted-foreground mt-1">Browse and invest in premium tokenized properties.</p>
      </div>
      <InvestmentFilters />
      <PropertiesGrid />
    </div>
  );
}