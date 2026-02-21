import client from './client';

export async function generateDocument(shipmentId: string, templateId: string) {
  const response = await client.post(
    '/documents/generate',
    { shipment_id: shipmentId, template_id: templateId },
    { responseType: 'blob' }
  );
  return response;
}

export async function sendTemplateEmail(
  shipmentId: string,
  templateId: string,
  attachTemplateIds?: string[]
) {
  const response = await client.post('/documents/send_email', {
    shipment_id: shipmentId,
    template_id: templateId,
    attach_templates: attachTemplateIds,
  });
  return response.data;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
