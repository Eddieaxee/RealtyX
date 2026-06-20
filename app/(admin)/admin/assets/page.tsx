"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./page.module.css";
import {
  Building2, Search, Plus, Edit3, Trash2, Image as ImageIcon, DollarSign, MapPin,
  TrendingUp, Layers, Star, FileText, Globe, CheckCircle2, X, ExternalLink,
  Camera, Save, RefreshCw, ChevronLeft, ChevronRight, Shield,
} from "lucide-react";

interface PropertyRecord {
  id: string;
  title: string;
  description: string;
  slug: string;
  type: string;
  status: string;
  location: string;
  city: string;
  state: string;
  country: string;
  priceUSD: number;
  totalTokens: number;
  availableTokens: number;
  tokenPriceUSD: number;
  images: string;
  features: string;
  documents: string;
  lat: number;
  lng: number;
  expectedReturn: number;
  rentalYield: number;
  completionPercentage: number;
  createdAt: string;
  _count: { investments: number };
}

const emptyForm = {
  title: "", description: "", slug: "",
  type: "RESIDENTIAL", status: "AVAILABLE",
  location: "", city: "", state: "", country: "Nigeria",
  priceUSD: 0, totalTokens: 0, availableTokens: 0, tokenPriceUSD: 0,
  expectedReturn: 0, rentalYield: 0, completionPercentage: 0,
  images: "", features: "", documents: "",
  lat: 0, lng: 0,
};

