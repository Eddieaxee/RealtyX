"use client";

import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { UserCheck, UserX, Clock } from "lucide-react";

const users = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "active", kyc: "verified", joined: "2024-05-22", investments: 12 },
  { id: "2", name: "Bob Smith", email: "bob@example.com", status: "active", kyc: "pending", joined: "2024-05-21", investments: 0 },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "suspended", kyc: "rejected", joined: "2024-05-20", investments: 3 },
  { id: "4", name: "Diana Prince", email: "diana@example.com", status: "active", kyc: "verified", joined: "2024-05-19", investments: 8 },
  { id: "5", name: "Evan Wright", email: "evan@example.com", status: "pending", kyc: "submitted", joined: "2024-05-18", investments: 0 },
];

export function RecentUsers() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border/50 bg-card/50 p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">KYC</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Investments</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/30 hover:bg-background/50 transition-colors">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    user.status === "active" ? "bg-green-500/10 text-green-500" :
                    user.status === "suspended" ? "bg-red-500/10 text-red-500" :
                    "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {user.status === "active" ? <UserCheck className="w-3 h-3" /> :
                     user.status === "suspended" ? <UserX className="w-3 h-3" /> :
                     <Clock className="w-3 h-3" />}
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                    user.kyc === "verified" ? "bg-green-500/10 text-green-500" :
                    user.kyc === "rejected" ? "bg-red-500/10 text-red-500" :
                    "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {user.kyc}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm hidden sm:table-cell">{user.investments}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(user.joined)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}