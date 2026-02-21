import client from './client';

export async function getUsers() {
  const response = await client.get('/users');
  return response.data;
}

export async function createUser(data: Record<string, unknown>) {
  const response = await client.post('/users', { user: data });
  return response.data;
}

export async function updateUser(id: string, data: Record<string, unknown>) {
  const response = await client.patch(`/users/${id}`, { user: data });
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await client.delete(`/users/${id}`);
  return response.data;
}
