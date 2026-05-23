import { AdminStats } from "@/components/admin/admin-stats";
import { RecentUsers } from "@/components/admin/recent-users";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage platform users and their permissions.</p>
      </div>
      <RecentUsers />
    </div>
  );
}