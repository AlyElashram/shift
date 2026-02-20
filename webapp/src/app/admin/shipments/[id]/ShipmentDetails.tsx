"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Select } from "@/components/admin";
import { updateShipmentStatus } from "@/actions/shipments";
import type { Shipment, ShipmentStatus, ShipmentStatusHistory, User, Customer } from "@prisma/client";

type ShipmentWithRelations = Shipment & {
  currentStatus: ShipmentStatus | null;
  statusHistory: (ShipmentStatusHistory & {
    status: ShipmentStatus;
    changedBy: { name: string } | null;
  })[];
  customer: Customer | null;
  createdBy: { name: string } | null;
};

interface ShipmentDetailsProps {
  shipment: ShipmentWithRelations;
  statuses: ShipmentStatus[];
  trackingUrl: string;
}

export function ShipmentDetails({ shipment, statuses, trackingUrl }: ShipmentDetailsProps) {
  const router = useRouter();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    setUpdating(true);
    try {
      const result = await updateShipmentStatus(shipment.id, {
        statusId: selectedStatus,
        notes: statusNotes || null,
      });
      if (result.success) {
        setShowStatusModal(false);
        setSelectedStatus("");
        setStatusNotes("");
        router.refresh();
      }
    } finally {
      setUpdating(false);
    }
  };

  const copyTrackingLink = async () => {
    await navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Card */}
          <div className="card">
            <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
              Vehicle Information
            </h3>
            <dl className="grid sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-[var(--shift-gray)]">Manufacturer</dt>
                <dd className="text-[var(--shift-cream)]">{shipment.manufacturer}</dd>
              </div>
              <div>
                <dt className="text-sm text-[var(--shift-gray)]">Model</dt>
                <dd className="text-[var(--shift-cream)]">{shipment.model}</dd>
              </div>
              <div>
                <dt className="text-sm text-[var(--shift-gray)]">VIN</dt>
                <dd className="text-[var(--shift-cream)] font-mono">{shipment.vin}</dd>
              </div>
              <div>
                <dt className="text-sm text-[var(--shift-gray)]">Year</dt>
                <dd className="text-[var(--shift-cream)]">{shipment.year || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-[var(--shift-gray)]">Color</dt>
                <dd className="text-[var(--shift-cream)]">{shipment.color || "—"}</dd>
              </div>
            </dl>
          </div>

          {/* Owner Card */}
          <div className="card">
            <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
              Owner Information
            </h3>
            <dl className="grid sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-[var(--shift-gray)]">Name</dt>
                <dd className="text-[var(--shift-cream)]">{shipment.ownerName}</dd>
              </div>
              <div>
                <dt className="text-sm text-[var(--shift-gray)]">Email</dt>
                <dd className="text-[var(--shift-cream)]">
                  {shipment.ownerEmail ? (
                    <a href={`mailto:${shipment.ownerEmail}`} className="hover:text-[var(--shift-yellow)]">
                      {shipment.ownerEmail}
                    </a>
                  ) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-[var(--shift-gray)]">Phone</dt>
                <dd className="text-[var(--shift-cream)]">
                  {shipment.ownerPhone ? (
                    <a href={`tel:${shipment.ownerPhone}`} className="hover:text-[var(--shift-yellow)]">
                      {shipment.ownerPhone}
                    </a>
                  ) : "—"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Notes Card */}
          {shipment.notes && (
            <div className="card">
              <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
                Notes
              </h3>
              <p className="text-[var(--shift-gray-light)] whitespace-pre-wrap">
                {shipment.notes}
              </p>
            </div>
          )}

          {/* Status History */}
          <div className="card">
            <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
              Status History
            </h3>
            {shipment.statusHistory.length > 0 ? (
              <div className="space-y-4">
                {shipment.statusHistory.map((history, index) => (
                  <div
                    key={history.id}
                    className={`relative pl-6 ${index !== shipment.statusHistory.length - 1 ? "pb-4 border-l border-[var(--shift-gray)]/30" : ""}`}
                  >
                    <div className={`absolute left-0 -translate-x-1/2 w-3 h-3 rounded-full ${
                      index === 0 ? "bg-[var(--shift-yellow)]" : "bg-[var(--shift-gray)]"
                    }`} />
                    <div>
                      <p className="font-medium text-[var(--shift-cream)]">
                        {history.status.name}
                      </p>
                      <p className="text-sm text-[var(--shift-gray)]">
                        {new Date(history.changedAt).toLocaleString()}
                        {history.changedBy && ` by ${history.changedBy.name}`}
                      </p>
                      {history.notes && (
                        <p className="text-sm text-[var(--shift-gray-light)] mt-1">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--shift-gray)]">No status history</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Status */}
          <div className="card">
            <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
              Current Status
            </h3>
            <div className="space-y-4">
              <span
                className={`inline-flex px-3 py-1.5 text-sm rounded-lg ${
                  shipment.currentStatus?.isTransit
                    ? "bg-blue-500/20 text-blue-400"
                    : shipment.currentStatus
                    ? "bg-[var(--shift-yellow)]/20 text-[var(--shift-yellow)]"
                    : "bg-[var(--shift-gray)]/20 text-[var(--shift-gray)]"
                }`}
              >
                {shipment.currentStatus?.name || "No Status"}
              </span>
              <button
                onClick={() => setShowStatusModal(true)}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>

          {/* Tracking Link */}
          <div className="card">
            <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
              Tracking Link
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-[var(--shift-gray)]">
                Share this link with the owner to track their shipment:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={trackingUrl}
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/50 text-[var(--shift-cream)] truncate"
                />
                <button
                  onClick={copyTrackingLink}
                  className="p-2 rounded-lg border border-[var(--shift-gray)]/50 text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:border-[var(--shift-yellow)] transition-colors"
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--shift-yellow)] hover:underline"
              >
                View tracking page
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Metadata */}
          <div className="card">
            <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
              Details
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--shift-gray)]">Created</dt>
                <dd className="text-[var(--shift-cream)]">
                  {new Date(shipment.createdAt).toLocaleDateString()}
                </dd>
              </div>
              {shipment.createdBy && (
                <div className="flex justify-between">
                  <dt className="text-[var(--shift-gray)]">Created By</dt>
                  <dd className="text-[var(--shift-cream)]">{shipment.createdBy.name}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-[var(--shift-gray)]">Tracking ID</dt>
                <dd className="text-[var(--shift-cream)] font-mono text-xs">
                  {shipment.trackingId}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedStatus("");
          setStatusNotes("");
        }}
        title="Update Status"
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowStatusModal(false)}
              disabled={updating}
              className="px-4 py-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || !selectedStatus}
              className="px-4 py-2 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="New Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            placeholder="Select a status"
            options={statuses.map((s) => ({ value: s.id, label: s.name }))}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--shift-gray-light)]">
              Notes (optional)
            </label>
            <textarea
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="Add any notes about this status change..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/50 text-[var(--shift-cream)] placeholder:text-[var(--shift-gray)] focus:outline-none focus:border-[var(--shift-yellow)] transition-colors resize-none"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
