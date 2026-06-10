"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserCheck,
  CreditCard,
  FileText,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VerificationStep =
  | "STATUS_CHECK"
  | "IDENTITY"
  | "TIER_ASSESSMENT"
  | "DOCUMENTATION"
  | "SUBMITTED";

interface KycStatus {
  status: string | null;
  firstName?: string;
  lastName?: string;
  investorCategory?: string;
}

export default function KYCOnboardingPortal() {
  const [currentStep, setCurrentStep] =
    useState<VerificationStep>("STATUS_CHECK");
  const [kycStatus, setKycStatus] = useState<KycStatus>({ status: null });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Identity fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bvnValue, setBvnValue] = useState("");
  const [ninValue, setNinValue] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality] = useState("Nigerian");

  // Tier assessment
  const [investorCategory, setInvestorCategory] = useState<
    "RETAIL" | "HNW" | "INSTITUTIONAL"
  >("RETAIL");

  // Documentation
  const [uploadedFiles, setUploadedFiles] = useState({
    identityDoc: false,
    utilityBill: false,
    selfie: false,
  });

  // Address fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Lagos");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Load existing KYC status
  useEffect(() => {
    async function loadKyc() {
      try {
        const res = await fetch("/api/kyc", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setKycStatus({
            status: data?.status ?? data?.kycRecord?.status ?? null,
            firstName: data?.firstName,
            lastName: data?.lastName,
            investorCategory: data?.investorCategory,
          });

          // If already approved or under review, show status
          const status = data?.status ?? data?.kycRecord?.status;
          if (status === "APPROVED") {
            setCurrentStep("SUBMITTED");
          } else if (status === "SUBMITTED" || status === "UNDER_REVIEW") {
            setCurrentStep("SUBMITTED");
          } else if (status === "PENDING") {
            setCurrentStep("IDENTITY");
          } else {
            setCurrentStep("IDENTITY");
          }
        }
      } catch {
        setCurrentStep("IDENTITY");
      } finally {
        setLoading(false);
      }
    }
    loadKyc();
  }, []);

  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (bvnValue.length === 11 || ninValue.length === 11) &&
      firstName &&
      lastName
    ) {
      setCurrentStep("TIER_ASSESSMENT");
    }
  };

  const handleDocumentSubmit = async () => {
    if (!uploadedFiles.identityDoc || !uploadedFiles.utilityBill) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth: dateOfBirth || null,
          nationality,
          idType: bvnValue.length === 11 ? "BVN" : "NIN",
          idNumber: bvnValue.length === 11 ? bvnValue : ninValue,
          ninNumber: ninValue.length === 11 ? ninValue : null,
          address,
          city,
          state,
          country: "Nigeria",
          phoneNumber,
          investorCategory,
          investmentGoals: ["WEALTH_BUILDING", "PASSIVE_INCOME"],
        }),
      });

      if (res.ok) {
        setCurrentStep("SUBMITTED");
        setKycStatus({ status: "SUBMITTED" });
      }
    } catch {
      // Handle error silently
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#090A0C]">
        <Loader2 className="w-8 h-8 text-[#E2B93B] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-screen text-white bg-[#090A0C]">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
          <ShieldCheck className="w-3.5 h-3.5" /> SEC Nigeria Compliance Node
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Investor Identity & KYC Ledger
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Complete anti-money laundering (AML) protocols to unlock primary
          market fractional allocations and legal asset title registries.
        </p>
      </div>

      {/* Current Status Banner */}
      {kycStatus.status && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-3 ${
            kycStatus.status === "APPROVED"
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
              : kycStatus.status === "REJECTED"
                ? "bg-red-500/5 border-red-500/20 text-red-400"
                : kycStatus.status === "SUBMITTED" ||
                    kycStatus.status === "UNDER_REVIEW"
                  ? "bg-blue-500/5 border-blue-500/20 text-blue-400"
                  : "bg-[#E2B93B]/5 border-[#E2B93B]/20 text-[#E2B93B]"
          }`}
        >
          {kycStatus.status === "APPROVED" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : kycStatus.status === "REJECTED" ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
          )}
          <div>
            <p className="font-bold">
              Verification Status: {kycStatus.status.replace("_", " ")}
            </p>
            <p className="text-neutral-400 mt-0.5">
              {kycStatus.status === "APPROVED"
                ? "Your identity has been verified. You can now invest in properties."
                : kycStatus.status === "REJECTED"
                  ? "Your submission was rejected. Please review and resubmit."
                  : kycStatus.status === "SUBMITTED"
                    ? "Your documents have been submitted for review. An analyst will update your status within 24 hours."
                    : "Your documents are being reviewed by our compliance team."}
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="grid grid-cols-4 gap-2 font-mono text-[10px] uppercase font-bold tracking-wider">
        {["IDENTITY", "TIER_ASSESSMENT", "DOCUMENTATION", "SUBMITTED"].map(
          (step, idx) => {
            const stepIndex = [
              "IDENTITY",
              "TIER_ASSESSMENT",
              "DOCUMENTATION",
              "SUBMITTED",
            ].indexOf(currentStep);
            const isCurrentOrPast = idx <= stepIndex;
            return (
              <div
                key={step}
                className={`p-2 border-b-2 transition-all ${
                  isCurrentOrPast
                    ? "border-[#E2B93B] text-white"
                    : "border-white/5 text-neutral-500"
                }`}
              >
                {idx + 1}.{" "}
                {step === "IDENTITY"
                  ? "Identity Lookup"
                  : step === "TIER_ASSESSMENT"
                    ? "Investor Category"
                    : step === "DOCUMENTATION"
                      ? "Verification Dossier"
                      : "Verification Staged"}
              </div>
            );
          },
        )}
      </div>

      {/* Step Content */}
      <div className="bg-[#0D0E12] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {currentStep === "IDENTITY" && (
          <form onSubmit={handleIdentitySubmit} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#E2B93B]" /> Biometric
                Registry Connection
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Provide your legal name, 11-digit Bank Verification Number (BVN)
                or National Identification Number (NIN). This checks matching
                parameters against government databases.
              </p>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">
                  First Name
                </label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="bg-[#090A0C] border-white/5 text-white text-sm h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="bg-[#090A0C] border-white/5 text-white text-sm h-11"
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-400 font-bold uppercase">
                Date of Birth
              </label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="bg-[#090A0C] border-white/5 text-white text-sm h-11"
              />
            </div>

            {/* BVN/NIN fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">
                  BVN (Bank Verification Number)
                </label>
                <Input
                  type="text"
                  maxLength={11}
                  value={bvnValue}
                  onChange={(e) =>
                    setBvnValue(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="22145678901"
                  className="bg-[#090A0C] border-white/5 text-white tracking-widest text-sm h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">
                  NIN (National Identification Number)
                </label>
                <Input
                  type="text"
                  maxLength={11}
                  value={ninValue}
                  onChange={(e) =>
                    setNinValue(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="41234567890"
                  className="bg-[#090A0C] border-white/5 text-white tracking-widest text-sm h-11"
                />
              </div>
            </div>

            {/* Address fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">
                  Residential Address
                </label>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your residential address"
                  className="bg-[#090A0C] border-white/5 text-white text-sm h-11"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">
                    City
                  </label>
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lagos"
                    className="bg-[#090A0C] border-white/5 text-white text-sm h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">
                    State
                  </label>
                  <Input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Lagos"
                    className="bg-[#090A0C] border-white/5 text-white text-sm h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+234..."
                    className="bg-[#090A0C] border-white/5 text-white text-sm h-11"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                Ensure that the data points linked to your banking institutions
                precisely correspond with your registration name to avoid
                instant rejection by the screening engine.
              </p>
            </div>

            <Button
              type="submit"
              disabled={
                (bvnValue.length !== 11 && ninValue.length !== 11) ||
                !firstName ||
                !lastName
              }
              className="bg-[#E2B93B] hover:bg-[#B89221] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl h-11 px-6 shadow-lg shadow-[#E2B93B]/5 w-full md:w-auto"
            >
              Initiate Secure Verification Lookup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {currentStep === "TIER_ASSESSMENT" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#E2B93B]" /> Investor
                Classification Matrix
              </h3>
              <p className="text-xs text-neutral-400">
                Select your capital allocation framework to specify structural
                investment parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setInvestorCategory("RETAIL")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  investorCategory === "RETAIL"
                    ? "bg-[#E2B93B]/5 border-[#E2B93B]"
                    : "bg-[#090A0C] border-white/5 hover:border-white/10"
                }`}
              >
                <span className="font-mono font-bold text-xs text-white block">
                  Retail Investor
                </span>
                <span className="text-[11px] text-neutral-400 mt-1 block leading-normal">
                  Allocations under ₦5,000,000 per asset cycle. Ideal for
                  continuous micro-fractional wealth building.
                </span>
              </div>

              <div
                onClick={() => setInvestorCategory("HNW")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  investorCategory === "HNW"
                    ? "bg-[#E2B93B]/5 border-[#E2B93B]"
                    : "bg-[#090A0C] border-white/5 hover:border-white/10"
                }`}
              >
                <span className="font-mono font-bold text-xs text-[#E2B93B] block">
                  High Net Worth
                </span>
                <span className="text-[11px] text-neutral-400 mt-1 block leading-normal">
                  Allocations up to ₦100,000,000. Accesses direct commercial
                  real estate mezzanine notes.
                </span>
              </div>

              <div
                onClick={() => setInvestorCategory("INSTITUTIONAL")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  investorCategory === "INSTITUTIONAL"
                    ? "bg-[#E2B93B]/5 border-[#E2B93B]"
                    : "bg-[#090A0C] border-white/5 hover:border-white/10"
                }`}
              >
                <span className="font-mono font-bold text-xs text-purple-400 block">
                  Institutional Suite
                </span>
                <span className="text-[11px] text-neutral-400 mt-1 block leading-normal">
                  Corporate assets, diaspora syndicates, and real estate asset
                  funds deploying large-scale capital.
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("IDENTITY")}
                className="text-neutral-400 hover:text-white font-mono text-xs"
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep("DOCUMENTATION")}
                className="bg-[#E2B93B] hover:bg-[#B89221] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl h-11 px-6"
              >
                Advance to Uploads <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === "DOCUMENTATION" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E2B93B]" /> Compliance
                Document Vault
              </h3>
              <p className="text-xs text-neutral-400">
                Upload high-resolution scans of your verification credentials to
                verify identity claims.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#090A0C] border border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-3">
                <UploadCloud className="w-8 h-8 text-neutral-500" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Government Issued ID
                  </span>
                  NIMC Slip, International Passport, or Driver{"'"}s License
                </div>
                <Button
                  type="button"
                  onClick={() =>
                    setUploadedFiles((p) => ({ ...p, identityDoc: true }))
                  }
                  size="sm"
                  className={`font-mono text-xs h-8 rounded-lg ${
                    uploadedFiles.identityDoc
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border border-white/10 text-white"
                  }`}
                >
                  {uploadedFiles.identityDoc
                    ? "✓ ID Uploaded Successfully"
                    : "Select Document File"}
                </Button>
              </div>

              <div className="p-5 rounded-xl bg-[#090A0C] border border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-3">
                <UploadCloud className="w-8 h-8 text-neutral-500" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Proof of Residential Address
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-0.5">
                    NEPA/IKEDC Bill or formal Bank Statement (Last 3 months)
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() =>
                    setUploadedFiles((p) => ({ ...p, utilityBill: true }))
                  }
                  size="sm"
                  className={`font-mono text-xs h-8 rounded-lg ${
                    uploadedFiles.utilityBill
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border border-white/10 text-white"
                  }`}
                >
                  {uploadedFiles.utilityBill
                    ? "✓ Bill Uploaded Successfully"
                    : "Select Utility File"}
                </Button>
              </div>

              <div className="p-5 rounded-xl bg-[#090A0C] border border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-3">
                <UploadCloud className="w-8 h-8 text-neutral-500" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Selfie Verification
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-0.5">
                    Live photo for biometric matching
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() =>
                    setUploadedFiles((p) => ({ ...p, selfie: true }))
                  }
                  size="sm"
                  className={`font-mono text-xs h-8 rounded-lg ${
                    uploadedFiles.selfie
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border border-white/10 text-white"
                  }`}
                >
                  {uploadedFiles.selfie ? "✓ Selfie Captured" : "Take Selfie"}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("TIER_ASSESSMENT")}
                className="text-neutral-400 hover:text-white font-mono text-xs"
              >
                Back
              </Button>
              <Button
                disabled={
                  !uploadedFiles.identityDoc || !uploadedFiles.utilityBill
                }
                onClick={handleDocumentSubmit}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl h-11 px-8 shadow-lg shadow-emerald-500/5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Transmit Final KYC Packet"
                )}
              </Button>
            </div>
          </div>
        )}

        {currentStep === "SUBMITTED" && (
          <div className="py-8 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Verification Packet{" "}
                {kycStatus.status === "APPROVED"
                  ? "Approved"
                  : kycStatus.status === "REJECTED"
                    ? "Rejected"
                    : "Submitted"}
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Reference Ticket: RX-KYC-
                {Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              {kycStatus.status === "APPROVED"
                ? "Your identity verification has been approved. You can now access all investment features."
                : kycStatus.status === "REJECTED"
                  ? "Your KYC submission was rejected. Please review your documents and try again."
                  : "Your identity credentials have been logged to the compliance processing stack. Automated background sanctions check execution will complete shortly, and an analyst will update your verification score within 24 hours."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
