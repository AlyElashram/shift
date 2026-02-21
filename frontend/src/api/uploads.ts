import client from './client';

export async function uploadFiles(files: File[]): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await client.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    urls.push(response.data.url);
  }

  return urls;
}
