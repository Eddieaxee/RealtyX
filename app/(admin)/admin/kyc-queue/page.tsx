"use client";

import { useState } from "react";
import { ShieldAlert, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/currency-context";

interface QueueItem {
  id: string;
  name: string;
  email: string;
  type: string;
  bvnStatus: "MATCHED" | "MISMATCH_FLAG";
  capitalIntended: number;
  dateLogged: string;
}

const mockQueue: QueueItem[] = [
  {
    id: "RX-901",
    name: "Chidi Okafor",
    email: "c.okafor@diaspora.net",
    type: "High Net Worth",
    bvnStatus: "MATCHED",
    capitalIntended: 45000000,
    dateLogged: "2026-06-05",
  },
  {
    id: "RX-902",
    name: "Olumide Awosika",
    email: "olumide@awosikaconsulting.ng",
    type: "Institutional Suite",
    bvnStatus: "MATCHED",
    capitalIntended: 120000000,
    dateLogged: "2026-06-06",
  },
  {
    id: "RX-903",
    name: "Amara Chukwu",
    email: "amara.bvn.test@fail.com",
    type: "Retail Investor",
    bvnStatus: "MISMATCH_FLAG",
    capitalIntended: 450000,
    dateLogged: "2026-06-07",
  },
];

export default function AdminKYCQueue() {
  const { formatValue } = useCurrency();
  const [queue, setQueue] = useState<QueueItem[]>(mockQueue);

  const handleProcessAction = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Admin Head Strip */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-500">
            <ShieldAlert className="w-3.5 h-3.5" /> Node Administrative
            Authorization
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Compliance Review Queue
          </h1>
        </div>
      </div>

      {/* Control Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-xl bg-[#0D0E12] border border-white/5 font-mono text-xs">
        <div className="flex items-center gap-2 bg-[#090A0C] border border-white/5 px-3 h-10 rounded-xl w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name, BVN ticket..."
            className="bg-transparent text-white w-full outline-none"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-white/5 text-neutral-400 hover:text-white h-10 px-4 rounded-xl"
        >
          <Filter className="w-3.5 h-3.5 mr-2" /> Filter Flags
        </Button>
      </div>

      {/* Main Review Grid Table */}
      <div className="border border-white/5 bg-[#0D0E12] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#090A0C] border-b border-white/5 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Dossier ID</th>
                <th className="p-4">Investor Identity</th>
                <th className="p-4">Classification</th>
                <th className="p-4">BVN Clearing</th>
                <th className="p-4 text-right">Intended Deployments</th>
                <th className="p-4 text-center">Execution Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {queue.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.01] transition-colors"
                >
                  <td className="p-4 font-bold text-neutral-400">{item.id}</td>
                  <td className="p-4">
                    <span className="text-white font-bold block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">
                      {item.email}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded border border-white/5 bg-[#13161C] text-neutral-300">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${item.bvnStatus === "MATCHED" ? "text-emerald-400" : "text-rose-400 animate-pulse"}`}
                    >
                      ● {item.bvnStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-white">
                    {formatValue(item.capitalIntended)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => handleProcessAction(item.id)}
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-[11px] rounded-lg h-8 px-3"
                      >
                        Approve Verify
                      </Button>
                      <Button
                        onClick={() => handleProcessAction(item.id)}
                        size="sm"
                        variant="destructive"
                        className="font-bold text-[11px] rounded-lg h-8 px-3"
                      >
                        Reject Flag
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {queue.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    Compliance registry cleared. All pending investor dossiers
                    have been executed successfully.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
