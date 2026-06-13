import Link from "next/link";
import { Building2, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#090A0C] text-white font-sans selection:bg-[#E2B93B]/30">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#161920] via-[#0D0E12] to-[#090A0C]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E2B93B_1px,transparent_1px)] [background-size:16px_16px]" />
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center shadow-lg shadow-[#E2B93B]/10">
            <Building2 className="w-5 h-5 text-[#090A0C]" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">
            Realty<span className="text-[#E2B93B]">X</span>
          </span>
        </Link>
        <div className="relative z-10 space-y-6 my-auto">
          <div className="text-8xl font-extrabold text-[#E2B93B]/20">404</div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15]">
            Route Not Found.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
            The requested endpoint does not exist in our system. Navigate back to the portal or explore our available routes.
          </p>
        </div>
        <div className="relative z-10 text-xs text-neutral-500">© 2026 RealtyX Tech.</div>
      </div>

      {/* Right Panel */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#0D0E12]">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="text-9xl font-extrabold text-[#E2B93B]/30">404</div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Page Not Found
            </h1>
            <p className="text-sm text-neutral-400">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 w-full h-11 justify-center bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#f3c94a] hover:to-[#cbab3a] text-[#090A0C] font-semibold rounded-xl shadow-lg shadow-[#E2B93B]/5 transition-all"
            >
              <Home className="w-4 h-4" />
              Return to Home
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 w-full h-11 justify-center border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}