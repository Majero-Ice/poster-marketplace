import { redirect } from "next/navigation";
import { getSession } from "@/shared/lib/auth";
import { AdminSidebar } from "@/widgets/admin-sidebar";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 relative">
        {children}
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