export default function AdminAssetsPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [previewProperty, setPreviewProperty] = useState<PropertyRecord | null>(null);
  const [previewImageIdx, setPreviewImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "available" | "sold" | "coming_soon">("all");

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/admin/properties");
      const data = await res.json();
      if (data.success) setProperties(data.properties);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  // Generate slug from title
  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/properties/${editingId}` : "/api/admin/properties";

    try {
      const body: Record<string, unknown> = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        images: form.images ? form.images.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        features: form.features ? form.features.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        documents: form.documents ? form.documents.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        fetchProperties();
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
      } else {
        alert(data.error || "Failed to save property");
      }
    } catch (err) {
      console.error("Failed to save property:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this property?")) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchProperties();
    } catch (err) {
      console.error("Failed to delete property:", err);
    }
  };

  const startEdit = (property: PropertyRecord) => {
    const parseList = (val: string) => {
      try { return JSON.parse(val).join("\n"); } catch { return val || ""; }
    };
    setForm({
      title: property.title,
      description: property.description,
      slug: property.slug,
      type: property.type,
      status: property.status,
      location: property.location || "",
      city: property.city || "",
      state: property.state || "",
      country: property.country || "Nigeria",
      priceUSD: property.priceUSD,
      totalTokens: property.totalTokens,
      availableTokens: property.availableTokens,
      tokenPriceUSD: property.tokenPriceUSD,
      expectedReturn: property.expectedReturn || 0,
      rentalYield: property.rentalYield || 0,
      completionPercentage: property.completionPercentage || 0,
      images: parseList(property.images),
      features: parseList(property.features),
      documents: parseList(property.documents),
      lat: property.lat || 0,
      lng: property.lng || 0,
    });
    setEditingId(property.id);
    setShowForm(true);
  };

  const getImageList = (property: PropertyRecord): string[] => {
    try { const parsed = JSON.parse(property.images); return Array.isArray(parsed) ? parsed : []; }
    catch { return property.images ? property.images.split(",").map(s => s.trim()).filter(Boolean) : []; }
  };

  const getFeaturesList = (property: PropertyRecord): string[] => {
    try { const parsed = JSON.parse(property.features); return Array.isArray(parsed) ? parsed : []; }
    catch { return property.features ? property.features.split(",").map(s => s.trim()).filter(Boolean) : []; }
  };

  const getDocumentsList = (property: PropertyRecord): string[] => {
    try { const parsed = JSON.parse(property.documents); return Array.isArray(parsed) ? parsed : []; }
    catch { return property.documents ? property.documents.split(",").map(s => s.trim()).filter(Boolean) : []; }
  };

  const filtered = useMemo(() => {
    let list = properties;
    if (activeTab !== "all") {
      list = list.filter(p => p.status === activeTab.toUpperCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [properties, search, activeTab]);

  const totalValue = properties.reduce((sum, p) => sum + p.priceUSD, 0);
  const totalTokens = properties.reduce((sum, p) => sum + p.totalTokens, 0);
  const totalInvestments = properties.reduce((sum, p) => sum + p._count.investments, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#E2B93B] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
            <Building2 className="w-3.5 h-3.5" /> Asset Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Properties & Assets
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            {properties.length} properties &middot; ${(totalValue / 1000).toFixed(0)}K total value
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B] font-bold text-sm hover:bg-[#E2B93B]/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Properties", value: properties.length, icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Total Value", value: `$${(totalValue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-[#E2B93B]", bg: "bg-[#E2B93B]/10" },
          { label: "Total Tokens", value: totalTokens.toLocaleString(), icon: Layers, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Investments", value: totalInvestments, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-[#0D0E12] p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
                <div className="text-[10px] text-neutral-500 font-mono">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 bg-[#13161C] border border-white/5 rounded-xl px-3 h-10 w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input type="text" placeholder="Search properties by name, location..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none w-full font-mono" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "available", "sold", "coming_soon"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-[#E2B93B]/10 text-[#E2B93B] border border-[#E2B93B]/20"
                  : "bg-[#13161C] text-neutral-500 border border-white/5 hover:text-white"
              }`}>
              {tab === "coming_soon" ? "Coming Soon" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-12 text-center">
          <Building2 className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">No Properties Found</h3>
          <p className="text-neutral-500 text-sm">Add your first property to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((property) => {
            const images = getImageList(property);
            const features = getFeaturesList(property);
            return (
              <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/5 bg-[#0D0E12] overflow-hidden shadow-xl hover:border-[#E2B93B]/20 transition-all group">
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
                  {images.length > 0 ? (
                    <Image src={images[0]} alt={property.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-8 h-8 text-neutral-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-transparent" />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded border ${
                      property.status === "AVAILABLE" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                      property.status === "SOLD" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                      "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    }`}>{property.status.replace("_", " ")}</span>
                  </div>
                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] font-bold px-2 py-1 rounded border text-blue-400 bg-blue-500/10 border-blue-500/20">
                      {property.type}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-[#E2B93B] transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{property.location || property.city || property.state || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold font-mono text-[#E2B93B]">
                      ${property.priceUSD.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      {property.availableTokens}/{property.totalTokens} tokens
                    </div>
                  </div>
                  {/* Funding bar */}
                  {property.totalTokens > 0 && (
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={styles.fundingBar}
                        style={{ '--funding-width': `${Math.round(((property.totalTokens - property.availableTokens) / property.totalTokens) * 100)}%` } as React.CSSProperties} />
                    </div>
                  )}
                  {/* Features preview */}
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {features.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">{f}</span>
                      ))}
                      {features.length > 3 && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-500">+{features.length - 3}</span>
                      )}
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button onClick={() => { setPreviewProperty(property); setPreviewImageIdx(0); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#E2B93B]/5 hover:bg-[#E2B93B]/10 transition-colors text-xs text-[#E2B93B]">
                      <ExternalLink className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button onClick={() => startEdit(property)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-neutral-400">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(property.id)}
                      className="flex items-center justify-center p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-colors text-xs text-red-400"
                      title="Delete property">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewProperty && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setPreviewProperty(null)}>
          <div className="w-full max-w-4xl rounded-2xl border border-white/5 bg-[#0D0E12] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E2B93B]" />
                <span className="text-sm font-bold text-white">{previewProperty.title}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                  previewProperty.status === "AVAILABLE" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                  previewProperty.status === "SOLD" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                  "text-amber-400 bg-amber-500/10 border-amber-500/20"
                }`}>{previewProperty.status}</span>
              </div>
              <button onClick={() => setPreviewProperty(null)} className="text-neutral-500 hover:text-white" title="Close preview">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Content - Full Property View */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Image Gallery */}
              {getImageList(previewProperty).length > 0 && (
                <div className="relative h-[300px] rounded-xl overflow-hidden bg-[#090A0C]">
                  <Image src={getImageList(previewProperty)[previewImageIdx]} alt={previewProperty.title}
                    fill className="object-cover" sizes="100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-transparent" />
                  {getImageList(previewProperty).length > 1 && (
                    <>
                      <button onClick={() => setPreviewImageIdx(prev => (prev - 1 + getImageList(previewProperty).length) % getImageList(previewProperty).length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                        title="Previous image">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setPreviewImageIdx(prev => (prev + 1) % getImageList(previewProperty).length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                        title="Next image">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {getImageList(previewProperty).map((_, idx) => (
                          <button key={idx} onClick={() => setPreviewImageIdx(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === previewImageIdx ? "bg-[#E2B93B] w-5" : "bg-white/30"}`}
                            title={`Go to image ${idx + 1}`} />
                        ))}
                      </div>
                    </>
                  )}
                  <div className="absolute top-3 right-3 text-[10px] font-mono bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-neutral-300">
                    {previewImageIdx + 1} / {getImageList(previewProperty).length}
                  </div>
                </div>
              )}

              {/* Property Info Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Price</div>
                  <div className="text-sm font-bold font-mono text-[#E2B93B]">${previewProperty.priceUSD.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Token Price</div>
                  <div className="text-sm font-bold text-white font-mono">${previewProperty.tokenPriceUSD}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Available / Total</div>
                  <div className="text-sm font-bold text-white font-mono">{previewProperty.availableTokens}/{previewProperty.totalTokens}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Type</div>
                  <div className="text-sm font-bold text-white">{previewProperty.type}</div>
                </div>
                {previewProperty.expectedReturn > 0 && (
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] text-neutral-500 font-mono mb-1">Expected Return</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {previewProperty.expectedReturn}% APY
                    </div>
                  </div>
                )}
                {previewProperty.rentalYield > 0 && (
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] text-neutral-500 font-mono mb-1">Rental Yield</div>
                    <div className="text-sm font-bold text-white font-mono">{previewProperty.rentalYield}%</div>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Location</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" /> {previewProperty.location || previewProperty.city || "—"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Coordinates</div>
                  <div className="text-sm font-bold text-white font-mono text-xs">
                    {previewProperty.lat !== 0 ? `${previewProperty.lat.toFixed(4)}, ${previewProperty.lng.toFixed(4)}` : "—"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Investments</div>
                  <div className="text-sm font-bold text-white font-mono">{previewProperty._count.investments}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Created</div>
                  <div className="text-sm font-bold text-white font-mono text-xs">{new Date(previewProperty.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Map Preview */}
              {previewProperty.lat !== 0 && previewProperty.lng !== 0 && (
                <div className="rounded-xl border border-white/5 bg-[#090A0C] p-4">
                  <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#E2B93B]" /> Map Location
                  </h4>
                  <div className="relative h-[200px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/20 to-emerald-900/20">
                    <iframe
                      src={`https://maps.google.com/maps?q=${previewProperty.lat},${previewProperty.lng}&z=15&output=embed`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Property location map"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {previewProperty.description && (
                <div className="rounded-xl border border-white/5 bg-[#090A0C] p-4">
                  <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#E2B93B]" /> Description
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">{previewProperty.description}</p>
                </div>
              )}

              {/* Features */}
              {getFeaturesList(previewProperty).length > 0 && (
                <div className="rounded-xl border border-white/5 bg-[#090A0C] p-4">
                  <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-[#E2B93B]" /> Key Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {getFeaturesList(previewProperty).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E2B93B] shrink-0" />
                        <span className="text-xs text-neutral-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {getDocumentsList(previewProperty).length > 0 && (
                <div className="rounded-xl border border-white/5 bg-[#090A0C] p-4">
                  <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#E2B93B]" /> Documents
                  </h4>
                  <div className="space-y-2">
                    {getDocumentsList(previewProperty).map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="text-xs text-neutral-300">{doc}</span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Footer */}
            <div className="flex items-center justify-between p-4 border-t border-white/5">
              <button onClick={() => setPreviewProperty(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-neutral-400 text-sm hover:bg-white/10 transition-all">
                Close Preview
              </button>
              <button onClick={() => { startEdit(previewProperty); setPreviewProperty(null); }}
                className="px-4 py-2 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B] text-sm font-bold hover:bg-[#E2B93B]/20 transition-all">
                <Edit3 className="w-3.5 h-3.5 inline mr-1.5" /> Edit Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal - Comprehensive */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowForm(false)}>
          <div className="w-full max-w-3xl rounded-2xl border border-white/5 bg-[#0D0E12] shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* Form Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h2 className="text-lg font-bold text-white">{editingId ? "Edit Property" : "Add New Property"}</h2>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  {editingId ? "Update property details" : "Create a new real estate asset"}
                </p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-neutral-500 hover:text-white" title="Close form">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Basic Info */}
              <div>
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#E2B93B]" /> Basic Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="propertyTitle" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Property Title *</label>
                    <input id="propertyTitle" required value={form.title} onChange={(e) => {
                      const title = e.target.value;
                      setForm({ ...form, title, slug: editingId ? form.slug : generateSlug(title) });
                    }} placeholder="e.g. Eko Atlantic High-Rise Alpha"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="slug" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Slug</label>
                    <input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="auto-generated-from-title"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono text-neutral-400" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Description</label>
                    <textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3} placeholder="Detailed description of the property..."
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="type" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Type</label>
                    <select id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                      title="Property type">
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="INDUSTRIAL">Industrial</option>
                      <option value="LAND">Land</option>
                      <option value="MIXED_USE">Mixed Use</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Status</label>
                    <select id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                      title="Property status">
                      <option value="AVAILABLE">Available</option>
                      <option value="SOLD">Sold</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="COMING_SOON">Coming Soon</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Geospatial */}
              <div>
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#E2B93B]" /> Location & Geospatial
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Location / Address</label>
                    <input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Victoria Island, Lagos"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="city" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">City</label>
                    <input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="state" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">State</label>
                    <input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="country" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Country</label>
                    <input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="lat" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Latitude</label>
                    <input id="lat" type="number" step="any" value={form.lat || ""} onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 6.4258"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="lng" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Longitude</label>
                    <input id="lng" type="number" step="any" value={form.lng || ""} onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 3.4167"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  {/* Map Preview */}
                  {form.lat !== 0 && form.lng !== 0 && (
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Map Preview</label>
                      <div className="h-[200px] rounded-xl overflow-hidden border border-white/5">
                        <iframe
                          title="Map Preview"
                          src={`https://maps.google.com/maps?q=${form.lat},${form.lng}&z=15&output=embed`}
                          className="w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-[#E2B93B]" /> Financial Details
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="priceUSD" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Price (USD) *</label>
                    <input id="priceUSD" type="number" required value={form.priceUSD || ""} onChange={(e) => setForm({ ...form, priceUSD: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="totalTokens" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Total Tokens</label>
                    <input id="totalTokens" type="number" value={form.totalTokens || ""} onChange={(e) => setForm({ ...form, totalTokens: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="availableTokens" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Available Tokens</label>
                    <input id="availableTokens" type="number" value={form.availableTokens || ""} onChange={(e) => setForm({ ...form, availableTokens: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="tokenPriceUSD" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Token Price (USD)</label>
                    <input id="tokenPriceUSD" type="number" step="0.01" value={form.tokenPriceUSD || ""} onChange={(e) => setForm({ ...form, tokenPriceUSD: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="expectedReturn" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Expected Return (%)</label>
                    <input id="expectedReturn" type="number" step="0.1" value={form.expectedReturn || ""} onChange={(e) => setForm({ ...form, expectedReturn: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 16.4"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="rentalYield" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Rental Yield (%)</label>
                    <input id="rentalYield" type="number" step="0.1" value={form.rentalYield || ""} onChange={(e) => setForm({ ...form, rentalYield: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 9.2"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div>
                    <label htmlFor="completionPercentage" className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">Completion (%)</label>
                    <input id="completionPercentage" type="number" min="0" max="100" value={form.completionPercentage || ""} onChange={(e) => setForm({ ...form, completionPercentage: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#E2B93B]" /> Images (one URL per line)
                </h3>
                <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
                  rows={4} placeholder={`https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80\nhttps://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80`}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                {form.images && form.images.trim() && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                    {form.images.split("\n").filter(Boolean).map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#090A0C] border border-white/5">
                        <Image src={url.trim()} alt={`Image ${i + 1}`} fill className="object-cover" sizes="80px" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-[#E2B93B]" /> Features (one per line)
                </h3>
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={4} placeholder={`28 Storeys - Mixed Use Development\nSmart Building Management System\n24/7 Concierge & Security\nSwimming Pool & Fitness Center`}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#E2B93B]" /> Documents (one per line)
                </h3>
                <textarea value={form.documents} onChange={(e) => setForm({ ...form, documents: e.target.value })}
                  rows={3} placeholder={`Title Deed - RX-TD-2024-001\nStructural Integrity Report - 2024\nFire Safety Compliance Certificate`}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B] font-bold text-sm hover:bg-[#E2B93B]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {saving ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> {editingId ? "Update Property" : "Create Property"}</>
                  )}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="py-3 px-6 rounded-xl bg-white/5 text-neutral-400 font-bold text-sm hover:bg-white/10 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}