import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { TemplatesManager } from "./TemplatesManager";

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/admin");

  const templates = await prisma.template.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
          Templates
        </h1>
        <p className="text-[var(--shift-gray-light)]">
          Manage document and email templates with placeholder support
        </p>
      </div>

      <TemplatesManager templates={templates} />
    </div>
  );
}
