"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const properties = [
  { id: "1", title: "Luxury Manhattan Penthouse", location: "New York, USA", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", totalValue: 8500000, tokenPrice: 100, expectedReturn: 14.2, rentalYield: 8.5, availableTokens: 4200, totalTokens: 85000 },
  { id: "2", title: "Miami Beachfront Villa", location: "Miami, USA", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", totalValue: 3200000, tokenPrice: 50, expectedReturn: 18.5, rentalYield: 12.3, availableTokens: 18000, totalTokens: 64000 },
  { id: "3", title: "Berlin Tech District Office", location: "Berlin, Germany", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", totalValue: 5400000, tokenPrice: 75, expectedReturn: 11.8, rentalYield: 7.2, availableTokens: 9500, totalTokens: 72000 },
];
export function PropertiesPreview() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured <span className="text-gradient-gold">Properties</span></h2>
            <p className="text-muted-foreground max-w-lg">Hand-picked premium assets with strong fundamentals and verified returns.</p>
          </motion.div>
          <Link href="/properties" className="hidden sm:block">
            <Button variant="ghost" className="group">View All<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-gold-500/30 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <Image src={property.image} alt={property.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-medium text-green-400">Active</div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="w-4 h-4" />{property.location}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Expected Return</div>
                    <div className="text-sm font-semibold text-green-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{property.expectedReturn}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Rental Yield</div>
                    <div className="text-sm font-semibold">{property.rentalYield}%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div><div className="text-xs text-muted-foreground">Token Price</div><div className="font-semibold">${property.tokenPrice}</div></div>
                  <div className="text-right"><div className="text-xs text-muted-foreground">Available</div><div className="font-semibold text-sm">{property.availableTokens.toLocaleString()} / {property.totalTokens.toLocaleString()}</div></div>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full gradient-gold" style={{ width: `${((property.totalTokens - property.availableTokens) / property.totalTokens) * 100}%` }} />
                </div>
                <Link href={`/properties/${property.id}`}><Button className="w-full gradient-gold text-white hover:opacity-90">Invest Now</Button></Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}