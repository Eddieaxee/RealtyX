"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", approved: 12, rejected: 2 },
  { name: "Tue", approved: 18, rejected: 1 },
  { name: "Wed", approved: 15, rejected: 4 },
  { name: "Thu", approved: 22, rejected: 0 },
  { name: "Fri", approved: 25, rejected: 3 },
];

export function KYCAnalyticsDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-[#0D0E12] border-white/5">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-400">
            Weekly Throughput (Approvals vs Rejections)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#525252" fontSize={12} />
              <YAxis stroke="#525252" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D0E12",
                  borderColor: "#262626",
                }}
              />
              <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-[#0D0E12] border-white/5">
          <CardHeader>
            <CardTitle className="text-sm text-neutral-400">
              System Efficiency Metric
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">94.2%</div>
            <p className="text-xs text-emerald-400 mt-1">
              Approval rate (Last 7 days)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
