"use client";

import { useState, useEffect } from "react";
import {
  Sliders,
  Bell,
  Mail,
  Smartphone,
  Globe,
  User,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SecuritySettingsConsole() {
  // Notification preferences (UI-only, not yet persisted in DB)
  const [preferences, setPreferences] = useState({
    emailDrawdown: true,
    smsSecondaryMatch: false,
    marketingUpdates: true,
    twoFactorEnforced: true,
  });

  // Profile fields backed by /api/users PUT
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile", { method: "GET" });
        if (!res.ok) return;
        const data = await res.json();
        const me = data?.user;
        if (!me) return;
        setName(me.name || "");
        setEmail(me.email || "");
        setPhone(me.phone || "");
        setAddress(me.address || "");
      } catch {
        // Silently fall back
      }
    }

    async function loadNotificationSettings() {
      try {
        const res = await fetch("/api/user/settings", { method: "GET" });
        if (!res.ok) return;
        const data = await res.json();
        const s = data?.settings;
        if (!s) return;
        setPreferences({
          emailDrawdown: s.emailDrawdown ?? true,
          smsSecondaryMatch: s.smsSecondaryMatch ?? false,
          marketingUpdates: s.marketingUpdates ?? true,
          twoFactorEnforced: s.twoFactorEnforced ?? true,
        });
      } catch {
        // Fall back to defaults
      }
    }

    loadProfile();
    loadNotificationSettings();
  }, []);

  const toggleParam = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      setStatusMessage({
        type: "success",
        text: "Profile settings saved to your account ledger.",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save notification settings");
      }
      setStatusMessage({
        type: "success",
        text: "Notification preferences saved to account.",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Profile Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
          <Sliders className="w-3.5 h-3.5" /> Account Configuration Desk
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          System Preferences & Safety
        </h1>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/5 border-red-500/20 text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Settings Categories List Menu */}
        <div className="space-y-1 bg-[#0D0E12] border border-white/5 rounded-2xl p-3 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 font-bold text-[#E2B93B] flex items-center gap-2">
            <Bell className="w-4 h-4" /> Notifications Engine
          </div>
          <div className="p-2.5 rounded-xl text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-2">
            <User className="w-4 h-4" /> Profile Details
          </div>
        </div>

        {/* Configurations Parameters Workspace */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form Section */}
          <div className="space-y-4 bg-[#0D0E12] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white tracking-tight pb-2 border-b border-white/5">
              Profile Information
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your legal full name"
                  className="bg-[#090A0C] border-white/5 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <Input
                  value={email}
                  disabled
                  className="bg-[#090A0C] border-white/5 text-neutral-500 text-xs h-10 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234..."
                  className="bg-[#090A0C] border-white/5 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Residential Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter physical address"
                  className="bg-[#090A0C] border-white/5 text-white text-xs h-10"
                />
              </div>

              <div className="pt-2 text-right">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-[#E2B93B] hover:bg-[#B89221] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-md"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {isSaving ? "Saving..." : "Commit Profile Setup"}
                </Button>
              </div>
            </div>
          </div>

          {/* Notification Settings Toggles */}
          <div className="space-y-4 bg-[#0D0E12] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white tracking-tight pb-2 border-b border-white/5">
              Notification Protocols Matrix
            </h3>

            <div className="divide-y divide-white/5 font-sans text-xs">
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5 max-w-md">
                  <span className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" /> Capital
                    Drawdown Reports
                  </span>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Receive instant email updates for construction milestone
                    changes and escrow capital draws.
                  </p>
                </div>
                <button
                  onClick={() => toggleParam("emailDrawdown")}
                  className={`w-10 h-6 rounded-full p-1 transition-all shrink-0 ${preferences.emailDrawdown ? "bg-[#E2B93B]" : "bg-white/10"}`}
                  title={
                    preferences.emailDrawdown
                      ? "Disable email drawdown reports"
                      : "Enable email drawdown reports"
                  }
                  aria-label={
                    preferences.emailDrawdown
                      ? "Disable email drawdown reports"
                      : "Enable email drawdown reports"
                  }
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform ${preferences.emailDrawdown ? "translate-x-4" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5 max-w-md">
                  <span className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                    <Smartphone className="w-3.5 h-3.5 text-neutral-400" /> SMS
                    Order Book Executions
                  </span>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Send real-time mobile push notes when secondary liquidity
                    orders match target bids.
                  </p>
                </div>
                <button
                  onClick={() => toggleParam("smsSecondaryMatch")}
                  className={`w-10 h-6 rounded-full p-1 transition-all shrink-0 ${preferences.smsSecondaryMatch ? "bg-[#E2B93B]" : "bg-white/10"}`}
                  title="Toggle SMS order book execution alerts"
                  aria-label="Toggle SMS order book execution alerts"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform ${preferences.smsSecondaryMatch ? "translate-x-4" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5 max-w-md">
                  <span className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5 text-neutral-400" /> Platform
                    Advisory Updates
                  </span>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Receive notifications regarding primary token listings and
                    alternative asset options.
                  </p>
                </div>
                <button
                  onClick={() => toggleParam("marketingUpdates")}
                  className={`w-10 h-6 rounded-full p-1 transition-all shrink-0 ${preferences.marketingUpdates ? "bg-[#E2B93B]" : "bg-white/10"}`}
                  title="Toggle platform advisory updates"
                  aria-label="Toggle platform advisory updates"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform ${preferences.marketingUpdates ? "translate-x-4" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-right">
              <Button
                onClick={handleSaveNotifications}
                className="bg-[#E2B93B] hover:bg-[#B89221] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-md"
              >
                Save Notification Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
