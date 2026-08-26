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
  country: z.string().default("IN"),
  addressId: z.string().optional(),
  saveAddress: z.boolean().optional(),
  setDefaultAddress: z.boolean().optional(),
  addressLabel: z.string().max(40).optional(),
  paymentMethod: z.enum(["cod", "razorpay", "demo"]).default("razorpay"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).default(1),
        /** Ignored — server loads catalog price. Kept optional for older clients. */
        unitPrice: z.number().positive().optional(),
      })
    )
    .min(1),
});

export const customerRegisterSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(10).max(20).optional(),
  password: z.string().min(8).max(128),
  orderId: z.string().optional(),
  address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().default("IN"),
  }),
});

export const customerEmailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const customerAddressSchema = z.object({
  label: z.string().max(40).optional(),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1).max(20),
  country: z.string().default("IN"),
  phone: z.string().min(10).max(20).optional(),
  isDefault: z.boolean().optional(),
});

export const customerPhoneOtpSchema = z.object({
  phone: z.string().min(10).max(20),
});

export const customerPhoneVerifySchema = z.object({
  phone: z.string().min(10).max(20),
  code: z.string().length(6),
});
