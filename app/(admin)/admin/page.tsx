import { AdminStats } from "@/components/admin/admin-stats";
import { RecentUsers } from "@/components/admin/recent-users";
import { PendingKYC } from "@/components/admin/pending-kyc";
import { PlatformActivity } from "@/components/admin/platform-activity";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management.</p>
      </div>
      <AdminStats />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentUsers />
          <PlatformActivity />
        </div>
        <PendingKYC />
      </div>
    </div>
  );
}