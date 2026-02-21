import styles from '../../styles/components/ShipmentCard.module.css';

type ShipmentStatus = {
  id: string;
  name: string;
  description?: string;
  order: number;
  is_transit: boolean;
  notify_email: boolean;
  color?: string;
};

interface ShipmentCardProps {
  shipment: {
    manufacturer: string;
    model: string;
    vin: string;
    year: number | null;
    color: string | null;
    owner_name: string;
    pictures: string[];
  };
  currentStatus: ShipmentStatus | null;
}

export function ShipmentCard({ shipment, currentStatus }: ShipmentCardProps) {
  return (
    <div className={styles.card}>
      {shipment.pictures.length > 0 && (
        <div className={styles.imageContainer}>
          <img
            src={shipment.pictures[0]}
            alt={`${shipment.manufacturer} ${shipment.model}`}
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.info}>
        <div>
          <h2 className={styles.vehicleName}>
            {shipment.manufacturer} {shipment.model}
          </h2>
          {shipment.year && (
            <p className={styles.year}>{shipment.year}</p>
          )}
        </div>

        {currentStatus && (
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Status:</span>
            <span
              className={`${styles.statusBadge} ${
                currentStatus.is_transit ? styles.statusTransit : styles.statusDefault
              }`}
            >
              {currentStatus.is_transit && (
                <span className={styles.pulseContainer}>
                  <span className={styles.pulsePing} />
                  <span className={styles.pulseDot} />
                </span>
              )}
              {currentStatus.name}
            </span>
          </div>
        )}

        <dl className={styles.details}>
          <div>
            <dt className={styles.detailLabel}>VIN</dt>
            <dd className={styles.detailValueMono}>{shipment.vin}</dd>
          </div>
          {shipment.color && (
            <div>
              <dt className={styles.detailLabel}>Color</dt>
              <dd className={styles.detailValue}>{shipment.color}</dd>
            </div>
          )}
          <div className={styles.detailFullWidth}>
            <dt className={styles.detailLabel}>Owner</dt>
            <dd className={styles.detailValue}>{shipment.owner_name}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
