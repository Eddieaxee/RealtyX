"use client";

import { motion } from "framer-motion";
import { FileCheck, Clock, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const kycItems = [
  { id: "1", name: "Sarah Connor", submitted: "2024-05-22", type: "Individual", risk: "low" },
  { id: "2", name: "James Bond", submitted: "2024-05-21", type: "Individual", risk: "medium" },
  { id: "3", name: "Wayne Enterprises", submitted: "2024-05-20", type: "Corporate", risk: "high" },
  { id: "4", name: "Tony Stark", submitted: "2024-05-19", type: "Individual", risk: "low" },
];

export function PendingKYC() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border/50 bg-card/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Pending KYC</h2>
        <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500">{kycItems.length} pending</span>
      </div>
      <div className="space-y-3">
        {kycItems.map((item) => (
          <div key={item.id} className="p-4 rounded-lg bg-background/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{item.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  Submitted {item.submitted}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                item.risk === "low" ? "bg-green-500/10 text-green-500" :
                item.risk === "medium" ? "bg-yellow-500/10 text-yellow-500" :
                "bg-red-500/10 text-red-500"
              }`}>
                {item.risk} risk
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs"><X className="w-3 h-3 mr-1" />Reject</Button>
              <Button size="sm" className="flex-1 h-8 text-xs gradient-gold text-white"><Check className="w-3 h-3 mr-1" />Approve</Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}