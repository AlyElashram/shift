import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  // Fetch dashboard stats
  const [shipmentCount, leadCount, statusCount] = await Promise.all([
    prisma.shipment.count(),
    prisma.lead.count({ where: { contacted: false } }),
    prisma.shipmentStatus.count(),
  ]);

  const recentShipments = await prisma.shipment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      currentStatus: true,
    },
  });

  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    where: { contacted: false },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
          Dashboard
        </h1>
        <p className="text-[var(--shift-gray-light)]">
          Overview of your shipments and leads
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--shift-gray)] text-sm uppercase tracking-wider">
                Total Shipments
              </p>
              <p className="text-3xl font-bold text-[var(--shift-cream)] mt-1">
                {shipmentCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[var(--shift-yellow)]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--shift-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--shift-gray)] text-sm uppercase tracking-wider">
                New Leads
              </p>
              <p className="text-3xl font-bold text-[var(--shift-cream)] mt-1">
                {leadCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[var(--shift-yellow)]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--shift-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--shift-gray)] text-sm uppercase tracking-wider">
                Statuses
              </p>
              <p className="text-3xl font-bold text-[var(--shift-cream)] mt-1">
                {statusCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[var(--shift-yellow)]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--shift-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        <Link href="/admin/shipments/new" className="card hover:border-[var(--shift-yellow)] transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--shift-gray)] text-sm uppercase tracking-wider">
                Quick Action
              </p>
              <p className="text-lg font-bold text-[var(--shift-cream)] mt-1 group-hover:text-[var(--shift-yellow)] transition-colors">
                New Shipment
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[var(--shift-yellow)]/10 flex items-center justify-center group-hover:bg-[var(--shift-yellow)]/20 transition-colors">
              <svg className="w-6 h-6 text-[var(--shift-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--shift-cream)] uppercase">
              Recent Shipments
            </h2>
            <Link
              href="/admin/shipments"
              className="text-[var(--shift-yellow)] text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          {recentShipments.length > 0 ? (
            <div className="space-y-3">
              {recentShipments.map((shipment) => (
                <Link
                  key={shipment.id}
                  href={`/admin/shipments/${shipment.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--shift-black)] hover:bg-[var(--shift-black-soft)] transition-colors"
                >
                  <div>
                    <p className="text-[var(--shift-cream)] font-medium">
                      {shipment.manufacturer} {shipment.model}
                    </p>
                    <p className="text-[var(--shift-gray)] text-sm">
                      {shipment.ownerName}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    shipment.currentStatus?.isTransit
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-[var(--shift-yellow)]/20 text-[var(--shift-yellow)]"
                  }`}>
                    {shipment.currentStatus?.name || "No Status"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[var(--shift-gray)] text-center py-8">
              No shipments yet
            </p>
          )}
        </div>

        {/* Recent Leads */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--shift-cream)] uppercase">
              New Leads
            </h2>
            <Link
              href="/admin/leads"
              className="text-[var(--shift-yellow)] text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          {recentLeads.length > 0 ? (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--shift-black)]"
                >
                  <div>
                    <p className="text-[var(--shift-cream)] font-medium">
                      {lead.name}
                    </p>
                    <p className="text-[var(--shift-gray)] text-sm">
                      {lead.email}
                    </p>
                  </div>
                  <span className="text-[var(--shift-gray)] text-xs">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--shift-gray)] text-center py-8">
              No new leads
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
