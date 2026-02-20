import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Logo } from "@/components/ui";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { ShipmentCard } from "@/components/tracking/ShipmentCard";

interface PageProps {
  params: Promise<{ trackingId: string }>;
}

export default async function TrackingPage({ params }: PageProps) {
  const { trackingId } = await params;

  const [shipment, statuses] = await Promise.all([
    prisma.shipment.findUnique({
      where: { trackingId },
      include: {
        currentStatus: true,
        statusHistory: {
          include: { status: true },
          orderBy: { changedAt: "asc" },
        },
      },
    }),
    prisma.shipmentStatus.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  if (!shipment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--shift-black)] grain-overlay">
      {/* Header */}
      <header className="border-b border-[var(--shift-gray)]/20">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" color="yellow" className="h-8 w-auto" />
          </Link>
          <span className="text-[var(--shift-gray)] text-sm">
            Shipment Tracking
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Shipment Info - 2 columns */}
          <div className="lg:col-span-2">
            <ShipmentCard
              shipment={shipment}
              currentStatus={shipment.currentStatus}
            />
          </div>

          {/* Timeline - 3 columns */}
          <div className="lg:col-span-3">
            <div className="card">
              <h2 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-6">
                Tracking Progress
              </h2>
              <TrackingTimeline
                statuses={statuses}
                currentStatus={shipment.currentStatus}
                history={shipment.statusHistory}
              />
            </div>
          </div>
        </div>

        {/* Additional Images */}
        {shipment.pictures.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
              Vehicle Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shipment.pictures.slice(1).map((url, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden border border-[var(--shift-gray)]/20">
                  <img
                    src={url}
                    alt={`Vehicle image ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--shift-gray)]/20 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-[var(--shift-gray)] text-sm">
            Questions about your shipment?{" "}
            <Link href="/#contact" className="text-[var(--shift-yellow)] hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
