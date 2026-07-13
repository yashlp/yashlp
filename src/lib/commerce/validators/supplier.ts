import { z } from "zod";
import { PO_PAYMENT_STATUSES, PO_STATUSES, SUPPLIER_STATUSES } from "../constants";

export const supplierSchema = z.object({
  brandName: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  contactPerson: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  bankDetails: z
    .object({
      accountName: z.string().optional(),
      accountNumber: z.string().optional(),
      ifsc: z.string().optional(),
      bankName: z.string().optional(),
    })
    .optional(),
  productCategories: z.array(z.string()).optional(),
  documents: z.array(z.string().url()).optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(SUPPLIER_STATUSES).optional(),
});

export const purchaseOrderLineSchema = z.object({
  productId: z.string().optional(),
  sku: z.string().optional(),
  name: z.string().min(1),
  quantityOrdered: z.number().int().positive(),
  unitCost: z.number().min(0),
});

export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1),
  status: z.enum(PO_STATUSES).optional(),
  paymentStatus: z.enum(PO_PAYMENT_STATUSES).optional(),
  expectedDelivery: z.string().datetime().optional(),
  invoiceNumber: z.string().optional(),
  invoiceUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
  lines: z.array(purchaseOrderLineSchema).min(1),
});
