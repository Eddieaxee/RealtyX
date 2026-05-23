"use client";

import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare, TrendingUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const notifications = [
  { icon: Bell, title: "Push Notifications", description: "Receive push notifications on your device", enabled: true },
  { icon: Mail, title: "Email Notifications", description: "Get updates via email", enabled: true },
  { icon: MessageSquare, title: "Investment Alerts", description: "Notify when new properties are available", enabled: true },
  { icon: TrendingUp, title: "Price Alerts", description: "Alert on significant price movements", enabled: false },
];

export function NotificationSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6"
    >
      <h2 className="text-lg font-semibold mb-6">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.title} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <Switch defaultChecked={item.enabled} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}