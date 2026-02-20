import { z } from "zod";

export const shipmentSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  vin: z.string().min(1, "VIN is required"),
  year: z.coerce.number().min(1900).max(2100).optional().nullable(),
  color: z.string().optional().nullable(),
  pictures: z.array(z.string().url()).default([]),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerEmail: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  ownerPhone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  currentStatusId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
});

export const shipmentUpdateSchema = shipmentSchema.partial();

export const statusUpdateSchema = z.object({
  statusId: z.string().min(1, "Status is required"),
  notes: z.string().optional().nullable(),
});

export type ShipmentInput = z.infer<typeof shipmentSchema>;
export type ShipmentUpdateInput = z.infer<typeof shipmentUpdateSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;

// Status validation
export const shipmentStatusSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  order: z.coerce.number().min(0).default(0),
  isTransit: z.boolean().default(false),
  notifyEmail: z.boolean().default(false),
  color: z.string().optional().nullable(),
});

export type ShipmentStatusInput = z.infer<typeof shipmentStatusSchema>;

// Lead validation
export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  documentStatus: z.enum(["non-egyptian-passport", "uae-eqama", "none"]),
});

export type LeadInput = z.infer<typeof leadSchema>;

// Template validation
export const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CONTRACT", "BILL", "EMAIL"]),
  content: z.string().min(1, "Content is required"),
  isDefault: z.boolean().default(false),
});

export type TemplateInput = z.infer<typeof templateSchema>;

// User validation
export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
});

export const userUpdateSchema = userSchema.partial().omit({ password: true }).extend({
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export type UserInput = z.infer<typeof userSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

// Car Showcase validation
export const carShowcaseSchema = z.object({
  image: z.string().url("Invalid image URL"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  origin: z.string().min(1, "Origin is required"),
  order: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type CarShowcaseInput = z.infer<typeof carShowcaseSchema>;
