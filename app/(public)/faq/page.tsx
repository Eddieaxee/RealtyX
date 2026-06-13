import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { FAQSection } from "@/components/public/faq-section";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about RealtyX fractional real estate investing, tokenization, security, and account management.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Frequently Asked <span className="text-gradient-gold">Questions</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about fractional real estate investing with RealtyX.
            </p>
          </div>
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}