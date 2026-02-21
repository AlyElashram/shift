import client from './client';

export async function getLeads() {
  const response = await client.get('/leads');
  return response.data;
}

export async function createLead(data: { name: string; email: string; phone: string; document_status: string }) {
  const response = await client.post('/leads', { lead: data });
  return response.data;
}

export async function deleteLead(id: string) {
  const response = await client.delete(`/leads/${id}`);
  return response.data;
}

export async function bulkDeleteLeads(ids: string[]) {
  const response = await client.delete('/leads/bulk_destroy', { data: { ids } });
  return response.data;
}

export async function markLeadContacted(id: string) {
  const response = await client.patch(`/leads/${id}/mark_contacted`);
  return response.data;
}

export async function markLeadUncontacted(id: string) {
  const response = await client.patch(`/leads/${id}/mark_uncontacted`);
  return response.data;
}
