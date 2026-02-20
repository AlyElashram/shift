import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ShipmentDetails } from "./ShipmentDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ShipmentDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const [shipment, statuses] = await Promise.all([
    prisma.shipment.findUnique({
      where: { id },
      include: {
        currentStatus: true,
        statusHistory: {
          include: {
            status: true,
            changedBy: { select: { name: true } },
          },
          orderBy: { changedAt: "desc" },
        },
        customer: true,
        createdBy: { select: { name: true } },
      },
    }),
    prisma.shipmentStatus.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  if (!shipment) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const trackingUrl = `${appUrl}/track/${shipment.trackingId}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
              {shipment.manufacturer} {shipment.model}
            </h1>
            <p className="text-[var(--shift-gray-light)]">
              VIN: {shipment.vin}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/shipments/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--shift-gray)]/50 text-[var(--shift-cream)] hover:border-[var(--shift-yellow)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </Link>
      </div>

      <ShipmentDetails shipment={shipment} statuses={statuses} trackingUrl={trackingUrl} />
    </div>
  );
}
