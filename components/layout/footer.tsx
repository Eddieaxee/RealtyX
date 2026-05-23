"use client";
import Link from "next/link";
import { Building2, Github, Twitter, Linkedin, Mail } from "lucide-react";
const footerLinks = {
  Product: [{ label: "Properties", href: "/properties" }, { label: "Portfolio", href: "/portfolio" }, { label: "AI Assistant", href: "/ai-assistant" }, { label: "Pricing", href: "/pricing" }],
  Company: [{ label: "About", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Press", href: "/press" }, { label: "Contact", href: "/contact" }],
  Resources: [{ label: "Documentation", href: "/docs" }, { label: "API", href: "/api" }, { label: "Education", href: "/education" }, { label: "Blog", href: "/blog" }],
  Legal: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Security", href: "/trust" }, { label: "Compliance", href: "/compliance" }],
};
export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center"><Building2 className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-bold">Realty<span className="text-gradient-gold">X</span></span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">The future of fractional real estate investing. Tokenized, intelligent, and accessible.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}><Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2024 RealtyX. All rights reserved.</p>
          <div className="flex items-center gap-6"><span className="text-xs text-muted-foreground">Powered by</span><div className="flex items-center gap-3"><span className="text-xs font-medium">Ethereum</span><span className="text-xs font-medium">Base</span><span className="text-xs font-medium">Polygon</span></div></div>
        </div>
      </div>
    </footer>
  );
}