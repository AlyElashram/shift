import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { LeadsManager } from "./LeadsManager";

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: leads.length,
    contacted: leads.filter((l) => l.contacted).length,
    pending: leads.filter((l) => !l.contacted).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
          Leads
        </h1>
        <p className="text-[var(--shift-gray-light)]">
          Manage contact form submissions and follow-ups
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-[var(--shift-gray)]">Total Leads</p>
          <p className="text-2xl font-bold text-[var(--shift-cream)]">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--shift-gray)]">Pending</p>
          <p className="text-2xl font-bold text-[var(--shift-yellow)]">{stats.pending}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--shift-gray)]">Contacted</p>
          <p className="text-2xl font-bold text-green-400">{stats.contacted}</p>
        </div>
      </div>

      <LeadsManager leads={leads} />
    </div>
  );
}
