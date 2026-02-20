"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/admin";
import { markLeadContacted, markLeadUncontacted, deleteLead, deleteMultipleLeads } from "@/actions/leads";
import type { Lead } from "@prisma/client";

interface LeadsManagerProps {
  leads: Lead[];
}

const documentStatusLabels: Record<string, { label: string; color: string }> = {
  "non-egyptian-passport": { label: "Non-Egyptian Passport", color: "bg-blue-500/20 text-blue-400" },
  "uae-eqama": { label: "UAE Eqama", color: "bg-green-500/20 text-green-400" },
  "none": { label: "None", color: "bg-[var(--shift-gray)]/20 text-[var(--shift-gray)]" },
};

export function LeadsManager({ leads: initialLeads }: LeadsManagerProps) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "contacted">("all");

  const filteredLeads = leads.filter((lead) => {
    if (filter === "pending") return !lead.contacted;
    if (filter === "contacted") return lead.contacted;
    return true;
  });

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const handleToggleContacted = async (lead: Lead) => {
    setLoading(true);
    try {
      const result = lead.contacted
        ? await markLeadUncontacted(lead.id)
        : await markLeadContacted(lead.id);
      if (result.success) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const result = await deleteLead(deleteId);
      if (result.success) {
        router.refresh();
      }
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setLoading(true);
    try {
      const result = await deleteMultipleLeads(Array.from(selectedIds));
      if (result.success) {
        setSelectedIds(new Set());
        router.refresh();
      }
    } finally {
      setLoading(false);
      setShowBulkDelete(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(["all", "pending", "contacted"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-[var(--shift-yellow)] text-[var(--shift-black)]"
                    : "text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)]"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <button
              onClick={() => setShowBulkDelete(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete {selectedIds.size} Selected
            </button>
          )}
        </div>

        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[var(--shift-gray)] border-b border-[var(--shift-gray)]/20">
                  <th className="pb-3 pr-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredLeads.length && filteredLeads.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-[var(--shift-gray)] text-[var(--shift-yellow)] focus:ring-[var(--shift-yellow)]"
                    />
                  </th>
                  <th className="pb-3 pr-4">Contact</th>
                  <th className="pb-3 pr-4">Document Status</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--shift-gray)]/20">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[var(--shift-black)]/50">
                    <td className="py-4 pr-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                        className="w-4 h-4 rounded border-[var(--shift-gray)] text-[var(--shift-yellow)] focus:ring-[var(--shift-yellow)]"
                      />
                    </td>
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-medium text-[var(--shift-cream)]">{lead.name}</p>
                        <p className="text-sm text-[var(--shift-gray)]">{lead.email}</p>
                        <p className="text-sm text-[var(--shift-gray)]">{lead.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2 py-1 text-xs rounded ${documentStatusLabels[lead.documentStatus]?.color || "bg-gray-500/20 text-gray-400"}`}>
                        {documentStatusLabels[lead.documentStatus]?.label || lead.documentStatus}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-sm text-[var(--shift-gray-light)]">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="py-4 pr-4">
                      <button
                        onClick={() => handleToggleContacted(lead)}
                        disabled={loading}
                        className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                          lead.contacted
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-[var(--shift-yellow)]/20 text-[var(--shift-yellow)] hover:bg-[var(--shift-yellow)]/30"
                        }`}
                      >
                        {lead.contacted ? "Contacted" : "Mark Contacted"}
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
                          title="Send Email"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
                          title="Call"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => setDeleteId(lead.id)}
                          className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-red-400 hover:bg-[var(--shift-black)] transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-[var(--shift-gray)]">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No leads found</p>
            <p className="text-sm mt-1">Leads will appear here when users submit the contact form</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmModal
        isOpen={showBulkDelete}
        onClose={() => setShowBulkDelete(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Leads"
        message={`Are you sure you want to delete ${selectedIds.size} selected leads? This action cannot be undone.`}
        confirmText="Delete All"
        variant="danger"
        loading={loading}
      />
    </>
  );
}
