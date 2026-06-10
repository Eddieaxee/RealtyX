"use client";

import Link from "next/link";
import { Building2, Linkedin, Mail } from "lucide-react";

// Realigned links mapping perfectly to your current layout system dashboard paths
const footerLinks = {
  Platform: [
    { label: "Browse Properties", href: "/properties" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Invest", href: "/auth/signup" },
    { label: "Dashboard", href: "/auth/signin" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Education Hub", href: "/education" },
    { label: "Trust & Security", href: "/trust" },
    { label: "Contact", href: "mailto:contact@realtyx.co" },
  ],
  Resources: [
    { label: "Properties", href: "/properties" },
    { label: "Getting Started", href: "/education" },
    { label: "FAQ", href: "/about" },
    { label: "Blog", href: "/education" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/trust" },
    { label: "Terms of Service", href: "/trust" },
    { label: "Trust & Security", href: "/trust" },
    { label: "Compliance", href: "/trust" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Realty<span className="text-gradient-gold">X</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              The future of fractional real estate investing. Tokenized,
              intelligent, and accessible.
            </p>

            {/* FIXED: Replaced raw '#' anchors to valid external target safety footprints */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/realtyx"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter (opens in new tab)"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012.07 7v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://github.com/realtyx"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub (opens in new tab)"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5A12 12 0 001.9 21.8c.4.1.5-.2.5-.4v-1.6c-2 .4-2.5-.5-2.7-1 0 0-.5-1.2-1.2-1.6 0 0-1-.7 0-.7 0 0 .9 0 1.4 1 0 0 .8 1.4 2.1 1 0 0 .1-.6.4-1.1-1.7-.2-3.5-.9-3.5-4A3.1 3.1 0 013.8 9s.9-.3 3.1 1.2a10.7 10.7 0 015.6 0C17.5 8.7 18.4 9 18.4 9a3.1 3.1 0 01.2 2.8c0 3.1-1.8 3.8-3.5 4 .3.3.6.9.6 1.8v2.6c0 .2.1.5.5.4A12 12 0 0012 .5z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/realtyx"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn (opens in new tab)"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@realtyx.co"
                title="Email contact@realtyx.co"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Updated timestamp array metrics anchor */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 RealtyX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium">Ethereum</span>
              <span className="text-xs font-medium">Base</span>
              <span className="text-xs font-medium">Polygon</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
