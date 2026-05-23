"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, TrendingUp, Building2, ArrowLeft, Wallet, Shield, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { formatCurrency } from "@/lib/utils";

const properties = [
  { id: "1", title: "Luxury Manhattan Penthouse", location: "New York, USA", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", totalValue: 8500000, tokenPrice: 100, expectedReturn: 14.2, rentalYield: 8.5, availableTokens: 4200, totalTokens: 85000, funded: 85, description: "Premium penthouse in the heart of Manhattan with stunning city views, private elevator, and 360-degree terrace.", features: ["Pool", "Gym", "Concierge", "Parking", "Terrace", "Smart Home"], documents: ["Offering Memorandum", "Financial Projections", "Property Inspection", "Title Report"] },
  { id: "2", title: "Miami Beachfront Villa", location: "Miami, USA", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", totalValue: 3200000, tokenPrice: 50, expectedReturn: 18.5, rentalYield: 12.3, availableTokens: 18000, totalTokens: 64000, funded: 72, description: "Stunning beachfront property with private access, ocean views, and modern architecture.", features: ["Beach Access", "Pool", "Garden", "Security", "Boat Dock", "Outdoor Kitchen"], documents: ["Offering Memorandum", "Financial Projections", "Property Inspection"] },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const property = properties.find(p => p.id === params.id) || properties[0];
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/invest" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Properties
          </Link>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-96 rounded-2xl overflow-hidden">
                <Image src={property.image} alt={property.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> {property.location}</div>
                </div>
              </motion.div>
              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h2 className="text-lg font-semibold mb-4">About this Property</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>
              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h2 className="text-lg font-semibold mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2 p-3 rounded-lg bg-background/50">
                      <Building2 className="w-4 h-4 text-gold-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h2 className="text-lg font-semibold mb-4">Documents</h2>
                <div className="space-y-2">
                  {property.documents.map(doc => (
                    <div key={doc} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-primary" /><span className="text-sm">{doc}</span></div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-xl border border-border/50 bg-card/50 sticky top-24">
                <div className="space-y-4">
                  <div><div className="text-sm text-muted-foreground">Property Value</div><div className="text-2xl font-bold">{formatCurrency(property.totalValue)}</div></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><div className="text-sm text-muted-foreground">Expected Return</div><div className="text-lg font-semibold text-green-500 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> {property.expectedReturn}%</div></div>
                    <div><div className="text-sm text-muted-foreground">Rental Yield</div><div className="text-lg font-semibold">{property.rentalYield}%</div></div>
                  </div>
                  <div><div className="text-sm text-muted-foreground">Token Price</div><div className="text-xl font-bold">${property.tokenPrice}</div></div>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Funded</span><span className="font-medium">{property.funded}%</span></div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full gradient-gold" style={{ width: `${property.funded}%` }} /></div>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-4"><Shield className="w-4 h-4 text-gold-500" /><span className="text-xs text-muted-foreground">Audited by CertiK</span></div>
                    <Button className="w-full gradient-gold text-white hover:opacity-90"><Wallet className="w-4 h-4 mr-2" />Invest Now</Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}