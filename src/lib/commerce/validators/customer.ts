import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1).max(20),
  country: z.string().default("US"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).default(1),
        unitPrice: z.number().positive(),
      })
    )
    .min(1),
});

export const customerRegisterSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  password: z.string().min(8).max(128),
  orderId: z.string().optional(),
  address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().default("US"),
  }),
});

export const customerEmailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const customerPhoneOtpSchema = z.object({
  phone: z.string().min(10).max(20),
});

export const customerPhoneVerifySchema = z.object({
  phone: z.string().min(10).max(20),
  code: z.string().length(6),
});
