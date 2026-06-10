import { z } from "zod";

/**
 * Shared Schema for Quote Input Data
 * Validates payloads coming into the /api/v1/quote endpoint and frontend forms.
 */
export const QuoteInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  postcode: z.string().regex(/^\d{4}$/, "Postcode must be exactly 4 digits"),
  suburb: z.string().optional(),
  serviceId: z.string(),
  // Flexible data object for service-specific inputs (rooms, hours, etc.)
  inputData: z.record(z.string(), z.any()).optional(),
  clientName: z.string().optional(), // Fallback for various UI implementations
});

/**
 * Schema for Van Inventory Items
 */
export const InventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  qty: z.number().min(0),
  minQty: z.number().min(0),
  unit: z.string(),
  maxQty: z.number().optional(),
});

export type QuoteInput = z.infer<typeof QuoteInputSchema>;
export type InventoryItem = z.infer<typeof InventoryItemSchema>;
