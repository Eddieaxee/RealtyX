import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { BlogGrid } from "@/components/public/blog-grid";

export const metadata = {
  title: "Blog",
  description: "Insights, guides, and news about fractional real estate investing, tokenization, and the African property market.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Insights & <span className="text-gradient-gold">Analysis</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert insights on real estate investing, blockchain technology, and market trends.
            </p>
          </div>
          <BlogGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}