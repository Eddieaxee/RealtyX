"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";
import styles from "./platform-activity.module.css";

const data = [
  { day: "Mon", users: 120, investments: 45, volume: 280000 },
  { day: "Tue", users: 145, investments: 52, volume: 320000 },
  { day: "Wed", users: 138, investments: 48, volume: 290000 },
  { day: "Thu", users: 162, investments: 61, volume: 380000 },
  { day: "Fri", users: 178, investments: 72, volume: 450000 },
  { day: "Sat", users: 95, investments: 38, volume: 210000 },
  { day: "Sun", users: 88, investments: 32, volume: 185000 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<Record<string, unknown>>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#13161C] border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-xs font-bold text-white mb-1">{label}</p>
        {payload.map((entry: Record<string, unknown>, index: number) => (
          <p key={index} className={`text-[10px] font-mono ${styles.tooltipValue}`} style={{ "--tooltip-color": entry.color as string } as React.CSSProperties}>
            {entry.name as string}: {(entry.value as number).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PlatformActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#E2B93B]" /> Platform Activity
        </h3>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#E2B93B]" />
            <span className="text-neutral-500">Users</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-neutral-500">Investments</span>
          </div>
        </div>
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="monospace" />
            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="monospace" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="users" fill="#E2B93B" radius={[4, 4, 0, 0]} name="Users" />
            <Bar dataKey="investments" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Investments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}