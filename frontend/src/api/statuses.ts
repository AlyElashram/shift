import client from './client';

export async function getStatuses() {
  const response = await client.get('/statuses');
  return response.data;
}

export async function createStatus(data: Record<string, unknown>) {
  const response = await client.post('/statuses', { status: data });
  return response.data;
}

export async function updateStatus(id: string, data: Record<string, unknown>) {
  const response = await client.patch(`/statuses/${id}`, { status: data });
  return response.data;
}

export async function deleteStatus(id: string) {
  const response = await client.delete(`/statuses/${id}`);
  return response.data;
}

export async function reorderStatuses(ids: string[]) {
  const response = await client.patch('/statuses/reorder', { ids });
  return response.data;
}
