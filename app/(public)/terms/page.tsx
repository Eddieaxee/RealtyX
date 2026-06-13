import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "RealtyX terms of service - the rules and guidelines governing your use of our platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FileText className="w-12 h-12 text-[#E2B93B] mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Terms of <span className="text-gradient-gold">Service</span></h1>
            <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
          </div>
          <div className="space-y-8">
            {[
              { title: "1. Acceptance of Terms", content: "By accessing or using the RealtyX platform, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. These terms constitute a legally binding agreement between you and RealtyX Tech Ltd." },
              { title: "2. Eligibility", content: "You must be at least 18 years old and have the legal capacity to enter into binding agreements. You must complete KYC verification before making any investments. Users from restricted jurisdictions may be prohibited from using certain features." },
              { title: "3. Account Responsibilities", content: "You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized access. You are responsible for all activities that occur under your account. One account per person; duplicate accounts will be merged or suspended." },
              { title: "4. Investment Terms", content: "All investments carry risk. Past performance does not guarantee future results. Token prices may fluctuate. Returns are not guaranteed and depend on property performance. You may lose part or all of your investment. Diversification is recommended." },
              { title: "5. Fees and Charges", content: "RealtyX charges a 2% management fee on rental income and a 1% transaction fee on secondary market trades. Deposit and withdrawal fees may apply depending on the payment method. All fees are disclosed before transactions are confirmed." },
              { title: "6. Token Ownership", content: "Tokens represent fractional ownership in specific properties. Token holders are entitled to proportional rental income and exit proceeds. Tokens are non-voting unless explicitly stated. Token transfers are subject to platform rules and applicable regulations." },
              { title: "7. Secondary Market", content: "The secondary market allows peer-to-peer token trading. RealtyX acts as a facilitator and charges a 1% transaction fee. All trades are final. Price discovery is market-driven. Liquidity is not guaranteed." },
              { title: "8. Intellectual Property", content: "All content, trademarks, logos, and technology on the RealtyX platform are owned by RealtyX Tech Ltd. You may not copy, modify, distribute, or reverse-engineer any part of the platform without written permission." },
              { title: "9. Limitation of Liability", content: "RealtyX is not liable for investment losses, market fluctuations, or third-party actions. Our total liability is limited to the fees you paid in the 12 months preceding the claim. We are not responsible for indirect, incidental, or consequential damages." },
              { title: "10. Termination", content: "We may suspend or terminate your account for violations of these terms, suspicious activity, or regulatory requirements. You may close your account at any time, subject to pending transactions and settlement periods." },
              { title: "11. Governing Law", content: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved through arbitration in Lagos, Nigeria, unless otherwise required by applicable law." },
              { title: "12. Changes to Terms", content: "We reserve the right to modify these terms at any material changes will be communicated via email or platform notification. Continued use after changes constitutes acceptance of the updated terms." },
            ].map((section) => (
              <section key={section.title} className="p-6 rounded-2xl border border-border/50 bg-card/50 space-y-3">
                <h2 className="text-xl font-bold">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}