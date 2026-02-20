import type { ShipmentStatus, ShipmentStatusHistory } from "@prisma/client";

type HistoryWithStatus = ShipmentStatusHistory & {
  status: ShipmentStatus;
};

interface TrackingTimelineProps {
  statuses: ShipmentStatus[];
  currentStatus: ShipmentStatus | null;
  history: HistoryWithStatus[];
}

export function TrackingTimeline({ statuses, currentStatus, history }: TrackingTimelineProps) {
  const currentIndex = currentStatus
    ? statuses.findIndex(s => s.id === currentStatus.id)
    : -1;

  const getHistoryForStatus = (statusId: string) => {
    return history.find(h => h.statusId === statusId);
  };

  return (
    <div className="relative">
      {/* Progress Line Background */}
      <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-[var(--shift-gray)]/30" />

      {/* Progress Line Filled */}
      {currentIndex >= 0 && (
        <div
          className="absolute left-[15px] top-0 w-[2px] bg-[var(--shift-yellow)] transition-all duration-500"
          style={{ height: `calc(${(currentIndex / (statuses.length - 1)) * 100}% + 16px)` }}
        />
      )}

      {/* Status Steps */}
      <div className="space-y-6">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = status.id === currentStatus?.id;
          const historyItem = getHistoryForStatus(status.id);

          return (
            <div key={status.id} className="relative flex gap-4">
              {/* Circle */}
              <div className={`
                relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0
                transition-all duration-300
                ${isCompleted
                  ? "bg-[var(--shift-yellow)]"
                  : "bg-[var(--shift-black-muted)] border-2 border-[var(--shift-gray)]/50"
                }
                ${isCurrent ? "ring-4 ring-[var(--shift-yellow)]/30" : ""}
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4 text-[var(--shift-black)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[var(--shift-gray)]/50" />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-2 ${!isCompleted ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold ${isCompleted ? "text-[var(--shift-cream)]" : "text-[var(--shift-gray)]"}`}>
                    {status.name}
                  </h3>
                  {status.isTransit && isCompleted && isCurrent && (
                    <span className="px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-400 animate-pulse">
                      In Transit
                    </span>
                  )}
                </div>
                {status.description && (
                  <p className="text-sm text-[var(--shift-gray)] mt-0.5">
                    {status.description}
                  </p>
                )}
                {historyItem && (
                  <p className="text-sm text-[var(--shift-gray-light)] mt-1">
                    {new Date(historyItem.changedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
