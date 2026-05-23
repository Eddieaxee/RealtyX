"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function InvestmentFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search properties..." className="pl-10" />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">All Types</Button>
        <Button variant="outline" size="sm">Residential</Button>
        <Button variant="outline" size="sm">Commercial</Button>
        <Button variant="outline" size="icon" className="shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}