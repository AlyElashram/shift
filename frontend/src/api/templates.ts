import client from './client';

export async function getTemplates() {
  const response = await client.get('/templates');
  return response.data;
}

export async function getTemplate(id: string) {
  const response = await client.get(`/templates/${id}`);
  return response.data;
}

export async function createTemplate(data: Record<string, unknown>) {
  const response = await client.post('/templates', { template: data });
  return response.data;
}

export async function updateTemplate(id: string, data: Record<string, unknown>) {
  const response = await client.patch(`/templates/${id}`, { template: data });
  return response.data;
}

export async function deleteTemplate(id: string) {
  const response = await client.delete(`/templates/${id}`);
  return response.data;
}

export async function previewTemplate(content: string) {
  const response = await client.post('/templates/preview', { content });
  return response.data;
}
