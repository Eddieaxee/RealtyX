"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const properties = [
  { id: "1", title: "Manhattan Penthouse", location: "New York, USA", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", tokenPrice: 100, expectedReturn: 14.2, rentalYield: 8.5, availableTokens: 4200, totalTokens: 85000, funded: 85 },
  { id: "2", title: "Miami Beachfront Villa", location: "Miami, USA", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", tokenPrice: 50, expectedReturn: 18.5, rentalYield: 12.3, availableTokens: 18000, totalTokens: 64000, funded: 72 },
  { id: "3", title: "Berlin Tech Office", location: "Berlin, Germany", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", tokenPrice: 75, expectedReturn: 11.8, rentalYield: 7.2, availableTokens: 9500, totalTokens: 72000, funded: 65 },
  { id: "4", title: "Tokyo Shibuya Tower", location: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80", tokenPrice: 125, expectedReturn: 9.3, rentalYield: 6.1, availableTokens: 5600, totalTokens: 48000, funded: 88 },
  { id: "5", title: "London Canary Wharf", location: "London, UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80", tokenPrice: 80, expectedReturn: 10.5, rentalYield: 7.8, availableTokens: 12000, totalTokens: 95000, funded: 45 },
  { id: "6", title: "Dubai Marina Residences", location: "Dubai, UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", tokenPrice: 60, expectedReturn: 16.2, rentalYield: 11.5, availableTokens: 8500, totalTokens: 52000, funded: 78 },
];

export function PropertiesGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, i) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-gold-500/30 transition-all duration-300"
        >
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Funded</span>
                <span className="font-medium">{property.funded}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full gradient-gold transition-all" style={{ width: `${property.funded}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div><div className="text-xs text-muted-foreground">Token Price</div><div className="font-semibold">${property.tokenPrice}</div></div>
              <Link href={`/invest/${property.id}`}>
                <Button size="sm" className="gradient-gold text-white hover:opacity-90">
                  Invest <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}