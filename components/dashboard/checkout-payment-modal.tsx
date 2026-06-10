"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Landmark,
  CreditCard,
  Wallet,
  Copy,
  Check,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CheckoutPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  tokenPriceNGN: number;
}

export function CheckoutPaymentModal({
  isOpen,
  onClose,
  propertyTitle,
  tokenPriceNGN,
}: CheckoutPaymentModalProps) {
  const [tokenQuantity, setTokenQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "BANK_TRANSFER" | "FINTECH_CARD" | "STABLECOIN"
  >("BANK_TRANSFER");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(1199); // 19:59 virtual account timer duration

  const grossTotalNGN = tokenQuantity * tokenPriceNGN;
  const standardUSDConversion = grossTotalNGN / 1500; // Hard reference structural peg

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 1199));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const executeAddressCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/5 bg-[#0D0E12] text-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#13161C]/50">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
                Capital Order Execution
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-[280px] sm:max-w-sm">
                {propertyTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close payment modal"
              title="Close"
              className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Ticket Counter */}
            <div className="p-4 rounded-xl bg-[#090A0C] border border-white/5 flex items-center justify-between">
              <div>
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wide">
                  Unit Shares Allocation
                </label>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  ₦{tokenPriceNGN.toLocaleString()} / Unit
                </div>
              </div>
              <Input
                type="number"
                min={1}
                value={tokenQuantity}
                onChange={(e) =>
                  setTokenQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-24 h-9 font-mono text-center bg-[#13161C] border-white/5 font-bold text-white rounded-lg focus-visible:ring-1 focus-visible:ring-[#E2B93B]/30"
              />
            </div>

            {/* Channels Tab Bar */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#090A0C] border border-white/5 rounded-xl">
              <button
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "bg-[#E2B93B] text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Landmark className="w-3.5 h-3.5" /> Transfer
              </button>
              <button
                onClick={() => setPaymentMethod("FINTECH_CARD")}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === "FINTECH_CARD"
                    ? "bg-[#E2B93B] text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Paystack
              </button>
              <button
                onClick={() => setPaymentMethod("STABLECOIN")}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === "STABLECOIN"
                    ? "bg-[#E2B93B] text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Wallet className="w-3.5 h-3.5" /> Crypto/USDC
              </button>
            </div>

            {/* Render Context Tabs dynamically */}
            {paymentMethod === "BANK_TRANSFER" && (
              <div className="space-y-3.5 p-4 rounded-xl bg-[#13161C]/50 border border-white/5">
                <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2.5">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Awaiting
                    Inbound Settlement
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {formatTimer(countdown)}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Transfer the exact transaction amount below to the dynamically
                  generated Moniepoint institutional liquidity reserve node:
                </p>
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center bg-[#090A0C] p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      Bank Node
                    </span>
                    <span className="text-xs font-bold font-mono">
                      Moniepoint MFB
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-[#090A0C] p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      Account Number
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold font-mono">
                        8129482019
                      </span>
                      <button
                        type="button"
                        onClick={() => executeAddressCopy("8129482019")}
                        aria-label="Copy account number"
                        title="Copy account number"
                        className="text-neutral-400 hover:text-white"
                      >
                        {copied ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#090A0C] p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      Beneficiary Reference
                    </span>
                    <span className="text-xs font-bold font-mono text-white truncate max-w-[180px]">
                      PROP-MINT-POOL-EKO
                    </span>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "FINTECH_CARD" && (
              <div className="p-5 text-center rounded-xl bg-[#13161C]/50 border border-white/5 space-y-3">
                <div className="w-9 h-9 rounded-full bg-[#E2B93B]/5 flex items-center justify-center mx-auto text-[#E2B93B]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold">
                    Paystack Secure Gateway Redirection
                  </h4>
                  <p className="text-[11px] text-neutral-400 max-w-xs mx-auto leading-relaxed">
                    Authorizes seamless NGN processing via debit cards, local
                    banking apps, USSD commands, or OPay/PalmPay instant
                    infrastructure systems.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === "STABLECOIN" && (
              <div className="space-y-3 p-4 rounded-xl bg-[#13161C]/50 border border-white/5">
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Deploy cryptographic settlement values instantly via
                  gas-optimized Base multi-chain infrastructure protocols:
                </p>
                <div className="bg-[#090A0C] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    Required Contract Token Cost
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    $
                    {standardUSDConversion.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{" "}
                    USDC
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-neutral-400 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#E2B93B] shrink-0 mt-0.5" />
                  <span>
                    Calculated automatically at a structural execution peg of
                    ₦1,500 / $1 USD.
                  </span>
                </div>
              </div>
            )}

            {/* Order Ledger Accounting Details Balance Overview */}
            <div className="p-4 rounded-xl bg-[#090A0C] border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Placement Subtotal:</span>
                <span>₦{grossTotalNGN.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Infrastructure Asset Duty (0.1%):</span>
                <span>₦{(grossTotalNGN * 0.001).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold text-white">
                <span className="text-neutral-300">Total Capital Outlay:</span>
                <span className="text-[#E2B93B]">
                  ₦{(grossTotalNGN + grossTotalNGN * 0.001).toLocaleString()}
                </span>
              </div>

              <div className="flex gap-3 mt-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1 text-xs font-bold text-neutral-400 hover:bg-white/5 rounded-xl"
                >
                  Cancel Order
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#B89221] hover:to-[#917116] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-[#E2B93B]/5"
                >
                  Confirm Payment
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
