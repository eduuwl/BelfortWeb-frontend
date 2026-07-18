import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-matricula">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
