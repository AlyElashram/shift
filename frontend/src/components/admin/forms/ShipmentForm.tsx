import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from './Input';
import { Select } from './Select';
import { Textarea } from './Textarea';
import { FileUpload } from './FileUpload';
import { createShipment, updateShipment } from '../../../api/shipments';
import { uploadFiles } from '../../../api/uploads';
import { getErrorMessage } from '../../../api/client';
import styles from '../../../styles/components/ShipmentForm.module.css';

type ShipmentStatus = {
  id: string;
  name: string;
};

interface ShipmentFormProps {
  shipment?: {
    id: string;
    manufacturer: string;
    model: string;
    vin: string;
    year: number | null;
    color: string | null;
    pictures: string[];
    owner_name: string;
    owner_email: string | null;
    owner_phone: string | null;
    notes: string | null;
    current_status_id: string | null;
  };
  statuses: ShipmentStatus[];
}

export function ShipmentForm({ shipment, statuses }: ShipmentFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pictures, setPictures] = useState<string[]>(shipment?.pictures ?? []);

  const isEditing = !!shipment;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      manufacturer: formData.get('manufacturer') as string,
      model: formData.get('model') as string,
      vin: formData.get('vin') as string,
      year: formData.get('year') ? parseInt(formData.get('year') as string) : null,
      color: (formData.get('color') as string) || null,
      pictures,
      owner_name: formData.get('owner_name') as string,
      owner_email: (formData.get('owner_email') as string) || null,
      owner_phone: (formData.get('owner_phone') as string) || null,
      notes: (formData.get('notes') as string) || null,
      current_status_id: (formData.get('current_status_id') as string) || null,
    };

    try {
      const result = isEditing
        ? await updateShipment(shipment.id, data)
        : await createShipment(data);

      if (isEditing) {
        navigate(`/admin/shipments/${shipment.id}`);
      } else {
        navigate(`/admin/shipments/${result.id}`);
      }
    } catch (err) {
      setErrors({ form: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errors.form && (
        <div className={styles.formError}>{errors.form}</div>
      )}

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Vehicle Information</h3>
        <div className={styles.fieldGrid}>
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
            defaultValue={shipment?.color ?? ''}
            error={errors.color}
          />
          <Select
            name="current_status_id"
            label="Status"
            placeholder="Select status"
            defaultValue={shipment?.current_status_id ?? ''}
            options={statuses.map((s) => ({ value: s.id, label: s.name }))}
          />
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Vehicle Photos</h3>
        <FileUpload
          label="Upload vehicle images"
          accept="image/*"
          multiple
          maxFiles={10}
          value={pictures}
          onChange={setPictures}
          onUpload={uploadFiles}
          helperText="PNG, JPG, GIF up to 10MB each. First image is used as the main photo."
        />
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Owner Information</h3>
        <div className={styles.fieldGrid}>
          <Input
            name="owner_name"
            label="Owner Name"
            placeholder="Full name"
            defaultValue={shipment?.owner_name}
            required
            error={errors.owner_name}
          />
          <Input
            name="owner_email"
            label="Email"
            type="email"
            placeholder="owner@example.com"
            defaultValue={shipment?.owner_email ?? ''}
            error={errors.owner_email}
          />
          <Input
            name="owner_phone"
            label="Phone"
            placeholder="+20 xxx xxx xxxx"
            defaultValue={shipment?.owner_phone ?? ''}
            error={errors.owner_phone}
          />
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Additional Notes</h3>
        <Textarea
          name="notes"
          placeholder="Any additional notes about this shipment..."
          defaultValue={shipment?.notes ?? ''}
          rows={4}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? (
            <span className={styles.loadingContent}>
              <svg className={styles.spinner} viewBox="0 0 24 24">
                <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className={styles.spinnerHead} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEditing ? 'Update Shipment' : 'Create Shipment'
          )}
        </button>
      </div>
    </form>
  );
}
