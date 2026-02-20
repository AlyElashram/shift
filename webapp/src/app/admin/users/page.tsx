import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { UsersManager } from "./UsersManager";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          shipmentsCreated: true,
          statusChanges: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
          Users
        </h1>
        <p className="text-[var(--shift-gray-light)]">
          Manage admin user accounts and permissions
        </p>
      </div>

      <UsersManager users={users} currentUserId={session.user.id} />
    </div>
  );
}
