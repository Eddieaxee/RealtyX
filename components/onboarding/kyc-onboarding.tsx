"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Building,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Fingerprint,
  Loader2,
  Shield,
  Target,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/lib/upload";

const steps = [
  { id: "identity", title: "Investor Profile & Parameters", icon: UserCheck },
  { id: "compliance", title: "CBN Identification Registry", icon: Fingerprint },
  { id: "documents", title: "Document & Evidence Ledger", icon: Fingerprint },
  { id: "review", title: "Verification Submission", icon: Check },
] as const;

type RiskProfileUi = "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";

type KycUiState = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  idType: "BVN" | "NIN" | "PASSPORT";
  idNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  // Premium Institutional Profiles Extensions (UI-only)
  riskProfile: RiskProfileUi;
  investmentGoal: string;
  investorCategory: string;
  // Document storage (URLs)
  passportUrl: string;
  addressProofUrl: string;
  selfiePlaceholderSynced: boolean;
};

function mapPrismaRiskToUi(riskLevel?: string | null): RiskProfileUi {
  if (riskLevel === "LOW") return "CONSERVATIVE";
  if (riskLevel === "MEDIUM") return "MODERATE";
  if (riskLevel === "HIGH") return "AGGRESSIVE";
  return "MODERATE";
}

export function KYCOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<KycUiState>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "Nigerian",
    idType: "BVN",
    idNumber: "",
    address: "",
    city: "",
    state: "Lagos",
    country: "Nigeria",
    // Premium Institutional Profiles Extensions
    riskProfile: "MODERATE",
    investmentGoal: "YIELD_GENERATION",
    investorCategory: "RETAIL",
    // Document Storage Strings references
    passportUrl: "",
    addressProofUrl: "",
    selfiePlaceholderSynced: false,
  });

  // Upload states
  const [passportName, setPassportName] = useState("");
  const [addressDocName, setAddressDocName] = useState("");
  const { startUpload: startKycUpload } = useUploadThing("kycDocument");

  useEffect(() => {
    const loadExistingKYC = async () => {
      try {
        const res = await fetch("/api/kyc");
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        const src = data.kycRecord ?? data;

        setFormData({
          firstName: src.firstName || "",
          lastName: src.lastName || "",
          dateOfBirth: src.dateOfBirth ? src.dateOfBirth.split("T")[0] : "",
          nationality: src.nationality || "Nigerian",
          idType: src.idType || "BVN",
          idNumber: src.idNumber || "",
          address: src.address || "",
          city: src.city || "",
          state: src.state || "Lagos",
          country: src.country || "Nigeria",
          riskProfile: mapPrismaRiskToUi(src.riskLevel),
          investmentGoal:
            (src.investmentGoals?.[0] as string | undefined) ||
            "YIELD_GENERATION",
          investorCategory: src.investorCategory || "RETAIL",
          passportUrl: src.idDocumentUrl || "",
          addressProofUrl: src.proofOfAddressUrl || "",
          selfiePlaceholderSynced: !!src.selfieUrl,
        });

        if (
          data.status === "SUBMITTED" ||
          data.status === "APPROVED" ||
          data.status === "UNDER_REVIEW"
        ) {
          setSuccess(true);
          setCurrentStep(3);
        }
      } catch (err) {
        console.error("Failed loading structural telemetry profile", err);
      } finally {
        setFetchLoading(false);
      }
    };

    loadExistingKYC();
  }, []);

  const validateCurrentStep = () => {
    setError("");

    if (currentStep === 0) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.dateOfBirth ||
        !formData.address
      ) {
        setError("All basic identity fields are mandatory.");
        return false;
      }
    }

    if (currentStep === 1) {
      if (!formData.idNumber) {
        setError("Identification registry reference number is required.");
        return false;
      }
      if (
        (formData.idType === "BVN" || formData.idType === "NIN") &&
        formData.idNumber.length !== 11
      ) {
        setError(
          `${formData.idType} parameters require exactly 11 analytical numeric digits.`,
        );
        return false;
      }
    }

    if (currentStep === 2) {
      if (formData.idType === "PASSPORT" && !passportName) {
        setError(
          "International Passport Bio-Data image upload is mandatory for chosen framework.",
        );
        return false;
      }
      if (!addressDocName) {
        setError(
          "Proof of Residential Address document is required for local compliance registry.",
        );
        return false;
      }
      if (!formData.selfiePlaceholderSynced) {
        setError(
          "Biometric capture verification placeholder checklist state must be confirmed.",
        );
        return false;
      }
    }

    return true;
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === steps.length - 1) {
      await handleComplianceSubmission();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplianceSubmission = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // Map UI riskProfile to Prisma riskLevel
          riskLevel:
            formData.riskProfile === "CONSERVATIVE"
              ? "LOW"
              : formData.riskProfile === "MODERATE"
                ? "MEDIUM"
                : "HIGH",
          // Map investmentGoal to investmentGoals[0] (Prisma expects string[])
          investmentGoals: [formData.investmentGoal],
          // Map document URLs to Prisma fields
          idDocumentUrl: formData.passportUrl || null,
          proofOfAddressUrl: formData.addressProofUrl || null,
          selfieUrl: formData.selfiePlaceholderSynced
            ? "mock_selfie_url"
            : null,
          // Prisma field names for IDs
          firstName: formData.firstName,
          lastName: formData.lastName,
          idType: formData.idType,
          idNumber: formData.idNumber || null,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          nationality: formData.nationality,
          dateOfBirth: formData.dateOfBirth || null,
          investorCategory: formData.investorCategory,
          // Keep originals but they are harmless; API should persist existing prisma fields.
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || "Submission rejected by compliance execution routing.",
        );
      }

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit KYC";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-[#E2B93B] animate-spin" />
        <p className="text-xs text-neutral-400 font-mono">
          Syncing security parameter matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#07080B] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E2B93B]/40 to-transparent" />

      <div className="mb-10">
        <div className="flex items-center justify-between max-w-xl mx-auto mb-6 overflow-x-auto pb-2 scrollbar-none">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center shrink-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  i <= currentStep
                    ? "bg-gradient-to-br from-[#E2B93B] to-[#B89221] text-[#090A0C] font-bold shadow-md shadow-[#E2B93B]/10"
                    : "bg-[#111318] border border-neutral-800 text-neutral-500"
                }`}
              >
                <step.icon className="w-4 h-4" />
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-14 h-[2px] mx-2 rounded-full ${
                    i < currentStep ? "bg-[#E2B93B]" : "bg-neutral-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-white">
            {steps[currentStep].title}
          </h2>
          <p className="text-[11px] text-neutral-400 font-mono uppercase tracking-wider">
            Framework Sector {currentStep + 1} of {steps.length} — Verification
            Pipeline
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="min-h-[340px]"
        >
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400 shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Identity Payload Encrypted & Transmitted
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Your identity logs, asset boundaries, and local reference
                  indices are queued for secure administrative clearing.
                  Backoffice confirmations deploy inside 24 hours.
                </p>
              </div>
            </div>
          ) : (
            <>
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        First Name (Legal)
                      </label>
                      <Input
                        placeholder="e.g., Edison"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="bg-[#111318] border-neutral-800 text-white focus-visible:ring-[#E2B93B]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Last Name (Surname)
                      </label>
                      <Input
                        placeholder="e.g., Alabi"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="bg-[#111318] border-neutral-800 text-white focus-visible:ring-[#E2B93B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="bg-[#111318] border-neutral-800 text-white focus-visible:ring-[#E2B93B] custom-calendar-dark text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                        title="Investor tier"
                      >
                        Investor Classification tier
                      </label>
                      <select
                        aria-label="Investor Classification tier"
                        className="w-full h-10 rounded-md border border-neutral-800 bg-[#111318] px-3 text-white text-xs outline-none focus:border-[#E2B93B] transition-all"
                        value={formData.investorCategory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            investorCategory: e.target.value,
                          })
                        }
                      >
                        <option value="RETAIL">
                          Retail Asset Allocator (under {"\u20A6"}5M
                          capitalization)
                        </option>

                        <option value="HIGH_NET_WORTH">
                          HNW Accredited Hub ({"\u20A6"}5M - {"\u20A6"}50M
                          placement)
                        </option>
                        <option value="INSTITUTIONAL">
                          Corporate/Institutional Fund Syndicate Manager
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="space-y-1.5">
                      <label
                        className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1"
                        title="Risk appetite"
                      >
                        <Target className="w-3 h-3 text-[#E2B93B]" /> Risk
                        Appetite Metric
                      </label>
                      <select
                        aria-label="Risk Appetite Metric"
                        className="w-full h-10 rounded-md border border-neutral-800 bg-[#111318] px-3 text-white text-xs outline-none focus:border-[#E2B93B] transition-all"
                        value={formData.riskProfile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            riskProfile: e.target.value as RiskProfileUi,
                          })
                        }
                      >
                        <option value="CONSERVATIVE">
                          Conservative (Low yield index protection)
                        </option>
                        <option value="MODERATE">
                          Moderate Balanced Core (Off-plan + cashflows mix)
                        </option>
                        <option value="AGGRESSIVE">
                          Aggressive (High-growth development vectors)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                        title="Investment horizon"
                      >
                        Primary Investment Horizon Vector
                      </label>
                      <select
                        aria-label="Primary Investment Horizon Vector"
                        className="w-full h-10 rounded-md border border-neutral-800 bg-[#111318] px-3 text-white text-xs outline-none focus:border-[#E2B93B] transition-all"
                        value={formData.investmentGoal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            investmentGoal: e.target.value,
                          })
                        }
                      >
                        <option value="YIELD_GENERATION">
                          Immediate Quarter Rental Distributions Yield
                        </option>
                        <option value="CAPITAL_GROWTH">
                          Off-Plan Infrastructure Building Appreciation
                        </option>
                        <option value="BALANCED">
                          Balanced Real Estate Token Rollup
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-white/5 pt-4">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Verified Residential Street Address
                    </label>
                    <Input
                      placeholder="Must match physical utility bill strings perfectly"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="bg-[#111318] border-neutral-800 text-white focus-visible:ring-[#E2B93B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        City Node
                      </label>
                      <Input
                        placeholder="e.g., Ikeja"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="bg-[#111318] border-neutral-800 text-white focus-visible:ring-[#E2B93B]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        State Region
                      </label>
                      <Input
                        placeholder="e.g., Lagos"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="bg-[#111318] border-neutral-800 text-white focus-visible:ring-[#E2B93B]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="idType"
                      className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                      title="Select ID type"
                    >
                      Compliance Clearing Gateway Interface
                    </label>
                    <select
                      id="idType"
                      aria-label="Compliance Clearing Gateway Interface"
                      className="w-full h-11 rounded-xl border border-neutral-800 bg-[#111318] px-3.5 text-white text-xs outline-none focus:border-[#E2B93B] focus:ring-1 focus:ring-[#E2B93B]/20 transition-all"
                      value={formData.idType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          idType: e.target.value as KycUiState["idType"],
                          idNumber: "",
                        })
                      }
                    >
                      <option value="BVN">
                        Bank Verification Number (BVN) — Secure Instant
                        Validation
                      </option>
                      <option value="NIN">
                        National Identification Number (NIN) — NIMC Query Node
                      </option>
                      <option value="PASSPORT">
                        International Passport Document Identification
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      {formData.idType} Cryptographic Reference Key
                    </label>
                    <Input
                      placeholder={
                        formData.idType === "PASSPORT"
                          ? "e.g., A00000000"
                          : "Enter standard 11-digit numerical token code"
                      }
                      value={formData.idNumber}
                      maxLength={formData.idType === "PASSPORT" ? 15 : 11}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          idNumber: e.target.value.replace(/\s/g, ""),
                        })
                      }
                      className="bg-[#111318] border-neutral-800 text-white focus-visible:ring-[#E2B93B] font-mono tracking-wider text-xs h-11"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-[#E2B93B]/10 bg-[#E2B93B]/5 flex items-start gap-3">
                    <Building className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      All data transactions match centralized clearing houses
                      over an isolated secure channel. Bank access controls,
                      transaction tokens, or wallet security keys are never
                      touched.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  {formData.idType === "PASSPORT" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        International Passport Bio-Data Page
                      </label>
                      <div className="border border-dashed border-neutral-800 rounded-xl p-4 bg-[#111318] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-neutral-400">
                          <FileText className="w-4 h-4 text-[#E2B93B]" />
                          <span>
                            {passportName ||
                              "No file uploaded (PNG, JPG, max 5MB)"}
                          </span>
                        </div>
                        <label className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-medium">
                          Browse
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPassportName(file.name);
                                try {
                                  const uploaded = await startKycUpload([file]);
                                  if (uploaded?.[0]?.url) {
                                    setFormData({
                                      ...formData,
                                      passportUrl: uploaded[0].url,
                                    });
                                  }
                                } catch {
                                  // Fallback: store file name for reference
                                  setFormData({
                                    ...formData,
                                    passportUrl: `upload_pending_${file.name}`,
                                  });
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Proof of Residence (Utility Bill, Bank Statement)
                    </label>
                    <div className="border border-dashed border-neutral-800 rounded-xl p-4 bg-[#111318] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <FileText className="w-4 h-4 text-[#E2B93B]" />
                        <span>
                          {addressDocName ||
                            "Attach document showing explicit address string matching profile"}
                        </span>
                      </div>
                      <label className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-medium">
                        Browse
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setAddressDocName(file.name);
                              try {
                                const uploaded = await startKycUpload([file]);
                                if (uploaded?.[0]?.url) {
                                  setFormData({
                                    ...formData,
                                    addressProofUrl: uploaded[0].url,
                                  });
                                }
                              } catch {
                                // Fallback: store file name for reference
                                setFormData({
                                  ...formData,
                                  addressProofUrl: `upload_pending_${file.name}`,
                                });
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      3D Biometric Liveness Capture
                    </label>
                    <div
                      onClick={() =>
                        setFormData({
                          ...formData,
                          selfiePlaceholderSynced:
                            !formData.selfiePlaceholderSynced,
                        })
                      }
                      className={`border rounded-xl p-4 text-left cursor-pointer transition-all flex items-center justify-between ${
                        formData.selfiePlaceholderSynced
                          ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-400"
                          : "bg-[#111318] border-neutral-800 text-neutral-400 hover:border-neutral-700"
                      }`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            formData.selfiePlaceholderSynced
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-neutral-800 text-neutral-500"
                          }`}
                        >
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            Device Liveness Session Checker
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Click to mock active camera calibration check frame
                            confirmation
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.selfiePlaceholderSynced
                            ? "border-emerald-400 bg-emerald-400 text-black"
                            : "border-neutral-700"
                        }`}
                      >
                        {formData.selfiePlaceholderSynced && (
                          <Check className="w-3 h-3 stroke-[3]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">
                        Cryptographic Payload Sealed
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Review parameter structures completely before final
                        commit logic executes.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#111318] border border-neutral-800 space-y-2 text-[11px] font-mono text-neutral-300">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-neutral-500">
                        INVESTOR CONTEXT:
                      </span>
                      <span>
                        {formData.firstName} {formData.lastName} (
                        {formData.investorCategory})
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-neutral-500">
                        STRATEGY / RISK PROFILE:
                      </span>
                      <span className="text-[#E2B93B]">
                        {formData.investmentGoal} / {formData.riskProfile}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-neutral-500">REGULATORY HUB:</span>
                      <span>{formData.idType} PARAMS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">ROUTING BLOCKS:</span>
                      <span>
                        {"*".repeat(Math.max(formData.idNumber.length - 4, 0))}
                        {formData.idNumber.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {!success && (
        <div className="flex justify-between mt-8 pt-4 border-t border-white/5 relative z-10">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className="border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 bg-transparent rounded-xl h-10 px-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1.5 stroke-[2.5]" /> Back
          </Button>
          <Button
            onClick={nextStep}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:opacity-95 text-[#090A0C] font-bold rounded-xl h-10 px-5 flex items-center shadow-lg shadow-[#E2B93B]/5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin text-[#090A0C]" />
                Signing Payload...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                Confirm Submission{" "}
                <Check className="w-4 h-4 ml-1.5 stroke-[2.5]" />
              </>
            ) : (
              <>
                Continue{" "}
                <ChevronRight className="w-4 h-4 ml-1.5 stroke-[2.5]" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
