"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ConfirmModal, Input, Textarea } from "@/components/admin";
import { createStatus, updateStatus, deleteStatus, reorderStatuses } from "@/actions/statuses";
import type { ShipmentStatus } from "@prisma/client";

type StatusWithCount = ShipmentStatus & {
  _count: { shipments: number };
};

interface StatusesManagerProps {
  statuses: StatusWithCount[];
}

export function StatusesManager({ statuses: initialStatuses }: StatusesManagerProps) {
  const router = useRouter();
  const [statuses, setStatuses] = useState(initialStatuses);
  const [showModal, setShowModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<StatusWithCount | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isTransit, setIsTransit] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [color, setColor] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsTransit(false);
    setNotifyEmail(false);
    setColor("");
    setError("");
  };

  const openCreateModal = () => {
    resetForm();
    setEditingStatus(null);
    setShowModal(true);
  };

  const openEditModal = (status: StatusWithCount) => {
    setEditingStatus(status);
    setName(status.name);
    setDescription(status.description || "");
    setIsTransit(status.isTransit);
    setNotifyEmail(status.notifyEmail);
    setColor(status.color || "");
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const data = {
      name,
      description: description || null,
      order: editingStatus?.order || statuses.length,
      isTransit,
      notifyEmail,
      color: color || null,
    };

    try {
      const result = editingStatus
        ? await updateStatus(editingStatus.id, data)
        : await createStatus(data);

      if (result.success) {
        setShowModal(false);
        resetForm();
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const result = await deleteStatus(deleteId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const moveStatus = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= statuses.length) return;

    const newStatuses = [...statuses];
    [newStatuses[index], newStatuses[newIndex]] = [newStatuses[newIndex], newStatuses[index]];
    setStatuses(newStatuses);

    await reorderStatuses(newStatuses.map((s) => s.id));
    router.refresh();
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--shift-gray-light)]">
            Drag to reorder or use the arrows. The order determines the tracking timeline.
          </p>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Status
          </button>
        </div>

        {statuses.length > 0 ? (
          <div className="space-y-2">
            {statuses.map((status, index) => (
              <div
                key={status.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/20 hover:border-[var(--shift-gray)]/40 transition-colors"
              >
                {/* Order Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveStatus(index, "up")}
                    disabled={index === 0}
                    className="p-1 rounded text-[var(--shift-gray)] hover:text-[var(--shift-cream)] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveStatus(index, "down")}
                    disabled={index === statuses.length - 1}
                    className="p-1 rounded text-[var(--shift-gray)] hover:text-[var(--shift-cream)] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Order Number */}
                <div className="w-8 h-8 rounded-full bg-[var(--shift-yellow)]/20 text-[var(--shift-yellow)] flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                {/* Status Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--shift-cream)]">{status.name}</span>
                    {status.isTransit && (
                      <span className="px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-400">
                        Transit
                      </span>
                    )}
                    {status.notifyEmail && (
                      <span className="px-2 py-0.5 text-xs rounded bg-green-500/20 text-green-400">
                        Email
                      </span>
                    )}
                  </div>
                  {status.description && (
                    <p className="text-sm text-[var(--shift-gray)] mt-0.5">{status.description}</p>
                  )}
                </div>

                {/* Shipment Count */}
                <div className="text-sm text-[var(--shift-gray)]">
                  {status._count.shipments} shipment{status._count.shipments !== 1 ? "s" : ""}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(status)}
                    className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black-muted)] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteId(status.id)}
                    disabled={status._count.shipments > 0}
                    className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-red-400 hover:bg-[var(--shift-black-muted)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={status._count.shipments > 0 ? "Cannot delete: status is in use" : "Delete"}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[var(--shift-gray)]">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p>No statuses defined yet</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-[var(--shift-yellow)] hover:underline"
            >
              Create your first status
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingStatus ? "Edit Status" : "Create Status"}
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowModal(false)}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !name}
              className="px-4 py-2 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : editingStatus ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., In Transit to Egypt"
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description for this status..."
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/30 cursor-pointer hover:border-[var(--shift-gray)] transition-colors">
              <input
                type="checkbox"
                checked={isTransit}
                onChange={(e) => setIsTransit(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--shift-gray)] text-[var(--shift-yellow)] focus:ring-[var(--shift-yellow)]"
              />
              <div>
                <p className="text-[var(--shift-cream)] text-sm font-medium">In Transit</p>
                <p className="text-[var(--shift-gray)] text-xs">Show as moving status</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/30 cursor-pointer hover:border-[var(--shift-gray)] transition-colors">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--shift-gray)] text-[var(--shift-yellow)] focus:ring-[var(--shift-yellow)]"
              />
              <div>
                <p className="text-[var(--shift-cream)] text-sm font-medium">Email Notify</p>
                <p className="text-[var(--shift-gray)] text-xs">Send email on status change</p>
              </div>
            </label>
          </div>

          <Input
            label="Color (optional)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#FFD628"
            helperText="Hex color code for the status badge"
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Status"
        message="Are you sure you want to delete this status? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />
    </>
  );
}
