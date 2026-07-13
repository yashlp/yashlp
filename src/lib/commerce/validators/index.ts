import { z } from "zod";
import { APPROVAL_STATUSES, PRODUCT_STATUSES } from "../constants";

export const productCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  sellerId: z.string().min(1),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().min(1),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  mrp: z.number().positive().optional(),
  taxRate: z.number().min(0).max(100).optional(),
  gstRate: z.number().min(0).max(100).optional(),
  stock: z.number().int().min(0).optional(),
  minStock: z.number().int().min(0).optional(),
  maxStock: z.number().int().min(0).optional(),
  materials: z.array(z.string()).optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  warranty: z.string().optional(),
  returnEligible: z.boolean().optional(),
  specifications: z.record(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  mood: z.string().optional(),
  colors: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  approvalStatus: z.enum(APPROVAL_STATUSES).optional(),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isRecommended: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
  // D2C inventory
  purchaseCost: z.number().min(0).optional(),
  warehouseLocation: z.string().optional(),
  supplierId: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
});

export const productUpdateSchema = productCreateSchema.partial().omit({ sellerId: true });

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  parentId: z.string().nullable().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
  isHidden: z.boolean().optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const adminOtpSchema = z.object({
  adminId: z.string().min(1),
  code: z.string().length(6),
});
