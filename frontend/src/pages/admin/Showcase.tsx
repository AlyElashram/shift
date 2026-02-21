import { useState, useEffect } from 'react';
import { getShowcases as getShowcaseCars, createShowcase as createShowcaseCar, updateShowcase as updateShowcaseCar, deleteShowcase as deleteShowcaseCar, toggleShowcaseActive as toggleShowcaseCarActive, reorderShowcases as reorderShowcaseCars } from '../../api/showcases';
import { getErrorMessage } from '../../api/client';
import { Modal, ConfirmModal } from '../../components/admin';
import { Input } from '../../components/admin/forms';
import styles from '../../styles/pages/Showcase.module.css';

interface CarShowcase {
  id: string;
  image: string;
  model: string;
  year: string;
  origin: string;
  order: number;
  is_active: boolean;
}

export default function Showcase() {
  const [cars, setCars] = useState<CarShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarShowcase | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const [image, setImage] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [origin, setOrigin] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    getShowcaseCars().then(setCars).finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setImage('');
    setModel('');
    setYear('');
    setOrigin('');
    setIsActive(true);
    setError('');
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
    setIsActive(car.is_active);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    setError('');

    const data = {
      image,
      model,
      year,
      origin,
      order: editingCar?.order ?? cars.length,
      is_active: isActive,
    };

    try {
      if (editingCar) {
        await updateShowcaseCar(editingCar.id, data);
      } else {
        await createShowcaseCar(data);
      }
      setShowModal(false);
      resetForm();
      const updated = await getShowcaseCars();
      setCars(updated);
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
      await deleteShowcaseCar(deleteId);
      setCars((prev) => prev.filter((c) => c.id !== deleteId));
    } finally {
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id: string) => {
    setActionLoading(true);
    try {
      await toggleShowcaseCarActive(id);
      setCars((prev) =>
        prev.map((c) => c.id === id ? { ...c, is_active: !c.is_active } : c)
      );
    } finally {
      setActionLoading(false);
    }
  };

  const moveCar = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= cars.length) return;

    const newCars = [...cars];
    [newCars[index], newCars[newIndex]] = [newCars[newIndex], newCars[index]];
    setCars(newCars);

    await reorderShowcaseCars(newCars.map((c) => c.id));
  };

  if (loading) {
    return <div className={styles.loading}>Loading showcase...</div>;
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Showcase</h1>
            <p className={styles.subtitle}>Manage homepage car gallery</p>
          </div>
        </div>

        <div className="card">
          <div className={styles.toolbar}>
            <p className={styles.toolbarHint}>
              Add cars to showcase on the homepage gallery. Use arrows to reorder.
            </p>
            <button onClick={openCreateModal} className={styles.addButton}>
              <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Car
            </button>
          </div>

          {cars.length > 0 ? (
            <div className={styles.carsGrid}>
              {cars.map((car, index) => (
                <div key={car.id} className={`${styles.carCard} ${!car.is_active ? styles.carCardInactive : ''}`}>
                  <div className={styles.carImageContainer}>
                    <img src={car.image} alt={`${car.model} ${car.year}`} className={styles.carImage} />

                    <div className={styles.orderOverlay}>
                      <button
                        onClick={() => moveCar(index, 'up')}
                        disabled={index === 0}
                        className={styles.orderOverlayButton}
                      >
                        <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveCar(index, 'down')}
                        disabled={index === cars.length - 1}
                        className={styles.orderOverlayButton}
                      >
                        <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {!car.is_active && (
                      <div className={styles.hiddenBadge}>Hidden</div>
                    )}
                  </div>

                  <div className={styles.carInfo}>
                    <h3 className={styles.carModel}>{car.model}</h3>
                    <p className={styles.carMeta}>{car.year} &bull; {car.origin}</p>

                    <div className={styles.carActions}>
                      <button
                        onClick={() => handleToggleActive(car.id)}
                        disabled={actionLoading}
                        className={`${styles.toggleButton} ${car.is_active ? styles.toggleActive : styles.toggleInactive}`}
                      >
                        {car.is_active ? 'Active' : 'Show'}
                      </button>
                      <button onClick={() => openEditModal(car)} className={styles.actionButton}>
                        <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeleteId(car.id)} className={`${styles.actionButton} ${styles.actionButtonDanger}`}>
                        <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No cars in showcase yet</p>
              <button onClick={openCreateModal} className={styles.emptyAction}>
                Add your first car
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingCar ? 'Edit Car' : 'Add Car'}
        size="md"
        footer={
          <>
            <button onClick={() => setShowModal(false)} disabled={actionLoading} className={styles.modalCancel}>Cancel</button>
            <button onClick={handleSubmit} disabled={actionLoading || !image || !model || !year || !origin} className={styles.modalConfirm}>
              {actionLoading ? 'Saving...' : editingCar ? 'Update' : 'Add'}
            </button>
          </>
        }
      >
        <div className={styles.modalBody}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <Input label="Image URL" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/car-image.jpg" required />

          {image && (
            <div className={styles.imagePreview}>
              <img
                src={image}
                alt="Preview"
                className={styles.imagePreviewImg}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          <Input label="Model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g., Land Cruiser VXR" required />

          <div className={styles.formRow}>
            <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g., 2024" required />
            <Input label="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g., UAE" required />
          </div>

          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className={styles.checkbox} />
            <div>
              <p className={styles.checkboxTitle}>Show on Website</p>
              <p className={styles.checkboxHint}>Display this car in the homepage gallery</p>
            </div>
          </label>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Car"
        message="Are you sure you want to remove this car from the showcase? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
      />
    </>
  );
}
