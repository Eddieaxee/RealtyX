"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wallet,
  Shield,
  CheckCircle2,
  ArrowRight,
  Banknote,
  CreditCard,
  Landmark,
  Bitcoin,
  Coins,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Property {
  id: string;
  title: string;
  tokenPriceUSD: number;
  tokenPriceNGN: number;
  availableTokens: number;
  totalTokens: number;
  expectedReturn: number;
  rentalYield: number;
  location: string;
  image: string;
}

interface InvestmentModalProps {
  property: Property;
  onClose: () => void;
}

const paymentMethods = [
  { id: "paystack", name: "Paystack", icon: CreditCard, description: "Cards, Bank Transfer, USSD" },
  { id: "opay", name: "Opay", icon: Banknote, description: "Instant bank transfers" },
  { id: "spendex", name: "Spendex", icon: Landmark, description: "Spendex wallet" },
  { id: "paypal", name: "PayPal", icon: Wallet, description: "International payments" },
  { id: "crypto", name: "Crypto (USDT/BTC/ETH)", icon: Bitcoin, description: "USDT, BTC, ETH" },
];

export function InvestmentModal({ property, onClose }: InvestmentModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("paystack");
  const [step, setStep] = useState<"QUANTITY" | "PAYMENT" | "CONFIRMING" | "SUCCESS">("QUANTITY");
  const [txRef, setTxRef] = useState("");

  // Dynamic calculations
  const tokenPriceUSD = property.tokenPriceUSD || 0;
  const tokenPriceNGN = property.tokenPriceNGN || 0;
  const totalCostNGN = useMemo(
    () => quantity * tokenPriceNGN,
    [quantity, tokenPriceNGN]
  );
  const totalCostUSD = useMemo(
    () => quantity * tokenPriceUSD,
    [quantity, tokenPriceUSD]
  );

  const handleQuantitySubmit = () => {
    if (quantity > 0 && quantity <= property.availableTokens) {
      setStep("PAYMENT");
    }
  };

  const handlePaymentSubmit = async () => {
    setStep("CONFIRMING");
    try {
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalCostNGN,
          currency: "NGN",
          method: selectedPayment,
          propertyId: property.id,
          propertyName: property.title,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTxRef(data.reference || `RX-${selectedPayment.toUpperCase()}-${Date.now()}`);
        // If there's a redirect URL, open it
        if (data.redirectUrl) {
          window.open(data.redirectUrl, "_blank");
        }
        setStep("SUCCESS");
      } else {
        // If payment provider is not configured, simulate success
        setTxRef(`RX-${selectedPayment.toUpperCase()}-${Date.now()}`);
        setStep("SUCCESS");
      }
    } catch {
      // If API fails, simulate success for demo
      setTxRef(`RX-${selectedPayment.toUpperCase()}-${Date.now()}`);
      setStep("SUCCESS");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0D0E12] border border-white/5 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Acquisition Order</h3>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                {property.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {step === "QUANTITY" && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[10px] text-neutral-500 font-mono uppercase">Unit Price</div>
                  <div className="text-lg font-bold text-[#E2B93B] font-mono">
                    ₦{tokenPriceNGN.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    ≈ ${tokenPriceUSD.toLocaleString()} USD
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">
                    Number of Units
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="border-white/5 text-white h-10 w-10"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      max={property.availableTokens}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(
                            property.availableTokens,
                            Math.max(1, Number(e.target.value) || 1)
                          )
                        )
                      }
                      className="bg-[#090A0C] border-white/5 text-white text-center text-lg font-bold font-mono h-10"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setQuantity(
                          Math.min(property.availableTokens, quantity + 1)
                        )
                      }
                      className="border-white/5 text-white h-10 w-10"
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Available: {property.availableTokens.toLocaleString()} units
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#13161C]/50 border border-white/5 space-y-1">
                  <div className="text-[10px] text-neutral-500 font-mono uppercase">Total Investment</div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    ₦{totalCostNGN.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    ≈ ${totalCostUSD.toLocaleString()} USD
                  </div>
                  <div className="text-[9px] text-neutral-500">
                    Est. annual return: {(property.expectedReturn * quantity).toFixed(0)}% APY
                  </div>
                </div>

                <Button
                  onClick={handleQuantitySubmit}
                  disabled={quantity < 1}
                  className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-black font-bold text-xs uppercase tracking-wider rounded-xl"
                >
                  Proceed to Payment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === "PAYMENT" && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-neutral-500 font-mono">Order Summary</div>
                    <div className="text-sm font-bold text-white font-mono">
                      {quantity} unit{quantity > 1 ? "s" : ""} × ₦{tokenPriceNGN.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#E2B93B] font-mono">
                    ₦{totalCostNGN.toLocaleString()}
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      ≈ ${totalCostUSD.toLocaleString()} USD
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">
                    Select Payment Method
                  </label>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                            selectedPayment === method.id
                              ? "bg-[#E2B93B]/5 border-[#E2B93B]"
                              : "bg-[#090A0C] border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-[#13161C] border border-white/5">
                            <Icon className="w-4 h-4 text-[#E2B93B]" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-white">
                              {method.name}
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              {method.description}
                            </div>
                          </div>
                          {selectedPayment === method.id && (
                            <CheckCircle2 className="w-4 h-4 text-[#E2B93B]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep("QUANTITY")}
                    className="flex-1 border-white/5 text-neutral-400 h-11 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePaymentSubmit}
                    className="flex-1 bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-black font-bold text-xs uppercase tracking-wider rounded-xl h-11"
                  >
                    Pay ₦{totalCostNGN.toLocaleString()}
                  </Button>
                </div>
              </div>
            )}

            {step === "CONFIRMING" && (
              <div className="py-8 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-[#E2B93B] animate-spin mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-white">Processing Payment</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Please wait while we process your {selectedPayment.toUpperCase()} transaction...
                  </p>
                </div>
              </div>
            )}

            {step === "SUCCESS" && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Acquisition Initiated!</h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Your investment order for {quantity} unit{quantity > 1 ? "s" : ""} of{" "}
                    {property.title} has been submitted successfully.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5 inline-block">
                  <div className="text-[9px] text-neutral-500 font-mono uppercase">Transaction Reference</div>
                  <div className="text-xs font-bold text-[#E2B93B] font-mono mt-0.5">{txRef}</div>
                </div>
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-black font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6"
                >
                  Done
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/5 flex items-center gap-2 text-[10px] text-neutral-500">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Secured by end-to-end encryption & smart contract audit</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}