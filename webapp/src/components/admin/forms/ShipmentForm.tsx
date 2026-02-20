"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Textarea } from "@/components/admin/forms";
import { createShipment, updateShipment } from "@/actions/shipments";
import type { ShipmentStatus } from "@prisma/client";

interface ShipmentFormProps {
  shipment?: {
    id: string;
    manufacturer: string;
    model: string;
    vin: string;
    year: number | null;
    color: string | null;
    pictures: string[];
    ownerName: string;
    ownerEmail: string | null;
    ownerPhone: string | null;
    notes: string | null;
    currentStatusId: string | null;
  };
  statuses: ShipmentStatus[];
}

export function ShipmentForm({ shipment, statuses }: ShipmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!shipment;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      manufacturer: formData.get("manufacturer") as string,
      model: formData.get("model") as string,
      vin: formData.get("vin") as string,
      year: formData.get("year") ? parseInt(formData.get("year") as string) : null,
      color: (formData.get("color") as string) || null,
      pictures: [], // TODO: Handle file uploads
      ownerName: formData.get("ownerName") as string,
      ownerEmail: (formData.get("ownerEmail") as string) || null,
      ownerPhone: (formData.get("ownerPhone") as string) || null,
      notes: (formData.get("notes") as string) || null,
      currentStatusId: (formData.get("currentStatusId") as string) || null,
    };

    try {
      const result = isEditing
        ? await updateShipment(shipment.id, data)
        : await createShipment(data);

      if (result.success) {
        if (isEditing) {
          router.push(`/admin/shipments/${shipment.id}`);
        } else if (result.data && "id" in result.data) {
          router.push(`/admin/shipments/${result.data.id}`);
        }
        router.refresh();
      } else {
        setErrors({ form: result.error });
      }
    } catch {
      setErrors({ form: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          {errors.form}
        </div>
      )}

      {/* Vehicle Information */}
      <div className="card">
        <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
          Vehicle Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            name="manufacturer"
            label="Manufacturer"
            placeholder="e.g., Toyota"
            defaultValue={shipment?.manufacturer}
            required
            error={errors.manufacturer}
          />
          <Input
            name="model"
            label="Model"
            placeholder="e.g., Land Cruiser"
            defaultValue={shipment?.model}
            required
            error={errors.model}
          />
          <Input
            name="vin"
            label="VIN"
            placeholder="Vehicle Identification Number"
            defaultValue={shipment?.vin}
            required
            error={errors.vin}
          />
          <Input
            name="year"
            label="Year"
            type="number"
            placeholder="e.g., 2024"
            defaultValue={shipment?.year?.toString()}
            error={errors.year}
          />
          <Input
            name="color"
            label="Color"
            placeholder="e.g., Black"
            defaultValue={shipment?.color ?? ""}
            error={errors.color}
          />
          <Select
            name="currentStatusId"
            label="Status"
            placeholder="Select status"
            defaultValue={shipment?.currentStatusId ?? ""}
            options={statuses.map((s) => ({ value: s.id, label: s.name }))}
          />
        </div>
      </div>

      {/* Owner Information */}
      <div className="card">
        <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
          Owner Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            name="ownerName"
            label="Owner Name"
            placeholder="Full name"
            defaultValue={shipment?.ownerName}
            required
            error={errors.ownerName}
          />
          <Input
            name="ownerEmail"
            label="Email"
            type="email"
            placeholder="owner@example.com"
            defaultValue={shipment?.ownerEmail ?? ""}
            error={errors.ownerEmail}
          />
          <Input
            name="ownerPhone"
            label="Phone"
            placeholder="+20 xxx xxx xxxx"
            defaultValue={shipment?.ownerPhone ?? ""}
            error={errors.ownerPhone}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <h3 className="text-lg font-bold text-[var(--shift-cream)] uppercase mb-4">
          Additional Notes
        </h3>
        <Textarea
          name="notes"
          placeholder="Any additional notes about this shipment..."
          defaultValue={shipment?.notes ?? ""}
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isEditing ? "Updating..." : "Creating..."}
            </span>
          ) : (
            isEditing ? "Update Shipment" : "Create Shipment"
          )}
        </button>
      </div>
    </form>
  );
}
