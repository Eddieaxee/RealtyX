import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { GettingStartedContent } from "@/components/public/getting-started-content";

export const metadata = {
  title: "Getting Started",
  description: "A step-by-step guide to start investing in fractional real estate with RealtyX.",
};

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Getting <span className="text-gradient-gold">Started</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your step-by-step guide to start investing in fractional real estate with RealtyX.
            </p>
          </div>
          <GettingStartedContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}