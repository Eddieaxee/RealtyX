// Server component: await params instead of using client-only hooks
import Link from "next/link";
import { ShieldCheck, ArrowLeft, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPublicPages({ params }: PageProps) {
  const { slug } = await params;

  // Normalize path inputs into clean structural headers
  const title = slug.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Alternate dynamic text descriptions based on path context
  const getContent = () => {
    switch (slug.toLowerCase()) {
      case "privacy":
      case "terms":
      case "compliance":
        return {
          icon: ShieldCheck,
          tag: "Regulatory Enclosure",
          desc: "Our regulatory frameworks are audited continuously to maintain SEC tokenization guidelines and client data encryption layouts.",
          bullets: [
            "Decentralized escrow verification modules",
            "On-chain fractional certificate validation logs",
            "Complete institutional KYC/AML onboarding pathways",
          ],
        };
      case "about":
      case "careers":
        return {
          icon: Users,
          tag: "Corporate Framework",
          desc: "RealtyX tokenizes tier-1 commercial real estate developments, shifting illiquid private assets into high-velocity fractional fields.",
          bullets: [
            "Engineered by infrastructure architects",
            "Backed by institutional liquidity partners",
            "Pioneering distributed smart contract registries",
          ],
        };
      default:
        return {
          icon: FileText,
          tag: "Platform Disclosure",
          desc: `Review active procedural parameters regarding our structural ${title} ecosystem configurations.`,
          bullets: [
            "Real-time data feeds enabled",
            "Audited ledger updates",
            "Transparent interface pipelines",
          ],
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-[#090A0C] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E2B93B]/5 blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full p-8 rounded-3xl bg-[#0D0E12] border border-white/5 space-y-6 relative z-10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B]">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                {content.tag}
              </span>
              <h1 className="text-xl font-black text-white">{title} Section</h1>
            </div>
          </div>
          <span className="text-[10px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
            Active
          </span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
          {content.desc}
        </p>

        <div className="space-y-2 pt-2">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#E2B93B]">
            Core Protocols:
          </h4>
          <ul className="space-y-2 font-mono text-[11px] text-neutral-400">
            {content.bullets.map((b, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#E2B93B]"></span> {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
          <Link href="/" passHref legacyBehavior>
            <Button
              size="sm"
              variant="ghost"
              className="text-neutral-400 hover:text-white font-mono text-xs"
            >
              <ArrowLeft className="mr-1.5 w-3.5 h-3.5" /> Back to Home
            </Button>
          </Link>
          <Link href="/portal" passHref legacyBehavior>
            <Button
              size="sm"
              className="bg-[#E2B93B] text-black hover:bg-[#B89221] font-mono font-bold text-xs rounded-xl h-9"
            >
              Console Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
