import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { Scale, Shield, FileCheck, Globe, Lock, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Compliance",
  description: "RealtyX regulatory compliance framework - SEC, CBN, and international standards.",
};

const frameworks = [
  {
    icon: Shield,
    title: "SEC Nigeria Compliance",
    description: "Fully registered and compliant with the Securities and Exchange Commission of Nigeria. All token offerings follow SEC guidelines for digital assets and securities.",
    items: ["SEC Registered Platform", "Digital Asset Compliance", "Investor Protection Fund", "Regular Reporting"],
  },
  {
    icon: Scale,
    title: "CBN Regulatory Framework",
    description: "Operating within Central Bank of Nigeria guidelines for digital financial services and cross-border transactions.",
    items: ["Licensed Digital Operations", "AML/CFT Compliance", "Transaction Monitoring", "Foreign Exchange Guidelines"],
  },
  {
    icon: Globe,
    title: "International Standards",
    description: "Adhering to international best practices for financial technology platforms and digital asset management.",
    items: ["ISO 27001 Certified", "SOC 2 Type II Compliant", "GDPR Data Protection", "FATF AML Standards"],
  },
  {
    icon: Lock,
    title: "Blockchain Security",
    description: "Smart contracts audited by leading blockchain security firms. Multi-signature wallets for fund custody.",
    items: ["Smart Contract Audits", "Multi-Sig Wallets", "Bug Bounty Program", "Real-time Monitoring"],
  },
];

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Scale className="w-12 h-12 text-[#E2B93B] mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Regulatory <span className="text-gradient-gold">Compliance</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              RealtyX operates within strict regulatory frameworks to ensure the security and legality of all investments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {frameworks.map((framework) => (
              <div key={framework.title} className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
                <framework.icon className="w-8 h-8 text-[#E2B93B] mb-4" />
                <h3 className="text-xl font-bold mb-2">{framework.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{framework.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {framework.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-2xl border border-border/50 bg-card/50 mb-16">
            <h2 className="text-2xl font-bold mb-4">KYC/AML Procedures</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-[#E2B93B]">Identity Verification</h3>
                <p className="text-xs text-muted-foreground">
                  All investors must complete identity verification using a government-issued photo ID. We accept national IDs, passports, and driver's licenses from over 190 countries.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-[#E2B93B]">Address Verification</h3>
                <p className="text-xs text-muted-foreground">
                  Proof of address is required via utility bills, bank statements, or official government correspondence dated within the last 3 months.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-[#E2B93B]">Ongoing Monitoring</h3>
                <p className="text-xs text-muted-foreground">
                  Continuous transaction monitoring and periodic KYC reviews ensure ongoing compliance. Suspicious activities are reported to relevant authorities.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50">
            <FileCheck className="w-10 h-10 text-[#E2B93B] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Compliance Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              For detailed compliance documentation, audit reports, or regulatory certificates, contact our compliance team.
            </p>
            <a
              href="mailto:compliance@realtyx.co"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-[#090A0C] font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Contact Compliance Team
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}