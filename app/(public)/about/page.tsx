import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { Building2, Users, Globe, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About <span className="text-gradient-gold">RealtyX</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Democratizing real estate investment through blockchain technology and AI-powered insights.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 rounded-xl border border-border/50 bg-card/50">
              <Building2 className="w-8 h-8 text-gold-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">To make premium real estate investment accessible to everyone, everywhere, through fractional ownership and tokenization.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50">
              <Globe className="w-8 h-8 text-gold-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-muted-foreground">Operating across 15+ countries with properties in major metropolitan areas worldwide.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50">
              <Users className="w-8 h-8 text-gold-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community First</h3>
              <p className="text-muted-foreground">Over 50,000 investors trust RealtyX for their real estate portfolio needs.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50">
              <Shield className="w-8 h-8 text-gold-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Institutional Trust</h3>
              <p className="text-muted-foreground">Bank-grade security, audited smart contracts, and regulatory compliance at every step.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}