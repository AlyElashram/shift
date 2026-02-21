import client from './client';

export async function getTracking(trackingId: string) {
  const response = await client.get(`/track/${trackingId}`);
  return response.data;
}
