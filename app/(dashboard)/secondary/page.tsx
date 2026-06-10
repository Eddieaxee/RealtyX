"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/currency-context";

interface Order {
  id: string;
  type: string;
  priceNGN: string;
  priceUSD: string;
  quantity: number;
  filledQuantity: number;
  status: string;
  propertyId: string;
  property: { title: string; id: string } | null;
}

interface OrderBook {
  bids: Order[];
  asks: Order[];
}

interface SecondaryMarketData {
  orders: Order[];
  orderBook: OrderBook;
  volume24h: number;
  lastPrice: number;
}

export default function SecondaryMarketPage() {
  const { formatValue } = useCurrency();
  const [data, setData] = useState<SecondaryMarketData | null>(null);
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [orderQuantity, setOrderQuantity] = useState<number>(10);
  const [limitPriceNGN, setLimitPriceNGN] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const res = await fetch("/api/secondary-market");
        if (res.ok) {
          const marketData = await res.json();
          setData(marketData);
          if (marketData.lastPrice > 0) {
            setLimitPriceNGN(marketData.lastPrice);
          }
        }
      } catch {
        console.error("Failed to fetch secondary market data");
      } finally {
        setLoading(false);
      }
    }
    fetchMarketData();
  }, []);

  async function handlePlaceOrder() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/secondary-market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: data?.orders?.[0]?.propertyId || "",
          type: tradeType,
          priceUSD: limitPriceNGN / 1500, // Approximate conversion
          priceNGN: limitPriceNGN,
          quantity: orderQuantity,
        }),
      });
      if (res.ok) {
        // Refresh market data
        const refreshRes = await fetch("/api/secondary-market");
        if (refreshRes.ok) {
          const refreshedData = await refreshRes.json();
          setData(refreshedData);
        }
      }
    } catch {
      console.error("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-[#E2B93B] animate-spin" />
      </div>
    );
  }

  const calculatedTotalNGN = orderQuantity * limitPriceNGN;
  const spreadNGN =
    data?.orderBook &&
    data.orderBook.asks.length > 0 &&
    data.orderBook.bids.length > 0
      ? Number(data.orderBook.asks[0].priceNGN) -
        Number(data.orderBook.bids[0].priceNGN)
      : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Platform Route Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
            <ArrowLeftRight className="w-3.5 h-3.5" /> Token Liquidity Routing
            Exchange
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Secondary Trading Book
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Execute frictionless real-time trades of verified fractional
            certificate listings using an automated high-frequency order match
            execution layer.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-[#0D0E12] border border-white/5 p-3 rounded-xl font-mono text-xs self-start md:self-center shadow-md">
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">
              24h System Volume
            </span>
            <span className="font-bold text-white">
              {formatValue(data?.volume24h || 0)}
            </span>
          </div>
          <div className="border-l border-white/5 pl-4">
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">
              Bid-Ask Spread
            </span>
            <span className="font-bold text-[#E2B93B]">
              {formatValue(spreadNGN, { digits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Asset Tracker Banner */}
      {data?.orders && data.orders.length > 0 && (
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-xs font-mono font-bold text-[#E2B93B] bg-white/5 px-2 py-0.5 rounded border border-white/5">
              RYX-TOKEN
            </span>
            <h2 className="text-base font-bold text-white mt-1.5">
              {data.orders[0]?.property?.title || "RealtyX Token"}
            </h2>
          </div>
          <div className="flex items-center gap-6 font-mono">
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">
                Last Match Strike
              </span>
              <span className="text-sm font-bold text-white">
                {formatValue(data.lastPrice)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Double-Sided Order Book Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Order Book */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0D0E12] border border-white/5 rounded-2xl p-5 shadow-xl">
          {/* Asks (Sells) */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/5">
              <TrendingDown className="w-3.5 h-3.5" /> Order Ask Book (Offers to
              Sell)
            </h3>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500 pb-1">
                <span>Offer Price</span>
                <span className="text-right">Units Open</span>
                <span className="text-right">Gross Total</span>
              </div>
              {data?.orderBook.asks && data.orderBook.asks.length > 0 ? (
                [...data.orderBook.asks].reverse().map((ask, i) => (
                  <div
                    key={ask.id || i}
                    className="grid grid-cols-3 py-1 text-rose-300 hover:bg-rose-500/5 rounded px-1 transition-colors"
                  >
                    <span className="font-bold">
                      {formatValue(Number(ask.priceNGN))}
                    </span>
                    <span className="text-right text-neutral-300">
                      {ask.quantity - ask.filledQuantity}
                    </span>
                    <span className="text-right text-neutral-400">
                      {formatValue(
                        Number(ask.priceNGN) *
                          (ask.quantity - ask.filledQuantity),
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-neutral-600 text-[10px]">
                  No open sell orders
                </div>
              )}
            </div>
          </div>

          {/* Bids (Buys) */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/5">
              <TrendingUp className="w-3.5 h-3.5" /> Order Bid Book (Demands to
              Buy)
            </h3>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500 pb-1">
                <span>Bid Price</span>
                <span className="text-right">Units Requested</span>
                <span className="text-right">Gross Total</span>
              </div>
              {data?.orderBook.bids && data.orderBook.bids.length > 0 ? (
                data.orderBook.bids.map((bid, i) => (
                  <div
                    key={bid.id || i}
                    className="grid grid-cols-3 py-1 text-emerald-300 hover:bg-emerald-500/5 rounded px-1 transition-colors"
                  >
                    <span className="font-bold">
                      {formatValue(Number(bid.priceNGN))}
                    </span>
                    <span className="text-right text-neutral-300">
                      {bid.quantity - bid.filledQuantity}
                    </span>
                    <span className="text-right text-neutral-400">
                      {formatValue(
                        Number(bid.priceNGN) *
                          (bid.quantity - bid.filledQuantity),
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-neutral-600 text-[10px]">
                  No open buy orders
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Entry Panel */}
        <div className="space-y-4 bg-[#0D0E12] border border-white/5 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#E2B93B]" /> Transaction
            Execution Desk
          </h3>

          <div className="grid grid-cols-2 gap-1 p-1 bg-[#090A0C] border border-white/5 rounded-xl">
            <button
              onClick={() => setTradeType("BUY")}
              className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${tradeType === "BUY" ? "bg-emerald-500 text-black shadow-md" : "text-neutral-400 hover:text-white"}`}
            >
              Limit Buy
            </button>
            <button
              onClick={() => setTradeType("SELL")}
              className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${tradeType === "SELL" ? "bg-rose-500 text-black shadow-md" : "text-neutral-400 hover:text-white"}`}
            >
              Limit Sell
            </button>
          </div>

          <div className="space-y-4 pt-2 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                Order Size (Units)
              </label>
              <input
                type="number"
                title="Order size"
                placeholder="10"
                value={orderQuantity}
                onChange={(e) =>
                  setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full h-10 px-3 bg-[#090A0C] border border-white/5 rounded-xl text-white font-bold outline-none focus:border-[#E2B93B]/40 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                Target Strike Price (NGN)
              </label>
              <input
                type="number"
                title="Target strike price"
                placeholder="0.00"
                value={limitPriceNGN.toFixed(2)}
                onChange={(e) =>
                  setLimitPriceNGN(parseFloat(e.target.value) || 0)
                }
                className="w-full h-10 px-3 bg-[#090A0C] border border-white/5 rounded-xl text-white font-bold outline-none focus:border-[#E2B93B]/40 transition-all"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#090A0C] border border-white/5 space-y-2 text-neutral-400 text-[11px]">
              <div className="flex justify-between">
                <span>Contract Subtotal:</span>
                <span className="text-white font-bold">
                  {formatValue(calculatedTotalNGN)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Clearing Fee (0.25%):</span>
                <span>{formatValue(calculatedTotalNGN * 0.0025)}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 font-bold text-white text-xs">
                <span>Settlement Outlay:</span>
                <span
                  className={
                    tradeType === "BUY" ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {formatValue(
                    calculatedTotalNGN +
                      (tradeType === "BUY" ? 1 : -1) *
                        (calculatedTotalNGN * 0.0025),
                  )}
                </span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={submitting || !data?.orders?.[0]?.propertyId}
              className={`w-full h-11 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all ${
                tradeType === "BUY"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                  : "bg-gradient-to-r from-rose-500 to-red-600"
              } disabled:opacity-50`}
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Transmit Order Ticket"
              )}
            </Button>

            <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-neutral-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Matching handles certificate settlement updates safely within
                SEC-compliant regulatory pools.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
