"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ConfirmModal, Input } from "@/components/admin";
import {
  createShowcaseCar,
  updateShowcaseCar,
  deleteShowcaseCar,
  toggleShowcaseCarActive,
  reorderShowcaseCars,
} from "@/actions/showcase";
import type { CarShowcase } from "@prisma/client";

interface ShowcaseManagerProps {
  cars: CarShowcase[];
}

export function ShowcaseManager({ cars: initialCars }: ShowcaseManagerProps) {
  const router = useRouter();
  const [cars, setCars] = useState(initialCars);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarShowcase | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [origin, setOrigin] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setImage("");
    setModel("");
    setYear("");
    setOrigin("");
    setIsActive(true);
    setError("");
  };

  const openCreateModal = () => {
    resetForm();
    setEditingCar(null);
    setShowModal(true);
  };

  const openEditModal = (car: CarShowcase) => {
    setEditingCar(car);
    setImage(car.image);
    setModel(car.model);
    setYear(car.year);
    setOrigin(car.origin);
    setIsActive(car.isActive);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const data = {
      image,
      model,
      year,
      origin,
      order: editingCar?.order || cars.length,
      isActive,
    };

    try {
      const result = editingCar
        ? await updateShowcaseCar(editingCar.id, data)
        : await createShowcaseCar(data);

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
      const result = await deleteShowcaseCar(deleteId);
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

  const handleToggleActive = async (id: string) => {
    setLoading(true);
    try {
      const result = await toggleShowcaseCarActive(id);
      if (result.success) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const moveCar = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= cars.length) return;

    const newCars = [...cars];
    [newCars[index], newCars[newIndex]] = [newCars[newIndex], newCars[index]];
    setCars(newCars);

    await reorderShowcaseCars(newCars.map((c) => c.id));
    router.refresh();
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--shift-gray-light)]">
            Add cars to showcase on the homepage gallery. Drag to reorder.
          </p>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Car
          </button>
        </div>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car, index) => (
              <div
                key={car.id}
                className={`relative rounded-lg overflow-hidden border transition-all ${
                  car.isActive
                    ? "border-[var(--shift-gray)]/20 hover:border-[var(--shift-gray)]/40"
                    : "border-red-500/30 opacity-60"
                }`}
              >
                {/* Image */}
                <div className="aspect-video bg-[var(--shift-black)] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={car.image}
                    alt={`${car.model} ${car.year}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Order Controls */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <button
                      onClick={() => moveCar(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded bg-black/70 text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveCar(index, "down")}
                      disabled={index === cars.length - 1}
                      className="p-1.5 rounded bg-black/70 text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Active Badge */}
                  {!car.isActive && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-red-500/80 text-white text-xs font-medium">
                      Hidden
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 bg-[var(--shift-black-muted)]">
                  <h3 className="font-medium text-[var(--shift-cream)]">{car.model}</h3>
                  <p className="text-sm text-[var(--shift-gray)]">
                    {car.year} &bull; {car.origin}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--shift-gray)]/20">
                    <button
                      onClick={() => handleToggleActive(car.id)}
                      disabled={loading}
                      className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        car.isActive
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-[var(--shift-yellow)]/20 text-[var(--shift-yellow)] hover:bg-[var(--shift-yellow)]/30"
                      }`}
                    >
                      {car.isActive ? "Active" : "Show"}
                    </button>
                    <button
                      onClick={() => openEditModal(car)}
                      className="p-1.5 rounded text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteId(car.id)}
                      className="p-1.5 rounded text-[var(--shift-gray-light)] hover:text-red-400 hover:bg-[var(--shift-black)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[var(--shift-gray)]">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No cars in showcase yet</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-[var(--shift-yellow)] hover:underline"
            >
              Add your first car
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
        title={editingCar ? "Edit Car" : "Add Car"}
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
              disabled={loading || !image || !model || !year || !origin}
              className="px-4 py-2 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : editingCar ? "Update" : "Add"}
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
            label="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/car-image.jpg"
            required
          />

          {image && (
            <div className="aspect-video rounded-lg overflow-hidden bg-[var(--shift-black)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <Input
            label="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g., Land Cruiser VXR"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2024"
              required
            />

            <Input
              label="Origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g., UAE"
              required
            />
          </div>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/30 cursor-pointer hover:border-[var(--shift-gray)] transition-colors">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--shift-gray)] text-[var(--shift-yellow)] focus:ring-[var(--shift-yellow)]"
            />
            <div>
              <p className="text-[var(--shift-cream)] text-sm font-medium">Show on Website</p>
              <p className="text-[var(--shift-gray)] text-xs">Display this car in the homepage gallery</p>
            </div>
          </label>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Car"
        message="Are you sure you want to remove this car from the showcase? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />
    </>
  );
}
