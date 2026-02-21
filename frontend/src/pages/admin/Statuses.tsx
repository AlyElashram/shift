import { useState, useEffect } from 'react';
import { getStatuses, createStatus, updateStatus, deleteStatus, reorderStatuses } from '../../api/statuses';
import { getErrorMessage } from '../../api/client';
import { Modal, ConfirmModal } from '../../components/admin';
import { Input, Textarea } from '../../components/admin/forms';
import styles from '../../styles/pages/Statuses.module.css';

interface ShipmentStatus {
  id: string;
  name: string;
  description?: string;
  order: number;
  is_transit: boolean;
  notify_email: boolean;
  color?: string;
  _count?: { shipments: number };
}

export default function Statuses() {
  const [statuses, setStatuses] = useState<ShipmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ShipmentStatus | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isTransit, setIsTransit] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [color, setColor] = useState('');

  useEffect(() => {
    getStatuses().then(setStatuses).finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsTransit(false);
    setNotifyEmail(false);
    setColor('');
    setError('');
  };

  const openCreateModal = () => {
    resetForm();
    setEditingStatus(null);
    setShowModal(true);
  };

  const openEditModal = (status: ShipmentStatus) => {
    setEditingStatus(status);
    setName(status.name);
    setDescription(status.description || '');
    setIsTransit(status.is_transit);
    setNotifyEmail(status.notify_email);
    setColor(status.color || '');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    setError('');

    const data = {
      name,
      description: description || undefined,
      order: editingStatus?.order ?? statuses.length,
      is_transit: isTransit,
      notify_email: notifyEmail,
      color: color || undefined,
    };

    try {
      if (editingStatus) {
        await updateStatus(editingStatus.id, data);
      } else {
        await createStatus(data);
      }
      setShowModal(false);
      resetForm();
      const updated = await getStatuses();
      setStatuses(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await deleteStatus(deleteId);
      setStatuses((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  const moveStatus = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= statuses.length) return;

    const newStatuses = [...statuses];
    [newStatuses[index], newStatuses[newIndex]] = [newStatuses[newIndex], newStatuses[index]];
    setStatuses(newStatuses);

    await reorderStatuses(newStatuses.map((s) => s.id));
  };

  if (loading) {
    return <div className={styles.loading}>Loading statuses...</div>;
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Statuses</h1>
            <p className={styles.subtitle}>Manage shipment status pipeline</p>
          </div>
        </div>

        <div className="card">
          <div className={styles.toolbar}>
            <p className={styles.toolbarHint}>
              Use the arrows to reorder. The order determines the tracking timeline.
            </p>
            <button onClick={openCreateModal} className={styles.addButton}>
              <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Status
            </button>
          </div>

          {statuses.length > 0 ? (
            <div className={styles.statusList}>
              {statuses.map((status, index) => (
                <div key={status.id} className={styles.statusItem}>
                  <div className={styles.orderControls}>
                    <button
                      onClick={() => moveStatus(index, 'up')}
                      disabled={index === 0}
                      className={styles.orderButton}
                    >
                      <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveStatus(index, 'down')}
                      disabled={index === statuses.length - 1}
                      className={styles.orderButton}
                    >
                      <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <div className={styles.orderNumber}>{index + 1}</div>

                  <div className={styles.statusInfo}>
                    <div className={styles.statusNameRow}>
                      <span className={styles.statusName}>{status.name}</span>
                      {status.is_transit && <span className={styles.badgeTransit}>Transit</span>}
                      {status.notify_email && <span className={styles.badgeEmail}>Email</span>}
                    </div>
                    {status.description && (
                      <p className={styles.statusDescription}>{status.description}</p>
                    )}
                  </div>

                  <div className={styles.shipmentCount}>
                    {status._count?.shipments ?? 0} shipment{(status._count?.shipments ?? 0) !== 1 ? 's' : ''}
                  </div>

                  <div className={styles.actions}>
                    <button onClick={() => openEditModal(status)} className={styles.actionButton}>
                      <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteId(status.id)}
                      disabled={(status._count?.shipments ?? 0) > 0}
                      className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                      title={(status._count?.shipments ?? 0) > 0 ? 'Cannot delete: status is in use' : 'Delete'}
                    >
                      <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No statuses defined yet</p>
              <button onClick={openCreateModal} className={styles.emptyAction}>
                Create your first status
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingStatus ? 'Edit Status' : 'Create Status'}
        size="md"
        footer={
          <>
            <button onClick={() => setShowModal(false)} disabled={actionLoading} className={styles.modalCancel}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={actionLoading || !name} className={styles.modalConfirm}>
              {actionLoading ? 'Saving...' : editingStatus ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className={styles.modalBody}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., In Transit to Egypt" required />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description for this status..." rows={2} />

          <div className={styles.checkboxGrid}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={isTransit} onChange={(e) => setIsTransit(e.target.checked)} className={styles.checkbox} />
              <div>
                <p className={styles.checkboxTitle}>In Transit</p>
                <p className={styles.checkboxHint}>Show as moving status</p>
              </div>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className={styles.checkbox} />
              <div>
                <p className={styles.checkboxTitle}>Email Notify</p>
                <p className={styles.checkboxHint}>Send email on status change</p>
              </div>
            </label>
          </div>

          <Input label="Color (optional)" value={color} onChange={(e) => setColor(e.target.value)} placeholder="#FFD628" helperText="Hex color code for the status badge" />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Status"
        message="Are you sure you want to delete this status? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
      />
    </>
  );
}
