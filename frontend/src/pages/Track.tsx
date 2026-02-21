import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getTracking } from '../api/tracking';
import { Logo } from '../components/ui/Logo';
import { ShipmentCard } from '../components/tracking/ShipmentCard';
import { TrackingTimeline } from '../components/tracking/TrackingTimeline';
import styles from '../styles/pages/Track.module.css';

export default function Track() {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!trackingId) return;
    getTracking(trackingId)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [trackingId]);

  if (loading) {
    return (
      <div className={`${styles.page} grain-overlay`}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading shipment...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`${styles.page} grain-overlay`}>
        <div className={styles.loadingContainer}>
          <h2 className={styles.errorTitle}>Shipment Not Found</h2>
          <p className={styles.errorText}>
            The tracking ID &quot;{trackingId}&quot; does not match any shipment.
          </p>
          <Link to="/" className={styles.errorLink}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { shipment, statuses } = data;

  return (
    <div className={`${styles.page} grain-overlay`}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/">
            <Logo variant="full" color="yellow" className={styles.headerLogo} />
          </Link>
          <span className={styles.headerLabel}>Shipment Tracking</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.shipmentCol}>
            <ShipmentCard
              shipment={shipment}
              currentStatus={shipment.current_status}
            />
          </div>

          <div className={styles.timelineCol}>
            <div className={styles.timelineCard}>
              <h2 className={styles.timelineTitle}>Tracking Progress</h2>
              <TrackingTimeline
                statuses={statuses}
                currentStatus={shipment.current_status}
                history={shipment.status_histories || []}
              />
            </div>
          </div>
        </div>

        {shipment.pictures && shipment.pictures.length > 1 && (
          <div className={styles.imagesSection}>
            <h3 className={styles.imagesTitle}>Vehicle Images</h3>
            <div className={styles.imagesGrid}>
              {shipment.pictures.slice(1).map((url: string, index: number) => (
                <div key={index} className={styles.imageCard}>
                  <img
                    src={url}
                    alt={`Vehicle image ${index + 2}`}
                    className={styles.imageThumb}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            Questions about your shipment?{' '}
            <Link to="/#contact" className={styles.footerLink}>
              Contact us
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
