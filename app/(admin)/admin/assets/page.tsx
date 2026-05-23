import { PropertiesGrid } from "@/components/dashboard/properties-grid";

export default function AdminAssetsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Asset Management</h1>
        <p className="text-muted-foreground mt-1">Manage tokenized properties and their status.</p>
      </div>
      <PropertiesGrid />
    </div>
  );
}