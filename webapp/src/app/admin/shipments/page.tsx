import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ShipmentsTable } from "./ShipmentsTable";

export default async function ShipmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [shipments, statuses] = await Promise.all([
    prisma.shipment.findMany({
      include: { currentStatus: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shipmentStatus.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
            Shipments
          </h1>
          <p className="text-[var(--shift-gray-light)]">
            Manage all car shipments
          </p>
        </div>
        <Link
          href="/admin/shipments/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Shipment
        </Link>
      </div>

      <ShipmentsTable shipments={shipments} statuses={statuses} />
    </div>
  );
}
