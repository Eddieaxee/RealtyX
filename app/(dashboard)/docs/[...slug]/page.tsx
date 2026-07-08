// Server component: await params instead of using client-only hooks
import Link from "next/link";
import { BookOpen, ChevronRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocsProps {
  params: Promise<{ slug: string[] }>;
}

export default async function TechnicalDocsDynamicRoute({ params }: DocsProps) {
  const { slug } = await params;
  const coreNode = slug[0] || "documentation";

  // Compute navigation metrics based on dynamic url params array
  const displayTitle = coreNode
    .replace("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-[#090A0C] text-white flex">
      {/* Dynamic Docs Left Side Minimal Navigation Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0D0E12]/80 p-6 hidden md:block space-y-6 shrink-0">
        <div className="flex items-center gap-2 text-[#E2B93B] font-mono font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" /> Resource Center
        </div>
        <div className="space-y-1 font-mono text-xs">
          <Link
            href="/docs"
            className={`block p-2 rounded-xl transition-all ${coreNode === "docs" ? "bg-white/5 text-[#E2B93B] font-bold" : "text-neutral-400 hover:text-white"}`}
          >
            Platform Guides
          </Link>
          <Link
            href="/api-docs"
            className={`block p-2 rounded-xl transition-all ${coreNode === "api-docs" ? "bg-white/5 text-[#E2B93B] font-bold" : "text-neutral-400 hover:text-white"}`}
          >
            REST/WS Engine APIs
          </Link>
          <Link
            href="/education"
            className={`block p-2 rounded-xl transition-all ${coreNode === "education" ? "bg-white/5 text-[#E2B93B] font-bold" : "text-neutral-400 hover:text-white"}`}
          >
            Tokenization Hub
          </Link>
          <Link
            href="/blog"
            className={`block p-2 rounded-xl transition-all ${coreNode === "blog" ? "bg-white/5 text-[#E2B93B] font-bold" : "text-neutral-400 hover:text-white"}`}
          >
            Marketplace Notes
          </Link>
        </div>
      </aside>

      {/* Main Documentation Structural Reading Node Area */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
          <span>RealtyX Core</span> <ChevronRight className="w-3 h-3" />{" "}
          <span>{displayTitle}</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight">
            {displayTitle} Subsystems
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
            Technical specs, integration parameters, and interface operational
            runtimes mapped directly to your deployment console profiles.
          </p>
        </div>

        {/* Technical Code/Metric Box Block Visual Element */}
        <div className="p-5 bg-[#0D0E12] border border-white/5 rounded-2xl space-y-4">
          <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#E2B93B]" /> Localhost
            Synchronization Handshake
          </h3>
          <pre className="p-4 rounded-xl bg-[#090A0C] border border-white/5 font-mono text-[11px] text-emerald-400 overflow-x-auto">
            {`// Initialize asset synchronization routine
const connection = await RealtyXExchange.connect({
  environment: "production-mainnet-base",
  publicKey: "rx_auth_live_0x55efb...",
  ledgerType: "fractional_primary_book"
});

console.log(\`Node connected: \${connection.latency}ms\`);`}
          </pre>
        </div>

        <div className="pt-4 border-t border-white/5">
          <Link href="/portal" passHref legacyBehavior>
            <Button className="bg-[#E2B93B] text-black hover:bg-[#B89221] font-mono font-bold text-xs uppercase tracking-wider h-10 rounded-xl px-6">
              Return to Console App
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
