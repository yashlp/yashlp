import { prisma } from "@/lib/db";

/** Server-authoritative checkout math — never trust client prices. */
export const DEFAULT_GST_RATE = 0.18;
export const DEFAULT_FREE_SHIPPING_THRESHOLD = 999;
export const DEFAULT_SHIPPING_FEE = 49;

export type PricedLine = {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  name: string;
  stock: number;
};

export function isDemoPaymentAllowed(): boolean {
  // Explicit opt-in only. Never enable silently in production.
  if (process.env.ALLOW_DEMO_PAYMENTS !== "true") return false;
  // Extra guard: if Razorpay is configured, force real payments unless demo is explicitly allowed
  // (ALLOW_DEMO_PAYMENTS already checked above).
  return true;
}

export async function priceCheckoutItems(
  items: { productId: string; quantity: number }[]
): Promise<{
  lines: PricedLine[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}> {
  if (!items.length) throw new Error("Cart is empty");

  const lines: PricedLine[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await prisma.commerceProduct.findUnique({ where: { id: item.productId } });
    if (!product || product.status !== "PUBLISHED") {
      throw new Error("One or more products are unavailable");
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    const unitPrice = Number(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new Error(`Invalid catalog price for ${product.name}`);
    }
    const total = Math.round(unitPrice * item.quantity * 100) / 100;
    subtotal += total;
    lines.push({
      productId: product.id,
      quantity: item.quantity,
      unitPrice,
      total,
      name: product.name,
      stock: product.stock,
    });
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const shipping = subtotal >= DEFAULT_FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
  const tax = Math.round(subtotal * DEFAULT_GST_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return { lines, subtotal, tax, shipping, total };
}
