import client from './client';

export async function getShipments(params?: { search?: string; status_id?: string; limit?: number }) {
  const response = await client.get('/shipments', { params });
  return response.data;
}

export async function getShipment(id: string) {
  const response = await client.get(`/shipments/${id}`);
  return response.data;
}

export async function createShipment(data: Record<string, unknown>) {
  const response = await client.post('/shipments', { shipment: data });
  return response.data;
}

export async function updateShipment(id: string, data: Record<string, unknown>) {
  const response = await client.patch(`/shipments/${id}`, { shipment: data });
  return response.data;
}

export async function deleteShipment(id: string) {
  const response = await client.delete(`/shipments/${id}`);
  return response.data;
}

export async function updateShipmentStatus(id: string, statusId: string, notes?: string) {
  const response = await client.patch(`/shipments/${id}/update_status`, { status_id: statusId, notes });
  return response.data;
}
