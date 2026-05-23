import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { PropertiesGrid } from "@/components/dashboard/properties-grid";
import { InvestmentFilters } from "@/components/dashboard/investment-filters";

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Investment <span className="text-gradient-gold">Properties</span></h1>
            <p className="text-muted-foreground max-w-2xl">Browse our curated selection of premium tokenized real estate assets.</p>
          </div>
          <InvestmentFilters />
          <div className="mt-8">
            <PropertiesGrid />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}