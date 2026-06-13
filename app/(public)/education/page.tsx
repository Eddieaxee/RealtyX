import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { EducationHub } from "@/components/public/education-hub";

export const metadata = {
  title: "Education Hub",
  description: "Learn everything about fractional real estate investing, tokenization, and blockchain technology.",
};

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Education <span className="text-gradient-gold">Hub</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master fractional real estate investing with our comprehensive learning resources.
            </p>
          </div>
          <EducationHub />
        </div>
      </main>
      <Footer />
    </div>
  );
}