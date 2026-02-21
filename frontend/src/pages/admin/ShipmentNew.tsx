import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getStatuses } from '../../api/statuses';
import { ShipmentForm } from '../../components/admin/forms';

export default function ShipmentNew() {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatuses()
      .then(setStatuses)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ color: 'var(--shift-gray)', textAlign: 'center', padding: '4rem 1rem' }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/admin/shipments')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--shift-gray-light)',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          &larr; Back to Shipments
        </button>
      </div>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--shift-cream)',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
      }}>
        New Shipment
      </h1>
      <ShipmentForm statuses={statuses} />
    </div>
  );
}
