"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, Upload, Camera, Check, ChevronRight, ChevronLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = [
  { id: "identity", title: "Personal Information", icon: UserCheck },
  { id: "documents", title: "Document Upload", icon: Upload },
  { id: "selfie", title: "Selfie Verification", icon: Camera },
  { id: "review", title: "Review & Submit", icon: Check },
];

export function KYCOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", dateOfBirth: "", nationality: "",
    idType: "passport", idNumber: "", address: "", city: "", country: "", postalCode: ""
  });
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= currentStep ? "gradient-gold text-white" : "bg-muted text-muted-foreground"}`}>
                <step.icon className="w-5 h-5" />
              </div>
              {i < steps.length - 1 && <div className={`w-16 h-0.5 mx-2 ${i < currentStep ? "bg-gold-500" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
          <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 rounded-xl border border-border/50 bg-card/50">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">First Name</label><Input placeholder="John" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Last Name</label><Input placeholder="Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Date of Birth</label><Input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Nationality</label><Input placeholder="United States" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Address</label><Input placeholder="123 Main St" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">City</label><Input placeholder="New York" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Country</label><Input placeholder="USA" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Postal Code</label><Input placeholder="10001" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} /></div>
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">ID Type</label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3" value={formData.idType} onChange={e => setFormData({...formData, idType: e.target.value})}>
                  <option value="passport">Passport</option><option value="drivers_license">Driver License</option><option value="national_id">National ID</option>
                </select>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">ID Number</label><Input placeholder="A12345678" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-gold-500/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" /><p className="text-sm font-medium">Upload ID Front</p><p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
                <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-gold-500/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" /><p className="text-sm font-medium">Upload ID Back</p><p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="text-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-muted mx-auto flex items-center justify-center"><Camera className="w-12 h-12 text-muted-foreground" /></div>
              <p className="text-sm text-muted-foreground">Take a clear selfie holding your ID document. Ensure good lighting and no glare.</p>
              <Button variant="outline" className="w-full">Open Camera</Button>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <Shield className="w-6 h-6 text-green-500" />
                <div><p className="font-medium text-green-500">Ready to Submit</p><p className="text-sm text-muted-foreground">Your information will be reviewed within 24 hours.</p></div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Summary</p>
                <div className="p-4 rounded-lg bg-background/50 space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}</p>
                  <p><span className="text-muted-foreground">Nationality:</span> {formData.nationality}</p>
                  <p><span className="text-muted-foreground">ID:</span> {formData.idType.replace("_", " ").toUpperCase()} ****{formData.idNumber.slice(-4)}</p>
                  <p><span className="text-muted-foreground">Address:</span> {formData.address}, {formData.city}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
        <Button onClick={nextStep} className="gradient-gold text-white" disabled={currentStep === steps.length - 1}>
          {currentStep === steps.length - 1 ? "Submit" : "Continue"} <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}