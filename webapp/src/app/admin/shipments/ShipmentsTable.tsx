"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataTable, ConfirmModal } from "@/components/admin";
import { deleteShipment } from "@/actions/shipments";
import type { Shipment, ShipmentStatus } from "@prisma/client";

type ShipmentWithStatus = Shipment & {
  currentStatus: ShipmentStatus | null;
};

interface ShipmentsTableProps {
  shipments: ShipmentWithStatus[];
  statuses: ShipmentStatus[];
}

export function ShipmentsTable({ shipments, statuses }: ShipmentsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filteredShipments = statusFilter
    ? shipments.filter((s) => s.currentStatusId === statusFilter)
    : shipments;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deleteShipment(deleteId);
      if (result.success) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "vehicle",
      header: "Vehicle",
      sortable: true,
      render: (item: ShipmentWithStatus) => (
        <div>
          <p className="font-medium">
            {item.manufacturer} {item.model}
          </p>
          <p className="text-sm text-[var(--shift-gray)]">{item.vin}</p>
        </div>
      ),
    },
    {
      key: "ownerName",
      header: "Owner",
      sortable: true,
      render: (item: ShipmentWithStatus) => (
        <div>
          <p>{item.ownerName}</p>
          {item.ownerEmail && (
            <p className="text-sm text-[var(--shift-gray)]">{item.ownerEmail}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: ShipmentWithStatus) => (
        <span
          className={`inline-flex px-2 py-1 text-xs rounded ${
            item.currentStatus?.isTransit
              ? "bg-blue-500/20 text-blue-400"
              : item.currentStatus
              ? "bg-[var(--shift-yellow)]/20 text-[var(--shift-yellow)]"
              : "bg-[var(--shift-gray)]/20 text-[var(--shift-gray)]"
          }`}
        >
          {item.currentStatus?.name || "No Status"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (item: ShipmentWithStatus) => (
        <span className="text-[var(--shift-gray-light)]">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/50 text-[var(--shift-cream)] focus:outline-none focus:border-[var(--shift-yellow)] transition-colors"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        data={filteredShipments}
        columns={columns}
        searchKeys={["vin", "manufacturer", "model", "ownerName"]}
        searchPlaceholder="Search by VIN, vehicle, or owner..."
        rowHref={(item) => `/admin/shipments/${item.id}`}
        emptyMessage="No shipments found"
        actions={(item) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/shipments/${item.id}/edit`}
              className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => setDeleteId(item.id)}
              className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-red-400 hover:bg-[var(--shift-black)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Shipment"
        message="Are you sure you want to delete this shipment? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
