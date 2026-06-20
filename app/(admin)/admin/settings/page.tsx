"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  Globe,
  DollarSign,
  Bell,
  Shield,
  Database,
  RefreshCw,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Key,
  Mail,
  MessageSquare,
  Webhook,
  Activity,
  Sliders,
  Terminal,
} from "lucide-react";

type SettingsTab =
  | "general"
  | "notifications"
  | "security"
  | "exchange"
  | "features"
  | "api";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Form state
  const [platformName, setPlatformName] = useState("RealtyX");
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [notifEmail, setNotifEmail] = useState("admin@realtyx.io");
  const [minInvestment, setMinInvestment] = useState(50);
  const [maxInvestment, setMaxInvestment] = useState(100000);
  const [kycRequired, setKycRequired] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("24");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [apiRateLimit, setApiRateLimit] = useState("1000");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: {
    id: SettingsTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "exchange", label: "Exchange Rate", icon: DollarSign },
    { id: "features", label: "Features", icon: Sliders },
    { id: "api", label: "API & Webhooks", icon: Terminal },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
          <Settings className="w-3.5 h-3.5" /> System Configuration
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          Platform Settings
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">
          Configure platform settings, security, and integrations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={`Switch to ${tab.label} settings`}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? "text-[#E2B93B] border-[#E2B93B] bg-[#E2B93B]/5"
                : "text-neutral-500 border-transparent hover:text-white hover:border-white/20"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <>
            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#E2B93B]" /> Platform Identity
              </h3>
              <div>
                <label
                  htmlFor="platformName"
                  className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1"
                >
                  Platform Name
                </label>
                <input
                  id="platformName"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                />
              </div>
              <div>
                <label
                  htmlFor="baseCurrency"
                  className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1"
                >
                  Base Currency
                </label>
                <select
                  id="baseCurrency"
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  aria-label="Base Currency"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-400 font-bold">
                    Platform Status
                  </span>
                </div>
                <label className="flex items-center gap-3 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={() => setMaintenanceMode(!maintenanceMode)}
                    className="accent-[#E2B93B]"
                  />
                  <div>
                    <span className="text-xs text-white">Maintenance Mode</span>
                    <p className="text-[9px] text-neutral-500 font-mono">
                      Disable platform access for non-admin users
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#E2B93B]" /> Investment
                Limits
              </h3>
              <div>
                <label
                  htmlFor="minInvestment"
                  className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1"
                >
                  Minimum Investment (USD)
                </label>
                <input
                  id="minInvestment"
                  type="number"
                  value={minInvestment}
                  onChange={(e) =>
                    setMinInvestment(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                />
              </div>
              <div>
                <label
                  htmlFor="maxInvestment"
                  className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1"
                >
                  Maximum Investment (USD)
                </label>
                <input
                  id="maxInvestment"
                  type="number"
                  value={maxInvestment}
                  onChange={(e) =>
                    setMaxInvestment(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                />
              </div>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kycRequired}
                  onChange={() => setKycRequired(!kycRequired)}
                  className="accent-[#E2B93B]"
                />
                <div>
                  <span className="text-xs text-white font-bold">
                    Require KYC for Investment
                  </span>
                  <p className="text-[9px] text-neutral-500 font-mono">
                    Users must complete KYC before investing
                  </p>
                </div>
              </label>
            </div>
          </>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <>
            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E2B93B]" /> Email Notifications
              </h3>
              <div>
                <label
                  htmlFor="notifEmail"
                  className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1"
                >
                  Admin Notification Email
                </label>
                <input
                  id="notifEmail"
                  type="email"
                  value={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                />
              </div>
              <div className="space-y-2">
                {[
                  {
                    label: "New user registrations",
                    desc: "When a new user creates an account",
                  },
                  {
                    label: "KYC submissions",
                    desc: "When a user submits KYC documents",
                  },
                  {
                    label: "New investments",
                    desc: "When a user makes an investment",
                  },
                  {
                    label: "Large withdrawals",
                    desc: "Withdrawals over $10,000",
                  },
                  {
                    label: "Security alerts",
                    desc: "Suspicious login attempts",
                  },
                  { label: "System errors", desc: "API or database errors" },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#090A0C]/50 border border-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-[#E2B93B]"
                    />
                    <div>
                      <span className="text-xs text-white">{item.label}</span>
                      <p className="text-[9px] text-neutral-500 font-mono">
                        {item.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#E2B93B]" /> In-App
                Notifications
              </h3>
              <div className="space-y-2">
                {[
                  {
                    label: "Investment confirmations",
                    desc: "Notify users when investment succeeds",
                  },
                  {
                    label: "Property updates",
                    desc: "New properties added or status changed",
                  },
                  {
                    label: "KYC status changes",
                    desc: "When KYC is approved or rejected",
                  },
                  {
                    label: "Dividend payouts",
                    desc: "When dividends are distributed",
                  },
                  { label: "Account activity", desc: "Login from new device" },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#090A0C]/50 border border-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-[#E2B93B]"
                    />
                    <div>
                      <span className="text-xs text-white">{item.label}</span>
                      <p className="text-[9px] text-neutral-500 font-mono">
                        {item.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <>
            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#E2B93B]" /> Access Control
              </h3>
              <div className="p-3 rounded-xl bg-[#090A0C]/50 border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white font-bold">
                      Two-Factor Authentication (2FA)
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      Enhanced security for all admin accounts
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-[#E2B93B]/10 text-[#E2B93B] text-xs font-bold border border-[#E2B93B]/20 hover:bg-[#E2B93B]/20 transition-all">
                    Enable
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="sessionTimeout" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                  Session Timeout (hours)
                </label>
                <select
                  id="sessionTimeout"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                  title="Select session timeout"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="6">6 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                </select>
              </div>
              <div>
                <label htmlFor="maxLoginAttempts" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                  Max Login Attempts
                </label>
                <select
                  id="maxLoginAttempts"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                  title="Select max login attempts"
                >
                  <option value="3">3 attempts</option>
                  <option value="5">5 attempts</option>
                  <option value="10">10 attempts</option>
                  <option value="0">Unlimited</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E2B93B]" /> Security Policies
              </h3>
              <div className="space-y-2">
                {[
                  {
                    label: "Password Complexity",
                    desc: "Require uppercase, numbers, and special characters",
                  },
                  {
                    label: "IP Whitelist",
                    desc: "Restrict admin access to specific IP addresses",
                  },
                  {
                    label: "Rate Limiting",
                    desc: "Prevent brute force attacks",
                  },
                  {
                    label: "Session Management",
                    desc: "Force logout on password change",
                  },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#090A0C]/50 border border-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-[#E2B93B]"
                    />
                    <div>
                      <span className="text-xs text-white font-bold">
                        {item.label}
                      </span>
                      <p className="text-[9px] text-neutral-500 font-mono">
                        {item.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Exchange Rate */}
        {activeTab === "exchange" && (
          <>
            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#E2B93B]" /> Rate Provider
              </h3>
              <div className="p-3 rounded-xl bg-[#090A0C]/50 border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white font-bold">
                      Live Rate Provider
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      exchangerate-api.com
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-emerald-400 font-mono">
                      Connected
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="updateFrequency" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                  Update Frequency
                </label>
                <select
                  id="updateFrequency"
                  defaultValue="3600"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                  title="Select update frequency"
                >
                  <option value="300">Every 5 minutes</option>
                  <option value="900">Every 15 minutes</option>
                  <option value="3600">Every 1 hour</option>
                  <option value="21600">Every 6 hours</option>
                  <option value="86400">Every 24 hours</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs hover:bg-blue-500/20 transition-all">
                <RefreshCw className="w-4 h-4" /> Force Rate Update
              </button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#E2B93B]" /> Supported
                Currencies
              </h3>
              <div className="space-y-2">
                {[
                  { code: "USD", name: "US Dollar", symbol: "$", rate: "1.00" },
                  {
                    code: "NGN",
                    name: "Nigerian Naira",
                    symbol: "₦",
                    rate: "1,520.00",
                  },
                  { code: "EUR", name: "Euro", symbol: "€", rate: "0.92" },
                  {
                    code: "GBP",
                    name: "British Pound",
                    symbol: "£",
                    rate: "0.79",
                  },
                ].map((cur) => (
                  <div
                    key={cur.code}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#090A0C]/50 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">
                        {cur.symbol}
                      </span>
                      <div>
                        <span className="text-xs text-white font-bold">
                          {cur.code}
                        </span>
                        <p className="text-[9px] text-neutral-500 font-mono">
                          {cur.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-neutral-400">
                      {cur.rate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Features */}
        {activeTab === "features" && (
          <>
            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4 sm:col-span-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#E2B93B]" /> Platform Features
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {
                    label: "AI Assistant",
                    desc: "Enable AI-powered investment assistant",
                    default: true,
                  },
                  {
                    label: "Blockchain Integration",
                    desc: "Enable blockchain tokenization",
                    default: true,
                  },
                  {
                    label: "Property Tokenization",
                    desc: "Allow fractional property ownership",
                    default: true,
                  },
                  {
                    label: "Investment Calculator",
                    desc: "Show ROI and yield calculator",
                    default: true,
                  },
                  {
                    label: "Map Integration",
                    desc: "Show property location maps",
                    default: true,
                  },
                  {
                    label: "Document Uploads",
                    desc: "Enable KYC document uploads",
                    default: true,
                  },
                  {
                    label: "Referral System",
                    desc: "Enable user referral program",
                    default: false,
                  },
                  {
                    label: "Multi-language",
                    desc: "Enable multiple language support",
                    default: false,
                  },
                  {
                    label: "Dark Mode Only",
                    desc: "Force dark mode across platform",
                    default: true,
                  },
                  {
                    label: "Email Verification",
                    desc: "Require email verification on signup",
                    default: true,
                  },
                  {
                    label: "Mobile Optimizations",
                    desc: "Enable mobile-specific features",
                    default: true,
                  },
                  {
                    label: "API Access",
                    desc: "Allow external API access",
                    default: false,
                  },
                ].map((feature) => (
                  <label
                    key={feature.label}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={feature.default}
                      className="accent-[#E2B93B] mt-0.5"
                    />
                    <div>
                      <span className="text-xs text-white font-bold">
                        {feature.label}
                      </span>
                      <p className="text-[9px] text-neutral-500 font-mono">
                        {feature.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* API & Webhooks */}
        {activeTab === "api" && (
          <>
            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#E2B93B]" /> API Keys
              </h3>
              <div className="p-3 rounded-xl bg-[#090A0C]/50 border border-white/5">
                <div className="text-[9px] text-neutral-500 mb-1">
                  Primary API Key
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono text-white bg-[#0D0E12] px-2 py-1.5 rounded border border-white/5">
                    {showApiKey
                      ? "rx_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      : "rx_live_xx••••••••••••••••••••"}
                  </code>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-white transition-colors"
                    title={showApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B] text-xs font-bold hover:bg-[#E2B93B]/20 transition-all">
                <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" /> Regenerate
                Key
              </button>
              <div>
                <label
                  htmlFor="apiRateLimit"
                  className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1"
                >
                  API Rate Limit (requests/hour)
                </label>
                <input
                  id="apiRateLimit"
                  value={apiRateLimit}
                  onChange={(e) => setApiRateLimit(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Webhook className="w-4 h-4 text-[#E2B93B]" /> Webhooks
              </h3>
              <div className="p-3 rounded-xl bg-[#090A0C]/50 border border-white/5">
                <div className="text-[9px] text-neutral-500 mb-1">
                  Webhook URL
                </div>
                <input
                  placeholder="https://your-server.com/webhook"
                  readOnly
                  className="w-full px-3 py-2 rounded-lg bg-[#0D0E12] border border-white/5 text-xs text-neutral-400 font-mono outline-none"
                />
              </div>
              <div className="space-y-2">
                {[
                  "investment.created",
                  "kyc.updated",
                  "user.registered",
                  "property.created",
                  "withdrawal.processed",
                ].map((evt) => (
                  <label
                    key={evt}
                    className="flex items-center gap-3 p-2 rounded-lg bg-[#090A0C]/50 border border-white/5 cursor-pointer"
                  >
                    <input type="checkbox" className="accent-[#E2B93B]" />
                    <span className="text-xs font-mono text-neutral-300">
                      {evt}
                    </span>
                  </label>
                ))}
              </div>
              <button className="px-4 py-2 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B] text-xs font-bold hover:bg-[#E2B93B]/20 transition-all">
                <Save className="w-3.5 h-3.5 inline mr-1.5" /> Save Webhooks
              </button>
            </div>
          </>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B] font-bold text-sm hover:bg-[#E2B93B]/20 transition-all"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Settings
            </>
          )}
        </button>
        {saved && (
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> All changes saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
