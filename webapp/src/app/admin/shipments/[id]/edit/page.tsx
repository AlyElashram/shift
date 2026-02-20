import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ShipmentForm } from "@/components/admin/forms/ShipmentForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditShipmentPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const [shipment, statuses] = await Promise.all([
    prisma.shipment.findUnique({
      where: { id },
    }),
    prisma.shipmentStatus.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  if (!shipment) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/shipments/${id}`}
          className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
            Edit Shipment
          </h1>
          <p className="text-[var(--shift-gray-light)]">
            {shipment.manufacturer} {shipment.model} - {shipment.vin}
          </p>
        </div>
      </div>

      <ShipmentForm shipment={shipment} statuses={statuses} />
    </div>
  );
}
