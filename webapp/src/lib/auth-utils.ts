import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireAuth();
  if (session.user.role !== role && session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }
  return session;
}

export async function requireSuperAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }
  return session;
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canAccessRoute(userRole: UserRole, requiredRole: UserRole): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  return userRole === requiredRole;
}
