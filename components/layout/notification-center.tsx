"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, TrendingUp, Wallet, Shield, Info } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Notification { id: string; type: "investment" | "payout" | "security" | "system"; title: string; message: string; read: boolean; createdAt: string; }

const mockNotifications: Notification[] = [
  { id: "1", type: "investment", title: "Investment Confirmed", message: "Your investment in Manhattan Penthouse has been confirmed.", read: false, createdAt: "2024-05-22T10:30:00" },
  { id: "2", type: "payout", title: "Rental Distribution", message: "You received $320.50 in rental yield from Miami Beachfront Villa.", read: false, createdAt: "2024-05-21T14:15:00" },
  { id: "3", type: "security", title: "New Login Detected", message: "New login from Chrome on Windows. If this was not you, contact support.", read: true, createdAt: "2024-05-20T09:00:00" },
  { id: "4", type: "system", title: "Platform Update", message: "New AI portfolio insights feature is now available.", read: true, createdAt: "2024-05-19T16:00:00" },
];

const typeIcons = { investment: TrendingUp, payout: Wallet, security: Shield, system: Info };
const typeColors = { investment: "text-green-500 bg-green-500/10", payout: "text-gold-500 bg-gold-500/10", security: "text-red-500 bg-red-500/10", system: "text-blue-500 bg-blue-500/10" };

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-500 text-[10px] font-bold text-white flex items-center justify-center">{unreadCount}</span>}
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-12 w-96 z-50 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                  <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => {
                  const Icon = typeIcons[notification.type];
                  return (
                    <div key={notification.id} className={`flex items-start gap-3 p-4 border-b border-border/30 hover:bg-background/50 transition-colors ${!notification.read ? "bg-primary/5" : ""}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[notification.type]}`}><Icon className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 rounded-full bg-gold-500 shrink-0 mt-2" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}