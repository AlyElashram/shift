// PDF generation utilities using template placeholders
// This module handles placeholder replacement and PDF generation

export interface PlaceholderData {
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  manufacturer: string;
  model: string;
  vin: string;
  year?: number | null;
  color?: string | null;
  trackingUrl: string;
  date: string;
  trackingId: string;
}

// Available placeholders for templates
export const PLACEHOLDERS = {
  "{{ownerName}}": "Owner's full name",
  "{{ownerEmail}}": "Owner's email address",
  "{{ownerPhone}}": "Owner's phone number",
  "{{manufacturer}}": "Vehicle manufacturer (e.g., Toyota)",
  "{{model}}": "Vehicle model (e.g., Land Cruiser)",
  "{{vin}}": "Vehicle Identification Number",
  "{{year}}": "Vehicle year",
  "{{color}}": "Vehicle color",
  "{{trackingUrl}}": "Public tracking page URL",
  "{{date}}": "Current date",
  "{{trackingId}}": "Unique tracking ID",
} as const;

export function replacePlaceholders(template: string, data: PlaceholderData): string {
  let result = template;

  result = result.replace(/\{\{ownerName\}\}/g, data.ownerName);
  result = result.replace(/\{\{ownerEmail\}\}/g, data.ownerEmail || "N/A");
  result = result.replace(/\{\{ownerPhone\}\}/g, data.ownerPhone || "N/A");
  result = result.replace(/\{\{manufacturer\}\}/g, data.manufacturer);
  result = result.replace(/\{\{model\}\}/g, data.model);
  result = result.replace(/\{\{vin\}\}/g, data.vin);
  result = result.replace(/\{\{year\}\}/g, data.year?.toString() || "N/A");
  result = result.replace(/\{\{color\}\}/g, data.color || "N/A");
  result = result.replace(/\{\{trackingUrl\}\}/g, data.trackingUrl);
  result = result.replace(/\{\{date\}\}/g, data.date);
  result = result.replace(/\{\{trackingId\}\}/g, data.trackingId);

  return result;
}

// Default contract template
export const DEFAULT_CONTRACT_TEMPLATE = `
SHIFT BY JOE - VEHICLE IMPORT CONTRACT

Date: {{date}}

VEHICLE INFORMATION
-------------------
Manufacturer: {{manufacturer}}
Model: {{model}}
VIN: {{vin}}
Year: {{year}}
Color: {{color}}

OWNER INFORMATION
-----------------
Name: {{ownerName}}
Email: {{ownerEmail}}
Phone: {{ownerPhone}}

TRACKING INFORMATION
--------------------
Tracking ID: {{trackingId}}
Track your shipment: {{trackingUrl}}

TERMS AND CONDITIONS
--------------------
1. SHIFT By Joe agrees to import the above-mentioned vehicle from the United Arab Emirates to Egypt.
2. The owner agrees to provide all necessary documentation for customs clearance.
3. Transit time is estimated based on shipping schedules and may vary.
4. The owner will receive email updates at each stage of the shipment process.
5. Final delivery will be coordinated with the owner upon arrival in Egypt.

This document serves as confirmation of the import arrangement between SHIFT By Joe and the vehicle owner.

-------------------
SHIFT By Joe
Premium Car Imports
UAE to Egypt
`;

// Default bill template
export const DEFAULT_BILL_TEMPLATE = `
SHIFT BY JOE - INVOICE

Invoice Date: {{date}}

BILL TO
-------
{{ownerName}}
{{ownerEmail}}
{{ownerPhone}}

VEHICLE DETAILS
---------------
{{manufacturer}} {{model}}
VIN: {{vin}}
Year: {{year}}
Color: {{color}}

TRACKING
--------
Tracking ID: {{trackingId}}
Online Tracking: {{trackingUrl}}

SERVICES
--------
Vehicle Import Service from UAE to Egypt

[AMOUNT TO BE FILLED]

-------------------
SHIFT By Joe
Premium Car Imports
UAE to Egypt
`;
