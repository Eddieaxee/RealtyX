import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { BookOpen, Lightbulb, TrendingUp, Shield } from "lucide-react";

const topics = [
  { icon: BookOpen, title: "Fractional Investing 101", description: "Learn the basics of fractional real estate ownership and how it works." },
  { icon: Lightbulb, title: "Tokenization Explained", description: "Understand how blockchain tokenization transforms real estate assets." },
  { icon: TrendingUp, title: "Portfolio Strategy", description: "Build a diversified real estate portfolio with AI-powered recommendations." },
  { icon: Shield, title: "Security & Compliance", description: "Learn about our institutional-grade security and regulatory framework." },
];

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Investor <span className="text-gradient-gold">Education</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Learn everything you need to know about fractional real estate investing.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <div key={topic.title} className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
                <topic.icon className="w-8 h-8 text-gold-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                <p className="text-muted-foreground">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}