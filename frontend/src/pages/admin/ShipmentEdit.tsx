import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getShipment } from '../../api/shipments';
import { getStatuses } from '../../api/statuses';
import { ShipmentForm } from '../../components/admin/forms';

export default function ShipmentEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<any>(null);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getShipment(id), getStatuses()])
      .then(([s, st]) => {
        setShipment(s);
        setStatuses(st);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ color: 'var(--shift-gray)', textAlign: 'center', padding: '4rem 1rem' }}>
        Loading shipment...
      </div>
    );
  }

  if (!shipment) {
    return (
      <div style={{ color: 'var(--shift-gray)', textAlign: 'center', padding: '4rem 1rem' }}>
        Shipment not found
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(`/admin/shipments/${id}`)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--shift-gray-light)',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          &larr; Back to Shipment
        </button>
      </div>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--shift-cream)',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
      }}>
        Edit Shipment
      </h1>
      <ShipmentForm shipment={shipment} statuses={statuses} />
    </div>
  );
}
