import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { TrustSection } from "@/components/public/trust-section";

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Trust & <span className="text-gradient-gold">Security</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Your security is our top priority. Learn about our multi-layered protection systems.</p>
        </div>
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}