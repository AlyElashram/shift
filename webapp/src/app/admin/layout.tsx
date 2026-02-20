import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow access to login page without authentication
  // The login page will handle its own redirect if already authenticated

  return (
    <div className="min-h-screen bg-[var(--shift-black)]">
      {session?.user ? (
        <div className="flex h-screen">
          <AdminSidebar user={session.user} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader user={session.user} />
            <main className="flex-1 overflow-y-auto p-6 bg-[var(--shift-black-soft)]">
              {children}
            </main>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
