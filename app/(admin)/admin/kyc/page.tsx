import { PendingKYC } from "@/components/admin/pending-kyc";

export default function AdminKYCPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">KYC Review</h1>
        <p className="text-muted-foreground mt-1">Review and approve user identity verifications.</p>
      </div>
      <PendingKYC />
    </div>
  );
}