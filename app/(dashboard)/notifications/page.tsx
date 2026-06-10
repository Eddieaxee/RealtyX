"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  CreditCard,
  Shield,
  Loader2,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(
            Array.isArray(data) ? data : data?.notifications || [],
          );
        }
      } catch {
        // Use empty array
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch {
      // Silent
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Silent
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "INVESTMENT":
        return <CreditCard className="w-4 h-4 text-blue-400" />;
      case "PAYOUT":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "KYC":
        return <Shield className="w-4 h-4 text-[#E2B93B]" />;
      case "SECURITY":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-neutral-400" />;
    }
  };

  const filteredNotifications =
    filter === "UNREAD" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
            <Bell className="w-3.5 h-3.5" /> Notification Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Alerts & Updates
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Stay informed about your investments, KYC status, and platform
            updates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Button
              variant={filter === "ALL" ? "default" : "outline"}
              onClick={() => setFilter("ALL")}
              className={filter === "ALL" ? "bg-[#E2B93B] text-black" : ""}
            >
              All
            </Button>
            <Button
              variant={filter === "UNREAD" ? "default" : "outline"}
              onClick={() => setFilter("UNREAD")}
              className={filter === "UNREAD" ? "bg-[#E2B93B] text-black" : ""}
            >
              Unread
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-neutral-400 hover:text-white"
          >
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark All Read
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#E2B93B] animate-spin" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <Bell className="w-12 h-12 text-neutral-600 mx-auto" />
          <p className="text-neutral-400 text-sm">
            {filter === "UNREAD"
              ? "No unread notifications."
              : "No notifications yet. They will appear here when you have updates."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                notification.read
                  ? "bg-[#0D0E12]/50 border-white/5"
                  : "bg-[#0D0E12] border-[#E2B93B]/10 hover:border-[#E2B93B]/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-bold ${notification.read ? "text-neutral-300" : "text-white"}`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-[#E2B93B] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1 font-mono">
                    {new Date(notification.createdAt).toLocaleString("en-NG")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
