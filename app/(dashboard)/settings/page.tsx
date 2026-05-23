import { ProfileSettings } from "@/components/dashboard/profile-settings";
import { SecuritySettings } from "@/components/dashboard/security-settings";
import { NotificationSettings } from "@/components/dashboard/notification-settings";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ProfileSettings />
        <SecuritySettings />
      </div>
      <NotificationSettings />
    </div>
  );
}