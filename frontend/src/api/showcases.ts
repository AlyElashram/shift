import client from './client';

export async function getPublicShowcases() {
  const response = await client.get('/public/showcases');
  return response.data;
}

export async function getShowcases() {
  const response = await client.get('/showcases');
  return response.data;
}

export async function createShowcase(data: Record<string, unknown>) {
  const response = await client.post('/showcases', { showcase: data });
  return response.data;
}

export async function updateShowcase(id: string, data: Record<string, unknown>) {
  const response = await client.patch(`/showcases/${id}`, { showcase: data });
  return response.data;
}

export async function deleteShowcase(id: string) {
  const response = await client.delete(`/showcases/${id}`);
  return response.data;
}

export async function toggleShowcaseActive(id: string) {
  const response = await client.patch(`/showcases/${id}/toggle_active`);
  return response.data;
}

export async function reorderShowcases(ids: string[]) {
  const response = await client.patch('/showcases/reorder', { ids });
  return response.data;
}
