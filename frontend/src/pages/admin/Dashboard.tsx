import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getDashboard } from '../../api/dashboard';
import styles from '../../styles/pages/Dashboard.module.css';

interface DashboardData {
  stats: {
    shipment_count: number;
    lead_count: number;
    status_count: number;
  };
  recent_shipments: Array<{
    id: string;
    manufacturer: string;
    model: string;
    owner_name: string;
    current_status: { name: string; is_transit: boolean } | null;
  }>;
  recent_leads: Array<{
    id: string;
    name: string;
    email: string;
    created_at: string;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dashboard</h2>
        <p className={styles.subtitle}>Overview of your shipments and leads</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className="card">
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Total Shipments</p>
              <p className={styles.statValue}>{data?.stats?.shipment_count ?? 0}</p>
            </div>
            <div className={styles.statIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>New Leads</p>
              <p className={styles.statValue}>{data?.stats?.lead_count ?? 0}</p>
            </div>
            <div className={styles.statIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Statuses</p>
              <p className={styles.statValue}>{data?.stats?.status_count ?? 0}</p>
            </div>
            <div className={styles.statIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        <Link to="/admin/shipments/new" className={`card ${styles.quickAction}`}>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Quick Action</p>
              <p className={styles.statValueHighlight}>New Shipment</p>
            </div>
            <div className={styles.statIconHighlight}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className={styles.activityGrid}>
        {/* Recent Shipments */}
        <div className="card">
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Shipments</h3>
            <Link to="/admin/shipments" className={styles.viewAllLink}>View All</Link>
          </div>
          {data?.recent_shipments && data.recent_shipments.length > 0 ? (
            <div className={styles.activityList}>
              {data.recent_shipments.map((shipment) => (
                <Link
                  key={shipment.id}
                  to={`/admin/shipments/${shipment.id}`}
                  className={styles.activityItem}
                >
                  <div>
                    <p className={styles.activityItemTitle}>
                      {shipment.manufacturer} {shipment.model}
                    </p>
                    <p className={styles.activityItemSub}>{shipment.owner_name}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${shipment.current_status?.is_transit ? styles.statusTransit : styles.statusDefault}`}>
                    {shipment.current_status?.name || 'No Status'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No shipments yet</p>
          )}
        </div>

        {/* Recent Leads */}
        <div className="card">
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>New Leads</h3>
            <Link to="/admin/leads" className={styles.viewAllLink}>View All</Link>
          </div>
          {data?.recent_leads && data.recent_leads.length > 0 ? (
            <div className={styles.activityList}>
              {data.recent_leads.map((lead) => (
                <div key={lead.id} className={styles.activityItem}>
                  <div>
                    <p className={styles.activityItemTitle}>{lead.name}</p>
                    <p className={styles.activityItemSub}>{lead.email}</p>
                  </div>
                  <span className={styles.activityDate}>
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No new leads</p>
          )}
        </div>
      </div>
    </div>
  );
}
