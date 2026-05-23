import { PlatformActivity } from "@/components/admin/platform-activity";
import { AdminStats } from "@/components/admin/admin-stats";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform performance and growth metrics.</p>
      </div>
      <AdminStats />
      <PlatformActivity />
    </div>
  );
}