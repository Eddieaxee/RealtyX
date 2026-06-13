import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "RealtyX privacy policy - how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="w-12 h-12 text-[#E2B93B] mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Privacy <span className="text-gradient-gold">Policy</span></h1>
            <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
          </div>
          <div className="prose prose-invert max-w-none space-y-8">
            <section className="p-6 rounded-2xl border border-border/50 bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">1. Information We Collect</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We collect information you provide directly, including your name, email address, phone number, government-issued ID for KYC verification, proof of address, financial information for transactions, and communication preferences. We also automatically collect device information, IP addresses, browser type, and usage data through cookies and similar technologies.
              </p>
            </section>
            <section className="p-6 rounded-2xl border border-border/50 bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your information is used to provide and improve our services, process transactions, verify your identity (KYC/AML compliance), communicate important updates, personalize your experience, ensure platform security, and comply with legal obligations. We do not sell your personal information to third parties.
              </p>
            </section>
            <section className="p-6 rounded-2xl border border-border/50 bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">3. Data Security</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We employ industry-standard encryption (AES-256), multi-factor authentication, regular security audits, and SOC 2 Type II compliance measures. Your financial data is processed through PCI DSS compliant payment processors. Smart contract interactions are audited by leading blockchain security firms.
              </p>
            </section>
            <section className="p-6 rounded-2xl border border-border/50 bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">4. Data Sharing</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We share information only with: regulatory authorities as required by law, service providers who assist in platform operations (under strict NDAs), blockchain networks for transaction verification (limited to wallet addresses), and trusted partners for KYC/AML verification. All third-party processors are bound by data processing agreements.
              </p>
            </section>
            <section className="p-6 rounded-2xl border border-border/50 bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">5. Your Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You have the right to access, correct, delete, or port your personal data. You can opt out of non-essential communications, request a copy of all data we hold, and request deletion of your account. Contact our Data Protection Officer at privacy@realtyx.co for any data-related requests.
              </p>
            </section>
            <section className="p-6 rounded-2xl border border-border/50 bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">6. Contact</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For privacy-related inquiries, contact our Data Protection Officer at privacy@realtyx.co or write to: RealtyX Tech Ltd, 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}