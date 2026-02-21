import client from './client';

export async function sendStatusUpdateEmail(shipmentId: string) {
  const response = await client.post('/emails/status_update', { shipment_id: shipmentId });
  return response.data;
}

export async function sendThankYouEmail(shipmentId: string) {
  const response = await client.post('/emails/thank_you', { shipment_id: shipmentId });
  return response.data;
}

export async function sendCustomEmail(shipmentId: string, subject: string, htmlContent: string) {
  const response = await client.post('/emails/custom', { shipment_id: shipmentId, subject, html_content: htmlContent });
  return response.data;
}
