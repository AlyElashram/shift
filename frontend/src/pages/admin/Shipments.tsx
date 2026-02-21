import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { getShipments, deleteShipment } from '../../api/shipments';
import { getStatuses } from '../../api/statuses';
import { DataTable, ConfirmModal } from '../../components/admin';
import styles from '../../styles/pages/Shipments.module.css';

interface ShipmentStatus {
  id: string;
  name: string;
  is_transit: boolean;
}

interface Shipment {
  id: string;
  manufacturer: string;
  model: string;
  vin: string;
  owner_name: string;
  owner_email?: string;
  current_status_id?: string;
  current_status: ShipmentStatus | null;
  created_at: string;
}

export default function Shipments() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [statuses, setStatuses] = useState<ShipmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    Promise.all([getShipments(), getStatuses()])
      .then(([s, st]) => {
        setShipments(s);
        setStatuses(st);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredShipments = statusFilter
    ? shipments.filter((s) => s.current_status_id === statusFilter)
    : shipments;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteShipment(deleteId);
      setShipments((prev) => prev.filter((s) => s.id !== deleteId));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading shipments...</div>;
  }

  const columns = [
    {
      key: 'vehicle',
      header: 'Vehicle',
      sortable: true,
      render: (item: Shipment) => (
        <div>
          <p className={styles.cellPrimary}>{item.manufacturer} {item.model}</p>
          <p className={styles.cellSecondary}>{item.vin}</p>
        </div>
      ),
    },
    {
      key: 'owner_name',
      header: 'Owner',
      sortable: true,
      render: (item: Shipment) => (
        <div>
          <p>{item.owner_name}</p>
          {item.owner_email && (
            <p className={styles.cellSecondary}>{item.owner_email}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Shipment) => (
        <span className={`${styles.statusBadge} ${
          item.current_status?.is_transit
            ? styles.statusTransit
            : item.current_status
            ? styles.statusDefault
            : styles.statusNone
        }`}>
          {item.current_status?.name || 'No Status'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (item: Shipment) => (
        <span className={styles.cellSecondary}>
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Shipments</h1>
          <p className={styles.subtitle}>Manage all car shipments</p>
        </div>
        <Link to="/admin/shipments/new" className={styles.newButton}>
          <svg className={styles.newButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Shipment
        </Link>
      </div>

      <div className={styles.filterRow}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>{status.name}</option>
          ))}
        </select>
      </div>

      <DataTable
        data={filteredShipments}
        columns={columns}
        searchKeys={['vin', 'manufacturer', 'model', 'owner_name']}
        searchPlaceholder="Search by VIN, vehicle, or owner..."
        rowHref={(item) => `/admin/shipments/${item.id}`}
        emptyMessage="No shipments found"
        actions={(item) => (
          <div className={styles.actions}>
            <button
              onClick={() => navigate(`/admin/shipments/${item.id}/edit`)}
              className={styles.actionButton}
            >
              <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setDeleteId(item.id)}
              className={`${styles.actionButton} ${styles.actionButtonDanger}`}
            >
              <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Shipment"
        message="Are you sure you want to delete this shipment? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
