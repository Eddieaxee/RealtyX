"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import "./asset-breakdown.css";
const data = [
  {
    name: "Premium Residential Houses",
    value: 65,
    color: "#E2B93B",
    className: "premium",
  },
  {
    name: "Commercial & Logistical Hubs",
    value: 25,
    color: "#4B5563",
    className: "commercial",
  },
  {
    name: "High-Yield Infrastructure Developments",
    value: 10,
    color: "#1F2937",
    className: "infrastructure",
  },
];

export function AssetBreakdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-6">
        <PieIcon className="w-4 h-4 text-[#E2B93B]" />
        <h2 className="text-base font-bold text-white tracking-tight">
          Portfolio Allocation Profile
        </h2>
      </div>

      <div className="h-[180px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#090A0C"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Allocation Weight"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-2.5 h-2.5 rounded-md shrink-0 dot ${item.className}`}
              />
              <span className="text-neutral-400 truncate">{item.name}</span>
            </div>
            <span className="text-white font-mono font-bold ml-2 shrink-0">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
