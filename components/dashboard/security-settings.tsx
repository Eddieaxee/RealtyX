"use client";

import { motion } from "framer-motion";
import { Shield, Key, Smartphone, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function SecuritySettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6"
    >
      <h2 className="text-lg font-semibold mb-6">Security</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">SMS Alerts</h3>
              <p className="text-sm text-muted-foreground">Get notified for transactions</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Biometric Login</h3>
              <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
            </div>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Withdrawal Whitelist</h3>
              <p className="text-sm text-muted-foreground">Restrict withdrawals to approved addresses</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        <Button variant="outline" className="w-full">Change Password</Button>
      </div>
    </motion.div>
  );
}