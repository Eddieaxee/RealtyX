"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Percent,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddPropertyModalProps {
  onClose: () => void;
  onPropertyAdded: () => void;
}

export function AddPropertyModal({ onClose, onPropertyAdded }: AddPropertyModalProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    state: "",
    region: "",
    category: "RESIDENTIAL",
    lifecycle: "UNDER_CONSTRUCTION",
    lat: "",
    lng: "",
    image: "",
    tokenPriceNGN: "",
    totalValueNGN: "",
    expectedReturn: "",
    rentalYield: "",
    availableTokens: "",
    totalTokens: "",
    funded: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          lat: formData.lat ? parseFloat(formData.lat) : null,
          lng: formData.lng ? parseFloat(formData.lng) : null,
          tokenPriceNGN: formData.tokenPriceNGN ? parseFloat(formData.tokenPriceNGN) : 0,
          totalValueNGN: formData.totalValueNGN ? parseFloat(formData.totalValueNGN) : 0,
          expectedReturn: formData.expectedReturn ? parseFloat(formData.expectedReturn) : 0,
          rentalYield: formData.rentalYield ? parseFloat(formData.rentalYield) : 0,
          availableTokens: formData.availableTokens ? parseInt(formData.availableTokens) : 0,
          totalTokens: formData.totalTokens ? parseInt(formData.totalTokens) : 0,
          funded: formData.funded ? parseInt(formData.funded) : 0,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => {
          onPropertyAdded();
          onClose();
        }, 1500);
      }
    } catch {
      console.error("Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#0D0E12] border border-white/5 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
        >
          <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0D0E12] z-10">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#E2B93B]" />
              <h3 className="text-sm font-bold text-white">Add New Property</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {saved ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Property Added Successfully!</h3>
              <p className="text-sm text-neutral-400">The property has been added to the marketplace.</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Title</label>
                  <Input value={formData.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Property title" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Location</label>
                  <Input value={formData.location} onChange={(e) => handleChange("location", e.target.value)} placeholder="e.g. Victoria Island, Lagos" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Property description..."
                  className="w-full bg-[#090A0C] border border-white/5 rounded-xl text-white text-sm h-20 p-3 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">City</label>
                  <Input value={formData.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="Lagos" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">State</label>
                  <Input value={formData.state} onChange={(e) => handleChange("state", e.target.value)} placeholder="Lagos" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Region</label>
                  <Input value={formData.region} onChange={(e) => handleChange("region", e.target.value)} placeholder="VI" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Category</label>
                  <select value={formData.category} onChange={(e) => handleChange("category", e.target.value)} className="w-full bg-[#090A0C] border border-white/5 rounded-xl text-white text-sm h-10 px-3">
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="INFRASTRUCTURE">Infrastructure</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Lifecycle</label>
                  <select value={formData.lifecycle} onChange={(e) => handleChange("lifecycle", e.target.value)} className="w-full bg-[#090A0C] border border-white/5 rounded-xl text-white text-sm h-10 px-3">
                    <option value="UNDER_CONSTRUCTION">Under Construction</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Latitude</label>
                  <Input value={formData.lat} onChange={(e) => handleChange("lat", e.target.value)} placeholder="6.4258" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Longitude</label>
                  <Input value={formData.lng} onChange={(e) => handleChange("lng", e.target.value)} placeholder="3.4167" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Image URL</label>
                <Input value={formData.image} onChange={(e) => handleChange("image", e.target.value)} placeholder="https://images.unsplash.com/..." className="bg-[#090A0C] border-white/5 text-white h-10 text-sm" />
              </div>

              <div className="border-t border-white/5 pt-4">
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-[#E2B93B]" /> Financial Details</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase">Token Price (NGN)</label>
                    <Input value={formData.tokenPriceNGN} onChange={(e) => handleChange("tokenPriceNGN", e.target.value)} placeholder="50000" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase">Total Value (NGN)</label>
                    <Input value={formData.totalValueNGN} onChange={(e) => handleChange("totalValueNGN", e.target.value)} placeholder="2500000000" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1"><Percent className="w-3 h-3" />Expected Return</label>
                    <Input value={formData.expectedReturn} onChange={(e) => handleChange("expectedReturn", e.target.value)} placeholder="16.4" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm font-mono" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase">Rental Yield %</label>
                    <Input value={formData.rentalYield} onChange={(e) => handleChange("rentalYield", e.target.value)} placeholder="9.2" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase">Available Tokens</label>
                    <Input value={formData.availableTokens} onChange={(e) => handleChange("availableTokens", e.target.value)} placeholder="14200" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase">Total Tokens</label>
                    <Input value={formData.totalTokens} onChange={(e) => handleChange("totalTokens", e.target.value)} placeholder="50000" className="bg-[#090A0C] border-white/5 text-white h-10 text-sm font-mono" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button variant="outline" onClick={onClose} className="border-white/5 text-neutral-400 h-10 rounded-xl">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!formData.title || saving}
                  className="bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-black font-bold text-xs rounded-xl h-10 px-6"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Add Property</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}