import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ShipmentForm } from "@/components/admin/forms/ShipmentForm";

export default async function NewShipmentPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const statuses = await prisma.shipmentStatus.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/shipments"
          className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
            New Shipment
          </h1>
          <p className="text-[var(--shift-gray-light)]">
            Create a new car shipment
          </p>
        </div>
      </div>

      <ShipmentForm statuses={statuses} />
    </div>
  );
}
