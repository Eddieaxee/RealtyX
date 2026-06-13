import { AdminNav } from "@/components/layout/admin-nav";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090A0C] text-white selection:bg-[#E2B93B]/30 selection:text-[#E2B93B]">
      <AdminNav />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-0 lg:ml-64 pt-16 min-h-screen">
          <div className="p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}