"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", users: 120, investments: 45, volume: 280000 },
  { day: "Tue", users: 145, investments: 52, volume: 320000 },
  { day: "Wed", users: 138, investments: 48, volume: 290000 },
  { day: "Thu", users: 162, investments: 61, volume: 380000 },
  { day: "Fri", users: 178, investments: 72, volume: 450000 },
  { day: "Sat", users: 95, investments: 38, volume: 210000 },
  { day: "Sun", users: 88, investments: 32, volume: 185000 },
];

export function PlatformActivity() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border/50 bg-card/50 p-6">
      <h2 className="text-lg font-semibold mb-4">Platform Activity</h2>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
            <Bar dataKey="users" fill="#d4a017" radius={[4, 4, 0, 0]} />
            <Bar dataKey="investments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}