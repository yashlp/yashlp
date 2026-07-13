import { prisma } from "@/lib/db";
import { orderService } from "./order.service";

export const returnService = {
  async list(filters?: { status?: string }) {
    return prisma.commerceReturn.findMany({
      where: filters?.status ? { status: filters.status } : undefined,
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            customer: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  },

  async createRequest(input: {
    orderId: string;
    reason: string;
    type?: string;
    condition?: string;
  }) {
    return prisma.commerceReturn.create({
      data: {
        orderId: input.orderId,
        reason: input.reason,
        type: input.type || "REFUND",
        condition: input.condition,
        status: "REQUESTED",
      },
    });
  },

  async approve(id: string, refundAmount: number, adminNotes?: string) {
    const ret = await prisma.commerceReturn.findUniqueOrThrow({
      where: { id },
      include: { order: true },
    });

    await prisma.commerceReturn.update({
      where: { id },
      data: { status: "APPROVED", refundAmount, adminNotes },
    });

    await prisma.commerceRefund.create({
      data: {
        orderId: ret.orderId,
        amount: refundAmount,
        status: "PENDING",
        reason: ret.reason,
        type: ret.type === "REPLACEMENT" ? "PARTIAL" : "FULL",
      },
    });

    await prisma.commerceOrder.update({
      where: { id: ret.orderId },
      data: { status: "RETURNED" },
    });

    await orderService.restock(ret.orderId);
    return this.list();
  },

  async reject(id: string, adminNotes?: string) {
    return prisma.commerceReturn.update({
      where: { id },
      data: { status: "REJECTED", adminNotes },
    });
  },

  async processRefund(refundId: string) {
    const refund = await prisma.commerceRefund.update({
      where: { id: refundId },
      data: { status: "SUCCESS" },
    });
    await prisma.commerceOrder.update({
      where: { id: refund.orderId },
      data: { status: "REFUNDED" },
    });
    return refund;
  },
};
