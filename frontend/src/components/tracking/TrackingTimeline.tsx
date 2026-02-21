import styles from '../../styles/components/TrackingTimeline.module.css';

type ShipmentStatus = {
  id: string;
  name: string;
  description?: string;
  order: number;
  is_transit: boolean;
  notify_email: boolean;
  color?: string;
};

type ShipmentStatusHistory = {
  id: string;
  shipment_id: string;
  status_id: string;
  changed_at: string;
  notes?: string;
  status: ShipmentStatus;
  changed_by?: { name: string };
};

interface TrackingTimelineProps {
  statuses: ShipmentStatus[];
  currentStatus: ShipmentStatus | null;
  history: ShipmentStatusHistory[];
}

export function TrackingTimeline({ statuses, currentStatus, history }: TrackingTimelineProps) {
  const currentIndex = currentStatus
    ? statuses.findIndex(s => s.id === currentStatus.id)
    : -1;

  const getHistoryForStatus = (statusId: string) => {
    return history.find(h => h.status_id === statusId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.lineBackground} />

      {currentIndex >= 0 && (
        <div
          className={styles.lineFilled}
          style={{ height: `calc(${(currentIndex / (statuses.length - 1)) * 100}% + 16px)` }}
        />
      )}

      <div className={styles.steps}>
        {statuses.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = status.id === currentStatus?.id;
          const historyItem = getHistoryForStatus(status.id);

          return (
            <div key={status.id} className={styles.step}>
              <div
                className={`${styles.circle} ${
                  isCompleted ? styles.circleCompleted : styles.circleIncomplete
                } ${isCurrent ? styles.circleCurrent : ''}`}
              >
                {isCompleted ? (
                  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className={styles.dotIncomplete} />
                )}
              </div>

              <div className={`${styles.content} ${!isCompleted ? styles.contentDimmed : ''}`}>
                <div className={styles.titleRow}>
                  <h3 className={isCompleted ? styles.titleCompleted : styles.titleIncomplete}>
                    {status.name}
                  </h3>
                  {status.is_transit && isCompleted && isCurrent && (
                    <span className={styles.transitBadge}>
                      In Transit
                    </span>
                  )}
                </div>
                {status.description && (
                  <p className={styles.description}>
                    {status.description}
                  </p>
                )}
                {historyItem && (
                  <p className={styles.date}>
                    {new Date(historyItem.changed_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
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
