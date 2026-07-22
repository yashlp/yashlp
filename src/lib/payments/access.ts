import { prisma } from "@/lib/db";

const PAID = "paid";
const COORD_PRECISION = 4;

export function purchaseLocationKey(lat: number, lng: number): { lat: number; lng: number } {
  return {
    lat: Number(lat.toFixed(COORD_PRECISION)),
    lng: Number(lng.toFixed(COORD_PRECISION)),
  };
}

export async function hasReportPurchase(
  userId: string,
  productId: string,
  lat: number,
  lng: number
): Promise<boolean> {
  const loc = purchaseLocationKey(lat, lng);
  const purchase = await prisma.reportPurchase.findFirst({
    where: {
      userId,
      productId,
      status: PAID,
      latitude: loc.lat,
      longitude: loc.lng,
    },
  });
  return Boolean(purchase);
}

export async function markReportPurchasePaid(input: {
  userId: string;
  productId: string;
  lat: number;
  lng: number;
  placeName?: string | null;
  amount: number;
  currency: string;
  provider: string;
  providerOrderId?: string | null;
  providerPaymentId: string;
}) {
  const now = new Date();

  const byPayment = await prisma.reportPurchase.findFirst({
    where: { providerPaymentId: input.providerPaymentId },
  });
  if (byPayment?.status === PAID) return byPayment;

  // Prefer the pending row created at checkout (trusted product/coords/amount).
  const byOrder =
    input.providerOrderId
      ? await prisma.reportPurchase.findFirst({
          where: {
            providerOrderId: input.providerOrderId,
            userId: input.userId,
            provider: input.provider,
          },
          orderBy: { createdAt: "desc" },
        })
      : null;

  if (byOrder) {
    if (byOrder.status === PAID) return byOrder;
    return prisma.reportPurchase.update({
      where: { id: byOrder.id },
      data: {
        status: PAID,
        paidAt: now,
        providerPaymentId: input.providerPaymentId,
      },
    });
  }

  const loc = purchaseLocationKey(input.lat, input.lng);
  const pending = await prisma.reportPurchase.findFirst({
    where: {
      userId: input.userId,
      productId: input.productId,
      latitude: loc.lat,
      longitude: loc.lng,
      status: "pending",
      provider: input.provider,
    },
    orderBy: { createdAt: "desc" },
  });

  if (pending) {
    return prisma.reportPurchase.update({
      where: { id: pending.id },
      data: {
        status: PAID,
        paidAt: now,
        providerOrderId: input.providerOrderId ?? pending.providerOrderId,
        providerPaymentId: input.providerPaymentId,
      },
    });
  }

  // Do not invent a paid purchase from client-supplied product/coords —
  // checkout must have created a pending row first.
  throw new Error("No matching pending purchase for this payment");
}

export async function createPendingPurchase(input: {
  userId: string;
  productId: string;
  lat: number;
  lng: number;
  placeName?: string | null;
  amount: number;
  currency: string;
  provider: string;
  providerOrderId: string;
}) {
  const loc = purchaseLocationKey(input.lat, input.lng);
  return prisma.reportPurchase.create({
    data: {
      userId: input.userId,
      productId: input.productId,
      latitude: loc.lat,
      longitude: loc.lng,
      placeName: input.placeName ?? null,
      amount: input.amount,
      currency: input.currency,
      provider: input.provider,
      providerOrderId: input.providerOrderId,
      status: "pending",
    },
  });
}
