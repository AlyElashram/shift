import type { ShipmentStatus } from "@prisma/client";

interface ShipmentCardProps {
  shipment: {
    manufacturer: string;
    model: string;
    vin: string;
    year: number | null;
    color: string | null;
    ownerName: string;
    pictures: string[];
  };
  currentStatus: ShipmentStatus | null;
}

export function ShipmentCard({ shipment, currentStatus }: ShipmentCardProps) {
  return (
    <div className="card overflow-hidden">
      {/* Vehicle Image */}
      {shipment.pictures.length > 0 && (
        <div className="aspect-video -mx-6 -mt-6 mb-6 bg-[var(--shift-black)]">
          <img
            src={shipment.pictures[0]}
            alt={`${shipment.manufacturer} ${shipment.model}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Vehicle Info */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
            {shipment.manufacturer} {shipment.model}
          </h2>
          {shipment.year && (
            <p className="text-[var(--shift-gray-light)]">{shipment.year}</p>
          )}
        </div>

        {/* Current Status Badge */}
        {currentStatus && (
          <div className="flex items-center gap-2">
            <span className="text-[var(--shift-gray)]">Status:</span>
            <span className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
              ${currentStatus.isTransit
                ? "bg-blue-500/20 text-blue-400"
                : "bg-[var(--shift-yellow)]/20 text-[var(--shift-yellow)]"
              }
            `}>
              {currentStatus.isTransit && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                </span>
              )}
              {currentStatus.name}
            </span>
          </div>
        )}

        {/* Details */}
        <dl className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--shift-gray)]/20">
          <div>
            <dt className="text-xs uppercase tracking-wider text-[var(--shift-gray)]">VIN</dt>
            <dd className="text-[var(--shift-cream)] font-mono text-sm mt-0.5">{shipment.vin}</dd>
          </div>
          {shipment.color && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--shift-gray)]">Color</dt>
              <dd className="text-[var(--shift-cream)] text-sm mt-0.5">{shipment.color}</dd>
            </div>
          )}
          <div className="col-span-2">
            <dt className="text-xs uppercase tracking-wider text-[var(--shift-gray)]">Owner</dt>
            <dd className="text-[var(--shift-cream)] text-sm mt-0.5">{shipment.ownerName}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
