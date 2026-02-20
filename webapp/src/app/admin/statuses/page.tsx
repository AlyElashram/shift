import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { StatusesManager } from "./StatusesManager";

export default async function StatusesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/admin");

  const statuses = await prisma.shipmentStatus.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { shipments: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
          Shipment Statuses
        </h1>
        <p className="text-[var(--shift-gray-light)]">
          Manage shipment status options and their order
        </p>
      </div>

      <StatusesManager statuses={statuses} />
    </div>
  );
}
